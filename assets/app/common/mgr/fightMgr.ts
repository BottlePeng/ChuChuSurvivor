import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('fightMgr')
export class fightMgr {
    init(param) {
        param = {...{
            parent1Node: null,
            parent2Node: null,
            effectParent2Node: null,
            shadowParentNode: null,
        }, ...param}
        for (let key in param) this[key] = param[key]

        this.roles = []

        this.halfWidth = app.screen.width / 2
        this.halfHeight = app.screen.height / 2
    }

    createPlayerRole(param) {
        param = {...{
            uid: H.uid(),
            asset: '',
            data: null,
        }, ...param}
        let node = G('pool').get(G('asset').getPrefab(param.asset))
        node.parent = this.parent1Node
        let role = H.add$(node, 'player', true)
        role.shadowNode = H.find('shadow', node)
        if (role.shadowNode) role.shadowNode.parent = this.shadowParentNode
        role.init(param)
        this.roles.push(role)
        return role
    }

    createEnemyRole(param) {
        param = {...{
            uid: H.uid(),
            asset: '',
            data: null,
            type: 1, //1=近战 2=远程 3=移动
            target: null,
            rvo: null,
            layer: 1,
        }, ...param}

        let parentNode = this['parent' + param.layer + 'Node']
        if (!parentNode) parentNode = this.parent1Node

        //let node = H.inst(G('asset').getPrefab(param.asset), parentNode)
        let node = G('pool').get(G('asset').getPrefab(param.asset), parentNode)

        if (param.target) node.setWorldPosition(this.getEnemyWorldPos(param.target))
        let role = H.add$(node, 'enemy', true)
        role.shadowNode = H.find('shadow', node)
        if (role.shadowNode) role.shadowNode.parent = this.shadowParentNode
        role.init(param)
        if (param.rvo) {
            role.speed = role.move.speed
            role.agentId = param.rvo.add(role)
        }

        if (param.target && param.target.group == 'player') {
            if (param.data.bossLevel > 0) {
                let arrowTipNode = G('pool').get(G('asset').getPrefab('roleArrowTip'))
                let arrowTip = H.add$(arrowTipNode, 'roleArrowTip', true)
                arrowTip.node.parent = this.effectParent2Node
                arrowTip.init({
                    self: role,
                    player: param.target,
                })
                arrowTip.hide()
                role.arrowTip = arrowTip
            }
        }
        this.roles.push(role)
        return role
    }

    createEnemyGroupRoles(param) {
        param = {...{
            uid: H.uid(),
            asset: '',
            data: null,
            target: null,
            num: 20,
            layer: 2,
        }, ...param}
        param.type = 3

        let parentNode = this['parent' + param.layer + 'Node']
        if (!parentNode) parentNode = this.parent1Node

        let roles = []

        for (let i = 0; i < param.num; i++) {
            let node = G('pool').get(G('asset').getPrefab(param.asset), parentNode)
            let role = H.add$(node, 'enemy', true)
            role.shadowNode = H.find('shadow', node)
            if (role.shadowNode) role.shadowNode.parent = this.shadowParentNode
            this.roles.push(role)
            roles.push(role)
        }
        let firstEnemy = roles[0]
        if (param.target) firstEnemy.node.setWorldPosition(this.getEnemyWorldPos(param.target))
        firstEnemy.init(param)
        H.forArr(roles, (role, index) => {
            if (index <= 0) return
            param.target = firstEnemy
            role.init(param)
            let x = H.randNum(-150, 150)
            let y = H.randNum(-150, 150)
            role.node.x = firstEnemy.node.x + x
            role.node.y = firstEnemy.node.y + y
        })

        return roles
    }

    removeRole(role) {
        if (!role) return
        if (role.arrowTip) {
            G('pool').put(role.arrowTip.node)
        }
        if (role.skills) {
            H.forArr(role.skills, skill => {
               if (skill.destroy) skill.destroy()
            })
            role.skills = []
        }
        if (role.shadowNode) {
            role.shadowNode.parent = role.node
        }
        this.roles = this.roles.filter(a => a.uid != role.uid)
        //role.node.destroy()
        G('pool').put(role.node)
    }

    getEnemyWorldPos(player) {
        let halfWidth = this.halfWidth + (this.halfWidth * 0.3)
        let halfHeight = this.halfHeight + (this.halfHeight * 0.3)
        let w = halfWidth
        if (halfWidth < halfHeight) w = halfHeight
        let h = w
        let angle = H.randNum(0, 360)
        let x = w * Math.cos(angle)
        let y = h * Math.sin(angle)
        let worldPos = player.node.getWorldPosition()
        return cc.v3(x + worldPos.x, y + worldPos.y)
    }

    getRole(node) {
        let role = $(node, 'player')
        if (!role) role = $(node, 'enemy')
        return role
    }
}


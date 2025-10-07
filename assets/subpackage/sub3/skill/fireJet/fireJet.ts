import { _decorator } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('fireJet')
export class fireJet extends ccBase {
    initData(param) {
        param = {...{
            asset: 'fireJet',
            timeout: 10,
            hurtPercent: 200,
        }, ...param}

        this.remove()

        let node = G('pool').get(G('asset').getPrefab(param.asset))
        node.parent = G('skill').parent2Node
        this.skill = H.add$(node, 'skillBase')
        this.skill.initBase({
            role: this.role,
            hurtPercent: param.hurtPercent,
            skillName: this.skillName,
            contactCd: 0.2,
        })
        this.skill.solveContact = (self, other) => {
            let role = G('fight').getRole(other.node)
            if (!role) return
            if (role.state.lose) return
            if (role.onContact) role.onContact(other, self)
        }

        this.timeout = param.timeout
        this.radius = this.role.node.realSizeW / 2
        this.dir = cc.v3()
        this.isInit = true
    }

    init(role, skillName) {
        this.role = role
        this.skillName = skillName
    }

    remove() {
        if (this.skill) {
            this.skill.node.removeComponent('skillBase')
            G('pool').put(this.skill.node)
            this.skill = null
        }
    }

    update(dt) {
        if (!this.isInit) return
        if (M('fight').stop) return

        this.dir = this.skill.getDefaultDir()

        this.skill.node.angle = H.dirToAngle(this.dir)
        let radian = H.angleToRadian(this.skill.node.angle)

        let byWorldPos = this.role.bodyNode.getWorldPosition()
        let worldPos = cc.v3()
        worldPos.x = byWorldPos.x + this.radius * Math.cos(radian)
        worldPos.y = byWorldPos.y + this.radius * Math.sin(radian)
        this.skill.node.setWorldPosition(worldPos)

        if (this.timeout === false) return
        this.timeout -= dt
        if (this.timeout > 0) return
        this.remove()
        this.node.removeComponent(this)
    }
}


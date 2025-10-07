import { _decorator } from 'cc';
import { roleBase } from './roleBase';
const { ccclass } = _decorator;

@ccclass('enemy')
export class enemy extends roleBase {

    async init(param) {
        param = {...{
            uid: H.uid(),
            group: 'enemy',
            asset: '',
            data: null,
            target: null,
            type: 1, //1=近战 2=远程 3=移动
            rvo: null,
        }, ...param}
        for (let key in param) this[key] = param[key]
        this.data.default = H.clone(param.data)

        this.initBase()

        this.move.speed = 150

        this.stop = false
        this.checkOut = false

        this.isInit = false
        await this.initAnims(this.asset, this.group)
        this.initType3()

        this.isInit = true
    }

    onContact(self, other) {
        if (M('fight').stop) return
        let skill = $(other.node, 'skillBase')
        if (!skill) return
        if (!skill.role) return
        if (this.target) {
            if (app.screen.isOutView(this.target.node, this.node)) {
                return
            }
        }
        skill.role.setHP(this, {skill: skill})
    }

    initType3() {
        if (this.type != 3) return
        this.playState('move')
        this.move.speed = 350
        if (this.target.group == this.group) {
            this.bodyNode.scaleX = this.target.bodyNode.scaleX
            this.move.dir = this.target.move.dir.clone()
            this.target = this.target.target
        } else {
            let byWorldPos = this.node.getWorldPosition()
            let toWorldPos = this.target.node.getWorldPosition()
            this.move.dir = H.posToDir(byWorldPos, toWorldPos)

            if (this.target.node.x > this.node.x) {
                this.bodyNode.scaleX = 1
            }
            if (this.target.node.x < this.node.x) {
                this.bodyNode.scaleX = -1
            }
        }
    }

    updateType1And2(dt) {
        if (!this.target) return
        if (this.target.state.lose) return

        if (this.state.cd.sleep > 0 && this.rvo) {
            this.rvo.stopAgentId(this.agentId)
            return
        }

        if (this.target.node.x > this.node.x) {
            this.bodyNode.scaleX = 1
        }
        if (this.target.node.x < this.node.x) {
            this.bodyNode.scaleX = -1
        }

        if (this.state.cd.stop > 0 && this.rvo) {
            this.rvo.stopAgentId(this.agentId)
            return
        }

        if (this.data.bossLevel <= 0) {
            if (this.checkOut && app.screen.isOutView(this.target.node, this.node)) {
                let worldPos = G('fight').getEnemyWorldPos(this.target)
                this.rvo.setWorldPos(this.uid, worldPos)
                this.checkOut = false
                return
            }
            if (app.screen.isInView(this.target.node, this.node)) {
                this.checkOut = true
            }
        }

        let dist = H.dist(this.node, this.target.node)
        let checkDist = 10
        if (this.type == 2) checkDist = app.screen.width / 2

        if (dist > checkDist) {
            this.move.dir = H.posToDir(this.node.getWorldPosition(), this.target.node.getWorldPosition())
            this.playState('move')
        } else {
            this.move.dir = cc.v3()
            this.rvo.setWorldPos(this.uid, this.node.worldPosition)
            if (this.type == 2) {
                this.playState('idle')
            }
        }

        if (!this.move.dir.equals(cc.Vec3.ZERO)) {
            let speed = this.move.speed * dt
            if (!this.rvo) return
            let worldPos = this.node.getWorldPosition()
            worldPos.x += this.move.dir.x * speed
            worldPos.y += this.move.dir.y * speed
            this.rvo.updateWorldPos(this.uid, worldPos)
        }
    }

    updateType3(dt) {
        if (this.type != 3) return

        if (this.checkOut && app.screen.isOutView(this.target.node, this.node)) {
            this.remove()
            return
        }
        if (app.screen.isInView(this.target.node, this.node)) {
            this.checkOut = true
        }

        if (this.state.cd.sleep > 0) {
            if (this.rvo) this.rvo.stopAgentId(this.agentId)
            return
        }

        if (this.state.cd.stop > 0) {
            if (this.rvo) this.rvo.stopAgentId(this.agentId)
            return
        }

        let speed = this.move.speed * dt
        this.node.x += this.move.dir.x * speed
        this.node.y += this.move.dir.y * speed
    }

    update(dt) {
        if (!this.isInit) return
        if (M('fight').stop) return
        if (this.stop) return
        if (this.state.lose) return

        this.updateMisc(dt)

        if (this.data.bossLevel) {
            if (this.data.HP > 0) {
                this.progressBar.HP.progress = this.data.HP / this.data.default.HP
            } else {
                this.progressBar.node.active = false
            }
        }

        if (this.type == 1 || this.type == 2) {
            if (this.ctrlMove.repel.node || this.ctrlMove.attract.node) {
                this.updateCtrlMove(dt)
            } else {
                this.updateType1And2(dt)
            }
        } else {
            this.updateType3(dt)
        }
    }
}


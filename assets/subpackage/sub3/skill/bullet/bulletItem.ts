import { _decorator } from 'cc';
import { skillBase } from '../skillBase';
const { ccclass } = _decorator;

@ccclass('bulletItem')
export class bulletItem extends skillBase {

    startContact(self, other) {
        if (!this.role) return

        let role = G('fight').getRole(other.node)
        if (!role) return
        if (role.state.lose) return
        if (role.group == this.role.group) return

        if (this.pierce != false) {
            this.pierce -= 1
            if (this.pierce <= 0) this.remove()
        }
    }

    remove() {
        this.dir = null
        G('pool').put(this.node)
        this.onRemove(this)
    }

    onRemove(skill) {}

    init(param) {
        param = {...{
            index: 1,
            speed: 100,
            angle: 15,
            pierce: 1,
            isRandTarget: false,
        }, ...param}
        if (!this.role) return

        this.isBullet = true

        this.isRandTarget = param.isRandTarget

        this.byWorldPos = this.role.bodyNode.getWorldPosition()
        this.node.setWorldPosition(this.byWorldPos)

        this.speed = param.speed
        this.pierce = param.pierce

        let target = this.role.getTarget()
        if (this.isRandTarget) {
            if (this.role.getRandTarget) {
                target = this.role.getRandTarget()
            }
        }
        if (target) {
            let toWorldPos = target.bodyNode.getWorldPosition()
            this.dir = H.posToDir(this.byWorldPos, toWorldPos)
        } else {
            this.dir = this.getDefaultDir()
        }

        if (param.index > 1) {
            let angle = Math.atan2(this.dir.y, this.dir.x) * 180 / Math.PI
            if ((param.index % 2) == 0) {
                angle += param.angle * param.index
            } else {
                angle -= param.angle * (param.index - 1)
            }
            let r = angle * Math.PI / 180
            this.dir.x = Math.cos(r)
            this.dir.y = Math.sin(r)
        }
        this.node.angle = H.dirToAngle(this.dir)
    }

    update(dt) {
        if (!this.role) return
        if (!this.byWorldPos) return
        if (M('fight').stop) return

        let dist = H.dist(this.byWorldPos, this.node.getWorldPosition())
        if (dist > app.screen.width) {
            this.remove()
            return
        }

        if (!this.dir) return
        let speed = this.speed * dt
        this.node.x += this.dir.x * speed
        this.node.y += this.dir.y * speed
    }
}


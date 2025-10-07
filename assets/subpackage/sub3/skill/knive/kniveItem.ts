import { _decorator } from 'cc';
import { skillBase } from '../skillBase';
const { ccclass } = _decorator;

@ccclass('kniveItem')
export class kniveItem extends skillBase {
    init(target, speed) {
        this.target = target
        if (!this.target) {
            this.remove()
            return
        }
        let toWorldPos = this.target.bodyNode.getWorldPosition()
        this.byWorldPos = this.role.bodyNode.getWorldPosition()
        this.node.setWorldPosition(this.byWorldPos)

        this.speed = speed

        this.dir = H.posToDir(this.byWorldPos, toWorldPos)
        this.node.angle = H.dirToAngle(this.dir)

        this.isInit = true
    }

    startContact(self, other) {
        if (!this.role) return
        let skill = $(other.node, 'bulletItem')
        if (!skill) return
        if (!skill.remove) return
        G('effect').create('boom', {by: skill.node})
        skill.remove()
    }

    remove() {
        G('pool').put(this.node)
    }

    update(dt) {
        if (!this.isInit) return

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


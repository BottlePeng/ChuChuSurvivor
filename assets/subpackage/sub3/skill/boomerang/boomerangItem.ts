import { _decorator } from 'cc';
import { skillBase } from '../skillBase';
const { ccclass } = _decorator;

@ccclass('boomerangItem')
export class boomerangItem extends skillBase {
    init(target, speed = 600) {
        this.target = target
        if (!this.target) {
            this.remove()
            return
        }
        this.toWorldPos = this.target.bodyNode.getWorldPosition()

        this.speed = speed

        let byWorldPos = this.role.bodyNode.getWorldPosition()
        this.node.setWorldPosition(byWorldPos)

        this.dir = cc.v3()

        this.hereCd = 0.5

        this.isBack = false
        this.isHere = false
        this.isInit = true
    }

    remove() {
        G('pool').put(this.node)
    }

    update(dt) {
        if (!this.isInit) return
        if (M('fight').stop) return

        let byWorldPos = this.node.getWorldPosition()

        if (this.isHere) {
            this.hereCd -= dt
            if (this.hereCd > 0) {
                let speed = (this.speed / 4) * dt
                this.dir = H.posToDir(byWorldPos, this.toWorldPos)
                this.node.x += this.dir.x * speed
                this.node.y += this.dir.y * speed
            } else {
                this.isBack = true
            }

            if (this.isBack) {
                let toWorldPos = this.role.bodyNode.getWorldPosition()
                let dist = H.dist(byWorldPos, toWorldPos)
                if (dist <= 10) {
                    this.remove()
                    return
                }
                this.dir = H.posToDir(byWorldPos, toWorldPos)
                let speed = (this.role.move.speed * 2) * dt
                this.node.x += this.dir.x * speed
                this.node.y += this.dir.y * speed
            }
            return
        }
        let dist = H.dist(byWorldPos, this.toWorldPos)
        if (dist <= this.target.node.sizeW) {
            this.isHere = true
            this.dir = cc.v3()
            return
        }
        let speed = this.speed * dt
        this.dir = H.posToDir(byWorldPos, this.toWorldPos)
        this.node.x += this.dir.x * speed
        this.node.y += this.dir.y * speed
    }
}


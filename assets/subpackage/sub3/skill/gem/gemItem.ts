import { _decorator } from 'cc';
import { skillBase } from '../skillBase';
const { ccclass } = _decorator;

@ccclass('gemItem')
export class gemItem extends skillBase {
    init(index, speed, timeout) {
        if (!this.role) return
        this.isBullet = true

        this.speed = speed
        this.timeout = timeout

        this.byWorldPos = this.role.bodyNode.getWorldPosition()
        this.node.setWorldPosition(this.byWorldPos)

        let target = this.role.getTarget()
        if (target) {
            let toWorldPos = target.bodyNode.getWorldPosition()
            this.dir = H.posToDir(this.byWorldPos, toWorldPos)
        } else {
            this.dir = this.getDefaultDir()
        }

        if (index > 1) {
            let angle = H.dirToAngle(this.dir)
            if ((index % 2) == 0) {
                angle += 10 * index
            } else {
                angle -= 10 * (index - 1)
            }
            this.dir = H.angleToDir(angle)
        }
        this.node.angle = H.dirToAngle(this.dir)

        this.node.opacity = 255

        this.canReflect = true
        this.isInit = true
    }

    remove() {
        this.colliderExt.collider.enabled = false
        cc.tween(this.node)
        .to(0.5, {opacity: 0})
        .call(() => {
            G('pool').put(this.node)
        })
        .start()
    }

    getReflectDir(curDir) {
        let normalize = cc.v3()
        let checkViewRes = app.screen.checkView(this.role.node, this.node)
        if (checkViewRes.isMaxX) normalize.x = 1
        if (checkViewRes.isMaxY) normalize.y = 1
        normalize = normalize.normalize()
        return curDir.subtract(normalize.multiplyScalar(2 * cc.Vec3.dot(curDir, normalize)))
    }

    update(dt) {
        if (!this.role) return
        if (M('fight').stop) return
        if (!this.isInit) return

        this.timeout -= dt
        if (this.timeout <= 0) {
            if (this.colliderExt.collider.enabled) {
                this.remove()
            }
            return
        }
        if (!this.dir) return

        if (this.canReflect) {
            if (!app.screen.isInView(this.role.node, this.node)) {
                this.dir = this.getReflectDir(this.dir)
            }
        }
        this.canReflect = app.screen.isInView(this.role.node, this.node)

        this.node.angle = H.dirToAngle(this.dir)

        let speed = this.speed * dt
        this.node.x += this.dir.x * speed
        this.node.y += this.dir.y * speed
    }
}


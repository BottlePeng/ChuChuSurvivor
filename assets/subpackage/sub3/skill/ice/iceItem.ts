import { _decorator } from 'cc';
import { skillBase } from '../skillBase';
const { ccclass } = _decorator;

@ccclass('iceItem')
export class iceItem extends skillBase {
    init(target, speed = 800) {
        this.target = target
        if (!this.target) {
            this.remove()
            return
        }
        this.speed = speed

        let toWorldPos = this.target.bodyNode.getWorldPosition()
        this.byWorldPos = this.role.bodyNode.getWorldPosition()
        this.node.setWorldPosition(this.byWorldPos)

        this.dir = H.posToDir(this.byWorldPos, toWorldPos)
        this.node.angle = H.dirToAngle(this.dir)

        this.isInit = true
    }

    initData(param) {
        this.freezeCd = param.freezeCd
        this.freezeScale = param.freezeScale
        this.pierce = param.pierce
    }

    remove() {
        G('pool').put(this.node)
    }

    startContact(self, other) {
        let role = G('fight').getRole(other.node)
        if (!role) return
        if (role.state.lose) return
        if (!this.role) return

        if (!role.bossLevel) {
            role.state.cd.stop = this.freezeCd
            let asset = H.randArr(['freeze', 'freeze2'])
            G('effect').create(asset, {
                timeout: this.freezeCd,
                scale: this.freezeScale,
                parentNode: role.bodyNode,
            })
        }

        if (this.pierce != false) {
            this.pierce -= 1
            if (this.pierce <= 0) this.remove()
        }
    }

    update(dt) {
        if (!this.isInit) return

        if (app.screen.isOutView(this.role.node, this.node)) {
            this.remove()
            return
        }

        if (!this.dir) return
        let speed = this.speed * dt
        this.node.x += this.dir.x * speed
        this.node.y += this.dir.y * speed
    }
}


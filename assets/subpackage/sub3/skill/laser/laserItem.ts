import { _decorator } from 'cc';
import { skillBase } from '../skillBase';
const { ccclass } = _decorator;

@ccclass('laserItem')
export class laserItem extends skillBase {
    init(timeout) {
        this.animNode = this.find('anim')
        this.node.sizeW = 0

        this._byWorldPos = this.role.bodyNode.getWorldPosition()
        this._toWorldPos = G('fight').getEnemyWorldPos(this.role)

        this.dir = H.posToDir(this._byWorldPos, this._toWorldPos)
        this.node.angle = H.dirToAngle(this.dir)

        this.updByWorldPos()
        this.updSize()

        this.timeout = timeout

        this.isInit = true
    }

    solveContact(self, other) {
        let role = G('fight').getRole(other.node)
        if (!role) return
        if (role.state.lose) return
        if (role.onContact) role.onContact(other, self)
    }

    updByWorldPos() {
        let byWorldPos = this.role.bodyNode.getWorldPosition()
        let dir = H.posToDir(byWorldPos, this._toWorldPos)
        this.node.angle = H.dirToAngle(dir)
        let radian = H.angleToRadian(this.node.angle)

        this.byWorldPos = cc.v3()
        this.byWorldPos.x = byWorldPos.x + ((this.role.node.sizeW * 0.5) * Math.cos(radian))
        this.byWorldPos.y = byWorldPos.y + ((this.role.node.sizeH * 0.5) * Math.sin(radian))
        this.node.setWorldPosition(this.byWorldPos)
    }

    updSize() {
        this.animNode.sizeW = this.node.sizeW
        this.colliderExt.collider.size.width = this.node.sizeW
        this.colliderExt.collider.size.height = this.node.sizeH
        this.colliderExt.collider.offset.x = this.node.sizeW / 2
    }

    remove() {
        G('pool').put(this.node)
    }

    update(dt) {
        if (!this.role) return
        if (M('fight').stop) return
        if (!this.isInit) return

        this.updByWorldPos()

        let toWorldPos = cc.v3(this.byWorldPos.x, this.byWorldPos.y)
        if (this.dir) {
            toWorldPos.x += this.dir.x * app.screen.height
            toWorldPos.y += this.dir.y * app.screen.height
            let dist = H.dist(this.byWorldPos, toWorldPos)
            this.node.sizeW = dist
        }

        this.updSize()

        this.timeout -= dt
        if (this.timeout <= 0) this.remove()
    }
}


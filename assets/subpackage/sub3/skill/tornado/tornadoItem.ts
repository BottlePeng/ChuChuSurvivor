import { _decorator } from 'cc';
import { skillBase } from '../skillBase';
const { ccclass } = _decorator;

@ccclass('tornadoItem')
export class tornadoItem extends skillBase {
    init(speed, timeout) {
        this.speed = speed
        this.timeout = timeout
        this.anim = this.find('anim', cc.Animation)
        H.playAnim(this.anim, {name: this.node.name})

        let byWorldPos = this.role.node.getWorldPosition()
        let w = (app.screen.width / 2) * 0.5
        let h = (app.screen.height / 2) * 0.5
        let x = H.randNum(-w, w)
        let y = H.randNum(-h, h)
        this.node.setWorldPosition(cc.v3(byWorldPos.x + x, byWorldPos.y + y))

        this.dir = this.getRandDir()

        this.randCd = 1

        this.canReflect = true

        this.isInit = true
    }

    checkView() {
        return app.screen.checkView(this.role.node, this.node)
    }

    getRandDir() {
        let toWorldPos = G('fight').getEnemyWorldPos(this.role)
        let byWorldPos =  this.role.node.getWorldPosition()
        return H.posToDir(byWorldPos, toWorldPos)
    }

    solveContact(self, other) {
        if (!this.role) return
        let role = G('fight').getRole(other.node)
        if (!role) return
        if (role.state.lose) return
        if (role.attract) role.attract(this.node, 0.2)
    }

    remove() {
        H.playAnim(this.anim, {name: 'remove'}).then(() => {
            G('pool').put(this.node)
        })
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
                this.colliderExt.collider.enabled = false
                this.remove()
            }
            return
        }

        if (this.randCd > 0) {
            this.randCd -= dt
        } else {
            if (H.calProb(20)) this.dir = this.getRandDir()
            this.randCd = 1
        }

        if (this.canReflect) {
            if (!app.screen.isInView(this.role.node, this.node)) {
                this.dir = this.getReflectDir(this.dir)
            }
        }
        this.canReflect = app.screen.isInView(this.role.node, this.node)

        if (!this.dir) return
        let speed = this.speed * dt
        this.node.x += this.dir.x * speed
        this.node.y += this.dir.y * speed
    }
}


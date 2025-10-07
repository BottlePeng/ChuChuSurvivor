import { _decorator } from 'cc';
import { skillBase } from '../skillBase';
const { ccclass } = _decorator;

@ccclass('bombItem')
export class bombItem extends skillBase {
    init(target, speed = 500, boomScale = 1) {
        this.target = target
        if (!this.target) {
            this.remove()
            return
        }
        this.toWorldPos = this.target.bodyNode.getWorldPosition()

        this.boomScale = boomScale

        this.speed = speed

        this.byWorldPos = this.role.bodyNode.getWorldPosition()
        this.node.setWorldPosition(this.byWorldPos)

        this.dir = cc.v3()

        this.isInit = true
    }

    remove() {
        G('pool').put(this.node)
    }

    createBoom(role) {
        let node = G('pool').get(G('asset').getPrefab('boom1'))
        node.parent = G('skill').parent2Node
        node.scaleX = this.boomScale
        node.scaleY = this.boomScale
        if (role) {
            node.setWorldPosition(role.bodyNode.getWorldPosition())
        } else {
            node.setWorldPosition(this.node.getWorldPosition())
        }
        let skill = H.add$(node, 'skillBase', true)
        skill.initBase({
            role: this.role,
            hurtPercent: this.hurtPercent,
            skillName: this.skillName,
        })
        let anim = this.find('anim', cc.Animation, node)

        H.playAnim(anim).then(() => {
            G('pool').put(node)
        })
    }

    startContact(self, other) {
        let role = G('fight').getRole(other.node)
        if (!role) return
        if (role.state.lose) return
        if (!this.role) return
        if (role.group == this.role.group) return

        this.createBoom(role)
        this.remove()
    }

    update(dt) {
        if (!this.isInit) return
        if (M('fight').stop) return

        let dist = H.dist(this.byWorldPos, this.node.getWorldPosition())
        if (dist > app.screen.width / 2) {
            this.createBoom()
            this.remove()
            return
        }

        let speed = this.speed * dt
        this.dir = H.posToDir(this.byWorldPos, this.toWorldPos)
        this.node.angle = Math.atan2(this.dir.y, this.dir.x) * 180 / Math.PI
        this.node.x += this.dir.x * speed
        this.node.y += this.dir.y * speed
    }
}


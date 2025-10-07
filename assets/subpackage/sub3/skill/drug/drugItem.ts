import { _decorator } from 'cc';
import { skillBase } from '../skillBase';
const { ccclass, property } = _decorator;

@ccclass('drugItem')
export class drugItem extends skillBase {
    @property(cc.SpriteFrame)
    spriteFrames = []

    init(param) {
        param = {...{
            timeout: 3,
        }, ...param}

        let sprite = this.find('anim', cc.Sprite)
        if (sprite) sprite.spriteFrame = H.randArr(this.spriteFrames)

        this.timeout = param.timeout

        this.node.zIndex = 9999
    }

    remove() {
        G('pool').put(this.node)
    }

    solveContact(self, other) {
        let role = G('fight').getRole(other.node)
        if (!role) return
        if (role.state.lose) return
        if (role.onContact) role.onContact(other, self)
    }

    update(dt) {
        if (!this.role) return
        if (M('fight').stop) return
        this.timeout -= dt
        if (this.timeout <= 0) {
            this.remove()
        }
    }
}


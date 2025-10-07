import { _decorator } from 'cc';
import { ccBase } from '../ccBase';
const { ccclass, property, menu } = _decorator;

@ccclass('joystickInput')
@menu('base/joystickInput')
export class joystickInput extends ccBase {
    @property(cc.Node)
    stickNode = null

    onEnable() {
        this.maxR = (this.node.sizeW / 2) - (this.stickNode.sizeW / 4) / 2
        this.isUse = false
        this.dir = cc.v3()

        this.node.parent.on('touch-start', this.activeTouch, this)
        this.node.parent.on('touch-end', this.deactiveTouch, this)
        this.node.parent.on('touch-move', this.moveStick, this)

        this.deactiveTouch()
    }

    onDisable() {
        this.node.parent.off('touch-start', this.activeTouch, this)
        this.node.parent.off('touch-end', this.deactiveTouch, this)
        this.node.parent.off('touch-move', this.moveStick, this)
    }

    activeTouch(e) {
        this.isUse = true
        this.node.opacity = 255
        let worldPos = e.getUILocation()
        this.worldPos = cc.v3(worldPos.x, worldPos.y, 0)
        this.node.setWorldPosition(this.worldPos)
        this.stickNode.position = cc.v3()
    }

    deactiveTouch() {
        this.isUse = false
        this.node.opacity = 0
    }

    moveStick(e) {
        if (!this.isUse) return
        let worldPos = e.getUILocation()
        worldPos = cc.v3(worldPos.x, worldPos.y, 0)
        let posDelta = worldPos.subtract(this.worldPos)

        let x = posDelta.x
        let y = posDelta.y

        let length = Math.sqrt(posDelta.x ** 2 + posDelta.y ** 2)
        if (this.maxR < length) {
            let mul = this.maxR / length
            x *= mul
            y *= mul
        }
        this.stickNode.position = cc.v3(x, y, 0)
        this.dir = posDelta.normalize()
    }

    //线性向量(根据触摸的距离影响速度)
    getLerpDir() {
        if (this.isUse) {
            return cc.v3(this.stickNode.x / this.maxR, this.stickNode.y / this.maxR, 0)
        }
        return cc.v3()
    }

    getDir() {
        if (this.isUse) return this.dir.clone()
        return cc.v3()
    }
}


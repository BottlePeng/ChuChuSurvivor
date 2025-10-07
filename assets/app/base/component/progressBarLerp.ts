import { _decorator, Component } from 'cc';
const { ccclass, property, executeInEditMode, menu } = _decorator;

@ccclass('progressBarLerp')
@menu('base/progressBarLerp')
@executeInEditMode
export class progressBarLerp extends Component {
    @property(cc.Node)
    barNode = null
    @property(cc.Node)
    animNode = null

    update(dt) {
        if (!this.barNode) return
        if (!this.animNode) return

        if (this.barNode.sizeW > this.animNode.sizeW) {
            this.animNode.sizeW = this.barNode.sizeW
        } else {
            let speed = dt * 2
            let width = H.lerp(this.animNode.sizeW, this.barNode.sizeW, speed)
            this.animNode.sizeW = width
        }
    }
}


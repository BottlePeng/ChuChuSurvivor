import { _decorator } from 'cc';
import { popup } from '../popup';
const { ccclass } = _decorator;

@ccclass('animMask')
export class animMask extends popup {
    show(type, callFunc) {
        this.touchClose = false

        this.maskNode = this.find('Mask')
        let width = app.screen.width + (app.screen.width * 0.5)
        let height = app.screen.height + (app.screen.height * 0.5)

        let toWidth
        let toHeight
        if (type == 'open') {
            this.maskNode.sizeW = 0
            this.maskNode.sizeH = 0
            toWidth = width
            toHeight = height
        } else {
            this.maskNode.sizeW = width
            this.maskNode.sizeH = height
            toWidth = 0
            toHeight = 0
        }
        cc.Tween.stopAllByTarget(this.maskNode)
        cc.tween(this.maskNode)
        .to(0.5, {sizeW: toWidth, sizeH: toHeight})
        .call(() => {
            if (callFunc) callFunc(this)
        })
        .start()

        return this._show(this)
    }
}


import { _decorator } from 'cc';
import { ccBase } from '../../../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('dropPropTip')
export class dropPropTip extends ccBase {
    init(param) {
        param = {...{
            dropPropNode: null,
            player: null,
            iconNode: null,
        }, ...param}

        this.dropPropNode = param.dropPropNode
        this.player = param.player

        let sprite = $(param.iconNode, cc.Sprite)
        this.find('icon').sprite.color = sprite.color
        this.find('icon', cc.Sprite).spriteFrame = sprite.spriteFrame
    }

    hide() {
        this.node.opacity = 0
    }

    show() {
        this.node.opacity = 255
    }

    update(dt) {
        if (!this.dropPropNode) return
        if (!this.player) return

        if (app.screen.isOutView(this.player.node, this.dropPropNode)) {
            let propWorldPos = this.dropPropNode.getWorldPosition()
            this.node.setWorldPosition(propWorldPos)
            let checkViewRes = app.screen.checkView(this.player.node, this.node)
            if (checkViewRes.isMaxX || checkViewRes.isMaxY) {
                this.node.setWorldPosition(checkViewRes.worldPos)
            }
            this.show()
        } else {
            this.hide()
        }
    }
}


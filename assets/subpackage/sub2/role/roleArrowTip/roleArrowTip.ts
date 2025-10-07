import { _decorator } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('roleArrowTip')
export class roleArrowTip extends ccBase {
    init(param) {
        param = {...{
            self: null,
            player: null,
        }, ...param}
        this.self = param.self
        this.player = param.player

        this.node.scaleX = this.self.node.scaleX
        this.node.scaleY = this.self.node.scaleY
    }

    hide() {
        this.node.opacity = 0
    }

    show() {
        this.node.opacity = 255
    }

    update(dt) {
        if (!this.self) return
        if (!this.player) return

        if (app.screen.isOutView(this.player.node, this.self.node)) {
            let selfWorldPos = this.self.bodyNode.getWorldPosition()
            this.node.setWorldPosition(selfWorldPos)

            let thisWorldPos = this.node.getWorldPosition()
            let playerWorldPos = this.player.bodyNode.getWorldPosition()
            this.node.angle = H.dirToAngle(H.posToDir(playerWorldPos, thisWorldPos))

            let nodeRect = this.node.transform.getBoundingBox()
            let checkViewRes = app.screen.checkView(this.player.node, this.node, {
                left: -nodeRect.width,
                top: -nodeRect.height / 2,
                bottom: -nodeRect.height / 2,
            })
            if (checkViewRes.isMaxX || checkViewRes.isMaxY) {
                this.node.setWorldPosition(checkViewRes.worldPos)
            }
            this.show()
        } else {
            this.hide()
        }
    }
}


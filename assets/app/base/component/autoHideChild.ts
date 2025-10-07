import { _decorator, ccenum } from 'cc';
import { ccBase } from './ccBase';
const { ccclass, property, type, menu } = _decorator;

enum StartAxis {
    HORIZONTAL = 1,
    VERTICAL = 2,
}
ccenum(StartAxis)

@ccclass('autoHideChild')
@menu('base/autoHideChild')
export class autoHideChild extends ccBase {
    @property(cc.Node)
    parentNode = null

    @type(StartAxis)
    startAxis = 2

    update() {
        if (!this.parentNode) return
        if (this.node.children.length < 1) return
        H.forArr(this.node.children, node => {
            let pos = H.toAR(node, this.parentNode)
            let posKey = 'y'
            let sizeKey = 'sizeH'
            if (this.startAxis == StartAxis.HORIZONTAL) {
                posKey = 'x'
                sizeKey = 'sizeW'
            }
            let diffVal = Math.abs(pos[posKey])
            let hideVal = (this.parentNode[sizeKey] / 2) + (node[sizeKey] / 2)
            if (diffVal > hideVal) {
                node.opacity = 0
            } else {
                let halfHideVal = this.parentNode[sizeKey] / 2
                if (diffVal > halfHideVal) {
                    node.opacity = 100
                } else {
                    node.opacity = 255
                }
            }
        })
    }
}
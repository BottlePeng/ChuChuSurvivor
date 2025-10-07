import { _decorator } from 'cc';
import { popup } from '../popup';
const { ccclass } = _decorator;

@ccclass('skillInfo')
export class skillInfo extends popup {
    show(asset) {
        this.itemNode = this.find('item')
        this.itemNode.active = false

        let langDes = L('skillInfo.' + asset + '.des')
        let arr = langDes.split('\n')
        let des = arr[0]
        let attrs = []
        if (arr[1]) attrs = arr[1].split(',')
        this.itemNode.parent.active = attrs.length > 0

        this.find('desLabel', cc.Label).string = des

        H.forArr(attrs, str => {
            let item = {}
            item.node = H.inst(this.itemNode)
            item.node.parent = this.itemNode.parent
            item.label = this.find('Label', cc.Label, item.node)
            item.label.string = str
        })

        return this._show(this)
    }
}


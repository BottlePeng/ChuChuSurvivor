import { _decorator } from 'cc';
import { popup } from '../popup';
const { ccclass } = _decorator;

@ccclass('addEquip')
export class addEquip extends popup {
    start() {
        this.touchClose = false
        this.addBtnEvents()
    }

    show(newEquipData) {
        this.data = newEquipData
        this.upd(newEquipData)
        return this._show(this)
    }

    upd(newEquipData) {
        this.currentData = M('data').equips.find(a => a.type == newEquipData.type && a.pos == newEquipData.pos)

        this.newEquip = this.find('newEquipInfoItem', 'equipInfoItem')
        this.newEquip.upd(newEquipData, this.currentData)

        this.currentEquip = this.find('currentEquipInfoItem', 'equipInfoItem')
        if (this.currentData) {
            this.currentEquip.node.active = true
            this.currentEquip.upd(this.currentData, newEquipData)
            this.find('noEquipLabel').active = false
        } else {
            this.currentEquip.node.active = false
            this.find('noEquipLabel').active = true
        }
    }

    equipBtnEvent() {
        G('audio').playEffect('equip')
        M('equip').add(this.data)
        this.data = this.currentData
        if (this.data) {
            this.upd(this.data)
        } else {
            this.remove()
        }
    }

    sellBtnEvent() {
        G('audio').playEffect('coin')
        let sellRes = M('equip').calSell(this.data)
        for (let key in sellRes) {
            if (key == 'gold') {
                M('prop').setNum('gold', '+', sellRes[key])
                G('tip').success('+' + H.numAbbr(sellRes[key]), {spriteFrame: R('global').getMiscSpriteFrame('gold')})
            }
        }
        this.remove()
    }
}


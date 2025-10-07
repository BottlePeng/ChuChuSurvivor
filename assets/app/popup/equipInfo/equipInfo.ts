import { _decorator } from 'cc';
import { popup } from '../popup';
const { ccclass } = _decorator;

@ccclass('equipInfo')
export class equipInfo extends popup {
    show(equipData) {
        this.addBtnEvents()
        this.data = equipData
        this.equipInfoItem = this.find('equipInfoItem', 'equipInfoItem')
        this.upLevelBtn = this.find('upLevelBtn', cc.Button)
        this.upLevelBtn.goldLabel = this.find('gold/Label', cc.Label)

        this.upd(this.data)
        return this._show(this)
    }

    upd(data) {
        this.data = M('equip').getData(data.uid)
        this.equipInfoItem.upd(this.data, false)

        let calRes = M('equip').calUpLevel(this.data, 1)
        if (this.data.level >= M('data').fight.level) {
            this.upLevelBtn.interactable = false
            this.upLevelBtn.goldLabel.color = cc.color('#FFFFFF')
            this.upLevelBtn.goldLabel.string = 'MAX'
        } else {
            if (H.isEmpty(calRes.error)) {
                this.upLevelBtn.interactable = true
                this.upLevelBtn.goldLabel.color = cc.color('#FFFFFF')
            } else {
                this.upLevelBtn.interactable = false
                this.upLevelBtn.goldLabel.color = cc.color('#FF0000')
            }
            this.upLevelBtn.goldLabel.string = H.numAbbr(calRes.gold)
        }
    }

    upLevelBtnEvent() {
        let calRes = M('equip').upLevel(this.data, 1)
        if (!H.isEmpty(calRes.error)) {
            for (let key in calRes.error) {
                G('tip').error(calRes.error[key], {spriteFrame: R('global').getMiscSpriteFrame(key)})
            }
            return
        }
        this.data = M('equip').getData(this.data.uid)
        this.upd(this.data)
        G('tip').success(L('success_upLevel'))
        G('audio').playEffect('upLevel')
    }
}


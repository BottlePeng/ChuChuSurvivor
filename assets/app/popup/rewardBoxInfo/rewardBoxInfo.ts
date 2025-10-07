import { _decorator } from 'cc';
import { popup } from '../popup';
const { ccclass } = _decorator;

@ccclass('rewardBoxInfo')
export class rewardBoxInfo extends popup {
    show() {
        this.addBtnEvents()

        this.btn = this.find('btn', cc.Button)
        this.stop = false

        this.initItems()
        this.upd()

        return this._show(this)
    }

    initItems() {
        if (this.items) {
            H.forArr(this.items, a => {
                G('pool').put(a.node, true)
            })
        }
        this.items = []
        let reward = M('game').getBoxReward()
        for (let key in reward.prop) {
            let item = G('pool').get(G('asset').getPrefab('propItem'), 'propItem', this.find('rewardParent'))
            item.updProp(key, reward.prop[key])
            this.items.push(item)
        }

        reward.chips.forEach(chip => {
            let item = G('pool').get(G('asset').getPrefab('propItem'), 'propItem', this.find('rewardParent'))
            item.updChip(chip)
            this.items.push(item)
        })
    }

    upd() {
        if (this.stop) return
        let reward = M('game').getBoxReward()
        let time = M('data').timeCount.adBox
        let cd = reward.cd
        if (time > cd) {
            this.btn.interactable = true
        } else {
            this.btn.interactable = false
        }
    }

    btnEvent(node) {
        let btn = $(node, cc.Button)
        if (!btn.interactable) {
            G('tip').error(L('error_cd'))
            return
        }
        btn.interactable = false
        this.stop = true
        G('tip').loading()
        const end = () => {
            this.stop = false
            G('tip').closeLoading()
        }

        const setReward = () => {
            end()
            let reward = M('game').getBoxReward(true)
            M('game').setReward(reward)
            M('data').timeCount.adBox = 0
            G('tip').reward(reward)
            this.remove()
        }

        G('ad').showRewardedVideo(() => {
            setReward()
        }, err => {
            if (err) G('tip').error(err)
            end()
        })
    }
}


import { _decorator, EditBox } from 'cc';
import { popup } from '../popup';
const { ccclass, property } = _decorator;

@ccclass('inputSid')
export class inputSid extends popup {
    show() {
        this.addBtnEvents()
        this.editBox = this.find('EditBox', EditBox)
        this.initItems()
        return this._show(this)
    }

    initItems() {
        let reward = M('game').getSidReward()
        for (let key in reward.prop) {
            let item = G('pool').get(G('asset').getPrefab('propItem'), 'propItem', this.find('rewardParent'))
            item.updProp(key, reward.prop[key])
        }
        reward.chips.forEach(chip => {
            let item = G('pool').get(G('asset').getPrefab('propItem'), 'propItem', this.find('rewardParent'))
            item.updChip(chip)
        })
    }

    sendBtnEvent(node) {
        if (M('data').player.isGuest) {
            G('tip').error(L('error_guest'))
            return
        }

        let friendSid = H.trim(this.editBox.string)
        if (M('data').player.childSids.length >= 100) {
            G('tip').error(L('error_sid_max'))
            return
        }
        if (M('data').player.childSids.includes(friendSid)) {
            G('tip').error(L('error_sid_self'))
            return
        }

        if (friendSid.length < 2 || friendSid.length >= 50) {
            G('tip').error(L('error_length', {length: '2-50'}))
            return
        }
        if (friendSid == M('data').player.sid) {
            G('tip').error(L('error_sid_friendSid'))
            return
        }

        let btn = $(node, cc.Button)
        if (!btn.interactable) return
        btn.interactable = false

        G('tip').loading()
        R('server').api('setSid', {
            sid: M('data').player.sid,
            friendSid: friendSid
        }).then(res => {
            btn.interactable = true
            G('tip').closeLoading()
            if (res.error) {
                G('tip').error(res.error)
                return
            }
            this.editBox.string = ''
            M('data').player.childSids.push(friendSid)
            let reward = M('game').getSidReward(true)
            M('game').setReward(reward)
            G('tip').reward(reward)
        }).catch(err => {
            btn.interactable = true
            G('tip').closeLoading()
            G('tip').error(err)
        })
    }
}


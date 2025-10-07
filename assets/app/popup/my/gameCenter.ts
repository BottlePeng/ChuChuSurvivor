import { _decorator } from 'cc';
import { ccBase } from '../../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('gameCenter')
export class gameCenter extends ccBase {
    onLoad() {
        if (H.isIos()) {
            this.node.active = true
            if (M('data').player.isGuest) {
                this.node.active = false
                return
            }
        } else {
            this.node.active = false
            return
        }
        this.addBtnEvents()
        this.btn = this.find('btn', cc.Button)
        this.setBtn = this.find('setBtn', cc.Button)

        this.checkmarkNode = this.find('checkmark', this.setBtn.node)
        this.checkmarkNode.active = false

        this.updBtns()
    }

    updBtn() {
        this.btn.interactable = R('apple').gameCenter.isAuthenticated()
    }

    btnEvent() {
        if (R('apple').gameCenter.isAuthenticated()) {
            R('apple').gameCenter.showList({
                listId: 'MBRO_level',
                type: 'all'
            })
            return
        }
        V('confirm').show(L('gameCenterSignTip'), bool => {
            if (bool) {
                R('native').openSetting('GAMECENTER')
            }
        })
    }

    updSetBtn() {
        if (R('apple').gameCenter.isAuthenticated()) {
            this.setBtn.interactable = true
            this.checkmarkNode.active = M('data').setting.gameCenter
        } else {
            this.setBtn.interactable = false
            this.checkmarkNode.active = false
        }
    }

    setBtnEvent() {
        if (!this.setBtn.interactable) return
        M('data').setting.gameCenter = !M('data').setting.gameCenter
        this.updSetBtn()
    }

    updBtns() {
        this.updBtn()
        this.updSetBtn()
    }

    onEnable() {
        E.on(R('apple').gameCenter.eventType.SIGN, this.updBtns, this)
        E.on(R('apple').gameCenter.eventType.ERROR, this.updBtns, this)
    }

    onDisable() {
        E.off(R('apple').gameCenter.eventType.SIGN, this.updBtns, this)
        E.off(R('apple').gameCenter.eventType.ERROR, this.updBtns, this)
    }
}


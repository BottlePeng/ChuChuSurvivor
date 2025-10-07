import { _decorator, EditBox } from 'cc';
import { popup } from '../popup';
const { ccclass } = _decorator;

@ccclass('reportToAdmin')
export class reportToAdmin extends popup {
    show() {
        this.addBtnEvents()

        this.editBox = this.find('EditBox', EditBox)

        return this._show(this)
    }

    sendBtnEvent(node) {
        let btn = $(node, cc.Button)
        if (!btn.interactable) return
        let content = H.trim(this.editBox.string)
        if (!content || content.length < 2 || content.length > 200) {
            G('tip').error(L('error_length', {length: '2-200'}))
            return
        }
        btn.interactable = false
        G('tip').loading()
        let data = {}
        data.content = content
        data.player = {}
        data.player.api = M('data').player.api
        if (!M('data').player.isGuest) {
            data.player.account = M('data').player.account
        }
        R('server').api('reportToAdmin', data).then(res => {
            G('tip').closeLoading()
            if (res.error) {
                btn.interactable = true
                G('tip').error(res.error)
                return
            }
            G('tip').success(L('success_action'))
        }).catch(err => {
            btn.interactable = true
            G('tip').closeLoading()
            G('tip').error(err)
        })
    }

    qqCopyBtnEvent() {
        R('platform').copyText('375776626')
        G('tip').success(L('success_action'))
    }

    emailCopyBtnEvent() {
        R('platform').copyText('yanshanteng@qq.com')
        G('tip').success(L('success_action'))
    }
}


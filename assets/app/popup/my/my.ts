import { _decorator } from 'cc';
import { popup } from '../popup';
const { ccclass } = _decorator;

@ccclass('my')
export class my extends popup {
    show() {
        this.addBtnEvents()

        this.versionLabel = this.find('versionLabel', cc.Label)
        this.versionLabel.string = H.versionFormat(app.config.version)
        if (app.config.bundle.version) {
            this.versionLabel.string += '_' + app.config.bundle.version
        }

        this.playDayLabel = this.find('playDayLabel', cc.Label)
        this.playDayLabel.string = L('playDayTip', {day: M('data').getPlayDay()})

        let defData = M('data').getDefData()
        this.uploadDataCd = defData.timeCount.uploadData
        this.uploadStop = false

        this.uploadBtn = this.find('uploadBtn', cc.Button)
        this.uploadBtn.node.active = !M('data').player.isGuest
        this.uploadBtn.label = this.find('Label', cc.Label, this.uploadBtn.node)
        this.uploadBtn.timeLabel = this.find('timeLabel', cc.Label, this.uploadBtn.node)

        this.exitBtn = this.find('exitBtn', cc.Button)
        this.delBtn = this.find('delBtn', cc.Button)

        this.find('sid').active = !M('data').player.isGuest
        this.find('sid/layout/Label', cc.Label).string = M('data').player.sid

        this.updDataBtn()

        this.addEvent('app.runTime', this.updDataBtn)

        return this._show(this)
    }

    updDataBtn() {
        if (!this.uploadStop) {
            if (M('data').timeCount.uploadData >= this.uploadDataCd) {
                this.uploadBtn.interactable = true
                this.uploadBtn.label.string = L('uploadData')
            } else {
                this.uploadBtn.interactable = false
                let second =  this.uploadDataCd - M('data').timeCount.uploadData
                this.uploadBtn.label.string = H.secondFormat(second, '{hh}:{mm}:{ss}')
            }

            if (H.num(M('data').player.uploadTime) < 1) {
                this.uploadBtn.timeLabel.string = L('never')
            } else {
                this.uploadBtn.timeLabel.string = H.date('Y-m-d H:i:s', M('data').player.uploadTime)
            }
        }
    }

    uploadBtnEvent(node) {
        if (M('data').player.isGuest) {
            G('tip').error(L('error_guest'))
            return
        }
        let btn = $(node, cc.Button)
        if (!btn.interactable) {
            G('tip').error(L('error_cd'))
            return
        }
        btn.interactable = false
        this.uploadStop = true
        G('tip').loading()
        R('server').api('uploadData', M('data').getSaveData())
        .then(res => {
            G('tip').closeLoading()
            this.uploadStop = false
            this.updDataBtn()
            if (res.error) {
                G('tip').error(res.error)
                return
            }
            M('data').timeCount.uploadData = 0
            M('data').player.uploadTime = res.time
            M('data').player.dataTime = res.time
            M('data').save()
            this.updDataBtn()
            G('tip').success(L('success_uploadData'))
        }).catch(err => {
            btn.interactable = true
            G('tip').closeLoading()
            G('tip').error(err)
        })
    }

    exitBtnEvent() {
        G('tip').confirm(L('exitGame') + '?', bool => {
            if (!bool) return
            M('data').save()
            S('login', null)
            this.backLogin()
        })
    }

    delBtnEvent(node) {
        G('tip').confirm(L('deleteDataTip'), bool => {
            if (!bool) return
            if (M('data').player.isGuest) {
                S('login', null)
                M('data').delData()
                this.backLogin()
                return
            }
            let btn = $(node, cc.Button)
            if (!btn.interactable) return
            btn.interactable = false
            G('tip').loading()
            R('server').api('delData', {
                account: M('data').player.account
            }).then(() => {
                G('tip').closeLoading()
                btn.interactable = true
                S('login', null)
                M('data').delData()
                this.backLogin()
            }).catch(err => {
                G('tip').closeLoading()
                G('tip').error(err)
            })
        })
    }

    backLogin() {
        G('audio').stopMusic()
        V('login').show(loginData => {
            M('data').init(loginData)
            V('page').show()
            V('login').remove()
        })
        this.remove()
        V('page').remove()
    }

    privacyDocBtnEvent() {
        V('agreement').show('privacy')
    }

    userDocBtnEvent() {
        V('agreement').show('user')
    }

    copyBtnEvent() {
        R('platform').copyText(M('data').player.sid)
        G('tip').success(L('success_action'))
    }

    sidBtnEvent() {
        V('inputSid').show()
    }

    reportToAdminBtnEvent() {
        V('reportToAdmin').show()
    }
}


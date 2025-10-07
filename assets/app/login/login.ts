import { _decorator } from 'cc';
import { ccBase } from '../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('login')
export class login extends ccBase {
    show(callFunc) {
        this.callFunc = (data) => {
            callFunc(data)
            this.remove()
        }
        this.addBtnEvents()

        this.guestBtn = this.find('guestBtn', cc.Button)
        this.guestBtn.node.active = true

        this.taptapBtn = this.find('taptapBtn', cc.Button)
        this.taptapBtn.node.active = H.isNative() || H.isDev()

        this.appleBtn = this.find('appleBtn', cc.Button)
        this.appleBtn.node.active = H.isIos() || H.isDev()

        this.qqBtn = this.find('qqBtn', cc.Button)
        this.qqBtn.node.active = H.isNative() || H.isDev()

        if (H.isBrowser() && !H.isDev()) {
            this.taptapBtn.node.active = false
            this.appleBtn.node.active = false
            this.qqBtn.node.active = false
        }

        this.parentNode = this.find('parent')
        this.parentNode.active = false

        if (H.isIos()) {
            if (!S('adRequestTrackingAuthorizationTip')) {
                G('tip').text(L('adRequestTrackingAuthorizationTip'), {align: 'left', touchClose: true}, () => {
                    R('apple').requestTrackingAuthorization()
                    this.init()
                    S('adRequestTrackingAuthorizationTip', true)
                })
            } else {
                R('apple').requestTrackingAuthorization()
                this.init()
            }
        } else {
            this.init()
        }

        return this._show(this)
    }

    init() {
        if (H.isEmpty(S('login'))) {
            if (H.isBrowser() || H.isMini()) {
                this.parentNode.active = true
                return
            }
            this.initSdk()
            this.parentNode.active = true
            // if (H.isIos()) {
            //     this.initSdk()
            //     this.parentNode.active = true
            // } else {
            //     V('agreement').show('privacy', bool => {
            //         V('agreement').remove()
            //         if (bool) {
            //             this.initSdk()
            //             this.parentNode.active = true
            //             return
            //         }
            //         G('tip').confirm(L('exitGame') + '?', bool => {
            //             if (bool) {
            //                 H.exitGame()
            //                 return
            //             }
            //             this.init()
            //         })
            //     })
            // }
            return
        }
        this.requestLogin(S('login'))
    }

    initSdk() {
        // R('taptap').init('')
        // R('qq').init('')
    }

    qqBtnEvent() {
        if (!H.isNative()) {
            this.login({
                account: 'qq',
                api: 'qq'
            })
            return
        }
        R('qq').login.onSign = res => {
            if (!res) {
                this.error('res Error')
                return
            }
            if (!res.openid) {
                this.error('openid Error')
                return
            }
            this.login({
                account: res.openid,
                api: 'qq'
            })
        }
        R('qq').login.onClose = err => {
            if (err) this.error(err)
        }
        R('qq').login.sign()
    }

    appleBtnEvent(node) {
        if (!H.isNative()) {
            this.login({
                account: 'apple',
                api: 'apple'
            })
            return
        }
        let btn = $(node, cc.Button)
        if (!btn.interactable) return
        btn.interactable = false
        G('tip').loading()

        R('apple').login.onSign = (res) => {
            btn.interactable = true
            G('tip').closeLoading()
            if (!res) {
                this.error('res Error')
                return
            }
            if (!res.user) {
                this.error('user Error')
                return
            }
            this.login({
                account: res.user,
                api: 'apple'
            })
        }
        R('apple').login.onClose = () => {
            btn.interactable = true
            G('tip').closeLoading()
        }
        R('apple').login.onError = () => {
            btn.interactable = true
            G('tip').closeLoading()
            this.error(L('error_action'))
        }
        R('apple').login.sign()
    }

    taptapBtnEvent() {
        if (!H.isNative()) {
            this.login({
                account: 'taptap',
                api: 'taptap'
            })
            return
        }
        R('taptap').login.onSign = res => {
            if (!res) {
                this.error('res Error')
                return
            }
            if (!res.openid) {
                this.error('openid Error')
                return
            }
            this.login({
                account: res.openid,
                api: 'taptap'
            })
        }
        R('taptap').login.onError = err => {
            if (err) {
                this.error(err)
                return
            }
            this.error(L('error_action'))
        }
        R('taptap').login.sign()
    }

    guestBtnEvent() {
        if (H.isBrowser() || H.isMini()) {
            this.login({
                account: H.uid(), //用于游客防沉迷
                isGuest: true,
            })
            return
        }
        G('tip').confirm(L('guestLoginTips'), bool => {
            if (bool) {
                this.login({
                    account: H.uid(), //用于游客防沉迷
                    isGuest: true,
                })
            }
        })
    }

    login(param) {
        param = {...{
            account: '',
            api: '',
            isGuest: false,
        }, ...param}
        S('login', param)

        this.requestLogin(param)

        // if (!H.isNative()) {
        //     this.requestLogin(param)
        //     return
        // }
        // if (H.isIos()) {
        //     this.requestLogin(param)
        //     return
        // }
        // G('tip').loading()
        // R('taptap').anti.show({
        //     userIdentifier: param.account,
        //     isTapUser: param.api === 'taptap',
        // })
        // R('taptap').anti.onSuccess = () => {
        //     G('tip').closeLoading()
        //     G('tip').success('已通过防沉迷认证')
        //     this.requestLogin(param)
        // }
        // R('taptap').anti.onClose = (res) => {
        //     G('tip').closeLoading()
        //     S('login', null)
        //     let tipStr = res.error || '根据法律法规实名制后开始游戏'
        //     let tip = G('tip').text(tipStr)
        //     tip.node.once('touch-end', e => {
        //         this.parentNode.active = true
        //         tip.close()
        //     })
        // }
    }

    requestLogin(param) {
        param = {...{
            account: '',
            api: '',
            isGuest: false,
        }, ...param}

        if (param.isGuest || !H.isNative()) {
            if (this.callFunc) this.callFunc(param)
            return
        }

        let dataCache = M('data').getCache(param.account)
        let dataTime = dataCache ? H.num(dataCache.player.dataTime) : 0

        G('tip').loading()

        R('server').api('apiLogin', {
            account: param.account,
            dataTime: dataTime
        }).then(res => {
            G('tip').closeLoading()
            if (res.player) {
                M('data').setCache(res)
            } else {
                if (dataCache) {
                    dataCache.player.loginTime = res.loginTime
                    dataCache.player.ipArea = res.ipArea
                    M('data').setCache(dataCache)
                }
            }
            if (this.callFunc) this.callFunc(param)
        })
        .catch(err => {
            this.parentNode.active = true
            G('tip').closeLoading()
            this.error(err)
        })
    }

    userDocBtnEvent() {
        V('agreement').show('user')
    }

    privacyDocBtnEvent() {
        V('agreement').show('privacy')
    }

    error(str) {
        return G('tip').text(str, {touchClose: true, color: '#FF0000'})
    }
}


import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { platform } from './platform'

if (typeof platformEvent == 'undefined') {
    globalThis.platformEvent = {}
}
platformEvent.taptap = {}
platformEvent.taptap.login = {}
platformEvent.taptap.anti = {}

@ccclass('taptap')
export class taptap extends platform {

    init(clientID) {
        if (H.isIos()) {
            this.call('TapTap', 'init', clientID)
        }
        if (H.isAndroid()) {
            this.call('TapTap', 'init', '(Ljava/lang/String;)V', clientID)
        }
    }

    login = {
        sign: () => {
            platformEvent.taptap.login.onSign = (...args) => {
                setTimeout(() => {
                    this.login.onSign(...args)
                }, 1000)
            }
            platformEvent.taptap.login.onClose = (...args) => {
                this.login.onClose(...args)
            }
            if (H.isIos()) {
                this.call('TapTap', 'login')
            }
            if (H.isAndroid()) {
                this.call('TapTap', 'login', '()V')
            }
        },
        out: () => {
            if (H.isIos()) {
                this.call('TapTap', 'logout')
            }
            if (H.isAndroid()) {
                this.call('TapTap', 'logout', '()V')
            }
        },
        onSign: (...args) => {},
        onClose: (...args) => {},
    }

    anti = {
        show: (param) => {
            param = {...{
                userIdentifier: '',
                isTapUser: false,
            }, ...param}
            platformEvent.taptap.anti.onSuccess = (...args) => {
                this.anti.onSuccess(...args)
            }
            platformEvent.taptap.anti.onClose = (...args) => {
                this.anti.onClose(...args)
            }
            if (H.isIos()) {
                this.call('TapTap', 'showAnti', JSON.stringify(param))
            }
            if (H.isAndroid()) {
                this.call('TapTap', 'showAnti', '(Ljava/lang/String;)V', JSON.stringify(param))
            }
        },
        onSuccess: (...args) => {},
        onClose: (...args) => {},
        exit: () => {
            if (H.isIos()) {
                this.call('TapTap', 'exitAnti')
            }
            if (H.isAndroid()) {
                this.call('TapTap', 'exitAnti', '()V')
            }
        },
        //获取年龄段
        getAgeRange: () => {
            if (H.isIos()) {
                return this.call('TapTap', 'getAntiAgeRange')
            }
            if (H.isAndroid()) {
                return this.call('TapTap', 'getAntiAgeRange', '()I')
            }
        },
        //获取剩余时长(秒)
        getRemainingTime: () => {
            if (H.isIos()) {
                return this.call('TapTap', 'getAntiRemainingTime')
            }
            if (H.isAndroid()) {
                return this.call('TapTap', 'getAntiRemainingTime', '()I')
            }
        },
        //上报时长(开始时调用)
        enterGame: () => {
            if (H.isIos()) {
                return this.call('TapTap', 'antiEnterGame')
            }
            if (H.isAndroid()) {
                return this.call('TapTap', 'antiEnterGame', '()V')
            }
        },
        //结束上报
        leaveGame: () => {
            if (H.isIos()) {
                return this.call('TapTap', 'antiLeaveGame')
            }
            if (H.isAndroid()) {
                return this.call('TapTap', 'antiLeaveGame', '()V')
            }
        },
    }
}


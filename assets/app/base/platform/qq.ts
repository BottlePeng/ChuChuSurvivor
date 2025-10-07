import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { platform } from './platform'

if (typeof platformEvent == 'undefined') {
    globalThis.platformEvent = {}
}
platformEvent.qq = {}
platformEvent.qq.login = {}

@ccclass('qq')
export class qq extends platform {
    init(appId) {
        if (H.isIos()) {
            this.call('QQ', 'init', appId)
        }
        if (H.isAndroid()) {
            this.call('QQ', 'init', '(Ljava/lang/String;)V', appId)
        }
    }

    login = {
        sign: () => {
            platformEvent.qq.login.onSign = (...args) => {
                setTimeout(() => {
                    this.login.onSign(...args)
                }, 1000)
            }
            platformEvent.qq.login.onClose = (...args) => {
                this.login.onClose(...args)
            }
            if (H.isIos()) {
                this.call('QQ', 'login')
            }
            if (H.isAndroid()) {
                this.call('QQ', 'login', '()V')
            }
        },
        onSign: (...args) => {},
        onClose: (...args) => {},
    }

    share = {
        toQQ: (param) => {
            param = {...{
                title: '',
                des: '',
                url: '',
                imgUrl: '',
            }, ...param}
            if (H.isIos()) {
                this.call('QQ', 'shareToQQ', JSON.stringify(param))
            }
            if (H.isAndroid()) {
                this.call('QQ', 'shareToQQ', '(Ljava/lang/String;)V', JSON.stringify(param))
            }
        }
    }
}


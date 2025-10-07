import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { platform } from './platform'

if (typeof platformEvent == 'undefined') {
    globalThis.platformEvent = {}
}
platformEvent.apple = {}
platformEvent.apple.login = {}
platformEvent.apple.IAP = {}
platformEvent.apple.gameCenter = {}

@ccclass('apple')
export class apple extends platform {
    //调用评分
    requestReview() {
        this.call('SKStoreReviewController', 'requestReview')
    }

    //appId = idxxx
    openReview(appId) {
        this.call('Native', 'openReview', appId)
    }

    //申请IDFA权限
    requestTrackingAuthorization() {
        this.call('Native', 'requestTrackingAuthorization')
    }

    login = {
        sign: () => {
            platformEvent.apple.login.onSign = (...args) => {
                this.login.onSign(...args)
            }
            platformEvent.apple.login.onClose = (...args) => {
                this.login.onClose(...args)
            }
            this.call('Login', 'sign')
        },
        onSign: (...args) => {},
        onClose: (...args) => {},
    }

    IAP = {
        init: () => {
            let events = ['onRequestProducts', 'onVerify', 'onSuccess', 'onRePay', 'onFailed']
            H.forArr(events, event => {
                platformEvent.apple.IAP[event] = (...args) => {
                    if (this.IAP[event]) this.IAP[event](...args)
                }
            })
            this.call('IAP', 'init')
        },
        //productIds = 'goodId,goodId2,goodId3'
        requestProducts: (productIds) => {
            this.call('IAP', 'requestProducts', productIds)
        },
        pay: (productId) => {
            this.call('IAP', 'pay', productId)
        },
        rePay: () => {
            this.call('IAP', 'rePay')
        },
    }

    gameCenter = {
        eventType: {
            SIGN: 'apple.gameCenter.onSign',
            ERROR: 'apple.gameCenter.onError',
        },
        init: () => {
            platformEvent.apple.gameCenter.onSign = this.gameCenter.onSign.bind(this)
            platformEvent.apple.gameCenter.onError = this.gameCenter.onError.bind(this)
            this.call('GameCenter', 'init')
        },
        onSign: (...args) => {
            E.emit(this.gameCenter.eventType.SIGN, ...args)
        },
        onError: (...args) => {
            E.emit(this.gameCenter.eventType.ERROR, ...args)
        },
        isAuthenticated: () => {
            return this.call('GameCenter', 'isAuthenticated')
        },
        showList: (param) => {
            param = {...{
                listId: 'level',
                type: 'all',
            }, ...param}
            this.call('GameCenter', 'showList', JSON.stringify(param))
        },
        //上传分数
        send: (param) => {
            param = {...{
                listId: 'level',
                value: 0,
            }, ...param}
            this.call('GameCenter', 'send', JSON.stringify(param))
        }
    }
}


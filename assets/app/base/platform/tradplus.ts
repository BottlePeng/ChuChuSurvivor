import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { platform } from './platform'

if (typeof platformEvent == 'undefined') {
    globalThis.platformEvent = {}
}
platformEvent.tradplus = {}
platformEvent.tradplus.rewardedVideo = {}
platformEvent.tradplus.interstitial = {}

@ccclass('tradplus')
export class tradplus extends platform {

    init(appId) {
        platformEvent.tradplus.onInit = (...args) => {
            this.onInit(...args)
        }
        if (H.isIos()) {
            this.call('iTradPlus', 'init', appId)
        }
        if (H.isAndroid()) {
            this.call('TradPlus', 'init', '(Ljava/lang/String;)V', appId)
        }
    }

    onInit() {
    }

    //onAdLoaded 广告加载完成 首个广告源加载成功时回调 一次加载流程只会回调一次
    //onAdClicked 广告被点击
    //onAdImpression 广告成功展示在页面上
    //onAdFailed 广告加载失败
    //onAdClosed 广告被关闭
    //onAdReward 激励视频奖励回调
    //onAdVideoStart 视频播放开始
    //onAdVideoEnd 视频播放结束
    //onAdVideoError 视频播放失败（部分广告源支持）
    rewardedVideo = {
        init: (videoAdUnitId) => {
            let events = ['onAdLoaded', 'onAdClicked', 'onAdImpression', 'onAdFailed', 'onAdClosed', 'onAdReward', 'onAdVideoStart', 'onAdVideoEnd', 'onAdVideoError']
            H.forArr(events, event => {
                this.rewardedVideo[event] = (...args) => {}
                platformEvent.tradplus.rewardedVideo[event] = (...args) => {
                    this.rewardedVideo[event](...args)
                    if (event != 'onAdLoaded') {
                        this.rewardedVideo.loading = false
                        if (this.rewardedVideo.timer) {
                            clearInterval(this.rewardedVideo.timer)
                        }
                    }
                }
            })
            if (H.isIos()) {
                this.call('iTradPlus', 'rewardedVideoInit', videoAdUnitId)
            }
            if (H.isAndroid()) {
                this.call('TradPlus$RewardedVideo', 'init', '(Ljava/lang/String;)V', videoAdUnitId)
            }
        },
        loadAd: () => {
            if (H.isIos()) {
                this.call('iTradPlus', 'rewardedVideoLoadAd')
            }
            if (H.isAndroid()) {
                this.call('TradPlus$RewardedVideo', 'loadAd', '()V')
            }
        },
        _showAd: () => {
            if (H.isIos()) {
                this.call('iTradPlus', 'rewardedVideoShowAd')
            }
            if (H.isAndroid()) {
                this.call('TradPlus$RewardedVideo', 'showAd', '()V')
            }
        },
        isReady: () => {
            if (H.isIos()) {
                return this.call('iTradPlus', 'rewardedVideoIsReady')
            }
            if (H.isAndroid()) {
                return this.call('TradPlus$RewardedVideo', 'isReady', '()Z')
            }
        },
        onTimeout: () => {},
        onLoading: () => {},
        loading: false,
        showAd: () => {
            if (this.rewardedVideo.loading) {
                this.rewardedVideo.onLoading()
                return
            }
            this.rewardedVideo.loading = true
            if (this.rewardedVideo.isReady()) {
                this.rewardedVideo._showAd()
                this.rewardedVideo.loading = false
                return
            }
            let timeout = 5
            this.rewardedVideo.timer = setInterval(() => {
                if (this.rewardedVideo.isReady()) {
                    this.rewardedVideo._showAd()
                    this.rewardedVideo.loading = false
                    clearInterval(this.rewardedVideo.timer)
                }
                this.rewardedVideo.loadAd()
                timeout--
                if (timeout <= 0) {
                    this.rewardedVideo.loading = false
                    this.rewardedVideo.onTimeout()
                    clearInterval(this.rewardedVideo.timer)
                }
            }, 1000)
        },
    }

    interstitial = {
        init: (adUnitId) => {
            let events = ['onAdLoaded', 'onAdClicked', 'onAdImpression', 'onAdFailed', 'onAdClosed', 'onAdVideoStart', 'onAdVideoEnd', 'onAdVideoError']
            H.forArr(events, event => {
                this.interstitial[event] = (...args) => {}
                platformEvent.tradplus.interstitial[event] = (...args) => {
                    this.interstitial[event](...args)
                }
            })
            if (H.isIos()) {
                this.call('iTradPlus', 'interstitialInit', adUnitId)
            }
            if (H.isAndroid()) {
                this.call('TradPlus$Interstitial', 'init', '(Ljava/lang/String;)V', adUnitId)
            }
        },
        loadAd: () => {
            if (H.isIos()) {
                this.call('iTradPlus', 'interstitialLoadAd')
            }
            if (H.isAndroid()) {
                this.call('TradPlus$Interstitial', 'loadAd', '()V')
            }
        },
        showAd: () => {
            if (H.isIos()) {
                this.call('iTradPlus', 'interstitialShowAd')
            }
            if (H.isAndroid()) {
                this.call('TradPlus$Interstitial', 'showAd', '()V')
            }
        },
        isReady: () => {
            if (H.isIos()) {
                return this.call('iTradPlus', 'interstitialIsReady')
            }
            if (H.isAndroid()) {
                return this.call('TradPlus$Interstitial', 'isReady', '()Z')
            }
            return false
        }
    }
}


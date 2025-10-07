import { _decorator } from 'cc';
const { ccclass } = _decorator;
@ccclass('adMgr')
export class adMgr {
    init() {
        try {
            R('tradplus').onInit = () => {
                if (H.isIos()) {
                    R('tradplus').rewardedVideo.init('')
                }
                if (H.isAndroid()) {
                    R('tradplus').rewardedVideo.init('')
                }
                this.rewardedVideo = R('tradplus').rewardedVideo
            }
            if (H.isIos()) {
                R('tradplus').init('')
            }
            if (H.isAndroid()) {
                R('tradplus').init('')
            }
        } catch(e) {
            log('ad Error', e)
        }
    }

    showRewardedVideo(callFunc, errFunc) {
        if (this._showRewardedVideo) return
        this._showRewardedVideo = true
        G('audio').setVolume(0)
        const end = () => {
            this._showRewardedVideo = false
            G('audio').setVolume(1)
        }
        const rewardFunc = () => {
            M('achive').incCount('lookAd', 'video')
            if (callFunc) callFunc()
        }

        if (H.isBrowser()) {
            end()
            rewardFunc()
            return
        }
        if (!this.rewardedVideo) {
            end()
            errFunc(L('error_ad_ready'))
            return
        }

        let isReward = false
        this.rewardedVideo.onAdReward = () => {
            isReward = true
        }
        this.rewardedVideo.onAdClosed = () => {
            end()
            if (isReward) {
                rewardFunc()
            } else {
                errFunc()
            }
        }
        this.rewardedVideo.onTimeout = () => {
            end()
            errFunc(L('error_timeout'))
        }
        this.rewardedVideo.onAdFailed = () => {
            end()
            errFunc(L('error_ad'))
        }
        this.rewardedVideo.onAdVideoError = () => {
            end()
            errFunc(L('error_ad'))
        }
        this.rewardedVideo.showAd()
    }
}


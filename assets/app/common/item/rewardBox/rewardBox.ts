import { _decorator } from 'cc';
import { ccBase } from '../../../base/component/ccBase';
const { ccclass, property } = _decorator;

@ccclass('rewardBox')
export class rewardBox extends ccBase {
    @property(cc.Label)
    cdLabel = null

    start() {
        this.animExt = this.find('anim', 'animExt')
        this.animExt.init()
        this.progressBar = this.find('anim/progressBar', cc.ProgressBar)

        this.upd()

        this.addEvent('app.runTime', this.upd)
        this.addEvent(M('game').eventType.SET_REWARD, this.upd)

        this.node.on('touch-end', e => {
            E.stop(e)
            V('rewardBoxInfo').show()
        })
    }

    upd() {
        let reward = M('game').getBoxReward()
        let time = M('data').timeCount.adBox
        let cd = reward.cd

        if (time > cd) {
            if (this.cdLabel) this.cdLabel.string = L('canGain')
            this.progressBar.node.active = false

            if (!this.animExt.isPlaying('open')) {
                this.animExt.play('open')
            }
        } else {
            let second = cd - time
            if (this.cdLabel) this.cdLabel.string = H.secondFormat(second, '{mm}:{ss}')

            this.progressBar.node.active = true
            this.progressBar.progress = 1 - (time / cd)

            if (!this.animExt.isPlaying('close')) {
                this.animExt.play('close')
            }
        }
    }
}


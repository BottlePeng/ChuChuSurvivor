import { _decorator } from 'cc';
import { ccBase } from '../../../base/component/ccBase';
const { ccclass, property } = _decorator;

@ccclass('setting')
export class setting extends ccBase {
    @property(cc.SpriteFrame)
    onSpriteFrame = null

    @property(cc.SpriteFrame)
    offSpriteFrame = null

    start() {
        this.frameRate60Btn = this.find('frameRate60Btn', cc.Button)
        this.frameRate30Btn = this.find('frameRate30Btn', cc.Button)

        this.musicBtn = this.find('audioMusicBtn', cc.Button)
        this.effectBtn = this.find('audioEffectBtn', cc.Button)
        this.musicBtn.iconSprite = this.find('icon', cc.Sprite, this.musicBtn.node)
        this.effectBtn.iconSprite = this.find('icon', cc.Sprite, this.effectBtn.node)

        this.updAudio()
        this.updFrameRateBtn()

        this.musicBtn.node.on('touch-end', this.setMusic, this)
        this.effectBtn.node.on('touch-end', this.setEffect, this)

        this.frameRate60Btn.node.on('touch-end', this.setFrameRate, this)
        this.frameRate30Btn.node.on('touch-end', this.setFrameRate, this)
    }

    updAudio() {
        if (M('data').setting.audio.music) {
            this.musicBtn.iconSprite.spriteFrame = this.onSpriteFrame
        } else {
            this.musicBtn.iconSprite.spriteFrame = this.offSpriteFrame
        }
        if (M('data').setting.audio.effect) {
            this.effectBtn.iconSprite.spriteFrame = this.onSpriteFrame
        } else {
            this.effectBtn.iconSprite.spriteFrame = this.offSpriteFrame
        }
    }

    updFrameRateBtn() {
        if (M('data').setting.frameRate >= 60) {
            this.find('checkmark', this.frameRate60Btn.node).active = true
            this.find('checkmark', this.frameRate30Btn.node).active = false
        } else {
            this.find('checkmark', this.frameRate60Btn.node).active = false
            this.find('checkmark', this.frameRate30Btn.node).active = true
        }
    }

    setFrameRate(e) {
        let node = e.target
        if (node.name.indexOf('60') != -1) {
            M('setting').setFrameRate(60)
        } else {
            M('setting').setFrameRate(30)
        }
        this.updFrameRateBtn()
    }

    setMusic() {
        M('data').setting.audio.music = !M('data').setting.audio.music
        G('audio').init(M('data').setting.audio)
        if (M('data').setting.audio.music) {
            G('audio').playCurrentMusic()
        } else {
            G('audio').stopMusic()
        }
        this.updAudio()
    }

    setEffect() {
        M('data').setting.audio.effect = !M('data').setting.audio.effect
        G('audio').init(M('data').setting.audio)
        G('audio').stopEffect()
        this.updAudio()
    }
}


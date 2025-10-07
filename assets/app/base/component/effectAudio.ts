import { _decorator } from 'cc';
import { ccBase } from './ccBase';
const { ccclass, property, menu } = _decorator;

@ccclass('effectAudio')
@menu('base/effectAudio')
export class effectAudio extends ccBase {

    @property(cc.AudioClip)
    clip = null

    @property
    loop = false

    onEnable() {
        if (typeof G == 'undefined') return
        if (G('audio').config.effect && G('audio').getEffectVolume() > 0 && this.clip) {
            G('audio').playEffect(this.clip)
            if (this.loop) this.playCd = this.clip.getDuration()
        }
    }

    update(dt) {
        if (!this.loop) return
        if (!this.clip) return

        if (this.playCd > 0) {
            this.playCd -= dt
            return
        }
        G('audio').playEffect(this.clip)
        this.playCd = this.clip.getDuration()
    }
}


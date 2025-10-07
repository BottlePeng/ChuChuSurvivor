import { _decorator, director, AudioSource } from 'cc';
const { ccclass } = _decorator;

const defBundleName = 'app'

@ccclass('audioMgr')
export class audioMgr {

    bundleName = defBundleName

    onCall() {
        this.bundleName = defBundleName
    }

    bundle(bundleName) {
        this.bundleName = bundleName
        return this
    }

    constructor() {
        const createAudioSource = (name) => {
            let node = new cc.Node()
            node.name = name
            director.getScene().addChild(node)
            director.addPersistRootNode(node)
            return H.add$(node, AudioSource, true)
        }

        this.musicAudioSource = createAudioSource('_musicAudioSource_')
        this.effectAudioSource = createAudioSource('_effectAudioSource_')
        this.config = {music: true, effect: true}
    }

    init(param) {
        this.config = {...{
            music: true,
            effect: true,
        }, ...param}

        if (!this.config.music) this.stopMusic()
        if (!this.config.effect) this.stopEffect()
    }

    getMusicVolume() {
        return this.musicAudioSource.volume
    }

    getEffectVolume() {
        return this.effectAudioSource.volume
    }

    setMusicVolume(val) {
        this.musicAudioSource.volume = val
    }

    setEffectVolume(val) {
        this.effectAudioSource.volume = val
    }

    setVolume(val) {
        this.setMusicVolume(val)
        this.setEffectVolume(val)
    }

    playEffect(asset) {
        if (!this.config.effect) return
        this.effectAudioSource.playOneShot(this.getClip(asset))
    }

    playMusic(asset, loop = true) {
        this.musicAsset = asset
        if (!this.config.music) return
        this.musicAudioSource.stop()
        this.musicAudioSource.clip = this.getClip(asset)
        this.musicAudioSource.loop = loop
        this.musicAudioSource.play()
    }

    playCurrentMusic(loop = true) {
        if (!this.musicAsset) return
        this.playMusic(this.musicAsset, loop)
    }

    stopMusic() {
        this.musicAudioSource.stop()
    }

    stopEffect() {
        this.effectAudioSource.stop()
    }

    stop() {
        this.musicAudioSource.stop()
        this.effectAudioSource.stop()
    }

    pause() {
        this.musicAudioSource.pause()
        this.effectAudioSource.pause()
    }

    resume(){
        this.musicAudioSource.play()
        this.effectAudioSource.play()
    }

    getClip(asset) {
        let clip = typeof asset == 'string' ? G('asset').bundle(this.bundleName).getAudioClip(asset) : asset
        return clip
    }
}


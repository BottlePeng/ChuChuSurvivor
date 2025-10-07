import { _decorator, Component } from 'cc';
const { ccclass, menu } = _decorator;

@ccclass('animExt')
@menu('base/animExt')
export class animExt extends Component {

    init(anim) {
        if (anim) {
            this.anim = anim
        } else {
            this.anim = $(this.node, cc.Animation)
        }
        this.speedMul = 1
    }

    //param > repeatCount
    play(nameOrNames, ...args) {
        let param = {
            events: [],
            speedMul: null,
        }
        let repeatCount
        if (H.isObj(args[0])) {
            param = {...param, ...args[0]}
            if (H.isNum(args[1])) repeatCount = args[1]
        }
        if (H.isNum(args[0])) repeatCount = args[0]
        let speedMul = H.isNum(param.speedMul) ? param.speedMul : this.speedMul
        return new Promise(resolve => {
            if (H.isArr(nameOrNames) && repeatCount > 1) {
                const play = (playCount = 1, step = 1) => {
                    let name = H.randArr(nameOrNames)
                    if (param.events.length < 1) param.events = [name]
                    this.animState = this.getState(name)
                    this.animState.speed = speedMul
                    H.forArr(param.events, event => {
                        this.anim[name] = val => {
                            this.onEvent(name, step, val)
                            step++
                        }
                    })
                    this.animState.off(cc.Animation.EventType.FINISHED)
                    this.animState.once(cc.Animation.EventType.FINISHED, () => {
                        if (playCount >= repeatCount) {
                            resolve()
                            return
                        }
                        playCount++
                        play(playCount, step)
                    })
                    this.anim.play(name)
                }
                play()
                return
            }
            let name = H.isArr(nameOrNames) ? H.randArr(nameOrNames) : nameOrNames
            if (param.events.length < 1) param.events = [name]
            this.animState = this.getState(name)
            if (repeatCount) this.animState.repeatCount = repeatCount
            this.animState.speed = speedMul
            this.animState.off(cc.Animation.EventType.FINISHED)
            this.animState.once(cc.Animation.EventType.FINISHED, () => {
                resolve(name)
            })
            let step = 1
            H.forArr(param.events, event => {
                this.anim[name] = val => {
                    this.onEvent(name, step, val)
                    step++
                }
            })
            this.anim.play(name)
        })
    }

    onEvent(name, step, val) {}

    getState(animName) {
        if (!this.anim) return
        return this.anim.getState(animName)
    }

    getCurrentName() {
        if (!this.animState) return
        return this.animState.clip.name
    }

    getAnimNames() {
        let res = []
        if (!this.anim) return res
        H.forArr(this.anim.clips, clip => {
            res.push(clip.name)
        })
        return res
    }

    setSpeedMul(speedMul) {
        this.speedMul = speedMul
        H.forArr(this.anim.clips, clip => {
            let animState = this.getState(clip.name)
            animState.speed = speedMul
        })
    }

    reset() {
        if (!this.anim) return
        if (!this.animState) return
        this.anim.play(this.animState.clip.name)
        this.scheduleOnce(() => {
            this.anim.stop()
            this.anim.resume()
        })
    }

    isPlaying(animName) {
        let animState = this.getState(animName)
        if (!animState) return false
        return animState.isPlaying
    }
}


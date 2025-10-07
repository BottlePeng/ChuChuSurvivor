import { _decorator } from 'cc';
import { roleBase } from './roleBase';
const { ccclass } = _decorator;

@ccclass('player')
export class player extends roleBase {
    async init(param) {
        param = {...{
            uid: H.uid(),
            group: 'player',
            asset: '',
            data: null,
        }, ...param}
        for (let key in param) this[key] = param[key]
        this.data.default = H.clone(param.data)

        this.initBase()

        this.move.speed = 200

        this.inputDir = cc.v3()

        this.setMoveSpeed(1)
        this.setPropRadius(1)

        this.isInit = false
        await this.initAnims(this.asset, this.group)
        this.isInit = true

        this.schedule(() => {
            this.target = this.getTarget()
        }, 0.1)

        this.schedule(() => {
            this.updateContactRole()
        }, 0.5)
    }

    updateContactRole() {
        if (M('fight').stop) return
        if (this.state.cd.hurt > 0) return
        let targets = G('fight').roles.filter(a => {
            let dist = H.dist(this.node.worldPosition, a.node.worldPosition)
            return dist <= (a.node.realSizeW / 2) && this.group != a.group && !a.state.lose
        })
        H.forArr(targets, target => {
            if (this.state.cd.hurt <= 0) {
                target.setHP(this)
                this.state.cd.hurt = 0.5
            }
        })
    }

    onContact(self, other) {
        if (M('fight').stop) return
        let role = G('fight').getRole(other.node)
        if (role && !role.state.lose && role.group == 'enemy') {
            if (this.state.cd.hurt <= 0) {
                this.state.cd.hurt = 0.5
                role.setHP(this)
            }
        }
        let skill = $(other.node, 'skillBase')
        if (!skill) return
        if (!skill.role) return
        skill.role.setHP(this, {skill: skill})
    }

    initCamera(camera) {
        this.camera = camera
    }

    initInput(inputOrInputs) {
        this.inputs = inputOrInputs
    }

    setMoveSpeed(level) {
        this.move.speed =  290 + (10 * level)
    }

    setPropRadius(level) {
        this.propRadius = 70 + (level * 30)
    }

    getDir(isLerp = false) {
        if (!this.inputs) return
        const getDir = (input) => {
            if (isLerp) {
                if (input.getLerpDir) return input.getLerpDir()
            }
            return input ? input.getDir() : cc.v3()
        }
        if (H.isArr(this.inputs)) {
            for (let i = 0; i < this.inputs.length; i++) {
                let dir = getDir(this.inputs[i])
                if (dir.x != 0 || dir.y != 0) {
                    return dir
                }
            }
        } else {
            return getDir(this.inputs)
        }
        return cc.v3()
    }

    setMoveSpeed(level) {
        this.move.speed =  290 + (10 * level)
    }

    update(dt) {
        if (!this.isInit) return
        if (M('fight').stop) return
        if (this.state.lose) return

        this.progressBar.HP.progress = this.data.HP / this.data.default.HP

        this.updateMisc(dt)

        if (this.ctrlMove.repel.node || this.ctrlMove.attract.node) {
            this.updateCtrlMove(dt)
            return
        }

        if (this.state.cd.sleep > 0) return

        this.move.dir = this.getDir(true)
        if (this.move.dir.x > 0) {
            this.bodyNode.scaleX = 1
        }
        if (this.move.dir.x < 0) {
            this.bodyNode.scaleX = -1
        }

        if (this.state.cd.stop > 0) return

        if (this.move.dir.equals(cc.Vec3.ZERO)) {
            this.playState('idle')
        } else {
            this.inputDir = this.getDir()
            let speed = this.move.speed * dt
            this.node.x += this.move.dir.x * speed
            this.node.y += this.move.dir.y * speed
            if (this.camera) {
                this.camera.node.setPosition(this.node.position)
            }
            this.playState('move')
        }
    }
}


import { _decorator } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('roleBase')
export class roleBase extends ccBase {

    initBase() {
        if (!this.data) {
            throw new Error('this.data error')
            return
        }

        this.bodyNode = this.find('body')
        this.colliderExt = H.add$(this.node, 'colliderExt', true)
        this.colliderExt.init(this, 0.1)
        this.colliderExt.collider.group = R('global').group[this.group]
        this.colliderExt.collider.enabled = true

        let anim = H.add$(this.find('body/anim'), cc.Animation, true)
        this.animExt = H.add$(anim.node, 'animExt', true)
        this.animExt.init()

        this.state = {}
        this.state.lose = false
        this.state.cd = {}
        this.state.cd.hurt = 0
        this.state.cd.stop = 0
        this.state.cd.sleep = 0

        this.move = {}
        this.move.dir = cc.v3()
        this.move.speed = 150

        this.ctrlMove = {}
        this.ctrlMove.repel = {}
        this.ctrlMove.repel.speed = 100
        this.ctrlMove.repel.node = null
        this.ctrlMove.repel.cd = 0.2
        this.ctrlMove.attract = {}
        this.ctrlMove.attract.speed = 200
        this.ctrlMove.attract.node = null
        this.ctrlMove.attract.cd = 0.2


        this.tween = {}

        this.resetAnim()

        const createProgressBar = (group) => {
            let progressBarNode = this.find('roleProgressBar')
            if (!progressBarNode) progressBarNode = H.inst(G('asset').getPrefab('roleProgressBar'), this.node)
            progressBarNode.active = true
            progressBarNode.y = this.node.sizeH
            H.forArr(this.find('HP', progressBarNode).children, node => {
                if (group == 'player') {
                    node.sprite.color = cc.color('#00FF00')
                } else {
                    node.sprite.color = cc.color('#FF0000')
                }
            })
            let progressBar = {}
            progressBar.node = progressBarNode
            progressBar.HP = this.find('HP', cc.ProgressBar, progressBarNode)
            return progressBar
        }

        if (this.group == 'player') {
            this.progressBar = createProgressBar(this.group)
        }

        if (this.data.bossLevel) {
            let scale = 1 + this.data.bossLevel
            this.node.scaleX = scale
            this.node.scaleY = scale
            if (this.group == 'enemy') {
                this.progressBar = createProgressBar(this.group)
            }
        } else {
            this.node.scaleX = 1
            this.node.scaleY = 1
        }
        if (this.shadowNode) {
            this.shadowNode.scaleX = this.node.scaleX
            this.shadowNode.scaleY = this.node.scaleY
            this.shadowNode.active = false
        }
    }

    initAnims(asset, group = 'player') {
        return new Promise(resolve => {
            if (!this.animExt) return
            this.animExt.anim.clips = []
            this.idleSpriteFrame = null
            R('global').loadRoleSpriteFrames(asset, group).then(spriteFrames => {
                spriteFrames = spriteFrames.sort((a, b) => {
                    return H.num(a.name) - H.num(b.name)
                })
                this.idleSpriteFrame = spriteFrames[0]
                this.animExt.node.sprite.spriteFrame = this.idleSpriteFrame
                spriteFrames.splice(0, 1)
                let moveClip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 10)
                moveClip.name = 'move'
                moveClip.wrapMode = 2
                this.animExt.anim.addClip(moveClip)

                R('global').loadRoleAnimClip('idle').then(clip => {
                    this.animExt.anim.addClip(clip)
                    if (this.shadowNode) {
                        this.shadowNode.active = true
                    }
                    resolve()
                })
            })
        })
    }

    startContact(self, other) {
        this.onContact(self, other)
    }

    endContact(self, other) {
    }

    //有需要再实现
    // solveContact(self, other) {
    // }

    onContact(self, other) {
    }

    resetAnim() {
        if (!this.tween) return
        for (let key in this.tween) {
            if (this.tween[key]) this.tween[key].stop()
        }
        this.animExt.node.sprite.color = cc.color(255, 255, 255, 1)
    }

    play(name) {
        return new Promise(async resolve => {
            if (name == 'hurt' || name == 'lose') {
                this.resetAnim()
                if (name == 'hurt') {
                    this.tween[name] = cc.tween(this.animExt.node.sprite).to(0.2, {}, {
                        onUpdate: (target, ratio) => {
                            target.color = cc.color(255, 255, 255, 255 * ratio)
                        }
                    }).call(() => {
                        this.animExt.node.sprite.color = cc.color(255, 255, 255, 1)
                        resolve()
                    }).start()
                }
                if (name == 'lose') {
                    this.tween[name] = cc.tween(this.animExt.node.sprite).to(0.5, {}, {
                        onUpdate: (target, ratio) => {
                            let val = 254 * ratio
                            if (val < 60) val = 60
                            target.color = cc.color(255, val, 255, 255)
                        }
                    }).call(() => {
                        resolve()
                    }).start()
                }
            }
        })
    }

    playState(animName) {
        if (animName == 'idle') {
            this.animExt.node.sprite.spriteFrame = this.idleSpriteFrame
        }
        if (!this.animExt.isPlaying(animName)) {
            this.animExt.play(animName)
        }
    }

    setHP(target, param, type) {
        param = {...{
            skill: null,
            value: 0,
        }, ...param}

        if (!target) return
        if (this.state.lose || target.state.lose) return
        if (!type) {
            type = this.group == target.group ? '+' : '-'
        }

        let res = {}
        res.isCrit = false
        res.isDouble = false
        res.value = param.value

        if (res.value <= 0) {
            res.value = this.data.ATK
            if (param.skill) {
                if (this.group == 'player') {
                    let valLevel = H.num(this.data[param.skill.skillName + 'Level'])
                    if (valLevel) res.value += valLevel
                    let valPencent = H.num(this.data[param.skill.skillName + 'Pencent'], 2)
                    res.value = res.value + (res.value * (valPencent / 100))
                }
                res.value = res.value * (param.skill.hurtPercent / 100)
                if (res.value < 1) res.value = 1
            }
            if (H.calProb(this.data.critOdds)) {
                res.value = res.value * 1.5
                res.isCrit = true
            }
            if (H.calProb(this.data.doubleOdds)) {
                res.value = res.value * 2
                res.isDouble = true
            }
        }
        res.value = H.num(res.value)

        if (type == '+') {
            target.data.HP += res.value
            if (target.data.HP >= target.data.default.HP) {
                target.data.HP = target.data.default.HP
            }
            target.tip(res.value, 1, '#00FF00')
            return
        }

        target.data.HP -= res.value
        if (target.data.HP <= 0) target.data.HP = 0

        if (target.group == 'enemy' && param.skill) {
            let skillAssets = M('skill').getAssets()
            if (skillAssets.includes(param.skill.skillName)) {
                M('fight').setSkillNum(param.skill.skillName, 'hurt', res.value, '+')
            }
        }

        if (target.group == 'player') G('audio').playEffect('hurt')

        let tipParam = {}
        tipParam.color = ''
        tipParam.type = 1
        if (target.group == 'player') tipParam.color = '#FFFF00'
        if (res.isCrit || res.isDouble) type = 2

        target.tip(res.value, tipParam.type, tipParam.color)

        if (target.data.HP <= 0) {
            //玩家需要复活，所以不销毁
            if (target.group == 'player') {
                E.emit('role.lose', target)
            } else {
                target.lose()
            }
        } else {
            target.play('hurt')
        }
    }

    //type 1=普通 2=暴击
    tip(string, type = 1, color) {
        if (!this.state) return
        if (this.state.lose) return
        if (!color) {
            color = '#FFFFFF'
            if (type == 2) color = '#FF0000'
        }
        return G('tip').fight(string, {
            by: this.bodyNode,
            animType: type,
            color: color,
        })
    }

    remove() {
        if (this.rvo) this.rvo.remove(this.uid)
        G('fight').removeRole(this)
    }

    async lose() {
        if (this.progressBar) this.progressBar.node.active = false
        this.colliderExt.collider.enabled = false
        this.state.lose = true
        E.emit('role.lose', this)
        await this.play('lose')
        this.remove()
    }

    getTarget() {
        let targets = this.getTargets(1)
        return targets[0]
    }

    getTargets(num, sort = 'ASC') {
        let targets = G('fight').roles.filter(a => {
            return a.group != this.group && !a.state.lose && app.screen.isInView(this.node, a.node)
        })
        if (targets.length < 1) return []

        targets.sort((a, b) => {
            let aDist = H.dist(a.node, this.node)
            let bDist = H.dist(b.node, this.node)
            if (sort == 'ASC') return aDist - bDist
            return bDist - aDist
        })

        if (num) return targets.slice(0, num)
        return targets
    }

    getRandTarget() {
        let targets = G('fight').roles.filter(a => {
            return a.group != this.group && !a.state.lose && app.screen.isInView(this.node, a.node)
        })
        return H.randArr(targets)
    }

    getRandTargets(num) {
        let targets = G('fight').roles.filter(a => {
            return a.group != this.group && !a.state.lose && app.screen.isInView(this.node, a.node)
        })
        return H.randArr(targets, num)
    }

    //击退
    repel(node, cd = 0.2) {
        if (this.state.cd.stop > 0) return
        if (this.state.cd.sleep > 0) return
        if (!this.ctrlMove) return
        this.ctrlMove.repel.node = node
        this.ctrlMove.repel.cd = cd
    }

    //吸引
    attract(node, cd = 0.2) {
        if (this.state.cd.stop > 0) return
        if (this.state.cd.sleep > 0) return
        if (!this.ctrlMove) return
        this.ctrlMove.attract.node = node
        this.ctrlMove.attract.cd = cd
    }

    setCtrlPos(key, dt) {
        if (!this.ctrlMove[key].node) return
        if (this.ctrlMove[key].cd <= 0) {
            this.ctrlMove[key].node = null
            return
        }
        this.ctrlMove[key].cd -= dt
        let speed = this.ctrlMove[key].speed * dt
        if (this.data.bossLevel) speed = speed / 2
        let byWorldPos = this.node.getWorldPosition()
        let toWorldPos = this.ctrlMove[key].node.getWorldPosition()
        let dir
        if (key == 'repel') {
            dir = H.posToDir(toWorldPos, byWorldPos)
        } else {
            dir = H.posToDir(byWorldPos, toWorldPos)
        }
        let worldPos = cc.v3(byWorldPos.x, byWorldPos.y)
        worldPos.x += dir.x * speed
        worldPos.y += dir.y * speed
        if (this.rvo) {
            this.rvo.setWorldPos(this.uid, worldPos)
        } else {
            this.node.setWorldPosition(worldPos)
        }
    }

    updateCtrlMove(dt) {
        if (!this.ctrlMove) return
        if (!this.ctrlMove.repel.node && !this.ctrlMove.attract.node) return
        this.move.dir = cc.v3()
        this.setCtrlPos('repel', dt)
        this.setCtrlPos('attract', dt)
    }

    updateMisc(dt) {
        if (!this.state) return
        if (this.state.cd.hurt > 0) this.state.cd.hurt -= dt
        if (this.state.cd.stop > 0) this.state.cd.stop -= dt
        if (this.state.cd.sleep > 0) this.state.cd.sleep -= dt

        if (this.shadowNode) {
            this.shadowNode.setWorldPosition(this.node.worldPosition)
        }
    }
}


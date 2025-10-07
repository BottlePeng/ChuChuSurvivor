import { _decorator } from 'cc';
import { popup } from '../../../popup/popup';
const { ccclass } = _decorator;

@ccclass('fightUpLevel')
export class fightUpLevel extends popup {
    show(fight, type = 'exp') {
        this.addBtnEvents()

        this.touchClose = false
        this.fight = fight
        this.type = type
        this.player = this.fight.player
        this.itemNode = this.find('item')
        this.itemNode.active = false

        this.adBtn = this.find('adBtn', cc.Button)
        this.adBtn.node.active = false

        this.itemNum = 3
        this.initItems()

        return this._show(this)
    }

    initItems() {
        //人物升级
        if (this.type == 'exp') {
            let skills = M('fight').getSkills().filter(a => {
                return !a.isPassive
            })
            let mySkills = M('fight').getSkills(true).filter(a => {
                return !a.isPassive
            })
            if (mySkills.length >= M('skill').getMaxNum()) {
                skills = M('fight').getSkills().filter(a => {
                    return !a.isPassive && a.level > 0
                })
            }
            let passiveSkills = M('fight').getSkills().filter(a => {
                return a.isPassive
            })
            let myPassiveSkills =  M('fight').getSkills(true).filter(a => {
                return a.isPassive
            })
            if (myPassiveSkills.length >= M('skill').getMaxNum('passive')) {
                passiveSkills = M('fight').getSkills().filter(a => {
                    return a.isPassive && a.level > 0
                })
            }
            if (skills.length > 0 || passiveSkills.length > 0) {
                this.skills = skills.concat(passiveSkills).filter(a => {
                    return a.level < 10
                })
            } else {
                this.skills = []
            }
        } else {
        //获取箱子
            this.skills = M('fight').getSkills().filter(a => {
                return a.level > 0 && a.level < 10
            })
        }

        this.skills = H.randArr(this.skills, 3)
        if (this.skills.length == 1) {
            this.skills.push({name: 'gold'})
            this.skills.push({name: 'healPotion'})
        } else if (this.skills.length == 2) {
            this.skills.push({name: 'gold'})
        } else if (this.skills.length < 1) {
            this.skills = []
            this.skills.push({name: 'gold'})
            this.skills.push({name: 'healPotion'})
            this.adBtn.node.active = false
        }
        this.adBtn.node.active = this.skills.length >= 3

        H.forArr(this.skills, a => {
            let item = {}
            item.node = H.inst(this.itemNode, this.itemNode.parent)
            item.iconSprite = this.find('icon', cc.Sprite, item.node)
            item.iconSprite.node.active = false
            item.passiveNode = this.find('passive', item.node)
            item.passiveNode.active = false
            item.passiveIconSprite = this.find('icon', cc.Sprite, item.passiveNode)
            item.passiveTitleLabel = this.find('titleLabel', cc.Label, item.passiveNode)
            item.label = this.find('Label', cc.Label, item.node)
            item.upBtn = this.find('upBtn', cc.Button, item.node)

            if (a.name == 'gold' || a.name == 'healPotion') {
                item.label.color = cc.color('#FFFFFF')
                item.iconSprite.node.active = true
                item.iconSprite.spriteFrame = R('global').getMiscSpriteFrame(a.name)
                if (a.name == 'gold') {
                    let val = 50 * M('fight').level
                    item.label.string = H.numAbbr(val)
                    item.upBtn.node.on('touch-end', e => {
                        E.stop(e)
                        M('fight').addRewardPropNum('gold', val)
                        this.remove()
                    })
                }
                if (a.name == 'healPotion') {
                    item.label.string = 1
                    item.upBtn.node.on('touch-end', e => {
                        this.player.setHP(this.player, {value: this.player.data.default.HP * 0.2})
                        this.remove()
                    })
                }
                return
            }
            let nextLevel = a.level + 1
            if (nextLevel > 9) {
                item.label.string = 'MAX'
                item.label.color = cc.color('#FF0000')
            } else {
                if (a.level < 1) {
                    item.label.string = 'New'
                    item.label.color = cc.color('#00FF00')
                } else {
                    item.label.string = 'Lv' + nextLevel
                    item.label.color = cc.color('#FFFFFF')
                }
            }
            if (a.isPassive) {
                item.passiveNode.active = true
                item.passiveTitleLabel.string = L('passiveSkillInfo.' + a.name + '.title')
                if ('pencent' in a) item.passiveTitleLabel.string += '+' + a.pencent + '%'
                item.passiveIconSprite.spriteFrame = R('global').getMiscSpriteFrame(a.name)
                if (a.level < 1) {
                    item.upBtn.node.on('touch-end', e => {
                        E.stop(e)
                        this.setPassiveSkillLevel(a.name, 1)
                        this.remove()
                    })
                } else {
                    item.upBtn.node.on('touch-end', e => {
                        E.stop(e)
                        this.setPassiveSkillLevel(a.name, a.level + 1)
                        this.remove()
                    })
                }
            } else {
                item.iconSprite.node.active = true
                if (a.level > 8) {
                    item.iconSprite.spriteFrame = R('global').getSkillSpriteFrame(a.name, 1)
                } else {
                    item.iconSprite.spriteFrame = R('global').getSkillSpriteFrame(a.name, 0)
                }
                if (a.level < 1) {
                    item.upBtn.node.on('touch-end', e => {
                        E.stop(e)
                        this.setSkillLevel(a.name, 1)
                        this.remove()
                    })
                } else {
                    item.upBtn.node.on('touch-end', e => {
                        E.stop(e)
                        this.setSkillLevel(a.name, a.level + 1)
                        this.remove()
                    })
                }

                item.iconSprite.node.on('touch-end', e => {
                    E.stop(e)
                    V('skillInfo').show(a.name)
                })
            }
        })
    }

    setSkillLevel(skillName, level) {
        G('skill').setLevel(this.player, skillName, level)
        if (level > 9) {
            M('achive').incCount('useSkill', skillName)
        }
    }

    setPassiveSkillLevel(skillName, level) {
        G('skill').setPassiveLevel(this.player, skillName, level)
        if (level > 9) {
            M('achive').incCount('usePassiveSkill', skillName)
        }
    }

    adBtnEvent(node) {
        let btn = $(node, cc.Button)
        if (!btn.interactable) return
        btn.interactable = false
        G('tip').loading()
        const end = () => {
            btn.interactable = true
            G('tip').closeLoading()
        }

        const setReward = () => {
            end()
            H.forArr(this.skills, a => {
                if (a.name == 'gold' || a.name == 'healPotion') {
                    if (a.name == 'gold') M('fight').addRewardPropNum('gold', 50 * M('fight').level)
                    if (a.name == 'healPotion') {
                        this.player.setHP(this.player, {value: this.player.data.default.HP})
                    }
                    return
                }
                if (a.isPassive) {
                    if (a.level < 1) {
                        let passiveSkills = M('fight').getSkills(true).filter(a => a.isPassive)
                        if (passiveSkills.length < M('skill').getMaxNum()) {
                            this.setPassiveSkillLevel(a.name, 1)
                        }
                    } else {
                        this.setPassiveSkillLevel(a.name, a.level + 1)
                    }
                } else {
                    if (a.level < 1) {
                        let skills = M('fight').getSkills(true).filter(a => !a.isPassive)
                        if (skills.length < M('skill').getMaxNum()) {
                            this.setSkillLevel(a.name, 1)
                        }
                    } else {
                        this.setSkillLevel(a.name, a.level + 1)
                    }
                }
            })
            this.remove()
        }

        G('ad').showRewardedVideo(() => {
            setReward()
        }, err => {
            if (err) G('tip').error(err)
            end()
        })
    }

    update(dt) {
        if (!this.player) return
        if (this.player.data.HP < 1) {
            this.remove()
            return
        }
    }
}


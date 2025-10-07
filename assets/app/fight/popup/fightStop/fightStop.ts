import { _decorator, input, Input, KeyCode } from 'cc';
import { popup } from '../../../popup/popup';
const { ccclass } = _decorator;

@ccclass('fightStop')
export class fightStop extends popup {
    show(fight) {
        this.addBtnEvents()

        this.touchClose = false
        this.fight = fight
        this.player = this.fight.player

        this.exitBtn = this.find('exitBtn', cc.Button)
        this.exitBtn.node.active = true

        this.reviveBtn = this.find('reviveBtn', cc.Button)
        //this.reviveBtn.node.active = this.isLose() && M('fight').revive > 0
        this.reviveBtn.node.active = this.isLose()

        this.closeBtn = this.find('closeBtn', cc.Button)
        this.closeBtn.node.active = !this.isEnd() && !this.reviveBtn.node.active

        if (this.isEnd() && !this.isLose()) {
            R('apple').requestReview()
        }

        this.doubleBtn = this.find('doubleBtn', cc.Button)
        this.updDoubleBtn()

        this.itemNode = this.find('skillCount/item')
        this.itemNode.active = false

        this.propItemNode = this.find('propItem')
        this.propItemNode.active = false

        this.killLabel = this.find('kill/Label', cc.Label)
        this.goldLabel = this.find('gold/Label', cc.Label)

        this.killLabel.string = H.num(M('fight').kill)

        this.initCountItems()

        this.initRewardItems()

        return this._show(this)
    }


    initCountItems() {
        for (let key in M('fight').player.skill) {
            let node = H.inst(this.itemNode)
            node.parent = this.itemNode.parent
            let item = {}
            item.iconSprite = this.find('skill/icon', cc.Sprite, node)
            item.levelLabel = this.find('skill/levelLabel', cc.Label, node)
            item.titleLabel = this.find('titleLabel', cc.Label, node)
            item.hurtLabel = this.find('hurtLabel', cc.Label, node)
            item.dpsLabel = this.find('dpsLabel', cc.Label, node)

            if (M('fight').player.skill[key].level < 10) {
                item.titleLabel.string = L('skillInfo.' + key + '.title')
                item.iconSprite.spriteFrame = R('global').getSkillSpriteFrame(key, 0)
                item.levelLabel.color = cc.color('#FFFFFF')
                item.levelLabel.string = M('fight').player.skill[key].level
            } else {
                item.titleLabel.string = L('skillInfo.' + key + '.title2')
                item.iconSprite.spriteFrame = R('global').getSkillSpriteFrame(key, 1)
                item.levelLabel.color = cc.color('#FF0000')
                item.levelLabel.string = 'MAX'
            }
            item.hurtLabel.string = H.num(M('fight').player.skill[key].hurt)
            let second = M('fight').second - M('fight').player.skill[key].second
            item.dpsLabel.string = H.num(M('fight').player.skill[key].hurt / second, 2)
        }
    }

    initRewardItems() {
        if (this.rewardItems) {
            H.forArr(this.rewardItems, a => {
                G('pool').put(a.node)
            })
        }
        this.rewardItems = []
        H.forArr(M('fight').reward.chips.filter(a => a.chip > 0), chip => {
            let item = {}
            item.propItem = G('pool').get(this.propItemNode, 'propItem', this.propItemNode.parent)
            item.propItem.updChip(chip)
            item.node = item.propItem.node
            item.asset = chip.asset

            item.upd = () => {
                let chip = M('fight').reward.chips.find(a => a.asset == item.asset)
                if (!chip) return
                if (M('fight').reward.isDouble) {
                    item.propItem.label.string = H.numAbbr(chip.chip * 2)
                } else {
                    item.propItem.label.string = H.numAbbr(chip.chip)
                }
            }
            this.rewardItems.push(item)
        })

        for (let key in M('fight').reward.prop) {
            if (key == 'gold') continue
            if (M('fight').reward.prop[key] < 1) continue
            let item = {}
            item.propItem = G('pool').get(this.propItemNode, 'propItem', this.propItemNode.parent)
            item.propItem.updProp(key, M('fight').reward.prop[key])
            item.node = item.propItem.node
            item.asset = key

            item.upd = () => {
                if (item.asset in M('fight').reward.prop) {
                    if (M('fight').reward.isDouble) {
                        item.propItem.label.string = H.numAbbr(M('fight').reward.prop[item.asset] * 2)
                    } else {
                        item.propItem.label.string = H.numAbbr(M('fight').reward.prop[item.asset])
                    }
                }
                if (M('fight').reward.isDouble) {
                    this.goldLabel.string = H.num(M('fight').reward.prop.gold * 2)
                } else {
                    this.goldLabel.string = H.num(M('fight').reward.prop.gold)
                }
            }

            this.rewardItems.push(item)
        }
        this.goldLabel.string = H.num(M('fight').reward.prop.gold)
    }

    updRewardItems() {
        if (!this.rewardItems) return
        H.forArr(this.rewardItems, a => {
            a.upd()
        })
    }

    updDoubleBtn() {
        if (M('fight').reward.isDouble) {
            this.doubleBtn.node.active = false
            return
        }
        this.doubleBtn.interactable = !M('fight').reward.isDouble
        if (this.doubleBtn.interactable) {
            let has = false
            M('fight').reward.chips.forEach(chip => {
                if (chip.chip > 0) has = true
            })
            for (let key in M('fight').reward.prop) {
                if (key != 'gold') {
                    if (M('fight').reward.prop[key] > 0) has = true
                }
            }
            this.doubleBtn.node.active = has
        }
    }

    isLose() {
        //if (M('fight').second >= M('fight').maxSecond) return false
        return this.player.data.HP <= 0
    }

    isEnd() {
        if (this.player.data.HP <= 0) return true
        if (M('fight').second >= M('fight').maxSecond) {
            let targets = G('fight').roles.filter(a => {
                return a.group != 'player'
            })
            if (targets.length <= 0) return true
        }
        return false
    }

    doubleBtnEvent(node) {
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
            M('fight').reward.isDouble = true
            this.updDoubleBtn()
            this.updRewardItems()
            M('game').setReward(M('fight').reward)
            G('tip').success(L('success_gain'))
        }
        G('ad').showRewardedVideo(() => {
            setReward()
        }, err => {
            if (err) G('tip').error(err)
            end()
        })
    }

    reviveBtnEvent(node) {
        let btn = $(node, cc.Button)
        if (!btn.interactable) return
        // if (M('fight').revive < 1) {
        //     G('tip').error(L('error_revive'))
        //     return
        // }
        G('tip').loading()
        const end = () => {
            btn.interactable = true
            G('tip').closeLoading()
        }
        const setReward = () => {
            end()
            //M('fight').revive -= 1
            this.player.setHP(this.player, {value: this.player.data.default.HP})
            this.exitBtn.node.active = false
            this.reviveBtn.node.active = false
            this.closeBtn.node.active = true
            G('tip').success(L('success_revive'))
        }
        G('ad').showRewardedVideo(() => {
            setReward()
        }, err => {
            if (err) G('tip').error(err)
            end()
        })
    }

    closeBtnEvent() {
        M('fight').stop = false
        this.remove()
    }

    exitBtnEvent() {
        V('animMask').show('close', () => {
            M('data').save()
            this.fight.remove()
            this.remove()
            G('pool').clearAll()
            V('animMask').show('open', animMask => {
                animMask.remove()
            })
            V('page').show()
        })
    }

    onKeyDown(e) {
        if (e.keyCode == KeyCode.ESCAPE) {
            if (this.closeBtn.node.active) this.closeBtnEvent()
        }
    }

    onEnable() {
        super.onEnable()
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
    }

    onDisable() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this)
    }
}


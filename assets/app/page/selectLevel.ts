import { _decorator } from 'cc';
import { ccBase } from '../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('selectLevel')
export class selectLevel extends ccBase {
    start() {
        this.addBtnEvents()

        this.prevBtn = this.find('prevBtn', cc.Button)
        this.nextBtn = this.find('nextBtn', cc.Button)
        this.startBtn = this.find('startBtn', cc.Button)
        this.levelLabel = this.find('levelLabel', cc.Label, this.startBtn.node)

        this.chipRewardItemNode = this.find('chipRewardItem', this.startBtn.node)
        this.chipRewardItemNode.active = false

        this.chipRewardItems = []

        this.updLevel()

        this.roleSprite = this.find('role/icon', cc.Sprite)
        this.updRoleSprite()

        this.addEvent(M('fight').eventType.SET_SELECT_LEVEL, () => {
            this.updLevel()
        })
        this.addEvent(M('role').eventType.SELECT, () => {
            this.updRoleSprite()
        })
    }

    updLevel() {
        this.levelLabel.string = 'Lv' + H.numAbbr(M('data').fight.selectLevel)
        if (M('data').fight.level <= 1) {
            this.prevBtn.interactable = false
            this.nextBtn.interactable = false
        } else if (M('data').fight.selectLevel <= 1) {
            this.prevBtn.interactable = false
            this.nextBtn.interactable = true
        } else if (M('data').fight.selectLevel >= M('data').fight.level) {
            this.prevBtn.interactable = true
            this.nextBtn.interactable = false
        } else {
            this.prevBtn.interactable = true
            this.nextBtn.interactable = true
        }

        if (this.chipRewardItems) {
            this.chipRewardItems.forEach(a => {
                G('pool').put(a.node, true)
            })
        }
        this.chipRewardItems = []
        let chipAssets = M('fight').getRewardChipAssets(M('data').fight.selectLevel)
        chipAssets.forEach(chipReward => {
            let item = {}
            item.node = G('pool').get(this.chipRewardItemNode)
            item.node.parent = this.chipRewardItemNode.parent
            item.chipNode = this.find('chip', item.node)
            item.roleIconSprite = this.find('roleIcon', cc.Sprite, item.node)
            item.roleIconSprite.node.active = false
            item.skillIconSprite = this.find('skillIcon', cc.Sprite, item.node)
            item.skillIconSprite.node.active = false

            if (chipReward.type == 'role') {
                item.chipNode.sprite.color = cc.color(M('role').getChipColor())
                item.roleIconSprite.node.active = true
                R('global').loadRoleSpriteFrame(chipReward.asset).then(spriteFrame => {
                    item.roleIconSprite.spriteFrame = spriteFrame
                })
            }
            if (chipReward.type == 'skill') {
                item.chipNode.sprite.color = cc.color(M('skill').getChipColor())
                item.skillIconSprite.node.active = true
                item.skillIconSprite.spriteFrame = R('global').getSkillSpriteFrame(chipReward.asset, 0)
            }
            this.chipRewardItems.push(item)
        })
    }

    updRoleSprite() {
        let selectRole = M('data').roles.find(a => a.selected)
        R('global').loadRoleSpriteFrame(selectRole.asset).then(spriteFrame => {
            this.roleSprite.spriteFrame = spriteFrame
        })
    }

    prevBtnEvent() {
        if (!this.prevBtn.interactable) return
        M('fight').setSelectLevel('-', 1)
        G('audio').playEffect('popup')
    }

    nextBtnEvent() {
        if (!this.nextBtn.interactable) return
        M('fight').setSelectLevel('+', 1)
        G('audio').playEffect('popup')
    }

    startBtnEvent() {
        let selectRoleData = M('data').roles.find(a => a.selected)
        if (!selectRoleData) {
            G('tip').error(L('error_role'))
            return
        }
        V('animMask').show('close', () => {
            M('fight').stop = true
            V('animMask').show('open', animMask => {
                animMask.remove()
                M('fight').stop = false
            })
            V('fight').show()
            V('page').remove()
        })
    }
}


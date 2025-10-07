import { _decorator } from 'cc';
import { ccBase } from '../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('fightSkillThumb')
export class fightSkillThumb extends ccBase {
    init(fight) {
        this.fight = fight
        this.player = this.fight.player
        this.itemNode = this.find('item')
        this.itemNode.active = false

        this.items = []
        this.passiveItems = []

        const createItem = () => {
            let node = H.inst(this.itemNode)
            node.parent = this.itemNode.parent
            let item = {}
            item.node = node
            item.iconSprite = this.find('icon', cc.Sprite, node)
            item.levelLabel = this.find('levelLabel', cc.Label, node)
            item.levelLabel.node.active = false
            return item
        }
        for (let i = 0; i < M('skill').getMaxNum(); i++) {
            let item = createItem()
            this.items.push(item)
        }
        for (let i = 0; i < M('skill').getMaxNum('passive'); i++) {
            let item = createItem()
            this.passiveItems.push(item)
        }

        this.addEvent(G('skill').eventType.SET_LEVEL, () => {
            this.upd()
        }, true)

        this.addEvent(G('skill').eventType.SET_PASSIVE_LEVEL, () => {
            this.updPassive()
        }, true)
    }

    upd() {
        if (!this.items) return
        let skillNames = Object.keys(M('fight').player.skill)
        H.forArr(this.items, (item, index) => {
            let skillName = skillNames[index]
            if (skillName) {
                item.levelLabel.node.active = true
                if (M('fight').player.skill[skillName].level < 10) {
                    item.levelLabel.string = M('fight').player.skill[skillName].level
                    item.levelLabel.color = cc.color('#FFFFFF')
                    item.iconSprite.spriteFrame = R('global').getSkillSpriteFrame(skillName, 0)
                } else {
                    item.levelLabel.string = 'MAX'
                    item.levelLabel.color = cc.color('#FF0000')
                    item.iconSprite.spriteFrame = R('global').getSkillSpriteFrame(skillName, 1)
                }
            } else {
                item.levelLabel.node.active = false
                item.iconSprite.spriteFrame = null
            }
        })
    }

    updPassive() {
        if (!this.passiveItems) return
        let skillNames = Object.keys(M('fight').player.passiveSkill)
        H.forArr(this.passiveItems, (item, index) => {
            let skillName = skillNames[index]
            if (skillName) {
                item.levelLabel.node.active = true
                item.iconSprite.spriteFrame = R('global').getMiscSpriteFrame(skillName)
                if (M('fight').player.passiveSkill[skillName].level < 10) {
                    item.levelLabel.string = M('fight').player.passiveSkill[skillName].level
                } else {
                    item.levelLabel.string = 'MAX'
                    item.levelLabel.color = cc.color('#FF0000')
                }
            } else {
                item.levelLabel.node.active = false
                item.iconSprite.spriteFrame = null
            }
        })
    }
}


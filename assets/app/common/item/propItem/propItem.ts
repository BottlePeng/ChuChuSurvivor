import { _decorator } from 'cc';
import { ccBase } from '../../../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('propItem')
export class propItem extends ccBase {
    init() {
        this.chipNode = this.find('chip')
        this.iconSprite = this.find('icon', cc.Sprite)
        this.roleSprite = this.find('roleIcon', cc.Sprite)
        this.randLabel = this.find('randLabel', cc.Label)
        this.randSprite = this.find('randIcon', cc.Sprite)
        this.label = this.find('Label', cc.Label)

        this.chipNode.active = false
        this.iconSprite.node.active = false
        this.roleSprite.node.active = false
        this.randLabel.node.active = false
        this.randSprite.node.active = false
    }

    updProp(key, val) {
        this.init()
        this.iconSprite.node.active = true
        this.iconSprite.spriteFrame = R('global').getMiscSpriteFrame(key)
        this.label.string = H.numAbbr(val)
    }

    updChip(chip) {
        this.init()
        this.chipNode.active = true
        if (chip.asset == '?') {
            this.randLabel.node.active = true
            this.randSprite.node.active = true
        }
        if (chip.type == 'role') {
            this.chipNode.sprite.color = cc.color(M('role').getChipColor())
            if (chip.asset == '?') {
                this.randSprite.color = cc.color(M('role').getChipColor())
                this.randLabel.string = L('hero')
            } else {
                this.roleSprite.node.active = true
                R('global').loadRoleSpriteFrame(chip.asset).then(spriteFrame => {
                    this.roleSprite.spriteFrame = spriteFrame
                })
            }
        }
        if (chip.type == 'skill') {
            this.chipNode.sprite.color = cc.color(M('skill').getChipColor())
            if (chip.asset == '?') {
                this.randSprite.color = cc.color(M('skill').getChipColor())
                this.randLabel.string = L('skill')
            } else {
                this.iconSprite.node.active = true
                this.iconSprite.spriteFrame = R('global').getSkillSpriteFrame(chip.asset, 0)
            }
        }
        this.label.string = H.numAbbr(chip.chip)
    }
}


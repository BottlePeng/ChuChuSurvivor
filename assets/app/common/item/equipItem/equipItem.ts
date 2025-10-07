import { _decorator } from 'cc';
import { ccBase } from '../../../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('equipItem')
export class equipItem extends ccBase {
    upd(equipData) {
        this.data = equipData
        this.bgNode = this.find('bg')
        this.iconSprite = this.find('icon', cc.Sprite)
        this.levelLabel = this.find('levelLabel', cc.Label)
        this.starParentNode = this.find('starParent')

        this.bgNode.color = cc.color(M('equip').getColor(equipData))
        this.levelLabel.string = 'Lv' + H.numAbbr(equipData.level)

        this.starParentNode.children.forEach((starNode, index) => {
            if (equipData.star >= (index + 1)) {
                starNode.active = true
            } else {
                starNode.active = false
            }
        })

        R('global').loadEquipSpriteFrame(equipData.type, equipData.pos).then(spriteFrame => {
            this.iconSprite.spriteFrame = spriteFrame
        })
    }
}


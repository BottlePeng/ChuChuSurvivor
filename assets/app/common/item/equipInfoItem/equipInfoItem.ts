import { _decorator } from 'cc';
import { ccBase } from '../../../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('equipInfoItem')
export class equipInfoItem extends ccBase {
    upd(data, otherData) {
        if (!data) return data
        this.data = data
        this.otherData = otherData

        this.HPLabel = this.find('HP/Label', cc.Label)
        this.HPLabel.node.parent.active = false

        this.ATKLabel = this.find('ATK/Label', cc.Label)
        this.ATKLabel.node.parent.active = false

        this.attrItemNode = this.find('attrParent/attrItem')
        this.attrItemNode.active = false
        this.skillAttrItemNode = this.find('attrParent/skillAttrItem')
        this.skillAttrItemNode.active = false

        this.equipItem = this.find('equipItem', 'equipItem')
        this.equipItem.upd(this.data)

        if ('HP' in this.data) {
            this.HPLabel.node.parent.active = true
            this.HPLabel.string = H.numAbbr(this.data.HP)
        }
        if ('ATK' in this.data) {
            this.ATKLabel.node.parent.active = true
            this.ATKLabel.string = H.numAbbr(this.data.ATK)
        }
        if (this.attrItems) {
            H.forArr(this.attrItems, a => {
                G('pool').put(a.node, true)
            })
        }
        this.attrItems = []
        if (this.data.attrs) {
            this.find('attrParent/noAttrLabel').active = false
            H.forArr(M('role').getAttrs('base'), attr => {
                H.forArr(this.data.attrs, equipAttr => {
                    if (attr.key == equipAttr.key) {
                        let attrItem = {}
                        attrItem.node = G('pool').get(this.attrItemNode)
                        attrItem.node.parent = this.attrItemNode.parent
                        attrItem.data = equipAttr
                        attrItem.titleLabel = this.find('titleLabel', cc.Label, attrItem.node)
                        attrItem.label = this.find('Label', cc.Label, attrItem.node)
                        attrItem.titleLabel.string = attr.name
                        attrItem.label.string = '+' + equipAttr.value + '%'
                        this.attrItems.push(attrItem)
                    }
                })
            })

            H.forArr(M('role').getAttrs('skill'), attr => {
                H.forArr(this.data.attrs, equipAttr => {
                    if (attr.key == equipAttr.key) {
                        let attrItem = {}
                        attrItem.node = G('pool').get(this.skillAttrItemNode)
                        attrItem.node.parent = this.skillAttrItemNode.parent
                        attrItem.data = equipAttr
                        attrItem.label = this.find('Label', cc.Label, attrItem.node)
                        attrItem.iconSprite = this.find('icon', cc.Sprite, attrItem.node)
                        let asset = equipAttr.key.substr(0, equipAttr.key.length - 7)
                        attrItem.iconSprite.spriteFrame = R('global').getSkillSpriteFrame(asset, 0)
                        attrItem.label.string = '+' + equipAttr.value + '%'
                        this.attrItems.push(attrItem)
                    }
                })
            })
        } else {
            this.find('attrParent/noAttrLabel').active = true
        }

        const updArrow = (node, val, otherVal) => {
            if (!node) return
            node.active = false
            if (this.otherData == false) return
            if (val == '+') {
                node.active = true
                node.scaleY = 1
                node.sprite.color = cc.color('#00FF00')
                return
            }
            if (val == '-') {
                node.active = true
                node.scaleY = -1
                node.sprite.color = cc.color('#FF0000')
                return
            }
            if (val > otherVal) {
                node.active = true
                node.scaleY = 1
                node.sprite.color = cc.color('#00FF00')
            } else if (val < otherVal) {
                node.active = true
                node.scaleY = -1
                node.sprite.color = cc.color('#FF0000')
            }
        }

        let arrowNode = this.find('HP/arrow')
        if (arrowNode) arrowNode.active = false
        if (!this.otherData) updArrow(arrowNode, '+')
        arrowNode = this.find('ATK/arrow')
        if (arrowNode) arrowNode.active = false
        if (!this.otherData) updArrow(arrowNode, '+')
        H.forArr(this.attrItems, a => {
            let arrowNode = this.find('arrow', a.node)
            if (arrowNode) arrowNode.active = false
            if (!this.otherData) updArrow(arrowNode, '+')
        })

        if (this.otherData) {
            let arrowNode = this.find('HP/arrow')
            arrowNode.active = false
            if ('HP' in this.data && 'HP' in this.otherData) {
                updArrow(arrowNode, this.data.HP, this.otherData.HP)
            }
            arrowNode = this.find('ATK/arrow')
            arrowNode.active = false
            if ('ATK' in this.data && 'ATK' in this.otherData) {
                updArrow(arrowNode, this.data.ATK, this.otherData.ATK)
            }
            H.forArr(this.attrItems, a => {
                let arrowNode = this.find('arrow', a.node)
                if (!arrowNode) return
                arrowNode.active = false
                if (this.otherData.attrs) {
                    let otherDataAttr = this.otherData.attrs.find(b => b.key == a.data.key)
                    if (otherDataAttr) {
                        updArrow(arrowNode, a.data.value, otherDataAttr.value)
                    }
                } else {
                    updArrow(arrowNode, '+')
                }
            })
        }
    }
}


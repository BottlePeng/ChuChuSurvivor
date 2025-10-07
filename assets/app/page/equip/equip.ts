import { _decorator } from 'cc';
import { ccBase } from '../../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('equip')
export class equip extends ccBase {
    start() {
        this.addBtnEvents()

        this.selectRoleData = M('data').roles.find(a => a.selected)

        this.HPLabel = this.find('HP/Label', cc.Label)
        this.ATKLabel = this.find('ATK/Label', cc.Label)

        this.attrItemNode = this.find('attrParent/attrItem')
        this.attrItemNode.active = false
        this.skillAttrItemNode = this.find('attrParent/skillAttrItem')
        this.skillAttrItemNode.active = false

        this.equipBtn = this.find('equipBtn', cc.Button)
        this.equipNumLabel = this.find('Label', cc.Label, this.equipBtn.node)

        this.updEquipBtn()

        this.initEquipItems()
        this.initRoleDataItems()

        this.addEvent(M('equip').eventType.ADD, () => {
            this.initEquipItems()
            this.initRoleDataItems()
        })

        this.addEvent(M('prop').eventType.SET_NUM.equipNum, () => {
            this.updEquipBtn()
        })

        this.addEvent(M('equip').eventType.UP_LEVEL, () => {
            this.initEquipItems()
            this.initRoleDataItems()
        })
    }

    initEquipItems() {
        if (this.equipItems) {
            H.forArr(this.equipItems, a => {
                G('pool').put(a.node, true)
            })
        }
        this.equipItems = []
        H.forArr(this.find('equipParent').children, (a, index) => {
            let equipType = (index + 1)
            a.children.forEach(posNode => {
                let pos = posNode.name
                let equipData = M('equip').getData(equipType, pos)
                if (equipData) {
                    let equipItem = G('pool').get(G('asset').getPrefab('equipItem'), 'equipItem', posNode)
                    equipItem.upd(equipData)
                    equipItem.node.on('touch-end', e => {
                        V('equipInfo').show(equipData)
                    })
                    this.equipItems.push(equipItem)
                }
            })
        })
    }

    initRoleDataItems() {
        let roleData = M('role').createPlayerData(this.selectRoleData.asset)
        this.HPLabel.string = H.numAbbr(roleData.HP)
        this.ATKLabel.string = H.numAbbr(roleData.ATK)
        if (this.attrItems) {
            H.forArr(this.attrItems, a => {
                G('pool').put(a.node)
            })
        }
        this.attrItems = []
        H.forArr(M('role').getAttrs('base'), attr => {
            if (roleData[attr.key] > 0) {
                let attrItem = {}
                attrItem.node = G('pool').get(this.attrItemNode)
                attrItem.node.parent = this.attrItemNode.parent
                attrItem.titleLabel = this.find('titleLabel', cc.Label, attrItem.node)
                attrItem.label = this.find('Label', cc.Label, attrItem.node)
                attrItem.titleLabel.string = attr.name
                attrItem.label.string = '+' + roleData[attr.key] + '%'
                this.attrItems.push(attrItem)
            }
        })

        H.forArr(M('role').getAttrs('skill'), attr => {
            if (roleData[attr.key] > 0) {
                let attrItem = {}
                attrItem.node = G('pool').get(this.skillAttrItemNode)
                attrItem.node.parent = this.skillAttrItemNode.parent
                attrItem.label = this.find('Label', cc.Label, attrItem.node)
                attrItem.iconSprite = this.find('icon', cc.Sprite, attrItem.node)
                attrItem.iconSprite.spriteFrame = R('global').getSkillSpriteFrame(attr.asset, 0)
                attrItem.label.string = '+' + roleData[attr.key] + '%'
                this.attrItems.push(attrItem)
            }
        })
        if (this.attrItems.length > 0) {
            this.attrItemNode.parent.active = true
        } else {
            this.attrItemNode.parent.active = false
        }
    }

    updEquipBtn() {
        this.equipBtn.interactable = M('data').prop.equipNum > 0
        this.equipNumLabel.string = 'x' + H.num(M('data').prop.equipNum)
    }

    equipBtnEvent() {
        let preAddRes = M('equip').preAdd()
        if (!H.isEmpty(preAddRes.error)) {
            G('tip').error(L(preAddRes.error.equipNum))
            return
        }
        let equipData = M('equip').createData({
            level: M('data').fight.level
        })
        if (M('equip').checkSetting(equipData)) {
            V('addEquip').show(equipData)
        } else {
            G('audio').playEffect('coin')
            let sellRes = M('equip').calSell(equipData)
            for (let key in sellRes) {
                if (key == 'gold') {
                    M('prop').setNum('gold', '+', sellRes[key])
                    G('tip').success('+' + H.numAbbr(sellRes[key]), {spriteFrame: R('global').getMiscSpriteFrame('gold')})
                }
            }
        }
    }
}


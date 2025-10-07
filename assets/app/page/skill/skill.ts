import { _decorator } from 'cc';
import { ccBase } from '../../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('skill')
export class skill extends ccBase {
    start() {
        this.addBtnEvents()

        this.chipItemNode = this.find('chipItem')
        this.chipItemNode.active = false
        this.initChipItems()

        this.itemNode = this.find('upSkillItem')
        this.itemNode.active = false
        this.initItems()

        this.allUpBtn = this.find('allUpBtn', cc.Button)
        this.updAllUpBtn()

        this.skillHelpHPLabel = this.find('skillHelp/HP/Label', cc.Label)
        this.skillHelpATKLabel = this.find('skillHelp/ATK/Label', cc.Label)
        this.updSkillHelp()

        this.addEvent(M('skill').eventType.SET_CHIP, asset => {
            this.updChipItem(asset)
            this.updItems()
            this.updAllUpBtn()
        })

        this.addEvent(M('skill').eventType.UP_LEVEL, () => {
            this.updItems()
            this.updSkillHelp()
            this.updAllUpBtn()
        })

        this.addEvent(M('prop').eventType.SET_NUM.gold, () => {
            this.updItems()
            this.updAllUpBtn()
        })
    }

    initChipItems() {
        this.chipItems = []
        H.forArr(M('skill').getBaseDatas(), a => {
            let item = {}
            item.node = H.inst(this.chipItemNode)
            item.node.parent = this.chipItemNode.parent
            item.asset = a.name
            item.iconSprite = this.find('icon', cc.Sprite, item.node)
            item.iconSprite.spriteFrame = R('global').getSkillSpriteFrame(item.asset, 0)
            item.label = this.find('Label', cc.Label, item.node)
            item.label.string = H.numAbbr(M('skill').getChip(item.asset))
            this.chipItems.push(item)
        })
    }

    updChipItem(asset) {
        let item = this.chipItems.find(a => a.asset == asset)
        if (!item) return
        item.label.string = H.numAbbr(M('skill').getChip(asset))
    }

    initItems() {
        if (this.items) {
            H.forArr(this.items, a => {
                G('pool').put(a.node, true)
            })
        }
        this.items = []
        H.forArr(M('skill').getBaseDatas(), a => {
            let item = {}
            item.node = G('pool').get(this.itemNode)
            item.node.parent = this.itemNode.parent
            item.asset = a.name
            item.iconSprite = this.find('skill/icon', cc.Sprite, item.node)
            item.iconSprite.spriteFrame = R('global').getSkillSpriteFrame(item.asset, 0)
            item.goldLabel = this.find('gold/Label', cc.Label, item.node)
            item.goldLabel.string = 0
            item.chipLabel = this.find('chip/Label', cc.Label, item.node)
            item.chipLabel.string = 0
            item.upBtn = this.find('upBtn', cc.Button, item.node)

            item.levelLabel = this.find('levelLabel', cc.Label, item.upBtn.node)
            item.levelLabel.string = 'Lv0'

            item.upBtn.node.on('touch-end', e => {
                E.stop(e)
                this.upLevel(item.asset)
            })

            item.iconSprite.node.parent.on('touch-end', e => {
                E.stop(e)
                V('skillInfo').show(item.asset)
            })

            this.items.push(item)
        })
        this.items.forEach(a => {
            this.updItem(a.asset)
        })
    }

    updItem(asset) {
        let item = this.items.find(a => a.asset == asset)
        if (!item) return
        item.levelLabel.string = 'Lv' + H.numAbbr(M('skill').getLevel(asset))

        let calRes = M('skill').calUpLevel(asset, 1)
        item.goldLabel.string = H.numAbbr(calRes.gold)
        item.chipLabel.string = H.numAbbr(calRes.chip)
        item.upBtn.interactable = true
        if (calRes.error.gold) {
            item.upBtn.interactable = false
            item.goldLabel.color = cc.color('#FF0000')
        } else {
            item.goldLabel.color = cc.color('#FFFFFF')
        }
        if (calRes.error.chip) {
            item.upBtn.interactable = false
            item.chipLabel.color = cc.color('#FF0000')
        } else {
            item.chipLabel.color = cc.color('#FFFFFF')
        }
    }

    updItems() {
        if (!this.items) return
        H.forArr(this.items, a => {
            this.updItem(a.asset)
        })
    }

    upLevel(asset) {
        let upRes = M('skill').upLevel(asset, 1)
        if (!H.isEmpty(upRes.error)) {
            for (let key in upRes.error) {
                let color = '#FFFFFF'
                if (key == 'chip') color = M('skill').getChipColor()
                G('tip').error(upRes.error[key], {spriteFrame: R('global').getMiscSpriteFrame(key), spriteColor: color})
            }
            return
        }
        G('audio').playEffect('upLevel')
        G('tip').success(L('success_upLevel'))

        let item = this.items.find(a => a.asset == asset)
        if (!item) return
        G('effect').create('upLevel', {parentNode: item.iconSprite.node})
    }

    updAllUpBtn() {
        let arr = M('skill').getAllUpDatas()
        this.allUpBtn.interactable = M('skill').isTip() && arr.length > 0
    }

    updSkillHelp() {
        let helpData = M('role').getHelpData('skill')
        this.skillHelpHPLabel.string = H.numAbbr(helpData.HP)
        this.skillHelpATKLabel.string = H.numAbbr(helpData.ATK)
    }

    allUpBtnEvent() {
        if (!this.allUpBtn.interactable) {
            G('tip').error(L('error_no_upLevel'))
            return
        }
        let arr = M('skill').getAllUpDatas()
        H.forArr(arr, a => {
            let calRes = M('skill').calUpLevel(a.asset, 1)
            if (H.isEmpty(calRes.error)) this.upLevel(a.asset)
        })
    }

    faqBtnEvent() {
        G('tip').text(L('skillHelpTip'), {touchClose: true})
    }
}


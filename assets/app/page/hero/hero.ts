import { _decorator } from 'cc';
import { ccBase } from '../../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('hero')
export class hero extends ccBase {
    start() {
        this.addBtnEvents()

        this.upItemNode = this.find('upRoleItem')
        this.buyItemNode = this.find('buyRoleItem')
        this.upItemNode.active = false
        this.buyItemNode.active = false

        this.chipItemNode = this.find('chipItem')
        this.chipItemNode.active = false

        this.ATKLevelBtn = this.find('ATKLevelBtn', cc.Button)
        this.ATKLevelBtn.tipDotNode = this.find('tipDot', this.ATKLevelBtn.node)
        this.ATKLevelBtn.tipDotNode.active = false

        this.HPLevelBtn = this.find('HPLevelBtn', cc.Button)
        this.HPLevelBtn.tipDotNode = this.find('tipDot', this.HPLevelBtn.node)
        this.HPLevelBtn.tipDotNode.active = false

        this.allUpBtn = this.find('allUpBtn', cc.Button)
        this.updAllUpBtn()

        this.updTipDot()

        this.scrollView = this.find('Mask', cc.ScrollView)
        this.roleHelpHPLabel = this.find('roleHelp/HP/Label', cc.Label)
        this.roleHelpATKLabel = this.find('roleHelp/ATK/Label', cc.Label)

        this.initChipItems()
        this.initUpItems()
        this.initBuyItems()

        this.updRoleHelp()
        this.updSelectScroll()

        this.setUpType(M('data').upType)

        this.addEvent(M('role').eventType.SELECT, asset => {
            this.setUpItemSelect(asset)
            this.updUpItems()
            this.updRoleHelp()
        })

        this.addEvent(M('role').eventType.ADD, asset => {
            this.initUpItems()
            this.initBuyItems()
            this.updRoleHelp()
            this.updAllUpBtn()
        })

        this.addEvent(M('role').eventType.SET_CHIP, asset => {
            this.updChipItem(asset)
            this.updUpItems()
            this.updBuyItems()
            this.updTipDot()
            this.updAllUpBtn()
        })

        this.addEvent(M('role').eventType.UP_LEVEL, asset => {
            this.updUpItems()
            this.updRoleHelp()
            this.updAllUpBtn()
        })

        this.addEvent(M('prop').eventType.SET_NUM.gold, () => {
            this.updUpItems()
            this.updBuyItems()
            this.updTipDot()
            this.updAllUpBtn()
        })
    }

    initChipItems() {
        this.chipItems = []
        H.forArr(M('role').getPlayerBaseDatas(), a => {
            let item = {}
            item.node = H.inst(this.chipItemNode)
            item.node.parent = this.chipItemNode.parent
            item.iconSprite = this.find('icon', cc.Sprite, item.node)
            R('global').loadRoleSpriteFrame(a.asset).then(spriteFrame => {
                item.iconSprite.spriteFrame = spriteFrame
            })
            item.label = this.find('Label', cc.Label, item.node)
            item.label.string = H.numAbbr(M('role').getChip(a.asset))
            item.asset = a.asset
            this.chipItems.push(item)
        })
    }

    updChipItem(asset) {
        let item = this.chipItems.find(a => a.asset == asset)
        if (!item) return
        item.label.string = H.numAbbr(M('role').getChip(asset))
    }

    initUpItems() {
        if (this.upItems) {
            H.forArr(this.upItems, a => {
                G('pool').put(a.node, true)
            })
        }
        this.upItems = []
        H.forArr(M('data').roles, a => {
            let item = {}
            item.node = G('pool').get(this.upItemNode)
            item.node.parent = this.upItemNode.parent
            item.asset = a.asset
            item.iconSprite = this.find('role/icon', cc.Sprite, item.node)
            R('global').loadRoleSpriteFrame(a.asset).then(spriteFrame => {
                item.iconSprite.spriteFrame = spriteFrame
            })
            item.skillIconSprite = this.find('role/skillIcon', cc.Sprite, item.node)
            let baseData = M('role').getPlayerBaseData(item.asset)
            item.skillIconSprite.spriteFrame = R('global').getSkillSpriteFrame(baseData.skillName, 0)

            item.ATKLabel = this.find('ATK/Label', cc.Label, item.node)
            item.ATKLabel.string = 0
            item.HPLabel = this.find('HP/Label', cc.Label, item.node)
            item.HPLabel.string = 0
            item.goldLabel = this.find('gold/Label', cc.Label, item.node)
            item.goldLabel.string = 0
            item.chipLabel = this.find('chip/Label', cc.Label, item.node)
            item.chipLabel.string = 0
            item.upBtn = this.find('upBtn', cc.Button, item.node)
            item.upBtn.levelIconSprite = this.find('levelTypeIcon', cc.Sprite, item.upBtn.node)
            item.upBtn.levelLabel = this.find('levelLabel', cc.Label, item.upBtn.node)
            item.selectedNode = this.find('selected', item.node)
            item.selectedNode.active = false

            item.upBtn.node.on('touch-end', e => {
                E.stop(e)
                this.upLevel(item.asset)
            })
            item.node.on('touch-end', e => {
                let playerData = M('role').getPlayerData(item.asset)
                if (playerData.selected) return
                G('audio').playEffect('ding')
                M('role').setSelect(item.asset)
            })
            this.upItems.push(item)
        })
        H.forArr(this.upItems, a => {
            this.updUpItem(a.asset)
        })
    }

    updUpItem(asset) {
        let item = this.upItems.find(a => a.asset == asset)
        if (!item) return

        let roleData = M('role').getPlayerData(asset)
        item.selectedNode.active = roleData.selected
        let spriteFrame
        if (M('data').upType == 'ATK') {
            spriteFrame = this.find('icon', cc.Sprite, this.ATKLevelBtn.node).spriteFrame
        } else {
            spriteFrame = this.find('icon', cc.Sprite, this.HPLevelBtn.node).spriteFrame
        }
        item.upBtn.levelIconSprite.spriteFrame = spriteFrame
        let level = roleData[M('data').upType + 'Level']
        item.upBtn.levelLabel.string = 'Lv' + H.numAbbr(level)

        let roleFightData = M('role').createPlayerData(asset)
        item.ATKLabel.string = H.numAbbr(roleFightData.ATK)
        item.HPLabel.string = H.numAbbr(roleFightData.HP)

        let upRes = M('role').calUpLevel(asset, M('data').upType, 1)
        item.goldLabel.string = H.numAbbr(upRes.gold)
        item.chipLabel.string = H.numAbbr(upRes.chip)
        item.upBtn.interactable = true
        if (upRes.error.gold) {
            item.upBtn.interactable = false
            item.goldLabel.color = cc.color('#FF0000')
        } else {
            item.goldLabel.color = cc.color('#FFFFFF')
        }
        if (upRes.error.chip) {
            item.upBtn.interactable = false
            item.chipLabel.color = cc.color('#FF0000')
        } else {
            item.chipLabel.color = cc.color('#FFFFFF')
        }
    }

    updUpItems() {
        if (!this.upItems) return
        H.forArr(this.upItems, a => {
            this.updUpItem(a.asset)
        })
    }

    upLevel(asset) {
        let upRes = M('role').upLevel(asset, M('data').upType, 1)
        if (!H.isEmpty(upRes.error)) {
            for (let key in upRes.error) {
                let color = '#FFFFFF'
                if (key == 'chip') color = M('role').getChipColor()
                G('tip').error(upRes.error[key], {spriteFrame: R('global').getMiscSpriteFrame(key), spriteColor: color})
            }
            return
        }
        G('audio').playEffect('upLevel')
        G('tip').success(L('success_upLevel'))
        let item = this.upItems.find(a => a.asset == asset)
        if (!item) return
        G('effect').create('upLevel', {parentNode: item.iconSprite.node})
    }

    initBuyItems() {
        if (this.buyItems) {
            H.forArr(this.buyItems, a => {
                G('pool').put(a.node, true)
            })
        }
        this.buyItems = []
        let datas = M('role').getPlayerBaseDatas().filter(a => {
            let roleData = M('data').roles.find(b => a.asset == b.asset)
            return !roleData
        })
        H.forArr(datas, a => {
            let item = {}
            item.node = G('pool').get(this.buyItemNode)
            item.node.parent = this.buyItemNode.parent
            item.asset = a.asset

            item.iconSprite = this.find('role/icon', cc.Sprite, item.node)
            R('global').loadRoleSpriteFrame(a.asset).then(spriteFrame => {
                item.iconSprite.spriteFrame = spriteFrame
            })
            item.skillIconSprite = this.find('role/skillIcon', cc.Sprite, item.node)
            let baseData = M('role').getPlayerBaseData(item.asset)
            item.skillIconSprite.spriteFrame = R('global').getSkillSpriteFrame(baseData.skillName, 0)
            item.goldLabel = this.find('gold/Label', cc.Label, item.node)
            item.goldLabel.string = 0
            item.chipLabel = this.find('chip/Label', cc.Label, item.node)
            item.chipLabel.string = 0
            item.buyBtn = this.find('buyBtn', cc.Button, item.node)

            item.buyBtn.node.on('touch-end', e => {
                E.stop(e)
                this.buyRole(item.asset)
            })

            item.node.on('touch-end', e => {
                G('tip').error(L('error_select_role'))
            })
            this.buyItems.push(item)
        })
        this.buyItems.forEach(a => {
            this.updBuyItem(a.asset)
        })
    }

    updBuyItem(asset) {
        let item = this.buyItems.find(a => a.asset == asset)
        if (!item) return

        let addRes = M('role').calAdd(asset)
        item.goldLabel.string = H.numAbbr(addRes.gold)
        item.chipLabel.string = H.numAbbr(addRes.chip)
        item.buyBtn.interactable = true
        if (addRes.error.gold) {
            item.buyBtn.interactable = false
            item.goldLabel.color = cc.color('#FF0000')
        } else {
            item.goldLabel.color = cc.color('#FFFFFF')
        }
        if (addRes.error.chip) {
            item.buyBtn.interactable = false
            item.chipLabel.color = cc.color('#FF0000')
        } else {
            item.chipLabel.color = cc.color('#FFFFFF')
        }
    }

    updBuyItems() {
        H.forArr(this.buyItems, a => {
            this.updBuyItem(a.asset)
        })
    }

    buyRole(asset) {
        let res = M('role').add(asset)
        if (!H.isEmpty(res.error)) {
            for (let key in res.error) {
                let color = '#FFFFFF'
                if (key == 'chip') color = M('role').getChipColor()
                G('tip').error(res.error[key], {spriteFrame: R('global').getMiscSpriteFrame(key), spriteColor: color})
            }
            return
        }
        G('tip').success(L('success_buy'))
    }

    updAllUpBtn() {
        let allUpPlayers = M('role').getAllUpDatas(M('data').upType)
        if (M('data').upType == 'ATK') {
            this.allUpBtn.interactable = M('role').isTip('upLevel', 'ATK') && allUpPlayers.length > 0
        }
        if (M('data').upType == 'HP') {
            this.allUpBtn.interactable = M('role').isTip('upLevel', 'HP') && allUpPlayers.length > 0
        }
    }

    updTipDot() {
        this.scheduleOnce(() => {
            this.ATKLevelBtn.tipDotNode.active = M('role').isTip('upLevel', 'ATK')
            this.HPLevelBtn.tipDotNode.active = M('role').isTip('upLevel', 'HP')
        })
    }

    updRoleHelp() {
        let roleHelpData = M('role').getHelpData('role')
        this.roleHelpHPLabel.string = H.numAbbr(roleHelpData.HP)
        this.roleHelpATKLabel.string = H.numAbbr(roleHelpData.ATK)
    }

    updSelectScroll() {
        if (!this.upItems) return
        let mul = 0
        let selectItem
        H.forArr(this.upItems, (a, index) => {
            let playerData = M('role').getPlayerData(a.asset)
            if (playerData.selected) {
                mul = index
                selectItem = a
            }
        })
        let itemOffsetY = (selectItem.node.sizeH * mul) + (mul * 20)
        this.scheduleOnce(() => {
            this.scrollView.scrollToOffset(cc.v2(0, itemOffsetY), 0)
        })
    }

    setUpType(upType) {
        M('data').upType = upType
        if (upType == 'ATK') {
            this.ATKLevelBtn.interactable = false
            this.HPLevelBtn.interactable = true
        } else {
            this.ATKLevelBtn.interactable = true
            this.HPLevelBtn.interactable = false
        }
        H.forArr(this.upItems, item => {
            this.updUpItem(item.asset)
        })
        this.updAllUpBtn()
    }

    setUpItemSelect(asset) {
        this.upItems.forEach(a => {
            a.selectedNode.active = false
        })
        let item = this.upItems.find(a => a.asset == asset)
        if (!item) return
        item.selectedNode.active = true
    }

    ATKLevelBtnEvent() {
        if (!this.ATKLevelBtn.interactable) return
        this.setUpType('ATK')
        G('audio').playEffect('popup')
    }

    HPLevelBtnEvent() {
        if (!this.HPLevelBtn.interactable) return
        this.setUpType('HP')
        G('audio').playEffect('popup')
    }

    allUpBtnEvent() {
        if (!this.allUpBtn.interactable) {
            G('tip').error(L('error_no_upLevel'))
            return
        }
        let allUpPlayers = M('role').getAllUpDatas(M('data').upType)
        H.forArr(allUpPlayers, a => {
            let calRes = M('role').calUpLevel(a.asset, M('data').upType, 1)
            if (H.isEmpty(calRes.error)) {
                this.upLevel(a.asset)
            }
        })
    }

    faqBtnEvent() {
        G('tip').text(L('roleHelpTip'), {touchClose: true})
    }
}


import { _decorator } from 'cc';
import { ccBase } from '../../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('achive')
export class achive extends ccBase {
    start() {
        this.itemNode = this.find('item')
        this.itemNode.active = false

        this.initItems()

        this.addEvent(M('achive').eventType.INC_COUNT, (type, assetOrKey) => {
            this.updItem(type, assetOrKey)
        })

        this.addEvent(M('achive').eventType.INC_LEVEL, (type, assetOrKey) => {
            this.updItem(type, assetOrKey)
        })
    }

    createItem() {
        let item = {}
        item.node = G('pool').get(this.itemNode)
        item.node.parent = this.itemNode.parent
        item.roleSprite = this.find('layout/roleIcon', cc.Sprite, item.node)
        item.iconSprite = this.find('layout/icon', cc.Sprite, item.node)
        item.levelLabel = this.find('layout/levelLabel', cc.Label, item.node)
        item.desLabel = this.find('desLabel', cc.Label, item.node)
        item.totalLabel = this.find('totalLabel', cc.Label, item.node)
        item.progressBar = this.find('progressBar', cc.ProgressBar, item.node)
        item.progressBar.progress = 0
        item.progressBar.label = this.find('Label', cc.Label, item.progressBar.node)
        item.progressBar.label.string = '0 / 0'
        item.reward = {}
        item.reward.node = this.find('reward', item.node)
        item.reward.label = this.find('Label', cc.Label, item.reward.node)
        item.roleSprite.node.active = false
        item.iconSprite.node.active = false
        item.reward.node.active = false
        return item
    }

    initItems() {
        if (this.items) {
            H.forArr(this.items, a => {
                G('pool').put(a.node, true)
            })
        }
        this.items = []
        //保证排序
        for (let type in M('achive').defData) {
            if (type != 'useRole' && type != 'useSkill' && type != 'usePassiveSkill') {
                for (let assetOrKey in M('achive').defData[type]) {
                    let item = this.createItem()
                    item.type = type
                    item.assetOrKey = assetOrKey
                    item.desLabel.string = L('achiveInfo.' + type + '.' + assetOrKey)
                    item.iconSprite.node.active = true
                    item.iconSprite.spriteFrame = R('global').getMiscSpriteFrame(assetOrKey)
                    this.items.push(item)
                }
            } else {
                let baseDatas
                let dataKey
                if (type == 'useRole') {
                    baseDatas = M('role').getPlayerBaseDatas()
                    dataKey = 'asset'
                }
                if (type == 'useSkill') {
                    baseDatas = M('skill').getBaseDatas()
                    dataKey = 'name'
                }
                if (type == 'usePassiveSkill') {
                    baseDatas = M('skill').getPassiveBaseDatas()
                    dataKey = 'name'
                }
                H.forArr(baseDatas, a => {
                    let item = this.createItem()
                    item.type = type
                    item.assetOrKey = a[dataKey]
                    item.desLabel.string = L('achiveInfo.' + type)
                    if (type == 'useRole') {
                        item.roleSprite.node.active = true
                        R('global').loadRoleSpriteFrame(item.assetOrKey).then(spriteFrame => {
                            item.roleSprite.spriteFrame = spriteFrame
                        })
                    }
                    if (type == 'useSkill') {
                        item.iconSprite.node.active = true
                        item.iconSprite.spriteFrame = R('global').getSkillSpriteFrame(item.assetOrKey, 1)
                    }
                    if (type == 'usePassiveSkill') {
                        item.iconSprite.node.active = true
                        item.iconSprite.spriteFrame = R('global').getMiscSpriteFrame(item.assetOrKey)
                    }
                    this.items.push(item)
                })
            }
        }

        H.forArr(this.items, item => {
            item.reward.node.on('touch-end', e => {
                E.stop(e)
                if (!M('achive').isDone(item.type, item.assetOrKey)) {
                    G('tip').error(L('error_action'))
                    return
                }
                M('achive').incLevel(item.type, item.assetOrKey)
                let reward = M('achive').getReward(item.type, item.assetOrKey)
                M('game').setReward(reward)
                G('tip').reward(reward)
            })
            this.updItem(item.type, item.assetOrKey)
        })
    }

    updItem(type, assetOrKey) {
        if (!this.items) return
        let item = this.items.find(a => a.type == type && a.assetOrKey == assetOrKey)
        if (!item) return
        item.totalLabel.string = L('total') + ': ' + H.numAbbr(M('achive').getTotal(item.type, item.assetOrKey))
        let count = M('achive').getCount(type, assetOrKey)
        let nextCount = M('achive').getNextCount(type, assetOrKey)
        item.progressBar.progress = count / nextCount
        item.progressBar.label.string = H.numAbbr(count) + ' / ' + H.numAbbr(nextCount)

        let level = M('achive').getLevel(type, assetOrKey)
        item.levelLabel.string = 'Lv' + H.numAbbr(level)
        if (level > 0) {
            item.levelLabel.color = cc.color('#F6DB96')
        } else {
            item.levelLabel.color = cc.color('#888888')
        }
        item.reward.node.active = M('achive').isDone(type, assetOrKey)
        if (item.reward.node.active) {
            let reward = M('achive').getReward(item.type, item.assetOrKey)
            item.reward.label.string = H.numAbbr(reward.prop.gold)
        }
    }
}


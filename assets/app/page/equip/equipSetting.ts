import { _decorator} from 'cc';
import { ccBase } from '../../base/component/ccBase';
const { ccclass } = _decorator;

enum State {
    OPEN = 1,
    CLOSE = 2,
}

@ccclass('equipSetting')
export class equipSetting extends ccBase {
    start() {
        this.selectNode = this.find('select')
        this.selectNode.active = false

        this.arrowNode = this.find('arrow')
        this.arrowNode.scaleY = -1

        this.parentNode = this.find('parent')
        this.rankItemNode = this.find('rankItem')
        this.rankItemNode.active = false
        this.starItemNode = this.find('starItem')
        this.starItemNode.active = false

        this.allRankItem = {}
        this.allRankItem.node = this.find('allIRankItem')
        this.allRankItem.checkmarkNode = this.find('checkmark', this.allRankItem.node)
        this.allRankItem.checkmarkNode.active = false

        this.allStarItem = {}
        this.allStarItem.node = this.find('allStarItem')

        this.allStarItem.checkmarkNode = this.find('checkmark', this.allStarItem.node)
        this.allRankItem.checkmarkNode.active = false

        this.rankSelectedItemNode = this.find('rankSelectedItem')
        this.rankSelectedItemNode.active = false
        this.starSelectedItemNode = this.find('starSelectedItem')
        this.starSelectedItemNode.active = false
        this.updSelectedItem()

        this.selectedNode = this.find('selected')
        this.selectedNode.active = true

        this.state = State.CLOSE

        this.initItems()

        this.allRankItem.node.on('touch-end', e => {
            E.stop(e)
            M('setting').setOpenEquip('rank', '*')
        })

        this.allStarItem.node.on('touch-end', e => {
            E.stop(e)
            M('setting').setOpenEquip('star', '*')
        })

        this.node.on('touch-end', e => {
            E.stop(e)
            this.openOrClose()
        })

        this.selectNode.on('touch-end', e => {
            E.stop(e)
        })

        this.addEvent(M('setting').eventType.SET_OPEN_EQUIP.rank, () => {
            this.updRankItems()
        })

        this.addEvent(M('setting').eventType.SET_OPEN_EQUIP.star, () => {
            this.updStarItems()
        })
    }

    openOrClose() {
        cc.Tween.stopAllByTarget(this.selectNode)
        if (this.state == State.CLOSE) {
            this.selectedNode.active = false
            this.state = State.OPEN
            this.selectNode.sizeH = 0
            this.selectNode.active = true
            cc.tween(this.selectNode)
            .to(0.2, {sizeH: this.parentNode.sizeH})
            .start()
        } else {
            this.selectedNode.active = true
            this.state = State.CLOSE
            cc.tween(this.selectNode)
            .to(0.1, {sizeH: 0})
            .call(() => {
                this.selectNode.active = false
            })
            .start()
        }
        this.arrowNode.scaleY = this.state == State.CLOSE ? -1 : 1
    }

    updSelectedItem() {
        this.rankSelectedItemNode.active = M('data').setting.openEquip.rank != '*'
        if (this.rankSelectedItemNode.active) {
            this.find('icon', cc.Sprite, this.rankSelectedItemNode).color = cc.color(M('equip').getColor({rank: M('data').setting.openEquip.rank}))
        }
        this.starSelectedItemNode.active = M('data').setting.openEquip.star != '*'
        if (this.starSelectedItemNode.active) {
            this.find('starLabel', cc.Label, this.starSelectedItemNode).string = M('data').setting.openEquip.star
        }
    }

    initItems() {
        if (this.rankItems) {
            H.forArr(this.rankItems, a => {
                G('pool').put(a.node, true)
            })
        }
        this.rankItems = []
        if (this.starItems) {
            H.forArr(this.starItems, a => {
                G('pool').put(a.node, true)
            })
        }
        this.starItems = []

        for(let i = 1; i <= 5; i++) {
            let rankItem = {}
            rankItem.rank = i
            rankItem.node = G('pool').get(this.rankItemNode)
            rankItem.node.parent = this.rankItemNode.parent
            rankItem.iconNode = this.find('icon', rankItem.node)
            rankItem.iconNode.sprite.color = cc.color(M('equip').getColor({rank: i}))
            rankItem.checkmarkNode = this.find('checkmark', rankItem.node)
            rankItem.checkmarkNode.active = false
            rankItem.node.on('touch-end', e => {
                E.stop(e)
                M('setting').setOpenEquip('rank', i)
            })
            this.rankItems.push(rankItem)

            let starItem = {}
            starItem.star = i
            starItem.node = G('pool').get(this.starItemNode)
            starItem.node.parent = this.starItemNode.parent
            starItem.starLabel = this.find('starLabel', cc.Label, starItem.node)
            starItem.starLabel.string = i
            starItem.checkmarkNode = this.find('checkmark', starItem.node)
            starItem.checkmarkNode.active = false
            starItem.node.on('touch-end', e => {
                E.stop(e)
                M('setting').setOpenEquip('star', i)
            })
            this.starItems.push(starItem)
        }

        this.updRankItems()
        this.updStarItems()
    }

    updRankItems() {
        if (!this.rankItems) return
        this.allRankItem.checkmarkNode.active = M('data').setting.openEquip.rank == '*'
        H.forArr(this.rankItems, item => {
            item.checkmarkNode.active = M('data').setting.openEquip.rank == item.rank
        })
        this.updSelectedItem()
    }

    updStarItems() {
        if (!this.starItems) return
        this.allStarItem.checkmarkNode.active = M('data').setting.openEquip.star == '*'
        H.forArr(this.starItems, item => {
            item.checkmarkNode.active = M('data').setting.openEquip.star == item.star
        })
        this.updSelectedItem()
    }
}


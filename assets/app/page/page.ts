import { _decorator } from 'cc';
import { ccBase } from '../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('page')
export class page extends ccBase {

    start() {
        //cc.game.setFrameRate(60)

        this.addBtnEvents()

        this.viewDatas = [
            {asset: 'hero', title: L('hero')},
            {asset: 'skill', title: L('skill')},
            {asset: 'equip', title: L('equip')},
            {asset: 'achive', title: L('achive')},
        ]

        this.viewBtns = []
        this.initViewBtns()

        this.goldLabel = this.find('gold/Label', cc.Label)
        this.addEvent(M('prop').eventType.SET_NUM.gold, () => {
            this.goldLabel.string = H.numAbbr(M('data').prop.gold)
            this.updAllTipDots()
        }, true)

        this.addEvent(M('prop').eventType.SET_NUM.equipNum, () => {
            this.updIndexEquipTipDot()
        })

        this.addEvent(M('achive').eventType.INC_COUNT, () => {
            this.updIndexAchiveTipDot()
        })
        this.addEvent(M('achive').eventType.INC_LEVEL, () => {
            this.updIndexAchiveTipDot()
        })

        this.addEvent(M('role').eventType.SET_CHIP, () => {
            this.updIndexHeroTipDot()
        })

        this.addEvent(M('skill').eventType.SET_CHIP, () => {
            this.updIndexSkillTipDot()
        })

        this.showView('hero', false)

        G('audio').playMusic('bgm1')
    }

    initViewBtns() {
        let viewBtnNode = this.find('viewBtnParent/btn')
        viewBtnNode.active = false
        H.forArr(this.viewDatas, (a, index) => {
            let node = H.inst(viewBtnNode)
            node.parent = viewBtnNode.parent
            let btn = $(node, cc.Button)
            btn.index = index
            btn.asset = a.asset
            btn.label = this.find('Label', cc.Label, btn.node)
            btn.label.string = a.title
            btn.tipDotNode = this.find('tipDot', btn.node)
            btn.tipDotNode.active = false
            btn.node.on('touch-end', e => {
                if (!btn.interactable) return
                this.showView(btn.asset)
            })
            this.viewBtns.push(btn)
        })
    }

    showView(viewName, isPlayAnim = true) {
        let btn = this.viewBtns.filter(a => {
            return a.asset === viewName
        })[0]
        if (!btn) return
        if (!btn.interactable) return
        let dir = 'left'
        let prevBtn = this.viewBtns.filter(a => {
            return a.interactable === false
        })[0]
        if (prevBtn) {
            dir = prevBtn.index > btn.index ? 'left' : 'right'
        }
        this.viewBtns.filter(a => {
            return a.asset != btn.asset
        }).forEach(a => {
            a.interactable = true
        })
        btn.interactable = false
        let prevView
        if (prevBtn) prevView = V(prevBtn.asset)
        if (isPlayAnim) {
            if (prevView) {
                let x = dir === 'right' ? -app.screen.width : app.screen.width
                cc.Tween.stopAllByTarget(prevView.node)
                cc.tween(prevView.node)
                .to(0.2, {x: x, opacity: 255})
                .call(() => {
                    prevView.remove()
                })
                .start()
            }
            let view = V(viewName, this.find('parent')).show()
            view.node.opacity = 255
            let x = dir === 'right' ? app.screen.width : -app.screen.width
            view.node.x = x
            cc.Tween.stopAllByTarget(view.node)
            cc.tween(view.node)
            .to(0.2, {x: 0, opacity: 255})
            .start()

            G('audio').playEffect('popup')
            return
        }
        if (prevView) prevView.remove()
        let view = V(viewName, this.find('parent')).show()
        view.node.opacity = 255
    }

    updIndexHeroTipDot() {
        let btn = this.viewBtns.find(a => a.asset == 'hero')
        if (!btn) return
        this.scheduleOnce(() => {
            btn.tipDotNode.active = M('role').isTip('add') || M('role').isTip('upLevel', 'ATK') || M('role').isTip('upLevel', 'HP')
        })
    }

    updIndexSkillTipDot() {
        let btn = this.viewBtns.find(a => a.asset == 'skill')
        if (!btn) return
        this.scheduleOnce(() => {
            btn.tipDotNode.active = M('skill').isTip()
        })
    }

    updIndexEquipTipDot() {
        let btn = this.viewBtns.find(a => a.asset == 'equip')
        if (!btn) return
        this.scheduleOnce(() => {
            btn.tipDotNode.active = M('equip').isTip()
        })
    }

    updIndexAchiveTipDot() {
        let btn = this.viewBtns.find(a => a.asset == 'achive')
        if (!btn) return
        this.scheduleOnce(() => {
            btn.tipDotNode.active = M('achive').isTip()
        })
    }

    updAllTipDots() {
        this.updIndexHeroTipDot()
        this.updIndexSkillTipDot()
        this.updIndexEquipTipDot()
        this.updIndexAchiveTipDot()
    }

    myBtnEvent() {
        V('my').show()
    }

    shareBtnEvent() {
        let share = {}
        if (H.isIos()) {
            share.title = L('ios_app_name')
        } else {
            share.title = L('android_app_name')
        }
        share.url = 'https://api-9grm21o25576f966-1302715122.tcloudbaseapp.com/MBRO/index.html'
        R('platform').share(share)
    }
}


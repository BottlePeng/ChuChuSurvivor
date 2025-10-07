import { _decorator } from 'cc';
import { ccBase } from '../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('root')
export class root extends ccBase {

    eventType = {
        LOOP: 'app.runTime',
    }

    onLoad() {
        let assetParentNode = this.find('_assetParent_')
        assetParentNode = new cc.Node()
        assetParentNode.name = '_assetParent_'
        assetParentNode.parent = this.node
        H.inst(G('asset').getPrefab('miscAsset'), assetParentNode)
        H.inst(G('asset').getPrefab('skillAsset'), assetParentNode)
        H.forArr(assetParentNode.children, node => {
            let component = $(node, node.name)
            R('global')[node.name] = component
        })

        this.addEvent('app.show', this.onShow)
        this.addEvent('app.hide', this.onHide)

        this.addEvent(M('achive').eventType.INC_COUNT, this.onAchiveInc)
        this.addEvent(M('achive').eventType.INC_LEVEL, this.onAchiveInc)


        this.stop = false
        this.time = 0
        this.schedule(this.runTime, 1)
        this.achiveTips = []

        G('tip').initLayer(R('global').layer.ui)

        V('login').show(loginData => {
            M('data').init(loginData)
            this.onShow()
            G('audio').init(M('data').setting.audio)

            G('ad').init()
            R('apple').gameCenter.init()

            V('page').show()
            //V('fight').show()

            V('login').remove()

            this.checkAchive()
        })
    }

    runTime() {
        if (this.stop) return
        this.time += 1
        if ((this.time % 60) == 0) {
            this.checkVersion()
        }
        if (S('login')) {
            for (let key in M('data').timeCount) {
                M('data').timeCount[key] += 1
            }
        }
        E.emit(this.eventType.LOOP, this.time)
    }

    onShow() {
        this.stop = false
        if (!S('login')) return
        let diffSecond = 0
        let hideTime = H.num(M('data').player.hideTime)
        if (hideTime > 1) diffSecond = H.num(H.time() - hideTime)
        for (let key in M('data').timeCount) {
            M('data').timeCount[key] += diffSecond
        }
    }

    onHide() {
        this.stop = true
        if (!S('login')) return
        M('data').player.hideTime = H.time()
        M('data').save()
    }

    checkVersion() {
        if (!H.isNative()) return
        if (this._dontCheckVersion) return
        if (this._isShowCheckVersion) return
        cc.assetManager.loadRemote(app.loader.url + '?' + new Date().getTime(), {ext: '.json'}, (err, res) => {
            if (err) return
            let config = res.json
            if (app.config.version != config.version || app.config.bundle.version != config.bundle.version) {
                this._isShowCheckVersion = true
                G('tip').confirm(L('error_version'), bool => {
                    this._isShowCheckVersion = false
                    if (bool) {
                        if (S('login')) M('data').save()
                        H.exitGame()
                        return
                    }
                    this._dontCheckVersion = true
                })
            }
        })
    }

    checkAchive() {
        for (let type in M('data').achive) {
            for (let assetOrKey in M('data').achive[type]) {
                this.onAchiveInc(type, assetOrKey)
            }
        }
    }

    onAchiveInc(type, assetOrKey) {
        if (M('achive').isDone(type, assetOrKey)) {
            let level = M('achive').getLevel(type, assetOrKey)
            let achiveTip = this.achiveTips.find(a => a.type == type && a.assetOrKey == assetOrKey && a.level == level)
            if (achiveTip) return
            this.achiveTips.push({
                type: type,
                assetOrKey: assetOrKey,
                level: level,
            })
            if (type == 'useRole') {
                R('global').loadRoleSpriteFrame(assetOrKey).then(spriteFrame => {
                    G('tip').top(M('achive').getTopTip(type, assetOrKey), {spriteFrame: spriteFrame, color: '#F6DB96'})
                })
            } else if (type == 'useSkill') {
                G('tip').top(M('achive').getTopTip(type, assetOrKey), {spriteFrame: R('global').getSkillSpriteFrame(assetOrKey, 1), color: '#F6DB96'})
            } else {
                G('tip').top(M('achive').getTopTip(type, assetOrKey), {spriteFrame: R('global').getMiscSpriteFrame(assetOrKey), color: '#F6DB96'})
            }
        }
    }
}


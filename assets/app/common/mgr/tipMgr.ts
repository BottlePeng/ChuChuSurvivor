import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('tipMgr')
export class tipMgr {
    getParentNode() {
        let parentNode = cc.find('Canvas/_tipParent_')
        if (!parentNode) {
            parentNode = new cc.Node()
            parentNode.name = '_tipParent_'
            parentNode.parent = cc.find('Canvas')
            parentNode.zIndex = 'last'
            parentNode.size = H.winSize()
        }
        return parentNode
    }

    initLayer(layer = 1 << 25) {
        this.layer = layer
    }

    setLayer(node, layer) {
        if (this.layer) layer = this.layer
        H.setLayer(node, layer)
    }

    show(string, param) {
        param = {...{
            color: '#FFFFFF',
            spriteFrame: null,
            spriteColor: '#FFFFFF',
            spriteScaleX: 1,
            spriteScaleY: 1,
            layer: 1 << 25, //UI_2D
        }, ...param}

        let parentNode = cc.find('tipParent', this.getParentNode())
        if (!parentNode) {
            parentNode = new cc.Node()
            parentNode.name = 'tipParent'
            parentNode.parent = this.getParentNode()
            parentNode.transform.anchorY = 0
            let layout = H.add$(parentNode, cc.Layout, true)
            layout.type = cc.Layout.Type.VERTICAL
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER
            layout.spacingY = 5
        }
        parentNode.zIndex = 'last'
        let item = {}
        item.node = G('pool').get(G('asset').getPrefab('tip'), parentNode)
        this.setLayer(item.node, param.layer)

        item.sprite = H.find('icon', cc.Sprite, item.node)
        item.label = H.find('Label', cc.Label, item.node)
        item.bgNode = H.find('bg', item.node)

        if (param.spriteFrame) {
            item.sprite.node.active = true
            item.sprite.spriteFrame = param.spriteFrame
            item.sprite.color = cc.color(param.spriteColor)
            item.sprite.node.setScale(param.spriteScaleX, param.spriteScaleY)
        } else {
            item.sprite.node.active = false
        }
        if (string) {
            item.label.string = H.toString(string)
            item.label.color = cc.color(param.color)
            item.label.node.active = true
        } else {
            item.label.node.active = false
        }

        item.bgNode.setPosition(0, 0)
        item.bgNode.setScale(0.9, 0.9)
        item.bgNode.opacity = 255
        cc.tween(item.bgNode)
        .to(0.1, {scale: cc.v3(1.1, 1.1, 1)})
        .to(0.1, {scale: cc.v3(1, 1, 1)})
        .to(1)
        .to(0.2, {position: cc.v3(0, 100)}, {
            onUpdate: (target, ratio) => {
                item.bgNode.opacity = 255 - (255 * ratio)
            }
        })
        .call(() => {
            G('pool').put(item.node)
        })
        .start()
        return item
    }

    success(string, param) {
        param = {...{
            color: '#00FF00',
            spriteFrame: null,
            spriteColor: '#FFFFFF',
            spriteScaleX: 1,
            spriteScaleY: 1,
            layer: 1 << 25, //UI_2D
        }, ...param}
        return this.show(string, param)
    }

    error(string, param) {
        param = {...{
            color: '#FF0000',
            spriteFrame: null,
            spriteColor: '#FFFFFF',
            spriteScaleX: 1,
            spriteScaleY: 1,
            layer: 1 << 25, //UI_2D
        }, ...param}
        return this.show(string, param)
    }

    playAnim(node, type = 'show') {
        return new Promise(resolve => {
            if (node._isPlaying) return
            node._isPlaying = true
            if (type == 'show') {
                node.opacity = 0
                node.setScale(0.9, 0.9, 1)
                cc.tween(node)
                .to(0.1, {scale: cc.v3(1.1, 1.1, 1)}, {
                    onUpdate: (target, ratio) => {
                        node.opacity = 255 * ratio
                    }
                })
                .to(0.05, {scale: cc.v3(1, 1, 1)})
                .call(() => {
                    node._isPlaying = false
                    resolve()
                })
                .start()
            }
            if (type == 'close') {
                node.setScale(1, 1, 1)
                cc.tween(node)
                .to(0.1, {scale: cc.v3(0.9, 0.9, 1)}, {
                    onUpdate: (target, ratio) => {
                        node.opacity = 255 - (255 * ratio)
                    }
                })
                .call(() => {
                    node._isPlaying = false
                    resolve()
                })
                .start()
            }
        })
    }

    loading(string, layer = 1 << 25) {
        if (this._loading) {
            this._loading.show(string)
            return this._loading
        }
        this._loading = {}
        this._loading.node = G('pool').get(G('asset').getPrefab('tipLoading'), this.getParentNode())
        this._loading.label = H.find('Label', cc.Label, this._loading.node)
        this._loading.bgNode = H.find('bg', this._loading.node)
        this._loading.show = (string) => {
            this.setLayer(this._loading.node, layer)
            this._loading.node.zIndex = 'last'
            if (string) {
                this._loading.bgNode = cc.size(120, 120)
                this._loading.label.string = H.toString(string)
                this._loading.label.node.active = true
            } else {
                this._loading.bgNode.size = cc.size(80, 80)
                this._loading.label.node.active = false
            }
        }
        this._loading.close = () => {
            G('pool').put(this._loading.node, true)
            this._loading = null
        }
        this._loading.node.on('touch-end', e => {
            E.stop(e)
        })
        this._loading.show(string)
        return this._loading
    }

    closeLoading() {
        if (this._loading) this._loading.close()
    }

    text(string, param, callFunc) {
        param = {...{
            color: '#FFFFFF',
            align: 'center',
            touchClose: false,
            layer: 1 << 25,
        }, ...param}
        if (this._text) {
            this._text.show(string, param, callFunc)
            return this._text
        }
        this._text = {}
        this._text.node = G('pool').get(G('asset').getPrefab('tipText'), this.getParentNode())
        this._text.label = H.find('Label', cc.Label, this._text.node)
        this._text.bgNode = H.find('bg', this._text.node)

        this._text.show = (string, param, callFunc, anim = false) => {
            this.setLayer(this._text.node, param.layer)
            this._text.node.zIndex = 'last'
            if (anim) this.playAnim(this._text.bgNode, 'show')
            this._text.callFunc = () => {
                if (callFunc) callFunc()
            }
            this._text.param = param
            if (string) {
                if (this._text.param.align == 'left') {
                    this._text.label.horizontalAlign = 0
                }
                if (this._text.param.align == 'center') {
                    this._text.label.horizontalAlign = 1
                }
                if (this._text.param.align == 'right') {
                    this._text.label.horizontalAlign = 2
                }
                this._text.label.string = H.toString(string)
                this._text.label.node.active = true
                this._text.label.color = cc.color(param.color)
            } else {
                this._text.label.node.active = false
            }
        }
        this._text.close = async () => {
            await this.playAnim(this._text.bgNode, 'close')
            this._text.callFunc()
            G('pool').put(this._text.node, true)
            this._text = null
        }

        this._text.node.on('touch-end', e => {
            E.stop(e)
            if (this._text.param.touchClose) {
                this._text.close()
            }
        })
        this._text.show(string, param, callFunc, true)
        return this._text
    }

    closeText() {
        if (this._text) this._text.close()
    }

    full(string, param, callFunc) {
        param = {...{
            color: '#FFFFFF',
            touchClose: false,
            layer: 1 << 25,
        }, ...param}

        if (this._full) {
            this._full.show(string, param, callFunc)
            return this._full
        }

        this._full = {}
        this._full.node = G('pool').get(G('asset').getPrefab('tipFull'), this.getParentNode())
        this._full.label = H.find('Label', cc.Label, this._full.node)
        this._full.bgNode = H.find('bg', this._full.node)
        this._full.show = (string, param, callFunc, anim = false) => {
            this.setLayer(this._full.node, param.layer)
            this._full.node.zIndex = 'last'
            if (anim) this.playAnim(this._full.bgNode, 'show')
            this._full.callFunc = () => {
                if (callFunc) callFunc()
            }
            this._full.param = param
            if (string) {
                this._full.label.string = H.toString(string)
                this._full.label.node.active = true
                this._full.label.color = cc.color(param.color)
            } else {
                this._full.label.node.active = false
            }
        }
        this._full.close = async () => {
            await this.playAnim(this._full.bgNode, 'close')
            this._full.callFunc()
            G('pool').put(this._full.node, true)
            this._full = null
        }

        this._full.node.on('touch-end', e => {
            E.stop(e)
            if (this._full.param.touchClose) {
                this._full.close()
            }
        })
        this._full.show(string, param, callFunc, true)
        return this._full
    }

    closeFull() {
        if (this._full) this._full.close()
    }

    confirm(string, callFunc, layer = 1 << 25) {
        if (this._confirm) {
            this._confirm.show(string, callFunc)
            return this._confirm
        }
        this._confirm = {}
        this._confirm.node = G('pool').get(G('asset').getPrefab('tipConfirm'), this.getParentNode())
        this._confirm.label = H.find('Label', cc.Label, this._confirm.node)
        this._confirm.bgNode = H.find('bg', this._confirm.node)
        this._confirm.show = (string, callFunc, anim = false) => {
            this.setLayer(this._confirm.node, layer)
            this._confirm.node.zIndex = 'last'
            if (anim) this.playAnim(this._confirm.bgNode, 'show')
            this._confirm.callFunc = (bool) => {
                if (callFunc) callFunc(bool)
            }
            if (string) {
                this._confirm.label.string = H.toString(string)
                this._confirm.label.node.active = true
            } else {
                this._confirm.label.node.active = false
            }
        }
        this._confirm.close = async () => {
            await this.playAnim(this._confirm.bgNode, 'close')
            G('pool').put(this._confirm.node, true)
            this._confirm = null
        }
        this._confirm.node.on('touch-end', e => {
            E.stop(e)
        })
        H.find('yesBtn', this._confirm.node).on('touch-end', e => {
            E.stop(e)
            this._confirm.callFunc(true)
            this._confirm.close()
        })
        H.find('noBtn', this._confirm.node).on('touch-end', e => {
            E.stop(e)
            this._confirm.callFunc(false)
            this._confirm.close()
        })
        this._confirm.show(string, callFunc, true)
        return this._confirm
    }

    top(string, param, callFunc) {
        param = {...{
            color: '#FFFFFF',
            spriteFrame: null,
            spriteColor: '#FFFFFF',
            layer: 1 << 25,
        }, ...param}
        string = string.toString().replace(/\\n/g, ', ')
        if (this._top) {
            this._top.show(string, param, callFunc, false)
            return this._top
        }
        this._top = {}
        this._top.node = G('pool').get(G('asset').getPrefab('tipTop'), this.getParentNode())
        this._top.label = H.find('Label', cc.Label, this._top.node)
        this._top.iconSprite = H.find('icon', cc.Sprite, this._top.node)
        this._top.tween = null

        this._top.show = (string, param, callFunc, anim = true) => {
            this.setLayer(this._top.node, param.layer)
            if (param.spriteFrame) {
                this._top.iconSprite.node.active = true
                this._top.iconSprite.spriteFrame = param.spriteFrame
                this._top.iconSprite.color = cc.color(param.spriteColor)
            } else {
                this._top.iconSprite.node.active = false
            }
            this._top.label.color = cc.color(param.color)
            this._top.label.string = string

            this._top.node.y = (app.screen.height / 2) - this._top.node.realSizeH
            if (this._top.tween) this._top.tween.stop()
            if (anim) {
                this._top.node.y = this._top.node.y + this._top.node.realSizeH
                this._top.tween = cc.tween(this._top.node)
                .to(0.2, {y: this._top.node.y - this._top.node.realSizeH})
                .to(3)
                .to(0.1, {y: this._top.node.y + this._top.node.realSizeH})
                .call(() => {
                    G('pool').put(this._top.node)
                    this._top = null
                    if (callFunc) callFunc()
                })
                .start()
                return
            }
            this._top.tween = cc.tween(this._top.node)
            .to(3)
            .to(0.1, {y: this._top.node.y + this._top.node.realSizeH})
            .call(() => {
                G('pool').put(this._top.node)
                this._top = null
                if (callFunc) callFunc()
            })
            .start()
        }

        this._top.show(string, param, callFunc)

        return this._top
    }

    reward(reward) {
        if (this.rewardItems) {
            H.forArr(this.rewardItems, a => {
                G('pool').put(a.node)
            })
        }
        this.rewardItems = []
        let item = {}
        item.node = G('pool').get(G('asset').getPrefab('tipReward'), this.getParentNode())
        item.node.zIndex = 'last'
        item.rewardParentNode = H.find('rewardParent', item.node)

        if (reward.prop) {
            for (let key in reward.prop) {
                if (reward.prop[key] > 0) {
                    let propItem = G('pool').get(G('asset').getPrefab('propItem'), 'propItem', item.rewardParentNode)
                    propItem.updProp(key, reward.prop[key])
                    this.rewardItems.push(propItem)
                }
            }
        }
        if (H.isArr(reward.chips)) {
            reward.chips.forEach(chip => {
                if (chip.chip > 0) {
                    let propItem = G('pool').get(G('asset').getPrefab('propItem'), 'propItem', item.rewardParentNode)
                    propItem.updChip(chip)
                    this.rewardItems.push(propItem)
                }
            })
        }

        item.node.once('touch-end', e => {
            E.stop(e)
            H.forArr(this.rewardItems, a => {
                G('pool').put(a.node)
            })
            this.rewardItems = []
            G('pool').put(item.node)
        })

        return item
    }

    init(param) {
        param = {...{
            fightTipParentNode: null,
        }, ...param}
        for (let key in param) this[key] = param[key]
    }

    fight(string, param) {
        param = {...{
            by: null,
            parentNode: null,
            animType: 1,//2=暴击
            color: '#FFFFFF',
        }, ...param}
        return new Promise(resolve => {
            let parentNode = param.parentNode || this.fightTipParentNode

            let worldPos
            if (H.is$(param.by, cc.Node)) {
                worldPos = param.by.getWorldPosition()
            } else {
                worldPos = param.by
            }
            let tip = {}
            tip.node = G('pool').get(G('asset').getPrefab('tipFight'), parentNode, 'tipFight' + param.animType)
            if (worldPos) tip.node.setWorldPosition(worldPos)
            tip.anim = H.find('anim', cc.Animation, tip.node)
            tip.label = H.find('Label', cc.Label, tip.anim.node)

            tip.label.string = string
            tip.label.color = cc.color(param.color)
            let animName = 'tipFight' + param.animType
            let animState = tip.anim.getState(animName)
            if (animState) {
                animState.once(cc.Animation.EventType.FINISHED, () => {
                    G('pool').put(tip.node)
                    resolve()
                })
                tip.anim.play(animName)
                return
            }
            G('pool').put(tip.node)
            resolve()
        })
    }
}


import { _decorator, dynamicAtlasManager, UIOpacity } from 'cc';
const { ccclass } = _decorator;
import { EDITOR_NOT_IN_PREVIEW } from 'cc/env'

globalThis.log = console.log

// cc.macro.BATCHER2D_MEM_INCREMENT = 1440 (2303最大) //这个需要在项目设置里才有效

//关闭多点触控
cc.macro.ENABLE_MULTI_TOUCH = false
//原生和浏览器开启(暂时没用)
// if (cc.sys.isNative || cc.sys.isBrowser) {
//     cc.macro.CLEANUP_IMAGE_CACHE = false
//     dynamicAtlasManager.enabled = true
//     dynamicAtlasManager.maxFrameSize = 2048
// }

import { helper } from '../common/helper'
globalThis.H = new helper()
globalThis.$ = H.$

globalThis.E = new cc.EventTarget()
E.stop = (e) => {
    e.propagationStopped = true
}

if (!EDITOR_NOT_IN_PREVIEW) {
    Object.defineProperty(cc.Node.prototype, 'x', {
        get() {
            return this.position.x
        },
        set(val) {
            this.setPosition(val, this.position.y, this.position.z)
        }
    })
    Object.defineProperty(cc.Node.prototype, 'y', {
        get() {
            return this.position.y
        },
        set(val) {
            this.setPosition(this.position.x, val, this.position.z)
        }
    })
    Object.defineProperty(cc.Node.prototype, 'z', {
        get() {
            return this.position.z
        },
        set(val) {
            this.setPosition(this.position.x, this.position.y, val)
        }
    })
    Object.defineProperty(cc.Node.prototype, 'worldX', {
        get() {
            return this.worldPosition.x
        },
        set(val) {
            this.setWorldPosition(val, this.worldPosition.y, this.worldPosition.z)
        }
    })
    Object.defineProperty(cc.Node.prototype, 'worldY', {
        get() {
            return this.worldPosition.y
        },
        set(val) {
            this.setWorldPosition(this.worldPosition.x, val, this.worldPosition.z)
        }
    })
    Object.defineProperty(cc.Node.prototype, 'worldZ', {
        get() {
            return this.worldPosition.z
        },
        set(val) {
            this.setWorldPosition(this.worldPosition.x, this.worldPosition.y, val)
        }
    })
    Object.defineProperty(cc.Node.prototype, 'sizeW', {
        get() {
            return this.transform.width
        },
        set(val) {
            this.transform.width = val
        }
    })
    Object.defineProperty(cc.Node.prototype, 'sizeH', {
        get() {
            return this.transform.height
        },
        set(val) {
            this.transform.height = val
        }
    })
    Object.defineProperty(cc.Node.prototype, 'size', {
        get() {
            return cc.size(this.transform.width, this.transform.height)
        },
        set(size) {
            this.transform.width = size.width
            this.transform.height = size.height
        }
    })
    Object.defineProperty(cc.Node.prototype, 'realSize', {
        get() {
            return cc.size(this.transform.width * this.scale.x, this.transform.height * this.scale.y)
        }
    })
    Object.defineProperty(cc.Node.prototype, 'realSizeW', {
        get() {
            return this.transform.width * this.scale.x
        }
    })
    Object.defineProperty(cc.Node.prototype, 'realSizeH', {
        get() {
            return this.transform.height * this.scale.y
        }
    })
    Object.defineProperty(cc.Node.prototype, 'scaleX', {
        get() {
            return this.scale.x
        },
        set(val) {
            this.setScale(val, this.scale.y, this.scale.z)
        }
    })
    Object.defineProperty(cc.Node.prototype, 'scaleY', {
        get() {
            return this.scale.y
        },
        set(val) {
            this.setScale(this.scale.x, val, this.scale.z)
        }
    })
    Object.defineProperty(cc.Node.prototype, 'scaleZ', {
        get() {
            return this.scale.z
        },
        set(val) {
            this.setScale(this.scale.x, this.scale.y, val)
        }
    })
    Object.defineProperty(cc.Node.prototype, 'opacity', {
        get() {
            if (!this._UIOpacity) {
                this._UIOpacity = H.add$(this, UIOpacity, true)
            }
            return this._UIOpacity.opacity
        },
        set(val) {
            if (!this._UIOpacity) {
                this._UIOpacity = H.add$(this, UIOpacity, true)
            }
            this._UIOpacity.opacity = val
            H.forArr(H.findAll(this), a => {
                a.hasChangedFlags = 1
            })
        }
    })
    Object.defineProperty(cc.Node.prototype, 'zIndex', {
        get() {
            return this.getSiblingIndex()
        },
        set(val) {
            if (val == 'last') {
                let lastNode = this.parent.children[this.parent.children.length - 1]
                this.setSiblingIndex(lastNode.getSiblingIndex() + 1)
            } else {
                this.setSiblingIndex(val)
            }
        }
    })
    //常用的
    Object.defineProperty(cc.Node.prototype, 'sprite', {
        get() {
            return $(this, cc.Sprite)
        }
    })
    Object.defineProperty(cc.Node.prototype, 'label', {
        get() {
            return $(this, cc.Label)
        }
    })
    Object.defineProperty(cc.Node.prototype, 'button', {
        get() {
            return $(this, cc.Button)
        }
    })
    Object.defineProperty(cc.Node.prototype, 'anim', {
        get() {
            return $(this, cc.Animation)
        }
    })
    //anchorX anchorY 调用这个设置
    Object.defineProperty(cc.Node.prototype, 'transform', {
        get() {
            if (!this._transform) {
                this._transform = H.add$(this, cc.UITransformComponent, true)
            }
            return this._transform
        }
    })
}

import { ccBase } from './ccBase';
@ccclass('ccApp')
export class ccApp extends ccBase {
    view = {}
    require = {}
    liveTime = H.time()

    getView(name) {
        if (!this.view) return
        if (!this.view[name]) return
        return this.view[name]
    }

    removeAllView() {
        if (!this.view) return
        for (let key in this.view) {
            if (this.view[key].remove) this.view[key].remove()
        }
    }

    //获取活跃时间(根据用户点击判断)
    getLiveTime() {
        return this.liveTime
    }

    //更新活跃时间
    updLiveTime() {
        this.liveTime = H.time()
    }

    //预制体界面
    V(name, parentNode) {
        if (this.view[name]) {
            if (this.view[name].node) {
                if (parentNode) {
                    this.view[name].node.parent = parentNode
                    this.view[name].node.zIndex = 'last'
                }
                return this.view[name]
            } else {
                delete this.view[name]
            }
        }
        cc.log('[view]实例', name)
        let prefab = this.G('asset').getPrefab(name)
        if (!prefab) {
            cc.log('view未找到', name)
            return
        }
        let node = H.inst(prefab)
        H.add$(node, cc.BlockInputEventsComponent, true)
        node.active = false
        let res = H.add$(node, name, true)
        if (!res) {
            res = {}
            res.node = node
        }
        if (parentNode) {
            node.parent = parentNode
        } else {
            let popup = $(node, 'ccPopup')
            node.parent = popup ? this.popupParentNode : this.parentNode
        }
        node.zIndex = 'last'
        if (!res.show) {
            res.show = () => {
                node.active = true
                return res
            }
        }
        res._close = () => {
            res.node.active = false
        }
        res.onClose = () => {}
        if (!res.close) {
            res.close = () => {
                res._close()
                res.onClose()
            }
        }
        res._remove = () => {
            cc.log('[view]销毁', name)
            H.forArr(H.findAll(res.node).filter(a => a._put), a => {
                a._put(true)
            })
            res.node.destroy()
            delete this.view[name]
        }
        res.onRemove = () => {}
        if (!res.remove) {
            res.remove = () => {
                res._remove()
                res.onRemove()
            }
        }
        this.view[name] = res
        return res
    }

    //实例
    N(name, ...args) {
        let _class = cc.js.getClassByName(name)
        if (!_class) return null
        return new _class(...args)
    }

    //单例
    R(name) {
        if (this.require[name]) {
            if (this.require[name].onCall) this.require[name].onCall()
            return this.require[name]
        }
        let _class = cc.js.getClassByName(name)
        if (!_class) return null
        this.require[name] = new _class()
        if (this.require[name].onCall) this.require[name].onCall()
        return this.require[name]
    }

    //数据模型
    M(name) {
        return this.R(name + 'Model')
    }

    //节点管理
    G(name) {
        return this.R(name + 'Mgr')
    }

    //本机存储
    S(key, data) {
        if (!key) return
        if (data === null) {
            return this.R('localStorage').clear(key)
        }
        if (data || typeof data === 'boolean' || typeof data === 'number') {
            return this.R('localStorage').set(key, data)
        }
        return this.R('localStorage').get(key)
    }

    initParentNodes() {
        const createFullNode = (nodeName, parentNode) => {
            let node = new cc.Node()
            node.name = nodeName
            node.parent = parentNode
            node.zIndex = 'last'
            let widget = H.add$(node, cc.Widget, true)
            widget.isAlignTop = true
            widget.isAlignBottom = true
            widget.isAlignLeft = true
            widget.isAlignRight = true
            widget.updateAlignment()
            widget.top = 0
            widget.bottom = 0
            widget.left = 0
            widget.right = 0
            return node
        }
        this.rootNode = cc.find('Canvas/root')
        if (!this.rootNode) this.rootNode = createFullNode('root', cc.find('Canvas'))

        this.parentNode = H.find('parent', cc.find('Canvas'))
        if (!this.parentNode) this.parentNode = createFullNode('parent', this.rootNode)

        this.popupParentNode = H.find('popupParent', cc.find('Canvas'))
        if (!this.popupParentNode) {
            this.popupParentNode = new cc.Node()
            this.popupParentNode.name = 'popupParent'
            this.popupParentNode.parent = cc.find('Canvas')
            this.popupParentNode.zIndex = 'last'
            this.popupParentNode.size = H.winSize()
        }

        let _event_ = createFullNode('_event_', cc.director.getScene())
        for (let eventType in cc.Node.EventType) {
            if (eventType.indexOf('TOUCH_') != -1) {
                _event_.on(cc.Node.EventType[eventType], e => {
                    e.preventSwallow = true
                    if (eventType == 'TOUCH_START') this.updLiveTime()
                })
            }
        }
    }

    init(param) {
        param = {...{
            appName: 'YYTGAME',
        }, ...param}

        globalThis.N = this.N.bind(this)
        globalThis.R = this.R.bind(this)
        globalThis.M = this.M.bind(this)
        globalThis.G = this.G.bind(this)
        globalThis.S = this.S.bind(this)
        globalThis.V = this.V.bind(this)
        globalThis.L = R('i18n').t.bind(R('i18n'))

        R('localStorage').init(param.appName)
        this.initParentNodes()

        if (typeof app == 'undefined') globalThis.app = {}
        app.screen = H.add$(this.node, 'screen', true)
        app.i18n = this.R('i18n')
        app.getView = this.getView.bind(this)
        app.removeAllView = this.removeAllView.bind(this)
        app.getLiveTime = this.getLiveTime.bind(this)
        app.updLiveTime = this.updLiveTime.bind(this)
        app.mini = H.mini()

        if (app.mini) {
            app.mini.onShow(this.onShow)
            app.mini.onHide(this.onHide)
        } else {
            cc.game.on(cc.Game.EVENT_SHOW, this.onShow, this)
            cc.game.on(cc.Game.EVENT_HIDE, this.onHide, this)
        }
    }

    onDestroy() {
        if (app.mini) {
            app.mini.offShow(this.onShow)
            app.mini.offHide(this.onHide)
        } else {
            cc.game.off(cc.Game.EVENT_SHOW, this.onShow, this)
            cc.game.off(cc.Game.EVENT_HIDE, this.onHide, this)
        }
    }

    onShow(e) {
        E.emit('app.show', e)
    }

    onHide() {
        E.emit('app.hide')
    }
}
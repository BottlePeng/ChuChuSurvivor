import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('ccBase')
export class ccBase extends Component {

    //onLoad()或者start()中使用
    addEvent(name, callFunc, init = false) {
        if (!this.events) this.events = []
        if (init) {
            callFunc.bind(this)()
        }
        this.events.push({
            name: name,
            callFunc: callFunc
        })
        E.on(name, callFunc, this)
    }

    removeEvents() {
        if (this.events) {
            H.forArr(this.events, e => {
                E.off(e.name, e.callFunc, this)
            })
        }
        this.events = []
    }

    preEvent(e) {
        if ('propagationStopped' in e) E.stop(e)
        let node = e.currentTarget
        let key = node.name + 'Event'
        cc.log('[' + this.node.name + '] ' + key)
        if (this[key]) this[key](node, e)
    }

    addBtnEvents() {
        let nodes = this.findAll()
        nodes.forEach(node => {
            if (node.getComponent(cc.Button)) {
                node.on('touch-end', this.preEvent, this)
            }
        })
    }

    removeBtnEvents() {
        let nodes = this.findAll()
        nodes.forEach(node => {
            if (node.getComponent(cc.Button)) {
                node.off('touch-end', this.preEvent, this)
            }
        })
    }
    //args: 组件 > 父节点
    find(path, ...args) {
        let component = !(args[0] instanceof cc.Node) ? args[0] : null
        let parentNode = component ? args[1] : args[0]
        const find = (path, parentNode) => {
            if (!parentNode) parentNode = this.node
            let node = cc.find(path, parentNode)
            if (node) return node
            let children = parentNode.children
            for (let i = 0; i < children.length; i++) {
                node = find(path, children[i])
                if (node) return node
            }
            return null
        }
        let node = find(path, parentNode)
        if (!node) return
        return component ? node.getComponent(component) : node
    }

    findAll(parentNode = null) {
        if (parentNode === null) parentNode = this.node
        return H.findAll(parentNode)
    }

    sleep(second) {
        return new Promise(resolve => {
            this.scheduleOnce(resolve, second)
        })
    }

    _show(comp) {
        if (!comp) return
        if (!comp.node) return
        if (comp.node.active) return comp
        comp.node.active = true
        return comp
    }

    //被回收
    unuse() {
        this.removeEvents()
    }

    //被销毁
    onDestroy() {
        this.removeEvents()
    }
}


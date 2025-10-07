import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('poolMgr')
export class poolMgr {
    pool = {}

    //args: 组件 > 父节点 > key
    get(nodeOrPrefab, ...args) {
        if (!nodeOrPrefab) return
        let component
        let parentNode
        let key
        if (H.is$(args[0], cc.Node)) {
            parentNode = args[0]
            key = args[1]
        } else if (args[0] && args[1]) {
            component = args[0]
            parentNode = args[1]
            key = args[2]
        } else {
            key = args[0]
        }
        let name
        if (H.is$(nodeOrPrefab, cc.Node)) {
            name = nodeOrPrefab.name
            if (!key) key = H.getNodePath(nodeOrPrefab)
        }
        if (H.is$(nodeOrPrefab, cc.Prefab)) {
            name = nodeOrPrefab.data.name
            if (!key) key = nodeOrPrefab.uuid
        }
        if (!this.pool[key]) this.pool[key] = new cc.NodePool(component ? component : name)

        const createNode = () => {
            let node = H.inst(nodeOrPrefab)
            node._defSizeW = node.sizeW
            node._defSizeH = node.sizeH

            node._put = (removeAllEvents = false) => {
                if (this.pool[key]) {
                    if (removeAllEvents) {
                        let childNodes = H.findAll(node)
                        H.forArr(childNodes, childNode => {
                            for (let eventType in cc.Node.EventType) {
                                if (eventType.indexOf('TOUCH_') != -1) {
                                    childNode.targetOff(cc.Node.EventType[eventType])
                                }
                            }
                        })
                    }
                    H.forArr(node.components, component => {
                        if (component.unscheduleAllCallbacks) {
                            component.unscheduleAllCallbacks()
                        }
                    })
                    cc.Tween.stopAllByTarget(node)
                    this.pool[key].put(node)
                } else {
                    node.destroy()
                }
            }
            return node
        }

        let node = this.pool[key].get()
        if (node) {
            node = H.resetNode(node)
        } else {
            node = createNode()
        }
        if (!node || !node.active) node = createNode()
        if (node._defSizeW || node._defSizeH) {
            node.sizeW = node._defSizeW
            node.sizeH = node._defSizeH
        }
        if (parentNode && parentNode.active) node.parent = parentNode
        return component ? H.add$(node, component, true) : node
    }

    put(node, removeAllEvents = false) {
        if (!node) return
        if (node._put) {
            if (removeAllEvents) {
                let childNodes = H.findAll(node)
                H.forArr(childNodes, childNode => {
                    for (let eventType in cc.Node.EventType) {
                        if (eventType.indexOf('TOUCH_') != -1) {
                            childNode.targetOff(cc.Node.EventType[eventType])
                        }
                    }
                })
            }
            node.active = false
            node._put(false)
        } else {
            node.destroy()
        }
    }

    clearAll() {
        if (!this.pool) return
        for (let key in this.pool) {
            this.pool[key].clear()
            delete this.pool[key]
        }
    }
}


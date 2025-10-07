import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('dropPropMgr')
export class dropPropMgr {
    init(param) {
        param = {...{
            parent1Node: null,
            parent2Node: null,
            player: null,
        }, ...param}
        for (let key in param) this[key] = param[key]

        this.items = []
    }

    create(param) {
        param = {...{
            name: '',
            by: null,
            layer: 1
        }, ...param}

        let parentNode = this.parent1Node
        if (param.layer == 2) {
            parentNode = this.parent2Node
        }

        let prefab = G('asset').getPrefab(param.name)
        let node = G('pool').get(prefab, 'dropProp' + param.name)
        node.parent = parentNode
        if (param.by) {
            if (H.is$(param.by, cc.Node)) {
                let byPos = param.by.getWorldPosition()
                node.setWorldPosition(byPos)
            } else {
                node.setWorldPosition(param.by)
            }
        }
        let dropProp = $(node, 'dropProp')
        dropProp.uid = H.uid()
        dropProp.init(this.player)

        let tipTypes = this.getTipTypes()
        let tipType = tipTypes.find(a => a == dropProp.type)
        if (tipType) {
            let dropPropTipNode = G('pool').get(G('asset').getPrefab('dropPropTip'))
            let dropPropTip = $(dropPropTipNode, 'dropPropTip')
            dropPropTip.node.parent = this.parent2Node
            let iconNode = cc.find('anim', dropProp.node)
            if (!iconNode) iconNode = cc.find('icon', dropProp.node)
            dropPropTip.init({
                dropPropNode: dropProp.node,
                player: this.player,
                iconNode: iconNode,
            })
            dropPropTip.hide()
            dropProp.dropPropTip = dropPropTip
        }
        this.items.push(dropProp)
        return dropProp
    }

    remove(dropProp) {
        if (!dropProp.node) return
        G('pool').put(dropProp.node)
        if (dropProp.dropPropTip) {
            if (!dropProp.dropPropTip.node) return
            G('pool').put(dropProp.dropPropTip.node)
        }
        this.items = this.items.filter(a => {
            return a.uid != dropProp.uid
        })
    }

    getTipTypes() {
        return ['box', 'equip', 'healPotion', 'fireJet', 'pickup', 'roleChip', 'skillChip']
    }

    getDropProps() {
        return this.items
    }

    getPickupDropProps() {
        let arrowTipTypes = this.getTipTypes()
        let banTypes = this.getStaticDropTypes()
        for (let i = 0; i < arrowTipTypes.length; i++) {
            banTypes.push(arrowTipTypes[i])
        }
        return this.items.filter(a => {
            return !banTypes.includes(a.type)
        })
    }

    getStaticDropTypes() {
        return ['box', 'equip']
    }
}


import { _decorator, Component } from 'cc';
const { ccclass, property, executeInEditMode, menu } = _decorator;

@ccclass('autoLayout')
@menu('base/autoLayout')
@executeInEditMode
export class autoLayout extends Component {

    //列
    @property
    get col() {
        return this._col
    }
    set col(val) {
        this._col = val
        this.upd()
    }
    @property
    _col = 0

    @property(cc.Size)
    get itemSize() {
        return this._itemSize
    }
    set itemSize(val) {
        this._itemSize = val
    }
    @property(cc.Size)
    _itemSize = cc.size(0, 0)

    @property
    get spacingX() {
        return this._spacingX
    }
    set spacingX(val) {
        this._spacingX = val
        this.upd()
    }
    @property
    _spacingX = 0

    @property
    get spacingY() {
        return this._spacingY
    }
    set spacingY(val) {
        this._spacingY = val
        this.upd()
    }
    @property
    _spacingY = 0


    onEnable() {
        this.upd()
    }

    upd() {
        let layout = H.add$(this.node, cc.Layout, true)
        layout.resizeMode = 1
        layout.startAxis = 0
        layout.spacingX = this.spacingX
        layout.spacingY = this.spacingY
        this.node.sizeW = (this.col * this.itemSize.width) + ((this.col - 1) * this.spacingX)

        let childs = this.node.children.filter(a => {
            return a.active
        })
        if (childs.length > this.col) {
            layout.type = 3
        } else {
            layout.node.sizeH = this.itemSize.height
            layout.type = 1
        }
        layout.updateLayout()
    }
}


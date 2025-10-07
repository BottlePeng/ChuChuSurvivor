import { _decorator, Component } from 'cc';
const { ccclass, menu } = _decorator;

@ccclass('sortChildIndex')
@menu('base/sortChildIndex')
export class sortChildIndex extends Component {

    start() {
        this._frame = 0
    }

    upd() {
        let listToSort = this.node.children.slice()
        listToSort.sort((a, b) => {
            return b.getPosition().y - a.getPosition().y
        })
        for (let i = 0; i < listToSort.length; ++i) {
            let node = listToSort[i]
            if (node.active) node.setSiblingIndex(i + 1)
        }
    }

    update() {
        this._frame++
        if ((this._frame % 6) == 0) {
            this._frame = 0
            this.upd()
        }
    }
}


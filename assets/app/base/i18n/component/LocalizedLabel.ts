import { _decorator, Component } from 'cc';
const { ccclass, property, executeInEditMode, menu } = _decorator;

@ccclass('LocalizedLabel')
@menu('i18n/LocalizedLabel')
@executeInEditMode
export class LocalizedLabel extends Component {
    @property
    get key() {
        return this._key
    }
    set key(str) {
        this.updateLabel()
        this._key = str
    }
    @property
    _key = ''

    start() {
        //编辑器里查看
        if (typeof R == 'undefined') {
            let _class = cc.js.getClassByName('i18n')
            this.i18n = new _class()
            this.i18n.init(cc.sys.language)
        } else {
            this.i18n = R('i18n')
            if (!this.i18n.isInit) this.i18n.init(this.i18n.defLanguage)
        }
        this.fetchRender()
    }

    fetchRender() {
        let label = this.node.getComponent(cc.Label)
        if (label) {
            this.label = label
            this.updateLabel()
        }
    }

    updateLabel() {
        this.label && (this.label.string = this.i18n.t(this.key))
    }
}

import { _decorator, WebView } from 'cc';
import { popup } from '../popup';
const { ccclass } = _decorator;

@ccclass('agreement')
export class agreement extends popup {
    show(type, callFunc) {
        this.addBtnEvents()
        if (!type) type = 'privacy'
        if (callFunc) this.touchClose = false
        this.callFunc = callFunc
        this.find('btnParent').active = callFunc ? true : false

        this.webView = this.find('WebView', WebView)
        this.btns = []
        this.find('viewBtnParent').children.forEach(a => {
            let btn = $(a, cc.Button)
            btn.type = a.name.substr(0, a.name.length - 3)
            btn.node.on('touch-end', () => {
                this.selectView(btn.type)
            })
            this.btns.push(btn)
        })
        this.selectView(type)
        return this._show(this)
    }

    selectView(type) {
        this.btns.forEach(btn => {
            btn.interactable = type != btn.type
        })
        if (type == 'privacy') {
            this.webView.url = ''
        }
        if (type == 'user') {
            this.webView.url = ''
        }
    }

    agreeBtnEvent() {
        if (this.callFunc) this.callFunc(true)
    }

    refuseBtnEvent() {
        if (this.callFunc) this.callFunc(false)
    }
}


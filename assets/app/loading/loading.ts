import { _decorator, Component, Node } from 'cc';
import { ccBase } from '../base/component/ccBase';
const { ccclass, property } = _decorator;

@ccclass('loading')
export class loading extends ccBase {
    @property(cc.Label)
    label = null

    @property(cc.Label)
    progressLabel = null

    @property(cc.ProgressBar)
    progressBar = null

    onLoad() {
        this.upd(0, 1)
    }

    tip(string, color = '#FFFFFF') {
        this.label.color = cc.color(color)
        this.label.string = string
    }

    success(string) {
        this.tip(string, '#00FF00')
    }

    error(string) {
        this.tip(string, '#FF0000')
    }

    upd(completed, total) {
        let progress = completed / total
        this.progressBar.progress = progress
        this.progressLabel.string = this.num(progress * 100) + '%'
    }

    num(num) {
        num = Number(num)
        if (isNaN(num)) return 0
        return Math.round(num * 100) / 100
    }

    remove() {
        this.node.destroy()
    }
}


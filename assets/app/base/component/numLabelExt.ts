import { _decorator, Component } from 'cc';
const { ccclass, menu } = _decorator;

@ccclass('numLabelExt')
@menu('base/numLabelExt')
export class dynamicNumLabel extends Component {
    step = 1

    _num = 0
    set num(val) {
        this._num = val
        if (!this.label) return
        this.step = 1
        let current = parseInt(this.label.string)
        let diff = Math.abs(val - current)
        let step = parseInt(diff / 10)
        let stepStr = step.toString()
        if (stepStr.length > 1) {
            let length = parseInt(step.toString().substr(1))
            for (let i = 0; i < length; i++) {
                this.step += '0'
            }
            this.step = parseInt(this.step)
        }
        if (this.step < 1) this.step = 1
    }

    get num() {
        return this._num
    }

    onLoad() {
        this.label = this.node.getComponent(cc.Label)
    }

    setNum(val, type = '=') {
        if (type == '+') this.num += val
        if (type == '-') this.num -= val
        if (type == '=') this.setNumAndLabel(val)
    }

    setNumAndLabel(val) {
        this.label.string = val
        this.num = val
    }

    update(dt) {
        if (!this.label) return
        let num = parseInt(this.label.string)
        if (this._num == num) return

        if (num > this._num) {
            num -= this.step
            if (num < this._num) num = this._num
        } else if (num < this._num) {
            num += this.step
            if (num > this._num) num = this._num
        }
        this.label.string = num
    }
}


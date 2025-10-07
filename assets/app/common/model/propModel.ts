import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('propModel')
export class propModel {
    eventType = {
        SET_NUM: {
            gold: 'propModel.setNum.gold',
            equipNum: 'propModel.setNum.equipNum',
        }
    }

    setNum(asset, action = '+', val) {
        val = H.num(val)
        if (!(asset in M('data').prop)) M('data').prop[asset] = 0
        if (action == '+') {
            M('data').prop[asset] += val
        }
        if (action == '-') {
            M('data').prop[asset] -= val
        }
        if (action == '=') {
            M('data').prop[asset] = val
        }
        if (action == '-' || action == '=') {
            if (M('data').prop[asset] < 0) M('data').prop[asset] = 0
        }
        if (asset in this.eventType.SET_NUM) {
            E.emit(this.eventType.SET_NUM[asset])
        }
    }
}


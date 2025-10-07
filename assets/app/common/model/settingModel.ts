import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('settingModel')
export class settingModel {
    eventType = {
        SET_FRAMERATE: 'settingModel.setFrameRate#val',
        SET_OPEN_EQUIP: {
            rank: 'settingModel.setOpenEquip.rank',
            star: 'settingModel.setOpenEquip.star',
        },
    }

    setFrameRate(val) {
        val = H.num(val)
        M('data').setting.frameRate = val
        E.emit(this.eventType.SET_FRAMERATE, val)
    }

    setOpenEquip(key, val) {
        M('data').setting.openEquip[key] = val
        E.emit(this.eventType.SET_OPEN_EQUIP[key])
    }
}


import { _decorator } from 'cc';
import { ccPopup } from '../base/component/ccPopup';
const { ccclass } = _decorator;

@ccclass('popup')
export class popup extends ccPopup {
    onEnable() {
        super.onEnable()
        G('audio').playEffect('popup')
    }
}


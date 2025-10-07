import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('gameCenterModel')
export class gameCenterModel {
    sendLevel() {
        if (!M('data').setting.gameCenter) return
        if (M('data').player.isGuest) return
        if (app.loader.version < 3) return
        let level = H.num(M('data').fight.level - 1)
        if (level < 1) level = 1
        R('apple').gameCenter.send({
            listId: 'MBRO_level',
            value: level.toString()
        })
    }
}


import { _decorator, input, Input, KeyCode } from 'cc';
import { ccBase } from '../ccBase';
const { ccclass, menu } = _decorator;

@ccclass('keyboardInput')
@menu('base/keyboardInput')
export class keyboardInput extends ccBase {
    onEnable() {
        this.dir = cc.v3()
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this)
    }

    onDisable() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this)
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this)
    }

    onKeyDown(e) {
        if (e.keyCode == KeyCode.KEY_W || e.keyCode == KeyCode.ARROW_UP) {
            this.dir.y = 1
        }
        if (e.keyCode == KeyCode.KEY_S || e.keyCode == KeyCode.ARROW_DOWN) {
            this.dir.y = -1
        }
        if (e.keyCode == KeyCode.KEY_D || e.keyCode == KeyCode.ARROW_RIGHT) {
            this.dir.x = 1
        }
        if (e.keyCode == KeyCode.KEY_A || e.keyCode == KeyCode.ARROW_LEFT) {
            this.dir.x = -1
        }
    }

    onKeyUp(e) {
        if (e.keyCode == KeyCode.KEY_W || e.keyCode == KeyCode.ARROW_UP) {
            this.dir.y = this.dir.y == 1 ? 0 : this.dir.y
        }
        if (e.keyCode == KeyCode.KEY_S || e.keyCode == KeyCode.ARROW_DOWN) {
            this.dir.y = this.dir.y == -1 ? 0 : this.dir.y
        }
        if (e.keyCode == KeyCode.KEY_D || e.keyCode == KeyCode.ARROW_RIGHT) {
            this.dir.x = this.dir.x == 1 ? 0 : this.dir.x
        }
        if (e.keyCode == KeyCode.KEY_A || e.keyCode == KeyCode.ARROW_LEFT) {
            this.dir.x = this.dir.x == -1 ? 0 : this.dir.x
        }
    }

    getDir() {
        if (!this.dir) return cc.v3()
        return cc.v3(this.dir.x, this.dir.y, 0).normalize()
    }
}


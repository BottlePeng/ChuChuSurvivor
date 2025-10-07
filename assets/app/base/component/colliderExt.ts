import { _decorator, BoxCollider2D, CircleCollider2D, PolygonCollider2D, Contact2DType, director } from 'cc';
import { ccBase } from './ccBase';
const { ccclass, menu } = _decorator;

//cocos内置碰撞组件扩展
@ccclass('colliderExt')
@menu('base/colliderExt')
export class colliderExt extends ccBase {
    init(caller, delay = 0, collider) {
        this.caller = caller
        this.delay = delay
        this.solveCd = delay
        if (collider) {
            this.collider = collider
        } else {
            this.collider = $(this.node, BoxCollider2D)
            if (!this.collider) this.collider = $(this.node, CircleCollider2D)
            if (!this.collider) this.collider = $(this.node, PolygonCollider2D)
        }
        if (!this.collider) return
        this.collider.uid = H.uid()
        this.collider.solve = {}
        this.collider.on(Contact2DType.BEGIN_CONTACT, this._startContact, this)
        this.collider.on(Contact2DType.END_CONTACT, this._endContact, this)
    }

    onDestroy() {
        if (!this.collider) return
        this.collider.off(Contact2DType.BEGIN_CONTACT, this._startContact, this)
        this.collider.off(Contact2DType.END_CONTACT, this._endContact, this)
    }

    //开始碰撞
    _startContact(self, other) {
        if (!this.caller) return
        if (this.caller.startContact) this.caller.startContact(self, other)
        if (this.caller.solveContact) this.collider.solve[other.uid] = {self: self, other: other}
    }

    //结束碰撞
    _endContact(self, other) {
        if (!this.caller) return
        if (this.caller.endContact) this.caller.endContact(self, other)
        if (this.caller.solveContact) delete this.collider.solve[other.uid]
    }

    //碰撞中
    _solveContact(self, other) {
        if (!this.caller) return
        if (this.caller.solveContact) this.caller.solveContact(self, other)
    }

    update(dt) {
        if (!this.collider) return
        if (!this.caller) return
        if (!this.caller.solveContact) return

        if (this.solveCd > 0) {
            this.solveCd -= dt
            return
        }
        for (let key in this.collider.solve) {
            if (this.collider.solve[key].self.node.active && this.collider.solve[key].other.node.active) {
                this._solveContact(this.collider.solve[key].self, this.collider.solve[key].other)
            } else {
                delete this.collider.solve[key]
            }
        }
        this.solveCd = this.delay
    }
}


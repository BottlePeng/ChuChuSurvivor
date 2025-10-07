import { _decorator, BoxCollider2D, CircleCollider2D, PolygonCollider2D } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('skillBase')
export class skillBase extends ccBase {
    initBase(param) {
        param = {...{
            role: null,
            hurtPercent: 100,
            skillName: '',
            contactCd: 0.1,
        }, ...param}

        for (let key in param) this[key] = param[key]

        if (this.getCollider(this.node)) {
            this.colliderExt = H.add$(this.node, 'colliderExt', true)
            this.colliderExt.init(this, param.contactCd)
            this.colliderExt.collider.group = R('global').group[param.role.group]
            this.colliderExt.collider.enabled = true
        }
    }

    getCollider(node) {
        let collider = $(node, BoxCollider2D)
        if (!collider) collider = $(this.node, CircleCollider2D)
        if (!collider) collider = $(this.node, PolygonCollider2D)
        return collider
    }

    getDefaultDir() {
        if (!this.role) return cc.v3()
        let dir = cc.v3()
        if (this.role.inputDir && !this.role.inputDir.equals(cc.Vec3.ZERO)) {
            dir = this.role.inputDir.clone()
        } else {
            if (this.role.move.dir.equals(cc.Vec3.ZERO)) {
                dir = cc.v3(this.role.bodyNode.scaleX, 0, 0)
            } else {
                if (this.role.getDir) {
                    dir = this.role.getDir()
                } else {
                    dir = this.role.move.dir.clone()
                }
            }
        }
        return dir
    }
}


import { _decorator } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('drug')
export class drug extends ccBase {
    initData(param) {
        param = {...{
            asset: '',
            cd: 3,
            num: 1,
            scale: 1,
            timeout: 3,
            hurtPercent: 100,
        }, ...param}
        this.hurtPercent = param.hurtPercent

        this.prefab = G('asset').getPrefab(param.asset)

        this.defCd = param.cd
        this.cd = this.defCd

        this.num = param.num
        this.scale = param.scale
        this.timeout = param.timeout

        this.skillCd = 0
    }

    init(role, skillName) {
        this.role = role
        this.skillName = skillName
    }

    createItems() {
        if (!G('skill').checkRole(this.role)) return

        for (let i = 1; i <= this.num; i++) {
            let node = G('pool').get(this.prefab)
            node.scaleX = this.scale
            node.scaleY = this.scale
            node.parent = G('skill').parent1Node
            let skill = $(node, 'skillBase')
            skill.initBase({
                role: this.role,
                hurtPercent: this.hurtPercent,
                skillName: this.skillName,
                contactCd: 0.2,
            })
            skill.init({
                timeout: this.timeout
            })
            let byWorldPos = this.role.node.getWorldPosition()
            let w = (app.screen.width / 2) * 0.7
            let h = (app.screen.height / 2) * 0.7
            let x = H.randNum(-w, w)
            let y = H.randNum(-h, h)
            node.setWorldPosition(cc.v3(byWorldPos.x + x, byWorldPos.y + y))
        }
    }

    update(dt) {
        if (!this.role) return
        if (!this.prefab) return
        if (M('fight').stop) return

        if (this.skillCd > 0) {
            this.skillCd -= dt
            return
        }

        this.cd -= dt
        if (this.cd > 0) return

        if (this.role.group == 'enemy') {
            if (this.role.animExt.isPlaying('move')) return
        }
        this.createItems()
        this.skillCd = this.timeout
        this.cd = this.defCd
    }
}


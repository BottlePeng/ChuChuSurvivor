import { _decorator } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('tornado')
export class tornado extends ccBase {
    init(role, skillName) {
        this.role = role
        this.skillName = skillName
    }

    initData(param) {
        param = {...{
            asset: '',
            scale: 2,
            num: 1,
            cd: 1,
            timeout: 10,
            speed: 100,
            hurtPercent: 100,
        }, ...param}
        this.hurtPercent = param.hurtPercent

        this.prefab = G('asset').getPrefab(param.asset)

        this.scale = param.scale
        this.num = param.num
        this.speed = param.speed
        this.timeout = param.timeout

        this.defCd = param.cd
        this.cd = this.defCd

        this.skillCd = 0
    }

    createItems() {
        if (!G('skill').checkRole(this.role)) return

        this.skillCd = this.timeout
        for (let i = 1; i <= this.num; i++) {
            let node = G('pool').get(this.prefab)
            node.scaleX = this.scale
            node.scaleY = this.scale
            node.parent = G('fight').parent1Node
            let skill = $(node, 'skillBase')
            skill.initBase({
                role: this.role,
                hurtPercent: this.hurtPercent,
                skillName: this.skillName,
                contactCd: 0.2,
            })
            skill.init(this.speed, this.timeout)
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

        if (this.cd > 0) {
            this.cd -= dt
            return
        }

        if (this.role.group == 'enemy') {
            if (this.role.animExt.isPlaying('move')) return
        }

        this.createItems()
        this.cd = this.defCd
    }
}


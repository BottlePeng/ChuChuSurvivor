import { _decorator } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('gem')
export class gem extends ccBase {
    init(role, skillName) {
        this.role = role
        this.skillName = skillName
    }

    initData(param) {
        param = {...{
            asset: '',
            scale: 1,
            num: 1,
            cd: 3,
            timeout: 5,
            speed: 1200,
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
    }

    createItems() {
        if (!G('skill').checkRole(this.role)) return

        for (let i = 1; i <= this.num; i++) {
            let node = G('pool').get(this.prefab)
            node.scaleX = this.scale
            node.scaleY = this.scale
            node.parent = G('skill').parent2Node

            let skill = $(node, 'skillBase')
            skill.initBase({
                role: this.role,
                hurtPercent: this.hurtPercent,
                skillName: this.skillName,
            })
            skill.init(i, this.speed, this.timeout)
        }
    }

    update(dt) {
        if (!this.role) return
        if (!this.prefab) return
        if (M('fight').stop) return

        this.cd -= dt
        if (this.cd > 0) return

        if (this.role.group == 'enemy') {
            if (this.role.animExt.isPlaying('move')) return
        }

        this.createItems()
        this.cd = this.defCd
    }
}


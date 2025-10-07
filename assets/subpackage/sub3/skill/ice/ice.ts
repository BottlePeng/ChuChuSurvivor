import { _decorator } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('ice')
export class ice extends ccBase {
    init(role, skillName) {
        this.role = role
        this.skillName = skillName
    }

    initData(param) {
        param = {...{
            asset: '',
            scale: 1,
            num: 1,
            speed: 800,
            cd: 3,
            pierce: 1, //穿透
            freezeCd: 1,
            freezeScale: 1,
            hurtPercent: 100,
        }, ...param}
        this.param = param

        this.hurtPercent = param.hurtPercent

        this.prefab = G('asset').getPrefab(param.asset)

        this.scale = param.scale
        this.num = param.num
        this.speed = param.speed

        this.defCd = param.cd
        this.cd = this.defCd
    }

    createItems() {
        if (!G('skill').checkRole(this.role)) return
        let targets = this.role.getRandTargets(this.num)
        if (targets.length < 1) return
        H.forArr(targets, target => {
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
            skill.init(target, this.speed)
            skill.initData(this.param)
        })
    }

    update(dt) {
        if (!this.role) return
        if (!this.prefab) return
        if (M('fight').stop) return

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


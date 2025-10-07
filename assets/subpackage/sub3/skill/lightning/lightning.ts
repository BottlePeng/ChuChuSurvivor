import { _decorator } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('lightning')
export class lightning extends ccBase {
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
            hurtPercent: 100,
        }, ...param}
        this.hurtPercent = param.hurtPercent

        this.prefab = G('asset').getPrefab(param.asset)

        this.scale = param.scale
        this.num = param.num
        this.defCd = param.cd
        this.cd = this.defCd
    }

    createItems() {
        if (!G('skill').checkRole(this.role)) return
        let targets = this.role.getRandTargets(this.num)
        H.forArr(targets, target => {
            let node = G('pool').get(this.prefab)
            node.scaleX = this.scale
            node.scaleY = this.scale
            if (H.calProb(50)) node.scaleX = -node.scaleX
            node.parent = G('skill').parent2Node
            node.setWorldPosition(target.node.getWorldPosition())

            let skill = $(node, 'skillBase')
            skill.initBase({
                role: this.role,
                hurtPercent: this.hurtPercent,
                skillName: this.skillName,
            })
            skill.init(target)
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


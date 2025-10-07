import { _decorator } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('bullet')
export class bullet extends ccBase {
    initData(param) {
        param = {...{
            asset: '',
            color: '#FFFFFF',
            scale: 1,
            angle: 15,
            num: 1,
            speed: 200,
            cd: 3,
            pierce: 1, //穿透
            isRound: false, //环绕一圈: (360 / angle / 2) = num
            isRandTarget: false,//是否随机目标
            hurtPercent: 100,
        }, ...param}
        this.param = param

        this.hurtPercent = param.hurtPercent

        this.prefab = G('asset').getPrefab(param.asset)
        this.color = param.color
        this.scale = param.scale
        this.angle = param.angle
        this.num = param.num
        this.speed = param.speed
        this.defCd = param.cd
        this.cd = this.defCd
        this.pierce = param.pierce
        this.isRandTarget = param.isRandTarget
        if (param.isRound) {
            this.num = (360 / this.angle) / 2
        }
    }

    init(role, skillName) {
        this.role = role
        this.skillName = skillName
        this.items = []
    }

    createItems() {
        if (!G('skill').checkRole(this.role)) return
        if (!this.role.move.dir) {
            if (!this.role.target) return
        }
        for (let i = 1; i <= this.num; i++) {
            let node = G('pool').get(this.prefab)
            let skill = $(node, 'skillBase')
            skill.initBase({
                role: this.role,
                hurtPercent: this.hurtPercent,
                skillName: this.skillName,
            })

            node.scaleX = this.scale
            node.scaleY = this.scale
            let animNode = cc.find('anim', node)
            if (animNode) {
                animNode.color = cc.color(this.color)
            } else {
                node.color = cc.color(this.color)
            }
            node.parent = G('skill').parent2Node

            skill.init({
                index: i,
                speed: this.speed,
                angle: this.angle,
                pierce: this.pierce,
                isRandTarget: this.isRandTarget,
            })

            if (skill.initData) {
                skill.initData(this.param)
            }
        }
    }

    update(dt) {
        if (!this.role) return
        if (!this.prefab) return
        if (M('fight').stop) return

        this.cd -= dt
        if (this.cd > 0) return

        if (this.role.group == 'enemy' && this.role.data.bossLevel <= 0) {
            if (this.role.animExt.isPlaying('move')) return
        }

        this.createItems()
        this.cd = this.defCd
    }
}


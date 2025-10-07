import { _decorator, MotionStreak } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('sword')
export class sword extends ccBase {
    init(role, skillName) {
        this.role = role
        this.skillName = skillName
        this.items = []
    }

    initData(param) {
        param = {...{
            asset: '',
            scale: 2,
            cd: 3,
            num: 1,
            roundNum: 1, //环绕几圈
            hurtPercent: 100,
        }, ...param}

        this.radius = this.role.node.realSizeW
        this.hurtPercent = param.hurtPercent
        this.num = param.num
        this.scale = param.scale

        this.prefab = G('asset').getPrefab(param.asset)

        this.defCd = param.cd
        this.cd = this.defCd

        this.roundTime = 1
        this.defSkillCd = this.roundTime * param.roundNum
        this.skillCd = 0
        this.removeAll()
    }

    createItems() {
        if (!G('skill').checkRole(this.role)) return
        if (!this.prefab) return
        let byWorldPos = this.role.bodyNode.getWorldPosition()
        for (let i = 1; i <= this.num; i++) {
            let node = G('pool').get(this.prefab)
            node.parent = G('skill').parent2Node
            node.scaleX = this.scale
            node.scaleY = this.scale
            let skill = $(node, 'skillBase')
            skill.initBase({
                role: this.role,
                hurtPercent: this.hurtPercent,
                skillName: this.skillName,
            })
            let motionStreak = $(cc.find('track', node), MotionStreak)
            motionStreak.stroke = node.realSizeW * 0.8

            let item = {}
            item.node = node
            item.angle = i * (360 / this.num)
            this.updItemWorldPos(item, byWorldPos)
            this.items.push(item)
        }
    }

    updItemWorldPos(item, byWorldPos) {
        // 将角度转换为弧度
        let radian = H.angleToRadian(item.angle)
        let worldPos = cc.v3()
        worldPos.x = byWorldPos.x + this.radius * Math.cos(radian)
        worldPos.y = byWorldPos.y + this.radius * Math.sin(radian)
        // 更新节点的位置
        item.node.setWorldPosition(worldPos)
    }

    updItems(dt) {
        if (this.items.length < 1) return
        let byWorldPos = this.role.bodyNode.getWorldPosition()
        H.forArr(this.items, item => {
            this.updItemWorldPos(item, byWorldPos)
            // 计算下一帧的角度
            let anglePerFrame = dt * (360 / this.roundTime)
            item.angle -= anglePerFrame
            // 重置角度，避免数值过大
            if (item.angle >= 360) {
                item.angle %= 360
            } else if (item.angle <= -360) {
                item.angle %= -360
            }
            let toPos = item.node.getWorldPosition()
            let byPos = byWorldPos
            item.node.angle = H.dirToAngle(H.posToDir(byPos, toPos))
        })
    }

    removeAll() {
        if (this.items) {
            H.forArr(this.items, item => {
                G('pool').put(item.node)
            })
            this.items = []
        }
    }

    onDisable() {
        this.removeAll()
    }

    update(dt) {
        if (!this.role) return
        if (M('fight').stop) return

        this.updItems(dt)

        if (this.skillCd > 0) {
            this.skillCd -= dt
            if (this.skillCd <= 0) {
                this.removeAll()
            }
            return
        }

        this.cd -= dt
        if (this.cd > 0) return
        this.createItems()
        this.cd = this.defCd

        this.skillCd = this.defSkillCd
    }
}


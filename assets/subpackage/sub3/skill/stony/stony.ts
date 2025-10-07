import { _decorator } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('stony')
export class stony extends ccBase {
    initData(param) {
        param = {...{
            asset: '',
            num: 3,
            cd: 3,
            radius: 100, //半径
            roundTime: 2, //环绕速度
            timeout: 5, //持续时间
            scale: 1,
            clockwise: false, //顺时针
            hurtPercent: 100,
        }, ...param}

        this.hurtPercent = param.hurtPercent

        this.prefab = G('asset').getPrefab(param.asset)

        this.num = param.num
        this.defCd = param.cd
        this.cd = this.defCd

        this.radius = param.radius
        this.roundTime = param.roundTime
        this.timeout = param.timeout

        this.scale = param.scale

        this.clockwise = param.clockwise

        this.skillCd = 0

        this.removeAll()
    }

    init(role, skillName) {
        this.role = role
        this.skillName = skillName
    }

    onDisable() {
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
            let item = {}
            item.node = node
            item.angle = i * (360 / this.num)
            this.updItemWorldPos(item, byWorldPos)
            this.items.push(item)
        }
    }

    removeAll() {
        if (this.items) {
            H.forArr(this.items, item => {
                G('pool').put(item.node)
            })
        }
        this.items = []
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
            if (this.clockwise) {
                item.angle -= anglePerFrame
            } else {
                item.angle += anglePerFrame
            }
            // 重置角度，避免数值过大
            if (item.angle >= 360) {
                item.angle %= 360
            } else if (item.angle <= -360) {
                item.angle %= -360
            }
        })
    }

    update(dt) {
        if (!this.role) return
        if (M('fight').stop) return

        this.updItems(dt)
        if (this.defCd <= 0) {
            if (this.items.length < 1) {
                this.createItems()
            }
            return
        }

        if (this.skillCd > 0) {
            this.skillCd -= dt
            if (this.skillCd <= 0) {
                this.removeAll()
            }
            return
        }

        if (this.cd > 0) {
            this.cd -= dt
            return
        }

        if (this.items.length < 1) {
            this.createItems()
        }
        this.skillCd = this.timeout
        this.cd = this.defCd
    }
}


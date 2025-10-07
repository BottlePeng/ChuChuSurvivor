import { _decorator } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('hole')
export class hole extends ccBase {
    init(role, skillName) {
        this.role = role
        this.skillName = skillName
    }

    initData(param) {
        param = {...{
            asset: '',
            scale: 1,
            color: '#FFFFFF',
            hurtCd: 0.5,
            hurtPercent: 100,
        }, ...param}

        this.remove()

        let node = G('pool').get(G('asset').getPrefab(param.asset))
        node.parent = G('skill').parent1Node
        node.zIndex = 9998
        this.skill = H.add$(node, 'skillBase')
        this.skill.node.scaleX = param.scale
        this.skill.node.scaleY = param.scale
        this.find('anim', cc.Sprite, this.skill.node).color = cc.color(param.color)
        this.skill.initBase({
            role: this.role,
            hurtPercent: param.hurtPercent,
            skillName: this.skillName,
            contactCd: param.hurtCd
        })
        this.skill.solveContact = (self, other) => {
            let role = G('fight').getRole(other.node)
            if (!role) return
            if (role.state.lose) return
            if (role.onContact) role.onContact(other, self)
        }
    }

    remove() {
        if (this.skill) {
            this.skill.node.removeComponent('skillBase')
            G('pool').put(this.skill.node)
            this.skill = null
        }
    }

    update(dt) {
        if (!this.role) return
        if (!this.skill) return
        if (M('fight').stop) return
        if (this.role.state.lose) {
            G('pool').put(this.skill.node)
            this.skill = null
            return
        }
        this.skill.node.setWorldPosition(this.role.bodyNode.worldPosition)
    }
}


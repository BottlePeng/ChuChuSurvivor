import { _decorator } from 'cc';
import { skillBase } from '../skillBase';
const { ccclass } = _decorator;

@ccclass('lightningItem')
export class lightningItem extends skillBase {
    init(target) {
        this.anim = this.find('anim', cc.Animation)
        H.playAnim(this.anim, {events: ['skill']}, () => {
            this.createBoom()
        }).then(() => {
            G('pool').put(this.node)
        })
        if (!this.role) return
        if (!target) return
        target.onContact({node: target.node}, {node: this.node})
    }

    createBoom() {
        let boomAsset = this.node.name == 'lightning2' ? 'lightningBoom2' : 'lightningBoom1'
        let node = G('pool').get(G('asset').getPrefab(boomAsset))
        node.parent = G('skill').parent2Node
        node.scaleX = this.node.scaleX
        node.scaleY = this.node.scaleY
        node.setWorldPosition(this.node.getWorldPosition())

        let skill = H.add$(node, 'skillBase', true)
        skill.initBase({
            role: this.role,
            hurtPercent: this.hurtPercent / 2,
            skillName: this.skillName,
        })
        let anim = this.find('anim', cc.Animation, node)
        H.playAnim(anim).then(() => {
            G('pool').put(node)
        })
    }
}


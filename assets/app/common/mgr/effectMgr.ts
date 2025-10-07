import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('effectMgr')
export class effectMgr {
    init(param) {
        param = {...{
            parent1Node: null,
            parent2Node: null,
        }, ...param}
        for (let key in param) this[key] = param[key]

        this.setSpeedMul(1)
    }

    setSpeedMul(mul) {
        this.speedMul = mul
    }

    create(asset, param) {
        param = {...{
            by: null,
            animName: '',
            color: '#FFFFFF',
            timeout: 0,
            scale: 1,
            followNode: null,
            parentNode: null,
            layer: 2,
        }, ...param}
        let parentNode = param.parentNode
        if (!parentNode) parentNode = this['parent' + param.layer + 'Node']
        if (!parentNode) parentNode = this.parent1Node

        if (!param.animName) param.animName = asset
        let worldPos
        if (H.is$(param.by, cc.Node)) {
            worldPos = param.by.getWorldPosition()
        } else {
            worldPos = param.by
        }
        let node = G('pool').get(G('asset').getPrefab(asset), parentNode)
        node.setScale(param.scale, param.scale, 1)
        let effect = $(node, 'effect')
        if (!effect) {
            effect = {}
            effect.node = node
        }
        effect.speedMul = this.speedMul ? this.speedMul : 1
        effect.anim = H.find('anim', cc.Animation, effect.node)
        effect.onRemove = () => {}
        if (worldPos) effect.node.setWorldPosition(worldPos)
        if (effect.anim) {
            let sprite = $(effect.anim.node, cc.Sprite)
            if (sprite) sprite.color = cc.color(param.color)

            let animState = effect.anim.getState(param.animName)
            if (animState) {
                animState.speed = effect.speedMul
                animState.once(cc.Animation.EventType.FINISHED, () => {
                    if (effect) {
                        G('pool').put(effect.node)
                        effect.onRemove()
                        effect = null
                    }
                })
                effect.anim.play(param.animName)
            } else {
                G('pool').put(effect.node)
                effect.onRemove()
                effect = null
            }
        }
        if (param.timeout > 0) {
            setTimeout(() => {
                if (effect) {
                    G('pool').put(effect.node)
                    if (effect.onRemove) effect.onRemove()
                    effect = null
                }
            }, (param.timeout * 1000) / this.speedMul)
        }
        if (param.followNode) {
            if (effect.follow) effect.follow(param.followNode)
        }
        return effect
    }
}


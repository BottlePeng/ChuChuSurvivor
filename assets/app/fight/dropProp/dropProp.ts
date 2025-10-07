import { _decorator } from 'cc';
import { ccBase } from '../../base/component/ccBase';
const { ccclass, property } = _decorator;

@ccclass('dropProp')
export class dropProp extends ccBase {
    @property(cc.String)
    type = ''

    init(player) {
        this.player = player
        this.move = {}
        this.move.speed = player.move.speed * 2
        this.move.dir = cc.v3()
        this.move.canMove = false
        this.isPlaying = false

        let staticDropTypes = G('dropProp').getStaticDropTypes()
        this.isMoveProp = !staticDropTypes.includes(this.type)
    }

    onRemove(type) {
    }

    remove() {
        G('dropProp').remove(this)
        this.onRemove(this.type)
    }

    playAnim(callFunc) {
        if (this.isPlaying) return
        this.isPlaying = true
        let toPos = this.player.bodyNode.getWorldPosition()
        let selfPos = this.node.getWorldPosition()
        let dir = H.posToDir(toPos, selfPos)
        let pos = cc.v2(this.node.x + dir.x * this.node.sizeW, this.node.y + dir.y * this.node.sizeH)
        cc.tween(this.node)
        .to(0.1, {position: {x: pos.x, y: pos.y}})
        .call(() => {
            if (callFunc) callFunc()
        })
        .start()
    }

    moveToTarget() {
        this.playAnim(() => {
            this.move.canMove = true
        })
    }

    update(dt) {
        if (M('fight').stop) return
        if (!this.player) return

        let toPos = this.player.bodyNode.getWorldPosition()
        let selfPos = this.node.getWorldPosition()
        let dist = H.dist(selfPos, toPos)

        if (this.isMoveProp) {
            if (dist <= this.player.propRadius) {
                this.playAnim(() => {
                    this.move.canMove = true
                })
            }
        } else {
            if (dist <= this.player.node.sizeW * 0.7) {
                this.remove()
                return
            }
        }

        if (!this.move.canMove) return
        this.move.dir = H.posToDir(selfPos, toPos)

        if (dist <= 10) {
            this.remove()
            return
        }
        let speed = this.move.speed * dt
        this.node.x += this.move.dir.x * speed
        this.node.y += this.move.dir.y * speed

    }
}


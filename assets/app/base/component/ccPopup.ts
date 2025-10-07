import { _decorator } from 'cc';
import { ccBase } from './ccBase';
const { ccclass } = _decorator;

@ccclass('ccPopup')
export class ccPopup extends ccBase {
    playAnim(node, type = 'show') {
        return new Promise(resolve => {
            if (node._isPlaying) return
            node._isPlaying = true
            if (type == 'show') {
                node.opacity = 0
                node.setScale(0.5, 0.5, 1)
                cc.tween(node)
                .to(0.1, {scale: cc.v3(1.1, 1.1, 1)}, {
                    onUpdate: (target, ratio) => {
                        node.opacity = 255 * ratio
                    }
                })
                .to(0.1, {scale: cc.v3(1, 1, 1)})
                .call(() => {
                    node._isPlaying = false
                    resolve()
                })
                .start()
            }
            if (type == 'close') {
                node.setScale(1, 1, 1)
                cc.tween(node)
                .to(0.1, {scale: cc.v3(0.5, 0.5, 1)}, {
                    onUpdate: (target, ratio) => {
                        node.opacity = 255 - (255 * ratio)
                    }
                })
                .call(() => {
                    node._isPlaying = false
                    resolve()
                })
                .start()
            }
        })
    }

    onEnable() {
        this.bgNode = this.find('bg')
        if (this.bgNode) {
            if (this.bgNode.parent.uuid != this.node.uuid) {
                this.bgNode = null
            }
        }
        if (this.bgNode) {
            this.bgNode.on('touch-end', e => {
                E.stop(e)
            })
            this.playAnim(this.bgNode, 'show')
        }
        this.node.on('touch-end', e => {
            E.stop(e)
            if (this.touchClose === false) return
            this.remove()
        })
    }

    onDisable() {
        if (this.bgNode) this.bgNode.off('touch-end')
        this.node.off('touch-end')
    }

    remove() {
        if (this.bgNode) {
            this.playAnim(this.bgNode, 'close').then(() => {
                this._remove()
                this.onRemove()
            })
            return
        }
        this._remove()
        this.onRemove()
    }

    onRemove() {
    }
}


import { _decorator } from 'cc';
import { ccBase } from '../../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('effect')
export class effect extends ccBase {
    speedMul = 1

    //timeout > isLookAt
    moveTo(to, ...args) {
        return new Promise(resolve => {
            let timeout, isLookAt
            if (H.isNum(args[0])) {
                timeout = args[0]
                isLookAt = args[1]
            }
            if (H.isBool(args[0])) {
                isLookAt = args[0]
            }
            if (!H.isNum(timeout)) timeout = 0
            if (!H.isBool(isLookAt)) isLookAt = true

            let moveSpeed = 600

            let toPos
            if (H.is$(to, cc.Node)) {
                toPos = H.toAR(to, this.node.parent)
            } else {
                toPos = to
            }
            if (isLookAt) this.lookAt(toPos)

            let speed = moveSpeed * this.speedMul
            let byPos = this.node.getPosition()
            let dist = H.dist(byPos, toPos)
            let delay = dist / speed
            cc.tween(this.node)
            .to(delay, {position: cc.v3(toPos.x, toPos.y, 0)})
            .call(() => {
                if (timeout > 0) {
                    if (H.is$(to, cc.Node)) this.follow(to)
                    this.scheduleOnce(() => {
                        G('pool').put(this.node)
                        resolve()
                    }, timeout)
                    return
                }
                G('pool').put(this.node)
                resolve()
            })
            .start()
        })
    }

    lookAt(to) {
        let toPos
        if (H.is$(to, cc.Node)) {
            toPos = H.toAR(to, this.node.parent)
        } else {
            toPos = to
        }
        let byPos = this.node.getPosition()
        let dir = H.posToDir(byPos, toPos)
        this.node.angle = H.dirToAngle(dir)
    }

    follow(followNode) {
        this.followNode = followNode
    }

    update() {
        if (this.followNode && this.followNode.isValid) {
            this.node.setWorldPosition(this.followNode.worldPosition)
        }
    }
}


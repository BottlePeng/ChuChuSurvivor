import { _decorator } from 'cc';
const { ccclass, menu } = _decorator;

import { RVOMath, Vector2 } from './Common'
import { Simulator } from './Simulator'
import { ccBase } from '../ccBase';

@ccclass('rvo')
@menu('base/rvo')
export class rvo extends ccBase {
    stop = false

    datas = []

    add(param) {
        param = {...{
            uid: '',
            node: null,
            speed: 200,
        }, ...param}
        this.speed = param.speed
        let worldPos = param.node.getWorldPosition()
        let vector2 = new Vector2(worldPos.x, worldPos.y)

        let agentId = Simulator.instance.addAgent({
            vector2: vector2,
            maxSpeed: this.speed,
            radius: param.node.realSizeW / 2,
            neighborDist: param.node.realSizeW,
            maxNeighbors: 10,
            timeHorizon: 1,
            timeHorizonObst: 0.1,
            mass: 1,
        })

        let data = {
            uid: param.uid,
            agentId: agentId,
            node: param.node,
            vector2: vector2,
            toVector2: new Vector2(0, 0),
        }

        this.datas.push(data)
        return agentId
    }

    remove(uid) {
        let data = this.datas.find(a => a.uid == uid)
        if (!data) return
        Simulator.instance.removeAgent(data.agentId)
        this.datas = this.datas.filter(a => a.uid != uid)
    }

    stopAgentId(agentId) {
        if (!agentId) return
        Simulator.instance.setAgentPrefVelocity(agentId, new Vector2(0, 0))
    }

    getData(uid) {
        if (!this.datas) return
        return this.datas.find(a => a.uid == uid)
    }

    setWorldPos(uid, worldPos) {
        if (!this.datas) return
        let data = this.datas.find(a => a.uid == uid)
        if (!data) return
        data.node.setWorldPosition(cc.v3(worldPos.x, worldPos.y))
        let vector2 = new Vector2(worldPos.x, worldPos.y)
        Simulator.instance.setPosition(data.agentId, vector2)
    }

    updateWorldPos(uid, worldPos) {
        if (!this.datas) return
        let data = this.datas.find(a => a.uid == uid)
        if (!data) return
        data.toVector2 = new Vector2(worldPos.x, worldPos.y)

        let agentPos = Simulator.instance.getAgentPosition(data.agentId)
        if (!agentPos) return
        if (isNaN(agentPos.x) || isNaN(agentPos.y)) {
            this._reset(data)
            return
        }
        let goalVector = data.toVector2.minus(agentPos)
        if (RVOMath.absSq(goalVector) > 1.0) {
            goalVector = RVOMath.normalize(goalVector).scale(this.speed)
        }
        if (RVOMath.absSq(goalVector) < RVOMath.RVO_EPSILON) {
            Simulator.instance.setAgentPrefVelocity(data.agentId, new Vector2(0, 0))
        } else {
            Simulator.instance.setAgentPrefVelocity(data.agentId, goalVector)
            let angle = Math.random() * 2.0 * Math.PI
            let dist = Math.random() * 0.0001
            Simulator.instance.setAgentPrefVelocity(data.agentId, Simulator.instance.getAgentPrefVelocity(data.agentId).plus(new Vector2(Math.cos(angle), Math.sin(angle)).scale(dist)))
        }
        let toWorldPos = Simulator.instance.getAgentPosition(data.agentId)
        if (toWorldPos) data.node.setWorldPosition(cc.v3(toWorldPos.x, toWorldPos.y))
    }

    //纠错
    async _reset(data) {
        let param = {
            uid: data.uid,
            node: data.node,
            speed: this.speed,
        }
        this.remove(data.uid)
        await this.sleep(0.1)
        this.add(param)
    }

    update(dt) {
        if (this.stop) return
        Simulator.instance.run(dt)
    }
}


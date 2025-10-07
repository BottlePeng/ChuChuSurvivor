import { _decorator, Component, ResolutionPolicy } from 'cc';
const { ccclass } = _decorator;

@ccclass('screen')
export class screen extends Component {

    start() {
        this.width = cc.screen.windowSize.width / cc.view.getScaleX()
        this.height = cc.screen.windowSize.height / cc.view.getScaleY()
        this.size = cc.size(this.width, this.height)

        cc.view.setResolutionPolicy(ResolutionPolicy.SHOW_ALL)
        this.type = 1 //1=竖屏2=横屏
        let ratio = this.size.width / this.size.height
        let designSize = cc.view.getDesignResolutionSize()
        let designRatio = designSize.width / designSize.height
        if (designSize.width > designSize.height) {
            this.type = 2
            ratio = this.size.height / this.size.width
            designRatio = designSize.height / designSize.width
        }
        this.isLong = false
        if (ratio < 0.5) {
            this.isLong = true
            let diff = 160
            if (this.type == 1) {
                cc.view.setDesignResolutionSize(designSize.width, designSize.height + diff)
            } else {
                cc.view.setDesignResolutionSize(designSize.width + diff, designSize.height)
            }
        }
        //cc.view.getScaleX cc.view.getScaleY 有变化，重新设置
        this.width = cc.screen.windowSize.width / cc.view.getScaleX()
        this.height = cc.screen.windowSize.height / cc.view.getScaleY()
        this.size = cc.size(this.width, this.height)
    }

    //完全进入
    isInView(selfNode, targetNode, param) {
        //padding
        param = {...{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }, ...param}

        let selfWorldPos = selfNode.getWorldPosition()
        let targetWorldPos = targetNode.getWorldPosition()
        let targetRect = targetNode.transform.getBoundingBox()
        let diffWidth = targetRect.width * (0.5 - targetNode.transform.anchorX)
        let diffHeight = targetRect.height * (0.5 - targetNode.transform.anchorY)

        let delta = targetWorldPos.subtract(selfWorldPos)
        if (delta.x < 0) {
            delta.x -= (targetRect.width / 2) - diffWidth
            delta.x -= param.left
        }
        if (delta.x > 0) {
            delta.x += (targetRect.width / 2) + diffWidth
            delta.x += param.right
        }
        if (delta.y < 0) {
            delta.y -= (targetRect.height / 2) - diffHeight
            delta.y -= param.bottom
        }
        if (delta.y > 0) {
            delta.y += (targetRect.height / 2) + diffHeight
            delta.y += param.top
        }
        return Math.abs(delta.x) < this.width / 2 && Math.abs(delta.y) < this.height / 2
    }

    //完全出去
    isOutView(selfNode, targetNode, param) {
        //padding
        param = {...{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }, ...param}

        let selfWorldPos = selfNode.getWorldPosition()
        let targetWorldPos = targetNode.getWorldPosition()
        let targetRect = targetNode.transform.getBoundingBox()
        let diffWidth = targetRect.width * (0.5 - targetNode.transform.anchorX)
        let diffHeight = targetRect.height * (0.5 - targetNode.transform.anchorY)

        let delta = targetWorldPos.subtract(selfWorldPos)
        if (delta.x < 0) {
            delta.x += (targetRect.width / 2) + diffWidth
            delta.x -= param.left
        }
        if (delta.x > 0) {
            delta.x -= (targetRect.width / 2) - diffWidth
            delta.x += param.right
        }
        if (delta.y < 0) {
            delta.y += (targetRect.height / 2) + diffHeight
            delta.y -= param.bottom
        }
        if (delta.y > 0) {
            delta.y -= (targetRect.height / 2) - diffHeight
            delta.y += param.top
        }
        return Math.abs(delta.x) > this.width / 2 || Math.abs(delta.y) > this.height / 2
    }

    //检查边界返回结果
    checkView(selfNode, targetNode, param) {
        //padding
        param = {...{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }, ...param}

        let selfWorldPos = selfNode.getWorldPosition()
        let targetWorldPos = targetNode.getWorldPosition()
        let targetRect = targetNode.transform.getBoundingBox()
        let diffWidth = targetRect.width * (0.5 - targetNode.transform.anchorX)
        let diffHeight = targetRect.height * (0.5 - targetNode.transform.anchorY)

        let res = {}
        res.worldPos = targetWorldPos.clone()

        let delta = targetWorldPos.subtract(selfWorldPos)
        if (delta.x < 0) {
            delta.x -= (targetRect.width / 2) - diffWidth
            delta.x -= param.left
        }
        if (delta.x > 0) {
            delta.x += (targetRect.width / 2) + diffWidth
            delta.x += param.right
        }
        if (delta.y < 0) {
            delta.y -= (targetRect.height / 2) - diffHeight
            delta.y -= param.bottom
        }
        if (delta.y > 0) {
            delta.y += (targetRect.height / 2) + diffHeight
            delta.y += param.top
        }

        res.isMaxX = false
        res.isMaxY = false
        if (Math.abs(delta.x) > this.width / 2 || Math.abs(delta.y) > this.height / 2) {
            if (Math.abs(delta.x) > this.width / 2) {
                res.isMaxX = true
                if (delta.x < 0) res.worldPos.x += -(this.width / 2) - delta.x
                if (delta.x > 0) res.worldPos.x -= delta.x - (this.width / 2)
            }
            if (Math.abs(delta.y) > this.height / 2) {
                res.isMaxY = true
                if (delta.y < 0) res.worldPos.y += -(this.height / 2) - delta.y
                if (delta.y > 0) res.worldPos.y -= delta.y - (this.height / 2)
            }
        }
        return res
    }
}


import { _decorator } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('bgItem')
export class bgItem extends ccBase {
    start() {
        let itemNode = this.find('item')
        itemNode.active = false
        let pathInfos = H.randArr(R('global').getFightBgItemPaths(), H.randNum(5, 10))
        H.forArr(pathInfos, pathInfo => {
            let node = H.inst(itemNode, this.node)
            this.loadSpriteFrame(pathInfo.path).then(spriteFrame => {
                node.sprite.spriteFrame = spriteFrame
                node.size = cc.size(spriteFrame.rect.width, spriteFrame.rect.height)
                node.setScale(2, 2, 1)
                let randPos = cc.v3()
                randPos.x = (this.node.sizeW / 2) - (node.sizeW / 2)
                randPos.y = (this.node.sizeH / 2) - (node.sizeH / 2)
                let pos = cc.v3(H.randNum(-randPos.x, randPos.x), H.randNum(-randPos.y, randPos.y), 0)
                node.setPosition(pos)
            })
        })
    }

    loadSpriteFrame(path) {
        if (G('asset').getBundle('sub1')) {
            return G('asset').bundle('sub1').load(path, cc.SpriteFrame)
        }
        return G('asset').load(path, cc.SpriteFrame)
    }
}


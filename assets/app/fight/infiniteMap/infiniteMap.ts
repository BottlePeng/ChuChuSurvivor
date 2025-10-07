import { _decorator } from 'cc';
import { ccBase } from 'db://assets/app/base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('infiniteMap')
export class infiniteMap extends ccBase {
    init(targetNode) {
        this.row = 5
        this.col = 4
        this.size = 1000

        this.targetNode = targetNode
        this.playerGridPosX = 0
        this.playerGridPosY = 0

        this.halfWidth = app.screen.width / 2
        this.halfHeight = app.screen.height / 2

        this.bgNodes = []

        let spriteNames = ['1', '2', '3', '4', '5']
        let spriteName = H.indexArr(spriteNames, M('data').fight.selectLevel - 1)
        for (let row = 0; row < this.row; row++) {
            let nodes = []
            for (let col = 0; col < this.col; col++) {
                let bgItem = H.inst(G('asset').getPrefab('bgItem'), 'bgItem')
                bgItem.node.parent = this.node
                R('global').loadFightBgSpriteFrame(spriteName).then(spriteFrame => {
                    bgItem.node.sprite.spriteFrame = spriteFrame
                })
                let x = col * this.size - this.size + this.halfWidth
                let y = row * this.size - this.size + this.halfHeight
                bgItem.node.setWorldPosition(cc.v3(x, y, 0))
                nodes.push(bgItem.node)
            }
            this.bgNodes.push(nodes)
        }

        this._frame = 0
    }

    tryTileX() {
        let playerGridPosX = Math.round((this.targetNode.x - this.halfWidth) / this.size)
        if (playerGridPosX < this.playerGridPosX) {
            let columnIndex = this.col - 1
            for (let i = 0; i < this.row; i++) {
                let node = this.bgNodes[i][columnIndex]
                let pos = node.getWorldPosition()
                pos.x -= this.col * this.size
                node.setWorldPosition(pos)

                this.bgNodes[i].splice(columnIndex, 1)
                this.bgNodes[i].unshift(node)
            }
        } else if (this.playerGridPosX < playerGridPosX) {
            let columnIndex = 0
            for (let i = 0; i < this.row; i++) {
                let node = this.bgNodes[i][columnIndex]
                let pos = node.getWorldPosition()
                pos.x += this.col * this.size
                node.setWorldPosition(pos)

                this.bgNodes[i].splice(columnIndex, 1)
                this.bgNodes[i].push(node)
            }
        }
        this.playerGridPosX = playerGridPosX
    }

    tryTileY() {
        let playerGridPosY = Math.round((this.targetNode.y - this.halfHeight) / this.size)
        if (playerGridPosY < this.playerGridPosY) {
            let rowIndex = this.row - 1
            let nodesInRow = []
            for (let i = 0; i < this.col; i++) {
                let node = this.bgNodes[rowIndex][i]
                let pos = node.getWorldPosition()
                pos.y -= this.row * this.size
                node.setWorldPosition(pos)
                nodesInRow.push(node)
            }
            this.bgNodes.splice(rowIndex, 1)
            this.bgNodes.unshift(nodesInRow)
        } else if (this.playerGridPosY < playerGridPosY) {
            let rowIndex = 0
            let nodesInRow = []
            for (let i = 0; i < this.col; i++) {
                let node = this.bgNodes[rowIndex][i]
                let pos = node.getWorldPosition()
                pos.y += this.row * this.size
                node.setWorldPosition(pos)
                nodesInRow.push(node)
            }
            this.bgNodes.splice(rowIndex, 1)
            this.bgNodes.push(nodesInRow)
        }
        this.playerGridPosY = playerGridPosY
    }

    update(dt) {
        if (!this.targetNode) return
        this._frame++
        if ((this._frame % 30) == 0) {
            this._frame = 0
            this.tryTileX()
            this.tryTileY()
        }
    }
}


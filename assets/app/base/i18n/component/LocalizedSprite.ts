import { _decorator, Component } from 'cc';
const { ccclass, property, type, executeInEditMode, menu } = _decorator;

@ccclass('LocalizedSpriteItem')
class LocalizedSpriteItem {
    @property
    language = 'zh'
    @property(cc.SpriteFrame)
    spriteFrame = null
}

@ccclass('LocalizedSprite')
@menu('i18n/LocalizedSprite')
@executeInEditMode
export class LocalizedSprite extends Component {
    @type(LocalizedSpriteItem)
    spriteList = []

    start() {
        if (typeof R != 'undefined') {
            this.i18n = R('i18n')
            if (!this.i18n.isInit) this.i18n.init(this.i18n.defLanguage)
            this.fetchRender()
        }
    }

    fetchRender() {
        let sprite = this.node.getComponent(cc.Sprite)
        if (sprite) {
            this.sprite = sprite
            this.updateSprite()
        }
    }

    updateSprite() {
        if (!this.i18n) return
        if (!this.sprite) return
        for (let i = 0; i < this.spriteList.length; i++) {
            const item = this.spriteList[i]
            if (item.language === this.i18n.language) {
                this.sprite.spriteFrame = item.spriteFrame
                break
            }
        }
    }
}

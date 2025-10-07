import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('miscAsset')
export class miscAsset extends Component {
    @property(cc.SpriteFrame)
    goldSpriteFrame = null

    @property(cc.SpriteFrame)
    equipNumSpriteFrame = null

    @property(cc.SpriteFrame)
    chipSpriteFrame = null

    @property(cc.SpriteFrame)
    healPotionSpriteFrame = null

    @property(cc.SpriteFrame)
    videoSpriteFrame = null

    @property(cc.SpriteFrame)
    propRadiusSpriteFrame = null

    @property(cc.SpriteFrame)
    ATKSpriteFrame = null

    @property(cc.SpriteFrame)
    HPSpriteFrame = null

    @property(cc.SpriteFrame)
    SPDSpriteFrame = null
}


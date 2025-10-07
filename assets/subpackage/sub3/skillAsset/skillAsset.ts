import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('skillAsset')
export class skillAsset extends Component {
    @property(cc.SpriteFrame)
    stonySpriteFrames = []

    @property(cc.SpriteFrame)
    drugSpriteFrames = []

    @property(cc.SpriteFrame)
    dartSpriteFrames = []

    @property(cc.SpriteFrame)
    fireBallSpriteFrames = []

    @property(cc.SpriteFrame)
    holeSpriteFrames = []

    @property(cc.SpriteFrame)
    swordSpriteFrames = []

    @property(cc.SpriteFrame)
    magicBallSpriteFrames = []

    @property(cc.SpriteFrame)
    lightningSpriteFrames = []

    @property(cc.SpriteFrame)
    boomerangSpriteFrames = []

    @property(cc.SpriteFrame)
    bombSpriteFrames = []

    @property(cc.SpriteFrame)
    iceSpriteFrames = []

    @property(cc.SpriteFrame)
    kniveSpriteFrames = []

    @property(cc.SpriteFrame)
    gemSpriteFrames = []

    @property(cc.SpriteFrame)
    laserSpriteFrames = []

    @property(cc.SpriteFrame)
    tornadoSpriteFrames = []
}
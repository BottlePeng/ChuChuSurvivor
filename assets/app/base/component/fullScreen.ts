import { _decorator, Component } from 'cc';
const { ccclass, menu } = _decorator;

@ccclass('fullScreen')
@menu('base/fullScreen')
export class fullScreen extends Component {
    onLoad() {
        this.width = cc.screen.windowSize.width / cc.view.getScaleX()
        this.height = cc.screen.windowSize.height / cc.view.getScaleY()
        this.size = cc.size(this.width, this.height)
        this.node.size = this.size
    }
}
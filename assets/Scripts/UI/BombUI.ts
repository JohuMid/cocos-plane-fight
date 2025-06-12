import { _decorator, Component, Label } from 'cc';
import { GameManger } from '../GameManger';
const { ccclass, property } = _decorator;

@ccclass('BombUI')
export class BombUI extends Component {
    @property({ type: Label })
    numberLabel:Label = null

    start() {
        GameManger.getInstance().node.on('onBombChange', this.onBombChange, this); // 监听炸弹数量变化事件
    }

    onBombChange() {
        this.numberLabel.string = GameManger.getInstance().getBombNumber().toString(); // 更新数字标签的文本
    }

    update(deltaTime: number) {
        
    }
}



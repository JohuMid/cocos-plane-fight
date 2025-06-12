import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreUI')
export class ScoreUI extends Component {
    @property({ type: Label })
    numberLabel: Label = null

    start() {
    }

    updateUI(num: Number) {
        this.numberLabel.string = num.toString(); // 更新数字标签的文本
    }

    update(deltaTime: number) {

    }
}



import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {
    @property({ type: Label })
    highestScoreLabel: Label = null;
    @property({ type: Label })
    currentScoreLabel: Label = null;

    showGameOverUI(highestScore: number,currentScore: number) {
        this.node.active = true; // 显示游戏结束界面
        this.highestScoreLabel.string = highestScore.toString()
        this.currentScoreLabel.string = currentScore.toString()
    }

    start() {

    }

    update(deltaTime: number) {

    }
}



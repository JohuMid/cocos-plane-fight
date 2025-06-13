import { _decorator, Component, director, Node } from 'cc';
import { ScoreUI } from './UI/ScoreUI';
import { Player } from './Player';
import { GameOverUI } from './UI/GameOverUI';
const { ccclass, property } = _decorator;

@ccclass('GameManger')
export class GameManger extends Component {

    private static instance: GameManger = null; // 单例实例

    public static getInstance(): GameManger { // 获取单例实例的方法
        if (!GameManger.instance) { // 如果实例不存在，则创建一个新的实例
            GameManger.instance = new GameManger();
        }
        return GameManger.instance; // 返回单例实例
    }

    @property
    private bombNumber: number = 0;

    @property
    private score: number = 0; // 得分


    @property({ type: ScoreUI })
    private ScoreUI = null;

    @property({ type: Player })
    player:Player = null

    @property({ type: Node })
    pauseButtonNode: Node = null; // 暂停按钮节点
    @property({ type: Node })
    resumeButtonNode: Node = null; // 恢复按钮节点

    @property({ type: GameOverUI })
    gameOverUI: GameOverUI = null; // 游戏结束界面节点

    protected onLoad(): void {
        GameManger.instance = this; // 将当前实例设置为单例实例
    }

    start() {
       
    }

    update(deltaTime: number) {
        
    }


    public addBomb() {
        this.bombNumber += 1; 
        // 触发事件通知UI更新
        this.node.emit('onBombChange');
    }

    public getBombNumber(): number {
        return this.bombNumber; 
    }


    public addScore(score: number) {
        this.score += score; // 增加得分
        this.ScoreUI.updateUI(this.score); // 更新UI显示
    }

    onPauseButtonClick(){
        // 暂停游戏
        director.pause();
        this.player.disableControl();
        this.pauseButtonNode.active = false; // 隐藏暂停按钮
        this.resumeButtonNode.active = true; // 显示恢复按钮
    }

    onResumeButtonClick(){
        // 恢复游戏
        director.resume();
        this.player.enableControl();
        this.pauseButtonNode.active = true; // 显示暂停按钮
        this.resumeButtonNode.active = false; // 隐藏恢复按钮
    }

    gameOver() {
        this.onPauseButtonClick();
        // 触发游戏结束事件，将当前得分作为参数传递
        this.gameOverUI.showGameOverUI(this.getHighestScore(),this.score); // 显示游戏结束界面

        // 存储历史最高分
        let highestScore = this.getHighestScore();
        if (this.score > highestScore) {
            highestScore = this.score;
            this.setHighestScore(highestScore);
        }
    }

    getHighestScore(): number {
        // 从本地存储中获取历史最高分
        let highestScore = 0;
        let highestScoreStr = localStorage.getItem('highestScore');
        if (highestScoreStr) {
            highestScore = parseInt(highestScoreStr);
        }
        return highestScore;
    }

    setHighestScore(highestScore: number) {
        // 将历史最高分存储到本地存储中
        localStorage.setItem('highestScore', highestScore.toString());
    }

    onRestartButtonClick() {
        // 重新开始游戏
    }

    onQuitButtonClick() {
        // 退出游戏
    }

    
}



import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartUi')
export class StartUi extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    onStartButtonClick() {
        // 加载游戏场景
        director.loadScene("02-GameScene");
    }
}



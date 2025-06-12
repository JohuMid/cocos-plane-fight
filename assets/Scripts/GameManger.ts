import { _decorator, Component, Node } from 'cc';
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
    bombNumber: number = 0;

    start() {
        GameManger.instance = this; // 将当前实例设置为单例实例
    }

    update(deltaTime: number) {
        
    }


    public addBomb() {
        this.bombNumber += 1; 
    }
}



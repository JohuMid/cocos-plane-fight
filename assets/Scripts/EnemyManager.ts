import { _decorator, AudioClip, Component, input, Input, instantiate, Node, Prefab } from 'cc';
import { GameManger } from './GameManger';
import { Enemy } from './Enemy';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {
    private static instance: EnemyManager = null; // 单例实例

    public static getInstance(): EnemyManager { // 获取单例实例的方法
        return this.instance;
    }

    @property
    enemy0SpawnRate: number = 1; // 敌人0的生成频率
    @property({ type: Prefab })
    enemy0Prefab: Prefab = null; // 敌人0的预制体

    @property
    enemy1SpawnRate: number = 3; // 敌人1的生成频率
    @property({ type: Prefab })
    enemy1Prefab: Prefab = null; // 敌人1的预制体

    @property
    enemy2SpawnRate: number = 10; // 敌人2的生成频率
    @property({ type: Prefab })
    enemy2Prefab: Prefab = null; // 敌人2的预制体

    @property
    rewardSpawnRate: number = 15; // 奖励的生成频率
    @property({ type: Prefab })
    reward1Prefab: Prefab = null; // 双子弹奖励的预制体
    @property({ type: Prefab })
    reward2Prefab: Prefab = null; // 炸弹奖励的预制体

    @property({ type: Node })
    enemyArray: Node[] = []; // 敌人数组

    @property({ type: AudioClip })
    useBombAudio: AudioClip = null; // 使用炸弹音效

    doubleClickInterval: number = 0.3; // 双击间隔
    lastClickTime: number = 0; // 上次点击时间

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this)
    }

    start() {
        EnemyManager.instance = this;
        this.schedule(this.enemy0Spawn, this.enemy0SpawnRate);
        this.schedule(this.enemy1Spawn, this.enemy1SpawnRate);
        this.schedule(this.enemy2Spawn, this.enemy2SpawnRate);
        this.schedule(this.rewardSpawn, this.rewardSpawnRate);
    }

    update(deltaTime: number) {


    }

    protected onDestroy(): void {
        this.unschedule(this.enemy0Spawn);
        this.unschedule(this.enemy1Spawn);
        this.unschedule(this.enemy2Spawn);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    enemy0Spawn() {
        // 生成敌人0的逻辑
        const enemyNode = this.objectSpawn(this.enemy0Prefab, -215, 215, 450);
        this.enemyArray.push(enemyNode);     
    }

    enemy1Spawn() {
        // 生成敌人1的逻辑
        const enemyNode = this.objectSpawn(this.enemy1Prefab, -200, 200, 475);
        this.enemyArray.push(enemyNode);
    }

    enemy2Spawn() {
        // 生成敌人2的逻辑
        const enemyNode = this.objectSpawn(this.enemy2Prefab, -150, 150, 500);
        this.enemyArray.push(enemyNode);
    }

    rewardSpawn() {
        // 生成奖励的逻辑生成0和1
        const randomReward = Math.random() < 0.5 ? this.reward1Prefab : this.reward2Prefab;
        this.objectSpawn(randomReward, -207, 207, 474);
    }

    objectSpawn(enemtPrefab: Prefab, minX: number, maxX: number, Y: number) {
        // 生成敌人的逻辑
        const enemy = instantiate(enemtPrefab);
        this.node.addChild(enemy);
        const randomX = Math.random() * (maxX - minX) + minX;
        enemy.setPosition(randomX, Y, 0); // 设置敌人的初始位置
        return enemy;
    }

    onTouchEnd() {
        const currentTime = Date.now();
        if ((currentTime - this.lastClickTime) / 1000 < this.doubleClickInterval) {
            // 双击事件
            this.onDoubleClick();
        }
        this.lastClickTime = currentTime;
    }

    onDoubleClick() {
        if (GameManger.getInstance().isHaveBomb()) { // 检查是否有炸弹
            GameManger.getInstance().useBomb(); // 使用炸弹
            AudioMgr.inst.playOneShot(this.useBombAudio, 1); // 播放使用炸弹音效

            for(let enemy of this.enemyArray) { // 遍历所有敌人
                enemy.getComponent(Enemy).killNow(); // 调用敌人的 killNow 方法
            }
            
        }
    }

    removeEnemy(enemyNode: Node) { // 定义一个方法，用于移除敌人
        const index = this.enemyArray.indexOf(enemyNode); // 获取敌人在数组中的索引
        if (index !== -1) { // 如果索引存在
            this.enemyArray.splice(index, 1); // 从数组中移除敌人
        }
    }
}



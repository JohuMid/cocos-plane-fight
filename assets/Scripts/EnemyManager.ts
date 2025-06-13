import { _decorator, Component, input, Input, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {
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

    doubleClickInterval: number = 0.3; // 双击间隔
    lastClickTime: number = 0; // 上次点击时间

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd,this)
    }

    start() {
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
        this.objectSpawn(this.enemy0Prefab, -215, 215, 450);

    }

    enemy1Spawn() {
        // 生成敌人1的逻辑
        this.objectSpawn(this.enemy1Prefab, -200, 200, 475);
    }

    enemy2Spawn() {
        // 生成敌人2的逻辑
        this.objectSpawn(this.enemy2Prefab, -150, 150, 500);
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
    }

    onTouchEnd() {
        const currentTime = Date.now();
        if ((currentTime - this.lastClickTime)/1000 < this.doubleClickInterval) {
            // 双击事件
            this.onDoubleClick();
        }
        this.lastClickTime = currentTime;
    }

    onDoubleClick() {
        console.log('双击事件');
    }

    
}



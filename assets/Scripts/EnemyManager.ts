import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
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

    start() {
        this.schedule(this.enemy0Spawn, this.enemy0SpawnRate);
        this.schedule(this.enemy1Spawn, this.enemy1SpawnRate);
        this.schedule(this.enemy2Spawn, this.enemy2SpawnRate);
    }

    update(deltaTime: number) {
        
        
    }

    protected onDestroy(): void {
        this.unschedule(this.enemy0Spawn);
        this.unschedule(this.enemy1Spawn);
        this.unschedule(this.enemy2Spawn);
    }

    enemy0Spawn() {
        // 生成敌人0的逻辑
        this.enemySpawn(this.enemy0Prefab,-215,215,450);

    }

    enemy1Spawn() {
        // 生成敌人1的逻辑
        this.enemySpawn(this.enemy1Prefab, -200, 200, 475);
    }

    enemy2Spawn() {
        // 生成敌人2的逻辑
        this.enemySpawn(this.enemy2Prefab, -150, 150, 500);
    }

    enemySpawn(enemtPrefab:Prefab,minX:number,maxX:number,Y:number) {
        // 生成敌人的逻辑
        const enemy = instantiate(enemtPrefab);
        this.node.addChild(enemy);    
        const randomX = Math.random() * (maxX - minX) + minX;
        enemy.setPosition(randomX, Y, 0); // 设置敌人的初始位置
    }
}



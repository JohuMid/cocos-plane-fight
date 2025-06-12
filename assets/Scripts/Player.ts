import { _decorator, Animation, CCString, Collider2D, Component, Contact2DType, EventTouch, Input, input, instantiate, Node, Prefab, Vec3 } from 'cc';
import { Reward, RewardType } from './Reward';
import { GameManger } from './GameManger';
import { LifeCountUI } from './UI/LifeCountUI';
const { ccclass, property } = _decorator;

enum ShootType {
    OneShoot, // 单射
    TwoShoot, // 双射 
    None // 无
}

@ccclass('Player')
export class Player extends Component {
    @property
    shootRate: number = 0.5; // 射击频率，单位：秒
    @property({ type: Node })
    buttleParent: Node = null; // 子弹父节点

    @property({ type: Prefab })
    buttle1Prefab: Prefab = null; // 子弹预设

    @property({ type: Node })
    position1: Node = null;

    @property({ type: Prefab })
    buttle2Prefab: Prefab = null; // 子弹预设

    @property({ type: Node })
    position2: Node = null;

    @property({ type: Node })
    position3: Node = null;

    @property
    shootType: ShootType = ShootType.OneShoot; // 射击类型

    @property
    lifeCount: number = 3;

    @property({ type: Animation })
    anim: Animation = null;

    @property(CCString)
    animHit: string = '';
    @property(CCString)
    animDown: string = '';

    @property
    invincibleTime: number = 1; // 无敌时间

    isInvincible: boolean = false; // 是否处于无敌状态
    invincibleTimer: number = 0; // 无敌计时器

    @property
    twoShootTime: number = 5; // 双射持续时间
    twoShootTimer: number = 0; // 双射计时器

    shootTime: number = 0; // 上次射击时间

    collider: Collider2D = null;

    @property({ type: LifeCountUI })
    lifeCountUI:LifeCountUI = null; // 生命值UI组件

    private canControl: boolean = true; // 控制开关

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    protected start(): void {
        this.lifeCountUI.updateUI(this.lifeCount); // 更新UI
    }

    lastReward: Reward = null; // 上次奖励时间

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: any) {
        const reward = otherCollider.getComponent(Reward);

        if (reward === this.lastReward) { // 如果是同一个奖励，则不处理
            return; // 直接返回，不执行下面的代码
        }
        this.lastReward = reward; // 更新上次奖励

        if (reward) {
            console.log("奖励类型：", reward.rewardType);
            
            switch (reward.rewardType) { // 根据奖励类型执行不同的逻辑
                case RewardType.TwoShoot: // 双子弹奖励
                    this.transitionToTwoShoot(); // 切换到双射状态
                    break; // 不执行任何逻辑，直接返回
                case RewardType.Bomb: // 炸弹奖励
                    GameManger.getInstance().addBomb(); // 增加炸弹数量
                    break; // 不执行任何逻辑，直接返回
            }
            // 延迟销毁奖励节点
            this.scheduleOnce(() => {
                if (otherCollider.node) {
                    otherCollider.node.destroy(); // 销毁奖励节点
                }
            }, 0);
        } else {
            this.onContactToEnemy();
        }
    }
    transitionToTwoShoot() {
        this.twoShootTimer = 0; // 重置双射计时器
        this.shootType = ShootType.TwoShoot; // 切换到双射状态 
    }

    transitionToOneShoot() {
        this.twoShootTimer = 0; // 重置双射计时器
        this.shootType = ShootType.OneShoot; // 切换到单射状态 
    }

    onContactToEnemy() {
        if (this.isInvincible) { // 如果处于无敌状态，则不处理碰撞
            return; // 直接返回，不执行下面的代码
        }

        this.isInvincible = true; // 设置为无敌状态
        this.invincibleTimer = 0; // 重置无敌计时器

        this.changeLifeCount(-1); // 调用方法修改生命值

        if (this.lifeCount > 0) {
            this.anim.play(this.animHit);
        } else {
            this.anim.play(this.animDown);
        }

        if (this.lifeCount <= 0) {
            this.shootType = ShootType.None; // 飞机死亡时不发射子弹
            if (this.collider) {
                this.collider.enabled = false; // 禁用碰撞器
            }
        }
    }

    changeLifeCount(count: number) { // 定义一个方法，用于修改生命值
        this.lifeCount += count; // 修改生命值
        this.lifeCountUI.updateUI(this.lifeCount); // 更新UI
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onTouchMove(event: EventTouch) {
        if (!this.canControl) {
            return; // 如果控制开关关闭，则不执行下面的代码
        }
        if (this.lifeCount <= 0) { // 飞机死亡时不响应触摸事件
            return; // 直接返回，不执行下面的代码
        }
        // 获取触摸的位置
        let delta = event.getDelta();
        const p = this.node.position;

        const targetPosition = new Vec3(p.x + delta.x, p.y + delta.y, p.z);

        this.node.setPosition(p.x + delta.x, p.y + delta.y, p.z);

        // 限制飞机的移动范围
        if (targetPosition.x < -230) {
            this.node.setPosition(-230, p.y, p.z);
        }
        if (targetPosition.x > 230) {
            this.node.setPosition(230, p.y, p.z);
        }
        if (targetPosition.y < -360) {
            this.node.setPosition(p.x, -380, p.z);
        }

        if (targetPosition.y > 360) {
            this.node.setPosition(p.x, 380, p.z);
        }

    }
    protected update(deltaTime: number): void {
        switch (this.shootType) {
            case ShootType.OneShoot: // 单射
                this.oneShoot(deltaTime); // 调用单射方法
                break;
            case ShootType.TwoShoot: // 双射
                this.twoShoot(deltaTime); // 调用双射方法
                break;
        }
        this.shootTime += deltaTime;

        if (this.isInvincible) { // 如果处于无敌状态
            this.invincibleTimer += deltaTime; // 增加无敌计时器
            if (this.invincibleTimer >= this.invincibleTime) { // 如果无敌计时器达到无敌时间
                this.isInvincible = false; // 恢复正常状态
            }
        }

    }

    oneShoot(deltaTime: number) {
        this.shootTime += deltaTime;
        if (this.shootTime >= this.shootRate) {
            this.shootTime = 0; // 重置射击时间
            const buttle1 = instantiate(this.buttle1Prefab); // 实例化子弹
            this.buttleParent.addChild(buttle1); // 添加到父节点下
            buttle1.setWorldPosition(this.position1.worldPosition)
        }
    }

    twoShoot(deltaTime: number) {
        this.twoShootTimer += deltaTime; // 增加双射计时器
        if (this.twoShootTimer >= this.twoShootTime) { // 如果双射计时器达到双射持续时间
            this.transitionToOneShoot() // 切换回单射状态
        }

        this.shootTime += deltaTime;
        if (this.shootTime >= this.shootRate) {
            this.shootTime = 0; // 重置射击时间
            const buttle1 = instantiate(this.buttle2Prefab); // 实例化子弹
            const buttle2 = instantiate(this.buttle2Prefab); // 实例化子弹
            this.buttleParent.addChild(buttle1); // 添加到父节点下
            this.buttleParent.addChild(buttle2); // 添加到父节点下
            buttle1.setWorldPosition(this.position2.worldPosition)
            buttle2.setWorldPosition(this.position3.worldPosition)
        }
    }

    disableControl() { // 定义一个方法，用于禁用控制
        this.canControl = false; // 设置控制开关为 false
    }

    enableControl() { // 定义一个方法，用于启用控制
        this.canControl = true; // 设置控制开关为 true
    }
}



import { _decorator, Animation, CCString, Collider2D, Component, Contact2DType, EventTouch, Input, input, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum ShootType {
    OneShoot, // 单射
    TwoShoot, // 双射 
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


    shootTime: number = 0; // 上次射击时间

    collider: Collider2D = null;


    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: any) {

        this.lifeCount -= 1;
        if (this.lifeCount > 0) {
            this.anim.play(this.animHit);
        } else {
            this.anim.play(this.animDown);
        }

        if (this.lifeCount <= 0) {
            if (this.collider) {
                this.collider.enabled = false; // 禁用碰撞器
            }
        }
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onTouchMove(event: EventTouch) {
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

}



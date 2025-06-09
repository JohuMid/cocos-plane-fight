import { _decorator, Component, EventTouch, Input, input, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property
    shootRate: number = 0.5; // 射击频率，单位：秒
    @property({ type: Node })
    buttleParent: Node = null; // 子弹父节点
    
    @property({ type: Prefab })
    buttle1Prefab: Prefab = null; // 子弹预设

    @property({ type: Node })
    buttle1Position:Node = null;


    shootTime: number = 0; // 上次射击时间


    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchMove(event: EventTouch) {
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
        this.shootTime += deltaTime;
        if (this.shootTime >= this.shootRate) {
            this.shootTime = 0; // 重置射击时间
            const buttle1 = instantiate(this.buttle1Prefab); // 实例化子弹
            this.buttleParent.addChild(buttle1); // 添加到父节点下
            buttle1.setWorldPosition(this.buttle1Position.worldPosition)
        }
    }
    
}



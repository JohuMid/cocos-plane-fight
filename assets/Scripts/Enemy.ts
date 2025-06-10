import { _decorator, Animation, CCString, Collider2D, Component, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enery')
export class Enery extends Component {
    @property
    speed: number = 300;

    @property({ type: Animation })
    anim: Animation = null;

    @property
    hp: number = 1;

    @property(CCString)
    animHit: string = '';
    @property(CCString)
    animDown: string = '';

    collider: Collider2D = null;

    start() {
        // this.anim.play();
        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: any) {
        this.hp -= 1;
        if (this.hp > 0) {
            this.anim.play(this.animHit);
        } else {
            this.anim.play(this.animDown);
        }

        if (this.hp <= 0) {
            // 销毁敌人节点
            if (this.collider) {
                this.collider.enabled = false; // 禁用碰撞器
            }
            const that = this
            this.scheduleOnce(() => {
                that.node.destroy(); // 销毁敌人节点 
            }, 1)
        }
        // 延迟销毁子弹节点
        this.scheduleOnce(() => {
            if (otherCollider.node) {
                otherCollider.node.destroy();
            }
        }, 0);
    }

    update(deltaTime: number) {
        if (this.hp > 0) {
            const p = this.node.position;
            this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z);
        }
        if (this.node.position.y < -580) {
            this.node.destroy(); // 销毁敌人节点    
        }

    }

    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
}



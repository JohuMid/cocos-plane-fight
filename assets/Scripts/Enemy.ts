import { _decorator, Animation, AudioClip, CCString, Collider2D, Component, Contact2DType } from 'cc';
import { Bullet } from './Bullet';
import { GameManger } from './GameManger';
import { EnemyManager } from './EnemyManager';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

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
    @property
    score: number = 100;

    @property({ type: AudioClip })
    enemyDownAudio: AudioClip = null;

    collider: Collider2D = null;

    start() {
        // 初始化碰撞体
        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: any) {

        if (otherCollider.getComponent(Bullet)) {
            otherCollider.enabled = false; // 禁用碰撞器

            // 延迟销毁子弹节点
            this.scheduleOnce(() => {
                if (otherCollider.node) {
                    otherCollider.node.destroy();
                }
            }, 0);
        }
        this.hp -= 1;

        if (this.hp > 0) {
            this.anim.play(this.animHit);
        } else {
            this.anim.play(this.animDown);
        }

        if (this.hp <= 0) {
            this.dead();
        }
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
        EnemyManager.getInstance().removeEnemy(this.node); // 从敌人数组中移除敌人节点
    }

    haveDead: boolean = false;

    dead() {
        if (this.haveDead) { // 避免重复调用
            return; // 直接返回，不执行下面的代码
        }

        AudioMgr.inst.playOneShot(this.enemyDownAudio, 1)
        // EnemyManager.getInstance().removeEnemy(this.node); // 从敌人数组中移除敌人节点

        GameManger.getInstance().addScore(this.score);
        // 销毁敌人节点
        if (this.collider) {
            this.collider.enabled = false; // 禁用碰撞器
        }

        const that = this
        this.scheduleOnce(() => {
            that.node.destroy(); // 销毁敌人节点 
        }, 1)
        this.haveDead = true;
    }

    killNow() { // 立即销毁敌人节点
        if (this.hp <= 0) return;
        this.hp = 0;
        // 播放坠毁动画
        if (this.anim) {
            this.anim.play(this.animDown);
        }
        this.dead();
    }
}



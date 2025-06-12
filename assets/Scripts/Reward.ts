import { _decorator, Component, Enum, Node } from 'cc';
const { ccclass, property } = _decorator;

enum RewardType {
   TwoShoot, // 双射
   Bomb, // 炸弹 
}

// 使用 Enum 函数将 TypeScript 枚举转换为 Cocos Creator 枚举
const CocosRewardType = Enum(RewardType);

@ccclass('Reward')
export class Reward extends Component {

    @property({ type: CocosRewardType })
    rewardType: RewardType = RewardType.TwoShoot; // 奖励类型

    @property
    speed: number = 150;

    start() {

    }

    update(deltaTime: number) {
        const p = this.node.position;
        this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z);
    }
}



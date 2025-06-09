import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property
    speed: number = 300;
    start() {

    }

    update(deltaTime: number) {
        const position = this.node.position;
        this.node.setPosition(position.x, position.y + this.speed * deltaTime, position.z);

        // 超出屏幕范围，销毁节点
        if (position.y > 440) {
            this.node.destroy();
        }
    }
}



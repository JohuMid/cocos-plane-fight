import { _decorator, Component, EventTouch, Input, input, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this); 
    }

    onTouchMove(event:EventTouch){
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
}



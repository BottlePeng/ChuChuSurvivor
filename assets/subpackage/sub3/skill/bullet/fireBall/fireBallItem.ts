import { _decorator } from 'cc';
import { bulletItem } from '../bulletItem';
const { ccclass } = _decorator;

@ccclass('fireBallItem')
export class fireBallItem extends bulletItem {
    startContact(self, other) {
        let role = G('fight').getRole(other.node)
        if (!role) return
        if (role.state.lose) return
        if (!this.role) return
        if (role.group == this.role.group) return

        if (role.repel) role.repel(this.role.node)
    }
}


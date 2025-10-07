import { _decorator } from 'cc';
import { skillBase } from '../skillBase';
const { ccclass } = _decorator;

@ccclass('swordItem')
export class swordItem extends skillBase {
    startContact(self, other) {
        if (!this.role) return

        let skill = $(other.node, 'bulletItem')
        if (skill) {
            if (skill.remove) {
                G('effect').create('boom', {by: skill.node})
                skill.remove()
                return
            }
        }

        let role = G('fight').getRole(other.node)
        if (!role) return
        if (role.state.lose) return

        if (role.repel) role.repel(this.role.node, 0.2)
    }
}


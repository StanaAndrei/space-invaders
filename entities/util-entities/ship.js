import Bullet from "../../projectiles/util-projectiles/bullet.js";
import Entity from "../entity.js";

const SPEED = 7.5;
export default class Ship extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.cannonWidth = width * 1 / 5;
        this.bullet = null;
        this.lifes = 3;
    }
    draw(p5context) {
        p5context.push();
        p5context.fill('rgb(0, 240, 24)');
        p5context.rectMode(p5context.CENTER);
        p5context.noStroke();
        const { x, y, width, height } = this;
        p5context.rect(x, y, width, height, 2);
        p5context.rect(x, y - this.height / 2 - this.cannonWidth / 2, this.cannonWidth, this.cannonWidth);
        p5context.rect(x, y - this.height / 2 - this.cannonWidth - 1, 2, 2);
        p5context.pop();
    }
    static get DIRS() {
        return {
            LEFT: -1,
            RIGHT: 1,
        };
    }
    move(dir, p5context) {
        if (!dir) {
            throw new Error('wrong dir!!!');
        }
        const { x } = this;
        let newX = x + dir * SPEED;
        const { width } = this;
        this.x = p5context.constrain(newX, width / 2, p5context.width - width / 2);
    }
    attack() {
        if (this.bullet) {
            return;
        }
        const { x, y } = this;
        this.bullet = new Bullet(x, y, 15, Bullet.DIRS.UP);
    }
}
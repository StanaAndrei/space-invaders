import Projectile from "../projectile.js";

export default class Bullet extends Projectile {
    constructor(x, y, speed, dir) {
        super(x, y, speed, dir);
        this.width = 5;
        this.height = 15;
    }

    draw(p5context) {
        const { x, y, width, height } = this;
        p5context.rect(x, y, width, height);
    }
    
}
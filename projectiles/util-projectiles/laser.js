import Projectile from "../projectile.js";

export default class Laser extends Projectile {
    constructor(x, y, speed, dir) {
        super(x, y, speed, dir);
        this.sign = 1;
    }
    draw(p5context) {
        p5context.push();
        p5context.noFill();
        p5context.stroke('red');
        p5context.strokeWeight(1);
        p5context.beginShape();
        p5context.vertex(this.x, this.y);
        const p1 = 3.5, p2 = 7.5, p3 = 11;//params to draw the laser
        p5context.vertex(this.x + (p1 * this.sign), this.y + p1);
        p5context.vertex(this.x - (p1 * this.sign), this.y + p2);
        p5context.vertex(this.x, this.y + p3);
        p5context.endShape();
        if (p5context.frameCount % 10 === 0) {
            this.sign *= -1;
        }
        p5context.pop();
    }
}
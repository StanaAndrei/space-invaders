import Entity from "../entity.js";

const SPEED_X = 10, SPEED_Y = 20;
export default class Alien extends Entity {
    constructor(x, y, width, height, imgs, score) {
        super(x, y, width, height);
        this.imgs = imgs;
        this.currImgIdx = 0;
        this.score = score;
    }
    draw(p5context) {
        const { imgs, x, y, width, height } = this;
        p5context.image(imgs[this.currImgIdx], x, y, width, height);
        if (p5context.frameCount % 20 === 0) {
            this.currImgIdx++;
            this.currImgIdx %= imgs.length;
        }
    }
    move(dirX, dirY, p5context) {
        if (p5context.frameCount % 20 && !Alien.isRedAlien(this)) {
            return;
        }
        this.x += dirX * SPEED_X * (Alien.isRedAlien(this) ? .5 : 1);
        this.y += dirY * SPEED_Y;
    }
    explode(p5context) {
        p5context.push();
        p5context.translate(this.x, this.y);
        p5context.noFill();
        p5context.stroke(255);
        p5context.strokeWeight(2);
        for (let i = 0; i < 10; i++) {
            p5context.line(p5context.floor(p5context.random(2, 8)), 0, p5context.floor(p5context.random(10, 15)), 0);
            p5context.rotate(p5context.random(0, ((4 * p5context.PI) / 10)));
        }
        p5context.pop();
    }
    static isRedAlien({ score }) {
        return score >= 50;
    }
}
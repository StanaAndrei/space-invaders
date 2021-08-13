export default class Projectile {
    constructor(x, y, speed, dir) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.dir = dir;
    }
    /**
     * @virtual
     */
    draw(p5context) { };

    update() {
        this.y += this.speed * this.dir;
    }

    static get DIRS() {
        return {
            UP: -1,
            DOWN: 1,
        };
    }
}
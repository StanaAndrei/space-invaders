export default class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /**
     * @virtual
     */
    draw(p5context) { };
    /**
     * @virtual
     */
    move() { };
}
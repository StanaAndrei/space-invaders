import "https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js";
import Ship from "./entities/util-entities/ship.js";
import Alien from "./entities/util-entities/alien.js";
import Laser from "./projectiles/util-projectiles/laser.js";
import { ALIEN_DIMS, LIMIT_Y, SHIP_DIMS } from "./constants.js";
const { WIDTH: ALIEN_W, HEIGHT: ALIEN_H } = ALIEN_DIMS;
let aliens = [];
let lasers = [];
let ship;
let images;
let lineDis, colDis;
let score = 0;

const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const handleInput = p5context => {
    const { LEFT_ARROW, RIGHT_ARROW } = p5context;
    if (p5context.keyIsDown(LEFT_ARROW)) {
        ship.move(Ship.DIRS.LEFT, p5context);
    }
    if (p5context.keyIsDown(RIGHT_ARROW)) {
        ship.move(Ship.DIRS.RIGHT, p5context);
    }
}

const checkGameState = () => {
    if (aliens.every(alien => alien === null)) {
        return 'WON';
    }
    if (!ship.lifes || aliens.some(alien => alien?.y >= LIMIT_Y)) {
        return 'LOST';
    }
    return '';
}

new p5(p5context => {
    let o;
    p5context.preload = () => {
        const imgFile = fname => `./imgs/${fname}.png`;
        const { loadImage: getImg } = p5context;
        images = {
            alien1: [getImg(imgFile('alien1_a')), getImg(imgFile('alien1_b'))],
            alien2: [getImg(imgFile('alien2_a')), getImg(imgFile('alien2_b'))],
            alien3: [getImg(imgFile('alien3_a')), getImg(imgFile('alien3_b'))],
            alien4: [getImg(imgFile('alien4'))],
        };
        Object.freeze(images);
    }
    p5context.setup = () => {
        p5context.createCanvas(1200, 800);
        const { width, height } = p5context;
        ship = new Ship(width / 2, height - 20, SHIP_DIMS.WIDTH, SHIP_DIMS.HEIGHT);
        p5context.frameRate(60);
        //init aliens
        lineDis = (width - width / 2) / 11;
        colDis = (height - height / 1.75) / 5;
        for (let i = lineDis; i < width - width / 3.7; i += lineDis) {
            aliens.push(new Alien(i, colDis * 2, ALIEN_W, ALIEN_H, images.alien1, 30));
        }
        for (let i = lineDis; i < width - width / 3.7; i += lineDis) {
            aliens.push(new Alien(i, colDis * 3, ALIEN_W, ALIEN_H, images.alien2, 20));
        }
        for (let i = lineDis; i < width - width / 3.7; i += lineDis) {
            aliens.push(new Alien(i, colDis * 4, ALIEN_W, ALIEN_H, images.alien2, 20));
        }
        for (let i = lineDis; i < width - width / 3.7; i += lineDis) {
            aliens.push(new Alien(i, colDis * 5, ALIEN_W, ALIEN_H, images.alien3, 10));
        }
        for (let i = lineDis; i < width - width / 3.7; i += lineDis) {
            aliens.push(new Alien(i, colDis * 6, ALIEN_W, ALIEN_H, images.alien3, 10));
        }//*/
    }
    p5context.draw = () => {
        p5context.background(20);
        p5context.line(0, LIMIT_Y, p5context.width, LIMIT_Y);
        //#region text
        p5context.textSize(25);
        p5context.fill(0, 102, 153);
        p5context.text(`SCORE: ${score}`, p5context.width - 200, 20);
        p5context.text(`LIFES: ${ship.lifes}`, 0, 20);
        //#endregion
        //#region win
        let gameState;
        if (gameState = checkGameState()) {
            p5context.textSize(50);
            p5context.fill(255, 18, 18);
            p5context.text(`YOU ${gameState}!`, p5context.width / 3, p5context.height / 2);
            p5context.noLoop();
            return;
        }
        //#endregion
        //#region  ship
        ship.draw(p5context);
        handleInput(p5context);
        ship.bullet?.update(p5context);
        ship.bullet?.draw(p5context);
        if (ship.bullet?.y < 0 || ship.bullet?.y > p5context.height) {
            ship.bullet = null;
        }
        for (let i = 0; i < lasers.length; i++) {
            const { x: lx, y: ly } = lasers[i];
            if (ly > p5context.height) {
                lasers.splice(i, 1);
            }
            let { x: shipX, y: shipY } = ship;
            let shipHit = true;
            shipX -= SHIP_DIMS.WIDTH / 2;
            shipHit &= shipX <= lx && lx <= shipX + SHIP_DIMS.WIDTH;
            shipHit &= shipY <= ly && ly <= shipY + SHIP_DIMS.HEIGHT;
            if (shipHit) {
                ship.lifes--;
                lasers.splice(i, 1);
            }
        }
        //#endregion
        //#region move
        let dirX = 1, dirY = 0;
        let maxX = Math.max.apply(null, aliens.map(alien => alien !== null && !Alien.isRedAlien(alien) ? alien.x : 0));
        if (maxX) {
            if (maxX > p5context.width - lineDis) {
                dirX = -dirX * 30;
                dirY = 1;
            }
        }
        //#endregion 
        //#region is alien hit
        if (ship.bullet) {
            let bulletX = ship.bullet.x;
            let bulletY = ship.bullet.y;
            for (let i = 0; i < aliens.length; i++) {
                let alien = aliens[i];
                if (!alien) {
                    continue;
                }
                let alienHit = true;
                alienHit &= (alien.x + ALIEN_W >= bulletX && bulletX >= alien.x);
                alienHit &= (alien.y + ALIEN_H >= bulletY && bulletY >= alien.y);//*/
                if (alienHit) {
                    alien.explode(p5context);
                    ship.bullet = null;
                    aliens[i] = null;
                    score += alien.score;
                }
            }
        }
        //#endregion
        //draw
        for (let alien of aliens) {
            if (alien === null) {
                continue;
            }
            alien.draw(p5context);
            if (Alien.isRedAlien(alien)) {
                alien.move(-1, 0, p5context);
                if (alien.x < 0) {
                    aliens.pop();
                }
            } else {
                alien.move(dirX, dirY, p5context);
            }
        }
        //#region shots
        const chanceToShot = 5 / 10000;
        for (let alien of aliens) {
            if (alien && Math.random() <= chanceToShot) {
                const { x, y } = alien;
                lasers.push(new Laser(x, y, 10, Laser.DIRS.DOWN));
            }
        }
        for (let laser of lasers) {
            laser.draw(p5context);
            laser.update();
        }
        //#endregion
        //#region red alien
        if (p5context.frameCount % 1000 === 0) {
            aliens.push(new Alien(p5context.width, 30, ALIEN_W, ALIEN_H, images.alien4, getRandomArbitrary(50, 100)));
        }
        //#endregion
    }
    p5context.keyPressed = () => {
        if (p5context.key === ' ') {
            ship.attack();
        }
    }
}, document.querySelector('#canvas-area'));
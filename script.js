const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 0.5;
let score = 0;
let lastScore = 0;
let gameOver = false;

let playerImage = new Image();
playerImage.src = './images/man2.png'
const spriteWidth = 80;
const spriteHeight = 110;
let playerFrameX = 0;
let playerFrameY = 0;

let enemyImage = new Image();
enemyImage.src = './images/zombie1.png'
let enemyFrameX = 0;
let enemyFrameY = 0;

let appleImage = new Image();
appleImage.src = './images/apple1.png'

let rockImage = new Image();
rockImage.src = './images/meteor1.png'
let rockFrameX = 0;
let rockFrameY = 0;

let backgroundImg = new Image();
backgroundImg.src = "./images/background.png"

let platformImage = new Image();
platformImage.src = "./images/platform.png"

let gameFrame = 0;
let stagerFrame = 5;

// character
class Player {
    constructor(){
        this.position = {
            x: 500,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 80;
        this.height = 110;
    }

    draw() {
        c.drawImage(
            playerImage,
            spriteWidth * playerFrameX,
            spriteHeight * playerFrameY,
            spriteWidth,
            spriteHeight,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(gameFrame % stagerFrame == 0){
        if(this.velocity.x > 0){
            if(playerFrameX < 1){
                playerFrameX++
            } else playerFrameX= 0
            playerFrameY = 1;
        } else if (this.velocity.x < 0){
            if(playerFrameX < 1){
                playerFrameX++
            } else playerFrameX= 0
            playerFrameY = 2;
        } else if(this.velocity.y > 0){
            playerFrameX= 1
            playerFrameY = 3;
        } else if(this.velocity.y < 0){
            playerFrameX= 0
            playerFrameY = 3;
        } else {
            playerFrameX = 0
            playerFrameY = 0
        }
    }

        if(this.position.y + this.height + this.velocity.y <= platform.position.y){this.velocity.y += gravity;}
        else this.velocity.y = 0;

        if(this.position.x + this.width >= canvas.width){
            this.velocity.x = 0
            this.position.x = canvas.width-this.width
        } else if (this.position.x <= 0){
            this.velocity.x = 0
            this.position.x = 0
        }
    }
}

class PlateForm {
    constructor(){
        this.position = {
            x: 0,
            y: canvas.height-80
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 1500;
        this.height = 80;
    }

    draw() {
        c.drawImage(
            platformImage,
            0,
            0,
            1500,
            80,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y <= canvas.height){this.velocity.y += gravity;}
        else this.velocity.y = 0;
    }
}

// enemy
class Enemy {
    constructor(x){
        this.position = {
            x,
            y: 0
        }
        this.velocity = {
            x: 1,
            y: 0
        }
        this.width = 80;
        this.height = 110;

        if(this.position.x >= canvas.width/2){
            this.position.x = canvas.width+10
        } else if (this.position.x < canvas.width/2){
            this.position.x = -10-this.width
        }
    }

    draw() {
         c.drawImage(
            enemyImage,
            spriteWidth * enemyFrameX,
            spriteHeight * enemyFrameY,
            spriteWidth,
            spriteHeight,
            this.position.x,
            this.position.y,
            this.width,
            this.height) 
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(gameFrame % stagerFrame == 0){
        if(this.velocity.x > 0){
            if(enemyFrameX < 1){
                enemyFrameX++
            } else enemyFrameX= 0
            enemyFrameY = 0;
        } else if (this.velocity.x < 0){
            if(enemyFrameX < 1){
                enemyFrameX++
            } else enemyFrameX= 0
            enemyFrameY = 1;
        }}

        if(this.position.y + this.height + this.velocity.y <= platform.position.y){this.velocity.y += gravity;}
        else this.velocity.y = 0;

    }
}

// rock
class Rock {
    constructor(x){
        this.position = {
            x,
            y: -100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 58;
        this.height = 100;
    }

    draw() {
        c.drawImage(
            rockImage,
            58 * rockFrameX,
            100 * rockFrameY,
            58,
            100,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    }

    update(hit){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(gameFrame % 2 == 0){
        if(rockFrameY < 2){
            if(rockFrameX < 3){
                rockFrameX++
            } else rockFrameX = 0
            rockFrameY++
        } else rockFrameY = 0
    }
        if(hit){
            this.velocity.y = 0
            this.position.y = -100
            this.position.x = Math.floor(Math.random() * canvas.width);
        }else if(this.position.y + this.height + this.velocity.y <= canvas.height){this.velocity.y += gravity*0.25;} else if(this.position.y > 1000) {
            this.velocity.y = 0
            this.position.y = -100
            this.position.x = Math.floor(Math.random() * canvas.width);
        }
    }
}

class Perk {
    constructor(x){
        this.position = {
            x,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 40;
        this.height = 40;
    }

    draw() {
        c.drawImage(
            appleImage,
            0,
            0,
            40,
            40,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    }

    update(hit){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y <= platform.position.y){this.velocity.y += gravity} else this.velocity.y = 0
        
        if(hit){
            this.position.x = Math.floor(Math.random() * (canvas.width-10))
            this.position.y = 100
        }
    }
}


const player = new Player();
const enemy1 = new Enemy(Math.floor(Math.random() * canvas.width));
const perk = new Perk(Math.floor(Math.random() * canvas.width));
const rock = new Rock(Math.floor(Math.random() * canvas.width));
const platform = new PlateForm();

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false
    }
}

function animate(){
    requestAnimationFrame(animate);
    
    gameFrame++
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(
            backgroundImg,
            0,
            0,
            1020,
            647,
            0,
            0,
            canvas.width,
            canvas.height)
    if(gameOver){
        c.font = "60px Arial";
        let gameOverString = `Game Over Score: ${lastScore}`
        c.textAlign = "center"
        c.fillText(gameOverString, canvas.width/2, canvas.height/2);
        return 
    }
    
    
    c.font = "30px Arial";
    c.fillText(`Score: ${score}`, 100, 50);


    player.update();
    enemy1.update();
    rock.update();
    perk.update();
    platform.update();

    if(player.position.x + player.width >= enemy1.position.x && player.position.x <= enemy1.position.x + enemy1.width && player.position.y + player.height >= enemy1.position.y && player.position.y <= enemy1.position.y + enemy1.height){
        lastScore = score;
        gameOver = true
        perk.update(true);
        score = 0;
        player.position.x = 100;
        player.position.y = 100;
        enemy1.position.x = canvas.width-enemy1.width -10;

    } else if(player.position.x + player.width >= rock.position.x && player.position.x <= rock.position.x + rock.width && player.position.y + player.height >= rock.position.y && player.position.y <= rock.position.y + rock.height){
        rock.update(true);
        lastScore = score;
        gameOver = true
        perk.update(true);
        score = 0;
        player.position.x = 100;
        player.position.y = 100;
        enemy1.position.x = canvas.width-enemy1.width -10;
    } else if(player.position.x + player.width >= perk.position.x && player.position.x <= perk.position.x + perk.width && player.position.y + player.height >= perk.position.y && player.position.y <= perk.position.y + perk.height){
        perk.update(true);
        score++
    }

    if(enemy1.position.x > player.position.x){
        enemy1.velocity.x = -1
    } else if(enemy1.position.x < player.position.x){
        enemy1.velocity.x = 1
    }


    if (keys.right.pressed){
        player.velocity.x = 5
    } else if (keys.left.pressed){
        player.velocity.x = -5
    } else player.velocity.x = 0  
}

animate();

addEventListener('keydown', ( {keyCode} ) => {
    switch(keyCode){
        case 65:
            keys.left.pressed = true
            break
        case 83:
            break
        case 68:
            keys.right.pressed = true
            break
        case 87:
            if(player.velocity.y == 0 && !keys.up.pressed){
                player.velocity.y -= 20;
            }
            keys.up.pressed = true
            break
    }
})

addEventListener('keyup', ( {keyCode} ) => {
    switch(keyCode){
        case 65:
            keys.left.pressed = false
            break
        case 83:
            break
        case 68:
            keys.right.pressed = false
            break
        case 87:
            keys.up.pressed = false
            break
    }
})

addEventListener("mousedown", (mouse)=> {
    if(mouse.x > player.position.x && mouse.x < player.position.x + player.width){
        if(player.velocity.y == 0 && !keys.up.pressed){
            player.velocity.y -= 20;
        }
        keys.up.pressed = true
    }else if(mouse.x > player.position.x+player.width){
        keys.right.pressed = true
    } else if(mouse.x <= player.position.x){
        keys.left.pressed = true
    }
});

addEventListener("mouseup", (mouse)=> {
    gameOver = false;
    keys.up.pressed = false
    keys.right.pressed = false
    keys.left.pressed = false

});

addEventListener("touchstart", (touch)=> {
    if(touch.x > canvas.width/2){
        keys.right.pressed = true
    } else if(touch.x <= canvas.width/2){
        keys.left.pressed = true
    }
});

addEventListener("touchend", (touch)=> {
    if(touch.x > canvas.width/2){
        keys.right.pressed = false
    } else if(touch.x <= canvas.width/2){
        keys.left.pressed = false
    }
});
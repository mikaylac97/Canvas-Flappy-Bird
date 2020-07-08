// SELECTS CANVAS

const canvas = document.getElementById('bird');
const ctx = canvas.getContext('2d');

// GAME VARIABLES 

let frames = 0;

// LOAD SPRITE IMAGE

const sprite = new Image();
sprite.src = './images/sprite.png';

// GAME STATE 

const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

// GAME CONTROLS

document.addEventListener('keypress', event => {
    if(event.keyCode === 32){
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            faby.flap();
            break;
        case state.over: 
            state.current = state.getReady;
            break;
    }
    }
});

// BACKGROUND

const bg = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 266,
    x: 0,
    y: canvas.height - 226,
    draw: function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x+this.w, this.y, this.w, this.h);
    }
}

// FOREGROUND

const fg = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: canvas.height-112,
    dx: 2,
    update: function(){
        if(state.current === state.game){
           this.x = (this.x -this.dx)%(this.w/2);
        }
    },
    draw: function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x+this.w, this.y, this.w, this.h);
    }
}
 
// FABY

const faby = {
    x: 50,
    y: 150,
    w: 34,
    h: 26,
    speed: 0,
    gravity: 0.3,
    jump: 4.5,
    animation: [
        {sX: 276, sY: 112},
        {sX: 276, sY: 139},
        {sX: 276, sY: 164},
        {sX: 276, sY: 139}
    ],
    frame: 0,
    draw: function () {
        let bird = this.animation[this.frame];
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, this.x-this.w/2, this.y-this.h/2, this.w, this.h);
        
    },
    flap: function(){
        this.speed = -this.jump;
    },
    update: function(){
        this.frame += frames%5===0 ? 1 : 0;
        this.frame = this.frame%this.animation.length;

        if(state.current === state.getReady){
            this.y = 150;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            if(this.y + this.h/2 >= canvas.height - fg.h){
                this.y = canvas.height - fg.h - this.h/2;
                if(state.current === state.game){
                    state.current = state.over;
                } 
            }
        }
    }
};


// OBSTACLES

const pipes = {
    bottom: {
        sX: 501,
        sY: 0,
    },
    top: {
        sX: 554,
        sY: 0,
    },
    w: 54,
    h: 400,
    gap: 85,
    dx: 2,
    update: function(){

    },
    draw: function(){
       
    }
}

// GET READY

const  getReady = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: canvas.width/2 -173/2,
    y: 80,
    draw: function() { 
        if(state.current === state.getReady){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

// GAME OVER

const  gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: canvas.width/2 -225/2,
    y: 90,
    draw: function() {
        if(state.current === state.over){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
       
    }
}

// DRAW

function draw() {
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    bg.draw();
    fg.draw();
    faby.draw();
    pipes.draw();
    getReady.draw();
    gameOver.draw();

}

// UPDATE

function update(){
    faby.update();
    fg.update();
}

// LOOP

function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();
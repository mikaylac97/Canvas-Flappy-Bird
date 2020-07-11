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
    }
  }
});

canvas.addEventListener('click', event => {  
    // console.log(event.pageX, event.pageY)
    const px = event.pageX;
    const py = event.pageY;
    if(event.target){
        if(state.current === state.over 
            && px >= 190
            && px <= 280
            && py >= 360
            && py <= 390
            ){
            faby.speed = 0;
            pipes.position = []; 
            score.value = 0; 
            state.current = state.getReady;
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
    radius: 12,
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
            } if(this.y<=0){
                this.y = this.h;
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
    maxY: -150,
    position: [],
    update: function(){
        if(state.current !== state.game) return;

        if(frames%100 === 0){
            this.position.push({
                x: canvas.width,
                y: this.maxY * (Math.random()+1)
        });
    }

    for(let i=0; i<this.position.length; i++){
        let p = this.position[i];
        p.x -= this.dx;

        let bottomPipeY = p.y + this.gap + this.h;
        if(faby.x + faby.radius > p.x && faby.x - faby.radius < p.x + this.w && faby.y + faby.radius > p.y && faby.y - faby.radius < p.y + this.h){
            state.current = state.over;
        }

        if(p.x + this.w <= 0){
            this.position.shift();
            score.value++;
        }
    }
},
    draw: function(){
        for(let i=0; i<this.position.length; i++){
            let p = this.position[i];

            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;

            // draws top pipe
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

            // draws bottom pipe
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
        }
    }
};

// START BTN

const startBtn = {
    sX: 244,
    sY: 398,
    w: 86,
    h: 30
}

// SCORE

const score = {
    value: 0,
    draw: function(){
        ctx.fillStyle = "white";
        if(state.current ===  state.game){
            ctx.font = "35px Teko";
            ctx.fillText(this.value, canvas.width/2, 50);
            ctx.strokeText(this.value, canvas.width/2, 50); 
        } if(state.current === state.over){
            ctx.font = "25px Teko";
            ctx.fillText(this.value, gameOver.x+180, 185);
            ctx.strokeText(this.value, gameOver.x+180, 185);
            
        }
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
    },
//     update: function() {
//         if(state.current === state.getReady){

//         }
//     }
}

// GAME OVER

const gameOver = {
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
    pipes.draw();
    faby.draw();
    pipes.draw(); 
    getReady.draw();
    gameOver.draw();
    score.draw();

}

// UPDATE

function update(){
    faby.update();
    fg.update();
    pipes.update();
    // score.update();
    
}

// LOOP

function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();


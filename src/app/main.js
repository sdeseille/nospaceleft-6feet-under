import kontra from '../../lib/kontra.min.mjs'
import {ZZFX, zzfx} from '../../lib/ZzFXMicro.min.js'
let { init, Sprite, GameLoop, initKeys, keyPressed, TileEngine } = kontra

let { canvas } = init();
let sprites = [];
console.log(canvas)

let soundEnable=1;

class Timer 
{
    constructor()           { this.endTime=0; }
    Set(timeLeft=0)         { this.endTime = time + timeLeft; }
    Get()                   { return this.IsSet()? time - this.endTime : 1e9; }
    IsSet()                 { return this.endTime > 0; }
    UnSet()                 { this.endTime = 0; }
    Elapsed()               { return !this.IsSet() || time > this.endTime; }
    valueOf()               { return this.Get(); }
}


///////////////////////////////////////////////////////////////////////////////
// ZzFXmicro - Zuper Zmall Zound Zynth - MIT License - Copyright 2019 Frank Force
let zzfx_v=.15;
let zzfx_x=0;

let beatTimer = new Timer();
let beatCount = 0;
let lastNote;
if (typeof AudioContext === 'undefined') { AudioContext = webkitAudioContext }
function UpdateAudio() {
  if (!soundEnable || !zzfx_x || zzfx_x.state != 'running')
    return
}

function PlaySound(sound, p=0) {
  if (!zzfx_x)
    zzfx_x = new AudioContext;
  if (!soundEnable || !zzfx_x || zzfx_x.state != 'running') {
    zzfx_x.resume();
    return;
  }
      
  switch(sound) {
    case 0: // shoot
      zzfx(.7,.05,899,.2,.02,-8,1,0,0); // ZzFX 10453
      //zzfx(1,.1,5504,.1,.1,-30,.5,.5,.33); // ZzFX 36695
      break;
        
    case 1: // enemy hit
      zzfx(.7,.05,1821,.05,.05,.1,3,13,.64); // ZzFX 10119
      break;
        
    case 2: // egg hit
      zzfx(1,.05,110,.2,.99,.5,3.9,.7,.43); // ZzFX 65151
      break;
        
    case 3: // player die
      zzfx(1.5,.05,111,2,.1,-1,5,0,0); // ZzFX 73670
      break;
        
    case 4: // start
      zzfx(1,.05,5,1,.1,0,.4,44.1,.88); // ZzFX 31713
      break;
        
    case 5: // cant damage hit
      zzfx(1,.05,1671,.05,.22,0,0,0,0); // ZzFX 18784
      break;
        
    case 6: // enemy die
      zzfx(1,.05,1381,.25,.05,4,3.1,1,0); // ZzFX 82807
      break;
        
    case 7: // egg die
      zzfx(1.2,.05,55,2,.05,-0.3,3,8,0); // ZzFX 62469
      //zzfx(1.2,.05,105,1,.1,.3,2.8,40.3,0); // ZzFX 45049
      break;
        
    case 8: // enemy shoot
      zzfx(1,.05,5504,.1,.1,-30,.5,.5,.33); // ZzFX 36695
      break;
        
    case 9: // powerup shoot
      zzfx(1.2,.05,499,.5,.02,-2,1,1,0); // ZzFX 10453
      break;
  }
}

function soundJump(){
  zzfx(...[,,217,.04,.02,.08,1,,8.3,,,,,,,,,.79,.05]);
}

function soundFall(){
  zzfx(...[,,949,.01,.07,.19,1,.31,-3.2,,,,,.1,,,,.96,.06]);
}

function soundHit(){
  zzfx(...[,,153,,,.06,4,2.81,,.9,,,,.5,,.3,,.93,.06,.15]);
}

function soundBlip(){
  zzfx(...[,,95,.01,,.02,1,1.19,,,,,,,27,,,,.01,.95]);
}

function soundPickUp(){
  zzfx(...[,,1041,,.04,.18,1,.78,,,,,,,,,,.53,.09]);
}

function soundExplosion(){
  zzfx(...[1.08,,284,.01,.09,.2,,1.74,-34,,-358,.03,,.7,,.5,,.92]);
}

function soundAlert(){
  zzfx(...[2,0,261.6256,,.32,.5,3,.18,,,,,.4,.4,,,.14,.58,.19,.25]);
}

function soundHurt(){
  zzfx(...[1.06,,668,.04,.06,.01,,2.49,10,,,,.05,,,,,.71,.03,.03]);
}

function soundGameOver(){
  zzfx(...[,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17]);
}

function createEnemy(xpos,ypos,direction) {
  let enemy = kontra.Sprite({
    type: 'enemy',  // we'll use this for collision detection
    x: xpos,
    y: ypos,
    color: 'red',  // fill color of the sprite rectangle
    width: 16,     // width and height of the sprite rectangle
    height: 24,
    dx: (Math.random() * 4 - 2) * direction, 
  });
  sprites.push(enemy);
}

function definePlayer(xpos,ypos) {
  c=this.getContext`2d` // ctx
  C="000f000f000fff00fff0f" // color palette (you can remove the colors you didn't use to save bytes)
  P=[];"@@@@@HIA@@@@@@@@HIA@@@@@@@@@IIHA@@@@@@@HIAHH@@@@@@@H@@IIA@@@@@@HH@HHA@@@@@@HH@HH@@@@@@@H@HHI@@@@@@@@A@HA@@@@@@@@IHAA@@@@@@@@H@HA@@@@@@@H@IIH@@@@@@@II@HIA@@@@@@IAH@IA@@@@@@AA@@AI@@@@@@AAH@AHI@@@@@IH@H@@A@@@@@HIIIA@@@@@@@HHAHA@@@@@@@@HIII@@@@@@@@HIHI@@@@@@@@AAIA@@@@@@@HH@AA@@@@@@@IIHIA@@@@".replace(/./g,a=>{z=a.charCodeAt(),P.push(z&7),P.push((z>>3)&7)}) // pixel decoding
  S=24;for(j=0;j<S;j++)for(i=0;i<S;i++)if(P[j*S+i])c.fillStyle="#"+C.substr(3*(P[j*S+i]-1),3),c.fillRect(xpos+i,ypos+j,1,1) // drawing
}

let initialXpos=0
let initialYpos=20
let direction=1
//this.soundGameOver()
for (let i = 0; i < 3; i++) {
  if (direction < 1) {
    initialXpos = canvas.width
  } else {
    initialXpos = 0
  }
  createEnemy(initialXpos,initialYpos,direction);
  initialYpos+=59
  direction*=-1
}

let image = new Image();
image.src = '../../assets/imgs/hero.png';
image.onload = function() {
  let player = Sprite({
    x: 100,
    y: 35,
    dx: 1,
    anchor: {x: 0, y: 1},

    // required for an image sprite
    image: image
  });

  let platforms = []
  let deepness = 5
  let tunnelPos = 0
  
  let floor_one = Sprite({
    type: 'ground',
    name: 'platform-1',
    x: 0,
    y: 35,
    render() {
      this.context.fillStyle = 'forestgreen';
      this.context.fillRect(0, 0 , canvas.width, 10);
    }
  });
  
  let floor_two = Sprite({
    type: 'ground',
    name: 'platform-2',
    x: 0,
    y: 95,
    render() {
      this.context.fillStyle = 'gray';
      this.context.fillRect(0, 0 , canvas.width, 10);
    }
  });
  
  let floor_three = Sprite({
    type: 'ground',
    name: 'platform-3',
    x: 0,
    y: 155,
    render() {
      this.context.fillStyle = 'olive';
      this.context.fillRect(0, 0 , canvas.width, 10);
    }
  });
  
  let loop = GameLoop({  // create the main game loop
  
    update: function() { // update the game state
  
      // for (let t = 0; t < platforms.length; t++){
      //   console.log(platforms[t].y)
      //   platforms[t].update()
      // }
      UpdateAudio();
      floor_one.update();
      floor_two.update();
      floor_three.update();
      player.update();
  
      // wrap the sprites position when it reaches
      // the edge of the screen
      if (player.x > canvas.width) {
        player.x = -player.width;
      }
      sprites.map(sprite => {
        if (sprite.x > (canvas.width + sprite.width)) {
          sprite.x = -sprite.width;
        }
        if (sprite.x < 0-sprite.width ){
          sprite.x = canvas.width
        }
        sprite.update()
        //TODO: study the code stolen from following project: https://github.com/KilledByAPixel/EggTimeRewind
        //PlaySound(8);
      });
    },
    render: function() { // render the game state
      // for (let t = 0; t < platforms.length; t++){
      //   console.log(platforms[t].y)
      //   platforms[t].render()
      // }
      floor_one.render();
      floor_two.render();
      floor_three.render();
      player.render();
      sprites.map(sprite => sprite.render());
    }
  });
  
  loop.start();    // start the game
};

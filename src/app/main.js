import kontra from '../../lib/kontra.min.mjs'
import {ZZFX, zzfx} from '../../lib/ZzFXMicro.min.js'
let { init, Sprite, GameLoop, initKeys, keyPressed, TileEngine } = kontra

let { canvas } = init();
let sprites = [];
console.log(canvas)


function createEnemy(xpos,ypos,direction) {
  let enemy = kontra.Sprite({
    type: 'enemy',  // we'll use this for collision detection
    x: xpos,
    y: ypos,
    color: 'red',  // fill color of the sprite rectangle
    width: 10,     // width and height of the sprite rectangle
    height: 15,
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

for (let i = 0; i < 3; i++) {
  if (direction < 1) {
    initialXpos = canvas.width
  } else {
    initialXpos = 0
  }
  createEnemy(initialXpos,initialYpos,direction);
  initialYpos+=60
  direction*=-1
}

let sprite = Sprite({
  x: 100,        // starting x,y position of the sprite
  y: 80,
  color: 'blue',  // fill color of the sprite rectangle
  width: 10,     // width and height of the sprite rectangle
  height: 15,
  dx: 1          // move the sprite 2px to the right every frame
});



let player = Sprite({
  x: 100,        // starting x,y position of the sprite
  y: 80,
  color: 'blue',  // fill color of the sprite rectangle
  width: 24,     // width and height of the sprite rectangle
  height: 24,
  dx: 1,         // move the sprite 2px to the right every frame
  render() {
    //definePlayer(this.x,this.y)
  }
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

    floor_one.update();
    floor_two.update();
    floor_three.update();
    player.update();
    sprite.update();

    // wrap the sprites position when it reaches
    // the edge of the screen
    if (sprite.x > canvas.width) {
    sprite.x = -sprite.width;
    }
    sprites.map(sprite => {
      if (sprite.x > canvas.width) {
        sprite.x = -sprite.width;
      }
      if (sprite.x < 0-sprite.width ){
        sprite.x = canvas.width
      }
      sprite.update()
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
    sprite.render();
    sprites.map(sprite => sprite.render());
  }
});

loop.start();    // start the game
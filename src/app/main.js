import kontra from './libs/kontra.min.mjs'
let { init, Sprite, GameLoop, initKeys, keyPressed, TileEngine } = kontra

let { canvas } = init();

console.log(canvas)

let sprite = Sprite({
  x: 100,        // starting x,y position of the sprite
  y: 80,
  color: 'red',  // fill color of the sprite rectangle
  width: 10,     // width and height of the sprite rectangle
  height: 15,
  dx: 1          // move the sprite 2px to the right every frame
});

let platforms = []
let deepness = 5
let tunnelPos = 0

let floor_one = Sprite({
  type: 'ground',
  name: 'platform-1',
  x: 0,
  y: 20,
  render() {
    this.context.fillStyle = 'forestgreen';
    this.context.fillRect(0, 0 , canvas.width, -10);
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
  y: 160,
  render() {
    this.context.fillStyle = 'olive';
    this.context.fillRect(0, 0 , canvas.width, -10);
  }
});

for (let n = 0; n < deepness; n++){
  let ground = Sprite({
    type: 'ground',
    name: 'platform-'+n,
    x: 0,
    y: tunnelPos,
    render() {
      this.context.fillStyle = 'forestgreen';
      this.context.fillRect(0, tunnelPos , canvas.width, -10);
    }
  });
  console.log(ground.name)
  platforms.push(ground)
  tunnelPos = tunnelPos + (canvas.height / deepness)
}

let loop = GameLoop({  // create the main game loop
  update: function() { // update the game state

    // for (let t = 0; t < platforms.length; t++){
    //   console.log(platforms[t].y)
    //   platforms[t].update()
    // }

    floor_one.update();
    floor_two.update();
    floor_three.update();

    sprite.update();

    // wrap the sprites position when it reaches
    // the edge of the screen
    if (sprite.x > canvas.width) {
    sprite.x = -sprite.width;
    }
  },
  render: function() { // render the game state
    // for (let t = 0; t < platforms.length; t++){
    //   console.log(platforms[t].y)
    //   platforms[t].render()
    // }
    floor_one.render();
    floor_two.render();
    floor_three.render();
    sprite.render();
  }
});

loop.start();    // start the game
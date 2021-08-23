import kontra from './libs/kontra.min.mjs'
let { init, Sprite, GameLoop, initKeys, keyPressed } = kontra

let { canvas } = init();

let sprite = Sprite({
  x: 100,        // starting x,y position of the sprite
  y: 80,
  color: 'red',  // fill color of the sprite rectangle
  width: 10,     // width and height of the sprite rectangle
  height: 15,
  dx: 2          // move the sprite 2px to the right every frame
});

let ground = Sprite({
  type: 'ground',
  render() {
      this.context.fillStyle = 'forestgreen';
      this.context.fillRect(0, canvas.height, canvas.width, -50);
  }
});

let loop = GameLoop({  // create the main game loop
  update: function() { // update the game state
    sprite.update();

    // wrap the sprites position when it reaches
    // the edge of the screen
    if (sprite.x > canvas.width) {
    sprite.x = -sprite.width;
    }
  },
  render: function() { // render the game state
    ground.render();
    sprite.render();
  }
});

loop.start();    // start the game
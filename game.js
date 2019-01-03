let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let player;
let grenade = null;
let fireButton = null;


function preload () {
    this.load.image('bg', 'wintertileset/png/BG/BG.png');
    this.load.image('ground', 'wintertileset/png/Tiles/2.png');

    this.load.spritesheet('worm', 'assets/worm2.png', { frameWidth: 12.5, frameHeight: 16 });
    this.load.spritesheet('grenade', 'assets/grenade-spritesheet.png', { frameWidth: 10.875, frameHeight: 16 });
    this.load.spritesheet('worm-with-grenade', 'assets/worm-with-grenade.png', { frameWidth: 15.666, frameHeight: 16 });
}

function create () {
    // A background for the game
  this.add.image(600, 400, 'bg');

  platforms = this.physics.add.staticGroup();
    // creates the ground
  platforms.create(65, 535, 'ground');
  platforms.create(193, 535, 'ground');
  platforms.create(321, 535, 'ground');
  platforms.create(449, 535, 'ground');
  platforms.create(577, 535, 'ground');
  platforms.create(705, 535, 'ground');
  platforms.create(833, 535, 'ground');

  player = this.physics.add.sprite(300, 440, 'worm');
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, platforms);
    console.log(this)
    // worm animation, turing, walking left and right 
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('worm', { start: 0, end: 1 }),
    frameRate: 4,
    repeat: -1
  });

  this.anims.create({
      key: 'turn',
      frames: [ { key: 'worm', frame: 2 } ],
      frameRate: 20
  });

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('worm', { start: 2, end: 3 }),
      frameRate: 4,
      repeat: -1
  });

  // worm animation, worm holding a grenade
  this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('worm-with-grenade', { start: 0, end: 0 }),
      frameRate: 4,
      repeat: -1
  });

  // create an explosion
    // explosions = game.add.group();
    // explosions.createMultiple(30, 'kaboom');
    // explosions.forEach(setupInvader, this);

  
  cursors = this.input.keyboard.createCursorKeys();
  console.log(cursors)
//   aimButton = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
}

function createGrenade(game) {
      // a grenade that a worm will fire
      grenade = game.physics.add.sprite(player.x, player.y, 'grenade');
      
      // enable physics
    //   game.physics.enable(grenade, Phaser.Physics.ARCADE);
      
    // add velocity
      grenade.setVelocity(100, -150);
      grenade.setBounce(0.7);
      grenade.body.drag.set(20);
      game.physics.add.collider(grenade, platforms);
      game.physics.add.collider(grenade, player);
}

function update () {
    if (cursors.left.isDown) {
        player.setVelocityX(-40);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(40);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    } if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-100);
    }
    if (cursors.down.isDown) {
        if (!this.grenade) { 
            createGrenade(this)
        }
    }
    if (this.grenade) {
        // grenade.setCollideWorldBounds(true);
        // this.physics.add.collider(grenade, platforms);
        // this.physics.add.collider(grenade, player);
    }
}


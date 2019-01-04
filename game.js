const config = {
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
}

let game = new Phaser.Game(config)
let player = null
let player2 = null
let grenade = null
let platforms = null
let cursors = null
let gameOver = false

function preload () {
    this.load.audio('forestAudio', 'assets/audio/Forest.mp3');
    this.load.image('bg', 'wintertileset/png/BG/BG.png')
    this.load.image('ground', 'wintertileset/png/Tiles/2.png')

    this.load.spritesheet('worm', 'assets/worm2.png', { frameWidth: 12.5, frameHeight: 16 })
    this.load.spritesheet('grenade', 'assets/grenade-spritesheet.png', { frameWidth: 10.875, frameHeight: 16 })
    this.load.spritesheet('worm-with-grenade', 'assets/worm-with-grenade.png', { frameWidth: 15.666, frameHeight: 16 })

}

function create () {
  // fetch('http://localhost:3000/api/v1/users', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     'name': 'bob'
  //   })
  // })

  // A background for the game
  this.add.image(600, 400, 'bg')



  // creates the ground
  platforms = this.physics.add.staticGroup()
  platforms.create(65, 535, 'ground')
  platforms.create(193, 535, 'ground')
  platforms.create(321, 535, 'ground')
  platforms.create(449, 535, 'ground')
  platforms.create(577, 535, 'ground')
  platforms.create(705, 535, 'ground')
  platforms.create(833, 535, 'ground')

   // playing sound audio for game
   let sound = this.sound.add('forestAudio');
  sound.play();


  // creating worm1

  player = this.physics.add.sprite(300, 440, 'worm')
  player.health = 100
  player.setCollideWorldBounds(true)
  this.physics.add.collider(player, platforms)

  // creating worm2

  player2 = this.physics.add.sprite(500, 440, 'worm')
  player2.health = 100
  player2.setCollideWorldBounds(true)
  this.physics.add.collider(player2, platforms)

  // worm animation, walking left and right

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('worm', { start: 0, end: 1 }),
    frameRate: 4,
    repeat: -1
  })

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('worm', { start: 2, end: 3 }),
    frameRate: 4,
    repeat: -1
  })

  // creates controls for player 1

  cursors = this.input.keyboard.createCursorKeys()

  // creates controls for player 2

  w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
  a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
  s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
  d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

  // creates explosion animation

  // explosion = this.physics.add.sprite(400, 440, 'worm-with-grenade')
  // explosion.frame = 0
  // this.anims.create({
  //       key: 'down',
  //       frames: this.anims.generateFrameNumbers('worm-with-grenade', { start: 0, end: 8 }),
  //       frameRate: 4,
  //       repeat: -1
  //   });
  // explosion.anims.add('boom', [0, 1, 2, 3, 4, 5, 6, 7], 10, true)
  // explosion.anims.play('boom');
}

function createGrenade (game, p) {
  // creates a grenade that a worm will fire
  grenade = game.physics.add.sprite(p.x, p.y, 'grenade')

  // add velocity to grenade (angle dependant on way worm if facing and speed)
  grenade.setVelocity(p.dir === 'left' ? -100 : 100, -150)
  grenade.setBounce(0.7)
  grenade.body.drag.set(29)
  game.physics.add.collider(grenade, platforms)
  game.physics.add.collider(grenade, p)

  // measures distances between grenade and player

  // makes grenade disappear (explode) after 5 seconds
  setTimeout(() => {

    let distanceFromP2 = Phaser.Math.Distance.Between(player2.x, player2.y, grenade.x, grenade.y);
    // console.log(distanceFromP2)

    let distanceFromP1 = Phaser.Math.Distance.Between(player.x, player.y, grenade.x, grenade.y);
    console.log(distanceFromP1)

    if (distanceFromP2 < 50) {
      player2.health -= 100
      if (player2.health === 0) {
        gameOver = true
        alert('player 1 wins')
        fetch('http://localhost:3000/api/v1/scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'score': '1',
            'user_id': '1'
          })
        })
      } else if (distanceFromP1 < 50) {
        player.health -= 100
        if (player.health === 0) {
          alert('player 2 wins')
        }
      }
    }
    grenade.destroy()
    grenade = null
  }, 5000)
}

function update () {
  if (gameOver) {
    return
  }
  // enables worm1 movement and animation on input
  if (cursors.left.isDown) {
    player.dir = 'left'
    player.setVelocityX(-40)
    player.anims.play('left', true)
  } else if (cursors.right.isDown) {
    player.dir = 'right'
    player.setVelocityX(40)
    player.anims.play('right', true)
  } else {
    player.setVelocityX(0)
  } if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-100)
  }
  if (cursors.down.isDown) {
    if (!grenade) {
      createGrenade(this, player)
    }
  }

  // enables movement and animation for player 2 on input
  if (a.isDown) {
    player2.dir = 'left'
    player2.setVelocityX(-40)
    player2.anims.play('left', true)
  } else if (d.isDown) {
    player2.dir = 'right'
    player2.setVelocityX(40)
    player2.anims.play('right', true)
  } else {
    player2.setVelocityX(0)
  } if (w.isDown && player2.body.touching.down) {
    player2.setVelocityY(-100)
  }
  if (s.isDown) {
    if (!grenade) {
      createGrenade(this, player2)
    }
  }
}

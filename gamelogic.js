// GAME LOGIC
// each worm is an object with a name and 100 health
// state array with 2 players (worm objects)
// turn consists of movement and attack
// movement phase ends when attack phase begins
// grenade explosion within radius of worm does X damage
// when attack has taken place turn is over
// turn goes to next worm (player) in state array
// when one worm's health reaches 0, game is over
let game
let state = {
  players: [{
    name: 'worm 1',
    hp: 100
  },
  {
    name: 'worm 2',
    hp: 100
  }],
  currentPlayer: ''
}

// changes player turn

function nextPlayer (currentPlayer) {
  switch (currentPlayer) {
    case 0:
      state.currentPlayer += 1
      break
    case 1:
      state.currentPlayer -= 1
      break
  }
}

// add enter button input to switch to aim mode

this.aimButton = this.input.keyboard.addKey(Phaser.Keyboard.ENTER)
this.aimButton.onDown(aim())

function aim () {
  if (this.grenade.exists) {
    return
  }

  //  Re-position the grenade where the worm is
  this.grenade.reset(this.worm.x, this.worm.y)

  //  Now work out where the END of the target is
  var p = new Phaser.Point(this.target.x, this.target.y)
  p.rotate(p.x, p.y, this.target.rotation, false, 34)

  //  So we can see what's going on when the grenade leaves the screen
  this.camera.follow(this.grenade)

  //  Our launch trajectory is based on the angle of the target and the power
  this.physics.arcade.velocityFromRotation(this.target.rotation, this.power, this.grenade.body.velocity)
}

// add spacebar input to throw grenade

this.throwButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
this.throwButton.onDown(throwGrenade())

// handles throwing of grenade based on settings in the update method

function throwGrenade () {

  //  If the grenade is in flight we don't let them control anything
  if (this.grenade.exists) {
    if (this.grenade.y > 420) {
      //  Simple check to see if it's fallen too low
      this.removegrenade()
    } else {
      //  grenade vs. the Targets
      this.physics.arcade.overlap(this.grenade, this.targets, this.hitTarget, null, this)
    }
  } else {
    //  Allow them to set the power between 100 and 600
    if (this.cursors.left.isDown && this.power > 100) {
      this.power -= 2
    } else if (this.cursors.right.isDown && this.power < 600) {
      this.power += 2
    }

    //  Allow them to set the angle
    if (this.cursors.up.isDown) {
      this.target.angle--
    } else if (this.cursors.down.isDown && this.target.angle < 0) {
      this.target.angle++
    }
  }
}

function removegrenade () {
  this.bullet.kill()
  this.camera.follow()
}

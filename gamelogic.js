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

}

// add spacebar input to throw grenade

this.throwButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
this.throwButton.onDown(throwGrenade())

function throwGrenade () {

}

export default class StartScreen {
  create () {}

  update () {
    console.log('emay here?')
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.game.state.start('game')
    }
  }
}

export default class HealthBar extends Phaser.Group {
  constructor (game, xpos, ypos, barGraphic, holderGraphic) {
    super(game)

    this.x = xpos
    this.y = ypos

    this.bar = this.create(0, 0, barGraphic)
    this.holder = this.create(0, 0, holderGraphic)
  }

  /**
   * Allow to set scale of the bar at runtime. The easiest way to modify the width of the filling is to simply
   * set the bar's scale. Sometimes it is nice to add a bit of flare into a UI, and tweened transitions are a great
   * example of this. Whenever the setValue methods is called, the bar is tweened to its new value for a subtle but
   * hopefully enjoyable bit of polish to this game. Take care with animations like this. If they take too long it will
   * keep the player from seeing the actual values of their life during the gameplay, which may prove frustrating to
   * them later on.
   * @param {*} val sets the position of the bar.
   */
  setValue (val) {
    if (this.tween) this.tween.stop()
    this.tween = this.game.add.tween(this.bar.scale)
    this.tween.to({ x: val }, 350)
    this.tween.start()
  }
}

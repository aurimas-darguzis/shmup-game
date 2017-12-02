export default class NumberBox extends Phaser.Group {
  constructor (game, bgasset, val, parent) {
    super(game, parent)
    this.create(0, 0, bgasset)

    const style = {
      font: '30px Arial',
      align: 'center',
      fill: '#fff'
    }

    this.txtValue = new Phaser.Text(
      this.game, 55, 55, val.toString(), style
    )

    this.txtValue.anchor.setTo(0.5, 0.5)
    this.add(this.txtValue)
  }

  /**
   * Update the text shown in this number box by
   * @param {*} val passed into.
   */
  setValue (val) {
    this.txtValue.text = val.toString()
  }
}

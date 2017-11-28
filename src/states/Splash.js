import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    // this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    // this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    // centerGameObjects([this.loaderBg, this.loaderBar])

    // this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('mushroom', 'assets/images/mushroom2.png')

    this.load.image('enemy', 'assets/images/enemy.png')
    this.load.image('explosion', 'assets/images/explosion.png')
    this.load.spritesheet('player', 'assets/images/gunbot.png', 214, 269)
    this.load.image('hexagon', 'assets/images/hexagon_particle.png')
    this.load.image('bullet', 'assets/images/bullet.png')
    this.load.image('enemyBullet', 'assets/images/enemyBullet.png')
    this.load.image('bg', 'assets/images/bg.jpg')
    this.load.image('health_bar', 'assets/images/health_bar.png')
    this.load.image('health_holder', 'assets/images/health_holder.png')
    this.load.image('circle', 'assets/images/circle.png')
  }

  create () {
    this.state.start('Game')
  }
}

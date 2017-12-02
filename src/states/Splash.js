/**
 * Here are the assets for the game.
 * For this game only images and sprite sheets will be loaded,
 * but if you want to use souds, tilemaps, other sorts of extra data,
 * then this is the place where you would put them.
 */

import Phaser from 'phaser'
export default class extends Phaser.State {
  init () {}

  preload () {
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

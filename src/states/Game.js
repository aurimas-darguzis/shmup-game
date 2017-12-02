/* globals __DEV__ */
import Phaser from 'phaser'

import Player from '../prefabs/Player'
import Enemy from '../prefabs/Enemy'
import NumberBox from '../prefabs/NumberBox'
import HealthBar from '../prefabs/HealthBar'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    this.spawnChance = 0.02
    this.score = 0
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.bg = this.add.tileSprite(0, 0, 1024, 768, 'bg')
    this.bullets = this.add.group()
    this.enemyBullets = this.add.group()
    this.player = new Player(this.game, 0, 0, this.bullets)
    this.game.add.existing(this.player)
    this.enemies = this.add.group()

    for (let i = 0; i < 5; i++) {
      let enemy = new Enemy(this.game, this.game.width + 100 + (Math.random() * 400), Math.random() * this.game.height, this.enemyBullets)
      this.enemies.add(enemy)
    }

    this.explosion = this.game.add.emitter(0, 0, 200)
    this.explosion.makeParticles('hexagon')
    this.explosion.setAlpha(1, 0.2, 2000)
    this.setupUI()
    this.waveTimer = this.game.time.create(false)
    this.waveTimer.loop(20000, this.incrementWave, this)
    this.waveTimer.start()
  }

  setupUI () {
    this.UILayer = this.add.group()
    this.scoreField = new NumberBox(this.game, 'circle', 0)
    this.UILayer.add(this.scoreField)
    this.healthBar = new HealthBar(this.game, 120, 40, 'health_bar', 'health_holder')
    this.UILayer.add(this.healthBar)
  }

  update () {
    this.bg.tilePosition.x -= 0.5
    if (Math.random() < this.spawnChance) {
      const enemy = new Enemy(this.game, this.game.width + 100 + (Math.random() * 400), Math.random() * this.game.height, this.enemyBullets)
      this.enemies.add(enemy)
    }

    this.physics.arcade.overlap(this.enemies, this.bullets, this.damageEnemy, null, this)
    this.physics.arcade.overlap(this.player, this.enemies, this.damagePlayer, null, this)
    this.physics.arcade.overlap(this.player, this.enemyBullets, this.damagePlayer, null, this)
  }

  incrementWave () {
    this.spawnChance *= 1.2
  }

  damagePlayer (playerRef, enemyRef) {
    this.player.damage(1)
    this.healthBar.setValue(this.player.health.current / this.player.health.max)
    enemyRef.kill()
    if (this.player.health.current <= 0) {
      this.game.state.start('gameOver')
    }
  }

  damageEnemy (enemy, bullet) {
    this.explosion.x = enemy.x
    this.explosion.y = enemy.y
    this.explosion.explode(2000, 4)

    enemy.kill()
    bullet.kill()
    this.score++
    this.scoreField.setValue(this.score)
  }

  render () {
    if (__DEV__) {
    }
  }
}

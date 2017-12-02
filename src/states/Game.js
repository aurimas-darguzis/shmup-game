/* globals __DEV__ */
/**
 * Game will manage creation of all the enemies, check for collision between all the different game objects,
 * update the UI as needed, check for the game to be over, and add some bits of flair in when possible.
 * Some threads that will be followed throughout the game state include:
 * Spawning enemies on a chance in different locations
 * A wave spawn timer that makes it more likely that enemies will spawn as time progresses
 * Players colliding with enemy bullets and taking damage
 * Enemies colliding with player bullets, getting destroyed, and incrementing the score
 * Management of particles and UI elements.
 */
import Phaser from 'phaser'

import Player from '../prefabs/Player'
import Enemy from '../prefabs/Enemy'
import NumberBox from '../prefabs/NumberBox'
import HealthBar from '../prefabs/HealthBar'

export default class extends Phaser.State {
  init () {}
  preload () {}

  /**
   * This is where the game gets set up. Any objects that need to exist at the start of the game are made here.
   * It is important with the create method of any gameplay state to reset objects hat need to be reset as well, as there
   * is a strong chance that this state is never deleted if Phaser returns to this state from a different one.
   * If you do not reset scores or timers or anything else that needs to start with specific settings or configurations, they
   * may wind up having those increased values event when returning after a 'game over'.
   */
  create () {
    this.spawnChance = 0.02
    this.score = 0
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.bg = this.add.tileSprite(0, 0, 1024, 768, 'bg')

    /**
     * The preloading of enemies follows a simple loop, set to create five new enemies at the start of the game.
     * These enemies are placed to the right of the screen, at a random y position within the bounds of the world's height
     * and with a bit of randomness on the x-axis, so they do not all come at the same time. In case the enemies will fire
     * a projectile, each enemy will need to know where the bullet layer is, so that layer is passed into their constructor
     * as the final argument.
     */
    this.bullets = this.add.group()
    this.enemyBullets = this.add.group()
    this.player = new Player(this.game, 0, 0, this.bullets)
    this.game.add.existing(this.player)
    this.enemies = this.add.group()
    for (let i = 0; i < 5; i++) {
      let enemy = new Enemy(this.game, this.game.width + 100 + (Math.random() * 400), Math.random() * this.game.height, this.enemyBullets)
      this.enemies.add(enemy)
    }

    /**
     * Setup a particle system that will be used for some visual feedback when the enemies get annihilated. This needs to come after
     * the enemy layeris added so the particles will appear atop the enemies and other objects. This particular particle system will spew
     * out hexagon particles whenever it is active. The setAlpha sets the particles to fade from a full visible to 20% visible over the span
     * of 2 seconds from the moment the particle is made visible.
     */
    this.explosion = this.game.add.emitter(0, 0, 200)
    this.explosion.makeParticles('hexagon')
    this.explosion.setAlpha(1, 0.2, 2000)

    /**
     * After the explosion the UI needs to be added. It is done as the last of the additions to the display list, so the UI elements will always
     * appear atop the other objects in the game. This has to be broken down into its own method.
     */
    this.setupUI()

    /**
     * Starts a timer and is set to run the method 'incrementWave' once every 20 seconds.
     */
    this.waveTimer = this.game.time.create(false)
    this.waveTimer.loop(20000, this.incrementWave, this)
    this.waveTimer.start()
  }

  /**
   * The UI section creates its own layer for the UI elements to exist on, partially for organization. Two UI elements coded before are instantiated
   * and added to the group. The number box is positioned to the far left and configured to use a simple circle to ground the number that will appear
   * inside of it. The healthbar is positioned further to the right of the bnumber box and is set up with the assets to show a simple green bar inside
   * of a basic holder to ground that bar.
   */
  setupUI () {
    this.UILayer = this.add.group()
    this.scoreField = new NumberBox(this.game, 'circle', 0)
    this.UILayer.add(this.scoreField)
    this.healthBar = new HealthBar(this.game, 120, 40, 'health_bar', 'health_holder')
    this.UILayer.add(this.healthBar)
  }

  /**
   * Game implementation codes goes to this function. This is the method that is responsible for the majority of the game's interactivity such as checking
   * for collisions, moving objects about on the screen abd getting input.
   * First thing is to move the background against x-axis.
   * Next thing is to attempt to spawn and place an enemy on the screen. The spawnChance starts at a fairly low number, but will be high enough that enemies will
   * still be generated quite often. Should the chance roll pass, a new enemy will be generated and added to the game in te same way that the enemies were prewarmed
   * before (randomly in a box as tall as the game and a bit to the right of the screen).
   */
  update () {
    this.bg.tilePosition.x -= 0.5
    if (Math.random() < this.spawnChance) {
      const enemy = new Enemy(this.game, this.game.width + 100 + (Math.random() * 400), Math.random() * this.game.height, this.enemyBullets)
      this.enemies.add(enemy)
    }

    /**
     * Check for collisions, using the overlap method. Two methods are added to make these overlaps work. One will damage the enemy hit by a player bullet and the
     * other will damage the player for different actions.
     */
    this.physics.arcade.overlap(this.enemies, this.bullets, this.damageEnemy, null, this)
    this.physics.arcade.overlap(this.player, this.enemies, this.damagePlayer, null, this)
    this.physics.arcade.overlap(this.player, this.enemyBullets, this.damagePlayer, null, this)
  }

  /**
   * Increases the spawn chance by 20% every time it ticks. It is set to tick every 20 seconds, whenever the timer started in the create function cycles
   * through its timer and restarts. The maximum chance that is really needed for an enemy to be spawned with 100% certainty for every frame is one, so
   * anything above that is just overkill. If the player manages to play that long that will be dealing with a lot of enemies on the screen, so it is not very likely
   * that the spawn chance will need to be clamped to a maximum of one.
   */
  incrementWave () {
    this.spawnChance *= 1.2
  }

  /**
   * This method will bring to the end of both the game state's code and the player's gameplay, as it is the function that checks for a game over state.
   * Gameover is when a life gets to 0. If an overlap between a player and an enemy bullet is detected, the player's apply damage method is called, subtracting 1
   * from its health and bringin the player closer to death. This new state of the health is sent to the healthbar via a percentage calculation. The healthbar is
   * programmed to reduce its size to the percentage sent in. Next, the enemyor enemy bullet is killed, ready to be reused in the future.
   * Finally there is a check to see if the player is dead. If their hp is at that low level, they have taken too much damage, and the game is over.
   * @param {*} playerRef 
   * @param {*} enemyRef 
   */
  damagePlayer (playerRef, enemyRef) {
    this.player.damage(1)
    this.healthBar.setValue(this.player.health.current / this.player.health.max)
    enemyRef.kill()
    if (this.player.health.current <= 0) {
      this.game.state.start('gameOver')
    }
  }

  /**
   * Runs when a player's attack hits
   * @param {*} enemy with
   * @param {*} bullet from a gun.
   * First reposition the particle emitter to the location of the enemy and have the emitter generate a burst of four particles that will fade away quickly.
   * Even though the emitter may later be moved for the destruction of another enemy, these generated particles will remain at where they were generated in the
   * world space for the duration of their lives. Next, the player's bullet and enemy are removed from the game via a .kill(), ready to be revived later on.
   * Finally, the score is incremented, and the score box is fed the new score to be displayed to the player.
   */
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

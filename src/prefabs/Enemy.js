export default class Enemy extends Phaser.Sprite {
  constructor (game, x, y, bulletLayer, frame) {
    super(game, x, y, 'enemy', frame)
    this.game.physics.enable(this, Phaser.Physics.ARCADE)

    /**
     * To get the enemies moving need to set their velocity to move them consistently in one direction.
     * Higher numbers mean faster movement, so adjust upward or downward based on the pace of the game.
     * Setting velocity only gets the enemies moving in a stright line.
     */
    this.body.velocity.x -= 175

    /**
     * bounceTick is associated with this wave pattern movement. It is a little trick to start each enemy off
     * at a random point on the since curve, so they are not moving in identical patterns each time. One might
     * be headed up, while another is headed down on the same location on the screen.
     */
    this.bounceTick = Math.random() * 2

    this.outOfBoundsKill = true

    /**
     * On a 50% chance, set the enemy to one of the types that will fire back at the player. If the enemy is set to fire,
     * it will then create a countdon timer to shoot back in 3.5 seconds.
     */
    this.bulletLayer = bulletLayer
    this.willFire = Phaser.Utils.chanceRoll(50)
    if (this.willFire) {
      this.fireTimer = this.game.time.create(false)
      this.fireTimer.add(3500, this.fireShot, this)
      this.fireTimer.start()
    }
  }

  /**
   * Generates a new enemy attack and send it hurtling toward the left side of the screen.
   */
  fireShot () {
    let bullet = this.bulletLayer.create(this.x, this.y, 'enemyBullet')
    this.game.physics.enable(bullet, Phaser.Physics.ARCADE)
    bullet.outOfBoundsKill = true
    bullet.checkWorldBounds = true
    bullet.body.velocity.x = -250
  }

/**
 * The way to simulate a bouncing wave pattern is to change an input value over time and get the sin value from it,
 *  one will get a way to create a 'bouncing' value that shifts between a positive and negative extreme. If that value
 * is used to offset a sprite's y position every frame by the value calculated, then the sprite would appear to move up and
 * down, as if bobbing on a wave.
 */
  update () {
    /**
     * 0.02 is a 'sample rate' or frequency of the sine curve. It lets one specify how much detail they want of the curve and
     * also how quickly to move through it. The bigger that number gets, the further in the x-direction of the sine curve will it
     * sample each frame. With this value you have a power to manipulate the motion of the enemy.
     */
    this.bounceTick += 0.02

    /**
     * Multiplication by 1 is a scalar. It works as an amplitude modifier and changes how 'tall' the enemy arcs can get.
     * Bigger numbers will make the enemy move in bigger arcs, taking up more y space on the screen and making them harder to hit.
     * Smaller will do the opposite and have them move in more minute arcs.
     */
    this.y += Math.sin(this.bounceTick) * 1
  }
}

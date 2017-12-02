export default class Player extends Phaser.Sprite {
  constructor (game, x, y, bullets) {
    super(game, x, y, 'player', 0)
    
    /**
     * The motion of the player is a combination
     * of the drag and speed. The drag, set in the
     * constructor, is the amount of force that pushes
     * work against a sprite's body when it moves
     * via velocity.
     */
    this.speed = 100
    this.game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.drag.x = 35
    this.body.drag.y = 35
    this.body.collideWorldBounds = true

    /**
     * Firing-specific code.
     * bulletsGate stores the next time a shot is allowed
     * shotInterval is milliseconds between shots
     */
    this.bulletGate = 0
    this.shotInterval = 500
    this.bullets = bullets
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    this.health = { current: 10, max: 10 }
    this.fireposition = { x: 160, y: 100 }

    this.animations.add('fly', [0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10])
    this.fireAnimation = this.animations.add('fire', [11, 12, 13])
    this.fireAnimation.onComplete.add(this.playFly, this)
    this.animations.play('fly', 14, true)
  }

  /**
   * When arrow keys are held down, a force is applied to the player,
   * overriding the majority of the drag, but not all of it. The drag
   * will continue to pull back on the player, meaning that even if the
   * speed is set to 100, the drag will pull back on the player when it
   * is moving, so it never actually hit a speed of 100.

   * Increasing the drag will affect the maximum speed the player can reach
   * and how quickly the player will slow at a stop. Larger drags mean lower
   * max speed and faster topping times. Changing the speed property in the
   * constructor will affect how quickly player moves in general.
   * Raising the speed of an object, if you want it to stop at about the same
   * rate as it was before, raise the drag an equal percentage.
   */
  update () {
    if (this.cursors.left.isDown) {
      this.body.velocity.x = -this.speed
    }

    if (this.cursors.right.isDown) {
      this.body.velocity.x = this.speed
    }

    if (this.cursors.up.isDown) {
      this.body.velocity.y = -this.speed
    }

    if (this.cursors.down.isDown) {
      this.body.velocity.y = this.speed
    }

    /**
     * Check every frame to see if the fire button is down.
     */
    if (this.fireButton.isDown) {
      this.fire()
    }
  }

  /**
   * First check that enough time has elapsed between the last shot and
   * the current frame for a new shot to be generated. This is based on the
   * bullet gate. If the time is greater than this number - a new bullet is
   * being generated, and, at the end of the `if` statement, the gate is updated
   * to an amount of time in the future, as specified by the shot interval.
   */
  fire () {
    if (this.game.time.now > this.bulletGate) {
      /**
       * Checks if a 'dead' bullet already exists. If it does, then that means that the bullet
       * is already set up with a velocity and everything it needs, and it simply needs to be
       * repositioned and brought back to life.
       */
      var bullet = this.bullets.getFirstDead()
      if (bullet) {
        bullet.x = this.x + this.fireposition.x
        bullet.y = this.y + this.fireposition.y
        bullet.revive()
      } else {
        /**
         * If a bullet is not available already, a new one is generated and added to the bullet layer.
         * The bullet is enabled for physics, si it can collide against other things and be affected by velocity.
         * Its velocity is set to a positive value making it move right nonstop beacuse it has no drag
         * Additionally, the bullet is set to kill itself once it flies off the screen, setting itself to 'dead'
         * and readying it for reuse later on in the game (it will be returned by the getFirstDead method when a new
         * shot needs to be generated).
         */
        bullet = this.bullets.create(this.x + this.fireposition.x, this.y + this.fireposition.y, 'bullet')
        this.game.physics.enable(bullet, Phaser.Physics.ARCADE)
        bullet.outOfBoundsKill = true
        bullet.checkWorldBounds = true
        bullet.body.velocity.x = 250
      }

      /**
       * Play shooting animation. It is a quick animatio, and another animation needs to play once that animation is complete.
       * In order to accomplish this, the animation has an event that was attached to it in the crate method that will run the
       * 'playFly' method when the firing animation completes.
       */
      this.animations.play('fire')

      this.bulletGate = this.game.time.now + this.shotInterval
    }
  }

  damage (amt) {
    this.health.current -= amt
  }

  /**
   * When used as the onComplete handler of the fire animation, it will bring the player back to default, 'flying' state when the
   * shooting is over. It is actually a small detail and is barely noticeable if the player is just holding down the 'shoot' button for the duration
   * of the game because the shooting animation takes up most of the interval inbetween shots. If this method is not here, however, the flying animation
   * would never been seen after the start of the game.
   */
  playFly () {
    this.animations.play('fly', 14, true)
  }
}

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

    if (this.fireButton.isDown) {
      this.fire()
    }
  }

  fire () {
    if (this.game.time.now > this.bulletGate) {
      var bullet = this.bullets.getFirstDead()
      if (bullet) {
        bullet.x = this.x + this.fireposition.x
        bullet.y = this.y + this.fireposition.y
        bullet.revive()
      } else {
        bullet = this.bullets.create(this.x + this.fireposition.x, this.y + this.fireposition.y, 'bullet')
        this.game.physics.enable(bullet, Phaser.Physics.ARCADE)
        bullet.outOfBoundsKill = true
        bullet.checkWorldBounds = true
        bullet.body.velocity.x = 250
      }

      this.animations.play('fire')

      this.bulletGate = this.game.time.now + this.shotInterval
    }
  }

  damage (amt) {
    this.health.current -= amt
  }

  playFly () {
    this.animations.play('fly', 14, true)
  }
  }

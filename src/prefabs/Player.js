export default class Player extends Phaser.Sprite {
  
  constructor () {
    super (game, x, y, 'player', 0)

    this.game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.drag.x = 35
    this.body.drag.y = 35
    this.body.collideWorldBounds = true
    
    /**
     * initialize prefab here
     */
    this.speed = 100
    this.bulletGate = 0
    this.bullets = bullets
    this.cursor = this.game.input.keyboard.createCursorKeys()
    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    
    this.health = { current: 10, max: 10 }
    this.fireposition = { x: 160, y: 100 }
    
    this.animations.add('fly', [0,0,1,1,2,2,3,4,5,6,7,8,9,10,10])
    this.fireAnimation = this.animations.add('fire', [11,12,13])
    this.fireAnimation.onComplete.add(this, playFly, this)
    this.animations.play('fly', 14, true)
  }

  update () {
   /**
    * write your prefab's specific update code here
    */
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
    
  }
}
import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'game-scene' });
  }

  preload() {
    // Load assets (called first)
    this.load.image('player', 'assets/fighter.png');
  }

  create() {
   this.physics.world.setBounds(0, 0, 800, 600);

    // Create player sprite with physics
    this.player = this.physics.add.sprite(400, 300, 'player');
    this.player.setCollideWorldBounds(true); // Keep player on screen

    // Set up WASD input
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');

    this.playerSpeed = 200;


  }
    rotateToAngle(targetAngle) {
        // Stop any existing rotation tween
        if (this.currentTween) {
        this.currentTween.stop();
        }

        // Calculate the shortest rotation path
        let currentAngle = this.player.angle;
        let angleDiff = targetAngle - currentAngle;

        // Normalize angle difference to -180 to 180 range
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;

        let finalAngle = currentAngle + angleDiff;

        // Create smooth rotation tween
        this.currentTween = this.tweens.add({
            targets: this.player,
            angle: finalAngle,
            duration: 150,
            ease: 'Power2'
        });
  }

  update() {
    this.player.setVelocity(0);
    let newDirection = null;

    // Handle WASD movement with smooth rotation
    if (this.wasd.A.isDown) {
      this.player.setVelocityX(-this.playerSpeed); // Move left
      newDirection = 'left';
      if (this.currentDirection !== 'left') {
        this.rotateToAngle(270); // Face left
        this.currentDirection = 'left';
      }
    }
    else if (this.wasd.D.isDown) {
      this.player.setVelocityX(this.playerSpeed);  // Move right
      newDirection = 'right';
      if (this.currentDirection !== 'right') {
        this.rotateToAngle(90); // Face right
        this.currentDirection = 'right';
      }
    }
    else if (this.wasd.W.isDown) {
      this.player.setVelocityY(-this.playerSpeed); // Move up
      newDirection = 'up';
      if (this.currentDirection !== 'up') {
        this.rotateToAngle(0); // Face up
        this.currentDirection = 'up';
      }
    }
    else if (this.wasd.S.isDown) {
      this.player.setVelocityY(this.playerSpeed);  // Move down
      newDirection = 'down';
      if (this.currentDirection !== 'down') {
        this.rotateToAngle(180); // Face down
        this.currentDirection = 'down';
      }
    }

    // Reset direction when no keys are pressed
    if (!newDirection) {
      this.currentDirection = null;
    }
  }
}

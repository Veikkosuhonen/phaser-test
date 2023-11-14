import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	keys: Phaser.Types.Input.Keyboard.CursorKeys|null = null;
	player: Phaser.Physics.Arcade.Sprite|null = null;
	isDead = false;

	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('tilesheet', 'assets/Tileset.png')
		this.load.tilemapTiledJSON('tilemap', 'assets/base.json')

		this.load.spritesheet('charactersheet', 'assets/playerSpriteSheet.png', { frameWidth: 47, frameHeight: 53 });
	}

	create() {
		// create the Tilemap
		const map = this.make.tilemap({ key: 'tilemap' })

		// add the tileset image we are using
		const tileset = map.addTilesetImage('base', 'tilesheet')

		// create the layers we want in the right order
		map.createLayer('Base', tileset)

		map.createLayer('Decoration', tileset)
		
		this.player = this.physics.add.sprite(100, 100, 'charactersheet', 0);
		this.player.scale = 0.5;
		this.player.setDamping(true);
		this.player.setMaxVelocity(100);
		this.player.setDrag(0.002);

		this.anims.create({
			key: 'walk',
			frames: this.anims.generateFrameNumbers('charactersheet', { start: 36, end: 40 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('charactersheet', { start: 12, end: 15 }),
			frameRate: 8,
			repeat: -1,
		});

		this.anims.create({
			key: 'roll',
			frames: this.anims.generateFrameNumbers('charactersheet', { start: 41, end: 48 }),
			frameRate: 20,
			repeat: 0,
		})

		this.anims.create({
			key: 'death',
			frames: this.anims.generateFrameNumbers('charactersheet', { start: 6, end: 7 }),
			frameRate: 2,
			repeat: 0,
		})

		this.player.anims.play('idle', true);

		this.keys = this.input.keyboard.createCursorKeys();

		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.cameras.main.setZoom(4);
        this.cameras.main.startFollow(this.player);
	}

	update() {
		if (!this.player || !this.keys || this.isDead) return;
	
		let isRunning = false;
		const isRolling = this.player.anims.currentAnim.key === 'roll' && !this.player.anims.currentFrame.isLast;
		if (isRolling) {
			return;
		}

		if (this.keys.shift.isDown) {
			this.isDead = true;
			this.player.anims.play('death', true);
			return;
		}

		this.player.setAcceleration(0);

		if (this.keys.left.isDown) {
			this.player.setAccelerationX(-400);
			this.player.setFlipX(true);
			isRunning = true;
		} else if (this.keys.right.isDown) {
			this.player.setAccelerationX(400);
			this.player.setFlipX(false);
			isRunning = true;
		}
		if (this.keys.up.isDown) {
			this.player.setAccelerationY(-400);
			isRunning = true;
		} else if (this.keys.down.isDown) {
			this.player.setAccelerationY(400);
			isRunning = true;
		}

		if (this.keys.space.isDown && this.player.body.velocity.length() > 10) {
			this.player.anims.play('roll', true);
		} else if (isRunning) {
			this.player.anims.play('walk', true);
		} else {
			this.player.anims.play('idle', true);
		}

	}
}

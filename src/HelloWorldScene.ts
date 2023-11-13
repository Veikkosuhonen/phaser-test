import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	keys: Phaser.Types.Input.Keyboard.CursorKeys|null = null;
	player: Phaser.Physics.Arcade.Sprite|null = null;

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

		this.anims.create({
			key: 'walk',
			frames: this.anims.generateFrameNumbers('charactersheet', { start: 36, end: 40 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('charactersheet', { start: 12, end: 15 }),
			frameRate: 10,
			repeat: -1
		});

		this.player.anims.play('idle', true);

		this.keys = this.input.keyboard.createCursorKeys();

		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
	}

	update() {
		if (!this.player || !this.keys) return;
	
		let isRunning = false;
		this.player.setVelocity(0);

		if (this.keys.left.isDown) {
			this.player.setVelocityX(-160);
			this.player.setFlipX(true);
			isRunning = true;
		} else if (this.keys.right.isDown) {
			this.player.setVelocityX(160);
			this.player.setFlipX(false);
			isRunning = true;
		}
		if (this.keys.up.isDown) {
			this.player.setVelocityY(-160);
			isRunning = true;
		} else if (this.keys.down.isDown) {
			this.player.setVelocityY(160);
			isRunning = true;
		}
		if (isRunning) {
			this.player.anims.play('walk', true);
		} else {
			this.player.anims.play('idle', true);
		}

	}
}

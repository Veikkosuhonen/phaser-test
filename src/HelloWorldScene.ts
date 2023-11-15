import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	keys: Phaser.Types.Input.Keyboard.CursorKeys|null = null;
	player: Phaser.Physics.Arcade.Sprite|null = null;
	isDead = false;
	mapLayer: Phaser.Tilemaps.TilemapLayer|null = null;

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
		map.setCollisionBetween(48, 51, true);
		this.mapLayer = map.createLayer('Base', tileset)
		/*this.mapLayer.renderDebug(this.add.graphics(), {
			tileColor: null,
			collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200),
			faceColor: new Phaser.Display.Color(40, 39, 37, 255)
		})*/

		map.createLayer('Decoration', tileset)

		
		this.player = this.physics.add.sprite(300, 200, 'charactersheet', 0);
		this.player.scale = 0.5;
		this.player.setDamping(true);
		this.player.setMaxVelocity(70);
		this.player.setDrag(0.001);
		this.player.setCollideWorldBounds(true);
		this.player.body.setSize(20, 12, false);
		this.player.body.setOffset(14, 40);
		this.player.body.onCollide = true;

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
		this.cameras.main.setZoom(6);
        this.cameras.main.startFollow(this.player);
	}

	update() {
		if (!this.player || !this.keys || this.isDead) return;

		this.physics.collide(this.player, this.mapLayer!);


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

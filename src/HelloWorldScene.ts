import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('tilesheet', 'assets/Tileset.png')
		this.load.tilemapTiledJSON('tilemap', 'assets/base.json')
	}

	create() {
		console.log(this.cache.tilemap)
		// create the Tilemap
		const map = this.make.tilemap({ key: 'tilemap' })
		console.log(map)

		// add the tileset image we are using
		const tileset = map.addTilesetImage('base', 'tilesheet')
		console.log(tileset)
		
		// create the layers we want in the right order
		map.createLayer('Base', tileset)

		map.createLayer('Decoration', tileset)
	}
}

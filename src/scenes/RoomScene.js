import Phaser from 'phaser'

const DUDE_KEY = 'dude'
const WALL_KEY = 'wall'
const speed = 300

export default class RoomScene extends Phaser.Scene {
	constructor(){
		super('room-scene')

		this.player = undefined
		this.cursors = undefined
	}

	preload(){
		this.load.image('floor', 'assets/floor.png')
		this.load.image('ground', 'assets/platform.png')
		this.load.image('wall', 'assets/wall.png')

		this.load.spritesheet(DUDE_KEY, 
			'assets/dude.png',
			{ frameWidth: 64, frameHeight: 64 }
		)
	}

	create(){
		this.add.image(400,300, 'floor')

		const walls = this.createWalls()
		this.player = this.createPlayer()

		this.physics.add.collider(this.player, walls)

		this.cursors = this.input.keyboard.createCursorKeys()
	}

	update(){
		if(this.cursors.left.isDown){
			this.player.setVelocityX(-speed)
			this.player.anims.play('left',true)

		}
		else if(this.cursors.right.isDown){
			this.player.setVelocityX(speed)
			this.player.anims.play('right',true)

		}
		else{
			this.player.setVelocityX(0)
		}
		if(this.cursors.up.isDown){
			this.player.setVelocityY(-speed)
			this.player.anims.play('up',true)

		}
		else if(this.cursors.down.isDown){
			this.player.setVelocityY(speed)
			this.player.anims.play('down',true)

		}
		else{
			this.player.setVelocityY(0)
		}
	}

	createWalls(){
		const walls = this.physics.add.staticGroup()
		walls.create(600, 400, WALL_KEY).setScale(2).refreshBody()
		walls.create(600, 400, WALL_KEY)
		walls.create(50, 250, WALL_KEY)
		walls.create(750, 220, WALL_KEY)

		return walls
	}

	createPlayer(){
		const player = this.physics.add.sprite(100,450, DUDE_KEY)
		player.setCollideWorldBounds(true)

		this.anims.create({
			key: 'left',
			frames: [{key: DUDE_KEY, frame: 0}],
			frameRate: 20
		})
		this.anims.create({
			key: 'up',
			frames: [{key: DUDE_KEY, frame: 1}],
			frameRate: 20
		})
		this.anims.create({
			key: 'down',
			frames: [{key: DUDE_KEY, frame: 2}],
			frameRate: 20
		})
		this.anims.create({
			key: 'right',
			frames: [{key: DUDE_KEY, frame: 3}],
			frameRate: 20
		})

		return player
	}
}
import Phaser from 'phaser'
import ApplianceObject from '../appliances/Appliance'
import OvenObject from '../appliances/Oven'
import FridgeObject from '../appliances/Fridge'
import Util from "../Util"

const width = 800
const height = 600
const tile_colour = 0x33ff33
const tile_alpha = 0.6

const DUDE_KEY = 'dude'
const WALL_KEY = 'wall'
const APPLIANCE_KEY = 'appliance'

const speed = 300
const reach = 20
var offsetX = -1
var offsetY = 0
var e

export default class RoomScene extends Phaser.Scene {
	constructor(){
		super({key: 'room-scene', active: true})

		this.player = undefined
		this.cursors = undefined
		this.appliances = undefined
		this.toActivate = null
	}

	preload(){
		this.load.image('floor', 'assets/demo/floor.png')
		this.load.image('wall', 'assets/demo/wall.png')
		this.load.image('playerbounds', 'assets/demo/blankx64.png')

		this.load.spritesheet(APPLIANCE_KEY,
			'assets/demo/Appliance.png',
			{frameWidth: 64, frameHeight: 64}
		)
		this.load.spritesheet(DUDE_KEY, 
			'assets/demo/dude.png',
			{ frameWidth: 64, frameHeight: 64 }
		)
	}

	create(){
		//World and Camera
		this.physics.world.setBounds(0,0,width,height,true,true,true,true)
		//this.physics.world.createDebugGraphic()
		this.cameras.main.setBounds(0,0,width,height)
		this.cameras.main.setZoom(1)
		this.add.image(400,300, 'floor')

		this.tileHighlighter = new Phaser.GameObjects.Rectangle(this, 0, 0, Util.tile_size, Util.tile_size, tile_colour, tile_alpha)
		this.add.existing(this.tileHighlighter)

		//Load first objects
		const walls = this.initWalls()
		this.player = this.initPlayer()
		this.appliances = this.initAppliances()

		//Setup Physics
		this.physics.add.collider(this.player, walls)
		this.physics.add.collider(this.player, this.appliances)
		var activateOverlap = this.physics.add.overlap(this.player.bounds, this.appliances, this.turnOn, null, this)
		
		//Add input handlers
		this.cursors = this.input.keyboard.createCursorKeys()
		e = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

		this.input.on('pointerdown', function(pointer) {
			if(pointer.leftButtonDown()){
				this.addAppliance(pointer.worldX, pointer.worldY, 'oven')
			}
		}, this)
	}

	update(){
		//update ui
		this.cameras.main.centerOn(this.player.x, this.player.y)
		this.highlightTile()

		//keyboard input
		if(Phaser.Input.Keyboard.JustDown(e)){
			this.appliances.children.iterate((child) =>{
				if(this.physics.overlap(this.player.bounds, child)){
					child.activated = !child.activated
					if(child.activated){
						child.activate(1)
					}
					else{
						child.activate(-1)
					}
				}
			})
		}

		//Player movement: Move player, move bounding box
		if(this.cursors.left.isDown){
			this.player.setVelocityX(-speed)
			this.player.anims.play('left',true)
		}
		else if(this.cursors.right.isDown){
			this.player.setVelocityX(speed)
			this.player.anims.play('right',true)
		}
		else {
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

		if(this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'left'){
			offsetX = -1
			offsetY = 0
		}
		if(this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'right'){
			offsetX = 1
			offsetY = 0
		}
		if(this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'up'){
			offsetX = 0
			offsetY = -1
		}
		if(this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'down'){
			offsetX = 0
			offsetY = 1
		}
		this.player.bounds.setSize((reach-50)*Math.abs(offsetX) + 50, (reach-50)*Math.abs(offsetY) + 50)
		this.player.bounds.setX(this.player.x + (reach+64/2-reach/2)*offsetX)
		this.player.bounds.setY(this.player.y + (reach+64/2-reach/2)*offsetY)
	}

	initAppliances(){
		const appliances = this.physics.add.staticGroup()

		appliances.add(new OvenObject(Util.gridify(400),Util.gridify(400), this), true)
		appliances.add(new FridgeObject(Util.gridify(400),Util.gridify(164), this), true)
		appliances.add(new OvenObject(Util.gridify(600),Util.gridify(200), this), true)
		appliances.add(new FridgeObject(Util.gridify(256),Util.gridify(256), this), true)
		appliances.add(new OvenObject(Util.gridify(100),Util.gridify(100), this), true)
		appliances.add(new FridgeObject(Util.gridify(128),Util.gridify(256), this), true)
		appliances.add(new OvenObject(Util.gridify(700),Util.gridify(500), this), true)
		appliances.add(new FridgeObject(Util.gridify(100),Util.gridify(532), this), true)

		const ovenSprite = this.anims.create({
			key: 'oven',
			frames: this.anims.generateFrameNumbers(APPLIANCE_KEY, {start: 0, end: 4}),
			frameRate: 5,
			repeat: -1
		})

		appliances.children.iterate((child) =>{
			child.activated = false
		})
		return appliances
	}

	addAppliance(x, y, type){
		this.appliances.add(new OvenObject(Util.gridify(x), Util.gridify(y), this), true)
	}

	removeAppliance(x,y, appliance){
		this.appliances.remove(appliance, true, true)
	}

	initWalls(){
		const walls = this.physics.add.staticGroup({
			key: WALL_KEY,
			repeat: 2,
			setXY: {x: 40, y:400, stepX: 64}
		})

		return walls
	}

	initPlayer(){
		const player = this.physics.add.sprite(Util.gridify(100),Util.gridify(450), DUDE_KEY)
		player.bounds = this.physics.add.sprite(player.body.x, player.body.y, 'playerbounds')
		player.bounds.body.setSize(64,50)
		player.bounds.setVisible(false)

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

	highlightTile(){
		var pointer = this.input.activePointer
		this.tileHighlighter.setX(Util.gridify(pointer.worldX))
		this.tileHighlighter.setY(Util.gridify(pointer.worldY))
	}

	destroy(){
		appliances.children.iterate((child) =>{
			this.appliances.remove(child, true, true)
		})
	}
}
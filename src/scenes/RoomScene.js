import Phaser from 'phaser'
import ApplianceObject from '../placeables/appliances/Appliance'
import ComputerObject from '../placeables/appliances/Computer'
import FridgeObject from '../placeables/appliances/Fridge'
import LampObject from '../placeables/appliances/Lamp'
import MicrowaveObject from '../placeables/appliances/Microwave'
import OvenObject from '../placeables/appliances/Oven'
import ToasterObject from '../placeables/appliances/Toaster'
import TVObject from '../placeables/appliances/TV'
import Util from "../Util"

const width = 800
const height = 600
const tile_colour = 0x33ff33
const tile_alpha = 0.6

const DUDE_KEY = 'character-boy'
const WALL_KEY = 'wall'

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

		for (var i = Util.ApplianceKeys.length - 1; i >= 0; i--) {
			this.load.spritesheet(Util.ApplianceKeys[i],
				`assets/${Util.ApplianceKeys[i]}.jpg`,
				{frameWidth: 64, frameHeight: 64}
			)
		}

		this.load.spritesheet(DUDE_KEY, 
			`assets/${DUDE_KEY}.png`,
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

		this.registry.set('mode', 'normal')
		this.tileHighlighter = new Phaser.GameObjects.Rectangle(this, 0, 0, Util.tile_size, Util.tile_size, tile_colour, tile_alpha)
		this.add.existing(this.tileHighlighter)

		this.createAnimations()

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
			if(pointer.leftButtonDown() && this.registry.values.mode == 'place'){
				this.addAppliance(this.phantom.texture.key, Util.gridify(pointer.worldX), Util.gridify(pointer.worldY))
				this.registry.values.mode = 'normal'
				this.tileHighlighter.setVisible(true)
				this.phantom.destroy()
			}
		}, this)

		this.scene.get('ui-scene').events.on('placeevent', function(key){
			if(typeof this.phantom !== "undefined") {this.phantom.destroy()}
			this.phantom = this.add.image(0,0,key)
			this.phantom.alpha = 0.6
			this.tileHighlighter.setVisible(false)
		}, this)
	}

	update(){
		//update ui
		this.cameras.main.centerOn(this.player.x, this.player.y)

		//mode change
		if(this.registry.values.mode == 'place'){
			this.drawPhantomAtCursor()	
		} else{
			this.highlightTile()
		}

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

	createAnimations(){
		const computerSprite = this.anims.create({
			key: 'computer',
			frames: this.anims.generateFrameNumbers('computer', {start: 1, end: 1}),
			frameRate: 1,
			repeat: -1
		})
		const fridgeSprite = this.anims.create({
			key: 'fridge',
			frames: this.anims.generateFrameNumbers('fridge', {start: 1, end: 1}),
			frameRate: 1,
			repeat: -1
		})
		const lampSprite = this.anims.create({
			key: 'lamp',
			frames: this.anims.generateFrameNumbers('lamp', {start: 1, end: 1}),
			frameRate: 1,
			repeat: -1
		})
		const microwaveSprite = this.anims.create({
			key: 'microwave',
			frames: this.anims.generateFrameNumbers('microwave', {start: 1, end: 1}),
			frameRate: 1,
			repeat: -1
		})
		const ovenSprite = this.anims.create({
			key: 'oven',
			frames: this.anims.generateFrameNumbers('oven', {start: 1, end: 1}),
			frameRate: 1,
			repeat: -1
		})
		const toasterSprite = this.anims.create({
			key: 'toaster',
			frames: this.anims.generateFrameNumbers('toaster', {start: 1, end: 1}),
			frameRate: 1,
			repeat: -1
		})
		const tvSprite = this.anims.create({
			key: 'tv',
			frames: this.anims.generateFrameNumbers('tv', {start: 1, end: 1}),
			frameRate: 1,
			repeat: -1
		})
	}

	initAppliances(){
		const appliances = this.physics.add.staticGroup()

		appliances.children.iterate((child) =>{
			child.activated = false
		})
		return appliances
	}

	addAppliance(key, x,y){
		if(key == 'computer'){
			this.appliances.add(new ComputerObject(x, y, this), true)
		}
		else if(key == 'fridge'){
			this.appliances.add(new FridgeObject(x, y, this), true)
		}
		else if(key == 'lamp'){
			this.appliances.add(new LampObject(x, y, this), true)
		}
		else if(key == 'microwave'){
			this.appliances.add(new MicrowaveObject(x, y, this), true)
		}
		else if(key == 'oven'){
			this.appliances.add(new OvenObject(x, y, this), true)
		}
		else if(key == 'toaster'){
			this.appliances.add(new ToasterObject(x, y, this), true)
		}
		else if(key == 'tv'){
			this.appliances.add(new TVObject(x, y, this), true)
		}
	}

	removeAppliance(x,y, appliance){
		this.appliances.remove(appliance, true, true)
	}

	initWalls(){
		const walls = this.physics.add.staticGroup()//{
		// 	key: WALL_KEY,
		// 	repeat: 2,
		// 	setXY: {x: 40, y:400, stepX: 64}
		// })
		// walls.setDepth(1)
		return walls
	}

	initPlayer(){
		const player = this.physics.add.sprite(Util.gridify(100),Util.gridify(450), DUDE_KEY)
		player.bounds = this.physics.add.sprite(player.body.x, player.body.y, 'playerbounds')
		player.bounds.body.setSize(Util.tile_size,50)
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

	drawPhantomAtCursor(){
		var pointer = this.input.activePointer
		this.phantom.setX(Util.gridify(pointer.worldX))
		this.phantom.setY(Util.gridify(pointer.worldY))
	}

	destroy(){
		appliances.children.iterate((child) =>{
			this.appliances.remove(child, true, true)
		})
	}

	drawStorage(x,y){

	}
}
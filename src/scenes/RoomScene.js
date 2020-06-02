import Phaser from 'phaser'
import ApplianceObject from '../placeables/appliances/Appliance'
import FurnitureObject from '../placeables/Furniture'
import ComputerObject from '../placeables/appliances/Computer'
import DryerObject from '../placeables/appliances/Dryer'
import DishwasherObject from '../placeables/appliances/Dishwasher'
import FanObject from '../placeables/appliances/Fan'
import FridgeObject from '../placeables/appliances/Fridge'
import LampObject from '../placeables/appliances/Lamp'
import MicrowaveObject from '../placeables/appliances/Microwave'
import OvenObject from '../placeables/appliances/Oven'
import StereoObject from '../placeables/appliances/Stereo'
import ToasterObject from '../placeables/appliances/Toaster'
import TVObject from '../placeables/appliances/TV'
import VacuumObject from '../placeables/appliances/Vacuum'

import Util from "../Util"
import WallEndObject from '../placeables/WallEnd'
import WallObject from '../placeables/Wall'

const width = 1472
const height = 1472
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
		super({key: 'room-scene', active: false})

		this.player = undefined
		this.cursors = undefined
		this.appliances = undefined
		this.toActivate = null
	}

	preload(){
		this.load.image('floor', 'assets/Map.png')
		this.load.image('playerbounds', 'assets/demo/blankx64.png')

		for (var i = Util.ApplianceKeys.length - 1; i >= 0; i--) {
			this.load.spritesheet(Util.ApplianceKeys[i],
				`assets/${Util.ApplianceKeys[i]}.png`,
				{frameWidth: 64, frameHeight: 64}
			)
		}
		for (var i = Util.FurnitureKeys.length - 1; i >= 0; i--) {
			this.load.image(Util.FurnitureKeys[i], `assets/Furniture-${Util.capitalize(Util.FurnitureKeys[i])}.png`)
		}
		this.load.image('woodwall-segment', 'assets/demo/wall-segment.png')
		this.load.image('woodwall', 'assets/demo/wall-end.png')

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
		this.add.image(width/2,height/2, 'floor')
		//this.add.image(width/2,height/2, 'walls')
		var bounds = this.physics.add.staticGroup()
		bounds.add(this.add.existing(new Phaser.GameObjects.Rectangle(this, 6.5*64/2, 3*64, 6.5*64, 6*64)))
		bounds.add(this.add.existing(new Phaser.GameObjects.Rectangle(this, width/2, 2*64, 10*64, 4*64)))
		bounds.add(this.add.existing(new Phaser.GameObjects.Rectangle(this, 23*64-6.5*64/2, 3*64, 6.5*64, 6*64)))
		bounds.add(this.add.existing(new Phaser.GameObjects.Rectangle(this, 64/2, 6*64 + 16*64/2, 1*64, 16*64)))
		bounds.add(this.add.existing(new Phaser.GameObjects.Rectangle(this, 22*64+64/2, 6*64 + 16*64/2, 1*64, 16*64)))
		bounds.add(this.add.existing(new Phaser.GameObjects.Rectangle(this, width/2, height-32, 23*64, 64)))
		this.registry.set('mode', 'normal')
		this.tileHighlighter = new Phaser.GameObjects.Rectangle(this, 0, 0, Util.tile_size, Util.tile_size, tile_colour, tile_alpha)
		this.add.existing(this.tileHighlighter)

		this.createAnimations()

		//Load first objects
		this.walls = this.initWalls()
		this.wallEnds = this.initWallEnds()
		this.player = this.initPlayer()
		this.appliances = this.initAppliances()
		this.furniture = this.initFurniture()
		
		//Setup Physics
		this.physics.add.collider(this.player, this.walls)
		this.physics.add.collider(this.player, this.wallEnds)
		this.physics.add.collider(this.player, this.appliances)
		this.physics.add.collider(this.player, this.furniture)
		this.physics.add.collider(this.player, bounds)
		var activateOverlap = this.physics.add.overlap(this.player.bounds, this.appliances, this.turnOn, null, this)
		
		//Add input handlers
		this.cursors2 = this.input.keyboard.createCursorKeys()
		this.cursors = this.input.keyboard.addKeys({up:Phaser.Input.Keyboard.KeyCodes.W,down:Phaser.Input.Keyboard.KeyCodes.S,left:Phaser.Input.Keyboard.KeyCodes.A,right:Phaser.Input.Keyboard.KeyCodes.D})
		
		e = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

		this.input.on('pointerdown', function(pointer) {
			if(pointer.leftButtonDown() && this.registry.values.mode == 'place'){
				this.addAppliance(this.phantom.texture.key, Util.gridify(pointer.worldX), Util.gridify(pointer.worldY))
				this.registry.values.mode = 'normal'
				this.tileHighlighter.setVisible(true)
				this.phantom.destroy()
			} else if(pointer.leftButtonDown() && this.registry.values.mode == 'placefurniture'){
				var furn = new FurnitureObject(this, Util.gridify(pointer.worldX), Util.gridify(pointer.worldY), this.phantom.texture.key)
				this.add.existing(furn)
				this.furniture.add(furn)
				this.registry.values.mode = 'normal'
				this.tileHighlighter.setVisible(true)
				this.phantom.destroy()
			} else if(pointer.leftButtonDown() && this.registry.values.mode == 'placewall'){
				this.addWallend(this.phantom.texture.key, Util.wallify(pointer.worldX), Util.wallify(pointer.worldY))
				this.registry.values.mode = 'placewallsegment'
				this.end = [Util.wallify(pointer.worldX), Util.wallify(pointer.worldY)]
				this.tileHighlighter.setVisible(true)
				this.events.emit('placewallsegmentevent', this.phantom.texture.key + '-segment')
			} else if(pointer.leftButtonDown() && this.registry.values.mode == 'placewallsegment'){
				for(var i = 0; i < this.phantom.children.size; i++){
					var crossWall = this.wallExists(this.phantom.children.entries[i].x, this.phantom.children.entries[i].y)
					if(this.phantom.children.entries[i].visible){
						if(crossWall === null){
							var newWall = new WallObject(this, this.phantom.children.entries[i].x, this.phantom.children.entries[i].y, this.phantom.children.entries[i].texture.key)
							newWall.alpha = 1
							newWall.rotation = this.phantom.children.entries[i].rotation
							if(!Util.threshold(newWall.rotation, 0, 0.01)){
								newWall.setSize(newWall.height, newWall.width)
							}
							this.walls.add(newWall, true)
						}
						else if (crossWall !== null && (Math.abs(crossWall.rotation - this.phantom.children.entries[i].rotation) >= 1*Math.PI/180)){
							var newWall = new WallObject(this, this.phantom.children.entries[i].x, this.phantom.children.entries[i].y, this.phantom.children.entries[i].texture.key)
							newWall.alpha = 1
							newWall.rotation = this.phantom.children.entries[i].rotation
							if(!Util.threshold(newWall.rotation, 0, 0.01)){
								newWall.setSize(newWall.height, newWall.width)
							}
							this.walls.add(newWall, true)
							this.addWallend(this.phantom.children.entries[i].texture.key.split("-segment")[0], this.phantom.children.entries[i].x, this.phantom.children.entries[i].y)
						}
					}
				}
				this.addWallend(this.phantom.children.entries[0].texture.key.split("-segment")[0], this.walls.getLast(true, false).x, this.walls.getLast(true, false).y)
				this.registry.values.mode = 'normal'
				this.tileHighlighter.setVisible(true)
				this.phantom.destroy(true)
			}
		}, this)

		this.scene.get('ui-scene').events.on('placeevent', function(key){
			if(typeof this.phantom !== "undefined") {this.phantom.destroy()}
			this.phantom = this.add.image(0,0,key)
			this.phantom.alpha = 0.6
			this.tileHighlighter.setVisible(false)
		}, this)

		this.scene.get('ui-scene').events.on('placefurnitureevent', function(key){
			if(typeof this.phantom !== "undefined") {this.phantom.destroy()}
			this.phantom = this.add.image(0,0,key)
			this.phantom.alpha = 0.6
			this.tileHighlighter.setVisible(false)
		}, this)

		this.scene.get('ui-scene').events.on('placewallevent', function(key){
			if(typeof this.phantom !== "undefined") {this.phantom.destroy()}
			this.phantom = this.add.image(0,0,key)
			this.phantom.alpha = 0.6
			this.tileHighlighter.setVisible(false)
		}, this)

		this.events.on('placewallsegmentevent', function(key){
			if(typeof this.phantom !== "undefined") {this.phantom.destroy()}
			this.phantom = this.physics.add.staticGroup()
			this.phantom.add(this.add.image(0,0,key))
			this.phantom.children.entries[0].alpha = 0.6
			this.tileHighlighter.setVisible(false)
		}, this)
	}

	update(){
		//update ui
		this.cameras.main.centerOn(this.player.x, this.player.y)

		if(this.registry.values.mode == 'place'){
			this.drawPhantomAtCursor()	
		} else if(this.registry.values.mode == 'placefurniture'){
			this.drawPhantomAtCursor()	
		} else if (this.registry.values.mode == 'placewall'){
			this.drawPhantomWallAtCursor()
		} else if (this.registry.values.mode == 'placewallsegment'){
			this.drawPhantomWallSegmentsAtCursor(this.end[0], this.end[1])
		} else {
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
		if(this.cursors.left.isDown || this.cursors2.left.isDown){
			this.player.setVelocityX(-speed)
			this.player.anims.play('left',true)
		}
		else if(this.cursors.right.isDown || this.cursors2.right.isDown){
			this.player.setVelocityX(speed)
			this.player.anims.play('right',true)
		}
		else {
			this.player.setVelocityX(0)
		}
		if(this.cursors.up.isDown || this.cursors2.up.isDown){
			this.player.setVelocityY(-speed)
			this.player.anims.play('up',true)
		}
		else if(this.cursors.down.isDown || this.cursors2.down.isDown){
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

	initFurniture(){
		const furniture = this.physics.add.staticGroup()
		return furniture
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
		else if(key == 'dishwasher'){
			this.appliances.add(new DishwasherObject(x,y,this), true)
		}
		else if(key == 'dryer'){
			this.appliances.add(new DryerObject(x,y,this), true)
		}
		else if(key == 'fan'){
			this.appliances.add(new FanObject(x,y,this), true)
		}
		else if(key == 'stereo'){
			this.appliances.add(new StereoObject(x,y,this), true)
		}
		else if(key == 'vacuum'){
			this.appliances.add(new VacuumObject(x,y,this), true)
		}
		this.registry.set(key, this.registry.get(key) - 1)
	}


	sellAppliance(x,y, appliance){
		this.registry.values.balance += appliance.cost
		this.appliances.remove(appliance, true, true)
	}

	sellWall(x,y,wall){
		this.registry.values.balance += wall.cost
		this.walls.remove(wall, true, true)
	}

	sellWallEnd(x,y,wallEnd){
		this.registry.values.balance += wallEnd.cost
		this.wallEnds.remove(wallEnd, true, true)
	}

	storeAppliance(x, y, appliance){
		this.registry.set(appliance.key, this.registry.get(appliance.key) + 1)
		this.appliances.remove(appliance, true, true)
	}

	initWalls(){
		const walls = this.physics.add.staticGroup()
		walls.setDepth(2)
		return walls
	}

	initWallEnds(){
		const wallEnds = this.physics.add.staticGroup()
		wallEnds.setDepth(3)
		return wallEnds
	}

	addWallend(key, x, y){
		if(this.wallEndExists(x, y) === null) {
			console.log("add end")
			var wallend = new WallEndObject(this, x, y, key)
			wallend.setDepth(3)
			this.wallEnds.add(wallend, true)
		}
	}

	wallExists(x, y){
		//console.log(`x: ${x}, y: ${y}`)
		var cross = null
		if(this.walls.children.size > 0 ){
			for (var i = this.walls.children.size - 1; i >= 0; i--) {
				if(Util.threshold(this.walls.children.entries[i].x, x, 0.01) && Util.threshold(this.walls.children.entries[i].y, y, 0.01)){
					cross = this.walls.children.entries[i]
				}
			}
			return cross
		} else{
			return null
		}
	}

	wallEndExists(x, y){
		//console.log(`x: ${x}, y: ${y}`)
		var cross = null
		if(this.wallEnds.children.size > 0 ){
			for (var i = this.wallEnds.children.size - 1; i >= 0; i--) {
				if(Util.threshold(this.wallEnds.children.entries[i].x, x, 0.01) && Util.threshold(this.wallEnds.children.entries[i].y, y, 0.01)){
					cross = this.wallEnds.children.entries[i]
				}
			}
			return cross
		} else{
			return null
		}
	}

	initPlayer(){
		const player = this.physics.add.sprite(Util.gridify(100),Util.gridify(450), DUDE_KEY)
		player.bounds = this.physics.add.sprite(player.body.x, player.body.y, 'playerbounds')
		player.bounds.body.setSize(Util.tile_size, 20)
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
			frames: [{key: DUDE_KEY, frame: 3}],
			frameRate: 20
		})
		this.anims.create({
			key: 'right',
			frames: [{key: DUDE_KEY, frame: 2}],
			frameRate: 20
		})

		return player
	}

	highlightTile(){
		var pointer = this.input.activePointer
		pointer.updateWorldPoint(this.cameras.main)
		this.tileHighlighter.setX(Util.gridify(pointer.worldX))
		this.tileHighlighter.setY(Util.gridify(pointer.worldY))
	}

	drawPhantomAtCursor(){
		var pointer = this.input.activePointer
		pointer.updateWorldPoint(this.cameras.main)
		this.phantom.setX(Util.gridify(pointer.worldX))
		this.phantom.setY(Util.gridify(pointer.worldY))
	}

	drawPhantomWallAtCursor(){
		var pointer = this.input.activePointer
		pointer.updateWorldPoint(this.cameras.main)
		this.phantom.setX(Util.wallify(pointer.worldX))
		this.phantom.setY(Util.wallify(pointer.worldY))
	}
	drawPhantomWallSegmentsAtCursor(endX, endY, key){
		var pointer = this.input.activePointer
		pointer.updateWorldPoint(this.cameras.main)
		var dist = Util.distance(endX, endY, Util.wallify(pointer.worldX), Util.wallify(pointer.worldY))
		var rot = Util.getAngle(endX, endY, pointer.worldX, pointer.worldY)
		this.phantom.children.iterate((child) =>{
			child.rotation = rot
		})
		var segments = Math.floor(dist/Util.tile_size) + 1

		if(segments > this.phantom.children.size){
			for (var i = segments - this.phantom.children.size - 1; i >= 0; i--) {
				this.phantom.add(this.add.image(0, 0, this.phantom.children.entries[0].texture.key))
			}
		}

		for (i = 0; i < segments; i++) {
			var x = endX + (Util.tile_size * i * Math.sin(rot))
			var y = endY + (Util.tile_size * i * -Math.cos(rot))
			this.phantom.children.entries[i].setVisible(true)
			this.phantom.children.entries[i].alpha = 0.6
			this.phantom.children.entries[i].setX(x)
			this.phantom.children.entries[i].setY(y)
		}
		for (i = this.phantom.children.size - 1; i >= segments; i--) {
			this.phantom.children.entries[i].setVisible(false)
		}
	}

	destroy(){
		appliances.children.iterate((child) =>{
			this.appliances.remove(child, true, true)
		})
		walls.children.iterate((child) =>{
			this.walls.remove(child, true, true)
		})
	}

	drawStorage(x,y){

	}
}
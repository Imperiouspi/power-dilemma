import Phaser from 'phaser'
import ApplianceObject from '../appliances/Appliance'
import OvenObject from '../appliances/Oven'
import FridgeObject from '../appliances/Fridge'
import PowerIndicator from '../ui/PowerIndicator'

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
		super('room-scene')

		this.player = undefined
		this.cursors = undefined
		this.appliances = undefined
		this.toActivate = null
		this.power = undefined
	}

	preload(){
		this.load.image('floor', 'assets/floor.png')
		this.load.image('wall', 'assets/wall.png')
		this.load.image('playerbounds', 'assets/blankx64.png')
		
		this.load.image('powerbar', 'assets/PowerBar.png')
		this.load.image('pip', 'assets/PowerPip.png')

		this.load.spritesheet(APPLIANCE_KEY,
			'assets/Appliance.png',
			{frameWidth: 64, frameHeight: 64}
		)
		this.load.spritesheet(DUDE_KEY, 
			'assets/dude.png',
			{ frameWidth: 64, frameHeight: 64 }
		)
	}

	create(){
		//this.physics.world.createDebugGraphic()
		this.cameras.main.setBounds(0,0,800,600)
		this.cameras.main.setZoom(1)
		this.add.image(400,300, 'floor')

		const walls = this.initWalls()
		this.player = this.initPlayer()
		this.appliances = this.initAppliances()

		this.power = this.initPowerIndicator(130, 16, 0)

		this.physics.add.collider(this.player, walls)
		this.physics.add.collider(this.player, this.appliances)
		var activateOverlap = this.physics.add.overlap(this.player.bounds, this.appliances, this.turnOn, null, this)
		
		this.cursors = this.input.keyboard.createCursorKeys()
		e = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

		this.input.on('pointerdown', function(pointer) {
			if(pointer.leftButtonDown()){
				this.addAppliance(pointer.x, pointer.y, 'oven')
			}
		}, this)
	}

	update(){
		this.cameras.main.centerOn(this.player.x, this.player.y)

		//keyboard input
		if(Phaser.Input.Keyboard.JustDown(e)){
			this.appliances.children.iterate((child) =>{
				if(this.physics.overlap(this.player.bounds, child)){
					child.activated = !child.activated
					if(child.activated){
						child.activate()
						this.power.add(child.power)
					}
					else{
						child.anims.remove()
						this.power.add(-child.power)
					}
				}
			})
		}

		//movement
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

		appliances.add(new OvenObject(400,400, this), true)
		appliances.add(new FridgeObject(400, 164, this), true)
		appliances.add(new OvenObject(600,200, this), true)
		appliances.add(new FridgeObject(256, 256, this), true)
		appliances.add(new OvenObject(100,100, this), true)
		appliances.add(new FridgeObject(128, 256, this), true)
		appliances.add(new OvenObject(700,500, this), true)
		appliances.add(new FridgeObject(100, 532, this), true)

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
		this.appliances.add(new OvenObject(x, y, this), true)
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
		const player = this.physics.add.sprite(100,450, DUDE_KEY)
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

	initPowerIndicator(x, y, power){
		const label = new PowerIndicator(this, x, y, power)
		this.add.existing(label)
		for (var i = label.pips.length - 1; i >= 0; i--) {
			this.add.existing(label.pips[i])
		};

		return label
	}
}
import Phaser from 'phaser'
import PowerIndicator from '../ui/PowerIndicator'
import MoneyBar from '../ui/MoneyBar'
import LoseScene from '../scenes/LoseScene'
import Util from '../Util'
import {Viewport} from 'phaser-ui-tools'
import {Column} from 'phaser-ui-tools'
import {Scrollbar} from 'phaser-ui-tools'
import Button from '../ui/Button'

const startingBalance = 999.00
const powerCost = 1
var biller

export default class UIScene extends Phaser.Scene
{
	constructor()
	{
		super({key: 'ui-scene', active: true})
		this.powerIndicator = undefined
		this.moneyCount = undefined
		this.accumulatedBill = 0
	}

	preload()
	{
		this.load.image('mainscreen', 'assets/Main Screen1.png')
		this.load.image('mainscreen_icons', 'assets/Main Screen2.png')
		
		//load shop assets
		this.load.spritesheet('shop', 'assets/icon-shop.png',
			{ frameWidth: 64, frameHeight: 64 })

		this.load.spritesheet('gen', 'assets/demo/icon-gen.png',
			{ frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('storage', 'assets/icon-storage.png',
			{ frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('profile', 'assets/icon-profile.png',
			{ frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('settings', 'assets/icon-settings.png',
			{ frameWidth: 64, frameHeight: 64 })

		this.load.image('track', 'assets/demo/track.png')
		this.load.image('crate', 'assets/demo/crate.png')
		this.load.spritesheet('bar', 
			'assets/demo/bar.png',
			{ frameWidth: 22, frameHeight: 44 })
	}

	create()
	{
		this.uiplacer = this.add.text(400,300, `${this.input.activePointer.x}, ${this.input.activePointer.y}`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
		
		//Main UI
		this.add.image(400, 300, 'mainscreen')
		this.add.image(400, 300, 'mainscreen_icons').setDepth(1)

		//buttons
		var shopButton = new Button(this, 75, 530, 'shop', function(){
			console.log('open shop')
		})
		this.add.existing(shopButton)

		var genButton = new Button(this, 175, 530, 'gen', function(){
			console.log('open gen')
		})
		this.add.existing(genButton)

		var profileButton = new Button(this, 645, 515, 'profile', function(){
			console.log('open profile')
		})
		this.add.existing(profileButton)
		var settingsButton = new Button(this, 715, 515, 'settings', function(){
			console.log('open settings')
		})
		this.add.existing(settingsButton)

		//storage
		this.initstorage()
		var storageButton = new Button(this, 575, 515, 'storage', function(){
			this.storeon = !this.storeon
			this.scene.storage.setVisible(this.storeon)
			this.scene.storage.active = this.storeon
			this.scene.storageScroll.setVisible(this.storeon)
			this.scene.storageScroll.active = this.storeon
		}, this)
		this.add.existing(storageButton)
		storageButton.storeon = false

		//Power
		this.powerIndicator = this.initPowerIndicator(304, 39, 0, 10)

		this.registry.events.on('changedata-power', function(){
			this.powerIndicator.updatePower()
		}, this)

		this.registry.events.on('changedata-generated', function(){
			this.powerIndicator.updatePower()
		}, this)

		//Money
		this.moneyBar = this.initBalance(startingBalance)
		this.moneyBar.updateBalance()
		this.billBar = this.add.graphics()
		this.billBar.fillStyle(0x222222, 0.8)
		this.billBar.fillRect(25,55,10,103)

		this.billTimer = this.add.graphics()
		this.bill = 0
		biller = setInterval((function(self){
			return function(){
				self.stepBill()
			}
		})(this),1000)

		this.registry.events.on('changedata-balance', function(){
			if(this.registry.values.balance <= 0){this.moneyBar.emit('broke', this)}
			else{this.moneyBar.updateBalance()}
		}, this)

		this.moneyBar.on('broke', function(scene){
			//clearInterval(biller)
			//Util.lose('broke', scene) //Uncomment for lose
		}, this)

	}

	initPowerIndicator(x, y, power, gen){
		const indic = new PowerIndicator(this, x, y, power, gen)
		this.add.existing(indic)
		return indic
	}

	initBalance(amount){
		var moneyBar = new MoneyBar(this, 105, 39, startingBalance)
		this.add.existing(moneyBar)
		return moneyBar
	}

	stepBill(){
		if(this.bill<10){
			this.bill += 1
		}
		else {
			this.registry.values.balance -= this.accumulatedBill
			this.accumulatedBill = 0
			this.bill = 1
		}
		this.accumulatedBill += this.registry.values.power*powerCost
		this.billTimer.clear()
		this.billTimer.fillStyle(0xffffff,1)
		this.billTimer.fillRect(26,54+(102-10*this.bill),8,10*this.bill)
	}

	initstorage(){
		this.storage = new Viewport(this, 600-50, 525 - 300, 64, 260)
		var column = new Column(this)
		this.storage.addNode(column)
		var wall = this.add.image(0,0, 'woodwall-segment')
		wall.setInteractive()
		var scene = this
		wall.on('pointerdown', function(){
			scene.events.emit('placewallevent', 'woodwall')
			scene.registry.values.mode = 'placewall'
		}, wall)
		column.addNode(wall)
		for (var i = Util.ApplianceKeys.length - 1; i >= 0; i--) {
			var ob = this.add.image(0,0, Util.ApplianceKeys[i])
			ob.setInteractive()
			var scene = this
			ob.on('pointerdown', function(){
				scene.events.emit('placeevent', this.texture.key)
				scene.registry.values.mode = 'place'
			}, ob)
			column.addNode(ob)
		}

		this.storageScroll = new Scrollbar(this, this.storage, true, true, "track", "bar", {'duration': 300, 'ease': Phaser.Math.Easing.Quadratic.Out})
		Phaser.Display.Align.To.RightCenter(this.storageScroll, this.storage, 64 + 2, 0)
		
		this.storage.setVisible(false)
		this.storage.active = false
		this.storageScroll.setVisible(false)
		this.storageScroll.active = false
	}

	update(){
		this.uiplacer.text = `${this.input.activePointer.x}, ${this.input.activePointer.y}`
	}
}

import Phaser from 'phaser'
import PowerIndicator from '../ui/PowerIndicator'
import MoneyBar from '../ui/MoneyBar'
import LoseScene from '../scenes/LoseScene'
import Util from '../Util'
import StorageBox from '../ui/StorageBox'
import ShopBox from '../ui/ShopBox'
import FurnitureBox from '../ui/FurnitureBox'
import {Scrollbar} from 'phaser-ui-tools'
import {Viewport} from 'phaser-ui-tools'
import {Column} from 'phaser-ui-tools'
import {QuantityBar} from 'phaser-ui-tools'
import Button from '../ui/Button'

const startingBalance = 5000.00
const powerCost = 1
var biller
var storagin = 225
var income = 300

const Random = Phaser.Math.Between;

export default class UIScene extends Phaser.Scene
{
	constructor()
	{
		super({key: 'ui-scene', active: false})
		this.powerIndicator = undefined
		this.moneyCount = undefined
		this.accumulatedBill = 0
		this.accumulatedPollution = 0
		this.income = income
	}

	preload()
	{
		this.load.image('mainscreen', 'assets/Main Screen2.png')
		this.load.image('mainscreen_icons', 'assets/Main Screen3.png')
		this.load.image('pollution-bar', 'assets/pollution-bar.png')
		this.load.image('happy-bar', 'assets/happiness-bar.png')
		this.load.image('pollution-back', 'assets/pollution-back.png')
		
		//load shop assets
		this.load.spritesheet('shopicon', 'assets/icon-shop.png',
			{ frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('shop', 'assets/Shop Screen.png', {frameWidth: 128, frameHeight: 260})
		this.load.spritesheet('genicon', 'assets/Icon-Generation.png',
			{ frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('storageicon', 'assets/icon-storage.png',
			{ frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('profileicon', 'assets/icon-profile.png',
			{ frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('settings', 'assets/icon-settings.png',
			{ frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('applianceicon', 'assets/Icon-Appliances.png',
			{frameWidth: 64, frameHeight: 64})
		this.load.spritesheet('deleteicon', 'assets/Icon-Delete.png',
			{frameWidth: 64, frameHeight: 64})
		this.load.image('track', 'assets/demo/track.png')
		this.load.spritesheet('bar', 
			'assets/demo/bar.png',
			{ frameWidth: 22, frameHeight: 44 })
	}

	create()
	{
		//this.uiplacer = this.add.text(400,300, `${this.input.activePointer.x}, ${this.input.activePointer.y}`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
		
		//Main UI
		this.add.image(400, 300, 'mainscreen')
		this.add.image(400, 300, 'mainscreen_icons').setDepth(2)
		var polStart = 25
		this.polbar = new QuantityBar(
			this,
			{'x': 485, 'y': 39},
			{'startValue': polStart, 'maxValue': 100},
			false,
			false,
			'pollution-back',
			'pollution-bar',
			{'duration': 400, 'ease': Phaser.Math.Easing.Quadratic.Out}
		)
		this.polbar.setDepth(1)
		this.add.existing(this.polbar)
		this.registry.set('pollution', polStart)
		var happyStart = 100
		this.happybar = new QuantityBar(
			this,
			{'x': 663, 'y': 39},
			{'startValue': happyStart, 'maxValue': 100},
			false,
			false,
			'pollution-back',
			'happy-bar',
			{'duration': 400, 'ease': Phaser.Math.Easing.Quadratic.Out}
		)
		this.happybar.setDepth(1)
		this.add.existing(this.happybar)
		this.registry.set('happiness', happyStart)

		//buttons
		this.initshop()
		var shopButton = new Button(this, 75, 530, 'shopicon', function(){
			this.shopon = !this.shopon
			this.scene.shop.setVisible(this.shopon)
			this.scene.shop.active = this.shopon
			this.scene.shopScroll.setVisible(this.shopon)
			this.scene.shopScroll.active = this.shopon
		}, this)
		shopButton.storeon = false
		this.add.existing(shopButton)

		var genButton = new Button(this, 150, 535, 'genicon', function(){
			this.scene.scene.switch('gen-scene')
		})
		this.add.existing(genButton)

		var deleteButton = new Button(this, 225, 535, 'deleteicon', function(){
			if(this.scene.registry.values.mode == 'normal'){
				this.scene.registry.values.mode = 'delete'
				this.scene.scene.get('room-scene').tileHighlighter.fillColor = 0xff3333
			} else if(this.scene.registry.values.mode == 'delete'){
				this.scene.registry.values.mode = 'normal'
				this.scene.scene.get('room-scene').tileHighlighter.fillColor = 0x33ff33
			}
		})
		this.add.existing(deleteButton)

		this.initstorage()
		var applianceButton = new Button(this, 645, 515, 'applianceicon', function(){
			this.storeon = !this.storeon
			this.scene.storage.setVisible(this.storeon)
			this.scene.storage.active = this.storeon
			this.scene.storageScroll.setVisible(this.storeon)
			this.scene.storageScroll.active = this.storeon
		})
		applianceButton.storeon = false
		this.add.existing(applianceButton)

		var settingsButton = new Button(this, 715, 515, 'settings', function(){
			console.log('open settings')
		})
		this.add.existing(settingsButton)

		//storage
		this.initfurniture()
		var furnitureButton = new Button(this, 575, 515, 'storageicon', function(){
			this.furnitureon = !this.furnitureon
			this.scene.furniture.setVisible(this.furnitureon)
			this.scene.furniture.active = this.furnitureon
			this.scene.furnitureScroll.setVisible(this.furnitureon)
			this.scene.furnitureScroll.active = this.furnitureon
		}, this)
		furnitureButton.furnitureon = false
		this.add.existing(furnitureButton)

		for (var i = Util.ApplianceKeys.length - 1; i >= 0; i--) {
			this.registry.set(Util.ApplianceKeys[i], 0)
		}

		//Enable when furniture is in the shop
		// for (var i = Util.FurnitureKeys.length - 1; i >= 0; i--) {
		// 	this.registry.set(Util.FurnitureKeys[i], 0)
		// }

		for (var i = Util.ApplianceKeys.length - 1; i >= 0; i--) {
			var eventLabel = `changedata-${Util.ApplianceKeys[i]}`
			this.registry.events.on(eventLabel, function(){
				this.storage.update(this.storage.children[0].children)
			}, this)
		}

		//Power
		this.powerIndicator = this.initPowerIndicator(304, 39, 0, 20)

		this.registry.events.on('changedata-power', function(){
			this.powerIndicator.updatePower()
		}, this)

		this.registry.set('solar', 0)
		this.registry.set('coal', 1)
		this.registry.set('wind', 0)
		this.registry.set('hydro', 0)

		this.registry.events.on('changedata-generated', function(){
			this.powerIndicator.updatePower()
		}, this)

		this.registry.events.on('changedata-happiness', function(){
			if(this.registry.values.happiness <= 0){
				Util.lose('happiness', this)
			}
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
				self.stepTime()
			}
		})(this),1000)

		this.registry.events.on('changedata-balance', function(){
			if(this.registry.values.balance <= 0){this.moneyBar.emit('broke', this)
				this.moneyBar.updateBalance()}
			else{this.moneyBar.updateBalance()}
		}, this)

		this.moneyBar.on('broke', function(scene){
			// clearInterval(biller)
			// Util.lose('broke', scene) //Uncomment for lose
		}, this)

	}

	initPowerIndicator(x, y, power, gen){
		const indic = new PowerIndicator(this, x, y, power, gen)
		this.add.existing(indic)
		return indic
	}

	initBalance(amount){
		var moneyBar = new MoneyBar(this, 90, 39, startingBalance)
		this.add.existing(moneyBar)
		return moneyBar
	}

	stepTime(){
		if(this.bill<10){
			this.bill += 1
		}
		else {
			this.registry.values.balance -= this.accumulatedBill - this.income
			this.oldPol = this.registry.values.pollution
			this.registry.values.pollution = this.decayPollution(this.accumulatedPollution)
			this.polbar.adjustBar(this.registry.values.pollution-this.oldPol)
			if(this.registry.values.pollution > 100){
				this.registry.values.happiness -= 3
				this.happybar.adjustBar(-3)
			}
			this.accumulatedPollution = 0
			this.accumulatedBill = 0
			this.bill = 1
		}
		this.accumulatedBill += this.registry.values.power*powerCost
		for(var i = 0; i < Util.genKeys.length; i++){
			this.accumulatedBill += Util.genCost[i] * this.registry.get(Util.genKeys[i])
			this.accumulatedPollution += Util.genPollute[i] * this.registry.get(Util.genKeys[i])
		}

		this.billTimer.clear()
		this.billTimer.fillStyle(0xffffff,1)
		this.billTimer.fillRect(26,54+(102-10*this.bill),8,10*this.bill)
	}
	
	decayPollution(pollutionToAdd){
		return this.registry.values.pollution * 0.75 + pollutionToAdd
	}

	initstorage(){
		this.storage = new StorageBox(this, 600-20, storagin, 128, 260)

		this.storageScroll = new Scrollbar(this, this.storage, true, true, "track", "bar", {'duration': 300, 'ease': Phaser.Math.Easing.Quadratic.Out})
		Phaser.Display.Align.To.RightCenter(this.storageScroll, this.storage, 128 + 2, 0)
		
		this.storage.setVisible(false)
		this.storage.active = false
		this.storageScroll.setVisible(false)
		this.storageScroll.active = false
	}
	initshop(){
		this.shop = new ShopBox(this, 50, storagin, 128, 260)

		this.shopScroll = new Scrollbar(this, this.shop, true, true, "track", "bar", {'duration': 300, 'ease': Phaser.Math.Easing.Quadratic.Out})
		Phaser.Display.Align.To.RightCenter(this.shopScroll, this.shop, 128 + 2, 0)
		
		this.shop.setVisible(false)
		this.shop.active = false
		this.shopScroll.setVisible(false)
		this.shopScroll.active = false
	}
	initfurniture(){
		this.furniture = new FurnitureBox(this, 600-84, storagin, 128, 260)

		this.furnitureScroll = new Scrollbar(this, this.furniture, true, true, "track", "bar", {'duration': 300, 'ease': Phaser.Math.Easing.Quadratic.Out})
		Phaser.Display.Align.To.RightCenter(this.furnitureScroll, this.furniture, 128 + 2, 0)
		
		this.furniture.setVisible(false)
		this.furniture.active = false
		this.furnitureScroll.setVisible(false)
		this.furnitureScroll.active = false
	}

	update(){
		//this.uiplacer.text = `${this.input.activePointer.worldX}, ${this.input.activePointer.worldY}`
		if(this.registry.values.balance < 0){
			this.moneyBar.setColor('red')
		} else {
			this.moneyBar.setColor('black')
		}
	}
}
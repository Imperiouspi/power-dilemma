import Phaser from 'phaser'
import PowerIndicator from '../ui/PowerIndicator'
import MoneyBar from '../ui/MoneyBar'
import LoseScene from '../scenes/LoseScene'
import Util from '../Util'
import StorageBox from '../ui/StorageBox'
import ShopBox from '../ui/ShopBox'
import {Scrollbar} from 'phaser-ui-tools'
import {Viewport} from 'phaser-ui-tools'
import {Column} from 'phaser-ui-tools'
import Button from '../ui/Button'

const startingBalance = 10000.00
const powerCost = 1
var biller
var storageOrigin = 225

const Random = Phaser.Math.Between;

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
		this.load.image('mainscreen', 'assets/Main Screen2.png')
		this.load.image('mainscreen_icons', 'assets/Main Screen3.png')
		this.load.image('pollution-bar', 'assets/Main Screen4.png')
		this.load.image('happiness-bar', 'assets/Main Screen5.png')
		
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
		this.uiplacer = this.add.text(400,300, `${this.input.activePointer.x}, ${this.input.activePointer.y}`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
		
		//Main UI
		this.add.image(400, 300, 'mainscreen')
		this.add.image(400, 300, 'mainscreen_icons').setDepth(2)
		this.add.image(400, 300, 'pollution-bar').setDepth(1)
		this.add.image(400, 300, 'happiness-bar').setDepth(1)

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
		this.initstorage()
		var storageButton = new Button(this, 575, 515, 'storageicon', function(){
			console.log('open furniture')
		}, this)
		this.add.existing(storageButton)

		for (var i = Util.Objects.length - 1; i >= 0; i--) {
			this.registry.set(Util.Objects[i], '1')
		}

		for (var i = Util.Objects.length - 1; i >= 0; i--) {
			var eventLabel = `changedata-${Util.Objects[i]}`
			this.registry.events.on(eventLabel, function(){
				this.storage.update(this.storage.children[0].children)
			}, this)
		}

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
			if(this.registry.values.balance <= 0){this.moneyBar.emit('broke', this)
				this.moneyBar.updateBalance()}
			else{this.moneyBar.updateBalance()}
		}, this)

		this.moneyBar.on('broke', function(scene){
			console.log('broke')
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
		this.storage = new StorageBox(this, 600-50, storageOrigin, 128, 260)

		this.storageScroll = new Scrollbar(this, this.storage, true, true, "track", "bar", {'duration': 300, 'ease': Phaser.Math.Easing.Quadratic.Out})
		Phaser.Display.Align.To.RightCenter(this.storageScroll, this.storage, 128 + 2, 0)
		
		this.storage.setVisible(false)
		this.storage.active = false
		this.storageScroll.setVisible(false)
		this.storageScroll.active = false
	}
	initshop(){
		this.shop = new ShopBox(this, 50, storageOrigin, 128, 260)

		this.shopScroll = new Scrollbar(this, this.shop, true, true, "track", "bar", {'duration': 300, 'ease': Phaser.Math.Easing.Quadratic.Out})
		Phaser.Display.Align.To.RightCenter(this.shopScroll, this.shop, 128 + 2, 0)
		
		this.shop.setVisible(false)
		this.shop.active = false
		this.shopScroll.setVisible(false)
		this.shopScroll.active = false
	}

	update(){
		this.uiplacer.text = `${this.input.activePointer.worldX}, ${this.input.activePointer.worldY}`
		if(this.registry.values.balance < 0){
			this.moneyBar.setColor('red')
		} else {
			this.moneyBar.setColor('black')
		}
	}
}
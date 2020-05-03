import Phaser from 'phaser'
import PowerIndicator from '../ui/PowerIndicator'
import MoneyBar from '../ui/MoneyBar'
import LoseScene from '../scenes/LoseScene'
import Util from '../Util'
import {Viewport} from 'phaser-ui-tools'
import {Column} from 'phaser-ui-tools'
import {Scrollbar} from 'phaser-ui-tools'

const startingBalance = 1000
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
		this.storeon = false
	}

	preload()
	{
		this.load.image('powerbar', 'assets/demo/powerbar.png')
		this.load.image('power-pip', 'assets/demo/power-pip.png')
		this.load.image('track', 'assets/demo/track.png')
		this.load.image('crate', 'assets/demo/crate.png')
		this.load.spritesheet('bar', 
			'assets/demo/bar.png',
			{ frameWidth: 22, frameHeight: 44 })
	}

	create()
	{
		//storage
		this.storageButton = this.add.image(800-100, 600-100, 'crate')
		this.storageButton.setInteractive()
		this.initstorage()
		this.storageButton.on('pointerdown', function(pointer){
			this.storeon = !this.storeon
			this.storage.setVisible(this.storeon)
			this.storage.active = this.storeon
			this.storageScroll.setVisible(this.storeon)
			this.storageScroll.active = this.storeon
		}, this)

		//Power
		this.powerIndicator = this.initPowerIndicator(130, 16, 0)

		this.registry.events.on('changedata-power', function(){
			this.powerIndicator.updateBar()
		}, this)

		//Money
		this.moneyBar = this.initBalance(startingBalance)
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

	initPowerIndicator(x, y, power){
		const indic = new PowerIndicator(this, x, y, power)
		this.add.existing(indic)
		for (var i = indic.pips.length - 1; i >= 0; i--) {
			this.add.existing(indic.pips[i])
		};

		return indic
	}

	initBalance(amount){
		var moneyBar = new MoneyBar(this, 20, 30, startingBalance)
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
		this.storage = new Viewport(this, this.storageButton.x-50, this.storageButton.y - 300, 64, 260)
		var column = new Column(this)
		this.storage.addNode(column)

		var store_ob_1 = this.add.image(0,0, 'wall')
		var store_ob_2 = this.add.image(0,0, 'appliance')
		var store_ob_3 = this.add.image(0,0, 'appliance')
		var store_ob_4 = this.add.image(0,0, 'appliance')
		var store_ob_5 = this.add.image(0,0, 'appliance')
		var store_ob_6 = this.add.image(0,0, 'appliance')

		store_ob_1.setInteractive()
		store_ob_2.setInteractive()
		store_ob_2.tint = 0xff00
		store_ob_3.setInteractive()
		store_ob_3.tint = 0xf0f0f0
		store_ob_4.setInteractive()
		store_ob_4.tint = 0x0fff00
		store_ob_5.setInteractive()
		store_ob_5.tint = 0x0000ff
		store_ob_6.setInteractive()
		store_ob_6.tint = 0xdddddd

		store_ob_1.on('pointerdown', function(){
			this.events.emit('placeevent', 'appliance')
			this.registry.values.mode = 'place'
		}, this)
		store_ob_2.on('pointerdown', function(){
			this.events.emit('placeevent', 'appliance')
			this.registry.values.mode = 'place'
		}, this)
		store_ob_3.on('pointerdown', function(){
			this.events.emit('placeevent', 'appliance')
			this.registry.values.mode = 'place'
		}, this)
		store_ob_4.on('pointerdown', function(){
			this.events.emit('placeevent', 'appliance')
			this.registry.values.mode = 'place'
		}, this)
		store_ob_5.on('pointerdown', function(){
			this.events.emit('placeevent', 'appliance')
			this.registry.values.mode = 'place'
		}, this)
		store_ob_6.on('pointerdown', function(){
			this.events.emit('placeevent', 'appliance')
			this.registry.values.mode = 'place'
		}, this)

		column.addNode(store_ob_1)
		column.addNode(store_ob_2)
		column.addNode(store_ob_3)
		column.addNode(store_ob_4)
		column.addNode(store_ob_5)
		column.addNode(store_ob_6)

		this.storageScroll = new Scrollbar(this, this.storage, true, true, "track", "bar", {'duration': 300, 'ease': Phaser.Math.Easing.Quadratic.Out})
		Phaser.Display.Align.To.RightCenter(this.storageScroll, this.storage, 64 + 2, 0)
		
		this.storage.setVisible(false)
		this.storage.active = false
		this.storageScroll.setVisible(false)
		this.storageScroll.active = false
	}
}

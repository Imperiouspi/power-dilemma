import Phaser from 'phaser'
import PowerIndicator from '../ui/PowerIndicator'
import MoneyBar from '../ui/MoneyBar'
import LoseScene from '../scenes/LoseScene'
import Util from '../Util'
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
	}

	preload()
	{
		this.load.image('powerbar', 'assets/demo/powerbar.png')
		this.load.image('power-pip', 'assets/demo/power-pip.png')
	}

	create()
	{
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
}

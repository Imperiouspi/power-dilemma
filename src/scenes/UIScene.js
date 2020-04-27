import Phaser from 'phaser'
import PowerIndicator from '../ui/PowerIndicator'

export default class UIScene extends Phaser.Scene
{
	constructor()
	{
		super({key: 'ui-scene', active: true})
		this.powerIndicator = undefined
	}

	preload()
	{
		this.load.image('powerbar', 'assets/demo/PowerBar.png')
		this.load.image('pip', 'assets/demo/PowerPip.png')
	}

	create()
	{
		this.powerIndicator = this.initPowerIndicator(130, 16, 0)

		this.registry.events.on('changedata-power', function(){
			this.powerIndicator.updatePowerPips()
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
}

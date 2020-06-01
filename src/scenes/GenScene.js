import Phaser from 'phaser'
import Button from '../ui/Button'
import Util from '../Util'
export default class GenScene extends Phaser.Scene
{
	constructor()
	{
		super({key: 'gen-scene', active: false})
	}

	preload(){
		this.load.image('gen', 'assets/Generation Screen.png')
		this.load.spritesheet('plus', 'assets/Icon-Plus.png',
			{frameWidth: 26, frameHeight: 26})
		this.load.spritesheet('minus', 'assets/Icon-Minus.png',
			{frameWidth: 26, frameHeight: 26})
	}

	create(){
		var bg = this.add.image(400, 300, 'gen')
		this.solarText = this.createGenText('solar', 429, 170)
		this.coalText = this.createGenText('coal', 157, 431)
		this.windText = this.createGenText('wind', 104, 144)
		this.hydroText = this.createGenText('hydro', 502, 464)

		this.add.existing(new Phaser.GameObjects.Rectangle(this, 150, 535, 64, 64, 0xbbfebd, 1))
		var genButton = new Button(this, 150, 535, 'genicon', function(){
			this.scene.scene.switch('ui-scene')
		})
		this.add.existing(genButton)
	}

	update(){
		this.coalText.text = this.registry.get('coal')
		this.hydroText.text = this.registry.get('hydro')
		this.solarText.text = this.registry.get('solar')
		this.windText.text = this.registry.get('wind')
	}

	createGenText(key, x, y){
		var radius = 32
		var drop = 5
		var plus = new Button(this, x+radius, y+drop, 'plus', function(){
			if(this.scene.registry.get(key) < Util.genMax[Util.genIndex(key)]){
				this.scene.registry.set('generated', this.scene.registry.values.generated + Util.genStrength[Util.genIndex(key)])
				this.scene.registry.set(key, this.scene.registry.get(key) + 1)
			}
		})
		this.add.existing(plus)

		var minus = new Button(this, x-radius, y+drop, 'minus', function(){
			if(this.scene.registry.get(key) > 0){
				this.scene.registry.set('generated', this.scene.registry.values.generated - Util.genStrength[Util.genIndex(key)])
				this.scene.registry.set(key, this.scene.registry.get(key) - 1)
			}

		})
		this.add.existing(minus)

		this.add.text(x-6-5*key.length, y-30, Util.capitalize(key), { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: 'black', fontSize: "15pt"})

		return this.add.text(x-6, y-6, this.registry.get(key), { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: 'black'})
	}
}
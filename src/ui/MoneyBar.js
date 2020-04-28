import Phase from 'phaser'

const formatBalance = (balance) => `Balance: $${balance}`

export default class MoneyBar extends Phaser.GameObjects.Text {
	constructor(scene, x, y, balance) {
		super(scene, x, y, formatBalance(balance), {fontSize: '20px', fill: '#000'})
		this.scene = scene
		this.x = x
		this.y = y
		this.scene.registry.set('balance', balance)
	}

	setBalance(balance){
		this.scene.registry.set('balance', balance)
		this.updateBalance()
	}

	updateBalance() {
		this.setText(formatBalance(this.scene.registry.values.balance.toFixed(2)))
	}
}
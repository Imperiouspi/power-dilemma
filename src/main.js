import Phaser from 'phaser'
import RoomScene from './scenes/RoomScene'
import UIScene from './scenes/UIScene'
import LoseScene from './scenes/LoseScene'
import GenScene from './scenes/GenScene'
import StartScene from './scenes/StartScene'

const config = {
	type: Phaser.AUTO,
	mode: Phaser.Scale.FIT,
	width: 800,
	height: 600,
	background: 0x00ff00,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [StartScene, RoomScene, GenScene, UIScene, LoseScene]
}

export default new Phaser.Game(config)

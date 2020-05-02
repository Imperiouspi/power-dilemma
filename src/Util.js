export default class Util{
	static gridify(coord){
		return Util.tile_size*Math.round((coord-Util.tile_size/2)/Util.tile_size)+Util.tile_size/2
	}

	static lose(condition, scene){
		scene.scene.start('lose-scene')
		scene.registry.set('lose', 'broke')
		scene.scene.sleep('room-scene')
		scene.scene.sleep('ui-scene')
	}
}

Util.tile_size = 64
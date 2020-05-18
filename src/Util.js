export default class Util{
	static gridify(coord){
		return Util.tile_size*Math.round((coord-Util.tile_size/2)/Util.tile_size)+Util.tile_size/2
	}
	static wallify(coord){
		return Util.tile_size*Math.round((coord)/Util.tile_size)
	}
	// 2
	//3	1
	// 4
	static getAngle(x1, y1, x2, y2){
		var ang = (Math.atan2(y2-y1, x2-x1)+Math.PI)*180/Math.PI

		if(ang > 45 && ang <= 135){
			return 0
		} else if(ang > 225 && ang <= 315){
			return Math.PI
		} else if(ang > 135 && ang <= 225){
			return Math.PI/2
		} else if ((ang > 315 && ang <= 360) || (ang > 0 && ang <= 45)){
			return Math.PI*3/2
		} else {
			console.log(ang)
			return Math.PI/4
		}
	}
	static distance(x1, y1, x2, y2){
		return Math.sqrt((x2-x1)**2 + (y2-y1)**2)
	}
	static lose(condition, scene){
		scene.scene.start('lose-scene')
		scene.registry.set('lose', 'broke')
		scene.scene.sleep('room-scene')
		scene.scene.sleep('ui-scene')
	}

	static threshold(a,b,val){
		return (Math.abs(b-a)<val)
	}
}

Util.tile_size = 64
Util.ApplianceKeys = [
	'computer',
	'fridge',
	'lamp',
	'microwave',
	'oven',
	'toaster',
	'tv'
]
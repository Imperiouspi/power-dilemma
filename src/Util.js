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

	static getApplianceCost(key){
		return Util.ApplianceKeys.indexOf(key) != -1 ? Util.ApplianceCost[Util.ApplianceKeys.indexOf(key)] : 10000
	}
}

Util.tile_size = 64
Util.ApplianceKeys = [
	'computer',
	'dishwasher',
	'dryer',
	'fan',
	'fridge',
	'lamp',
	'microwave',
	'oven',
	'stereo',
	'toaster',
	'tv',
	'vacuum'
]

Util.ApplianceCost = [
	700,400,400,85,1200,100,230,750,450,90,600,380
]

Util.ApplianceEnergy = [
	7,10,10,4,12,4,8,9,6,4,7,5
]

Util.Walls = [
	'wood'
]

Util.Objects = [
	'computer',
	'dishwasher',
	'dryer',
	'fan',
	'fridge',
	'lamp',
	'microwave',
	'oven',
	'stereo',
	'toaster',
	'tv',
	'vacuum',
	'woodwall'
]
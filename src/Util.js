export default class Util{
	static gridify(coord){
		return Util.tile_size*Math.round((coord-Util.tile_size/2)/Util.tile_size)+Util.tile_size/2
	}
}

Util.tile_size = 64
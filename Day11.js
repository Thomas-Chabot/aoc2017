class Player {
	constructor () {
		this._position = {
			x: 0,
			y: 0
		};
	}
	
	get position(){ return this._position; }
	
	north(){ this._move (0, 1); }
	south(){ this._move (0, -1); }
	east() { this._move (1, 0); }
	west() { this._move (-1, 0); }
	
	northeast(){ this._move (0.5, 0.5); }
	northwest(){ this._move (-0.5, 0.5); }
	southeast(){ this._move (0.5, -0.5); }
	southwest(){ this._move (-0.5, -0.5); }
	
	_move(x, y){
		this._position.x += x;
		this._position.y += y;
	}
}

class Grid {
	constructor(){
		this._player = new Player();
		this._furthest = 0;
	}
	
	move (movement){
		switch (movement.toLowerCase()) {
			case "se":
				this._player.southeast();
				break;
			case "sw":
				this._player.southwest();
				break;
			case "ne":
				this._player.northeast();
				break;
			case "nw":
				this._player.northwest();
				break;
			case "n":
				this._player.north();
				break;
			case "s":
				this._player.south();
				break;
			case "e":
				this._player.east();
				break;
			case "w":
				this._player.west();
				break;
		}
		
		this._checkFurthest();
	}

	get position(){ return this._player.position; }
	
	get steps(){
		var pos = this.position;
		return Math.abs (pos.x) + Math.abs (pos.y);
	}
	
	get furthest(){ return this._furthest; }
	
	_checkFurthest(){
		var steps = this.steps;
		if (steps > this._furthest)
			this._furthest = steps;
	}
}
class UI {
	constructor (path) {
		this._path = path.replace(/\n/g, "").split(",");
		this._grid = new Grid();
	}
	
	get position(){ return this._grid.position; }
	get furthest(){ return this._grid.furthest; }
	get steps(){ return this._grid.steps; }
	
	run(){
		for (var move of this._path)
			this._grid.move (move);
	}
	
}

var ui = new UI(document.body.innerText);
ui.run();
console.log (`Part 1: ${ui.steps}`);
console.log (`Part 2: ${ui.furthest}`);

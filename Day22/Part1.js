class Direction {
	static get directions(){ return [Direction.Up, Direction.Left, Direction.Down, Direction.Right]; }
	static get Up(){ return "up"; }
	static get Left(){ return "left"; }
	static get Right(){ return "right"; }
	static get Down(){ return "down"; }
	
	constructor (dir) {
		this._directionIndex = this._toIndex (dir);
	}
	
	get direction(){ return Direction.directions [this._directionIndex]; }
	
	turnLeft(){
		this._turn (1);
	}
	
	turnRight(){
		this._turn (-1);
	}
	
	_turn(offset){
		this._directionIndex = (this._directionIndex + offset) % Direction.directions.length;
		if (this._directionIndex < 0)
			this._directionIndex += Direction.directions.length;
	}
	
	_toIndex (direction) {
		var int = parseInt (direction);
		if (!isNaN (int)) return int;
		
		return Direction.directions.indexOf (direction);
	}
}

class Position {
	constructor ([y, x]) {
		this._pos = {x, y};
	}
	
	up(){ this._pos.y --; }
	down(){ this._pos.y ++; }
	left(){ this._pos.x --; }
	right(){ this._pos.x ++; }
	
	get x(){ return this._pos.x; }
	get y(){ return this._pos.y; }
	get pos(){ return this._pos; }
}

class GridObject {
	constructor (position, direction) {
		if (!position) position = [0, 0];
		if (!direction) direction = Direction.Up;
		
		// if we have a {x: x, y: y} object, should be an array [y, x]
		if (position.y !== undefined)
			position = [position.y, position.x];
		
		this._position = new Position (position);
		this._direction = new Direction (direction);
	}
	
	get position(){ return this._position.pos; }
	get direction(){ return this._direction.direction; }
	
	_turnLeft () {
		this._direction.turnLeft ();
		return this;
	}
	_turnRight() {
		this._direction.turnRight ();
		return this;
	}

	_proceed () {
		switch (this._direction.direction) {
			case Direction.Up:
				this._position.up ();
				break;
			case Direction.Down:
				this._position.down ();
				break;
			case Direction.Left:
				this._position.left ();
				break;
			case Direction.Right:
				this._position.right ();
				break;
		}
	}
}

class Node extends GridObject {
	constructor (opts) {
		super (opts.position, opts.direction);
		this._infected  = opts.isInfected;
	}
	
	get infected(){ return this._infected; }
	
	toggleInfected(){
		this._infected = !this._infected;
		
		// cascading
		return this;
	}
}

class VirusCarrier extends GridObject {
	constructor (position, direction) {
		super (position, direction);
		
		this._infections = 0;
	}
	
	burst(curNode) {
		this._turn(curNode);
		this._infect(curNode);
		this._proceed();
	}

	get infectionsCaused(){ return this._infections; }
	
	_turn (curNode) {
		if (curNode.infected)
			this._turnRight();
		else
			this._turnLeft();
	}

	_infect (curNode) {
		//console.log (`Position: [${this.position.y}, ${this.position.x}], infecting ${curNode} : now ${!curNode.infected}`);
		
		curNode.toggleInfected();
		if (curNode.infected)
			this._infections ++;
	}
}

class Grid {
	constructor (virus) {
		this._elements = { };
		
		this._dimensionsX = {from: 0, to: 0};
		this._dimensionsY = {from: 0, to: 0};
		
		this._virus       = virus;
	}
	
	getAt (position) {
		if (!this._elements [position.y]) return null;
		return this._elements [position.y] [position.x]|| null;
	}
	
	add (e) {
		var position = e.position;
		
		if (!this._elements [position.y])
			this._elements [position.y] = { };
		
		this._elements [position.y] [position.x] = e;
		
		this._updateDimensions ([position.x, position.y]);
	}
	
	
	toString(){
		var s = "";
		
		var virus = this._virus.position;
		this._eachPosition (this._dimensionsY, (y)=>{
			this._eachPosition (this._dimensionsX, (x)=>{
				var charBefore, charAfter;
				charBefore = charAfter = " ";
				if (x === virus.x && y === virus.y) {
					charBefore = "[";
					charAfter  = "]";
				}
			
				s += charBefore + this._posToString ({y, x}) + charAfter;
			});
			s += "\n";
		});
		
		return s;
	}
	
	toArray () {
		return this._toArray (this._elements, (row) => {
			return this._toArray (row, (e) => e);
		});
	}
	
	_eachPosition (dimensions, f) {
		for (var i = dimensions.from; i <= dimensions.to; i++)
			f (i);
	}
	
	_posToString (position) {
		var node = this.getAt (position);
		if (!node) return " ";
		
		if (node.infected) return "#";
		return ".";
	}
	
	_toArray (elements, f) {
		var sortedKeys = this._sortKeys (elements);
		var arr        = [ ];
		for (var i = 0; i < sortedKeys.length; i++) {
			arr.push (f (elements [sortedKeys [i]]));
		}
		return arr;
	}
	_sortKeys (elements) {
		return Object.keys (elements).sort ((a, b)=>parseInt (a) - parseInt (b));
	}
	
	_updateDimensions ([x, y]) {
		this._update (this._dimensionsX, x);
		this._update (this._dimensionsY, y);
	}
	_update (dimensions, pos) {
		if (dimensions.from > pos)
			dimensions.from = pos;
		
		if (dimensions.to < pos)
			dimensions.to = pos;
	}
}

class Control {
	constructor(){
		this._virus = new VirusCarrier();
		this._grid = new Grid(this._virus);
	}
	
	get infectionsCaused(){ return this._virus.infectionsCaused; }
	get stringified(){ return this._grid.toString(); }
	
	next(){
		var element = this._grid.getAt (this._virus.position);
		if (!element)
			element = this._createNode (this._virus.position, false);
			
		this._virus.burst (element);
	}
	
	add (position, infected) {
		this._createNode (position, infected);
	}
	
	_createNode (position, infected) {
		var node = new Node ({
			isInfected: infected,
			position: position
		});
		
		this._grid.add (node);
		return node;
	}
}


class UserInterface {
	constructor (input, opts) {
		if (!opts) opts = { };
		
		this._inputRows = input.split ("\n");
		this._control   = new Control();
			
		this._debug = opts.debug;
		
		this._init ();
	}
	
	get infectionsCaused(){ return this._control.infectionsCaused; }
	
	run (nTimes) {
		for (var i = 0; i < nTimes; i++) {
			this._control.next ();
			
			this._logDebug (this._control.stringified, "\n\n");
		}
	}
	
	_logDebug (...args) {
		if (this._debug)
			console.log (...args);
	}
	
	_init () {
		var middleRow = this._getMiddleIndex (this._inputRows);
		for (var y = 0; y < this._inputRows.length; y++) {
			this._initRow (this._inputRows [y], this._positionFromIndex (y, middleRow));
		}
	}
	_initRow (row, yPosition) {
		var row = row.split ("");
		var middleIndex = this._getMiddleIndex (row);
		
		for (var x = 0; x < row.length; x++) {
			this._initNode (row [x], [yPosition, this._positionFromIndex (x, middleIndex)]);
		}
	}
	_initNode (char, position) {
		this._control.add (position, this._isInfected (char));
	}
	
	_positionFromIndex (index, middle) {
		return index - middle;
	}
	_getMiddleIndex (row) {
		// note: -1 because starts from 0. ex. 0, 1, 2 => length is 3, middle is 1
		return (row.length - 1) / 2;
	}
	
	_isInfected (char) {
		return char === "#";
	}
}

var string = document.body.innerText.replace(/\n$/, "");
var ui = new UserInterface (string, {debug: false});
ui.run (10000);
console.log (ui.infectionsCaused);

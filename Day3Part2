class Spiral {
	// constructor
	constructor(){
		this._resetGrid ();
		
		this._checkVal = null;
		
		this._larger = [ ];
		this._found = false;
	}
	
	/* --- Public Methods --- */
	// findLarger (x : int) : int => Returns the next largest int in the spiral from x
	findLarger (x) {
		this._checkVal = x;
		this._found = false;
		this._larger = [ ];
		
		this._resetGrid();
		
		while (!this._found)
			this.next ();
			
		this._larger.sort((a,b)=>{return a-b;});
		return this._larger [0];
	}

	// next () : Spiral => Creates the next loop in the spiral. Returns the spiral for cascading
	next () {
		/* note: the loop follows the pattern
		 *   -> 1
		 *   ^  1 + 2x
		 *   <- 2(x + 1)
		 *   v  2(x + 1)
		 *   -> 2(x + 1)
		 *
		 *
		 *  starting from (x, -x)
		 */
		 
		var s = this._spirals;
		var [x, y] = [s + 1, -s];
		this._init (x, y);
		
		for (var i = 0; i < 2 * s + 1; i++){
			[x, y] = this._init (x, y + 1);
		}
		for (var i = 0; i < 2 * (s + 1); i++){
			[x, y] = this._init (x - 1, y);
		}
		for (var i = 0; i < 2 * (s + 1); i++){
			[x, y] = this._init (x, y - 1);
		}
		for (var i = 0; i < 2 * (s + 1); i++){
			[x, y] = this._init (x + 1, y);
		}
		
		this._spirals ++;
		return this;
	}

	
	/* --- Private Methods --- */
	// create a new value at given (x, y)
	_init (x, y) {
		var value = this._valueFrom (x, y);
		this._check (value);
		
		if (!this._grid [y])
			this._grid [y] = { };
			
		this._grid [y] [x] = value;
		return [x, y];
	}
	
	_valueFrom (x, y) {
		return this._value (x-1, y-1) + this._value(x-1, y) + this._value(x-1, y+1)
		      + this._value(x, y-1) + this._value(x, y) + this._value(x, y+1)
			  + this._value(x+1, y-1) + this._value(x+1, y) + this._value(x+1, y+1)
	}
	
	_value (x, y){
		var t = this._grid[y] && this._grid[y][x];
		return t || 0;
	}
	
	// check value (in case of findLarger)
	_check (value) {
		if (this._checkVal && value > this._checkVal){
			this._larger.push (value);
			this._found = true;
		}
	}
	
	// reset / initialize the grid
	_resetGrid(){
		this._grid = {
			0: {
				0: 1
			}
		};
		this._spirals = 0;
	}
}

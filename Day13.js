class Dict {
	constructor (classType, elements) {
		this._elements = elements || { };
		this._cType    = classType;
		this._addIndex = 0;
	}
	
	get (id) {
		return this._elements [id];
	}
	
	put (id, thing) {
		this._elements [id] = thing;
	}
	
	has (id){ return this._elements[id] !== undefined; }
	
	add() {
		var id = this._idOf (this._addIndex);
		
		while (this.has (id)) {
			this._addIndex ++;
			id = this._idOf (this._addIndex);
		}
		
		return this.get (id);
	}
	
	log (checkFunc) {
		this._ifEach (checkFunc, (...args)=>{
			console.log (...args);
		});
	}
	
	count (checkFunc){
		var total = 0;
		this._ifEach (checkFunc, ()=>{
			total++;
		});
		return total;
	}
	
	each (f) {
		for (var key in this._elements) {
			if (f (key, this._elements[key]) === false)
				return;
		}
	}
	
	_ifEach (checkFunc, f) {
		this.each ((...args)=>{
			if (checkFunc (...args)){
				f (...args);
			}
		});
	}
	
	_new (id) {
		var e = new this._cType (id);
		this._elements [id] = e;
		
		return e;
	}
	
	_idOf (addIndex){ return "gid" + addIndex; }
}

class Scanner {
	constructor (depth, range) {
		this._pos      = 0;
		this._movement = 1;
		
		this._depth = depth;
		this._range = range;
		
		
		this._cycle = this._calculateCycleSize();
	}
	
	get depth(){ return this._depth; }
	get severity(){ return this._depth * this._range; }
	
	caught (playerPosition) {
		// note: num movements is this pos - player start position, - 1 (because player moves first)
		var numMovements = (this.depth - playerPosition) - 1;
		
		return (this._getPos (numMovements)) === 0;
	}
	
	_getPos (numMovements) {
		return numMovements % this._cycle;
	}
	
	_calculateCycleSize () {
		// note: for 2 or fewer blocks, there's no cycle - ex. 1, 2, 1, 2, 1, 2.
		// for any 3 or greater, then the cycle appears: ex. 1, 2, 3, 2, 1 ==> would be 5 before getting back to 1.
		//   for every block added, this is an extra two steps: adding 4 would make 3 appear again, so + 2 (one for 4, one for 3).
		//   in the end, the formula becomes (x - 2) * 2 + 2 for x >= 3, x for x < 3
		
		if (this._range < 3)
			return this._range;
		
		return (this._range - 2) * 2 + 2;
	}
}

class Scanners {
	constructor(){
		this._scanners = new Dict();
	}
	
	addScanner(s){
		this._scanners.put (s.depth, s);
	}
	
	caught (depth) {
		var scanner = this._scanners.get (depth);
		if (!scanner) return [false, 0];
		
		return [scanner.caught (), scanner.severity];
	}
	
	each (f) {
		this._scanners.each ((depth, scanner)=>f (scanner));
	}
}

class Packet {
	constructor(){
		this._position = -1;
	}
	
	get position(){ return this._position; }
	set position(s){ this._position = s; }
}

class Control {
	constructor(end){
		this._scanners = new Scanners();
		this._packet   = new Packet(end);
		
		this._cost     = 0;
		this._caught   = false;
	}
	
	get cost(){ return this._cost; }
	set start(s){ this._packet.position = s; }
	
	addScanner (s) {
		this._scanners.addScanner (s);
	}
	
	run(){
		this._check ();
		return this._caught;
	}
	
	fewestWithoutGettingCaught(){
		this._packet.position = -1;
		
		while (this._isCaught)
			this.start = this._packet.position - 1;
		
		return (this._packet.position + 1) * -1;
	}
	
	get _isCaught(){
		var caught = false;
		this._scanners.each ((scanner)=>{
			if (scanner.caught (this._packet.position)) {
				caught = true;
				return false;
			}
		});
		
		return caught;
	}
	
	_check(){
		this._caught = false;
		this._cost   = 0;
		
		this._scanners.each ((scanner)=>{
			if (scanner.caught (this._packet.position)) {
				this._caught = true;
				this._cost  += scanner.severity;
			}
		});
	}
}

class UI {
	constructor(commands){
		this._commands = commands.split ("\n");
		this._control  = new Control();
		
		this._init ();
	}
	
	run(){ this._control.run(); }
	get fewestWithoutCatch(){ return this._control.fewestWithoutGettingCaught(); }
	
	get cost(){ return this._control.cost; }
	
	_init () {
		for (var command of this._commands){
			if (command === "") continue;
			
			this._add (command);
		}
	}
	
	_parse (command) {
		var [match, depth, range] = command.match(/([^:]+): (.*$)/);
		
		return [parseInt (depth), parseInt (range)];
	}
	
	_add (command) {
		var [depth, range] = this._parse (command);
		
		var scanner        = new Scanner (depth, range);
		this._control.addScanner (scanner);
		
		this._control.depth = depth;
	}
}

var strings = document.body.innerText;
var ui = new UI(strings);

// Part 1
ui.run ();
console.log (`Part 1: ${ui.cost}`);

// Part 2
console.log ("Part 2: [ please wait ... ]");
console.log (`Part 2: ${ui.fewestWithoutCatch}`);

// [ FROM DAY 12 ]
class Dict {
	constructor (classType) {
		this._elements = { };
		this._cType    = classType;
		this._addIndex = 0;
	}
	
	get (id) {
		if (this._elements [id])
			return this._elements [id];
		
		return this._new (id);
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
		for (var key in this._elements)
			f (key, this._elements[key]);
	}
	
	toString() {
		var s = "";
		this.each ((key, element)=>s += `${key}: ${element.toString()}\n`);
		return s;
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



// [ NEW CODE ]
class Register {
	constructor () {
		this._value = 0;
	}
	
	get value(){ return this._value; }
	set value(v){ this._value = v; }
	
	toString(){ return this._value; }
}

class Registers {
	constructor () {
		this._registers = new Dict(Register);
	}

	add (register, value) {
		this._operation (register, value, (v, value)=>v + value);
	}
	multiply (register, value) {
		this._operation (register, value, (v, value)=>v * value);
	}
	mod (register, value) {
		this._operation (register, value, (v, value)=>v % value);
	}
	set (register, value) {
		this._operation (register, value, (_, value)=>value);
	}
	get (register) {
		return this._operation (register, 0, (v)=>v);
	}
	
	toString(){ return this._registers.toString(); }
	
	_operation (registerId, registerValue, newValueFunc) {
		var regVal = this.getValue (registerValue);
	
		var register = this._registers.get (registerId);
		register.value = newValueFunc (register.value, regVal);
		
		return register.value;
	}
	
	getValue (value) {
		var int = parseInt (value);
		if (!isNaN (int)) return int;
		
		return this._registers.get (value).value;
	}
}

class View {
	constructor (instructions, options){
		if (!options) options = { };
		
		this._instructions = instructions.split("\n");
		this._registers    = new Registers();
		
		this._lastSound    = null;
		
		this._debug        = options.debug;
	}

	// various actions
	start(){
		var instructionIndex = 0;
		
		this._done = false;
		while (!this._done) {
			this._jump = 1;
			
			this._run (this._instructions [instructionIndex]);
			
			if (this._debug) {
				console.log (this._registers.toString());
				console.log (`Increasing instructionIndex by ${this._jump}, now at ${instructionIndex + this._jump}`);
			};
			
			instructionIndex += this._jump;
			
			if (this._debug)
				console.log (`Instruction index is now ${instructionIndex}`);
		}
	}
	
	get recoveredValue(){ return this._lastSound; }
	
	_run (instruction) {
		if (!instruction) return;
		
		var [instruction, variables] = this._parse (instruction);
		if (this._debug)
			console.log (`Instruction is ${instruction}, variables are ${variables}`);
		
		switch (instruction) {
			case 'snd':
				if (this._debug)
					console.log (`The last played sound is now ${this._registers.get (variables [0])}`);
				
				this._lastSound = this._registers.get(variables [0]);
				break;
			case 'set':
				this._operation ((registers)=>registers.set (variables [0], variables [1]));
				break;
			case 'add':
				this._operation ((registers)=>registers.add (variables [0], variables [1]));
				break;
			case 'mul':
				this._operation ((registers)=>registers.multiply (variables [0], variables [1]));
				break;
			case 'mod':
				this._operation ((registers)=>registers.mod (variables [0], variables [1]));
				break;
			case 'rcv':
				var value = this._registers.getValue (variables [0]);
				
				if (this._debug)
					console.log (`Recovering : ${value !== 0}, value is ${value}`);
					
				if (value !== 0)
					this._done = true;
				break;
			case 'jgz':
				console.log (variables);
				
				var checkVal = this._registers.getValue (variables [0]);
				var jumpVal  = this._registers.getValue (variables [1]);
				
				if (this._debug)
					console.log (`Jumping by ${jumpVal} if ${checkVal} > 0`);
			
				if (checkVal > 0)
					this._jump = jumpVal;
				break;
			default:
				console.error (`command not known: ${instruction}`);
				break;
		}
	}
	
	_operation (f) {
		f (this._registers);
		
		if (this._debug)
			console.log (this._registers.toString());
	}
	
	_parse (instruction) {
		var matched = instruction.match(/([^ ]+) (.*$)/);
		if (!matched) return [];
	
		var [_, instruction, variables] = matched;
		
		var resultVars = this._parseVariables (variables);
	
		return [instruction, resultVars];
	}
	_parseVariables (variables) {
		return variables.split(" ");
	}
}

var instructions = document.body.innerText;
var ui = new View(instructions, {debug: true});
ui.start();

console.log (ui.recoveredValue);

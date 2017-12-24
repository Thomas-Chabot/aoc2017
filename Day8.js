class Register {
	constructor(){
		this._value = 0;
	}
	
	inc (amount){
		this._value += amount;
	}
	
	dec (amount){
		this._value -= amount;
	}
	
	get value(){
		return this._value;
	}
	
	greaterThan(amnt){
		return this.value > amnt;
	}
	greaterOrEqual(amnt){
		return this.value >= amnt;
	}
	lessThan(amnt){
		return this.value < amnt;
	}
	lesserOrEqual(amnt){
		return this.value <= amnt;
	}
	equals(amnt){
		return this.value === amnt;
	}
	notEqual(amnt){
		return this.value !== amnt;
	}
}

class Registers {
	constructor(){
		this._registers = { };
	}
	
	get(register){
		if (!this._registers[register])
			this._registers [register] = new Register();
		return this._registers [register];
	}
	
	sort(){
		var result = Object.values (this._registers);
		result.sort ((a,b)=>{
			return b.value - a.value;
		});
		
		return result;
	}
}

class UI {
	constructor(strings){
		this._strings = strings;
		this._registers = new Registers();
		
		this._highestEver = 0;
		
		this._operate();
	}

	get sorted(){
		return this._registers.sort();
	}
	
	get largest(){
		return this.sorted[0].value;
	}
	get highestEver() {
		return this._highestEver;
	}
	
	// String parsing
	_parseString(str){
		return str.match(/([^ ]+) ([^ ]+) ([^ ]+) (.+)/);
	}
	_parseCondition(cond){
		return cond.match(/if ([^ ]+) ([^ ]+) (.+)/);
	}
	
	// Running
	_operate(){
		for (var i = 0; i < this._strings.length; i++){
			if (this._strings[i] === "") continue;
			this._run (this._strings [i]);
		}
		
		console.log ("all done");
	}
	
	// Individual Lines
	_run (line){
		var [_, register, type, amount, condition] = this._parseString (line);
		
		if (this._check (condition))
			this._performOperation (register, type, amount);
		
		this._checkHighestEver (register);
	}
	
	_check (condition){
		var [_, register, cond, amount] = this._parseCondition (condition);
		var register = this._registers.get (register);
		var amount   = parseInt (amount);
		
		switch (cond){
			case ">":
				return register.greaterThan (amount);
			case "<":
				return register.lessThan (amount);
			case ">=":
				return register.greaterOrEqual (amount);
			case "<=":
				return register.lesserOrEqual (amount);
			case "==":
				return register.equals (amount);
			case "!=":
				return register.notEqual (amount);
			default:
				console.error (`${cond} is an unknown condition`);
				return false;
		}
	}
	
	_performOperation (register, type, amount) {
		amount = parseInt (amount);
		
		var register = this._registers.get (register);
		switch (type){
			case "inc":
				return register.inc(amount);
			case "dec":
				return register.dec(amount);
			default:
				console.error (`${type} is an unknown type`);
				return;
		}
	}
	
	// storing highest value through process
	_checkHighestEver (register) {
		var register = this._registers.get (register);
		var value    = register && register.value;
		
		if (!value) console.error (`Could not find value for register ${register}`);
		if (value > this._highestEver)
			this._highestEver = value;
	}
}

var strings = document.body.innerText.split("\n");
var ui = new UI(strings);

console.log (`Part 1: ${ui.largest}`);
console.log (`Part 2: ${ui.highestEver}`);

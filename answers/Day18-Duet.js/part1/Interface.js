var Registers = require("./Registers.js").Registers;

class Interface {
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

module.exports.Interface = Interface;

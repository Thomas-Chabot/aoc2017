var structures = "../../../structures";
var Dict       = require (structures + "/Dict.js").Dict;

var RECEIVE_MESSAGE_REGISTER = 'X';

class Register {
	constructor (onSendMessage) {
		this._value = 0;
		this._onSendMessage = onSendMessage;
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

	getValue (value) {
		var int = parseInt (value);
		if (!isNaN (int)) return int;

		return this._registers.get (value).value;
	}

	sendMessage (m) {
		this._onSendMessage (this.getValue (m));
	}
	receiveMessage (m) {
		if (!this.waiting) return false;

		this.waiting = false;
		this.set (RECEIVE_MESSAGE_REGISTER, m);
	}

	_operation (registerId, registerValue, newValueFunc) {
		var regVal = this.getValue (registerValue);

		var register = this._registers.get (registerId);
		register.value = newValueFunc (register.value, regVal);

		return register.value;
	}
}

module.exports.Registers = Registers;

const START_A = 289;
const START_B = 629;

const FACTOR_A = 16807;
const FACTOR_B = 48271;

const MULT_A = 4;
const MULT_B = 8;

class BinaryCompare {
	constructor (numDigits) {
		this._digits = numDigits;
	}
	
	compare (num1, num2) {
		var n1 = this._toBinary (num1);
		var n2 = this._toBinary (num2);
		
		return this._compare (n1, n2);
	}
	
	_compare (binary1, binary2) {
		var b1 = this._slice (binary1);
		var b2 = this._slice (binary2);
		
		return b1 === b2;
	}
	
	_slice (value) {
		if (value.length < 16) {
			return "0".repeat (16 - value.length) + value;
		}
		
		return value.substr (value.length - this._digits, value.length);
	}

	_toBinary (value) {
		return parseInt(value).toString (2);
	}
}

class Generator {
	constructor (start, factor, mult) {
		this._prev   = start;
		this._start  = start;
		this._factor = factor;
		
		this._mult   = mult;
	}
	
	get next() {
		// Note: I'm not gonna risk it, but modding should be automatic (because ints)
		this._prev = ((this._prev * this._factor) % 2147483647);
		return this._prev;
	}
	
	get nextMultiple() {
		while (true) {
			var value = this.next;
			if (this._isMult (value))
				return value;
		}
	}
	
	reset(){
		this._prev = this._start;
	}
	
	_isMult (value) { return (value % this._mult) === 0; }
}

class Control {
	constructor (startA, startB, compareAmount) {
		this._genA = new Generator (startA, FACTOR_A, MULT_A);
		this._genB = new Generator (startB, FACTOR_B, MULT_B);
		
		this._comparator = new BinaryCompare (compareAmount);
		
		this._count = 0;
	}
	
	count (numTimes) {
		return this._doCount (this._checkNext, numTimes);
	}
	countMultiples (numTimes) {
		return this._doCount (this._checkMultiples, numTimes);
	}
	_doCount (f, numTimes) {
		this._reset();
		
		for (var i = 0; i < numTimes; i++)
			f.apply (this);
		
		return this._count;
	}

	_checkNext(){
		this._check (this._genA.next, this._genB.next);
	}
	_checkMultiples() {
		this._check (this._genA.nextMultiple, this._genB.nextMultiple);
	}
	_check (v1, v2) {
		if (this._comparator.compare (v1, v2))
			this._count ++;
	}
	
	_reset(){
		this._genA.reset();
		this._genB.reset();
		this._count = 0;
	}
}

var control = new Control(START_A, START_B, 16);
console.log (`Starting ... Please wait`);
console.log (`Part 1: ${control.count(40000000)}`);
console.log (`Part 2: ${control.countMultiples(5000000)}`);

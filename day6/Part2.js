class Bank {
	constructor(value){
		this._value = parseInt(value);
	}
	
	increment () {
		this._value ++;
	}
	
	reset() {
		this._value = 0;
	}
	
	get value(){ return this._value; }
	
	toString(){ return String(this._value); }
	valueOf(){ return this.value; }
}

class Banks {
	constructor(values){
		var banks = [ ];
		for (var i = 0; i < values.length; i++)
			banks.push (new Bank (values [i]));
		this._banks = banks;
	}
	
	redistribute(){
		var index = this._largestIndex;
		var value = this._banks [index].value;
		this._banks [index].reset();
		
		for (var i = 0; i < value; i++){
			index = this._cycle (index);
			this._banks [index].increment();
		}
	}
	
	toString(){
		var s = "";
		for (var bank in this._banks)
			s += this._banks[bank] + "|";
		return s;
	}
	
	_cycle(index){
		return ((index + 1) % this._banks.length);
	}
	
	get _largestIndex () {
		var index = 0;
		for (var i = 1; i < this._banks.length; i++)
			if (this._banks[i] > this._banks[index])
				index = i;
		return index;
	}
}

class Control {
	constructor(values){
		this._stored = [ ];
		this._banks  = new Banks(values);
	}
	
	findLoop () {
		var count = 0;
		while (true) {
			var index = this._check (count);
			if (index !== -1)
				return count - index;
				
			this._banks.redistribute ();
			count ++;
		}
	}
	
	_check (index) {
		var values = this._banks.toString ();
		if (this._stored [values] !== undefined)
			return this._stored [values];
		
		this._stored [values] = index;
		return -1;
	}
}

var values = document.body.innerText.replace(/\n/g, "").split("\t");
console.log(new Control (values).findLoop ());

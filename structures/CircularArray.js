class CircularArray {
	constructor (arr) {
		this._array = arr;
	}
	
	get (index){
		return this._array [ this._index (index) ];
	}
	set (index, value){
		this._array [this._index (index)] = value;
	}
	swap (index1, index2) {
		var item1 = this.get (index1);
		var item2 = this.get (index2);
		
		this.set (index1, item2);
		this.set (index2, item1);
	}
	
	between (start, end) {
		var res = [ ];
		for (var i = start; i < end; i++)
			res.push (this.get (i));
		return res;
	}
	
	reverse (start, end) {
		for (var i = 0; i < (end - start) / 2; i++)
			this.swap (start + i, end - i);
	}
	
	get array () {
		return this._array;
	}
	
	toString () {
		return this._array.join(",");
	}
	
	_index (i) {
		return i % this._array.length;
	}
}

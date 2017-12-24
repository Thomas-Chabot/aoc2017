class CircularArray {
	constructor (arr) {
		this._array = arr || [ ];
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

  add (index, value) {
    this._array.splice (this._index (index), 0, value);
  }
  addAfter (index, value) {
    this._array.splice (this._index (index) + 1, 0, value);
  }
  remove (index) {
    this._array.splice (this._index (index), 1);
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

  getIndex (i) { return this._index (i); }

  indexOf(v){ return this._array.indexOf (v); }
  
	toString () {
		return this._array.join(",");
	}

	_index (i) {
		return this._array.length ? i % this._array.length : 0;
	}
}

module.exports.CircularArray = CircularArray;

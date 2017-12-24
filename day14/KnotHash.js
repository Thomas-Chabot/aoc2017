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

class Model {
	constructor(){
		this._cur = 0;
		this._array = new CircularArray(this._range (0, 256));
		this._skip  = 0;
	}

	reverse (length) {
		this._array.reverse (this._cur, this._cur + length - 1);
		this._cur += length + this._skip;
		this._skip ++;
	}

	get array(){
		return this._array.array;
	}

	toString(){
		return this._array.toString();
	}

	_range (from, to) {
		var a = [ ];
		for (var i = from; i < to; i++)
			a.push (i);
		return a;
	}
}

class DenseHash {
	constructor (arr) {
		this._array = arr;
	}

	densify(){
		var result = [ ];
		for (var i = 0; i < this._array.length; i += 16){
			result.push (this._xor (i, i + 16));
		}
		return result;
	}

	_xor (from, to){
		var result = this._at (from);
		for (let i = from + 1; i < to; i++){
			result = result ^ this._at (i);
		}
		return result;
	}

	_at (i){ return this._array [i]; }
}

class Hexify {
	constructor(array){
		this._array = array;
	}

	run(){
		return this._hexify();
	}

	_hexify(){
		var resultString = "";
		for (var i in this._array){
			resultString += this._hex (this._array [i]);
		}
		return resultString;
	}

	_hex (num) {
		var n = num.toString (16);
		return (n.length === 1) ? "0" + n : n;
	}
}

class KnotHash {
	constructor (input){
		this._lengths = this._parse (input);
		this._model   = new Model();
	}

	round () {
		for (var i in this._lengths)
			this._next (this._lengths [i]);
		return this._model.array;
	}

	get (nRounds) {
		nRounds = nRounds || 64;
		for (let i = 0; i < nRounds; i++){
			this.round();
		}

		var densed = this._denseHash ();
		return this._hexify (densed);
	}

	// Parsing Input
	_parse (input) {
		input = input.trim();

		var lengths = this._convert (input);
		return lengths.concat ([17, 31, 73, 47, 23]);
	}

	_convert (string){
		var results = [ ];
		for (let index in string)
			results.push (string.charCodeAt (index));
		return results;
	}

	// Running a single operation
	_next (length) {
		length = parseInt (length);
		this._model.reverse (length);
	}

	// Conversions
	_denseHash () {
		var hash = new DenseHash (this._model.array);
		return hash.densify();
	}

	_hexify (array) {
		var hex = new Hexify(array);
		return hex.run ();
	}
}

module.exports.KnotHash = KnotHash;

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

module.exports.Dict = Dict;

class Cycle {
  constructor () {
    this._cycles = { };
  }

  add (key, index) {
    this._cycles [key] = index;
  }

  get (key){ return this._cycles [key]; }
  has (key) { return this._cycles [key] !== undefined; }
}

module.exports.Cycle = Cycle;

var CircularArray = require("./CircularArray.js").CircularArray;

class Spinlock {
  constructor(numberSteps, opts){
    if (!opts) opts = { };

    this._array = new CircularArray([0]);
    this._index = 0;

    this._steps    = numberSteps;

    this._debug    = opts.debug;
  }

  get last(){ return this._array.get (this._index + 1); }

  after (value) {
    return this._array.get (this._array.indexOf (value) + 1);
  }

  run(endValue){
    for (var i = 1; i <= endValue; i++){
      this._add (i);
    }
  }

  _add (value){
    this._index = this._array.getIndex (this._index + this._steps);
    this._array.addAfter (this._index, value);
    this._index ++;

    if (this._debug){
      console.log (this._array.toString())
    }
  }
}

var spinlock = new Spinlock(348);
//spinlock.run(2017);
//console.log (spinlock.last);

spinlock.run (50000000);
console.log (spinlock.after(0));

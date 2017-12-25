class ArrayDeque {
  constructor(opts){
    if (!opts) opts = { };

    this._front = [ ];
    this._back  = [ ];

    this._n = 0;

    this._debug = opts.debug;
  }

  get(index) {
    if (index >= this.size) return null;

    var [arr, index] = this._parse (index);
    return arr [index];
  }

  set (index, value) {
    if (index >= this.size) return false;

    var [arr, index] = this._parse (index);
    arr [index] = value;
  }

  add (value, index) {
    if (index === undefined) index = this.size;

    if (index > this.size) return false;

    var [arr, actualIndex] = this._parse (index);

    // special case: if it's in the front array, should add 1 (can add to end)
    if (arr === this._front)
      actualIndex ++;

    arr.splice (actualIndex, 0, value);

    this._n ++;

    //this._balance();
  }

  remove (index) {
    if (index >= this.size) return null;

    var [arr, actualIndex] = this._parse (index);
    var element = arr [actualIndex];

    arr.splice (actualIndex, 1);

    this._n --;
    this._balance();

    return element;
  }

  get size(){ return this._n; }

  indexOf (element) {
    var index = this._front.indexOf (element);
    if (index !== -1)
      return this._front.length - index - 1;

    index = this._back.indexOf (element);
    if (index !== -1)
      return index + this._front.length;

    return -1;
  }

  toString(){
    var front = [...this._front].reverse().join (", ") + " | ";
    var back  = [...this._back].join(", ");

    return front + back;
  }

  _balance() {
    if (this._front.length * 3 < this._back.length) {
      this._log (`BEFORE BALANCING [ FRONT ]: ${this.toString()}`);

      var newFront = [ ];
      var newBack  = [ ];

      var middle   = this.size / 2;

      newFront = this._back.slice (0, middle).reverse().concat (this._front);
      newBack  = this._back.slice (middle);

      this._front = newFront;
      this._back  = newBack;

      this._log (`AFTER BALANCING [ FRONT ]: ${this.toString()}`);
    } else if (this._back.length * 3 < this._front.length) {
      this._log (`BEFORE BALANCING [BACK]: ${this.toString()}`);
      var newFront = [ ];
      var newBack  = [ ];

      var middle   = this.size / 2;

      newFront = this._front.slice (middle);
      newBack  = this._front.slice (0, middle).reverse().concat (this._back);

      this._front = newFront;
      this._back  = newBack;

      this._log (`AFTER BALANCING [BACK]: ${this.toString()}`);
    }
  }

  _parse (index) {
    if (index < this._front.length)
      return [this._front, this._front.length - index - 1];

    return [this._back, index - this._front.length];
  }


  _log (debugMessage) {
    if (this._debug)
      console.log (debugMessage);
  }
}

/*
// Test Code
var q = new ArrayDeque ({debug: false});
var start = new Date().getTime ();

var n = 1000000;

for (var i = 0; i < 1000000; i++)
  q.add (i);

console.log (new Date().getTime() - start);

for (var i = 0; i < 1000000; i++)
  q.remove (0);

console.log (new Date().getTime() - start);

for (var i = 0; i < n; i++)
  q.add (0, i);

console.log (new Date().getTime() - start);


for (var i = 0; i < n; i++)
  q.remove (q.size - 1);

console.log (new Date().getTime() - start);*/

module.exports.ArrayDeque = ArrayDeque;

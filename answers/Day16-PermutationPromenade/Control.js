var Interface = require("./Interface.js").Interface;
var Cycles    = require("./Cycle.js").Cycle;

class Control {
  constructor(data, startChar, endChar){
    this._interface = new Interface(data, startChar, endChar);
    this._cycles    = new Cycles();

    this._values    = [ ];
  }

  run (numTimes) {
    var index  = 0;

    while (index < numTimes) {
      var value = this._interface.toString ();
      this._values [index] = value;

      // check if there's a cycle
      var cycle = this._checkCycle (value, index, numTimes);
      if (cycle)
        return cycle;

      this._next ();
      index++;
    }

    return this._interface.toString ();
  }

  _next () {
    this._interface.run ();
  }

  _checkCycle (value, index, numTimes) {
    var cycle = this._detectCycle (value, index)
    if (cycle !== -1)
      return this._getFromCycle (numTimes, cycle);
  }

  _getFromCycle (endResult, cycleCount) {
    var offset = endResult % cycleCount;
    return this._values [offset - 1];
  }

  _detectCycle (value, currentIndex) {
    if (this._cycles.has (value)) {
      var prevIndex = this._cycles.get (value);
      return currentIndex - prevIndex + 1;
    }

    this._cycles.add (value, currentIndex);
    return -1;
  }
}

module.exports.Control = Control;

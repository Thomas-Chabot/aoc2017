var structures = "../../structures";
var ArrayDeque = require (structures + "/ArrayDeque.js").ArrayDeque;

class Programs {
  constructor (startChar, endChar) {
    this._programs = new ArrayDeque ();

    this._init (startChar, endChar);
  }

  spin (numPrograms) {
    for (var i = 0; i < numPrograms; i++)
      this._programs.add (this._programs.remove (this._programs.size - 1), 0);
  }

  exchange (p1, p2) {
    var temp = this._programs.get (p1);
    this._programs.set (p1, this._programs.get (p2));
    this._programs.set (p2, temp);
  }

  partner (elementA, elementB) {
    var p1 = this._programs.indexOf (elementA);
    var p2 = this._programs.indexOf (elementB);

    this.exchange (p1, p2);
  }

  toString(){ return this._programs.join(""); }

  _init (startChar, endChar) {
    var charCode1 = startChar.charCodeAt (0);
    var charCode2 = endChar.charCodeAt (0);

    for (var i = charCode1; i <= charCode2; i++){
      var char = String.fromCharCode (i);
      this._programs.add (char);
    }
  }
}

module.exports.Programs = Programs;

var structures = "../../structures";
var Arrays = require(structures + "/Array-Help.js");

var Squares = require ("./Squares/Squares.js").Squares;
var Matches = require ("./Matches/Matches.js").Matches;

class Control {
  constructor (pattern) {
    this._rules   = new Matches ();
    this._pattern = Arrays.split2D(pattern, "/", "");
  }

  addRule (rule, result) {
    this._rules.addMatch (rule, result);
  }

  run () {
    var squares = new Squares (this._pattern);

    squares.match (this._rules);

    this._pattern = squares.build ();
  }

  toString(){ return Arrays.join2D(this._pattern, "\n", ""); }
}

module.exports.Control = Control;

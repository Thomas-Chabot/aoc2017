var structures = "../../../structures";
var Arrays = require(structures + "/Array-Help.js");

var Flips = require("./Flips.js").Flips;
var Rotations = require("./Rotations.js").Rotations;

class Matches {
  constructor(options){
    if (!options) options = { };
    this._matches = { };

    this._debug = options.debug;
  }

  match (pattern) {
    pattern = Arrays.join2D(pattern, "/", "");
    return this._matches [pattern];
  }

  addMatch (rule, result) {
    rule = Arrays.split2D(rule, "/", "");
    result = Arrays.split2D(result, "/", "");

    var matches = this._getAllMatches (rule);
    this._addRules (matches, result);
  }

  _addRules (rules, result) {
    for (var i in rules) {
      this._addRule (rules [i], result);
    }
  }
  _addRule (rule, result) {
    rule = Arrays.join2D (rule, "/", "");
    this._matches [rule] = result;
  }

  _getAllMatches (rule){
    return this._getRotations(rule).concat (this._getFlips (rule));
  }
  _getRotations (rule){
    var result = [ ];

    // 90 degree is rotated
    // 180 is a vertical flip (already handled)
    // 270 is a horizontally-flipped 90 degree
    // 360 is the rule itself

    var rotated = Rotations.Ninety (rule);
    result.push (rotated);
    this._log (`Rotated: ${rotated}`);

    result.push (Flips.horizontalFlip (rotated));
    this._log (`270 Degree: ${Flips.horizontalFlip (rotated)}`);

    result.push (rule);


    return result;
  }

  _getFlips (rule) {
    var result = [ ];

    result.push (Flips.horizontalFlip (rule));
    result.push (Flips.verticalFlip (rule));
    result.push (Flips.fullFlip (rule));

    this._log (`Horizontal Flip: ${result[0]}}`);
    this._log (`Vertical Flip: ${result[1]}`);
    this._log (`Full Flip: ${result[2]}`);

    return result;
  }


  _log(message) {
    if (this._debug)
      console.log (message);
  }
}

module.exports.Matches = Matches;

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
    if (!this._matches [pattern]){
      console.log ("No match found for ", pattern);
    //  console.log (this._matches);
    }
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

    var rotated1 = Rotations.Ninety (rule);
    var rotated2 = Rotations.OneEighty (rule);
    var rotated3 = Rotations.TwoSeventy (rule);

    result.push (rotated1);
    result.push (rotated2);
    result.push (rotated3);


    return result;
  }

  _getFlips (rule) {
    var result = [ ];

    var horizontalFlip = Flips.horizontalFlip (rule);
    var verticalFlip   = Flips.verticalFlip (rule);
    var fullFlip       = Flips.fullFlip (rule);

    result.push (horizontalFlip);
    result.push (verticalFlip);
    result.push (fullFlip);

    result = result.concat (this._getRotations (horizontalFlip));
    result = result.concat (this._getRotations (verticalFlip));
    result = result.concat (this._getRotations (fullFlip));


    return result;
  }


  _log(message) {
    if (this._debug)
      console.log (message);
  }
}

module.exports.Matches = Matches;

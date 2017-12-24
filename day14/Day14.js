var KnotHash = require("./KnotHash.js").KnotHash;
var Hex2Bin  = require("./Hex2Bin.js").parse;
var Regions  = require("./Regions.js").Regions;

// a few constants
const USED_SQUARE = '1';

const USED_SQUARE_REGEX = /1/g;
const FREE_SQUARE_REGEX = /0/g;

const CODE = "vbqugkhl"; // puzzle input here

// main interface
class Interface {
  constructor (code) {
    this._code = code;
    this._hashes = this._getHashes();
    this._regions = new Regions (this._hashes, USED_SQUARE);
  }

  get usedSquares(){ return this._hashes.match(USED_SQUARE_REGEX).length; }
  get freeSquares(){ return this._hashes.match(FREE_SQUARE_REGEX).length; }
  get numRegions(){ return this._regions.count (); }

  log(){
    console.log (this.toString ());
  }

  _getHashes () {
    var result = "";
    for (var i = 0; i < 128; i++){
      var codeHex = this._getCode (i);
      result += this._toBinary (codeHex) + "\n";
    }

    return result;
  }

  _getCode (index) {
    var hash = new KnotHash(this._code + "-" + index, true).get();
    return hash;
  }

  _toBinary (hex) {
    return Hex2Bin(hex);
  }

  toString() {
    return this._hashes.replace (USED_SQUARE_REGEX, "#").replace(FREE_SQUARE_REGEX, ".");
  }
}

// run & output results
var ui   = new Interface(code);

ui.log();
console.log (`Used: ${ui.usedSquares}`);
console.log (`Free: ${ui.freeSquares}`);
console.log (`Num Regions: ${ui.numRegions}`);

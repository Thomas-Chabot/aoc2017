var structures = "../../../structures";
var Arrays = require(structures + "/Array-Help.js");

var Square = require("./Square.js").Square;

class Squares {
  constructor (array) {
    this._arr     = array;
    this._squares = [ ];

    this._rowSize = null;
    this._colSize = null;

    this._init ();
  }

  // rebuild the grid
  build() {
    var result  = [ ];

    var rowSize = this._squares [0].rowSize;
    var colSize = this._squares [0].colSize;

    Arrays.each (this._squares, (square, index) => {
      Arrays.set (result, square.toArray(), square.rowNum * rowSize, square.colNum * colSize);
    });

    return result;
  }

  // match all squares against the given set of rules
  match(rules) {
    Arrays.each (this._squares, (square, index) => {
      square.match (rules);
    })
  }

  // split the grid into squares
  _init () {
    if ((this._arr.length % 2) === 0)
      this._rowSize = this._colSize = 2;
    else
      this._rowSize = this._colSize = 3;

    this._generateSquares ();
  }

  _generateSquares () {
    for (var row = 0; row < this._arr.length; row += this._rowSize) {
      for (var col = 0; col < this._arr [row].length; col += this.colSize) {
        this._generateSquare (row, col);
      }
    }
  }

  _generateSquare (row, col) {
    var square = new Square ([row, col], [this._rowSize, this._colSize]);
    square.generate (this._arr);

    this._squares.push (square);
  }
}

module.exports.Squares = Squares;

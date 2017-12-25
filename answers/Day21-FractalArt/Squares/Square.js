class Square {
  constructor ([row, col], [rowSize, colSize]) {
    this._x = row / rowSize;
    this._y = col / colSize;

    this._pos    = [row, col];
    this._size   = [rowSize, colSize];

    this._square = [ ];
  }

  get rowSize(){ return this._square.length; }
  get colSize(){ return this._square[0].length; }

  get rowNum(){ return this._x; }
  get colNum(){ return this._y; }

  match (rules) {
    this._square = rules.match (this._square);
  }

  generate (array) {
    var result = [ ];
    var [rowNum, colNum] = this._pos;
    var [rs, cs]         = this._size;

    for (var r = rowNum; r < rowNum + rs; r++){
      var row = this._getRow (array, r, colNum, cs);
      result.push (row);
    }

    this._square = result;
  }

  toArray(){ return this._square; }

  _getRow (array, rowNumber, column, columnSize) {
    var row = [ ];
    for (var col = column; col < column + columnSize; col++){
      row.push (array [rowNumber] [col]);
    }
    return row;
  }
}

module.exports.Square = Square;

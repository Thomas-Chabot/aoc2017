function each (array, f) {
  for (var i in array)
    f (array [i], parseInt(i));
}

function stringTo2D (string, splitRow, splitColumn) {
  var res  = [ ];
  var rows = string.split (splitRow);

  for (var i in rows)
    res.push (rows [i].split (splitColumn));

  return res;
}

function join2D (array, joinRow, joinColumn) {
  var result = [ ];
  for (var i in array)
    result.push (array [i].join (joinColumn));

  return result.join (joinRow);
}


// break an array into several squares of given row size & column size
function break2D (array, sizeRow, sizeColumn) {
  var result = [ ];
  for (var rowStart = 0; rowStart < array.length; rowStart += sizeRow) {
    for (var colStart = 0; colStart < array[rowStart].length; colStart += sizeColumn){
      result.push (_get2D (array, rowStart, colStart, sizeRow, sizeColumn));
    }
  }
  return result;
}
function _get2D (array, rowIndex, colIndex, rowSize, colSize) {
  var result = [ ];

  for (var row = rowIndex; row < rowIndex + rowSize; row++){
    var r = [ ];
    for (var col = colIndex; col < colIndex + colSize; col++){
      r.push (array [row] [col]);
    }
    result.push (r);
  }

  return result;
}

// Set elements of an array from another array, with given row & column offsets
function set2D (array, elements, rowOffset, colOffset) {
  each (elements, (row, rowIndex)=>{
    if (!array [rowIndex + rowOffset])
      array [rowIndex + rowOffset] = [ ];

    each (row, (element, colIndex)=>{
      array [rowIndex + rowOffset] [colIndex + colOffset] = element;
    })
  });
}

module.exports.each = each;
module.exports.split2D = stringTo2D;
module.exports.join2D  = join2D;
module.exports.squares = break2D;
module.exports.set     = set2D;

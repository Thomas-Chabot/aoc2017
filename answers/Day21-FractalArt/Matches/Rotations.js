// Note: Assumes equal columns (if one of second-dimension is length 3, all are length 3)

var structures = "../../../structures";
var Arrays = require(structures + "/Array-Help.js");

class Rotations {
  static Ninety (rule) {
    var result = [ ];

    Arrays.each (rule[0], (_, index)=>{
      var r = [ ];

      Arrays.each (rule, (row, i)=>{
        r.push(row [index]);
      });

      result.push (r);
    });

    return result;
  }
}

module.exports.Rotations = Rotations;

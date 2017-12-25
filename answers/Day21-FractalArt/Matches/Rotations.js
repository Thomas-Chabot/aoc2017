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

  static OneEighty (rule) {
    var result = [ ];
    Arrays.each (rule, (row, index)=>{
      var r = [ ];
      Arrays.each (row, (e, i)=>{
        r [row.length - i - 1] = e;
      });
      result [rule.length - index - 1] = r;
    });
    return result;
  }

  static TwoSeventy (rule) {
    return this.OneEighty (this.Ninety (rule));
  }
}

module.exports.Rotations = Rotations;

var structures = "../../../structures";
var Arrays = require(structures + "/Array-Help.js");

class Flips {
  static horizontalFlip (rule) {
    var result = [ ];

    Arrays.each (rule, (row, index) => {
      var flipped = [ ];
      Arrays.each (row, (element, i) => {
        flipped[row.length - i - 1] = element;
      });
      result.push (flipped);
    });

    return result;
  }

  static verticalFlip (rule) {
    var result = [ ];

    Arrays.each (rule, (row, index) => {
      result [rule.length - index - 1] = row.slice(0);
    });

    return result;
  }

  static fullFlip (rule) {
    var horizFlip = this.horizontalFlip (rule);
    return this.verticalFlip (horizFlip);
  }
}

module.exports.Flips = Flips;

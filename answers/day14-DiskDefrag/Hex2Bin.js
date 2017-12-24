function _parse (character) {
  var bin = parseInt(character, 16).toString(2);
  return '0'.repeat (4 - bin.length) + bin;
}

function toBinary (hex) {
  var string = hex.toString().split ("");
  var result = "";

  for (var char of string){
    result += _parse (char);
  }

  return result;
}

module.exports.parse = toBinary;

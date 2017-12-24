var regexGarbage = /\<[^\>]*\>/g;
var regexCancelled = /!./g;

function getLengthOfGarbage (string) {
	var garbage = string.match (regexGarbage, string);
	var length  = 0;
	
	for (var match of garbage) {
		// note: does not count leading, trailing <>
		length += match.length - 2;
	}
	
	return length;
}

function value (string) {
	var resPart2;
	
	string = string.replace (regexCancelled, "");

	resPart2 = getLengthOfGarbage (string);
	string = string.replace(regexGarbage, "");
	
	var total = 0;
	var level = 0;
	for (var character of string) {
		if (character === '{')
			level ++;
		else if (character === '}'){
			total += level;
			level --;
		}
	}
	
	return [total, resPart2];
}

var [p1, p2] = value (document.body.innerText);
console.log ("Part 1: ", p1);
console.log ("Part 2: ", p2);

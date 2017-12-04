// checks if a row is valid
function valid(row){
	var words = row.split(" ");
	var foundWords = { };
	
	// valid if word does not appear twice ... store every word found to check for a match
	for (var i in words){
		if (foundWords[words[i]])
			return false;
		foundWords[words[i]] = true;
	}
	
	return true;
}

// grab puzzle data
var puzzle = document.body.innerText.toLowerCase().split("\n");

// count up matches
var count  = 0;
for (var i in puzzle)
    // skip blank row
	if (puzzle[i] === "") continue;
	if (valid(puzzle[i]))
		count++;
console.log(count);

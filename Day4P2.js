function sort (word) {
  return word.split('').sort().join('');
}

function valid(row){
	var words = row.split(" ");
	var foundWords = { };
	
	for (var i in words){
    // sort alphabetically, so ordering doesn't matter
		var word = sort (words [i]);
    
    // check if word exists already
		if (foundWords[word])
			return false;
		foundWords[word] = true;
	}
	
	return true;
}

// grab puzzle data
var puzzle = document.body.innerText.toLowerCase().split("\n");

// count up # matches
var count  = 0;
for (var i in puzzle)
  // skip a blank row (i.e. last line)
  if (puzzle[i] === "") continue;
	if (valid(puzzle[i]))
		count++;
    
console.log(count);

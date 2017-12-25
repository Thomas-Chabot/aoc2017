var fs = require("fs");

var Interface = require("./part1/Interface.js").Interface;

fs.readFile("./input.txt", (err, data)=>{
	if (err) console.error (err);
	else{
		var ui = new Interface(data.toString().replace(/\r/g, ""), {debug: false});
		ui.start();

		console.log (ui.recoveredValue);
	}
})

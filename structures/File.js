var fs = require("fs");

function readFile (filename, callback){
  fs.readFile(filename, (err, data)=>{
  	if (err) console.error (err);
  	else{
      callback(data.toString().replace(/\r/g, ""));
  	}
  })
}

module.exports.read = readFile;

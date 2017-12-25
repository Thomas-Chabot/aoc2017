var fs = require("fs");

var Control = require ("./Control.js").Control;

var numRunsP1 = 1;
var numRunsP2 = 1 * 1000 * 1000 * 1000;

function run (data) {
  var control = new Control (data, 'a', 'p');
  var res1    = control.run (numRunsP1);
  var res2    = control.run (numRunsP2);

  console.log (`Result Part 1: ${res1}`);
  console.log (`Result Part 2: ${res2}`);
}

fs.readFile ("./input.txt", (err, data)=>{
  if (err) console.error (err);
  else {
    data = data.toString().replace(/\r/g, "").replace(/\n/g, "");
    run (data);
  }
})

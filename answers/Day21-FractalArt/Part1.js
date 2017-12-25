var structures = "../../structures";
var File       = require(structures + "/File.js");

var Interface  = require("./Interface.js").Interface;

File.read ("./input.txt", (data)=>{
  var ui = new Interface(data);

  console.log (`Part 1: `);
  ui.run(5);
  ui.print();

  console.log (`Part 1 Answer: ${ui.on}`);

  ui.run (13);
  console.log (`Part 2: ${ui.on}`);
})

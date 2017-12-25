var Programs = require("./Programs.js").Programs;

class Interface {
  constructor (commands, startChar, endChar) {
    this._commands = commands.split(",");
    this._programs = new Programs(startChar, endChar);
  }

  run(){
    for (var command of this._commands) {
      if (!command) continue;
      this._run (command);
    }
  }

  toString(){ return this._programs.toString(); }

  _parse (command) {
    var [cmd] = command.match(/(.)/);
    var args = command.substr (1).split ("/");

    return [cmd, args];
  }

  _run (command) {
    var [command, args] = this._parse (command);

    switch (command) {
      case "x":
        this._programs.exchange (parseInt (args [0]), parseInt (args [1]));
        break;
      case "s":
        this._programs.spin (parseInt (args [0]));
        break;
      case "p":
        this._programs.partner (args [0], args [1]);
        break;
      default:
        console.error (`Unknown command: ${command} with arguments ${args.join(', ')}`);
        break;
    }
  }
}

module.exports.Interface = Interface;

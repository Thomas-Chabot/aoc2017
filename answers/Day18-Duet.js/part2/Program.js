var structures = "../../../structures";

var Registers = require("./Registers.js").Registers;
var ArrayDeque = require(structures + "/ArrayDeque.js").ArrayDeque;

class Program {
  constructor(onSendMessage) {
    this._registers = new Registers (onSendMessage);
    this._messages  = new ArrayDeque ();
  }

  receiveMessage (message) {
    if (this._registers.waiting)
      this._registers.receiveMessage (message);
    else
      this._messages.add (message);
  }

  sendMessage (message) {
    if (!this._onMessage) return;
    this._onMessage (message);
  }
}

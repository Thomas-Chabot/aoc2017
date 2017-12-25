var Control = require ("./Control.js").Control;

var basePattern = ".#./..#/###";

class Interface {
  constructor(rules){
    this._rules = rules.split("\n");
    this._control = new Control (basePattern);

    this._parseRules ();
  }

  print(){ console.log( this._control.toString() ); }
  get on(){ return this._control.toString().match (/#/g).length; }
  
  run (nTimes){
    for (var i = 0; i < nTimes; i++)
      this._control.run ();
  }

  _parseRules (){
    for (var i in this._rules){
      if (!this._rules [i]) continue;
      this._parseRule (this._rules [i]);
    }
  }

  _parseRule (rule){
    var [rule, result] = this._matchRule (rule);
    if (!rule || !result) return false;

    this._control.addRule (rule, result);
  }

  _matchRule (rule){
    var result = rule.match (/(.+) => (.+)/);
    if (!result) return [ ];

    var [match, rule, result] = result;
    return [rule, result];
  }
}

module.exports.Interface = Interface;

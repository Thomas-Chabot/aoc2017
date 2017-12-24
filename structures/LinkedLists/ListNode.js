class Node {
  constructor (data) {
    this._data = data;
    this._next = null;
    this._prev = null;
  }

  get prev(){ return this._prev; }
  set prev(p){ this._prev = p; }

  get next(){ return this._next; }
  set next(n){ this._next = n; }

  get data(){ return this._data; }
  set data(d){ this._data = d; }
}

module.exports.Node = Node;

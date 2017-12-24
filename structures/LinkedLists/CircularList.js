var DoublyLinkedList = require("./DoublyLinkedList.js").DoublyLinkedList;

class CircularList extends DoublyLinkedList {
  constructor (...args) {
    super (...args);
  }

  // Base Operations
  get (index){
    return super.get (this._index (index));
  }
  set (index, value) {
    super.set (this._index (index), value);
  }
  add (index, value) {
    super.add (this._index (index), value);
  }
  remove (index) {
    super.remove (this._index (index));
  }

  swap (index1, index2) {
    return super.swap (this._index (index1), this._index (index2));
  }

  // Add After: Performs the i+1 after the index has been converted
  addAfter (index, value) {
    super.add (this._index (index) + 1, value);
  }

  getIndex(i){ return this._index (i); }

  _index (i) {
    return this._n ? i % this._n : 0;
  }
}

module.exports.CircularList = CircularList;

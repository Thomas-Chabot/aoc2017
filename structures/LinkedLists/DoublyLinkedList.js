var Node = require("./ListNode.js").Node;

class DoublyLinkedList {
  constructor () {
    this._dummy = new Node();
    this._dummy.next = this._dummy;
    this._dummy.prev = this._dummy;

    this._n     = 0;
  }

  get (index) {
    if (index >= this._n || index < 0) return false;

    var node = this._getNodeAt (index);
    return node.data;
  }

  set (index, value) {
    if (index >= this._n || index < 0) return false;

    var node = this._getNodeAt (index);
    node.data = value;
  }

  add (index, value) {
    if (index > this._n || index < 0) return false;

    var nextNode = this._getNodeAt (index);
    var newNode  = this._newNode (value, index);

    newNode.next = nextNode;
    newNode.prev = nextNode.prev;

    nextNode.prev.next = newNode;
    nextNode.prev      = newNode;

    this._n ++;
  }

  remove (index) {
    if (index >= this._n || index < 0) return false;

    var node = this._getNodeAt (index);
    node.prev.next = node.next;
    node.next.prev = node.prev;

    this._n --;
  }

  swap (index1, index2) {
    var n1 = this._getNodeAt (index1);
    var n2 = this._getNodeAt (index2);

    [n1.data, n2.data] = [n2.data, n1.data];
  }

  indexOf (data) {
    var index = -1;
    this._each ((node, i)=>{
      if (node.data === data) {
        index = i;
        return false;
      }
    });

    return index;
  }

  toString(){
    var node = this._dummy;
    var string = "";

    this._each ((node)=>{
      string += node.data + ", ";
    });

    return string;
  }

  _newNode (value, index) {
    return new Node (value);
  }

  _getNodeAt (index) {
    var result = this._dummy;

    var traversal;
    if (index <= this._n / 2)
      traversal = this._each;
    else
      traversal = this._eachReverse;

    traversal.call (this, (node, i)=>{
      if (i === index) {
        result = node;
        return false;
      }
    });

    return result;
  }

  _each (f) {
    var node = this._dummy;
    var i    = 0;

    while (i < this._n) {
      node = node.next;
      if (f (node, i) === false)
        return;

      i ++;
    }
  }

  _eachReverse (f) {
    var node = this._dummy;
    var i    = this._n - 1;
    while (i > 0) {
      node = node.prev;

      if (f (node, i) === false)
        return;

      i --;
    }
  }
}

module.exports.DoublyLinkedList = DoublyLinkedList;

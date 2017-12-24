// This list holds a 'Buffer' node => The last node on which an operation was performed.
// This makes it a lot faster to go to an arbritary node (ex. 23,754)
//  when jumping from a previous node, as is the case with Day 17.
var CircularList = require("./CircularList.js").CircularList;
var Node         = require("./ListNode.js").Node;

class BufferCircularList extends CircularList {
  constructor (...args){
    super (...args);

    this._lastNode = null;
    this._lastIndex = -1;
  }

  _newNode (data, index) {
    this._lastIndex = index;
    this._lastNode  = new Node (data);

    return this._lastNode;
  }

  _getNodeAt (index) {
    var distFromHead = (index);
    var distFromTail = (this._n - index);
    var distFromLast = Math.abs(this._lastIndex - index);

    if (distFromLast < distFromHead && distFromLast < distFromTail)
      return this._jumpTo (index);

    return super._getNodeAt (index);
  }

  _jumpTo (index) {
    var fromIndex = this._lastIndex;

    var f;

    if (fromIndex > index)
      f = (node)=>node.prev;
    else
      f = (node)=>node.next;

    var curNode = this._lastNode;
    for (var i = 0; i < Math.abs (fromIndex - index); i++)
      curNode = f(curNode);

    return curNode;
  }
}

module.exports.BufferList = BufferCircularList;

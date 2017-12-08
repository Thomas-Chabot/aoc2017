class Disc {
	constructor (name, weight){
		this._name = name;
		this._weight = parseInt(weight);
		
		this._parent = null;
		
		this._balancing = [ ];
		this._size      = 0;
		
		this._totalWeight = 0;
	}

	get name(){ return this._name; }
	get weight(){ return this._weight; }
	get n(){ return this._size; }
	get balancing(){ return this._balancing; }
	get balanced(){ return this._checkBalanced(); }
	
	get parent(){ return this._parent; }
	set parent(p){ this._parent = p; }
	
	indexOf (node){ return this._balancing.indexOf (node); }
	nextIndex(index){ return (index + 1) % this._balancing.length; }
	
	// from cache
	get totalWeight(){
		return this._totalWeight;
	}
	
	// recalculate
	calculateWeight(){
		var weight = 0;
		this._each ((node)=>{
			weight += node.totalWeight;
		});
		
		this._totalWeight = weight + this.weight;
		return weight;
	}
	
	addDisc (disc){
		//this._balancing.push (disc);
		if (this._balancing.indexOf (disc.name) !== -1)
			console.error ("already balancing ", disc.name);
		else{
			this._size++;
			this._balancing.push (disc);
			disc.parent = this;
		}
	}
	
	get unbalancedIndex(){ return this._findUnbalancedIndex(); }
	
	getSubTower(index){
		return this._balancing [index];
	}
	
	getWeightDifference (index, index2) {
		return this._weightDiff (index, index2);
	}
	
	_findUnbalancedIndex(){
		// note: assumption is, if there's an unbalanced tower, there's at least three towers.
		var ret = -1;
		this._each ((node, index)=>{
			if (index === 0){
				return;
			}else if (!this._balanced (index - 1, index)){
				// compare to the next node
				var compareIndex = this.nextIndex (index);
				
				if (!this._balanced (compareIndex, index))
					ret = index;
				else
					ret = index - 1;
			}
		});
		
		return ret;
	}
	
	_weightDiff (index, index2){
		return this._balancing [index].totalWeight - this._balancing [index2].totalWeight;
	}
	
	_balanced (index, index2){
		return this._weightDiff (index, index2) === 0;
	}
	
	_each (f){
		for (var i in this._balancing)
			f (this._balancing [i], parseInt(i));
	}
}


class Tower {
	constructor(){
		this._discs  = { };
		this._bottom = { };
	}

	get bottom(){
		return Object.values (this._bottom);
	}
	get bottomNode(){
		return this._discs [this.bottom [0]];
	}
	
	initDisc (disc) {
		this._discs [disc.name] = disc;
		this._bottom [disc.name] = disc.name;
	}
	
	reparentDisc (discName, parentName) {
		var parentDisc = this._discs [parentName];
		var childDisc  = this._discs [discName];
		
		if (!parentDisc)
			console.error ("parent disc not found");
		else if (!childDisc)
			console.error ("child disc not found");
		else{
			parentDisc.addDisc (childDisc);
			delete this._bottom [discName];
		}
	}
	
	traverse(f){
		// note: post-order
		var nodeName = Object.values (this._bottom) [0];
		var node     = this._discs [nodeName];
		this._traverse (node, f);
	}
	
	calculateWeights(){
		this.traverse ((node)=>{
			node.calculateWeight();
		});
		
		return this;
	}
	
	findUnbalanced(){
		var curNode = this.bottomNode;
		while (curNode){
			var unbalancedIndex = curNode.unbalancedIndex;
			if (unbalancedIndex === -1)
				return curNode;
			
			curNode = curNode.getSubTower (unbalancedIndex);
		}
	}
	
	findWeightBalanceDifference (unbalanced) {
		    unbalanced = unbalanced || this.findUnbalanced();
		var parent     = unbalanced && unbalanced.parent;
		
		if (!parent) return;
		
		var index1 = parent.indexOf (unbalanced);
		var index2 = parent.nextIndex (index1);
		
		return parent.getWeightDifference (index1, index2);
	}
	
	findRequiredWeight () {
		var unbalanced = this.findUnbalanced();
		var diff       = this.findWeightBalanceDifference (unbalanced);
		
		return unbalanced.weight - diff;
	}
	
	_traverse (node, f){
		var traversed = { };
		var curNode   = node;
		
		var _nextFrom = function(curNode){
			var balancing = curNode.balancing;
			for (var index in balancing){
				var node = balancing [index];
				if (!traversed [node.name]){
					traversed [node.name] = true;
					return node;
				}
			}
		}
		
		while (curNode !== null){
			var balancing = curNode.balancing;
			var movement = _nextFrom (curNode);
			
			if (movement)
				curNode = movement;
			else{
				f(curNode);
				curNode = curNode.parent;
			}
		}
	}
}


class UI {
	constructor(strings){
		this._strings = strings;
		this._tower   = new Tower();
		
		this._generateTower();
		this._setParents();
	}
	
	get bottom(){
		return this._tower.bottom;
	}
	
	get tower(){ return this._tower; }

	addDisc (name, weight){
		var disc = new Disc (name, weight);
		this._tower.initDisc (disc);
	}
	
	parentDisc (child, parent){
		this._tower.reparentDisc (child, parent);
	}
	
	_getDiscDetails (s) {
		return s.match(/([^ ]*) \(([0-9]+)\)/) || [ ];
	}
	_getDiscChildren (s) {
		if (s.indexOf("->") === -1) return [ ];
		var children = s.replace(/.*->/, "").match(/([^ ,]+)/g);
		var parent   = s.match(/([^ ]*)/);
		
		if (!parent) return [ ];
		return [parent[0], children];
	}
	
	
	_generateTower(){
		this._each ((str)=>{
			var [match, name, weight] = this._getDiscDetails (str);
			if (!match) return;
			
			this.addDisc (name, weight);
		});
	}
	
	_setParents(){
		this._each ((str)=>{
			var [parent, children] = this._getDiscChildren (str);
			for (var i in children){
				this.parentDisc (children[i], parent);
			}
		});
	}
	
	_each(f){
		for (var i = 0; i < this._strings.length; i++)
			f(this._strings [i]);
	}
}

var text    = document.body.innerText;
var strings = text.split("\n");
var ui      = new UI(strings);

console.log ("PART 1: ", ui.bottom[0]);
console.log ("PART 2: ", ui.tower.calculateWeights().findRequiredWeight());

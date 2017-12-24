class Dict {
	constructor (classType) {
		this._elements = { };
		this._cType    = classType;
		this._addIndex = 0;
	}
	
	get (id) {
		if (this._elements [id])
			return this._elements [id];
		
		return this._new (id);
	}
	
	put (id, thing) {
		this._elements [id] = thing;
	}
	
	has (id){ return this._elements[id] !== undefined; }
	
	add() {
		var id = this._idOf (this._addIndex);
		
		while (this.has (id)) {
			this._addIndex ++;
			id = this._idOf (this._addIndex);
		}
		
		return this.get (id);
	}
	
	log (checkFunc) {
		this._ifEach (checkFunc, (...args)=>{
			console.log (...args);
		});
	}
	
	count (checkFunc){
		var total = 0;
		this._ifEach (checkFunc, ()=>{
			total++;
		});
		return total;
	}
	
	each (f) {
		for (var key in this._elements)
			f (key, this._elements[key]);
	}
	
	_ifEach (checkFunc, f) {
		this.each ((...args)=>{
			if (checkFunc (...args)){
				f (...args);
			}
		});
	}
	
	_new (id) {
		var e = new this._cType (id);
		this._elements [id] = e;
		
		return e;
	}
	
	_idOf (addIndex){ return "gid" + addIndex; }
}

class Group {
	constructor (gid) {
		this._children = [ ];
		this._id       = gid;
	}
	
	get id(){ return this._id; }
	
	push (child){ this._children.push (child); }
	
	reset(){ this._children = [ ]; }
	
	size(){ return this._children.length; }
	
	each (f){
		for (var i in this._children)
			f (i, this._children [i]);
	}
	
	valid (parents) {
		return this._valid (parents);
	}
	
	_valid(parents) {
		for (var child of this._children){
			if (!this._validChild (child, parents))
				return false;
			
			if (!this._recurseChild (child, parents))
				return false;
		}
		
		return true;
	}
	
	_validChild (child, parents) {
		return parents.indexOf (child.id) === -1;
	}
	
	_recurseChild (child, parents) {
		parents.push (this.id);
		
		if (!child.valid (parents))
			return false;
		
		parents.pop ();
		return true;
	}
}

class Element {	
	constructor (id) {
		this._id = id;
		this._children = new Group();
		this._parent = null;
		
		this._data = null;
		this._groupId = parseInt(this._id);
	}
	
	set parent (p){ this._parent = p; }
	set group (g) {
		this._groupId = g;
	}
	set data (d) { this._data = d; }
	
	get group(){ return this._groupId; }
	get children(){ return this._children; }
	
	addChild (child) {
		if (!child){
			console.error ("Element::addChild : child not specified");
			return false;
		}
		
		child.parent = this;
		this._children.push (child);
	}
	
	valid (parents) {
		if (!parents) parents = [ ];
		return this._children.valid (parents);
	}
}

class Pipes {
	constructor () {
		this._elements = new Dict(Element);
		this._groups   = new Dict(Group);
	}
	
	add (element) {
		var id   = element.id;
		var data = element.data;
		var children = element.child_ids;
		
		var elem  = this._getElement (id);
		elem.data = data;
		
		this._addChildren (elem, children);
	}
	
	count (checkFunc) { return this._elements.count (checkFunc); }
	each (f) { this._elements.each (f); }
	
	canAccess (elementId){
		var element = this._elements.get (elementId);
		var group   = this._groups.get (element.group);
		
		return group.size();
	}
	
	get numGroups(){
		var numGroups = 0;
		this._groups.each ((id, group) => {
			if (group.size() > 0)
				numGroups ++;
		});
		return numGroups;
	}

	_getElement (id) {
		var isOldElement = this._elements.has (id);
		var e = this._elements.get (id);
		
		if (!isOldElement)
			this._groups.get (e.group).push (e);
			
		return e;
	}
	
	_addChildren (element, childIds) {
		var newGroup = this._groups.add ();
		var groupId  = newGroup.id;
		
		element.children.each ((index, element)=>{
			this._resetGroupId (element.groupId, groupId);
		});
		
		for (var id of childIds) {
			this._addChild (element, this._getElement (id), groupId);
		}
		
		this._resetGroupId (element.group, groupId);
	}
	
	_addChild (parent, child, groupId) {
		var group = child.group;
		this._resetGroupId (group, groupId);
		
		parent.addChild (child);
	}
	
	_resetGroupId (oldGroupId, newGroupId) {
		if (oldGroupId === newGroupId) return;
		
		var group = this._groups.get (oldGroupId);
		var newGroup = this._groups.get (newGroupId);
		
		group.each ((index, element)=>{
			element.group = newGroupId;
			newGroup.push (element);
		});
		
		group.reset();
	}
}

class UI {
	constructor (commands){
		this._commands = commands.split("\n");
		this._pipes    = new Pipes();
	}
	
	run(){ this._run(); }
	canAccess(pipe){ return this._pipes.canAccess (pipe); }
	
	get numGroups(){
		return this._pipes.numGroups;
	}
	
	// parsing
	_getPipes (line) {
		var split = line.split("<->");
		if (!split || split.length < 2) return [ ];
		
		var fromPipe = split[0].match(/[0-9]+/g);
		var toPipes  = split[1].match(/[0-9]+/g);
		
		return [fromPipe, toPipes];
	}
	
	// running
	_run() {
		for (var line of this._commands)
			this._connect (line);
	}
	
	_connect (line) {
		var [fromPipes, toPipes] = this._getPipes (line);
		if (!fromPipes || !toPipes) return;
		
		this._pipes.add ({
			data: "",
			id: fromPipes [0],
			child_ids: toPipes
		});
	}
}



var string = document.body.innerText;
var ui = new UI(string);
ui.run();

console.log (`Part 1 answer: ${ui.canAccess(0)}`);
console.log (`Part 2 answer: ${ui.numGroups}`);

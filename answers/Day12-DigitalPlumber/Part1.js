class Pipes {
	constructor(){
		this._pipes = { };
	}
	
	connect (fromPipe, toPipe) {
		this._init (fromPipe);
		this._init (toPipe);
		
		// bi-directional (nvm. this is taken care of already by the input)
		this._addConnection (fromPipe, toPipe);
	}
	
	canAccess (pipe) {
		return this._canAccess (pipe);
	}
	
	// initialize a pipe
	_init (pipe){
		if (!this._pipes [pipe])
			this._pipes [pipe] = [ ];
	}
	
	// connections
	_addConnection (from, to) {
		this._pipes[from].push (to);
	}
	
	// accessing
	_canAccess (pipe) {
		// 1) the pipe can access itself
		var pipes = { };
		pipes [pipe] = true;
		
		// 2) the pipe can access anything connected to it
		var connected = this._pipes [pipe];
		for (var index = 0; index < connected.length; index++){
			var connectedPipe = connected[index];
			if (pipes[connectedPipe]) continue;
		
			pipes [connectedPipe] = true;
			
			var extraConnections = this._pipes [connectedPipe];
			if (extraConnections)
				connected = connected.concat (extraConnections);
		}
		
		return Object.keys (pipes);
	}
}

class UI {
	constructor (commands){
		this._commands = commands.split("\n");
		this._pipes    = new Pipes();
	}
	
	run(){ this._run(); }
	canAccess(pipe){ return this._pipes.canAccess (pipe); }
	
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
		
		for (let pipe of fromPipes)
			this._connectPipes (pipe, toPipes);
	}
	
	_connectPipes (fromPipe, toPipes){
		for (var pipe of toPipes)
			this._pipes.connect (fromPipe, pipe);
	}
}

var string = document.body.innerText;
var ui = new UI(string);
ui.run();

console.log (ui.canAccess (0).length);

class Regions {
  constructor(grid, used){
    this._grid       = this._parseGridString (grid);
    this._usedSquare = used;

    this._scanned   = false;
    this._curRegion = 0;
  }

  get lookingFor(){ return this._usedSquare; }

  get regionNumber(){ return this._curRegion; }
  set regionNumber(r){ this._curRegion = r; }

  count () {
    this._scan ();
    return this.regionNumber;
  }

  toString(){
    var s = "";
    for (var row of this._grid){
      s += row.join("") + "\n";
    }
    return s;
  }

  _scan () {
    if (this._scanned) return;

    for (var x = 0; x < this._grid.length; x++) {
      for (var y = 0; y < this._grid[x].length; y++){
        if (this._search ([x, y]))
          this.regionNumber ++;
      }
    }

    this._scanned = true;
  }

  _search ([x, y]) {
    if (!this._grid [x]) return false;
    if (this._grid [x] [y] !== this.lookingFor) return false;

    this._grid [x] [y] = this.regionNumber;

    this._search ([x + 1, y]);
    this._search ([x - 1, y]);
    this._search ([x, y + 1]);
    this._search ([x, y - 1]);

    return true;
  }

  _parseGridString (grid) {
    var arr      = [ ];
    var rows     = grid.split("\n");

    for (var rowIndex in rows)
      arr.push (rows [rowIndex].split (""));

    return arr;
  }
}

module.exports.Regions = Regions;

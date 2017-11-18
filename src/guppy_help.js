GuppySymbols = require('./guppy_symbols.js');


GuppyHelp = {}
GuppyHelp.controls = document.createElement("div");
GuppyHelp.controls.setAttribute("class","guppy_help");
GuppyHelp.controls.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
GuppyHelp.controls.innerHTML = `<p>Start typing the name of a mathematical function to automatically insert it.  </p><p>(For example, "sqrt" for root, "mat" for matrix, or "defi" for definite integral.)</p>
<style>td{ vertical-align:top;padding: 2px;}</style>
<h3>Controls</h3><table id="guppy_help_table"><tr><td><b>Press...</b></td><td><b>...to do</b></td></tr></table>`;

GuppyHelp.symbols = document.createElement("div");
GuppyHelp.symbols.setAttribute("class","guppy_help");
GuppyHelp.symbols.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
GuppyHelp.symbols.innerHTML = `<p>Start typing the name of a mathematical function to automatically insert it.  </p><p>(For example, "sqrt" for root, "mat" for matrix, or "defi" for definite integral.)</p>
<style>td{ vertical-align:top;padding: 2px;}</style>
<h3>Symbols</h3><table id="guppy_syms_table"><tr><td><b>Type...</b></td><td><b>...to get</b></td></tr></table>`;

var make_row = function(table_id, c1, c2){
    var row = document.createElement("tr");
    row.innerHTML = `<td><font face="monospace">`+c1+`</font></td><td>`+c2+`</td>`;
    document.getElementById(table_id).appendChild(row);
    return row;
}

var make_x = function(elt){
    var x = document.createElement("div");
    x.innerHTML = `<font size="6pt">&times;</font>`;
    x.style = "cursor:pointer;position:absolute;top:0;right:0;padding-right:5px;line-height:1;";
    x.onclick = function(e){ elt.style.display = "none"; }
    elt.appendChild(x);
}

make_x(GuppyHelp.symbols);
make_x(GuppyHelp.controls);

GuppyHelp.init = function(symbols){
    document.body.appendChild(GuppyHelp.symbols);
    document.body.appendChild(GuppyHelp.controls);
    
    make_row("guppy_help_table","left/right arrows","Move cursor");
    make_row("guppy_help_table","shift+left/right arrows","Select region")
    make_row("guppy_help_table","ctrl+a","Select all");
    make_row("guppy_help_table","ctrl+x/c/v","Cut/copy/paste");
    make_row("guppy_help_table","ctrl+z/y","Undo/redo");
    make_row("guppy_help_table","ctrl+left/right","Add entry to list or column to matrix");
    make_row("guppy_help_table","shift+ctrl+left/right","Add copy of current entry/column to to list/matrix");
    make_row("guppy_help_table","ctrl+up/down","Add row to matrix");
    make_row("guppy_help_table","shift+ctrl+up/down","Add copy of current row to matrix");
    make_row("guppy_help_table","ctrl+backspace","Delete current entry in list or column in matrix");
    make_row("guppy_help_table","ctrl+shift+backspace","Delete current row in matrix");
    
    for(var s in symbols){
	var latex = symbols[s].output.latex.replace(/\{\$[0-9]+(\{[^}]+\})*\}/g, "\\blue{[?]}");
	var row = make_row("guppy_syms_table",s," ");
	katex.render(latex, row.lastChild);
    }
}

module.exports = GuppyHelp;

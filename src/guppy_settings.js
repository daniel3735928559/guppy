GuppySymbols = require('./guppy_symbols.js');


GuppySettings = {}
GuppySettings.controls = document.createElement("div");
GuppySettings.controls.setAttribute("class","guppy_help");
GuppySettings.controls.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
GuppySettings.controls.innerHTML = `<p>Start typing the name of a mathematical function to automatically insert it.  </p><p>(For example, "sqrt" for root, "mat" for matrix, or "defi" for definite integral.)</p>
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>
<h3>Controls</h3><table id="guppy_help_table"><tr><td><b>Press...</b></td><td><b>...to do</b></td></tr></table>`;

GuppySettings.symbols = document.createElement("div");
GuppySettings.symbols.setAttribute("class","guppy_help");
GuppySettings.symbols.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
GuppySettings.symbols.innerHTML = `<p>Start typing the name of a mathematical function to automatically insert it.  </p><p>(For example, "sqrt" for root, "mat" for matrix, or "defi" for definite integral.)</p>
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>
<h3>Symbols</h3><table id="guppy_syms_table"><tr><td><b>Type...</b></td><td><b>...to get</b></td></tr></table>`;

GuppySettings.settings = document.createElement("div");
GuppySettings.settings.setAttribute("class","guppy_help");
GuppySettings.settings.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
GuppySettings.settings.innerHTML = `<p>Global settings: </p>
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>
<h3>Settings</h3><table id="guppy_settings_table"><tr><td><b>Type...</b></td><td><b>...to get</b></td></tr></table>`;

GuppySettings.div_names = ["controls","symbols","settings"];

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

GuppySettings.hide_all = function(){
    for(var i = 0; i < GuppySettings.div_names.length; i++)
	GuppySettings[GuppySettings.div_names[i]].style.display = "none";
}

GuppySettings.toggle = function(card, g){
    if(GuppySettings.div_names.indexOf(card) >= 0){
	if(GuppySettings[card].style.display == "none"){
	    GuppySettings.hide_all();
	    var r = g.editor.getBoundingClientRect();
	    GuppySettings[card].style.top = (r.bottom+document.documentElement.scrollTop) + "px";
	    GuppySettings[card].style.left = (r.left+document.documentElement.scrollLeft) + "px";
	    GuppySettings[card].style.display = "block";
	}
	else{
	    GuppySettings.hide_all();
	}
    }
}

GuppySettings.init = function(symbols){
    for(var i = 0; i < GuppySettings.div_names.length; i++){
	make_x(GuppySettings[GuppySettings.div_names[i]]);
	document.body.appendChild(GuppySettings[GuppySettings.div_names[i]])
    }
    
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

module.exports = GuppySettings;

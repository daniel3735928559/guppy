GuppySymbols = require('./guppy_symbols.js');


GuppySettings = {}
GuppySettings.config = {};
GuppySettings.config.path = "/lib/guppy";
GuppySettings.config.events = {};
GuppySettings.config.settings = {
    "autoreplace":"auto",
    "empty_content":"\\blue{[?]}",
    "blank_caret":"\\red{[?]}",
    "blacklist":[],
    "buttons":["osk","settings","symbols","controls"],
    "cliptype":"latex",
};

GuppySettings.settings_options = {
    "autoreplace":["auto","whole","delay","none"],
    "cliptype":["latex","text","xml","ast","asciimath"],
};

GuppySettings.panels = {};
GuppySettings.panels.controls = document.createElement("div");
GuppySettings.panels.controls.setAttribute("class","guppy_help");
GuppySettings.panels.controls.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
GuppySettings.panels.controls.innerHTML = `<p>Start typing the name of a mathematical function to automatically insert it.  </p><p>(For example, "sqrt" for root, "mat" for matrix, or "defi" for definite integral.)</p>
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>
<h3>Controls</h3><table id="guppy_help_table"><tr><td><b>Press...</b></td><td><b>...to do</b></td></tr></table>`;

GuppySettings.panels.symbols = document.createElement("div");
GuppySettings.panels.symbols.setAttribute("class","guppy_help");
GuppySettings.panels.symbols.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
GuppySettings.panels.symbols.innerHTML = `<p>Start typing the name of a mathematical function to automatically insert it.  </p><p>(For example, "sqrt" for root, "mat" for matrix, or "defi" for definite integral.)</p>
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>
<h3>Symbols</h3><table id="guppy_syms_table"><tr><td><b>Type...</b></td><td><b>...to get</b></td></tr></table>`;

GuppySettings.panels.settings = document.createElement("div");
GuppySettings.panels.settings.setAttribute("class","guppy_help");
GuppySettings.panels.settings.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
GuppySettings.panels.settings.innerHTML = `<p>Global settings: </p>
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>
<h3>Settings</h3><table id="guppy_settings_table"></table>`;

GuppySettings.div_names = ["controls","symbols","settings"];

var make_row = function(table_id, c1, c2){
    var row = document.createElement("tr");
    row.innerHTML = `<td><font face="monospace">`+c1+`</font></td><td>`+c2+`</td>`;
    document.getElementById(table_id).appendChild(row);
    return row;
}

var make_x = function(elt){
    var x = document.createElement("div");
    x.setAttribute("class","guppy-card-x");
    x.innerHTML = `<font size="6pt">&times;</font>`;
    x.style = "cursor:pointer;position:absolute;top:0;right:0;padding-right:5px;line-height:1;";
    x.onclick = function(e){ elt.style.display = "none"; }
    elt.appendChild(x);
}

GuppySettings.hide_all = function(){
    for(var i = 0; i < GuppySettings.div_names.length; i++)
	GuppySettings.panels[GuppySettings.div_names[i]].style.display = "none";
}

GuppySettings.toggle = function(card, g){
    if(GuppySettings.div_names.indexOf(card) >= 0){
	GuppySettings.init_card(card, g);
	if(GuppySettings.panels[card].style.display == "none"){
	    GuppySettings.hide_all();
	    var r = g.editor.getBoundingClientRect();
	    GuppySettings.panels[card].style.top = (r.bottom+document.documentElement.scrollTop) + "px";
	    GuppySettings.panels[card].style.left = (r.left+document.documentElement.scrollLeft) + "px";
	    GuppySettings.panels[card].style.display = "block";
	}
	else{
	    GuppySettings.hide_all();
	}
    }
}

GuppySettings.init_card = function(card, g){
    if(card == "settings"){
	document.getElementById("guppy_settings_table").innerHTML = "";
	for(var s in GuppySettings.settings_options){
	    var opt = GuppySettings.settings_options[s];
	    var val = g.backend.setting(s);
	    if(opt.length == 0){
		//make_row("guppy_settings_table",s,`<input id="guppy_settings_input_${s}" type="text" onchange="Guppy.instances['${g.id}'].backend.settings['${s}']=document.getElementById('guppy_settings_input_${s}').value;" value="`+val+`"></input>`);
		make_row("guppy_settings_table",s,`<input id="guppy_settings_input_${s}" type="text" onchange="GuppySettings.config.settings['${s}']=document.getElementById('guppy_settings_input_${s}').value;" value="`+val+`"></input>`);
	    }
	    else{
		//var selector = `<select id="guppy_settings_select_${s}" onchange="Guppy.instances['${g.id}'].backend.settings['${s}']=document.getElementById('guppy_settings_select_${s}').value;">`;
		var sel = document.createElement("select");
		sel.setAttribute("id",`guppy_settings_select_${s}`);
		sel.onchange = function(ss){
		    return function(e){
			GuppySettings.config.settings[ss] = document.getElementById(`guppy_settings_select_${ss}`).value;
			console.log("ASD",ss,GuppySettings.config.settings[ss]);
		    }
		}(s);
		for(var i = 0; i < opt.length; i++){
		    var o = document.createElement("option");
		    o.setAttribute("value",opt[i]);
		    o.innerHTML = opt[i];
		    sel.appendChild(o);
		}
		var row = document.createElement("tr");
		row.innerHTML = `<td><font face="monospace">${s}</font></td>`;
		var td = document.createElement("td");
		td.appendChild(sel);
		row.appendChild(td);
		document.getElementById("guppy_settings_table").appendChild(row);
	    }
	}
    }
}

GuppySettings.init = function(symbols){
    for(var i = 0; i < GuppySettings.div_names.length; i++){
	make_x(GuppySettings.panels[GuppySettings.div_names[i]]);
	document.body.appendChild(GuppySettings.panels[GuppySettings.div_names[i]])
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

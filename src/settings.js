import Symbols from './symbols.js';
import katex from '../lib/katex/katex-modified.min.js';

var Settings = {}
Settings.config = {};
Settings.config.events = {};
Settings.config.valid_events = ["change","left_end","right_end","done","completion","debug","error","focus"];
Settings.config.settings = {
    "autoreplace":"auto",
    "empty_content":"\\blue{[?]}",
    "blank_caret":"",
    "blank_placeholder":"[?]",
    "blacklist":[],
    "buttons":["osk","settings","symbols","controls"],
    "cliptype":"latex",
};

Settings.settings_options = {
    "autoreplace":["auto","whole","delay","none"],
    "cliptype":["latex","text","xml","ast","asciimath"],
};

Settings.panels = {};
Settings.panels.controls = document.createElement("div");
Settings.panels.controls.setAttribute("class","guppy_help");
Settings.panels.controls.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
Settings.panels.controls.innerHTML = "<p>Start typing the name of a mathematical function to automatically insert it.  </p><p>(For example, \"sqrt\" for root, \"mat\" for matrix, or \"defi\" for definite integral.)</p>\n\
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>\n\
<h3>Controls</h3><table id=\"guppy_help_table\"><tr><td><b>Press...</b></td><td><b>...to do</b></td></tr></table>";

Settings.panels.symbols = document.createElement("div");
Settings.panels.symbols.setAttribute("class","guppy_help");
Settings.panels.symbols.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
Settings.panels.symbols.innerHTML = "<p>Start typing the name of a mathematical function to automatically insert it.  </p><p>(For example, \"sqrt\" for root, \"mat\" for matrix, or \"defi\" for definite integral.)</p>\n\
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>\n\
<h3>Symbols</h3><table id=\"guppy_syms_table\"><tr><td><b>Type...</b></td><td><b>...to get</b></td></tr></table>";

Settings.panels.settings = document.createElement("div");
Settings.panels.settings.setAttribute("class","guppy_help");
Settings.panels.settings.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
Settings.panels.settings.innerHTML = "<p>Global settings: </p>\n\
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>\n\
<h3>Settings</h3><table id=\"guppy_settings_table\"></table>";

Settings.div_names = ["controls","symbols","settings"];

var make_row = function(table_id, c1, c2){
    var row = document.createElement("tr");
    row.innerHTML = "<td><font face=\"monospace\">"+c1+"</font></td><td>"+c2+"</td>";
    document.getElementById(table_id).appendChild(row);
    return row;
}

var make_x = function(elt){
    var x = document.createElement("div");
    x.setAttribute("class","guppy-card-x");
    x.innerHTML = "<font size=\"6pt\">&times;</font>";
    x.style = "cursor:pointer;position:absolute;top:0;right:0;padding-right:5px;line-height:1;";
    x.onclick = function(){ elt.style.display = "none"; }
    elt.appendChild(x);
}

Settings.hide_all = function(){
    for(var i = 0; i < Settings.div_names.length; i++)
        Settings.panels[Settings.div_names[i]].style.display = "none";
}

Settings.toggle = function(card, g){
    if(Settings.div_names.indexOf(card) >= 0){
        Settings.init_card(card, g);
        if(Settings.panels[card].style.display == "none"){
            Settings.hide_all();
            var r = g.editor.getBoundingClientRect();
            Settings.panels[card].style.top = (r.bottom+document.documentElement.scrollTop) + "px";
            Settings.panels[card].style.left = (r.left+document.documentElement.scrollLeft) + "px";
            Settings.panels[card].style.display = "block";
        }
        else{
            Settings.hide_all();
        }
    }
}

Settings.init_card = function(card, g){
    if(card == "settings"){
        document.getElementById("guppy_settings_table").innerHTML = "";
        for(var s in Settings.settings_options){
            var opt = Settings.settings_options[s];
            var val = g.engine.setting(s);
            var sel = document.createElement("select");
            sel.setAttribute("selected", val);
            sel.setAttribute("id","guppy_settings_select_"+s);
            sel.onchange = function(ss){
                return function(){
                    Settings.config.settings[ss] = document.getElementById("guppy_settings_select_"+ss).value;
                }
            }(s);
            for(var i = 0; i < opt.length; i++){
                var o = document.createElement("option");
                o.setAttribute("value",opt[i]);
                o.innerHTML = opt[i];
                sel.appendChild(o);
            }
            var row = document.createElement("tr");
            row.innerHTML = "<td><font face=\"monospace\">"+s+"</font></td>";
            var td = document.createElement("td");
            td.appendChild(sel);
            row.appendChild(td);
            document.getElementById("guppy_settings_table").appendChild(row);
        }
    }
}

Settings.init = function(symbols){
    for(var i = 0; i < Settings.div_names.length; i++){
        make_x(Settings.panels[Settings.div_names[i]]);
        document.body.appendChild(Settings.panels[Settings.div_names[i]])
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
        var latex = Symbols.add_blanks(symbols[s].output.latex, "\\blue{[?]}");
        var row = make_row("guppy_syms_table",s," ");
        katex.render(latex, row.lastChild);
    }
}

export default Settings;

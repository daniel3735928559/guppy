var katex = require('../lib/katex/katex-modified.min.js');

/**
    @class
    @classdesc To enable the on-screen keyboard, ensure all Guppy
    instances have been initialised and then create a new GuppyOSK
    object with `new GuppyOSK()`.  This will cause any instances of
    the editor to, when focused, create an on-screen keyboard at the
    bottom of the screen with tabs for the various groups of symbols.
    @param {Object} [config] - Configuration options for the on-screen keyboard
    @param {string} [config.goto_tab] - The name of the group whose
    tab the keyboard should jump to every time a key is pressed.
    For example, the value `"abc"` will cause the keyboard to revert
    to the lower-case alphanumeric tab every time a key is pressed.
    @param {string} [config.attach] - A string describing how the
    keyboard should be attached to the editor.  Currently, the only
    supported value is `"focus"`, meaning the keyboard will be
    attached when the editor is focused and detached when unfocused.
    If this value is absent, the OSK button in the editor will be the
    only way to trigger it.
    @constructor
*/
var GuppyOSK = function(config){
    this.config = config || {};
    this.guppy = null;
    this.element = null;
}

GuppyOSK.blank = "\\blue{[?]}";
GuppyOSK.text_blank = "[?]";

function elt(name, attrs, content){
    var ans = document.createElement(name);
    if(attrs) for(var a in attrs) ans.setAttribute(a,attrs[a]);
    if(content) ans.innerHTML = content;
    return ans;
}

function click_listener(elt, fn){
    elt.addEventListener("click", fn, false);
    elt.addEventListener("touchstart", fn, false);
}

function make_tabs(element){
    var headers = element.querySelectorAll("li a");
    var tabs = element.getElementsByClassName("guppy_osk_group");
    tabs[0].style.display = "block";
    headers[0].classList.add("active_tab");
    for(var j = 0; j < headers.length; j++){
        if(j != 0) tabs[j].style.display = "none";
        var header = headers[j];
        click_listener(header, function(e){
            for(var i = 0; i < headers.length; i++){
                tabs[i].style.display = "none";
                headers[i].classList.remove("active_tab");
            }
            e.target.classList.add("active_tab")
            element.querySelector(e.target.getAttribute("href")).style.display = "block";
            e.preventDefault();
            return false;
        });
    }
}

/**
    Detach the keyboard from the currently attached editor (if any)
    and hide it.
    @memberof GuppyOSK
*/
GuppyOSK.prototype.detach = function(guppy){
    if(this.element){
        if((!guppy && this.guppy) || this.guppy == guppy){
            document.body.removeChild(this.element);
            this.guppy = null;
            this.element = null;
        }
    }
}

/**
    Attach the keyboard to a Guppy instance and display it.
    @param {Guppy} [guppy] - The instance of Guppy to which the
    keyboard will attach.
    @memberof GuppyOSK
*/
GuppyOSK.prototype.attach = function(guppy){
    var self = this;
    var s = null;
    if(this.guppy == guppy) return;
    if(this.guppy){
        document.body.removeChild(this.element);
        this.element = null;
        this.guppy = null;
    }

    var syms = guppy.engine.symbols;
    var osk = elt("div",{"class":"guppy_osk"});
    var sym_tabs = elt("div",{"class":"keys tabbed"});
    var controls = elt("div",{"class":"controls"});
    var tab_bar = elt("ul");
    sym_tabs.appendChild(tab_bar);
    var grouped = {"qwerty":[],"QWERTY":[]};
    var abc = "1234567890+-=\n\tqwertyuiop*/\n\t\tasdfghjkl.\n\t\t\tzxcvbnm"
    for(var i = 0; i < abc.length; i++){
        if(abc[i] == "\n"){
            grouped["qwerty"].push({"break":true});
            grouped["QWERTY"].push({"break":true});
        }
        else if(abc[i] == "\t"){
            grouped["qwerty"].push({"tab":true});
            grouped["QWERTY"].push({"tab":true});
        }
        else if(abc[i] == "*"){
            grouped["qwerty"].push({"name":"*","latex":"\\cdot"});
            grouped["QWERTY"].push({"name":"*","latex":"\\cdot"});
        }
        else if(abc[i] == "/"){
            grouped["qwerty"].push({"name":"/","latex":"/"});
            grouped["QWERTY"].push({"name":"/","latex":"/"});
        }
        else{
            var latex = abc[i];
            var upper_latex = latex.toUpperCase();
            var name = abc[i];
            if(latex == "."){
                latex = "."+GuppyOSK.blank;
                upper_latex = latex;
            }
            grouped["qwerty"].push({"name":name, "latex":latex});
            grouped["QWERTY"].push({"name":name.toUpperCase(), "latex":upper_latex});
        }
    }
    for(s in syms){
        var group = syms[s].attrs.group;
        if(!grouped[group]) grouped[group] = [];
        var display = s == "text" ? GuppyOSK.text_blank : syms[s].output.latex.replace(/\{\$[0-9]+(\{[^}]+\})*\}/g, GuppyOSK.blank);
        grouped[group].push({"name":s,"latex":display});
    }
    var matrix_controls = null;
    for(var g in grouped){
        var group_container = elt("div",{"class":"guppy_osk_group","id":g});
        var group_elt = elt("div",{"class":"guppy_osk_group_box","id":g});
        if(g == "array") matrix_controls = group_elt;
        tab_bar.appendChild(elt("li",{},"<a href='#"+g+"' id='guppy_osk_"+g+"_tab'>"+g+"</a>"));
        for(s in grouped[g]){
            var sym = grouped[g][s];
            if(sym['break']){
                group_elt.appendChild(elt("br"));
            }
            else if(sym['tab']){
                group_elt.appendChild(elt("span",{"class":"spacer"}));
            }
            else{
                var key = elt("span",{"class":"guppy_osk_key"});
                var f = null;
                if(g == "qwerty" || g == "QWERTY"){
                    f = function(n){
                        click_listener(key, function(e){
                            e.preventDefault();
                            guppy.engine.insert_string(n);
                            guppy.render();
                            if(self.config.goto_tab){
                                document.getElementById("guppy_osk_"+self.config.goto_tab+"_tab").click();
                            }
                            e.preventDefault();
                            return false;
                        });
                    };
                    f(sym.name);
                } else {
                    f = function(n){
                        click_listener(key, function(e){
                            e.preventDefault();
                            guppy.engine.insert_symbol(n);
                            guppy.render();
                            if(self.config.goto_tab){
                                document.getElementById("guppy_osk_"+self.config.goto_tab+"_tab").click();
                            }
                            e.preventDefault();
                            return false;
                        });
                    };
                    f(sym.name);
                }
                group_elt.appendChild(key);
                katex.render(sym.latex, key);
            }
        }
        group_container.appendChild(group_elt);
        sym_tabs.appendChild(group_container);
    }
    make_tabs(sym_tabs);
    osk.appendChild(sym_tabs);

    var add_control = function(content,fn){
        var e = elt("span",{"class":"guppy_osk_key"},content);
        click_listener(e, fn);
        controls.appendChild(e);
    }

    var add_matrix_control = function(content,fn){
        var e = elt("span",{"class":"guppy_osk_key"}, content);
        click_listener(e, fn);
        matrix_controls.appendChild(e);
        //katex.render(content, e);
    }

    add_control("&larr;S", function(e){ e.preventDefault();guppy.engine.sel_left();guppy.render();});
    add_control("S&rarr;", function(e){ e.preventDefault();guppy.engine.sel_right();guppy.render();});
    add_control("cut", function(e){ e.preventDefault();guppy.engine.sel_cut();guppy.render();});
    add_control("copy", function(e){ e.preventDefault();guppy.engine.sel_copy();guppy.render();});
    add_control("paste", function(e){ e.preventDefault();guppy.engine.sel_paste();guppy.render();});
    add_control("undo", function(e){ e.preventDefault();guppy.engine.undo();guppy.render();});
    add_control("redo", function(e){ e.preventDefault();guppy.engine.redo();guppy.render();});
    add_control("del", function(e){ e.preventDefault();guppy.engine.backspace();guppy.render();});
    add_control("spc", function(e){ e.preventDefault();guppy.engine.spacebar();guppy.render();});
    add_control("tab", function(e){ e.preventDefault();guppy.engine.tab();guppy.render();});
    add_control("ret", function(e){ e.preventDefault();guppy.engine.done();guppy.render();});
    add_control("&larr;", function(e){ e.preventDefault();guppy.engine.left();guppy.render();});
    add_control("&uarr;", function(e){ e.preventDefault();guppy.engine.up();guppy.render();});
    add_control("&darr;", function(e){ e.preventDefault();guppy.engine.down();guppy.render();});
    add_control("&rarr;", function(e){ e.preventDefault();guppy.engine.right();guppy.render();});

    matrix_controls.appendChild(elt("br"));
    add_matrix_control("&larr;+col", function(e){ e.preventDefault();guppy.engine.list_extend_left();guppy.render();});
    add_matrix_control("+col&rarr;", function(e){ e.preventDefault();guppy.engine.list_extend_right();guppy.render();});
    add_matrix_control("&uarr;+row", function(e){ e.preventDefault();guppy.engine.list_extend_up();guppy.render();});
    add_matrix_control("&darr;+row", function(e){ e.preventDefault();guppy.engine.list_extend_down();guppy.render();});
    add_matrix_control("col&larr;col", function(e){ e.preventDefault();guppy.engine.list_extend_copy_left();guppy.render();});
    add_matrix_control("col&rarr;col", function(e){ e.preventDefault();guppy.engine.list_extend_copy_right();guppy.render();});
    add_matrix_control("row&uarr;row", function(e){ e.preventDefault();guppy.engine.list_extend_copy_up();guppy.render();});
    add_matrix_control("row&darr;row", function(e){ e.preventDefault();guppy.engine.list_extend_copy_down();guppy.render();});
    add_matrix_control("-col", function(e){ e.preventDefault();guppy.engine.list_remove();guppy.render();});
    add_matrix_control("-row", function(e){ e.preventDefault();guppy.engine.list_remove_row();guppy.render();});

    osk.appendChild(controls);
    document.body.appendChild(osk);

    this.guppy = guppy;
    this.element = osk;
}

module.exports = GuppyOSK;

import katex from '../lib/katex/katex-modified.min.js';

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
    elt.addEventListener("touchend", fn, false);
}

GuppyOSK.lasttap = 0;

function make_tabs(tabbar, element){
    var headers = tabbar.querySelectorAll("li a");
    var tabs = element.getElementsByClassName("guppy_osk_group");
    tabs[0].style.display = "block";
    headers[0].classList.add("active_tab");
    for(var j = 0; j < headers.length; j++){
        if(j != 0) tabs[j].style.display = "none";
        var header = headers[j];
        click_listener(header, function(e){
            // var now = new Date().getTime();
            // var timesince = now - GuppyOSK.lasttap;
            // var doubletap = false;
            // if((timesince < 600) && (timesince > 100)) doubletap = true;
            //GuppyOSK.lasttap = now;
            
            var target = e.target;
            while(target.tagName.toLowerCase() != "a") target = target.parentNode;
            for(var i = 0; i < headers.length; i++){
                tabs[i].style.display = "none";
                headers[i].classList.remove("active_tab");
            }
            target.classList.add("active_tab");
            element.querySelector(target.getAttribute("href")).style.display = "block";
            // if(doubletap){
            //         let tabname = target.getAttribute("href").substring(1);
            //         for(var i = 0; i < headers.length; i++){
            //         headers[i].classList.remove("fav_tab");
            //         }
            //         target.classList.add("fav_tab");
            //         GuppyOSK.config.goto_tab = tabname;
            // }
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
            this.element.parentElement.removeChild(this.element);
            this.guppy = null;
            this.element = null;
        }
    }
}

GuppyOSK.group_headers = {"arithmetic":"123",
                          "qwerty":"abc",
                          "QWERTY":"ABC",
                          "trigonometry":"\\cos",
                          "functions":"\\sqrt{x}",
                          "editor":"\\text{abc}",
                          "calculus":"\\int",
                          "array":"\\langle\\hspace{2pt}\\rangle",
                          "operations":"\\leq",
                          "emoji":"\\char\"263A",
                          "greek":"\\pi"
                         }

GuppyOSK.str_to_syms = function(s){
    var ans = [];
    for(var i = 0; i < s.length; i++){
        if(s[i] == "\n") ans.push({"break":true});
        else if(s[i] == "\t") ans.push({"tab":true});
        else if(s[i] == "*") ans.push({"name":"*","latex":"\\cdot"});
        else if(s[i] == "/") ans.push({"name":"/","latex":"/"});
        else{
            let latex = s[i];
            const name = s[i];
            if(latex == ".") latex = "."+GuppyOSK.blank;
            ans.push({"name":name, "latex":latex});
        }
    }
    return ans;
}

/**
    Attach the keyboard to a Guppy instance and display it.
    @param {Guppy} [guppy] - The instance of Guppy to which the
    keyboard will attach.
    @param {Element} [target] - Optional parent target element to
    attach the OSK to.
    @memberof GuppyOSK
*/
GuppyOSK.prototype.attach = function(guppy, target){
    var self = this;
    var s = null;
    if(this.guppy == guppy) return;
    if(this.guppy){
        this.element.parentElement.removeChild(this.element);
        this.element = null;
        this.guppy = null;
    }

    var syms = guppy.engine.symbols;
    var osk = elt("div",{"class":"guppy_osk"});
    var sym_tabs = elt("div",{"class":"keys tabbed"});
    var controls = elt("div",{"class":"controls"});
    var tab_bar_div = elt("div",{"class":"tabbar"});
    var tab_bar = elt("ul");
    // tab_bar.addEventListener("touchmove",function(e){
    // 	var touchobj = e.changedTouches[0];
    // 	var n = touchobj.target;
	
    // });
    var sl = elt("div",{"class":"scroller-left disabled"},"<i class=\"left\"></i>");
    var sr = elt("div",{"class":"scroller-right"},"<i class=\"right\"></i>");
    click_listener(sl,function(){tab_bar.scrollLeft -= 100;});
    click_listener(sr,function(){tab_bar.scrollLeft += 100;});
    tab_bar.addEventListener("scroll",function(){
        if(tab_bar.scrollLeft <= 0) sl.className = "scroller-left disabled";
        else sl.className = "scroller-left";
        if(tab_bar.scrollLeft+tab_bar.offsetWidth >= tab_bar.scrollWidth) sr.className = "scroller-right disabled";
        else sr.className = "scroller-right";
    });
    tab_bar_div.appendChild(sl);
    tab_bar_div.appendChild(tab_bar);
    tab_bar_div.appendChild(sr);
    osk.appendChild(tab_bar_div);
    var arith = "1234\t+-\n5678\t*/\n90.x\tyz";
    var abc = "qwertyuiop\nasdfghjkl\nzxcvbnm"
    var grouped = {
        "arithmetic":GuppyOSK.str_to_syms(arith),
        "qwerty":GuppyOSK.str_to_syms(abc),
        "QWERTY":GuppyOSK.str_to_syms(abc.toUpperCase())
    };
    for(s in syms){
        var group = syms[s].attrs.group;
        if(!grouped[group]) grouped[group] = [];
        var display = "";
        if(s == "text")
            display = GuppyOSK.text_blank
        else
            display = syms[s].output.latex.replace(/\{\$[0-9]+(\{[^}]+\})*\}/g, GuppyOSK.blank);
        if(group == "calculus" || group == "functions")
            display = "\\small " + display;
        grouped[group].push({"name":s,"latex":display});
    }
    var matrix_controls = null;
    for(var g in grouped){
        var group_container = elt("div",{"class":"guppy_osk_group","id":g});
        var group_elt = elt("div",{"class":"guppy_osk_group_box","id":g});
        if(g == "array") matrix_controls = group_elt;
        var link = elt("a",{"href":`#${g}`,"id":`guppy_osk_${g}_tab`})
        katex.render(GuppyOSK.group_headers[g], link);
        var li = elt("li",{"class":"guppy_osk_tab","id":`guppy_osk_tab_${g}`});
        li.appendChild(link);
        tab_bar.appendChild(li);
        for(s in grouped[g]){
            var sym = grouped[g][s];
            if (typeof sym != 'function' && typeof sym.name == 'string') {
                if (sym['break']) {
                    group_elt.appendChild(elt("br"));
                }
                else if (sym['tab']) {
                    group_elt.appendChild(elt("span", {"class": "spacer"}));
                }
                else {
                    var key = elt("span", {"class": "guppy_osk_key"});
                    var f = null;
                    f = function (n, gn) {
                        click_listener(key, function (e) {
                            e.preventDefault();
                            if (gn == "arithmetic" || gn == "qwerty" || gn == "QWERTY") guppy.engine.insert_string(n);
                            else guppy.engine.insert_symbol(n);
                            guppy.render();
                            if (self.config.goto_tab) {
                                document.getElementById("guppy_osk_" + self.config.goto_tab + "_tab").click();
                            }
                            e.preventDefault();
                            return false;
                        });
                    };
                    f(sym.name, g);
                    group_elt.appendChild(key);
                    katex.render(sym.latex, key, {displayMode: false});
                }
            }
        }
        group_container.appendChild(group_elt);
        sym_tabs.appendChild(group_container);
    }
    make_tabs(tab_bar, sym_tabs);
    osk.appendChild(sym_tabs);

    var add_control = function(content,fn, classes){
        var e = elt("span",{"class":"guppy_osk_key" + (classes ? " "+classes : "")},content);
        click_listener(e, fn);
        controls.appendChild(e);
    }

    var add_matrix_control = function(content,fn){
        var e = elt("span",{"class":"guppy_osk_key"}, content);
        click_listener(e, fn);
        matrix_controls.appendChild(e);
        //katex.render(content, e);
    }

    add_control("✄", function(e){ e.preventDefault();guppy.engine.sel_cut();guppy.render();}, "med_key"); // U2704
    add_control("📋", function(e){ e.preventDefault();guppy.engine.sel_copy();guppy.render();}, "med_key"); // u1f4cb 
    add_control("⎘", function(e){ e.preventDefault();guppy.engine.sel_paste();guppy.render();}, "med_key"); // U2398
    add_control("↶", function(e){ e.preventDefault();guppy.engine.undo();guppy.render();}, "med_key"); // u21b6
    add_control("↷", function(e){ e.preventDefault();guppy.engine.redo();guppy.render();}, "med_key"); // u21b7
    add_control("⌫", function(e){ e.preventDefault();guppy.engine.backspace();guppy.render();}, "med_key"); // u232b
    // add_control("spc", function(e){ e.preventDefault();guppy.engine.spacebar();guppy.render();});
    // add_control("tab", function(e){ e.preventDefault();guppy.engine.tab();guppy.render();});
    add_control("¤", function(e){ e.preventDefault();guppy.constructor.get_raw_input();}, "med_key"); // u00a4
    add_control("✔", function(e){ e.preventDefault();guppy.engine.done();guppy.render();}, "med_key"); // u2714
    controls.appendChild(elt("br"));
    add_control("&larr;", function(e){ e.preventDefault();guppy.engine.left();guppy.render();}, "long_key");
    add_control("&larr;S", function(e){ e.preventDefault();guppy.engine.sel_left();guppy.render();}, "long_key");
    add_control("S&rarr;", function(e){ e.preventDefault();guppy.engine.sel_right();guppy.render();}, "long_key");
    add_control("&rarr;", function(e){ e.preventDefault();guppy.engine.right();guppy.render();}, "long_key");
    
    // add_control("&uarr;", function(e){ e.preventDefault();guppy.engine.up();guppy.render();});
    // add_control("&darr;", function(e){ e.preventDefault();guppy.engine.down();guppy.render();});

    if (matrix_controls) {
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
    }

    osk.appendChild(controls);
    if (target) {
        target.appendChild(osk);
    } else {
        document.body.appendChild(osk);
    }

    this.guppy = guppy;
    this.element = osk;
}

export default GuppyOSK;

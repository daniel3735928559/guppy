function GuppyOSK(config){
    var self = this;
    for(var gid in Guppy.instances){
	var g = Guppy.instances[gid];
	var f = function(guppy){
	    guppy.backend.events.focus = function(c){
		if(c.focused) self.attach(guppy);
		else self.detach(guppy);
	    }
	};
	f(g);
    }
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
    elt.addEventListener("click", fn);
    elt.addEventListener("touchstart", fn);
}

function make_tabs(element){
    var headers = element.querySelectorAll("li a");
    var tabs = element.getElementsByTagName("div");
    tabs[0].style.display = "block";
    headers[0].classList.add("active_tab");
    for(var j = 0; j < headers.length; j++){
        if(j != 0) tabs[j].style.display = "none";
	header = headers[j];
	click_listener(header, function(e){
	    for(var i = 0; i < headers.length; i++){
		tabs[i].style.display = "none";
		headers[i].classList.remove("active_tab");
	    }
	    e.target.classList.add("active_tab")
	    element.querySelector(e.target.getAttribute("href")).style.display = "block";
	});
    }
    
}

GuppyOSK.prototype.detach = function(guppy){
    if(this.guppy == guppy){
	document.body.removeChild(this.element);
	this.guppy = null;
	this.element = null;
    }
}

GuppyOSK.prototype.attach = function(guppy){
    var self = this;
    if(this.guppy == guppy) return;
    if(this.guppy){
	document.body.removeChild(this.element);
	this.element = null;
	this.guppy = null;
    }
    
    var syms = guppy.backend.symbols;
    var osk = elt("div",{"class":"guppy_osk"});
    var sym_tabs = elt("div",{"class":"keys tabbed"});
    var controls = elt("div",{"class":"controls"});
    var tab_bar = elt("ul");
    sym_tabs.appendChild(tab_bar);
    var grouped = {"abc":[],"ABC":[]};
    var abc = "0123456789abcdefghijklmnopqrstuvwxyz.=+-"
    for(var i = 0; i < abc.length; i++){
	var latex = abc[i];
	var upper_latex = latex.toUpperCase();
	var name = abc[i];
	if(latex == "."){
	    latex = "."+GuppyOSK.blank;
	    upper_latex = latex;
	}
	grouped["abc"].push({"name":name, "latex":latex});
	grouped["ABC"].push({"name":name.toUpperCase(), "latex":upper_latex});
    }
    for(var s in syms){
	var group = syms[s].group;
	if(!grouped[group]) grouped[group] = [];
	var display = s == "text" ? GuppyOSK.text_blank : syms[s].output.latex.replace(/\{\$[0-9]+\}/g, GuppyOSK.blank);
	grouped[group].push({"name":s,"latex":display});
    }
    for(var g in grouped){
	var group_elt = elt("div",{"class":"guppy_osk_group","id":g});
	tab_bar.appendChild(elt("li",{},"<a href='#"+g+"' id='guppy_osk_"+g+"_tab'>"+g+"</a>"));
	for(var s in grouped[g]){
	    var sym = grouped[g][s];
	    var key = elt("span",{"class":"guppy_osk_key"});
	    if(g == "abc" || g == "ABC"){
		var f = function(n){
		    click_listener(key, function(e){
			e.preventDefault();
			guppy.backend.insert_string(n);
			guppy.render();
			if(self.config.goto_tab){
			    document.getElementById("guppy_osk_"+self.config.goto_tab+"_tab").click();
			}
		    });
		};
		f(sym.name);
	    } else {
		var f = function(n){
		    click_listener(key, function(e){
			e.preventDefault();
			guppy.backend.insert_symbol(n);
			guppy.render();
			if(self.config.goto_tab){
			    document.getElementById("guppy_osk_"+self.config.goto_tab+"_tab").click();
			}
		    });
		};
		f(sym.name);
	    }
	    group_elt.appendChild(key);
	    katex.render(sym.latex, key);
	}
	sym_tabs.appendChild(group_elt);
    }
    make_tabs(sym_tabs);
    osk.appendChild(sym_tabs);

    var add_control = function(content,fn){
	var e = elt("span",{"class":"guppy_osk_key"},content);
	click_listener(e, fn);
	controls.appendChild(e);
    }
    
    add_control("&larr;S", function(e){ e.preventDefault();guppy.backend.sel_left();guppy.render();});
    add_control("S&rarr;", function(e){ e.preventDefault();guppy.backend.sel_right();guppy.render();});
    add_control("cut", function(e){ e.preventDefault();guppy.backend.sel_cut();guppy.render();});
    add_control("copy", function(e){ e.preventDefault();guppy.backend.sel_copy();guppy.render();});
    add_control("paste", function(e){ e.preventDefault();guppy.backend.sel_paste();guppy.render();});
    add_control("undo", function(e){ e.preventDefault();guppy.backend.undo();guppy.render();});
    add_control("redo", function(e){ e.preventDefault();guppy.backend.redo();guppy.render();});
    add_control("del", function(e){ e.preventDefault();guppy.backend.backspace();guppy.render();});
    add_control("spc", function(e){ e.preventDefault();guppy.backend.spacebar();guppy.render();});
    add_control("ret", function(e){ e.preventDefault();guppy.backend.done();guppy.render();});
    add_control("&larr;", function(e){ e.preventDefault();guppy.backend.left();guppy.render();});
    add_control("&uarr;", function(e){ e.preventDefault();guppy.backend.up();guppy.render();});
    add_control("&darr;", function(e){ e.preventDefault();guppy.backend.down();guppy.render();});
    add_control("&rarr;", function(e){ e.preventDefault();guppy.backend.right();guppy.render();});
    
    osk.appendChild(controls);
    document.body.appendChild(osk);

    this.guppy = guppy;
    this.element = osk;
}

Mousetrap = require('mousetrap');
katex = require('../lib/katex/katex-modified.min.js');

String.prototype.splice = function(idx, s){ return (this.slice(0,idx) + s + this.slice(idx)); };
String.prototype.splicen = function(idx, s, n){ return (this.slice(0,idx) + s + this.slice(idx+n));};
String.prototype.search_at = function(idx, s){ return (this.substring(idx-s.length,idx) == s); };

var Guppy = function(guppy_div, config){
    var self = this;
    var config = config || {};
    var events = config['events'] || {}
    var options = config['options'] || {};

    if(typeof guppy_div === 'string' || guppy_div instanceof String){
	guppy_div = document.getElementById(guppy_div);
    }
    
    // Set the id on the div if it is not currently set.
    if(!(guppy_div.id)){
	var i = Guppy.max_uid || 0;
	while(document.getElementById("guppy_uid_"+i)) i++;
	Guppy.max_uid = i;
	guppy_div.id = "guppy_uid_"+i;
    }
    var i = Guppy.max_tabIndex || 0;
    guppy_div.tabIndex = i;
    Guppy.max_tabIndex = i+1;
    
    this.editor_active = true;
    this.empty_content = "\\color{red}{[?]}"
    this.editor = guppy_div;
    this.blacklist = [];
    this.autoreplace = true;
    this.ready = false;

    this.events = {};
    
    var evts = ["ready", "change", "left_end", "right_end", "done", "completion", "debug", "error", "focus"];
    
    for(var i = 0; i < evts.length; i++){
	var e = evts[i];
	if(e in events) this.events[e] = e in events ? events[e] : null;
    }

    var opts = ["blank_caret", "empty_content", "blacklist", "autoreplace"];
    
    for(var i = 0; i < opts.length; i++){
	var p = opts[i];
	if(p in options) this[p] = options[p];
    }
	
    this.base =  (new window.DOMParser()).parseFromString('xml_content' in options ? options.xml_content : "<m><e></e></m>", "text/xml");
    
    Guppy.instances[guppy_div.id] = this;
    
    this.clipboard = null;
    this.current = this.base.documentElement.firstChild;
    this.temp_cursor = {"node":null,"caret":0}
    if(!this.current.firstChild) this.current.appendChild(this.base.createTextNode(""));
    this.caret = 0;
    this.space_caret = 0;
    this.sel_start = null;
    this.sel_end = null;
    this.undo_data = [];
    this.undo_now = -1;
    this.sel_status = Guppy.SEL_NONE;
    this.checkpoint();
    this.editor.addEventListener("keydown",Guppy.key_down, false);
    this.editor.addEventListener("keyup",Guppy.key_up, false);
    this.editor.addEventListener("focus", function(e) { Guppy.kb.alt_down = false; if(self.activate) self.activate();}, false);
    if(Guppy.ready && !this.ready){
    	this.ready = true;
    	this.fire_event("ready");
	this.render(true);
    }
    this.deactivate();
    this.recompute_locations_paths();
}

Guppy.prototype.get_content = function(t){
    if(t != "xml") return Guppy.transform(t,this.base);
    else return (new XMLSerializer()).serializeToString(this.base);
}

Guppy.prototype.set_content = function(xml_data){
    this.base = (new window.DOMParser()).parseFromString(xml_data, "text/xml");
    this.clipboard = null;
    var l = this.base.getElementsByTagName("e");
    for(var i = 0; i < l.length; i++){
	if(!(l[i].firstChild)) l[i].appendChild(this.base.createTextNode(""));
    }
    this.current = this.base.documentElement.firstChild;
    this.caret = 0;
    this.sel_start = null;
    this.sel_end = null;
    this.undo_data = [];
    this.undo_now = -1;
    this.sel_status = Guppy.SEL_NONE;
    this.checkpoint();
}


Guppy.instances = {};
Guppy.ready = false;

Guppy.active_guppy = null;

Guppy.SEL_NONE = 0;
Guppy.SEL_CURSOR_AT_START = 1;
Guppy.SEL_CURSOR_AT_END = 2;

Guppy.is_blank = function(n){
    return n.firstChild == null || n.firstChild.nodeValue == '';
}

Guppy.get_symbols = function(symbols, callback){
    var all_ready = function(){
	Guppy.register_keyboard_handlers();
	for(var i in Guppy.instances){
	    Guppy.instances[i].ready = true;
	    Guppy.instances[i].render(true);
	    Guppy.instances[i].fire_event("ready")
	    Guppy.instances[i].events["ready"] = null;
	}
	Guppy.ready = true;
	if(callback) callback();
    }
    var get_builtins = function(callback){
	var greek_syms = ["alpha","beta","gamma","delta","epsilon","zeta","eta","theta","iota","kappa","lambda","mu","nu","xi","omicron","pi","rho","sigma","tau","upsilon","phi","chi","psi","omega","Gamma","Delta","Theta","Lambda","Xi","Pi","Sigma","Phi","Psi","Omega"];
	var raw_syms = ["leq","geq","infty"];
	var func_syms = ["sin","cos","tan","sec","csc","cot","log","ln"];
	var other_syms = {"less":["<","<"],"greater":[">",">"]};
	
	for(var i = 0; i < greek_syms.length; i++){
	    Guppy.symb_raw(greek_syms[i],"{\\"+greek_syms[i]+"}"," $"+greek_syms[i]+" ");
	}
	
	for(var i = 0; i < raw_syms.length; i++){
	    Guppy.symb_raw(raw_syms[i],"{\\"+raw_syms[i]+"}"," "+raw_syms[i]+" ");
	}
	
	for(var i = 0; i < func_syms.length; i++){
	    Guppy.symb_func(func_syms[i]);
	}
	
	for(var i in other_syms){
	    Guppy.symb_raw(i, other_syms[i][0], other_syms[i][1]);
	}
    
	Guppy.symb_raw("*","\\cdot ","*");
	if(callback) callback();
    }

    if(!(Array.isArray(symbols))){
	symbols = [symbols];
    }
    var answers = [];
    var calls = [];
    var set_symbols = function(){
	for(var i = 0; i < answers.length; i++){
	    for(var s in answers[i]){
		Guppy.kb.symbols[s] = answers[i][s];
	    }
	}
	if(callback) callback();
    }
    for(var i = 0; i < symbols.length; i++){
	answers.push(null);
	if(symbols[i] == "builtins"){
	    calls.push(get_builtins);
	    continue;
	}
	var x = function outer(j){
	    return function(callback){
		var req = new XMLHttpRequest();
		req.onload = function(){
		    var syms = JSON.parse(this.responseText);
		    for(var s in syms){
			Guppy.kb.symbols[s] = syms[s];
		    }
		    callback();
		};
		req.open("get", symbols[j], true);
		req.send();
	    }
	}(i);
	calls.push(x);
    }
    calls.push(all_ready);
    var j = 0;
    var cb = function(){
	j += 1;
	if(j < calls.length) calls[j](cb);
    }
    if(calls.length > 0) calls[0](cb);
}

Guppy.transform = function(t, base, r){
    return Guppy.manual_render(base,t,base.documentElement,r);
}

Guppy.bracket_xpath = "(count(./*) != 1 and not \
		          ( \
                            count(./e)=2 and \
			    count(./f)=1 and \
			    count(./e[string-length(text())=0])=2 and \
			    ( \
			      (\
                                count(./f/c)=1 and\
			        count(./f/c[@is_bracket='yes'])=1\
			      )\
			      or\
			      (\
			        f/@c='yes' and \
				count(./e[@current='yes'])=0 and \
				count(./e[@temp='yes'])=0 \
			      )\
			    )\
			  )\
			)  \
			or\
		        (\
			  count(./*) = 1 and \
			  string-length(./e/text()) != 1 and \
			  number(./e/text()) != ./e/text() \
			) \
			or \
		        ( \
			  count(./*) = 1 and \
			  ./e/@current = 'yes' \
			) \
			or \
		        ( \
			  count(./*) = 1 and \
			  ./e/@temp = 'yes' \
			)"

Guppy.manual_render = function(base,t,n,r){
    var ans = "";
    if(n.nodeName == "e"){
	if(t == "latex" && r){
	    ans = n.getAttribute("render");
	}
	else{
	    ans = n.firstChild.textContent;
	}
    }
    else if(n.nodeName == "f"){
	for(var nn = n.firstChild; nn != null; nn = nn.nextSibling){
	    if(nn.nodeName == "b" && nn.getAttribute("p") == t){
		ans = Guppy.manual_render(base,t,nn,r);
		break;
	    }
	}
    }
    else if(n.nodeName == "b"){
	var cs = []
	var i = 1;
	var par = n.parentNode;
	for(var nn = par.firstChild; nn != null; nn = nn.nextSibling)
	    if(nn.nodeName == "c" || nn.nodeName == "l") cs[i++] = Guppy.manual_render(base,t,nn,r);
	for(var nn = n.firstChild; nn != null; nn = nn.nextSibling){
	    if(nn.nodeType == 3) ans += nn.textContent;
	    else if(nn.nodeType == 1){
		if(nn.hasAttribute("d")){
		    var dim = parseInt(nn.getAttribute("d"));
		    var joiner = function(d,l){
			if(d > 1) for(var k = 0; k < l.length; k++) l[k] = joiner(d-1,l[k]);
			return l.join(nn.getAttribute('sep'+(d-1)));
		    }
		    ans += joiner(dim,cs[parseInt(nn.getAttribute("ref"))]);
		}
		else ans += cs[parseInt(nn.getAttribute("ref"))];
	    }
	}
    }
    else if(n.nodeName == "l"){
	ans = [];
	var i = 0;
	for(var nn = n.firstChild; nn != null; nn = nn.nextSibling){
	    ans[i++] = Guppy.manual_render(base,t,nn,r);
	}
    }
    else if(n.nodeName == "c" || n.nodeName == "m"){
	for(var nn = n.firstChild; nn != null; nn = nn.nextSibling)
	    ans += Guppy.manual_render(base,t,nn,r);
	if(t == "latex" &&
           n.getAttribute("bracket") == "yes" &&
	   base.evaluate(Guppy.bracket_xpath, n, null,
			 XPathResult.BOOLEAN_TYPE, null).booleanValue){ 
	    ans = "\\left("+ans+"\\right)";
	}
    }
    return ans;
}

Guppy.prototype.fire_event = function(event, args){
    if(this.events[event]) this.events[event](args);
}

Guppy.prototype.path_to = function(n){
    var name = n.nodeName;
    if(name == "m") return "guppy_loc_m";
    var ns = 0;
    for(var nn = n; nn != null; nn = nn.previousSibling) if(nn.nodeType == 1 && nn.nodeName == name) ns++;
    return this.path_to(n.parentNode)+"_"+name+""+ns;
}

Guppy.prototype.is_changed = function(){
    var bb = this.editor.getElementsByClassName("katex")[0];
    if(!bb) return;
    var rect = bb.getBoundingClientRect();
    if(this.bounding_box)
	ans = this.bounding_box.top != rect.top || this.bounding_box.bottom != rect.bottom || this.bounding_box.right != rect.right || this.bounding_box.left != rect.left;
    else
	ans = true;
    this.bounding_box = rect;
    return ans;
}

Guppy.prototype.recompute_locations_paths = function(){
    ans = [];
    var bb = this.editor.getElementsByClassName("katex")[0];
    if(!bb) return;
    var rect = bb.getBoundingClientRect();
    ans.push({'path':'all',
	      'top':rect.top,
	      'bottom':rect.bottom,
	      'left':rect.left,
	      'right':rect.right});
    var elts = this.editor.getElementsByClassName("guppy_elt");
    for(var i = 0; i < elts.length; i++){
	var elt = elts[i];
	if(elt.nodeName == "mstyle") continue;
	var rect = elt.getBoundingClientRect();
	if(rect.top == 0 && rect.bottom == 0 && rect.left == 0 && rect.right == 0) continue;
	var cl = elt.classList;
	for(var j = 0; j < cl.length; j++){
	    if(cl[j].indexOf("guppy_loc") == 0){
		ans.push({'path':cl[j],
			  'top':rect.top,
			  'bottom':rect.bottom,
			  'left':rect.left,
			  'right':rect.right,
			  'mid_x':(rect.left+rect.right)/2,
			  'mid_y':(rect.bottom+rect.top)/2,
			  'blank':(' '+elt.className+' ').indexOf(' guppy_blank ') >= 0});
		break;
	    }
	}
    }
    this.boxes = ans;
}

Guppy.get_loc = function(x,y,current_node,current_caret){
    var g = Guppy.active_guppy;
    var min_dist = -1;
    var mid_dist = 0;
    var pos = "";
    var opt = null;
    var cur = null;
    var car = null;
    // check if we go to first or last element
    var bb = g.editor.getElementsByClassName("katex")[0];
    if(!bb) return;
    var rect = bb.getBoundingClientRect();
    if(current_node){
	var current_path = g.path_to(current_node);
	var current_pos = parseInt(current_path.substring(current_path.lastIndexOf("e")+1));
    }

    var boxes = g.boxes;
    if(!boxes) return;
    if(current_node){
	current_path = current_path.replace(/e[0-9]+$/,"e");
	var boxes2 = [];
	for(var i = 0; i < boxes.length; i++){
	    if(boxes[i].path == "all") continue;
	    var loc = boxes[i].path.substring(0,boxes[i].path.lastIndexOf("_"));
	    loc = loc.replace(/e[0-9]+$/,"e");
	    if(loc == current_path){
		boxes2.push(boxes[i]);
	    }
	}
	boxes = boxes2;
    }
    if(!boxes) return;
    for(var i = 0; i < boxes.length; i++){
	var box = boxes[i];
	if(box.path == "all"){
	    if(!opt) opt = {'path':'guppy_loc_m_e1_0'};
	    continue;
	}
	var xdist = Math.max(box.left - x, x - box.right, 0)
	var ydist = Math.max(box.top - y, y - box.bottom, 0)
	var dist = Math.sqrt(xdist*xdist + ydist*ydist);
	if(min_dist == -1 || dist < min_dist){
	    min_dist = dist;
	    mid_dist = x - box.mid_x;
	    opt = box;
	}
    }
    var loc = opt.path.substring("guppy_loc".length);
    loc = loc.replace(/_/g,"/");
    loc = loc.replace(/([0-9]+)(?=.*?\/)/g,"[$1]");
    cur = g.base.evaluate(loc.substring(0,loc.lastIndexOf("/")), g.base.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    car = parseInt(loc.substring(loc.lastIndexOf("/")+1));
    // Check if we want the cursor before or after the element
    if(mid_dist > 0 && !(opt.blank)){
	car++;
    }
    ans = {"current":cur,"caret":car,"pos":pos};
    if(current_node && opt){
	var opt_pos = parseInt(opt.path.substring(opt.path.lastIndexOf("e")+1,opt.path.lastIndexOf("_")));
	if(opt_pos < current_pos) pos = "left";
	else if(opt_pos > current_pos) pos = "right";
	else if(car < current_caret) pos = "left";
	else if(car > current_caret) pos = "right";
	if(pos) ans['pos'] = pos;
	else ans['pos'] = "none";
    }
    return ans;
}

Guppy.prototype.select_to = function(x,y, mouse){
    var sel_caret = this.caret;
    var sel_cursor = this.current;
    if(this.sel_status == Guppy.SEL_CURSOR_AT_START){
	sel_cursor = this.sel_end.node;
	sel_caret = this.sel_end.caret;
    }
    else if(this.sel_status == Guppy.SEL_CURSOR_AT_END){
	sel_cursor = this.sel_start.node;
	sel_caret = this.sel_start.caret;
    }
    var loc = Guppy.get_loc(x,y,sel_cursor,sel_caret);
    if(!loc) return;
    if(loc.current == sel_cursor && loc.caret == sel_caret){
	this.caret = loc.caret
	this.sel_status = Guppy.SEL_NONE;
    }
    else if(loc.pos == "left"){
	this.sel_end = {"node":sel_cursor,"caret":sel_caret};
	this.set_sel_boundary(Guppy.SEL_CURSOR_AT_START, mouse);
    }
    else if(loc.pos == "right"){
	this.sel_start = {"node":sel_cursor,"caret":sel_caret};
	this.set_sel_boundary(Guppy.SEL_CURSOR_AT_END, mouse);
    }
    this.current = loc.current;
    this.caret = loc.caret;
}

Guppy.mouse_up = function(e){
    Guppy.kb.is_mouse_down = false;
    var g = Guppy.active_guppy;
    if(g) g.render(true);
}

Guppy.mouse_down = function(e){
    var n = e.target;
    Guppy.kb.is_mouse_down = true;
    if(e.target == document.getElementById("toggle_ref")) toggle_div("help_card");
    else while(n != null){
	if(n.id in Guppy.instances){
	    e.preventDefault();
	    var prev_active = Guppy.active_guppy;
	    for(var i in Guppy.instances){
		if(i != n.id) Guppy.instances[i].deactivate();
		Guppy.active_guppy = Guppy.instances[n.id];
		Guppy.active_guppy.activate();
	    }
	    var g = Guppy.active_guppy;
	    g.space_caret = 0;
	    if(prev_active == g){
		if(e.shiftKey){
		    g.select_to(e.clientX, e.clientY, true);
		}
		else {
		    var loc = Guppy.get_loc(e.clientX,e.clientY);
		    if(!loc) return;
		    g.current = loc.current;
		    g.caret = loc.caret;
		    g.sel_status = Guppy.SEL_NONE;
		}
		g.render(true);
	    }
	    return;
	}
	n = n.parentNode;
    }
    Guppy.active_guppy = null;
    for(var i in Guppy.instances){
	Guppy.instances[i].deactivate();
    }
}

Guppy.mouse_move = function(e){
    var g = Guppy.active_guppy;
    if(!g) return;
    if(!Guppy.kb.is_mouse_down){
	var bb = g.editor;
	var rect = bb.getBoundingClientRect();
	if((e.clientX < rect.left || e.clientX > rect.right) || (e.clientY > rect.bottom || e.clientY < rect.top)){
	    g.temp_cursor = {"node":null,"caret":0};
	}
	else{
	    var loc = Guppy.get_loc(e.clientX,e.clientY);
	    if(!loc) return;
	    g.temp_cursor = {"node":loc.current,"caret":loc.caret};
	}
	g.render(g.is_changed());
    }
    else{
	g.select_to(e.clientX,e.clientY, true);
	g.render(g.is_changed());
    }
}

window.addEventListener("mousedown",Guppy.mouse_down, false);
window.addEventListener("mouseup",Guppy.mouse_up, false);
window.addEventListener("mousemove",Guppy.mouse_move, false);

Guppy.prototype.add_paths = function(n,path){
    if(n.nodeName == "e"){
	n.setAttribute("path",path);
    }
    else{
	var es = 1, fs = 1, cs = 1, ls = 1;
	for(var c = n.firstChild; c != null; c = c.nextSibling){
	    if(c.nodeName == "c"){ this.add_paths(c, path+"_c"+cs); cs++; }
	    else if(c.nodeName == "f"){ this.add_paths(c, path+"_f"+fs); fs++; }
	    else if(c.nodeName == "l"){ this.add_paths(c, path+"_l"+ls); ls++; }
	    else if(c.nodeName == "e"){ this.add_paths(c, path+"_e"+es); es++; }
	}
    }
}

Guppy.prototype.add_classes_cursors = function(n,path){
    if(n.nodeName == "e"){
	var text = n.firstChild.nodeValue;
	ans = "";
	var sel_cursor;
	var text_node = this.is_text(n);
	if(this.sel_status == Guppy.SEL_CURSOR_AT_START) sel_cursor = this.sel_end;
	if(this.sel_status == Guppy.SEL_CURSOR_AT_END) sel_cursor = this.sel_start;
	if(this.sel_status != Guppy.SEL_NONE){
	    var sel_caret_text = this.is_small(sel_cursor.node) ? Guppy.kb.SMALL_SEL_CARET : Guppy.kb.SEL_CARET;
	    if(!text_node && text.length == 0 && n.parentNode.childElementCount > 1){
		sel_caret_text = "\\color{blue}{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0}{"+sel_caret_text+"}}";
	    }
	    else{
		sel_caret_text = "\\color{blue}{"+sel_caret_text+"}";
	    }
	    if(this.sel_status == Guppy.SEL_CURSOR_AT_END) sel_caret_text = text_node ? "[" : sel_caret_text + "\\color{"+Guppy.kb.SEL_COLOR+"}{";
	    if(this.sel_status == Guppy.SEL_CURSOR_AT_START) sel_caret_text = text_node ? "]" : "}" + sel_caret_text;
	}
	var caret_text = "";
	var temp_caret_text = "";
	if(text.length == 0){
	    if(text_node) caret_text = "\\_";
	    else if(n.parentNode.childElementCount == 1){
		if(this.current == n){
		    var blank_caret = this.blank_caret || (this.is_small(this.current) ? Guppy.kb.SMALL_CARET : Guppy.kb.CARET);
		    ans = "\\color{red}{\\xmlClass{main_cursor guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{"+blank_caret+"}}";
		}
		else if(this.temp_cursor.node == n)
		    ans = "\\color{gray}{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{[?]}}";
		else
		    ans = "\\color{blue}{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{[?]}}";
	    }
	    else if(this.temp_cursor.node != n && this.current != n && (!(sel_cursor) || sel_cursor.node != n)){
		// These are the empty e elements at either end of
		// a c or m node, such as the space before and
		// after both the sin and x^2 in sin(x^2)
		//
		// Here, we add in a small element so that we can
		// use the mouse to select these areas
		ans = "\\phantom{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{\\cursor[0.1ex]{1ex}}}";
	    }
	}
	for(var i = 0; i < text.length+1; i++){
	    if(n == this.current && i == this.caret && (text.length > 0 || n.parentNode.childElementCount > 1)){
		if(text_node){
		    if(this.sel_status == Guppy.SEL_CURSOR_AT_START)
			caret_text = "[";
		    else if(this.sel_status == Guppy.SEL_CURSOR_AT_END)
			caret_text = "]";
		    else
			caret_text = "\\_";
		}
		else{
		    caret_text = this.is_small(this.current) ? Guppy.kb.SMALL_CARET : Guppy.kb.CARET;
		    if(text.length == 0)
			caret_text = "\\color{red}{\\xmlClass{main_cursor guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0}{"+caret_text+"}}";
		    else{
			caret_text = "\\color{red}{\\xmlClass{main_cursor}{"+caret_text+"}}"
		    }
		    if(this.sel_status == Guppy.SEL_CURSOR_AT_START)
			caret_text = caret_text + "\\color{"+Guppy.kb.SEL_COLOR+"}{";
		    else if(this.sel_status == Guppy.SEL_CURSOR_AT_END)
			caret_text = "}" + caret_text;
		}
		ans += caret_text;
	    }
	    else if(n == this.current && i == this.caret && text_node){
		ans += caret_text;
	    }
	    else if(this.sel_status != Guppy.SEL_NONE && sel_cursor.node == n && i == sel_cursor.caret){
		ans += sel_caret_text;
	    }
	    else if(this.temp_cursor.node == n && i == this.temp_cursor.caret && (text.length > 0 || n.parentNode.childElementCount > 1)){
		if(text_node) 
		    temp_caret_text = ".";
		else{
		    temp_caret_text = this.is_small(this.current) ? Guppy.kb.TEMP_SMALL_CARET : Guppy.kb.TEMP_CARET;
		    if(text.length == 0){
			temp_caret_text = "\\color{gray}{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0}{"+temp_caret_text+"}}";
		    }
		    else
			temp_caret_text = "\\color{gray}{"+temp_caret_text+"}";
		}
		ans += temp_caret_text;
	    }
	    if(i < text.length) ans += "\\xmlClass{guppy_elt guppy_loc_"+n.getAttribute("path")+"_"+i+"}{"+text[i]+"}";
	}
	n.setAttribute("render", ans);
	n.removeAttribute("path");
    }
    else{
	for(var c = n.firstChild; c != null; c = c.nextSibling){
	    if(c.nodeName == "c" || c.nodeName == "l" || c.nodeName == "f" || c.nodeName == "e"){ this.add_classes_cursors(c); }
	}
    }
}

Guppy.prototype.post_render_cleanup = function(n){
    if(n.nodeName == "e"){
	n.removeAttribute("path");
	n.removeAttribute("render");
	n.removeAttribute("current");
	n.removeAttribute("temp");
    }
    else{
	for(var c = n.firstChild; c != null; c = c.nextSibling){
	    if(c.nodeType == 1){ this.post_render_cleanup(c); }
	}
    }
}

Guppy.prototype.render_node = function(n,t){
    // All the interesting work is done by transform.  This function just adds in the cursor and selection-start cursor
    var output = "";
    if(t == "latex"){
	this.add_paths(this.base.documentElement,"m");
	this.add_classes_cursors(this.base.documentElement);
	this.current.setAttribute("current","yes");
	if(this.temp_cursor.node) this.temp_cursor.node.setAttribute("temp","yes");
	output = Guppy.transform(t, this.base, true);
	this.post_render_cleanup(this.base.documentElement);
	output = output.replace(new RegExp('&amp;','g'), '&');
	return output;
    }
    else{
	output = Guppy.transform(t, this.base);
    }
    return output
}

Guppy.prototype.set_sel_start = function(){
    this.sel_start = {"node":this.current, "caret":this.caret};
}

Guppy.prototype.set_sel_end = function(){
    this.sel_end = {"node":this.current, "caret":this.caret};
}

Guppy.prototype.next_sibling = function(n){
    if(n == null) return null;
    var c = n.parentNode.nextSibling;
    while(c != null && c.nodeName != "e") c = c.nextSibling;
    if(c == null) return null
    else return c.firstChild;
}

Guppy.prototype.prev_sibling = function(n){
    if(n == null) return null;
    var c = n.parentNode.previousSibling;
    while(c != null && c.nodeName != "e") c = c.previousSibling;
    if(c == null) return null
    else return c.firstChild;
}

Guppy.prototype.down_from_f = function(){
    var nn = this.current.firstChild;
    while(nn != null && nn.nodeName != 'c' && nn.nodeName != 'l') nn = nn.nextSibling;
    if(nn != null){
	while(nn.nodeName == 'l') nn = nn.firstChild;
	this.current = nn.firstChild;
    }
}

Guppy.prototype.down_from_f_to_blank = function(){
    var nn = this.current.firstChild;
    while(nn != null && !(nn.nodeName == 'c' && nn.children.length == 1 && nn.firstChild.firstChild.nodeValue == "")){
	nn = nn.nextSibling;
    }
    if(nn != null){
	//Sanity check:
	
	while(nn.nodeName == 'l') nn = nn.firstChild;
	if(nn.nodeName != 'c' || nn.firstChild.nodeName != 'e'){
	    this.problem('dfftb');
	    return;
	}
	this.current = nn.firstChild;
    }
    else this.down_from_f();
}

Guppy.prototype.delete_from_f = function(to_insert){
    var n = this.current;
    var p = n.parentNode;
    var prev = n.previousSibling;
    var next = n.nextSibling;
    var middle = to_insert || "";
    var new_node = this.make_e(prev.firstChild.textContent + middle + next.firstChild.textContent);
    this.current = new_node;
    this.caret = prev.firstChild.textContent.length;
    p.insertBefore(new_node, prev);
    p.removeChild(prev);
    p.removeChild(n);
    p.removeChild(next);
}

Guppy.prototype.symbol_to_node = function(sym_name, content){
    // sym_name is a key in the symbols dictionary
    //
    // content is a list of nodes to insert
    
    var s = Guppy.kb.symbols[sym_name];
    var f = this.base.createElement("f");
    if("type" in s) f.setAttribute("type",s["type"])
    if(s['char']) f.setAttribute("c","yes");
    
    var first_ref = -1;
    var refs_count = 0;
    var lists = {}
    var first;

    // Make the b nodes for rendering each output    
    for(var t in s["output"]){
	var b = this.base.createElement("b");
	b.setAttribute("p",t);

	var out = s["output"][t];
	if(typeof out == 'string'){
	    out = out.split(/(\{\$[0-9]+(?:\{[^}]+\})*\})/g);
	    for(var i = 0; i < out.length; i++){
		m = out[i].match(/^\{\$([0-9]+)((?:\{[^}]+\})*)\}$/);
		if(m){
		    //console.log("O",out);
		    out[i] = {'ref':parseInt(m[1])};
		    if(m[2].length > 0){
			mm = m[2].match(/\{[^}]*\}/g);
			out[i]['d'] = mm.length;
			for(var j = 0; j < mm.length; j++){
			    out[i]['sep'+j] = mm[j].substring(1,mm[j].length-1);
			}
		    }
		}
	    }
	}
	for(var i = 0; i < out.length; i++){
	    if(typeof out[i] == 'string' || out[i] instanceof String){
		var nt = this.base.createTextNode(out[i]);
		b.appendChild(nt);
	    }
	    else{
		var nt = this.base.createElement("r");
		for(var attr in out[i]){
		    nt.setAttribute(attr,out[i][attr]);
		}
		if(t == 'latex') {
		    if(first_ref == -1) first_ref = out[i]['ref'];
		    if('d' in out[i]) lists[refs_count] = out[i]['d']
		    refs_count++;
		}
		b.appendChild(nt);
	    }
	}
	f.appendChild(b);
    }
    // Now make the c nodes for storing the content
    for(var i = 0; i < refs_count; i++){
	var nc = this.base.createElement("c");
	if(i in content){
	    var node_list = content[i];
	    for(var se = 0; se < node_list.length; se++){
		nc.appendChild(node_list[se].cloneNode(true));
	    }
	}
	else nc.appendChild(this.make_e(""));
	if(i+1 == first_ref) first = nc.lastChild;
	for(var a in s['attrs'])
	    if(s['attrs'][a][i] != 0) nc.setAttribute(a,s['attrs'][a][i]);
	if(i in lists){
	    var par = f;
	    for(var j = 0; j < lists[i]; j++){
		var nl = this.base.createElement("l");
		nl.setAttribute("s","1");
		par.appendChild(nl);
		par = nl;
		if(j == lists[i]-1) nl.appendChild(nc);
	    }
	}
	else f.appendChild(nc);
    }
    return {"f":f, "first":first};
}

Guppy.prototype.is_text = function(nn){
    return nn.parentNode.getAttribute("mode") && (nn.parentNode.getAttribute("mode") == "text" || nn.parentNode.getAttribute("mode") == "symbol");
}

Guppy.prototype.is_symbol = function(nn){
    return nn.parentNode.getAttribute("mode") && nn.parentNode.getAttribute("mode") == "symbol";
}

Guppy.prototype.is_small = function(nn){
    var n = nn.parentNode;
    while(n != null && n.nodeName != 'm'){
	if(n.getAttribute("size") == "s"){
	    return true;
	}
	n = n.parentNode
	while(n != null && n.nodeName != 'c')
	    n = n.parentNode;
    }
    return false;
}

Guppy.prototype.insert_symbol = function(sym_name){
    var s = Guppy.kb.symbols[sym_name];
    if(this.is_blacklisted(s['type'])){
	return false;
    }
    var node_list = {};
    var content = {};
    var left_piece,right_piece;
    var cur = s['current'] == null ? 0 : parseInt(s['current']);
    var to_remove = [];
    var to_replace = null;
    var replace_f = false;
    
    
    if(cur > 0){
	cur--;
	if(this.sel_status != Guppy.SEL_NONE){
	    var sel = this.sel_get();
	    sel_parent = sel.involved[0].parentNode;
	    to_remove = sel.involved;
	    left_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(0,this.sel_start.caret));
	    right_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(this.sel_start.caret));
	    content[cur] = sel.node_list;
	}
	else if(s['current_type'] == 'token'){
	    // If we're at the beginning, then the token is the previous f node
	    if(this.caret == 0 && this.current.previousSibling != null){
		content[cur] = [this.make_e(""), this.current.previousSibling, this.make_e("")];
		to_replace = this.current.previousSibling;
		replace_f = true;
	    }
	    else{
		// look for [0-9.]+|[a-zA-Z] immediately preceeding the caret and use that as token
		var prev = this.current.firstChild.nodeValue.substring(0,this.caret);
		var token = prev.match(/[0-9.]+$|[a-zA-Z]$/);
		if(token != null && token.length > 0){
		    token = token[0];
		    left_piece = this.make_e(this.current.firstChild.nodeValue.slice(0,this.caret-token.length));
		    right_piece = this.make_e(this.current.firstChild.nodeValue.slice(this.caret));
		    content[cur] = [this.make_e(token)];
		}
	    }
	}
    }
    if(!replace_f && (left_piece == null || right_piece == null)){
	left_piece = this.make_e(this.current.firstChild.nodeValue.slice(0,this.caret));
	right_piece = this.make_e(this.current.firstChild.nodeValue.slice(this.caret));
	to_remove = [this.current];
    }

    // By now:
    // 
    // content contains whatever we want to pre-populate the 'current' field with (if any)
    //
    // right_piece contains whatever content was in an involved node
    // to the right of the cursor but is not part of the insertion.
    // Analogously for left_piece
    //
    // Thus all we should have to do now is symbol_to_node(sym_type,
    // content) and then add the left_piece, resulting node, and
    // right_piece in that order.
    
    var new_current = null;
    var current_parent = this.current.parentNode;
    
    var sym = this.symbol_to_node(sym_name,content);
    var f = sym.f;
    var new_current = sym.first;

    var next = this.current.nextSibling;

    if(replace_f){
	current_parent.replaceChild(f,to_replace);
    }
    else{
	if(to_remove.length == 0) this.current.parentNode.removeChild(this.current);
	
	for(var i = 0; i < to_remove.length; i++){
	    if(next == to_remove[i]) next = next.nextSibling;
	    current_parent.removeChild(to_remove[i]);
	}
	current_parent.insertBefore(left_piece, next);
	current_parent.insertBefore(f, next);
	current_parent.insertBefore(right_piece, next);
    }
    
    this.caret = 0;
    this.current = f;
    if(s['char']){
	this.current = this.current.nextSibling;
    }
    else this.down_from_f_to_blank();

    this.sel_clear();
    this.checkpoint();
    this.render(true);
    return true;
}

Guppy.prototype.sel_get = function(){
    if(this.sel_status == Guppy.SEL_NONE){
	return null;
    }
    var involved = [];
    var node_list = [];
    var remnant = null;

    if(this.sel_start.node == this.sel_end.node){
	return {"node_list":[this.make_e(this.sel_start.node.firstChild.nodeValue.substring(this.sel_start.caret, this.sel_end.caret))],
		"remnant":this.make_e(this.sel_start.node.firstChild.nodeValue.substring(0, this.sel_start.caret) + this.sel_end.node.firstChild.nodeValue.substring(this.sel_end.caret)),
		"involved":[this.sel_start.node]};
    }
    
    node_list.push(this.make_e(this.sel_start.node.firstChild.nodeValue.substring(this.sel_start.caret)));
    involved.push(this.sel_start.node);
    involved.push(this.sel_end.node);
    remnant = this.make_e(this.sel_start.node.firstChild.nodeValue.substring(0, this.sel_start.caret) + this.sel_end.node.firstChild.nodeValue.substring(this.sel_end.caret));
    var n = this.sel_start.node.nextSibling;
    while(n != null && n != this.sel_end.node){
	involved.push(n);
	node_list.push(n);
	n = n.nextSibling;
    }
    node_list.push(this.make_e(this.sel_end.node.firstChild.nodeValue.substring(0, this.sel_end.caret)));
    return {"node_list":node_list,
	    "remnant":remnant,
	    "involved":involved,
	    "cursor":0};
}

Guppy.prototype.print_selection = function(){
    var sel = this.sel_get();
    if(sel == null) return "[none]";
    var ans = "";
    ans += "node_list: \n";
    for(var i = 0; i < sel.node_list.length; i++){
	var n = sel.node_list[i];
	ans += (new XMLSerializer()).serializeToString(n) + "\n";
    }
    ans += "\ninvolved: \n";
    for(var i = 0; i < sel.involved.length; i++){
	var n = sel.involved[i];
	ans += (new XMLSerializer()).serializeToString(n) + "\n";
    }
}

Guppy.prototype.make_e = function(text){
    var new_node = this.base.createElement("e");
    new_node.appendChild(this.base.createTextNode(text));
    return new_node;
}

Guppy.prototype.is_blank = function(){
    return this.base.documentElement.firstChild == this.base.documentElement.lastChild && this.base.documentElement.firstChild.firstChild.textContent == "";
}

Guppy.prototype.insert_string = function(s){
    if(this.sel_status != Guppy.SEL_NONE){
	this.sel_delete();
	this.sel_clear();
    }
    this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splice(this.caret,s)
    this.caret += s.length;
    this.checkpoint();
    if(this.autoreplace) this.check_for_symbol();
    this.render(true);
}

Guppy.prototype.render = function(updated){
    if(!this.editor_active && this.is_blank()){
	katex.render(this.empty_content,this.editor);
	return;
    }
    var tex = this.render_node(this.base,"latex");
    this.fire_event("debug",{"message":"RENDERING: " + tex})
    katex.render(tex,this.editor);
    if(updated){
	this.recompute_locations_paths();
    }
}

Guppy.prototype.activate = function(){
    Guppy.active_guppy = this;
    this.editor_active = true;
    this.editor.className = this.editor.className.replace(new RegExp('(\\s|^)guppy_inactive(\\s|$)'),' guppy_active ');
    this.editor.focus();
    if(this.ready){
	this.render(true);
	this.fire_event("focus",{"focused":true});
    }
}

Guppy.prototype.deactivate = function(){
    this.editor_active = false;
    var r1 = new RegExp('(?:\\s|^)guppy_active(?:\\s|$)');
    var r2 = new RegExp('(?:\\s|^)guppy_inactive(?:\\s|$)');
    if(this.editor.className.match(r1)){
	this.editor.className = this.editor.className.replace(r1,' guppy_inactive ');
    }
    else if(!this.editor.className.match(r2)){
	this.editor.className += ' guppy_inactive ';
    }
    Guppy.kb.shift_down = false;
    Guppy.kb.ctrl_down = false;
    Guppy.kb.alt_down = false;
    if(this.ready){
	this.render();
	this.fire_event("focus",{"focused":false});
    }
}

Guppy.prototype.sel_copy = function(){
    var sel = this.sel_get();
    if(!sel) return;
    this.clipboard = [];
    for(var i = 0; i < sel.node_list.length; i++){
	this.clipboard.push(sel.node_list[i].cloneNode(true));
    }
    this.sel_clear();
}

Guppy.prototype.sel_cut = function(){
    var node_list = this.sel_delete();
    this.clipboard = [];
    for(var i = 0; i < node_list.length; i++){
	this.clipboard.push(node_list[i].cloneNode(true));
    }
    this.sel_clear();
    this.checkpoint();
}

Guppy.prototype.insert_nodes = function(node_list, move_cursor){
    var real_clipboard = [];
    for(var i = 0; i < node_list.length; i++){
	real_clipboard.push(node_list[i].cloneNode(true));
    }

    if(real_clipboard.length == 1){
	this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.substring(0,this.caret) + real_clipboard[0].firstChild.nodeValue + this.current.firstChild.nodeValue.substring(this.caret);
	if(move_cursor) this.caret += real_clipboard[0].firstChild.nodeValue.length;
    }
    else{
	var nn = this.make_e(real_clipboard[real_clipboard.length-1].firstChild.nodeValue + this.current.firstChild.nodeValue.substring(this.caret));
	this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.substring(0,this.caret) + real_clipboard[0].firstChild.nodeValue;
	if(this.current.nextSibling == null)
	    this.current.parentNode.appendChild(nn)
	else
	    this.current.parentNode.insertBefore(nn, this.current.nextSibling)
	for(var i = 1; i < real_clipboard.length - 1; i++)
	    this.current.parentNode.insertBefore(real_clipboard[i], nn);
	if(move_cursor){
	    this.current = nn;
	    this.caret = real_clipboard[real_clipboard.length-1].firstChild.nodeValue.length
	}
    }

}

Guppy.prototype.sel_paste = function(){
    this.sel_delete();
    this.sel_clear();
    if(!(this.clipboard) || this.clipboard.length == 0) return;
    this.insert_nodes(this.clipboard, true);
    this.checkpoint();
    return;
    var real_clipboard = [];
    for(var i = 0; i < this.clipboard.length; i++){
	real_clipboard.push(this.clipboard[i].cloneNode(true));
    }
    
    if(real_clipboard.length == 1){
	this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.substring(0,this.caret) + real_clipboard[0].firstChild.nodeValue + this.current.firstChild.nodeValue.substring(this.caret);
	this.caret += real_clipboard[0].firstChild.nodeValue.length;
    }
    else{
	var nn = this.make_e(real_clipboard[real_clipboard.length-1].firstChild.nodeValue + this.current.firstChild.nodeValue.substring(this.caret));
	this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.substring(0,this.caret) + real_clipboard[0].firstChild.nodeValue;
	if(this.current.nextSibling == null)
	    this.current.parentNode.appendChild(nn)
	else
	    this.current.parentNode.insertBefore(nn, this.current.nextSibling)
	for(var i = 1; i < real_clipboard.length - 1; i++)
	    this.current.parentNode.insertBefore(real_clipboard[i], nn);
	this.current = nn;
	this.caret = real_clipboard[real_clipboard.length-1].firstChild.nodeValue.length
    }
    this.checkpoint();
}

Guppy.prototype.sel_clear = function(){
    this.sel_start = null;    
    this.sel_end = null;
    this.sel_status = Guppy.SEL_NONE;
}

Guppy.prototype.sel_delete = function(){
    var sel = this.sel_get();
    if(!sel) return;
    sel_parent = sel.involved[0].parentNode;
    sel_prev = sel.involved[0].previousSibling;
    for(var i = 0; i < sel.involved.length; i++){
	var n = sel.involved[i];
	sel_parent.removeChild(n);
    }
    if(sel_prev == null){
	if(sel_parent.firstChild == null)
	    sel_parent.appendChild(sel.remnant);
	else
	    sel_parent.insertBefore(sel.remnant, sel_parent.firstChild);
    }
    else if(sel_prev.nodeName == 'f'){
	if(sel_prev.nextSibling == null)
	    sel_parent.appendChild(sel.remnant);
	else
	    sel_parent.insertBefore(sel.remnant, sel_prev.nextSibling);
    }
    this.current = sel.remnant
    this.caret = this.sel_start.caret;
    return sel.node_list;
}

//Functions for handling navigation and editing commands: 

Guppy.prototype.sel_all = function(){
    this.home();
    this.set_sel_start();
    this.end();
    this.set_sel_end();
    if(this.sel_start.node != this.sel_end.node || this.sel_start.caret != this.sel_end.caret)
	this.sel_status = Guppy.SEL_CURSOR_AT_END;
}

Guppy.prototype.sel_right = function(){
    if(this.sel_status == Guppy.SEL_NONE){
	this.set_sel_start();
	this.sel_status = Guppy.SEL_CURSOR_AT_END;
    }
    if(this.caret >= this.get_length(this.current)){
	var nn = this.current.nextSibling;
	if(nn != null){
	    this.current = nn.nextSibling;
	    this.caret = 0;
	    this.set_sel_boundary(Guppy.SEL_CURSOR_AT_END);
	}
	else{
	    this.set_sel_boundary(Guppy.SEL_CURSOR_AT_END);
	}
    }
    else{
	this.caret += 1;
	this.set_sel_boundary(Guppy.SEL_CURSOR_AT_END);
    }
    if(this.sel_start.node == this.sel_end.node && this.sel_start.caret == this.sel_end.caret){
	this.sel_status = Guppy.SEL_NONE;
    }
}

Guppy.prototype.set_sel_boundary = function(sstatus, mouse){
    if(this.sel_status == Guppy.SEL_NONE || mouse) this.sel_status = sstatus;
    if(this.sel_status == Guppy.SEL_CURSOR_AT_START)
	this.set_sel_start();
    else if(this.sel_status == Guppy.SEL_CURSOR_AT_END)
	this.set_sel_end();
}

Guppy.prototype.sel_left = function(){
    if(this.sel_status == Guppy.SEL_NONE){
	this.set_sel_end();
	this.sel_status = Guppy.SEL_CURSOR_AT_START;
    }
    if(this.caret <= 0){
	var nn = this.current.previousSibling;
	if(nn != null){
	    this.current = nn.previousSibling;
	    this.caret = this.current.firstChild.nodeValue.length;
	    this.set_sel_boundary(Guppy.SEL_CURSOR_AT_START);
	}
	else{
	    this.set_sel_boundary(Guppy.SEL_CURSOR_AT_START);
	}
    }
    else{
	this.caret -= 1;
	this.set_sel_boundary(Guppy.SEL_CURSOR_AT_START);
    }
    if(this.sel_start.node == this.sel_end.node && this.sel_start.caret == this.sel_end.caret){
	this.sel_status = Guppy.SEL_NONE;
    }
}

Guppy.prototype.list_extend_copy_right = function(){this.list_extend("right", true);}
Guppy.prototype.list_extend_copy_left = function(){this.list_extend("left", true);}
Guppy.prototype.list_extend_right = function(){this.list_extend("right", false);}
Guppy.prototype.list_extend_left = function(){this.list_extend("left", false);}
Guppy.prototype.list_extend_up = function(){this.list_extend("up", false);}
Guppy.prototype.list_extend_down = function(){this.list_extend("down", false);}
Guppy.prototype.list_extend_copy_up = function(){this.list_extend("up", true);}
Guppy.prototype.list_extend_copy_down = function(){this.list_extend("down", true);}

Guppy.prototype.list_vertical_move = function(down){
    var n = this.current;
    while(n.parentNode && n.parentNode.parentNode && !(n.nodeName == 'c' && n.parentNode.nodeName == 'l' && n.parentNode.parentNode.nodeName == 'l')){
	n = n.parentNode;
    }
    if(!n.parentNode) return;
    var pos = 1;
    var cc = n;
    while(cc.previousSibling != null){
	pos++;
	cc = cc.previousSibling;
    }
    var new_l = down ? n.parentNode.nextSibling : n.parentNode.previousSibling
    if(!new_l) return;
    var idx = 1;
    var nn = new_l.firstChild;
    while(idx < pos){
	idx++;
	nn = nn.nextSibling;
    }
    this.current = nn.firstChild;
    this.caret = down ? 0 : this.current.firstChild.textContent.length;
}

Guppy.prototype.list_extend = function(direction, copy){
    var vertical = direction == "up" || direction == "down";
    var before = direction == "up" || direction == "left";
    var this_name = vertical ? "l" : "c";
    var n = this.current;
    while(n.parentNode && !(n.nodeName == this_name && n.parentNode.nodeName == 'l')){
	n = n.parentNode;
    }
    if(!n.parentNode) return;
    var to_insert;
    
    // check if 2D and horizontal and extend all the other rows if so 
    if(!vertical && n.parentNode.parentNode.nodeName == "l"){
	to_insert = this.base.createElement("c");
	to_insert.appendChild(this.make_e(""));
	var pos = 1;
	var cc = n;
	while(cc.previousSibling != null){
	    pos++;
	    cc = cc.previousSibling;
	}
	var to_modify = [];
	var iterator = this.base.evaluate("./l/c[position()="+pos+"]", n.parentNode.parentNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
	try{ for(var nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()){ to_modify.push(nn); }}
	catch(e) { this.fire_event("error",{"message":'XML modified during iteration? ' + e}); }
	for(var j = 0; j < to_modify.length; j++){
	    var nn = to_modify[j];
	    if(copy) nn.parentNode.insertBefore(nn.cloneNode(true), before ? nn : nn.nextSibling);
	    else nn.parentNode.insertBefore(to_insert.cloneNode(true), before ? nn : nn.nextSibling);
	    nn.parentNode.setAttribute("s",parseInt(nn.parentNode.getAttribute("s"))+1);
	}
	this.current = before ? n.previousSibling.lastChild : n.nextSibling.firstChild;
	this.caret = this.current.firstChild.textContent.length;
	return;
    }
    
    if(copy){
	to_insert = n.cloneNode(true);
    }
    else{
	if(vertical){
	    to_insert = this.base.createElement("l");
	    to_insert.setAttribute("s",n.getAttribute("s"))
	    for(var i = 0; i < parseInt(n.getAttribute("s")); i++){
		var c = this.base.createElement("c");
		c.appendChild(this.make_e(""));
		to_insert.appendChild(c);
	    }
	}
	else{
	    to_insert = this.base.createElement("c");
	    to_insert.appendChild(this.make_e(""));
	}
    }
    n.parentNode.setAttribute("s",parseInt(n.parentNode.getAttribute("s"))+1);
    n.parentNode.insertBefore(to_insert, before ? n : n.nextSibling);
    if(vertical) this.current = to_insert.firstChild.firstChild;
    else this.current = to_insert.firstChild;
    this.caret = 0;
    this.checkpoint();
}

Guppy.prototype.list_remove_col = function(){
    var n = this.current;
    while(n.parentNode && n.parentNode.parentNode && !(n.nodeName == 'c' && n.parentNode.nodeName == 'l' && n.parentNode.parentNode.nodeName == 'l')){
	n = n.parentNode;
    }
    if(!n.parentNode) return;
    
    // Don't remove if there is only a single column:
    if(n.previousSibling != null){
	this.current = n.previousSibling.lastChild;
	this.caret = n.previousSibling.lastChild.firstChild.textContent.length;
    }
    else if(n.nextSibling != null){
	this.current = n.nextSibling.firstChild;
	this.caret = 0;
    }
    else return;
    
    var pos = 1;
    var cc = n;
    
    // Find position of column
    while(cc.previousSibling != null){
	pos++;
	cc = cc.previousSibling;
    }
    var to_modify = [];
    var iterator = this.base.evaluate("./l/c[position()="+pos+"]", n.parentNode.parentNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    try{ for(var nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()){ to_modify.push(nn); }}
    catch(e) { this.fire_event("error",{"message":'XML modified during iteration? ' + e}); }
    for(var j = 0; j < to_modify.length; j++){
	var nn = to_modify[j];
	nn.parentNode.setAttribute("s",parseInt(nn.parentNode.getAttribute("s"))-1);
	nn.parentNode.removeChild(nn);
    }
    
}

Guppy.prototype.list_remove_row = function(){
    var n = this.current;
    while(n.parentNode && !(n.nodeName == 'l' && n.parentNode.nodeName == 'l')){
	n = n.parentNode;
    }
    if(!n.parentNode) return;
    // Don't remove if there is only a single row:
    if(n.previousSibling != null){
	this.current = n.previousSibling.firstChild.lastChild;
	this.caret = n.previousSibling.lastChild.firstChild.textContent.length;
    }
    else if(n.nextSibling != null){
	this.current = n.nextSibling.firstChild.firstChild;
	this.caret = 0;
    }
    else return;

    n.parentNode.setAttribute("s",parseInt(n.parentNode.getAttribute("s"))-1);
    n.parentNode.removeChild(n);
}

Guppy.prototype.list_remove = function(){
    var n = this.current;
    while(n.parentNode && !(n.nodeName == 'c' && n.parentNode.nodeName == 'l')){
	n = n.parentNode;
    }
    if(!n.parentNode) return;
    if(n.parentNode.parentNode && n.parentNode.parentNode.nodeName == "l"){
	this.list_remove_col();
	return;
    }
    if(n.previousSibling != null){
	this.current = n.previousSibling.lastChild;
	this.caret = n.previousSibling.lastChild.firstChild.textContent.length;
    }
    else if(n.nextSibling != null){
	this.current = n.nextSibling.firstChild;
	this.caret = 0;
    }
    else return;
    n.parentNode.setAttribute("s",parseInt(n.parentNode.getAttribute("s"))-1);
    n.parentNode.removeChild(n);
}

Guppy.prototype.right = function(){
    this.sel_clear();
    if(this.caret >= this.get_length(this.current)){
	var nn = this.base.evaluate("following::e[1]", this.current, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(nn != null){
	    this.current = nn;
	    this.caret = 0;
	}
	else{
	    this.fire_event("right_end");
	}
    }
    else{
	this.caret += 1;
    }
}

Guppy.prototype.spacebar = function(){
    this.space_caret = this.caret;
}

Guppy.prototype.get_length = function(n){
    if(Guppy.is_blank(n) || n.nodeName == 'f') return 0
    return n.firstChild.nodeValue.length;
    
}

Guppy.prototype.left = function(){
    this.sel_clear();
    if(this.caret <= 0){
	var pn = this.base.evaluate("preceding::e[1]", this.current, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(pn != null){
	    this.current = pn;
	    this.caret = this.current.firstChild.nodeValue.length;
	}
	else{
	    this.fire_event("left_end");
	}
    }
    else{
	this.caret -= 1;
    }
}

Guppy.prototype.delete_from_c = function(){
    var pos = 0;
    var c = this.current.parentNode;
    while(c && c.nodeName == "c"){
	pos++;
	c = c.previousSibling;
    }
    var idx = this.current.parentNode.getAttribute("delete");
    var survivor_node = this.base.evaluate("./c[position()="+idx+"]", this.current.parentNode.parentNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var survivor_nodes = [];
    for(var n = survivor_node.firstChild; n != null; n = n.nextSibling){
	survivor_nodes.push(n);
    }
    this.current = this.current.parentNode.parentNode;
    this.delete_from_f();
    this.insert_nodes(survivor_nodes, pos > idx);
}

Guppy.prototype.delete_from_e = function(){
    // return false if we deleted something, and true otherwise.
    if(this.caret > 0){
	this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splicen(this.caret-1,"",1);
	this.caret--;
    }
    else{
	// The order of these is important
	if(this.current.previousSibling != null && this.current.previousSibling.getAttribute("c") == "yes"){
	    // The previous node is an f node but is really just a character.  Delete it.
	    this.current = this.current.previousSibling;
	    this.delete_from_f();
	}
	else if(this.current.previousSibling != null && this.current.previousSibling.nodeName == 'f'){
	    // We're in an e node just after an f node.  Move back into the f node (delete it?)
	    this.left();
	    return false;
	}
	else if(this.current.parentNode.previousSibling != null && this.current.parentNode.previousSibling.nodeName == 'c'){
	    // We're in a c child of an f node, but not the first one.  Go to the previous c
	    if(this.current.parentNode.hasAttribute("delete")){
		this.delete_from_c();
	    }
	    else{
		this.left();
		return false;
	    }
	}
	else if(this.current.previousSibling == null && this.current.parentNode.nodeName == 'c' && (this.current.parentNode.previousSibling == null || this.current.parentNode.previousSibling.nodeName != 'c')){
	    // We're in the first c child of an f node and at the beginning--delete the f node
	    var par = this.current.parentNode;
	    while(par.parentNode.nodeName == 'l' || par.parentNode.nodeName == 'c'){
		par = par.parentNode;
	    }
	    if(par.hasAttribute("delete")){
		this.delete_from_c();
	    }
	    else{
		this.current = par.parentNode;
		this.delete_from_f();
	    }
	}
	else{
	    // We're at the beginning (hopefully!) 
	    return false;
	}
    }
    return true;
}

Guppy.prototype.delete_forward_from_e = function(){
    // return false if we deleted something, and true otherwise.
    if(this.caret < this.current.firstChild.nodeValue.length){
	this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splicen(this.caret,"",1);
    }
    else{
	//We're at the end
	if(this.current.nextSibling != null){
	    // The next node is an f node.  Delete it.
	    this.current = this.current.nextSibling;
	    this.delete_from_f();
	}
	else if(this.current.parentNode.nodeName == 'c'){
	    // We're in a c child of an f node.  Do nothing
	    return false;
	}
    }
    return true;
}

Guppy.prototype.backspace = function(){
    if(this.sel_status != Guppy.SEL_NONE){
	this.sel_delete();
	this.sel_status = Guppy.SEL_NONE;
	this.checkpoint();
    }
    else if(this.delete_from_e()){
	this.checkpoint();
    }
}

Guppy.prototype.delete_key = function(){
    if(this.sel_status != Guppy.SEL_NONE){
	this.sel_delete();
	this.sel_status = Guppy.SEL_NONE;
	this.checkpoint();
    }
    else if(this.delete_forward_from_e()){
	this.checkpoint();
    }
}

Guppy.prototype.backslash = function(){
    if(this.is_text(this.current)) return;
    this.insert_symbol("sym_name");
}

Guppy.prototype.tab = function(){
    if(!this.is_symbol(this.current)){
	this.check_for_symbol();
	return;
    }
    var sym_name = this.current.firstChild.textContent;
    var candidates = [];
    for(var n in Guppy.kb.symbols){
	if(n.startsWith(sym_name)) candidates.push(n);
    }
    if(candidates.length == 1){
	this.current.firstChild.textContent = candidates[0];
	this.caret = candidates[0].length;
    }
    else {
	this.fire_event("completion",{"candidates":candidates});
    }
}

Guppy.prototype.right_paren = function(){
    if(this.current.nodeName == 'e' && this.caret < this.current.firstChild.nodeValue.length - 1) return;
    else this.right();
}

Guppy.prototype.up = function(){
    this.sel_clear();
    if(this.current.parentNode.hasAttribute("up")){
	var t = parseInt(this.current.parentNode.getAttribute("up"));
	var f = this.current.parentNode.parentNode;
	var n = f.firstChild;
	while(n != null && t > 0){
	    if(n.nodeName == 'c') t--;
	    if(t > 0) n = n.nextSibling;
	}
	this.current = n.lastChild;
	this.caret = this.current.firstChild.nodeValue.length;
    }
    else this.list_vertical_move(false);
}

Guppy.prototype.down = function(){
    this.sel_clear();
    if(this.current.parentNode.hasAttribute("down")){
	var t = parseInt(this.current.parentNode.getAttribute("down"));
	var f = this.current.parentNode.parentNode;
	var n = f.firstChild;
	while(n != null && t > 0){
	    if(n.nodeName == 'c') t--;
	    if(t > 0) n = n.nextSibling;
	}
	this.current = n.lastChild;
	this.caret = this.current.firstChild.nodeValue.length;
    }
    else this.list_vertical_move(true);
}

Guppy.prototype.home = function(){
    while(this.current.previousSibling != null)
	this.current = this.current.previousSibling;
    this.caret = 0;
}

Guppy.prototype.end = function(){
    while(this.current.nextSibling != null)
	this.current = this.current.nextSibling;
    this.caret = this.current.firstChild.nodeValue.length;
}

Guppy.prototype.checkpoint = function(){
    this.current.setAttribute("current","yes");
    this.current.setAttribute("caret",this.caret.toString());
    this.undo_now++;
    this.undo_data[this.undo_now] = this.base.cloneNode(true);
    this.undo_data.splice(this.undo_now+1, this.undo_data.length);
    this.fire_event("change",{"old":this.undo_data[this.undo_now-1],"new":this.undo_data[this.undo_now]});
    this.current.removeAttribute("current");
    this.current.removeAttribute("caret");
}

Guppy.prototype.restore = function(t){
    this.base = this.undo_data[t].cloneNode(true);
    this.find_current();
    this.current.removeAttribute("current");
    this.current.removeAttribute("caret");
}

Guppy.prototype.find_current = function(){
    this.current = this.base.evaluate("//*[@current='yes']", this.base.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    this.caret = parseInt(this.current.getAttribute("caret"));
}

Guppy.prototype.undo = function(){
    this.print_undo_data();
    if(this.undo_now <= 0) return;
    this.undo_now--;
    this.restore(this.undo_now);
}

Guppy.prototype.redo = function(){
    this.print_undo_data();
    if(this.undo_now >= this.undo_data.length-1) return;
    this.undo_now++;
    this.restore(this.undo_now);
}

Guppy.prototype.print_undo_data = function(){
    for(var i = 0; i < this.undo_data.length; i++){
    }
}

Guppy.prototype.done = function(s){
    if(this.is_symbol(this.current)) this.complete_symbol();
    else this.fire_event("done");
}

Guppy.prototype.complete_symbol = function(){
    var sym_name = this.current.firstChild.textContent;
    if(!(Guppy.kb.symbols[sym_name])) return;
    this.current = this.current.parentNode.parentNode;
    this.delete_from_f();
    this.insert_symbol(sym_name);
}

Guppy.prototype.problem = function(message){
    this.fire_event("error",{"message":message});
}


// Keyboard stuff

Guppy.kb = {};

Guppy.kb.is_mouse_down = false;

Guppy.kb.CARET = "\\cursor[-0.2ex]{0.7em}"
Guppy.kb.TEMP_SMALL_CARET = "\\cursor[0em]{0.6em}"
Guppy.kb.TEMP_CARET = "\\cursor[-0.2ex]{0.7em}"
Guppy.kb.SMALL_CARET = "\\cursor[-0.05em]{0.5em}"
Guppy.kb.SEL_CARET = "\\cursor[-0.2ex]{0.7em}"
Guppy.kb.SMALL_SEL_CARET = "\\cursor[-0.05em]{0.5em}"
Guppy.kb.SEL_COLOR = "red"

Guppy.kb.symbols = {};

Guppy.prototype.is_blacklisted = function(symb_type){
    for(var i = 0; i < this.blacklist.length; i++)
	if(symb_type == this.blacklist[i]) return true;
    return false;
}

Guppy.symb_raw = function(symb_name,latex_symb,text_symb){
    Guppy.kb.symbols[symb_name] = {"output":{"latex":[latex_symb],
					     "text":[text_symb]},
				   "char":true,
				   "type":symb_name};
}

Guppy.symb_func = function(func_name){
    Guppy.kb.symbols[func_name] = {"output":{"latex":"\\"+func_name+"\\left({$1}\\right)",
					     "text":func_name+"({$1})"},
				   "type":func_name,
				   "attrs":{
				       "delete":[1]
				   }
				  };
}

Guppy.prototype.check_for_symbol = function(){
    var instance = this;
    if(this.is_text(this.current)) return;
    for(var s in Guppy.kb.symbols){
	if(instance.current.nodeName == 'e' && s.length <= (instance.caret - instance.space_caret) && !(Guppy.is_blank(instance.current)) && instance.current.firstChild.nodeValue.search_at(instance.caret,s)){
	    var temp = instance.current.firstChild.nodeValue;
	    var temp_caret = instance.caret;
	    instance.current.firstChild.nodeValue = instance.current.firstChild.nodeValue.slice(0,instance.caret-s.length)+instance.current.firstChild.nodeValue.slice(instance.caret);
	    instance.caret -= s.length;
	    var success = instance.insert_symbol(s);
	    if(!success){
		instance.current.firstChild.nodeValue = temp;
		instance.caret = temp_caret;
	    }
	    break;
	}
    }
}

/* keyboard behaviour definitions */

// keys aside from 0-9,a-z,A-Z
Guppy.kb.k_chars = {
    "=":"=",
    "+":"+",
    "-":"-",
    "*":"*",
    ".":".",
    ",":",",
    "shift+/":"/",
    "shift+=":"+",
    "!":"!"
};
Guppy.kb.k_syms = {
    "/":"slash",
    "^":"exp",
    "*":"*",
    "(":"paren",
    "<":"less",
    ">":"greater",
    "_":"sub",
    "|":"abs",
    "shift+up":"exp",
    "shift+down":"sub"
};
Guppy.kb.k_controls = {
    "up":"up",
    "down":"down",
    "right":"right",
    "left":"left",
    "alt+k":"up",
    "alt+j":"down",
    "alt+l":"right",
    "alt+h":"left",
    "space":"spacebar",
    "home":"home",
    "end":"end",
    "backspace":"backspace",
    "del":"delete_key",
    "mod+a":"sel_all",
    "mod+c":"sel_copy",
    "mod+x":"sel_cut",
    "mod+v":"sel_paste",
    "mod+z":"undo",
    "mod+y":"redo",
    "enter":"done",
    "mod+shift+right":"list_extend_copy_right",
    "mod+shift+left":"list_extend_copy_left",
    "mod+right":"list_extend_right",
    "mod+left":"list_extend_left",
    "mod+up":"list_extend_up",
    "mod+down":"list_extend_down",
    "mod+shift+up":"list_extend_copy_up",
    "mod+shift+down":"list_extend_copy_down",
    "mod+backspace":"list_remove",
    "mod+shift+backspace":"list_remove_row",
    "shift+left":"sel_left",
    "shift+right":"sel_right",
    ")":"right_paren",
    "\\":"backslash",
    "tab":"tab"
};

// letters

for(var i = 65; i <= 90; i++){
    Guppy.kb.k_chars[String.fromCharCode(i).toLowerCase()] = String.fromCharCode(i).toLowerCase();
    Guppy.kb.k_chars['shift+'+String.fromCharCode(i).toLowerCase()] = String.fromCharCode(i).toUpperCase();
}

// numbers

for(var i = 48; i <= 57; i++)
    Guppy.kb.k_chars[String.fromCharCode(i)] = String.fromCharCode(i);

Guppy.register_keyboard_handlers = function(){
    Mousetrap.addKeycodes({173: '-'}); // Firefox's special minus (needed for _ = sub binding)
    for(var i in Guppy.kb.k_chars)
    	Mousetrap.bind(i,function(i){ return function(){
	    if(!Guppy.active_guppy) return true;
	    Guppy.active_guppy.temp_cursor.node = null;
	    Guppy.active_guppy.insert_string(Guppy.kb.k_chars[i]);
	    return false;
	}}(i));  
    for(var i in Guppy.kb.k_syms)
    	Mousetrap.bind(i,function(i){ return function(){
	    if(!Guppy.active_guppy) return true;
	    Guppy.active_guppy.temp_cursor.node = null;
	    Guppy.active_guppy.space_caret = 0;
	    Guppy.active_guppy.insert_symbol(Guppy.kb.k_syms[i]);
	    return false;
	}}(i));
    for(var i in Guppy.kb.k_controls)
    	Mousetrap.bind(i,function(i){ return function(){
	    if(!Guppy.active_guppy) return true;
	    Guppy.active_guppy.space_caret = 0;
	    Guppy.active_guppy[Guppy.kb.k_controls[i]]();
	    Guppy.active_guppy.temp_cursor.node = null;
	    Guppy.active_guppy.render(["up","down","right","left","home","end","sel_left","sel_right"].indexOf(i) < 0);
	    return false;
	}}(i));
    
}

module.exports = Guppy;

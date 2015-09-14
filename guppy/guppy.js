String.prototype.splice = function(idx, s){ return (this.slice(0,idx) + s + this.slice(idx)); };
String.prototype.splicen = function(idx, s, n){ return (this.slice(0,idx) + s + this.slice(idx+n));};
String.prototype.search_at = function(idx, s){ return (this.substring(idx-s.length,idx) == s); };

window.addEventListener("keydown",key_down, false);
window.addEventListener("keyup",key_up, false);
window.addEventListener("focus", function(e) { alt_down = false; }, false);


var Guppy = function(guppy_div, properties){
    properties = properties || {};
    if(typeof guppy_div === 'string' || guppy_div instanceof String){
	guppy_div = document.getElementById(guppy_div);
    }
    if(guppy_div.id in Guppy.instances){
	console.log("There is already a Guppy object with this ID");
	return;
    }
    Guppy.instances[guppy_div.id] = this;
    this.editor_active = true;
    this.clipboard = null;
    
    if('xml_content' in properties){
	this.base = (new window.DOMParser()).parseFromString(properties.xml_content, "text/xml");
    }
    else {
	this.base = (new window.DOMParser()).parseFromString("<m></m>", "text/xml");
    }
    
    this.current = this.base.documentElement;
    this.current.appendChild(this.make_e(""));
    this.current = this.current.firstChild;
    this.caret = 0;
    this.sel_start = null;
    this.sel_end = null;
    this.editor = guppy_div;
    console.log("EDITOR",this.editor);
    
    this.raw = null;
    this.xml_area = null;
    this.type_blacklist = [];
    
    if('raw_div_id' in properties){
	this.raw = document.getElementById(properties.raw_div_id);
    }
    if('xml_div_id' in properties){
	this.xml_area = document.getElementById(properties.xml_div_id);
    }
    if('blacklist' in properties){
	this.type_blacklist = properties.blacklist;
    }

    this.undo_data = [];
    this.undo_now = -1;
    
    this.sel_status = Guppy.SEL_NONE;
    
    // this.render();
    this.checkpoint();
    if(Guppy.active_guppy == null) Guppy.active_guppy = this;
    console.log("ACTIVE",Guppy.active_guppy);
}

/* Functions intended for external use */

Guppy.guppy_init = function(path){
    Guppy.get_latexify(path);
}

Guppy.prototype.get_content = function(t){
    if(t != "xml") return Guppy.xsltify(t,this.base);
    else return (new XMLSerializer()).serializeToString(this.base);
}

Guppy.instances = {};

/* -------------------- */

Guppy.active_guppy = null;
Guppy.xsltProcessor = null;

Guppy.SEL_NONE = 0;
Guppy.SEL_CURSOR_AT_START = 1;
Guppy.SEL_CURSOR_AT_END = 2;

Guppy.is_blank = function(n){
    return n.firstChild == null || n.firstChild.nodeValue == '';
}

Guppy.get_latexify = function(xsl_path){
    var req = new XMLHttpRequest();
    req.onload = function(){
	console.log(this.responseText);
	var latexify = this.responseText;
	var latexsl = (new window.DOMParser()).parseFromString(latexify, "text/xml");
	console.log((new XMLSerializer()).serializeToString(latexsl));
	Guppy.xsltProcessor = new XSLTProcessor();
	Guppy.xsltProcessor.importStylesheet(latexsl);
	Guppy.xsltProcessor.setParameter("","blank",BLANK);
	Guppy.xsltProcessor.setParameter("","cblank",CURRENT_BLANK);
	console.log("BLANKS:", BLANK,CURRENT_BLANK);
    };
    req.open("get", xsl_path, true);
    req.send();
}

Guppy.xsltify = function(t, base){
    if(Guppy.xsltProcessor == null){
	console.log("not ready");
	return;
    }
    console.log("BB",base);
    Guppy.xsltProcessor.setParameter("","type",t);
    var tex_doc = Guppy.xsltProcessor.transformToDocument(base);
    console.log(tex_doc);
    return (new XMLSerializer()).serializeToString(tex_doc).replace(/\<.?m\>/g,"");
}

Guppy.mouse_down = function(e){
    console.log(e);
    var n = e.target;
    if(e.target == document.getElementById("toggle_ref")) toggle_div("help_card");
    else while(n != null){
	if(n.id in Guppy.instances){
	    Guppy.active_guppy = Guppy.instances[n.id];
	    Guppy.active_guppy.activate();
	    return;
	}
	n = n.parentNode;
    }
    if(Guppy.active_guppy != null){
	Guppy.active_guppy.deactivate();
	Guppy.active_guppy = null;
    }
}

window.addEventListener("mousedown",Guppy.mouse_down, false);


Guppy.prototype.render_node = function(n,t){

    // All the interesting work is done by xsltify and latexify.xsl.  This function just adds in the cursor and selection-start cursor
    
    console.log("cc",this.caret,"=caret",this.current,this.current.firstChild.nodeValue.slice(0,this.caret),"bb",this.current.firstChild.nodeValue.slice(this.caret+CARET.length));
    var output = "";
    if(t == "latex"){
	var cleanup = [];
	var sel_cursor;
	if(this.sel_status == Guppy.SEL_CURSOR_AT_START) sel_cursor = this.sel_end;
	if(this.sel_status == Guppy.SEL_CURSOR_AT_END) sel_cursor = this.sel_start;
	// Add cursor
	this.current.setAttribute("current","yes");
	var callback_current = this.current;
	cleanup.push(function(){callback_current.removeAttribute("current");});
	var caret_text = this.is_small(this.current) ? SMALL_CARET : CARET;
	if(this.current.firstChild.nodeValue != "" || this.current.previousSibling != null || this.current.nextSibling != null){
	    console.log("CARETISING",this.sel_status);
	    var idx = this.caret;
	    if(this.sel_status == Guppy.SEL_CURSOR_AT_START) caret_text = caret_text + "\\color{"+SEL_COLOR+"}{";
	    if(this.sel_status == Guppy.SEL_CURSOR_AT_END) caret_text = "}" + caret_text;
	    //if(this.sel_status == Guppy.SEL_CURSOR_AT_END && sel_cursor.node == current) idx += SEL_CARET.length;
	    var prev_val = this.current.firstChild.nodeValue;
	    console.log("AAAAAAAAAAA",prev_val);
	    callback_current = this.current;
	    cleanup.push(function(){callback_current.firstChild.nodeValue = prev_val;});
	    this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splice(idx,caret_text);
	    console.log((new XMLSerializer()).serializeToString(this.base));
	    console.log("CP",prev_val);
	}	
	// Add sel_start
	if(this.sel_status != Guppy.SEL_NONE) {
	    var idx = sel_cursor.caret;
	    if(sel_cursor.node == this.current){
		if(this.sel_status == Guppy.SEL_CURSOR_AT_START) idx += caret_text.length;
		console.log("AT_START");
	    }
	    else{
		var prev_val_sel = sel_cursor.node.firstChild.nodeValue;
		cleanup.push(function(){sel_cursor.node.firstChild.nodeValue = prev_val_sel;});
	    }
	    var sel_caret_text = this.is_small(sel_cursor.node) ? SMALL_SEL_CARET : SEL_CARET;
	    if(this.sel_status == Guppy.SEL_CURSOR_AT_END) sel_caret_text = sel_caret_text + "\\color{"+SEL_COLOR+"}{";
	    if(this.sel_status == Guppy.SEL_CURSOR_AT_START) sel_caret_text = "}" + sel_caret_text;
	    console.log("SEL_IDX",idx);
	    sel_cursor.node.firstChild.nodeValue = sel_cursor.node.firstChild.nodeValue.splice(idx,sel_caret_text);
	    console.log((new XMLSerializer()).serializeToString(this.base));

	}
	console.log(cleanup.length);
	// Render: 
	output = Guppy.xsltify(t, this.base);
	
	// clean up all the mess we made:
	for(var i = cleanup.length - 1; i >= 0; i--){ cleanup[i](); }
	console.log("post cleanup", (new XMLSerializer()).serializeToString(this.base));
	this.print_selection();
	console.log("sel_start_end",this.sel_start,this.sel_end);
    }
    else{
	output = Guppy.xsltify(t, this.base);
    }
    //console.log("cc",caret,"=caret",current.firstChild.nodeValue,current.firstChild.nodeValue.slice(0,caret),"bb",current.firstChild.nodeValue.slice(caret+CARET.length));
    //if(t == "latex") current.firstChild.nodeValue = (caret == 0 ? "" : current.firstChild.nodeValue.slice(0,caret))+current.firstChild.nodeValue.slice(caret+CARET.length);
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
    while(nn != null && nn.nodeName != 'c') nn = nn.nextSibling;
    if(nn != null){
	//Sanity check:
	if(nn.nodeName != 'c' || nn.firstChild.nodeName != 'e'){
	    this.problem('dff');
	    return;
	}
	this.current = nn.firstChild;
    }
}

Guppy.prototype.down_from_f_to_blank = function(){
    var nn = this.current.firstChild;
    while(nn != null && !(nn.nodeName == 'c' && nn.children.length == 1 && nn.firstChild.firstChild.nodeValue == "")){
	console.log("DFFTB",nn);
	nn = nn.nextSibling;
    }
    if(nn != null){
	//Sanity check:
	if(nn.nodeName != 'c' || nn.firstChild.nodeName != 'e'){
	    this.problem('dfftb');
	    return;
	}
	this.current = nn.firstChild;
    }
    else this.down_from_f();
}

Guppy.prototype.delete_from_f = function(){
    var n = this.current;
    var p = n.parentNode;
    var prev = n.previousSibling;
    var next = n.nextSibling;
    var new_text = prev.firstChild.textContent + next.firstChild.textContent;
    var new_node = this.base.createElement("e");
    new_node.appendChild(this.base.createTextNode(new_text));
    this.current = new_node;
    this.caret = prev.firstChild.textContent.length;
    p.insertBefore(new_node, prev);
    p.removeChild(prev);
    p.removeChild(n);
    p.removeChild(next);
}

Guppy.prototype.next_node_from_e = function(n){
    if(n == null || n.nodeName != 'e') return null;
    // If we have a next sibling f node, use that:
    if(n.nextSibling != null){
	if(n.nextSibling.nodeName != 'f'){
	    this.problem('nnfe3');
	    return null;
	}
	console.log("next");
	var nc = n.nextSibling.firstChild;
	while(nc != null){
	    if(nc.nodeName == 'c')
		//return n.nextSibling; //TEST
		return nc.firstChild;
	    nc = nc.nextSibling
	}
	return n.nextSibling.nextSibling;
    }
    // If not, then we're either at the top level or our parent is a c
    // child of an f node, at which point we should look to see our
    // parent has a next sibling c node: 
    if(n.parentNode.nextSibling != null && n.parentNode.nextSibling.nodeName == 'c'){
	var nn = n.parentNode.nextSibling.firstChild;
	//Another sanity check:
	if(nn.nodeName != 'e'){
	    this.problem('nnfe1');
	    return null
	}
	console.log("parent.next.child")
	return nn;
    }
    // If we're actually at the top level, then do nothing: 
    if(n.parentNode.parentNode == null) return null;
    //Another sanity check: 
    if(n.parentNode.parentNode.nodeName != 'f'){
	this.problem('nnfe2');
	return null;
    }
    return n.parentNode.parentNode.nextSibling;
}

Guppy.prototype.prev_node_from_e = function(n){
    console.log(n.previousSibling);
    if(n == null || n.nodeName != 'e') return null;
    if(n.previousSibling != null){
	if(n.previousSibling.nodeName != 'f'){
	    this.problem('pnfe3');
	    return null;
	}
	var nc = n.previousSibling.lastChild;
	while(nc != null){
	    if(nc.nodeName == 'c')
		// return n.previousSibling; //TEST
		return nc.lastChild;
	    nc = nc.previousSibling
	}
	return n.previousSibling.previousSibling;
    }
    else if(n.parentNode.previousSibling != null && n.parentNode.previousSibling.nodeName == 'c'){
	var nn = n.parentNode.previousSibling.lastChild;
	//Another sanity check:
	if(nn.nodeName != 'e'){
	    this.problem('pnfe1');
	    return null
	}
	return nn;
    }
    else if(n.parentNode.parentNode == null) return null;
    //Another sanity check: 
    if(n.parentNode.parentNode.nodeName != 'f'){
	this.problem('pnfe2');
	return null;
    }
    // return n.parentNode.parentNode; //TEST
    return n.parentNode.parentNode.previousSibling;
}

Guppy.prototype.symbol_to_node = function(sym_name, content){
    // syn_name is a key in the symbols dictionary
    //
    // content is a list of nodes to insert
    
    var s = symbols[sym_name];
    var f = this.base.createElement("f");
    if(s['char']) f.setAttribute("c","yes");
    
    var first_ref = -1;
    var refs_count = 0;
    var first;

    // Make the b nodes for rendering each output
    for(var t in s["output"]){
	var b = this.base.createElement("b");
	b.setAttribute("p",t);
	//console.log(s,t,s["output"][t],s["output"][t].length);
	for(var i = 0; i < s["output"][t].length; i++){
	    if(typeof s["output"][t][i] == 'string' || s["output"][t][i] instanceof String){
		var nt = this.base.createTextNode(s["output"][t][i]);
		b.appendChild(nt);
	    }
	    else{
		var nt = this.base.createElement("r");
		nt.setAttribute("ref",s["output"][t][i]);
		//console.log(t,s["output"][t],s["output"][t][i]);
		if(t == 'latex') {
		    if(first_ref == -1) first_ref = s["output"][t][i];
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
	//console.log(refs_count,first_ref,i,ne);
	if(i+1 == first_ref) first = nc.lastChild;
	for(var a in s['attrs'])
	    if(s['attrs'][a][i] != 0) nc.setAttribute(a,s['attrs'][a][i]);
	f.appendChild(nc);
    }
    console.log("FF",f);
    return {"f":f, "first":first};
}

Guppy.prototype.is_small = function(nn){
    var n = nn.parentNode;
    while(n != null){
	if(n.getAttribute("size") == "s"){
	    return true;
	}
	n = n.parentNode.parentNode;
    }
    return false;
}

Guppy.prototype.insert_symbol = function(n,idx,sym_name){
    var s = symbols[sym_name];
    if(is_blacklisted(s['type'])){
	console.log("BLACKLISTED");
	return false;
    }
    var node_list = {};
    var content = {};
    var left_piece,right_piece;
    var cur = s['current'] == null ? 0 : parseInt(s['current']);
    var to_remove = [];
    var to_replace = null;
    var replace_f = false;
    
    console.log("cur",cur);
    
    if(cur > 0){
	cur--;
	console.log(cur);
	if(this.sel_status != Guppy.SEL_NONE){
	    console.log("SEL",this.current);
	    var sel = this.sel_get();
	    sel_parent = sel.involved[0].parentNode;
	    console.log("SCC", sel, "\nABC", sel.involved[0], sel_parent, sel.node_list, this.current);
	    to_remove = sel.involved;
	    left_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(0,this.sel_start.caret));
	    right_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(this.sel_start.caret));
	    content[cur] = sel.node_list;
	    console.log("DONE_SEL",left_piece,content,right_piece);
	}
	else if(s['current_type'] == 'token'){
	    console.log("TOKEN");
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
	console.log("splitting",this.current,this.caret);
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
    console.log(this.current,this.current.parentNode);
    console.log("SO",s,s["output"])
    console.log("TR",this.current,this.current_parent,to_remove);
    
    var sym = this.symbol_to_node(sym_name,content);
    var f = sym.f;
    var new_current = sym.first;

    var next = this.current.nextSibling;

    console.log("CSSCS",this.current,this.current.parentNode);

    if(replace_f){
	console.log(to_replace,current_parent,f);
	current_parent.replaceChild(f,to_replace);
    }
    else{
	if(to_remove.length == 0) this.current.parentNode.removeChild(this.current);
	
	for(var i = 0; i < to_remove.length; i++){
	    console.log("removing", to_remove[i]," from" , current_parent);
	    if(next == to_remove[i]) next = next.nextSibling;
	    current_parent.removeChild(to_remove[i]);
	}
	current_parent.insertBefore(left_piece, next);
	current_parent.insertBefore(f, next);
	current_parent.insertBefore(right_piece, next);
    }
    
    console.log((new XMLSerializer()).serializeToString(this.base));
    console.log(new_current);
    this.caret = 0;
    this.current = f;
    if(s['char']){
	this.current = this.current.nextSibling;
    }
    else this.down_from_f_to_blank();

    this.sel_clear();
    this.checkpoint();
    // if(new_current != null) {
    // 	if(new_current.firstChild == null) new_current.appendChild(this.base.createTextNode(""));
    // 	current = new_current;
    // }
    // else{ // WHEN COULD THIS HAPPEN--no children of an f?
    // 	current = right_piece;
    // }
    return true;
}

Guppy.prototype.sel_get = function(){
    console.log("sel_start_end",this.sel_start,this.sel_end,this.current,this.caret);
    if(this.sel_status == Guppy.SEL_NONE){
	if(this.current.nodeName == 'f'){ // This block should be dead
	    console.log("ABCD",this.current,this.current.previousSibling,this.current.parentNode);
	    this.sel_start = {"node":this.current, "caret":this.current.previousSibling.firstChild.nodeValue.length};
	    return {"node_list":[this.make_e(""),this.current,this.make_e("")],
		    "remnant":this.make_e(this.current.previousSibling.firstChild.nodeValue + this.current.nextSibling.firstChild.nodeValue),
		    "involved":[this.current.previousSibling, this.current, this.current.nextSibling]}
	}
	else return null;
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
    console.log("NL",node_list);
    return {"node_list":node_list,
	    "remnant":remnant,
	    "involved":involved,
	    "cursor":0};
}

Guppy.prototype.print_selection = function(){
    var sel = this.sel_get();
    console.log(sel);
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
    // ans += "\n remnant: \n";
    // ans += (new XMLSerializer()).serializeToString(sel.remnant) + "\n";
    console.log(ans);
}

Guppy.prototype.make_e = function(text){
    var new_node = this.base.createElement("e");
    new_node.appendChild(this.base.createTextNode(text));
    return new_node;
}

Guppy.prototype.node_insert = function(s){
    if(this.sel_status != Guppy.SEL_NONE){
	this.sel_delete();
	this.sel_clear();
    }
    console.log("ASD",this.caret,this.current,this.current.firstChild.nodeValue,s);
    this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splice(this.caret,s)
    this.caret += s.length;
    this.checkpoint();
}

Guppy.prototype.render = function(){
    var tex = this.render_node(this.base,"latex");
    console.log(this.caret,"TEX", tex);
    katex.render(tex,this.editor);
    if(this.raw != null) this.raw.innerHTML = render_node(this.base,"calc");
    if(this.xml_area != null) this.xml_area.value = "MX\n" + (new XMLSerializer()).serializeToString(this.base) + "\n\nCALC\n" +render_node(this.base,"calc") + "\n\nTeX\n" + tex;
}

Guppy.prototype.activate = function(){
    this.editor_active = true;
    this.editor.style.backgroundColor='white';
    this.editor.style.border='2px solid blue';
}

Guppy.prototype.deactivate = function(){
    this.editor_active = false;
    this.editor.style.backgroundColor='#eee';
    this.editor.style.border='2px solid black';
}

Guppy.prototype.sel_copy = function(){
    this.clipboard = this.sel_get().node_list;
    this.sel_clear();
}

Guppy.prototype.sel_cut = function(){
    this.clipboard = this.sel_delete();
    this.sel_clear();
}

Guppy.prototype.sel_paste = function(){
    var real_clipboard = [];
    for(var i = 0; i < this.clipboard.length; i++){
	real_clipboard.push(this.clipboard[i].cloneNode(true));
    }
    console.log("CLIPBOARD",this.clipboard);
    console.log("PASTING");
    
    if(real_clipboard.length == 1){
	console.log("wimp");
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
	console.log(nn);
	for(var i = 1; i < real_clipboard.length - 1; i++)
	    this.current.parentNode.insertBefore(real_clipboard[i], nn);
	this.current = nn;
	this.caret = real_clipboard[real_clipboard.length-1].firstChild.nodeValue.length
    }
}    

Guppy.prototype.sel_clear = function(){
    this.sel_start = null;    
    this.sel_end = null;
    this.sel_status = Guppy.SEL_NONE;
}

Guppy.prototype.sel_delete = function(){
    var sel = this.sel_get();
    sel_parent = sel.involved[0].parentNode;
    sel_prev = sel.involved[0].previousSibling;
    console.log("SD", sel, "\nABC", sel.involved[0], sel_parent, sel_prev);
    for(var i = 0; i < sel.involved.length; i++){
	var n = sel.involved[i];
	sel_parent.removeChild(n);
    }
    if(sel_prev == null){
	console.log("PREVN",sel);
	if(sel_parent.firstChild == null)
	    sel_parent.appendChild(sel.remnant);
	else
	    sel_parent.insertBefore(sel.remnant, sel_parent.firstChild);
    }
    else if(sel_prev.nodeName == 'f'){
	console.log("PREVF",sel_prev.nextSibling);
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

Guppy.prototype.sel_right = function(){
    if(this.sel_status == Guppy.SEL_NONE){
	this.set_sel_start();
	this.sel_status = Guppy.SEL_CURSOR_AT_END;
    }
    console.log("EEEE");
    if(this.caret >= this.get_length(this.current)){
	var nn = this.current.nextSibling;
	if(nn != null){
	    this.current = nn.nextSibling;
	    this.caret = 0;
	    this.set_sel_boundary(Guppy.SEL_CURSOR_AT_END);
	    console.log("asda");
	}
	else console.log("at end while selecting");
    }
    else{
	this.caret += 1;
	this.set_sel_boundary(Guppy.SEL_CURSOR_AT_END);
	console.log("asdb");
    }
    console.log("SS",this.sel_status, this.sel_start, this.sel_end);
    if(this.sel_start.node == this.sel_end.node && this.sel_start.caret == this.sel_end.caret){
	this.sel_status = Guppy.SEL_NONE;
    }
}

Guppy.prototype.set_sel_boundary = function(sstatus){
    if(this.sel_status == Guppy.SEL_NONE) this.sel_status = sstatus;
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
    console.log("EEEE");
    if(this.caret <= 0){
	var nn = this.current.previousSibling;
	if(nn != null){
	    this.current = nn.previousSibling;
	    this.caret = this.current.firstChild.nodeValue.length;
	    this.set_sel_boundary(Guppy.SEL_CURSOR_AT_START);
	    console.log("asdeee");
	}
	else console.log("at start while selecting");
    }
    else{
	this.caret -= 1;
	this.set_sel_boundary(Guppy.SEL_CURSOR_AT_START);
	console.log("asdb");
    }
    console.log("SS",this.sel_status, this.sel_start, this.sel_end);
    if(this.sel_start.node == this.sel_end.node && this.sel_start.caret == this.sel_end.caret){
	this.sel_status = Guppy.SEL_NONE;
    }
}

Guppy.prototype.right = function(){
    this.sel_clear();
    console.log("R",this.current,this.caret);
    if(this.caret >= this.get_length(this.current)){
	var nn = this.next_node_from_e(this.current);
	if(nn != null){
	    this.current = nn;
	    this.caret = 0;
	}
	else console.log("at end or problem");
    }
    else{
	this.caret += 1;
    }
    console.log("R",this.current,this.current.parentNode,this.caret);
}

Guppy.prototype.get_length = function(n){
    if(Guppy.is_blank(n) || n.nodeName == 'f') return 0
    return n.firstChild.nodeValue.length;
    
}

Guppy.prototype.left = function(){
    this.sel_clear();
    console.log("L",this.current,this.current.firstChild.nodeValue,this.caret);
    if(this.caret <= 0){
	var pn = this.prev_node_from_e(this.current);
	if(pn != null){
	    this.current = pn;
	    this.caret = this.current.firstChild.nodeValue.length;
	}
	else console.log("at beginnning or problem");
    }
    else{
	this.caret -= 1;
    }
    console.log(this.current,this.caret);
}

Guppy.prototype.delete_from_e = function(){
    if(this.caret > 0){
	this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splicen(this.caret-1,"",1);
	this.caret--;
	console.log("bk","|"+this.current.firstChild.nodeValue+"|",this.current.firstChild.nodeValue.length);
    }
    else{
	if(this.current.parentNode.previousSibling != null && this.current.parentNode.previousSibling.nodeName == 'c'){
	    // We're in a c child of an f node, but not the first one.  Go to the previous c
	    this.left();
	}
	else if(this.current.previousSibling != null && this.current.previousSibling.getAttribute("c") == "yes"){
	    // The previous node is an f node but is really just a character.  Delete it.
	    this.current = this.current.previousSibling;
	    this.delete_from_f();
	}
	else if(this.current.previousSibling != null && this.current.previousSibling.nodeName == 'f'){
	    // We're in an e node just after an f node.  Move back into the f node (delete it?)
	    this.left();
	}
	else if(this.current.previousSibling == null && this.current.parentNode.nodeName == 'c' && (this.current.parentNode.previousSibling == null || this.current.parentNode.previousSibling.nodeName != 'c')){
	    // We're in the first c child of an f node and at the beginning--delete the f node
	    this.current = this.current.parentNode.parentNode;
	    this.delete_from_f();
	}
	else{
	    // We're at the beginning (hopefully!) 
	    console.log("AT BEGINNING!");
	}
    }
}

Guppy.prototype.backspace = function(){
    if(this.sel_status != Guppy.SEL_NONE){
	this.sel_delete();
	this.sel_status = Guppy.SEL_NONE;
    }
    else this.delete_from_e();
}

Guppy.prototype.right_paren = function(){
    if(this.current.nodeName == 'e' && this.caret < this.current.firstChild.nodeValue.length - 1) return;
    else this.right();
}

Guppy.prototype.up = function(){
    this.sel_clear();
    if(this.current.parentNode.hasAttribute("up")){
	var t = parseInt(this.current.parentNode.getAttribute("up"));
	console.log("TTT",t);
	var f = this.current.parentNode.parentNode;
	console.log(f);
	var n = f.firstChild;
	while(n != null && t > 0){
	    if(n.nodeName == 'c') t--;
	    if(t > 0) n = n.nextSibling;
	}
	console.log(n);
	this.current = n.lastChild;
	this.caret = this.current.firstChild.nodeValue.length;
    }
    // else{
    // 	if(current.parentNode.parentNode.nodeName == 'f'){
    // 	    current = current.parentNode.parentNode.previousSibling;
    // 	    caret = current.firstChild.nodeValue.length;
    // 	}
    // }
}

Guppy.prototype.down = function(){
    this.sel_clear();
    if(this.current.parentNode.hasAttribute("down")){
	var t = parseInt(this.current.parentNode.getAttribute("down"));
	console.log("TTT",t);
	var f = this.current.parentNode.parentNode;
	console.log(f);
	var n = f.firstChild;
	while(n != null && t > 0){
	    if(n.nodeName == 'c') t--;
	    if(t > 0) n = n.nextSibling;
	}
	console.log(n);
	this.current = n.lastChild;
	this.caret = this.current.firstChild.nodeValue.length;
    }
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
    this.current.removeAttribute("current");
    this.current.removeAttribute("caret");
}

Guppy.prototype.restore = function(t){
    console.log("TTT",t);
    this.base = this.undo_data[t].cloneNode(true);
    console.log((new XMLSerializer()).serializeToString(this.base));
    find_current();
    this.current.removeAttribute("current");
    this.current.removeAttribute("caret");
}

Guppy.prototype.find_current = function(){
    this.current = this.base.evaluate("//*[@current='yes']", this.base.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    this.caret = parseInt(this.current.getAttribute("caret"));
}

Guppy.prototype.undo = function(){
    console.log("UNDO");
    print_undo_data();
    if(this.undo_now <= 0) return;
    console.log("UNDOING");
    this.undo_now--;
    restore(this.undo_now);
}

Guppy.prototype.redo = function(){
    console.log("REDO");
    print_undo_data();
    if(this.undo_now >= this.undo_data.length-1) return;
    console.log("REDOING");
    this.undo_now++;
    restore(this.undo_now);
}

Guppy.prototype.print_undo_data = function(){
    console.log("UNDO DATA");
    console.log(this.undo_now, this.undo_data.length);
    for(var i = 0; i < this.undo_data.length; i++){
	console.log(i, (new XMLSerializer()).serializeToString(this.undo_data[i]));
    }
}

Guppy.prototype.problem = function(s){
    console.log(s);
    console.log('b',(new XMLSerializer()).serializeToString(this.base));
    console.log('c',(new XMLSerializer()).serializeToString(this.current));
}

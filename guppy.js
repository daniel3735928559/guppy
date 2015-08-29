var latexify = "";
var editor_active = true;
var clipboard = null;

get_latexify();;

var base = (new window.DOMParser()).parseFromString("<m></m>", "text/xml");

var xsltProcessor=new XSLTProcessor();

var current = base.documentElement;
current.appendChild(make_e(""));
current = current.firstChild;
var caret = 0;
var sel_start = null;
var sel_end = null;
var editor = document.getElementById("eqn_div");
var raw = document.getElementById("raw_div");
var xml_area = document.getElementById("xml");

var undo_data = [];
undo_now = -1;

var SEL_NONE = 0;
var SEL_CURSOR_AT_START = 1;
var SEL_CURSOR_AT_END = 2;
var sel_status = SEL_NONE;

// var help_text = "";
// for(var s in symbols)
//     help_text += s + "<br />";
// commands.innerHTML = help_text;

window.addEventListener("keydown",key_down, false);
window.addEventListener("keyup",key_up, false);
window.addEventListener("mousedown",mouse_down, false);
window.addEventListener("focus", function(e) { alt_down = false; }, false);

function get_latexify(){
    var req = new XMLHttpRequest();
    req.onload = function(){
	console.log(this.responseText);
	latexify = this.responseText;
	var latexsl = (new window.DOMParser()).parseFromString(latexify, "text/xml");
	console.log((new XMLSerializer()).serializeToString(latexsl));
	xsltProcessor.importStylesheet(latexsl);
	xsltProcessor.setParameter("","blank",BLANK);
	xsltProcessor.setParameter("","cblank",CURRENT_BLANK);
	console.log("BLANKS:", BLANK,CURRENT_BLANK);
    };
    req.open("get", "latexify.xsl", true);
    req.send();


    // XMLHttpRequest to get u
}
		       
function render_node(n,t){

    // All the interesting work is done by xsltify and latexify.xsl.  This function just adds in the cursor and selection-start cursor
    
    console.log("cc",caret,"=caret",current,current.firstChild.nodeValue.slice(0,caret),"bb",current.firstChild.nodeValue.slice(caret+CARET.length));
    var output = "";
    if(t == "latex"){
	var cleanup = [];
	var sel_cursor;
	if(sel_status == SEL_CURSOR_AT_START) sel_cursor = sel_end;
	if(sel_status == SEL_CURSOR_AT_END) sel_cursor = sel_start;
	// Add cursor
	current.setAttribute("current","yes");
	cleanup.push(function(){current.removeAttribute("current");});
	var caret_text = is_small(current) ? SMALL_CARET : CARET;
	if(current.firstChild.nodeValue != "" || current.previousSibling != null || current.nextSibling != null){
	    console.log("CARETISING",sel_status);
	    var idx = caret;
	    if(sel_status == SEL_CURSOR_AT_START) caret_text = caret_text + "\\color{"+SEL_COLOR+"}{";
	    if(sel_status == SEL_CURSOR_AT_END) caret_text = "}" + caret_text;
	    //if(sel_status == SEL_CURSOR_AT_END && sel_cursor.node == current) idx += SEL_CARET.length;
	    var prev_val = current.firstChild.nodeValue;
	    console.log("AAAAAAAAAAA",prev_val);
	    cleanup.push(function(){current.firstChild.nodeValue = prev_val;});
	    current.firstChild.nodeValue = current.firstChild.nodeValue.splice(idx,caret_text);
	    console.log((new XMLSerializer()).serializeToString(base));
	    console.log("CP",prev_val);
	}	
	// Add sel_start
	if(sel_status != SEL_NONE) {
	    var idx = sel_cursor.caret;
	    if(sel_cursor.node == current){
		if(sel_status == SEL_CURSOR_AT_START) idx += caret_text.length;
		console.log("AT_START");
	    }
	    else{
		var prev_val_sel = sel_cursor.node.firstChild.nodeValue;
		cleanup.push(function(){sel_cursor.node.firstChild.nodeValue = prev_val_sel;});
	    }
	    var sel_caret_text = is_small(sel_cursor.node) ? SMALL_SEL_CARET : SEL_CARET;
	    if(sel_status == SEL_CURSOR_AT_END) sel_caret_text = sel_caret_text + "\\color{"+SEL_COLOR+"}{";
	    if(sel_status == SEL_CURSOR_AT_START) sel_caret_text = "}" + sel_caret_text;
	    console.log("SEL_IDX",idx);
	    sel_cursor.node.firstChild.nodeValue = sel_cursor.node.firstChild.nodeValue.splice(idx,sel_caret_text);
	    console.log((new XMLSerializer()).serializeToString(base));

	}
	console.log(cleanup.length);
	// Render: 
	output = xsltify(t);
	
	// clean up all the mess we made:
	for(var i = cleanup.length - 1; i >= 0; i--){ cleanup[i](); }
	console.log("post cleanup", (new XMLSerializer()).serializeToString(base));
	print_selection();
	console.log("sel_start_end",sel_start,sel_end);
    }
    else{
	output = xsltify(t);
    }
    //console.log("cc",caret,"=caret",current.firstChild.nodeValue,current.firstChild.nodeValue.slice(0,caret),"bb",current.firstChild.nodeValue.slice(caret+CARET.length));
    //if(t == "latex") current.firstChild.nodeValue = (caret == 0 ? "" : current.firstChild.nodeValue.slice(0,caret))+current.firstChild.nodeValue.slice(caret+CARET.length);
    return output
}

function xsltify(t){
    xsltProcessor.setParameter("","type",t);
    var tex_doc = xsltProcessor.transformToDocument(base);
    console.log(tex_doc);
    return (new XMLSerializer()).serializeToString(tex_doc).replace(/\<.?m\>/g,"");
}

function set_sel_start(){
    sel_start = {"node":current, "caret":caret};
}
function set_sel_end(){
    sel_end = {"node":current, "caret":caret};
}

String.prototype.splice = function(idx, s){ return (this.slice(0,idx) + s + this.slice(idx)); };
String.prototype.splicen = function(idx, s, n){ return (this.slice(0,idx) + s + this.slice(idx+n));};
String.prototype.search_at = function(idx, s){ return (this.substring(idx-s.length,idx) == s); };

function next_sibling(n){
    if(n == null) return null;
    var c = n.parentNode.nextSibling;
    while(c != null && c.nodeName != "e") c = c.nextSibling;
    if(c == null) return null
    else return c.firstChild;
}

function prev_sibling(n){
    if(n == null) return null;
    var c = n.parentNode.previousSibling;
    while(c != null && c.nodeName != "e") c = c.previousSibling;
    if(c == null) return null
    else return c.firstChild;
}

function down_from_f(){
    var nn = current.firstChild;
    while(nn != null && nn.nodeName != 'c') nn = nn.nextSibling;
    if(nn != null){
	//Sanity check:
	if(nn.nodeName != 'c' || nn.firstChild.nodeName != 'e'){
	    problem('dff');
	    return;
	}
	current = nn.firstChild;
    }
}

function down_from_f_to_blank(){
    var nn = current.firstChild;
    while(nn != null && !(nn.nodeName == 'c' && nn.children.length == 1 && nn.firstChild.firstChild.nodeValue == "")){
	console.log("DFFTB",nn);
	nn = nn.nextSibling;
    }
    if(nn != null){
	//Sanity check:
	if(nn.nodeName != 'c' || nn.firstChild.nodeName != 'e'){
	    problem('dfftb');
	    return;
	}
	current = nn.firstChild;
    }
    else down_from_f();
}

function delete_from_f(){
    var n = current;
    var p = n.parentNode;
    var prev = n.previousSibling;
    var next = n.nextSibling;
    var new_text = prev.firstChild.textContent + next.firstChild.textContent;
    var new_node = base.createElement("e");
    new_node.appendChild(base.createTextNode(new_text));
    current = new_node;
    caret = prev.firstChild.textContent.length;
    p.insertBefore(new_node, prev);
    p.removeChild(prev);
    p.removeChild(n);
    p.removeChild(next);
}

function next_node_from_e(n){
    if(n == null || n.nodeName != 'e') return null;
    // If we have a next sibling f node, use that:
    if(n.nextSibling != null){
	if(n.nextSibling.nodeName != 'f'){
	    problem('nnfe3');
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
	    problem('nnfe1');
	    return null
	}
	console.log("parent.next.child")
	return nn;
    }
    // If we're actually at the top level, then do nothing: 
    if(n.parentNode.parentNode == null) return null;
    //Another sanity check: 
    if(n.parentNode.parentNode.nodeName != 'f'){
	problem('nnfe2');
	return null;
    }
    return n.parentNode.parentNode.nextSibling;
}

function prev_node_from_e(n){
    console.log(n.previousSibling);
    if(n == null || n.nodeName != 'e') return null;
    if(n.previousSibling != null){
	if(n.previousSibling.nodeName != 'f'){
	    problem('pnfe3');
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
	    problem('pnfe1');
	    return null
	}
	return nn;
    }
    else if(n.parentNode.parentNode == null) return null;
    //Another sanity check: 
    if(n.parentNode.parentNode.nodeName != 'f'){
	problem('pnfe2');
	return null;
    }
    // return n.parentNode.parentNode; //TEST
    return n.parentNode.parentNode.previousSibling;
}

function symbol_to_node(sym_name, content){
    // syn_name is a key in the symbols dictionary
    //
    // content is a list of nodes to insert
    
    var s = symbols[sym_name];
    var f = base.createElement("f");
    if(s['char']) f.setAttribute("c","yes");
    
    var first_ref = -1;
    var refs_count = 0;
    var first;

    // Make the b nodes for rendering each output
    for(var t in s["output"]){
	var b = base.createElement("b");
	b.setAttribute("p",t);
	//console.log(s,t,s["output"][t],s["output"][t].length);
	for(var i = 0; i < s["output"][t].length; i++){
	    if(typeof s["output"][t][i] == 'string' || s["output"][t][i] instanceof String){
		var nt = base.createTextNode(s["output"][t][i]);
		b.appendChild(nt);
	    }
	    else{
		var nt = base.createElement("r");
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
	var nc = base.createElement("c");
	if(i in content){
	    var node_list = content[i];
	    for(var se = 0; se < node_list.length; se++){
		nc.appendChild(node_list[se].cloneNode(true));
	    }
	}
	else nc.appendChild(make_e(""));
	//console.log(refs_count,first_ref,i,ne);
	if(i+1 == first_ref) first = nc.lastChild;
	for(var a in s['attrs'])
	    if(s['attrs'][a][i] != 0) nc.setAttribute(a,s['attrs'][a][i]);
	f.appendChild(nc);
    }
    console.log("FF",f);
    return {"f":f, "first":first};
}

function is_small(nn){
    var n = nn.parentNode;
    while(n != null){
	if(n.getAttribute("size") == "s"){
	    return true;
	}
	n = n.parentNode.parentNode;
    }
    return false;
}

function insert_symbol(n,idx,sym_name){
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
	if(sel_status != SEL_NONE){
	    console.log("SEL",current);
	    var sel = sel_get();
	    sel_parent = sel.involved[0].parentNode;
	    console.log("SCC", sel, "\nABC", sel.involved[0], sel_parent, sel.node_list, current);
	    to_remove = sel.involved;
	    left_piece = make_e(sel.remnant.firstChild.nodeValue.slice(0,sel_start.caret));
	    right_piece = make_e(sel.remnant.firstChild.nodeValue.slice(sel_start.caret));
	    content[cur] = sel.node_list;
	    console.log("DONE_SEL",left_piece,content,right_piece);
	}
	else if(s['current_type'] == 'token'){
	    console.log("TOKEN");
	    // If we're at the beginning, then the token is the previous f node
	    if(caret == 0 && current.previousSibling != null){
		content[cur] = [make_e(""), current.previousSibling, make_e("")];
		to_replace = current.previousSibling;
		replace_f = true;
	    }
	    else{
		// look for [0-9.]+|[a-zA-Z] immediately preceeding the caret and use that as token
		var prev = current.firstChild.nodeValue.substring(0,caret);
		var token = prev.match(/[0-9.]+$|[a-zA-Z]$/);
		if(token != null && token.length > 0){
		    token = token[0];
		    left_piece = make_e(current.firstChild.nodeValue.slice(0,caret-token.length));
		    right_piece = make_e(current.firstChild.nodeValue.slice(caret));
		    content[cur] = [make_e(token)];
		}
	    }
	}
    }
    if(!replace_f && (left_piece == null || right_piece == null)){
	console.log("splitting",current,caret);
	left_piece = make_e(current.firstChild.nodeValue.slice(0,caret));
	right_piece = make_e(current.firstChild.nodeValue.slice(caret));
	to_remove = [current];
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
    var current_parent = current.parentNode;
    console.log(current,current.parentNode);
    console.log("SO",s,s["output"])
    console.log("TR",current,current_parent,to_remove);
    
    var sym = symbol_to_node(sym_name,content);
    var f = sym.f;
    var new_current = sym.first;

    var next = current.nextSibling;

    console.log("CSSCS",current,current.parentNode);

    if(replace_f){
	console.log(to_replace,current_parent,f);
	current_parent.replaceChild(f,to_replace);
    }
    else{
	if(to_remove.length == 0) current.parentNode.removeChild(current);
	
	for(var i = 0; i < to_remove.length; i++){
	    console.log("removing", to_remove[i]," from" , current_parent);
	    if(next == to_remove[i]) next = next.nextSibling;
	    current_parent.removeChild(to_remove[i]);
	}
	current_parent.insertBefore(left_piece, next);
	current_parent.insertBefore(f, next);
	current_parent.insertBefore(right_piece, next);
    }
    
    console.log((new XMLSerializer()).serializeToString(base));
    console.log(new_current);
    caret = 0;
    current = f;
    if(s['char']){
	current = current.nextSibling;
    }
    else down_from_f_to_blank();

    sel_clear();
    checkpoint();
    // if(new_current != null) {
    // 	if(new_current.firstChild == null) new_current.appendChild(base.createTextNode(""));
    // 	current = new_current;
    // }
    // else{ // WHEN COULD THIS HAPPEN--no children of an f?
    // 	current = right_piece;
    // }
    return true;
}

function sel_get(){
    console.log("sel_start_end",sel_start,sel_end,current,caret);
    if(sel_status == SEL_NONE){
	if(current.nodeName == 'f'){ // This block should be dead
	    console.log("ABCD",current,current.previousSibling,current.parentNode);
	    sel_start = {"node":current, "caret":current.previousSibling.firstChild.nodeValue.length};
	    return {"node_list":[make_e(""),current,make_e("")],
		    "remnant":make_e(current.previousSibling.firstChild.nodeValue + current.nextSibling.firstChild.nodeValue),
		    "involved":[current.previousSibling, current, current.nextSibling]}
	}
	else return null;
    }
    var involved = [];
    var node_list = [];
    var remnant = null;

    if(sel_start.node == sel_end.node){
	return {"node_list":[make_e(sel_start.node.firstChild.nodeValue.substring(sel_start.caret, sel_end.caret))],
		"remnant":make_e(sel_start.node.firstChild.nodeValue.substring(0, sel_start.caret) + sel_end.node.firstChild.nodeValue.substring(sel_end.caret)),
		"involved":[sel_start.node]};
    }
    
    node_list.push(make_e(sel_start.node.firstChild.nodeValue.substring(sel_start.caret)));
    involved.push(sel_start.node);
    involved.push(sel_end.node);
    remnant = make_e(sel_start.node.firstChild.nodeValue.substring(0, sel_start.caret) + sel_end.node.firstChild.nodeValue.substring(sel_end.caret));
    var n = sel_start.node.nextSibling;
    while(n != null && n != sel_end.node){
	involved.push(n);
	node_list.push(n);
	n = n.nextSibling;
    }
    node_list.push(make_e(sel_end.node.firstChild.nodeValue.substring(0, sel_end.caret)));
    console.log("NL",node_list);
    return {"node_list":node_list,
	    "remnant":remnant,
	    "involved":involved,
	    "cursor":0};
}

function print_selection(){
    var sel = sel_get();
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

function make_e(text){
    var new_node = base.createElement("e");
    new_node.appendChild(base.createTextNode(text));
    return new_node;
}

function node_insert(s){
    if(sel_status != SEL_NONE){
	sel_delete();
	sel_clear();
    }
    console.log("ASD",caret,current,current.firstChild.nodeValue,s);
    current.firstChild.nodeValue = current.firstChild.nodeValue.splice(caret,s)
    caret += s.length;
    checkpoint();
}

function render(){
    var tex = render_node(base,"latex");
    console.log(caret,"TEX", tex);
    katex.render(tex,editor);
    raw.innerHTML = render_node(base,"calc");
    xml_area.value = "MX\n" + (new XMLSerializer()).serializeToString(base) + "\n\nCALC\n" +render_node(base,"calc") + "\n\nTeX\n" + tex;
}

function activate(){
    editor_active = true;
    editor.style.backgroundColor='white';
    editor.style.border='2px solid blue';
}

function deactivate(){
    editor_active = false;
    editor.style.backgroundColor='#eee';
    editor.style.border='2px solid black';
}


function mouse_down(e){
    console.log(e);
    var n = e.target;
    if(e.target == document.getElementById("toggle_state")) toggle_div("state");
    else if(e.target == document.getElementById("toggle_docs")) toggle_div("help");
    else if(e.target == document.getElementById("toggle_ref")) toggle_div("help_card");
    else if(e.target == document.getElementById("toggle_tests")) toggle_div("tests");
    while(n != null){
	if(n == editor){
	    activate();
	    return;
	}
	n = n.parentNode;
    }
    deactivate();
}

function sel_copy(){
    clipboard = sel_get().node_list;
    sel_clear();
}

function sel_cut(){
    clipboard = sel_delete();
    sel_clear();
}

function sel_paste(){
    var real_clipboard = [];
    for(var i = 0; i < clipboard.length; i++){
	real_clipboard.push(clipboard[i].cloneNode(true));
    }
    console.log("CLIPBOARD",clipboard);
    console.log("PASTING");
    
    if(real_clipboard.length == 1){
	console.log("wimp");
	current.firstChild.nodeValue = current.firstChild.nodeValue.substring(0,caret) + real_clipboard[0].firstChild.nodeValue + current.firstChild.nodeValue.substring(caret);
	caret += real_clipboard[0].firstChild.nodeValue.length;
    }
    else{
	var nn = make_e(real_clipboard[real_clipboard.length-1].firstChild.nodeValue + current.firstChild.nodeValue.substring(caret));
	current.firstChild.nodeValue = current.firstChild.nodeValue.substring(0,caret) + real_clipboard[0].firstChild.nodeValue;
	if(current.nextSibling == null)
	    current.parentNode.appendChild(nn)
	else
	    current.parentNode.insertBefore(nn, current.nextSibling)
	console.log(nn);
	for(var i = 1; i < real_clipboard.length - 1; i++)
	    current.parentNode.insertBefore(real_clipboard[i], nn);
	current = nn;
	caret = real_clipboard[real_clipboard.length-1].firstChild.nodeValue.length
    }
}    

function sel_clear(){
    sel_start = null;    
    sel_end = null;
    sel_status = SEL_NONE;
}

function sel_delete(){
    var sel = sel_get();
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
	console.log("PREVF");
	if(sel_prev.nextNode == null)
	    sel_parent.appendChild(sel.remnant);
	else
	    sel_parent.insertBefore(sel.remnant, sel_prev.nextNode);
    }
    current = sel.remnant
    caret = sel_start.caret;
    return sel.node_list;
}

//Functions for handling navigation and editing commands: 

function sel_right(){
    if(sel_status == SEL_NONE){
	set_sel_start();
	sel_status = SEL_CURSOR_AT_END;
    }
    console.log("EEEE");
    if(caret >= get_length(current)){
	var nn = current.nextSibling;
	if(nn != null){
	    current = nn.nextSibling;
	    caret = 0;
	    set_sel_boundary(SEL_CURSOR_AT_END);
	    console.log("asda");
	}
	else console.log("at end while selecting");
    }
    else{
	caret += 1;
	set_sel_boundary(SEL_CURSOR_AT_END);
	console.log("asdb");
    }
    console.log("SS",sel_status, sel_start, sel_end);
    if(sel_start.node == sel_end.node && sel_start.caret == sel_end.caret){
	sel_status = SEL_NONE;
    }
}

function set_sel_boundary(sstatus){
    if(sel_status == SEL_NONE) sel_status = sstatus;
    if(sel_status == SEL_CURSOR_AT_START)
	set_sel_start();
    else if(sel_status == SEL_CURSOR_AT_END)
	set_sel_end();
}

function sel_left(){
    if(sel_status == SEL_NONE){
	set_sel_end();
	sel_status = SEL_CURSOR_AT_START;
    }
    console.log("EEEE");
    if(caret <= 0){
	var nn = current.previousSibling;
	if(nn != null){
	    current = nn.previousSibling;
	    caret = current.firstChild.nodeValue.length;
	    set_sel_boundary(SEL_CURSOR_AT_START);
	    console.log("asdeee");
	}
	else console.log("at start while selecting");
    }
    else{
	caret -= 1;
	set_sel_boundary(SEL_CURSOR_AT_START);
	console.log("asdb");
    }
    console.log("SS",sel_status, sel_start, sel_end);
    if(sel_start.node == sel_end.node && sel_start.caret == sel_end.caret){
	sel_status = SEL_NONE;
    }
}

function right(){
    sel_clear();
    console.log("R",current,caret);
    if(caret >= get_length(current)){
	var nn = next_node_from_e(current);
	if(nn != null){
	    current = nn;
	    caret = 0;
	}
	else console.log("at end or problem");
    }
    else{
	caret += 1;
    }
    console.log("R",current,current.parentNode,caret);
}

function is_blank(n){
    return n.firstChild == null || n.firstChild.nodeValue == '';
}

function get_length(n){
    if(is_blank(n) || n.nodeName == 'f') return 0
    return n.firstChild.nodeValue.length;
    
}

function left(){
    sel_clear();
    console.log("L",current,current.firstChild.nodeValue,caret);
    if(caret <= 0){
	var pn = prev_node_from_e(current);
	if(pn != null){
	    current = pn;
	    caret = current.firstChild.nodeValue.length;
	}
	else console.log("at beginnning or problem");
    }
    else{
	caret -= 1;
    }
    console.log(current,caret);
}

function delete_from_e(){
    if(caret > 0){
	current.firstChild.nodeValue = current.firstChild.nodeValue.splicen(caret-1,"",1);
	caret--;
	console.log("bk","|"+current.firstChild.nodeValue+"|",current.firstChild.nodeValue.length);
    }
    else{
	if(current.parentNode.previousSibling != null && current.parentNode.previousSibling.nodeName == 'c'){
	    // We're in a c child of an f node, but not the first one.  Go to the previous c
	    left();
	}
	else if(current.previousSibling != null && current.previousSibling.getAttribute("c") == "yes"){
	    // The previous node is an f node but is really just a character.  Delete it.
	    current = current.previousSibling;
	    delete_from_f();
	}
	else if(current.previousSibling != null && current.previousSibling.nodeName == 'f'){
	    // We're in an e node just after an f node.  Move back into the f node (delete it?)
	    left();
	}
	else if(current.previousSibling == null && current.parentNode.nodeName == 'c' && (current.parentNode.previousSibling == null || current.parentNode.previousSibling.nodeName != 'c')){
	    // We're in the first c child of an f node and at the beginning--delete the f node
	    current = current.parentNode.parentNode;
	    delete_from_f();
	}
	else{
	    // We're at the beginning (hopefully!) 
	    console.log("AT BEGINNING!");
	}
    }
}

function backspace(){
    if(sel_status != SEL_NONE){
	sel_delete();
	sel_status = SEL_NONE;
    }
    else delete_from_e();
}

function right_paren(){
    if(current.nodeName == 'e' && caret < current.firstChild.nodeValue.length - 1) return;
    else right();
}

function up(){
    sel_clear();
    if(current.parentNode.hasAttribute("up")){
	var t = parseInt(current.parentNode.getAttribute("up"));
	console.log("TTT",t);
	var f = current.parentNode.parentNode;
	console.log(f);
	var n = f.firstChild;
	while(n != null && t > 0){
	    if(n.nodeName == 'c') t--;
	    if(t > 0) n = n.nextSibling;
	}
	console.log(n);
	current = n.lastChild;
	caret = current.firstChild.nodeValue.length;
    }
    // else{
    // 	if(current.parentNode.parentNode.nodeName == 'f'){
    // 	    current = current.parentNode.parentNode.previousSibling;
    // 	    caret = current.firstChild.nodeValue.length;
    // 	}
    // }
}

function down(){
    sel_clear();
    if(current.parentNode.hasAttribute("down")){
	var t = parseInt(current.parentNode.getAttribute("down"));
	console.log("TTT",t);
	var f = current.parentNode.parentNode;
	console.log(f);
	var n = f.firstChild;
	while(n != null && t > 0){
	    if(n.nodeName == 'c') t--;
	    if(t > 0) n = n.nextSibling;
	}
	console.log(n);
	current = n.lastChild;
	caret = current.firstChild.nodeValue.length;
    }
}

function home(){
    while(current.previousSibling != null)
	current = current.previousSibling;
    caret = 0;
}

function end(){
    while(current.nextSibling != null)
	current = current.nextSibling;
    caret = current.firstChild.nodeValue.length;
}

function checkpoint(){
    current.setAttribute("current","yes");
    current.setAttribute("caret",caret.toString());
    undo_now++;
    undo_data[undo_now] = base.cloneNode(true);
    current.removeAttribute("current");
    current.removeAttribute("caret");
}

function restore(t){
    console.log("TTT",t);
    base = undo_data[t].cloneNode(true);
    console.log((new XMLSerializer()).serializeToString(base));
    find_current();
    current.removeAttribute("current");
    current.removeAttribute("caret");
}

function find_current(){
    current = base.evaluate("//*[@current='yes']", base.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    caret = parseInt(current.getAttribute("caret"));
}

function undo(){
    console.log("UNDO");
    print_undo_data();
    if(undo_now <= 0) return;
    console.log("UNDOING");
    undo_now--;
    restore(undo_now);
}

function redo(){
    console.log("REDO");
    print_undo_data();
    if(undo_now >= undo_data.length-1) return;
    console.log("REDOING");
    undo_now++;
    restore(undo_now);
}

function print_undo_data(){
    console.log("UNDO DATA");
    console.log(undo_now, undo_data.length);
    for(var i = 0; i < undo_data.length; i++){
	console.log(i, (new XMLSerializer()).serializeToString(undo_data[i]));
    }
}

function problem(s){
    console.log(s);
    console.log('b',(new XMLSerializer()).serializeToString(base));
    console.log('c',(new XMLSerializer()).serializeToString(current));
}

render();
checkpoint();

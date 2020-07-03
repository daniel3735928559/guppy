import Doc from './doc.js';
import Keyboard from './keyboard.js';
import Settings from './settings.js';
import Symbols from './symbols.js';
import Utils from './utils.js';

String.prototype.splice = function(idx, s){ return (this.slice(0,idx) + s + this.slice(idx)); };
String.prototype.splicen = function(idx, s, n){ return (this.slice(0,idx) + s + this.slice(idx+n));};
String.prototype.search_at = function(idx, s){ return (this.substring(idx-s.length,idx) == s); };

/**
 * @class
 * @classdesc The engine for scripting the editor.  To access the
 * engine for scripting a particular Guppy instance, say called
 * `"guppy1"`, do `Guppy("guppy1").engine`.
 *
 * At that point, you can, for example, move that editor's cursor
 * one spot to the left with `Guppy("guppy1").engine.left()`.
*/
var Engine = function(parent){
    this.parent = parent;
    this.symbols = {};
    this.events = {};
    this.settings = {};
    this.doc = new Doc();
    this.current = this.doc.root().firstChild;
    this.caret = 0;
    this.space_caret = 0;
    this.sel_start = null;
    this.sel_end = null;
    this.undo_data = [];
    this.undo_now = -1;
    this.sel_status = Engine.SEL_NONE;
    this.checkpoint();
    this.symbols = JSON.parse(JSON.stringify(Symbols.symbols));
}

Engine.kb_info = new Keyboard();
Engine.SEL_NONE = 0;
Engine.SEL_CURSOR_AT_START = 1;
Engine.SEL_CURSOR_AT_END = 2;
Engine.clipboard = null;

Engine.prototype.setting = function(name){
    return name in this.settings ? this.settings[name] : Settings.config.settings[name];
}

Engine.prototype.event = function(name){
    return name in this.events ? this.events[name] : Settings.config.events[name];
}

/**
    Get the content of the editor
    @memberof Engine
    @param {string} t - The type of content to render ("latex", "text", or "xml").
*/
Engine.prototype.get_content = function(t,r){
    return this.doc.get_content(t,r);
}

/**
    Set the XML content of the editor
    @memberof Engine
    @param {string} xml_data - An XML string of the content to place in the editor
*/
Engine.prototype.set_content = function(xml_data){
    this.set_doc(new Doc(xml_data));
}

/**
    Set the document of the editor
    @memberof Engine
    @param {Doc} doc - The Doc that will be the editor's source
*/
Engine.prototype.set_doc = function(doc){
    this.doc = doc;
    this.current = this.doc.root().firstChild;
    this.caret = 0;
    this.sel_start = null;
    this.sel_end = null;
    this.undo_data = [];
    this.undo_now = -1;
    this.sel_status = Engine.SEL_NONE;
    this.checkpoint();
}

Engine.prototype.import_text = function(text){
    this.doc.import_text(text, this.symbols);
    this.set_doc(this.doc);
}

Engine.prototype.import_latex = function(text){
    this.doc.import_latex(text, this.symbols);
    this.set_doc(this.doc);
}

Engine.prototype.import_ast = function(ast){
    this.doc.import_ast(ast, this.symbols);
    this.set_doc(this.doc);
}

Engine.prototype.fire_event = function(event, args){
    args = args || {};
    args.target = this.parent || this;
    args.type = event;
    var ev = this.event(event);
    if(ev) ev(args);
}

/**
    Remove a symbol from this instance of the editor.
    @memberof Engine
    @param {string} name - The name of the symbol to remove.
*/
Engine.prototype.remove_symbol = function(name){
    if(this.symbols[name]) delete this.symbols[name];
}

/**
    Add a symbol to this instance of the editor.
    @memberof Engine
    @param {string} name - param
    @param {Object} symbol - If `template` is present, this is the
    template arguments.  Otherwise, it is a complete specification
    of the symbol, the format for which can be found in the
    documentation for Guppy.add_global_symbol.
    @param {string} [template] - The name of the template to use.
*/
Engine.prototype.add_symbol = function(name, symbol){
    this.symbols[name] = symbol;
}

Engine.prototype.select_to = function(loc, sel_cursor, sel_caret, mouse){
    if(loc.current == sel_cursor && loc.caret == sel_caret){
        this.current = loc.current;
        this.caret = loc.caret;
        this.sel_status = Engine.SEL_NONE;
    }
    else if(loc.pos == "left"){
        this.sel_end = {"node":sel_cursor,"caret":sel_caret};
        this.current = loc.current;
        this.caret = loc.caret;
        this.set_sel_boundary(Engine.SEL_CURSOR_AT_START, mouse);
    }
    else if(loc.pos == "right"){
        this.sel_start = {"node":sel_cursor,"caret":sel_caret};
        this.current = loc.current;
        this.caret = loc.caret;
        this.set_sel_boundary(Engine.SEL_CURSOR_AT_END, mouse);
    }
}

Engine.prototype.set_sel_start = function(){
    this.sel_start = {"node":this.current, "caret":this.caret};
}

Engine.prototype.set_sel_end = function(){
    this.sel_end = {"node":this.current, "caret":this.caret};
}

Engine.prototype.add_paths = function(n,path){
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

Engine.prototype.add_classes_cursors = function(n){
    if(n.nodeName == "e"){
        var text = n.firstChild.nodeValue;
        var ans = "";
        var sel_cursor;
	var text_node = Utils.is_text(n);
        if(this.sel_status == Engine.SEL_CURSOR_AT_START) sel_cursor = this.sel_end;
        if(this.sel_status == Engine.SEL_CURSOR_AT_END) sel_cursor = this.sel_start;
        if(this.sel_status != Engine.SEL_NONE){
            var sel_caret_text = Utils.is_small(sel_cursor.node) ? Utils.SMALL_SEL_CARET : Utils.SEL_CARET;
            if(text.length == 0 && n.parentNode.childElementCount > 1){
                sel_caret_text = "\\blue{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0}{"+sel_caret_text+"}}";
            }
            else{
                sel_caret_text = "\\blue{"+sel_caret_text+"}";
            }
            if(this.sel_status == Engine.SEL_CURSOR_AT_END) sel_caret_text = sel_caret_text + "\\"+Utils.SEL_COLOR+"{";
            if(this.sel_status == Engine.SEL_CURSOR_AT_START) sel_caret_text = "}" + sel_caret_text;
        }
        var caret_text = "";
        var temp_caret_text = "";
        if(text.length == 0){
            if(n.parentNode.childElementCount == 1){
                if(this.current == n){
                    var blank_caret = this.setting("blank_caret") || (Utils.is_small(this.current) ? Utils.SMALL_CARET : Utils.CARET);
                    ans = "\\red{\\xmlClass{main_cursor guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{"+blank_caret+"}}";
                }
                else{
                    var blank_placeholder = this.setting("blank_placeholder") || "[?]";
                    if(this.temp_cursor.node == n)
                        ans = "\\gray{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{"+blank_placeholder+"}}";
                    else
                        ans = "\\blue{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{"+blank_placeholder+"}}";
                }
            }
            else if(this.temp_cursor.node != n && this.current != n && (!(sel_cursor) || sel_cursor.node != n)){
                // These are the empty e elements at either end of
                // a c or m node, such as the space before and
                // after both the sin and x^2 in sin(x^2)
                //
                // Here, we add in a small element so that we can
                // use the mouse to select these areas
                ans = "\\phantom{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{\\hspace{0pt}}}";
            }
        }
        for(var i = 0; i < text.length+1; i++){
            if(n == this.current && i == this.caret && (text.length > 0 || n.parentNode.childElementCount > 1)){
                caret_text = Utils.is_small(this.current) ? Utils.SMALL_CARET : Utils.CARET;
                if(text.length == 0)
                    caret_text = "\\red{\\xmlClass{main_cursor guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0}{"+caret_text+"}}";
                else{
                    caret_text = "\\red{\\xmlClass{main_cursor}{"+caret_text+"}}"
                }
                if(this.sel_status == Engine.SEL_CURSOR_AT_START)
                    caret_text = caret_text + "\\"+Utils.SEL_COLOR+"{";
                else if(this.sel_status == Engine.SEL_CURSOR_AT_END)
                    caret_text = "}" + caret_text;
                ans += caret_text;
            }
            else if(this.sel_status != Engine.SEL_NONE && sel_cursor.node == n && i == sel_cursor.caret){
                ans += sel_caret_text;
            }
            else if(this.temp_cursor.node == n && i == this.temp_cursor.caret && (text.length > 0 || n.parentNode.childElementCount > 1)){
                temp_caret_text = Utils.is_small(this.current) ? Utils.TEMP_SMALL_CARET : Utils.TEMP_CARET;
                if(text.length == 0){
                    temp_caret_text = "\\gray{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0}{"+temp_caret_text+"}}";
                    }
                else
                    temp_caret_text = "\\gray{"+temp_caret_text+"}";
                ans += temp_caret_text;
            }
            if(i < text.length) ans += "\\xmlClass{guppy_elt guppy_loc_"+n.getAttribute("path")+"_"+i+"}{"+text[i]+"}";
        }
        if(text_node && n == this.current){
            ans = "\\xmlClass{guppy_text_current}{{"+ans+"}}";
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

Engine.prototype.remove_cursors_classes = function(n){
    if(n.nodeName == "e"){
        n.removeAttribute("path");
        n.removeAttribute("render");
        n.removeAttribute("current");
        n.removeAttribute("temp");
    }
    else{
        for(var c = n.firstChild; c != null; c = c.nextSibling){
            if(c.nodeType == 1){ this.remove_cursors_classes(c); }
        }
    }
}

Engine.prototype.down_from_f = function(){
    var nn = this.current.firstChild;
    while(nn != null && nn.nodeName != 'c' && nn.nodeName != 'l') nn = nn.nextSibling;
    if(nn != null){
        while(nn.nodeName == 'l') nn = nn.firstChild;
        this.current = nn.firstChild;
    }
}

Engine.prototype.down_from_f_to_blank = function(){
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

Engine.prototype.delete_from_f = function(to_insert){
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

Engine.prototype.symbol_to_node = function(sym, content){
    return Symbols.symbol_to_node(sym, content, this.doc.base);
}

Engine.prototype.template_to_node = function(tmpl_name, content, name, tmpl_args){
    return Symbols.symbol_to_node(Symbols.make_template_symbol(tmpl_name, name, tmpl_args), content, this.doc.base);
}

/**
    Insert a symbol into the document at the current cursor position.
    @memberof Engine
    @param {string} sym_name - The name of the symbol to insert.
    Should match one of the keys in the symbols JSON object
*/
Engine.prototype.insert_symbol = function(sym_name,sym_args){
    if (this.current.parentNode.hasAttribute("regexp")) {
      this.right();
      this.insert_symbol(sym_name);
      return;
    }
    var s = sym_args ? Symbols.make_template_symbol(sym_name, sym_args.name, sym_args) : this.symbols[sym_name];
    if(s.attrs && this.is_blacklisted(s.attrs.type)){
        return false;
    }
    var content = {};
    var left_piece,right_piece;
    var cur = "input" in s ? s.input : 0;
    var to_remove = [];
    var to_replace = null;
    var replace_f = false;
    var sel;

    if(cur > 0){
        cur--;
        if(this.sel_status != Engine.SEL_NONE){
            sel = this.sel_get();
            to_remove = sel.involved;
            left_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(0,this.sel_start.caret));
            right_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(this.sel_start.caret));
            content[cur] = sel.node_list;
        }
        else if("input" in s){
            // If we're at the beginning, then the token is the previous f node
            if(this.caret == 0 && this.current.previousSibling != null){
                if(this.current.previousSibling.getAttribute("ast_type") != "operator") {
                    content[cur] = [this.make_e(""), this.current.previousSibling, this.make_e("")];
                    to_replace = this.current.previousSibling;
                    replace_f = true;
                }
            }
            else{
                // look for [0-9.]+|[a-zA-Z] immediately preceeding the caret and use that as token
                var prev = this.current.firstChild.nodeValue.substring(0,this.caret);
                var token = prev.charCodeAt(prev.length-1) > 128 ? prev[prev.length-1] : prev.match(/[0-9.]+$|[a-zA-Z]$/);
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
        if(this.sel_status != Engine.SEL_NONE){
            sel = this.sel_get();
            to_remove = sel.involved;
            left_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(0,this.sel_start.caret));
            right_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(this.sel_start.caret));
            content = "input" in s && s.input < 0 ? [] : [sel.node_list];
        }
        else{
            left_piece = this.make_e(this.current.firstChild.nodeValue.slice(0,this.caret));
            right_piece = this.make_e(this.current.firstChild.nodeValue.slice(this.caret));
            to_remove = [this.current];
        }
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
    var sym = this.symbol_to_node(s,content);
    var current_parent = this.current.parentNode;

    var f = sym.f;

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
    if(sym.args.length == 0 || ("input" in s && s.input >= sym.args.length)){
        this.current = this.current.nextSibling;
    }
    else{
        this.down_from_f_to_blank();
        this.caret = this.current.firstChild.textContent.length;
    }

    this.sel_clear();
    this.checkpoint();
    return true;
}

Engine.prototype.sel_get = function(){
    if(this.sel_status == Engine.SEL_NONE){
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

Engine.prototype.make_e = function(text){
    var base = this.doc.base;
    var new_node = base.createElement("e");
    new_node.appendChild(base.createTextNode(text));
    return new_node;
}

/**
    Insert a string into the document at the current cursor position.
    @memberof Engine
    @param {string} s - The string to insert.
*/
Engine.prototype.insert_string = function(s){
    if (this.current.parentNode.hasAttribute("regex")) {
        var regexp = RegExp(this.current.parentNode.getAttribute("regex"));
        var argu = this.current;
        var siblingString = argu.parentNode.firstChild.textContent;
        var newStringArgument = siblingString + s;
        if (!newStringArgument.match(regexp)) {
          this.right();
          this.insert_string(s);
          return;
        }
    }
    var self = this;
    if(this.sel_status != Engine.SEL_NONE){
        this.sel_delete();
        this.sel_clear();
    }
    this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splice(this.caret,s)
    this.caret += s.length;
    this.checkpoint();
    if(this.setting("autoreplace") == "auto") this.check_for_symbol(false);
    if(this.setting("autoreplace") == "whole") this.check_for_symbol(true);
    if(this.setting("autoreplace") == "delay" && setTimeout){
        if(this.delayed_check) clearTimeout(this.delayed_check);
        this.delayed_check = setTimeout(function(){ self.check_for_symbol(false); }, 200);
    }
}

/**
    Insert a copy of the given document into the editor at the current cursor position.
    @memberof Engine
    @param {Doc} doc - The document to insert.
*/
Engine.prototype.insert_doc = function(doc){
    this.insert_nodes(doc.root().childNodes, true);
}

/**
    Copy the current selection, leaving the document unchanged but
    placing the contents of the current selection on the clipboard.
    @memberof Engine
*/
Engine.prototype.sel_copy = function(){
    var sel = this.sel_get();
    if(!sel) return;
    Engine.clipboard = [];
    var cliptype = this.setting("cliptype");
    if(cliptype != "none") var clip_doc = new Doc("<m></m>");
    for(var i = 0; i < sel.node_list.length; i++){
        var node = sel.node_list[i].cloneNode(true);
        Engine.clipboard.push(node);
        if(cliptype != "none") clip_doc.root().appendChild(node.cloneNode(true));//clip_text += this.doc.manual_render(cliptype, node);
    }
    if(cliptype != "none"){
        try{
            this.system_copy(clip_doc.get_content(cliptype));
        }
        catch(e){
            this.system_copy("Syntax error");
        }
    }
    this.sel_clear();
}

Engine.prototype.system_copy = function(text) {
    if (window.clipboardData && window.clipboardData.setData)
        return window.clipboardData.setData("Text", text);
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";
        textarea.style.background = "transparent";
        document.body.appendChild(textarea);
        textarea.select();
        try { return document.execCommand("copy"); }
        catch (ex) { return false; }
        finally { document.body.removeChild(textarea); }
    }
}

/**
    Cut the current selection, removing it from the document and placing it in the clipboard.
    @memberof Engine
*/
Engine.prototype.sel_cut = function(){
    var node_list = this.sel_delete();
    if(!node_list) return;
    Engine.clipboard = [];
    var cliptype = this.setting("cliptype");
    var clip_text = "";
    for(var i = 0; i < node_list.length; i++){
        var node = node_list[i].cloneNode(true);
        Engine.clipboard.push(node);
        if(cliptype != "none") clip_text += this.doc.manual_render(cliptype, node);
    }
    if(cliptype != "none") this.system_copy(clip_text);
    this.sel_clear();
    this.checkpoint();
}

Engine.prototype.insert_nodes = function(node_list, move_cursor){
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
        for(var j = 1; j < real_clipboard.length - 1; j++)
            this.current.parentNode.insertBefore(real_clipboard[j], nn);
        if(move_cursor){
            this.current = nn;
            this.caret = real_clipboard[real_clipboard.length-1].firstChild.nodeValue.length
        }
    }
}

/**
    Paste the current contents of the clipboard.
    @memberof Engine
*/
Engine.prototype.sel_paste = function(){
    this.sel_delete();
    this.sel_clear();
    if(!(Engine.clipboard) || Engine.clipboard.length == 0) return;
    this.insert_nodes(Engine.clipboard, true);
    this.checkpoint();
    return;
}

/**
    Clear the current selection, leaving the document unchanged and
    nothing selected.
    @memberof Engine
*/
Engine.prototype.sel_clear = function(){
    this.sel_start = null;
    this.sel_end = null;
    this.sel_status = Engine.SEL_NONE;
}

/**
    Delete the current selection.
    @memberof Engine
*/
Engine.prototype.sel_delete = function(){
    var sel = this.sel_get();
    if(!sel) return null;
    var sel_parent = sel.involved[0].parentNode;
    var sel_prev = sel.involved[0].previousSibling;
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

/**
    Select the entire contents of the editor.
    @memberof Engine
*/
Engine.prototype.sel_all = function(){
    this.home();
    this.set_sel_start();
    this.end();
    this.set_sel_end();
    if(this.sel_start.node != this.sel_end.node || this.sel_start.caret != this.sel_end.caret)
        this.sel_status = Engine.SEL_CURSOR_AT_END;
}

/**
    function
    @memberof Engine
    @param {string} name - param
*/
Engine.prototype.sel_right = function(){
    if(this.sel_status == Engine.SEL_NONE){
        this.set_sel_start();
        this.sel_status = Engine.SEL_CURSOR_AT_END;
    }
    if(this.caret >= Utils.get_length(this.current)){
        var nn = this.current.nextSibling;
        if(nn != null){
            this.current = nn.nextSibling;
            this.caret = 0;
            this.set_sel_boundary(Engine.SEL_CURSOR_AT_END);
        }
        else{
            this.set_sel_boundary(Engine.SEL_CURSOR_AT_END);
        }
    }
    else{
        this.caret += 1;
        this.set_sel_boundary(Engine.SEL_CURSOR_AT_END);
    }
    if(this.sel_start.node == this.sel_end.node && this.sel_start.caret == this.sel_end.caret){
        this.sel_status = Engine.SEL_NONE;
    }
}

Engine.prototype.set_sel_boundary = function(sstatus, mouse){
    if(this.sel_status == Engine.SEL_NONE || mouse) this.sel_status = sstatus;
    if(this.sel_status == Engine.SEL_CURSOR_AT_START)
        this.set_sel_start();
    else if(this.sel_status == Engine.SEL_CURSOR_AT_END)
        this.set_sel_end();
}

/**
    Move the cursor to the left, adjusting the selection along with
    the cursor.
    @memberof Engine
*/
Engine.prototype.sel_left = function(){
    if(this.sel_status == Engine.SEL_NONE){
        this.set_sel_end();
        this.sel_status = Engine.SEL_CURSOR_AT_START;
    }
    if(this.caret <= 0){
        var nn = this.current.previousSibling;
        if(nn != null){
            this.current = nn.previousSibling;
            this.caret = this.current.firstChild.nodeValue.length;
            this.set_sel_boundary(Engine.SEL_CURSOR_AT_START);
        }
        else{
            this.set_sel_boundary(Engine.SEL_CURSOR_AT_START);
        }
    }
    else{
        this.caret -= 1;
        this.set_sel_boundary(Engine.SEL_CURSOR_AT_START);
    }
    if(this.sel_start.node == this.sel_end.node && this.sel_start.caret == this.sel_end.caret){
        this.sel_status = Engine.SEL_NONE;
    }
}

Engine.prototype.list_extend_copy_right = function(){this.list_extend("right", true);}
Engine.prototype.list_extend_copy_left = function(){this.list_extend("left", true);}
Engine.prototype.list_extend_right = function(){this.list_extend("right", false);}
Engine.prototype.list_extend_left = function(){this.list_extend("left", false);}
Engine.prototype.list_extend_up = function(){this.list_extend("up", false);}
Engine.prototype.list_extend_down = function(){this.list_extend("down", false);}
Engine.prototype.list_extend_copy_up = function(){this.list_extend("up", true);}
Engine.prototype.list_extend_copy_down = function(){this.list_extend("down", true);}

/**
    Move the cursor by one row up or down in a matrix.
    @memberof Engine
    @param {boolean} down - If `true`, move down in the matrix;
    otherwise, up.
*/
Engine.prototype.list_vertical_move = function(down){
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

/**
    Add an element to a list (or row/column to a matrix) in the
    specified direction.  Can optionally copy the current
    element/row/column to the new one.
    @memberof Engine
    @param {string} direction - One of `"up"`, `"down"`, `"left"`, or
    `"right"`.
    @param {boolean} copy - Whether or not to copy the current
    element/row/column into the new one.
*/
Engine.prototype.list_extend = function(direction, copy){
    var base = this.doc.base;
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
        to_insert = base.createElement("c");
        to_insert.appendChild(this.make_e(""));
        var pos = 1;
        var cc = n;
        while(cc.previousSibling != null){
            pos++;
            cc = cc.previousSibling;
        }
        var to_modify = [];
        var iterator = this.doc.xpath_list("./l/c[position()="+pos+"]", n.parentNode.parentNode);
        var nn = null;
        try{ for(nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()){ to_modify.push(nn); }}
        catch(e) { this.fire_event("error",{"message":'XML modified during iteration? ' + e}); }
        for(var j = 0; j < to_modify.length; j++){
            nn = to_modify[j];
            if(copy) nn.parentNode.insertBefore(nn.cloneNode(true), before ? nn : nn.nextSibling);
            else nn.parentNode.insertBefore(to_insert.cloneNode(true), before ? nn : nn.nextSibling);
            nn.parentNode.setAttribute("s",parseInt(nn.parentNode.getAttribute("s"))+1);
        }
        this.sel_clear();
        this.current = before ? n.previousSibling.lastChild : n.nextSibling.firstChild;
        this.caret = this.current.firstChild.textContent.length;
        this.checkpoint();
        return;
    }

    if(copy){
        to_insert = n.cloneNode(true);
    }
    else{
        if(vertical){
            to_insert = base.createElement("l");
            to_insert.setAttribute("s",n.getAttribute("s"))
            for(var i = 0; i < parseInt(n.getAttribute("s")); i++){
                var c = base.createElement("c");
                c.appendChild(this.make_e(""));
                to_insert.appendChild(c);
            }
        }
        else{
            to_insert = base.createElement("c");
            to_insert.appendChild(this.make_e(""));
        }
    }
    n.parentNode.setAttribute("s",parseInt(n.parentNode.getAttribute("s"))+1);
    n.parentNode.insertBefore(to_insert, before ? n : n.nextSibling);
    this.sel_clear();
    if(vertical) this.current = to_insert.firstChild.firstChild;
    else this.current = to_insert.firstChild;
    this.caret = 0;
    this.checkpoint();
}

/**
    Remove the current column from a matrix
    @memberof Engine
*/
Engine.prototype.list_remove_col = function(){
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
    var iterator = this.doc.xpath_list("./l/c[position()="+pos+"]", n.parentNode.parentNode)
    var nn = null;
    try{ for(nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()){ to_modify.push(nn); }}
    catch(e) { this.fire_event("error",{"message":'XML modified during iteration? ' + e}); }
    for(var j = 0; j < to_modify.length; j++){
        nn = to_modify[j];
        nn.parentNode.setAttribute("s",parseInt(nn.parentNode.getAttribute("s"))-1);
        nn.parentNode.removeChild(nn);
    }
    this.checkpoint();
}

/**
    Remove the current row from a matrix
    @memberof Engine
*/
Engine.prototype.list_remove_row = function(){
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
    this.checkpoint();
}

/**
    Remove the current element from a list (or column from a matrix)
    @memberof Engine
*/
Engine.prototype.list_remove = function(){
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
    this.checkpoint();
}

/**
    Simulate the right arrow key press
    @memberof Engine
*/
Engine.prototype.right = function(){
    this.sel_clear();
    if(this.caret >= Utils.get_length(this.current)){
        var nn = this.doc.xpath_node("following::e[1]", this.current);
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

/**
    Simulate the spacebar key press
    @memberof Engine
*/
Engine.prototype.spacebar = function(){
    if(Utils.is_text(this.current)) this.insert_string(" ");
    else this.space_caret = this.caret;
}

/**
    Simulate the left arrow key press
    @memberof Engine
*/
Engine.prototype.left = function(){
    this.sel_clear();
    if(this.caret <= 0){
        var pn = this.doc.xpath_node("preceding::e[1]", this.current);
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

Engine.prototype.delete_from_c = function(){
    var pos = 0;
    var c = this.current.parentNode;
    while(c && c.nodeName == "c"){
        pos++;
        c = c.previousSibling;
    }
    var idx = this.current.parentNode.getAttribute("delete");
    var survivor_node = this.doc.xpath_node("./c[position()="+idx+"]", this.current.parentNode.parentNode);
    var survivor_nodes = [];
    for(var n = survivor_node.firstChild; n != null; n = n.nextSibling){
        survivor_nodes.push(n);
    }
    this.current = this.current.parentNode.parentNode;
    this.delete_from_f();
    this.insert_nodes(survivor_nodes, pos > idx);
}

Engine.prototype.delete_from_e = function(){
    // return false if we deleted something, and true otherwise.
    if(this.caret > 0){
        this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splicen(this.caret-1,"",1);
        this.caret--;
    }
    else{
        // The order of these is important
        if(this.current.previousSibling != null && Utils.is_char(this.current.previousSibling)){
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

Engine.prototype.delete_forward_from_e = function(){
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

/**
    Simulate the "backspace" key press
    @memberof Engine
*/
Engine.prototype.backspace = function(){
    if(this.sel_status != Engine.SEL_NONE){
        this.sel_delete();
        this.sel_status = Engine.SEL_NONE;
        this.checkpoint();
    }
    else if(this.delete_from_e()){
        this.checkpoint();
    }
}

/**
    Simulate the "delete" key press
    @memberof Engine
*/
Engine.prototype.delete_key = function(){
    if(this.sel_status != Engine.SEL_NONE){
        this.sel_delete();
        this.sel_status = Engine.SEL_NONE;
        this.checkpoint();
    }
    else if(this.delete_forward_from_e()){
        this.checkpoint();
    }
}

Engine.prototype.backslash = function(){
    if(Utils.is_text(this.current)) return;
    this.insert_symbol("sym_name");
}

/**
    Simulate a tab key press
    @memberof Engine
*/
Engine.prototype.tab = function(){
    if(!Utils.is_symbol(this.current)){
        if(this.check_for_symbol()) return;
    }
    if(Utils.is_utf8entry(this.current)){
        var codepoint = this.current.firstChild.textContent;
        this.complete_utf8(codepoint);
        return;
    }
    var sym_name = this.current.firstChild.textContent;
    var candidates = [];
    for(var n in this.symbols){
        if(n.startsWith(sym_name)) candidates.push(n);
    }
    if(candidates.length == 1){
        this.current.firstChild.textContent = candidates[0];
        this.caret = candidates[0].length;
        this.check_for_symbol();
    }
    else {
        this.fire_event("completion",{"candidates":candidates});
    }
}

Engine.prototype.right_paren = function(){
    if(this.current.nodeName == 'e' && this.caret < this.current.firstChild.nodeValue.length - 1) return;
    else this.right();
}

/**
    Simulate an up arrow key press
    @memberof Engine
*/
Engine.prototype.up = function(){
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

/**
    Simulate a down arrow key press
    @memberof Engine
*/
Engine.prototype.down = function(){
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

/**
    Move the cursor to the beginning of the document
    @memberof Engine
*/
Engine.prototype.home = function(){
    this.current = this.doc.root().firstChild;
    this.caret = 0;
}

/**
    Move the cursor to the end of the document
    @memberof Engine
*/
Engine.prototype.end = function(){
    this.current = this.doc.root().lastChild;
    this.caret = this.current.firstChild.nodeValue.length;
}

Engine.prototype.checkpoint = function(){
    var base = this.doc.base;
    this.current.setAttribute("current","yes");
    this.current.setAttribute("caret",this.caret.toString());
    this.undo_now++;
    this.undo_data[this.undo_now] = base.cloneNode(true);
    this.undo_data.splice(this.undo_now+1, this.undo_data.length);
    var old_data = this.undo_data[this.undo_now-1] ? (new XMLSerializer()).serializeToString(this.undo_data[this.undo_now-1]) : "[none]";
    var new_data = (new XMLSerializer()).serializeToString(this.undo_data[this.undo_now]);
    this.fire_event("change",{"old":old_data,"new":new_data});
    this.current.removeAttribute("current");
    this.current.removeAttribute("caret");
}

Engine.prototype.restore = function(t){
    this.doc.base = this.undo_data[t].cloneNode(true);
    this.find_current();
    this.current.removeAttribute("current");
    this.current.removeAttribute("caret");
}

Engine.prototype.find_current = function(){
    this.current = this.doc.xpath_node("//*[@current='yes']");
    this.caret = parseInt(this.current.getAttribute("caret"));
}

/**
    Undo the last action
    @memberof Engine
*/
Engine.prototype.undo = function(){
    this.sel_clear();
    if(this.undo_now <= 0) return;
    this.undo_now--;
    this.restore(this.undo_now);
    var old_data = this.undo_data[this.undo_now+1] ? (new XMLSerializer()).serializeToString(this.undo_data[this.undo_now+1]) : "[none]";
    var new_data = (new XMLSerializer()).serializeToString(this.undo_data[this.undo_now]);
    this.fire_event("change",{"old":old_data,"new":new_data});
}

/**
    Redo the last undone action
    @memberof Engine
*/
Engine.prototype.redo = function(){
    this.sel_clear();
    if(this.undo_now >= this.undo_data.length-1) return;
    this.undo_now++;
    this.restore(this.undo_now);
    var old_data = this.undo_data[this.undo_now-1] ? (new XMLSerializer()).serializeToString(this.undo_data[this.undo_now-1]) : "[none]";
    var new_data = (new XMLSerializer()).serializeToString(this.undo_data[this.undo_now]);
    this.fire_event("change",{"old":old_data,"new":new_data});
}

/**
    Execute the "done" callback
    @memberof Engine
*/
Engine.prototype.done = function(){
    if(Utils.is_symbol(this.current)) this.complete_symbol();
    else if(Utils.is_utf8entry(this.current)){
        var codepoint = this.current.firstChild.textContent;
        this.complete_utf8(codepoint);
    }
    else this.fire_event("done");
}

Engine.prototype.complete_symbol = function(){
    var sym_name = this.current.firstChild.textContent;
    if(!(this.symbols[sym_name])) return;
    this.current = this.current.parentNode.parentNode;
    this.delete_from_f();
    this.insert_symbol(sym_name);
}

Engine.prototype.complete_utf8 = function(codepoint){
    codepoint = parseInt('0x'+codepoint);
    this.current = this.current.parentNode.parentNode;
    this.delete_from_f();
    this.insert_utf8(codepoint);
}

Engine.prototype.insert_utf8 = function(codepoint){
    //this.insert_string(c);
    // if((codepoint < 0xffff && Object.values(Engine.kb_info.k_chars).indexOf(c) >= 0) || Utils.is_text(this.current)){
    //     this.insert_string(c);
    // }
    // else{
    //     this.insert_symbol("utf8codepoint",{"name":"UTF8","codepoint":codepoint.toString(16)});
    // }
    if(codepoint <= 0xffff){
	var c = String.fromCharCode(codepoint);
        this.insert_string(c);
    }
    else{
        this.insert_symbol("utf8codepoint",{"name":"UTF8","codepoint":codepoint.toString(16)});
    }
}

Engine.prototype.problem = function(message){
    this.fire_event("error",{"message":message});
}

Engine.prototype.is_blacklisted = function(symb_type){
    var blacklist = this.setting("blacklist");
    for(var i = 0; i < blacklist.length; i++)
        if(symb_type == blacklist[i]) return true;
    return false;
}

Engine.prototype.check_for_symbol = function(whole_node){
    var instance = this;
    if(Utils.is_text(this.current)) return false;
    var sym = "";
    var n = null;
    if(whole_node){
        n = instance.current.firstChild.nodeValue.substring(instance.space_caret, instance.caret);
        var m = /[a-zA-Z_]+$/.exec(n);
        if(m){
            var s = m[0];
            if(this.symbols[s]) sym = s;
        }
    }
    else{
        n = instance.current.firstChild.nodeValue.substring(instance.space_caret, instance.caret);
        while(n.length > 0){
            if(n in this.symbols){
                sym = n;
                break;
            }
            n = n.substring(1);
        }
    }

    if(sym == "") return false;

    var temp = instance.current.firstChild.nodeValue;
    var temp_caret = instance.caret;
    instance.current.firstChild.nodeValue = instance.current.firstChild.nodeValue.slice(0,instance.caret-sym.length)+instance.current.firstChild.nodeValue.slice(instance.caret);
    instance.caret -= sym.length;
    var success = instance.insert_symbol(sym);
    if(!success){
        instance.current.firstChild.nodeValue = temp;
        instance.caret = temp_caret;
    }
    return success;
}

export default Engine;

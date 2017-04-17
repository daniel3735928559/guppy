module.exports = {
    'symbol_to_node' :function(sym_name, content) {
        // sym_name is a key in the symbols dictionary
        //
        // content is a list of nodes to insert
        
        var s = Guppy.kb.symbols[sym_name];
        var f = this.base.createElement("f");
        if ("type" in s) f.setAttribute("type",s["type"])
        if (s['char']) f.setAttribute("c","yes");
        
        var first_ref = -1;
        var refs_count = 0;
        var lists = {}
        var first;
    
        // Make the b nodes for rendering each output    
        for (var t in s["output"]) {
            var b = this.base.createElement("b");
            b.setAttribute("p",t);
    
            var out = s["output"][t];
            if (typeof out == 'string') {
                out = out.split(/(\{\$[0-9]+(?:\{[^}]+\})*\})/g);
                for (var i = 0; i < out.length; i++) {
                    m = out[i].match(/^\{\$([0-9]+)((?:\{[^}]+\})*)\}$/);
                    if (m) {
                        out[i] = {'ref':parseInt(m[1])};
                        if (m[2].length > 0) {
                            mm = m[2].match(/\{[^}]*\}/g);
                            out[i]['d'] = mm.length;
                            for(var j = 0; j < mm.length; j++) {
                                out[i]['sep'+j] = mm[j].substring(1,mm[j].length-1);
                            }
                        }
                    }
                }
            }
            for(var i = 0; i < out.length; i++) {
                if (typeof out[i] == 'string' || out[i] instanceof String) {
                    var nt = this.base.createTextNode(out[i]);
                    b.appendChild(nt);
                } else {
                    var nt = this.base.createElement("r");
                    for(var attr in out[i]) {
                        nt.setAttribute(attr,out[i][attr]);
                    }
                    if (t == 'latex') {
                        if (first_ref == -1) first_ref = out[i]['ref'];
                        if ('d' in out[i]) lists[refs_count] = out[i]['d']
                        refs_count++;
                    }
                    b.appendChild(nt);
                }
            }
            f.appendChild(b);
        }
        // Now make the c nodes for storing the content
        for (var i = 0; i < refs_count; i++) {
            var nc = this.base.createElement("c");
            if (i in content) {
                var node_list = content[i];
                for (var se = 0; se < node_list.length; se++)
                    nc.appendChild(node_list[se].cloneNode(true));
            } else nc.appendChild(this.make_e(""));
            if (i+1 == first_ref) first = nc.lastChild;
            for(var a in s['attrs'])
                if (s['attrs'][a][i] != 0) nc.setAttribute(a,s['attrs'][a][i]);
            if (i in lists) {
                var par = f;
                for (var j = 0; j < lists[i]; j++) {
                    var nl = this.base.createElement("l");
                    nl.setAttribute("s","1");
                    par.appendChild(nl);
                    par = nl;
                    if (j == lists[i]-1) nl.appendChild(nc);
                }
            } else f.appendChild(nc);
        }
        return {"f":f, "first":first};
    },
    
    'insert_symbol' :function(sym_name) {
        var s = Guppy.kb.symbols[sym_name];
        if (this.is_blacklisted(s['type'])) return false;
        var node_list = {};
        var content = {};
        var left_piece,right_piece;
        var cur = s['current'] == null ? 0 : parseInt(s['current']);
        var to_remove = [];
        var to_replace = null;
        var replace_f = false;
        
        if (cur > 0) {
            cur--;
            if (this.sel_status != Guppy.SEL_NONE) {
                var sel = this.sel_get();
                sel_parent = sel.involved[0].parentNode;
                to_remove = sel.involved;
                left_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(0,this.sel_start.caret));
                right_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(this.sel_start.caret));
                content[cur] = sel.node_list;
            } else if (s['current_type'] == 'token') {
                // If we're at the beginning, then the token is the previous f node
                if (this.caret == 0 && this.current.previousSibling != null) {
                    content[cur] = [this.make_e(""), this.current.previousSibling, this.make_e("")];
                    to_replace = this.current.previousSibling;
                    replace_f = true;
                } else {
                    // look for [0-9.]+|[a-zA-Z] immediately preceeding the caret and use that as token
                    var prev = this.current.firstChild.nodeValue.substring(0,this.caret);
                    var token = prev.match(/[0-9.]+$|[a-zA-Z]$/);
                    if (token != null && token.length > 0) {
                        token = token[0];
                        left_piece = this.make_e(this.current.firstChild.nodeValue.slice(0,this.caret-token.length));
                        right_piece = this.make_e(this.current.firstChild.nodeValue.slice(this.caret));
                        content[cur] = [this.make_e(token)];
                    }
                }
            }
        }
        if (!replace_f && (left_piece == null || right_piece == null)) {
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
    
        if (replace_f) {
            current_parent.replaceChild(f,to_replace);
        } else {
            if (to_remove.length == 0) this.current.parentNode.removeChild(this.current);
        
            for(var i = 0; i < to_remove.length; i++) {
                if (next == to_remove[i]) next = next.nextSibling;
                current_parent.removeChild(to_remove[i]);
            }
            current_parent.insertBefore(left_piece, next);
            current_parent.insertBefore(f, next);
            current_parent.insertBefore(right_piece, next);
        }
        
        this.caret = 0;
        this.current = f;
        if (s['char']) {
            this.current = this.current.nextSibling;
        } else this.down_from_f_to_blank();
    
        this.sel_clear();
        this.checkpoint();
        this.render(true);
        return true;
    }
}
//Exports end


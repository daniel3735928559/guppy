module.exports = {
    'sel_copy' :  function() {
        var sel = this.sel_get();
        if (!sel) return;
        this.clipboard = [];
        for (var i = 0; i < sel.node_list.length; i++)
            this.clipboard.push(sel.node_list[i].cloneNode(true));
        this.sel_clear();
    },
    
    'sel_cut' :  function() {
        var node_list = this.sel_delete();
        this.clipboard = [];
        for (var i = 0; i < node_list.length; i++)
            this.clipboard.push(node_list[i].cloneNode(true));
        this.sel_clear();
        this.checkpoint();
    },

    'sel_paste' :  function() {
        this.sel_delete();
        this.sel_clear();
        if (!(this.clipboard) || this.clipboard.length == 0) return;
        this.insert_nodes(this.clipboard, true);
        this.checkpoint();
        return;
    },

    'sel_clear' :  function() {
        this.sel_start = null;    
        this.sel_end = null;
        this.sel_status = Guppy.SEL_NONE;
    },

    'sel_delete' :  function() {
        var sel = this.sel_get();
        if (!sel) return;
        sel_parent = sel.involved[0].parentNode;
        sel_prev = sel.involved[0].previousSibling;
        for (var i = 0; i < sel.involved.length; i++) {
            var n = sel.involved[i];
            sel_parent.removeChild(n);
        }
        if (sel_prev == null) {
            if (sel_parent.firstChild == null)
                sel_parent.appendChild(sel.remnant);
            else
                sel_parent.insertBefore(sel.remnant, sel_parent.firstChild);
        }
        else if (sel_prev.nodeName == 'f') {
            if (sel_prev.nextSibling == null)
                sel_parent.appendChild(sel.remnant);
            else
                sel_parent.insertBefore(sel.remnant, sel_prev.nextSibling);
        }
        this.current = sel.remnant
        this.caret = this.sel_start.caret;
        return sel.node_list;
    },

    //Functions for handling navigation and editing commands: 

    'sel_all' :  function() {
        this.home();
        this.set_sel_start();
        this.end();
        this.set_sel_end();
        if (this.sel_start.node != this.sel_end.node || this.sel_start.caret != this.sel_end.caret)
        this.sel_status = Guppy.SEL_CURSOR_AT_END;
    },
    
    'sel_right' :  function() {
        if (this.sel_status == Guppy.SEL_NONE) {
            this.set_sel_start();
            this.sel_status = Guppy.SEL_CURSOR_AT_END;
        }
        if (this.caret >= this.get_length(this.current)) {
            var nn = this.current.nextSibling;
            if (nn != null) {
                this.current = nn.nextSibling;
                this.caret = 0;
                this.set_sel_boundary(Guppy.SEL_CURSOR_AT_END);
            } else {
                this.set_sel_boundary(Guppy.SEL_CURSOR_AT_END);
            }
        } else {
            this.caret += 1;
            this.set_sel_boundary(Guppy.SEL_CURSOR_AT_END);
        }
        if (this.sel_start.node == this.sel_end.node && this.sel_start.caret == this.sel_end.caret) 
            this.sel_status = Guppy.SEL_NONE;
    },
    
    'set_sel_boundary' :  function(sstatus, mouse) {
        if (this.sel_status == Guppy.SEL_NONE || mouse) this.sel_status = sstatus;
        if (this.sel_status == Guppy.SEL_CURSOR_AT_START)
            this.set_sel_start();
        else if (this.sel_status == Guppy.SEL_CURSOR_AT_END)
            this.set_sel_end();
    },
    
    'sel_left' :  function() {
        if (this.sel_status == Guppy.SEL_NONE) {
            this.set_sel_end();
            this.sel_status = Guppy.SEL_CURSOR_AT_START;
        }
        if (this.caret <= 0) {
            var nn = this.current.previousSibling;
            if (nn != null) {
                this.current = nn.previousSibling;
                this.caret = this.current.firstChild.nodeValue.length;
                this.set_sel_boundary(Guppy.SEL_CURSOR_AT_START);
            } else {
                this.set_sel_boundary(Guppy.SEL_CURSOR_AT_START);
            }
        } else {
            this.caret -= 1;
            this.set_sel_boundary(Guppy.SEL_CURSOR_AT_START);
        }
        if (this.sel_start.node == this.sel_end.node && this.sel_start.caret == this.sel_end.caret) 
            this.sel_status = Guppy.SEL_NONE;
    },

    'select_to' :  function(x,y, mouse) {
        var sel_caret = this.caret;
        var sel_cursor = this.current;
        if (this.sel_status == Guppy.SEL_CURSOR_AT_START) {
            sel_cursor = this.sel_end.node;
            sel_caret = this.sel_end.caret;
        } else if (this.sel_status == Guppy.SEL_CURSOR_AT_END) {
            sel_cursor = this.sel_start.node;
            sel_caret = this.sel_start.caret;
        }
        var loc = Guppy.get_loc(x,y,sel_cursor,sel_caret);
        if (!loc) return;
        if (loc.current == sel_cursor && loc.caret == sel_caret) {
            this.caret = loc.caret
            this.sel_status = Guppy.SEL_NONE;
        } else if (loc.pos == "left") {
            this.sel_end = {"node":sel_cursor,"caret":sel_caret};
            this.set_sel_boundary(Guppy.SEL_CURSOR_AT_START, mouse);
        } else if (loc.pos == "right") {
            this.sel_start = {"node":sel_cursor,"caret":sel_caret};
            this.set_sel_boundary(Guppy.SEL_CURSOR_AT_END, mouse);
        }
        this.current = loc.current;
        this.caret = loc.caret;
    },
    
    'set_sel_start' :  function() {
        this.sel_start = {"node":this.current, "caret":this.caret};
    },
    
    'set_sel_end' :  function() {
        this.sel_end = {"node":this.current, "caret":this.caret};
    },
    
    'sel_get' :  function() {
        if (this.sel_status == Guppy.SEL_NONE) return null;
        var involved = [];
        var node_list = [];
        var remnant = null;
    
        if (this.sel_start.node == this.sel_end.node)
            return {"node_list":[this.make_e(this.sel_start.node.firstChild.nodeValue.substring(this.sel_start.caret, this.sel_end.caret))],
                    "remnant":this.make_e(this.sel_start.node.firstChild.nodeValue.substring(0, this.sel_start.caret) + this.sel_end.node.firstChild.nodeValue.substring(this.sel_end.caret)),
                    "involved":[this.sel_start.node]};
        
        node_list.push(this.make_e(this.sel_start.node.firstChild.nodeValue.substring(this.sel_start.caret)));
        involved.push(this.sel_start.node);
        involved.push(this.sel_end.node);
        remnant = this.make_e(this.sel_start.node.firstChild.nodeValue.substring(0, this.sel_start.caret) + this.sel_end.node.firstChild.nodeValue.substring(this.sel_end.caret));
        var n = this.sel_start.node.nextSibling;
        while (n != null && n != this.sel_end.node) {
            involved.push(n);
            node_list.push(n);
            n = n.nextSibling;
        }
        node_list.push(this.make_e(this.sel_end.node.firstChild.nodeValue.substring(0, this.sel_end.caret)));
        return {"node_list":node_list,
            "remnant":remnant,
            "involved":involved,
            "cursor":0};
    },
    
    'print_selection' :  function() {
        var sel = this.sel_get();
        if (sel == null) return "[none]";
        var ans = "";
        ans += "node_list: \n";
        for (var i = 0; i < sel.node_list.length; i++) {
            var n = sel.node_list[i];
            ans += (new XMLSerializer()).serializeToString(n) + "\n";
        }
        ans += "\ninvolved: \n";
        for (var i = 0; i < sel.involved.length; i++) {
            var n = sel.involved[i];
            ans += (new XMLSerializer()).serializeToString(n) + "\n";
        }
    }
}
//End of exports


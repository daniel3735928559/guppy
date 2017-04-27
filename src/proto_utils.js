module.exports = {
    'get_content' :function(t) {
        if (t != "xml") return Guppy.transform(t,this.base);
        return (new XMLSerializer()).serializeToString(this.base);
    },
    
    'set_content' :function(xml_data) {
        this.base = (new window.DOMParser()).parseFromString(xml_data, "text/xml");
        this.clipboard = null;
        var l = this.base.getElementsByTagName("e");
        for (var i = 0; i < l.length; i++) 
            if (!(l[i].firstChild)) l[i].appendChild(this.base.createTextNode(""));
        
        this.current = this.base.documentElement.firstChild;
        this.caret = 0;
        this.sel_start = null;
        this.sel_end = null;
        this.undo_data = [];
        this.undo_now = -1;
        this.sel_status = Guppy.SEL_NONE;
        this.checkpoint();
    },
    
    'activate' :function() {
        Guppy.active_guppy = this;
        this.editor_active = true;
        this.editor.className = this.editor.className.replace(new RegExp('(\\s|^)guppy_inactive(\\s|$)'),' guppy_active ');
        this.editor.focus();
        if (this.ready) {
        this.render(true);
        this.fire_event("focus",{"focused":true});
        }
    },
    
    'deactivate' :function() {
        this.editor_active = false;
        var r1 = new RegExp('(?:\\s|^)guppy_active(?:\\s|$)');
        var r2 = new RegExp('(?:\\s|^)guppy_inactive(?:\\s|$)');
        if (this.editor.className.match(r1)) {
            this.editor.className = this.editor.className.replace(r1,' guppy_inactive ');
        } else if (!this.editor.className.match(r2)) {
            this.editor.className += ' guppy_inactive ';
        }
        Guppy.kb.shift_down = false;
        Guppy.kb.ctrl_down = false;
        Guppy.kb.alt_down = false;
        if (this.ready) {
            this.render();
            this.fire_event("focus",{"focused":false});
        }
    },

    'toggleMode': function() {
        if (this.current.parentNode.nodeName != 'm') return true;
        this.insert_T();
        return false;    
    },

    'fire_event' :  function(event, args) {
        if (this.events[event]) this.events[event](args);
    },
    
    'path_to' :  function(n) {
        var name = n.nodeName;
        if (name == "m") return "guppy_loc_m";
        var ns = 0;
        for (var nn = n; nn != null; nn = nn.previousSibling) if (nn.nodeType == 1 && nn.nodeName == name) ns++;
        return this.path_to(n.parentNode)+"_"+name+""+ns;
    },
    
    'is_changed' :  function() {
        var bb = this.editor.getElementsByClassName("GuppyContainer")[0];
        if (!bb) return;
        var rect = bb.getBoundingClientRect();
        if (this.bounding_box)
            ans = this.bounding_box.top != rect.top || this.bounding_box.bottom != rect.bottom || this.bounding_box.right != rect.right || this.bounding_box.left != rect.left;
        else
            ans = true;
        this.bounding_box = rect;
        return ans;
    },
    
    'is_text' :  function(nn) {
        return nn.parentNode.getAttribute("mode") && (nn.parentNode.getAttribute("mode") == "text" || nn.parentNode.getAttribute("mode") == "symbol");
    },
    
    'is_symbol' :  function(nn) {
        return nn.parentNode.getAttribute("mode") && nn.parentNode.getAttribute("mode") == "symbol";
    },
    
    'is_small' :  function(nn) {
        var n = nn.parentNode;
        while (n != null && n.nodeName != 'm') {
            if (n.getAttribute("size") == "s")
                return true;
            n = n.parentNode
            while (n != null && n.nodeName != 'c')
                n = n.parentNode;
        }
        return false;
    },
    
    'is_blank' :  function() {
        return this.base.documentElement.firstChild == this.base.documentElement.lastChild && this.base.documentElement.firstChild.firstChild.textContent == "";
    },
    
    'insert_string' :  function(s) {
        if (this.sel_status != Guppy.SEL_NONE) {
            this.sel_delete();
            this.sel_clear();
        }
        this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splice(this.caret,s)
        this.caret += s.length;
        this.checkpoint();
        if (this.autoreplace) this.check_for_symbol();
        this.render(true);
    },
    
    'get_length' :  function(n) {
        if (Guppy.is_blank(n) || n.nodeName == 'f') return 0
        return n.firstChild.nodeValue.length;
    },
    
    'checkpoint' :  function() {
        this.current.setAttribute("current","yes");
        this.current.setAttribute("caret",this.caret.toString());
        this.undo_now++;
        this.undo_data[this.undo_now] = this.base.cloneNode(true);
        this.undo_data.splice(this.undo_now+1, this.undo_data.length);
        this.fire_event("change",{"old":this.undo_data[this.undo_now-1],"new":this.undo_data[this.undo_now]});
        this.current.removeAttribute("current");
        this.current.removeAttribute("caret");
    },
    
    'restore' :  function(t) {
        this.base = this.undo_data[t].cloneNode(true);
        this.find_current();
        this.current.removeAttribute("current");
        this.current.removeAttribute("caret");
    },
    
    'find_current' :  function() {
        this.current = this.base.evaluate("//*[@current='yes']", this.base.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        this.caret = parseInt(this.current.getAttribute("caret"));
    },
    
    'undo' :  function() {
        if (this.undo_now <= 0) return;
        this.undo_now--;
        this.restore(this.undo_now);
    },
    
    'redo' :  function() {
        if (this.undo_now >= this.undo_data.length-1) return;
        this.undo_now++;
        this.restore(this.undo_now);
    },
    
    'done' :  function(s) {
        if (this.is_symbol(this.current)) this.complete_symbol();
        else this.fire_event("done");
    },
    
    'complete_symbol' :  function() {
        var sym_name = this.current.firstChild.textContent;
        if (!(Guppy.kb.symbols[sym_name])) return;
        this.current = this.current.parentNode.parentNode;
        this.delete_from_f();
        this.insert_symbol(sym_name);
    },
    
    'problem' :  function(message) {
        this.fire_event("error",{"message":message});
    },
    
    'check_for_symbol' :  function() {
        var instance = this;
        if (this.is_text(this.current)) return;
        for (var s in Guppy.kb.symbols) {
            if (instance.current.nodeName == 'e' && s.length <= (instance.caret - instance.space_caret) && !(Guppy.is_blank(instance.current)) && instance.current.firstChild.nodeValue.search_at(instance.caret,s)) {
                var temp = instance.current.firstChild.nodeValue;
                var temp_caret = instance.caret;
                instance.current.firstChild.nodeValue = instance.current.firstChild.nodeValue.slice(0,instance.caret-s.length)+instance.current.firstChild.nodeValue.slice(instance.caret);
                instance.caret -= s.length;
                var success = instance.insert_symbol(s);
                if (!success) {
                    instance.current.firstChild.nodeValue = temp;
                    instance.caret = temp_caret;
                }
                break;
            }
        }
    },

    'is_blacklisted' : function(symb_type) {
        for (var i = 0; i < this.blacklist.length; i++)
            if (symb_type == this.blacklist[i]) return true;
                return false;
    }
}
//Exports end


module.exports = {
    'backspace' : function() {
        if (this.sel_status != Guppy.SEL_NONE) {
            this.sel_delete();
            this.sel_status = Guppy.SEL_NONE;
            this.checkpoint();
        } else if (this.delete_from_e()) {
            this.checkpoint();
        }
    },
    
    'delete_key' : function() {
        if (this.sel_status != Guppy.SEL_NONE) {
            this.sel_delete();
            this.sel_status = Guppy.SEL_NONE;
            this.checkpoint();
        } else if (this.delete_forward_from_e()) {
            this.checkpoint();
        }
    },
    
    'backslash' : function() {
        if(this.current.parentNode.nodeName == 'm') {
            this.insert_string("\\"); 
            return
        }
        this.insert_symbol("sym_name");
    },
    
    'tab' : function() {
        if (!this.is_symbol(this.current)) {
            this.check_for_symbol();
            return;
        }
        var sym_name = this.current.firstChild.textContent;
        var candidates = [];
        for (var n in Guppy.kb.symbols) {
            if (n.startsWith(sym_name)) candidates.push(n);
        }
        if (candidates.length == 1) {
            this.current.firstChild.textContent = candidates[0];
            this.caret = candidates[0].length;
        } else {
            this.fire_event("completion",{"candidates":candidates});
        }
    },
    
    'right_paren' : function() {
        if (this.current.nodeName == 'e' && this.caret < this.current.firstChild.nodeValue.length - 1) return;
        else this.right();
    },
    
    'up' : function() {
        this.sel_clear();
        if (this.current.parentNode.hasAttribute("up")) {
            var t = parseInt(this.current.parentNode.getAttribute("up"));
            var f = this.current.parentNode.parentNode;
            var n = f.firstChild;
            while (n != null && t > 0) {
                if (n.nodeName == 'c') t--;
                if (t > 0) n = n.nextSibling;
            }
            this.current = n.lastChild;
            this.caret = this.current.firstChild.nodeValue.length;
        } else this.list_vertical_move(false);
    },
    
    'down' : function() {
        this.sel_clear();
        if (this.current.parentNode.hasAttribute("down")) {
            var t = parseInt(this.current.parentNode.getAttribute("down"));
            var f = this.current.parentNode.parentNode;
            var n = f.firstChild;
            while (n != null && t > 0) {
                if (n.nodeName == 'c') t--;
                if (t > 0) n = n.nextSibling;
            }
            this.current = n.lastChild;
            this.caret = this.current.firstChild.nodeValue.length;
        }
        else this.list_vertical_move(true);
    },
    
    'home' : function() {
        while (this.current.previousSibling != null)
            this.current = this.current.previousSibling;
        this.caret = 0;
    },
    
    'end' : function() {
        while (this.current.nextSibling != null)
            this.current = this.current.nextSibling;
        this.caret = this.current.firstChild.nodeValue.length;
    },

    'right' : function() {
        this.sel_clear();
        if (this.caret >= this.get_length(this.current)) {
            var nn = this.base.evaluate("following::e[1]", this.current, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (nn != null && ! (this.pureKatex && nn.parentNode.nodeName == 'm')) {
                this.current = nn;
                this.caret = 0;
            } else{
                this.fire_event("right_end");
            }
        } else {
            this.caret += 1;
        }
    },
    
    'spacebar' : function() {
        //Allow space in text mode
        if ( this.current.parentNode.nodeName == 'm') {
            this.insert_string(" ");
            return;
        }
        this.space_caret = this.caret;
    },
    
    'left' : function() {
        this.sel_clear();
        if (this.caret <= 0) {
            var pn = this.base.evaluate("preceding::e[1]", this.current, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (pn != null && ! (this.pureKatex && pn.parentNode.nodeName == 'm') ) {
                this.current = pn;
                this.caret = this.current.firstChild.nodeValue.length;
            } else {
                this.fire_event("left_end");
            }
        } else {
            this.caret -= 1;
        }
    }
}
//Exports end


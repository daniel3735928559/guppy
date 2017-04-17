module.exports = {
    'list_extend_copy_right' :  function() {this.list_extend("right", true);},
    'list_extend_copy_left' :  function() {this.list_extend("left", true);},
    'list_extend_right' :  function() {this.list_extend("right", false);},
    'list_extend_left' :  function() {this.list_extend("left", false);},
    'list_extend_up' :  function() {this.list_extend("up", false);},
    'list_extend_down' :  function() {this.list_extend("down", false);},
    'list_extend_copy_up' :  function() {this.list_extend("up", true);},
    'list_extend_copy_down' :  function() {this.list_extend("down", true);},
    
    'list_vertical_move' :  function(down) {
        var n = this.current;
        while (n.parentNode && n.parentNode.parentNode && !(n.nodeName == 'c' && n.parentNode.nodeName == 'l' && n.parentNode.parentNode.nodeName == 'l')) {
            n = n.parentNode;
        }
        if (!n.parentNode) return;
        var pos = 1;
        var cc = n;
        while (cc.previousSibling != null) {
            pos++;
            cc = cc.previousSibling;
        }
        var new_l = down ? n.parentNode.nextSibling : n.parentNode.previousSibling
        if (!new_l) return;
        var idx = 1;
        var nn = new_l.firstChild;
        while (idx < pos) {
            idx++;
            nn = nn.nextSibling;
        }
        this.current = nn.firstChild;
        this.caret = down ? 0 : this.current.firstChild.textContent.length;
    },
    
    'list_extend' :  function(direction, copy) {
        var vertical = direction == "up" || direction == "down";
        var before = direction == "up" || direction == "left";
        var this_name = vertical ? "l" : "c";
        var n = this.current;
        while (n.parentNode && !(n.nodeName == this_name && n.parentNode.nodeName == 'l'))
            n = n.parentNode;
        if (!n.parentNode) return;
        var to_insert;
        
        // check if 2D and horizontal and extend all the other rows if so 
        if (!vertical && n.parentNode.parentNode.nodeName == "l") {
            to_insert = this.base.createElement("c");
            to_insert.appendChild(this.make_e(""));
            var pos = 1;
            var cc = n;
            while (cc.previousSibling != null) {
                pos++;
                cc = cc.previousSibling;
            }
            var to_modify = [];
            var iterator = this.base.evaluate("./l/c[position()="+pos+"]", n.parentNode.parentNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            try { 
                for (var nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()) to_modify.push(nn);
            } catch(e) { 
                this.fire_event("error",{"message":'XML modified during iteration? ' + e});
            }
            for(var j = 0; j < to_modify.length; j++) {
                var nn = to_modify[j];
                if (copy) nn.parentNode.insertBefore(nn.cloneNode(true), before ? nn : nn.nextSibling);
                else nn.parentNode.insertBefore(to_insert.cloneNode(true), before ? nn : nn.nextSibling);
                nn.parentNode.setAttribute("s",parseInt(nn.parentNode.getAttribute("s"))+1);
            }
            this.current = before ? n.previousSibling.lastChild : n.nextSibling.firstChild;
            this.caret = this.current.firstChild.textContent.length;
            return;
        }
        
        if (copy) {
            to_insert = n.cloneNode(true);
        } else {
            if (vertical) {
                to_insert = this.base.createElement("l");
                to_insert.setAttribute("s",n.getAttribute("s"))
                for (var i = 0; i < parseInt(n.getAttribute("s")); i++) {
                var c = this.base.createElement("c");
                c.appendChild(this.make_e(""));
                to_insert.appendChild(c);
                }
            } else{
                to_insert = this.base.createElement("c");
                to_insert.appendChild(this.make_e(""));
            }
        }
        n.parentNode.setAttribute("s",parseInt(n.parentNode.getAttribute("s"))+1);
        n.parentNode.insertBefore(to_insert, before ? n : n.nextSibling);
        if (vertical) this.current = to_insert.firstChild.firstChild;
        else this.current = to_insert.firstChild;
        this.caret = 0;
        this.checkpoint();
    },
    
    'list_remove_col' :  function() {
        var n = this.current;
        while (n.parentNode && n.parentNode.parentNode && !(n.nodeName == 'c' && n.parentNode.nodeName == 'l' && n.parentNode.parentNode.nodeName == 'l')) {
            n = n.parentNode;
        }
        if (!n.parentNode) return;
        
        // Don't remove if there is only a single column:
        if (n.previousSibling != null) {
            this.current = n.previousSibling.lastChild;
            this.caret = n.previousSibling.lastChild.firstChild.textContent.length;
        }
        else if (n.nextSibling != null) {
            this.current = n.nextSibling.firstChild;
            this.caret = 0;
        }
        else return;
        
        var pos = 1;
        var cc = n;
        
        // Find position of column
        while (cc.previousSibling != null) {
            pos++;
            cc = cc.previousSibling;
        }
        var to_modify = [];
        var iterator = this.base.evaluate("./l/c[position()="+pos+"]", n.parentNode.parentNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        try{ 
            for (var nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()) to_modify.push(nn); 
        } catch(e) { 
            this.fire_event("error",{"message":'XML modified during iteration? ' + e}); 
        }
        for (var j = 0; j < to_modify.length; j++) {
            var nn = to_modify[j];
            nn.parentNode.setAttribute("s",parseInt(nn.parentNode.getAttribute("s"))-1);
            nn.parentNode.removeChild(nn);
        }
    },
    
    'list_remove_row' :  function() {
        var n = this.current;
        while (n.parentNode && !(n.nodeName == 'l' && n.parentNode.nodeName == 'l'))
            n = n.parentNode;
        if (!n.parentNode) return;
        // Don't remove if there is only a single row:
        if (n.previousSibling != null) {
            this.current = n.previousSibling.firstChild.lastChild;
            this.caret = n.previousSibling.lastChild.firstChild.textContent.length;
        } else if (n.nextSibling != null) {
            this.current = n.nextSibling.firstChild.firstChild;
            this.caret = 0;
        }
        else return;
    
        n.parentNode.setAttribute("s",parseInt(n.parentNode.getAttribute("s"))-1);
        n.parentNode.removeChild(n);
    },
    
    'list_remove' :  function() {
        var n = this.current;
        while (n.parentNode && !(n.nodeName == 'c' && n.parentNode.nodeName == 'l'))
            n = n.parentNode;
        if (!n.parentNode) return;
        if (n.parentNode.parentNode && n.parentNode.parentNode.nodeName == "l") {
            this.list_remove_col();
            return;
        }
        if (n.previousSibling != null) {
            this.current = n.previousSibling.lastChild;
            this.caret = n.previousSibling.lastChild.firstChild.textContent.length;
        }
        else if (n.nextSibling != null) {
            this.current = n.nextSibling.firstChild;
            this.caret = 0;
        }
        else return;
        n.parentNode.setAttribute("s",parseInt(n.parentNode.getAttribute("s"))-1);
        n.parentNode.removeChild(n);
    }
};
//End of exports


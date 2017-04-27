module.exports = {
    'insert_T' : function () {
        var sand = this.make_e(this.current.firstChild.nodeValue.slice(0,this.caret));
        var wich = this.make_e(this.current.firstChild.nodeValue.slice(this.caret)); 
        this.current.parentNode.insertBefore(sand,this.current);
        this.current.parentNode.insertBefore(this.base.createElement("T"),this.current);
        this.current.parentNode.insertBefore(wich,this.current);
        this.current.parentNode.removeChild(this.current);
        this.current = wich.previousSibling;
        this.current.appendChild(this.make_e(""));
        this.current = this.current.firstChild;
        this.right();
        this.render(true);
    },

    'make_e' : function(text) {
        var new_node = this.base.createElement("e");
        new_node.appendChild(this.base.createTextNode(text));
        return new_node;
    },

    'next_sibling' :function(n) {
        if (n == null) return null;
        var c = n.parentNode.nextSibling;
        while (c != null && c.nodeName != "e") c = c.nextSibling;
        if (c == null) return null;
        else return c.firstChild;
    },
    
    'prev_sibling' :function(n) {
        if (n == null) return null;
        var c = n.parentNode.previousSibling;
        while (c != null && c.nodeName != "e") c = c.previousSibling;
        if (c == null) return null
        else return c.firstChild;
    },
    
    'down_from_f' :function() {
        var nn = this.current.firstChild;
        while (nn != null && nn.nodeName != 'c' && nn.nodeName != 'l') nn = nn.nextSibling;
        if (nn != null) {
            while (nn.nodeName == 'l') nn = nn.firstChild;
            this.current = nn.firstChild;
        }
    },
    
    'down_from_f_to_blank' :function() {
        var nn = this.current.firstChild;
        while (nn != null && !(nn.nodeName == 'c' && nn.children.length == 1 && nn.firstChild.firstChild.nodeValue == "")) {
        nn = nn.nextSibling;
        }
        if (nn != null) {
        //Sanity check:
            while (nn.nodeName == 'l') nn = nn.firstChild;
            if (nn.nodeName != 'c' || nn.firstChild.nodeName != 'e') {
                this.problem('dfftb');
                return;
            }
            this.current = nn.firstChild;
        }
        else this.down_from_f();
    },
    
    'delete_from_f' :function(to_insert) {
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
    },
    
    'insert_nodes' :function(node_list, move_cursor) {
        var real_clipboard = [];
        for (var i = 0; i < node_list.length; i++)
            real_clipboard.push(node_list[i].cloneNode(true));
    
        if (real_clipboard.length == 1) {
            this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.substring(0,this.caret) + real_clipboard[0].firstChild.nodeValue + this.current.firstChild.nodeValue.substring(this.caret);
            if (move_cursor) this.caret += real_clipboard[0].firstChild.nodeValue.length;
        }
        else {
            var nn = this.make_e(real_clipboard[real_clipboard.length-1].firstChild.nodeValue + this.current.firstChild.nodeValue.substring(this.caret));
            this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.substring(0,this.caret) + real_clipboard[0].firstChild.nodeValue;
            if (this.current.nextSibling == null)
                this.current.parentNode.appendChild(nn)
            else
                this.current.parentNode.insertBefore(nn, this.current.nextSibling)
            for(var i = 1; i < real_clipboard.length - 1; i++)
                this.current.parentNode.insertBefore(real_clipboard[i], nn);
            if (move_cursor) {
                this.current = nn;
                this.caret = real_clipboard[real_clipboard.length-1].firstChild.nodeValue.length
            }
        }
    },
    
    'delete_from_c' :function() {
        var pos = 0;
        var c = this.current.parentNode;
        while (c && c.nodeName == "c") {
            pos++;
            c = c.previousSibling;
        }
        var idx = this.current.parentNode.getAttribute("delete");
        var survivor_node = this.base.evaluate("./c[position()="+idx+"]", this.current.parentNode.parentNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var survivor_nodes = [];
        for (var n = survivor_node.firstChild; n != null; n = n.nextSibling)
            survivor_nodes.push(n);
        this.current = this.current.parentNode.parentNode;
        this.delete_from_f();
        this.insert_nodes(survivor_nodes, pos > idx);
    },

    'delete_T' :function (nodeToDelete) {
        this.current = nodeToDelete.previousSibling;
        this.caret = this.current.textContent.length;
        this.current.textContent += nodeToDelete.nextSibling.textContent; 
        if (this.current.firstChild == null) this.current.appendChild(this.base.createTextNode(""));
        nodeToDelete.parentNode.removeChild(nodeToDelete.nextSibling);
        nodeToDelete.parentNode.removeChild(nodeToDelete);
        return false;
    },
    
    'delete_from_e' :function() {
        // return false if we deleted something, and true otherwise.
        if (this.caret > 0) {
            this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splicen(this.caret-1,"",1);
            this.caret--;
        } else {
            // The order of these is important
            if (this.current.previousSibling != null && this.current.previousSibling.getAttribute("c") == "yes") {
                // The previous node is an f node but is really just a character.  Delete it.
                this.current = this.current.previousSibling;
                this.delete_from_f();
            } else if (this.current.previousSibling != null && this.current.previousSibling.nodeName == 'f') {
                // We're in an e node just after an f node.  Move back into the f node (delete it?)
                this.left();
                return false;
            } else if (this.current.parentNode.previousSibling != null && this.current.parentNode.previousSibling.nodeName == 'c') {
                // We're in a c child of an f node, but not the first one.  Go to the previous c
                if (this.current.parentNode.hasAttribute("delete")) {
                    this.delete_from_c();
                } else {
                    this.left();
                    return false;
                }
            } else if (this.current.previousSibling == null && this.current.parentNode.nodeName == 'c' && (this.current.parentNode.previousSibling == null || this.current.parentNode.previousSibling.nodeName != 'c')) {
                // We're in the first c child of an f node and at the beginning--delete the f node
                var par = this.current.parentNode;
                while (par.parentNode.nodeName == 'l' || par.parentNode.nodeName == 'c')
                    par = par.parentNode;
                if (par.hasAttribute("delete")) {
                    this.delete_from_c();
                } else {
                    this.current = par.parentNode;
                    this.delete_from_f();
                }
            } else if (this.current.previousSibling != null && this.current.previousSibling.nodeName == 'T') {
                return this.delete_T(this.current.previousSibling);
            } else if (this.current.previousSibling == null && this.current.parentNode.nodeName == 'T') {
                return this.delete_T(this.current.parentNode);
            } else {
                // We're at the beginning (hopefully!) 
                return false;
            }
        }
        return true;
    },
    
    'delete_forward_from_e' :function() {
        // return false if we deleted something, and true otherwise.
        if (this.caret < this.current.firstChild.nodeValue.length) {
            this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splicen(this.caret,"",1);
        } else {
            //We're at the end
            if (this.current.nextSibling != null) {
                // The next node is an f node.  Delete it. This also works for T nodes!
                this.current = this.current.nextSibling;
                this.delete_from_f();
            }
            else if (this.current.parentNode.nodeName == 'c') {
                // We're in a c child of an f node.  Do nothing
                return false;
            }
        }
        return true;
    }
}
//Exports end


var katex     = require('../lib/katex/katex-modified.min.js');
module.exports = {
    'recompute_locations_paths' :function() {
        ans = [];
        var bb = this.editor.getElementsByClassName("katex")[0];
        if (!bb) return;
        var rect = bb.getBoundingClientRect();
        ans.push({'path':'all',
              'top':rect.top,
              'bottom':rect.bottom,
              'left':rect.left,
              'right':rect.right});
        var elts = this.editor.getElementsByClassName("guppy_elt");
        for (var i = 0; i < elts.length; i++) {
            var elt = elts[i];
            if (elt.nodeName == "mstyle") continue;
            var rect = elt.getBoundingClientRect();
            if (rect.top == 0 && rect.bottom == 0 && rect.left == 0 && rect.right == 0) continue;
            var cl = elt.classList;
            for(var j = 0; j < cl.length; j++) {
                if (cl[j].indexOf("guppy_loc") == 0) {
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
    },
    
    'add_paths' :function(n,path) {
        if (n.nodeName == "e") {
        n.setAttribute("path",path);
        } else {
            var es = 1, fs = 1, cs = 1, ls = 1;
            for(var c = n.firstChild; c != null; c = c.nextSibling) {
                if (c.nodeName == "c") { this.add_paths(c, path+"_c"+cs); cs++; }
                else if (c.nodeName == "f") { this.add_paths(c, path+"_f"+fs); fs++; }
                else if (c.nodeName == "l") { this.add_paths(c, path+"_l"+ls); ls++; }
                else if (c.nodeName == "e") { this.add_paths(c, path+"_e"+es); es++; }
            }
        }
    },
    
    'add_classes_cursors' :function(n,path) {
        if (n.nodeName == "e") {
            var text = n.firstChild.nodeValue;
            ans = "";
            var sel_cursor;
            var text_node = this.is_text(n);
            if (this.sel_status == Guppy.SEL_CURSOR_AT_START) sel_cursor = this.sel_end;
            if (this.sel_status == Guppy.SEL_CURSOR_AT_END) sel_cursor = this.sel_start;
            if (this.sel_status != Guppy.SEL_NONE) {
                var sel_caret_text = this.is_small(sel_cursor.node) ? Guppy.kb.SMALL_SEL_CARET : Guppy.kb.SEL_CARET;
                if (!text_node && text.length == 0 && n.parentNode.childElementCount > 1) {
                    sel_caret_text = "\\color{blue}{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0}{"+sel_caret_text+"}}";
                } else {
                    sel_caret_text = "\\color{blue}{"+sel_caret_text+"}";
                }
                if (this.sel_status == Guppy.SEL_CURSOR_AT_END) 
                    sel_caret_text = text_node ? "[" : sel_caret_text + "\\color{"+Guppy.kb.SEL_COLOR+"}{";
                if (this.sel_status == Guppy.SEL_CURSOR_AT_START) 
                    sel_caret_text = text_node ? "]" : "}" + sel_caret_text;
            }
            var caret_text = "";
            var temp_caret_text = "";
            if (text.length == 0) {
                if (text_node) caret_text = "\\_";
                else if (n.parentNode.childElementCount == 1) {
                    if (this.current == n) {
                        var blank_caret = this.blank_caret || (this.is_small(this.current) ? Guppy.kb.SMALL_CARET : Guppy.kb.CARET);
                        ans = "\\color{red}{\\xmlClass{main_cursor guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{"+blank_caret+"}}";
                    }
                    else if (this.temp_cursor.node == n)
                        ans = "\\color{gray}{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{[?]}}";
                    else
                        ans = "\\color{blue}{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{[?]}}";
                } else if (this.temp_cursor.node != n && this.current != n && (!(sel_cursor) || sel_cursor.node != n)) {
                    // These are the empty e elements at either end of
                    // a c or m node, such as the space before and
                    // after both the sin and x^2 in sin(x^2)
                    //
                    // Here, we add in a small element so that we can
                    // use the mouse to select these areas
                    ans = "\\phantom{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{\\cursor[0.1ex]{1ex}}}";
                }
            }
            for(var i = 0; i < text.length+1; i++) {
                if (n == this.current && i == this.caret && (text.length > 0 || n.parentNode.childElementCount > 1)) {
                    if (text_node) {
                        if (this.sel_status == Guppy.SEL_CURSOR_AT_START)
                            caret_text = "[";
                        else if (this.sel_status == Guppy.SEL_CURSOR_AT_END)
                            caret_text = "]";
                        else
                            caret_text = "\\_";
                        }
                else{
                    caret_text = this.is_small(this.current) ? Guppy.kb.SMALL_CARET : Guppy.kb.CARET;
                    if (text.length == 0)
                    caret_text = "\\color{red}{\\xmlClass{main_cursor guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0}{"+caret_text+"}}";
                    else {
                    caret_text = "\\color{red}{\\xmlClass{main_cursor}{"+caret_text+"}}"
                    }
                    if (this.sel_status == Guppy.SEL_CURSOR_AT_START)
                    caret_text = caret_text + "\\color{"+Guppy.kb.SEL_COLOR+"}{";
                    else if (this.sel_status == Guppy.SEL_CURSOR_AT_END)
                    caret_text = "}" + caret_text;
                }
                ans += caret_text;
                }
                else if (n == this.current && i == this.caret && text_node) {
                ans += caret_text;
                }
                else if (this.sel_status != Guppy.SEL_NONE && sel_cursor.node == n && i == sel_cursor.caret) {
                ans += sel_caret_text;
                }
                else if (this.temp_cursor.node == n && i == this.temp_cursor.caret && (text.length > 0 || n.parentNode.childElementCount > 1)) {
             if (text_node) 
                    temp_caret_text = ".";
                else{
                    temp_caret_text = this.is_small(this.current) ? Guppy.kb.TEMP_SMALL_CARET : Guppy.kb.TEMP_CARET;
                    if (text.length == 0) {
                    temp_caret_text = "\\color{gray}{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0}{"+temp_caret_text+"}}";
                    }
                    else
                    temp_caret_text = "\\color{gray}{"+temp_caret_text+"}";
                }
                ans += temp_caret_text;
                }
                if (i < text.length) ans += "\\xmlClass{guppy_elt guppy_loc_"+n.getAttribute("path")+"_"+i+"}{"+text[i]+"}";
            }
            n.setAttribute("render", ans);
            n.removeAttribute("path");
        } //Node == e ==> LONG
        else {
            for(var c = n.firstChild; c != null; c = c.nextSibling) {
                if (c.nodeName == "c" || c.nodeName == "l" || c.nodeName == "f" || c.nodeName == "e") { this.add_classes_cursors(c); }
            }
        }
    },
    
    'post_render_cleanup' :function(n) {
        if (n.nodeName == "e") {
            n.removeAttribute("path");
            n.removeAttribute("render");
            n.removeAttribute("current");
            n.removeAttribute("temp");
        } else {
            for(var c = n.firstChild; c != null; c = c.nextSibling)
                if (c.nodeType == 1) this.post_render_cleanup(c);
        }
    },
    
    'render_node' :function(n,t) {
        // All the interesting work is done by transform.  This function just adds in the cursor and selection-start cursor
        var output = "";
        if (t == "latex") {
            this.add_paths(this.base.documentElement,"m");
            this.add_classes_cursors(this.base.documentElement);
            this.current.setAttribute("current","yes");
            if (this.temp_cursor.node) this.temp_cursor.node.setAttribute("temp","yes");
            output = Guppy.transform(t, this.base, true);
            this.post_render_cleanup(this.base.documentElement);
            output = output.replace(new RegExp('&amp;','g'), '&');
            return output;
        }
        return Guppy.transform(t, this.base);
    },
    
    'render' :function(updated) {
        if (!this.editor_active && this.is_blank()) {
            katex.render(this.empty_content,this.editor);
            return;
        }
        var tex = this.render_node(this.base,"latex");
        this.fire_event("debug",{"message":"RENDERING: " + tex})
        katex.render(tex,this.editor);
        if (updated) {
            this.recompute_locations_paths();
        }
    }
}
//Exports end

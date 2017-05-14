var katex  = require('../lib/katex/katex-modified.min.js');
var margin = "margin-right:-1px;border-right:1px solid;margin-bottom:-0.0862em;";
module.exports = {
    'recompute_locations_paths' :function() {
        ans = [];
        var bb = this.editor.getElementsByClassName("GuppyContainer")[0];
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
            var es = 1, fs = 1, cs = 1, ls = 1, eT = 1;
            for(var c = n.firstChild; c != null; c = c.nextSibling) {
                if (c.nodeName == "c") { this.add_paths(c, path+"_c"+cs); cs++; }
                else if (c.nodeName == "f") { this.add_paths(c, path+"_f"+fs); fs++; }
                else if (c.nodeName == "l") { this.add_paths(c, path+"_l"+ls); ls++; }
                else if (c.nodeName == "e") { this.add_paths(c, path+"_e"+es); es++; }
                else if (c.nodeName == "T") { this.add_paths(c, path+"_T"+eT); eT++; }
            }
        }
    },

    'add_selection_e' :function(n,text,text_node,classes,pureText) {
        var sel_cursor;
        if (this.sel_status == Guppy.SEL_CURSOR_AT_START) sel_cursor = this.sel_end;
        if (this.sel_status == Guppy.SEL_CURSOR_AT_END) sel_cursor = this.sel_start;

        if (this.sel_status != Guppy.SEL_NONE) {
            if (!pureText) {
                var sel_caret_text = this.is_small(sel_cursor.node) ? Guppy.kb.SMALL_SEL_CARET : Guppy.kb.SEL_CARET;
                if (!text_node && text.length == 0 && n.parentNode.childElementCount > 1) {
                    sel_caret_text = "\\color{blue}{\\xmlClass{"+classes+"}{"+sel_caret_text+"}}";
                } else {
                    sel_caret_text = "\\color{blue}{"+sel_caret_text+"}";
                }
                if (this.sel_status == Guppy.SEL_CURSOR_AT_END)
                    sel_caret_text = text_node ? "[" : sel_caret_text + "\\color{"+Guppy.kb.SEL_COLOR+"}{";
                if (this.sel_status == Guppy.SEL_CURSOR_AT_START)
                    sel_caret_text = text_node ? "]" : "}" + sel_caret_text;
            } else {
                var height = this.is_small(sel_cursor.node) ? 0.5 : Guppy.kb.SMALL_CARET_SIZE ; Guppy.kb.CARET_SIZE;
                sel_caret_text = '<span class="cursor" style="color:blue;'+margin+'height:'+height+';"></span>';
            }
        }
        return { 'sel_caret_text': sel_caret_text,
                 'sel_cursor'    : sel_cursor,
        }; 
    },

    'add_phantoms_e' :function(n,sel_cursor,classes,pureText) {
        var ans = "";
        if (n.parentNode.childElementCount == 1) {
            if (this.current == n) {
                if (pureText) {
                    var blank_caret = this.blank_caret || (this.is_small(this.current) ? Guppy.kb.SMALL_CARET_SIZE : Guppy.kb.CARET_SIZE);
                    ans= '<span class="cursor main_cursor '+classes+'" style="color:red;'+margin+'height:'+blank_caret+';"></span>';
                } else {
                    var blank_caret = this.blank_caret || (this.is_small(this.current) ? Guppy.kb.SMALL_CARET : Guppy.kb.CARET);
                    ans = "\\color{red}{\\xmlClass{main_cursor "+classes+"}{"+blank_caret+"}}";
                }
            }
            else if (this.temp_cursor.node == n)
                ans = "\\color{gray}{\\xmlClass{"+classes+"}{[?]}}";
            else
                ans = "\\color{blue}{\\xmlClass{"+classes+"}{[?]}}";
        } else if (!pureText && this.temp_cursor.node != n && this.current != n && (!(sel_cursor) || sel_cursor.node != n)) {
            // These are the empty e elements at either end of
            // a c or m node, such as the space before and
            // after both the sin and x^2 in sin(x^2)
            //
            // Here, we add in a small element so that we can
            // use the mouse to select these areas
            ans = "\\phantom{\\xmlClass{"+classes+"}{\\cursor[0.1ex]{1ex}}}";
        }
        return ans; 
    },

    'add_caret_e' :function(n,text_node,text,classes,pureText) {
        var caret_text = "";
        if (pureText) {
            if (text_node) return ""; 
            if (text.length == 0) 
                caret_text = '<span class="cursor main_cursor '+classes+'" style="color:red;'+margin+'height:'+Guppy.kb.CARET_SIZE+';"></span>';
            else
                caret_text = '<span class="cursor main_cursor" style="color:red;'+margin+'height:'+Guppy.kb.CARET_SIZE+';"></span>';
            if (this.sel_status == Guppy.SEL_CURSOR_AT_START)
                this.renderColor = 'style="color:'+Guppy.kb.SEL_COLOR+';"';
            else if (this.sel_status == Guppy.SEL_CURSOR_AT_END)
                if (pureText)
                    this.renderColor = "";
        } else {
            if (text_node) {
                if (this.sel_status == Guppy.SEL_CURSOR_AT_START)
                    caret_text = "[";
                else if (this.sel_status == Guppy.SEL_CURSOR_AT_END)
                    caret_text = "]";
                else
                    caret_text = "\\_";
            } else {
                caret_text = this.is_small(this.current) ? Guppy.kb.SMALL_CARET : Guppy.kb.CARET;
                if (text.length == 0) {
                    caret_text = "\\color{red}{\\xmlClass{main_cursor "+classes+"}{"+caret_text+"}}";
                } else
                    caret_text = "\\color{red}{\\xmlClass{main_cursor}{"+caret_text+"}}"
                if (this.sel_status == Guppy.SEL_CURSOR_AT_START) {
                    caret_text = caret_text + "\\color{"+Guppy.kb.SEL_COLOR+"}{";
                } else if (this.sel_status == Guppy.SEL_CURSOR_AT_END)
                    caret_text = "}" + caret_text;
            }
        }
        return caret_text;
    },
    
    'add_classes_cursors' :function(n,path) {
        if (n.nodeName == "e") {
            this.renderColor    = "";
            var ans             = "";
            var caret_text      = "";
            var temp_caret_text = "";
            var text            = n.firstChild.nodeValue;
            var text_node       = this.is_text(n);
            var classesi        = "guppy_elt guppy_loc_"+n.getAttribute("path")+"_";
            var classes0        = "guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0";
            var pureText        = n.parentNode.nodeName == "m";
            var sel             = this.add_selection_e(n,text,text_node,classes0,pureText);
            if (text.length == 0) {
                if (text_node) caret_text = "\\_";
                else ans = this.add_phantoms_e(n,sel.sel_cursor,classes0,pureText);
            }
            
            for(var i = 0; i < text.length+1; i++) {
                if (n == this.current && i == this.caret && (text.length > 0 || n.parentNode.childElementCount > 1)) {
                    ans += this.add_caret_e(n,text_node,text,classes0,pureText);
                } else if (n == this.current && i == this.caret && text_node) {
                    ans += caret_text;
                } else if (this.sel_status != Guppy.SEL_NONE && sel.sel_cursor.node == n && i == sel.sel_cursor.caret) {
                    this.renderColor = this.renderColor == '' ? 'style="color:'+Guppy.kb.SEL_COLOR+';"' : '';
                    ans += sel.sel_caret_text;
                } else if (this.temp_cursor.node == n && i == this.temp_cursor.caret && (text.length > 0 || 
                           n.parentNode.childElementCount > 1)) {
                    if (text_node) 
                        temp_caret_text = ".";
                    else if (pureText) {
                        temp_caret_text = '<span style="color:gray;'+margin+'height:'+Guppy.kb.CARET_SIZE+';"></span>';
                    } else {
                        temp_caret_text = this.is_small(this.current) ? Guppy.kb.TEMP_SMALL_CARET : Guppy.kb.TEMP_CARET;
                        if (text.length == 0)
                            temp_caret_text = "\\color{gray}{\\xmlClass{"+classes0+"}{"+temp_caret_text+"}}";
                        else
                            temp_caret_text = "\\color{gray}{"+temp_caret_text+"}";
                    }
                    ans += temp_caret_text;
                }
                if (i < text.length) {
                    if (pureText) {
                        var letter = text[i] == ' ' ? '&nbsp;' : text[i]
                        letter = letter.replace(/\r?\n/g, "<br/>");
                        ans += '<span class="'+classesi+i+'" '+this.renderColor+'>'+letter+'</span>';
                    } else
                        ans += "\\xmlClass{"+classesi+i+"'}{"+text[i]+"}";
                }
            }
            n.setAttribute("render", ans);
            n.removeAttribute("path");
        } else {
            for(var c = n.firstChild; c != null; c = c.nextSibling) {
                if (c.nodeName == "c" || c.nodeName == "l" || 
                    c.nodeName == "f" || c.nodeName == "e" ||
                    c.nodeName == "T")
                    this.add_classes_cursors(c); 
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
            var outputLength = output.length
            for(var i = 0; i < outputLength; i++)
                output[i] = output[i].replace(new RegExp('&amp;','g'), '&');
            return output;
        }
        return Guppy.transform(t, this.base);
    },
    
    'render' :function(updated) {
        if (!this.editor_active && this.is_blank()) {
            katex.render(this.empty_content,this.editor);
            return;
        }
        this.editor.innerHTML = "<span class='GuppyContainer'>";
        var content = this.render_node(this.base,"latex");
        var contentLength = content.length;
        for(var i = 0;i < contentLength; i++) {
            if(this.pureKatex || i%2) {
                this.editor.innerHTML += katex.renderToString(content[i]);
            } else {
                this.editor.innerHTML += content[i];
            }
        }
        this.editor.innerHTML += "</span>";
        this.fire_event("debug",{"message":"RENDERING: " + this.editor.innerHTML});
        if (updated) {
            this.recompute_locations_paths();
        }
    }
}
//Exports end


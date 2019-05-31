import AST from './ast.js';
import Parsers from './parser.js';
import Symbols from './symbols.js';
import Utils from './utils.js';
import Version from './version.js';
import katex from '../lib/katex/katex-modified.min.js';

/**
   @class
   @classdesc A class representing a Guppy document.  To access this
   class, use `Guppy.Doc`.  To get the document for a particular guppy
   instance, say called `"guppy1"`, do `Guppy("guppy1").doc()`.
   @param {string} [doc=<m><e></e></m>] - An XML string representing the document
   @constructor
 */
var Doc = function(doc, type){
    type = type || "xml";
    if(type == "xml") this.set_content(doc || "<m><e></e></m>");
    else if(type == "latex") this.import_latex(doc);
    else if(type == "text") this.import_text(doc);
    else if(type == "ast") this.import_ast(doc);
    if(this.root().hasAttribute("v") && this.root().getAttribute("v") != Version.DOC_VERSION)
    throw Version.DOC_ERROR;
    else
    this.root().setAttribute("v",Version.DOC_VERSION);
}

Doc.prototype.is_small = function(nn){
    var n = nn.parentNode;
    while(n != null && n.nodeName != 'm'){
        if(n.getAttribute("small") == "yes") return true;
        n = n.parentNode
        while(n != null && n.nodeName != 'c') n = n.parentNode;
    }
    return false;
}

Doc.prototype.ensure_text_nodes = function(){
    var l = this.base.getElementsByTagName("e");
    for(var i = 0; i < l.length; i++){
        if(!(l[i].firstChild)) l[i].appendChild(this.base.createTextNode(""));
    }
}

Doc.prototype.is_blank = function(){
    if(this.base.getElementsByTagName("f").length > 0) return false;
    var l = this.base.getElementsByTagName("e");
    if(l.length == 1 && (!(l[0].firstChild) || l[0].firstChild.textContent == "")) return true;
    return false;
}


/**
    Get the document as a DOM object
    @memberof Doc
    @returns {Element}
*/
Doc.prototype.root = function(){
    return this.base.documentElement;
}

/**
    Get the content of the document as a string
    @memberof Doc
    @param {string} t - The rendering method to use ("latex", "text", "ast" (for syntax tree), or "xml" (for internal XML representation))
    @returns {string}
*/
Doc.prototype.get_content = function(t,r){
    if(t == "xml") return (new XMLSerializer()).serializeToString(this.base);
    else if(t == "ast") return JSON.stringify(this.syntax_tree());
    else if(t == "text") return AST.to_text(this.syntax_tree());
    else if(t == "function") return AST.to_function(this.syntax_tree(), r);
    else if(t == "eqns") return JSON.stringify(AST.to_eqlist(this.syntax_tree()));
    else return this.manual_render(t,this.root(),r);
}

/**
    Evaluate the document using user-supplied functions to interpret symbols
    @memberof Doc
    @param {Object} evaluators - A dictionary where each key is a node
    type in the AST ("var", "val", "sin", "cos", etc.) and the
    corresponding value is a function that takes a list of argument
    (the results of evaluating that AST node's arguments) as well as,
    optionally, a second argument for the parent AST node to the one
    currently being evaluated.
    @returns {Object}
*/
Doc.prototype.evaluate = function(evaluators){
    return AST.eval(this.syntax_tree(), evaluators);
}

Doc.prototype.import_text = function(text, syms, s2n){
    var ast = Parsers.TextParser.tokenise_and_parse(text);
    this.import_ast(ast, syms, s2n);
}

Doc.prototype.import_latex = function(text, syms, s2n){
    var ast = Parsers.LaTeXParser.tokenise_and_parse(text);
    this.import_ast(ast, syms, s2n);
}

Doc.prototype.import_ast = function(ast, syms, s2n){
    if(typeof ast == "string"){
        ast = JSON.parse(ast);
    }
    syms = syms || Symbols.symbols;
    s2n = s2n || Symbols.symbol_to_node;
    var doc = AST.to_xml(ast, syms, s2n);
    this.base = doc;
    this.ensure_text_nodes();
}

Doc.prototype.syntax_tree = function(n){
    n = n || this.root()
    if(n.nodeName == "f"){
        var ans = {"args":[], "kwargs":{}};
        ans['value'] = n.getAttribute("type");
        ans['type'] = "function";
        if(n.hasAttribute("ast_value")) ans['value'] = n.getAttribute("ast_value");
        if(n.hasAttribute("ast_type")) ans['type'] = n.getAttribute("ast_type");
        else if(Utils.is_char(n)) ans['type'] = "name";

        var iterator = this.xpath_list("./*[name()='c' or name()='l']", n)
        for(var nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()){
            //if(nn.hasAttribute("name")) ans.kwargs[nn.getAttribute("name")] = this.syntax_tree(nn)
            //else ans.args.push(this.syntax_tree(nn))
            ans.args.push(this.syntax_tree(nn))
        }
    }
    else if(n.nodeName == "l"){
        ans = [];
        for(nn = n.firstChild; nn != null; nn = nn.nextSibling){
        ans.push(this.syntax_tree(nn));
        }
        ans = ["list",ans];
    }
    else if(n.nodeName == "c" || n.nodeName == "m"){
        if(n.hasAttribute("mode") && n.getAttribute("mode") == "text"){
            ans = n.firstChild.firstChild.textContent;
        }
        else{
            var tokens = []
            for(nn = n.firstChild; nn != null; nn = nn.nextSibling){
                if(nn.nodeName == "e"){
                    tokens = tokens.concat(Parsers.EParser.tokenise(nn.firstChild.textContent));
                }
                else if(nn.nodeName == "f"){
                    tokens.push(this.syntax_tree(nn));
                }
            }
            ans = Parsers.EParser.parse(tokens);
        }
    }
    return ans;
}

Doc.prototype.xpath_node = function(xpath, node){
    node = node || this.root()
    return this.base.evaluate(xpath, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

Doc.prototype.xpath_list = function(xpath, node){
    node = node || this.root()
    return this.base.evaluate(xpath, node, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
}

/**
    Get the names of symbols used in this document
    @memberof Doc
    @param {string[]} [groups] - A list of groups you want strings for
    @returns {string[]}
*/
Doc.prototype.get_symbols = function(groups){
    var types = {};
    var ans = [];
    var groups_selector = "//f";
    if(groups) groups_selector += "[" + groups.map(function(){ return ""; }).join(" or ") + "]";
    var iterator = this.xpath_list(groups_selector)
    for(var nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext())
        types[nn.getAttribute("type")] = true;
    for(var t in types)
        ans.push(t);
    return ans;
}

/**
    Set the content of the document
    @memberof Doc
    @param {string} xml_data - An XML string representing the content of the document
*/
Doc.prototype.set_content = function(xml_data){
    this.base = (new window.DOMParser()).parseFromString(xml_data, "text/xml");
    this.ensure_text_nodes();
}

Doc.prototype.auto_bracket = function(n){
    var e0 = n.firstChild;
    var e1 = n.lastChild;
    if(n.childElementCount == 3 && e0.firstChild.textContent == "" && e1.firstChild.textContent == ""){ // single f child, all e children empty
        var f = e0.nextSibling;
    var cs = 0;
    var c = null;
    // Count immediate children of f that are c nodes in cs and store the last one in c
    for(var nn = f.firstChild; nn; nn = nn.nextSibling) if(nn.tagName == "c"){ c = nn; cs++; }
        if(cs == 1 && c.getAttribute("is_bracket") == "yes") return false; // if the f child is a bracket, don't bracket
        if(Utils.is_char(f) && e0.getAttribute("current") != "yes" && e0.getAttribute("temp") != "yes" && e1.getAttribute("current") != "yes" && e1.getAttribute("temp") != "yes") return false; // if the f child is a character and not current or temp cursor location, don't bracket
    }
    else if(n.childElementCount == 1){ // Single e child
        var s = e0.firstChild.textContent;
        if(s.length != 1 && Number(s)+"" != s) return true; // If content is neither a single character nor a number, bracket it
        if(e0.getAttribute("current") == "yes" || e0.getAttribute("temp") == "yes") return true; // If content has the cursor or temp cursor, bracket it
        return false;
    }
    return true;
}

Doc.prototype.manual_render = function(t,n,r){
    var ans = "";
    var nn = null;
    var i = null;
    var spacer = t == "latex" ? " " : "";
    if(n.nodeName == "e"){
        if(t == "latex" && r){
            ans = n.getAttribute("render");
        }
        else{
            ans = n.firstChild.textContent;
        }
    }
    else if(n.nodeName == "f"){
        var real_type = (t == "latex" && this.is_small(n)) ? "small_latex" : t;
        nn = this.xpath_node("./b[@p='"+real_type+"']", n) || this.xpath_node("./b[@p='"+t+"']", n);
        if(nn) ans = this.manual_render(t,nn,r);
    }
    else if(n.nodeName == "b"){
        var cs = []
        i = 1;
        var par = n.parentNode;
        for(nn = par.firstChild; nn != null; nn = nn.nextSibling)
            if(nn.nodeName == "c" || nn.nodeName == "l") cs[i++] = this.manual_render(t,nn,r);
        for(nn = n.firstChild; nn != null; nn = nn.nextSibling){
            if(nn.nodeType == 3) ans += nn.textContent + spacer;
            else if(nn.nodeType == 1){
                if(nn.hasAttribute("d")){
                    var dim = parseInt(nn.getAttribute("d"));
                    var joiner = function(d,l){
                        if(d > 1) for(var k = 0; k < l.length; k++) l[k] = joiner(d-1,l[k]);
                        return l.join(nn.getAttribute('sep'+(d-1)));
                    }
                ans += joiner(dim,cs[parseInt(nn.getAttribute("ref"))]) + spacer;
                }
                else ans += cs[parseInt(nn.getAttribute("ref"))] + spacer;
            }
        }
    }
    else if(n.nodeName == "l"){
        ans = [];
        i = 0;
        for(nn = n.firstChild; nn != null; nn = nn.nextSibling){
            ans[i++] = this.manual_render(t,nn,r);
        }
    }
    else if(n.nodeName == "c" || n.nodeName == "m"){
        for(nn = n.firstChild; nn != null; nn = nn.nextSibling)
            ans += this.manual_render(t,nn,r) + spacer;
        if(t == "latex" && n.getAttribute("bracket") == "yes" && this.auto_bracket(n)) {
            ans = "\\left("+ans+"\\right)";
        }
    }
    return ans;
}

Doc.render_all = function(t, delim, root_node){
    var l,i,n,d,s,ans = [];
    if(!t || t == "xml"){
        l = document.getElementsByTagName("script");
        for(i = 0; i < l.length; i++){
            if(l[i].getAttribute("type") == "text/guppy_xml"){
                n = l[i];
                d = new Doc(n.innerHTML);
                s = document.createElement("span");
        var len = ans.length;
        var new_id = "guppy-"+t+"-render-"+len;
        while(document.getElementById(new_id)) new_id = "guppy-xml-render-"+(++len);
                s.setAttribute("id",new_id);
                s.setAttribute("class","guppy-render");
                katex.render(d.get_content("latex"), s);
                n.parentNode.insertBefore(s, n);
                n.parentNode.removeChild(n);
                ans.push({"container":s, "doc":d})
            }
        }
    }
    else {
        var subs = function(node) {
            if(!node) return;
            var excludeElements = ['script', 'style', 'iframe', 'canvas', 'pre', 'code'];
            do {
                switch (node.nodeType) {
                case 1:
                    // Don't process KaTeX elements, Guppy instances, Javascript, or CSS
                    if (excludeElements.indexOf(node.tagName.toLowerCase()) > -1 || (" "+node.getAttribute("class")+" ").indexOf(" katex ") > -1 || (""+node.getAttribute("class")).indexOf("guppy") > -1) {
                        continue;
                    }
                    subs(node.firstChild);
                    break;
                case 3:
                    var text_node = node;
                    var offset = text_node.textContent.indexOf(delim);
                    while(offset > -1){
                        var next = text_node.textContent.substring(offset+delim.length).indexOf(delim);
                        if(next == -1) break;
                        var before = text_node.textContent.substring(0,offset);
                        var content = text_node.textContent.substring(offset+delim.length,offset+delim.length+next);
                        var after = text_node.textContent.substring(offset+delim.length+next+delim.length);

                        // Make the span to render the doc in
                        var s = document.createElement("span");
            var l = ans.length;
            var new_id = "guppy-"+t+"-render-"+l;
            while(document.getElementById(new_id)) new_id = "guppy-"+t+"-render-"+(++l);
                        s.setAttribute("id",new_id);
            s.setAttribute("class","guppy-render");

            try {
                            // Create the document
                            d = new Doc(content,t);

                            // Render the doc
                            katex.render(d.get_content("latex"), s);
            }
            catch (e) {
                s.innerHTML = "ERROR: "+e.message;
            }
                        var new_node = document.createTextNode(after)
                        text_node.parentNode.insertBefore(document.createTextNode(before), text_node);
                        text_node.parentNode.insertBefore(s, text_node);
                        text_node.parentNode.insertBefore(new_node, text_node);
                        text_node.parentNode.removeChild(text_node);
                        text_node = new_node;
            node = new_node;
                        ans.push({"id":new_id, "doc":d});

                        offset = text_node.textContent.indexOf(delim);
                    }
                    break;
        default:
                    break;
                }
            } while ((node = node.nextSibling));

        }
        delim = delim || "$$";
        subs(root_node || document.documentElement);
    }
    return ans;
}

/**
    Render a given document into a specified HTML element.
    @param {string} doc - A GuppyXML string to be rendered
    @param {string} target_id - The ID of the HTML element to render into
    @param {string} type - Optional type of the doc provided. Default is `xml`
    @memberof Doc
*/
Doc.render = function(doc, target_id, type){
    var d = new Doc(doc, type);
    var target = document.getElementById(target_id);
    katex.render(d.get_content("latex"), target);
    return {"container":target, "doc":d};
}


export default Doc;

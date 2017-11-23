GuppyAST = require('./guppy_ast.js');

/**
   @class
   @classdesc A class representing a Guppy document
   @param {string} [doc=<m><e></e></m>] - An XML string representing the document
   @constructor 
 */
var GuppyDoc = function(doc){
    doc = doc || "<m><e></e></m>";
    this.set_content(doc);
}

GuppyDoc.prototype.is_small = function(nn){
    var n = nn.parentNode;
    while(n != null && n.nodeName != 'm'){
	if(n.getAttribute("small") == "yes") return true;
	n = n.parentNode
	while(n != null && n.nodeName != 'c') n = n.parentNode;
    }
    return false;
}

GuppyDoc.prototype.ensure_text_nodes = function(){
    var l = this.base.getElementsByTagName("e");
    for(var i = 0; i < l.length; i++){
	if(!(l[i].firstChild)) l[i].appendChild(this.base.createTextNode(""));
    }
}

/** 
    Check if document is empty
    @memberof GuppyDoc
    @returns {boolean}
*/
GuppyDoc.prototype.is_blank = function(){
    if(this.base.getElementsByTagName("f").length > 0) return false;
    var l = this.base.getElementsByTagName("e");
    if(l.length == 1 && (!(l[0].firstChild) || l[0].firstChild.textContent == "")) return true;
    return false;
}


/** 
    Get the document as a DOM object
    @memberof GuppyDoc
    @returns {Element}
*/
GuppyDoc.prototype.root = function(){
    return this.base.documentElement;
}

/** 
    Get the content of the document as a string
    @memberof GuppyDoc
    @param {string} t - The rendering method to use ("latex", "text", "ast" (for syntax tree), or "xml" (for internal XML representation))
    @returns {string}
*/
GuppyDoc.prototype.get_content = function(t,r){
    if(t == "xml") return (new XMLSerializer()).serializeToString(this.base);
    else if(t == "ast") return JSON.stringify(this.syntax_tree());
    else if(t == "text") return GuppyAST.to_text(this.syntax_tree());
    else if(t == "function") return GuppyAST.to_function(this.syntax_tree());
    else if(t == "eqns") return GuppyAST.to_eqlist(this.syntax_tree());
    else return this.manual_render(t,this.root(),r);
}

GuppyDoc.prototype.import_text = function(text, syms, s2n){
    var tokens = GuppyAST.tokenise_text(text);
    console.log("TOKENS",JSON.stringify(tokens));
    var ast = GuppyAST.parse_text(tokens);
    console.log("AST",JSON.stringify(ast));
    this.import_ast(ast, syms, s2n);
}

GuppyDoc.prototype.import_ast = function(ast, syms, s2n){
    syms = syms || GuppySymbols.symbols;
    s2n = s2n || GuppySymbols.symbol_to_node;
    var doc = GuppyAST.to_xml(ast, syms, s2n);
    this.base = doc;
    this.ensure_text_nodes();
}

GuppyDoc.prototype.syntax_tree = function(n){
    n = n || this.root()
    if(n.nodeName == "e"){
	console.log("Should never happen");
	//ans = n.firstChild.textContent;
    }
    else if(n.nodeName == "f"){
	var ans = {"args":[], "kwargs":{}};
	ans['value'] = n.getAttribute("type");
	ans['type'] = "function";
	if(n.hasAttribute("ast_value")) ans['value'] = n.getAttribute("ast_value");
	if(n.hasAttribute("ast_type")) ans['type'] = n.getAttribute("ast_type");
	else if(n.getAttribute("char") == "yes") ans['type'] = "name";
	
	var iterator = this.xpath_list("./*[name()='c' or name()='l']", n)
	for(var nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()){
	    //if(nn.hasAttribute("name")) ans.kwargs[nn.getAttribute("name")] = this.syntax_tree(nn)
	    //else ans.args.push(this.syntax_tree(nn))
	    ans.args.push(this.syntax_tree(nn))
	}
	//console.log("F",JSON.stringify(ans))
    }
    else if(n.nodeName == "l"){
	ans = [];
	for(var nn = n.firstChild; nn != null; nn = nn.nextSibling){
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
	    for(var nn = n.firstChild; nn != null; nn = nn.nextSibling){
		if(nn.nodeName == "e"){
		    tokens = tokens.concat(GuppyAST.tokenise_e(nn.firstChild.textContent));
		}
		else if(nn.nodeName == "f"){
		    tokens.push(this.syntax_tree(nn));
		}
	    }
	    //console.log("TOK",tokens);
	    ans = GuppyAST.parse_e(tokens);
	}
    }
    return ans;
}

GuppyDoc.prototype.xpath_node = function(xpath, node){
    node = node || this.root()
    return this.base.evaluate(xpath, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

GuppyDoc.prototype.xpath_list = function(xpath, node){
    node = node || this.root()
    return this.base.evaluate(xpath, node, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
}

/** 
    Get the names of symbols used in this document
    @memberof GuppyDoc
    @param {string[]} [groups] - A list of groups you want strings for
    @returns {string[]}
*/
GuppyDoc.prototype.get_symbols = function(groups){
    var types = {};
    var ans = [];
    var iterator = groups ? this.xpath_list("//f") : this.xpath_list("//f[@group='"+groups[i]+"']");
    for(var nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext())
	types[nn.getAttribute("type")] = true;
    for(var t in types)
	ans.push(t);
    return ans;
}

/** 
    Set the content of the document
    @memberof GuppyDoc
    @param {string} xml_data - An XML string representing the content of the document
*/
GuppyDoc.prototype.set_content = function(xml_data){
    this.base = (new window.DOMParser()).parseFromString(xml_data, "text/xml");
    this.ensure_text_nodes();
}

GuppyDoc.bracket_xpath = "(count(./*) != 1 and not \
		          ( \
                            count(./e)=2 and \
			    count(./f)=1 and \
			    count(./e[string-length(text())=0])=2 and \
			    ( \
			      (\
                                count(./f/c)=1 and\
			        count(./f/c[@is_bracket='yes'])=1\
			      )\
			      or\
			      (\
			        f/@char='yes' and \
				count(./e[@current='yes'])=0 and \
				count(./e[@temp='yes'])=0 \
			      )\
			    )\
			  )\
			)  \
			or\
		        (\
			  count(./*) = 1 and \
			  string-length(./e/text()) != 1 and \
			  number(./e/text()) != ./e/text() \
			) \
			or \
		        ( \
			  count(./*) = 1 and \
			  ./e/@current = 'yes' \
			) \
			or \
		        ( \
			  count(./*) = 1 and \
			  ./e/@temp = 'yes' \
			)"

GuppyDoc.prototype.manual_render = function(t,n,r){
    var ans = "";
    if(n.nodeName == "e"){
	if(t == "latex" && r){
	    ans = n.getAttribute("render");
	}
	else if(t == "text"){
	    ans = n.firstChild.textContent;
	    if(n.previousSibling && n.nextSibling && ans == "")
		ans = " * ";
	    else {
		ans = ans.replace(/(.)([^a-zA-Z0-9.])(.)/g,"$1 $2 $3");
		ans = ans.replace(/([a-zA-Z])(?=\.)/g,"$1 * ");
		ans = ans.replace(/(\.)(?=[a-zA-Z])/g,"$1 * ");
		ans = ans.replace(/([a-zA-Z])(?=[a-zA-Z0-9])/g,"$1 * ");
		ans = ans.replace(/([a-zA-Z0-9])(?=[a-zA-Z])/g,"$1 * ");
		if(n.previousSibling && n.previousSibling.getAttribute("group") != "operations") ans = ans.replace(/^([a-zA-Z0-9])/g," * $1");
		if(n.nextSibling && n.nextSibling.getAttribute("group") != "operations") ans = ans.replace(/([a-zA-Z0-9])$/g,"$1 * ");
		ans = " "+ans+" ";
	    }
	}
	else{
	    ans = n.firstChild.textContent;
	}
    }
    else if(n.nodeName == "f"){
	var real_type = (t == "latex" && this.is_small(n)) ? "small_latex" : t;
	var nn = this.xpath_node("./b[@p='"+real_type+"']", n) || this.xpath_node("./b[@p='"+t+"']", n);
	if(nn) ans = this.manual_render(t,nn,r);
    }
    else if(n.nodeName == "b"){
	var cs = []
	var i = 1;
	var par = n.parentNode;
	for(var nn = par.firstChild; nn != null; nn = nn.nextSibling)
	    if(nn.nodeName == "c" || nn.nodeName == "l") cs[i++] = this.manual_render(t,nn,r);
	for(var nn = n.firstChild; nn != null; nn = nn.nextSibling){
	    if(nn.nodeType == 3) ans += nn.textContent;
	    else if(nn.nodeType == 1){
		if(nn.hasAttribute("d")){
		    var dim = parseInt(nn.getAttribute("d"));
		    var joiner = function(d,l){
			if(d > 1) for(var k = 0; k < l.length; k++) l[k] = joiner(d-1,l[k]);
			return l.join(nn.getAttribute('sep'+(d-1)));
		    }
		    ans += joiner(dim,cs[parseInt(nn.getAttribute("ref"))]);
		}
		else ans += cs[parseInt(nn.getAttribute("ref"))];
	    }
	}
    }
    else if(n.nodeName == "l"){
	ans = [];
	var i = 0;
	for(var nn = n.firstChild; nn != null; nn = nn.nextSibling){
	    ans[i++] = this.manual_render(t,nn,r);
	}
    }
    else if(n.nodeName == "c" || n.nodeName == "m"){
	for(var nn = n.firstChild; nn != null; nn = nn.nextSibling)
	    ans += this.manual_render(t,nn,r);
	if(t == "latex" &&
           n.getAttribute("bracket") == "yes" &&
	   this.base.evaluate(GuppyDoc.bracket_xpath, n, null,
			 XPathResult.BOOLEAN_TYPE, null).booleanValue){ 
	    ans = "\\left("+ans+"\\right)";
	}
    }
    return ans;
}

GuppyDoc.prototype.path_to = function(n){
    var name = n.nodeName;
    if(name == "m") return "guppy_loc_m";
    var ns = 0;
    for(var nn = n; nn != null; nn = nn.previousSibling) if(nn.nodeType == 1 && nn.nodeName == name) ns++;
    return this.path_to(n.parentNode)+"_"+name+""+ns;
}

module.exports = GuppyDoc;

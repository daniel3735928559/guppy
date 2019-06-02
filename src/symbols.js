import Version from './version.js';
var Symbols = {"symbols":{}, "templates":{}};

Symbols.make_template_symbol = function(template_name, name, args){
    var template = JSON.parse(JSON.stringify(Symbols.templates[template_name]));
    return Symbols.eval_template(template, name, args);
}

Symbols.eval_template = function(template, name, args){
    args['name'] = name;
    if(Object.prototype.toString.call(template) == "[object String]") {
        var ans = template;
        for(var nam in args) {
            ans = ans.replace(new RegExp("\\{\\$"+nam+"\\}"),args[nam]);
        }
        return ans;
    }
    else {
        for(var x in template) {
            template[x] = Symbols.eval_template(template[x], name, args)
        }
        return template;
    }
}

Symbols.lookup_type = function(type){
    for(var s in Symbols.symbols){
        if(Symbols.symbols[s].attrs.type == type) return s;
    }
}

Symbols.add_symbols = function(syms){
    var version = syms["_version"];
    var collection_name = syms["_name"];
    delete syms["_version"];
    delete syms["_name"];
    if(!version || version != Version.SYMBOL_VERSION) Version.SYMBOL_ERROR(collection_name, version);
    var templates = syms["_templates"];
    if(templates){
        for(var t in templates){
            Symbols.templates[t] = templates[t];
        }
        delete syms["_templates"];
    }
    for(var s in syms){
        if(syms[s].template){
            for(var v in syms[s].values){
                var name = null;
                var args = null;
                if(Object.prototype.toString.call(syms[s].values) == "[object Array]"){
                    name = syms[s].values[v];
                    args = {}
                }
                else{
                    name = v;
                    args = syms[s].values[v];
                }
                Symbols.symbols[name] = Symbols.make_template_symbol(syms[s].template, name, args);
            }
        }
        else{
            Symbols.symbols[s] = syms[s];
        }
    }
}

Symbols.validate = function(){
    for(var sym in Symbols.symbols){
        if(!Symbols.symbols[sym].output.latex) throw "Symbol " + sym + " missing output.latex (needed for display)";
        if(!Symbols.symbols[sym].attrs.name) throw "Symbol " + sym + " missing attrs.name (needed for text output)";
        if(!Symbols.symbols[sym].attrs.group) throw "Symbol " + sym + " missing attrs.group (needed for mobile)";
        //for(var i = 0; i < sym.length; i++)
        //    if(sym.substring(0,i) in Symbols.symbols) throw "WARNING: Symbols are not prefix free: '" + sym.substring(0,i) + "' and '" + sym + "' are both symbols";
    }
}

// Returns an array with alternating text and argument elements of the form
// {"type":"text", "val":the_text} or {"type":"arg", "index":the_index, "seperators":[sep1,sep2,...], "template":[...]}
Symbols.split_output = function(output){
    var regex = /\{\$([0-9]+)/g, result, starts = [], indices = [], i;
    var ans = [];
    while ((result = regex.exec(output))){
        starts.push(result.index);
        indices.push(parseInt(result[1]));
    }
    ans.push({"type":"text","val":output.substring(0,starts.length > 0 ? starts[0] : output.length)}); // Push the first text bit
    for(i = 0; i < starts.length; i++){
        var idx = starts[i]+1;
        // Find template (if defined)
        // var tmpl_str = "";
        // var tmpl = [];
        // if(output[idx] == "["){
        //     idx++;
        //     var tmpl_opens = 1;
        //     while(opens > 0 && idx < output.length){
        //         if(output[idx] == "]"){ tmpl_opens--; }
        //         if(output[idx] == "["){ tmpl_opens++; }
        //         if(tmpl_opens > 1){ tmpl_str += output[idx]; }
        //         idx++;
        //     }
        //     tmpl = Symbols.split_output(tmpl_str);
        // }
        var separators = [];
        var sep = "";
        var opens = 1
        while(opens > 0 && idx < output.length){
            if(output[idx] == "}"){
                if(opens == 2){ separators.push(sep); sep = ""; }
                opens--; }
            if(opens >= 2){ sep += output[idx]; }
            if(output[idx] == "{"){ opens++; }
            idx++;
        }
        ans.push({"type":"arg","index":indices[i],"separators":separators});
        var next = (i == starts.length - 1) ? output.length : starts[i+1];
        ans.push({"type":"text","val":output.substring(idx,next)}); // Push the next text bit
    }
    return ans;
}

Symbols.add_blanks = function(output, blank){
    var out = Symbols.split_output(output);
    var ans = "";
    for(var i = 0; i < out.length; i++){
        if(out[i]["type"] == "text"){
            ans += out[i]['val'];
        }
        else ans += blank;
    }
    return ans;
}

Symbols.symbol_to_node = function(s, content, base){

    // s is a symbol
    //
    // content is a list of nodes to insert
    var f = base.createElement("f");
    for(var attr in s.attrs){
        f.setAttribute(attr, s.attrs[attr]);
    }
    if("ast" in s){
        if("type" in s.ast) f.setAttribute("ast_type",s.ast["type"])
        if("value" in s.ast) f.setAttribute("ast_value",s.ast["value"])
    }
    //if(s['char']) f.setAttribute("c","yes");

    var first_ref=-1, arglist = [];
    var first, i;

    // Make the b nodes for rendering each output
    for(var t in s["output"]){
        var b = base.createElement("b");
        b.setAttribute("p",t);

        var out = Symbols.split_output(s["output"][t]);
        for(i = 0; i < out.length; i++){
            if(out[i]["type"] == "text"){
                if(out[i]["val"].length > 0) b.appendChild(base.createTextNode(out[i]['val']));
            }
            else{
                if(t == 'latex') arglist.push(out[i]);
                var nt = base.createElement("r");
                nt.setAttribute("ref",out[i]["index"]);
                if(out[i]["separators"].length > 0) nt.setAttribute("d",out[i]["separators"].length);
                for(var j = 0; j < out[i]["separators"].length; j++) nt.setAttribute("sep"+j,out[i]["separators"][j]);
                if(t == 'latex' && first_ref == -1) first_ref = out[i]["index"];
                b.appendChild(nt);
            }
        }
        f.appendChild(b);
    }
    // Now make the c/l nodes for storing the content
    for(i = 0; i < arglist.length; i++){
        var a = arglist[i];
        var nc;
        if(i in content && a['separators'].length > 0) {  // If the content for this node is provided and is an array, then dig down to find the first c child
            f.appendChild(content[i][0]);
            nc = content[i][0];
            while(nc.nodeName != "c")
                nc = nc.firstChild;
        }
        else if(i in content) {                                  // If the content for this node is provided and not an array, create the c node and populate its content
            var node_list = content[i];
            nc = base.createElement("c");
            for(var se = 0; se < node_list.length; se++)
                nc.appendChild(node_list[se].cloneNode(true));
            f.appendChild(nc)
        }
        else{                                             // Otherwise create the c node and possibly l nodes
            nc = base.createElement("c");
            var new_e = base.createElement("e");
            new_e.appendChild(base.createTextNode(""));
            nc.appendChild(new_e);
            var par = f;                                  // Now we add nested l elements if this is an array of dimension > 0
            for(j = 0; j < a['separators'].length; j++){
                var nl = base.createElement("l");
                nl.setAttribute("s","1");
                par.appendChild(nl);
                par = nl;
            }
            par.appendChild(nc);
        }
        if(i+1 == first_ref) first = nc.lastChild;        // Note the first node we should visit based on the LaTeX output
        if(s['args'] && s['args'][i]){                    // Set the arguments for the c node based on the symbol
            for(var arg in s['args'][i]){
                nc.setAttribute(arg,s['args'][i][arg]);
            }
        }
    }
    return {"f":f, "first":first, "args":arglist};
}

// class SymbolTemplate{
//     constructor(name, definition){
// 	this.name = name;
// 	this.definition = definition;
//     }
//     evaluate(args){
// 	if(!(args.name)) throw "Template requires 'name' argument";
// 	let symdef = JSON.parse(JSON.stringify(this.definition));
// 	let r = function(src){
// 	    if(Object.prototype.toString.call(src) == "[object String]")
// 		for(var n in src) src[n].replace(new RegExp("\\{\\$"+n+"\\}"),args[n]);
// 	    else
// 		for(var x in src) src[x] = r(src[x]);
// 	    return src
// 	};
// 	return new Symbol(args.name, r(this.definition));
//     }
// }

// class Symbol{
//     constructor(name, definition){
// 	this.name = name;
// 	this.outputs = {};
// 	for(var o of definition.outputs){
// 	    this.outputs[o] = Symbol.parse_output(definition.outputs[o]);
// 	}
// 	this.args = definition.args;
// 	this.attrs = definition.attrs;
// 	this.input = definition.input;
// 	this.keys = definition.keys;
// 	this.ast_value = definition.ast.value;
// 	this.ast_type = definition.ast.type;
//     }
//     // Returns an array with alternating text and argument elements of the form
//     // {"type":"text", "val":the_text} or {"type":"arg", "index":the_index, "seperators":[sep1,sep2,...], "template":[...]}
//     static parse_output(output){
// 	var regex = /\{\$([0-9]+)/g, result, starts = [], indices = [], i;
// 	var ans = [];
// 	while ((result = regex.exec(output))){
//             starts.push(result.index);
//             indices.push(parseInt(result[1]));
// 	}
// 	ans.push({"type":"text","val":output.substring(0,starts.length > 0 ? starts[0] : output.length)}); // Push the first text bit
// 	for(i = 0; i < starts.length; i++){
//             var idx = starts[i]+1;
//             // Find template (if defined)
//             // var tmpl_str = "";
//             // var tmpl = [];
//             // if(output[idx] == "["){
//             //     idx++;
//             //     var tmpl_opens = 1;
//             //     while(opens > 0 && idx < output.length){
//             //         if(output[idx] == "]"){ tmpl_opens--; }
//             //         if(output[idx] == "["){ tmpl_opens++; }
//             //         if(tmpl_opens > 1){ tmpl_str += output[idx]; }
//             //         idx++;
//             //     }
//             //     tmpl = Symbols.split_output(tmpl_str);
//             // }
//             var separators = [];
//             var sep = "";
//             var opens = 1
//             while(opens > 0 && idx < output.length){
// 		if(output[idx] == "}"){
//                     if(opens == 2){ separators.push(sep); sep = ""; }
//                     opens--; }
// 		if(opens >= 2){ sep += output[idx]; }
// 		if(output[idx] == "{"){ opens++; }
// 		idx++;
//             }
//             ans.push({"type":"arg","index":indices[i],"separators":separators});
//             var next = (i == starts.length - 1) ? output.length : starts[i+1];
//             ans.push({"type":"text","val":output.substring(idx,next)}); // Push the next text bit
// 	}
// 	return ans;
//     }

//     to_node(content, base){
// 	// content is a list of nodes to insert
// 	var f = base.createElement("f");
// 	for(var attr in this.attrs){
//             f.setAttribute(attr, s.attrs[attr]);
// 	}
//         if(this.ast_type) f.setAttribute("ast_type",this.ast_type);
//         if(this.ast_value) f.setAttribute("ast_value",this.ast_value);

// 	var first_ref=-1, arglist = [];
// 	var first, i;

// 	// Make the b nodes for rendering each output
// 	for(var t in this.outputs){
//             var b = base.createElement("b");
//             b.setAttribute("p",t);

//             var out = this.outputs[t];
//             for(i = 0; i < out.length; i++){
// 		if(out[i]["type"] == "text"){
//                     if(out[i]["val"].length > 0) b.appendChild(base.createTextNode(out[i]['val']));
// 		}
// 		else{
//                     if(t == 'latex') arglist.push(out[i]);
//                     var nt = base.createElement("r");
//                     nt.setAttribute("ref",out[i]["index"]);
//                     if(out[i]["separators"].length > 0) nt.setAttribute("d",out[i]["separators"].length);
//                     for(var j = 0; j < out[i]["separators"].length; j++) nt.setAttribute("sep"+j,out[i]["separators"][j]);
//                     if(t == 'latex' && first_ref == -1) first_ref = out[i]["index"];
//                     b.appendChild(nt);
// 		}
//             }
//             f.appendChild(b);
// 	}
// 	// Now make the c/l nodes for storing the content
// 	for(i = 0; i < arglist.length; i++){
//             var a = arglist[i];
//             var nc;
//             if(i in content && a['separators'].length > 0) {  // If the content for this node is provided and is an array, then dig down to find the first c child
// 		f.appendChild(content[i][0]);
// 		nc = content[i][0];
// 		while(nc.nodeName != "c")
//                     nc = nc.firstChild;
//             }
//             else if(i in content) {                                  // If the content for this node is provided and not an array, create the c node and populate its content
// 		var node_list = content[i];
// 		nc = base.createElement("c");
// 		for(var se = 0; se < node_list.length; se++)
//                     nc.appendChild(node_list[se].cloneNode(true));
// 		f.appendChild(nc)
//             }
//             else{                                             // Otherwise create the c node and possibly l nodes
// 		nc = base.createElement("c");
// 		var new_e = base.createElement("e");
// 		new_e.appendChild(base.createTextNode(""));
// 		nc.appendChild(new_e);
// 		var par = f;                                  // Now we add nested l elements if this is an array of dimension > 0
// 		for(j = 0; j < a['separators'].length; j++){
//                     var nl = base.createElement("l");
//                     nl.setAttribute("s","1");
//                     par.appendChild(nl);
//                     par = nl;
// 		}
// 		par.appendChild(nc);
//             }
//             if(i+1 == first_ref) first = nc.lastChild;        // Note the first node we should visit based on the LaTeX output
//             if(this.args && this.args[i]){                    // Set the arguments for the c node based on the symbol
// 		for(var arg in this.args[i]){
//                     nc.setAttribute(arg,this.args[i][arg]);
// 		}
//             }
// 	}
// 	return {"f":f, "first":first, "args":arglist};
//     }

// }

export default Symbols;

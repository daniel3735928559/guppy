var Symbols = {"version":"2", "symbols":{}, "templates":{}};

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
    if(!version || version != Symbols.version) throw "Mismatched symbol file version: Expected '" + Symbols.version + "' but found '" + version +"' in symbol collection: " + collection_name;
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

// Symbols.validate(){
//     for(var sym in Symbols.symbols){
// 	for(var i = 0; i < sym.length; i++){
// 	    if(sym.substring(0,i) in Symbols.symbols) throw "WARNING: Symbols are not prefix free: '" + sym.substring(0,i) + "' and '" + sym + "' are both symbols";
// 	}
//     }
// }

Symbols.symbol_to_node = function(s, content, base){
    
    // s is a symbol
    //
    // content is a list of nodes to insert
    var f = base.createElement("f");
    for(var a in s.attrs){
        f.setAttribute(a, s.attrs[a]);
    }
    if("ast" in s){
        if("type" in s.ast) f.setAttribute("ast_type",s.ast["type"])
        if("value" in s.ast) f.setAttribute("ast_value",s.ast["value"])
    }
    //if(s['char']) f.setAttribute("c","yes");
    
    var first_ref = -1;
    var refs_count = 0;
    var lists = {}
    var first;

    // Make the b nodes for rendering each output    
    for(var t in s["output"]){
        var b = base.createElement("b");
        b.setAttribute("p",t);

        var out = s["output"][t];
        if(typeof out == 'string'){
            out = out.split(/(\{\$[0-9]+(?:\{[^}]+\})*\})/g);
            for(var i = 0; i < out.length; i++){
                var m = out[i].match(/^\{\$([0-9]+)((?:\{[^}]+\})*)\}$/);
                if(m){
                    out[i] = {'ref':parseInt(m[1])};
                    if(m[2].length > 0){
                        var mm = m[2].match(/\{[^}]*\}/g);
                        out[i]['d'] = mm.length;
                        for(var j = 0; j < mm.length; j++){
                            out[i]['sep'+j] = mm[j].substring(1,mm[j].length-1);
                        }
                    }
                }
            }
        }
        for(i = 0; i < out.length; i++){
            var nt = null;
            if(typeof out[i] == 'string' || out[i] instanceof String){
                nt = base.createTextNode(out[i]);
                b.appendChild(nt);
            }
            else{
                nt = base.createElement("r");
                for(var attr in out[i]){
                    nt.setAttribute(attr,out[i][attr]);
                }
                if(t == 'latex') {
                    if(first_ref == -1) first_ref = out[i]['ref'];
                    if('d' in out[i]) lists[refs_count] = out[i]['d']
                    refs_count++;
                }
                b.appendChild(nt);
            }
        }
        f.appendChild(b);
    }
    // Now make the c nodes for storing the content
    for(i = 0; i < refs_count; i++){
        var nc = base.createElement("c");
        if(i in content){
            var node_list = content[i];
            for(var se = 0; se < node_list.length; se++){
                nc.appendChild(node_list[se].cloneNode(true));
            }
        }
        else{
            var new_e = base.createElement("e");
            new_e.appendChild(base.createTextNode(""));
            nc.appendChild(new_e);
        }
        if(i+1 == first_ref) first = nc.lastChild;
        if(s['args']){
            for(a in (s['args'][i] || {})){
                nc.setAttribute(a,s['args'][i][a]);
            }
        }
        if(i in lists){
            var par = f;
            if(i in content && content[i][0].nodeName == "l"){
                par.appendChild(content[i][0]);
            }
            else{
                for(j = 0; j < lists[i]; j++){
                    var nl = base.createElement("l");
                    nl.setAttribute("s","1");
                    par.appendChild(nl);
                    par = nl;
                    if(j == lists[i]-1) nl.appendChild(nc);
                }
            }
        }
        else f.appendChild(nc);
    }
    return {"f":f, "first":first};
}


module.exports = Symbols;

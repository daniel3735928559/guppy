GuppySymbols = {"symbols":{}, "templates":{}};

GuppySymbols.eval_template = function(template, name, args){
    args['name'] = name;
    if(Object.prototype.toString.call(template) == "[object String]"){
	var ans = template;
	for(var name in args){
	    ans = ans.replace(new RegExp("\\{\\$"+name+"\\}"),args[name]);
	}
	return ans;
    }
    else{
	for(var x in template) {
	    template[x] = GuppySymbols.eval_template(template[x], name, args)
	}
	return template;
    }
}

GuppySymbols.symbol_to_node = function(s, content, base){
    
    console.log("CC",content);
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
		m = out[i].match(/^\{\$([0-9]+)((?:\{[^}]+\})*)\}$/);
		if(m){
		    out[i] = {'ref':parseInt(m[1])};
		    if(m[2].length > 0){
			mm = m[2].match(/\{[^}]*\}/g);
			out[i]['d'] = mm.length;
			for(var j = 0; j < mm.length; j++){
			    out[i]['sep'+j] = mm[j].substring(1,mm[j].length-1);
			}
		    }
		}
	    }
	}
	for(var i = 0; i < out.length; i++){
	    if(typeof out[i] == 'string' || out[i] instanceof String){
		var nt = base.createTextNode(out[i]);
		b.appendChild(nt);
	    }
	    else{
		var nt = base.createElement("r");
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
    for(var i = 0; i < refs_count; i++){
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
	    for(var a in (s['args'][i] || {})){
		nc.setAttribute(a,s['args'][i][a]);
	    }
	}
	if(i in lists){
	    var par = f;
	    for(var j = 0; j < lists[i]; j++){
		var nl = base.createElement("l");
		nl.setAttribute("s","1");
		par.appendChild(nl);
		par = nl;
		if(j == lists[i]-1) nl.appendChild(nc);
	    }
	}
	else f.appendChild(nc);
    }
    return {"f":f, "first":first};
}


module.exports = GuppySymbols;

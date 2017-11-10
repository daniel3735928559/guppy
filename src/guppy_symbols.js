GuppySymbols = {"symbols":{}};

GuppySymbols.symb_raw = function(symb_name,latex_symb,text_symb,group){
    return {"output":{"latex":latex_symb,
		      "text":text_symb},
	    "group":group,
	    "char":true,
	    "type":symb_name};
}

var func_template = {"output":{"latex":"\\{$name}\\left({$1}\\right)",
			       "text":" {$name}({$1})"},
		     "type":"{$name}",
		     "group":"{$group}",
		     "attrs":[
			 {"delete":"1"}
		     ]
		    };

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

console.log(GuppySymbols.eval_template(func_template, "sin", {"group":"trig"}));

GuppySymbols.symb_func = function(func_name,group){
    return {"output":{"latex":"\\"+func_name+"\\left({$1}\\right)",
		      "text":" " + func_name+"({$1})"},
	    "type":func_name,
	    "group":group,
	    "attrs":[
		{"delete":"1"}
	    ]
	   };
}

GuppySymbols.add_symbols = function(name,sym){
    var symbols = {};
    if(name == "_raw")
	for(var i = 0; i < sym.length; i++)
	    for(var t in sym[i]['symbols'])
		symbols[t] = GuppySymbols.symb_raw(t, sym[i]['symbols'][t]["latex"], sym[i]['symbols'][t]["text"], sym[i]['group']);
    
    else if(name == "_literal")
	for(var j = 0; j < sym.length; j++)
	    for(var i = 0; i < sym[j]['symbols'].length; i++)
		symbols[sym[j]['symbols'][i]] = GuppySymbols.symb_raw(sym[j]['symbols'][i], "\\"+sym[j]['symbols'][i], " $"+sym[j]['symbols'][i]+" ", sym[j]['group']);
    
    else if(name == "_func")
	for(var j = 0; j < sym.length; j++)
	    for(var i = 0; i < sym[j]['symbols'].length; i++)
		symbols[sym[j]['symbols'][i]] = GuppySymbols.symb_func(sym[j]['symbols'][i], sym[j]['group']);
    
    else symbols[name] = sym;
    return symbols
}

module.exports = GuppySymbols;

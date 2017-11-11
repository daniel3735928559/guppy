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

module.exports = GuppySymbols;

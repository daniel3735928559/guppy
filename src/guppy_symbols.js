GuppySymbols = {"symbols":{}};

GuppySymbols.symb_raw = function(symb_name,latex_symb,text_symb){
    return {"output":{"latex":[latex_symb],
					     "text":[text_symb]},
				   "char":true,
				   "type":symb_name};
}

GuppySymbols.symb_func = function(func_name){
    return {"output":{"latex":"\\"+func_name+"\\left({$1}\\right)",
					     "text":" " + func_name+"({$1})"},
				   "type":func_name,
				   "attrs":[
				       {"delete":"1"}
				   ]
				  };
}

GuppySymbols.add_symbols = function(name,sym){
    var symbols = {};
    if(name == "_raw")
	for(var t in sym)
	    symbols[t] = GuppySymbols.symb_raw(t, sym[t]["latex"], sym[t]["text"]);
    
    else if(name == "_literal")
	for(var i = 0; i < sym.length; i++)
	    symbols[sym[i]] = GuppySymbols.symb_raw(sym[i], "\\"+sym[i], " $"+sym[i]+" ");
    
    else if(name == "_func")
	for(var i = 0; i < sym.length; i++)
	    symbols[sym[i]] = GuppySymbols.symb_func(sym[i]);
    
    else symbols[name] = sym;
    return symbols
}

module.exports = GuppySymbols;

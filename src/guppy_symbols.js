GuppySymbols = {"symbols":{}};

GuppySymbols.symb_raw = function(symb_name,latex_symb,text_symb,group){
    return {"output":{"latex":[latex_symb],
		      "text":[text_symb]},
	    "group":group,
	    "char":true,
	    "type":symb_name};
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

GuppySymbols.add_symbols = function(name,sym){
    var symbols = {};
    if(name == "_raw")
	for(var t in sym['symbols'])
	    symbols[t] = GuppySymbols.symb_raw(t, sym['symbols'][t]["latex"], sym['symbols'][t]["text"], sym['group']);
    
    else if(name == "_literal")
	for(var i = 0; i < sym['symbols'].length; i++)
	    symbols[sym['symbols'][i]] = GuppySymbols.symb_raw(sym['symbols'][i], "\\"+sym['symbols'][i], " $"+sym['symbols'][i]+" ", sym['group']);
    
    else if(name == "_func")
	for(var i = 0; i < sym['symbols'].length; i++)
	    symbols[sym['symbols'][i]] = GuppySymbols.symb_func(sym['symbols'][i], sym['group']);
    
    else symbols[name] = sym;
    return symbols
}

module.exports = GuppySymbols;

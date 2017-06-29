var GuppySymbols = {"symbols":{}};

GuppySymbols.symb_raw = function(symb_name,latex_symb,text_symb){
    GuppySymbols.symbols[symb_name] = {"output":{"latex":[latex_symb],
					     "text":[text_symb]},
				   "char":true,
				   "type":symb_name};
}

GuppySymbols.symb_func = function(func_name){
    GuppySymbols.symbols[func_name] = {"output":{"latex":"\\"+func_name+"\\left({$1}\\right)",
					     "text":" " + func_name+"({$1})"},
				   "type":func_name,
				   "attrs":[
				       {"delete":"1"}
				   ]
				  };
}

GuppySymbols.add_symbol = function(name,sym){
    if(name == "_raw")
	for(var t in sym)
	    GuppySymbols.symb_raw(t, sym[t]["latex"], sym[t]["text"]);
    
    else if(name == "_literal")
	for(var i = 0; i < sym.length; i++)
	    GuppySymbols.symb_raw(sym[i], "\\"+sym[i], " $"+sym[i]+" ");
    
    else if(name == "_func")
	for(var i = 0; i < sym.length; i++)
	    GuppySymbols.symb_func(sym[i]);
    
    else GuppySymbols.symbols[name] = sym;
    
}

GuppySymbols.get_symbols = function(symbols, callback){
    if(!(Array.isArray(symbols))){
	symbols = [symbols];
    }
    var calls = [];
    for(var i = 0; i < symbols.length; i++){
	var x = function outer(j){
	    return function(callback){
		var req = new XMLHttpRequest();
		req.onload = function(){
		    var syms = JSON.parse(this.responseText);
		    for(var s in syms){
			GuppySymbols.add_symbol(s,syms[s]);
		    }
		    callback();
		};
		req.open("get", symbols[j], true);
		req.send();
	    }
	}(i);
	calls.push(x);
    }
    calls.push(callback);
    var j = 0;
    var cb = function(){
	j += 1;
	if(j < calls.length) calls[j](cb);
    }
    if(calls.length > 0) calls[0](cb);
}



module.exports = GuppySymbols;

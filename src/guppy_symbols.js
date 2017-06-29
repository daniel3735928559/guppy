var GuppySymbols = {"symbols":{}};

GuppySymbols.symb_raw = function(symb_name,latex_symb,text_symb){
    GuppySymbols.symbols[symb_name] = {"output":{"latex":[latex_symb],
					     "text":[text_symb]},
				   "char":true,
				   "type":symb_name};
}

GuppySymbols.symb_func = function(func_name){
    GuppySymbols.symbols[func_name] = {"output":{"latex":"\\"+func_name+"\\left({$1}\\right)",
					     "text":func_name+"({$1})"},
				   "type":func_name,
				   "attrs":[
				       {"delete":"1"}
				   ]
				  };
}

GuppySymbols.get_symbols = function(symbols, callback){
    var get_builtins = function(callback){
	var greek_syms = ["alpha","beta","gamma","delta","epsilon","zeta","eta","theta","iota","kappa","lambda","mu","nu","xi","omicron","pi","rho","sigma","tau","upsilon","phi","chi","psi","omega","Gamma","Delta","Theta","Lambda","Xi","Pi","Sigma","Phi","Psi","Omega"];
	var raw_syms = ["leq","geq","infty"];
	var func_syms = ["sin","cos","tan","sec","csc","cot","log","ln"];
	var other_syms = {"less":["<","<"],"greater":[">",">"]};
	
	for(var i = 0; i < greek_syms.length; i++){
	    GuppySymbols.symb_raw(greek_syms[i],"{\\"+greek_syms[i]+"}"," $"+greek_syms[i]+" ");
	}
	
	for(var i = 0; i < raw_syms.length; i++){
	    GuppySymbols.symb_raw(raw_syms[i],"{\\"+raw_syms[i]+"}"," "+raw_syms[i]+" ");
	}
	
	for(var i = 0; i < func_syms.length; i++){
	    GuppySymbols.symb_func(func_syms[i]);
	}
	
	for(var i in other_syms){
	    GuppySymbols.symb_raw(i, other_syms[i][0], other_syms[i][1]);
	}
    
	GuppySymbols.symb_raw("*","\\cdot ","*");
	if(callback) callback();
    }

    if(!(Array.isArray(symbols))){
	symbols = [symbols];
    }
    var answers = [];
    var calls = [];
    var set_symbols = function(){
	for(var i = 0; i < answers.length; i++){
	    for(var s in answers[i]){
		GuppySymbols.symbols[s] = answers[i][s];
	    }
	}
	if(callback) callback();
    }
    for(var i = 0; i < symbols.length; i++){
	answers.push(null);
	if(symbols[i] == "builtins"){
	    calls.push(get_builtins);
	    continue;
	}
	var x = function outer(j){
	    return function(callback){
		var req = new XMLHttpRequest();
		req.onload = function(){
		    var syms = JSON.parse(this.responseText);
		    for(var s in syms){
			GuppySymbols.symbols[s] = syms[s];
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

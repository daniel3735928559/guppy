GuppyAST = {};

GuppyAST.tokenise = function(s, tokens){
   var ans = [];
    while(s.length > 0){
	var ok = false;
	for(var i = 0; i < tokens.length; i++){
	    var t = tokens[i];
	    re = RegExp(t.re);
	    var m = re.exec(s);
	    if(m){
		m = m[0];
		s = s.substring(m.length);
		ok = true;
		if(t.type != "space") ans.push({"type":t.type, "value": t.value(m)})
		break;
	    }
	}
	if(!ok){
	    console.log("Tokenising error");
	    return [];
	}
    }
    return ans;
}

GuppyAST.tokenise_e = function(s){
    return GuppyAST.tokenise(s, [
	{"type":"number", "re":"^[0-9]+(\\.[0-9]*)?", "value":function(m){return Number(m)}},
	{"type":"operator", "re":"^[\-+*/!]", "value":function(m){return m}},
	{"type":"name", "re":"^[a-zA-Z]", "value":function(m){return m}},
	{"type":"space", "re":"^\\s+", "value":function(m){return m}},
    ]);
 }

GuppyAST.tokenise_text = function(s){
    return GuppyAST.tokenise(s, [
	{"type":"number", "re":"^[0-9]+(\\.[0-9]*)?", "value":function(m){return Number(m)}},
	{"type":"operator", "re":"^[\-+*/!]", "value":function(m){return m}},
	{"type":"name", "re":"^[a-zA-Z]+", "value":function(m){return m}},
	{"type":"lparen", "re":"^\(", "value":function(m){return m}},
	{"type":"rparen", "re":"^\)", "value":function(m){return m}},
	{"type":"space", "re":"^\\s+", "value":function(m){return m}},
    ]);
}

GuppyAST.to_text = function(ast){
    var functions = {};
    functions["*"] = function(args){return "("+args[0]+" * "+args[1]+")";};
    functions["+"] = function(args){return "("+args[0]+" + "+args[1]+")";};
    functions["/"] = function(args){return "("+args[0]+" / "+args[1]+")";};
    functions["fraction"] = function(args){return "("+args[0]+" / "+args[1]+")";};
    functions["-"] = function(args){return args.length == 1 ? "-"+args[0] : "("+args[0]+" - "+args[1]+")";};
    functions["val"] = function(args){return args[0]+"";};
    functions["var"] = function(args){return args[0];};
    functions["exponential"] = function(args){return "("+args[0]+"^"+args[1]+")";};
    functions["factorial"] = function(args){return "("+args[0]+")!";};
    functions["_default"] = function(name, args){return name + "(" + args.join(",") + ")";};
    return GuppyAST.eval(ast, functions);
}

GuppyAST.compute(ast, functions, vars){
    if(!functions["*"]) functions["*"] = function(args){return args[0]*args[1];}
    if(!functions["+"]) functions["+"] = function(args){return args[0]+args[1];}
    if(!functions["/"]) functions["/"] = function(args){if(args[1] == 0) throw Exception("Divide by zero"); return args[0]/args[1];}
    if(!functions["-"]) functions["-"] = function(args){return args.length == 1 ? -args[0] : args[0]-args[1];}
    if(!functions["val"]) functions["val"] = function(args){return args[0];}
    if(!functions["var"] && vars) functions["var"] = function(args){return vars[args[0]];}
    if(!functions["*"]) functions["*"] = function(args){return args[0]*args[1];}
    if(!functions["exponential"]) functions["exponential"] = function(args){return args[0]**args[1];}
    if(!functions["fraction"]) functions["fraction"] = functions["/"];
}

GuppyAST.eval = function(ast, functions, vars){
    ans = null;
    if(!functions["_default"]) functions["_default"] = function(name, args){ throw Exception("Function not implemented: " + name);}
    console.log("EVAL",JSON.stringify(ast));
    
    var args = []
    for(var i = 0; i < ast[1].length; i++){
	if(Object.prototype.toString.call(ast[1][i]) === '[object Array]'){
	    args.push(GuppyAST.eval(ast[1][i], functions, vars));
	}
	else{
	    args.push(ast[1][i]);
	}
    }
    if(functions[ast[0]]) ans = functions[ast[0]](args);
    else if(functions["_default"]) ans = functions["_default"](ast[0], args);
    
    console.log("EVAL",JSON.stringify(ast),'=',ans);
    return ans
}

GuppyAST.parse_e = function(tokens){
    var symbol_table = {};

    var original_symbol = {
	nud: function () { throw Error("Undefined"); },
	led: function (left) { throw Error("Missing operator"); }
    };

    var mul = function(left){ return ["*", [left, this.nud()]]; };
    
    var symbol = function (id, bp) {
	var s = symbol_table[id];
	bp = bp || 0;
	if (s) {
            if (bp >= s.lbp) {
		s.lbp = bp;
            }
	} else {
            s = Object.create(original_symbol);
            s.id = s.value = id;
            s.lbp = bp;
            symbol_table[id] = s;
	}
	return s;
    };

    symbol("(end)");

    s = symbol("(blank)", 60);
    s.nud = function(){ return ["blank"];};
    
    s = symbol("(function)", 60);
    s.led = mul;
    //s.nud = function(){ return [this.value, this.args || [], this.kwargs || {}];};
    s.nud = function(){ return [this.value, this.args || []];};
    
    s = symbol("(literal)", 60);
    s.led = mul;
    s.nud = function(){ return ["val", [this.value]] };

    s = symbol("(var)", 60);
    s.led = mul;
    s.nud = function(){ return ["var", [this.value]] };

    var token;
    var token_nr = 0;

    var advance = function (id) {
	var a, o, t, v;
	if (id && token.id !== id) {
            throw Error("Expected '" + id + "'");
	}
	if (token_nr >= tokens.length) {
            token = symbol_table["(end)"];
            return;
	}
	t = tokens[token_nr];
	token_nr += 1;
	v = t.value;
	var args = null;
	var kwargs = null;
	a = t.type;
	if (a === "name") {
            o = symbol_table["(var)"];
	} else if (a === "operator") {
            o = symbol_table[v];
            if (!o) {
		t.error("Unknown operator.");
            }
	} else if (a ===  "number") {
            a = "literal";
            o = symbol_table["(literal)"];
	} else if (a ===  "function") {
            a = "function";
            o = symbol_table["(function)"];
	    args = t.args;
	    kwargs = t.kwargs;
	} else {
            throw Error("Unexpected token",t);
	}
	token = Object.create(o);
	token.type = a;
	token.value = v;
	if(args) token.args = args;
	if(kwargs) token.kwargs = kwargs;
	return token;
    };


    var expression = function (rbp) {
	var left;
	var t = token;
	advance();
	left = t.nud();
	while (rbp < token.lbp) {
            t = token;
            advance();
            left = t.led(left);
	}
	return left;
    };

    var infix = function (id, bp, led) {
	var s = symbol(id, bp);
	s.led = led || function (left) {
            return [this.value, [left, expression(bp)]];
	};
	return s;
    }

    infix("+", 50);
    infix("-", 50);
    infix("*", 60);
    infix("/", 60);
    var prefix = function (id, nud) {
	var s = symbol(id);
	s.nud = nud || function () {
            return [this.value, [expression(70)]];
	};
	return s;
    }

    prefix("-");
    prefix("!");
    prefix("typeof");

    if(tokens.length == 0) return ["blank"];
    
    advance();
    
    return expression(10);
}

GuppyAST.parse_text = function(tokens){
    var symbol_table = {};

    var original_symbol = {
	nud: function () { throw Error("Undefined"); },
	led: function (left) { throw Error("Missing operator"); }
    };

    var mul = function(left){ return ["*", [left, this.nud()]]; };
    
    var symbol = function (id, bp) {
	var s = symbol_table[id];
	bp = bp || 0;
	if (s) {
            if (bp >= s.lbp) {
		s.lbp = bp;
            }
	} else {
            s = Object.create(original_symbol);
            s.id = s.value = id;
            s.lbp = bp;
            symbol_table[id] = s;
	}
	return s;
    };

    symbol("(end)");

    s = symbol("(blank)", 60);
    s.nud = function(){ return ["blank"];};
    
    s = symbol("(function)", 60);
    s.led = mul;
    //s.nud = function(){ return [this.value, this.args || [], this.kwargs || {}];};
    s.nud = function(){ return [this.value, this.args || []];};
    
    s = symbol("(literal)", 60);
    s.led = mul;
    s.nud = function(){ return ["val", [this.value]] };

    s = symbol("(var)", 60);
    s.led = mul;
    s.nud = function(){ return ["var", [this.value]] };

    var token;
    var token_nr = 0;

    var advance = function (id) {
	var a, o, t, v;
	if (id && token.id !== id) {
            throw Error("Expected '" + id + "'");
	}
	if (token_nr >= tokens.length) {
            token = symbol_table["(end)"];
            return;
	}
	t = tokens[token_nr];
	token_nr += 1;
	v = t.value;
	var args = null;
	var kwargs = null;
	a = t.type;
	if (a === "name") {
            o = symbol_table["(var)"];
	} else if (a === "operator") {
            o = symbol_table[v];
            if (!o) {
		t.error("Unknown operator.");
            }
	} else if (a ===  "number") {
            a = "literal";
            o = symbol_table["(literal)"];
	} else if (a ===  "function") {
            a = "function";
            o = symbol_table["(function)"];
	    args = t.args;
	    kwargs = t.kwargs;
	} else {
            throw Error("Unexpected token",t);
	}
	token = Object.create(o);
	token.type = a;
	token.value = v;
	if(args) token.args = args;
	if(kwargs) token.kwargs = kwargs;
	return token;
    };


    var expression = function (rbp) {
	var left;
	var t = token;
	advance();
	left = t.nud();
	while (rbp < token.lbp) {
            t = token;
            advance();
            left = t.led(left);
	}
	return left;
    };

    var infix = function (id, bp, led) {
	var s = symbol(id, bp);
	s.led = led || function (left) {
            return [this.value, [left, expression(bp)]];
	};
	return s;
    }

    infix("+", 50);
    infix("-", 50);
    infix("*", 60);
    infix("/", 60);
    var prefix = function (id, nud) {
	var s = symbol(id);
	s.nud = nud || function () {
            return [this.value, [expression(70)]];
	};
	return s;
    }

    prefix("-");
    prefix("!");
    prefix("typeof");

    if(tokens.length == 0) return ["blank"];
    
    advance();
    
    return expression(10);
}

module.exports = GuppyAST;

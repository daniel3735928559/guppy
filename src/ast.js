var AST = {};

AST.tokenise = function(s, tokens){
    var ans = [];
    while(s.length > 0){
        var ok = false;
        for(var i = 0; i < tokens.length; i++){
            var t = tokens[i];
            var re = RegExp(t.re);
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
            return [];
        }
    }
    return ans;
}

AST.tokenise_e = function(s){
    return AST.tokenise(s, [
        {"type":"number", "re":"^[0-9.]+", "value":function(m){
            if(isNaN(Number(m))) throw "Invalid number: "+m;
            return Number(m);
        }},
        {"type":"operator", "re":"^(<=|>=|!=|>|<|=)", "value":function(m){return m}},
        {"type":"operator", "re":"^[-+*/!]", "value":function(m){return m}},
        {"type":"name", "re":"^[a-zA-Z]", "value":function(m){return m}},
        {"type":"space", "re":"^\\s+", "value":function(m){return m}},
    ]);
}

AST.to_eqlist = function(ast){
    var comparators = ["=","!=","<=",">=","<",">"];
    if(ast[1].length == 0 || comparators.indexOf(ast[1][0][0]) < 0) return [ast];
    return AST.to_eqlist(ast[1][0]).concat([[ast[0],[ast[1][0][1][1],ast[1][1]]]]);
}

AST.to_text = function(ast){
    var functions = {};
    functions["bracket"] = function(args){return "("+args[0]+")";};
    functions["="] = function(args){return args[0]+" = "+args[1];};
    functions["!="] = function(args){return args[0]+" != "+args[1];};
    functions["<="] = function(args){return args[0]+" <= "+args[1];};
    functions[">="] = function(args){return args[0]+" >= "+args[1];};
    functions["<"] = function(args){return args[0]+" < "+args[1];};
    functions[">"] = function(args){return args[0]+" > "+args[1];};
    functions["*"] = function(args){return "("+args[0]+" * "+args[1]+")";};
    functions["+"] = function(args){return "("+args[0]+" + "+args[1]+")";};
    functions["/"] = function(args){return "("+args[0]+" / "+args[1]+")";};
    functions["fraction"] = function(args){return "("+args[0]+" / "+args[1]+")";};
    functions["-"] = function(args){return args.length == 1 ? "-"+args[0] : "("+args[0]+" - "+args[1]+")";};
    functions["val"] = function(args){return args[0]+"";};
    functions["var"] = function(args){return args[0];};
    functions["subscript"] = function(args){return "("+args[0]+"_"+args[1]+")";};
    functions["exponential"] = function(args){return "("+args[0]+"^"+args[1]+")";};
    functions["factorial"] = function(args){return "("+args[0]+")!";};
    functions["_default"] = function(name, args){return name + "(" + args.join(",") + ")";};
    return AST.eval(ast, functions);
}

AST.to_xml = function(ast, symbols, symbol_to_node){
    var prepend_str = function(doc, str){
        doc.documentElement.firstChild.textContent = str + doc.documentElement.firstChild.textContent;
    }
    var append_str = function(doc, str){
        doc.documentElement.lastChild.textContent += str;
    }
    var append_doc = function(doc, doc2){
        var n = doc.documentElement.lastChild;
        var nn = doc2.documentElement.firstChild
        n.firstChild.textContent += nn.firstChild.textContent;
        for(nn = nn.nextSibling; nn; nn = nn.nextSibling){
            n.parentNode.insertBefore(nn.cloneNode(true),null); 
        }
    }
    var ensure_text_nodes = function(base){
        var l = base.getElementsByTagName("e");
        for(var i = 0; i < l.length; i++){
            if(!(l[i].firstChild)) l[i].appendChild(base.createTextNode(""));
        }
    }
    var get_symbol = function(name, symbols){
        for(var s in symbols){
            if(symbols[s].attrs.type == name) return symbols[s];
        }
    }
    var get_content_array = function(args){
        var content = {};
        for(var i = 0; i < args.length; i++){
            content[i] = [];
            if(args[i].documentElement.nodeName == "l") content[i].push(args[i].documentElement);
            else for(var nn = args[i].documentElement.firstChild; nn; nn = nn.nextSibling) content[i].push(nn);
        }
        return content;
    }
    var binop_low = function(args, op, parent){
        var d = args[0].cloneNode(true);
        append_str(d, op);
        append_doc(d, args[1].cloneNode(true));
        if(parent && (parent[0] == "*" || (parent[0] == "-" && parent[1].length == 1)))
            return make_sym("bracket", [d]);
        else
            return d;
    }
    var binop_high = function(args, op){
        var d = args[0].cloneNode(true);
        append_doc(d, make_sym(op,[]));
        append_doc(d, args[1].cloneNode(true));
        return d;
    }
    var make_sym = function(name, args){
        var sym = get_symbol(name, symbols);
        if(!sym) throw "Unrecognised symbol: "+name;
        var base = (new window.DOMParser()).parseFromString("<c><e></e><e></e></c>", "text/xml");
        ensure_text_nodes(base);
        var e0 = base.documentElement.firstChild;
        var content = get_content_array(args);
        var f = symbol_to_node(sym, content, base)['f'];
        e0.parentNode.insertBefore(f,e0.nextSibling);
        ensure_text_nodes(base);
        return base;
    }
    var functions = {};

    var ops = ["*","<",">","=","<=",">=","!="];
    for(var i = 0; i < ops.length; i++){
        functions[ops[i]] = function(o){ return function(args){ return binop_high(args, o); }}(ops[i]);
    }
    functions["/"] = function(args){
        return make_sym("fraction",args);
    };
    functions["+"] = function(args, parent){ return binop_low(args, "+", parent); };
    functions["-"] = function(args, parent) {
        if(args.length == 1) {
            var d = args[0].cloneNode(true);
            prepend_str(d, "-");
            return d;
        }
        else {
            return binop_low(args, "-", parent);
        }
    }
    functions["val"] = function(args){ return (new window.DOMParser()).parseFromString("<c><e>" + args[0] + "</e></c>", "text/xml");};
    functions["var"] = function(args){
        if(args[0].length == 1) return (new window.DOMParser()).parseFromString("<c><e>" + args[0] + "</e></c>", "text/xml");
        else return make_sym(args[0], {});
    };
    functions["list"] = function(args){
        var base = (new window.DOMParser()).parseFromString("<l></l>", "text/xml");
        for(var i = 0; i < args.length; i++){
            base.documentElement.appendChild(args[i].documentElement.cloneNode(true));
        }
        base.documentElement.firstChild.setAttribute("s",String(args.length))
        return base;
    };
    // var comparators = {"<":"less",">":"greater","=":"eq","!=":"neq",">=":"geq","<=":"leq"};
    // for(var c in comparators){
    //     functions[c] = function(args){
    //         return make_sym(comparators[c], args);
    //     }
    // }
    functions["_default"] = function(name, args){
        return make_sym(name, args);
    }
    var ans = AST.eval(ast, functions);
    var new_base = (new window.DOMParser()).parseFromString("<m></m>", "text/xml");
    for(var nn = ans.documentElement.firstChild; nn; nn = nn.nextSibling){
        new_base.documentElement.insertBefore(nn.cloneNode(true),null);
    }
    return new_base;

}

AST.get_nodes = function(ast, name){
    if(ast.length < 2) return [];
    var ans = [];
    if(ast[0] == name) ans.push(ast[1]);
    if(ast[0] == "var" || ast[0] == "val") return ans;
    for(var i = 0; i < ast[1].length; i++) ans = ans.concat(AST.get_nodes(ast[1][i], name));
    return ans;
}

AST.get_vars = function(ast){
    var vars = {};
    var ans = [];
    var l = AST.get_nodes(ast, "var");
    for(var i = 0; i < l.length; i++) vars[l[i][0]] = true;
    for(var x in vars) ans.push(x);
    return ans;
}

AST.to_function = function(ast, functions){
    functions = functions || {}
    var defaults = {}
    defaults["*"] = function(args){return function(vars){return args[0](vars)*args[1](vars)};};
    defaults["+"] = function(args){return function(vars){return args[0](vars)+args[1](vars)};};
    defaults["fraction"] = function(args){return function(vars){return args[0](vars)/args[1](vars)};};
    defaults["/"] = function(args){return function(vars){return args[0](vars)/args[1](vars)};};
    defaults["-"] = function(args){return args.length == 1 ? function(vars){return -args[0](vars)} : function(vars){return args[0](vars)-args[1](vars)};};
    defaults["val"] = function(args){return function(){ return args[0]; };};
    defaults["var"] = function(args){return function(vars){ if(args[0] == "pi") return Math.PI; if(args[0] == "e") return Math.E; return vars[args[0]]; };};
    defaults["exponential"] = function(args){return function(vars){return Math.pow(args[0](vars),args[1](vars))};};
    defaults["square_root"] = function(args){return function(vars){return Math.sqrt(args[0](vars))};};
    defaults["sin"] = function(args){return function(vars){return Math.sin(args[0](vars))};};
    defaults["cos"] = function(args){return function(vars){return Math.cos(args[0](vars))};};
    defaults["tan"] = function(args){return function(vars){return Math.tan(args[0](vars))};};
    defaults["log"] = function(args){return function(vars){return Math.log(args[0](vars))};};
    for(var n in defaults) if(!functions[n]) functions[n] = defaults[n];
    return {"function":AST.eval(ast, functions),"vars":AST.get_vars(ast)};
}

AST.eval = function(ast, functions, parent){
    ans = null;
    if(!functions["_default"]) functions["_default"] = function(name, args){ throw "Function not implemented: " + name + "(" + args + ")";}
    
    var args = []
    for(var i = 0; i < ast[1].length; i++){
        if(Object.prototype.toString.call(ast[1][i]) === '[object Array]'){
            args.push(AST.eval(ast[1][i], functions, ast));
        }
        else{
            args.push(ast[1][i]);
        }
    }
    //console.log("Fn",ast[0],functions[ast[0]]);
    var ans = null;
    if(functions[ast[0]]) ans = functions[ast[0]](args, parent);
    else if(functions["_default"]) ans = functions["_default"](ast[0], args, parent);
    
    //console.log("EVAL",JSON.stringify(ast),'=',ans);
    return ans
}

AST.parse_e = function(tokens){
    var symbol_table = {};

    var original_symbol = {
        nud: function () { throw Error("Undefined"); },
        led: function () { throw Error("Missing operator"); }
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
    var s = null;
    
    s = symbol("(blank)", 60);
    s.nud = function(){ return ["blank"];};
    
    s = symbol("(function)", 60);
    s.led = mul;
    //s.nud = function(){ return [this.value, this.args || [], this.kwargs || {}];};
    s.nud = function(){ return [this.value, this.args || []];};
    
    s = symbol("(literal)", 60);
    s.led = mul;
    s.nud = function(){ return ["val", [this.value]] };

    s = symbol("(pass)", 60);
    s.led = mul;
    s.nud = function(){ return this.args[0] };
    
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
                throw "Unknown operator";
            }
        } else if (a ===  "pass") {
            a = "pass";
            o = symbol_table["(pass)"];
            args = t.args;
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

    
    infix("=", 40);
    infix("!=", 40);
    infix("<", 40);
    infix(">", 40);
    infix("<=", 40);
    infix(">=", 40);

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



AST.tokenise_text = function(s){
    return AST.tokenise(s, [
        {"type":"number", "re":"^[0-9.]+", "value":function(m){return Number(m)}},
        {"type":"operator", "re":"^(!=|>=|<=)", "value":function(m){return m;}},
        {"type":"operator", "re":"^[-+*/,!()=<>_^]", "value":function(m){return m}},
        {"type":"name", "re":"^[a-zA-Z_]*[a-zA-Z]", "value":function(m){return m}},
        {"type":"comma", "re":"^,", "value":function(m){return m}},
        {"type":"space", "re":"^\\s+", "value":function(m){return m}},
    ]);
}

AST.parse_text = function(tokens){
    var symbol_table = {};

    var original_symbol = {
        nud: function () { throw Error("Undefined"); },
        led: function () { throw Error("Missing operator"); }
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
    var s = null;
    
    s = symbol("(blank)", 60);
    s.nud = function(){ return ["blank"];};
    
    s = symbol("(literal)", 60);
    s.led = mul;
    s.nud = function(){ return ["val", [this.value]] };

    var get_args = function(){
        var args = [];
        advance()
        if(token.id !== ")"){
            while(true){
                args.push(expression(0));
                if (token.id !== ",") {
                    break;
                }
                advance(",");
            }
        }
        advance(")");
        return args;
    }
    
    s = symbol("(var)", 60);
    s.led = mul;
    s.nud = function(){
        if(token.id == "("){
            return [this.value, get_args()];
        }
        else{
            return ["var", [this.value]]
        }
    };
    
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
        a = t.type;
        if (a === "name") {
            o = symbol_table["(var)"];
        } else if (a === "operator") {
            o = symbol_table[v];
            if (!o) {
                throw Error("Unknown operator.");
            }
        } else if (a ===  "number") {
            a = "literal";
            o = symbol_table["(literal)"];
        } else {
            throw Error("Unexpected token",t);
        }
        token = Object.create(o);
        token.type = a;
        token.value = v;
        if(args) token.args = args;
        //console.log("ADVD",JSON.stringify(token));
        return token;
    };


    var expression = function (rbp) {
        var left;
        var t = token;
        //console.log("T1",JSON.stringify(token));
        advance();
        //console.log("T2",JSON.stringify(token));
        left = t.nud();
        while (rbp < token.lbp) {
            t = token;
            advance();
            //console.log("RB",JSON.stringify(token));
            left = t.led(left);
        }
        //console.log("POW", rbp, token.id, token.lbp);
        return left;
    };

    var infix = function (id, bp, led) {
        var s = symbol(id, bp);
        s.led = led || function (left) {
            return [this.value, [left, expression(bp)]];
        };
        return s;
    }

    infix("=", 40);
    infix("!=", 40);
    infix("<", 40);
    infix(">", 40);
    infix("<=", 40);
    infix(">=", 40);

    infix("+", 50);
    infix("-", 50);
    infix("*", 60);
    infix("/", 60);
    
    infix("!", 70, function(left){
        return ["factorial", [left]];
    });
    
    infix("^", 70, function(left){
        return ["exponential", [left, expression(70)]];
    });
    
    infix("_", 70, function(left){
        return ["subscript", [left, expression(70)]];
    });
    
    infix("(", 80, mul);

    symbol("(").nud = function(){
        var ans = expression(0);
        advance(")");
        return ans;
    }
    symbol(")");
    symbol(",");
    
    var prefix = function (id, nud) {
        var s = symbol(id);
        s.nud = nud || function () {
            return [this.value, [expression(70)]];
        };
        return s;
    }

    prefix("-");

    if(tokens.length == 0) return ["blank"];
    
    advance();
    
    return expression(10);
}

module.exports = AST;

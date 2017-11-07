var tokenize = function(s){
    var tokens = [
	{"type":"number", "re":"^[0-9]+(\\.[0-9]+)?", "value":function(m){return Number(m)}},
	{"type":"operator", "re":"^[\-+*/!]", "value":function(m){return m}},
	{"type":"name", "re":"^[a-zA-Z]", "value":function(m){return m}},
	{"type":"space", "re":"^\\s+", "value":function(m){return m}},
    ];
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
	    console.log("Tokenizing error");
	    return [];
	}
    }
    return ans;
}

var parse = function(expr){
    var symbol_table = {};

    var original_symbol = {
	nud: function () {
            this.error("Undefined.");
	},
	led: function (left) {
            this.error("Missing operator.");
	}
    };

    var itself = function () {
	return this;
    };

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

    s = symbol("(literal)", 60);
    s.led = function(left){ return {"value":"*", "first":left, "second": this};};
    s.nud = itself;

    s = symbol("(var)", 60);
    s.led = function(left){ return {"value":"*", "first":left, "second": this}; };
    s.nud = itself;

    var token;
    var token_nr = 0;
    var tokens = tokenize(expr);
    //var tokens = [{"value":"-","type":"operator"}, {"value":2,"type":"number"}, {"value":"+","type":"operator"}, {"value":3,"type":"number"}, {"value":"x","type":"name"}, {"value":"*","type":"operator"}, {"value":"-","type":"operator"}, {"value":"y","type":"name"}];

    var advance = function (id) {
	var a, o, t, v;
	if (id && token.id !== id) {
            token.error("Expected '" + id + "'.");
	}
	if (token_nr >= tokens.length) {
            token = symbol_table["(end)"];
            return;
	}
	t = tokens[token_nr];
	token_nr += 1;
	v = t.value;
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
	} else {
            t.error("Unexpected token.");
	}
	console.log("ATVO", a,t,v,o);
	token = Object.create(o);
	token.value = v;
	token.arity = a;
	return token;
    };


    var expression = function (rbp) {
	var left;
	var t = token;
	advance();
	console.log("T", t, token);
	left = t.nud();
	while (rbp < token.lbp) {
            t = token;
            advance();
	    console.log("tok",token);
            left = t.led(left);
	}
	return left;
    };

    var infix = function (id, bp, led) {
	var s = symbol(id, bp);
	s.led = led || function (left) {
            this.first = left;
            this.second = expression(bp);
            this.arity = "binary";
            return this;
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
            this.first = expression(70);
            this.arity = "unary";
            return this;
	};
	return s;
    }

    prefix("-");
    prefix("!");
    prefix("typeof");

    advance();
    return expression(10);
}

s="-2.100001 +3x*-y";
console.log(tokenize(s));
console.log(parse(s));

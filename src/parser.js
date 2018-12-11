var Parser = function(token_types){
    var self = this;
    this.token_types = token_types;
    this.symbol_table = {};

    this.original_symbol = {
        nud: function () { throw Error("Undefined"); },
        led: function () { throw Error("Missing operator"); }
    };

    this.mul = function(left){ return ["*", [left, this.nud()]]; };
    
    this.symbol = function (id, bp) {
        var s = self.symbol_table[id];
        bp = bp || 0;
        if (s) {
            if (bp >= s.lbp) {
                s.lbp = bp;
            }
        } else {
            s = Object.create(self.original_symbol);
            s.id = s.value = id;
            s.lbp = bp;
            s.parent = self;
            self.symbol_table[id] = s;
        }
        return s;
    };
    
    this.advance = function (id) {
        var a, o, t, v;
        if (id && this.token.id !== id) {
            throw Error("Expected '" + id + "'");
        }
        if (self.token_nr >= self.tokens.length) {
            self.token = this.symbol_table["(end)"];
            return;
        }
        t = self.tokens[self.token_nr];
        self.token_nr += 1;
        v = t.value;
        var args = null;
        a = t.type;
        if (a === "name") {
            o = this.symbol_table["(var)"];
        } else if (a === "operator") {
            o = this.symbol_table[v];
            if (!o) {
                throw Error("Unknown operator");
            }
        } else if (a === "pass") {
            a = "pass";
            o = this.symbol_table["(pass)"];
            args = t.args;
        } else if (a === "number") {
            a = "literal";
            o = this.symbol_table["(literal)"];
        } else if (a === "function") {
            a = "function";
            o = this.symbol_table["(function)"];
            args = t.args;
        } else {
            throw Error("Unexpected token",t);
        }
        self.token = Object.create(o);
        self.token.type = a;
        self.token.value = v;
        if(args) self.token.args = args;
        return self.token;
    };

    this.expression = function (rbp) {
        var left;
        var t = self.token;
        self.advance();
        left = t.nud();
        while (rbp < self.token.lbp) {
            t = self.token;
            self.advance();
            left = t.led(left);
        }
        return left;
    };

    this.infix = function (id, bp, led) {
        var s = this.symbol(id, bp);
        s.led = led || function (left) {
            return [this.value, [left, self.expression(bp)]];
        };
        return s;
    };
    
    this.prefix = function (id, nud) {
        var s = self.symbol(id);
        s.nud = nud || function () {
            if(this.value == "-") this.value = "neg";
            return [this.value, [self.expression(70)]];
        };
        return s;
    }

    this.symbol("(end)");
    var s = null;
    
    s = this.symbol("(blank)", 60);
    s.nud = function(){ return ["blank"];};

    s = this.symbol("(function)", 60);
    s.led = this.mul;
    s.nud = function(){ return [this.value, this.args || []];};
    
    s = this.symbol("(literal)", 60);
    s.led = this.mul;
    s.nud = function(){ return ["val", [this.value]] };

    s = this.symbol("(pass)", 60);
    s.led = this.mul;
    s.nud = function(){ return this.args[0] };
    
    s = this.symbol("(var)", 60);
    s.led = this.mul;
    s.nud = function(){ return ["var", [this.value]] };
        
    this.token_nr = 0;
    this.tokens = [];
    
    this.infix("=", 40);
    this.infix("!=", 40);
    this.infix("<", 40);
    this.infix(">", 40);
    this.infix("<=", 40);
    this.infix(">=", 40);
    this.infix("+", 50);
    this.infix("-", 50);
    this.infix("*", 60);
    this.infix("/", 60);
    this.infix("!", 70, function(left){ return ["factorial", [left]]; });
    this.infix("^", 70, function(left){ return ["exponential", [left, self.expression(70)]]; });
    this.infix("_", 70, function(left){ return ["subscript", [left, self.expression(70)]]; });
    this.infix("(", 80, self.mul);
    this.symbol("(").nud = function(){ var ans = self.expression(0); self.advance(")"); return ans; }
    this.symbol(")");
    this.symbol("{").nud = function(){ var ans = self.expression(0); self.advance("}"); return ans; }
    this.symbol("}");
    this.symbol(",");
    this.prefix("-");

    this.tokenise_and_parse = function(str){
        return this.parse(this.tokenise(str));
    }
    
    this.parse = function(tokens){
        this.tokens = tokens;
        this.token_nr = 0;
        if(this.tokens.length == 0) return ["blank"];
        this.advance();
        return this.expression(10);
    }
}

Parser.prototype.tokenise = function(text){
    var ans = [];
    while(text.length > 0){
        var ok = false;
        for(var i = 0; i < this.token_types.length; i++){
            var t = this.token_types[i];
            var re = RegExp(t.re);
            var m = re.exec(text);
            if(m){
                m = m[0];
                text = text.substring(m.length);
                ok = true;
                if(t.type != "space") ans.push({"type":t.type, "value": t.value(m)})
                break;
            }
        }
        if(!ok){
            if(text.charCodeAt(0) > 128){
                var c = "";
                for(var ch of text){
                    c = ch;
                    break;
                }
                ans.push({"type":"name", "value":c});
                text = text.substring(c.length);
            }
            else{
                return [];
            }
        }
    }
    return ans;
}

var EParser = new Parser([
    {"type":"number", "re":"^[0-9.]+", "value":function(m){
        if(isNaN(Number(m))) throw Error("Invalid number: "+m);
        return Number(m);
    }},
    {"type":"operator", "re":"^(<=|>=|!=|>|<|=)", "value":function(m){return m}},
    {"type":"operator", "re":"^[-+*/!]", "value":function(m){return m}},
    {"type":"name", "re":"^[a-zA-Z]", "value":function(m){return m}},
    {"type":"space", "re":"^\\s+", "value":function(m){return m}}
]);

var TextParser = new Parser([
    {"type":"number", "re":"^[0-9.]+", "value":function(m){
        if(isNaN(Number(m))) throw Error("Invalid number: "+m);
        return Number(m);
    }},
    {"type":"operator", "re":"^(!=|>=|<=)", "value":function(m){return m;}},
    {"type":"operator", "re":"^[-+*/,!()=<>_^]", "value":function(m){return m}},
    {"type":"name", "re":"^[a-zA-Z_]*[a-zA-Z]", "value":function(m){return m}},
    {"type":"comma", "re":"^,", "value":function(m){return m}},
    {"type":"space", "re":"^\\s+", "value":function(m){return m}}
]);


var s = TextParser.symbol("(var)", 60);
s.led = TextParser.mul;
s.nud = function(){
    if(this.parent.token.id == "("){
        var args = [];
        TextParser.advance()
        if(this.parent.token.id !== ")"){
            while(true){
                args.push(TextParser.expression(0));
                if (this.parent.token.id !== ",") {
                    break;
                }
                TextParser.advance(",");
            }
        }
        TextParser.advance(")");
        return [this.value, args];
    }
    else{
        return ["var", [this.value]]
    }
};

var LaTeXParser = new Parser([
    {"type":"number", "re":"^[0-9.]+", "value":function(m){
        if(isNaN(Number(m))) throw Error("Invalid number: "+m);
        return Number(m);
    }},
    {"type":"operator", "re":"^(!=|>=|<=)", "value":function(m){return m;}},
    {"type":"operator", "re":"^[-+*/,!()=<>_^}{]", "value":function(m){return m}},
    {"type":"name", "re":"^[a-zA-Z_]*[a-zA-Z]", "value":function(m){return m}},
    {"type":"name", "re":"^\\\\[a-zA-Z]*[a-zA-Z]", "value":function(m){return m.substring(1)}},
    {"type":"space", "re":"^\\s+", "value":function(m){return m}}
]);

s = LaTeXParser.symbol("(var)", 60);
s.led = LaTeXParser.mul;
s.nud = function(){
    var args = [];
    
    while(this.parent.token.id == "{"){
        LaTeXParser.advance()
        if(this.parent.token.id !== "}"){
            args.push(LaTeXParser.expression(0));
            LaTeXParser.advance("}");
        }
    }
    if(args.length > 0) return [this.value, args];
    else return ["var", [this.value]]
};

export default {"Parser":Parser,
                "TextParser":TextParser,
                "LaTeXParser":LaTeXParser,
                "EParser": EParser};


var Guppy = (function () {
    'use strict';

    var AST = {};

    AST.to_eqlist = function (ast) {
        var comparators = ["=", "!=", "<=", ">=", "<", ">"];
        if (ast[1].length == 0 || comparators.indexOf(ast[1][0][0]) < 0) return [ast];
        return AST.to_eqlist(ast[1][0]).concat([[ast[0], [ast[1][0][1][1], ast[1][1]]]]);
    };

    AST.to_text = function (ast) {
        var functions = {};
        functions["bracket"] = function (args) {
            return "(" + args[0] + ")";
        };
        functions["="] = function (args) {
            return args[0] + " = " + args[1];
        };
        functions["!="] = function (args) {
            return args[0] + " != " + args[1];
        };
        functions["<="] = function (args) {
            return args[0] + " <= " + args[1];
        };
        functions[">="] = function (args) {
            return args[0] + " >= " + args[1];
        };
        functions["<"] = function (args) {
            return args[0] + " < " + args[1];
        };
        functions[">"] = function (args) {
            return args[0] + " > " + args[1];
        };
        functions["*"] = function (args) {
            return "(" + args[0] + " * " + args[1] + ")";
        };
        functions["+"] = function (args) {
            return "(" + args[0] + " + " + args[1] + ")";
        };
        functions["/"] = function (args) {
            return "(" + args[0] + " / " + args[1] + ")";
        };
        functions["fraction"] = function (args) {
            return "(" + args[0] + " / " + args[1] + ")";
        };
        functions["-"] = function (args) {
            return args.length == 1 ? "-" + args[0] : "(" + args[0] + " - " + args[1] + ")";
        };
        functions["val"] = function (args) {
            return args[0] + "";
        };
        functions["var"] = function (args) {
            return args[0];
        };
        functions["subscript"] = function (args) {
            return "(" + args[0] + "_" + args[1] + ")";
        };
        functions["exponential"] = function (args) {
            return "(" + args[0] + "^" + args[1] + ")";
        };
        functions["factorial"] = function (args) {
            return "(" + args[0] + ")!";
        };
        functions["_default"] = function (name, args) {
            return name + "(" + args.join(",") + ")";
        };
        return AST.eval(ast, functions);
    };

    AST.to_xml = function (ast, symbols, symbol_to_node) {
        var prepend_str = function prepend_str(doc, str) {
            doc.documentElement.firstChild.textContent = str + doc.documentElement.firstChild.textContent;
        };
        var append_str = function append_str(doc, str) {
            doc.documentElement.lastChild.textContent += str;
        };
        var tail = function tail(doc) {
            var n = doc.documentElement.lastChild;
            return n.firstChild.textContent.slice(-1);
        };
        var head = function head(doc) {
            var n = doc.documentElement.firstChild;
            return n.firstChild.textContent.slice(0, 1);
        };
        var append_doc = function append_doc(doc, doc2) {
            var n = doc.documentElement.lastChild;
            var nn = doc2.documentElement.firstChild;
            n.firstChild.textContent += nn.firstChild.textContent;
            for (nn = nn.nextSibling; nn; nn = nn.nextSibling) {
                n.parentNode.insertBefore(nn.cloneNode(true), null);
            }
        };
        var ensure_text_nodes = function ensure_text_nodes(base) {
            var l = base.getElementsByTagName("e");
            for (var i = 0; i < l.length; i++) {
                if (!l[i].firstChild) l[i].appendChild(base.createTextNode(""));
            }
        };
        var get_symbol = function get_symbol(name, symbols) {
            for (var s in symbols) {
                if (symbols[s].attrs.type == name) return symbols[s];
            }
        };
        var get_content_array = function get_content_array(args) {
            var content = {};
            for (var i = 0; i < args.length; i++) {
                content[i] = [];
                if (args[i].documentElement.nodeName == "l") content[i].push(args[i].documentElement);else for (var nn = args[i].documentElement.firstChild; nn; nn = nn.nextSibling) {
                    content[i].push(nn);
                }
            }
            return content;
        };
        var binop_low = function binop_low(args, op, parent) {
            var d = args[0].cloneNode(true);
            append_str(d, op);
            append_doc(d, args[1].cloneNode(true));
            if (parent && (parent[0] == "*" || parent[0] == "-" && parent[1].length == 1)) return make_sym("bracket", [d]);else return d;
        };
        var binop_high = function binop_high(args, op) {
            var d = args[0].cloneNode(true);
            append_doc(d, make_sym(op, []));
            append_doc(d, args[1].cloneNode(true));
            return d;
        };
        var make_sym = function make_sym(name, args) {
            var sym = get_symbol(name, symbols);
            if (!sym) throw "Unrecognised symbol: " + name;
            var base = new window.DOMParser().parseFromString("<c><e></e><e></e></c>", "text/xml");
            ensure_text_nodes(base);
            var e0 = base.documentElement.firstChild;
            var content = get_content_array(args);
            var f = symbol_to_node(sym, content, base)['f'];
            e0.parentNode.insertBefore(f, e0.nextSibling);
            ensure_text_nodes(base);
            return base;
        };
        var functions = {};

        var ops = ["<", ">", "=", "<=", ">=", "!="];
        for (var i = 0; i < ops.length; i++) {
            functions[ops[i]] = function (o) {
                return function (args) {
                    return binop_high(args, o);
                };
            }(ops[i]);
        }
        functions["*"] = function (args) {
            var d = args[0].cloneNode(true);
            if (/[\d.]/.test(tail(args[0])) && /[\d.]/.test(head(args[1]))) append_doc(d, make_sym("*", []));
            append_doc(d, args[1].cloneNode(true));
            return d;
        };
        functions["/"] = function (args) {
            return make_sym("fraction", args);
        };
        functions["+"] = function (args, parent) {
            return binop_low(args, "+", parent);
        };
        functions["-"] = function (args, parent) {
            if (args.length == 1) {
                var d = args[0].cloneNode(true);
                prepend_str(d, "-");
                return d;
            } else {
                return binop_low(args, "-", parent);
            }
        };
        functions["neg"] = function (args) {
            var d = args[0].cloneNode(true);
            prepend_str(d, "-");
            return d;
        };
        functions["val"] = function (args) {
            return new window.DOMParser().parseFromString("<c><e>" + args[0] + "</e></c>", "text/xml");
        };
        functions["var"] = function (args) {
            if (args[0].length == 1) return new window.DOMParser().parseFromString("<c><e>" + args[0] + "</e></c>", "text/xml");else return make_sym(args[0], {});
        };
        functions["list"] = function (args) {
            var base = new window.DOMParser().parseFromString("<l></l>", "text/xml");
            for (var i = 0; i < args.length; i++) {
                base.documentElement.appendChild(args[i].documentElement.cloneNode(true));
            }
            base.documentElement.setAttribute("s", String(args.length));
            return base;
        };
        // var comparators = {"<":"less",">":"greater","=":"eq","!=":"neq",">=":"geq","<=":"leq"};
        // for(var c in comparators){
        //     functions[c] = function(args){
        //         return make_sym(comparators[c], args);
        //     }
        // }
        functions["_default"] = function (name, args) {
            return make_sym(name, args);
        };
        var ans = AST.eval(ast, functions);
        var new_base = new window.DOMParser().parseFromString("<m></m>", "text/xml");
        for (var nn = ans.documentElement.firstChild; nn; nn = nn.nextSibling) {
            new_base.documentElement.insertBefore(nn.cloneNode(true), null);
        }
        return new_base;
    };

    AST.get_nodes = function (ast, name) {
        if (ast.length < 2) return [];
        var ans = [];
        if (ast[0] == name) ans.push(ast[1]);
        if (ast[0] == "var" || ast[0] == "val") return ans;
        for (var i = 0; i < ast[1].length; i++) {
            ans = ans.concat(AST.get_nodes(ast[1][i], name));
        }return ans;
    };

    AST.get_vars = function (ast) {
        var vars = {};
        var ans = [];
        var l = AST.get_nodes(ast, "var");
        for (var i = 0; i < l.length; i++) {
            vars[l[i][0]] = true;
        }for (var x in vars) {
            ans.push(x);
        }return ans;
    };

    AST.to_function = function (ast, functions) {
        functions = functions || {};
        var defaults = {};
        defaults["*"] = function (args) {
            return function (vars) {
                return args[0](vars) * args[1](vars);
            };
        };
        defaults["+"] = function (args) {
            return function (vars) {
                return args[0](vars) + args[1](vars);
            };
        };
        defaults["fraction"] = function (args) {
            return function (vars) {
                return args[0](vars) / args[1](vars);
            };
        };
        defaults["/"] = function (args) {
            return function (vars) {
                return args[0](vars) / args[1](vars);
            };
        };
        defaults["-"] = function (args) {
            return args.length == 1 ? function (vars) {
                return -args[0](vars);
            } : function (vars) {
                return args[0](vars) - args[1](vars);
            };
        };
        defaults["neg"] = function (args) {
            return function (vars) {
                return -args[0](vars);
            };
        };
        defaults["val"] = function (args) {
            return function () {
                return args[0];
            };
        };
        defaults["var"] = function (args) {
            return function (vars) {
                if (args[0] == "pi") return Math.PI;if (args[0] == "e") return Math.E;return vars[args[0]];
            };
        };
        defaults["exponential"] = function (args) {
            return function (vars) {
                return Math.pow(args[0](vars), args[1](vars));
            };
        };
        defaults["squareroot"] = function (args) {
            return function (vars) {
                return Math.sqrt(args[0](vars));
            };
        };
        defaults["absolutevalue"] = function (args) {
            return function (vars) {
                return Math.abs(args[0](vars));
            };
        };
        defaults["sin"] = function (args) {
            return function (vars) {
                return Math.sin(args[0](vars));
            };
        };
        defaults["cos"] = function (args) {
            return function (vars) {
                return Math.cos(args[0](vars));
            };
        };
        defaults["tan"] = function (args) {
            return function (vars) {
                return Math.tan(args[0](vars));
            };
        };
        defaults["log"] = function (args) {
            return function (vars) {
                return Math.log(args[0](vars));
            };
        };
        for (var n in defaults) {
            if (!functions[n]) functions[n] = defaults[n];
        }return { "function": AST.eval(ast, functions), "vars": AST.get_vars(ast) };
    };

    AST.eval = function (ast, functions, parent) {
        ans = null;
        if (!functions["_default"]) functions["_default"] = function (name, args) {
            throw Error("Function not implemented: " + name + "(" + args + ")");
        };

        var args = [];
        for (var i = 0; i < ast[1].length; i++) {
            if (Object.prototype.toString.call(ast[1][i]) === '[object Array]') {
                args.push(AST.eval(ast[1][i], functions, ast));
            } else {
                args.push(ast[1][i]);
            }
        }
        var ans = null;
        if (functions[ast[0]]) ans = functions[ast[0]](args, parent);else if (functions["_default"]) ans = functions["_default"](ast[0], args, parent);

        return ans;
    };

    var Parser = function Parser(token_types) {
        var self = this;
        this.token_types = token_types;
        this.symbol_table = {};

        this.original_symbol = {
            nud: function nud() {
                throw Error("Undefined");
            },
            led: function led() {
                throw Error("Missing operator");
            }
        };

        this.mul = function (left) {
            return ["*", [left, this.nud()]];
        };

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
                throw Error("Unexpected token", t);
            }
            self.token = Object.create(o);
            self.token.type = a;
            self.token.value = v;
            if (args) self.token.args = args;
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
                if (this.value == "-") this.value = "neg";
                return [this.value, [self.expression(70)]];
            };
            return s;
        };

        this.symbol("(end)");
        var s = null;

        s = this.symbol("(blank)", 60);
        s.nud = function () {
            return ["blank"];
        };

        s = this.symbol("(function)", 60);
        s.led = this.mul;
        s.nud = function () {
            return [this.value, this.args || []];
        };

        s = this.symbol("(literal)", 60);
        s.led = this.mul;
        s.nud = function () {
            return ["val", [this.value]];
        };

        s = this.symbol("(pass)", 60);
        s.led = this.mul;
        s.nud = function () {
            return this.args[0];
        };

        s = this.symbol("(var)", 60);
        s.led = this.mul;
        s.nud = function () {
            return ["var", [this.value]];
        };

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
        this.infix("!", 70, function (left) {
            return ["factorial", [left]];
        });
        this.infix("^", 70, function (left) {
            return ["exponential", [left, self.expression(70)]];
        });
        this.infix("_", 70, function (left) {
            return ["subscript", [left, self.expression(70)]];
        });
        this.infix("(", 80, self.mul);
        this.symbol("(").nud = function () {
            var ans = self.expression(0);self.advance(")");return ans;
        };
        this.symbol(")");
        this.symbol("{").nud = function () {
            var ans = self.expression(0);self.advance("}");return ans;
        };
        this.symbol("}");
        this.symbol(",");
        this.prefix("-");

        this.tokenise_and_parse = function (str) {
            return this.parse(this.tokenise(str));
        };

        this.parse = function (tokens) {
            this.tokens = tokens;
            this.token_nr = 0;
            if (this.tokens.length == 0) return ["blank"];
            this.advance();
            return this.expression(10);
        };
    };

    Parser.prototype.tokenise = function (text) {
        var ans = [];
        while (text.length > 0) {
            var ok = false;
            for (var i = 0; i < this.token_types.length; i++) {
                var t = this.token_types[i];
                var re = RegExp(t.re);
                var m = re.exec(text);
                if (m) {
                    m = m[0];
                    text = text.substring(m.length);
                    ok = true;
                    if (t.type != "space") ans.push({ "type": t.type, "value": t.value(m) });
                    break;
                }
            }
            if (!ok) {
                if (text.charCodeAt(0) > 128) {
                    var c = "";
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = text[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var ch = _step.value;

                            c = ch;
                            break;
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    ans.push({ "type": "name", "value": c });
                    text = text.substring(c.length);
                } else {
                    return [];
                }
            }
        }
        return ans;
    };

    var EParser = new Parser([{ "type": "number", "re": "^[0-9.]+", "value": function value(m) {
            if (isNaN(Number(m))) throw Error("Invalid number: " + m);
            return Number(m);
        } }, { "type": "operator", "re": "^(<=|>=|!=|>|<|=)", "value": function value(m) {
            return m;
        } }, { "type": "operator", "re": "^[-+*/!]", "value": function value(m) {
            return m;
        } }, { "type": "name", "re": "^[a-zA-Z]", "value": function value(m) {
            return m;
        } }, { "type": "space", "re": "^\\s+", "value": function value(m) {
            return m;
        } }]);

    var TextParser = new Parser([{ "type": "number", "re": "^[0-9.]+", "value": function value(m) {
            if (isNaN(Number(m))) throw Error("Invalid number: " + m);
            return Number(m);
        } }, { "type": "operator", "re": "^(!=|>=|<=)", "value": function value(m) {
            return m;
        } }, { "type": "operator", "re": "^[-+*/,!()=<>_^]", "value": function value(m) {
            return m;
        } }, { "type": "name", "re": "^[a-zA-Z_]*[a-zA-Z]", "value": function value(m) {
            return m;
        } }, { "type": "comma", "re": "^,", "value": function value(m) {
            return m;
        } }, { "type": "space", "re": "^\\s+", "value": function value(m) {
            return m;
        } }]);

    var s = TextParser.symbol("(var)", 60);
    s.led = TextParser.mul;
    s.nud = function () {
        if (this.parent.token.id == "(") {
            var args = [];
            TextParser.advance();
            if (this.parent.token.id !== ")") {
                while (true) {
                    args.push(TextParser.expression(0));
                    if (this.parent.token.id !== ",") {
                        break;
                    }
                    TextParser.advance(",");
                }
            }
            TextParser.advance(")");
            return [this.value, args];
        } else {
            return ["var", [this.value]];
        }
    };

    var LaTeXParser = new Parser([{ "type": "number", "re": "^[0-9.]+", "value": function value(m) {
            if (isNaN(Number(m))) throw Error("Invalid number: " + m);
            return Number(m);
        } }, { "type": "operator", "re": "^(!=|>=|<=)", "value": function value(m) {
            return m;
        } }, { "type": "operator", "re": "^[-+*/,!()=<>_^}{]", "value": function value(m) {
            return m;
        } }, { "type": "name", "re": "^[a-zA-Z_]*[a-zA-Z]", "value": function value(m) {
            return m;
        } }, { "type": "name", "re": "^\\\\[a-zA-Z]*[a-zA-Z]", "value": function value(m) {
            return m.substring(1);
        } }, { "type": "space", "re": "^\\s+", "value": function value(m) {
            return m;
        } }]);

    s = LaTeXParser.symbol("(var)", 60);
    s.led = LaTeXParser.mul;
    s.nud = function () {
        var args = [];

        while (this.parent.token.id == "{") {
            LaTeXParser.advance();
            if (this.parent.token.id !== "}") {
                args.push(LaTeXParser.expression(0));
                LaTeXParser.advance("}");
            }
        }
        if (args.length > 0) return [this.value, args];else return ["var", [this.value]];
    };

    var Parsers = { "Parser": Parser,
        "TextParser": TextParser,
        "LaTeXParser": LaTeXParser,
        "EParser": EParser };

    var _version = "2.0.0-alpha.3";
    var _name = "base";
    var norm = {
    	output: {
    		latex: "||{$1}||",
    		asciimath: "norm({$1})"
    	},
    	attrs: {
    		type: "norm",
    		group: "functions"
    	},
    	args: [{
    		"delete": "1"
    	}]
    };
    var utf8 = {
    	output: {
    		latex: "\\texttt{U+{$1}}",
    		asciimath: "\\u{$1}"
    	},
    	attrs: {
    		type: "text",
    		group: "editor"
    	},
    	args: [{
    		utf8: "entry",
    		mode: "text"
    	}]
    };
    var text = {
    	output: {
    		latex: "\\text{{$1}}",
    		asciimath: "text({$1})"
    	},
    	attrs: {
    		type: "text",
    		group: "editor"
    	},
    	args: [{
    		mode: "text"
    	}]
    };
    var sym_name = {
    	output: {
    		latex: "\\backslash\\texttt{{$1}}",
    		asciimath: "SYMBOL({$1})"
    	},
    	input: -1,
    	attrs: {
    		type: "symbol",
    		group: "editor"
    	},
    	args: [{
    		mode: "symbol",
    		is_bracket: "yes"
    	}]
    };
    var abs = {
    	output: {
    		latex: "\\left|{$1}\\right|",
    		asciimath: "|{$1}|"
    	},
    	keys: ["|"],
    	attrs: {
    		type: "absolutevalue",
    		group: "functions"
    	},
    	args: [{
    		"delete": "1",
    		is_bracket: "yes"
    	}]
    };
    var sqrt = {
    	output: {
    		latex: "\\sqrt{{$1}\\phantom{\\tiny{!}}}",
    		asciimath: "sqrt({$1})"
    	},
    	attrs: {
    		type: "squareroot",
    		group: "functions"
    	},
    	args: [{
    		"delete": "1"
    	}]
    };
    var paren = {
    	output: {
    		latex: "\\left({$1}\\right)",
    		asciimath: "({$1})"
    	},
    	attrs: {
    		type: "paren",
    		group: "functions"
    	},
    	ast: {
    		type: "pass"
    	},
    	args: [{
    		"delete": "1",
    		is_bracket: "yes"
    	}]
    };
    var paren_guess_close = {
    	output: {
    		latex: "\\left({$1}\\right|",
    		asciimath: "({$1})"
    	},
    	attrs: {
    		type: "paren_guess_close",
    		group: "functions"
    	},
    	ast: {
    		type: "pass"
    	},
    	args: [{
    		"delete": "1",
    		is_bracket: "yes"
    	}]
    };
    var paren_guess_open = {
    	output: {
    		latex: "\\left|{$1}\\right)",
    		asciimath: "({$1})"
    	},
    	attrs: {
    		type: "paren_guess_open",
    		group: "functions"
    	},
    	ast: {
    		type: "pass"
    	},
    	args: [{
    		"delete": "1",
    		is_bracket: "yes"
    	}]
    };
    var floor = {
    	output: {
    		latex: "\\lfloor {$1} \\rfloor",
    		asciimath: "|_ {$1} _|"
    	},
    	attrs: {
    		type: "floor",
    		group: "functions"
    	},
    	args: [{
    		"delete": "1"
    	}]
    };
    var factorial = {
    	output: {
    		latex: "{$1}!",
    		asciimath: "({$1})!"
    	},
    	input: 1,
    	keys: ["!"],
    	attrs: {
    		type: "factorial",
    		group: "functions"
    	},
    	args: [{
    		bracket: "yes",
    		"delete": "1"
    	}]
    };
    var exp = {
    	output: {
    		latex: "{{$1}}^{{$2}}",
    		asciimath: "({$1})^({$2})"
    	},
    	input: 1,
    	keys: ["^", "shift+up"],
    	attrs: {
    		type: "exponential",
    		group: "functions"
    	},
    	args: [{
    		up: "2",
    		bracket: "yes",
    		"delete": "1",
    		name: "base"
    	}, {
    		down: "1",
    		"delete": "1",
    		name: "exponent",
    		small: "yes"
    	}]
    };
    var sub = {
    	output: {
    		latex: "{{$1}}_{{$2}}",
    		asciimath: "{$1}{$2}"
    	},
    	input: 1,
    	keys: ["_", "shift+down"],
    	attrs: {
    		type: "subscript",
    		group: "functions"
    	},
    	args: [{
    		down: "2",
    		bracket: "yes",
    		"delete": "1",
    		name: "base"
    	}, {
    		up: "1",
    		"delete": "1",
    		name: "subscript",
    		small: "yes"
    	}]
    };
    var frac = {
    	output: {
    		latex: "\\dfrac{{$1}}{{$2}}",
    		small_latex: "\\frac{{$1}}{{$2}}",
    		asciimath: "({$1})/({$2})"
    	},
    	input: 1,
    	keys: ["/"],
    	attrs: {
    		type: "fraction",
    		group: "functions"
    	},
    	args: [{
    		up: "1",
    		down: "2",
    		name: "numerator"
    	}, {
    		up: "1",
    		down: "2",
    		"delete": "1",
    		name: "denominator"
    	}]
    };
    var int = {
    	output: {
    		latex: "\\displaystyle\\int{{$1}}d{$2}",
    		small_latex: "\\int{{$1}}d{$2}",
    		asciimath: "int {$1} d{$2}"
    	},
    	attrs: {
    		type: "integral",
    		group: "calculus"
    	},
    	args: [{
    		"delete": "1",
    		name: "integrand"
    	}, {
    		"delete": "1",
    		bracket: "yes",
    		name: "variable"
    	}]
    };
    var defi = {
    	output: {
    		latex: "\\displaystyle\\int_{{$1}}^{{$2}}{$3}d{$4}",
    		small_latex: "\\int_{{$1}}^{{$2}}{$3}d{$4}",
    		asciimath: "int_{{$1}}^{{$2}} {$3} d{$4}"
    	},
    	attrs: {
    		type: "defintegral",
    		group: "calculus"
    	},
    	args: [{
    		down: "1",
    		up: "2",
    		small: "yes",
    		name: "lower_limit"
    	}, {
    		down: "1",
    		up: "2",
    		small: "yes",
    		name: "upper_limit"
    	}, {
    		down: "1",
    		up: "2",
    		"delete": "3",
    		name: "integrand"
    	}, {
    		down: "1",
    		up: "2",
    		bracket: "yes",
    		"delete": "4",
    		name: "variable"
    	}]
    };
    var deriv = {
    	output: {
    		latex: "\\displaystyle\\frac{d{$1}}{d{$2}}",
    		small_latex: "\\frac{d{$1}}{d{$2}}",
    		asciimath: "diff({$1},{$2})"
    	},
    	attrs: {
    		type: "derivative",
    		group: "calculus"
    	},
    	args: [{
    		down: "1",
    		up: "2",
    		bracket: "yes",
    		name: "function"
    	}, {
    		down: "1",
    		up: "2",
    		bracket: "yes",
    		name: "variable"
    	}]
    };
    var sum = {
    	output: {
    		latex: "\\displaystyle\\sum_{{$1}}^{{$2}}{$3}",
    		small_latex: "\\sum_{{$1}}^{{$2}}{$3}",
    		asciimath: "sum_{{$1}}^{{$2}} {$3}"
    	},
    	attrs: {
    		type: "summation",
    		group: "functions"
    	},
    	args: [{
    		down: "1",
    		up: "2",
    		small: "yes",
    		name: "lower_limit"
    	}, {
    		down: "1",
    		up: "2",
    		small: "yes",
    		name: "upper_limit"
    	}, {
    		down: "1",
    		up: "2",
    		"delete": "3",
    		bracket: "yes",
    		name: "summand"
    	}]
    };
    var prod = {
    	output: {
    		latex: "\\displaystyle\\prod_{{$1}}^{{$2}}{$3}",
    		small_latex: "\\prod_{{$1}}^{{$2}}{$3}",
    		asciimath: "prod_{{$1}}^{{$2}} {$3}"
    	},
    	attrs: {
    		type: "product",
    		group: "functions"
    	},
    	args: [{
    		down: "1",
    		up: "2",
    		small: "yes",
    		name: "lower_limit"
    	}, {
    		down: "1",
    		up: "2",
    		small: "yes",
    		name: "upper_limit"
    	}, {
    		down: "1",
    		up: "2",
    		"delete": "3",
    		bracket: "yes",
    		name: "summand"
    	}]
    };
    var root = {
    	output: {
    		latex: "\\sqrt[{$1}]{{$2}\\phantom{\\tiny{!}}}",
    		asciimath: "nroot({$1},{$2})"
    	},
    	attrs: {
    		type: "root",
    		group: "functions"
    	},
    	args: [{
    		down: "2",
    		up: "1",
    		small: "yes",
    		"delete": "1",
    		name: "index"
    	}, {
    		down: "2",
    		up: "1",
    		"delete": "1",
    		name: "radicand"
    	}]
    };
    var vec = {
    	output: {
    		latex: "\\left\\langle {$1{,}} \\right\\rangle",
    		asciimath: "<{$1{,}}>"
    	},
    	keys: ["{"],
    	attrs: {
    		group: "array",
    		type: "vector"
    	}
    };
    var point = {
    	output: {
    		latex: "\\left( {$1{,}} \\right)",
    		asciimath: "({$1{,}})"
    	},
    	keys: ["{"],
    	attrs: {
    		group: "array",
    		type: "point"
    	}
    };
    var mat = {
    	output: {
    		latex: "\\left(\\begin{matrix} {$1{ & }{\\\\}} \\end{matrix}\\right)",
    		asciimath: "matrix({$1{,}{;}})"
    	},
    	keys: ["["],
    	attrs: {
    		group: "array",
    		type: "matrix"
    	}
    };
    var infinity = {
    	output: {
    		latex: "\\infty",
    		asciimath: "oo"
    	},
    	attrs: {
    		group: "functions",
    		type: "infinity"
    	}
    };
    var _templates = {
    	latex_func: {
    		output: {
    			latex: "\\{$name}\\left({$1}\\right)",
    			asciimath: " {$name}({$1})"
    		},
    		attrs: {
    			type: "{$name}",
    			group: "functions"
    		},
    		args: [{
    			"delete": "1"
    		}]
    	},
    	latex_trig_func: {
    		output: {
    			latex: "\\{$name}\\left({$1}\\right)",
    			asciimath: " {$name}({$1})"
    		},
    		attrs: {
    			type: "{$name}",
    			group: "trigonometry"
    		},
    		args: [{
    			"delete": "1"
    		}]
    	},
    	func: {
    		output: {
    			latex: "{$latex}\\left({$1}\\right)",
    			asciimath: " {$asciimath}({$1})"
    		},
    		attrs: {
    			type: "{$name}",
    			group: "{$group}"
    		},
    		args: [{
    			"delete": "1"
    		}]
    	},
    	char: {
    		output: {
    			latex: "\\{$name}",
    			asciimath: " {$name} "
    		},
    		attrs: {
    			group: "greek",
    			type: "{$name}"
    		}
    	},
    	utf8codepoint: {
    		output: {
    			latex: "{\\char\"{$codepoint}}",
    			asciimath: " \\u{$codepoint} "
    		},
    		attrs: {
    			group: "unicode",
    			type: "{$name}"
    		},
    		ast: {
    			value: "\\u{$codepoint}"
    		}
    	},
    	utf8char: {
    		output: {
    			latex: "\\text{{$char}}",
    			asciimath: " {$name} "
    		},
    		attrs: {
    			group: "emoji",
    			type: "{$name}"
    		}
    	},
    	binop: {
    		output: {
    			latex: "{$latex}",
    			asciimath: "{$asciimath}"
    		},
    		keys: ["{$type}"],
    		attrs: {
    			group: "operations",
    			type: "{$type}"
    		},
    		ast: {
    			type: "operator"
    		}
    	}
    };
    var trig_functions = {
    	template: "latex_trig_func",
    	values: ["sin", "cos", "tan", "sec", "csc", "cot", "arcsin", "arccos", "arctan", "sinh", "cosh", "tanh"]
    };
    var functions = {
    	template: "latex_trig_func",
    	values: ["log", "ln"]
    };
    var utf8chars = {
    	template: "utf8char",
    	values: {
    		banana: {
    			char: "🍌"
    		},
    		pineapple: {
    			char: "🍍"
    		},
    		mango: {
    			char: "🥭"
    		},
    		kiwi: {
    			char: "🥝"
    		}
    	}
    };
    var greek = {
    	template: "char",
    	values: ["alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa", "lambda", "mu", "nu", "xi", "pi", "rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega", "Gamma", "Delta", "Theta", "Lambda", "Xi", "Pi", "Sigma", "Phi", "Psi", "Omega"]
    };
    var comparisons = {
    	template: "binop",
    	values: {
    		equal: {
    			latex: "=",
    			asciimath: " = ",
    			type: "="
    		},
    		leq: {
    			latex: "\\leq",
    			asciimath: " <= ",
    			type: "<="
    		},
    		less: {
    			latex: "<",
    			asciimath: " < ",
    			type: "<"
    		},
    		geq: {
    			latex: "\\geq",
    			asciimath: " >= ",
    			type: ">="
    		},
    		greater: {
    			latex: ">",
    			asciimath: " > ",
    			type: ">"
    		},
    		neq: {
    			latex: "\\neq",
    			asciimath: " != ",
    			type: "!="
    		}
    	}
    };
    var DEFAULT_SYMBOLS = {
    	_version: _version,
    	_name: _name,
    	norm: norm,
    	utf8: utf8,
    	text: text,
    	sym_name: sym_name,
    	abs: abs,
    	"eval": {
    		output: {
    			latex: "{$1}({$2{,}})",
    			asciimath: "{$1}({$2{,}})"
    		},
    		attrs: {
    			type: "eval",
    			group: "functions"
    		},
    		args: [{
    			"delete": "2",
    			name: "function"
    		}, {
    			"delete": "1",
    			name: "argument"
    		}]
    	},
    	sqrt: sqrt,
    	paren: paren,
    	paren_guess_close: paren_guess_close,
    	paren_guess_open: paren_guess_open,
    	floor: floor,
    	factorial: factorial,
    	exp: exp,
    	sub: sub,
    	frac: frac,
    	int: int,
    	defi: defi,
    	deriv: deriv,
    	sum: sum,
    	prod: prod,
    	root: root,
    	vec: vec,
    	point: point,
    	mat: mat,
    	"*": {
    		output: {
    			latex: "\\cdot",
    			asciimath: "*"
    		},
    		keys: ["*"],
    		attrs: {
    			group: "operations",
    			type: "*"
    		},
    		ast: {
    			type: "operator"
    		}
    	},
    	infinity: infinity,
    	_templates: _templates,
    	trig_functions: trig_functions,
    	functions: functions,
    	utf8chars: utf8chars,
    	greek: greek,
    	comparisons: comparisons
    };

    var Version = {};
    Version.GUPPY_VERSION = "2.0.0-alpha.1";
    Version.DOC_VERSION = "1.2.0";
    Version.SYMBOL_VERSION = "2.0.0-alpha.3";

    Version.DOC_ERROR = function (id, found_ver) {
        throw Error("Document version mismatch for " + id + ": Found " + found_ver + ", required " + Version.DOC_VERSION + ".  To update your document, please see daniel3735928559.github.io/guppy/doc/version.html");
    };

    Version.SYMBOL_ERROR = function (id, found_ver) {
        throw Error("Symbol version mismatch for " + id + ": Found " + found_ver + ", required " + Version.SYMBOL_VERSION + ".  To update your document, please see daniel3735928559.github.io/guppy/doc/version.html");
    };

    var Symbols = { "symbols": {}, "templates": {} };

    Symbols.make_template_symbol = function (template_name, name, args) {
        var template = JSON.parse(JSON.stringify(Symbols.templates[template_name]));
        return Symbols.eval_template(template, name, args);
    };

    Symbols.eval_template = function (template, name, args) {
        args['name'] = name;
        if (Object.prototype.toString.call(template) == "[object String]") {
            var ans = template;
            for (var nam in args) {
                ans = ans.replace(new RegExp("\\{\\$" + nam + "\\}"), args[nam]);
            }
            return ans;
        } else {
            for (var x in template) {
                template[x] = Symbols.eval_template(template[x], name, args);
            }
            return template;
        }
    };

    Symbols.lookup_type = function (type) {
        for (var s in Symbols.symbols) {
            if (Symbols.symbols[s].attrs.type == type) return s;
        }
    };

    Symbols.add_symbols = function (syms) {
        var version = syms["_version"];
        var collection_name = syms["_name"];
        delete syms["_version"];
        delete syms["_name"];
        if (!version || version != Version.SYMBOL_VERSION) Version.SYMBOL_ERROR(collection_name, version);
        var templates = syms["_templates"];
        if (templates) {
            for (var t in templates) {
                Symbols.templates[t] = templates[t];
            }
            delete syms["_templates"];
        }
        for (var s in syms) {
            if (syms[s].template) {
                for (var v in syms[s].values) {
                    var name = null;
                    var args = null;
                    if (Object.prototype.toString.call(syms[s].values) == "[object Array]") {
                        name = syms[s].values[v];
                        args = {};
                    } else {
                        name = v;
                        args = syms[s].values[v];
                    }
                    Symbols.symbols[name] = Symbols.make_template_symbol(syms[s].template, name, args);
                }
            } else {
                Symbols.symbols[s] = syms[s];
            }
        }
    };

    Symbols.validate = function () {
        for (var sym in Symbols.symbols) {
            if (!Symbols.symbols[sym].output.latex) throw "Symbol " + sym + " missing output.latex (needed for display)";
            if (!Symbols.symbols[sym].attrs.name) throw "Symbol " + sym + " missing attrs.name (needed for text output)";
            if (!Symbols.symbols[sym].attrs.group) throw "Symbol " + sym + " missing attrs.group (needed for mobile)";
            //for(var i = 0; i < sym.length; i++)
            //    if(sym.substring(0,i) in Symbols.symbols) throw "WARNING: Symbols are not prefix free: '" + sym.substring(0,i) + "' and '" + sym + "' are both symbols";
        }
    };

    // Returns an array with alternating text and argument elements of the form
    // {"type":"text", "val":the_text} or {"type":"arg", "index":the_index, "seperators":[sep1,sep2,...], "template":[...]}
    Symbols.split_output = function (output) {
        var regex = /\{\$([0-9]+)/g,
            result,
            starts = [],
            indices = [],
            i;
        var ans = [];
        while (result = regex.exec(output)) {
            starts.push(result.index);
            indices.push(parseInt(result[1]));
        }
        ans.push({ "type": "text", "val": output.substring(0, starts.length > 0 ? starts[0] : output.length) }); // Push the first text bit
        for (i = 0; i < starts.length; i++) {
            var idx = starts[i] + 1;
            // Find template (if defined)
            // var tmpl_str = "";
            // var tmpl = [];
            // if(output[idx] == "["){
            //     idx++;
            //     var tmpl_opens = 1;
            //     while(opens > 0 && idx < output.length){
            //         if(output[idx] == "]"){ tmpl_opens--; }
            //         if(output[idx] == "["){ tmpl_opens++; }
            //         if(tmpl_opens > 1){ tmpl_str += output[idx]; }
            //         idx++;
            //     }
            //     tmpl = Symbols.split_output(tmpl_str);
            // }
            var separators = [];
            var sep = "";
            var opens = 1;
            while (opens > 0 && idx < output.length) {
                if (output[idx] == "}") {
                    if (opens == 2) {
                        separators.push(sep);sep = "";
                    }
                    opens--;
                }
                if (opens >= 2) {
                    sep += output[idx];
                }
                if (output[idx] == "{") {
                    opens++;
                }
                idx++;
            }
            ans.push({ "type": "arg", "index": indices[i], "separators": separators });
            var next = i == starts.length - 1 ? output.length : starts[i + 1];
            ans.push({ "type": "text", "val": output.substring(idx, next) }); // Push the next text bit
        }
        return ans;
    };

    Symbols.add_blanks = function (output, blank) {
        var out = Symbols.split_output(output);
        var ans = "";
        for (var i = 0; i < out.length; i++) {
            if (out[i]["type"] == "text") {
                ans += out[i]['val'];
            } else ans += blank;
        }
        return ans;
    };

    Symbols.symbol_to_node = function (s, content, base) {

        // s is a symbol
        //
        // content is a list of nodes to insert
        var f = base.createElement("f");
        for (var attr in s.attrs) {
            f.setAttribute(attr, s.attrs[attr]);
        }
        if ("ast" in s) {
            if ("type" in s.ast) f.setAttribute("ast_type", s.ast["type"]);
            if ("value" in s.ast) f.setAttribute("ast_value", s.ast["value"]);
        }
        //if(s['char']) f.setAttribute("c","yes");

        var first_ref = -1,
            arglist = [];
        var first, i;

        // Make the b nodes for rendering each output    
        for (var t in s["output"]) {
            var b = base.createElement("b");
            b.setAttribute("p", t);

            var out = Symbols.split_output(s["output"][t]);
            for (i = 0; i < out.length; i++) {
                if (out[i]["type"] == "text") {
                    if (out[i]["val"].length > 0) b.appendChild(base.createTextNode(out[i]['val']));
                } else {
                    if (t == 'latex') arglist.push(out[i]);
                    var nt = base.createElement("r");
                    nt.setAttribute("ref", out[i]["index"]);
                    if (out[i]["separators"].length > 0) nt.setAttribute("d", out[i]["separators"].length);
                    for (var j = 0; j < out[i]["separators"].length; j++) {
                        nt.setAttribute("sep" + j, out[i]["separators"][j]);
                    }if (t == 'latex' && first_ref == -1) first_ref = out[i]["index"];
                    b.appendChild(nt);
                }
            }
            f.appendChild(b);
        }
        // Now make the c/l nodes for storing the content
        for (i = 0; i < arglist.length; i++) {
            var a = arglist[i];
            var nc;
            if (i in content && a['separators'].length > 0) {
                // If the content for this node is provided and is an array, then dig down to find the first c child
                f.appendChild(content[i][0]);
                nc = content[i][0];
                while (nc.nodeName != "c") {
                    nc = nc.firstChild;
                }
            } else if (i in content) {
                // If the content for this node is provided and not an array, create the c node and populate its content
                var node_list = content[i];
                nc = base.createElement("c");
                for (var se = 0; se < node_list.length; se++) {
                    nc.appendChild(node_list[se].cloneNode(true));
                }f.appendChild(nc);
            } else {
                // Otherwise create the c node and possibly l nodes
                nc = base.createElement("c");
                var new_e = base.createElement("e");
                new_e.appendChild(base.createTextNode(""));
                nc.appendChild(new_e);
                var par = f; // Now we add nested l elements if this is an array of dimension > 0
                for (j = 0; j < a['separators'].length; j++) {
                    var nl = base.createElement("l");
                    nl.setAttribute("s", "1");
                    par.appendChild(nl);
                    par = nl;
                }
                par.appendChild(nc);
            }
            if (i + 1 == first_ref) first = nc.lastChild; // Note the first node we should visit based on the LaTeX output
            if (s['args'] && s['args'][i]) {
                // Set the arguments for the c node based on the symbol
                for (var arg in s['args'][i]) {
                    nc.setAttribute(arg, s['args'][i][arg]);
                }
            }
        }
        return { "f": f, "first": first, "args": arglist };
    };

    // class SymbolTemplate{
    //     constructor(name, definition){
    // 	this.name = name;
    // 	this.definition = definition;
    //     }
    //     evaluate(args){
    // 	if(!(args.name)) throw "Template requires 'name' argument";
    // 	let symdef = JSON.parse(JSON.stringify(this.definition));
    // 	let r = function(src){
    // 	    if(Object.prototype.toString.call(src) == "[object String]")
    // 		for(var n in src) src[n].replace(new RegExp("\\{\\$"+n+"\\}"),args[n]);
    // 	    else
    // 		for(var x in src) src[x] = r(src[x]);
    // 	    return src
    // 	};
    // 	return new Symbol(args.name, r(this.definition));
    //     }
    // }

    // class Symbol{
    //     constructor(name, definition){
    // 	this.name = name;
    // 	this.outputs = {};
    // 	for(var o of definition.outputs){
    // 	    this.outputs[o] = Symbol.parse_output(definition.outputs[o]);
    // 	}
    // 	this.args = definition.args;
    // 	this.attrs = definition.attrs;
    // 	this.input = definition.input;
    // 	this.keys = definition.keys;
    // 	this.ast_value = definition.ast.value;
    // 	this.ast_type = definition.ast.type;
    //     }
    //     // Returns an array with alternating text and argument elements of the form
    //     // {"type":"text", "val":the_text} or {"type":"arg", "index":the_index, "seperators":[sep1,sep2,...], "template":[...]}
    //     static parse_output(output){
    // 	var regex = /\{\$([0-9]+)/g, result, starts = [], indices = [], i;
    // 	var ans = [];
    // 	while ((result = regex.exec(output))){
    //             starts.push(result.index);
    //             indices.push(parseInt(result[1]));
    // 	}
    // 	ans.push({"type":"text","val":output.substring(0,starts.length > 0 ? starts[0] : output.length)}); // Push the first text bit
    // 	for(i = 0; i < starts.length; i++){
    //             var idx = starts[i]+1;
    //             // Find template (if defined)
    //             // var tmpl_str = "";
    //             // var tmpl = [];
    //             // if(output[idx] == "["){
    //             //     idx++;
    //             //     var tmpl_opens = 1;
    //             //     while(opens > 0 && idx < output.length){
    //             //         if(output[idx] == "]"){ tmpl_opens--; }
    //             //         if(output[idx] == "["){ tmpl_opens++; }
    //             //         if(tmpl_opens > 1){ tmpl_str += output[idx]; }
    //             //         idx++;
    //             //     }
    //             //     tmpl = Symbols.split_output(tmpl_str);
    //             // }
    //             var separators = [];
    //             var sep = "";
    //             var opens = 1
    //             while(opens > 0 && idx < output.length){
    // 		if(output[idx] == "}"){
    //                     if(opens == 2){ separators.push(sep); sep = ""; }
    //                     opens--; }
    // 		if(opens >= 2){ sep += output[idx]; }
    // 		if(output[idx] == "{"){ opens++; }
    // 		idx++;
    //             }
    //             ans.push({"type":"arg","index":indices[i],"separators":separators});
    //             var next = (i == starts.length - 1) ? output.length : starts[i+1];
    //             ans.push({"type":"text","val":output.substring(idx,next)}); // Push the next text bit
    // 	}
    // 	return ans;
    //     }

    //     to_node(content, base){
    // 	// content is a list of nodes to insert
    // 	var f = base.createElement("f");
    // 	for(var attr in this.attrs){
    //             f.setAttribute(attr, s.attrs[attr]);
    // 	}
    //         if(this.ast_type) f.setAttribute("ast_type",this.ast_type);
    //         if(this.ast_value) f.setAttribute("ast_value",this.ast_value);

    // 	var first_ref=-1, arglist = [];
    // 	var first, i;

    // 	// Make the b nodes for rendering each output    
    // 	for(var t in this.outputs){
    //             var b = base.createElement("b");
    //             b.setAttribute("p",t);

    //             var out = this.outputs[t];
    //             for(i = 0; i < out.length; i++){
    // 		if(out[i]["type"] == "text"){
    //                     if(out[i]["val"].length > 0) b.appendChild(base.createTextNode(out[i]['val']));
    // 		}
    // 		else{
    //                     if(t == 'latex') arglist.push(out[i]);
    //                     var nt = base.createElement("r");
    //                     nt.setAttribute("ref",out[i]["index"]);
    //                     if(out[i]["separators"].length > 0) nt.setAttribute("d",out[i]["separators"].length);
    //                     for(var j = 0; j < out[i]["separators"].length; j++) nt.setAttribute("sep"+j,out[i]["separators"][j]);
    //                     if(t == 'latex' && first_ref == -1) first_ref = out[i]["index"];
    //                     b.appendChild(nt);
    // 		}
    //             }
    //             f.appendChild(b);
    // 	}
    // 	// Now make the c/l nodes for storing the content
    // 	for(i = 0; i < arglist.length; i++){
    //             var a = arglist[i];
    //             var nc;
    //             if(i in content && a['separators'].length > 0) {  // If the content for this node is provided and is an array, then dig down to find the first c child
    // 		f.appendChild(content[i][0]);
    // 		nc = content[i][0];
    // 		while(nc.nodeName != "c")
    //                     nc = nc.firstChild;
    //             }
    //             else if(i in content) {                                  // If the content for this node is provided and not an array, create the c node and populate its content
    // 		var node_list = content[i];
    // 		nc = base.createElement("c");
    // 		for(var se = 0; se < node_list.length; se++)
    //                     nc.appendChild(node_list[se].cloneNode(true));
    // 		f.appendChild(nc)
    //             }
    //             else{                                             // Otherwise create the c node and possibly l nodes
    // 		nc = base.createElement("c");
    // 		var new_e = base.createElement("e");
    // 		new_e.appendChild(base.createTextNode(""));
    // 		nc.appendChild(new_e);
    // 		var par = f;                                  // Now we add nested l elements if this is an array of dimension > 0
    // 		for(j = 0; j < a['separators'].length; j++){
    //                     var nl = base.createElement("l");
    //                     nl.setAttribute("s","1");
    //                     par.appendChild(nl);
    //                     par = nl;
    // 		}
    // 		par.appendChild(nc);
    //             }
    //             if(i+1 == first_ref) first = nc.lastChild;        // Note the first node we should visit based on the LaTeX output
    //             if(this.args && this.args[i]){                    // Set the arguments for the c node based on the symbol
    // 		for(var arg in this.args[i]){
    //                     nc.setAttribute(arg,this.args[i][arg]);
    // 		}
    //             }
    // 	}
    // 	return {"f":f, "first":first, "args":arglist};
    //     }

    // }

    Symbols.add_symbols(DEFAULT_SYMBOLS);

    var Utils = {};

    Utils.CARET = "\\xmlClass{cursor}{\\hspace{0pt}}";
    Utils.TEMP_SMALL_CARET = "\\xmlClass{cursor}{\\hspace{0pt}}";
    Utils.TEMP_CARET = "\\xmlClass{cursor}{\\hspace{0pt}}";
    Utils.SMALL_CARET = "\\xmlClass{cursor}{\\hspace{0pt}}";
    Utils.SEL_CARET = "\\xmlClass{cursor}{\\hspace{0pt}}";
    Utils.SMALL_SEL_CARET = "\\xmlClass{cursor}{\\hspace{0pt}}";
    Utils.SEL_COLOR = "red";

    Utils.is_blank = function (n) {
        return n.firstChild == null || n.firstChild.nodeValue == '';
    };

    Utils.get_length = function (n) {
        if (Utils.is_blank(n) || n.nodeName == 'f') return 0;
        return n.firstChild.nodeValue.length;
    };

    Utils.path_to = function (n) {
        var name = n.nodeName;
        if (name == "m") return "guppy_loc_m";
        var ns = 0;
        for (var nn = n; nn != null; nn = nn.previousSibling) {
            if (nn.nodeType == 1 && nn.nodeName == name) ns++;
        }return Utils.path_to(n.parentNode) + "_" + name + "" + ns;
    };

    Utils.is_text = function (nn) {
        return nn.parentNode.hasAttribute("mode") && (nn.parentNode.getAttribute("mode") == "text" || nn.parentNode.getAttribute("mode") == "symbol");
    };

    Utils.is_char = function (nn) {
        for (var n = nn.firstChild; n; n = n.nextSibling) {
            if (n.nodeName == "c" || n.nodeName == "l") return false;
        }
        return true;
    };

    Utils.is_symbol = function (nn) {
        return nn.parentNode.getAttribute("mode") && nn.parentNode.getAttribute("mode") == "symbol";
    };

    Utils.is_utf8entry = function (nn) {
        return nn.parentNode.getAttribute("utf8") && nn.parentNode.getAttribute("utf8") == "entry";
    };

    Utils.is_small = function (nn) {
        var n = nn.parentNode;
        while (n != null && n.nodeName != 'm') {
            if (n.getAttribute("small") == "yes") {
                return true;
            }
            n = n.parentNode;
            while (n != null && n.nodeName != 'c') {
                n = n.parentNode;
            }
        }
        return false;
    };

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var slicedToArray = function () {
      function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);

            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"]) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }

        return _arr;
      }

      return function (arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if (Symbol.iterator in Object(arr)) {
          return sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      };
    }();

    var katexModified_min = createCommonjsModule(function (module, exports) {
      !function (e, t) {
        module.exports = t();
      }("undefined" != typeof self ? self : commonjsGlobal, function () {
        return function (r) {
          var n = {};function i(e) {
            if (n[e]) return n[e].exports;var t = n[e] = { i: e, l: !1, exports: {} };return r[e].call(t.exports, t, t.exports, i), t.l = !0, t.exports;
          }return i.m = r, i.c = n, i.d = function (e, t, r) {
            i.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
          }, i.r = function (e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
          }, i.t = function (t, e) {
            if (1 & e && (t = i(t)), 8 & e) return t;if (4 & e && "object" == (typeof t === 'undefined' ? 'undefined' : _typeof(t)) && t && t.__esModule) return t;var r = Object.create(null);if (i.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t) for (var n in t) {
              i.d(r, n, function (e) {
                return t[e];
              }.bind(null, n));
            }return r;
          }, i.n = function (e) {
            var t = e && e.__esModule ? function () {
              return e.default;
            } : function () {
              return e;
            };return i.d(t, "a", t), t;
          }, i.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
          }, i.p = "", i(i.s = 2);
        }([function (e, t, r) {},, function (e, t, r) {
          r.r(t);r(0);var p = function () {
            function r(e, t, r) {
              this.lexer = void 0, this.start = void 0, this.end = void 0, this.lexer = e, this.start = t, this.end = r;
            }return r.prototype.getSource = function () {
              return this.lexer.input.slice(this.start, this.end);
            }, r.range = function (e, t) {
              return t ? e && e.loc && t.loc && e.loc.lexer === t.loc.lexer ? new r(e.loc.lexer, e.loc.start, t.loc.end) : null : e && e.loc;
            }, r;
          }(),
              a = function () {
            function r(e, t) {
              this.text = void 0, this.loc = void 0, this.text = e, this.loc = t;
            }return r.prototype.range = function (e, t) {
              return new r(t, p.range(this, e));
            }, r;
          }(),
              n = function e(t, r) {
            this.position = void 0;var n,
                i = "KaTeX parse error: " + t,
                a = r && r.loc;if (a && a.start <= a.end) {
              var o = a.lexer.input;n = a.start;var s = a.end;n === o.length ? i += " at end of input: " : i += " at position " + (n + 1) + ": ";var l = o.slice(n, s).replace(/[^]/g, '$&\u0332');i += (15 < n ? '\u2026' + o.slice(n - 15, n) : o.slice(0, n)) + l + (s + 15 < o.length ? o.slice(s, s + 15) + '\u2026' : o.slice(s));
            }var h = new Error(i);return h.name = "ParseError", h.__proto__ = e.prototype, h.position = n, h;
          };n.prototype.__proto__ = Error.prototype;var X = n,
              i = /([A-Z])/g,
              o = { "&": "&amp;", ">": "&gt;", "<": "&lt;", '"': "&quot;", "'": "&#x27;" },
              s = /[&><"']/g;var l = function e(t) {
            return "ordgroup" === t.type ? 1 === t.body.length ? e(t.body[0]) : t : "color" === t.type ? 1 === t.body.length ? e(t.body[0]) : t : "font" === t.type ? e(t.body) : t;
          },
              Y = { contains: function contains(e, t) {
              return -1 !== e.indexOf(t);
            }, deflt: function deflt(e, t) {
              return void 0 === e ? t : e;
            }, escape: function escape(e) {
              return String(e).replace(s, function (e) {
                return o[e];
              });
            }, hyphenate: function hyphenate(e) {
              return e.replace(i, "-$1").toLowerCase();
            }, getBaseElem: l, isCharacterBox: function isCharacterBox(e) {
              var t = l(e);return "mathord" === t.type || "textord" === t.type || "atom" === t.type;
            } },
              h = function () {
            function e(e) {
              this.displayMode = void 0, this.throwOnError = void 0, this.errorColor = void 0, this.macros = void 0, this.colorIsTextColor = void 0, this.strict = void 0, this.maxSize = void 0, this.maxExpand = void 0, this.allowedProtocols = void 0, e = e || {}, this.displayMode = Y.deflt(e.displayMode, !1), this.throwOnError = Y.deflt(e.throwOnError, !0), this.errorColor = Y.deflt(e.errorColor, "#cc0000"), this.macros = e.macros || {}, this.colorIsTextColor = Y.deflt(e.colorIsTextColor, !1), this.strict = Y.deflt(e.strict, "warn"), this.maxSize = Math.max(0, Y.deflt(e.maxSize, 1 / 0)), this.maxExpand = Math.max(0, Y.deflt(e.maxExpand, 1e3)), this.allowedProtocols = Y.deflt(e.allowedProtocols, ["http", "https", "mailto", "_relative"]);
            }var t = e.prototype;return t.reportNonstrict = function (e, t, r) {
              var n = this.strict;if ("function" == typeof n && (n = n(e, t, r)), n && "ignore" !== n) {
                if (!0 === n || "error" === n) throw new X("LaTeX-incompatible input and strict mode is set to 'error': " + t + " [" + e + "]", r);"warn" === n ? "undefined" != typeof console && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + t + " [" + e + "]") : "undefined" != typeof console && console.warn("LaTeX-incompatible input and strict mode is set to unrecognized '" + n + "': " + t + " [" + e + "]");
              }
            }, t.useStrictBehavior = function (e, t, r) {
              var n = this.strict;if ("function" == typeof n) try {
                n = n(e, t, r);
              } catch (e) {
                n = "error";
              }return !(!n || "ignore" === n) && (!0 === n || "error" === n || ("warn" === n ? "undefined" != typeof console && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + t + " [" + e + "]") : "undefined" != typeof console && console.warn("LaTeX-incompatible input and strict mode is set to unrecognized '" + n + "': " + t + " [" + e + "]"), !1));
            }, e;
          }(),
              m = function () {
            function e(e, t, r) {
              this.id = void 0, this.size = void 0, this.cramped = void 0, this.id = e, this.size = t, this.cramped = r;
            }var t = e.prototype;return t.sup = function () {
              return c[u[this.id]];
            }, t.sub = function () {
              return c[d[this.id]];
            }, t.fracNum = function () {
              return c[f[this.id]];
            }, t.fracDen = function () {
              return c[g[this.id]];
            }, t.cramp = function () {
              return c[v[this.id]];
            }, t.text = function () {
              return c[y[this.id]];
            }, t.isTight = function () {
              return 2 <= this.size;
            }, e;
          }(),
              c = [new m(0, 0, !1), new m(1, 0, !0), new m(2, 1, !1), new m(3, 1, !0), new m(4, 2, !1), new m(5, 2, !0), new m(6, 3, !1), new m(7, 3, !0)],
              u = [4, 5, 4, 5, 6, 7, 6, 7],
              d = [5, 5, 5, 5, 7, 7, 7, 7],
              f = [2, 3, 4, 5, 6, 7, 6, 7],
              g = [3, 3, 5, 5, 7, 7, 7, 7],
              v = [1, 1, 3, 3, 5, 5, 7, 7],
              y = [0, 1, 2, 3, 2, 3, 2, 3],
              q = { DISPLAY: c[0], TEXT: c[2], SCRIPT: c[4], SCRIPTSCRIPT: c[6] },
              b = [{ name: "latin", blocks: [[256, 591], [768, 879]] }, { name: "cyrillic", blocks: [[1024, 1279]] }, { name: "brahmic", blocks: [[2304, 4255]] }, { name: "georgian", blocks: [[4256, 4351]] }, { name: "cjk", blocks: [[12288, 12543], [19968, 40879], [65280, 65376]] }, { name: "hangul", blocks: [[44032, 55215]] }];var x = [];function w(e) {
            for (var t = 0; t < x.length; t += 2) {
              if (e >= x[t] && e <= x[t + 1]) return !0;
            }return !1;
          }b.forEach(function (e) {
            return e.blocks.forEach(function (e) {
              return x.push.apply(x, e);
            });
          });var k = { path: { sqrtMain: "M95,702c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,\n-10,-9.5,-14c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54c44.2,-33.3,65.8,\n-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10s173,378,173,378c0.7,0,\n35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429c69,-144,104.5,-217.7,106.5,\n-221c5.3,-9.3,12,-14,20,-14H400000v40H845.2724s-225.272,467,-225.272,467\ns-235,486,-235,486c-2.7,4.7,-9,7,-19,7c-6,0,-10,-1,-12,-3s-194,-422,-194,-422\ns-65,47,-65,47z M834 80H400000v40H845z", sqrtSize1: "M263,681c0.7,0,18,39.7,52,119c34,79.3,68.167,\n158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120c340,-704.7,510.7,-1060.3,512,-1067\nc4.7,-7.3,11,-11,19,-11H40000v40H1012.3s-271.3,567,-271.3,567c-38.7,80.7,-84,\n175,-136,283c-52,108,-89.167,185.3,-111.5,232c-22.3,46.7,-33.8,70.3,-34.5,71\nc-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1s-109,-253,-109,-253c-72.7,-168,-109.3,\n-252,-110,-252c-10.7,8,-22,16.7,-34,26c-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26\ns76,-59,76,-59s76,-60,76,-60z M1001 80H40000v40H1012z", sqrtSize2: "M1001,80H400000v40H1013.1s-83.4,268,-264.1,840c-180.7,\n572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7s-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,\n-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744c-10,12,-21,25,-33,39s-32,39,-32,39\nc-6,-5.3,-15,-14,-27,-26s25,-30,25,-30c26.7,-32.7,52,-63,76,-91s52,-60,52,-60\ns208,722,208,722c56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,\n-658.5c53.7,-170.3,84.5,-266.8,92.5,-289.5c4,-6.7,10,-10,18,-10z\nM1001 80H400000v40H1013z", sqrtSize3: "M424,2478c-1.3,-0.7,-38.5,-172,-111.5,-514c-73,\n-342,-109.8,-513.3,-110.5,-514c0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,\n25c-5.7,9.3,-9.8,16,-12.5,20s-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,\n-13s76,-122,76,-122s77,-121,77,-121s209,968,209,968c0,-2,84.7,-361.7,254,-1079\nc169.3,-717.3,254.7,-1077.7,256,-1081c4,-6.7,10,-10,18,-10H400000v40H1014.6\ns-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185c-2,6,-10,9,-24,9\nc-8,0,-12,-0.7,-12,-2z M1001 80H400000v40H1014z", sqrtSize4: "M473,2793c339.3,-1799.3,509.3,-2700,510,-2702\nc3.3,-7.3,9.3,-11,18,-11H400000v40H1017.7s-90.5,478,-276.2,1466c-185.7,988,\n-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9c-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,\n-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200c0,-1.3,-5.3,8.7,-16,30c-10.7,\n21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26s76,-153,76,-153s77,-151,\n77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,606z\nM1001 80H400000v40H1017z", doubleleftarrow: "M262 157\nl10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3\n 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28\n 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5\nc2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5\n 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87\n-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7\n-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z\nm8 0v40h399730v-40zm0 194v40h399730v-40z", doublerightarrow: "M399738 392l\n-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5\n 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88\n-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68\n-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18\n-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782\nc-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3\n-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z", leftarrow: "M400000 241H110l3-3c68.7-52.7 113.7-120\n 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8\n-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247\nc-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208\n 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3\n 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202\n l-3-3h399890zM100 241v40h399900v-40z", leftbrace: "M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117\n-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7\n 5-6 9-10 13-.7 1-7.3 1-20 1H6z", leftbraceunder: "M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13\n 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688\n 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7\n-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z", leftgroup: "M400000 80\nH435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0\n 435 0h399565z", leftgroupunder: "M400000 262\nH435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219\n 435 219h399565z", leftharpoon: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3\n-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5\n-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7\n-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z", leftharpoonplus: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5\n 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3\n-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7\n-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z\nm0 0v40h400000v-40z", leftharpoondown: "M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333\n 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5\n 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667\n-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z", leftharpoondownplus: "M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12\n 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7\n-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0\nv40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z", lefthook: "M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5\n-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3\n-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21\n 71.5 23h399859zM103 281v-40h399897v40z", leftlinesegment: "M40 281 V428 H0 V94 H40 V241 H400000 v40z\nM40 281 V428 H0 V94 H40 V241 H400000 v40z", leftmapsto: "M40 281 V448H0V74H40V241H400000v40z\nM40 281 V448H0V74H40V241H400000v40z", leftToFrom: "M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23\n-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8\nc28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3\n 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z", longequal: "M0 50 h400000 v40H0z m0 194h40000v40H0z\nM0 50 h400000 v40H0z m0 194h40000v40H0z", midbrace: "M200428 334\nc-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14\n-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7\n 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11\n 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z", midbraceunder: "M199572 214\nc100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14\n 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3\n 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0\n-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z", oiintSize1: "M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6\n-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z\nm368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8\n60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z", oiintSize2: "M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8\n-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z\nm502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2\nc0 110 84 276 504 276s502.4-166 502.4-276z", oiiintSize1: "M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6\n-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z\nm525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0\n85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z", oiiintSize2: "M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8\n-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z\nm770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1\nc0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z", rightarrow: "M0 241v40h399891c-47.3 35.3-84 78-110 128\n-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20\n 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7\n 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85\n-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n 151.7 139 205zm0 0v40h399900v-40z", rightbrace: "M400000 542l\n-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5\ns-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1\nc124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z", rightbraceunder: "M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3\n 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237\n-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z", rightgroup: "M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0\n 3-1 3-3v-38c-76-158-257-219-435-219H0z", rightgroupunder: "M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18\n 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z", rightharpoon: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3\n-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2\n-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58\n 69.2 92 94.5zm0 0v40h399900v-40z", rightharpoonplus: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11\n-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7\n 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z\nm0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z", rightharpoondown: "M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8\n 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5\n-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95\n-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z", rightharpoondownplus: "M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8\n 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3\n 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3\n-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z\nm0-194v40h400000v-40zm0 0v40h400000v-40z", righthook: "M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3\n 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0\n-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21\n 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z", rightlinesegment: "M399960 241 V94 h40 V428 h-40 V281 H0 v-40z\nM399960 241 V94 h40 V428 h-40 V281 H0 v-40z", rightToFrom: "M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23\n 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32\n-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142\n-167z M100 147v40h399900v-40zM0 341v40h399900v-40z", twoheadleftarrow: "M0 167c68 40\n 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69\n-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3\n-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19\n-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101\n 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z", twoheadrightarrow: "M400000 167\nc-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3\n 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42\n 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333\n-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70\n 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z", tilde1: "M200 55.538c-77 0-168 73.953-177 73.953-3 0-7\n-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0\n 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0\n 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128\n-68.267.847-113-73.952-191-73.952z", tilde2: "M344 55.266c-142 0-300.638 81.316-311.5 86.418\n-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9\n 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114\nc1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751\n 181.476 676 181.476c-149 0-189-126.21-332-126.21z", tilde3: "M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457\n-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0\n 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697\n 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696\n -338 0-409-156.573-744-156.573z", tilde4: "M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345\n-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409\n 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9\n 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409\n -175.236-744-175.236z", vec: "M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5\n3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11\n10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63\n-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1\n-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59\nH213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359\nc-16-25.333-24-45-24-59z", widehat1: "M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22\nc-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z", widehat2: "M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z", widehat3: "M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z", widehat4: "M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z", widecheck1: "M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,\n-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z", widecheck2: "M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z", widecheck3: "M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z", widecheck4: "M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z", baraboveleftarrow: "M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202\nc4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5\nc-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130\ns-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47\n121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6\ns2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11\nc0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z\nM100 241v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z", rightarrowabovebar: "M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32\n-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0\n13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39\n-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5\n-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z", baraboveshortleftharpoon: "M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17\nc2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21\nc-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40\nc-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z\nM0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z", rightharpoonaboveshortbar: "M0,241 l0,40c399126,0,399993,0,399993,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z", shortbaraboveleftharpoon: "M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,\n1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,\n-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z\nM93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z", shortrightharpoonabovebar: "M53,241l0,40c398570,0,399437,0,399437,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z" } },
              S = function () {
            function e(e) {
              this.children = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, this.children = e, this.classes = [], this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = {};
            }var t = e.prototype;return t.hasClass = function (e) {
              return Y.contains(this.classes, e);
            }, t.toNode = function () {
              for (var e = document.createDocumentFragment(), t = 0; t < this.children.length; t++) {
                e.appendChild(this.children[t].toNode());
              }return e;
            }, t.toMarkup = function () {
              for (var e = "", t = 0; t < this.children.length; t++) {
                e += this.children[t].toMarkup();
              }return e;
            }, t.toText = function () {
              var e = function e(_e2) {
                return _e2.toText();
              };return this.children.map(e).join("");
            }, e;
          }(),
              z = function z(e) {
            return e.filter(function (e) {
              return e;
            }).join(" ");
          },
              M = function M(e, t, r) {
            if (this.classes = e || [], this.attributes = {}, this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = r || {}, t) {
              t.style.isTight() && this.classes.push("mtight");var n = t.getColor();n && (this.style.color = n);
            }
          },
              T = function T(e) {
            var t = document.createElement(e);for (var r in t.className = z(this.classes), this.style) {
              this.style.hasOwnProperty(r) && (t.style[r] = this.style[r]);
            }for (var n in this.attributes) {
              this.attributes.hasOwnProperty(n) && t.setAttribute(n, this.attributes[n]);
            }for (var i = 0; i < this.children.length; i++) {
              t.appendChild(this.children[i].toNode());
            }return t;
          },
              A = function A(e) {
            var t = "<" + e;this.classes.length && (t += ' class="' + Y.escape(z(this.classes)) + '"');var r = "";for (var n in this.style) {
              this.style.hasOwnProperty(n) && (r += Y.hyphenate(n) + ":" + this.style[n] + ";");
            }for (var i in r && (t += ' style="' + Y.escape(r) + '"'), this.attributes) {
              this.attributes.hasOwnProperty(i) && (t += " " + i + '="' + Y.escape(this.attributes[i]) + '"');
            }t += ">";for (var a = 0; a < this.children.length; a++) {
              t += this.children[a].toMarkup();
            }return t += "</" + e + ">";
          },
              B = function () {
            function e(e, t, r, n) {
              this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.width = void 0, this.maxFontSize = void 0, this.style = void 0, M.call(this, e, r, n), this.children = t || [];
            }var t = e.prototype;return t.setAttribute = function (e, t) {
              this.attributes[e] = t;
            }, t.hasClass = function (e) {
              return Y.contains(this.classes, e);
            }, t.toNode = function () {
              return T.call(this, "span");
            }, t.toMarkup = function () {
              return A.call(this, "span");
            }, e;
          }(),
              C = function () {
            function e(e, t, r, n) {
              this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, M.call(this, t, n), this.children = r || [], this.setAttribute("href", e);
            }var t = e.prototype;return t.setAttribute = function (e, t) {
              this.attributes[e] = t;
            }, t.hasClass = function (e) {
              return Y.contains(this.classes, e);
            }, t.toNode = function () {
              return T.call(this, "a");
            }, t.toMarkup = function () {
              return A.call(this, "a");
            }, e;
          }(),
              N = function () {
            function e(e, t, r) {
              this.src = void 0, this.alt = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, this.alt = t, this.src = e, this.classes = ["mord"], this.style = r;
            }var t = e.prototype;return t.hasClass = function (e) {
              return Y.contains(this.classes, e);
            }, t.toNode = function () {
              var e = document.createElement("img");for (var t in e.src = this.src, e.alt = this.alt, e.className = "mord", this.style) {
                this.style.hasOwnProperty(t) && (e.style[t] = this.style[t]);
              }return e;
            }, t.toMarkup = function () {
              var e = "<img  src='" + this.src + " 'alt='" + this.alt + "' ",
                  t = "";for (var r in this.style) {
                this.style.hasOwnProperty(r) && (t += Y.hyphenate(r) + ":" + this.style[r] + ";");
              }return t && (e += ' style="' + Y.escape(t) + '"'), e += "'/>";
            }, e;
          }(),
              E = { "\xee": '\u0131\u0302', "\xef": '\u0131\u0308', "\xed": '\u0131\u0301', "\xec": '\u0131\u0300' },
              O = function () {
            function e(e, t, r, n, i, a, o, s) {
              this.text = void 0, this.height = void 0, this.depth = void 0, this.italic = void 0, this.skew = void 0, this.width = void 0, this.maxFontSize = void 0, this.classes = void 0, this.style = void 0, this.text = e, this.height = t || 0, this.depth = r || 0, this.italic = n || 0, this.skew = i || 0, this.width = a || 0, this.classes = o || [], this.style = s || {}, this.maxFontSize = 0;var l = function (e) {
                for (var t = 0; t < b.length; t++) {
                  for (var r = b[t], n = 0; n < r.blocks.length; n++) {
                    var i = r.blocks[n];if (e >= i[0] && e <= i[1]) return r.name;
                  }
                }return null;
              }(this.text.charCodeAt(0));l && this.classes.push(l + "_fallback"), /[\xee\xef\xed\xec]/.test(this.text) && (this.text = E[this.text]);
            }var t = e.prototype;return t.hasClass = function (e) {
              return Y.contains(this.classes, e);
            }, t.toNode = function () {
              var e = document.createTextNode(this.text),
                  t = null;for (var r in 0 < this.italic && ((t = document.createElement("span")).style.marginRight = this.italic + "em"), 0 < this.classes.length && ((t = t || document.createElement("span")).className = z(this.classes)), this.style) {
                this.style.hasOwnProperty(r) && ((t = t || document.createElement("span")).style[r] = this.style[r]);
              }return t ? (t.appendChild(e), t) : e;
            }, t.toMarkup = function () {
              var e = !1,
                  t = "<span";this.classes.length && (e = !0, t += ' class="', t += Y.escape(z(this.classes)), t += '"');var r = "";for (var n in 0 < this.italic && (r += "margin-right:" + this.italic + "em;"), this.style) {
                this.style.hasOwnProperty(n) && (r += Y.hyphenate(n) + ":" + this.style[n] + ";");
              }r && (e = !0, t += ' style="' + Y.escape(r) + '"');var i = Y.escape(this.text);return e ? (t += ">", t += i, t += "</span>") : i;
            }, e;
          }(),
              I = function () {
            function e(e, t) {
              this.children = void 0, this.attributes = void 0, this.children = e || [], this.attributes = t || {};
            }var t = e.prototype;return t.toNode = function () {
              var e = document.createElementNS("http://www.w3.org/2000/svg", "svg");for (var t in this.attributes) {
                Object.prototype.hasOwnProperty.call(this.attributes, t) && e.setAttribute(t, this.attributes[t]);
              }for (var r = 0; r < this.children.length; r++) {
                e.appendChild(this.children[r].toNode());
              }return e;
            }, t.toMarkup = function () {
              var e = "<svg";for (var t in this.attributes) {
                Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + "='" + this.attributes[t] + "'");
              }e += ">";for (var r = 0; r < this.children.length; r++) {
                e += this.children[r].toMarkup();
              }return e += "</svg>";
            }, e;
          }(),
              R = function () {
            function e(e, t) {
              this.pathName = void 0, this.alternate = void 0, this.pathName = e, this.alternate = t;
            }var t = e.prototype;return t.toNode = function () {
              var e = document.createElementNS("http://www.w3.org/2000/svg", "path");return this.alternate ? e.setAttribute("d", this.alternate) : e.setAttribute("d", k.path[this.pathName]), e;
            }, t.toMarkup = function () {
              return this.alternate ? "<path d='" + this.alternate + "'/>" : "<path d='" + k.path[this.pathName] + "'/>";
            }, e;
          }(),
              L = function () {
            function e(e) {
              this.attributes = void 0, this.attributes = e || {};
            }var t = e.prototype;return t.toNode = function () {
              var e = document.createElementNS("http://www.w3.org/2000/svg", "line");for (var t in this.attributes) {
                Object.prototype.hasOwnProperty.call(this.attributes, t) && e.setAttribute(t, this.attributes[t]);
              }return e;
            }, t.toMarkup = function () {
              var e = "<line";for (var t in this.attributes) {
                Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + "='" + this.attributes[t] + "'");
              }return e += "/>";
            }, e;
          }();var H = { "AMS-Regular": { 65: [0, .68889, 0, 0, .72222], 66: [0, .68889, 0, 0, .66667], 67: [0, .68889, 0, 0, .72222], 68: [0, .68889, 0, 0, .72222], 69: [0, .68889, 0, 0, .66667], 70: [0, .68889, 0, 0, .61111], 71: [0, .68889, 0, 0, .77778], 72: [0, .68889, 0, 0, .77778], 73: [0, .68889, 0, 0, .38889], 74: [.16667, .68889, 0, 0, .5], 75: [0, .68889, 0, 0, .77778], 76: [0, .68889, 0, 0, .66667], 77: [0, .68889, 0, 0, .94445], 78: [0, .68889, 0, 0, .72222], 79: [.16667, .68889, 0, 0, .77778], 80: [0, .68889, 0, 0, .61111], 81: [.16667, .68889, 0, 0, .77778], 82: [0, .68889, 0, 0, .72222], 83: [0, .68889, 0, 0, .55556], 84: [0, .68889, 0, 0, .66667], 85: [0, .68889, 0, 0, .72222], 86: [0, .68889, 0, 0, .72222], 87: [0, .68889, 0, 0, 1], 88: [0, .68889, 0, 0, .72222], 89: [0, .68889, 0, 0, .72222], 90: [0, .68889, 0, 0, .66667], 107: [0, .68889, 0, 0, .55556], 165: [0, .675, .025, 0, .75], 174: [.15559, .69224, 0, 0, .94666], 240: [0, .68889, 0, 0, .55556], 295: [0, .68889, 0, 0, .54028], 710: [0, .825, 0, 0, 2.33334], 732: [0, .9, 0, 0, 2.33334], 770: [0, .825, 0, 0, 2.33334], 771: [0, .9, 0, 0, 2.33334], 989: [.08167, .58167, 0, 0, .77778], 1008: [0, .43056, .04028, 0, .66667], 8245: [0, .54986, 0, 0, .275], 8463: [0, .68889, 0, 0, .54028], 8487: [0, .68889, 0, 0, .72222], 8498: [0, .68889, 0, 0, .55556], 8502: [0, .68889, 0, 0, .66667], 8503: [0, .68889, 0, 0, .44445], 8504: [0, .68889, 0, 0, .66667], 8513: [0, .68889, 0, 0, .63889], 8592: [-.03598, .46402, 0, 0, .5], 8594: [-.03598, .46402, 0, 0, .5], 8602: [-.13313, .36687, 0, 0, 1], 8603: [-.13313, .36687, 0, 0, 1], 8606: [.01354, .52239, 0, 0, 1], 8608: [.01354, .52239, 0, 0, 1], 8610: [.01354, .52239, 0, 0, 1.11111], 8611: [.01354, .52239, 0, 0, 1.11111], 8619: [0, .54986, 0, 0, 1], 8620: [0, .54986, 0, 0, 1], 8621: [-.13313, .37788, 0, 0, 1.38889], 8622: [-.13313, .36687, 0, 0, 1], 8624: [0, .69224, 0, 0, .5], 8625: [0, .69224, 0, 0, .5], 8630: [0, .43056, 0, 0, 1], 8631: [0, .43056, 0, 0, 1], 8634: [.08198, .58198, 0, 0, .77778], 8635: [.08198, .58198, 0, 0, .77778], 8638: [.19444, .69224, 0, 0, .41667], 8639: [.19444, .69224, 0, 0, .41667], 8642: [.19444, .69224, 0, 0, .41667], 8643: [.19444, .69224, 0, 0, .41667], 8644: [.1808, .675, 0, 0, 1], 8646: [.1808, .675, 0, 0, 1], 8647: [.1808, .675, 0, 0, 1], 8648: [.19444, .69224, 0, 0, .83334], 8649: [.1808, .675, 0, 0, 1], 8650: [.19444, .69224, 0, 0, .83334], 8651: [.01354, .52239, 0, 0, 1], 8652: [.01354, .52239, 0, 0, 1], 8653: [-.13313, .36687, 0, 0, 1], 8654: [-.13313, .36687, 0, 0, 1], 8655: [-.13313, .36687, 0, 0, 1], 8666: [.13667, .63667, 0, 0, 1], 8667: [.13667, .63667, 0, 0, 1], 8669: [-.13313, .37788, 0, 0, 1], 8672: [-.064, .437, 0, 0, 1.334], 8674: [-.064, .437, 0, 0, 1.334], 8705: [0, .825, 0, 0, .5], 8708: [0, .68889, 0, 0, .55556], 8709: [.08167, .58167, 0, 0, .77778], 8717: [0, .43056, 0, 0, .42917], 8722: [-.03598, .46402, 0, 0, .5], 8724: [.08198, .69224, 0, 0, .77778], 8726: [.08167, .58167, 0, 0, .77778], 8733: [0, .69224, 0, 0, .77778], 8736: [0, .69224, 0, 0, .72222], 8737: [0, .69224, 0, 0, .72222], 8738: [.03517, .52239, 0, 0, .72222], 8739: [.08167, .58167, 0, 0, .22222], 8740: [.25142, .74111, 0, 0, .27778], 8741: [.08167, .58167, 0, 0, .38889], 8742: [.25142, .74111, 0, 0, .5], 8756: [0, .69224, 0, 0, .66667], 8757: [0, .69224, 0, 0, .66667], 8764: [-.13313, .36687, 0, 0, .77778], 8765: [-.13313, .37788, 0, 0, .77778], 8769: [-.13313, .36687, 0, 0, .77778], 8770: [-.03625, .46375, 0, 0, .77778], 8774: [.30274, .79383, 0, 0, .77778], 8776: [-.01688, .48312, 0, 0, .77778], 8778: [.08167, .58167, 0, 0, .77778], 8782: [.06062, .54986, 0, 0, .77778], 8783: [.06062, .54986, 0, 0, .77778], 8785: [.08198, .58198, 0, 0, .77778], 8786: [.08198, .58198, 0, 0, .77778], 8787: [.08198, .58198, 0, 0, .77778], 8790: [0, .69224, 0, 0, .77778], 8791: [.22958, .72958, 0, 0, .77778], 8796: [.08198, .91667, 0, 0, .77778], 8806: [.25583, .75583, 0, 0, .77778], 8807: [.25583, .75583, 0, 0, .77778], 8808: [.25142, .75726, 0, 0, .77778], 8809: [.25142, .75726, 0, 0, .77778], 8812: [.25583, .75583, 0, 0, .5], 8814: [.20576, .70576, 0, 0, .77778], 8815: [.20576, .70576, 0, 0, .77778], 8816: [.30274, .79383, 0, 0, .77778], 8817: [.30274, .79383, 0, 0, .77778], 8818: [.22958, .72958, 0, 0, .77778], 8819: [.22958, .72958, 0, 0, .77778], 8822: [.1808, .675, 0, 0, .77778], 8823: [.1808, .675, 0, 0, .77778], 8828: [.13667, .63667, 0, 0, .77778], 8829: [.13667, .63667, 0, 0, .77778], 8830: [.22958, .72958, 0, 0, .77778], 8831: [.22958, .72958, 0, 0, .77778], 8832: [.20576, .70576, 0, 0, .77778], 8833: [.20576, .70576, 0, 0, .77778], 8840: [.30274, .79383, 0, 0, .77778], 8841: [.30274, .79383, 0, 0, .77778], 8842: [.13597, .63597, 0, 0, .77778], 8843: [.13597, .63597, 0, 0, .77778], 8847: [.03517, .54986, 0, 0, .77778], 8848: [.03517, .54986, 0, 0, .77778], 8858: [.08198, .58198, 0, 0, .77778], 8859: [.08198, .58198, 0, 0, .77778], 8861: [.08198, .58198, 0, 0, .77778], 8862: [0, .675, 0, 0, .77778], 8863: [0, .675, 0, 0, .77778], 8864: [0, .675, 0, 0, .77778], 8865: [0, .675, 0, 0, .77778], 8872: [0, .69224, 0, 0, .61111], 8873: [0, .69224, 0, 0, .72222], 8874: [0, .69224, 0, 0, .88889], 8876: [0, .68889, 0, 0, .61111], 8877: [0, .68889, 0, 0, .61111], 8878: [0, .68889, 0, 0, .72222], 8879: [0, .68889, 0, 0, .72222], 8882: [.03517, .54986, 0, 0, .77778], 8883: [.03517, .54986, 0, 0, .77778], 8884: [.13667, .63667, 0, 0, .77778], 8885: [.13667, .63667, 0, 0, .77778], 8888: [0, .54986, 0, 0, 1.11111], 8890: [.19444, .43056, 0, 0, .55556], 8891: [.19444, .69224, 0, 0, .61111], 8892: [.19444, .69224, 0, 0, .61111], 8901: [0, .54986, 0, 0, .27778], 8903: [.08167, .58167, 0, 0, .77778], 8905: [.08167, .58167, 0, 0, .77778], 8906: [.08167, .58167, 0, 0, .77778], 8907: [0, .69224, 0, 0, .77778], 8908: [0, .69224, 0, 0, .77778], 8909: [-.03598, .46402, 0, 0, .77778], 8910: [0, .54986, 0, 0, .76042], 8911: [0, .54986, 0, 0, .76042], 8912: [.03517, .54986, 0, 0, .77778], 8913: [.03517, .54986, 0, 0, .77778], 8914: [0, .54986, 0, 0, .66667], 8915: [0, .54986, 0, 0, .66667], 8916: [0, .69224, 0, 0, .66667], 8918: [.0391, .5391, 0, 0, .77778], 8919: [.0391, .5391, 0, 0, .77778], 8920: [.03517, .54986, 0, 0, 1.33334], 8921: [.03517, .54986, 0, 0, 1.33334], 8922: [.38569, .88569, 0, 0, .77778], 8923: [.38569, .88569, 0, 0, .77778], 8926: [.13667, .63667, 0, 0, .77778], 8927: [.13667, .63667, 0, 0, .77778], 8928: [.30274, .79383, 0, 0, .77778], 8929: [.30274, .79383, 0, 0, .77778], 8934: [.23222, .74111, 0, 0, .77778], 8935: [.23222, .74111, 0, 0, .77778], 8936: [.23222, .74111, 0, 0, .77778], 8937: [.23222, .74111, 0, 0, .77778], 8938: [.20576, .70576, 0, 0, .77778], 8939: [.20576, .70576, 0, 0, .77778], 8940: [.30274, .79383, 0, 0, .77778], 8941: [.30274, .79383, 0, 0, .77778], 8994: [.19444, .69224, 0, 0, .77778], 8995: [.19444, .69224, 0, 0, .77778], 9416: [.15559, .69224, 0, 0, .90222], 9484: [0, .69224, 0, 0, .5], 9488: [0, .69224, 0, 0, .5], 9492: [0, .37788, 0, 0, .5], 9496: [0, .37788, 0, 0, .5], 9585: [.19444, .68889, 0, 0, .88889], 9586: [.19444, .74111, 0, 0, .88889], 9632: [0, .675, 0, 0, .77778], 9633: [0, .675, 0, 0, .77778], 9650: [0, .54986, 0, 0, .72222], 9651: [0, .54986, 0, 0, .72222], 9654: [.03517, .54986, 0, 0, .77778], 9660: [0, .54986, 0, 0, .72222], 9661: [0, .54986, 0, 0, .72222], 9664: [.03517, .54986, 0, 0, .77778], 9674: [.11111, .69224, 0, 0, .66667], 9733: [.19444, .69224, 0, 0, .94445], 10003: [0, .69224, 0, 0, .83334], 10016: [0, .69224, 0, 0, .83334], 10731: [.11111, .69224, 0, 0, .66667], 10846: [.19444, .75583, 0, 0, .61111], 10877: [.13667, .63667, 0, 0, .77778], 10878: [.13667, .63667, 0, 0, .77778], 10885: [.25583, .75583, 0, 0, .77778], 10886: [.25583, .75583, 0, 0, .77778], 10887: [.13597, .63597, 0, 0, .77778], 10888: [.13597, .63597, 0, 0, .77778], 10889: [.26167, .75726, 0, 0, .77778], 10890: [.26167, .75726, 0, 0, .77778], 10891: [.48256, .98256, 0, 0, .77778], 10892: [.48256, .98256, 0, 0, .77778], 10901: [.13667, .63667, 0, 0, .77778], 10902: [.13667, .63667, 0, 0, .77778], 10933: [.25142, .75726, 0, 0, .77778], 10934: [.25142, .75726, 0, 0, .77778], 10935: [.26167, .75726, 0, 0, .77778], 10936: [.26167, .75726, 0, 0, .77778], 10937: [.26167, .75726, 0, 0, .77778], 10938: [.26167, .75726, 0, 0, .77778], 10949: [.25583, .75583, 0, 0, .77778], 10950: [.25583, .75583, 0, 0, .77778], 10955: [.28481, .79383, 0, 0, .77778], 10956: [.28481, .79383, 0, 0, .77778], 57350: [.08167, .58167, 0, 0, .22222], 57351: [.08167, .58167, 0, 0, .38889], 57352: [.08167, .58167, 0, 0, .77778], 57353: [0, .43056, .04028, 0, .66667], 57356: [.25142, .75726, 0, 0, .77778], 57357: [.25142, .75726, 0, 0, .77778], 57358: [.41951, .91951, 0, 0, .77778], 57359: [.30274, .79383, 0, 0, .77778], 57360: [.30274, .79383, 0, 0, .77778], 57361: [.41951, .91951, 0, 0, .77778], 57366: [.25142, .75726, 0, 0, .77778], 57367: [.25142, .75726, 0, 0, .77778], 57368: [.25142, .75726, 0, 0, .77778], 57369: [.25142, .75726, 0, 0, .77778], 57370: [.13597, .63597, 0, 0, .77778], 57371: [.13597, .63597, 0, 0, .77778] }, "Caligraphic-Regular": { 48: [0, .43056, 0, 0, .5], 49: [0, .43056, 0, 0, .5], 50: [0, .43056, 0, 0, .5], 51: [.19444, .43056, 0, 0, .5], 52: [.19444, .43056, 0, 0, .5], 53: [.19444, .43056, 0, 0, .5], 54: [0, .64444, 0, 0, .5], 55: [.19444, .43056, 0, 0, .5], 56: [0, .64444, 0, 0, .5], 57: [.19444, .43056, 0, 0, .5], 65: [0, .68333, 0, .19445, .79847], 66: [0, .68333, .03041, .13889, .65681], 67: [0, .68333, .05834, .13889, .52653], 68: [0, .68333, .02778, .08334, .77139], 69: [0, .68333, .08944, .11111, .52778], 70: [0, .68333, .09931, .11111, .71875], 71: [.09722, .68333, .0593, .11111, .59487], 72: [0, .68333, .00965, .11111, .84452], 73: [0, .68333, .07382, 0, .54452], 74: [.09722, .68333, .18472, .16667, .67778], 75: [0, .68333, .01445, .05556, .76195], 76: [0, .68333, 0, .13889, .68972], 77: [0, .68333, 0, .13889, 1.2009], 78: [0, .68333, .14736, .08334, .82049], 79: [0, .68333, .02778, .11111, .79611], 80: [0, .68333, .08222, .08334, .69556], 81: [.09722, .68333, 0, .11111, .81667], 82: [0, .68333, 0, .08334, .8475], 83: [0, .68333, .075, .13889, .60556], 84: [0, .68333, .25417, 0, .54464], 85: [0, .68333, .09931, .08334, .62583], 86: [0, .68333, .08222, 0, .61278], 87: [0, .68333, .08222, .08334, .98778], 88: [0, .68333, .14643, .13889, .7133], 89: [.09722, .68333, .08222, .08334, .66834], 90: [0, .68333, .07944, .13889, .72473] }, "Fraktur-Regular": { 33: [0, .69141, 0, 0, .29574], 34: [0, .69141, 0, 0, .21471], 38: [0, .69141, 0, 0, .73786], 39: [0, .69141, 0, 0, .21201], 40: [.24982, .74947, 0, 0, .38865], 41: [.24982, .74947, 0, 0, .38865], 42: [0, .62119, 0, 0, .27764], 43: [.08319, .58283, 0, 0, .75623], 44: [0, .10803, 0, 0, .27764], 45: [.08319, .58283, 0, 0, .75623], 46: [0, .10803, 0, 0, .27764], 47: [.24982, .74947, 0, 0, .50181], 48: [0, .47534, 0, 0, .50181], 49: [0, .47534, 0, 0, .50181], 50: [0, .47534, 0, 0, .50181], 51: [.18906, .47534, 0, 0, .50181], 52: [.18906, .47534, 0, 0, .50181], 53: [.18906, .47534, 0, 0, .50181], 54: [0, .69141, 0, 0, .50181], 55: [.18906, .47534, 0, 0, .50181], 56: [0, .69141, 0, 0, .50181], 57: [.18906, .47534, 0, 0, .50181], 58: [0, .47534, 0, 0, .21606], 59: [.12604, .47534, 0, 0, .21606], 61: [-.13099, .36866, 0, 0, .75623], 63: [0, .69141, 0, 0, .36245], 65: [0, .69141, 0, 0, .7176], 66: [0, .69141, 0, 0, .88397], 67: [0, .69141, 0, 0, .61254], 68: [0, .69141, 0, 0, .83158], 69: [0, .69141, 0, 0, .66278], 70: [.12604, .69141, 0, 0, .61119], 71: [0, .69141, 0, 0, .78539], 72: [.06302, .69141, 0, 0, .7203], 73: [0, .69141, 0, 0, .55448], 74: [.12604, .69141, 0, 0, .55231], 75: [0, .69141, 0, 0, .66845], 76: [0, .69141, 0, 0, .66602], 77: [0, .69141, 0, 0, 1.04953], 78: [0, .69141, 0, 0, .83212], 79: [0, .69141, 0, 0, .82699], 80: [.18906, .69141, 0, 0, .82753], 81: [.03781, .69141, 0, 0, .82699], 82: [0, .69141, 0, 0, .82807], 83: [0, .69141, 0, 0, .82861], 84: [0, .69141, 0, 0, .66899], 85: [0, .69141, 0, 0, .64576], 86: [0, .69141, 0, 0, .83131], 87: [0, .69141, 0, 0, 1.04602], 88: [0, .69141, 0, 0, .71922], 89: [.18906, .69141, 0, 0, .83293], 90: [.12604, .69141, 0, 0, .60201], 91: [.24982, .74947, 0, 0, .27764], 93: [.24982, .74947, 0, 0, .27764], 94: [0, .69141, 0, 0, .49965], 97: [0, .47534, 0, 0, .50046], 98: [0, .69141, 0, 0, .51315], 99: [0, .47534, 0, 0, .38946], 100: [0, .62119, 0, 0, .49857], 101: [0, .47534, 0, 0, .40053], 102: [.18906, .69141, 0, 0, .32626], 103: [.18906, .47534, 0, 0, .5037], 104: [.18906, .69141, 0, 0, .52126], 105: [0, .69141, 0, 0, .27899], 106: [0, .69141, 0, 0, .28088], 107: [0, .69141, 0, 0, .38946], 108: [0, .69141, 0, 0, .27953], 109: [0, .47534, 0, 0, .76676], 110: [0, .47534, 0, 0, .52666], 111: [0, .47534, 0, 0, .48885], 112: [.18906, .52396, 0, 0, .50046], 113: [.18906, .47534, 0, 0, .48912], 114: [0, .47534, 0, 0, .38919], 115: [0, .47534, 0, 0, .44266], 116: [0, .62119, 0, 0, .33301], 117: [0, .47534, 0, 0, .5172], 118: [0, .52396, 0, 0, .5118], 119: [0, .52396, 0, 0, .77351], 120: [.18906, .47534, 0, 0, .38865], 121: [.18906, .47534, 0, 0, .49884], 122: [.18906, .47534, 0, 0, .39054], 8216: [0, .69141, 0, 0, .21471], 8217: [0, .69141, 0, 0, .21471], 58112: [0, .62119, 0, 0, .49749], 58113: [0, .62119, 0, 0, .4983], 58114: [.18906, .69141, 0, 0, .33328], 58115: [.18906, .69141, 0, 0, .32923], 58116: [.18906, .47534, 0, 0, .50343], 58117: [0, .69141, 0, 0, .33301], 58118: [0, .62119, 0, 0, .33409], 58119: [0, .47534, 0, 0, .50073] }, "Main-Bold": { 33: [0, .69444, 0, 0, .35], 34: [0, .69444, 0, 0, .60278], 35: [.19444, .69444, 0, 0, .95833], 36: [.05556, .75, 0, 0, .575], 37: [.05556, .75, 0, 0, .95833], 38: [0, .69444, 0, 0, .89444], 39: [0, .69444, 0, 0, .31944], 40: [.25, .75, 0, 0, .44722], 41: [.25, .75, 0, 0, .44722], 42: [0, .75, 0, 0, .575], 43: [.13333, .63333, 0, 0, .89444], 44: [.19444, .15556, 0, 0, .31944], 45: [0, .44444, 0, 0, .38333], 46: [0, .15556, 0, 0, .31944], 47: [.25, .75, 0, 0, .575], 48: [0, .64444, 0, 0, .575], 49: [0, .64444, 0, 0, .575], 50: [0, .64444, 0, 0, .575], 51: [0, .64444, 0, 0, .575], 52: [0, .64444, 0, 0, .575], 53: [0, .64444, 0, 0, .575], 54: [0, .64444, 0, 0, .575], 55: [0, .64444, 0, 0, .575], 56: [0, .64444, 0, 0, .575], 57: [0, .64444, 0, 0, .575], 58: [0, .44444, 0, 0, .31944], 59: [.19444, .44444, 0, 0, .31944], 60: [.08556, .58556, 0, 0, .89444], 61: [-.10889, .39111, 0, 0, .89444], 62: [.08556, .58556, 0, 0, .89444], 63: [0, .69444, 0, 0, .54305], 64: [0, .69444, 0, 0, .89444], 65: [0, .68611, 0, 0, .86944], 66: [0, .68611, 0, 0, .81805], 67: [0, .68611, 0, 0, .83055], 68: [0, .68611, 0, 0, .88194], 69: [0, .68611, 0, 0, .75555], 70: [0, .68611, 0, 0, .72361], 71: [0, .68611, 0, 0, .90416], 72: [0, .68611, 0, 0, .9], 73: [0, .68611, 0, 0, .43611], 74: [0, .68611, 0, 0, .59444], 75: [0, .68611, 0, 0, .90138], 76: [0, .68611, 0, 0, .69166], 77: [0, .68611, 0, 0, 1.09166], 78: [0, .68611, 0, 0, .9], 79: [0, .68611, 0, 0, .86388], 80: [0, .68611, 0, 0, .78611], 81: [.19444, .68611, 0, 0, .86388], 82: [0, .68611, 0, 0, .8625], 83: [0, .68611, 0, 0, .63889], 84: [0, .68611, 0, 0, .8], 85: [0, .68611, 0, 0, .88472], 86: [0, .68611, .01597, 0, .86944], 87: [0, .68611, .01597, 0, 1.18888], 88: [0, .68611, 0, 0, .86944], 89: [0, .68611, .02875, 0, .86944], 90: [0, .68611, 0, 0, .70277], 91: [.25, .75, 0, 0, .31944], 92: [.25, .75, 0, 0, .575], 93: [.25, .75, 0, 0, .31944], 94: [0, .69444, 0, 0, .575], 95: [.31, .13444, .03194, 0, .575], 97: [0, .44444, 0, 0, .55902], 98: [0, .69444, 0, 0, .63889], 99: [0, .44444, 0, 0, .51111], 100: [0, .69444, 0, 0, .63889], 101: [0, .44444, 0, 0, .52708], 102: [0, .69444, .10903, 0, .35139], 103: [.19444, .44444, .01597, 0, .575], 104: [0, .69444, 0, 0, .63889], 105: [0, .69444, 0, 0, .31944], 106: [.19444, .69444, 0, 0, .35139], 107: [0, .69444, 0, 0, .60694], 108: [0, .69444, 0, 0, .31944], 109: [0, .44444, 0, 0, .95833], 110: [0, .44444, 0, 0, .63889], 111: [0, .44444, 0, 0, .575], 112: [.19444, .44444, 0, 0, .63889], 113: [.19444, .44444, 0, 0, .60694], 114: [0, .44444, 0, 0, .47361], 115: [0, .44444, 0, 0, .45361], 116: [0, .63492, 0, 0, .44722], 117: [0, .44444, 0, 0, .63889], 118: [0, .44444, .01597, 0, .60694], 119: [0, .44444, .01597, 0, .83055], 120: [0, .44444, 0, 0, .60694], 121: [.19444, .44444, .01597, 0, .60694], 122: [0, .44444, 0, 0, .51111], 123: [.25, .75, 0, 0, .575], 124: [.25, .75, 0, 0, .31944], 125: [.25, .75, 0, 0, .575], 126: [.35, .34444, 0, 0, .575], 168: [0, .69444, 0, 0, .575], 172: [0, .44444, 0, 0, .76666], 176: [0, .69444, 0, 0, .86944], 177: [.13333, .63333, 0, 0, .89444], 184: [.17014, 0, 0, 0, .51111], 198: [0, .68611, 0, 0, 1.04166], 215: [.13333, .63333, 0, 0, .89444], 216: [.04861, .73472, 0, 0, .89444], 223: [0, .69444, 0, 0, .59722], 230: [0, .44444, 0, 0, .83055], 247: [.13333, .63333, 0, 0, .89444], 248: [.09722, .54167, 0, 0, .575], 305: [0, .44444, 0, 0, .31944], 338: [0, .68611, 0, 0, 1.16944], 339: [0, .44444, 0, 0, .89444], 567: [.19444, .44444, 0, 0, .35139], 710: [0, .69444, 0, 0, .575], 711: [0, .63194, 0, 0, .575], 713: [0, .59611, 0, 0, .575], 714: [0, .69444, 0, 0, .575], 715: [0, .69444, 0, 0, .575], 728: [0, .69444, 0, 0, .575], 729: [0, .69444, 0, 0, .31944], 730: [0, .69444, 0, 0, .86944], 732: [0, .69444, 0, 0, .575], 733: [0, .69444, 0, 0, .575], 824: [.19444, .69444, 0, 0, 0], 915: [0, .68611, 0, 0, .69166], 916: [0, .68611, 0, 0, .95833], 920: [0, .68611, 0, 0, .89444], 923: [0, .68611, 0, 0, .80555], 926: [0, .68611, 0, 0, .76666], 928: [0, .68611, 0, 0, .9], 931: [0, .68611, 0, 0, .83055], 933: [0, .68611, 0, 0, .89444], 934: [0, .68611, 0, 0, .83055], 936: [0, .68611, 0, 0, .89444], 937: [0, .68611, 0, 0, .83055], 8211: [0, .44444, .03194, 0, .575], 8212: [0, .44444, .03194, 0, 1.14999], 8216: [0, .69444, 0, 0, .31944], 8217: [0, .69444, 0, 0, .31944], 8220: [0, .69444, 0, 0, .60278], 8221: [0, .69444, 0, 0, .60278], 8224: [.19444, .69444, 0, 0, .51111], 8225: [.19444, .69444, 0, 0, .51111], 8242: [0, .55556, 0, 0, .34444], 8407: [0, .72444, .15486, 0, .575], 8463: [0, .69444, 0, 0, .66759], 8465: [0, .69444, 0, 0, .83055], 8467: [0, .69444, 0, 0, .47361], 8472: [.19444, .44444, 0, 0, .74027], 8476: [0, .69444, 0, 0, .83055], 8501: [0, .69444, 0, 0, .70277], 8592: [-.10889, .39111, 0, 0, 1.14999], 8593: [.19444, .69444, 0, 0, .575], 8594: [-.10889, .39111, 0, 0, 1.14999], 8595: [.19444, .69444, 0, 0, .575], 8596: [-.10889, .39111, 0, 0, 1.14999], 8597: [.25, .75, 0, 0, .575], 8598: [.19444, .69444, 0, 0, 1.14999], 8599: [.19444, .69444, 0, 0, 1.14999], 8600: [.19444, .69444, 0, 0, 1.14999], 8601: [.19444, .69444, 0, 0, 1.14999], 8636: [-.10889, .39111, 0, 0, 1.14999], 8637: [-.10889, .39111, 0, 0, 1.14999], 8640: [-.10889, .39111, 0, 0, 1.14999], 8641: [-.10889, .39111, 0, 0, 1.14999], 8656: [-.10889, .39111, 0, 0, 1.14999], 8657: [.19444, .69444, 0, 0, .70277], 8658: [-.10889, .39111, 0, 0, 1.14999], 8659: [.19444, .69444, 0, 0, .70277], 8660: [-.10889, .39111, 0, 0, 1.14999], 8661: [.25, .75, 0, 0, .70277], 8704: [0, .69444, 0, 0, .63889], 8706: [0, .69444, .06389, 0, .62847], 8707: [0, .69444, 0, 0, .63889], 8709: [.05556, .75, 0, 0, .575], 8711: [0, .68611, 0, 0, .95833], 8712: [.08556, .58556, 0, 0, .76666], 8715: [.08556, .58556, 0, 0, .76666], 8722: [.13333, .63333, 0, 0, .89444], 8723: [.13333, .63333, 0, 0, .89444], 8725: [.25, .75, 0, 0, .575], 8726: [.25, .75, 0, 0, .575], 8727: [-.02778, .47222, 0, 0, .575], 8728: [-.02639, .47361, 0, 0, .575], 8729: [-.02639, .47361, 0, 0, .575], 8730: [.18, .82, 0, 0, .95833], 8733: [0, .44444, 0, 0, .89444], 8734: [0, .44444, 0, 0, 1.14999], 8736: [0, .69224, 0, 0, .72222], 8739: [.25, .75, 0, 0, .31944], 8741: [.25, .75, 0, 0, .575], 8743: [0, .55556, 0, 0, .76666], 8744: [0, .55556, 0, 0, .76666], 8745: [0, .55556, 0, 0, .76666], 8746: [0, .55556, 0, 0, .76666], 8747: [.19444, .69444, .12778, 0, .56875], 8764: [-.10889, .39111, 0, 0, .89444], 8768: [.19444, .69444, 0, 0, .31944], 8771: [.00222, .50222, 0, 0, .89444], 8776: [.02444, .52444, 0, 0, .89444], 8781: [.00222, .50222, 0, 0, .89444], 8801: [.00222, .50222, 0, 0, .89444], 8804: [.19667, .69667, 0, 0, .89444], 8805: [.19667, .69667, 0, 0, .89444], 8810: [.08556, .58556, 0, 0, 1.14999], 8811: [.08556, .58556, 0, 0, 1.14999], 8826: [.08556, .58556, 0, 0, .89444], 8827: [.08556, .58556, 0, 0, .89444], 8834: [.08556, .58556, 0, 0, .89444], 8835: [.08556, .58556, 0, 0, .89444], 8838: [.19667, .69667, 0, 0, .89444], 8839: [.19667, .69667, 0, 0, .89444], 8846: [0, .55556, 0, 0, .76666], 8849: [.19667, .69667, 0, 0, .89444], 8850: [.19667, .69667, 0, 0, .89444], 8851: [0, .55556, 0, 0, .76666], 8852: [0, .55556, 0, 0, .76666], 8853: [.13333, .63333, 0, 0, .89444], 8854: [.13333, .63333, 0, 0, .89444], 8855: [.13333, .63333, 0, 0, .89444], 8856: [.13333, .63333, 0, 0, .89444], 8857: [.13333, .63333, 0, 0, .89444], 8866: [0, .69444, 0, 0, .70277], 8867: [0, .69444, 0, 0, .70277], 8868: [0, .69444, 0, 0, .89444], 8869: [0, .69444, 0, 0, .89444], 8900: [-.02639, .47361, 0, 0, .575], 8901: [-.02639, .47361, 0, 0, .31944], 8902: [-.02778, .47222, 0, 0, .575], 8968: [.25, .75, 0, 0, .51111], 8969: [.25, .75, 0, 0, .51111], 8970: [.25, .75, 0, 0, .51111], 8971: [.25, .75, 0, 0, .51111], 8994: [-.13889, .36111, 0, 0, 1.14999], 8995: [-.13889, .36111, 0, 0, 1.14999], 9651: [.19444, .69444, 0, 0, 1.02222], 9657: [-.02778, .47222, 0, 0, .575], 9661: [.19444, .69444, 0, 0, 1.02222], 9667: [-.02778, .47222, 0, 0, .575], 9711: [.19444, .69444, 0, 0, 1.14999], 9824: [.12963, .69444, 0, 0, .89444], 9825: [.12963, .69444, 0, 0, .89444], 9826: [.12963, .69444, 0, 0, .89444], 9827: [.12963, .69444, 0, 0, .89444], 9837: [0, .75, 0, 0, .44722], 9838: [.19444, .69444, 0, 0, .44722], 9839: [.19444, .69444, 0, 0, .44722], 10216: [.25, .75, 0, 0, .44722], 10217: [.25, .75, 0, 0, .44722], 10815: [0, .68611, 0, 0, .9], 10927: [.19667, .69667, 0, 0, .89444], 10928: [.19667, .69667, 0, 0, .89444] }, "Main-BoldItalic": { 33: [0, .69444, .11417, 0, .38611], 34: [0, .69444, .07939, 0, .62055], 35: [.19444, .69444, .06833, 0, .94444], 37: [.05556, .75, .12861, 0, .94444], 38: [0, .69444, .08528, 0, .88555], 39: [0, .69444, .12945, 0, .35555], 40: [.25, .75, .15806, 0, .47333], 41: [.25, .75, .03306, 0, .47333], 42: [0, .75, .14333, 0, .59111], 43: [.10333, .60333, .03306, 0, .88555], 44: [.19444, .14722, 0, 0, .35555], 45: [0, .44444, .02611, 0, .41444], 46: [0, .14722, 0, 0, .35555], 47: [.25, .75, .15806, 0, .59111], 48: [0, .64444, .13167, 0, .59111], 49: [0, .64444, .13167, 0, .59111], 50: [0, .64444, .13167, 0, .59111], 51: [0, .64444, .13167, 0, .59111], 52: [.19444, .64444, .13167, 0, .59111], 53: [0, .64444, .13167, 0, .59111], 54: [0, .64444, .13167, 0, .59111], 55: [.19444, .64444, .13167, 0, .59111], 56: [0, .64444, .13167, 0, .59111], 57: [0, .64444, .13167, 0, .59111], 58: [0, .44444, .06695, 0, .35555], 59: [.19444, .44444, .06695, 0, .35555], 61: [-.10889, .39111, .06833, 0, .88555], 63: [0, .69444, .11472, 0, .59111], 64: [0, .69444, .09208, 0, .88555], 65: [0, .68611, 0, 0, .86555], 66: [0, .68611, .0992, 0, .81666], 67: [0, .68611, .14208, 0, .82666], 68: [0, .68611, .09062, 0, .87555], 69: [0, .68611, .11431, 0, .75666], 70: [0, .68611, .12903, 0, .72722], 71: [0, .68611, .07347, 0, .89527], 72: [0, .68611, .17208, 0, .8961], 73: [0, .68611, .15681, 0, .47166], 74: [0, .68611, .145, 0, .61055], 75: [0, .68611, .14208, 0, .89499], 76: [0, .68611, 0, 0, .69777], 77: [0, .68611, .17208, 0, 1.07277], 78: [0, .68611, .17208, 0, .8961], 79: [0, .68611, .09062, 0, .85499], 80: [0, .68611, .0992, 0, .78721], 81: [.19444, .68611, .09062, 0, .85499], 82: [0, .68611, .02559, 0, .85944], 83: [0, .68611, .11264, 0, .64999], 84: [0, .68611, .12903, 0, .7961], 85: [0, .68611, .17208, 0, .88083], 86: [0, .68611, .18625, 0, .86555], 87: [0, .68611, .18625, 0, 1.15999], 88: [0, .68611, .15681, 0, .86555], 89: [0, .68611, .19803, 0, .86555], 90: [0, .68611, .14208, 0, .70888], 91: [.25, .75, .1875, 0, .35611], 93: [.25, .75, .09972, 0, .35611], 94: [0, .69444, .06709, 0, .59111], 95: [.31, .13444, .09811, 0, .59111], 97: [0, .44444, .09426, 0, .59111], 98: [0, .69444, .07861, 0, .53222], 99: [0, .44444, .05222, 0, .53222], 100: [0, .69444, .10861, 0, .59111], 101: [0, .44444, .085, 0, .53222], 102: [.19444, .69444, .21778, 0, .4], 103: [.19444, .44444, .105, 0, .53222], 104: [0, .69444, .09426, 0, .59111], 105: [0, .69326, .11387, 0, .35555], 106: [.19444, .69326, .1672, 0, .35555], 107: [0, .69444, .11111, 0, .53222], 108: [0, .69444, .10861, 0, .29666], 109: [0, .44444, .09426, 0, .94444], 110: [0, .44444, .09426, 0, .64999], 111: [0, .44444, .07861, 0, .59111], 112: [.19444, .44444, .07861, 0, .59111], 113: [.19444, .44444, .105, 0, .53222], 114: [0, .44444, .11111, 0, .50167], 115: [0, .44444, .08167, 0, .48694], 116: [0, .63492, .09639, 0, .385], 117: [0, .44444, .09426, 0, .62055], 118: [0, .44444, .11111, 0, .53222], 119: [0, .44444, .11111, 0, .76777], 120: [0, .44444, .12583, 0, .56055], 121: [.19444, .44444, .105, 0, .56166], 122: [0, .44444, .13889, 0, .49055], 126: [.35, .34444, .11472, 0, .59111], 163: [0, .69444, 0, 0, .86853], 168: [0, .69444, .11473, 0, .59111], 176: [0, .69444, 0, 0, .94888], 184: [.17014, 0, 0, 0, .53222], 198: [0, .68611, .11431, 0, 1.02277], 216: [.04861, .73472, .09062, 0, .88555], 223: [.19444, .69444, .09736, 0, .665], 230: [0, .44444, .085, 0, .82666], 248: [.09722, .54167, .09458, 0, .59111], 305: [0, .44444, .09426, 0, .35555], 338: [0, .68611, .11431, 0, 1.14054], 339: [0, .44444, .085, 0, .82666], 567: [.19444, .44444, .04611, 0, .385], 710: [0, .69444, .06709, 0, .59111], 711: [0, .63194, .08271, 0, .59111], 713: [0, .59444, .10444, 0, .59111], 714: [0, .69444, .08528, 0, .59111], 715: [0, .69444, 0, 0, .59111], 728: [0, .69444, .10333, 0, .59111], 729: [0, .69444, .12945, 0, .35555], 730: [0, .69444, 0, 0, .94888], 732: [0, .69444, .11472, 0, .59111], 733: [0, .69444, .11472, 0, .59111], 915: [0, .68611, .12903, 0, .69777], 916: [0, .68611, 0, 0, .94444], 920: [0, .68611, .09062, 0, .88555], 923: [0, .68611, 0, 0, .80666], 926: [0, .68611, .15092, 0, .76777], 928: [0, .68611, .17208, 0, .8961], 931: [0, .68611, .11431, 0, .82666], 933: [0, .68611, .10778, 0, .88555], 934: [0, .68611, .05632, 0, .82666], 936: [0, .68611, .10778, 0, .88555], 937: [0, .68611, .0992, 0, .82666], 8211: [0, .44444, .09811, 0, .59111], 8212: [0, .44444, .09811, 0, 1.18221], 8216: [0, .69444, .12945, 0, .35555], 8217: [0, .69444, .12945, 0, .35555], 8220: [0, .69444, .16772, 0, .62055], 8221: [0, .69444, .07939, 0, .62055] }, "Main-Italic": { 33: [0, .69444, .12417, 0, .30667], 34: [0, .69444, .06961, 0, .51444], 35: [.19444, .69444, .06616, 0, .81777], 37: [.05556, .75, .13639, 0, .81777], 38: [0, .69444, .09694, 0, .76666], 39: [0, .69444, .12417, 0, .30667], 40: [.25, .75, .16194, 0, .40889], 41: [.25, .75, .03694, 0, .40889], 42: [0, .75, .14917, 0, .51111], 43: [.05667, .56167, .03694, 0, .76666], 44: [.19444, .10556, 0, 0, .30667], 45: [0, .43056, .02826, 0, .35778], 46: [0, .10556, 0, 0, .30667], 47: [.25, .75, .16194, 0, .51111], 48: [0, .64444, .13556, 0, .51111], 49: [0, .64444, .13556, 0, .51111], 50: [0, .64444, .13556, 0, .51111], 51: [0, .64444, .13556, 0, .51111], 52: [.19444, .64444, .13556, 0, .51111], 53: [0, .64444, .13556, 0, .51111], 54: [0, .64444, .13556, 0, .51111], 55: [.19444, .64444, .13556, 0, .51111], 56: [0, .64444, .13556, 0, .51111], 57: [0, .64444, .13556, 0, .51111], 58: [0, .43056, .0582, 0, .30667], 59: [.19444, .43056, .0582, 0, .30667], 61: [-.13313, .36687, .06616, 0, .76666], 63: [0, .69444, .1225, 0, .51111], 64: [0, .69444, .09597, 0, .76666], 65: [0, .68333, 0, 0, .74333], 66: [0, .68333, .10257, 0, .70389], 67: [0, .68333, .14528, 0, .71555], 68: [0, .68333, .09403, 0, .755], 69: [0, .68333, .12028, 0, .67833], 70: [0, .68333, .13305, 0, .65277], 71: [0, .68333, .08722, 0, .77361], 72: [0, .68333, .16389, 0, .74333], 73: [0, .68333, .15806, 0, .38555], 74: [0, .68333, .14028, 0, .525], 75: [0, .68333, .14528, 0, .76888], 76: [0, .68333, 0, 0, .62722], 77: [0, .68333, .16389, 0, .89666], 78: [0, .68333, .16389, 0, .74333], 79: [0, .68333, .09403, 0, .76666], 80: [0, .68333, .10257, 0, .67833], 81: [.19444, .68333, .09403, 0, .76666], 82: [0, .68333, .03868, 0, .72944], 83: [0, .68333, .11972, 0, .56222], 84: [0, .68333, .13305, 0, .71555], 85: [0, .68333, .16389, 0, .74333], 86: [0, .68333, .18361, 0, .74333], 87: [0, .68333, .18361, 0, .99888], 88: [0, .68333, .15806, 0, .74333], 89: [0, .68333, .19383, 0, .74333], 90: [0, .68333, .14528, 0, .61333], 91: [.25, .75, .1875, 0, .30667], 93: [.25, .75, .10528, 0, .30667], 94: [0, .69444, .06646, 0, .51111], 95: [.31, .12056, .09208, 0, .51111], 97: [0, .43056, .07671, 0, .51111], 98: [0, .69444, .06312, 0, .46], 99: [0, .43056, .05653, 0, .46], 100: [0, .69444, .10333, 0, .51111], 101: [0, .43056, .07514, 0, .46], 102: [.19444, .69444, .21194, 0, .30667], 103: [.19444, .43056, .08847, 0, .46], 104: [0, .69444, .07671, 0, .51111], 105: [0, .65536, .1019, 0, .30667], 106: [.19444, .65536, .14467, 0, .30667], 107: [0, .69444, .10764, 0, .46], 108: [0, .69444, .10333, 0, .25555], 109: [0, .43056, .07671, 0, .81777], 110: [0, .43056, .07671, 0, .56222], 111: [0, .43056, .06312, 0, .51111], 112: [.19444, .43056, .06312, 0, .51111], 113: [.19444, .43056, .08847, 0, .46], 114: [0, .43056, .10764, 0, .42166], 115: [0, .43056, .08208, 0, .40889], 116: [0, .61508, .09486, 0, .33222], 117: [0, .43056, .07671, 0, .53666], 118: [0, .43056, .10764, 0, .46], 119: [0, .43056, .10764, 0, .66444], 120: [0, .43056, .12042, 0, .46389], 121: [.19444, .43056, .08847, 0, .48555], 122: [0, .43056, .12292, 0, .40889], 126: [.35, .31786, .11585, 0, .51111], 163: [0, .69444, 0, 0, .76909], 168: [0, .66786, .10474, 0, .51111], 176: [0, .69444, 0, 0, .83129], 184: [.17014, 0, 0, 0, .46], 198: [0, .68333, .12028, 0, .88277], 216: [.04861, .73194, .09403, 0, .76666], 223: [.19444, .69444, .10514, 0, .53666], 230: [0, .43056, .07514, 0, .71555], 248: [.09722, .52778, .09194, 0, .51111], 305: [0, .43056, 0, .02778, .32246], 338: [0, .68333, .12028, 0, .98499], 339: [0, .43056, .07514, 0, .71555], 567: [.19444, .43056, 0, .08334, .38403], 710: [0, .69444, .06646, 0, .51111], 711: [0, .62847, .08295, 0, .51111], 713: [0, .56167, .10333, 0, .51111], 714: [0, .69444, .09694, 0, .51111], 715: [0, .69444, 0, 0, .51111], 728: [0, .69444, .10806, 0, .51111], 729: [0, .66786, .11752, 0, .30667], 730: [0, .69444, 0, 0, .83129], 732: [0, .66786, .11585, 0, .51111], 733: [0, .69444, .1225, 0, .51111], 915: [0, .68333, .13305, 0, .62722], 916: [0, .68333, 0, 0, .81777], 920: [0, .68333, .09403, 0, .76666], 923: [0, .68333, 0, 0, .69222], 926: [0, .68333, .15294, 0, .66444], 928: [0, .68333, .16389, 0, .74333], 931: [0, .68333, .12028, 0, .71555], 933: [0, .68333, .11111, 0, .76666], 934: [0, .68333, .05986, 0, .71555], 936: [0, .68333, .11111, 0, .76666], 937: [0, .68333, .10257, 0, .71555], 8211: [0, .43056, .09208, 0, .51111], 8212: [0, .43056, .09208, 0, 1.02222], 8216: [0, .69444, .12417, 0, .30667], 8217: [0, .69444, .12417, 0, .30667], 8220: [0, .69444, .1685, 0, .51444], 8221: [0, .69444, .06961, 0, .51444], 8463: [0, .68889, 0, 0, .54028] }, "Main-Regular": { 32: [0, 0, 0, 0, .25], 33: [0, .69444, 0, 0, .27778], 34: [0, .69444, 0, 0, .5], 35: [.19444, .69444, 0, 0, .83334], 36: [.05556, .75, 0, 0, .5], 37: [.05556, .75, 0, 0, .83334], 38: [0, .69444, 0, 0, .77778], 39: [0, .69444, 0, 0, .27778], 40: [.25, .75, 0, 0, .38889], 41: [.25, .75, 0, 0, .38889], 42: [0, .75, 0, 0, .5], 43: [.08333, .58333, 0, 0, .77778], 44: [.19444, .10556, 0, 0, .27778], 45: [0, .43056, 0, 0, .33333], 46: [0, .10556, 0, 0, .27778], 47: [.25, .75, 0, 0, .5], 48: [0, .64444, 0, 0, .5], 49: [0, .64444, 0, 0, .5], 50: [0, .64444, 0, 0, .5], 51: [0, .64444, 0, 0, .5], 52: [0, .64444, 0, 0, .5], 53: [0, .64444, 0, 0, .5], 54: [0, .64444, 0, 0, .5], 55: [0, .64444, 0, 0, .5], 56: [0, .64444, 0, 0, .5], 57: [0, .64444, 0, 0, .5], 58: [0, .43056, 0, 0, .27778], 59: [.19444, .43056, 0, 0, .27778], 60: [.0391, .5391, 0, 0, .77778], 61: [-.13313, .36687, 0, 0, .77778], 62: [.0391, .5391, 0, 0, .77778], 63: [0, .69444, 0, 0, .47222], 64: [0, .69444, 0, 0, .77778], 65: [0, .68333, 0, 0, .75], 66: [0, .68333, 0, 0, .70834], 67: [0, .68333, 0, 0, .72222], 68: [0, .68333, 0, 0, .76389], 69: [0, .68333, 0, 0, .68056], 70: [0, .68333, 0, 0, .65278], 71: [0, .68333, 0, 0, .78472], 72: [0, .68333, 0, 0, .75], 73: [0, .68333, 0, 0, .36111], 74: [0, .68333, 0, 0, .51389], 75: [0, .68333, 0, 0, .77778], 76: [0, .68333, 0, 0, .625], 77: [0, .68333, 0, 0, .91667], 78: [0, .68333, 0, 0, .75], 79: [0, .68333, 0, 0, .77778], 80: [0, .68333, 0, 0, .68056], 81: [.19444, .68333, 0, 0, .77778], 82: [0, .68333, 0, 0, .73611], 83: [0, .68333, 0, 0, .55556], 84: [0, .68333, 0, 0, .72222], 85: [0, .68333, 0, 0, .75], 86: [0, .68333, .01389, 0, .75], 87: [0, .68333, .01389, 0, 1.02778], 88: [0, .68333, 0, 0, .75], 89: [0, .68333, .025, 0, .75], 90: [0, .68333, 0, 0, .61111], 91: [.25, .75, 0, 0, .27778], 92: [.25, .75, 0, 0, .5], 93: [.25, .75, 0, 0, .27778], 94: [0, .69444, 0, 0, .5], 95: [.31, .12056, .02778, 0, .5], 97: [0, .43056, 0, 0, .5], 98: [0, .69444, 0, 0, .55556], 99: [0, .43056, 0, 0, .44445], 100: [0, .69444, 0, 0, .55556], 101: [0, .43056, 0, 0, .44445], 102: [0, .69444, .07778, 0, .30556], 103: [.19444, .43056, .01389, 0, .5], 104: [0, .69444, 0, 0, .55556], 105: [0, .66786, 0, 0, .27778], 106: [.19444, .66786, 0, 0, .30556], 107: [0, .69444, 0, 0, .52778], 108: [0, .69444, 0, 0, .27778], 109: [0, .43056, 0, 0, .83334], 110: [0, .43056, 0, 0, .55556], 111: [0, .43056, 0, 0, .5], 112: [.19444, .43056, 0, 0, .55556], 113: [.19444, .43056, 0, 0, .52778], 114: [0, .43056, 0, 0, .39167], 115: [0, .43056, 0, 0, .39445], 116: [0, .61508, 0, 0, .38889], 117: [0, .43056, 0, 0, .55556], 118: [0, .43056, .01389, 0, .52778], 119: [0, .43056, .01389, 0, .72222], 120: [0, .43056, 0, 0, .52778], 121: [.19444, .43056, .01389, 0, .52778], 122: [0, .43056, 0, 0, .44445], 123: [.25, .75, 0, 0, .5], 124: [.25, .75, 0, 0, .27778], 125: [.25, .75, 0, 0, .5], 126: [.35, .31786, 0, 0, .5], 160: [0, 0, 0, 0, .25], 167: [.19444, .69444, 0, 0, .44445], 168: [0, .66786, 0, 0, .5], 172: [0, .43056, 0, 0, .66667], 176: [0, .69444, 0, 0, .75], 177: [.08333, .58333, 0, 0, .77778], 182: [.19444, .69444, 0, 0, .61111], 184: [.17014, 0, 0, 0, .44445], 198: [0, .68333, 0, 0, .90278], 215: [.08333, .58333, 0, 0, .77778], 216: [.04861, .73194, 0, 0, .77778], 223: [0, .69444, 0, 0, .5], 230: [0, .43056, 0, 0, .72222], 247: [.08333, .58333, 0, 0, .77778], 248: [.09722, .52778, 0, 0, .5], 305: [0, .43056, 0, 0, .27778], 338: [0, .68333, 0, 0, 1.01389], 339: [0, .43056, 0, 0, .77778], 567: [.19444, .43056, 0, 0, .30556], 710: [0, .69444, 0, 0, .5], 711: [0, .62847, 0, 0, .5], 713: [0, .56778, 0, 0, .5], 714: [0, .69444, 0, 0, .5], 715: [0, .69444, 0, 0, .5], 728: [0, .69444, 0, 0, .5], 729: [0, .66786, 0, 0, .27778], 730: [0, .69444, 0, 0, .75], 732: [0, .66786, 0, 0, .5], 733: [0, .69444, 0, 0, .5], 824: [.19444, .69444, 0, 0, 0], 915: [0, .68333, 0, 0, .625], 916: [0, .68333, 0, 0, .83334], 920: [0, .68333, 0, 0, .77778], 923: [0, .68333, 0, 0, .69445], 926: [0, .68333, 0, 0, .66667], 928: [0, .68333, 0, 0, .75], 931: [0, .68333, 0, 0, .72222], 933: [0, .68333, 0, 0, .77778], 934: [0, .68333, 0, 0, .72222], 936: [0, .68333, 0, 0, .77778], 937: [0, .68333, 0, 0, .72222], 8211: [0, .43056, .02778, 0, .5], 8212: [0, .43056, .02778, 0, 1], 8216: [0, .69444, 0, 0, .27778], 8217: [0, .69444, 0, 0, .27778], 8220: [0, .69444, 0, 0, .5], 8221: [0, .69444, 0, 0, .5], 8224: [.19444, .69444, 0, 0, .44445], 8225: [.19444, .69444, 0, 0, .44445], 8230: [0, .12, 0, 0, 1.172], 8242: [0, .55556, 0, 0, .275], 8407: [0, .71444, .15382, 0, .5], 8463: [0, .68889, 0, 0, .54028], 8465: [0, .69444, 0, 0, .72222], 8467: [0, .69444, 0, .11111, .41667], 8472: [.19444, .43056, 0, .11111, .63646], 8476: [0, .69444, 0, 0, .72222], 8501: [0, .69444, 0, 0, .61111], 8592: [-.13313, .36687, 0, 0, 1], 8593: [.19444, .69444, 0, 0, .5], 8594: [-.13313, .36687, 0, 0, 1], 8595: [.19444, .69444, 0, 0, .5], 8596: [-.13313, .36687, 0, 0, 1], 8597: [.25, .75, 0, 0, .5], 8598: [.19444, .69444, 0, 0, 1], 8599: [.19444, .69444, 0, 0, 1], 8600: [.19444, .69444, 0, 0, 1], 8601: [.19444, .69444, 0, 0, 1], 8614: [.011, .511, 0, 0, 1], 8617: [.011, .511, 0, 0, 1.126], 8618: [.011, .511, 0, 0, 1.126], 8636: [-.13313, .36687, 0, 0, 1], 8637: [-.13313, .36687, 0, 0, 1], 8640: [-.13313, .36687, 0, 0, 1], 8641: [-.13313, .36687, 0, 0, 1], 8652: [.011, .671, 0, 0, 1], 8656: [-.13313, .36687, 0, 0, 1], 8657: [.19444, .69444, 0, 0, .61111], 8658: [-.13313, .36687, 0, 0, 1], 8659: [.19444, .69444, 0, 0, .61111], 8660: [-.13313, .36687, 0, 0, 1], 8661: [.25, .75, 0, 0, .61111], 8704: [0, .69444, 0, 0, .55556], 8706: [0, .69444, .05556, .08334, .5309], 8707: [0, .69444, 0, 0, .55556], 8709: [.05556, .75, 0, 0, .5], 8711: [0, .68333, 0, 0, .83334], 8712: [.0391, .5391, 0, 0, .66667], 8715: [.0391, .5391, 0, 0, .66667], 8722: [.08333, .58333, 0, 0, .77778], 8723: [.08333, .58333, 0, 0, .77778], 8725: [.25, .75, 0, 0, .5], 8726: [.25, .75, 0, 0, .5], 8727: [-.03472, .46528, 0, 0, .5], 8728: [-.05555, .44445, 0, 0, .5], 8729: [-.05555, .44445, 0, 0, .5], 8730: [.2, .8, 0, 0, .83334], 8733: [0, .43056, 0, 0, .77778], 8734: [0, .43056, 0, 0, 1], 8736: [0, .69224, 0, 0, .72222], 8739: [.25, .75, 0, 0, .27778], 8741: [.25, .75, 0, 0, .5], 8743: [0, .55556, 0, 0, .66667], 8744: [0, .55556, 0, 0, .66667], 8745: [0, .55556, 0, 0, .66667], 8746: [0, .55556, 0, 0, .66667], 8747: [.19444, .69444, .11111, 0, .41667], 8764: [-.13313, .36687, 0, 0, .77778], 8768: [.19444, .69444, 0, 0, .27778], 8771: [-.03625, .46375, 0, 0, .77778], 8773: [-.022, .589, 0, 0, 1], 8776: [-.01688, .48312, 0, 0, .77778], 8781: [-.03625, .46375, 0, 0, .77778], 8784: [-.133, .67, 0, 0, .778], 8800: [.215, .716, 0, 0, .778], 8801: [-.03625, .46375, 0, 0, .77778], 8804: [.13597, .63597, 0, 0, .77778], 8805: [.13597, .63597, 0, 0, .77778], 8810: [.0391, .5391, 0, 0, 1], 8811: [.0391, .5391, 0, 0, 1], 8826: [.0391, .5391, 0, 0, .77778], 8827: [.0391, .5391, 0, 0, .77778], 8834: [.0391, .5391, 0, 0, .77778], 8835: [.0391, .5391, 0, 0, .77778], 8838: [.13597, .63597, 0, 0, .77778], 8839: [.13597, .63597, 0, 0, .77778], 8846: [0, .55556, 0, 0, .66667], 8849: [.13597, .63597, 0, 0, .77778], 8850: [.13597, .63597, 0, 0, .77778], 8851: [0, .55556, 0, 0, .66667], 8852: [0, .55556, 0, 0, .66667], 8853: [.08333, .58333, 0, 0, .77778], 8854: [.08333, .58333, 0, 0, .77778], 8855: [.08333, .58333, 0, 0, .77778], 8856: [.08333, .58333, 0, 0, .77778], 8857: [.08333, .58333, 0, 0, .77778], 8866: [0, .69444, 0, 0, .61111], 8867: [0, .69444, 0, 0, .61111], 8868: [0, .69444, 0, 0, .77778], 8869: [0, .69444, 0, 0, .77778], 8872: [.249, .75, 0, 0, .867], 8900: [-.05555, .44445, 0, 0, .5], 8901: [-.05555, .44445, 0, 0, .27778], 8902: [-.03472, .46528, 0, 0, .5], 8904: [.005, .505, 0, 0, .9], 8942: [.03, .9, 0, 0, .278], 8943: [-.19, .31, 0, 0, 1.172], 8945: [-.1, .82, 0, 0, 1.282], 8968: [.25, .75, 0, 0, .44445], 8969: [.25, .75, 0, 0, .44445], 8970: [.25, .75, 0, 0, .44445], 8971: [.25, .75, 0, 0, .44445], 8994: [-.14236, .35764, 0, 0, 1], 8995: [-.14236, .35764, 0, 0, 1], 9136: [.244, .744, 0, 0, .412], 9137: [.244, .744, 0, 0, .412], 9651: [.19444, .69444, 0, 0, .88889], 9657: [-.03472, .46528, 0, 0, .5], 9661: [.19444, .69444, 0, 0, .88889], 9667: [-.03472, .46528, 0, 0, .5], 9711: [.19444, .69444, 0, 0, 1], 9824: [.12963, .69444, 0, 0, .77778], 9825: [.12963, .69444, 0, 0, .77778], 9826: [.12963, .69444, 0, 0, .77778], 9827: [.12963, .69444, 0, 0, .77778], 9837: [0, .75, 0, 0, .38889], 9838: [.19444, .69444, 0, 0, .38889], 9839: [.19444, .69444, 0, 0, .38889], 10216: [.25, .75, 0, 0, .38889], 10217: [.25, .75, 0, 0, .38889], 10222: [.244, .744, 0, 0, .412], 10223: [.244, .744, 0, 0, .412], 10229: [.011, .511, 0, 0, 1.609], 10230: [.011, .511, 0, 0, 1.638], 10231: [.011, .511, 0, 0, 1.859], 10232: [.024, .525, 0, 0, 1.609], 10233: [.024, .525, 0, 0, 1.638], 10234: [.024, .525, 0, 0, 1.858], 10236: [.011, .511, 0, 0, 1.638], 10815: [0, .68333, 0, 0, .75], 10927: [.13597, .63597, 0, 0, .77778], 10928: [.13597, .63597, 0, 0, .77778] }, "Math-BoldItalic": { 47: [.19444, .69444, 0, 0, 0], 65: [0, .68611, 0, 0, .86944], 66: [0, .68611, .04835, 0, .8664], 67: [0, .68611, .06979, 0, .81694], 68: [0, .68611, .03194, 0, .93812], 69: [0, .68611, .05451, 0, .81007], 70: [0, .68611, .15972, 0, .68889], 71: [0, .68611, 0, 0, .88673], 72: [0, .68611, .08229, 0, .98229], 73: [0, .68611, .07778, 0, .51111], 74: [0, .68611, .10069, 0, .63125], 75: [0, .68611, .06979, 0, .97118], 76: [0, .68611, 0, 0, .75555], 77: [0, .68611, .11424, 0, 1.14201], 78: [0, .68611, .11424, 0, .95034], 79: [0, .68611, .03194, 0, .83666], 80: [0, .68611, .15972, 0, .72309], 81: [.19444, .68611, 0, 0, .86861], 82: [0, .68611, .00421, 0, .87235], 83: [0, .68611, .05382, 0, .69271], 84: [0, .68611, .15972, 0, .63663], 85: [0, .68611, .11424, 0, .80027], 86: [0, .68611, .25555, 0, .67778], 87: [0, .68611, .15972, 0, 1.09305], 88: [0, .68611, .07778, 0, .94722], 89: [0, .68611, .25555, 0, .67458], 90: [0, .68611, .06979, 0, .77257], 97: [0, .44444, 0, 0, .63287], 98: [0, .69444, 0, 0, .52083], 99: [0, .44444, 0, 0, .51342], 100: [0, .69444, 0, 0, .60972], 101: [0, .44444, 0, 0, .55361], 102: [.19444, .69444, .11042, 0, .56806], 103: [.19444, .44444, .03704, 0, .5449], 104: [0, .69444, 0, 0, .66759], 105: [0, .69326, 0, 0, .4048], 106: [.19444, .69326, .0622, 0, .47083], 107: [0, .69444, .01852, 0, .6037], 108: [0, .69444, .0088, 0, .34815], 109: [0, .44444, 0, 0, 1.0324], 110: [0, .44444, 0, 0, .71296], 111: [0, .44444, 0, 0, .58472], 112: [.19444, .44444, 0, 0, .60092], 113: [.19444, .44444, .03704, 0, .54213], 114: [0, .44444, .03194, 0, .5287], 115: [0, .44444, 0, 0, .53125], 116: [0, .63492, 0, 0, .41528], 117: [0, .44444, 0, 0, .68102], 118: [0, .44444, .03704, 0, .56666], 119: [0, .44444, .02778, 0, .83148], 120: [0, .44444, 0, 0, .65903], 121: [.19444, .44444, .03704, 0, .59028], 122: [0, .44444, .04213, 0, .55509], 915: [0, .68611, .15972, 0, .65694], 916: [0, .68611, 0, 0, .95833], 920: [0, .68611, .03194, 0, .86722], 923: [0, .68611, 0, 0, .80555], 926: [0, .68611, .07458, 0, .84125], 928: [0, .68611, .08229, 0, .98229], 931: [0, .68611, .05451, 0, .88507], 933: [0, .68611, .15972, 0, .67083], 934: [0, .68611, 0, 0, .76666], 936: [0, .68611, .11653, 0, .71402], 937: [0, .68611, .04835, 0, .8789], 945: [0, .44444, 0, 0, .76064], 946: [.19444, .69444, .03403, 0, .65972], 947: [.19444, .44444, .06389, 0, .59003], 948: [0, .69444, .03819, 0, .52222], 949: [0, .44444, 0, 0, .52882], 950: [.19444, .69444, .06215, 0, .50833], 951: [.19444, .44444, .03704, 0, .6], 952: [0, .69444, .03194, 0, .5618], 953: [0, .44444, 0, 0, .41204], 954: [0, .44444, 0, 0, .66759], 955: [0, .69444, 0, 0, .67083], 956: [.19444, .44444, 0, 0, .70787], 957: [0, .44444, .06898, 0, .57685], 958: [.19444, .69444, .03021, 0, .50833], 959: [0, .44444, 0, 0, .58472], 960: [0, .44444, .03704, 0, .68241], 961: [.19444, .44444, 0, 0, .6118], 962: [.09722, .44444, .07917, 0, .42361], 963: [0, .44444, .03704, 0, .68588], 964: [0, .44444, .13472, 0, .52083], 965: [0, .44444, .03704, 0, .63055], 966: [.19444, .44444, 0, 0, .74722], 967: [.19444, .44444, 0, 0, .71805], 968: [.19444, .69444, .03704, 0, .75833], 969: [0, .44444, .03704, 0, .71782], 977: [0, .69444, 0, 0, .69155], 981: [.19444, .69444, 0, 0, .7125], 982: [0, .44444, .03194, 0, .975], 1009: [.19444, .44444, 0, 0, .6118], 1013: [0, .44444, 0, 0, .48333] }, "Math-Italic": { 47: [.19444, .69444, 0, 0, 0], 65: [0, .68333, 0, .13889, .75], 66: [0, .68333, .05017, .08334, .75851], 67: [0, .68333, .07153, .08334, .71472], 68: [0, .68333, .02778, .05556, .82792], 69: [0, .68333, .05764, .08334, .7382], 70: [0, .68333, .13889, .08334, .64306], 71: [0, .68333, 0, .08334, .78625], 72: [0, .68333, .08125, .05556, .83125], 73: [0, .68333, .07847, .11111, .43958], 74: [0, .68333, .09618, .16667, .55451], 75: [0, .68333, .07153, .05556, .84931], 76: [0, .68333, 0, .02778, .68056], 77: [0, .68333, .10903, .08334, .97014], 78: [0, .68333, .10903, .08334, .80347], 79: [0, .68333, .02778, .08334, .76278], 80: [0, .68333, .13889, .08334, .64201], 81: [.19444, .68333, 0, .08334, .79056], 82: [0, .68333, .00773, .08334, .75929], 83: [0, .68333, .05764, .08334, .6132], 84: [0, .68333, .13889, .08334, .58438], 85: [0, .68333, .10903, .02778, .68278], 86: [0, .68333, .22222, 0, .58333], 87: [0, .68333, .13889, 0, .94445], 88: [0, .68333, .07847, .08334, .82847], 89: [0, .68333, .22222, 0, .58056], 90: [0, .68333, .07153, .08334, .68264], 97: [0, .43056, 0, 0, .52859], 98: [0, .69444, 0, 0, .42917], 99: [0, .43056, 0, .05556, .43276], 100: [0, .69444, 0, .16667, .52049], 101: [0, .43056, 0, .05556, .46563], 102: [.19444, .69444, .10764, .16667, .48959], 103: [.19444, .43056, .03588, .02778, .47697], 104: [0, .69444, 0, 0, .57616], 105: [0, .65952, 0, 0, .34451], 106: [.19444, .65952, .05724, 0, .41181], 107: [0, .69444, .03148, 0, .5206], 108: [0, .69444, .01968, .08334, .29838], 109: [0, .43056, 0, 0, .87801], 110: [0, .43056, 0, 0, .60023], 111: [0, .43056, 0, .05556, .48472], 112: [.19444, .43056, 0, .08334, .50313], 113: [.19444, .43056, .03588, .08334, .44641], 114: [0, .43056, .02778, .05556, .45116], 115: [0, .43056, 0, .05556, .46875], 116: [0, .61508, 0, .08334, .36111], 117: [0, .43056, 0, .02778, .57246], 118: [0, .43056, .03588, .02778, .48472], 119: [0, .43056, .02691, .08334, .71592], 120: [0, .43056, 0, .02778, .57153], 121: [.19444, .43056, .03588, .05556, .49028], 122: [0, .43056, .04398, .05556, .46505], 915: [0, .68333, .13889, .08334, .61528], 916: [0, .68333, 0, .16667, .83334], 920: [0, .68333, .02778, .08334, .76278], 923: [0, .68333, 0, .16667, .69445], 926: [0, .68333, .07569, .08334, .74236], 928: [0, .68333, .08125, .05556, .83125], 931: [0, .68333, .05764, .08334, .77986], 933: [0, .68333, .13889, .05556, .58333], 934: [0, .68333, 0, .08334, .66667], 936: [0, .68333, .11, .05556, .61222], 937: [0, .68333, .05017, .08334, .7724], 945: [0, .43056, .0037, .02778, .6397], 946: [.19444, .69444, .05278, .08334, .56563], 947: [.19444, .43056, .05556, 0, .51773], 948: [0, .69444, .03785, .05556, .44444], 949: [0, .43056, 0, .08334, .46632], 950: [.19444, .69444, .07378, .08334, .4375], 951: [.19444, .43056, .03588, .05556, .49653], 952: [0, .69444, .02778, .08334, .46944], 953: [0, .43056, 0, .05556, .35394], 954: [0, .43056, 0, 0, .57616], 955: [0, .69444, 0, 0, .58334], 956: [.19444, .43056, 0, .02778, .60255], 957: [0, .43056, .06366, .02778, .49398], 958: [.19444, .69444, .04601, .11111, .4375], 959: [0, .43056, 0, .05556, .48472], 960: [0, .43056, .03588, 0, .57003], 961: [.19444, .43056, 0, .08334, .51702], 962: [.09722, .43056, .07986, .08334, .36285], 963: [0, .43056, .03588, 0, .57141], 964: [0, .43056, .1132, .02778, .43715], 965: [0, .43056, .03588, .02778, .54028], 966: [.19444, .43056, 0, .08334, .65417], 967: [.19444, .43056, 0, .05556, .62569], 968: [.19444, .69444, .03588, .11111, .65139], 969: [0, .43056, .03588, 0, .62245], 977: [0, .69444, 0, .08334, .59144], 981: [.19444, .69444, 0, .08334, .59583], 982: [0, .43056, .02778, 0, .82813], 1009: [.19444, .43056, 0, .08334, .51702], 1013: [0, .43056, 0, .05556, .4059] }, "Math-Regular": { 65: [0, .68333, 0, .13889, .75], 66: [0, .68333, .05017, .08334, .75851], 67: [0, .68333, .07153, .08334, .71472], 68: [0, .68333, .02778, .05556, .82792], 69: [0, .68333, .05764, .08334, .7382], 70: [0, .68333, .13889, .08334, .64306], 71: [0, .68333, 0, .08334, .78625], 72: [0, .68333, .08125, .05556, .83125], 73: [0, .68333, .07847, .11111, .43958], 74: [0, .68333, .09618, .16667, .55451], 75: [0, .68333, .07153, .05556, .84931], 76: [0, .68333, 0, .02778, .68056], 77: [0, .68333, .10903, .08334, .97014], 78: [0, .68333, .10903, .08334, .80347], 79: [0, .68333, .02778, .08334, .76278], 80: [0, .68333, .13889, .08334, .64201], 81: [.19444, .68333, 0, .08334, .79056], 82: [0, .68333, .00773, .08334, .75929], 83: [0, .68333, .05764, .08334, .6132], 84: [0, .68333, .13889, .08334, .58438], 85: [0, .68333, .10903, .02778, .68278], 86: [0, .68333, .22222, 0, .58333], 87: [0, .68333, .13889, 0, .94445], 88: [0, .68333, .07847, .08334, .82847], 89: [0, .68333, .22222, 0, .58056], 90: [0, .68333, .07153, .08334, .68264], 97: [0, .43056, 0, 0, .52859], 98: [0, .69444, 0, 0, .42917], 99: [0, .43056, 0, .05556, .43276], 100: [0, .69444, 0, .16667, .52049], 101: [0, .43056, 0, .05556, .46563], 102: [.19444, .69444, .10764, .16667, .48959], 103: [.19444, .43056, .03588, .02778, .47697], 104: [0, .69444, 0, 0, .57616], 105: [0, .65952, 0, 0, .34451], 106: [.19444, .65952, .05724, 0, .41181], 107: [0, .69444, .03148, 0, .5206], 108: [0, .69444, .01968, .08334, .29838], 109: [0, .43056, 0, 0, .87801], 110: [0, .43056, 0, 0, .60023], 111: [0, .43056, 0, .05556, .48472], 112: [.19444, .43056, 0, .08334, .50313], 113: [.19444, .43056, .03588, .08334, .44641], 114: [0, .43056, .02778, .05556, .45116], 115: [0, .43056, 0, .05556, .46875], 116: [0, .61508, 0, .08334, .36111], 117: [0, .43056, 0, .02778, .57246], 118: [0, .43056, .03588, .02778, .48472], 119: [0, .43056, .02691, .08334, .71592], 120: [0, .43056, 0, .02778, .57153], 121: [.19444, .43056, .03588, .05556, .49028], 122: [0, .43056, .04398, .05556, .46505], 915: [0, .68333, .13889, .08334, .61528], 916: [0, .68333, 0, .16667, .83334], 920: [0, .68333, .02778, .08334, .76278], 923: [0, .68333, 0, .16667, .69445], 926: [0, .68333, .07569, .08334, .74236], 928: [0, .68333, .08125, .05556, .83125], 931: [0, .68333, .05764, .08334, .77986], 933: [0, .68333, .13889, .05556, .58333], 934: [0, .68333, 0, .08334, .66667], 936: [0, .68333, .11, .05556, .61222], 937: [0, .68333, .05017, .08334, .7724], 945: [0, .43056, .0037, .02778, .6397], 946: [.19444, .69444, .05278, .08334, .56563], 947: [.19444, .43056, .05556, 0, .51773], 948: [0, .69444, .03785, .05556, .44444], 949: [0, .43056, 0, .08334, .46632], 950: [.19444, .69444, .07378, .08334, .4375], 951: [.19444, .43056, .03588, .05556, .49653], 952: [0, .69444, .02778, .08334, .46944], 953: [0, .43056, 0, .05556, .35394], 954: [0, .43056, 0, 0, .57616], 955: [0, .69444, 0, 0, .58334], 956: [.19444, .43056, 0, .02778, .60255], 957: [0, .43056, .06366, .02778, .49398], 958: [.19444, .69444, .04601, .11111, .4375], 959: [0, .43056, 0, .05556, .48472], 960: [0, .43056, .03588, 0, .57003], 961: [.19444, .43056, 0, .08334, .51702], 962: [.09722, .43056, .07986, .08334, .36285], 963: [0, .43056, .03588, 0, .57141], 964: [0, .43056, .1132, .02778, .43715], 965: [0, .43056, .03588, .02778, .54028], 966: [.19444, .43056, 0, .08334, .65417], 967: [.19444, .43056, 0, .05556, .62569], 968: [.19444, .69444, .03588, .11111, .65139], 969: [0, .43056, .03588, 0, .62245], 977: [0, .69444, 0, .08334, .59144], 981: [.19444, .69444, 0, .08334, .59583], 982: [0, .43056, .02778, 0, .82813], 1009: [.19444, .43056, 0, .08334, .51702], 1013: [0, .43056, 0, .05556, .4059] }, "SansSerif-Bold": { 33: [0, .69444, 0, 0, .36667], 34: [0, .69444, 0, 0, .55834], 35: [.19444, .69444, 0, 0, .91667], 36: [.05556, .75, 0, 0, .55], 37: [.05556, .75, 0, 0, 1.02912], 38: [0, .69444, 0, 0, .83056], 39: [0, .69444, 0, 0, .30556], 40: [.25, .75, 0, 0, .42778], 41: [.25, .75, 0, 0, .42778], 42: [0, .75, 0, 0, .55], 43: [.11667, .61667, 0, 0, .85556], 44: [.10556, .13056, 0, 0, .30556], 45: [0, .45833, 0, 0, .36667], 46: [0, .13056, 0, 0, .30556], 47: [.25, .75, 0, 0, .55], 48: [0, .69444, 0, 0, .55], 49: [0, .69444, 0, 0, .55], 50: [0, .69444, 0, 0, .55], 51: [0, .69444, 0, 0, .55], 52: [0, .69444, 0, 0, .55], 53: [0, .69444, 0, 0, .55], 54: [0, .69444, 0, 0, .55], 55: [0, .69444, 0, 0, .55], 56: [0, .69444, 0, 0, .55], 57: [0, .69444, 0, 0, .55], 58: [0, .45833, 0, 0, .30556], 59: [.10556, .45833, 0, 0, .30556], 61: [-.09375, .40625, 0, 0, .85556], 63: [0, .69444, 0, 0, .51945], 64: [0, .69444, 0, 0, .73334], 65: [0, .69444, 0, 0, .73334], 66: [0, .69444, 0, 0, .73334], 67: [0, .69444, 0, 0, .70278], 68: [0, .69444, 0, 0, .79445], 69: [0, .69444, 0, 0, .64167], 70: [0, .69444, 0, 0, .61111], 71: [0, .69444, 0, 0, .73334], 72: [0, .69444, 0, 0, .79445], 73: [0, .69444, 0, 0, .33056], 74: [0, .69444, 0, 0, .51945], 75: [0, .69444, 0, 0, .76389], 76: [0, .69444, 0, 0, .58056], 77: [0, .69444, 0, 0, .97778], 78: [0, .69444, 0, 0, .79445], 79: [0, .69444, 0, 0, .79445], 80: [0, .69444, 0, 0, .70278], 81: [.10556, .69444, 0, 0, .79445], 82: [0, .69444, 0, 0, .70278], 83: [0, .69444, 0, 0, .61111], 84: [0, .69444, 0, 0, .73334], 85: [0, .69444, 0, 0, .76389], 86: [0, .69444, .01528, 0, .73334], 87: [0, .69444, .01528, 0, 1.03889], 88: [0, .69444, 0, 0, .73334], 89: [0, .69444, .0275, 0, .73334], 90: [0, .69444, 0, 0, .67223], 91: [.25, .75, 0, 0, .34306], 93: [.25, .75, 0, 0, .34306], 94: [0, .69444, 0, 0, .55], 95: [.35, .10833, .03056, 0, .55], 97: [0, .45833, 0, 0, .525], 98: [0, .69444, 0, 0, .56111], 99: [0, .45833, 0, 0, .48889], 100: [0, .69444, 0, 0, .56111], 101: [0, .45833, 0, 0, .51111], 102: [0, .69444, .07639, 0, .33611], 103: [.19444, .45833, .01528, 0, .55], 104: [0, .69444, 0, 0, .56111], 105: [0, .69444, 0, 0, .25556], 106: [.19444, .69444, 0, 0, .28611], 107: [0, .69444, 0, 0, .53056], 108: [0, .69444, 0, 0, .25556], 109: [0, .45833, 0, 0, .86667], 110: [0, .45833, 0, 0, .56111], 111: [0, .45833, 0, 0, .55], 112: [.19444, .45833, 0, 0, .56111], 113: [.19444, .45833, 0, 0, .56111], 114: [0, .45833, .01528, 0, .37222], 115: [0, .45833, 0, 0, .42167], 116: [0, .58929, 0, 0, .40417], 117: [0, .45833, 0, 0, .56111], 118: [0, .45833, .01528, 0, .5], 119: [0, .45833, .01528, 0, .74445], 120: [0, .45833, 0, 0, .5], 121: [.19444, .45833, .01528, 0, .5], 122: [0, .45833, 0, 0, .47639], 126: [.35, .34444, 0, 0, .55], 168: [0, .69444, 0, 0, .55], 176: [0, .69444, 0, 0, .73334], 180: [0, .69444, 0, 0, .55], 184: [.17014, 0, 0, 0, .48889], 305: [0, .45833, 0, 0, .25556], 567: [.19444, .45833, 0, 0, .28611], 710: [0, .69444, 0, 0, .55], 711: [0, .63542, 0, 0, .55], 713: [0, .63778, 0, 0, .55], 728: [0, .69444, 0, 0, .55], 729: [0, .69444, 0, 0, .30556], 730: [0, .69444, 0, 0, .73334], 732: [0, .69444, 0, 0, .55], 733: [0, .69444, 0, 0, .55], 915: [0, .69444, 0, 0, .58056], 916: [0, .69444, 0, 0, .91667], 920: [0, .69444, 0, 0, .85556], 923: [0, .69444, 0, 0, .67223], 926: [0, .69444, 0, 0, .73334], 928: [0, .69444, 0, 0, .79445], 931: [0, .69444, 0, 0, .79445], 933: [0, .69444, 0, 0, .85556], 934: [0, .69444, 0, 0, .79445], 936: [0, .69444, 0, 0, .85556], 937: [0, .69444, 0, 0, .79445], 8211: [0, .45833, .03056, 0, .55], 8212: [0, .45833, .03056, 0, 1.10001], 8216: [0, .69444, 0, 0, .30556], 8217: [0, .69444, 0, 0, .30556], 8220: [0, .69444, 0, 0, .55834], 8221: [0, .69444, 0, 0, .55834] }, "SansSerif-Italic": { 33: [0, .69444, .05733, 0, .31945], 34: [0, .69444, .00316, 0, .5], 35: [.19444, .69444, .05087, 0, .83334], 36: [.05556, .75, .11156, 0, .5], 37: [.05556, .75, .03126, 0, .83334], 38: [0, .69444, .03058, 0, .75834], 39: [0, .69444, .07816, 0, .27778], 40: [.25, .75, .13164, 0, .38889], 41: [.25, .75, .02536, 0, .38889], 42: [0, .75, .11775, 0, .5], 43: [.08333, .58333, .02536, 0, .77778], 44: [.125, .08333, 0, 0, .27778], 45: [0, .44444, .01946, 0, .33333], 46: [0, .08333, 0, 0, .27778], 47: [.25, .75, .13164, 0, .5], 48: [0, .65556, .11156, 0, .5], 49: [0, .65556, .11156, 0, .5], 50: [0, .65556, .11156, 0, .5], 51: [0, .65556, .11156, 0, .5], 52: [0, .65556, .11156, 0, .5], 53: [0, .65556, .11156, 0, .5], 54: [0, .65556, .11156, 0, .5], 55: [0, .65556, .11156, 0, .5], 56: [0, .65556, .11156, 0, .5], 57: [0, .65556, .11156, 0, .5], 58: [0, .44444, .02502, 0, .27778], 59: [.125, .44444, .02502, 0, .27778], 61: [-.13, .37, .05087, 0, .77778], 63: [0, .69444, .11809, 0, .47222], 64: [0, .69444, .07555, 0, .66667], 65: [0, .69444, 0, 0, .66667], 66: [0, .69444, .08293, 0, .66667], 67: [0, .69444, .11983, 0, .63889], 68: [0, .69444, .07555, 0, .72223], 69: [0, .69444, .11983, 0, .59722], 70: [0, .69444, .13372, 0, .56945], 71: [0, .69444, .11983, 0, .66667], 72: [0, .69444, .08094, 0, .70834], 73: [0, .69444, .13372, 0, .27778], 74: [0, .69444, .08094, 0, .47222], 75: [0, .69444, .11983, 0, .69445], 76: [0, .69444, 0, 0, .54167], 77: [0, .69444, .08094, 0, .875], 78: [0, .69444, .08094, 0, .70834], 79: [0, .69444, .07555, 0, .73611], 80: [0, .69444, .08293, 0, .63889], 81: [.125, .69444, .07555, 0, .73611], 82: [0, .69444, .08293, 0, .64584], 83: [0, .69444, .09205, 0, .55556], 84: [0, .69444, .13372, 0, .68056], 85: [0, .69444, .08094, 0, .6875], 86: [0, .69444, .1615, 0, .66667], 87: [0, .69444, .1615, 0, .94445], 88: [0, .69444, .13372, 0, .66667], 89: [0, .69444, .17261, 0, .66667], 90: [0, .69444, .11983, 0, .61111], 91: [.25, .75, .15942, 0, .28889], 93: [.25, .75, .08719, 0, .28889], 94: [0, .69444, .0799, 0, .5], 95: [.35, .09444, .08616, 0, .5], 97: [0, .44444, .00981, 0, .48056], 98: [0, .69444, .03057, 0, .51667], 99: [0, .44444, .08336, 0, .44445], 100: [0, .69444, .09483, 0, .51667], 101: [0, .44444, .06778, 0, .44445], 102: [0, .69444, .21705, 0, .30556], 103: [.19444, .44444, .10836, 0, .5], 104: [0, .69444, .01778, 0, .51667], 105: [0, .67937, .09718, 0, .23889], 106: [.19444, .67937, .09162, 0, .26667], 107: [0, .69444, .08336, 0, .48889], 108: [0, .69444, .09483, 0, .23889], 109: [0, .44444, .01778, 0, .79445], 110: [0, .44444, .01778, 0, .51667], 111: [0, .44444, .06613, 0, .5], 112: [.19444, .44444, .0389, 0, .51667], 113: [.19444, .44444, .04169, 0, .51667], 114: [0, .44444, .10836, 0, .34167], 115: [0, .44444, .0778, 0, .38333], 116: [0, .57143, .07225, 0, .36111], 117: [0, .44444, .04169, 0, .51667], 118: [0, .44444, .10836, 0, .46111], 119: [0, .44444, .10836, 0, .68334], 120: [0, .44444, .09169, 0, .46111], 121: [.19444, .44444, .10836, 0, .46111], 122: [0, .44444, .08752, 0, .43472], 126: [.35, .32659, .08826, 0, .5], 168: [0, .67937, .06385, 0, .5], 176: [0, .69444, 0, 0, .73752], 184: [.17014, 0, 0, 0, .44445], 305: [0, .44444, .04169, 0, .23889], 567: [.19444, .44444, .04169, 0, .26667], 710: [0, .69444, .0799, 0, .5], 711: [0, .63194, .08432, 0, .5], 713: [0, .60889, .08776, 0, .5], 714: [0, .69444, .09205, 0, .5], 715: [0, .69444, 0, 0, .5], 728: [0, .69444, .09483, 0, .5], 729: [0, .67937, .07774, 0, .27778], 730: [0, .69444, 0, 0, .73752], 732: [0, .67659, .08826, 0, .5], 733: [0, .69444, .09205, 0, .5], 915: [0, .69444, .13372, 0, .54167], 916: [0, .69444, 0, 0, .83334], 920: [0, .69444, .07555, 0, .77778], 923: [0, .69444, 0, 0, .61111], 926: [0, .69444, .12816, 0, .66667], 928: [0, .69444, .08094, 0, .70834], 931: [0, .69444, .11983, 0, .72222], 933: [0, .69444, .09031, 0, .77778], 934: [0, .69444, .04603, 0, .72222], 936: [0, .69444, .09031, 0, .77778], 937: [0, .69444, .08293, 0, .72222], 8211: [0, .44444, .08616, 0, .5], 8212: [0, .44444, .08616, 0, 1], 8216: [0, .69444, .07816, 0, .27778], 8217: [0, .69444, .07816, 0, .27778], 8220: [0, .69444, .14205, 0, .5], 8221: [0, .69444, .00316, 0, .5] }, "SansSerif-Regular": { 33: [0, .69444, 0, 0, .31945], 34: [0, .69444, 0, 0, .5], 35: [.19444, .69444, 0, 0, .83334], 36: [.05556, .75, 0, 0, .5], 37: [.05556, .75, 0, 0, .83334], 38: [0, .69444, 0, 0, .75834], 39: [0, .69444, 0, 0, .27778], 40: [.25, .75, 0, 0, .38889], 41: [.25, .75, 0, 0, .38889], 42: [0, .75, 0, 0, .5], 43: [.08333, .58333, 0, 0, .77778], 44: [.125, .08333, 0, 0, .27778], 45: [0, .44444, 0, 0, .33333], 46: [0, .08333, 0, 0, .27778], 47: [.25, .75, 0, 0, .5], 48: [0, .65556, 0, 0, .5], 49: [0, .65556, 0, 0, .5], 50: [0, .65556, 0, 0, .5], 51: [0, .65556, 0, 0, .5], 52: [0, .65556, 0, 0, .5], 53: [0, .65556, 0, 0, .5], 54: [0, .65556, 0, 0, .5], 55: [0, .65556, 0, 0, .5], 56: [0, .65556, 0, 0, .5], 57: [0, .65556, 0, 0, .5], 58: [0, .44444, 0, 0, .27778], 59: [.125, .44444, 0, 0, .27778], 61: [-.13, .37, 0, 0, .77778], 63: [0, .69444, 0, 0, .47222], 64: [0, .69444, 0, 0, .66667], 65: [0, .69444, 0, 0, .66667], 66: [0, .69444, 0, 0, .66667], 67: [0, .69444, 0, 0, .63889], 68: [0, .69444, 0, 0, .72223], 69: [0, .69444, 0, 0, .59722], 70: [0, .69444, 0, 0, .56945], 71: [0, .69444, 0, 0, .66667], 72: [0, .69444, 0, 0, .70834], 73: [0, .69444, 0, 0, .27778], 74: [0, .69444, 0, 0, .47222], 75: [0, .69444, 0, 0, .69445], 76: [0, .69444, 0, 0, .54167], 77: [0, .69444, 0, 0, .875], 78: [0, .69444, 0, 0, .70834], 79: [0, .69444, 0, 0, .73611], 80: [0, .69444, 0, 0, .63889], 81: [.125, .69444, 0, 0, .73611], 82: [0, .69444, 0, 0, .64584], 83: [0, .69444, 0, 0, .55556], 84: [0, .69444, 0, 0, .68056], 85: [0, .69444, 0, 0, .6875], 86: [0, .69444, .01389, 0, .66667], 87: [0, .69444, .01389, 0, .94445], 88: [0, .69444, 0, 0, .66667], 89: [0, .69444, .025, 0, .66667], 90: [0, .69444, 0, 0, .61111], 91: [.25, .75, 0, 0, .28889], 93: [.25, .75, 0, 0, .28889], 94: [0, .69444, 0, 0, .5], 95: [.35, .09444, .02778, 0, .5], 97: [0, .44444, 0, 0, .48056], 98: [0, .69444, 0, 0, .51667], 99: [0, .44444, 0, 0, .44445], 100: [0, .69444, 0, 0, .51667], 101: [0, .44444, 0, 0, .44445], 102: [0, .69444, .06944, 0, .30556], 103: [.19444, .44444, .01389, 0, .5], 104: [0, .69444, 0, 0, .51667], 105: [0, .67937, 0, 0, .23889], 106: [.19444, .67937, 0, 0, .26667], 107: [0, .69444, 0, 0, .48889], 108: [0, .69444, 0, 0, .23889], 109: [0, .44444, 0, 0, .79445], 110: [0, .44444, 0, 0, .51667], 111: [0, .44444, 0, 0, .5], 112: [.19444, .44444, 0, 0, .51667], 113: [.19444, .44444, 0, 0, .51667], 114: [0, .44444, .01389, 0, .34167], 115: [0, .44444, 0, 0, .38333], 116: [0, .57143, 0, 0, .36111], 117: [0, .44444, 0, 0, .51667], 118: [0, .44444, .01389, 0, .46111], 119: [0, .44444, .01389, 0, .68334], 120: [0, .44444, 0, 0, .46111], 121: [.19444, .44444, .01389, 0, .46111], 122: [0, .44444, 0, 0, .43472], 126: [.35, .32659, 0, 0, .5], 168: [0, .67937, 0, 0, .5], 176: [0, .69444, 0, 0, .66667], 184: [.17014, 0, 0, 0, .44445], 305: [0, .44444, 0, 0, .23889], 567: [.19444, .44444, 0, 0, .26667], 710: [0, .69444, 0, 0, .5], 711: [0, .63194, 0, 0, .5], 713: [0, .60889, 0, 0, .5], 714: [0, .69444, 0, 0, .5], 715: [0, .69444, 0, 0, .5], 728: [0, .69444, 0, 0, .5], 729: [0, .67937, 0, 0, .27778], 730: [0, .69444, 0, 0, .66667], 732: [0, .67659, 0, 0, .5], 733: [0, .69444, 0, 0, .5], 915: [0, .69444, 0, 0, .54167], 916: [0, .69444, 0, 0, .83334], 920: [0, .69444, 0, 0, .77778], 923: [0, .69444, 0, 0, .61111], 926: [0, .69444, 0, 0, .66667], 928: [0, .69444, 0, 0, .70834], 931: [0, .69444, 0, 0, .72222], 933: [0, .69444, 0, 0, .77778], 934: [0, .69444, 0, 0, .72222], 936: [0, .69444, 0, 0, .77778], 937: [0, .69444, 0, 0, .72222], 8211: [0, .44444, .02778, 0, .5], 8212: [0, .44444, .02778, 0, 1], 8216: [0, .69444, 0, 0, .27778], 8217: [0, .69444, 0, 0, .27778], 8220: [0, .69444, 0, 0, .5], 8221: [0, .69444, 0, 0, .5] }, "Script-Regular": { 65: [0, .7, .22925, 0, .80253], 66: [0, .7, .04087, 0, .90757], 67: [0, .7, .1689, 0, .66619], 68: [0, .7, .09371, 0, .77443], 69: [0, .7, .18583, 0, .56162], 70: [0, .7, .13634, 0, .89544], 71: [0, .7, .17322, 0, .60961], 72: [0, .7, .29694, 0, .96919], 73: [0, .7, .19189, 0, .80907], 74: [.27778, .7, .19189, 0, 1.05159], 75: [0, .7, .31259, 0, .91364], 76: [0, .7, .19189, 0, .87373], 77: [0, .7, .15981, 0, 1.08031], 78: [0, .7, .3525, 0, .9015], 79: [0, .7, .08078, 0, .73787], 80: [0, .7, .08078, 0, 1.01262], 81: [0, .7, .03305, 0, .88282], 82: [0, .7, .06259, 0, .85], 83: [0, .7, .19189, 0, .86767], 84: [0, .7, .29087, 0, .74697], 85: [0, .7, .25815, 0, .79996], 86: [0, .7, .27523, 0, .62204], 87: [0, .7, .27523, 0, .80532], 88: [0, .7, .26006, 0, .94445], 89: [0, .7, .2939, 0, .70961], 90: [0, .7, .24037, 0, .8212] }, "Size1-Regular": { 40: [.35001, .85, 0, 0, .45834], 41: [.35001, .85, 0, 0, .45834], 47: [.35001, .85, 0, 0, .57778], 91: [.35001, .85, 0, 0, .41667], 92: [.35001, .85, 0, 0, .57778], 93: [.35001, .85, 0, 0, .41667], 123: [.35001, .85, 0, 0, .58334], 125: [.35001, .85, 0, 0, .58334], 710: [0, .72222, 0, 0, .55556], 732: [0, .72222, 0, 0, .55556], 770: [0, .72222, 0, 0, .55556], 771: [0, .72222, 0, 0, .55556], 8214: [-99e-5, .601, 0, 0, .77778], 8593: [1e-5, .6, 0, 0, .66667], 8595: [1e-5, .6, 0, 0, .66667], 8657: [1e-5, .6, 0, 0, .77778], 8659: [1e-5, .6, 0, 0, .77778], 8719: [.25001, .75, 0, 0, .94445], 8720: [.25001, .75, 0, 0, .94445], 8721: [.25001, .75, 0, 0, 1.05556], 8730: [.35001, .85, 0, 0, 1], 8739: [-.00599, .606, 0, 0, .33333], 8741: [-.00599, .606, 0, 0, .55556], 8747: [.30612, .805, .19445, 0, .47222], 8748: [.306, .805, .19445, 0, .47222], 8749: [.306, .805, .19445, 0, .47222], 8750: [.30612, .805, .19445, 0, .47222], 8896: [.25001, .75, 0, 0, .83334], 8897: [.25001, .75, 0, 0, .83334], 8898: [.25001, .75, 0, 0, .83334], 8899: [.25001, .75, 0, 0, .83334], 8968: [.35001, .85, 0, 0, .47222], 8969: [.35001, .85, 0, 0, .47222], 8970: [.35001, .85, 0, 0, .47222], 8971: [.35001, .85, 0, 0, .47222], 9168: [-99e-5, .601, 0, 0, .66667], 10216: [.35001, .85, 0, 0, .47222], 10217: [.35001, .85, 0, 0, .47222], 10752: [.25001, .75, 0, 0, 1.11111], 10753: [.25001, .75, 0, 0, 1.11111], 10754: [.25001, .75, 0, 0, 1.11111], 10756: [.25001, .75, 0, 0, .83334], 10758: [.25001, .75, 0, 0, .83334] }, "Size2-Regular": { 40: [.65002, 1.15, 0, 0, .59722], 41: [.65002, 1.15, 0, 0, .59722], 47: [.65002, 1.15, 0, 0, .81111], 91: [.65002, 1.15, 0, 0, .47222], 92: [.65002, 1.15, 0, 0, .81111], 93: [.65002, 1.15, 0, 0, .47222], 123: [.65002, 1.15, 0, 0, .66667], 125: [.65002, 1.15, 0, 0, .66667], 710: [0, .75, 0, 0, 1], 732: [0, .75, 0, 0, 1], 770: [0, .75, 0, 0, 1], 771: [0, .75, 0, 0, 1], 8719: [.55001, 1.05, 0, 0, 1.27778], 8720: [.55001, 1.05, 0, 0, 1.27778], 8721: [.55001, 1.05, 0, 0, 1.44445], 8730: [.65002, 1.15, 0, 0, 1], 8747: [.86225, 1.36, .44445, 0, .55556], 8748: [.862, 1.36, .44445, 0, .55556], 8749: [.862, 1.36, .44445, 0, .55556], 8750: [.86225, 1.36, .44445, 0, .55556], 8896: [.55001, 1.05, 0, 0, 1.11111], 8897: [.55001, 1.05, 0, 0, 1.11111], 8898: [.55001, 1.05, 0, 0, 1.11111], 8899: [.55001, 1.05, 0, 0, 1.11111], 8968: [.65002, 1.15, 0, 0, .52778], 8969: [.65002, 1.15, 0, 0, .52778], 8970: [.65002, 1.15, 0, 0, .52778], 8971: [.65002, 1.15, 0, 0, .52778], 10216: [.65002, 1.15, 0, 0, .61111], 10217: [.65002, 1.15, 0, 0, .61111], 10752: [.55001, 1.05, 0, 0, 1.51112], 10753: [.55001, 1.05, 0, 0, 1.51112], 10754: [.55001, 1.05, 0, 0, 1.51112], 10756: [.55001, 1.05, 0, 0, 1.11111], 10758: [.55001, 1.05, 0, 0, 1.11111] }, "Size3-Regular": { 40: [.95003, 1.45, 0, 0, .73611], 41: [.95003, 1.45, 0, 0, .73611], 47: [.95003, 1.45, 0, 0, 1.04445], 91: [.95003, 1.45, 0, 0, .52778], 92: [.95003, 1.45, 0, 0, 1.04445], 93: [.95003, 1.45, 0, 0, .52778], 123: [.95003, 1.45, 0, 0, .75], 125: [.95003, 1.45, 0, 0, .75], 710: [0, .75, 0, 0, 1.44445], 732: [0, .75, 0, 0, 1.44445], 770: [0, .75, 0, 0, 1.44445], 771: [0, .75, 0, 0, 1.44445], 8730: [.95003, 1.45, 0, 0, 1], 8968: [.95003, 1.45, 0, 0, .58334], 8969: [.95003, 1.45, 0, 0, .58334], 8970: [.95003, 1.45, 0, 0, .58334], 8971: [.95003, 1.45, 0, 0, .58334], 10216: [.95003, 1.45, 0, 0, .75], 10217: [.95003, 1.45, 0, 0, .75] }, "Size4-Regular": { 40: [1.25003, 1.75, 0, 0, .79167], 41: [1.25003, 1.75, 0, 0, .79167], 47: [1.25003, 1.75, 0, 0, 1.27778], 91: [1.25003, 1.75, 0, 0, .58334], 92: [1.25003, 1.75, 0, 0, 1.27778], 93: [1.25003, 1.75, 0, 0, .58334], 123: [1.25003, 1.75, 0, 0, .80556], 125: [1.25003, 1.75, 0, 0, .80556], 710: [0, .825, 0, 0, 1.8889], 732: [0, .825, 0, 0, 1.8889], 770: [0, .825, 0, 0, 1.8889], 771: [0, .825, 0, 0, 1.8889], 8730: [1.25003, 1.75, 0, 0, 1], 8968: [1.25003, 1.75, 0, 0, .63889], 8969: [1.25003, 1.75, 0, 0, .63889], 8970: [1.25003, 1.75, 0, 0, .63889], 8971: [1.25003, 1.75, 0, 0, .63889], 9115: [.64502, 1.155, 0, 0, .875], 9116: [1e-5, .6, 0, 0, .875], 9117: [.64502, 1.155, 0, 0, .875], 9118: [.64502, 1.155, 0, 0, .875], 9119: [1e-5, .6, 0, 0, .875], 9120: [.64502, 1.155, 0, 0, .875], 9121: [.64502, 1.155, 0, 0, .66667], 9122: [-99e-5, .601, 0, 0, .66667], 9123: [.64502, 1.155, 0, 0, .66667], 9124: [.64502, 1.155, 0, 0, .66667], 9125: [-99e-5, .601, 0, 0, .66667], 9126: [.64502, 1.155, 0, 0, .66667], 9127: [1e-5, .9, 0, 0, .88889], 9128: [.65002, 1.15, 0, 0, .88889], 9129: [.90001, 0, 0, 0, .88889], 9130: [0, .3, 0, 0, .88889], 9131: [1e-5, .9, 0, 0, .88889], 9132: [.65002, 1.15, 0, 0, .88889], 9133: [.90001, 0, 0, 0, .88889], 9143: [.88502, .915, 0, 0, 1.05556], 10216: [1.25003, 1.75, 0, 0, .80556], 10217: [1.25003, 1.75, 0, 0, .80556], 57344: [-.00499, .605, 0, 0, 1.05556], 57345: [-.00499, .605, 0, 0, 1.05556], 57680: [0, .12, 0, 0, .45], 57681: [0, .12, 0, 0, .45], 57682: [0, .12, 0, 0, .45], 57683: [0, .12, 0, 0, .45] }, "Typewriter-Regular": { 32: [0, 0, 0, 0, .525], 33: [0, .61111, 0, 0, .525], 34: [0, .61111, 0, 0, .525], 35: [0, .61111, 0, 0, .525], 36: [.08333, .69444, 0, 0, .525], 37: [.08333, .69444, 0, 0, .525], 38: [0, .61111, 0, 0, .525], 39: [0, .61111, 0, 0, .525], 40: [.08333, .69444, 0, 0, .525], 41: [.08333, .69444, 0, 0, .525], 42: [0, .52083, 0, 0, .525], 43: [-.08056, .53055, 0, 0, .525], 44: [.13889, .125, 0, 0, .525], 45: [-.08056, .53055, 0, 0, .525], 46: [0, .125, 0, 0, .525], 47: [.08333, .69444, 0, 0, .525], 48: [0, .61111, 0, 0, .525], 49: [0, .61111, 0, 0, .525], 50: [0, .61111, 0, 0, .525], 51: [0, .61111, 0, 0, .525], 52: [0, .61111, 0, 0, .525], 53: [0, .61111, 0, 0, .525], 54: [0, .61111, 0, 0, .525], 55: [0, .61111, 0, 0, .525], 56: [0, .61111, 0, 0, .525], 57: [0, .61111, 0, 0, .525], 58: [0, .43056, 0, 0, .525], 59: [.13889, .43056, 0, 0, .525], 60: [-.05556, .55556, 0, 0, .525], 61: [-.19549, .41562, 0, 0, .525], 62: [-.05556, .55556, 0, 0, .525], 63: [0, .61111, 0, 0, .525], 64: [0, .61111, 0, 0, .525], 65: [0, .61111, 0, 0, .525], 66: [0, .61111, 0, 0, .525], 67: [0, .61111, 0, 0, .525], 68: [0, .61111, 0, 0, .525], 69: [0, .61111, 0, 0, .525], 70: [0, .61111, 0, 0, .525], 71: [0, .61111, 0, 0, .525], 72: [0, .61111, 0, 0, .525], 73: [0, .61111, 0, 0, .525], 74: [0, .61111, 0, 0, .525], 75: [0, .61111, 0, 0, .525], 76: [0, .61111, 0, 0, .525], 77: [0, .61111, 0, 0, .525], 78: [0, .61111, 0, 0, .525], 79: [0, .61111, 0, 0, .525], 80: [0, .61111, 0, 0, .525], 81: [.13889, .61111, 0, 0, .525], 82: [0, .61111, 0, 0, .525], 83: [0, .61111, 0, 0, .525], 84: [0, .61111, 0, 0, .525], 85: [0, .61111, 0, 0, .525], 86: [0, .61111, 0, 0, .525], 87: [0, .61111, 0, 0, .525], 88: [0, .61111, 0, 0, .525], 89: [0, .61111, 0, 0, .525], 90: [0, .61111, 0, 0, .525], 91: [.08333, .69444, 0, 0, .525], 92: [.08333, .69444, 0, 0, .525], 93: [.08333, .69444, 0, 0, .525], 94: [0, .61111, 0, 0, .525], 95: [.09514, 0, 0, 0, .525], 96: [0, .61111, 0, 0, .525], 97: [0, .43056, 0, 0, .525], 98: [0, .61111, 0, 0, .525], 99: [0, .43056, 0, 0, .525], 100: [0, .61111, 0, 0, .525], 101: [0, .43056, 0, 0, .525], 102: [0, .61111, 0, 0, .525], 103: [.22222, .43056, 0, 0, .525], 104: [0, .61111, 0, 0, .525], 105: [0, .61111, 0, 0, .525], 106: [.22222, .61111, 0, 0, .525], 107: [0, .61111, 0, 0, .525], 108: [0, .61111, 0, 0, .525], 109: [0, .43056, 0, 0, .525], 110: [0, .43056, 0, 0, .525], 111: [0, .43056, 0, 0, .525], 112: [.22222, .43056, 0, 0, .525], 113: [.22222, .43056, 0, 0, .525], 114: [0, .43056, 0, 0, .525], 115: [0, .43056, 0, 0, .525], 116: [0, .55358, 0, 0, .525], 117: [0, .43056, 0, 0, .525], 118: [0, .43056, 0, 0, .525], 119: [0, .43056, 0, 0, .525], 120: [0, .43056, 0, 0, .525], 121: [.22222, .43056, 0, 0, .525], 122: [0, .43056, 0, 0, .525], 123: [.08333, .69444, 0, 0, .525], 124: [.08333, .69444, 0, 0, .525], 125: [.08333, .69444, 0, 0, .525], 126: [0, .61111, 0, 0, .525], 127: [0, .61111, 0, 0, .525], 160: [0, 0, 0, 0, .525], 176: [0, .61111, 0, 0, .525], 184: [.19445, 0, 0, 0, .525], 305: [0, .43056, 0, 0, .525], 567: [.22222, .43056, 0, 0, .525], 711: [0, .56597, 0, 0, .525], 713: [0, .56555, 0, 0, .525], 714: [0, .61111, 0, 0, .525], 715: [0, .61111, 0, 0, .525], 728: [0, .61111, 0, 0, .525], 730: [0, .61111, 0, 0, .525], 770: [0, .61111, 0, 0, .525], 771: [0, .61111, 0, 0, .525], 776: [0, .61111, 0, 0, .525], 915: [0, .61111, 0, 0, .525], 916: [0, .61111, 0, 0, .525], 920: [0, .61111, 0, 0, .525], 923: [0, .61111, 0, 0, .525], 926: [0, .61111, 0, 0, .525], 928: [0, .61111, 0, 0, .525], 931: [0, .61111, 0, 0, .525], 933: [0, .61111, 0, 0, .525], 934: [0, .61111, 0, 0, .525], 936: [0, .61111, 0, 0, .525], 937: [0, .61111, 0, 0, .525], 8216: [0, .61111, 0, 0, .525], 8217: [0, .61111, 0, 0, .525], 8242: [0, .61111, 0, 0, .525], 9251: [.11111, .21944, 0, 0, .525] } },
              D = { slant: [.25, .25, .25], space: [0, 0, 0], stretch: [0, 0, 0], shrink: [0, 0, 0], xHeight: [.431, .431, .431], quad: [1, 1.171, 1.472], extraSpace: [0, 0, 0], num1: [.677, .732, .925], num2: [.394, .384, .387], num3: [.444, .471, .504], denom1: [.686, .752, 1.025], denom2: [.345, .344, .532], sup1: [.413, .503, .504], sup2: [.363, .431, .404], sup3: [.289, .286, .294], sub1: [.15, .143, .2], sub2: [.247, .286, .4], supDrop: [.386, .353, .494], subDrop: [.05, .071, .1], delim1: [2.39, 1.7, 1.98], delim2: [1.01, 1.157, 1.42], axisHeight: [.25, .25, .25], defaultRuleThickness: [.04, .049, .049], bigOpSpacing1: [.111, .111, .111], bigOpSpacing2: [.166, .166, .166], bigOpSpacing3: [.2, .2, .2], bigOpSpacing4: [.6, .611, .611], bigOpSpacing5: [.1, .143, .143], sqrtRuleThickness: [.04, .04, .04], ptPerEm: [10, 10, 10], doubleRuleSep: [.2, .2, .2] },
              P = { "\xc5": "A", "\xc7": "C", "\xd0": "D", "\xde": "o", "\xe5": "a", "\xe7": "c", "\xf0": "d", "\xfe": "o", '\u0410': "A", '\u0411': "B", '\u0412': "B", '\u0413': "F", '\u0414': "A", '\u0415': "E", '\u0416': "K", '\u0417': "3", '\u0418': "N", '\u0419': "N", '\u041A': "K", '\u041B': "N", '\u041C': "M", '\u041D': "H", '\u041E': "O", '\u041F': "N", '\u0420': "P", '\u0421': "C", '\u0422': "T", '\u0423': "y", '\u0424': "O", '\u0425': "X", '\u0426': "U", '\u0427': "h", '\u0428': "W", '\u0429': "W", '\u042A': "B", '\u042B': "X", '\u042C': "B", '\u042D': "3", '\u042E': "X", '\u042F': "R", '\u0430': "a", '\u0431': "b", '\u0432': "a", '\u0433': "r", '\u0434': "y", '\u0435': "e", '\u0436': "m", '\u0437': "e", '\u0438': "n", '\u0439': "n", '\u043A': "n", '\u043B': "n", '\u043C': "m", '\u043D': "n", '\u043E': "o", '\u043F': "n", '\u0440': "p", '\u0441': "c", '\u0442': "o", '\u0443': "y", '\u0444': "b", '\u0445': "x", '\u0446': "n", '\u0447': "n", '\u0448': "w", '\u0449': "w", '\u044A': "a", '\u044B': "m", '\u044C': "a", '\u044D': "e", '\u044E': "m", '\u044F': "r" };function F(e, t, r) {
            if (!H[t]) throw new Error("Font metrics not found for font: " + t + ".");var n = e.charCodeAt(0);e[0] in P && (n = P[e[0]].charCodeAt(0));var i = H[t][n];if (i || "text" !== r || w(n) && (i = H[t][77]), i) return { depth: i[0], height: i[1], italic: i[2], skew: i[3], width: i[4] };
          }var V = {};var U = { bin: 1, close: 1, inner: 1, open: 1, punct: 1, rel: 1 },
              G = { "accent-token": 1, mathord: 1, "op-token": 1, spacing: 1, textord: 1 },
              _ = { math: {}, text: {} },
              W = _;function j(e, t, r, n, i, a) {
            _[e][i] = { font: t, group: r, replace: n }, a && n && (_[e][n] = _[e][i]);
          }var $ = "math",
              Z = "text",
              K = "main",
              J = "ams",
              Q = "accent-token",
              ee = "bin",
              te = "close",
              re = "inner",
              ne = "mathord",
              ie = "op-token",
              ae = "open",
              oe = "punct",
              se = "rel",
              le = "spacing",
              he = "textord";j($, K, se, '\u2261', "\\equiv", !0), j($, K, se, '\u227A', "\\prec", !0), j($, K, se, '\u227B', "\\succ", !0), j($, K, se, '\u223C', "\\sim", !0), j($, K, se, '\u22A5', "\\perp"), j($, K, se, '\u2AAF', "\\preceq", !0), j($, K, se, '\u2AB0', "\\succeq", !0), j($, K, se, '\u2243', "\\simeq", !0), j($, K, se, '\u2223', "\\mid", !0), j($, K, se, '\u226A', "\\ll", !0), j($, K, se, '\u226B', "\\gg", !0), j($, K, se, '\u224D', "\\asymp", !0), j($, K, se, '\u2225', "\\parallel"), j($, K, se, '\u22C8', "\\bowtie", !0), j($, K, se, '\u2323', "\\smile", !0), j($, K, se, '\u2291', "\\sqsubseteq", !0), j($, K, se, '\u2292', "\\sqsupseteq", !0), j($, K, se, '\u2250', "\\doteq", !0), j($, K, se, '\u2322', "\\frown", !0), j($, K, se, '\u220B', "\\ni", !0), j($, K, se, '\u221D', "\\propto", !0), j($, K, se, '\u22A2', "\\vdash", !0), j($, K, se, '\u22A3', "\\dashv", !0), j($, K, se, '\u220B', "\\owns"), j($, K, oe, ".", "\\ldotp"), j($, K, oe, '\u22C5', "\\cdotp"), j($, K, he, "#", "\\#"), j(Z, K, he, "#", "\\#"), j($, K, he, "&", "\\&"), j(Z, K, he, "&", "\\&"), j($, K, he, '\u2135', "\\aleph", !0), j($, K, he, '\u2200', "\\forall", !0), j($, K, he, '\u210F', "\\hbar", !0), j($, K, he, '\u2203', "\\exists", !0), j($, K, he, '\u2207', "\\nabla", !0), j($, K, he, '\u266D', "\\flat", !0), j($, K, he, '\u2113', "\\ell", !0), j($, K, he, '\u266E', "\\natural", !0), j($, K, he, '\u2663', "\\clubsuit", !0), j($, K, he, '\u2118', "\\wp", !0), j($, K, he, '\u266F', "\\sharp", !0), j($, K, he, '\u2662', "\\diamondsuit", !0), j($, K, he, '\u211C', "\\Re", !0), j($, K, he, '\u2661', "\\heartsuit", !0), j($, K, he, '\u2111', "\\Im", !0), j($, K, he, '\u2660', "\\spadesuit", !0), j(Z, K, he, "\xa7", "\\S", !0), j(Z, K, he, "\xb6", "\\P", !0), j($, K, he, '\u2020', "\\dag"), j(Z, K, he, '\u2020', "\\dag"), j(Z, K, he, '\u2020', "\\textdagger"), j($, K, he, '\u2021', "\\ddag"), j(Z, K, he, '\u2021', "\\ddag"), j(Z, K, he, '\u2021', "\\textdaggerdbl"), j($, K, te, '\u23B1', "\\rmoustache", !0), j($, K, ae, '\u23B0', "\\lmoustache", !0), j($, K, te, '\u27EF', "\\rgroup", !0), j($, K, ae, '\u27EE', "\\lgroup", !0), j($, K, ee, '\u2213', "\\mp", !0), j($, K, ee, '\u2296', "\\ominus", !0), j($, K, ee, '\u228E', '\\uplus', !0), j($, K, ee, '\u2293', "\\sqcap", !0), j($, K, ee, '\u2217', "\\ast"), j($, K, ee, '\u2294', "\\sqcup", !0), j($, K, ee, '\u25EF', "\\bigcirc"), j($, K, ee, '\u2219', "\\bullet"), j($, K, ee, '\u2021', "\\ddagger"), j($, K, ee, '\u2240', "\\wr", !0), j($, K, ee, '\u2A3F', "\\amalg"), j($, K, ee, "&", "\\And"), j($, K, se, '\u27F5', "\\longleftarrow", !0), j($, K, se, '\u21D0', "\\Leftarrow", !0), j($, K, se, '\u27F8', "\\Longleftarrow", !0), j($, K, se, '\u27F6', "\\longrightarrow", !0), j($, K, se, '\u21D2', "\\Rightarrow", !0), j($, K, se, '\u27F9', "\\Longrightarrow", !0), j($, K, se, '\u2194', "\\leftrightarrow", !0), j($, K, se, '\u27F7', "\\longleftrightarrow", !0), j($, K, se, '\u21D4', "\\Leftrightarrow", !0), j($, K, se, '\u27FA', "\\Longleftrightarrow", !0), j($, K, se, '\u21A6', "\\mapsto", !0), j($, K, se, '\u27FC', "\\longmapsto", !0), j($, K, se, '\u2197', "\\nearrow", !0), j($, K, se, '\u21A9', "\\hookleftarrow", !0), j($, K, se, '\u21AA', "\\hookrightarrow", !0), j($, K, se, '\u2198', "\\searrow", !0), j($, K, se, '\u21BC', "\\leftharpoonup", !0), j($, K, se, '\u21C0', "\\rightharpoonup", !0), j($, K, se, '\u2199', "\\swarrow", !0), j($, K, se, '\u21BD', "\\leftharpoondown", !0), j($, K, se, '\u21C1', "\\rightharpoondown", !0), j($, K, se, '\u2196', "\\nwarrow", !0), j($, K, se, '\u21CC', "\\rightleftharpoons", !0), j($, J, se, '\u226E', "\\nless", !0), j($, J, se, '\uE010', "\\nleqslant"), j($, J, se, '\uE011', "\\nleqq"), j($, J, se, '\u2A87', "\\lneq", !0), j($, J, se, '\u2268', "\\lneqq", !0), j($, J, se, '\uE00C', "\\lvertneqq"), j($, J, se, '\u22E6', "\\lnsim", !0), j($, J, se, '\u2A89', "\\lnapprox", !0), j($, J, se, '\u2280', "\\nprec", !0), j($, J, se, '\u22E0', "\\npreceq", !0), j($, J, se, '\u22E8', "\\precnsim", !0), j($, J, se, '\u2AB9', "\\precnapprox", !0), j($, J, se, '\u2241', "\\nsim", !0), j($, J, se, '\uE006', "\\nshortmid"), j($, J, se, '\u2224', "\\nmid", !0), j($, J, se, '\u22AC', "\\nvdash", !0), j($, J, se, '\u22AD', "\\nvDash", !0), j($, J, se, '\u22EA', "\\ntriangleleft"), j($, J, se, '\u22EC', "\\ntrianglelefteq", !0), j($, J, se, '\u228A', "\\subsetneq", !0), j($, J, se, '\uE01A', "\\varsubsetneq"), j($, J, se, '\u2ACB', "\\subsetneqq", !0), j($, J, se, '\uE017', "\\varsubsetneqq"), j($, J, se, '\u226F', "\\ngtr", !0), j($, J, se, '\uE00F', "\\ngeqslant"), j($, J, se, '\uE00E', "\\ngeqq"), j($, J, se, '\u2A88', "\\gneq", !0), j($, J, se, '\u2269', "\\gneqq", !0), j($, J, se, '\uE00D', "\\gvertneqq"), j($, J, se, '\u22E7', "\\gnsim", !0), j($, J, se, '\u2A8A', "\\gnapprox", !0), j($, J, se, '\u2281', "\\nsucc", !0), j($, J, se, '\u22E1', "\\nsucceq", !0), j($, J, se, '\u22E9', "\\succnsim", !0), j($, J, se, '\u2ABA', "\\succnapprox", !0), j($, J, se, '\u2246', "\\ncong", !0), j($, J, se, '\uE007', "\\nshortparallel"), j($, J, se, '\u2226', "\\nparallel", !0), j($, J, se, '\u22AF', "\\nVDash", !0), j($, J, se, '\u22EB', "\\ntriangleright"), j($, J, se, '\u22ED', "\\ntrianglerighteq", !0), j($, J, se, '\uE018', "\\nsupseteqq"), j($, J, se, '\u228B', "\\supsetneq", !0), j($, J, se, '\uE01B', "\\varsupsetneq"), j($, J, se, '\u2ACC', "\\supsetneqq", !0), j($, J, se, '\uE019', "\\varsupsetneqq"), j($, J, se, '\u22AE', "\\nVdash", !0), j($, J, se, '\u2AB5', "\\precneqq", !0), j($, J, se, '\u2AB6', "\\succneqq", !0), j($, J, se, '\uE016', "\\nsubseteqq"), j($, J, ee, '\u22B4', '\\unlhd'), j($, J, ee, '\u22B5', '\\unrhd'), j($, J, se, '\u219A', "\\nleftarrow", !0), j($, J, se, '\u219B', "\\nrightarrow", !0), j($, J, se, '\u21CD', "\\nLeftarrow", !0), j($, J, se, '\u21CF', "\\nRightarrow", !0), j($, J, se, '\u21AE', "\\nleftrightarrow", !0), j($, J, se, '\u21CE', "\\nLeftrightarrow", !0), j($, J, se, '\u25B3', "\\vartriangle"), j($, J, he, '\u210F', "\\hslash"), j($, J, he, '\u25BD', "\\triangledown"), j($, J, he, '\u25CA', "\\lozenge"), j($, J, he, '\u24C8', "\\circledS"), j($, J, he, "\xae", "\\circledR"), j(Z, J, he, "\xae", "\\circledR"), j($, J, he, '\u2221', "\\measuredangle", !0), j($, J, he, '\u2204', "\\nexists"), j($, J, he, '\u2127', "\\mho"), j($, J, he, '\u2132', "\\Finv", !0), j($, J, he, '\u2141', "\\Game", !0), j($, J, he, "k", "\\Bbbk"), j($, J, he, '\u2035', "\\backprime"), j($, J, he, '\u25B2', "\\blacktriangle"), j($, J, he, '\u25BC', "\\blacktriangledown"), j($, J, he, '\u25A0', "\\blacksquare"), j($, J, he, '\u29EB', "\\blacklozenge"), j($, J, he, '\u2605', "\\bigstar"), j($, J, he, '\u2222', "\\sphericalangle", !0), j($, J, he, '\u2201', "\\complement", !0), j($, J, he, "\xf0", "\\eth", !0), j($, J, he, '\u2571', "\\diagup"), j($, J, he, '\u2572', "\\diagdown"), j($, J, he, '\u25A1', "\\square"), j($, J, he, '\u25A1', "\\Box"), j($, J, he, '\u25CA', "\\Diamond"), j($, J, he, "\xa5", "\\yen", !0), j(Z, J, he, "\xa5", "\\yen", !0), j($, J, he, '\u2713', "\\checkmark", !0), j(Z, J, he, '\u2713', "\\checkmark"), j($, J, he, '\u2136', "\\beth", !0), j($, J, he, '\u2138', "\\daleth", !0), j($, J, he, '\u2137', "\\gimel", !0), j($, J, he, '\u03DD', "\\digamma"), j($, J, he, '\u03F0', "\\varkappa"), j($, J, ae, '\u250C', '\\ulcorner', !0), j($, J, te, '\u2510', '\\urcorner', !0), j($, J, ae, '\u2514', "\\llcorner", !0), j($, J, te, '\u2518', "\\lrcorner", !0), j($, J, se, '\u2266', "\\leqq", !0), j($, J, se, '\u2A7D', "\\leqslant", !0), j($, J, se, '\u2A95', "\\eqslantless", !0), j($, J, se, '\u2272', "\\lesssim", !0), j($, J, se, '\u2A85', "\\lessapprox", !0), j($, J, se, '\u224A', "\\approxeq", !0), j($, J, ee, '\u22D6', "\\lessdot"), j($, J, se, '\u22D8', "\\lll", !0), j($, J, se, '\u2276', "\\lessgtr", !0), j($, J, se, '\u22DA', "\\lesseqgtr", !0), j($, J, se, '\u2A8B', "\\lesseqqgtr", !0), j($, J, se, '\u2251', "\\doteqdot"), j($, J, se, '\u2253', "\\risingdotseq", !0), j($, J, se, '\u2252', "\\fallingdotseq", !0), j($, J, se, '\u223D', "\\backsim", !0), j($, J, se, '\u22CD', "\\backsimeq", !0), j($, J, se, '\u2AC5', "\\subseteqq", !0), j($, J, se, '\u22D0', "\\Subset", !0), j($, J, se, '\u228F', "\\sqsubset", !0), j($, J, se, '\u227C', "\\preccurlyeq", !0), j($, J, se, '\u22DE', "\\curlyeqprec", !0), j($, J, se, '\u227E', "\\precsim", !0), j($, J, se, '\u2AB7', "\\precapprox", !0), j($, J, se, '\u22B2', "\\vartriangleleft"), j($, J, se, '\u22B4', "\\trianglelefteq"), j($, J, se, '\u22A8', "\\vDash", !0), j($, J, se, '\u22AA', "\\Vvdash", !0), j($, J, se, '\u2323', "\\smallsmile"), j($, J, se, '\u2322', "\\smallfrown"), j($, J, se, '\u224F', "\\bumpeq", !0), j($, J, se, '\u224E', "\\Bumpeq", !0), j($, J, se, '\u2267', "\\geqq", !0), j($, J, se, '\u2A7E', "\\geqslant", !0), j($, J, se, '\u2A96', "\\eqslantgtr", !0), j($, J, se, '\u2273', "\\gtrsim", !0), j($, J, se, '\u2A86', "\\gtrapprox", !0), j($, J, ee, '\u22D7', "\\gtrdot"), j($, J, se, '\u22D9', "\\ggg", !0), j($, J, se, '\u2277', "\\gtrless", !0), j($, J, se, '\u22DB', "\\gtreqless", !0), j($, J, se, '\u2A8C', "\\gtreqqless", !0), j($, J, se, '\u2256', "\\eqcirc", !0), j($, J, se, '\u2257', "\\circeq", !0), j($, J, se, '\u225C', "\\triangleq", !0), j($, J, se, '\u223C', "\\thicksim"), j($, J, se, '\u2248', "\\thickapprox"), j($, J, se, '\u2AC6', "\\supseteqq", !0), j($, J, se, '\u22D1', "\\Supset", !0), j($, J, se, '\u2290', "\\sqsupset", !0), j($, J, se, '\u227D', "\\succcurlyeq", !0), j($, J, se, '\u22DF', "\\curlyeqsucc", !0), j($, J, se, '\u227F', "\\succsim", !0), j($, J, se, '\u2AB8', "\\succapprox", !0), j($, J, se, '\u22B3', "\\vartriangleright"), j($, J, se, '\u22B5', "\\trianglerighteq"), j($, J, se, '\u22A9', "\\Vdash", !0), j($, J, se, '\u2223', "\\shortmid"), j($, J, se, '\u2225', "\\shortparallel"), j($, J, se, '\u226C', "\\between", !0), j($, J, se, '\u22D4', "\\pitchfork", !0), j($, J, se, '\u221D', "\\varpropto"), j($, J, se, '\u25C0', "\\blacktriangleleft"), j($, J, se, '\u2234', "\\therefore", !0), j($, J, se, '\u220D', "\\backepsilon"), j($, J, se, '\u25B6', "\\blacktriangleright"), j($, J, se, '\u2235', "\\because", !0), j($, J, se, '\u22D8', "\\llless"), j($, J, se, '\u22D9', "\\gggtr"), j($, J, ee, '\u22B2', "\\lhd"), j($, J, ee, '\u22B3', "\\rhd"), j($, J, se, '\u2242', "\\eqsim", !0), j($, K, se, '\u22C8', "\\Join"), j($, J, se, '\u2251', "\\Doteq", !0), j($, J, ee, '\u2214', "\\dotplus", !0), j($, J, ee, '\u2216', "\\smallsetminus"), j($, J, ee, '\u22D2', "\\Cap", !0), j($, J, ee, '\u22D3', "\\Cup", !0), j($, J, ee, '\u2A5E', "\\doublebarwedge", !0), j($, J, ee, '\u229F', "\\boxminus", !0), j($, J, ee, '\u229E', "\\boxplus", !0), j($, J, ee, '\u22C7', "\\divideontimes", !0), j($, J, ee, '\u22C9', "\\ltimes", !0), j($, J, ee, '\u22CA', "\\rtimes", !0), j($, J, ee, '\u22CB', "\\leftthreetimes", !0), j($, J, ee, '\u22CC', "\\rightthreetimes", !0), j($, J, ee, '\u22CF', "\\curlywedge", !0), j($, J, ee, '\u22CE', "\\curlyvee", !0), j($, J, ee, '\u229D', "\\circleddash", !0), j($, J, ee, '\u229B', "\\circledast", !0), j($, J, ee, '\u22C5', "\\centerdot"), j($, J, ee, '\u22BA', "\\intercal", !0), j($, J, ee, '\u22D2', "\\doublecap"), j($, J, ee, '\u22D3', "\\doublecup"), j($, J, ee, '\u22A0', "\\boxtimes", !0), j($, J, se, '\u21E2', "\\dashrightarrow", !0), j($, J, se, '\u21E0', "\\dashleftarrow", !0), j($, J, se, '\u21C7', "\\leftleftarrows", !0), j($, J, se, '\u21C6', "\\leftrightarrows", !0), j($, J, se, '\u21DA', "\\Lleftarrow", !0), j($, J, se, '\u219E', "\\twoheadleftarrow", !0), j($, J, se, '\u21A2', "\\leftarrowtail", !0), j($, J, se, '\u21AB', "\\looparrowleft", !0), j($, J, se, '\u21CB', "\\leftrightharpoons", !0), j($, J, se, '\u21B6', "\\curvearrowleft", !0), j($, J, se, '\u21BA', "\\circlearrowleft", !0), j($, J, se, '\u21B0', "\\Lsh", !0), j($, J, se, '\u21C8', '\\upuparrows', !0), j($, J, se, '\u21BF', '\\upharpoonleft', !0), j($, J, se, '\u21C3', "\\downharpoonleft", !0), j($, J, se, '\u22B8', "\\multimap", !0), j($, J, se, '\u21AD', "\\leftrightsquigarrow", !0), j($, J, se, '\u21C9', "\\rightrightarrows", !0), j($, J, se, '\u21C4', "\\rightleftarrows", !0), j($, J, se, '\u21A0', "\\twoheadrightarrow", !0), j($, J, se, '\u21A3', "\\rightarrowtail", !0), j($, J, se, '\u21AC', "\\looparrowright", !0), j($, J, se, '\u21B7', "\\curvearrowright", !0), j($, J, se, '\u21BB', "\\circlearrowright", !0), j($, J, se, '\u21B1', "\\Rsh", !0), j($, J, se, '\u21CA', "\\downdownarrows", !0), j($, J, se, '\u21BE', '\\upharpoonright', !0), j($, J, se, '\u21C2', "\\downharpoonright", !0), j($, J, se, '\u21DD', "\\rightsquigarrow", !0), j($, J, se, '\u21DD', "\\leadsto"), j($, J, se, '\u21DB', "\\Rrightarrow", !0), j($, J, se, '\u21BE', "\\restriction"), j($, K, he, '\u2018', "`"), j($, K, he, "$", "\\$"), j(Z, K, he, "$", "\\$"), j(Z, K, he, "$", "\\textdollar"), j($, K, he, "%", "\\%"), j(Z, K, he, "%", "\\%"), j($, K, he, "_", "\\_"), j(Z, K, he, "_", "\\_"), j(Z, K, he, "_", "\\textunderscore"), j($, K, he, '\u2220', "\\angle", !0), j($, K, he, '\u221E', "\\infty", !0), j($, K, he, '\u2032', "\\prime"), j($, K, he, '\u25B3', "\\triangle"), j($, K, he, '\u0393', "\\Gamma", !0), j($, K, he, '\u0394', "\\Delta", !0), j($, K, he, '\u0398', "\\Theta", !0), j($, K, he, '\u039B', "\\Lambda", !0), j($, K, he, '\u039E', "\\Xi", !0), j($, K, he, '\u03A0', "\\Pi", !0), j($, K, he, '\u03A3', "\\Sigma", !0), j($, K, he, '\u03A5', '\\Upsilon', !0), j($, K, he, '\u03A6', "\\Phi", !0), j($, K, he, '\u03A8', "\\Psi", !0), j($, K, he, '\u03A9', "\\Omega", !0), j($, K, he, "A", '\u0391'), j($, K, he, "B", '\u0392'), j($, K, he, "E", '\u0395'), j($, K, he, "Z", '\u0396'), j($, K, he, "H", '\u0397'), j($, K, he, "I", '\u0399'), j($, K, he, "K", '\u039A'), j($, K, he, "M", '\u039C'), j($, K, he, "N", '\u039D'), j($, K, he, "O", '\u039F'), j($, K, he, "P", '\u03A1'), j($, K, he, "T", '\u03A4'), j($, K, he, "X", '\u03A7'), j($, K, he, "\xac", "\\neg", !0), j($, K, he, "\xac", "\\lnot"), j($, K, he, '\u22A4', "\\top"), j($, K, he, '\u22A5', "\\bot"), j($, K, he, '\u2205', "\\emptyset"), j($, J, he, '\u2205', "\\varnothing"), j($, K, ne, '\u03B1', "\\alpha", !0), j($, K, ne, '\u03B2', "\\beta", !0), j($, K, ne, '\u03B3', "\\gamma", !0), j($, K, ne, '\u03B4', "\\delta", !0), j($, K, ne, '\u03F5', "\\epsilon", !0), j($, K, ne, '\u03B6', "\\zeta", !0), j($, K, ne, '\u03B7', "\\eta", !0), j($, K, ne, '\u03B8', "\\theta", !0), j($, K, ne, '\u03B9', "\\iota", !0), j($, K, ne, '\u03BA', "\\kappa", !0), j($, K, ne, '\u03BB', "\\lambda", !0), j($, K, ne, '\u03BC', "\\mu", !0), j($, K, ne, '\u03BD', "\\nu", !0), j($, K, ne, '\u03BE', "\\xi", !0), j($, K, ne, '\u03BF', "\\omicron", !0), j($, K, ne, '\u03C0', "\\pi", !0), j($, K, ne, '\u03C1', "\\rho", !0), j($, K, ne, '\u03C3', "\\sigma", !0), j($, K, ne, '\u03C4', "\\tau", !0), j($, K, ne, '\u03C5', '\\upsilon', !0), j($, K, ne, '\u03D5', "\\phi", !0), j($, K, ne, '\u03C7', "\\chi", !0), j($, K, ne, '\u03C8', "\\psi", !0), j($, K, ne, '\u03C9', "\\omega", !0), j($, K, ne, '\u03B5', "\\varepsilon", !0), j($, K, ne, '\u03D1', "\\vartheta", !0), j($, K, ne, '\u03D6', "\\varpi", !0), j($, K, ne, '\u03F1', "\\varrho", !0), j($, K, ne, '\u03C2', "\\varsigma", !0), j($, K, ne, '\u03C6', "\\varphi", !0), j($, K, ee, '\u2217', "*"), j($, K, ee, "+", "+"), j($, K, ee, '\u2212', "-"), j($, K, ee, '\u22C5', "\\cdot", !0), j($, K, ee, '\u2218', "\\circ"), j($, K, ee, "\xf7", "\\div", !0), j($, K, ee, "\xb1", "\\pm", !0), j($, K, ee, "\xd7", "\\times", !0), j($, K, ee, '\u2229', "\\cap", !0), j($, K, ee, '\u222A', "\\cup", !0), j($, K, ee, '\u2216', "\\setminus"), j($, K, ee, '\u2227', "\\land"), j($, K, ee, '\u2228', "\\lor"), j($, K, ee, '\u2227', "\\wedge", !0), j($, K, ee, '\u2228', "\\vee", !0), j($, K, he, '\u221A', "\\surd"), j($, K, ae, "(", "("), j($, K, ae, "[", "["), j($, K, ae, '\u27E8', "\\langle", !0), j($, K, ae, '\u2223', "\\lvert"), j($, K, ae, '\u2225', "\\lVert"), j($, K, te, ")", ")"), j($, K, te, "]", "]"), j($, K, te, "?", "?"), j($, K, te, "!", "!"), j($, K, te, '\u27E9', "\\rangle", !0), j($, K, te, '\u2223', "\\rvert"), j($, K, te, '\u2225', "\\rVert"), j($, K, se, "=", "="), j($, K, se, "<", "<"), j($, K, se, ">", ">"), j($, K, se, ":", ":"), j($, K, se, '\u2248', "\\approx", !0), j($, K, se, '\u2245', "\\cong", !0), j($, K, se, '\u2265', "\\ge"), j($, K, se, '\u2265', "\\geq", !0), j($, K, se, '\u2190', "\\gets"), j($, K, se, ">", "\\gt"), j($, K, se, '\u2208', "\\in", !0), j($, K, se, '\u0338', "\\@not"), j($, K, se, '\u2282', "\\subset", !0), j($, K, se, '\u2283', "\\supset", !0), j($, K, se, '\u2286', "\\subseteq", !0), j($, K, se, '\u2287', "\\supseteq", !0), j($, J, se, '\u2288', "\\nsubseteq", !0), j($, J, se, '\u2289', "\\nsupseteq", !0), j($, K, se, '\u22A8', "\\models"), j($, K, se, '\u2190', "\\leftarrow", !0), j($, K, se, '\u2264', "\\le"), j($, K, se, '\u2264', "\\leq", !0), j($, K, se, "<", "\\lt"), j($, K, se, '\u2192', "\\rightarrow", !0), j($, K, se, '\u2192', "\\to"), j($, J, se, '\u2271', "\\ngeq", !0), j($, J, se, '\u2270', "\\nleq", !0), j($, K, le, "\xa0", "\\ "), j($, K, le, "\xa0", "~"), j($, K, le, "\xa0", "\\space"), j($, K, le, "\xa0", "\\nobreakspace"), j(Z, K, le, "\xa0", "\\ "), j(Z, K, le, "\xa0", "~"), j(Z, K, le, "\xa0", "\\space"), j(Z, K, le, "\xa0", "\\nobreakspace"), j($, K, le, null, "\\nobreak"), j($, K, le, null, "\\allowbreak"), j($, K, oe, ",", ","), j($, K, oe, ";", ";"), j($, J, ee, '\u22BC', "\\barwedge", !0), j($, J, ee, '\u22BB', "\\veebar", !0), j($, K, ee, '\u2299', "\\odot", !0), j($, K, ee, '\u2295', "\\oplus", !0), j($, K, ee, '\u2297', "\\otimes", !0), j($, K, he, '\u2202', "\\partial", !0), j($, K, ee, '\u2298', "\\oslash", !0), j($, J, ee, '\u229A', "\\circledcirc", !0), j($, J, ee, '\u22A1', "\\boxdot", !0), j($, K, ee, '\u25B3', "\\bigtriangleup"), j($, K, ee, '\u25BD', "\\bigtriangledown"), j($, K, ee, '\u2020', "\\dagger"), j($, K, ee, '\u22C4', "\\diamond"), j($, K, ee, '\u22C6', "\\star"), j($, K, ee, '\u25C3', "\\triangleleft"), j($, K, ee, '\u25B9', "\\triangleright"), j($, K, ae, "{", "\\{"), j(Z, K, he, "{", "\\{"), j(Z, K, he, "{", "\\textbraceleft"), j($, K, te, "}", "\\}"), j(Z, K, he, "}", "\\}"), j(Z, K, he, "}", "\\textbraceright"), j($, K, ae, "{", "\\lbrace"), j($, K, te, "}", "\\rbrace"), j($, K, ae, "[", "\\lbrack"), j(Z, K, he, "[", "\\lbrack"), j($, K, te, "]", "\\rbrack"), j(Z, K, he, "]", "\\rbrack"), j($, K, ae, "(", "\\lparen"), j($, K, te, ")", "\\rparen"), j(Z, K, he, "<", "\\textless"), j(Z, K, he, ">", "\\textgreater"), j($, K, ae, '\u230A', "\\lfloor", !0), j($, K, te, '\u230B', "\\rfloor", !0), j($, K, ae, '\u2308', "\\lceil", !0), j($, K, te, '\u2309', "\\rceil", !0), j($, K, he, "\\", "\\backslash"), j($, K, he, '\u2223', "|"), j($, K, he, '\u2223', "\\vert"), j(Z, K, he, "|", "\\textbar"), j($, K, he, '\u2225', "\\|"), j($, K, he, '\u2225', "\\Vert"), j(Z, K, he, '\u2225', "\\textbardbl"), j(Z, K, he, "~", "\\textasciitilde"), j($, K, se, '\u2191', '\\uparrow', !0), j($, K, se, '\u21D1', '\\Uparrow', !0), j($, K, se, '\u2193', "\\downarrow", !0), j($, K, se, '\u21D3', "\\Downarrow", !0), j($, K, se, '\u2195', '\\updownarrow', !0), j($, K, se, '\u21D5', '\\Updownarrow', !0), j($, K, ie, '\u2210', "\\coprod"), j($, K, ie, '\u22C1', "\\bigvee"), j($, K, ie, '\u22C0', "\\bigwedge"), j($, K, ie, '\u2A04', "\\biguplus"), j($, K, ie, '\u22C2', "\\bigcap"), j($, K, ie, '\u22C3', "\\bigcup"), j($, K, ie, '\u222B', "\\int"), j($, K, ie, '\u222B', "\\intop"), j($, K, ie, '\u222C', "\\iint"), j($, K, ie, '\u222D', "\\iiint"), j($, K, ie, '\u220F', "\\prod"), j($, K, ie, '\u2211', "\\sum"), j($, K, ie, '\u2A02', "\\bigotimes"), j($, K, ie, '\u2A01', "\\bigoplus"), j($, K, ie, '\u2A00', "\\bigodot"), j($, K, ie, '\u222E', "\\oint"), j($, K, ie, '\u222F', "\\oiint"), j($, K, ie, '\u2230', "\\oiiint"), j($, K, ie, '\u2A06', "\\bigsqcup"), j($, K, ie, '\u222B', "\\smallint"), j(Z, K, re, '\u2026', "\\textellipsis"), j($, K, re, '\u2026', "\\mathellipsis"), j(Z, K, re, '\u2026', "\\ldots", !0), j($, K, re, '\u2026', "\\ldots", !0), j($, K, re, '\u22EF', "\\@cdots", !0), j($, K, re, '\u22F1', "\\ddots", !0), j($, K, he, '\u22EE', "\\varvdots"), j($, K, Q, '\u02CA', "\\acute"), j($, K, Q, '\u02CB', "\\grave"), j($, K, Q, "\xa8", "\\ddot"), j($, K, Q, "~", "\\tilde"), j($, K, Q, '\u02C9', "\\bar"), j($, K, Q, '\u02D8', "\\breve"), j($, K, Q, '\u02C7', "\\check"), j($, K, Q, "^", "\\hat"), j($, K, Q, '\u20D7', "\\vec"), j($, K, Q, '\u02D9', "\\dot"), j($, K, Q, '\u02DA', "\\mathring"), j($, K, ne, '\u0131', "\\imath", !0), j($, K, ne, '\u0237', "\\jmath", !0), j(Z, K, he, '\u0131', "\\i", !0), j(Z, K, he, '\u0237', "\\j", !0), j(Z, K, he, "\xdf", "\\ss", !0), j(Z, K, he, "\xe6", "\\ae", !0), j(Z, K, he, "\xe6", "\\ae", !0), j(Z, K, he, '\u0153', "\\oe", !0), j(Z, K, he, "\xf8", "\\o", !0), j(Z, K, he, "\xc6", "\\AE", !0), j(Z, K, he, '\u0152', "\\OE", !0), j(Z, K, he, "\xd8", "\\O", !0), j(Z, K, Q, '\u02CA', "\\'"), j(Z, K, Q, '\u02CB', "\\`"), j(Z, K, Q, '\u02C6', "\\^"), j(Z, K, Q, '\u02DC', "\\~"), j(Z, K, Q, '\u02C9', "\\="), j(Z, K, Q, '\u02D8', '\\u'), j(Z, K, Q, '\u02D9', "\\."), j(Z, K, Q, '\u02DA', "\\r"), j(Z, K, Q, '\u02C7', "\\v"), j(Z, K, Q, "\xa8", '\\"'), j(Z, K, Q, '\u02DD', "\\H"), j(Z, K, Q, '\u25EF', "\\textcircled");var me = { "--": !0, "---": !0, "``": !0, "''": !0 };j(Z, K, he, '\u2013', "--"), j(Z, K, he, '\u2013', "\\textendash"), j(Z, K, he, '\u2014', "---"), j(Z, K, he, '\u2014', "\\textemdash"), j(Z, K, he, '\u2018', "`"), j(Z, K, he, '\u2018', "\\textquoteleft"), j(Z, K, he, '\u2019', "'"), j(Z, K, he, '\u2019', "\\textquoteright"), j(Z, K, he, '\u201C', "``"), j(Z, K, he, '\u201C', "\\textquotedblleft"), j(Z, K, he, '\u201D', "''"), j(Z, K, he, '\u201D', "\\textquotedblright"), j($, K, he, "\xb0", "\\degree", !0), j(Z, K, he, "\xb0", "\\degree"), j(Z, K, he, "\xb0", "\\textdegree", !0), j($, K, ne, "\xa3", "\\pounds"), j($, K, ne, "\xa3", "\\mathsterling", !0), j(Z, K, ne, "\xa3", "\\pounds"), j(Z, K, ne, "\xa3", "\\textsterling", !0), j($, J, he, '\u2720', "\\maltese"), j(Z, J, he, '\u2720', "\\maltese"), j(Z, K, le, "\xa0", "\\ "), j(Z, K, le, "\xa0", " "), j(Z, K, le, "\xa0", "~");for (var ce = '0123456789/@."', ue = 0; ue < ce.length; ue++) {
            var pe = ce.charAt(ue);j($, K, he, pe, pe);
          }for (var de = '0123456789!@*()-=+[]<>|";:?/.,', fe = 0; fe < de.length; fe++) {
            var ge = de.charAt(fe);j(Z, K, he, ge, ge);
          }for (var ve = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", ye = 0; ye < ve.length; ye++) {
            var be = ve.charAt(ye);j($, K, ne, be, be), j(Z, K, he, be, be);
          }j($, J, he, "C", '\u2102'), j(Z, J, he, "C", '\u2102'), j($, J, he, "H", '\u210D'), j(Z, J, he, "H", '\u210D'), j($, J, he, "N", '\u2115'), j(Z, J, he, "N", '\u2115'), j($, J, he, "P", '\u2119'), j(Z, J, he, "P", '\u2119'), j($, J, he, "Q", '\u211A'), j(Z, J, he, "Q", '\u211A'), j($, J, he, "R", '\u211D'), j(Z, J, he, "R", '\u211D'), j($, J, he, "Z", '\u2124'), j(Z, J, he, "Z", '\u2124'), j($, K, ne, "h", '\u210E'), j(Z, K, ne, "h", '\u210E');for (var xe = "", we = 0; we < ve.length; we++) {
            var ke = ve.charAt(we);j($, K, ne, ke, xe = String.fromCharCode(55349, 56320 + we)), j(Z, K, he, ke, xe), j($, K, ne, ke, xe = String.fromCharCode(55349, 56372 + we)), j(Z, K, he, ke, xe), j($, K, ne, ke, xe = String.fromCharCode(55349, 56424 + we)), j(Z, K, he, ke, xe), j($, K, ne, ke, xe = String.fromCharCode(55349, 56580 + we)), j(Z, K, he, ke, xe), j($, K, ne, ke, xe = String.fromCharCode(55349, 56736 + we)), j(Z, K, he, ke, xe), j($, K, ne, ke, xe = String.fromCharCode(55349, 56788 + we)), j(Z, K, he, ke, xe), j($, K, ne, ke, xe = String.fromCharCode(55349, 56840 + we)), j(Z, K, he, ke, xe), j($, K, ne, ke, xe = String.fromCharCode(55349, 56944 + we)), j(Z, K, he, ke, xe), we < 26 && (j($, K, ne, ke, xe = String.fromCharCode(55349, 56632 + we)), j(Z, K, he, ke, xe), j($, K, ne, ke, xe = String.fromCharCode(55349, 56476 + we)), j(Z, K, he, ke, xe));
          }j($, K, ne, "k", xe = String.fromCharCode(55349, 56668)), j(Z, K, he, "k", xe);for (var Se = 0; Se < 10; Se++) {
            var ze = Se.toString();j($, K, ne, ze, xe = String.fromCharCode(55349, 57294 + Se)), j(Z, K, he, ze, xe), j($, K, ne, ze, xe = String.fromCharCode(55349, 57314 + Se)), j(Z, K, he, ze, xe), j($, K, ne, ze, xe = String.fromCharCode(55349, 57324 + Se)), j(Z, K, he, ze, xe), j($, K, ne, ze, xe = String.fromCharCode(55349, 57334 + Se)), j(Z, K, he, ze, xe);
          }for (var Me = "\xc7\xd0\xde\xe7\xfe", Te = 0; Te < Me.length; Te++) {
            var Ae = Me.charAt(Te);j($, K, ne, Ae, Ae), j(Z, K, he, Ae, Ae);
          }j(Z, K, he, "\xf0", "\xf0"), j(Z, K, he, '\u2013', '\u2013'), j(Z, K, he, '\u2014', '\u2014'), j(Z, K, he, '\u2018', '\u2018'), j(Z, K, he, '\u2019', '\u2019'), j(Z, K, he, '\u201C', '\u201C'), j(Z, K, he, '\u201D', '\u201D');var Be = [["mathbf", "textbf", "Main-Bold"], ["mathbf", "textbf", "Main-Bold"], ["mathdefault", "textit", "Math-Italic"], ["mathdefault", "textit", "Math-Italic"], ["boldsymbol", "boldsymbol", "Main-BoldItalic"], ["boldsymbol", "boldsymbol", "Main-BoldItalic"], ["mathscr", "textscr", "Script-Regular"], ["", "", ""], ["", "", ""], ["", "", ""], ["mathfrak", "textfrak", "Fraktur-Regular"], ["mathfrak", "textfrak", "Fraktur-Regular"], ["mathbb", "textbb", "AMS-Regular"], ["mathbb", "textbb", "AMS-Regular"], ["", "", ""], ["", "", ""], ["mathsf", "textsf", "SansSerif-Regular"], ["mathsf", "textsf", "SansSerif-Regular"], ["mathboldsf", "textboldsf", "SansSerif-Bold"], ["mathboldsf", "textboldsf", "SansSerif-Bold"], ["mathitsf", "textitsf", "SansSerif-Italic"], ["mathitsf", "textitsf", "SansSerif-Italic"], ["", "", ""], ["", "", ""], ["mathtt", "texttt", "Typewriter-Regular"], ["mathtt", "texttt", "Typewriter-Regular"]],
              Ce = [["mathbf", "textbf", "Main-Bold"], ["", "", ""], ["mathsf", "textsf", "SansSerif-Regular"], ["mathboldsf", "textboldsf", "SansSerif-Bold"], ["mathtt", "texttt", "Typewriter-Regular"]],
              Ne = [[1, 1, 1], [2, 1, 1], [3, 1, 1], [4, 2, 1], [5, 2, 1], [6, 3, 1], [7, 4, 2], [8, 6, 3], [9, 7, 6], [10, 8, 7], [11, 10, 9]],
              qe = [.5, .6, .7, .8, .9, 1, 1.2, 1.44, 1.728, 2.074, 2.488],
              Ee = function Ee(e, t) {
            return t.size < 2 ? e : Ne[e - 1][t.size - 1];
          },
              Oe = function () {
            function n(e) {
              this.style = void 0, this.color = void 0, this.size = void 0, this.textSize = void 0, this.phantom = void 0, this.font = void 0, this.fontFamily = void 0, this.fontWeight = void 0, this.fontShape = void 0, this.sizeMultiplier = void 0, this.maxSize = void 0, this._fontMetrics = void 0, this.style = e.style, this.color = e.color, this.size = e.size || n.BASESIZE, this.textSize = e.textSize || this.size, this.phantom = !!e.phantom, this.font = e.font || "", this.fontFamily = e.fontFamily || "", this.fontWeight = e.fontWeight || "", this.fontShape = e.fontShape || "", this.sizeMultiplier = qe[this.size - 1], this.maxSize = e.maxSize, this._fontMetrics = void 0;
            }var e = n.prototype;return e.extend = function (e) {
              var t = { style: this.style, size: this.size, textSize: this.textSize, color: this.color, phantom: this.phantom, font: this.font, fontFamily: this.fontFamily, fontWeight: this.fontWeight, fontShape: this.fontShape, maxSize: this.maxSize };for (var r in e) {
                e.hasOwnProperty(r) && (t[r] = e[r]);
              }return new n(t);
            }, e.havingStyle = function (e) {
              return this.style === e ? this : this.extend({ style: e, size: Ee(this.textSize, e) });
            }, e.havingCrampedStyle = function () {
              return this.havingStyle(this.style.cramp());
            }, e.havingSize = function (e) {
              return this.size === e && this.textSize === e ? this : this.extend({ style: this.style.text(), size: e, textSize: e, sizeMultiplier: qe[e - 1] });
            }, e.havingBaseStyle = function (e) {
              e = e || this.style.text();var t = Ee(n.BASESIZE, e);return this.size === t && this.textSize === n.BASESIZE && this.style === e ? this : this.extend({ style: e, size: t });
            }, e.havingBaseSizing = function () {
              var e;switch (this.style.id) {case 4:case 5:
                  e = 3;break;case 6:case 7:
                  e = 1;break;default:
                  e = 6;}return this.extend({ style: this.style.text(), size: e });
            }, e.withColor = function (e) {
              return this.extend({ color: e });
            }, e.withPhantom = function () {
              return this.extend({ phantom: !0 });
            }, e.withFont = function (e) {
              return this.extend({ font: e });
            }, e.withTextFontFamily = function (e) {
              return this.extend({ fontFamily: e, font: "" });
            }, e.withTextFontWeight = function (e) {
              return this.extend({ fontWeight: e, font: "" });
            }, e.withTextFontShape = function (e) {
              return this.extend({ fontShape: e, font: "" });
            }, e.sizingClasses = function (e) {
              return e.size !== this.size ? ["sizing", "reset-size" + e.size, "size" + this.size] : [];
            }, e.baseSizingClasses = function () {
              return this.size !== n.BASESIZE ? ["sizing", "reset-size" + this.size, "size" + n.BASESIZE] : [];
            }, e.fontMetrics = function () {
              return this._fontMetrics || (this._fontMetrics = function (e) {
                var t;if (!V[t = 5 <= e ? 0 : 3 <= e ? 1 : 2]) {
                  var r = V[t] = { cssEmPerMu: D.quad[t] / 18 };for (var n in D) {
                    D.hasOwnProperty(n) && (r[n] = D[n][t]);
                  }
                }return V[t];
              }(this.size)), this._fontMetrics;
            }, e.getColor = function () {
              return this.phantom ? "transparent" : null != this.color && n.colorMap.hasOwnProperty(this.color) ? n.colorMap[this.color] : this.color;
            }, n;
          }();Oe.BASESIZE = 6, Oe.colorMap = { "katex-blue": "#6495ed", "katex-orange": "#ffa500", "katex-pink": "#ff00af", "katex-red": "#df0030", "katex-green": "#28ae7b", "katex-gray": "gray", "katex-purple": "#9d38bd", "katex-blueA": "#ccfaff", "katex-blueB": "#80f6ff", "katex-blueC": "#63d9ea", "katex-blueD": "#11accd", "katex-blueE": "#0c7f99", "katex-tealA": "#94fff5", "katex-tealB": "#26edd5", "katex-tealC": "#01d1c1", "katex-tealD": "#01a995", "katex-tealE": "#208170", "katex-greenA": "#b6ffb0", "katex-greenB": "#8af281", "katex-greenC": "#74cf70", "katex-greenD": "#1fab54", "katex-greenE": "#0d923f", "katex-goldA": "#ffd0a9", "katex-goldB": "#ffbb71", "katex-goldC": "#ff9c39", "katex-goldD": "#e07d10", "katex-goldE": "#a75a05", "katex-redA": "#fca9a9", "katex-redB": "#ff8482", "katex-redC": "#f9685d", "katex-redD": "#e84d39", "katex-redE": "#bc2612", "katex-maroonA": "#ffbde0", "katex-maroonB": "#ff92c6", "katex-maroonC": "#ed5fa6", "katex-maroonD": "#ca337c", "katex-maroonE": "#9e034e", "katex-purpleA": "#ddd7ff", "katex-purpleB": "#c6b9fc", "katex-purpleC": "#aa87ff", "katex-purpleD": "#7854ab", "katex-purpleE": "#543b78", "katex-mintA": "#f5f9e8", "katex-mintB": "#edf2df", "katex-mintC": "#e0e5cc", "katex-grayA": "#f6f7f7", "katex-grayB": "#f0f1f2", "katex-grayC": "#e3e5e6", "katex-grayD": "#d6d8da", "katex-grayE": "#babec2", "katex-grayF": "#888d93", "katex-grayG": "#626569", "katex-grayH": "#3b3e40", "katex-grayI": "#21242c", "katex-kaBlue": "#314453", "katex-kaGreen": "#71B307" };var Ie = Oe,
              Re = { pt: 1, mm: 7227 / 2540, cm: 7227 / 254, in: 72.27, bp: 1.00375, pc: 12, dd: 1238 / 1157, cc: 14856 / 1157, nd: 685 / 642, nc: 1370 / 107, sp: 1 / 65536, px: 1.00375 },
              Le = { ex: !0, em: !0, mu: !0 },
              He = function He(e) {
            return "string" != typeof e && (e = e.unit), e in Re || e in Le || "ex" === e;
          },
              De = function De(e, t) {
            var r;if (e.unit in Re) r = Re[e.unit] / t.fontMetrics().ptPerEm / t.sizeMultiplier;else if ("mu" === e.unit) r = t.fontMetrics().cssEmPerMu;else {
              var n;if (n = t.style.isTight() ? t.havingStyle(t.style.text()) : t, "ex" === e.unit) r = n.fontMetrics().xHeight;else {
                if ("em" !== e.unit) throw new X("Invalid unit: '" + e.unit + "'");r = n.fontMetrics().quad;
              }n !== t && (r *= n.sizeMultiplier / t.sizeMultiplier);
            }return Math.min(e.number * r, t.maxSize);
          },
              Pe = ["\\imath", '\u0131', "\\jmath", '\u0237', "\\pounds", "\\mathsterling", "\\textsterling", "\xa3"],
              Fe = function Fe(e, t, r) {
            return W[r][e] && W[r][e].replace && (e = W[r][e].replace), { value: e, metrics: F(e, t, r) };
          },
              Ve = function Ve(e, t, r, n, i) {
            var a,
                o = Fe(e, t, r),
                s = o.metrics;if (e = o.value, s) {
              var l = s.italic;("text" === r || n && "mathit" === n.font) && (l = 0), a = new O(e, s.height, s.depth, l, s.skew, s.width, i);
            } else "undefined" != typeof console && console.warn("No character metrics for '" + e + "' in style '" + t + "'"), a = new O(e, 0, 0, 0, 0, 0, i);if (n) {
              a.maxFontSize = n.sizeMultiplier, n.style.isTight() && a.classes.push("mtight");var h = n.getColor();h && (a.style.color = h);
            }return a;
          },
              Ue = function Ue(e, t) {
            if (z(e.classes) !== z(t.classes) || e.skew !== t.skew || e.maxFontSize !== t.maxFontSize) return !1;for (var r in e.style) {
              if (e.style.hasOwnProperty(r) && e.style[r] !== t.style[r]) return !1;
            }for (var n in t.style) {
              if (t.style.hasOwnProperty(n) && e.style[n] !== t.style[n]) return !1;
            }return !0;
          },
              Ge = function Ge(e) {
            for (var t = 0, r = 0, n = 0, i = 0; i < e.children.length; i++) {
              var a = e.children[i];a.height > t && (t = a.height), a.depth > r && (r = a.depth), a.maxFontSize > n && (n = a.maxFontSize);
            }e.height = t, e.depth = r, e.maxFontSize = n;
          },
              Xe = function Xe(e, t, r, n) {
            var i = new B(e, t, r, n);return Ge(i), i;
          },
              Ye = function Ye(e, t, r, n) {
            return new B(e, t, r, n);
          },
              _e = function _e(e) {
            var t = new S(e);return Ge(t), t;
          },
              We = function We(e, t, r) {
            var n = "";switch (e) {case "amsrm":
                n = "AMS";break;case "textrm":
                n = "Main";break;case "textsf":
                n = "SansSerif";break;case "texttt":
                n = "Typewriter";break;default:
                n = e;}return n + "-" + ("textbf" === t && "textit" === r ? "BoldItalic" : "textbf" === t ? "Bold" : "textit" === t ? "Italic" : "Regular");
          },
              je = { mathbf: { variant: "bold", fontName: "Main-Bold" }, mathrm: { variant: "normal", fontName: "Main-Regular" }, textit: { variant: "italic", fontName: "Main-Italic" }, mathit: { variant: "italic", fontName: "Main-Italic" }, mathbb: { variant: "double-struck", fontName: "AMS-Regular" }, mathcal: { variant: "script", fontName: "Caligraphic-Regular" }, mathfrak: { variant: "fraktur", fontName: "Fraktur-Regular" }, mathscr: { variant: "script", fontName: "Script-Regular" }, mathsf: { variant: "sans-serif", fontName: "SansSerif-Regular" }, mathtt: { variant: "monospace", fontName: "Typewriter-Regular" } },
              $e = { vec: ["vec", .471, .714], oiintSize1: ["oiintSize1", .957, .499], oiintSize2: ["oiintSize2", 1.472, .659], oiiintSize1: ["oiiintSize1", 1.304, .499], oiiintSize2: ["oiiintSize2", 1.98, .659] },
              Ze = { fontMap: je, makeSymbol: Ve, mathsym: function mathsym(e, t, r, n) {
              return void 0 === n && (n = []), r && r.font && "boldsymbol" === r.font && Fe(e, "Main-Bold", t).metrics ? Ve(e, "Main-Bold", t, r, n.concat(["mathbf"])) : "\\" === e || "main" === W[t][e].font ? Ve(e, "Main-Regular", t, r, n) : Ve(e, "AMS-Regular", t, r, n.concat(["amsrm"]));
            }, makeSpan: Xe, makeSvgSpan: Ye, makeLineSpan: function makeLineSpan(e, t, r) {
              var n = Xe([e], [], t);return n.height = r || t.fontMetrics().defaultRuleThickness, n.style.borderBottomWidth = n.height + "em", n.maxFontSize = 1, n;
            }, makeAnchor: function makeAnchor(e, t, r, n) {
              var i = new C(e, t, r, n);return Ge(i), i;
            }, makeFragment: _e, wrapFragment: function wrapFragment(e, t) {
              return e instanceof S ? Xe([], [e], t) : e;
            }, makeVList: function makeVList(e, t) {
              for (var r = function (e) {
                if ("individualShift" === e.positionType) {
                  for (var t = e.children, r = [t[0]], n = -t[0].shift - t[0].elem.depth, i = n, a = 1; a < t.length; a++) {
                    var o = -t[a].shift - i - t[a].elem.depth,
                        s = o - (t[a - 1].elem.height + t[a - 1].elem.depth);i += o, r.push({ type: "kern", size: s }), r.push(t[a]);
                  }return { children: r, depth: n };
                }var l;if ("top" === e.positionType) {
                  for (var h = e.positionData, m = 0; m < e.children.length; m++) {
                    var c = e.children[m];h -= "kern" === c.type ? c.size : c.elem.height + c.elem.depth;
                  }l = h;
                } else if ("bottom" === e.positionType) l = -e.positionData;else {
                  var u = e.children[0];if ("elem" !== u.type) throw new Error('First child must have type "elem".');if ("shift" === e.positionType) l = -u.elem.depth - e.positionData;else {
                    if ("firstBaseline" !== e.positionType) throw new Error("Invalid positionType " + e.positionType + ".");l = -u.elem.depth;
                  }
                }return { children: e.children, depth: l };
              }(e), n = r.children, i = r.depth, a = 0, o = 0; o < n.length; o++) {
                var s = n[o];if ("elem" === s.type) {
                  var l = s.elem;a = Math.max(a, l.maxFontSize, l.height);
                }
              }a += 2;var h = Xe(["pstrut"], []);h.style.height = a + "em";for (var m = [], c = i, u = i, p = i, d = 0; d < n.length; d++) {
                var f = n[d];if ("kern" === f.type) p += f.size;else {
                  var g = f.elem,
                      v = f.wrapperClasses || [],
                      y = f.wrapperStyle || {},
                      b = Xe(v, [h, g], void 0, y);b.style.top = -a - p - g.depth + "em", f.marginLeft && (b.style.marginLeft = f.marginLeft), f.marginRight && (b.style.marginRight = f.marginRight), m.push(b), p += g.height + g.depth;
                }c = Math.min(c, p), u = Math.max(u, p);
              }var x,
                  w = Xe(["vlist"], m);if (w.style.height = u + "em", c < 0) {
                var k = Xe([], []),
                    S = Xe(["vlist"], [k]);S.style.height = -c + "em";var z = Xe(["vlist-s"], [new O('\u200B')]);x = [Xe(["vlist-r"], [w, z]), Xe(["vlist-r"], [S])];
              } else x = [Xe(["vlist-r"], [w])];var M = Xe(["vlist-t"], x);return 2 === x.length && M.classes.push("vlist-t2"), M.height = u, M.depth = -c, M;
            }, makeOrd: function makeOrd(e, t, r) {
              var n,
                  i = e.mode,
                  a = e.text,
                  o = ["mord"],
                  s = "math" === i || "text" === i && t.font,
                  l = s ? t.font : t.fontFamily;if (55349 === a.charCodeAt(0)) {
                var h = function (e, t) {
                  var r = 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320) + 65536,
                      n = "math" === t ? 0 : 1;if (119808 <= r && r < 120484) {
                    var i = Math.floor((r - 119808) / 26);return [Be[i][2], Be[i][n]];
                  }if (120782 <= r && r <= 120831) {
                    var a = Math.floor((r - 120782) / 10);return [Ce[a][2], Ce[a][n]];
                  }if (120485 === r || 120486 === r) return [Be[0][2], Be[0][n]];if (120486 < r && r < 120782) return ["", ""];throw new X("Unsupported character: " + e);
                }(a, i),
                    m = h[0],
                    c = h[1];return Ve(a, m, i, t, o.concat(c));
              }if (l) {
                var u, p;if ("boldsymbol" === l || "mathnormal" === l) {
                  var d = "boldsymbol" === l ? Fe(a, "Math-BoldItalic", i).metrics ? { fontName: "Math-BoldItalic", fontClass: "boldsymbol" } : { fontName: "Main-Bold", fontClass: "mathbf" } : (n = a, Y.contains(Pe, n) ? { fontName: "Main-Italic", fontClass: "mathit" } : /[0-9]/.test(n.charAt(0)) ? { fontName: "Caligraphic-Regular", fontClass: "mathcal" } : { fontName: "Math-Italic", fontClass: "mathdefault" });u = d.fontName, p = [d.fontClass];
                } else p = Y.contains(Pe, a) ? (u = "Main-Italic", ["mathit"]) : s ? (u = je[l].fontName, [l]) : (u = We(l, t.fontWeight, t.fontShape), [l, t.fontWeight, t.fontShape]);if (Fe(a, u, i).metrics) return Ve(a, u, i, t, o.concat(p));if (me.hasOwnProperty(a) && "Typewriter" === u.substr(0, 10)) {
                  for (var f = [], g = 0; g < a.length; g++) {
                    f.push(Ve(a[g], u, i, t, o.concat(p)));
                  }return _e(f);
                }
              }if ("mathord" === r) {
                var v = /[0-9]/.test((w = a).charAt(0)) || Y.contains(Pe, w) ? { fontName: "Main-Italic", fontClass: "mathit" } : { fontName: "Math-Italic", fontClass: "mathdefault" };return Ve(a, v.fontName, i, t, o.concat([v.fontClass]));
              }if ("textord" !== r) throw new Error("unexpected type: " + r + " in makeOrd");var y = W[i][a] && W[i][a].font;if ("ams" === y) {
                var b = We("amsrm", t.fontWeight, t.fontShape);return Ve(a, b, i, t, o.concat("amsrm", t.fontWeight, t.fontShape));
              }if ("main" !== y && y) {
                var x = We(y, t.fontWeight, t.fontShape);return Ve(a, x, i, t, o.concat(x, t.fontWeight, t.fontShape));
              }var w,
                  k = We("textrm", t.fontWeight, t.fontShape);return Ve(a, k, i, t, o.concat(t.fontWeight, t.fontShape));
            }, makeGlue: function makeGlue(e, t) {
              var r = Xe(["mspace"], [], t),
                  n = De(e, t);return r.style.marginRight = n + "em", r;
            }, staticSvg: function staticSvg(e, t) {
              var r = $e[e],
                  n = r[0],
                  i = r[1],
                  a = r[2],
                  o = new R(n),
                  s = new I([o], { width: i + "em", height: a + "em", style: "width:" + i + "em", viewBox: "0 0 " + 1e3 * i + " " + 1e3 * a, preserveAspectRatio: "xMinYMin" }),
                  l = Ye(["overlay"], [s], t);return l.height = a, l.style.height = a + "em", l.style.width = i + "em", l;
            }, svgData: $e, tryCombineChars: function tryCombineChars(e) {
              for (var t = 0; t < e.length - 1; t++) {
                var r = e[t],
                    n = e[t + 1];r instanceof O && n instanceof O && Ue(r, n) && (r.text += n.text, r.height = Math.max(r.height, n.height), r.depth = Math.max(r.depth, n.depth), r.italic = n.italic, e.splice(t + 1, 1), t--);
              }return e;
            } };function Ke(e, t) {
            var r = Je(e, t);if (!r) throw new Error("Expected node of type " + t + ", but got " + (e ? "node of type " + e.type : String(e)));return r;
          }function Je(e, t) {
            return e && e.type === t ? e : null;
          }function Qe(e, t) {
            var r,
                n,
                i = (n = t, (r = e) && "atom" === r.type && r.family === n ? r : null);if (!i) throw new Error('Expected node of type "atom" and family "' + t + '", but got ' + (e ? "atom" === e.type ? "atom of family " + e.family : "node of type " + e.type : String(e)));return i;
          }function et(e) {
            return e && ("atom" === e.type || G.hasOwnProperty(e.type)) ? e : null;
          }var tt = { number: 3, unit: "mu" },
              rt = { number: 4, unit: "mu" },
              nt = { number: 5, unit: "mu" },
              it = { mord: { mop: tt, mbin: rt, mrel: nt, minner: tt }, mop: { mord: tt, mop: tt, mrel: nt, minner: tt }, mbin: { mord: rt, mop: rt, mopen: rt, minner: rt }, mrel: { mord: nt, mop: nt, mopen: nt, minner: nt }, mopen: {}, mclose: { mop: tt, mbin: rt, mrel: nt, minner: tt }, mpunct: { mord: tt, mop: tt, mrel: nt, mopen: tt, mclose: tt, mpunct: tt, minner: tt }, minner: { mord: tt, mop: tt, mbin: rt, mrel: nt, mopen: tt, mpunct: tt, minner: tt } },
              at = { mord: { mop: tt }, mop: { mord: tt, mop: tt }, mbin: {}, mrel: {}, mopen: {}, mclose: { mop: tt }, mpunct: {}, minner: { mop: tt } },
              ot = {},
              st = {},
              lt = {};function ht(e) {
            for (var t = e.type, r = (e.nodeType, e.names), n = e.props, i = e.handler, a = e.htmlBuilder, o = e.mathmlBuilder, s = { type: t, numArgs: n.numArgs, argTypes: n.argTypes, greediness: void 0 === n.greediness ? 1 : n.greediness, allowedInText: !!n.allowedInText, allowedInMath: void 0 === n.allowedInMath || n.allowedInMath, numOptionalArgs: n.numOptionalArgs || 0, infix: !!n.infix, consumeMode: n.consumeMode, handler: i }, l = 0; l < r.length; ++l) {
              ot[r[l]] = s;
            }t && (a && (st[t] = a), o && (lt[t] = o));
          }function mt(e) {
            ht({ type: e.type, names: [], props: { numArgs: 0 }, handler: function handler() {
                throw new Error("Should never be called.");
              }, htmlBuilder: e.htmlBuilder, mathmlBuilder: e.mathmlBuilder });
          }var ct = function ct(e) {
            var t = Je(e, "ordgroup");return t ? t.body : [e];
          },
              ut = Ze.makeSpan,
              pt = ["leftmost", "mbin", "mopen", "mrel", "mop", "mpunct"],
              dt = ["rightmost", "mrel", "mclose", "mpunct"],
              ft = { display: q.DISPLAY, text: q.TEXT, script: q.SCRIPT, scriptscript: q.SCRIPTSCRIPT },
              gt = { mord: "mord", mop: "mop", mbin: "mbin", mrel: "mrel", mopen: "mopen", mclose: "mclose", mpunct: "mpunct", minner: "minner" },
              vt = function vt(e, t, r, n) {
            void 0 === n && (n = [null, null]);for (var i = [], a = 0; a < e.length; a++) {
              var o = kt(e[a], t);if (o instanceof S) {
                var s = o.children;i.push.apply(i, s);
              } else i.push(o);
            }if (!r) return i;var l = t;if (1 === e.length) {
              var h = Je(e[0], "sizing") || Je(e[0], "styling");h && ("sizing" === h.type ? l = t.havingSize(h.size) : "styling" === h.type && (l = t.havingStyle(ft[h.style])));
            }var m = ut([n[0] || "leftmost"], [], t),
                c = ut([n[1] || "rightmost"], [], t);return yt(i, function (e, t) {
              var r = t.classes[0],
                  n = e.classes[0];"mbin" === r && Y.contains(dt, n) ? t.classes[0] = "mord" : "mbin" === n && Y.contains(pt, r) && (e.classes[0] = "mord");
            }, { node: m }, c), yt(i, function (e, t) {
              var r = xt(t),
                  n = xt(e),
                  i = r && n ? e.hasClass("mtight") ? at[r][n] : it[r][n] : null;if (i) return Ze.makeGlue(i, l);
            }, { node: m }, c), i;
          },
              yt = function e(r, t, n, i) {
            i && r.push(i);for (var a = 0; a < r.length; a++) {
              var o = r[a],
                  s = bt(o);if (s) e(s.children, t, n);else if ("mspace" !== o.classes[0]) {
                var l = t(o, n.node);l && (n.insertAfter ? n.insertAfter(l) : (r.unshift(l), a++)), n.node = o, n.insertAfter = function (t) {
                  return function (e) {
                    r.splice(t + 1, 0, e), a++;
                  };
                }(a);
              }
            }i && r.pop();
          },
              bt = function bt(e) {
            return e instanceof S || e instanceof C ? e : null;
          },
              xt = function xt(e, t) {
            return e ? (t && (e = function e(t, r) {
              var n = bt(t);if (n) {
                var i = n.children;if (i.length) {
                  if ("right" === r) return e(i[i.length - 1], "right");if ("left" === r) return e(i[0], "left");
                }
              }return t;
            }(e, t)), gt[e.classes[0]] || null) : null;
          },
              wt = function wt(e, t) {
            var r = ["nulldelimiter"].concat(e.baseSizingClasses());return ut(t.concat(r));
          },
              kt = function kt(e, t, r) {
            if (!e) return ut();if (st[e.type]) {
              var n = st[e.type](e, t);if (r && t.size !== r.size) {
                n = ut(t.sizingClasses(r), [n], t);var i = t.sizeMultiplier / r.sizeMultiplier;n.height *= i, n.depth *= i;
              }return n;
            }throw new X("Got group of unknown type: '" + e.type + "'");
          };function St(e, t) {
            var r = ut(["base"], e, t),
                n = ut(["strut"]);return n.style.height = r.height + r.depth + "em", n.style.verticalAlign = -r.depth + "em", r.children.unshift(n), r;
          }function zt(e, t) {
            var r = null;1 === e.length && "tag" === e[0].type && (r = e[0].tag, e = e[0].body);for (var n, i = vt(e, t, !0), a = [], o = [], s = 0; s < i.length; s++) {
              if (o.push(i[s]), i[s].hasClass("mbin") || i[s].hasClass("mrel") || i[s].hasClass("allowbreak")) {
                for (var l = !1; s < i.length - 1 && i[s + 1].hasClass("mspace");) {
                  s++, o.push(i[s]), i[s].hasClass("nobreak") && (l = !0);
                }l || (a.push(St(o, t)), o = []);
              } else i[s].hasClass("newline") && (o.pop(), 0 < o.length && (a.push(St(o, t)), o = []), a.push(i[s]));
            }0 < o.length && a.push(St(o, t)), r && ((n = St(vt(r, t, !0))).classes = ["tag"], a.push(n));var h = ut(["katex-html"], a);if (h.setAttribute("aria-hidden", "true"), n) {
              var m = n.children[0];m.style.height = h.height + h.depth + "em", m.style.verticalAlign = -h.depth + "em";
            }return h;
          }function Mt(e) {
            return new S(e);
          }var Tt = function () {
            function e(e, t) {
              this.type = void 0, this.attributes = void 0, this.children = void 0, this.type = e, this.attributes = {}, this.children = t || [];
            }var t = e.prototype;return t.setAttribute = function (e, t) {
              this.attributes[e] = t;
            }, t.getAttribute = function (e) {
              return this.attributes[e];
            }, t.toNode = function () {
              var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.type);for (var t in this.attributes) {
                Object.prototype.hasOwnProperty.call(this.attributes, t) && e.setAttribute(t, this.attributes[t]);
              }for (var r = 0; r < this.children.length; r++) {
                e.appendChild(this.children[r].toNode());
              }return e;
            }, t.toMarkup = function () {
              var e = "<" + this.type;for (var t in this.attributes) {
                Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + '="', e += Y.escape(this.attributes[t]), e += '"');
              }e += ">";for (var r = 0; r < this.children.length; r++) {
                e += this.children[r].toMarkup();
              }return e += "</" + this.type + ">";
            }, t.toText = function () {
              return this.children.map(function (e) {
                return e.toText();
              }).join("");
            }, e;
          }(),
              At = function () {
            function e(e, t) {
              void 0 === t && (t = !0), this.text = void 0, this.needsEscape = void 0, this.text = e, this.needsEscape = t;
            }var t = e.prototype;return t.toNode = function () {
              return document.createTextNode(this.toText());
            }, t.toMarkup = function () {
              return this.toText();
            }, t.toText = function () {
              return this.needsEscape ? Y.escape(this.text) : this.text;
            }, e;
          }(),
              Bt = { MathNode: Tt, TextNode: At, SpaceNode: function () {
              function e(e) {
                this.width = void 0, this.character = void 0, this.width = e, this.character = .05555 <= e && e <= .05556 ? "&VeryThinSpace;" : .1666 <= e && e <= .1667 ? "&ThinSpace;" : .2222 <= e && e <= .2223 ? "&MediumSpace;" : .2777 <= e && e <= .2778 ? "&ThickSpace;" : -.05556 <= e && e <= -.05555 ? "&NegativeVeryThinSpace;" : -.1667 <= e && e <= -.1666 ? "&NegativeThinSpace;" : -.2223 <= e && e <= -.2222 ? "&NegativeMediumSpace;" : -.2778 <= e && e <= -.2777 ? "&NegativeThickSpace;" : null;
              }var t = e.prototype;return t.toNode = function () {
                if (this.character) return document.createTextNode(this.character);var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mspace");return e.setAttribute("width", this.width + "em"), e;
              }, t.toMarkup = function () {
                return this.character ? "<mtext>" + this.character + "</mtext>" : '<mspace width="' + this.width + 'em"/>';
              }, t.toText = function () {
                return this.character ? this.character : " ";
              }, e;
            }(), newDocumentFragment: Mt },
              Ct = function Ct(e, t, r) {
            return !W[t][e] || !W[t][e].replace || 55349 === e.charCodeAt(0) || me.hasOwnProperty(e) && r && (r.fontFamily && "tt" === r.fontFamily.substr(4, 2) || r.font && "tt" === r.font.substr(4, 2)) || (e = W[t][e].replace), new Bt.TextNode(e);
          },
              Nt = function Nt(e) {
            return 1 === e.length ? e[0] : new Bt.MathNode("mrow", e);
          },
              qt = function qt(e, t) {
            if ("texttt" === t.fontFamily) return "monospace";if ("textsf" === t.fontFamily) return "textit" === t.fontShape && "textbf" === t.fontWeight ? "sans-serif-bold-italic" : "textit" === t.fontShape ? "sans-serif-italic" : "textbf" === t.fontWeight ? "bold-sans-serif" : "sans-serif";if ("textit" === t.fontShape && "textbf" === t.fontWeight) return "bold-italic";if ("textit" === t.fontShape) return "italic";if ("textbf" === t.fontWeight) return "bold";var r = t.font;if (!r || "mathnormal" === r) return null;var n = e.mode;if ("mathit" === r) return "italic";if ("boldsymbol" === r) return "bold-italic";var i = e.text;return Y.contains(["\\imath", "\\jmath"], i) ? null : (W[n][i] && W[n][i].replace && (i = W[n][i].replace), F(i, Ze.fontMap[r].fontName, n) ? Ze.fontMap[r].variant : null);
          },
              Et = function Et(e, t) {
            for (var r, n = [], i = 0; i < e.length; i++) {
              var a = It(e[i], t);if (a instanceof Tt && r instanceof Tt) {
                if ("mtext" === a.type && "mtext" === r.type && a.getAttribute("mathvariant") === r.getAttribute("mathvariant")) {
                  var o;(o = r.children).push.apply(o, a.children);continue;
                }if ("mn" === a.type && "mn" === r.type) {
                  var s;(s = r.children).push.apply(s, a.children);continue;
                }if ("mi" === a.type && 1 === a.children.length && "mn" === r.type) {
                  var l = a.children[0];if (l instanceof At && "." === l.text) {
                    var h;(h = r.children).push.apply(h, a.children);continue;
                  }
                }
              }n.push(a), r = a;
            }return n;
          },
              Ot = function Ot(e, t) {
            return Nt(Et(e, t));
          },
              It = function It(e, t) {
            if (!e) return new Bt.MathNode("mrow");if (lt[e.type]) return lt[e.type](e, t);throw new X("Got group of unknown type: '" + e.type + "'");
          };var Rt = function Rt(e) {
            return new Ie({ style: e.displayMode ? q.DISPLAY : q.TEXT, maxSize: e.maxSize });
          },
              Lt = function Lt(e, t, r) {
            var n = Rt(r),
                i = function (e, t, r) {
              var n,
                  i = Et(e, r);n = 1 === i.length && i[0] instanceof Tt && Y.contains(["mrow", "mtable"], i[0].type) ? i[0] : new Bt.MathNode("mrow", i);var a = new Bt.MathNode("annotation", [new Bt.TextNode(t)]);a.setAttribute("encoding", "application/x-tex");var o = new Bt.MathNode("semantics", [n, a]),
                  s = new Bt.MathNode("math", [o]);return Ze.makeSpan(["katex-mathml"], [s]);
            }(e, t, n),
                a = zt(e, n),
                o = Ze.makeSpan(["katex"], [i, a]);return r.displayMode ? Ze.makeSpan(["katex-display"], [o]) : o;
          },
              Ht = { widehat: "^", widecheck: '\u02C7', widetilde: "~", utilde: "~", overleftarrow: '\u2190', underleftarrow: '\u2190', xleftarrow: '\u2190', overrightarrow: '\u2192', underrightarrow: '\u2192', xrightarrow: '\u2192', underbrace: '\u23B5', overbrace: '\u23DE', overleftrightarrow: '\u2194', underleftrightarrow: '\u2194', xleftrightarrow: '\u2194', Overrightarrow: '\u21D2', xRightarrow: '\u21D2', overleftharpoon: '\u21BC', xleftharpoonup: '\u21BC', overrightharpoon: '\u21C0', xrightharpoonup: '\u21C0', xLeftarrow: '\u21D0', xLeftrightarrow: '\u21D4', xhookleftarrow: '\u21A9', xhookrightarrow: '\u21AA', xmapsto: '\u21A6', xrightharpoondown: '\u21C1', xleftharpoondown: '\u21BD', xrightleftharpoons: '\u21CC', xleftrightharpoons: '\u21CB', xtwoheadleftarrow: '\u219E', xtwoheadrightarrow: '\u21A0', xlongequal: "=", xtofrom: '\u21C4', xrightleftarrows: '\u21C4', xrightequilibrium: '\u21CC', xleftequilibrium: '\u21CB' },
              Dt = { overrightarrow: [["rightarrow"], .888, 522, "xMaxYMin"], overleftarrow: [["leftarrow"], .888, 522, "xMinYMin"], underrightarrow: [["rightarrow"], .888, 522, "xMaxYMin"], underleftarrow: [["leftarrow"], .888, 522, "xMinYMin"], xrightarrow: [["rightarrow"], 1.469, 522, "xMaxYMin"], xleftarrow: [["leftarrow"], 1.469, 522, "xMinYMin"], Overrightarrow: [["doublerightarrow"], .888, 560, "xMaxYMin"], xRightarrow: [["doublerightarrow"], 1.526, 560, "xMaxYMin"], xLeftarrow: [["doubleleftarrow"], 1.526, 560, "xMinYMin"], overleftharpoon: [["leftharpoon"], .888, 522, "xMinYMin"], xleftharpoonup: [["leftharpoon"], .888, 522, "xMinYMin"], xleftharpoondown: [["leftharpoondown"], .888, 522, "xMinYMin"], overrightharpoon: [["rightharpoon"], .888, 522, "xMaxYMin"], xrightharpoonup: [["rightharpoon"], .888, 522, "xMaxYMin"], xrightharpoondown: [["rightharpoondown"], .888, 522, "xMaxYMin"], xlongequal: [["longequal"], .888, 334, "xMinYMin"], xtwoheadleftarrow: [["twoheadleftarrow"], .888, 334, "xMinYMin"], xtwoheadrightarrow: [["twoheadrightarrow"], .888, 334, "xMaxYMin"], overleftrightarrow: [["leftarrow", "rightarrow"], .888, 522], overbrace: [["leftbrace", "midbrace", "rightbrace"], 1.6, 548], underbrace: [["leftbraceunder", "midbraceunder", "rightbraceunder"], 1.6, 548], underleftrightarrow: [["leftarrow", "rightarrow"], .888, 522], xleftrightarrow: [["leftarrow", "rightarrow"], 1.75, 522], xLeftrightarrow: [["doubleleftarrow", "doublerightarrow"], 1.75, 560], xrightleftharpoons: [["leftharpoondownplus", "rightharpoonplus"], 1.75, 716], xleftrightharpoons: [["leftharpoonplus", "rightharpoondownplus"], 1.75, 716], xhookleftarrow: [["leftarrow", "righthook"], 1.08, 522], xhookrightarrow: [["lefthook", "rightarrow"], 1.08, 522], overlinesegment: [["leftlinesegment", "rightlinesegment"], .888, 522], underlinesegment: [["leftlinesegment", "rightlinesegment"], .888, 522], overgroup: [["leftgroup", "rightgroup"], .888, 342], undergroup: [["leftgroupunder", "rightgroupunder"], .888, 342], xmapsto: [["leftmapsto", "rightarrow"], 1.5, 522], xtofrom: [["leftToFrom", "rightToFrom"], 1.75, 528], xrightleftarrows: [["baraboveleftarrow", "rightarrowabovebar"], 1.75, 901], xrightequilibrium: [["baraboveshortleftharpoon", "rightharpoonaboveshortbar"], 1.75, 716], xleftequilibrium: [["shortbaraboveleftharpoon", "shortrightharpoonabovebar"], 1.75, 716] },
              Pt = function Pt(e, t, r, n) {
            var i,
                a = e.height + e.depth + 2 * r;if (/fbox|color/.test(t)) {
              if (i = Ze.makeSpan(["stretchy", t], [], n), "fbox" === t) {
                var o = n.color && n.getColor();o && (i.style.borderColor = o);
              }
            } else {
              var s = [];/^[bx]cancel$/.test(t) && s.push(new L({ x1: "0", y1: "0", x2: "100%", y2: "100%", "stroke-width": "0.046em" })), /^x?cancel$/.test(t) && s.push(new L({ x1: "0", y1: "100%", x2: "100%", y2: "0", "stroke-width": "0.046em" }));var l = new I(s, { width: "100%", height: a + "em" });i = Ze.makeSvgSpan([], [l], n);
            }return i.height = a, i.style.height = a + "em", i;
          },
              Ft = function Ft(e) {
            var t = new Bt.MathNode("mo", [new Bt.TextNode(Ht[e.substr(1)])]);return t.setAttribute("stretchy", "true"), t;
          },
              Vt = function Vt(S, z) {
            var e = function () {
              var e = 4e5,
                  t = S.label.substr(1);if (Y.contains(["widehat", "widecheck", "widetilde", "utilde"], t)) {
                var r,
                    n,
                    i,
                    a = "ordgroup" === (c = S.base).type ? c.body.length : 1;if (5 < a) n = "widehat" === t || "widecheck" === t ? (r = 420, e = 2364, i = .42, t + "4") : (r = 312, e = 2340, i = .34, "tilde4");else {
                  var o = [1, 1, 2, 2, 3, 3][a];n = "widehat" === t || "widecheck" === t ? (e = [0, 1062, 2364, 2364, 2364][o], r = [0, 239, 300, 360, 420][o], i = [0, .24, .3, .3, .36, .42][o], t + o) : (e = [0, 600, 1033, 2339, 2340][o], r = [0, 260, 286, 306, 312][o], i = [0, .26, .286, .3, .306, .34][o], "tilde" + o);
                }var s = new R(n),
                    l = new I([s], { width: "100%", height: i + "em", viewBox: "0 0 " + e + " " + r, preserveAspectRatio: "none" });return { span: Ze.makeSvgSpan([], [l], z), minWidth: 0, height: i };
              }var h,
                  m,
                  c,
                  u = [],
                  p = Dt[t],
                  d = p[0],
                  f = p[1],
                  g = p[2],
                  v = g / 1e3,
                  y = d.length;if (1 === y) h = ["hide-tail"], m = [p[3]];else if (2 === y) h = ["halfarrow-left", "halfarrow-right"], m = ["xMinYMin", "xMaxYMin"];else {
                if (3 !== y) throw new Error("Correct katexImagesData or update code here to support\n                    " + y + " children.");h = ["brace-left", "brace-center", "brace-right"], m = ["xMinYMin", "xMidYMin", "xMaxYMin"];
              }for (var b = 0; b < y; b++) {
                var x = new R(d[b]),
                    w = new I([x], { width: "400em", height: v + "em", viewBox: "0 0 " + e + " " + g, preserveAspectRatio: m[b] + " slice" }),
                    k = Ze.makeSvgSpan([h[b]], [w], z);if (1 === y) return { span: k, minWidth: f, height: v };k.style.height = v + "em", u.push(k);
              }return { span: Ze.makeSpan(["stretchy"], u, z), minWidth: f, height: v };
            }(),
                t = e.span,
                r = e.minWidth,
                n = e.height;return t.height = n, t.style.height = n + "em", 0 < r && (t.style.minWidth = r + "em"), t;
          },
              Ut = function Ut(e, t) {
            var r,
                n,
                i,
                a = Je(e, "supsub");a ? (r = (n = Ke(a.base, "accent")).base, a.base = r, i = function (e) {
              if (e instanceof B) return e;throw new Error("Expected span<HtmlDomNode> but got " + String(e) + ".");
            }(kt(a, t)), a.base = n) : r = (n = Ke(e, "accent")).base;var o = kt(r, t.havingCrampedStyle()),
                s = 0;if (n.isShifty && Y.isCharacterBox(r)) {
              var l = Y.getBaseElem(r);s = function (e) {
                if (e instanceof O) return e;throw new Error("Expected symbolNode but got " + String(e) + ".");
              }(kt(l, t.havingCrampedStyle())).skew;
            }var h,
                m = Math.min(o.height, t.fontMetrics().xHeight);if (n.isStretchy) h = Vt(n, t), h = Ze.makeVList({ positionType: "firstBaseline", children: [{ type: "elem", elem: o }, { type: "elem", elem: h, wrapperClasses: ["svg-align"], wrapperStyle: 0 < s ? { width: "calc(100% - " + 2 * s + "em)", marginLeft: 2 * s + "em" } : void 0 }] }, t);else {
              var c, u;u = "\\vec" === n.label ? (c = Ze.staticSvg("vec", t), Ze.svgData.vec[1]) : ((c = Ze.makeSymbol(n.label, "Main-Regular", n.mode, t)).italic = 0, c.width), h = Ze.makeSpan(["accent-body"], [c]);var p = "\\textcircled" === n.label;p && (h.classes.push("accent-full"), m = o.height);var d = s;p || (d -= u / 2), h.style.left = d + "em", "\\textcircled" === n.label && (h.style.top = ".2em"), h = Ze.makeVList({ positionType: "firstBaseline", children: [{ type: "elem", elem: o }, { type: "kern", size: -m }, { type: "elem", elem: h }] }, t);
            }var f = Ze.makeSpan(["mord", "accent"], [h], t);return i ? (i.children[0] = f, i.height = Math.max(f.height, i.height), i.classes[0] = "mord", i) : f;
          },
              Gt = function Gt(e, t) {
            var r = e.isStretchy ? Ft(e.label) : new Bt.MathNode("mo", [Ct(e.label, e.mode)]),
                n = new Bt.MathNode("mover", [It(e.base, t), r]);return n.setAttribute("accent", "true"), n;
          },
              Xt = new RegExp(["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring"].map(function (e) {
            return "\\" + e;
          }).join("|"));ht({ type: "accent", names: ["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring", "\\widecheck", "\\widehat", "\\widetilde", "\\overrightarrow", "\\overleftarrow", "\\Overrightarrow", "\\overleftrightarrow", "\\overgroup", "\\overlinesegment", "\\overleftharpoon", "\\overrightharpoon"], props: { numArgs: 1 }, handler: function handler(e, t) {
              var r = t[0],
                  n = !Xt.test(e.funcName),
                  i = !n || "\\widehat" === e.funcName || "\\widetilde" === e.funcName || "\\widecheck" === e.funcName;return { type: "accent", mode: e.parser.mode, label: e.funcName, isStretchy: n, isShifty: i, base: r };
            }, htmlBuilder: Ut, mathmlBuilder: Gt }), ht({ type: "accent", names: ["\\'", "\\`", "\\^", "\\~", "\\=", '\\u', "\\.", '\\"', "\\r", "\\H", "\\v", "\\textcircled"], props: { numArgs: 1, allowedInText: !0, allowedInMath: !1 }, handler: function handler(e, t) {
              var r = t[0];return { type: "accent", mode: e.parser.mode, label: e.funcName, isStretchy: !1, isShifty: !0, base: r };
            }, htmlBuilder: Ut, mathmlBuilder: Gt }), ht({ type: "accentUnder", names: ['\\underleftarrow', '\\underrightarrow', '\\underleftrightarrow', '\\undergroup', '\\underlinesegment', '\\utilde'], props: { numArgs: 1 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = e.funcName,
                  i = t[0];return { type: "accentUnder", mode: r.mode, label: n, base: i };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = kt(e.base, t),
                  n = Vt(e, t),
                  i = '\\utilde' === e.label ? .12 : 0,
                  a = Ze.makeVList({ positionType: "bottom", positionData: n.height + i, children: [{ type: "elem", elem: n, wrapperClasses: ["svg-align"] }, { type: "kern", size: i }, { type: "elem", elem: r }] }, t);return Ze.makeSpan(["mord", "accentunder"], [a], t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = Ft(e.label),
                  n = new Bt.MathNode("munder", [It(e.base, t), r]);return n.setAttribute("accentunder", "true"), n;
            } }), ht({ type: "xArrow", names: ["\\xleftarrow", "\\xrightarrow", "\\xLeftarrow", "\\xRightarrow", "\\xleftrightarrow", "\\xLeftrightarrow", "\\xhookleftarrow", "\\xhookrightarrow", "\\xmapsto", "\\xrightharpoondown", "\\xrightharpoonup", "\\xleftharpoondown", "\\xleftharpoonup", "\\xrightleftharpoons", "\\xleftrightharpoons", "\\xlongequal", "\\xtwoheadrightarrow", "\\xtwoheadleftarrow", "\\xtofrom", "\\xrightleftarrows", "\\xrightequilibrium", "\\xleftequilibrium"], props: { numArgs: 1, numOptionalArgs: 1 }, handler: function handler(e, t, r) {
              var n = e.parser,
                  i = e.funcName;return { type: "xArrow", mode: n.mode, label: i, body: t[0], below: r[0] };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r,
                  n = t.style,
                  i = t.havingStyle(n.sup()),
                  a = Ze.wrapFragment(kt(e.body, i, t), t);a.classes.push("x-arrow-pad"), e.below && (i = t.havingStyle(n.sub()), (r = Ze.wrapFragment(kt(e.below, i, t), t)).classes.push("x-arrow-pad"));var o,
                  s = Vt(e, t),
                  l = -t.fontMetrics().axisHeight + .5 * s.height,
                  h = -t.fontMetrics().axisHeight - .5 * s.height - .111;if ((.25 < a.depth || "\\xleftequilibrium" === e.label) && (h -= a.depth), r) {
                var m = -t.fontMetrics().axisHeight + r.height + .5 * s.height + .111;o = Ze.makeVList({ positionType: "individualShift", children: [{ type: "elem", elem: a, shift: h }, { type: "elem", elem: s, shift: l }, { type: "elem", elem: r, shift: m }] }, t);
              } else o = Ze.makeVList({ positionType: "individualShift", children: [{ type: "elem", elem: a, shift: h }, { type: "elem", elem: s, shift: l }] }, t);return o.children[0].children[0].children[1].classes.push("svg-align"), Ze.makeSpan(["mrel", "x-arrow"], [o], t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r,
                  n,
                  i = Ft(e.label);if (e.body) {
                var a = It(e.body, t);r = e.below ? (n = It(e.below, t), new Bt.MathNode("munderover", [i, n, a])) : new Bt.MathNode("mover", [i, a]);
              } else r = e.below ? (n = It(e.below, t), new Bt.MathNode("munder", [i, n])) : new Bt.MathNode("mover", [i]);return r;
            } }), ht({ type: "textord", names: ["\\@char"], props: { numArgs: 1, allowedInText: !0 }, handler: function handler(e, t) {
              for (var r = e.parser, n = Ke(t[0], "ordgroup").body, i = "", a = 0; a < n.length; a++) {
                i += Ke(n[a], "textord").text;
              }var o = parseInt(i);if (isNaN(o)) throw new X("\\@char has non-numeric argument " + i);return { type: "textord", mode: r.mode, text: String.fromCharCode(o) };
            } });var Yt = function Yt(e, t) {
            var r = vt(e.body, t.withColor(e.color), !1);return Ze.makeFragment(r);
          },
              _t = function _t(e, t) {
            var r = Et(e.body, t),
                n = new Bt.MathNode("mstyle", r);return n.setAttribute("mathcolor", e.color), n;
          };ht({ type: "color", names: ["\\textcolor"], props: { numArgs: 2, allowedInText: !0, greediness: 3, argTypes: ["color", "original"] }, handler: function handler(e, t) {
              var r = e.parser,
                  n = Ke(t[0], "color-token").color,
                  i = t[1];return { type: "color", mode: r.mode, color: n, body: ct(i) };
            }, htmlBuilder: Yt, mathmlBuilder: _t }), ht({ type: "color", names: ["\\blue", "\\orange", "\\pink", "\\red", "\\green", "\\gray", "\\purple", "\\blueA", "\\blueB", "\\blueC", "\\blueD", "\\blueE", "\\tealA", "\\tealB", "\\tealC", "\\tealD", "\\tealE", "\\greenA", "\\greenB", "\\greenC", "\\greenD", "\\greenE", "\\goldA", "\\goldB", "\\goldC", "\\goldD", "\\goldE", "\\redA", "\\redB", "\\redC", "\\redD", "\\redE", "\\maroonA", "\\maroonB", "\\maroonC", "\\maroonD", "\\maroonE", "\\purpleA", "\\purpleB", "\\purpleC", "\\purpleD", "\\purpleE", "\\mintA", "\\mintB", "\\mintC", "\\grayA", "\\grayB", "\\grayC", "\\grayD", "\\grayE", "\\grayF", "\\grayG", "\\grayH", "\\grayI", "\\kaBlue", "\\kaGreen"], props: { numArgs: 1, allowedInText: !0, greediness: 3 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = e.funcName,
                  i = t[0];return { type: "color", mode: r.mode, color: "katex-" + n.slice(1), body: ct(i) };
            }, htmlBuilder: Yt, mathmlBuilder: _t }), ht({ type: "color", names: ["\\color"], props: { numArgs: 1, allowedInText: !0, greediness: 3, argTypes: ["color"] }, handler: function handler(e, t) {
              var r = e.parser,
                  n = e.breakOnTokenText,
                  i = Ke(t[0], "color-token").color,
                  a = r.parseExpression(!0, n);return { type: "color", mode: r.mode, color: i, body: a };
            }, htmlBuilder: Yt, mathmlBuilder: _t }), ht({ type: "cr", names: ["\\cr", "\\newline"], props: { numArgs: 0, numOptionalArgs: 1, argTypes: ["size"], allowedInText: !0 }, handler: function handler(e, t, r) {
              var n = e.parser,
                  i = e.funcName,
                  a = r[0],
                  o = "\\cr" === i,
                  s = !1;return o || (s = !n.settings.displayMode || !n.settings.useStrictBehavior("newLineInDisplayMode", "In LaTeX, \\\\ or \\newline does nothing in display mode")), { type: "cr", mode: n.mode, newLine: s, newRow: o, size: a && Ke(a, "size").value };
            }, htmlBuilder: function htmlBuilder(e, t) {
              if (e.newRow) throw new X("\\cr valid only within a tabular/array environment");var r = Ze.makeSpan(["mspace"], [], t);return e.newLine && (r.classes.push("newline"), e.size && (r.style.marginTop = De(e.size, t) + "em")), r;
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = new Bt.MathNode("mspace");return e.newLine && (r.setAttribute("linebreak", "newline"), e.size && r.setAttribute("height", De(e.size, t) + "em")), r;
            } });var Wt = function Wt(e, t, r) {
            var n = F(W.math[e] && W.math[e].replace || e, t, r);if (!n) throw new Error("Unsupported symbol " + e + " and font size " + t + ".");return n;
          },
              jt = function jt(e, t, r, n) {
            var i = r.havingBaseStyle(t),
                a = Ze.makeSpan(n.concat(i.sizingClasses(r)), [e], r),
                o = i.sizeMultiplier / r.sizeMultiplier;return a.height *= o, a.depth *= o, a.maxFontSize = i.sizeMultiplier, a;
          },
              $t = function $t(e, t, r) {
            var n = t.havingBaseStyle(r),
                i = (1 - t.sizeMultiplier / n.sizeMultiplier) * t.fontMetrics().axisHeight;e.classes.push("delimcenter"), e.style.top = i + "em", e.height -= i, e.depth += i;
          },
              Zt = function Zt(e, t, r, n, i, a) {
            var o,
                s,
                l,
                h,
                m = (o = e, s = t, l = i, h = n, Ze.makeSymbol(o, "Size" + s + "-Regular", l, h)),
                c = jt(Ze.makeSpan(["delimsizing", "size" + t], [m], n), q.TEXT, n, a);return r && $t(c, n, q.TEXT), c;
          },
              Kt = function Kt(e, t, r) {
            var n;return n = "Size1-Regular" === t ? "delim-size1" : "delim-size4", { type: "elem", elem: Ze.makeSpan(["delimsizinginner", n], [Ze.makeSpan([], [Ze.makeSymbol(e, t, r)])]) };
          },
              Jt = function Jt(e, t, r, n, i, a) {
            var o, s, l, h;o = l = h = e, s = null;var m = "Size1-Regular";'\\uparrow' === e ? l = h = '\u23D0' : '\\Uparrow' === e ? l = h = '\u2016' : "\\downarrow" === e ? o = l = '\u23D0' : "\\Downarrow" === e ? o = l = '\u2016' : '\\updownarrow' === e ? (o = '\\uparrow', l = '\u23D0', h = "\\downarrow") : '\\Updownarrow' === e ? (o = '\\Uparrow', l = '\u2016', h = "\\Downarrow") : "[" === e || "\\lbrack" === e ? (o = '\u23A1', l = '\u23A2', h = '\u23A3', m = "Size4-Regular") : "]" === e || "\\rbrack" === e ? (o = '\u23A4', l = '\u23A5', h = '\u23A6', m = "Size4-Regular") : "\\lfloor" === e || '\u230A' === e ? (l = o = '\u23A2', h = '\u23A3', m = "Size4-Regular") : "\\lceil" === e || '\u2308' === e ? (o = '\u23A1', l = h = '\u23A2', m = "Size4-Regular") : "\\rfloor" === e || '\u230B' === e ? (l = o = '\u23A5', h = '\u23A6', m = "Size4-Regular") : "\\rceil" === e || '\u2309' === e ? (o = '\u23A4', l = h = '\u23A5', m = "Size4-Regular") : "(" === e || "\\lparen" === e ? (o = '\u239B', l = '\u239C', h = '\u239D', m = "Size4-Regular") : ")" === e || "\\rparen" === e ? (o = '\u239E', l = '\u239F', h = '\u23A0', m = "Size4-Regular") : "\\{" === e || "\\lbrace" === e ? (o = '\u23A7', s = '\u23A8', h = '\u23A9', l = '\u23AA', m = "Size4-Regular") : "\\}" === e || "\\rbrace" === e ? (o = '\u23AB', s = '\u23AC', h = '\u23AD', l = '\u23AA', m = "Size4-Regular") : "\\lgroup" === e || '\u27EE' === e ? (o = '\u23A7', h = '\u23A9', l = '\u23AA', m = "Size4-Regular") : "\\rgroup" === e || '\u27EF' === e ? (o = '\u23AB', h = '\u23AD', l = '\u23AA', m = "Size4-Regular") : "\\lmoustache" === e || '\u23B0' === e ? (o = '\u23A7', h = '\u23AD', l = '\u23AA', m = "Size4-Regular") : "\\rmoustache" !== e && '\u23B1' !== e || (o = '\u23AB', h = '\u23A9', l = '\u23AA', m = "Size4-Regular");var c = Wt(o, m, i),
                u = c.height + c.depth,
                p = Wt(l, m, i),
                d = p.height + p.depth,
                f = Wt(h, m, i),
                g = f.height + f.depth,
                v = 0,
                y = 1;if (null !== s) {
              var b = Wt(s, m, i);v = b.height + b.depth, y = 2;
            }var x = u + g + v,
                w = Math.ceil((t - x) / (y * d)),
                k = x + w * y * d,
                S = n.fontMetrics().axisHeight;r && (S *= n.sizeMultiplier);var z = k / 2 - S,
                M = [];if (M.push(Kt(h, m, i)), null === s) for (var T = 0; T < w; T++) {
              M.push(Kt(l, m, i));
            } else {
              for (var A = 0; A < w; A++) {
                M.push(Kt(l, m, i));
              }M.push(Kt(s, m, i));for (var B = 0; B < w; B++) {
                M.push(Kt(l, m, i));
              }
            }M.push(Kt(o, m, i));var C = n.havingBaseStyle(q.TEXT),
                N = Ze.makeVList({ positionType: "bottom", positionData: z, children: M }, C);return jt(Ze.makeSpan(["delimsizing", "mult"], [N], C), q.TEXT, n, a);
          },
              Qt = function Qt(e, t, r, n) {
            var i;"sqrtTall" === e && (i = "M702 80H400000v40H742v" + (r - 54 - 80) + "l-4 4-4 4c-.667.7\n-2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1h-12l-28-84c-16.667-52-96.667\n-294.333-240-727l-212 -643 -85 170c-4-3.333-8.333-7.667-13 -13l-13-13l77-155\n 77-156c66 199.333 139 419.667 219 661 l218 661zM702 80H400000v40H742z");var a = new R(e, i),
                o = new I([a], { width: "400em", height: t + "em", viewBox: "0 0 400000 " + r, preserveAspectRatio: "xMinYMin slice" });return Ze.makeSvgSpan(["hide-tail"], [o], n);
          },
              er = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", '\u230A', '\u230B', "\\lceil", "\\rceil", '\u2308', '\u2309', "\\surd"],
              tr = ['\\uparrow', "\\downarrow", '\\updownarrow', '\\Uparrow', "\\Downarrow", '\\Updownarrow', "|", "\\|", "\\vert", "\\Vert", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", '\u27EE', '\u27EF', "\\lmoustache", "\\rmoustache", '\u23B0', '\u23B1'],
              rr = ["<", ">", "\\langle", "\\rangle", "/", "\\backslash", "\\lt", "\\gt"],
              nr = [0, 1.2, 1.8, 2.4, 3],
              ir = [{ type: "small", style: q.SCRIPTSCRIPT }, { type: "small", style: q.SCRIPT }, { type: "small", style: q.TEXT }, { type: "large", size: 1 }, { type: "large", size: 2 }, { type: "large", size: 3 }, { type: "large", size: 4 }],
              ar = [{ type: "small", style: q.SCRIPTSCRIPT }, { type: "small", style: q.SCRIPT }, { type: "small", style: q.TEXT }, { type: "stack" }],
              or = [{ type: "small", style: q.SCRIPTSCRIPT }, { type: "small", style: q.SCRIPT }, { type: "small", style: q.TEXT }, { type: "large", size: 1 }, { type: "large", size: 2 }, { type: "large", size: 3 }, { type: "large", size: 4 }, { type: "stack" }],
              sr = function sr(e) {
            if ("small" === e.type) return "Main-Regular";if ("large" === e.type) return "Size" + e.size + "-Regular";if ("stack" === e.type) return "Size4-Regular";throw new Error("Add support for delim type '" + e.type + "' here.");
          },
              lr = function lr(e, t, r, n) {
            for (var i = Math.min(2, 3 - n.style.size); i < r.length && "stack" !== r[i].type; i++) {
              var a = Wt(e, sr(r[i]), "math"),
                  o = a.height + a.depth;if ("small" === r[i].type && (o *= n.havingBaseStyle(r[i].style).sizeMultiplier), t < o) return r[i];
            }return r[r.length - 1];
          },
              hr = function hr(e, t, r, n, i, a) {
            var o;"<" === e || "\\lt" === e || '\u27E8' === e ? e = "\\langle" : ">" !== e && "\\gt" !== e && '\u27E9' !== e || (e = "\\rangle"), o = Y.contains(rr, e) ? ir : Y.contains(er, e) ? or : ar;var s,
                l,
                h,
                m,
                c,
                u,
                p,
                d,
                f = lr(e, t, o, n);return "small" === f.type ? (s = e, l = f.style, h = r, m = n, c = i, u = a, p = Ze.makeSymbol(s, "Main-Regular", c, m), d = jt(p, l, m, u), h && $t(d, m, l), d) : "large" === f.type ? Zt(e, f.size, r, n, i, a) : Jt(e, t, r, n, i, a);
          },
              mr = function mr(e, t) {
            var r,
                n,
                i = t.havingBaseSizing(),
                a = lr("\\surd", e * i.sizeMultiplier, or, i),
                o = i.sizeMultiplier,
                s = 0,
                l = 0,
                h = 0;return n = "small" === a.type ? (e < 1 ? o = 1 : e < 1.4 && (o = .7), l = 1 / o, (r = Qt("sqrtMain", s = 1.08 / o, h = 1080, t)).style.minWidth = "0.853em", .833 / o) : "large" === a.type ? (h = 1080 * nr[a.size], l = nr[a.size] / o, s = (nr[a.size] + .08) / o, (r = Qt("sqrtSize" + a.size, s, h, t)).style.minWidth = "1.02em", 1 / o) : (s = e + .08, l = e, h = Math.floor(1e3 * e) + 80, (r = Qt("sqrtTall", s, h, t)).style.minWidth = "0.742em", 1.056), r.height = l, r.style.height = s + "em", { span: r, advanceWidth: n, ruleWidth: t.fontMetrics().sqrtRuleThickness * o };
          },
              cr = function cr(e, t, r, n, i) {
            if ("<" === e || "\\lt" === e || '\u27E8' === e ? e = "\\langle" : ">" !== e && "\\gt" !== e && '\u27E9' !== e || (e = "\\rangle"), Y.contains(er, e) || Y.contains(rr, e)) return Zt(e, t, !1, r, n, i);if (Y.contains(tr, e)) return Jt(e, nr[t], !1, r, n, i);throw new X("Illegal delimiter: '" + e + "'");
          },
              ur = hr,
              pr = function pr(e, t, r, n, i, a) {
            var o = n.fontMetrics().axisHeight * n.sizeMultiplier,
                s = 5 / n.fontMetrics().ptPerEm,
                l = Math.max(t - o, r + o),
                h = Math.max(l / 500 * 901, 2 * l - s);return hr(e, h, !0, n, i, a);
          },
              dr = { "\\bigl": { mclass: "mopen", size: 1 }, "\\Bigl": { mclass: "mopen", size: 2 }, "\\biggl": { mclass: "mopen", size: 3 }, "\\Biggl": { mclass: "mopen", size: 4 }, "\\bigr": { mclass: "mclose", size: 1 }, "\\Bigr": { mclass: "mclose", size: 2 }, "\\biggr": { mclass: "mclose", size: 3 }, "\\Biggr": { mclass: "mclose", size: 4 }, "\\bigm": { mclass: "mrel", size: 1 }, "\\Bigm": { mclass: "mrel", size: 2 }, "\\biggm": { mclass: "mrel", size: 3 }, "\\Biggm": { mclass: "mrel", size: 4 }, "\\big": { mclass: "mord", size: 1 }, "\\Big": { mclass: "mord", size: 2 }, "\\bigg": { mclass: "mord", size: 3 }, "\\Bigg": { mclass: "mord", size: 4 } },
              fr = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", '\u230A', '\u230B', "\\lceil", "\\rceil", '\u2308', '\u2309', "<", ">", "\\langle", '\u27E8', "\\rangle", '\u27E9', "\\lt", "\\gt", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", '\u27EE', '\u27EF', "\\lmoustache", "\\rmoustache", '\u23B0', '\u23B1', "/", "\\backslash", "|", "\\vert", "\\|", "\\Vert", '\\uparrow', '\\Uparrow', "\\downarrow", "\\Downarrow", '\\updownarrow', '\\Updownarrow', "."];function gr(e, t) {
            var r = et(e);if (r && Y.contains(fr, r.text)) return r;throw new X("Invalid delimiter: '" + (r ? r.text : JSON.stringify(e)) + "' after '" + t.funcName + "'", e);
          }function vr(e) {
            if (!e.body) throw new Error("Bug: The leftright ParseNode wasn't fully parsed.");
          }ht({ type: "delimsizing", names: ["\\bigl", "\\Bigl", "\\biggl", "\\Biggl", "\\bigr", "\\Bigr", "\\biggr", "\\Biggr", "\\bigm", "\\Bigm", "\\biggm", "\\Biggm", "\\big", "\\Big", "\\bigg", "\\Bigg"], props: { numArgs: 1 }, handler: function handler(e, t) {
              var r = gr(t[0], e);return { type: "delimsizing", mode: e.parser.mode, size: dr[e.funcName].size, mclass: dr[e.funcName].mclass, delim: r.text };
            }, htmlBuilder: function htmlBuilder(e, t) {
              return "." === e.delim ? Ze.makeSpan([e.mclass]) : cr(e.delim, e.size, t, e.mode, [e.mclass]);
            }, mathmlBuilder: function mathmlBuilder(e) {
              var t = [];"." !== e.delim && t.push(Ct(e.delim, e.mode));var r = new Bt.MathNode("mo", t);return "mopen" === e.mclass || "mclose" === e.mclass ? r.setAttribute("fence", "true") : r.setAttribute("fence", "false"), r;
            } }), ht({ type: "leftright-right", names: ["\\right"], props: { numArgs: 1 }, handler: function handler(e, t) {
              return { type: "leftright-right", mode: e.parser.mode, delim: gr(t[0], e).text };
            } }), ht({ type: "leftright", names: ["\\left"], props: { numArgs: 1 }, handler: function handler(e, t) {
              var r = gr(t[0], e),
                  n = e.parser;++n.leftrightDepth;var i = n.parseExpression(!1);--n.leftrightDepth, n.expect("\\right", !1);var a = Ke(n.parseFunction(), "leftright-right");return { type: "leftright", mode: n.mode, body: i, left: r.text, right: a.delim };
            }, htmlBuilder: function htmlBuilder(e, t) {
              vr(e);for (var r, n, i = vt(e.body, t, !0, ["mopen", "mclose"]), a = 0, o = 0, s = !1, l = 0; l < i.length; l++) {
                i[l].isMiddle ? s = !0 : (a = Math.max(i[l].height, a), o = Math.max(i[l].depth, o));
              }if (a *= t.sizeMultiplier, o *= t.sizeMultiplier, r = "." === e.left ? wt(t, ["mopen"]) : pr(e.left, a, o, t, e.mode, ["mopen"]), i.unshift(r), s) for (var h = 1; h < i.length; h++) {
                var m = i[h].isMiddle;m && (i[h] = pr(m.delim, a, o, m.options, e.mode, []));
              }return n = "." === e.right ? wt(t, ["mclose"]) : pr(e.right, a, o, t, e.mode, ["mclose"]), i.push(n), Ze.makeSpan(["minner"], i, t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              vr(e);var r = Et(e.body, t);if ("." !== e.left) {
                var n = new Bt.MathNode("mo", [Ct(e.left, e.mode)]);n.setAttribute("fence", "true"), r.unshift(n);
              }if ("." !== e.right) {
                var i = new Bt.MathNode("mo", [Ct(e.right, e.mode)]);i.setAttribute("fence", "true"), r.push(i);
              }return Nt(r);
            } }), ht({ type: "middle", names: ["\\middle"], props: { numArgs: 1 }, handler: function handler(e, t) {
              var r = gr(t[0], e);if (!e.parser.leftrightDepth) throw new X("\\middle without preceding \\left", r);return { type: "middle", mode: e.parser.mode, delim: r.text };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r;if ("." === e.delim) r = wt(t, []);else {
                r = cr(e.delim, 1, t, e.mode, []);var n = { delim: e.delim, options: t };r.isMiddle = n;
              }return r;
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = new Bt.MathNode("mo", [Ct(e.delim, e.mode)]);return r.setAttribute("fence", "true"), r;
            } });var yr = function yr(e, t) {
            var r,
                n,
                i = Ze.wrapFragment(kt(e.body, t), t),
                a = e.label.substr(1),
                o = t.sizeMultiplier,
                s = 0,
                l = Y.isCharacterBox(e.body);if ("sout" === a) (r = Ze.makeSpan(["stretchy", "sout"])).height = t.fontMetrics().defaultRuleThickness / o, s = -.5 * t.fontMetrics().xHeight;else {
              /cancel/.test(a) ? l || i.classes.push("cancel-pad") : i.classes.push("boxpad");var h = 0;h = /box/.test(a) ? "colorbox" === a ? .3 : .34 : l ? .2 : 0, r = Pt(i, a, h, t), s = i.depth + h, e.backgroundColor && (r.style.backgroundColor = e.backgroundColor, e.borderColor && (r.style.borderColor = e.borderColor));
            }return n = e.backgroundColor ? Ze.makeVList({ positionType: "individualShift", children: [{ type: "elem", elem: r, shift: s }, { type: "elem", elem: i, shift: 0 }] }, t) : Ze.makeVList({ positionType: "individualShift", children: [{ type: "elem", elem: i, shift: 0 }, { type: "elem", elem: r, shift: s, wrapperClasses: /cancel/.test(a) ? ["svg-align"] : [] }] }, t), /cancel/.test(a) && (n.height = i.height, n.depth = i.depth), /cancel/.test(a) && !l ? Ze.makeSpan(["mord", "cancel-lap"], [n], t) : Ze.makeSpan(["mord"], [n], t);
          },
              br = function br(e, t) {
            var r = new Bt.MathNode("menclose", [It(e.body, t)]);switch (e.label) {case "\\cancel":
                r.setAttribute("notation", "updiagonalstrike");break;case "\\bcancel":
                r.setAttribute("notation", "downdiagonalstrike");break;case "\\sout":
                r.setAttribute("notation", "horizontalstrike");break;case "\\fbox":case "\\fcolorbox":
                r.setAttribute("notation", "box");break;case "\\xcancel":
                r.setAttribute("notation", "updiagonalstrike downdiagonalstrike");}return e.backgroundColor && r.setAttribute("mathbackground", e.backgroundColor), r;
          };ht({ type: "enclose", names: ["\\colorbox"], props: { numArgs: 2, allowedInText: !0, greediness: 3, argTypes: ["color", "text"] }, handler: function handler(e, t, r) {
              var n = e.parser,
                  i = e.funcName,
                  a = Ke(t[0], "color-token").color,
                  o = t[1];return { type: "enclose", mode: n.mode, label: i, backgroundColor: a, body: o };
            }, htmlBuilder: yr, mathmlBuilder: br }), ht({ type: "enclose", names: ["\\fcolorbox"], props: { numArgs: 3, allowedInText: !0, greediness: 3, argTypes: ["color", "color", "text"] }, handler: function handler(e, t, r) {
              var n = e.parser,
                  i = e.funcName,
                  a = Ke(t[0], "color-token").color,
                  o = Ke(t[1], "color-token").color,
                  s = t[2];return { type: "enclose", mode: n.mode, label: i, backgroundColor: o, borderColor: a, body: s };
            }, htmlBuilder: yr, mathmlBuilder: br }), ht({ type: "enclose", names: ["\\fbox"], props: { numArgs: 1, argTypes: ["text"], allowedInText: !0 }, handler: function handler(e, t) {
              return { type: "enclose", mode: e.parser.mode, label: "\\fbox", body: t[0] };
            } }), ht({ type: "enclose", names: ["\\cancel", "\\bcancel", "\\xcancel", "\\sout"], props: { numArgs: 1 }, handler: function handler(e, t, r) {
              var n = e.parser,
                  i = e.funcName,
                  a = t[0];return { type: "enclose", mode: n.mode, label: i, body: a };
            }, htmlBuilder: yr, mathmlBuilder: br });var xr = {};function wr(e) {
            for (var t = e.type, r = e.names, n = e.props, i = e.handler, a = e.htmlBuilder, o = e.mathmlBuilder, s = { type: t, numArgs: n.numArgs || 0, greediness: 1, allowedInText: !1, numOptionalArgs: 0, handler: i }, l = 0; l < r.length; ++l) {
              xr[r[l]] = s;
            }a && (st[t] = a), o && (lt[t] = o);
          }function kr(e) {
            var t = [];e.consumeSpaces();for (var r = e.nextToken.text; "\\hline" === r || "\\hdashline" === r;) {
              e.consume(), t.push("\\hdashline" === r), e.consumeSpaces(), r = e.nextToken.text;
            }return t;
          }function Sr(e, t, r) {
            var n = t.hskipBeforeAndAfter,
                i = t.addJot,
                a = t.cols,
                o = t.arraystretch;if (e.gullet.beginGroup(), e.gullet.macros.set("\\\\", "\\cr"), !o) {
              var s = e.gullet.expandMacroAsText("\\arraystretch");if (null == s) o = 1;else if (!(o = parseFloat(s)) || o < 0) throw new X("Invalid \\arraystretch: " + s);
            }var l = [],
                h = [l],
                m = [],
                c = [];for (c.push(kr(e));;) {
              var u = e.parseExpression(!1, "\\cr");u = { type: "ordgroup", mode: e.mode, body: u }, r && (u = { type: "styling", mode: e.mode, style: r, body: [u] }), l.push(u);var p = e.nextToken.text;if ("&" === p) e.consume();else {
                if ("\\end" === p) {
                  1 === l.length && "styling" === u.type && 0 === u.body[0].body.length && h.pop(), c.length < h.length + 1 && c.push([]);break;
                }if ("\\cr" !== p) throw new X("Expected & or \\\\ or \\cr or \\end", e.nextToken);var d = Ke(e.parseFunction(), "cr");m.push(d.size), c.push(kr(e)), l = [], h.push(l);
              }
            }return e.gullet.endGroup(), { type: "array", mode: e.mode, addJot: i, arraystretch: o, body: h, cols: a, rowGaps: m, hskipBeforeAndAfter: n, hLinesBeforeRow: c };
          }function zr(e) {
            return "d" === e.substr(0, 1) ? "display" : "text";
          }var Mr = function Mr(e, t) {
            var r,
                n,
                i = e.body.length,
                a = e.hLinesBeforeRow,
                o = 0,
                s = new Array(i),
                l = [],
                h = 1 / t.fontMetrics().ptPerEm,
                m = 5 * h,
                c = 12 * h,
                u = 3 * h,
                p = e.arraystretch * c,
                d = .7 * p,
                f = .3 * p,
                g = 0;function v(e) {
              for (var t = 0; t < e.length; ++t) {
                0 < t && (g += .25), l.push({ pos: g, isDashed: e[t] });
              }
            }for (v(a[0]), r = 0; r < e.body.length; ++r) {
              var y = e.body[r],
                  b = d,
                  x = f;o < y.length && (o = y.length);var w = new Array(y.length);for (n = 0; n < y.length; ++n) {
                var k = kt(y[n], t);x < k.depth && (x = k.depth), b < k.height && (b = k.height), w[n] = k;
              }var S = e.rowGaps[r],
                  z = 0;S && 0 < (z = De(S, t)) && (x < (z += f) && (x = z), z = 0), e.addJot && (x += u), w.height = b, w.depth = x, g += b, w.pos = g, g += x + z, s[r] = w, v(a[r + 1]);
            }var M,
                T,
                A = g / 2 + t.fontMetrics().axisHeight,
                B = e.cols || [],
                C = [];for (T = n = 0; n < o || T < B.length; ++n, ++T) {
              for (var N = B[T] || {}, q = !0; "separator" === N.type;) {
                if (q || ((M = Ze.makeSpan(["arraycolsep"], [])).style.width = t.fontMetrics().doubleRuleSep + "em", C.push(M)), "|" === N.separator) {
                  var E = Ze.makeSpan(["vertical-separator"], [], t);E.style.height = g + "em", E.style.verticalAlign = -(g - A) + "em", C.push(E);
                } else {
                  if (":" !== N.separator) throw new X("Invalid separator type: " + N.separator);var O = Ze.makeSpan(["vertical-separator", "vs-dashed"], [], t);O.style.height = g + "em", O.style.verticalAlign = -(g - A) + "em", C.push(O);
                }N = B[++T] || {}, q = !1;
              }if (!(o <= n)) {
                var I = void 0;(0 < n || e.hskipBeforeAndAfter) && 0 !== (I = Y.deflt(N.pregap, m)) && ((M = Ze.makeSpan(["arraycolsep"], [])).style.width = I + "em", C.push(M));var R = [];for (r = 0; r < i; ++r) {
                  var L = s[r],
                      H = L[n];if (H) {
                    var D = L.pos - A;H.depth = L.depth, H.height = L.height, R.push({ type: "elem", elem: H, shift: D });
                  }
                }R = Ze.makeVList({ positionType: "individualShift", children: R }, t), R = Ze.makeSpan(["col-align-" + (N.align || "c")], [R]), C.push(R), (n < o - 1 || e.hskipBeforeAndAfter) && 0 !== (I = Y.deflt(N.postgap, m)) && ((M = Ze.makeSpan(["arraycolsep"], [])).style.width = I + "em", C.push(M));
              }
            }if (s = Ze.makeSpan(["mtable"], C), 0 < l.length) {
              for (var P = Ze.makeLineSpan("hline", t, .05), F = Ze.makeLineSpan("hdashline", t, .05), V = [{ type: "elem", elem: s, shift: 0 }]; 0 < l.length;) {
                var U = l.pop(),
                    G = U.pos - A;U.isDashed ? V.push({ type: "elem", elem: F, shift: G }) : V.push({ type: "elem", elem: P, shift: G });
              }s = Ze.makeVList({ positionType: "individualShift", children: V }, t);
            }return Ze.makeSpan(["mord"], [s], t);
          },
              Tr = function Tr(e, t) {
            return new Bt.MathNode("mtable", e.body.map(function (e) {
              return new Bt.MathNode("mtr", e.map(function (e) {
                return new Bt.MathNode("mtd", [It(e, t)]);
              }));
            }));
          },
              Ar = function Ar(e, t) {
            var n,
                r = [],
                i = Sr(e.parser, { cols: r, addJot: !0 }, "display"),
                a = 0,
                o = { type: "ordgroup", mode: e.mode, body: [] },
                s = Je(t[0], "ordgroup");if (s) {
              for (var l = "", h = 0; h < s.body.length; h++) {
                l += Ke(s.body[h], "textord").text;
              }n = Number(l), a = 2 * n;
            }var m = !a;i.body.forEach(function (e) {
              for (var t = 1; t < e.length; t += 2) {
                Ke(Ke(e[t], "styling").body[0], "ordgroup").body.unshift(o);
              }if (m) a < e.length && (a = e.length);else {
                var r = e.length / 2;if (n < r) throw new X("Too many math in a row: expected " + n + ", but got " + r, e[0]);
              }
            });for (var c = 0; c < a; ++c) {
              var u = "r",
                  p = 0;c % 2 == 1 ? u = "l" : 0 < c && m && (p = 1), r[c] = { type: "align", align: u, pregap: p, postgap: 0 };
            }return i;
          };wr({ type: "array", names: ["array", "darray"], props: { numArgs: 1 }, handler: function handler(e, t) {
              var r = { cols: (et(t[0]) ? [t[0]] : Ke(t[0], "ordgroup").body).map(function (e) {
                  var t = function (e) {
                    var t = et(e);if (!t) throw new Error("Expected node of symbol group type, but got " + (e ? "node of type " + e.type : String(e)));return t;
                  }(e).text;if (-1 !== "lcr".indexOf(t)) return { type: "align", align: t };if ("|" === t) return { type: "separator", separator: "|" };if (":" === t) return { type: "separator", separator: ":" };throw new X("Unknown column alignment: " + t, e);
                }), hskipBeforeAndAfter: !0 };return Sr(e.parser, r, zr(e.envName));
            }, htmlBuilder: Mr, mathmlBuilder: Tr }), wr({ type: "array", names: ["matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix"], props: { numArgs: 0 }, handler: function handler(e) {
              var t = { matrix: null, pmatrix: ["(", ")"], bmatrix: ["[", "]"], Bmatrix: ["\\{", "\\}"], vmatrix: ["|", "|"], Vmatrix: ["\\Vert", "\\Vert"] }[e.envName],
                  r = Sr(e.parser, { hskipBeforeAndAfter: !1 }, zr(e.envName));return t ? { type: "leftright", mode: e.mode, body: [r], left: t[0], right: t[1] } : r;
            }, htmlBuilder: Mr, mathmlBuilder: Tr }), wr({ type: "array", names: ["cases", "dcases"], props: { numArgs: 0 }, handler: function handler(e) {
              var t = Sr(e.parser, { arraystretch: 1.2, cols: [{ type: "align", align: "l", pregap: 0, postgap: 1 }, { type: "align", align: "l", pregap: 0, postgap: 0 }] }, zr(e.envName));return { type: "leftright", mode: e.mode, body: [t], left: "\\{", right: "." };
            }, htmlBuilder: Mr, mathmlBuilder: Tr }), wr({ type: "array", names: ["aligned"], props: { numArgs: 0 }, handler: Ar, htmlBuilder: Mr, mathmlBuilder: Tr }), wr({ type: "array", names: ["gathered"], props: { numArgs: 0 }, handler: function handler(e) {
              return Sr(e.parser, { cols: [{ type: "align", align: "c" }], addJot: !0 }, "display");
            }, htmlBuilder: Mr, mathmlBuilder: Tr }), wr({ type: "array", names: ["alignedat"], props: { numArgs: 1 }, handler: Ar, htmlBuilder: Mr, mathmlBuilder: Tr }), ht({ type: "text", names: ["\\hline", "\\hdashline"], props: { numArgs: 0, allowedInText: !0, allowedInMath: !0 }, handler: function handler(e, t) {
              throw new X(e.funcName + " valid only within array environment");
            } });var Br = xr;ht({ type: "environment", names: ["\\begin", "\\end"], props: { numArgs: 1, argTypes: ["text"] }, handler: function handler(e, t) {
              var r = e.parser,
                  n = e.funcName,
                  i = t[0];if ("ordgroup" !== i.type) throw new X("Invalid environment name", i);for (var a = "", o = 0; o < i.body.length; ++o) {
                a += Ke(i.body[o], "textord").text;
              }if ("\\begin" !== n) return { type: "environment", mode: r.mode, name: a, nameGroup: i };if (!Br.hasOwnProperty(a)) throw new X("No such environment: " + a, i);var s = Br[a],
                  l = r.parseArguments("\\begin{" + a + "}", s),
                  h = l.args,
                  m = l.optArgs,
                  c = { mode: r.mode, envName: a, parser: r },
                  u = s.handler(c, h, m);r.expect("\\end", !1);var p = r.nextToken,
                  d = Ke(r.parseFunction(), "environment");if (d.name !== a) throw new X("Mismatch: \\begin{" + a + "} matched by \\end{" + d.name + "}", p);return u;
            } });var Cr = Ze.makeSpan;function Nr(e, t) {
            var r = vt(e.body, t, !0);return Cr([e.mclass], r, t);
          }function qr(e, t) {
            var r = Et(e.body, t);return Bt.newDocumentFragment(r);
          }ht({ type: "mclass", names: ["\\mathord", "\\mathbin", "\\mathrel", "\\mathopen", "\\mathclose", "\\mathpunct", "\\mathinner"], props: { numArgs: 1 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = e.funcName,
                  i = t[0];return { type: "mclass", mode: r.mode, mclass: "m" + n.substr(5), body: ct(i) };
            }, htmlBuilder: Nr, mathmlBuilder: qr });var Er = function Er(e) {
            var t = "ordgroup" === e.type && e.body.length ? e.body[0] : e;return "atom" !== t.type || "bin" !== t.family && "rel" !== t.family ? "mord" : "m" + t.family;
          };ht({ type: "mclass", names: ["\\@binrel"], props: { numArgs: 2 }, handler: function handler(e, t) {
              return { type: "mclass", mode: e.parser.mode, mclass: Er(t[0]), body: [t[1]] };
            } }), ht({ type: "mclass", names: ["\\stackrel", "\\overset", '\\underset'], props: { numArgs: 2 }, handler: function handler(e, t) {
              var r,
                  n = e.parser,
                  i = e.funcName,
                  a = t[1],
                  o = t[0];r = "\\stackrel" !== i ? Er(a) : "mrel";var s = { type: "op", mode: a.mode, limits: !0, alwaysHandleSupSub: !0, symbol: !1, suppressBaseShift: "\\stackrel" !== i, body: ct(a) },
                  l = { type: "supsub", mode: o.mode, base: s, sup: '\\underset' === i ? null : o, sub: '\\underset' === i ? o : null };return { type: "mclass", mode: n.mode, mclass: r, body: [l] };
            }, htmlBuilder: Nr, mathmlBuilder: qr });var Or = function Or(e, t) {
            var r = e.font,
                n = t.withFont(r);return kt(e.body, n);
          },
              Ir = function Ir(e, t) {
            var r = e.font,
                n = t.withFont(r);return It(e.body, n);
          },
              Rr = { "\\Bbb": "\\mathbb", "\\bold": "\\mathbf", "\\frak": "\\mathfrak", "\\bm": "\\boldsymbol" };ht({ type: "font", names: ["\\mathrm", "\\mathit", "\\mathbf", "\\mathnormal", "\\mathbb", "\\mathcal", "\\mathfrak", "\\mathscr", "\\mathsf", "\\mathtt", "\\Bbb", "\\bold", "\\frak"], props: { numArgs: 1, greediness: 2 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = e.funcName,
                  i = t[0],
                  a = n;return a in Rr && (a = Rr[a]), { type: "font", mode: r.mode, font: a.slice(1), body: i };
            }, htmlBuilder: Or, mathmlBuilder: Ir }), ht({ type: "mclass", names: ["\\boldsymbol", "\\bm"], props: { numArgs: 1, greediness: 2 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = t[0];return { type: "mclass", mode: r.mode, mclass: Er(n), body: [{ type: "font", mode: r.mode, font: "boldsymbol", body: n }] };
            } }), ht({ type: "font", names: ["\\rm", "\\sf", "\\tt", "\\bf", "\\it"], props: { numArgs: 0, allowedInText: !0 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = e.funcName,
                  i = e.breakOnTokenText,
                  a = r.mode;r.consumeSpaces();var o = r.parseExpression(!0, i);return { type: "font", mode: a, font: "math" + n.slice(1), body: { type: "ordgroup", mode: r.mode, body: o } };
            }, htmlBuilder: Or, mathmlBuilder: Ir });var Lr = function Lr(e, t) {
            var r = t.style;"display" === e.size ? r = q.DISPLAY : "text" === e.size && r.size === q.DISPLAY.size ? r = q.TEXT : "script" === e.size ? r = q.SCRIPT : "scriptscript" === e.size && (r = q.SCRIPTSCRIPT);var n,
                i = r.fracNum(),
                a = r.fracDen();n = t.havingStyle(i);var o = kt(e.numer, n, t);if (e.continued) {
              var s = 8.5 / t.fontMetrics().ptPerEm,
                  l = 3.5 / t.fontMetrics().ptPerEm;o.height = o.height < s ? s : o.height, o.depth = o.depth < l ? l : o.depth;
            }n = t.havingStyle(a);var h,
                m,
                c,
                u,
                p,
                d,
                f,
                g,
                v,
                y,
                b = kt(e.denom, n, t);if (c = e.hasBarLine ? (m = (h = e.barSize ? (m = De(e.barSize, t), Ze.makeLineSpan("frac-line", t, m)) : Ze.makeLineSpan("frac-line", t)).height, h.height) : (h = null, m = 0, t.fontMetrics().defaultRuleThickness), d = r.size === q.DISPLAY.size ? (u = t.fontMetrics().num1, p = 0 < m ? 3 * c : 7 * c, t.fontMetrics().denom1) : (p = 0 < m ? (u = t.fontMetrics().num2, c) : (u = t.fontMetrics().num3, 3 * c), t.fontMetrics().denom2), h) {
              var x = t.fontMetrics().axisHeight;u - o.depth - (x + .5 * m) < p && (u += p - (u - o.depth - (x + .5 * m))), x - .5 * m - (b.height - d) < p && (d += p - (x - .5 * m - (b.height - d)));var w = -(x - .5 * m);f = Ze.makeVList({ positionType: "individualShift", children: [{ type: "elem", elem: b, shift: d }, { type: "elem", elem: h, shift: w }, { type: "elem", elem: o, shift: -u }] }, t);
            } else {
              var k = u - o.depth - (b.height - d);k < p && (u += .5 * (p - k), d += .5 * (p - k)), f = Ze.makeVList({ positionType: "individualShift", children: [{ type: "elem", elem: b, shift: d }, { type: "elem", elem: o, shift: -u }] }, t);
            }return n = t.havingStyle(r), f.height *= n.sizeMultiplier / t.sizeMultiplier, f.depth *= n.sizeMultiplier / t.sizeMultiplier, g = r.size === q.DISPLAY.size ? t.fontMetrics().delim1 : t.fontMetrics().delim2, v = null == e.leftDelim ? wt(t, ["mopen"]) : ur(e.leftDelim, g, !0, t.havingStyle(r), e.mode, ["mopen"]), y = e.continued ? Ze.makeSpan([]) : null == e.rightDelim ? wt(t, ["mclose"]) : ur(e.rightDelim, g, !0, t.havingStyle(r), e.mode, ["mclose"]), Ze.makeSpan(["mord"].concat(n.sizingClasses(t)), [v, Ze.makeSpan(["mfrac"], [f]), y], t);
          },
              Hr = function Hr(e, t) {
            var r = new Bt.MathNode("mfrac", [It(e.numer, t), It(e.denom, t)]);if (e.hasBarLine) {
              if (e.barSize) {
                var n = De(e.barSize, t);r.setAttribute("linethickness", n + "em");
              }
            } else r.setAttribute("linethickness", "0px");if (null == e.leftDelim && null == e.rightDelim) return r;var i = [];if (null != e.leftDelim) {
              var a = new Bt.MathNode("mo", [new Bt.TextNode(e.leftDelim)]);a.setAttribute("fence", "true"), i.push(a);
            }if (i.push(r), null != e.rightDelim) {
              var o = new Bt.MathNode("mo", [new Bt.TextNode(e.rightDelim)]);o.setAttribute("fence", "true"), i.push(o);
            }return Nt(i);
          };ht({ type: "genfrac", names: ["\\cfrac", "\\dfrac", "\\frac", "\\tfrac", "\\dbinom", "\\binom", "\\tbinom", "\\\\atopfrac", "\\\\bracefrac", "\\\\brackfrac"], props: { numArgs: 2, greediness: 2 }, handler: function handler(e, t) {
              var r,
                  n = e.parser,
                  i = e.funcName,
                  a = t[0],
                  o = t[1],
                  s = null,
                  l = null,
                  h = "auto";switch (i) {case "\\cfrac":case "\\dfrac":case "\\frac":case "\\tfrac":
                  r = !0;break;case "\\\\atopfrac":
                  r = !1;break;case "\\dbinom":case "\\binom":case "\\tbinom":
                  r = !1, s = "(", l = ")";break;case "\\\\bracefrac":
                  r = !1, s = "\\{", l = "\\}";break;case "\\\\brackfrac":
                  r = !1, s = "[", l = "]";break;default:
                  throw new Error("Unrecognized genfrac command");}switch (i) {case "\\cfrac":case "\\dfrac":case "\\dbinom":
                  h = "display";break;case "\\tfrac":case "\\tbinom":
                  h = "text";}return { type: "genfrac", mode: n.mode, continued: "\\cfrac" === i, numer: a, denom: o, hasBarLine: r, leftDelim: s, rightDelim: l, size: h, barSize: null };
            }, htmlBuilder: Lr, mathmlBuilder: Hr }), ht({ type: "infix", names: ["\\over", "\\choose", "\\atop", "\\brace", "\\brack"], props: { numArgs: 0, infix: !0 }, handler: function handler(e) {
              var t,
                  r = e.parser,
                  n = e.funcName,
                  i = e.token;switch (n) {case "\\over":
                  t = "\\frac";break;case "\\choose":
                  t = "\\binom";break;case "\\atop":
                  t = "\\\\atopfrac";break;case "\\brace":
                  t = "\\\\bracefrac";break;case "\\brack":
                  t = "\\\\brackfrac";break;default:
                  throw new Error("Unrecognized infix genfrac command");}return { type: "infix", mode: r.mode, replaceWith: t, token: i };
            } });var Dr = ["display", "text", "script", "scriptscript"],
              Pr = function Pr(e) {
            var t = null;return 0 < e.length && (t = "." === (t = e) ? null : t), t;
          };ht({ type: "genfrac", names: ["\\genfrac"], props: { numArgs: 6, greediness: 6, argTypes: ["math", "math", "size", "text", "math", "math"] }, handler: function handler(e, t) {
              var r = e.parser,
                  n = t[4],
                  i = t[5],
                  a = Je(t[0], "ordgroup");a = Qe(a ? a.body[0] : t[0], "open");var o = Pr(a.text),
                  s = Je(t[1], "ordgroup");s = Qe(s ? s.body[0] : t[1], "close");var l,
                  h = Pr(s.text),
                  m = Ke(t[2], "size"),
                  c = null;l = !!m.isBlank || 0 < (c = m.value).number;var u = "auto",
                  p = Je(t[3], "ordgroup");if (p) {
                if (0 < p.body.length) {
                  var d = Ke(p.body[0], "textord");u = Dr[Number(d.text)];
                }
              } else p = Ke(t[3], "textord"), u = Dr[Number(p.text)];return { type: "genfrac", mode: r.mode, numer: n, denom: i, continued: !1, hasBarLine: l, barSize: c, leftDelim: o, rightDelim: h, size: u };
            }, htmlBuilder: Lr, mathmlBuilder: Hr }), ht({ type: "infix", names: ["\\above"], props: { numArgs: 1, argTypes: ["size"], infix: !0 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = (e.funcName, e.token);return { type: "infix", mode: r.mode, replaceWith: "\\\\abovefrac", size: Ke(t[0], "size").value, token: n };
            } }), ht({ type: "genfrac", names: ["\\\\abovefrac"], props: { numArgs: 3, argTypes: ["math", "size", "math"] }, handler: function handler(e, t) {
              var r = e.parser,
                  n = (e.funcName, t[0]),
                  i = function (e) {
                if (!e) throw new Error("Expected non-null, but got " + String(e));return e;
              }(Ke(t[1], "infix").size),
                  a = t[2],
                  o = 0 < i.number;return { type: "genfrac", mode: r.mode, numer: n, denom: a, continued: !1, hasBarLine: o, barSize: i, leftDelim: null, rightDelim: null, size: "auto" };
            }, htmlBuilder: Lr, mathmlBuilder: Hr });var Fr = function Fr(e, t) {
            var r,
                n,
                i = t.style,
                a = Je(e, "supsub");n = a ? (r = a.sup ? kt(a.sup, t.havingStyle(i.sup()), t) : kt(a.sub, t.havingStyle(i.sub()), t), Ke(a.base, "horizBrace")) : Ke(e, "horizBrace");var o,
                s = kt(n.base, t.havingBaseStyle(q.DISPLAY)),
                l = Vt(n, t);if (n.isOver ? (o = Ze.makeVList({ positionType: "firstBaseline", children: [{ type: "elem", elem: s }, { type: "kern", size: .1 }, { type: "elem", elem: l }] }, t)).children[0].children[0].children[1].classes.push("svg-align") : (o = Ze.makeVList({ positionType: "bottom", positionData: s.depth + .1 + l.height, children: [{ type: "elem", elem: l }, { type: "kern", size: .1 }, { type: "elem", elem: s }] }, t)).children[0].children[0].children[0].classes.push("svg-align"), r) {
              var h = Ze.makeSpan(["mord", n.isOver ? "mover" : "munder"], [o], t);o = n.isOver ? Ze.makeVList({ positionType: "firstBaseline", children: [{ type: "elem", elem: h }, { type: "kern", size: .2 }, { type: "elem", elem: r }] }, t) : Ze.makeVList({ positionType: "bottom", positionData: h.depth + .2 + r.height + r.depth, children: [{ type: "elem", elem: r }, { type: "kern", size: .2 }, { type: "elem", elem: h }] }, t);
            }return Ze.makeSpan(["mord", n.isOver ? "mover" : "munder"], [o], t);
          };ht({ type: "horizBrace", names: ["\\overbrace", '\\underbrace'], props: { numArgs: 1 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = e.funcName;return { type: "horizBrace", mode: r.mode, label: n, isOver: /^\\over/.test(n), base: t[0] };
            }, htmlBuilder: Fr, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = Ft(e.label);return new Bt.MathNode(e.isOver ? "mover" : "munder", [It(e.base, t), r]);
            } }), ht({ type: "href", names: ["\\href"], props: { numArgs: 2, argTypes: ["url", "original"], allowedInText: !0 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = t[1],
                  i = Ke(t[0], "url").url;return { type: "href", mode: r.mode, href: i, body: ct(n) };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = vt(e.body, t, !1);return Ze.makeAnchor(e.href, [], r, t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = Ot(e.body, t);return r instanceof Tt || (r = new Tt("mrow", [r])), r.setAttribute("href", e.href), r;
            } }), ht({ type: "href", names: ['\\url'], props: { numArgs: 1, argTypes: ["url"], allowedInText: !0 }, handler: function handler(e, t) {
              for (var r = e.parser, n = Ke(t[0], "url").url, i = [], a = 0; a < n.length; a++) {
                var o = n[a];"~" === o && (o = "\\textasciitilde"), i.push({ type: "textord", mode: "text", text: o });
              }var s = { type: "text", mode: r.mode, font: "\\texttt", body: i };return { type: "href", mode: r.mode, href: n, body: ct(s) };
            } }), ht({ type: "htmlmathml", names: ["\\html@mathml"], props: { numArgs: 2, allowedInText: !0 }, handler: function handler(e, t) {
              return { type: "htmlmathml", mode: e.parser.mode, html: ct(t[0]), mathml: ct(t[1]) };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = vt(e.html, t, !1);return Ze.makeFragment(r);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              return Ot(e.mathml, t);
            } });var Vr = function Vr(e) {
            if (/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(e)) return { number: +e, unit: "bp" };var t = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(e);if (!t) throw new X("Invalid size: '" + e + "' in \\includegraphics");var r = { number: +(t[1] + t[2]), unit: t[3] };if (!He(r)) throw new X("Invalid unit: '" + r.unit + "' in \\includegraphics.");return r;
          };ht({ type: "includegraphics", names: ["\\includegraphics"], props: { numArgs: 1, numOptionalArgs: 1, argTypes: ["raw", "url"], allowedInText: !1 }, handler: function handler(e, t, r) {
              var n = e.parser,
                  i = { number: 0, unit: "em" },
                  a = { number: .9, unit: "em" },
                  o = { number: 0, unit: "em" },
                  s = "";if (r[0]) for (var l = Ke(r[0], "raw").string.split(","), h = 0; h < l.length; h++) {
                var m = l[h].split("=");if (2 === m.length) {
                  var c = m[1].trim();switch (m[0].trim()) {case "alt":
                      s = c;break;case "width":
                      i = Vr(c);break;case "height":
                      a = Vr(c);break;case "totalheight":
                      o = Vr(c);break;default:
                      throw new X("Invalid key: '" + m[0] + "' in \\includegraphics.");}
                }
              }var u = Ke(t[0], "url").url;return "" === s && (s = (s = (s = u).replace(/^.*[\\/]/, "")).substring(0, s.lastIndexOf("."))), { type: "includegraphics", mode: n.mode, alt: s, width: i, height: a, totalheight: o, src: u };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = De(e.height, t),
                  n = 0;0 < e.totalheight.number && (n = De(e.totalheight, t) - r, n = Number(n.toFixed(2)));var i = 0;0 < e.width.number && (i = De(e.width, t));var a = { height: r + n + "em" };0 < i && (a.width = i + "em"), 0 < n && (a.verticalAlign = -n + "em");var o = new N(e.src, e.alt, a);return o.height = r, o.depth = n, o;
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = new Bt.MathNode("mglyph", []);r.setAttribute("alt", e.alt);var n = De(e.height, t),
                  i = 0;if (0 < e.totalheight.number && (i = (i = De(e.totalheight, t) - n).toFixed(2), r.setAttribute("valign", "-" + i + "em")), r.setAttribute("height", n + i + "em"), 0 < e.width.number) {
                var a = De(e.width, t);r.setAttribute("width", a + "em");
              }return r.setAttribute("src", e.src), r;
            } }), ht({ type: "kern", names: ["\\kern", "\\mkern", "\\hskip", "\\mskip"], props: { numArgs: 1, argTypes: ["size"], allowedInText: !0 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = e.funcName,
                  i = Ke(t[0], "size");if (r.settings.strict) {
                var a = "m" === n[1],
                    o = "mu" === i.value.unit;a ? (o || r.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + n + " supports only mu units, not " + i.value.unit + " units"), "math" !== r.mode && r.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + n + " works only in math mode")) : o && r.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + n + " doesn't support mu units");
              }return { type: "kern", mode: r.mode, dimension: i.value };
            }, htmlBuilder: function htmlBuilder(e, t) {
              return Ze.makeGlue(e.dimension, t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = De(e.dimension, t);return new Bt.SpaceNode(r);
            } }), ht({ type: "lap", names: ["\\mathllap", "\\mathrlap", "\\mathclap"], props: { numArgs: 1, allowedInText: !0 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = e.funcName,
                  i = t[0];return { type: "lap", mode: r.mode, alignment: n.slice(5), body: i };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r;r = "clap" === e.alignment ? (r = Ze.makeSpan([], [kt(e.body, t)]), Ze.makeSpan(["inner"], [r], t)) : Ze.makeSpan(["inner"], [kt(e.body, t)]);var n = Ze.makeSpan(["fix"], []),
                  i = Ze.makeSpan([e.alignment], [r, n], t),
                  a = Ze.makeSpan(["strut"]);return a.style.height = i.height + i.depth + "em", a.style.verticalAlign = -i.depth + "em", i.children.unshift(a), i = Ze.makeVList({ positionType: "firstBaseline", children: [{ type: "elem", elem: i }] }, t), Ze.makeSpan(["mord"], [i], t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = new Bt.MathNode("mpadded", [It(e.body, t)]);if ("rlap" !== e.alignment) {
                var n = "llap" === e.alignment ? "-1" : "-0.5";r.setAttribute("lspace", n + "width");
              }return r.setAttribute("width", "0px"), r;
            } }), ht({ type: "styling", names: ["\\(", "$"], props: { numArgs: 0, allowedInText: !0, allowedInMath: !1, consumeMode: "math" }, handler: function handler(e, t) {
              var r = e.funcName,
                  n = e.parser,
                  i = n.mode;n.switchMode("math");var a = "\\(" === r ? "\\)" : "$",
                  o = n.parseExpression(!1, a);return n.expect(a, !1), n.switchMode(i), n.consume(), { type: "styling", mode: n.mode, style: "text", body: o };
            } }), ht({ type: "text", names: ["\\)", "\\]"], props: { numArgs: 0, allowedInText: !0, allowedInMath: !1 }, handler: function handler(e, t) {
              throw new X("Mismatched " + e.funcName);
            } });var Ur = function Ur(e, t) {
            switch (t.style.size) {case q.DISPLAY.size:
                return e.display;case q.TEXT.size:
                return e.text;case q.SCRIPT.size:
                return e.script;case q.SCRIPTSCRIPT.size:
                return e.scriptscript;default:
                return e.text;}
          };ht({ type: "mathchoice", names: ["\\mathchoice"], props: { numArgs: 4 }, handler: function handler(e, t) {
              return { type: "mathchoice", mode: e.parser.mode, display: ct(t[0]), text: ct(t[1]), script: ct(t[2]), scriptscript: ct(t[3]) };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = Ur(e, t),
                  n = vt(r, t, !1);return Ze.makeFragment(n);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = Ur(e, t);return Ot(r, t);
            } });var Gr = function Gr(e, t) {
            var r,
                n,
                i,
                a = !1,
                o = Je(e, "supsub");o ? (r = o.sup, n = o.sub, i = Ke(o.base, "op"), a = !0) : i = Ke(e, "op");var s,
                l = t.style,
                h = !1;if (l.size === q.DISPLAY.size && i.symbol && !Y.contains(["\\smallint"], i.name) && (h = !0), i.symbol) {
              var m = h ? "Size2-Regular" : "Size1-Regular",
                  c = "";if ("\\oiint" !== i.name && "\\oiiint" !== i.name || (c = i.name.substr(1), i.name = "oiint" === c ? "\\iint" : "\\iiint"), s = Ze.makeSymbol(i.name, m, "math", t, ["mop", "op-symbol", h ? "large-op" : "small-op"]), 0 < c.length) {
                var u = s.italic,
                    p = Ze.staticSvg(c + "Size" + (h ? "2" : "1"), t);s = Ze.makeVList({ positionType: "individualShift", children: [{ type: "elem", elem: s, shift: 0 }, { type: "elem", elem: p, shift: h ? .08 : 0 }] }, t), i.name = "\\" + c, s.classes.unshift("mop"), s.italic = u;
              }
            } else if (i.body) {
              var d = vt(i.body, t, !0);1 === d.length && d[0] instanceof O ? (s = d[0]).classes[0] = "mop" : s = Ze.makeSpan(["mop"], Ze.tryCombineChars(d), t);
            } else {
              for (var f = [], g = 1; g < i.name.length; g++) {
                f.push(Ze.mathsym(i.name[g], i.mode));
              }s = Ze.makeSpan(["mop"], f, t);
            }var v = 0,
                y = 0;if ((s instanceof O || "\\oiint" === i.name || "\\oiiint" === i.name) && !i.suppressBaseShift && (v = (s.height - s.depth) / 2 - t.fontMetrics().axisHeight, y = s.italic), a) {
              var b, x, w;if (s = Ze.makeSpan([], [s]), r) {
                var k = kt(r, t.havingStyle(l.sup()), t);x = { elem: k, kern: Math.max(t.fontMetrics().bigOpSpacing1, t.fontMetrics().bigOpSpacing3 - k.depth) };
              }if (n) {
                var S = kt(n, t.havingStyle(l.sub()), t);b = { elem: S, kern: Math.max(t.fontMetrics().bigOpSpacing2, t.fontMetrics().bigOpSpacing4 - S.height) };
              }if (x && b) {
                var z = t.fontMetrics().bigOpSpacing5 + b.elem.height + b.elem.depth + b.kern + s.depth + v;w = Ze.makeVList({ positionType: "bottom", positionData: z, children: [{ type: "kern", size: t.fontMetrics().bigOpSpacing5 }, { type: "elem", elem: b.elem, marginLeft: -y + "em" }, { type: "kern", size: b.kern }, { type: "elem", elem: s }, { type: "kern", size: x.kern }, { type: "elem", elem: x.elem, marginLeft: y + "em" }, { type: "kern", size: t.fontMetrics().bigOpSpacing5 }] }, t);
              } else if (b) {
                var M = s.height - v;w = Ze.makeVList({ positionType: "top", positionData: M, children: [{ type: "kern", size: t.fontMetrics().bigOpSpacing5 }, { type: "elem", elem: b.elem, marginLeft: -y + "em" }, { type: "kern", size: b.kern }, { type: "elem", elem: s }] }, t);
              } else {
                if (!x) return s;var T = s.depth + v;w = Ze.makeVList({ positionType: "bottom", positionData: T, children: [{ type: "elem", elem: s }, { type: "kern", size: x.kern }, { type: "elem", elem: x.elem, marginLeft: y + "em" }, { type: "kern", size: t.fontMetrics().bigOpSpacing5 }] }, t);
              }return Ze.makeSpan(["mop", "op-limits"], [w], t);
            }return v && (s.style.position = "relative", s.style.top = v + "em"), s;
          },
              Xr = function Xr(e, t) {
            var r;if (e.symbol) r = new Tt("mo", [Ct(e.name, e.mode)]);else {
              if (!e.body) return Mt([r = new Tt("mi", [new At(e.name.slice(1))]), new Tt("mo", [Ct('\u2061', "text")])]);r = new Tt("mo", Et(e.body, t));
            }return r;
          },
              Yr = { '\u220F': "\\prod", '\u2210': "\\coprod", '\u2211': "\\sum", '\u22C0': "\\bigwedge", '\u22C1': "\\bigvee", '\u22C2': "\\bigcap", '\u22C3': "\\bigcap", '\u2A00': "\\bigodot", '\u2A01': "\\bigoplus", '\u2A02': "\\bigotimes", '\u2A04': "\\biguplus", '\u2A06': "\\bigsqcup" };ht({ type: "op", names: ["\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap", "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes", "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint", '\u220F', '\u2210', '\u2211', '\u22C0', '\u22C1', '\u22C2', '\u22C3', '\u2A00', '\u2A01', '\u2A02', '\u2A04', '\u2A06'], props: { numArgs: 0 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = e.funcName;return 1 === n.length && (n = Yr[n]), { type: "op", mode: r.mode, limits: !0, symbol: !0, name: n };
            }, htmlBuilder: Gr, mathmlBuilder: Xr }), ht({ type: "op", names: ["\\mathop"], props: { numArgs: 1 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = t[0];return { type: "op", mode: r.mode, limits: !1, symbol: !1, body: ct(n) };
            }, htmlBuilder: Gr, mathmlBuilder: Xr });var _r = { '\u222B': "\\int", '\u222C': "\\iint", '\u222D': "\\iiint", '\u222E': "\\oint", '\u222F': "\\oiint", '\u2230': "\\oiiint" };function Wr(e, t, r) {
            for (var n = vt(e, t, !1), i = t.sizeMultiplier / r.sizeMultiplier, a = 0; a < n.length; a++) {
              var o = n[a].classes.indexOf("sizing");o < 0 ? Array.prototype.push.apply(n[a].classes, t.sizingClasses(r)) : n[a].classes[o + 1] === "reset-size" + t.size && (n[a].classes[o + 1] = "reset-size" + r.size), n[a].height *= i, n[a].depth *= i;
            }return Ze.makeFragment(n);
          }ht({ type: "op", names: ["\\arcsin", "\\arccos", "\\arctan", "\\arctg", "\\arcctg", "\\arg", "\\ch", "\\cos", "\\cosec", "\\cosh", "\\cot", "\\cotg", "\\coth", "\\csc", "\\ctg", "\\cth", "\\deg", "\\dim", "\\exp", "\\hom", "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh", "\\sh", "\\tan", "\\tanh", "\\tg", "\\th"], props: { numArgs: 0 }, handler: function handler(e) {
              var t = e.parser,
                  r = e.funcName;return { type: "op", mode: t.mode, limits: !1, symbol: !1, name: r };
            }, htmlBuilder: Gr, mathmlBuilder: Xr }), ht({ type: "op", names: ["\\det", "\\gcd", "\\inf", "\\lim", "\\max", "\\min", "\\Pr", "\\sup"], props: { numArgs: 0 }, handler: function handler(e) {
              var t = e.parser,
                  r = e.funcName;return { type: "op", mode: t.mode, limits: !0, symbol: !1, name: r };
            }, htmlBuilder: Gr, mathmlBuilder: Xr }), ht({ type: "op", names: ["\\int", "\\iint", "\\iiint", "\\oint", "\\oiint", "\\oiiint", '\u222B', '\u222C', '\u222D', '\u222E', '\u222F', '\u2230'], props: { numArgs: 0 }, handler: function handler(e) {
              var t = e.parser,
                  r = e.funcName;return 1 === r.length && (r = _r[r]), { type: "op", mode: t.mode, limits: !1, symbol: !0, name: r };
            }, htmlBuilder: Gr, mathmlBuilder: Xr }), ht({ type: "operatorname", names: ["\\operatorname"], props: { numArgs: 1 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = t[0];return { type: "operatorname", mode: r.mode, body: ct(n) };
            }, htmlBuilder: function htmlBuilder(e, t) {
              if (0 < e.body.length) {
                for (var r = e.body.map(function (e) {
                  var t = e.text;return "string" == typeof t ? { type: "textord", mode: e.mode, text: t } : e;
                }), n = vt(r, t.withFont("mathrm"), !0), i = 0; i < n.length; i++) {
                  var a = n[i];a instanceof O && (a.text = a.text.replace(/\u2212/, "-").replace(/\u2217/, "*"));
                }return Ze.makeSpan(["mop"], n, t);
              }return Ze.makeSpan(["mop"], [], t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              for (var r = Et(e.body, t.withFont("mathrm")), n = !0, i = 0; i < r.length; i++) {
                var a = r[i];if (a instanceof Bt.SpaceNode) ;else if (a instanceof Bt.MathNode) switch (a.type) {case "mi":case "mn":case "ms":case "mspace":case "mtext":
                    break;case "mo":
                    var o = a.children[0];1 === a.children.length && o instanceof Bt.TextNode ? o.text = o.text.replace(/\u2212/, "-").replace(/\u2217/, "*") : n = !1;break;default:
                    n = !1;} else n = !1;
              }if (n) {
                var s = r.map(function (e) {
                  return e.toText();
                }).join("");r = [new Bt.TextNode(s, !1)];
              }var l = new Bt.MathNode("mi", r);l.setAttribute("mathvariant", "normal");var h = new Bt.MathNode("mo", [Ct('\u2061', "text")]);return Bt.newDocumentFragment([l, h]);
            } }), mt({ type: "ordgroup", htmlBuilder: function htmlBuilder(e, t) {
              return e.semisimple ? Ze.makeFragment(vt(e.body, t, !1)) : Ze.makeSpan(["mord"], vt(e.body, t, !0), t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              return Ot(e.body, t);
            } }), ht({ type: "overline", names: ["\\overline"], props: { numArgs: 1 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = t[0];return { type: "overline", mode: r.mode, body: n };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = kt(e.body, t.havingCrampedStyle()),
                  n = Ze.makeLineSpan("overline-line", t),
                  i = Ze.makeVList({ positionType: "firstBaseline", children: [{ type: "elem", elem: r }, { type: "kern", size: 3 * n.height }, { type: "elem", elem: n }, { type: "kern", size: n.height }] }, t);return Ze.makeSpan(["mord", "overline"], [i], t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = new Bt.MathNode("mo", [new Bt.TextNode('\u203E')]);r.setAttribute("stretchy", "true");var n = new Bt.MathNode("mover", [It(e.body, t), r]);return n.setAttribute("accent", "true"), n;
            } }), ht({ type: "phantom", names: ["\\phantom"], props: { numArgs: 1, allowedInText: !0 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = t[0];return { type: "phantom", mode: r.mode, body: ct(n) };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = vt(e.body, t.withPhantom(), !1);return Ze.makeFragment(r);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = Et(e.body, t);return new Bt.MathNode("mphantom", r);
            } }), ht({ type: "hphantom", names: ["\\hphantom"], props: { numArgs: 1, allowedInText: !0 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = t[0];return { type: "hphantom", mode: r.mode, body: n };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = Ze.makeSpan([], [kt(e.body, t.withPhantom())]);if (r.height = 0, r.depth = 0, r.children) for (var n = 0; n < r.children.length; n++) {
                r.children[n].height = 0, r.children[n].depth = 0;
              }return r = Ze.makeVList({ positionType: "firstBaseline", children: [{ type: "elem", elem: r }] }, t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = Et(ct(e.body), t),
                  n = new Bt.MathNode("mphantom", r);return n.setAttribute("height", "0px"), n;
            } }), ht({ type: "vphantom", names: ["\\vphantom"], props: { numArgs: 1, allowedInText: !0 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = t[0];return { type: "vphantom", mode: r.mode, body: n };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = Ze.makeSpan(["inner"], [kt(e.body, t.withPhantom())]),
                  n = Ze.makeSpan(["fix"], []);return Ze.makeSpan(["mord", "rlap"], [r, n], t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = Et(ct(e.body), t),
                  n = new Bt.MathNode("mphantom", r);return n.setAttribute("width", "0px"), n;
            } });var jr = ["\\tiny", "\\sixptsize", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"],
              $r = function $r(e, t) {
            var r = t.havingSize(e.size);return Wr(e.body, r, t);
          };ht({ type: "sizing", names: jr, props: { numArgs: 0, allowedInText: !0 }, handler: function handler(e, t) {
              var r = e.breakOnTokenText,
                  n = e.funcName,
                  i = e.parser;i.consumeSpaces();var a = i.parseExpression(!1, r);return { type: "sizing", mode: i.mode, size: jr.indexOf(n) + 1, body: a };
            }, htmlBuilder: $r, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = t.havingSize(e.size),
                  n = Et(e.body, r),
                  i = new Bt.MathNode("mstyle", n);return i.setAttribute("mathsize", r.sizeMultiplier + "em"), i;
            } }), ht({ type: "raisebox", names: ["\\raisebox"], props: { numArgs: 2, argTypes: ["size", "text"], allowedInText: !0 }, handler: function handler(e, t) {
              var r = e.parser,
                  n = Ke(t[0], "size").value,
                  i = t[1];return { type: "raisebox", mode: r.mode, dy: n, body: i };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = { type: "text", mode: e.mode, body: ct(e.body), font: "mathrm" },
                  n = { type: "sizing", mode: e.mode, body: [r], size: 6 },
                  i = $r(n, t),
                  a = De(e.dy, t);return Ze.makeVList({ positionType: "shift", positionData: -a, children: [{ type: "elem", elem: i }] }, t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = new Bt.MathNode("mpadded", [It(e.body, t)]),
                  n = e.dy.number + e.dy.unit;return r.setAttribute("voffset", n), r;
            } }), ht({ type: "rule", names: ["\\rule"], props: { numArgs: 2, numOptionalArgs: 1, argTypes: ["size", "size", "size"] }, handler: function handler(e, t, r) {
              var n = e.parser,
                  i = r[0],
                  a = Ke(t[0], "size"),
                  o = Ke(t[1], "size");return { type: "rule", mode: n.mode, shift: i && Ke(i, "size").value, width: a.value, height: o.value };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = Ze.makeSpan(["mord", "rule"], [], t),
                  n = 0;e.shift && (n = De(e.shift, t));var i = De(e.width, t),
                  a = De(e.height, t);return r.style.borderRightWidth = i + "em", r.style.borderTopWidth = a + "em", r.style.bottom = n + "em", r.width = i, r.height = a + n, r.depth = -n, r.maxFontSize = 1.125 * a * t.sizeMultiplier, r;
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              return new Bt.MathNode("mrow");
            } }), ht({ type: "smash", names: ["\\smash"], props: { numArgs: 1, numOptionalArgs: 1, allowedInText: !0 }, handler: function handler(e, t, r) {
              var n = e.parser,
                  i = !1,
                  a = !1,
                  o = r[0] && Ke(r[0], "ordgroup");if (o) for (var s = "", l = 0; l < o.body.length; ++l) {
                if ("t" === (s = o.body[l].text)) i = !0;else {
                  if ("b" !== s) {
                    a = i = !1;break;
                  }a = !0;
                }
              } else a = i = !0;var h = t[0];return { type: "smash", mode: n.mode, body: h, smashHeight: i, smashDepth: a };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = Ze.makeSpan(["mord"], [kt(e.body, t)]);if (!e.smashHeight && !e.smashDepth) return r;if (e.smashHeight && (r.height = 0, r.children)) for (var n = 0; n < r.children.length; n++) {
                r.children[n].height = 0;
              }if (e.smashDepth && (r.depth = 0, r.children)) for (var i = 0; i < r.children.length; i++) {
                r.children[i].depth = 0;
              }return Ze.makeVList({ positionType: "firstBaseline", children: [{ type: "elem", elem: r }] }, t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = new Bt.MathNode("mpadded", [It(e.body, t)]);return e.smashHeight && r.setAttribute("height", "0px"), e.smashDepth && r.setAttribute("depth", "0px"), r;
            } }), ht({ type: "sqrt", names: ["\\sqrt"], props: { numArgs: 1, numOptionalArgs: 1 }, handler: function handler(e, t, r) {
              var n = e.parser,
                  i = r[0],
                  a = t[0];return { type: "sqrt", mode: n.mode, body: a, index: i };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = kt(e.body, t.havingCrampedStyle());0 === r.height && (r.height = t.fontMetrics().xHeight), r = Ze.wrapFragment(r, t);var n = t.fontMetrics().defaultRuleThickness,
                  i = n;t.style.id < q.TEXT.id && (i = t.fontMetrics().xHeight);var a = n + i / 4,
                  o = r.height + r.depth + a + n,
                  s = mr(o, t),
                  l = s.span,
                  h = s.ruleWidth,
                  m = s.advanceWidth,
                  c = l.height - h;c > r.height + r.depth + a && (a = (a + c - r.height - r.depth) / 2);var u = l.height - r.height - a - h;r.style.paddingLeft = m + "em";var p = Ze.makeVList({ positionType: "firstBaseline", children: [{ type: "elem", elem: r, wrapperClasses: ["svg-align"] }, { type: "kern", size: -(r.height + u) }, { type: "elem", elem: l }, { type: "kern", size: h }] }, t);if (e.index) {
                var d = t.havingStyle(q.SCRIPTSCRIPT),
                    f = kt(e.index, d, t),
                    g = .6 * (p.height - p.depth),
                    v = Ze.makeVList({ positionType: "shift", positionData: -g, children: [{ type: "elem", elem: f }] }, t),
                    y = Ze.makeSpan(["root"], [v]);return Ze.makeSpan(["mord", "sqrt"], [y, p], t);
              }return Ze.makeSpan(["mord", "sqrt"], [p], t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = e.body,
                  n = e.index;return n ? new Bt.MathNode("mroot", [It(r, t), It(n, t)]) : new Bt.MathNode("msqrt", [It(r, t)]);
            } });var Zr = { display: q.DISPLAY, text: q.TEXT, script: q.SCRIPT, scriptscript: q.SCRIPTSCRIPT };ht({ type: "styling", names: ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"], props: { numArgs: 0, allowedInText: !0 }, handler: function handler(e, t) {
              var r = e.breakOnTokenText,
                  n = e.funcName,
                  i = e.parser;i.consumeSpaces();var a = i.parseExpression(!0, r),
                  o = n.slice(1, n.length - 5);return { type: "styling", mode: i.mode, style: o, body: a };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = Zr[e.style],
                  n = t.havingStyle(r).withFont("");return Wr(e.body, n, t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = { display: q.DISPLAY, text: q.TEXT, script: q.SCRIPT, scriptscript: q.SCRIPTSCRIPT }[e.style],
                  n = t.havingStyle(r),
                  i = Et(e.body, n),
                  a = new Bt.MathNode("mstyle", i),
                  o = { display: ["0", "true"], text: ["0", "false"], script: ["1", "false"], scriptscript: ["2", "false"] }[e.style];return a.setAttribute("scriptlevel", o[0]), a.setAttribute("displaystyle", o[1]), a;
            } });mt({ type: "supsub", htmlBuilder: function htmlBuilder(e, t) {
              var r,
                  n,
                  i,
                  a = (n = t, (i = (r = e).base) ? "op" !== i.type ? "accent" === i.type ? Y.isCharacterBox(i.base) ? Ut : null : "horizBrace" !== i.type ? null : !r.sub === i.isOver ? Fr : null : i.limits && (n.style.size === q.DISPLAY.size || i.alwaysHandleSupSub) ? Gr : null : null);if (a) return a(e, t);var o,
                  s,
                  l,
                  h = e.base,
                  m = e.sup,
                  c = e.sub,
                  u = kt(h, t),
                  p = t.fontMetrics(),
                  d = 0,
                  f = 0,
                  g = h && Y.isCharacterBox(h);if (m) {
                var v = t.havingStyle(t.style.sup());o = kt(m, v, t), g || (d = u.height - v.fontMetrics().supDrop * v.sizeMultiplier / t.sizeMultiplier);
              }if (c) {
                var y = t.havingStyle(t.style.sub());s = kt(c, y, t), g || (f = u.depth + y.fontMetrics().subDrop * y.sizeMultiplier / t.sizeMultiplier);
              }l = t.style === q.DISPLAY ? p.sup1 : t.style.cramped ? p.sup3 : p.sup2;var b,
                  x = t.sizeMultiplier,
                  w = .5 / p.ptPerEm / x + "em",
                  k = null;if (s) {
                var S = e.base && "op" === e.base.type && e.base.name && ("\\oiint" === e.base.name || "\\oiiint" === e.base.name);(u instanceof O || S) && (k = -u.italic + "em");
              }if (o && s) {
                d = Math.max(d, l, o.depth + .25 * p.xHeight), f = Math.max(f, p.sub2);var z = 4 * p.defaultRuleThickness;if (d - o.depth - (s.height - f) < z) {
                  f = z - (d - o.depth) + s.height;var M = .8 * p.xHeight - (d - o.depth);0 < M && (d += M, f -= M);
                }var T = [{ type: "elem", elem: s, shift: f, marginRight: w, marginLeft: k }, { type: "elem", elem: o, shift: -d, marginRight: w }];b = Ze.makeVList({ positionType: "individualShift", children: T }, t);
              } else if (s) {
                f = Math.max(f, p.sub1, s.height - .8 * p.xHeight);var A = [{ type: "elem", elem: s, marginLeft: k, marginRight: w }];b = Ze.makeVList({ positionType: "shift", positionData: f, children: A }, t);
              } else {
                if (!o) throw new Error("supsub must have either sup or sub.");d = Math.max(d, l, o.depth + .25 * p.xHeight), b = Ze.makeVList({ positionType: "shift", positionData: -d, children: [{ type: "elem", elem: o, marginRight: w }] }, t);
              }var B = xt(u, "right") || "mord";return Ze.makeSpan([B], [u, Ze.makeSpan(["msupsub"], [b])], t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r,
                  n = !1,
                  i = Je(e.base, "horizBrace");i && !!e.sup === i.isOver && (n = !0, r = i.isOver);var a,
                  o = [It(e.base, t)];if (e.sub && o.push(It(e.sub, t)), e.sup && o.push(It(e.sup, t)), n) a = r ? "mover" : "munder";else if (e.sub) {
                if (e.sup) {
                  var s = e.base;a = s && "op" === s.type && s.limits && t.style === q.DISPLAY ? "munderover" : "msubsup";
                } else {
                  var l = e.base;a = l && "op" === l.type && l.limits && t.style === q.DISPLAY ? "munder" : "msub";
                }
              } else {
                var h = e.base;a = h && "op" === h.type && h.limits && t.style === q.DISPLAY ? "mover" : "msup";
              }return new Bt.MathNode(a, o);
            } }), mt({ type: "atom", htmlBuilder: function htmlBuilder(e, t) {
              return Ze.mathsym(e.text, e.mode, t, ["m" + e.family]);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = new Bt.MathNode("mo", [Ct(e.text, e.mode)]);if ("bin" === e.family) {
                var n = qt(e, t);"bold-italic" === n && r.setAttribute("mathvariant", n);
              } else "punct" === e.family && r.setAttribute("separator", "true");return r;
            } });var Kr = { mi: "italic", mn: "normal", mtext: "normal" };mt({ type: "mathord", htmlBuilder: function htmlBuilder(e, t) {
              return Ze.makeOrd(e, t, "mathord");
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = new Bt.MathNode("mi", [Ct(e.text, e.mode, t)]),
                  n = qt(e, t) || "italic";return n !== Kr[r.type] && r.setAttribute("mathvariant", n), r;
            } }), mt({ type: "textord", htmlBuilder: function htmlBuilder(e, t) {
              return Ze.makeOrd(e, t, "textord");
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r,
                  n = Ct(e.text, e.mode, t),
                  i = qt(e, t) || "normal";return r = "text" === e.mode ? new Bt.MathNode("mtext", [n]) : /[0-9]/.test(e.text) ? new Bt.MathNode("mn", [n]) : "\\prime" === e.text ? new Bt.MathNode("mo", [n]) : new Bt.MathNode("mi", [n]), i !== Kr[r.type] && r.setAttribute("mathvariant", i), r;
            } });var Jr = { "\\nobreak": "nobreak", "\\allowbreak": "allowbreak" },
              Qr = { " ": {}, "\\ ": {}, "~": { className: "nobreak" }, "\\space": {}, "\\nobreakspace": { className: "nobreak" } };mt({ type: "spacing", htmlBuilder: function htmlBuilder(e, t) {
              if (Qr.hasOwnProperty(e.text)) {
                var r = Qr[e.text].className || "";if ("text" !== e.mode) return Ze.makeSpan(["mspace", r], [Ze.mathsym(e.text, e.mode, t)], t);var n = Ze.makeOrd(e, t, "textord");return n.classes.push(r), n;
              }if (Jr.hasOwnProperty(e.text)) return Ze.makeSpan(["mspace", Jr[e.text]], [], t);throw new X('Unknown type of space "' + e.text + '"');
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              if (Qr.hasOwnProperty(e.text)) return new Bt.MathNode("mtext", [new Bt.TextNode("\xa0")]);if (Jr.hasOwnProperty(e.text)) return new Bt.MathNode("mspace");throw new X('Unknown type of space "' + e.text + '"');
            } }), mt({ type: "tag", mathmlBuilder: function mathmlBuilder(e, t) {
              var r = new Bt.MathNode("mtable", [new Bt.MathNode("mlabeledtr", [new Bt.MathNode("mtd", [Ot(e.tag, t)]), new Bt.MathNode("mtd", [Ot(e.body, t)])])]);return r.setAttribute("side", "right"), r;
            } });var en = { "\\text": void 0, "\\textrm": "textrm", "\\textsf": "textsf", "\\texttt": "texttt", "\\textnormal": "textrm" },
              tn = { "\\textbf": "textbf" },
              rn = { "\\textit": "textit" },
              nn = function nn(e, t) {
            var r = e.font;return r ? en[r] ? t.withTextFontFamily(en[r]) : tn[r] ? t.withTextFontWeight(tn[r]) : t.withTextFontShape(rn[r]) : t;
          };ht({ type: "text", names: ["\\text", "\\textrm", "\\textsf", "\\texttt", "\\textnormal", "\\textbf", "\\textit"], props: { numArgs: 1, argTypes: ["text"], greediness: 2, allowedInText: !0, consumeMode: "text" }, handler: function handler(e, t) {
              var r = e.parser,
                  n = e.funcName,
                  i = t[0];return { type: "text", mode: r.mode, body: ct(i), font: n };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = nn(e, t),
                  n = vt(e.body, r, !0);return Ze.makeSpan(["mord", "text"], Ze.tryCombineChars(n), r);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = nn(e, t);return Ot(e.body, r);
            } }), ht({ type: "underline", names: ['\\underline'], props: { numArgs: 1, allowedInText: !0 }, handler: function handler(e, t) {
              return { type: "underline", mode: e.parser.mode, body: t[0] };
            }, htmlBuilder: function htmlBuilder(e, t) {
              var r = kt(e.body, t),
                  n = Ze.makeLineSpan("underline-line", t),
                  i = Ze.makeVList({ positionType: "top", positionData: r.height, children: [{ type: "kern", size: n.height }, { type: "elem", elem: n }, { type: "kern", size: 3 * n.height }, { type: "elem", elem: r }] }, t);return Ze.makeSpan(["mord", "underline"], [i], t);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = new Bt.MathNode("mo", [new Bt.TextNode('\u203E')]);r.setAttribute("stretchy", "true");var n = new Bt.MathNode("munder", [It(e.body, t), r]);return n.setAttribute("accentunder", "true"), n;
            } }), ht({ type: "verb", names: ["\\verb"], props: { numArgs: 0, allowedInText: !0 }, handler: function handler(e, t, r) {
              throw new X("\\verb ended by end of line instead of matching delimiter");
            }, htmlBuilder: function htmlBuilder(e, t) {
              for (var r = an(e), n = [], i = t.havingStyle(t.style.text()), a = 0; a < r.length; a++) {
                var o = r[a];"~" === o && (o = "\\textasciitilde"), n.push(Ze.makeSymbol(o, "Typewriter-Regular", e.mode, i, ["mord", "texttt"]));
              }return Ze.makeSpan(["mord", "text"].concat(i.sizingClasses(t)), Ze.tryCombineChars(n), i);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = new Bt.TextNode(an(e)),
                  n = new Bt.MathNode("mtext", [r]);return n.setAttribute("mathvariant", "monospace"), n;
            } });var an = function an(e) {
            return e.body.replace(/ /g, e.star ? '\u2423' : "\xa0");
          };ht({ type: "xmlClass", names: ["\\xmlClass"], props: { numArgs: 2, allowedInText: !0, greediness: 3, argTypes: ["raw", "original"] }, handler: function handler(e, t) {
              var r = e.parser,
                  n = t[0],
                  i = t[1];return { type: "xmlClass", mode: r.mode, xmlClass: n, body: ct(i) };
            }, htmlBuilder: function htmlBuilder(e, t) {
              for (var r = vt(e.body, t, !1), n = 0; n < r.length; n++) {
                r[n].classes.push(e.xmlClass.string);
              }return Ze.makeFragment(r);
            }, mathmlBuilder: function mathmlBuilder(e, t) {
              var r = Et(e.body, t),
                  n = new Bt.MathNode("mstyle", r);return n.setAttribute("class", e.xmlClass), n;
            } });var on = ot,
              sn = "[ \r\n\t]",
              ln = "\\\\[a-zA-Z@]+",
              hn = new RegExp("^(" + ln + ")" + sn + "*$"),
              mn = '[\u0300-\u036F]',
              cn = new RegExp(mn + "+$"),
              un = (function () {
            function e(e) {
              this.input = void 0, this.tokenRegex = void 0, this.input = e, this.tokenRegex = new RegExp('([ \r\n\t]+)|([!-\\[\\]-\u2027\u202A-\uD7FF\uF900-\uFFFF][\u0300-\u036F]*|[\uD800-\uDBFF][\uDC00-\uDFFF][\u0300-\u036F]*|\\\\verb\\*([^]).*?\\3|\\\\verb([^*a-zA-Z]).*?\\4|\\\\[a-zA-Z@]+[ \r\n\t]*|\\\\[^\uD800-\uDFFF])', "g");
            }return e.prototype.lex = function () {
              var e = this.input,
                  t = this.tokenRegex.lastIndex;if (t === e.length) return new a("EOF", new p(this, t, t));var r = this.tokenRegex.exec(e);if (null === r || r.index !== t) throw new X("Unexpected character: '" + e[t] + "'", new a(e[t], new p(this, t, t + 1)));var n = r[2] || " ",
                  i = n.match(hn);return i && (n = i[1]), new a(n, new p(this, t, this.tokenRegex.lastIndex));
            }, e;
          }()),
              pn = function () {
            function e(e, t) {
              void 0 === e && (e = {}), void 0 === t && (t = {}), this.current = void 0, this.builtins = void 0, this.undefStack = void 0, this.current = t, this.builtins = e, this.undefStack = [];
            }var t = e.prototype;return t.beginGroup = function () {
              this.undefStack.push({});
            }, t.endGroup = function () {
              if (0 === this.undefStack.length) throw new X("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");var e = this.undefStack.pop();for (var t in e) {
                e.hasOwnProperty(t) && (void 0 === e[t] ? delete this.current[t] : this.current[t] = e[t]);
              }
            }, t.has = function (e) {
              return this.current.hasOwnProperty(e) || this.builtins.hasOwnProperty(e);
            }, t.get = function (e) {
              return this.current.hasOwnProperty(e) ? this.current[e] : this.builtins[e];
            }, t.set = function (e, t, r) {
              if (void 0 === r && (r = !1), r) {
                for (var n = 0; n < this.undefStack.length; n++) {
                  delete this.undefStack[n][e];
                }0 < this.undefStack.length && (this.undefStack[this.undefStack.length - 1][e] = t);
              } else {
                var i = this.undefStack[this.undefStack.length - 1];i && !i.hasOwnProperty(e) && (i[e] = this.current[e]);
              }this.current[e] = t;
            }, e;
          }(),
              dn = {},
              fn = dn;function gn(e, t) {
            dn[e] = t;
          }gn("\\@firstoftwo", function (e) {
            return { tokens: e.consumeArgs(2)[0], numArgs: 0 };
          }), gn("\\@secondoftwo", function (e) {
            return { tokens: e.consumeArgs(2)[1], numArgs: 0 };
          }), gn("\\@ifnextchar", function (e) {
            var t = e.consumeArgs(3),
                r = e.future();return 1 === t[0].length && t[0][0].text === r.text ? { tokens: t[1], numArgs: 0 } : { tokens: t[2], numArgs: 0 };
          }), gn("\\@ifstar", "\\@ifnextchar *{\\@firstoftwo{#1}}"), gn("\\TextOrMath", function (e) {
            var t = e.consumeArgs(2);return "text" === e.mode ? { tokens: t[0], numArgs: 0 } : { tokens: t[1], numArgs: 0 };
          });var vn = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, a: 10, A: 10, b: 11, B: 11, c: 12, C: 12, d: 13, D: 13, e: 14, E: 14, f: 15, F: 15 };gn("\\char", function (e) {
            var t,
                r = e.popToken(),
                n = "";if ("'" === r.text) t = 8, r = e.popToken();else if ('"' === r.text) t = 16, r = e.popToken();else if ("`" === r.text) {
              if ("\\" === (r = e.popToken()).text[0]) n = r.text.charCodeAt(1);else {
                if ("EOF" === r.text) throw new X("\\char` missing argument");n = r.text.charCodeAt(0);
              }
            } else t = 10;if (t) {
              if (null == (n = vn[r.text]) || t <= n) throw new X("Invalid base-" + t + " digit " + r.text);for (var i; null != (i = vn[e.future().text]) && i < t;) {
                n *= t, n += i, e.popToken();
              }
            }return "\\@char{" + n + "}";
          });var yn = function yn(e, t) {
            var r = e.consumeArgs(1)[0];if (1 !== r.length) throw new X("\\gdef's first argument must be a macro name");var n = r[0].text,
                i = 0;for (r = e.consumeArgs(1)[0]; 1 === r.length && "#" === r[0].text;) {
              if (1 !== (r = e.consumeArgs(1)[0]).length) throw new X('Invalid argument number length "' + r.length + '"');if (!/^[1-9]$/.test(r[0].text)) throw new X('Invalid argument number "' + r[0].text + '"');if (i++, parseInt(r[0].text) !== i) throw new X('Argument number "' + r[0].text + '" out of order');r = e.consumeArgs(1)[0];
            }return e.macros.set(n, { tokens: r, numArgs: i }, t), "";
          };gn("\\gdef", function (e) {
            return yn(e, !0);
          }), gn("\\def", function (e) {
            return yn(e, !1);
          }), gn("\\global", function (e) {
            var t = e.consumeArgs(1)[0];if (1 !== t.length) throw new X("Invalid command after \\global");var r = t[0].text;if ("\\def" === r) return yn(e, !0);throw new X("Invalid command '" + r + "' after \\global");
          });var bn = function bn(e, t, r) {
            var n = e.consumeArgs(1)[0];if (1 !== n.length) throw new X("\\newcommand's first argument must be a macro name");var i = n[0].text,
                a = e.isDefined(i);if (a && !t) throw new X("\\newcommand{" + i + "} attempting to redefine " + i + "; use \\renewcommand");if (!a && !r) throw new X("\\renewcommand{" + i + "} when command " + i + " does not yet exist; use \\newcommand");var o = 0;if (1 === (n = e.consumeArgs(1)[0]).length && "[" === n[0].text) {
              for (var s = "", l = e.expandNextToken(); "]" !== l.text && "EOF" !== l.text;) {
                s += l.text, l = e.expandNextToken();
              }if (!s.match(/^\s*[0-9]+\s*$/)) throw new X("Invalid number of arguments: " + s);o = parseInt(s), n = e.consumeArgs(1)[0];
            }return e.macros.set(i, { tokens: n, numArgs: o }), "";
          };gn("\\newcommand", function (e) {
            return bn(e, !1, !0);
          }), gn("\\renewcommand", function (e) {
            return bn(e, !0, !1);
          }), gn("\\providecommand", function (e) {
            return bn(e, !0, !0);
          }), gn("\\bgroup", "{"), gn("\\egroup", "}"), gn("\\lq", "`"), gn("\\rq", "'"), gn("\\aa", "\\r a"), gn("\\AA", "\\r A"), gn("\\textcopyright", "\\html@mathml{\\textcircled{c}}{\\char`\xa9}"), gn("\\copyright", "\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}"), gn("\\textregistered", "\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`\xae}"), gn('\u212C', "\\mathscr{B}"), gn('\u2130', "\\mathscr{E}"), gn('\u2131', "\\mathscr{F}"), gn('\u210B', "\\mathscr{H}"), gn('\u2110', "\\mathscr{I}"), gn('\u2112', "\\mathscr{L}"), gn('\u2133', "\\mathscr{M}"), gn('\u211B', "\\mathscr{R}"), gn('\u212D', "\\mathfrak{C}"), gn('\u210C', "\\mathfrak{H}"), gn('\u2128', "\\mathfrak{Z}"), gn("\xb7", "\\cdotp"), gn("\\llap", "\\mathllap{\\textrm{#1}}"), gn("\\rlap", "\\mathrlap{\\textrm{#1}}"), gn("\\clap", "\\mathclap{\\textrm{#1}}"), gn("\\not", "\\mathrel{\\mathrlap\\@not}"), gn("\\neq", '\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`\u2260}}'), gn("\\ne", "\\neq"), gn('\u2260', "\\neq"), gn("\\notin", '\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`\u2209}}'), gn('\u2209', "\\notin"), gn('\u2258', '\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`\u2258}}'), gn('\u2259', '\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`\u2258}}'), gn('\u225A', '\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`\u225A}}'), gn('\u225B', '\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`\u225B}}'), gn('\u225D', '\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`\u225D}}'), gn('\u225E', '\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`\u225E}}'), gn('\u225F', '\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`\u225F}}'), gn('\u27C2', "\\perp"), gn('\u203C', "\\mathclose{!\\mkern-0.8mu!}"), gn('\u220C', "\\notni"), gn('\u231C', '\\ulcorner'), gn('\u231D', '\\urcorner'), gn('\u231E', "\\llcorner"), gn('\u231F', "\\lrcorner"), gn("\xa9", "\\copyright"), gn("\xae", "\\textregistered"), gn('\uFE0F', "\\textregistered"), gn("\\vdots", "\\mathord{\\varvdots\\rule{0pt}{15pt}}"), gn('\u22EE', "\\vdots"), gn("\\varGamma", "\\mathit{\\Gamma}"), gn("\\varDelta", "\\mathit{\\Delta}"), gn("\\varTheta", "\\mathit{\\Theta}"), gn("\\varLambda", "\\mathit{\\Lambda}"), gn("\\varXi", "\\mathit{\\Xi}"), gn("\\varPi", "\\mathit{\\Pi}"), gn("\\varSigma", "\\mathit{\\Sigma}"), gn("\\varUpsilon", '\\mathit{\\Upsilon}'), gn("\\varPhi", "\\mathit{\\Phi}"), gn("\\varPsi", "\\mathit{\\Psi}"), gn("\\varOmega", "\\mathit{\\Omega}"), gn("\\colon", "\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu"), gn("\\boxed", "\\fbox{$\\displaystyle{#1}$}"), gn("\\iff", "\\DOTSB\\;\\Longleftrightarrow\\;"), gn("\\implies", "\\DOTSB\\;\\Longrightarrow\\;"), gn("\\impliedby", "\\DOTSB\\;\\Longleftarrow\\;");var xn = { ",": "\\dotsc", "\\not": "\\dotsb", "+": "\\dotsb", "=": "\\dotsb", "<": "\\dotsb", ">": "\\dotsb", "-": "\\dotsb", "*": "\\dotsb", ":": "\\dotsb", "\\DOTSB": "\\dotsb", "\\coprod": "\\dotsb", "\\bigvee": "\\dotsb", "\\bigwedge": "\\dotsb", "\\biguplus": "\\dotsb", "\\bigcap": "\\dotsb", "\\bigcup": "\\dotsb", "\\prod": "\\dotsb", "\\sum": "\\dotsb", "\\bigotimes": "\\dotsb", "\\bigoplus": "\\dotsb", "\\bigodot": "\\dotsb", "\\bigsqcup": "\\dotsb", "\\And": "\\dotsb", "\\longrightarrow": "\\dotsb", "\\Longrightarrow": "\\dotsb", "\\longleftarrow": "\\dotsb", "\\Longleftarrow": "\\dotsb", "\\longleftrightarrow": "\\dotsb", "\\Longleftrightarrow": "\\dotsb", "\\mapsto": "\\dotsb", "\\longmapsto": "\\dotsb", "\\hookrightarrow": "\\dotsb", "\\doteq": "\\dotsb", "\\mathbin": "\\dotsb", "\\mathrel": "\\dotsb", "\\relbar": "\\dotsb", "\\Relbar": "\\dotsb", "\\xrightarrow": "\\dotsb", "\\xleftarrow": "\\dotsb", "\\DOTSI": "\\dotsi", "\\int": "\\dotsi", "\\oint": "\\dotsi", "\\iint": "\\dotsi", "\\iiint": "\\dotsi", "\\iiiint": "\\dotsi", "\\idotsint": "\\dotsi", "\\DOTSX": "\\dotsx" };gn("\\dots", function (e) {
            var t = "\\dotso",
                r = e.expandAfterFuture().text;return r in xn ? t = xn[r] : "\\not" === r.substr(0, 4) ? t = "\\dotsb" : r in W.math && Y.contains(["bin", "rel"], W.math[r].group) && (t = "\\dotsb"), t;
          });var wn = { ")": !0, "]": !0, "\\rbrack": !0, "\\}": !0, "\\rbrace": !0, "\\rangle": !0, "\\rceil": !0, "\\rfloor": !0, "\\rgroup": !0, "\\rmoustache": !0, "\\right": !0, "\\bigr": !0, "\\biggr": !0, "\\Bigr": !0, "\\Biggr": !0, $: !0, ";": !0, ".": !0, ",": !0 };gn("\\dotso", function (e) {
            return e.future().text in wn ? "\\ldots\\," : "\\ldots";
          }), gn("\\dotsc", function (e) {
            var t = e.future().text;return t in wn && "," !== t ? "\\ldots\\," : "\\ldots";
          }), gn("\\cdots", function (e) {
            return e.future().text in wn ? "\\@cdots\\," : "\\@cdots";
          }), gn("\\dotsb", "\\cdots"), gn("\\dotsm", "\\cdots"), gn("\\dotsi", "\\!\\cdots"), gn("\\dotsx", "\\ldots\\,"), gn("\\DOTSI", "\\relax"), gn("\\DOTSB", "\\relax"), gn("\\DOTSX", "\\relax"), gn("\\tmspace", "\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax"), gn("\\,", "\\tmspace+{3mu}{.1667em}"), gn("\\thinspace", "\\,"), gn("\\>", "\\mskip{4mu}"), gn("\\:", "\\tmspace+{4mu}{.2222em}"), gn("\\medspace", "\\:"), gn("\\;", "\\tmspace+{5mu}{.2777em}"), gn("\\thickspace", "\\;"), gn("\\!", "\\tmspace-{3mu}{.1667em}"), gn("\\negthinspace", "\\!"), gn("\\negmedspace", "\\tmspace-{4mu}{.2222em}"), gn("\\negthickspace", "\\tmspace-{5mu}{.277em}"), gn("\\enspace", "\\kern.5em "), gn("\\enskip", "\\hskip.5em\\relax"), gn("\\quad", "\\hskip1em\\relax"), gn("\\qquad", "\\hskip2em\\relax"), gn("\\tag", "\\@ifstar\\tag@literal\\tag@paren"), gn("\\tag@paren", "\\tag@literal{({#1})}"), gn("\\tag@literal", function (e) {
            if (e.macros.get("\\df@tag")) throw new X("Multiple \\tag");return "\\gdef\\df@tag{\\text{#1}}";
          }), gn("\\bmod", "\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}"), gn("\\pod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)"), gn("\\pmod", "\\pod{{\\rm mod}\\mkern6mu#1}"), gn("\\mod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1"), gn("\\pmb", "\\html@mathml{\\@binrel{#1}{\\mathrlap{#1}\\mathrlap{\\mkern0.4mu\\raisebox{0.4mu}{$#1$}}{\\mkern0.8mu#1}}}{\\mathbf{#1}}"), gn("\\\\", "\\newline"), gn("\\TeX", "\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");var kn = H["Main-Regular"]["T".charCodeAt(0)][1] - .7 * H["Main-Regular"]["A".charCodeAt(0)][1] + "em";gn("\\LaTeX", "\\textrm{\\html@mathml{L\\kern-.36em\\raisebox{" + kn + "}{\\scriptsize A}\\kern-.15em\\TeX}{LaTeX}}"), gn("\\KaTeX", "\\textrm{\\html@mathml{K\\kern-.17em\\raisebox{" + kn + "}{\\scriptsize A}\\kern-.15em\\TeX}{KaTeX}}"), gn("\\hspace", "\\@ifstar\\@hspacer\\@hspace"), gn("\\@hspace", "\\hskip #1\\relax"), gn("\\@hspacer", "\\rule{0pt}{0pt}\\hskip #1\\relax"), gn("\\ordinarycolon", ":"), gn("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}"), gn("\\dblcolon", "\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}"), gn("\\coloneqq", "\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}"), gn("\\Coloneqq", "\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}"), gn("\\coloneq", "\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}"), gn("\\Coloneq", "\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}"), gn("\\eqqcolon", "\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}"), gn("\\Eqqcolon", "\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}"), gn("\\eqcolon", "\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}"), gn("\\Eqcolon", "\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}"), gn("\\colonapprox", "\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}"), gn("\\Colonapprox", "\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}"), gn("\\colonsim", "\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}"), gn("\\Colonsim", "\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}"), gn('\u2254', "\\coloneqq"), gn('\u2255', "\\eqqcolon"), gn('\u2A74', "\\Coloneqq"), gn("\\ratio", "\\vcentcolon"), gn("\\coloncolon", "\\dblcolon"), gn("\\colonequals", "\\coloneqq"), gn("\\coloncolonequals", "\\Coloneqq"), gn("\\equalscolon", "\\eqqcolon"), gn("\\equalscoloncolon", "\\Eqqcolon"), gn("\\colonminus", "\\coloneq"), gn("\\coloncolonminus", "\\Coloneq"), gn("\\minuscolon", "\\eqcolon"), gn("\\minuscoloncolon", "\\Eqcolon"), gn("\\coloncolonapprox", "\\Colonapprox"), gn("\\coloncolonsim", "\\Colonsim"), gn("\\simcolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}"), gn("\\simcoloncolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}"), gn("\\approxcolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}"), gn("\\approxcoloncolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}"), gn("\\notni", '\\html@mathml{\\not\\ni}{\\mathrel{\\char`\u220C}}'), gn("\\limsup", "\\DOTSB\\mathop{\\operatorname{lim\\,sup}}\\limits"), gn("\\liminf", "\\DOTSB\\mathop{\\operatorname{lim\\,inf}}\\limits"), gn('\u27E6', "\\mathopen{[\\mkern-3.2mu[}"), gn('\u27E7', "\\mathclose{]\\mkern-3.2mu]}"), gn("\\darr", "\\downarrow"), gn("\\dArr", "\\Downarrow"), gn("\\Darr", "\\Downarrow"), gn("\\lang", "\\langle"), gn("\\rang", "\\rangle"), gn('\\uarr', '\\uparrow'), gn('\\uArr', '\\Uparrow'), gn('\\Uarr', '\\Uparrow'), gn("\\N", "\\mathbb{N}"), gn("\\R", "\\mathbb{R}"), gn("\\Z", "\\mathbb{Z}"), gn("\\alef", "\\aleph"), gn("\\alefsym", "\\aleph"), gn("\\Alpha", "\\mathrm{A}"), gn("\\Beta", "\\mathrm{B}"), gn("\\bull", "\\bullet"), gn("\\Chi", "\\mathrm{X}"), gn("\\clubs", "\\clubsuit"), gn("\\cnums", "\\mathbb{C}"), gn("\\Complex", "\\mathbb{C}"), gn("\\Dagger", "\\ddagger"), gn("\\diamonds", "\\diamondsuit"), gn("\\empty", "\\emptyset"), gn("\\Epsilon", "\\mathrm{E}"), gn("\\Eta", "\\mathrm{H}"), gn("\\exist", "\\exists"), gn("\\harr", "\\leftrightarrow"), gn("\\hArr", "\\Leftrightarrow"), gn("\\Harr", "\\Leftrightarrow"), gn("\\hearts", "\\heartsuit"), gn("\\image", "\\Im"), gn("\\infin", "\\infty"), gn("\\Iota", "\\mathrm{I}"), gn("\\isin", "\\in"), gn("\\Kappa", "\\mathrm{K}"), gn("\\larr", "\\leftarrow"), gn("\\lArr", "\\Leftarrow"), gn("\\Larr", "\\Leftarrow"), gn("\\lrarr", "\\leftrightarrow"), gn("\\lrArr", "\\Leftrightarrow"), gn("\\Lrarr", "\\Leftrightarrow"), gn("\\Mu", "\\mathrm{M}"), gn("\\natnums", "\\mathbb{N}"), gn("\\Nu", "\\mathrm{N}"), gn("\\Omicron", "\\mathrm{O}"), gn("\\plusmn", "\\pm"), gn("\\rarr", "\\rightarrow"), gn("\\rArr", "\\Rightarrow"), gn("\\Rarr", "\\Rightarrow"), gn("\\real", "\\Re"), gn("\\reals", "\\mathbb{R}"), gn("\\Reals", "\\mathbb{R}"), gn("\\Rho", "\\mathrm{R}"), gn("\\sdot", "\\cdot"), gn("\\sect", "\\S"), gn("\\spades", "\\spadesuit"), gn("\\sub", "\\subset"), gn("\\sube", "\\subseteq"), gn("\\supe", "\\supseteq"), gn("\\Tau", "\\mathrm{T}"), gn("\\thetasym", "\\vartheta"), gn("\\weierp", "\\wp"), gn("\\Zeta", "\\mathrm{Z}");var Sn = { "\\relax": !0, "^": !0, _: !0, "\\limits": !0, "\\nolimits": !0 },
              zn = function () {
            function e(e, t, r) {
              this.settings = void 0, this.expansionCount = void 0, this.lexer = void 0, this.macros = void 0, this.stack = void 0, this.mode = void 0, this.settings = t, this.expansionCount = 0, this.feed(e), this.macros = new pn(fn, t.macros), this.mode = r, this.stack = [];
            }var t = e.prototype;return t.feed = function (e) {
              this.lexer = new un(e);
            }, t.switchMode = function (e) {
              this.mode = e;
            }, t.beginGroup = function () {
              this.macros.beginGroup();
            }, t.endGroup = function () {
              this.macros.endGroup();
            }, t.future = function () {
              return 0 === this.stack.length && this.pushToken(this.lexer.lex()), this.stack[this.stack.length - 1];
            }, t.popToken = function () {
              return this.future(), this.stack.pop();
            }, t.pushToken = function (e) {
              this.stack.push(e);
            }, t.pushTokens = function (e) {
              var t;(t = this.stack).push.apply(t, e);
            }, t.consumeSpaces = function () {
              for (;;) {
                if (" " !== this.future().text) break;this.stack.pop();
              }
            }, t.consumeArgs = function (e) {
              for (var t = [], r = 0; r < e; ++r) {
                this.consumeSpaces();var n = this.popToken();if ("{" === n.text) {
                  for (var i = [], a = 1; 0 !== a;) {
                    var o = this.popToken();if (i.push(o), "{" === o.text) ++a;else if ("}" === o.text) --a;else if ("EOF" === o.text) throw new X("End of input in macro argument", n);
                  }i.pop(), i.reverse(), t[r] = i;
                } else {
                  if ("EOF" === n.text) throw new X("End of input expecting macro argument");t[r] = [n];
                }
              }return t;
            }, t.expandOnce = function () {
              var e = this.popToken(),
                  t = e.text,
                  r = this._getExpansion(t);if (null == r) return this.pushToken(e), e;if (this.expansionCount++, this.expansionCount > this.settings.maxExpand) throw new X("Too many expansions: infinite loop or need to increase maxExpand setting");var n = r.tokens;if (r.numArgs) for (var i = this.consumeArgs(r.numArgs), a = (n = n.slice()).length - 1; 0 <= a; --a) {
                var o = n[a];if ("#" === o.text) {
                  if (0 === a) throw new X("Incomplete placeholder at end of macro body", o);if ("#" === (o = n[--a]).text) n.splice(a + 1, 1);else {
                    if (!/^[1-9]$/.test(o.text)) throw new X("Not a valid argument number", o);var s;(s = n).splice.apply(s, [a, 2].concat(i[+o.text - 1]));
                  }
                }
              }return this.pushTokens(n), n;
            }, t.expandAfterFuture = function () {
              return this.expandOnce(), this.future();
            }, t.expandNextToken = function () {
              for (;;) {
                var e = this.expandOnce();if (e instanceof a) {
                  if ("\\relax" !== e.text) return this.stack.pop();this.stack.pop();
                }
              }throw new Error();
            }, t.expandMacro = function (e) {
              if (this.macros.get(e)) {
                var t = [],
                    r = this.stack.length;for (this.pushToken(new a(e)); this.stack.length > r;) {
                  this.expandOnce() instanceof a && t.push(this.stack.pop());
                }return t;
              }
            }, t.expandMacroAsText = function (e) {
              var t = this.expandMacro(e);return t ? t.map(function (e) {
                return e.text;
              }).join("") : t;
            }, t._getExpansion = function (e) {
              var t = this.macros.get(e);if (null == t) return t;var r = "function" == typeof t ? t(this) : t;if ("string" != typeof r) return r;var n = 0;if (-1 !== r.indexOf("#")) for (var i = r.replace(/##/g, ""); -1 !== i.indexOf("#" + (n + 1));) {
                ++n;
              }for (var a = new un(r), o = [], s = a.lex(); "EOF" !== s.text;) {
                o.push(s), s = a.lex();
              }return o.reverse(), { tokens: o, numArgs: n };
            }, t.isDefined = function (e) {
              return this.macros.has(e) || on.hasOwnProperty(e) || W.math.hasOwnProperty(e) || W.text.hasOwnProperty(e) || Sn.hasOwnProperty(e);
            }, e;
          }(),
              Mn = { '\u0301': { text: "\\'", math: "\\acute" }, '\u0300': { text: "\\`", math: "\\grave" }, '\u0308': { text: '\\"', math: "\\ddot" }, '\u0303': { text: "\\~", math: "\\tilde" }, '\u0304': { text: "\\=", math: "\\bar" }, '\u0306': { text: '\\u', math: "\\breve" }, '\u030C': { text: "\\v", math: "\\check" }, '\u0302': { text: "\\^", math: "\\hat" }, '\u0307': { text: "\\.", math: "\\dot" }, '\u030A': { text: "\\r", math: "\\mathring" }, '\u030B': { text: "\\H" } },
              Tn = { "\xe1": 'a\u0301', "\xe0": 'a\u0300', "\xe4": 'a\u0308', '\u01DF': 'a\u0308\u0304', "\xe3": 'a\u0303', '\u0101': 'a\u0304', '\u0103': 'a\u0306', '\u1EAF': 'a\u0306\u0301', '\u1EB1': 'a\u0306\u0300', '\u1EB5': 'a\u0306\u0303', '\u01CE': 'a\u030C', "\xe2": 'a\u0302', '\u1EA5': 'a\u0302\u0301', '\u1EA7': 'a\u0302\u0300', '\u1EAB': 'a\u0302\u0303', '\u0227': 'a\u0307', '\u01E1': 'a\u0307\u0304', "\xe5": 'a\u030A', '\u01FB': 'a\u030A\u0301', '\u1E03': 'b\u0307', '\u0107': 'c\u0301', '\u010D': 'c\u030C', '\u0109': 'c\u0302', '\u010B': 'c\u0307', '\u010F': 'd\u030C', '\u1E0B': 'd\u0307', "\xe9": 'e\u0301', "\xe8": 'e\u0300', "\xeb": 'e\u0308', '\u1EBD': 'e\u0303', '\u0113': 'e\u0304', '\u1E17': 'e\u0304\u0301', '\u1E15': 'e\u0304\u0300', '\u0115': 'e\u0306', '\u011B': 'e\u030C', "\xea": 'e\u0302', '\u1EBF': 'e\u0302\u0301', '\u1EC1': 'e\u0302\u0300', '\u1EC5': 'e\u0302\u0303', '\u0117': 'e\u0307', '\u1E1F': 'f\u0307', '\u01F5': 'g\u0301', '\u1E21': 'g\u0304', '\u011F': 'g\u0306', '\u01E7': 'g\u030C', '\u011D': 'g\u0302', '\u0121': 'g\u0307', '\u1E27': 'h\u0308', '\u021F': 'h\u030C', '\u0125': 'h\u0302', '\u1E23': 'h\u0307', "\xed": 'i\u0301', "\xec": 'i\u0300', "\xef": 'i\u0308', '\u1E2F': 'i\u0308\u0301', '\u0129': 'i\u0303', '\u012B': 'i\u0304', '\u012D': 'i\u0306', '\u01D0': 'i\u030C', "\xee": 'i\u0302', '\u01F0': 'j\u030C', '\u0135': 'j\u0302', '\u1E31': 'k\u0301', '\u01E9': 'k\u030C', '\u013A': 'l\u0301', '\u013E': 'l\u030C', '\u1E3F': 'm\u0301', '\u1E41': 'm\u0307', '\u0144': 'n\u0301', '\u01F9': 'n\u0300', "\xf1": 'n\u0303', '\u0148': 'n\u030C', '\u1E45': 'n\u0307', "\xf3": 'o\u0301', "\xf2": 'o\u0300', "\xf6": 'o\u0308', '\u022B': 'o\u0308\u0304', "\xf5": 'o\u0303', '\u1E4D': 'o\u0303\u0301', '\u1E4F': 'o\u0303\u0308', '\u022D': 'o\u0303\u0304', '\u014D': 'o\u0304', '\u1E53': 'o\u0304\u0301', '\u1E51': 'o\u0304\u0300', '\u014F': 'o\u0306', '\u01D2': 'o\u030C', "\xf4": 'o\u0302', '\u1ED1': 'o\u0302\u0301', '\u1ED3': 'o\u0302\u0300', '\u1ED7': 'o\u0302\u0303', '\u022F': 'o\u0307', '\u0231': 'o\u0307\u0304', '\u0151': 'o\u030B', '\u1E55': 'p\u0301', '\u1E57': 'p\u0307', '\u0155': 'r\u0301', '\u0159': 'r\u030C', '\u1E59': 'r\u0307', '\u015B': 's\u0301', '\u1E65': 's\u0301\u0307', '\u0161': 's\u030C', '\u1E67': 's\u030C\u0307', '\u015D': 's\u0302', '\u1E61': 's\u0307', '\u1E97': 't\u0308', '\u0165': 't\u030C', '\u1E6B': 't\u0307', "\xfa": 'u\u0301', "\xf9": 'u\u0300', "\xfc": 'u\u0308', '\u01D8': 'u\u0308\u0301', '\u01DC': 'u\u0308\u0300', '\u01D6': 'u\u0308\u0304', '\u01DA': 'u\u0308\u030C', '\u0169': 'u\u0303', '\u1E79': 'u\u0303\u0301', '\u016B': 'u\u0304', '\u1E7B': 'u\u0304\u0308', '\u016D': 'u\u0306', '\u01D4': 'u\u030C', "\xfb": 'u\u0302', '\u016F': 'u\u030A', '\u0171': 'u\u030B', '\u1E7D': 'v\u0303', '\u1E83': 'w\u0301', '\u1E81': 'w\u0300', '\u1E85': 'w\u0308', '\u0175': 'w\u0302', '\u1E87': 'w\u0307', '\u1E98': 'w\u030A', '\u1E8D': 'x\u0308', '\u1E8B': 'x\u0307', "\xfd": 'y\u0301', '\u1EF3': 'y\u0300', "\xff": 'y\u0308', '\u1EF9': 'y\u0303', '\u0233': 'y\u0304', '\u0177': 'y\u0302', '\u1E8F': 'y\u0307', '\u1E99': 'y\u030A', '\u017A': 'z\u0301', '\u017E': 'z\u030C', '\u1E91': 'z\u0302', '\u017C': 'z\u0307', "\xc1": 'A\u0301', "\xc0": 'A\u0300', "\xc4": 'A\u0308', '\u01DE': 'A\u0308\u0304', "\xc3": 'A\u0303', '\u0100': 'A\u0304', '\u0102': 'A\u0306', '\u1EAE': 'A\u0306\u0301', '\u1EB0': 'A\u0306\u0300', '\u1EB4': 'A\u0306\u0303', '\u01CD': 'A\u030C', "\xc2": 'A\u0302', '\u1EA4': 'A\u0302\u0301', '\u1EA6': 'A\u0302\u0300', '\u1EAA': 'A\u0302\u0303', '\u0226': 'A\u0307', '\u01E0': 'A\u0307\u0304', "\xc5": 'A\u030A', '\u01FA': 'A\u030A\u0301', '\u1E02': 'B\u0307', '\u0106': 'C\u0301', '\u010C': 'C\u030C', '\u0108': 'C\u0302', '\u010A': 'C\u0307', '\u010E': 'D\u030C', '\u1E0A': 'D\u0307', "\xc9": 'E\u0301', "\xc8": 'E\u0300', "\xcb": 'E\u0308', '\u1EBC': 'E\u0303', '\u0112': 'E\u0304', '\u1E16': 'E\u0304\u0301', '\u1E14': 'E\u0304\u0300', '\u0114': 'E\u0306', '\u011A': 'E\u030C', "\xca": 'E\u0302', '\u1EBE': 'E\u0302\u0301', '\u1EC0': 'E\u0302\u0300', '\u1EC4': 'E\u0302\u0303', '\u0116': 'E\u0307', '\u1E1E': 'F\u0307', '\u01F4': 'G\u0301', '\u1E20': 'G\u0304', '\u011E': 'G\u0306', '\u01E6': 'G\u030C', '\u011C': 'G\u0302', '\u0120': 'G\u0307', '\u1E26': 'H\u0308', '\u021E': 'H\u030C', '\u0124': 'H\u0302', '\u1E22': 'H\u0307', "\xcd": 'I\u0301', "\xcc": 'I\u0300', "\xcf": 'I\u0308', '\u1E2E': 'I\u0308\u0301', '\u0128': 'I\u0303', '\u012A': 'I\u0304', '\u012C': 'I\u0306', '\u01CF': 'I\u030C', "\xce": 'I\u0302', '\u0130': 'I\u0307', '\u0134': 'J\u0302', '\u1E30': 'K\u0301', '\u01E8': 'K\u030C', '\u0139': 'L\u0301', '\u013D': 'L\u030C', '\u1E3E': 'M\u0301', '\u1E40': 'M\u0307', '\u0143': 'N\u0301', '\u01F8': 'N\u0300', "\xd1": 'N\u0303', '\u0147': 'N\u030C', '\u1E44': 'N\u0307', "\xd3": 'O\u0301', "\xd2": 'O\u0300', "\xd6": 'O\u0308', '\u022A': 'O\u0308\u0304', "\xd5": 'O\u0303', '\u1E4C': 'O\u0303\u0301', '\u1E4E': 'O\u0303\u0308', '\u022C': 'O\u0303\u0304', '\u014C': 'O\u0304', '\u1E52': 'O\u0304\u0301', '\u1E50': 'O\u0304\u0300', '\u014E': 'O\u0306', '\u01D1': 'O\u030C', "\xd4": 'O\u0302', '\u1ED0': 'O\u0302\u0301', '\u1ED2': 'O\u0302\u0300', '\u1ED6': 'O\u0302\u0303', '\u022E': 'O\u0307', '\u0230': 'O\u0307\u0304', '\u0150': 'O\u030B', '\u1E54': 'P\u0301', '\u1E56': 'P\u0307', '\u0154': 'R\u0301', '\u0158': 'R\u030C', '\u1E58': 'R\u0307', '\u015A': 'S\u0301', '\u1E64': 'S\u0301\u0307', '\u0160': 'S\u030C', '\u1E66': 'S\u030C\u0307', '\u015C': 'S\u0302', '\u1E60': 'S\u0307', '\u0164': 'T\u030C', '\u1E6A': 'T\u0307', "\xda": 'U\u0301', "\xd9": 'U\u0300', "\xdc": 'U\u0308', '\u01D7': 'U\u0308\u0301', '\u01DB': 'U\u0308\u0300', '\u01D5': 'U\u0308\u0304', '\u01D9': 'U\u0308\u030C', '\u0168': 'U\u0303', '\u1E78': 'U\u0303\u0301', '\u016A': 'U\u0304', '\u1E7A': 'U\u0304\u0308', '\u016C': 'U\u0306', '\u01D3': 'U\u030C', "\xdb": 'U\u0302', '\u016E': 'U\u030A', '\u0170': 'U\u030B', '\u1E7C': 'V\u0303', '\u1E82': 'W\u0301', '\u1E80': 'W\u0300', '\u1E84': 'W\u0308', '\u0174': 'W\u0302', '\u1E86': 'W\u0307', '\u1E8C': 'X\u0308', '\u1E8A': 'X\u0307', "\xdd": 'Y\u0301', '\u1EF2': 'Y\u0300', '\u0178': 'Y\u0308', '\u1EF8': 'Y\u0303', '\u0232': 'Y\u0304', '\u0176': 'Y\u0302', '\u1E8E': 'Y\u0307', '\u0179': 'Z\u0301', '\u017D': 'Z\u030C', '\u1E90': 'Z\u0302', '\u017B': 'Z\u0307', '\u03AC': '\u03B1\u0301', '\u1F70': '\u03B1\u0300', '\u1FB1': '\u03B1\u0304', '\u1FB0': '\u03B1\u0306', '\u03AD': '\u03B5\u0301', '\u1F72': '\u03B5\u0300', '\u03AE': '\u03B7\u0301', '\u1F74': '\u03B7\u0300', '\u03AF': '\u03B9\u0301', '\u1F76': '\u03B9\u0300', '\u03CA': '\u03B9\u0308', '\u0390': '\u03B9\u0308\u0301', '\u1FD2': '\u03B9\u0308\u0300', '\u1FD1': '\u03B9\u0304', '\u1FD0': '\u03B9\u0306', '\u03CC': '\u03BF\u0301', '\u1F78': '\u03BF\u0300', '\u03CD': '\u03C5\u0301', '\u1F7A': '\u03C5\u0300', '\u03CB': '\u03C5\u0308', '\u03B0': '\u03C5\u0308\u0301', '\u1FE2': '\u03C5\u0308\u0300', '\u1FE1': '\u03C5\u0304', '\u1FE0': '\u03C5\u0306', '\u03CE': '\u03C9\u0301', '\u1F7C': '\u03C9\u0300', '\u038E': '\u03A5\u0301', '\u1FEA': '\u03A5\u0300', '\u03AB': '\u03A5\u0308', '\u1FE9': '\u03A5\u0304', '\u1FE8': '\u03A5\u0306', '\u038F': '\u03A9\u0301', '\u1FFA': '\u03A9\u0300' },
              An = function () {
            function u(e, t) {
              this.mode = void 0, this.gullet = void 0, this.settings = void 0, this.leftrightDepth = void 0, this.nextToken = void 0, this.mode = "math", this.gullet = new zn(e, t, this.mode), this.settings = t, this.leftrightDepth = 0;
            }var e = u.prototype;return e.expect = function (e, t) {
              if (void 0 === t && (t = !0), this.nextToken.text !== e) throw new X("Expected '" + e + "', got '" + this.nextToken.text + "'", this.nextToken);t && this.consume();
            }, e.consume = function () {
              this.nextToken = this.gullet.expandNextToken();
            }, e.switchMode = function (e) {
              this.mode = e, this.gullet.switchMode(e);
            }, e.parse = function () {
              this.gullet.beginGroup(), this.settings.colorIsTextColor && this.gullet.macros.set("\\color", "\\textcolor"), this.consume();var e = this.parseExpression(!1);return this.expect("EOF", !1), this.gullet.endGroup(), e;
            }, e.parseExpression = function (e, t) {
              for (var r = [];;) {
                "math" === this.mode && this.consumeSpaces();var n = this.nextToken;if (-1 !== u.endOfExpression.indexOf(n.text)) break;if (t && n.text === t) break;if (e && on[n.text] && on[n.text].infix) break;var i = this.parseAtom(t);if (!i) break;r.push(i);
              }return "text" === this.mode && this.formLigatures(r), this.handleInfixNodes(r);
            }, e.handleInfixNodes = function (e) {
              for (var t, r = -1, n = 0; n < e.length; n++) {
                var i = Je(e[n], "infix");if (i) {
                  if (-1 !== r) throw new X("only one infix operator per group", i.token);r = n, t = i.replaceWith;
                }
              }if (-1 !== r && t) {
                var a,
                    o,
                    s = e.slice(0, r),
                    l = e.slice(r + 1);return a = 1 === s.length && "ordgroup" === s[0].type ? s[0] : { type: "ordgroup", mode: this.mode, body: s }, o = 1 === l.length && "ordgroup" === l[0].type ? l[0] : { type: "ordgroup", mode: this.mode, body: l }, ["\\\\abovefrac" === t ? this.callFunction(t, [a, e[r], o], []) : this.callFunction(t, [a, o], [])];
              }return e;
            }, e.handleSupSubscript = function (e) {
              var t = this.nextToken,
                  r = t.text;this.consume(), this.consumeSpaces();var n = this.parseGroup(e, !1, u.SUPSUB_GREEDINESS);if (!n) throw new X("Expected group after '" + r + "'", t);return n;
            }, e.handleUnsupportedCmd = function () {
              for (var e = this.nextToken.text, t = [], r = 0; r < e.length; r++) {
                t.push({ type: "textord", mode: "text", text: e[r] });
              }var n = { type: "text", mode: this.mode, body: t },
                  i = { type: "color", mode: this.mode, color: this.settings.errorColor, body: [n] };return this.consume(), i;
            }, e.parseAtom = function (e) {
              var t,
                  r,
                  n = this.parseGroup("atom", !1, null, e);if ("text" === this.mode) return n;for (;;) {
                this.consumeSpaces();var i = this.nextToken;if ("\\limits" === i.text || "\\nolimits" === i.text) {
                  var a = Je(n, "op");if (!a) throw new X("Limit controls must follow a math operator", i);var o = "\\limits" === i.text;a.limits = o, a.alwaysHandleSupSub = !0, this.consume();
                } else if ("^" === i.text) {
                  if (t) throw new X("Double superscript", i);t = this.handleSupSubscript("superscript");
                } else if ("_" === i.text) {
                  if (r) throw new X("Double subscript", i);r = this.handleSupSubscript("subscript");
                } else if ("'" === i.text) {
                  if (t) throw new X("Double superscript", i);var s = { type: "textord", mode: this.mode, text: "\\prime" },
                      l = [s];for (this.consume(); "'" === this.nextToken.text;) {
                    l.push(s), this.consume();
                  }"^" === this.nextToken.text && l.push(this.handleSupSubscript("superscript")), t = { type: "ordgroup", mode: this.mode, body: l };
                } else {
                  if ("%" !== i.text) break;this.consumeComment();
                }
              }return t || r ? { type: "supsub", mode: this.mode, base: n, sup: t, sub: r } : n;
            }, e.parseFunction = function (e, t, r) {
              var n = this.nextToken,
                  i = n.text,
                  a = on[i];if (!a) return null;if (null != r && a.greediness <= r) throw new X("Got function '" + i + "' with no arguments" + (t ? " as " + t : ""), n);if ("text" === this.mode && !a.allowedInText) throw new X("Can't use function '" + i + "' in text mode", n);if ("math" === this.mode && !1 === a.allowedInMath) throw new X("Can't use function '" + i + "' in math mode", n);if (a.consumeMode) {
                var o = this.mode;this.switchMode(a.consumeMode), this.consume(), this.switchMode(o);
              } else this.consume();var s = this.parseArguments(i, a),
                  l = s.args,
                  h = s.optArgs;return this.callFunction(i, l, h, n, e);
            }, e.callFunction = function (e, t, r, n, i) {
              var a = { funcName: e, parser: this, token: n, breakOnTokenText: i },
                  o = on[e];if (o && o.handler) return o.handler(a, t, r);throw new X("No function handler for " + e);
            }, e.parseArguments = function (e, t) {
              var r = t.numArgs + t.numOptionalArgs;if (0 === r) return { args: [], optArgs: [] };for (var n = t.greediness, i = [], a = [], o = 0; o < r; o++) {
                var s = t.argTypes && t.argTypes[o],
                    l = o < t.numOptionalArgs;0 < o && !l && this.consumeSpaces(), 0 !== o || l || "math" !== this.mode || this.consumeSpaces();var h = this.nextToken,
                    m = this.parseGroupOfType("argument to '" + e + "'", s, l, n);if (!m) {
                  if (l) {
                    a.push(null);continue;
                  }throw new X("Expected group after '" + e + "'", h);
                }(l ? a : i).push(m);
              }return { args: i, optArgs: a };
            }, e.parseGroupOfType = function (e, t, r, n) {
              switch (t) {case "color":
                  return this.parseColorGroup(r);case "size":
                  return this.parseSizeGroup(r);case "url":
                  return this.parseUrlGroup(r);case "math":case "text":
                  return this.parseGroup(e, r, n, void 0, t);case "raw":
                  var i = this.parseStringGroup("raw", r, !0);if (i) return { type: "raw", mode: "text", string: i.text };throw new X("Expected raw group", this.nextToken);case "original":case null:case void 0:
                  return this.parseGroup(e, r, n);default:
                  throw new X("Unknown group type as " + e, this.nextToken);}
            }, e.consumeSpaces = function () {
              for (; " " === this.nextToken.text;) {
                this.consume();
              }
            }, e.consumeComment = function () {
              for (; "EOF" !== this.nextToken.text && this.nextToken.loc && -1 === this.nextToken.loc.getSource().indexOf("\n");) {
                this.consume();
              }if ("EOF" === this.nextToken.text && this.settings.reportNonstrict("commentAtEnd", "% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)"), "math" === this.mode) this.consumeSpaces();else if (this.nextToken.loc) {
                var e = this.nextToken.loc.getSource();e.indexOf("\n") === e.length - 1 && this.consumeSpaces();
              }
            }, e.parseStringGroup = function (e, t, r) {
              var n = t ? "[" : "{",
                  i = t ? "]" : "}",
                  a = this.nextToken;if (a.text !== n) {
                if (t) return null;if (r && "EOF" !== a.text && /[^{}[\]]/.test(a.text)) return this.consume(), a;
              }var o = this.mode;this.mode = "text", this.expect(n);for (var s = "", l = this.nextToken, h = 0, m = l; r && 0 < h || this.nextToken.text !== i;) {
                switch (this.nextToken.text) {case "EOF":
                    throw new X("Unexpected end of input in " + e, l.range(m, s));case "%":
                    if (r) break;this.consumeComment();continue;case n:
                    h++;break;case i:
                    h--;}s += (m = this.nextToken).text, this.consume();
              }return this.mode = o, this.expect(i), l.range(m, s);
            }, e.parseRegexGroup = function (e, t) {
              var r = this.mode;this.mode = "text";for (var n = this.nextToken, i = n, a = ""; "EOF" !== this.nextToken.text && (e.test(a + this.nextToken.text) || "%" === this.nextToken.text);) {
                "%" !== this.nextToken.text ? (a += (i = this.nextToken).text, this.consume()) : this.consumeComment();
              }if ("" === a) throw new X("Invalid " + t + ": '" + n.text + "'", n);return this.mode = r, n.range(i, a);
            }, e.parseColorGroup = function (e) {
              var t = this.parseStringGroup("color", e);if (!t) return null;var r = /^(#[a-f0-9]{3}|#?[a-f0-9]{6}|[a-z]+)$/i.exec(t.text);if (!r) throw new X("Invalid color: '" + t.text + "'", t);var n = r[0];return (/^[0-9a-f]{6}$/i.test(n) && (n = "#" + n), { type: "color-token", mode: this.mode, color: n }
              );
            }, e.parseSizeGroup = function (e) {
              var t,
                  r = !1;if (!(t = e || "{" === this.nextToken.text ? this.parseStringGroup("size", e) : this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/, "size"))) return null;e || 0 !== t.text.length || (t.text = "0pt", r = !0);var n = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(t.text);if (!n) throw new X("Invalid size: '" + t.text + "'", t);var i = { number: +(n[1] + n[2]), unit: n[3] };if (!He(i)) throw new X("Invalid unit: '" + i.unit + "'", t);return { type: "size", mode: this.mode, value: i, isBlank: r };
            }, e.parseUrlGroup = function (e) {
              var t = this.parseStringGroup("url", e, !0);if (!t) return null;var r = t.text.replace(/\\([#$%&~_^{}])/g, "$1"),
                  n = /^\s*([^\\/#]*?)(?::|&#0*58|&#x0*3a)/i.exec(r);n = null != n ? n[1] : "_relative";var i = this.settings.allowedProtocols;if (!Y.contains(i, "*") && !Y.contains(i, n)) throw new X("Forbidden protocol '" + n + "'", t);return { type: "url", mode: this.mode, url: r };
            }, e.parseGroup = function (e, t, r, n, i) {
              var a,
                  o,
                  s = this.mode,
                  l = this.nextToken,
                  h = l.text;if (i && this.switchMode(i), t ? "[" === h : "{" === h || "\\begingroup" === h) {
                a = u.endOfGroup[h], this.gullet.beginGroup(), this.consume();var m = this.parseExpression(!1, a),
                    c = this.nextToken;this.gullet.endGroup(), o = { type: "ordgroup", mode: this.mode, loc: p.range(l, c), body: m, semisimple: "\\begingroup" === h || void 0 };
              } else if (t) o = null;else if (null == (o = this.parseFunction(n, e, r) || this.parseSymbol()) && "\\" === h[0] && !Sn.hasOwnProperty(h)) {
                if (this.settings.throwOnError) throw new X("Undefined control sequence: " + h, l);o = this.handleUnsupportedCmd();
              }return i && this.switchMode(s), a && this.expect(a), o;
            }, e.formLigatures = function (e) {
              for (var t = e.length - 1, r = 0; r < t; ++r) {
                var n = e[r],
                    i = n.text;"-" === i && "-" === e[r + 1].text && (r + 1 < t && "-" === e[r + 2].text ? (e.splice(r, 3, { type: "textord", mode: "text", loc: p.range(n, e[r + 2]), text: "---" }), t -= 2) : (e.splice(r, 2, { type: "textord", mode: "text", loc: p.range(n, e[r + 1]), text: "--" }), t -= 1)), "'" !== i && "`" !== i || e[r + 1].text !== i || (e.splice(r, 2, { type: "textord", mode: "text", loc: p.range(n, e[r + 1]), text: i + i }), t -= 1);
              }
            }, e.parseSymbol = function () {
              var e = this.nextToken,
                  t = e.text;if (/^\\verb[^a-zA-Z]/.test(t)) {
                this.consume();var r = t.slice(5),
                    n = "*" === r.charAt(0);if (n && (r = r.slice(1)), r.length < 2 || r.charAt(0) !== r.slice(-1)) throw new X("\\verb assertion failed --\n                    please report what input caused this bug");return { type: "verb", mode: "text", body: r = r.slice(1, -1), star: n };
              }if ("%" === t) return this.consumeComment(), this.parseSymbol();Tn.hasOwnProperty(t[0]) && !W[this.mode][t[0]] && (this.settings.strict && "math" === this.mode && this.settings.reportNonstrict("unicodeTextInMathMode", 'Accented Unicode text character "' + t[0] + '" used in math mode', e), t = Tn[t[0]] + t.substr(1));var i,
                  a = cn.exec(t);if (a && ("i" === (t = t.substring(0, a.index)) ? t = '\u0131' : "j" === t && (t = '\u0237')), W[this.mode][t]) {
                this.settings.strict && "math" === this.mode && 0 <= Me.indexOf(t) && this.settings.reportNonstrict("unicodeTextInMathMode", 'Latin-1/Unicode text character "' + t[0] + '" used in math mode', e);var o,
                    s = W[this.mode][t].group,
                    l = p.range(e);if (U.hasOwnProperty(s)) {
                  var h = s;o = { type: "atom", mode: this.mode, family: h, loc: l, text: t };
                } else o = { type: s, mode: this.mode, loc: l, text: t };i = o;
              } else {
                if (!(128 <= t.charCodeAt(0))) return null;this.settings.strict && (w(t.charCodeAt(0)) ? "math" === this.mode && this.settings.reportNonstrict("unicodeTextInMathMode", 'Unicode text character "' + t[0] + '" used in math mode', e) : this.settings.reportNonstrict("unknownSymbol", 'Unrecognized Unicode character "' + t[0] + '" (' + t.charCodeAt(0) + ")", e)), i = { type: "textord", mode: this.mode, loc: p.range(e), text: t };
              }if (this.consume(), a) for (var m = 0; m < a[0].length; m++) {
                var c = a[0][m];if (!Mn[c]) throw new X("Unknown accent ' " + c + "'", e);var u = Mn[c][this.mode];if (!u) throw new X("Accent " + c + " unsupported in " + this.mode + " mode", e);i = { type: "accent", mode: this.mode, loc: p.range(e), label: u, isStretchy: !1, isShifty: !0, base: i };
              }return i;
            }, u;
          }();An.endOfExpression = ["}", "\\endgroup", "\\end", "\\right", "&"], An.endOfGroup = { "[": "]", "{": "}", "\\begingroup": "\\endgroup" }, An.SUPSUB_GREEDINESS = 1;var Bn = function Bn(e, t) {
            if (!("string" == typeof e || e instanceof String)) throw new TypeError("KaTeX can only parse string typed expression");var r = new An(e, t);delete r.gullet.macros.current["\\df@tag"];var n = r.parse();if (r.gullet.macros.get("\\df@tag")) {
              if (!t.displayMode) throw new X("\\tag works only in display equations");r.gullet.feed("\\df@tag"), n = [{ type: "tag", mode: "text", body: n, tag: r.parse() }];
            }return n;
          },
              Cn = function Cn(e, t, r) {
            t.textContent = "";var n = qn(e, r).toNode();t.appendChild(n);
          };"undefined" != typeof document && "CSS1Compat" !== document.compatMode && ("undefined" != typeof console && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype."), Cn = function Cn() {
            throw new X("KaTeX doesn't work in quirks mode.");
          });var Nn = function Nn(e, t, r) {
            if (r.throwOnError || !(e instanceof X)) throw e;var n = Ze.makeSpan(["katex-error"], [new O(t)]);return n.setAttribute("title", e.toString()), n.setAttribute("style", "color:" + r.errorColor), n;
          },
              qn = function qn(t, e) {
            var r = new h(e);try {
              var n = Bn(t, r);return Lt(n, t, r);
            } catch (e) {
              return Nn(e, t, r);
            }
          },
              En = { version: "0.10.1-pre", render: Cn, renderToString: function renderToString(e, t) {
              return qn(e, t).toMarkup();
            }, ParseError: X, __parse: function __parse(e, t) {
              var r = new h(t);return Bn(e, r);
            }, __renderToDomTree: qn, __renderToHTMLTree: function __renderToHTMLTree(t, e) {
              var r,
                  n,
                  i,
                  a = new h(e);try {
                var o = Bn(t, a);return n = zt(o, Rt(r = a)), i = Ze.makeSpan(["katex"], [n]), r.displayMode ? Ze.makeSpan(["katex-display"], [i]) : i;
              } catch (e) {
                return Nn(e, t, a);
              }
            }, __setFontMetrics: function __setFontMetrics(e, t) {
              H[e] = t;
            }, __defineSymbol: j, __defineMacro: gn, __domTree: { Span: B, Anchor: C, SymbolNode: O, SvgNode: I, PathNode: R, LineNode: L } };t.default = En;
        }]).default;
      });
    });

    var katex = unwrapExports(katexModified_min);
    var katexModified_min_1 = katexModified_min.katex;

    /**
       @class
       @classdesc A class representing a Guppy document.  To access this
       class, use `Guppy.Doc`.  To get the document for a particular guppy
       instance, say called `"guppy1"`, do `Guppy("guppy1").doc()`.
       @param {string} [doc=<m><e></e></m>] - An XML string representing the document
       @constructor
     */
    var Doc = function Doc(doc, type) {
        type = type || "xml";
        if (type == "xml") this.set_content(doc || "<m><e></e></m>");else if (type == "latex") this.import_latex(doc);else if (type == "text") this.import_text(doc);else if (type == "ast") this.import_ast(doc);
        if (this.root().hasAttribute("v") && this.root().getAttribute("v") != Version.DOC_VERSION) throw Version.DOC_ERROR;else this.root().setAttribute("v", Version.DOC_VERSION);
    };

    Doc.prototype.is_small = function (nn) {
        var n = nn.parentNode;
        while (n != null && n.nodeName != 'm') {
            if (n.getAttribute("small") == "yes") return true;
            n = n.parentNode;
            while (n != null && n.nodeName != 'c') {
                n = n.parentNode;
            }
        }
        return false;
    };

    Doc.prototype.ensure_text_nodes = function () {
        var l = this.base.getElementsByTagName("e");
        for (var i = 0; i < l.length; i++) {
            if (!l[i].firstChild) l[i].appendChild(this.base.createTextNode(""));
        }
    };

    Doc.prototype.is_blank = function () {
        if (this.base.getElementsByTagName("f").length > 0) return false;
        var l = this.base.getElementsByTagName("e");
        if (l.length == 1 && (!l[0].firstChild || l[0].firstChild.textContent == "")) return true;
        return false;
    };

    /**
        Get the document as a DOM object
        @memberof Doc
        @returns {Element}
    */
    Doc.prototype.root = function () {
        return this.base.documentElement;
    };

    /**
        Get the content of the document as a string
        @memberof Doc
        @param {string} t - The rendering method to use ("latex", "text", "ast" (for syntax tree), or "xml" (for internal XML representation))
        @returns {string}
    */
    Doc.prototype.get_content = function (t, r) {
        if (t == "xml") return new XMLSerializer().serializeToString(this.base);else if (t == "ast") return JSON.stringify(this.syntax_tree());else if (t == "text") return AST.to_text(this.syntax_tree());else if (t == "function") return AST.to_function(this.syntax_tree(), r);else if (t == "eqns") return JSON.stringify(AST.to_eqlist(this.syntax_tree()));else return this.manual_render(t, this.root(), r);
    };

    /**
        Evaluate the document using user-supplied functions to interpret symbols
        @memberof Doc
        @param {Object} evaluators - A dictionary where each key is a node
        type in the AST ("var", "val", "sin", "cos", etc.) and the
        corresponding value is a function that takes a list of argument
        (the results of evaluating that AST node's arguments) as well as,
        optionally, a second argument for the parent AST node to the one
        currently being evaluated.
        @returns {Object}
    */
    Doc.prototype.evaluate = function (evaluators) {
        return AST.eval(this.syntax_tree(), evaluators);
    };

    Doc.prototype.import_text = function (text, syms, s2n) {
        var ast = Parsers.TextParser.tokenise_and_parse(text);
        this.import_ast(ast, syms, s2n);
    };

    Doc.prototype.import_latex = function (text, syms, s2n) {
        var ast = Parsers.LaTeXParser.tokenise_and_parse(text);
        this.import_ast(ast, syms, s2n);
    };

    Doc.prototype.import_ast = function (ast, syms, s2n) {
        syms = syms || Symbols.symbols;
        s2n = s2n || Symbols.symbol_to_node;
        var doc = AST.to_xml(ast, syms, s2n);
        this.base = doc;
        this.ensure_text_nodes();
    };

    Doc.prototype.syntax_tree = function (n) {
        n = n || this.root();
        if (n.nodeName == "f") {
            var ans = { "args": [], "kwargs": {} };
            ans['value'] = n.getAttribute("type");
            ans['type'] = "function";
            if (n.hasAttribute("ast_value")) ans['value'] = n.getAttribute("ast_value");
            if (n.hasAttribute("ast_type")) ans['type'] = n.getAttribute("ast_type");else if (Utils.is_char(n)) ans['type'] = "name";

            var iterator = this.xpath_list("./*[name()='c' or name()='l']", n);
            for (var nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()) {
                //if(nn.hasAttribute("name")) ans.kwargs[nn.getAttribute("name")] = this.syntax_tree(nn)
                //else ans.args.push(this.syntax_tree(nn))
                ans.args.push(this.syntax_tree(nn));
            }
        } else if (n.nodeName == "l") {
            ans = [];
            for (nn = n.firstChild; nn != null; nn = nn.nextSibling) {
                ans.push(this.syntax_tree(nn));
            }
            ans = ["list", ans];
        } else if (n.nodeName == "c" || n.nodeName == "m") {
            if (n.hasAttribute("mode") && n.getAttribute("mode") == "text") {
                ans = n.firstChild.firstChild.textContent;
            } else {
                var tokens = [];
                for (nn = n.firstChild; nn != null; nn = nn.nextSibling) {
                    if (nn.nodeName == "e") {
                        tokens = tokens.concat(Parsers.EParser.tokenise(nn.firstChild.textContent));
                    } else if (nn.nodeName == "f") {
                        tokens.push(this.syntax_tree(nn));
                    }
                }
                ans = Parsers.EParser.parse(tokens);
            }
        }
        return ans;
    };

    Doc.prototype.xpath_node = function (xpath, node) {
        node = node || this.root();
        return this.base.evaluate(xpath, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    };

    Doc.prototype.xpath_list = function (xpath, node) {
        node = node || this.root();
        return this.base.evaluate(xpath, node, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    };

    /**
        Get the names of symbols used in this document
        @memberof Doc
        @param {string[]} [groups] - A list of groups you want strings for
        @returns {string[]}
    */
    Doc.prototype.get_symbols = function (groups) {
        var types = {};
        var ans = [];
        var groups_selector = "//f";
        if (groups) groups_selector += "[" + groups.map(function () {
            return "";
        }).join(" or ") + "]";
        var iterator = this.xpath_list(groups_selector);
        for (var nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()) {
            types[nn.getAttribute("type")] = true;
        }for (var t in types) {
            ans.push(t);
        }return ans;
    };

    /**
        Set the content of the document
        @memberof Doc
        @param {string} xml_data - An XML string representing the content of the document
    */
    Doc.prototype.set_content = function (xml_data) {
        this.base = new window.DOMParser().parseFromString(xml_data, "text/xml");
        this.ensure_text_nodes();
    };

    Doc.prototype.auto_bracket = function (n) {
        var e0 = n.firstChild;
        var e1 = n.lastChild;
        if (n.childElementCount == 3 && e0.firstChild.textContent == "" && e1.firstChild.textContent == "") {
            // single f child, all e children empty
            var f = e0.nextSibling;
            var cs = 0;
            var c = null;
            // Count immediate children of f that are c nodes in cs and store the last one in c
            for (var nn = f.firstChild; nn; nn = nn.nextSibling) {
                if (nn.tagName == "c") {
                    c = nn;cs++;
                }
            }if (cs == 1 && c.getAttribute("is_bracket") == "yes") return false; // if the f child is a bracket, don't bracket
            if (Utils.is_char(f) && e0.getAttribute("current") != "yes" && e0.getAttribute("temp") != "yes" && e1.getAttribute("current") != "yes" && e1.getAttribute("temp") != "yes") return false; // if the f child is a character and not current or temp cursor location, don't bracket
        } else if (n.childElementCount == 1) {
            // Single e child
            var s = e0.firstChild.textContent;
            if (s.length != 1 && Number(s) + "" != s) return true; // If content is neither a single character nor a number, bracket it
            if (e0.getAttribute("current") == "yes" || e0.getAttribute("temp") == "yes") return true; // If content has the cursor or temp cursor, bracket it
            return false;
        }
        return true;
    };

    Doc.prototype.manual_render = function (t, n, r) {
        var ans = "";
        var nn = null;
        var i = null;
        var spacer = t == "latex" ? " " : "";
        if (n.nodeName == "e") {
            if (t == "latex" && r) {
                ans = n.getAttribute("render");
            } else {
                ans = n.firstChild.textContent;
            }
        } else if (n.nodeName == "f") {
            var real_type = t == "latex" && this.is_small(n) ? "small_latex" : t;
            nn = this.xpath_node("./b[@p='" + real_type + "']", n) || this.xpath_node("./b[@p='" + t + "']", n);
            if (nn) ans = this.manual_render(t, nn, r);
        } else if (n.nodeName == "b") {
            var cs = [];
            i = 1;
            var par = n.parentNode;
            for (nn = par.firstChild; nn != null; nn = nn.nextSibling) {
                if (nn.nodeName == "c" || nn.nodeName == "l") cs[i++] = this.manual_render(t, nn, r);
            }for (nn = n.firstChild; nn != null; nn = nn.nextSibling) {
                if (nn.nodeType == 3) ans += nn.textContent + spacer;else if (nn.nodeType == 1) {
                    if (nn.hasAttribute("d")) {
                        var dim = parseInt(nn.getAttribute("d"));
                        var joiner = function joiner(d, l) {
                            if (d > 1) for (var k = 0; k < l.length; k++) {
                                l[k] = joiner(d - 1, l[k]);
                            }return l.join(nn.getAttribute('sep' + (d - 1)));
                        };
                        ans += joiner(dim, cs[parseInt(nn.getAttribute("ref"))]) + spacer;
                    } else ans += cs[parseInt(nn.getAttribute("ref"))] + spacer;
                }
            }
        } else if (n.nodeName == "l") {
            ans = [];
            i = 0;
            for (nn = n.firstChild; nn != null; nn = nn.nextSibling) {
                ans[i++] = this.manual_render(t, nn, r);
            }
        } else if (n.nodeName == "c" || n.nodeName == "m") {
            for (nn = n.firstChild; nn != null; nn = nn.nextSibling) {
                ans += this.manual_render(t, nn, r) + spacer;
            }if (t == "latex" && n.getAttribute("bracket") == "yes" && this.auto_bracket(n)) {
                ans = "\\left(" + ans + "\\right)";
            }
        }
        return ans;
    };

    Doc.render_all = function (t, delim, root_node) {
        var l,
            i,
            n,
            d,
            s,
            ans = [];
        if (!t || t == "xml") {
            l = document.getElementsByTagName("script");
            for (i = 0; i < l.length; i++) {
                if (l[i].getAttribute("type") == "text/guppy_xml") {
                    n = l[i];
                    d = new Doc(n.innerHTML);
                    s = document.createElement("span");
                    var len = ans.length;
                    var new_id = "guppy-" + t + "-render-" + len;
                    while (document.getElementById(new_id)) {
                        new_id = "guppy-xml-render-" + ++len;
                    }s.setAttribute("id", new_id);
                    s.setAttribute("class", "guppy-render");
                    katex.render(d.get_content("latex"), s);
                    n.parentNode.insertBefore(s, n);
                    n.parentNode.removeChild(n);
                    ans.push({ "container": s, "doc": d });
                }
            }
        } else {
            var subs = function subs(node) {
                if (!node) return;
                var excludeElements = ['script', 'style', 'iframe', 'canvas', 'pre', 'code'];
                do {
                    switch (node.nodeType) {
                        case 1:
                            // Don't process KaTeX elements, Guppy instances, Javascript, or CSS
                            if (excludeElements.indexOf(node.tagName.toLowerCase()) > -1 || (" " + node.getAttribute("class") + " ").indexOf(" katex ") > -1 || ("" + node.getAttribute("class")).indexOf("guppy") > -1) {
                                continue;
                            }
                            subs(node.firstChild);
                            break;
                        case 3:
                            var text_node = node;
                            var offset = text_node.textContent.indexOf(delim);
                            while (offset > -1) {
                                var next = text_node.textContent.substring(offset + delim.length).indexOf(delim);
                                if (next == -1) break;
                                var before = text_node.textContent.substring(0, offset);
                                var content = text_node.textContent.substring(offset + delim.length, offset + delim.length + next);
                                var after = text_node.textContent.substring(offset + delim.length + next + delim.length);

                                // Make the span to render the doc in
                                var s = document.createElement("span");
                                var l = ans.length;
                                var new_id = "guppy-" + t + "-render-" + l;
                                while (document.getElementById(new_id)) {
                                    new_id = "guppy-" + t + "-render-" + ++l;
                                }s.setAttribute("id", new_id);
                                s.setAttribute("class", "guppy-render");

                                try {
                                    // Create the document
                                    d = new Doc(content, t);

                                    // Render the doc
                                    katex.render(d.get_content("latex"), s);
                                } catch (e) {
                                    s.innerHTML = "ERROR: " + e.message;
                                }
                                var new_node = document.createTextNode(after);
                                text_node.parentNode.insertBefore(document.createTextNode(before), text_node);
                                text_node.parentNode.insertBefore(s, text_node);
                                text_node.parentNode.insertBefore(new_node, text_node);
                                text_node.parentNode.removeChild(text_node);
                                text_node = new_node;
                                node = new_node;
                                ans.push({ "id": new_id, "doc": d });

                                offset = text_node.textContent.indexOf(delim);
                            }
                            break;
                        default:
                            break;
                    }
                } while (node = node.nextSibling);
            };
            delim = delim || "$$";
            subs(root_node || document.documentElement);
        }
        return ans;
    };

    /**
        Render a given document into a specified HTML element.
        @param {string} doc - A GuppyXML string to be rendered
        @param {string} target_id - The ID of the HTML element to render into
        @param {string} type - Optional type of the doc provided. Default is `xml`
        @memberof Doc
    */
    Doc.render = function (doc, target_id, type) {
        var d = new Doc(doc, type);
        var target = document.getElementById(target_id);
        katex.render(d.get_content("latex"), target);
        return { "container": target, "doc": d };
    };

    var Keyboard = function Keyboard() {
    				this.is_mouse_down = false;

    				/* keyboard behaviour definitions */

    				// keys aside from 0-9,a-z,A-Z
    				this.k_chars = {
    								"+": "+",
    								"-": "-",
    								"*": "*",
    								".": "."
    				};
    				this.k_text = {
    								"/": "/",
    								"*": "*",
    								"(": "(",
    								")": ")",
    								"<": "<",
    								">": ">",
    								"|": "|",
    								"!": "!",
    								",": ",",
    								".": ".",
    								";": ";",
    								"=": "=",
    								"[": "[",
    								"]": "]",
    								"@": "@",
    								"'": "'",
    								"`": "`",
    								":": ":",
    								"\"": "\"",
    								"?": "?",
    								"space": " "
    				};
    				this.k_controls = {
    								"up": "up",
    								"down": "down",
    								"right": "right",
    								"left": "left",
    								"alt+k": "up",
    								"alt+j": "down",
    								"alt+l": "right",
    								"alt+h": "left",
    								"space": "spacebar",
    								"home": "home",
    								"end": "end",
    								"backspace": "backspace",
    								"del": "delete_key",
    								"mod+a": "sel_all",
    								"mod+c": "sel_copy",
    								"mod+x": "sel_cut",
    								"mod+v": "sel_paste",
    								"mod+z": "undo",
    								"mod+y": "redo",
    								"enter": "done",
    								"mod+shift+right": "list_extend_copy_right",
    								"mod+shift+left": "list_extend_copy_left",
    								",": "list_extend_right",
    								";": "list_extend_down",
    								"mod+right": "list_extend_right",
    								"mod+left": "list_extend_left",
    								"mod+up": "list_extend_up",
    								"mod+down": "list_extend_down",
    								"mod+shift+up": "list_extend_copy_up",
    								"mod+shift+down": "list_extend_copy_down",
    								"mod+backspace": "list_remove",
    								"mod+shift+backspace": "list_remove_row",
    								"shift+left": "sel_left",
    								"shift+right": "sel_right",
    								"(": "insert_opening_bracket",
    								")": "insert_closing_bracket",
    								"\\": "backslash",
    								"tab": "tab"
    				};

    				// Will populate keyboard shortcuts for symbols from symbol files
    				this.k_syms = {};

    				this.k_raw = "mod+space";

    				var i = 0;

    				// letters

    				for (i = 65; i <= 90; i++) {
    								this.k_chars[String.fromCharCode(i).toLowerCase()] = String.fromCharCode(i).toLowerCase();
    								this.k_chars['shift+' + String.fromCharCode(i).toLowerCase()] = String.fromCharCode(i).toUpperCase();
    				}

    				// numbers

    				for (i = 48; i <= 57; i++) {
    								this.k_chars[String.fromCharCode(i)] = String.fromCharCode(i);
    				}
    };

    var Settings = {};
    Settings.config = {};
    Settings.config.events = {};
    Settings.config.valid_events = ["change", "left_end", "right_end", "done", "completion", "debug", "error", "focus"];
    Settings.config.settings = {
        "autoreplace": "auto",
        "empty_content": "\\blue{[?]}",
        "blank_caret": "",
        "blank_placeholder": "[?]",
        "blacklist": [],
        "buttons": ["osk", "settings", "symbols", "controls"],
        "cliptype": "latex"
    };

    Settings.settings_options = {
        "autoreplace": ["auto", "whole", "delay", "none"],
        "cliptype": ["latex", "text", "xml", "ast", "asciimath"]
    };

    Settings.panels = {};
    Settings.panels.controls = document.createElement("div");
    Settings.panels.controls.setAttribute("class", "guppy_help");
    Settings.panels.controls.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
    Settings.panels.controls.innerHTML = "<p>Start typing the name of a mathematical function to automatically insert it.  </p><p>(For example, \"sqrt\" for root, \"mat\" for matrix, or \"defi\" for definite integral.)</p>\n\
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>\n\
<h3>Controls</h3><table id=\"guppy_help_table\"><tr><td><b>Press...</b></td><td><b>...to do</b></td></tr></table>";

    Settings.panels.symbols = document.createElement("div");
    Settings.panels.symbols.setAttribute("class", "guppy_help");
    Settings.panels.symbols.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
    Settings.panels.symbols.innerHTML = "<p>Start typing the name of a mathematical function to automatically insert it.  </p><p>(For example, \"sqrt\" for root, \"mat\" for matrix, or \"defi\" for definite integral.)</p>\n\
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>\n\
<h3>Symbols</h3><table id=\"guppy_syms_table\"><tr><td><b>Type...</b></td><td><b>...to get</b></td></tr></table>";

    Settings.panels.settings = document.createElement("div");
    Settings.panels.settings.setAttribute("class", "guppy_help");
    Settings.panels.settings.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
    Settings.panels.settings.innerHTML = "<p>Global settings: </p>\n\
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>\n\
<h3>Settings</h3><table id=\"guppy_settings_table\"></table>";

    Settings.div_names = ["controls", "symbols", "settings"];

    var make_row = function make_row(table_id, c1, c2) {
        var row = document.createElement("tr");
        row.innerHTML = "<td><font face=\"monospace\">" + c1 + "</font></td><td>" + c2 + "</td>";
        document.getElementById(table_id).appendChild(row);
        return row;
    };

    var make_x = function make_x(elt) {
        var x = document.createElement("div");
        x.setAttribute("class", "guppy-card-x");
        x.innerHTML = "<font size=\"6pt\">&times;</font>";
        x.style = "cursor:pointer;position:absolute;top:0;right:0;padding-right:5px;line-height:1;";
        x.onclick = function () {
            elt.style.display = "none";
        };
        elt.appendChild(x);
    };

    Settings.hide_all = function () {
        for (var i = 0; i < Settings.div_names.length; i++) {
            Settings.panels[Settings.div_names[i]].style.display = "none";
        }
    };

    Settings.toggle = function (card, g) {
        if (Settings.div_names.indexOf(card) >= 0) {
            Settings.init_card(card, g);
            if (Settings.panels[card].style.display == "none") {
                Settings.hide_all();
                var r = g.editor.getBoundingClientRect();
                Settings.panels[card].style.top = r.bottom + document.documentElement.scrollTop + "px";
                Settings.panels[card].style.left = r.left + document.documentElement.scrollLeft + "px";
                Settings.panels[card].style.display = "block";
            } else {
                Settings.hide_all();
            }
        }
    };

    Settings.init_card = function (card, g) {
        if (card == "settings") {
            document.getElementById("guppy_settings_table").innerHTML = "";
            for (var s in Settings.settings_options) {
                var opt = Settings.settings_options[s];
                var val = g.engine.setting(s);
                var sel = document.createElement("select");
                sel.setAttribute("selected", val);
                sel.setAttribute("id", "guppy_settings_select_" + s);
                sel.onchange = function (ss) {
                    return function () {
                        Settings.config.settings[ss] = document.getElementById("guppy_settings_select_" + ss).value;
                    };
                }(s);
                for (var i = 0; i < opt.length; i++) {
                    var o = document.createElement("option");
                    o.setAttribute("value", opt[i]);
                    o.innerHTML = opt[i];
                    sel.appendChild(o);
                }
                var row = document.createElement("tr");
                row.innerHTML = "<td><font face=\"monospace\">" + s + "</font></td>";
                var td = document.createElement("td");
                td.appendChild(sel);
                row.appendChild(td);
                document.getElementById("guppy_settings_table").appendChild(row);
            }
        }
    };

    Settings.init = function (symbols) {
        for (var i = 0; i < Settings.div_names.length; i++) {
            make_x(Settings.panels[Settings.div_names[i]]);
            document.body.appendChild(Settings.panels[Settings.div_names[i]]);
        }

        make_row("guppy_help_table", "left/right arrows", "Move cursor");
        make_row("guppy_help_table", "shift+left/right arrows", "Select region");
        make_row("guppy_help_table", "ctrl+a", "Select all");
        make_row("guppy_help_table", "ctrl+x/c/v", "Cut/copy/paste");
        make_row("guppy_help_table", "ctrl+z/y", "Undo/redo");
        make_row("guppy_help_table", "ctrl+left/right", "Add entry to list or column to matrix");
        make_row("guppy_help_table", "shift+ctrl+left/right", "Add copy of current entry/column to to list/matrix");
        make_row("guppy_help_table", "ctrl+up/down", "Add row to matrix");
        make_row("guppy_help_table", "shift+ctrl+up/down", "Add copy of current row to matrix");
        make_row("guppy_help_table", "ctrl+backspace", "Delete current entry in list or column in matrix");
        make_row("guppy_help_table", "ctrl+shift+backspace", "Delete current row in matrix");

        for (var s in symbols) {
            var latex = Symbols.add_blanks(symbols[s].output.latex, "\\blue{[?]}");
            var row = make_row("guppy_syms_table", s, " ");
            katex.render(latex, row.lastChild);
        }
    };

    String.prototype.splice = function (idx, s) {
        return this.slice(0, idx) + s + this.slice(idx);
    };
    String.prototype.splicen = function (idx, s, n) {
        return this.slice(0, idx) + s + this.slice(idx + n);
    };
    String.prototype.search_at = function (idx, s) {
        return this.substring(idx - s.length, idx) == s;
    };

    /**
     * @class
     * @classdesc The engine for scripting the editor.  To access the
     * engine for scripting a particular Guppy instance, say called
     * `"guppy1"`, do `Guppy("guppy1").engine`.
     *
     * At that point, you can, for example, move that editor's cursor
     * one spot to the left with `Guppy("guppy1").engine.left()`.
    */
    var Engine = function Engine(parent) {
        this.parent = parent;
        this.symbols = {};
        this.events = {};
        this.settings = {};
        this.doc = new Doc();
        this.current = this.doc.root().firstChild;
        this.caret = 0;
        this.space_caret = 0;
        this.sel_start = null;
        this.sel_end = null;
        this.undo_data = [];
        this.undo_now = -1;
        this.sel_status = Engine.SEL_NONE;
        this.checkpoint();
        this.symbols = JSON.parse(JSON.stringify(Symbols.symbols));
    };

    Engine.kb_info = new Keyboard();
    Engine.SEL_NONE = 0;
    Engine.SEL_CURSOR_AT_START = 1;
    Engine.SEL_CURSOR_AT_END = 2;
    Engine.clipboard = null;
    Engine.PAREN_GUESS_OPEN = "paren_guess_open";
    Engine.PAREN_GUESS_CLOSE = "paren_guess_close";
    Engine.PAREN = "paren";

    Engine.prototype.setting = function (name) {
        return name in this.settings ? this.settings[name] : Settings.config.settings[name];
    };

    Engine.prototype.event = function (name) {
        return name in this.events ? this.events[name] : Settings.config.events[name];
    };

    /**
        Get the content of the editor
        @memberof Engine
        @param {string} t - The type of content to render ("latex", "text", or "xml").
    */
    Engine.prototype.get_content = function (t, r) {
        return this.doc.get_content(t, r);
    };

    /**
        Set the XML content of the editor
        @memberof Engine
        @param {string} xml_data - An XML string of the content to place in the editor
    */
    Engine.prototype.set_content = function (xml_data) {
        this.set_doc(new Doc(xml_data));
    };

    /**
        Set the document of the editor
        @memberof Engine
        @param {Doc} doc - The Doc that will be the editor's source
    */
    Engine.prototype.set_doc = function (doc) {
        this.doc = doc;
        this.current = this.doc.root().firstChild;
        this.caret = 0;
        this.sel_start = null;
        this.sel_end = null;
        this.undo_data = [];
        this.undo_now = -1;
        this.sel_status = Engine.SEL_NONE;
        this.checkpoint();
    };

    Engine.prototype.import_text = function (text) {
        this.doc.import_text(text, this.symbols);
        this.set_doc(this.doc);
    };

    Engine.prototype.import_latex = function (text) {
        this.doc.import_latex(text, this.symbols);
        this.set_doc(this.doc);
    };

    Engine.prototype.import_ast = function (ast) {
        this.doc.import_ast(ast, this.symbols);
        this.set_doc(this.doc);
    };

    Engine.prototype.fire_event = function (event, args) {
        args = args || {};
        args.target = this.parent || this;
        args.type = event;
        var ev = this.event(event);
        if (ev) ev(args);
    };

    /**
        Remove a symbol from this instance of the editor.
        @memberof Engine
        @param {string} name - The name of the symbol to remove.
    */
    Engine.prototype.remove_symbol = function (name) {
        if (this.symbols[name]) delete this.symbols[name];
    };

    /**
        Add a symbol to this instance of the editor.
        @memberof Engine
        @param {string} name - param
        @param {Object} symbol - If `template` is present, this is the
        template arguments.  Otherwise, it is a complete specification
        of the symbol, the format for which can be found in the
        documentation for Guppy.add_global_symbol.
        @param {string} [template] - The name of the template to use.
    */
    Engine.prototype.add_symbol = function (name, symbol) {
        this.symbols[name] = symbol;
    };

    Engine.prototype.select_to = function (loc, sel_cursor, sel_caret, mouse) {
        if (loc.current == sel_cursor && loc.caret == sel_caret) {
            this.current = loc.current;
            this.caret = loc.caret;
            this.sel_status = Engine.SEL_NONE;
        } else if (loc.pos == "left") {
            this.sel_end = { "node": sel_cursor, "caret": sel_caret };
            this.current = loc.current;
            this.caret = loc.caret;
            this.set_sel_boundary(Engine.SEL_CURSOR_AT_START, mouse);
        } else if (loc.pos == "right") {
            this.sel_start = { "node": sel_cursor, "caret": sel_caret };
            this.current = loc.current;
            this.caret = loc.caret;
            this.set_sel_boundary(Engine.SEL_CURSOR_AT_END, mouse);
        }
    };

    Engine.prototype.set_sel_start = function () {
        this.sel_start = { "node": this.current, "caret": this.caret };
    };

    Engine.prototype.set_sel_end = function () {
        this.sel_end = { "node": this.current, "caret": this.caret };
    };

    Engine.prototype.add_paths = function (n, path) {
        if (n.nodeName == "e") {
            n.setAttribute("path", path);
        } else {
            var es = 1,
                fs = 1,
                cs = 1,
                ls = 1;
            for (var c = n.firstChild; c != null; c = c.nextSibling) {
                if (c.nodeName == "c") {
                    this.add_paths(c, path + "_c" + cs);cs++;
                } else if (c.nodeName == "f") {
                    this.add_paths(c, path + "_f" + fs);fs++;
                } else if (c.nodeName == "l") {
                    this.add_paths(c, path + "_l" + ls);ls++;
                } else if (c.nodeName == "e") {
                    this.add_paths(c, path + "_e" + es);es++;
                }
            }
        }
    };

    Engine.prototype.add_classes_cursors = function (n) {
        if (n.nodeName == "e") {
            var text = n.firstChild.nodeValue;
            var ans = "";
            var sel_cursor;
            var text_node = Utils.is_text(n);
            if (this.sel_status == Engine.SEL_CURSOR_AT_START) sel_cursor = this.sel_end;
            if (this.sel_status == Engine.SEL_CURSOR_AT_END) sel_cursor = this.sel_start;
            if (this.sel_status != Engine.SEL_NONE) {
                var sel_caret_text = Utils.is_small(sel_cursor.node) ? Utils.SMALL_SEL_CARET : Utils.SEL_CARET;
                if (text.length == 0 && n.parentNode.childElementCount > 1) {
                    sel_caret_text = "\\blue{\\xmlClass{guppy_elt guppy_blank guppy_loc_" + n.getAttribute("path") + "_0}{" + sel_caret_text + "}}";
                } else {
                    sel_caret_text = "\\blue{" + sel_caret_text + "}";
                }
                if (this.sel_status == Engine.SEL_CURSOR_AT_END) sel_caret_text = sel_caret_text + "\\" + Utils.SEL_COLOR + "{";
                if (this.sel_status == Engine.SEL_CURSOR_AT_START) sel_caret_text = "}" + sel_caret_text;
            }
            var caret_text = "";
            var temp_caret_text = "";
            if (text.length == 0) {
                if (n.parentNode.childElementCount == 1) {
                    if (this.current == n) {
                        var blank_caret = this.setting("blank_caret") || (Utils.is_small(this.current) ? Utils.SMALL_CARET : Utils.CARET);
                        ans = "\\red{\\xmlClass{main_cursor guppy_elt guppy_blank guppy_loc_" + n.getAttribute("path") + "_0" + "}{" + blank_caret + "}}";
                    } else {
                        var blank_placeholder = this.setting("blank_placeholder") || "[?]";
                        if (this.temp_cursor.node == n) ans = "\\gray{\\xmlClass{guppy_elt guppy_blank guppy_loc_" + n.getAttribute("path") + "_0" + "}{" + blank_placeholder + "}}";else ans = "\\blue{\\xmlClass{guppy_elt guppy_blank guppy_loc_" + n.getAttribute("path") + "_0" + "}{" + blank_placeholder + "}}";
                    }
                } else if (this.temp_cursor.node != n && this.current != n && (!sel_cursor || sel_cursor.node != n)) {
                    // These are the empty e elements at either end of
                    // a c or m node, such as the space before and
                    // after both the sin and x^2 in sin(x^2)
                    //
                    // Here, we add in a small element so that we can
                    // use the mouse to select these areas
                    ans = "\\phantom{\\xmlClass{guppy_elt guppy_blank guppy_loc_" + n.getAttribute("path") + "_0" + "}{\\hspace{0pt}}}";
                }
            }
            for (var i = 0; i < text.length + 1; i++) {
                if (n == this.current && i == this.caret && (text.length > 0 || n.parentNode.childElementCount > 1)) {
                    caret_text = Utils.is_small(this.current) ? Utils.SMALL_CARET : Utils.CARET;
                    if (text.length == 0) caret_text = "\\red{\\xmlClass{main_cursor guppy_elt guppy_blank guppy_loc_" + n.getAttribute("path") + "_0}{" + caret_text + "}}";else {
                        caret_text = "\\red{\\xmlClass{main_cursor}{" + caret_text + "}}";
                    }
                    if (this.sel_status == Engine.SEL_CURSOR_AT_START) caret_text = caret_text + "\\" + Utils.SEL_COLOR + "{";else if (this.sel_status == Engine.SEL_CURSOR_AT_END) caret_text = "}" + caret_text;
                    ans += caret_text;
                } else if (this.sel_status != Engine.SEL_NONE && sel_cursor.node == n && i == sel_cursor.caret) {
                    ans += sel_caret_text;
                } else if (this.temp_cursor.node == n && i == this.temp_cursor.caret && (text.length > 0 || n.parentNode.childElementCount > 1)) {
                    temp_caret_text = Utils.is_small(this.current) ? Utils.TEMP_SMALL_CARET : Utils.TEMP_CARET;
                    if (text.length == 0) {
                        temp_caret_text = "\\gray{\\xmlClass{guppy_elt guppy_blank guppy_loc_" + n.getAttribute("path") + "_0}{" + temp_caret_text + "}}";
                    } else temp_caret_text = "\\gray{" + temp_caret_text + "}";
                    ans += temp_caret_text;
                }
                if (i < text.length) ans += "\\xmlClass{guppy_elt guppy_loc_" + n.getAttribute("path") + "_" + i + "}{" + text[i] + "}";
            }
            if (text_node && n == this.current) {
                ans = "\\xmlClass{guppy_text_current}{{" + ans + "}}";
            }
            n.setAttribute("render", ans);
            n.removeAttribute("path");
        } else {
            for (var c = n.firstChild; c != null; c = c.nextSibling) {
                if (c.nodeName == "c" || c.nodeName == "l" || c.nodeName == "f" || c.nodeName == "e") {
                    this.add_classes_cursors(c);
                }
            }
        }
    };

    Engine.prototype.remove_cursors_classes = function (n) {
        if (n.nodeName == "e") {
            n.removeAttribute("path");
            n.removeAttribute("render");
            n.removeAttribute("current");
            n.removeAttribute("temp");
        } else {
            for (var c = n.firstChild; c != null; c = c.nextSibling) {
                if (c.nodeType == 1) {
                    this.remove_cursors_classes(c);
                }
            }
        }
    };

    Engine.prototype.down_from_f = function () {
        var nn = this.current.firstChild;
        while (nn != null && nn.nodeName != 'c' && nn.nodeName != 'l') {
            nn = nn.nextSibling;
        }if (nn != null) {
            while (nn.nodeName == 'l') {
                nn = nn.firstChild;
            }this.current = nn.firstChild;
        }
    };

    Engine.prototype.down_from_f_to_blank = function () {
        var nn = this.current.firstChild;
        while (nn != null && !(nn.nodeName == 'c' && nn.children.length == 1 && nn.firstChild.firstChild.nodeValue == "")) {
            nn = nn.nextSibling;
        }
        if (nn != null) {
            //Sanity check:

            while (nn.nodeName == 'l') {
                nn = nn.firstChild;
            }if (nn.nodeName != 'c' || nn.firstChild.nodeName != 'e') {
                this.problem('dfftb');
                return;
            }
            this.current = nn.firstChild;
        } else this.down_from_f();
    };

    Engine.prototype.delete_from_f = function (to_insert) {
        var n = this.current;
        var p = n.parentNode;
        var prev = n.previousSibling;
        var next = n.nextSibling;
        var middle = to_insert || "";
        var new_node = this.make_e(prev.firstChild.textContent + middle + next.firstChild.textContent);
        this.current = new_node;
        this.caret = prev.firstChild.textContent.length;
        p.insertBefore(new_node, prev);
        p.removeChild(prev);
        p.removeChild(n);
        p.removeChild(next);
    };

    Engine.prototype.symbol_to_node = function (sym, content) {
        return Symbols.symbol_to_node(sym, content, this.doc.base);
    };

    Engine.prototype.template_to_node = function (tmpl_name, content, name, tmpl_args) {
        return Symbols.symbol_to_node(Symbols.make_template_symbol(tmpl_name, name, tmpl_args), content, this.doc.base);
    };

    /**
        Insert a symbol into the document at the current cursor position.
        @memberof Engine
        @param {string} sym_name - The name of the symbol to insert.
        Should match one of the keys in the symbols JSON object
    */
    Engine.prototype.insert_symbol = function (sym_name, sym_args) {
        var checkpoint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        var s = sym_args ? Symbols.make_template_symbol(sym_name, sym_args.name, sym_args) : this.symbols[sym_name];
        if (s.attrs && this.is_blacklisted(s.attrs.type)) {
            return false;
        }
        var content = {};
        var left_piece, right_piece;
        var cur = "input" in s ? s.input : 0;
        var to_remove = [];
        var to_replace = null;
        var replace_f = false;
        var sel;

        this.convert_guess_bracket_to_proper();

        if (cur > 0) {
            cur--;
            if (this.sel_status != Engine.SEL_NONE) {
                sel = this.sel_get();
                to_remove = sel.involved;
                left_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(0, this.sel_start.caret));
                right_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(this.sel_start.caret));
                content[cur] = sel.node_list;
            } else if ("input" in s) {
                // If we're at the beginning, then the token is the previous f node
                if (this.caret == 0 && this.current.previousSibling != null) {
                    content[cur] = [this.make_e(""), this.current.previousSibling, this.make_e("")];
                    to_replace = this.current.previousSibling;
                    replace_f = true;
                } else {
                    // look for [0-9.]+|[a-zA-Z] immediately preceeding the caret and use that as token
                    var prev = this.current.firstChild.nodeValue.substring(0, this.caret);
                    var token = prev.charCodeAt(prev.length - 1) > 128 ? prev[prev.length - 1] : prev.match(/[0-9.]+$|[a-zA-Z]$/);
                    if (token != null && token.length > 0) {
                        token = token[0];
                        left_piece = this.make_e(this.current.firstChild.nodeValue.slice(0, this.caret - token.length));
                        right_piece = this.make_e(this.current.firstChild.nodeValue.slice(this.caret));
                        content[cur] = [this.make_e(token)];
                    }
                }
            }
        }
        if (!replace_f && (left_piece == null || right_piece == null)) {
            if (this.sel_status != Engine.SEL_NONE) {
                sel = this.sel_get();
                to_remove = sel.involved;
                left_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(0, this.sel_start.caret));
                right_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(this.sel_start.caret));
                content = "input" in s && s.input < 0 ? [] : [sel.node_list];
            } else {
                left_piece = this.make_e(this.current.firstChild.nodeValue.slice(0, this.caret));
                right_piece = this.make_e(this.current.firstChild.nodeValue.slice(this.caret));
                to_remove = [this.current];
            }
        }

        // By now:
        //
        // content contains whatever we want to pre-populate the 'current' field with (if any)
        //
        // right_piece contains whatever content was in an involved node
        // to the right of the cursor but is not part of the insertion.
        // Analogously for left_piece
        //
        // Thus all we should have to do now is symbol_to_node(sym_type,
        // content) and then add the left_piece, resulting node, and
        // right_piece in that order.
        var sym = this.symbol_to_node(s, content);
        var current_parent = this.current.parentNode;

        var f = sym.f;

        var next = this.current.nextSibling;

        if (replace_f) {
            current_parent.replaceChild(f, to_replace);
        } else {
            if (to_remove.length == 0) this.current.parentNode.removeChild(this.current);

            for (var i = 0; i < to_remove.length; i++) {
                if (next == to_remove[i]) next = next.nextSibling;
                current_parent.removeChild(to_remove[i]);
            }
            current_parent.insertBefore(left_piece, next);
            current_parent.insertBefore(f, next);
            current_parent.insertBefore(right_piece, next);
        }

        this.caret = 0;
        this.current = f;
        if (sym.args.length == 0 || "input" in s && s.input >= sym.args.length) {
            this.current = this.current.nextSibling;
        } else {
            this.down_from_f_to_blank();
            this.caret = this.current.firstChild.textContent.length;
        }

        this.sel_clear();
        if (checkpoint) {
            this.checkpoint();
        }
        return true;
    };

    Engine.prototype.sel_get = function () {
        if (this.sel_status == Engine.SEL_NONE) {
            return null;
        }
        var involved = [];
        var node_list = [];
        var remnant = null;

        if (this.sel_start.node == this.sel_end.node) {
            return { "node_list": [this.make_e(this.sel_start.node.firstChild.nodeValue.substring(this.sel_start.caret, this.sel_end.caret))],
                "remnant": this.make_e(this.sel_start.node.firstChild.nodeValue.substring(0, this.sel_start.caret) + this.sel_end.node.firstChild.nodeValue.substring(this.sel_end.caret)),
                "involved": [this.sel_start.node] };
        }

        node_list.push(this.make_e(this.sel_start.node.firstChild.nodeValue.substring(this.sel_start.caret)));
        involved.push(this.sel_start.node);
        involved.push(this.sel_end.node);
        remnant = this.make_e(this.sel_start.node.firstChild.nodeValue.substring(0, this.sel_start.caret) + this.sel_end.node.firstChild.nodeValue.substring(this.sel_end.caret));
        var n = this.sel_start.node.nextSibling;
        while (n != null && n != this.sel_end.node) {
            involved.push(n);
            node_list.push(n);
            n = n.nextSibling;
        }
        node_list.push(this.make_e(this.sel_end.node.firstChild.nodeValue.substring(0, this.sel_end.caret)));
        return { "node_list": node_list,
            "remnant": remnant,
            "involved": involved,
            "cursor": 0 };
    };

    Engine.prototype.make_e = function (text) {
        var base = this.doc.base;
        var new_node = base.createElement("e");
        new_node.appendChild(base.createTextNode(text));
        return new_node;
    };

    /**
        Insert a string into the document at the current cursor position.
        @memberof Engine
        @param {string} s - The string to insert.
    */
    Engine.prototype.insert_string = function (s) {
        var self = this;
        if (this.sel_status != Engine.SEL_NONE) {
            this.sel_delete();
            this.sel_clear();
        }
        this.convert_guess_bracket_to_proper();
        this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splice(this.caret, s);
        this.caret += s.length;
        this.checkpoint();
        if (this.setting("autoreplace") == "auto") this.check_for_symbol(false);
        if (this.setting("autoreplace") == "whole") this.check_for_symbol(true);
        if (this.setting("autoreplace") == "delay" && setTimeout) {
            if (this.delayed_check) clearTimeout(this.delayed_check);
            this.delayed_check = setTimeout(function () {
                self.check_for_symbol(false);
            }, 200);
        }
    };

    /**
        Insert a copy of the given document into the editor at the current cursor position.
        @memberof Engine
        @param {Doc} doc - The document to insert.
    */
    Engine.prototype.insert_doc = function (doc) {
        this.insert_nodes(doc.root().childNodes, true);
    };

    /**
        Copy the current selection, leaving the document unchanged but
        placing the contents of the current selection on the clipboard.
        @memberof Engine
    */
    Engine.prototype.sel_copy = function () {
        var sel = this.sel_get();
        if (!sel) return;
        Engine.clipboard = [];
        var cliptype = this.setting("cliptype");
        if (cliptype != "none") var clip_doc = new Doc("<m></m>");
        for (var i = 0; i < sel.node_list.length; i++) {
            var node = sel.node_list[i].cloneNode(true);
            Engine.clipboard.push(node);
            if (cliptype != "none") clip_doc.root().appendChild(node.cloneNode(true)); //clip_text += this.doc.manual_render(cliptype, node);
        }
        if (cliptype != "none") {
            try {
                this.system_copy(clip_doc.get_content(cliptype));
            } catch (e) {
                this.system_copy("Syntax error");
            }
        }
        this.sel_clear();
    };

    Engine.prototype.system_copy = function (text) {
        if (window.clipboardData && window.clipboardData.setData) return window.clipboardData.setData("Text", text);else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";
            textarea.style.background = "transparent";
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");
            } catch (ex) {
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    };

    /**
        Cut the current selection, removing it from the document and placing it in the clipboard.
        @memberof Engine
    */
    Engine.prototype.sel_cut = function () {
        var node_list = this.sel_delete();
        if (!node_list) return;
        Engine.clipboard = [];
        var cliptype = this.setting("cliptype");
        var clip_text = "";
        for (var i = 0; i < node_list.length; i++) {
            var node = node_list[i].cloneNode(true);
            Engine.clipboard.push(node);
            if (cliptype != "none") clip_text += this.doc.manual_render(cliptype, node);
        }
        if (cliptype != "none") this.system_copy(clip_text);
        this.sel_clear();
        this.checkpoint();
    };

    Engine.prototype.insert_nodes = function (node_list, move_cursor) {
        var real_clipboard = [];
        for (var i = 0; i < node_list.length; i++) {
            real_clipboard.push(node_list[i].cloneNode(true));
        }

        if (real_clipboard.length == 1) {
            this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.substring(0, this.caret) + real_clipboard[0].firstChild.nodeValue + this.current.firstChild.nodeValue.substring(this.caret);
            if (move_cursor) this.caret += real_clipboard[0].firstChild.nodeValue.length;
        } else {
            var nn = this.make_e(real_clipboard[real_clipboard.length - 1].firstChild.nodeValue + this.current.firstChild.nodeValue.substring(this.caret));
            this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.substring(0, this.caret) + real_clipboard[0].firstChild.nodeValue;
            if (this.current.nextSibling == null) this.current.parentNode.appendChild(nn);else this.current.parentNode.insertBefore(nn, this.current.nextSibling);
            for (var j = 1; j < real_clipboard.length - 1; j++) {
                this.current.parentNode.insertBefore(real_clipboard[j], nn);
            }if (move_cursor) {
                this.current = nn;
                this.caret = real_clipboard[real_clipboard.length - 1].firstChild.nodeValue.length;
            }
        }
    };

    /**
        Paste the current contents of the clipboard.
        @memberof Engine
    */
    Engine.prototype.sel_paste = function () {
        this.sel_delete();
        this.sel_clear();
        if (!Engine.clipboard || Engine.clipboard.length == 0) return;
        this.insert_nodes(Engine.clipboard, true);
        this.checkpoint();
        return;
    };

    /**
        Clear the current selection, leaving the document unchanged and
        nothing selected.
        @memberof Engine
    */
    Engine.prototype.sel_clear = function () {
        this.sel_start = null;
        this.sel_end = null;
        this.sel_status = Engine.SEL_NONE;
    };

    /**
        Delete the current selection.
        @memberof Engine
    */
    Engine.prototype.sel_delete = function () {
        var sel = this.sel_get();
        if (!sel) return null;
        var sel_parent = sel.involved[0].parentNode;
        var sel_prev = sel.involved[0].previousSibling;
        for (var i = 0; i < sel.involved.length; i++) {
            var n = sel.involved[i];
            sel_parent.removeChild(n);
        }
        if (sel_prev == null) {
            if (sel_parent.firstChild == null) sel_parent.appendChild(sel.remnant);else sel_parent.insertBefore(sel.remnant, sel_parent.firstChild);
        } else if (sel_prev.nodeName == 'f') {
            if (sel_prev.nextSibling == null) sel_parent.appendChild(sel.remnant);else sel_parent.insertBefore(sel.remnant, sel_prev.nextSibling);
        }
        this.current = sel.remnant;
        this.caret = this.sel_start.caret;
        return sel.node_list;
    };

    /**
        Select the entire contents of the editor.
        @memberof Engine
    */
    Engine.prototype.sel_all = function () {
        this.home();
        this.set_sel_start();
        this.end();
        this.set_sel_end();
        if (this.sel_start.node != this.sel_end.node || this.sel_start.caret != this.sel_end.caret) this.sel_status = Engine.SEL_CURSOR_AT_END;
    };

    /**
        function
        @memberof Engine
        @param {string} name - param
    */
    Engine.prototype.sel_right = function () {
        if (this.sel_status == Engine.SEL_NONE) {
            this.set_sel_start();
            this.sel_status = Engine.SEL_CURSOR_AT_END;
        }
        if (this.caret >= Utils.get_length(this.current)) {
            var nn = this.current.nextSibling;
            if (nn != null) {
                this.current = nn.nextSibling;
                this.caret = 0;
                this.set_sel_boundary(Engine.SEL_CURSOR_AT_END);
            } else {
                this.set_sel_boundary(Engine.SEL_CURSOR_AT_END);
            }
        } else {
            this.caret += 1;
            this.set_sel_boundary(Engine.SEL_CURSOR_AT_END);
        }
        if (this.sel_start.node == this.sel_end.node && this.sel_start.caret == this.sel_end.caret) {
            this.sel_status = Engine.SEL_NONE;
        }
    };

    Engine.prototype.set_sel_boundary = function (sstatus, mouse) {
        if (this.sel_status == Engine.SEL_NONE || mouse) this.sel_status = sstatus;
        if (this.sel_status == Engine.SEL_CURSOR_AT_START) this.set_sel_start();else if (this.sel_status == Engine.SEL_CURSOR_AT_END) this.set_sel_end();
    };

    /**
        Move the cursor to the left, adjusting the selection along with
        the cursor.
        @memberof Engine
    */
    Engine.prototype.sel_left = function () {
        if (this.sel_status == Engine.SEL_NONE) {
            this.set_sel_end();
            this.sel_status = Engine.SEL_CURSOR_AT_START;
        }
        if (this.caret <= 0) {
            var nn = this.current.previousSibling;
            if (nn != null) {
                this.current = nn.previousSibling;
                this.caret = this.current.firstChild.nodeValue.length;
                this.set_sel_boundary(Engine.SEL_CURSOR_AT_START);
            } else {
                this.set_sel_boundary(Engine.SEL_CURSOR_AT_START);
            }
        } else {
            this.caret -= 1;
            this.set_sel_boundary(Engine.SEL_CURSOR_AT_START);
        }
        if (this.sel_start.node == this.sel_end.node && this.sel_start.caret == this.sel_end.caret) {
            this.sel_status = Engine.SEL_NONE;
        }
    };

    Engine.prototype.list_extend_copy_right = function () {
        this.list_extend("right", true);
    };
    Engine.prototype.list_extend_copy_left = function () {
        this.list_extend("left", true);
    };
    Engine.prototype.list_extend_right = function () {
        this.list_extend("right", false);
    };
    Engine.prototype.list_extend_left = function () {
        this.list_extend("left", false);
    };
    Engine.prototype.list_extend_up = function () {
        this.list_extend("up", false);
    };
    Engine.prototype.list_extend_down = function () {
        this.list_extend("down", false);
    };
    Engine.prototype.list_extend_copy_up = function () {
        this.list_extend("up", true);
    };
    Engine.prototype.list_extend_copy_down = function () {
        this.list_extend("down", true);
    };

    /**
        Move the cursor by one row up or down in a matrix.
        @memberof Engine
        @param {boolean} down - If `true`, move down in the matrix;
        otherwise, up.
    */
    Engine.prototype.list_vertical_move = function (down) {
        var n = this.current;
        while (n.parentNode && n.parentNode.parentNode && !(n.nodeName == 'c' && n.parentNode.nodeName == 'l' && n.parentNode.parentNode.nodeName == 'l')) {
            n = n.parentNode;
        }
        if (!n.parentNode) return;
        var pos = 1;
        var cc = n;
        while (cc.previousSibling != null) {
            pos++;
            cc = cc.previousSibling;
        }
        var new_l = down ? n.parentNode.nextSibling : n.parentNode.previousSibling;
        if (!new_l) return;
        var idx = 1;
        var nn = new_l.firstChild;
        while (idx < pos) {
            idx++;
            nn = nn.nextSibling;
        }
        this.current = nn.firstChild;
        this.caret = down ? 0 : this.current.firstChild.textContent.length;
    };

    /**
        Add an element to a list (or row/column to a matrix) in the
        specified direction.  Can optionally copy the current
        element/row/column to the new one.
        @memberof Engine
        @param {string} direction - One of `"up"`, `"down"`, `"left"`, or
        `"right"`.
        @param {boolean} copy - Whether or not to copy the current
        element/row/column into the new one.
    */
    Engine.prototype.list_extend = function (direction, copy) {
        var base = this.doc.base;
        var vertical = direction == "up" || direction == "down";
        var before = direction == "up" || direction == "left";
        var this_name = vertical ? "l" : "c";
        var n = this.current;
        while (n.parentNode && !(n.nodeName == this_name && n.parentNode.nodeName == 'l')) {
            n = n.parentNode;
        }
        if (!n.parentNode) return;
        var to_insert;

        // check if 2D and horizontal and extend all the other rows if so
        if (!vertical && n.parentNode.parentNode.nodeName == "l") {
            to_insert = base.createElement("c");
            to_insert.appendChild(this.make_e(""));
            var pos = 1;
            var cc = n;
            while (cc.previousSibling != null) {
                pos++;
                cc = cc.previousSibling;
            }
            var to_modify = [];
            var iterator = this.doc.xpath_list("./l/c[position()=" + pos + "]", n.parentNode.parentNode);
            var nn = null;
            try {
                for (nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()) {
                    to_modify.push(nn);
                }
            } catch (e) {
                this.fire_event("error", { "message": 'XML modified during iteration? ' + e });
            }
            for (var j = 0; j < to_modify.length; j++) {
                nn = to_modify[j];
                if (copy) nn.parentNode.insertBefore(nn.cloneNode(true), before ? nn : nn.nextSibling);else nn.parentNode.insertBefore(to_insert.cloneNode(true), before ? nn : nn.nextSibling);
                nn.parentNode.setAttribute("s", parseInt(nn.parentNode.getAttribute("s")) + 1);
            }
            this.sel_clear();
            this.current = before ? n.previousSibling.lastChild : n.nextSibling.firstChild;
            this.caret = this.current.firstChild.textContent.length;
            this.checkpoint();
            return;
        }

        if (copy) {
            to_insert = n.cloneNode(true);
        } else {
            if (vertical) {
                to_insert = base.createElement("l");
                to_insert.setAttribute("s", n.getAttribute("s"));
                for (var i = 0; i < parseInt(n.getAttribute("s")); i++) {
                    var c = base.createElement("c");
                    c.appendChild(this.make_e(""));
                    to_insert.appendChild(c);
                }
            } else {
                to_insert = base.createElement("c");
                to_insert.appendChild(this.make_e(""));
            }
        }
        n.parentNode.setAttribute("s", parseInt(n.parentNode.getAttribute("s")) + 1);
        n.parentNode.insertBefore(to_insert, before ? n : n.nextSibling);
        this.sel_clear();
        if (vertical) this.current = to_insert.firstChild.firstChild;else this.current = to_insert.firstChild;
        this.caret = 0;
        this.checkpoint();
    };

    /**
        Remove the current column from a matrix
        @memberof Engine
    */
    Engine.prototype.list_remove_col = function () {
        var n = this.current;
        while (n.parentNode && n.parentNode.parentNode && !(n.nodeName == 'c' && n.parentNode.nodeName == 'l' && n.parentNode.parentNode.nodeName == 'l')) {
            n = n.parentNode;
        }
        if (!n.parentNode) return;

        // Don't remove if there is only a single column:
        if (n.previousSibling != null) {
            this.current = n.previousSibling.lastChild;
            this.caret = n.previousSibling.lastChild.firstChild.textContent.length;
        } else if (n.nextSibling != null) {
            this.current = n.nextSibling.firstChild;
            this.caret = 0;
        } else return;

        var pos = 1;
        var cc = n;

        // Find position of column
        while (cc.previousSibling != null) {
            pos++;
            cc = cc.previousSibling;
        }
        var to_modify = [];
        var iterator = this.doc.xpath_list("./l/c[position()=" + pos + "]", n.parentNode.parentNode);
        var nn = null;
        try {
            for (nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()) {
                to_modify.push(nn);
            }
        } catch (e) {
            this.fire_event("error", { "message": 'XML modified during iteration? ' + e });
        }
        for (var j = 0; j < to_modify.length; j++) {
            nn = to_modify[j];
            nn.parentNode.setAttribute("s", parseInt(nn.parentNode.getAttribute("s")) - 1);
            nn.parentNode.removeChild(nn);
        }
        this.checkpoint();
    };

    /**
        Remove the current row from a matrix
        @memberof Engine
    */
    Engine.prototype.list_remove_row = function () {
        var n = this.current;
        while (n.parentNode && !(n.nodeName == 'l' && n.parentNode.nodeName == 'l')) {
            n = n.parentNode;
        }
        if (!n.parentNode) return;
        // Don't remove if there is only a single row:
        if (n.previousSibling != null) {
            this.current = n.previousSibling.firstChild.lastChild;
            this.caret = n.previousSibling.lastChild.firstChild.textContent.length;
        } else if (n.nextSibling != null) {
            this.current = n.nextSibling.firstChild.firstChild;
            this.caret = 0;
        } else return;

        n.parentNode.setAttribute("s", parseInt(n.parentNode.getAttribute("s")) - 1);
        n.parentNode.removeChild(n);
        this.checkpoint();
    };

    /**
        Remove the current element from a list (or column from a matrix)
        @memberof Engine
    */
    Engine.prototype.list_remove = function () {
        var n = this.current;
        while (n.parentNode && !(n.nodeName == 'c' && n.parentNode.nodeName == 'l')) {
            n = n.parentNode;
        }
        if (!n.parentNode) return;
        if (n.parentNode.parentNode && n.parentNode.parentNode.nodeName == "l") {
            this.list_remove_col();
            return;
        }
        if (n.previousSibling != null) {
            this.current = n.previousSibling.lastChild;
            this.caret = n.previousSibling.lastChild.firstChild.textContent.length;
        } else if (n.nextSibling != null) {
            this.current = n.nextSibling.firstChild;
            this.caret = 0;
        } else return;
        n.parentNode.setAttribute("s", parseInt(n.parentNode.getAttribute("s")) - 1);
        n.parentNode.removeChild(n);
        this.checkpoint();
    };

    /**
        Simulate the right arrow key press
        @memberof Engine
    */
    Engine.prototype.right = function () {
        this.sel_clear();
        if (this.caret >= Utils.get_length(this.current)) {
            if (!this.jump_to_next_node()) {
                this.fire_event("right_end");
            }
        } else {
            this.caret += 1;
        }
    };

    /**
        Simulate the spacebar key press
        @memberof Engine
    */
    Engine.prototype.spacebar = function () {
        if (Utils.is_text(this.current)) this.insert_string(" ");else this.space_caret = this.caret;
    };

    /**
        Simulate the left arrow key press
        @memberof Engine
    */
    Engine.prototype.left = function () {
        this.sel_clear();
        if (this.caret <= 0) {
            if (!this.jump_to_previous_node()) {
                this.fire_event("left_end");
            }
        } else {
            this.caret -= 1;
        }
    };

    Engine.prototype.delete_from_c = function () {
        var pos = 0;
        var c = this.current.parentNode;
        while (c && c.nodeName == "c") {
            pos++;
            c = c.previousSibling;
        }
        var idx = this.current.parentNode.getAttribute("delete");
        var survivor_node = this.doc.xpath_node("./c[position()=" + idx + "]", this.current.parentNode.parentNode);
        var survivor_nodes = [];
        for (var n = survivor_node.firstChild; n != null; n = n.nextSibling) {
            survivor_nodes.push(n);
        }
        this.current = this.current.parentNode.parentNode;
        this.delete_from_f();
        this.insert_nodes(survivor_nodes, pos > idx);
    };

    Engine.prototype.delete_from_e = function () {
        // return false if we deleted something, and true otherwise.
        if (this.caret > 0) {
            this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splicen(this.caret - 1, "", 1);
            this.caret--;
        } else {
            // The order of these is important
            if (this.current.previousSibling != null && Utils.is_char(this.current.previousSibling)) {
                // The previous node is an f node but is really just a character.  Delete it.
                this.current = this.current.previousSibling;
                this.delete_from_f();
            } else if (this.current.previousSibling != null && this.current.previousSibling.nodeName == 'f') {
                // We're in an e node just after an f node.  Move back into the f node (delete it?)
                this.left();
                return false;
            } else if (this.current.parentNode.previousSibling != null && this.current.parentNode.previousSibling.nodeName == 'c') {
                // We're in a c child of an f node, but not the first one.  Go to the previous c
                if (this.current.parentNode.hasAttribute("delete")) {
                    this.delete_from_c();
                } else {
                    this.left();
                    return false;
                }
            } else if (this.current.previousSibling == null && this.current.parentNode.nodeName == 'c' && (this.current.parentNode.previousSibling == null || this.current.parentNode.previousSibling.nodeName != 'c')) {
                // We're in the first c child of an f node and at the beginning--delete the f node
                var par = this.current.parentNode;
                while (par.parentNode.nodeName == 'l' || par.parentNode.nodeName == 'c') {
                    par = par.parentNode;
                }
                if (par.hasAttribute("delete")) {
                    this.delete_from_c();
                } else {
                    this.current = par.parentNode;
                    this.delete_from_f();
                }
            } else {
                // We're at the beginning (hopefully!)
                return false;
            }
        }
        return true;
    };

    Engine.prototype.delete_forward_from_e = function () {
        // return false if we deleted something, and true otherwise.
        if (this.caret < this.current.firstChild.nodeValue.length) {
            this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splicen(this.caret, "", 1);
        } else {
            //We're at the end
            if (this.current.nextSibling != null) {
                // The next node is an f node.  Delete it.
                this.current = this.current.nextSibling;
                this.delete_from_f();
            } else if (this.current.parentNode.nodeName == 'c') {
                // We're in a c child of an f node.  Do nothing
                return false;
            }
        }
        return true;
    };

    /**
        Simulate the "backspace" key press
        @memberof Engine
    */
    Engine.prototype.backspace = function () {
        if (this.sel_status != Engine.SEL_NONE) {
            this.sel_delete();
            this.sel_status = Engine.SEL_NONE;
            this.checkpoint();
        }
        // Replace paren with guess right bracket
        else if (this.is_right_of_bracket()) {
                var index = this.current.previousSibling.lastChild.childNodes.length - 1;
                var caret_index = Utils.get_length(this.current.previousSibling.lastChild.lastChild);
                this.current = this.current.previousSibling.lastChild.firstChild;
                this.delete_from_e();
                this.insert_opening_bracket();
                this.current = this.current.parentNode.childNodes[index];
                this.caret = caret_index;
                this.checkpoint();
            } else if (this.delete_from_e()) {
                this.checkpoint();
            }
    };

    /**
        Simulate the "delete" key press
        @memberof Engine
    */
    Engine.prototype.delete_key = function () {
        if (this.sel_status != Engine.SEL_NONE) {
            this.sel_delete();
            this.sel_status = Engine.SEL_NONE;
            this.checkpoint();
        } else if (this.delete_forward_from_e()) {
            this.checkpoint();
        }
    };

    Engine.prototype.backslash = function () {
        if (Utils.is_text(this.current)) return;
        this.insert_symbol("sym_name");
    };

    /**
        Simulate a tab key press
        @memberof Engine
    */
    Engine.prototype.tab = function () {
        if (!Utils.is_symbol(this.current)) {
            if (this.check_for_symbol()) return;
        }
        if (Utils.is_utf8entry(this.current)) {
            var codepoint = this.current.firstChild.textContent;
            this.complete_utf8(codepoint);
            return;
        }
        var sym_name = this.current.firstChild.textContent;
        var candidates = [];
        for (var n in this.symbols) {
            if (n.startsWith(sym_name)) candidates.push(n);
        }
        if (candidates.length == 1) {
            this.current.firstChild.textContent = candidates[0];
            this.caret = candidates[0].length;
            this.check_for_symbol();
        } else {
            this.fire_event("completion", { "candidates": candidates });
        }
    };

    /**
        Simulate an up arrow key press
        @memberof Engine
    */
    Engine.prototype.up = function () {
        this.sel_clear();
        if (this.current.parentNode.hasAttribute("up")) {
            var t = parseInt(this.current.parentNode.getAttribute("up"));
            var f = this.current.parentNode.parentNode;
            var n = f.firstChild;
            while (n != null && t > 0) {
                if (n.nodeName == 'c') t--;
                if (t > 0) n = n.nextSibling;
            }
            this.current = n.lastChild;
            this.caret = this.current.firstChild.nodeValue.length;
        } else this.list_vertical_move(false);
    };

    /**
        Simulate a down arrow key press
        @memberof Engine
    */
    Engine.prototype.down = function () {
        this.sel_clear();
        if (this.current.parentNode.hasAttribute("down")) {
            var t = parseInt(this.current.parentNode.getAttribute("down"));
            var f = this.current.parentNode.parentNode;
            var n = f.firstChild;
            while (n != null && t > 0) {
                if (n.nodeName == 'c') t--;
                if (t > 0) n = n.nextSibling;
            }
            this.current = n.lastChild;
            this.caret = this.current.firstChild.nodeValue.length;
        } else this.list_vertical_move(true);
    };

    /**
        Move the cursor to the beginning of the document
        @memberof Engine
    */
    Engine.prototype.home = function () {
        this.current = this.doc.root().firstChild;
        this.caret = 0;
    };

    /**
        Move the cursor to the end of the document
        @memberof Engine
    */
    Engine.prototype.end = function () {
        this.current = this.doc.root().lastChild;
        this.caret = this.current.firstChild.nodeValue.length;
    };

    Engine.prototype.checkpoint = function () {
        this.undo_now++;
        this.undo_data[this.undo_now] = this.get_xml_with_caret();
        this.undo_data.splice(this.undo_now + 1, this.undo_data.length);
        var old_data = this.undo_data[this.undo_now - 1] ? this.convert_xml_to_string(this.undo_data[this.undo_now - 1]) : "[none]";
        var new_data = this.convert_xml_to_string(this.undo_data[this.undo_now]);
        this.fire_event("change", { "old": old_data, "new": new_data });
    };

    Engine.prototype.restore = function (t) {
        this.doc.base = this.undo_data[t].cloneNode(true);
        this.find_current();
        this.current.removeAttribute("current");
        this.current.removeAttribute("caret");
    };

    Engine.prototype.find_current = function () {
        this.current = this.doc.xpath_node("//*[@current='yes']");
        this.caret = parseInt(this.current.getAttribute("caret"));
    };

    Engine.prototype.get_xml_with_caret = function () {
        var base = this.doc.base;
        this.current.setAttribute("current", "yes");
        this.current.setAttribute("caret", this.caret.toString());
        var node = base.cloneNode(true);
        this.current.removeAttribute("current");
        this.current.removeAttribute("caret");

        return node;
    };

    Engine.prototype.convert_xml_to_string = function (xml) {
        return new XMLSerializer().serializeToString(xml);
    };

    /**
        Undo the last action
        @memberof Engine
    */
    Engine.prototype.undo = function () {
        this.sel_clear();
        if (this.undo_now <= 0) return;
        this.undo_now--;
        this.restore(this.undo_now);
        var old_data = this.undo_data[this.undo_now + 1] ? new XMLSerializer().serializeToString(this.undo_data[this.undo_now + 1]) : "[none]";
        var new_data = new XMLSerializer().serializeToString(this.undo_data[this.undo_now]);
        this.fire_event("change", { "old": old_data, "new": new_data });
    };

    /**
        Redo the last undone action
        @memberof Engine
    */
    Engine.prototype.redo = function () {
        this.sel_clear();
        if (this.undo_now >= this.undo_data.length - 1) return;
        this.undo_now++;
        this.restore(this.undo_now);
        var old_data = this.undo_data[this.undo_now - 1] ? new XMLSerializer().serializeToString(this.undo_data[this.undo_now - 1]) : "[none]";
        var new_data = new XMLSerializer().serializeToString(this.undo_data[this.undo_now]);
        this.fire_event("change", { "old": old_data, "new": new_data });
    };

    /**
        Execute the "done" callback
        @memberof Engine
    */
    Engine.prototype.done = function () {
        if (Utils.is_symbol(this.current)) this.complete_symbol();else if (Utils.is_utf8entry(this.current)) {
            var codepoint = this.current.firstChild.textContent;
            this.complete_utf8(codepoint);
        } else this.fire_event("done");
    };

    Engine.prototype.complete_symbol = function () {
        var sym_name = this.current.firstChild.textContent;
        if (!this.symbols[sym_name]) return;
        this.current = this.current.parentNode.parentNode;
        this.delete_from_f();
        this.insert_symbol(sym_name);
    };

    Engine.prototype.complete_utf8 = function (codepoint) {
        codepoint = parseInt('0x' + codepoint);
        this.current = this.current.parentNode.parentNode;
        this.delete_from_f();
        this.insert_utf8(codepoint);
    };

    Engine.prototype.insert_utf8 = function (codepoint) {
        //this.insert_string(c);
        // if((codepoint < 0xffff && Object.values(Engine.kb_info.k_chars).indexOf(c) >= 0) || Utils.is_text(this.current)){
        //     this.insert_string(c);
        // }
        // else{
        //     this.insert_symbol("utf8codepoint",{"name":"UTF8","codepoint":codepoint.toString(16)});
        // }
        if (codepoint <= 0xffff) {
            var c = String.fromCharCode(codepoint);
            this.insert_string(c);
        } else {
            this.insert_symbol("utf8codepoint", { "name": "UTF8", "codepoint": codepoint.toString(16) });
        }
    };

    Engine.prototype.problem = function (message) {
        this.fire_event("error", { "message": message });
    };

    Engine.prototype.is_blacklisted = function (symb_type) {
        var blacklist = this.setting("blacklist");
        for (var i = 0; i < blacklist.length; i++) {
            if (symb_type == blacklist[i]) return true;
        }return false;
    };

    Engine.prototype.check_for_symbol = function (whole_node) {
        var instance = this;
        if (Utils.is_text(this.current)) return false;
        var sym = "";
        var n = null;
        if (whole_node) {
            n = instance.current.firstChild.nodeValue.substring(instance.space_caret, instance.caret);
            var m = /[a-zA-Z_]+$/.exec(n);
            if (m) {
                var s = m[0];
                if (this.symbols[s]) sym = s;
            }
        } else {
            n = instance.current.firstChild.nodeValue.substring(instance.space_caret, instance.caret);
            while (n.length > 0) {
                if (n in this.symbols) {
                    sym = n;
                    break;
                }
                n = n.substring(1);
            }
        }

        if (sym == "") return false;

        var temp = instance.current.firstChild.nodeValue;
        var temp_caret = instance.caret;
        instance.current.firstChild.nodeValue = instance.current.firstChild.nodeValue.slice(0, instance.caret - sym.length) + instance.current.firstChild.nodeValue.slice(instance.caret);
        instance.caret -= sym.length;
        var success = instance.insert_symbol(sym);
        if (!success) {
            instance.current.firstChild.nodeValue = temp;
            instance.caret = temp_caret;
        }
        return success;
    };

    Engine.prototype.jump_to_next_node = function () {
        var nn = this.doc.xpath_node("following::e[1]", this.current);
        if (nn != null) {
            this.current = nn;
            this.caret = 0;
            return true;
        }
        return false;
    };

    Engine.prototype.jump_to_previous_node = function () {
        var pn = this.doc.xpath_node("preceding::e[1]", this.current);
        if (pn != null) {
            this.current = pn;
            this.caret = this.current.firstChild.nodeValue.length;
            return true;
        }
        return false;
    };

    Engine.prototype.is_in_fnode_type = function (type) {
        var fnode = this.current.parentNode.parentNode;
        return fnode.nodeName == "f" && fnode.getAttribute("type") == type;
    };

    // Note KaTeX issue 1844
    // Can not color bracket

    Engine.prototype.insert_opening_bracket = function () {
        if (this.sel_status != Engine.SEL_NONE) {
            this.insert_symbol(Engine.PAREN);
            return;
        }

        // Next to guess opening bracket, move into it
        if (this.is_left_of_guess_open_bracket()) {
            this.right();
        }

        // Select the nodes to the end of the section
        var last_sibling = this.current.parentNode.lastChild;
        this.set_sel_start();
        this.current = last_sibling;
        this.caret = Utils.get_length(last_sibling);
        this.set_sel_end();
        this.sel_status = Engine.SEL_CURSOR_AT_END;

        // Inside an open guess bracket, now the open bracket position is known meaning that the guess bracket has to be replaced
        if (this.is_in_fnode_type(Engine.PAREN_GUESS_OPEN)) {
            this.insert_symbol(Engine.PAREN, null, false);
            var node = this.current.parentNode.parentNode;
            var index = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
            this.current = this.current.parentNode.parentNode.parentNode.firstChild;
            this.caret = 0;
            this.delete_from_e();
            var children = this.current.parentNode.childNodes[index].childNodes;
            for (var i = 0; i < children.length; i++) {
                if (children[i].nodeName == "c") {
                    this.current = children[i].firstChild;
                    break;
                }
            }
            this.caret = 0;
            this.checkpoint();
        }
        // This bracket is not pairing with another bracket, therefore it is safe to insert a closing guess bracket
        else {
                this.insert_symbol(Engine.PAREN_GUESS_CLOSE);
                this.current = this.current.parentNode.firstChild;
                this.caret = 0;
            }
    };

    Engine.prototype.insert_closing_bracket = function () {
        if (this.sel_status != Engine.SEL_NONE) {
            this.insert_symbol(Engine.PAREN);
            return;
        }

        // Next to guess closing bracket, move into it
        if (this.is_right_of_guess_close_bracket()) {
            this.left();
        }

        // Select the nodes to the start of the section
        var first_sibling = this.current.parentNode.firstChild;
        this.set_sel_end();
        this.current = first_sibling;
        this.caret = 0;
        this.set_sel_start();
        this.sel_status = Engine.SEL_CURSOR_AT_START;

        // Inside a close guess bracket, now the close bracket position is known meaning that the guess bracket has to be replaced
        if (this.is_in_fnode_type(Engine.PAREN_GUESS_CLOSE)) {
            this.insert_symbol(Engine.PAREN, null, false);
            this.current = this.current.parentNode.parentNode.parentNode.firstChild;
            this.caret = 0;
            this.delete_from_e();
            this.current = this.current.nextSibling.nextSibling;
            this.caret = 0;
            this.checkpoint();
        }
        // This bracket is not pairing with another bracket, therefore it is safe to insert an opening guess bracket
        else {
                this.insert_symbol(Engine.PAREN_GUESS_OPEN);
                this.current = this.current.parentNode.parentNode.nextSibling;
                this.caret = 0;
            }
    };

    Engine.prototype.is_left_of_guess_open_bracket = function () {
        var next_sibling = this.current.nextSibling;
        return next_sibling && next_sibling.nodeName == "f" && next_sibling.getAttribute("type") == Engine.PAREN_GUESS_OPEN && this.caret == Utils.get_length(this.current);
    };

    Engine.prototype.is_right_of_guess_close_bracket = function () {
        var previous_sibling = this.current.previousSibling;
        return previous_sibling && previous_sibling.nodeName == "f" && previous_sibling.getAttribute("type") == Engine.PAREN_GUESS_CLOSE && this.caret == 0;
    };

    Engine.prototype.is_right_of_bracket = function () {
        var previous_sibling = this.current.previousSibling;
        return previous_sibling && previous_sibling.nodeName == "f" && previous_sibling.getAttribute("type") == Engine.PAREN && this.caret == 0;
    };

    Engine.prototype.convert_guess_bracket_to_proper = function () {
        // Nodes are being inserting after a guess closing bracket, therefore replace it with a proper bracket
        if (this.is_right_of_guess_close_bracket()) {
            this.insert_closing_bracket();
        } else if (this.is_left_of_guess_open_bracket()) {
            this.insert_opening_bracket();
            this.left();
        }
    };

    var mousetrap_min = createCommonjsModule(function (module) {
      /* mousetrap v1.6.1 craig.is/killing/mice */
      (function (r, v, f) {
        function w(a, b, g) {
          a.addEventListener ? a.addEventListener(b, g, !1) : a.attachEvent("on" + b, g);
        }function A(a) {
          if ("keypress" == a.type) {
            var b = String.fromCharCode(a.which);a.shiftKey || (b = b.toLowerCase());return b;
          }return p[a.which] ? p[a.which] : t[a.which] ? t[a.which] : String.fromCharCode(a.which).toLowerCase();
        }function F(a) {
          var b = [];a.shiftKey && b.push("shift");a.altKey && b.push("alt");a.ctrlKey && b.push("ctrl");a.metaKey && b.push("meta");return b;
        }function x(a) {
          return "shift" == a || "ctrl" == a || "alt" == a || "meta" == a;
        }function B(a, b) {
          var g,
              c,
              d,
              f = [];g = a;"+" === g ? g = ["+"] : (g = g.replace(/\+{2}/g, "+plus"), g = g.split("+"));for (d = 0; d < g.length; ++d) {
            c = g[d], C[c] && (c = C[c]), b && "keypress" != b && D[c] && (c = D[c], f.push("shift")), x(c) && f.push(c);
          }g = c;d = b;if (!d) {
            if (!n) {
              n = {};for (var q in p) {
                95 < q && 112 > q || p.hasOwnProperty(q) && (n[p[q]] = q);
              }
            }d = n[g] ? "keydown" : "keypress";
          }"keypress" == d && f.length && (d = "keydown");return { key: c, modifiers: f, action: d };
        }function E(a, b) {
          return null === a || a === v ? !1 : a === b ? !0 : E(a.parentNode, b);
        }function c(a) {
          function b(a) {
            a = a || {};var b = !1,
                l;for (l in n) {
              a[l] ? b = !0 : n[l] = 0;
            }b || (y = !1);
          }function g(a, b, u, e, c, g) {
            var l,
                m,
                k = [],
                f = u.type;if (!h._callbacks[a]) return [];"keyup" == f && x(a) && (b = [a]);for (l = 0; l < h._callbacks[a].length; ++l) {
              if (m = h._callbacks[a][l], (e || !m.seq || n[m.seq] == m.level) && f == m.action) {
                var d;(d = "keypress" == f && !u.metaKey && !u.ctrlKey) || (d = m.modifiers, d = b.sort().join(",") === d.sort().join(","));d && (d = e && m.seq == e && m.level == g, (!e && m.combo == c || d) && h._callbacks[a].splice(l, 1), k.push(m));
              }
            }return k;
          }function f(a, b, c, e) {
            h.stopCallback(b, b.target || b.srcElement, c, e) || !1 !== a(b, c) || (b.preventDefault ? b.preventDefault() : b.returnValue = !1, b.stopPropagation ? b.stopPropagation() : b.cancelBubble = !0);
          }function d(a) {
            "number" !== typeof a.which && (a.which = a.keyCode);var b = A(a);b && ("keyup" == a.type && z === b ? z = !1 : h.handleKey(b, F(a), a));
          }function p(a, c, u, e) {
            function l(c) {
              return function () {
                y = c;++n[a];clearTimeout(r);r = setTimeout(b, 1E3);
              };
            }function g(c) {
              f(u, c, a);"keyup" !== e && (z = A(c));setTimeout(b, 10);
            }for (var d = n[a] = 0; d < c.length; ++d) {
              var m = d + 1 === c.length ? g : l(e || B(c[d + 1]).action);q(c[d], m, e, a, d);
            }
          }function q(a, b, c, e, d) {
            h._directMap[a + ":" + c] = b;a = a.replace(/\s+/g, " ");var f = a.split(" ");1 < f.length ? p(a, f, b, c) : (c = B(a, c), h._callbacks[c.key] = h._callbacks[c.key] || [], g(c.key, c.modifiers, { type: c.action }, e, a, d), h._callbacks[c.key][e ? "unshift" : "push"]({ callback: b, modifiers: c.modifiers, action: c.action, seq: e, level: d, combo: a }));
          }var h = this;a = a || v;if (!(h instanceof c)) return new c(a);h.target = a;h._callbacks = {};h._directMap = {};var n = {},
              r,
              z = !1,
              t = !1,
              y = !1;h._handleKey = function (a, c, d) {
            var e = g(a, c, d),
                k;c = {};var h = 0,
                l = !1;for (k = 0; k < e.length; ++k) {
              e[k].seq && (h = Math.max(h, e[k].level));
            }for (k = 0; k < e.length; ++k) {
              e[k].seq ? e[k].level == h && (l = !0, c[e[k].seq] = 1, f(e[k].callback, d, e[k].combo, e[k].seq)) : l || f(e[k].callback, d, e[k].combo);
            }e = "keypress" == d.type && t;d.type != y || x(a) || e || b(c);t = l && "keydown" == d.type;
          };h._bindMultiple = function (a, b, c) {
            for (var d = 0; d < a.length; ++d) {
              q(a[d], b, c);
            }
          };w(a, "keypress", d);w(a, "keydown", d);w(a, "keyup", d);
        }if (r) {
          var p = { 8: "backspace", 9: "tab", 13: "enter", 16: "shift", 17: "ctrl",
            18: "alt", 20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home", 37: "left", 38: "up", 39: "right", 40: "down", 45: "ins", 46: "del", 91: "meta", 93: "meta", 224: "meta" },
              t = { 106: "*", 107: "+", 109: "-", 110: ".", 111: "/", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'" },
              D = { "~": "`", "!": "1", "@": "2", "#": "3", $: "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0", _: "-", "+": "=", ":": ";", '"': "'", "<": ",", ">": ".", "?": "/", "|": "\\" },
              C = { option: "alt", command: "meta", "return": "enter",
            escape: "esc", plus: "+", mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl" },
              n;for (f = 1; 20 > f; ++f) {
            p[111 + f] = "f" + f;
          }for (f = 0; 9 >= f; ++f) {
            p[f + 96] = f.toString();
          }c.prototype.bind = function (a, b, c) {
            a = a instanceof Array ? a : [a];this._bindMultiple.call(this, a, b, c);return this;
          };c.prototype.unbind = function (a, b) {
            return this.bind.call(this, a, function () {}, b);
          };c.prototype.trigger = function (a, b) {
            if (this._directMap[a + ":" + b]) this._directMap[a + ":" + b]({}, a);return this;
          };c.prototype.reset = function () {
            this._callbacks = {};
            this._directMap = {};return this;
          };c.prototype.stopCallback = function (a, b) {
            return -1 < (" " + b.className + " ").indexOf(" mousetrap ") || E(b, this.target) ? !1 : "INPUT" == b.tagName || "SELECT" == b.tagName || "TEXTAREA" == b.tagName || b.isContentEditable;
          };c.prototype.handleKey = function () {
            return this._handleKey.apply(this, arguments);
          };c.addKeycodes = function (a) {
            for (var b in a) {
              a.hasOwnProperty(b) && (p[b] = a[b]);
            }n = null;
          };c.init = function () {
            var a = c(v),
                b;for (b in a) {
              "_" !== b.charAt(0) && (c[b] = function (b) {
                return function () {
                  return a[b].apply(a, arguments);
                };
              }(b));
            }
          };c.init();r.Mousetrap = c;module.exports && (module.exports = c);    }
      })("undefined" !== typeof window ? window : null, "undefined" !== typeof window ? document : null);
    });

    /**
       @class
       @classdesc An instance of Guppy.  Calling `Guppy(id)` with the ID of
       an existing editor will simply return that instance.
       @param {string|Node} element - The string id or the Dom Node of the
       element that should be converted to an editor.
       @constructor
    */
    var Guppy = function Guppy(el) {

        if (!Guppy.initialised) Guppy.init();
        // Get the element and try to get its corresponding instance and settings
        var element = typeof el === 'string' ? document.getElementById(el) : el;
        var instance = Guppy.instances.get(element);
        if (instance) {
            return instance;
        }
        var self = this;

        // Store a record of this instance in case somebody wants it again
        Guppy.instances.set(element, this);

        var tab_idx = Guppy.max_tabIndex || 0;
        element.tabIndex = tab_idx;
        Guppy.max_tabIndex = tab_idx + 1;

        this.editor_active = true;
        //this.empty_content = settings['empty_content'] || "\\red{[?]}"
        this.editor = element;
        this.blacklist = [];
        this.autoreplace = true;

        /**   @member {Engine} */
        this.engine = new Engine(self);
        this.temp_cursor = { "node": null, "caret": 0 };
        this.editor.addEventListener("keydown", Guppy.key_down, false);
        this.editor.addEventListener("keyup", Guppy.key_up, false);
        this.editor.addEventListener("focus", function () {
            Guppy.kb.alt_down = false;
        }, false);
        if (!Settings.config.settings["buttons"]) this.configure("buttons", ["settings", "controls", "symbols"]);else this.set_buttons();
        this.render(true);
        this.deactivate();
        this.recompute_locations_paths();
    };

    Guppy.prototype.set_buttons = function () {
        var buttons = this.engine.setting('buttons');
        var self = this;
        if (!buttons || buttons.length == 0) return;

        // Remove old button div if applicable
        if (this.buttons_div) {
            this.buttons_div.parentElement.removeChild(this.buttons_div);
            delete this.buttons_div;
        }

        this.buttons_div = document.createElement("div");
        this.buttons_div.setAttribute("class", "guppy_buttons");
        if (buttons) {
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i] == "osk" && Settings.osk) {
                    Guppy.make_button("keyboard", this.buttons_div, function () {
                        if (Settings.osk.guppy == self) {
                            Settings.osk.detach(self);
                        } else {
                            Settings.osk.attach(self);
                        }
                    });
                } else if (buttons[i] == "settings") Guppy.make_button("settings", this.buttons_div, function () {
                    Settings.toggle("settings", self);
                });else if (buttons[i] == "symbols") Guppy.make_button("symbols", this.buttons_div, function () {
                    Settings.toggle("symbols", self);
                });else if (buttons[i] == "controls") Guppy.make_button("help", this.buttons_div, function () {
                    Settings.toggle("controls", self);
                });
            }
        }
    };

    Guppy.instances = new Map();
    Guppy.Doc = Doc;
    Guppy.active_guppy = null;
    Guppy.Symbols = Symbols;
    Guppy.Mousetrap = mousetrap_min;
    Guppy.katex = katex;

    Guppy.raw_input_target = null;
    Guppy.raw_input = document.createElement("input");
    Guppy.raw_input.setAttribute("type", "text");
    Guppy.raw_input.setAttribute("class", "guppy-raw");
    Guppy.raw_input.style = "position:absolute;top:0;left:0;display:none;";
    Guppy.raw_input.addEventListener("keyup", function (e) {
        var g = Guppy.raw_input_target;
        if (!g) return;
        if (e.keyCode == 13) {
            // enter
            g.activate();
            var s = Guppy.raw_input.value;
            s = s.normalize();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = s[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var c = _step.value;

                    g.engine.insert_utf8(c.codePointAt(0));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            Guppy.raw_input.value = "";
            Guppy.raw_input.style.display = "none";
            g.render(true);
            Guppy.hide_raw_input();
            g.engine.fire_event("focus", { "focused": true });
        } else if (e.keyCode == 27) {
            // esc
            Guppy.hide_raw_input();
            g.engine.fire_event("focus", { "focused": true });
        }
    });

    Guppy.get_raw_input = function () {
        var g = Guppy.active_guppy;
        if (!g) return;
        Guppy.raw_input_target = g;
        var r = g.editor.getElementsByClassName("cursor")[0].getBoundingClientRect();
        var height = r.bottom - r.top;
        Guppy.raw_input.style.top = r.bottom + document.documentElement.scrollTop - height / 2 + "px";
        Guppy.raw_input.style.left = r.left + document.documentElement.scrollLeft + "px";
        Guppy.raw_input.style.display = "block";
        Guppy.raw_input.focus();
        if (Guppy.OSK) Guppy.OSK.detach();
    };

    Guppy.hide_raw_input = function () {
        Guppy.raw_input_target = null;
        Guppy.raw_input.style.display = "none";
    };

    Guppy.make_button = function (cls, parent, cb) {
        var b = document.createElement("div");
        b.setAttribute("class", "guppy-button " + cls);
        parent.appendChild(b);
        if (cb) {
            b.addEventListener("mouseup", function (e) {
                cb(e);
                if (e.cancelBubble != null) e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                e.preventDefault();
                return false;
            }, false);
        }
        return b;
    };

    /**
        Add a symbol to all instances of the editor
        @memberof Guppy
        @param {string} name - The name of the symbol to add.  This is
        also the string that will be autoreplaced with the symbol.
        @param {Object} symbol - If `template` is present, this is just
        the template arguments.  Otherwise, it is the complete symbol
        specification
        @param {Object} symbol.output - Key/value pairs where the key is
        the output type (such as "latex" or "asciimath") and the value is
        the string by which the output will be rendered in that format.
        In this string, {$n} will be substituted with the rendering of the
        nth argument.  If the nth argument is a d-dimensional list, then
        the argument should be specified as {$n{sep_1}{sep_2}...{sep_d}}
        where sep_i will be the separator used to separate entries in the
        ith dimension.  Note that keys are not necessary to describe the
        AST or plain-text outputs.
        @param {Array} symbol.keys - A list of strings representing
        keystrokes that can be used to trigger the insertion of this
        symbol.  For example, `"^" or `"shift+up"` for the `exponential`
        symbol.
        @param {Object} symbol.attrs - A specification of the attributes
        of the symbol
        @param {string} symbol.attrs.type - A longer description of the
        symbol type, suitable for searching and text rendering.
        @param {string} symbol.attrs.group - The group in which to place
        this symbol (for OSK)
        @param {Object} [symbol.input] - If the symbol should subsume part
        of the existing content of the editor (as in, for example, the
        case of exponent), this object will contain the (1-based) index of
        the argument in which that content should be placed.
        @param {Object} [symbol.ast] - Modifies the default construction
        of an entry in the AST for this symbol.
        @param {Object} [symbol.ast.type="operator"] - The type of symbol
        for AST purposes.  Can be "name" (meaning this symbol represents
        a variable, as in the case of pi), "number" (meaning this symbol
        is a literal value), "operator" (meaning this symbol is a
        function or otherwise takes arguments (as in cos or +), or
        "pass" (meaning this symbol's first argument will be used as its
        AST entry, as in the case of brackets/parentheses).
        @param {Object[]} [symbol.args] - A list of specifications, one
        for each argument
        @param {string} [symbol.args.down] - The index of the argument
        to jump to when the "down" arrow is pressed in this argument
        @param {string} [symbol.args.up] - The index of the argument
        to jump to when the "up" arrow is pressed in this argument
        @param {string} [symbol.args.small="no"] - "yes" if the symbol is
        small (as in an exponent)
        @param {string} [symbol.args.name] - The name of this particular
        argument (suitable for searching)
        @param {string} [symbol.args.bracket="no"] - "yes" if brackets
        should automatically be rendered around this argument when they
        might be needed to disambiguate.
        @param {string} [symbol.args.delete] - If present, when the
        "backspace" key is pressed at the beginning of this argument,
        the symbol will be deleted and replaced with the argument whose
        index is specified in this parameter.  For example, the second
        argument of an exponent has this value set to "1", so that when
        the exponent is deleted, the base remains.
        @param {string} [symbol.args.mode="math"] - Change the mode of an
        argument.  Can be "text" (meaning the argument will be editable
        as and rendered as plain text), "symbol" (meaning the argument
        will specify a symbol name and will complete to an actual symbol
        when this is entered--only used for the backslash symbol), or
        "math" (the default)
        @param {string} [symbol.args.is_bracket="no"] - Set to "yes" if
        the symbol is itself a bracket/parenthesis equivalent.
        @param {string} [template] - The name of the template to use
    */
    Guppy.add_global_symbol = function (name, symbol, template) {
        if (template) {
            symbol = Symbols.make_template_symbol(template, name, symbol);
        }
        Symbols.symbols[name] = JSON.parse(JSON.stringify(symbol));
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Guppy.instances[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _step2$value = slicedToArray(_step2.value, 2),
                    instance = _step2$value[1];

                instance.engine.symbols[name] = JSON.parse(JSON.stringify(symbol));
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    };

    /**
        Add a template symbol to all instances of the editor
        @memberof Guppy
        @param {string} name - The name of the template to add. 
        @param {Object} template - A template dictionary. This is the same
        as a symbol dictionary, but it can have parameters of the form
        {$myparam} as a substring of any dictionary value, which will be
        replaced with the parameter's value when generating symbols from
        this template.
    */
    Guppy.add_template = function (name, template) {
        Symbols.templates[name] = JSON.parse(JSON.stringify(template));
    };

    /**
        Remove a symbol from all instances of the editor
        @memberof Guppy
        @param {string} name - The name of the symbol to remove
    */
    Guppy.remove_global_symbol = function (name) {
        if (Symbols.symbols[name]) {
            delete Symbols.symbols[name];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = Guppy.instances[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _step3$value = slicedToArray(_step3.value, 2),
                        instance = _step3$value[1];

                    if (instance.engine.symbols[name]) {
                        delete instance.engine.symbols[name];
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    };

    /**
       @param {string} name - The name of the setting to configure.  Can be "xml_content", "autoreplace", "blank_caret", "empty_content", "blacklist", "buttons", or "cliptype"
       @param {Object} val - The value associated with the named setting: 
          * "xml_content": An XML string with which to initialise the editor's state. (Defaults to "<m><e/></m>".)
          * "autoreplace": A string describing how to autoreplace typed text with symbols: 
            * "auto" (default): Replace symbls greedily
            * "whole": Replace only entire tokens
            * "delay": Same as "whole", but with 200ms delay before replacement
          * "blank_caret": A LaTeX string that specifies what the caret should look like when in a blank spot.  If `""`, the default caret is used.
          * "empty_content": A LaTeX string that will be displayed when the editor is both inactive and contains no content. (Defaults to "\color{red}{[?]}")
          * "blacklist": A list of string symbol names, corresponding to symbols that should not be allowed in this instance of the editor.
          * "buttons": A list of strings corresponding to the helper buttons that should be displayed in the editor; should be a subset of ["osk","settings","symbols","controls"]]
          * "cliptype": A string describing what gets placed on the system clipboard when content is copied from the editor.
            * "text": Use plain-text editor content
            * "latex": Use LaTeX rendering of editor content
    */
    Guppy.configure = function (name, val) {
        if (name in Settings.settings_options && Settings.settings_options[name].indexOf(val) == -1) {
            throw "Valid values for " + name + " are " + JSON.stringify(Settings.settings_options[name]);
        }
        Settings.config.settings[name] = val;
    };

    /**
       @param {string} name - The name of the setting to configure.  Can be "xml_content", "autoreplace", "blank_caret", "empty_content", "blacklist", "buttons", or "cliptype"
       @param {Object} val - The value associated with the named setting: 
          "xml_content": An XML string with which to initialise the editor's state. (Defaults to "<m><e/></m>".)
          "autoreplace": A string describing how to autoreplace typed text with symbols: 
             "auto" (default): Replace symbls greedily
             "whole": Replace only entire tokens
             "delay": Same as "whole", but with 200ms delay before replacement
          "blank_caret": A LaTeX string that specifies what the caret should look like when in a blank spot.  If `""`, the default caret is used.
          "empty_content": A LaTeX string that will be displayed when the editor is both inactive and contains no content. (Defaults to "\color{red}{[?]}")
          "blacklist": A list of string symbol names, corresponding to symbols that should not be allowed in this instance of the editor.
          "buttons": A list of strings corresponding to the helper buttons that should be displayed in the editor; should be a subset of ["osk","settings","symbols","controls"]]
          "cliptype": A string describing what gets placed on the system clipboard when content is copied from the editor.
             "text": Use plain-text editor content
             "latex": Use LaTeX rendering of editor content
    */
    Guppy.prototype.configure = function (name, val) {
        if (name in Settings.settings_options && Settings.settings_options[name].indexOf(val) == -1) {
            throw "Valid values for " + name + " are " + JSON.stringify(Settings.config.options[name]);
        }
        this.engine.settings[name] = val;
        if (name == 'buttons') this.set_buttons();
        this.render(true);
    };

    /**
        Render all guppy documents on the page.
        @param {string} type - The type of content to render
        @param {string} [delim] - The string to delimit mathematical symbols
        @param {string} [root_node] - The DOM Element object within which to do the rendering
        @memberof Guppy
    */
    Guppy.render_all = function (t, delim, root_node) {
        if (!Guppy.initialised) Guppy.init();
        Doc.render_all(t, delim, root_node);
    };

    /**
       @param {string} name - The name of an event.  Can be: 
         * change - Called when the editor's content changes.  Argument will be a dictionary with keys `old` and `new` containing the old and new documents, respectively.
         * left_end - Called when the cursor is at the left-most point and a command is received to move the cursor to the left (e.g., via the left arrow key).  Argument will be null.
         * right_end - Called when the cursor is at the right-most point and a command is received to move the cursor to the right (e.g., via the right arrow key).  Argument will be null.
         * done - Called when the enter key is pressed in the editor.
         * completion - Called when the editor outputs tab completion options.  Argument is a dictionary with the key `candidates`, a list of the options for tab-completion.
         * debug - Called when the editor outputs some debug information. Argument is a dictionary with the key `message`.
         * error - Called when the editor receives an error.  Argument is a dictionary with the key `message`.
         * focus - Called when the editor is focused or unfocused. Argument will have a single key `focused` which will be `true` or `false` according to whether the editor is newly focused or newly unfocused (respectively).
       @param {function} handler - The function that will be called to handle the given event
    */
    Guppy.prototype.event = function (name, handler) {
        if (Settings.config.valid_events.indexOf(name) == -1) {
            throw "Valid events are " + JSON.stringify(Settings.config.valid_events);
        }
        if (name == "focus" && Settings.osk) {
            var f = Settings.config.events["focus"];
            this.engine.events["focus"] = function (e) {
                f(e);
                handler(e);
                if (e.focused) Settings.osk.attach(e.target);else Settings.osk.detach(e.target);
            };
        } else {
            this.engine.events[name] = handler;
        }
    };

    /**
       @param {string} name - The name of an event.  Can be: 
         * change - Called when the editor's content changes.  Argument will be a dictionary with keys `old` and `new` containing the old and new documents, respectively.
         * left_end - Called when the cursor is at the left-most point and a command is received to move the cursor to the left (e.g., via the left arrow key).  Argument will be null.
         * right_end - Called when the cursor is at the right-most point and a command is received to move the cursor to the right (e.g., via the right arrow key).  Argument will be null.
         * done - Called when the enter key is pressed in the editor.
         * completion - Called when the editor outputs tab completion options.  Argument is a dictionary with the key `candidates`, a list of the options for tab-completion.
         * debug - Called when the editor outputs some debug information. Argument is a dictionary with the key `message`.
         * error - Called when the editor receives an error.  Argument is a dictionary with the key `message`.
         * focus - Called when the editor is focused or unfocused. Argument will have a single key `focused` which will be `true` or `false` according to whether the editor is newly focused or newly unfocused (respectively).
       @param {function} handler - The function that will be called to handle the given event
    */
    Guppy.event = function (name, handler) {
        if (Settings.config.valid_events.indexOf(name) == -1) {
            throw "Valid events are " + JSON.stringify(Settings.config.valid_events);
        }
        if (name == "focus" && Settings.osk) {
            Settings.config.events["focus"] = function (e) {
                handler(e);
                if (e.focused) Settings.osk.attach(e.target);else Settings.osk.detach(e.target);
            };
        } else {
            Settings.config.events[name] = handler;
        }
    };

    /**
       @param {GuppyOSK} [osk] - A GuppyOSK object to use for the on-screen keyboard if one is desired
    */
    Guppy.use_osk = function (osk) {
        Guppy.OSK = osk;
        Settings.osk = osk;
        if (osk.config.attach == "focus") {
            var f = Settings.config.events["focus"];
            Settings.config.events["focus"] = function (e) {
                if (f) f(e);
                if (e.focused) osk.attach(e.target);else osk.detach(e.target);
            };
        }
    };

    Guppy.prototype.is_changed = function () {
        var bb = this.editor.getElementsByClassName("katex")[0];
        if (!bb) return;
        var rect = bb.getBoundingClientRect();
        var ans = null;
        if (this.bounding_box) ans = this.bounding_box.top != rect.top || this.bounding_box.bottom != rect.bottom || this.bounding_box.right != rect.right || this.bounding_box.left != rect.left;else ans = true;
        this.bounding_box = rect;
        return ans;
    };

    Guppy.prototype.recompute_locations_paths = function () {
        var ans = [];
        var bb = this.editor.getElementsByClassName("katex")[0];
        if (!bb) return;
        var rect = bb.getBoundingClientRect();
        ans.push({ 'path': 'all',
            'top': rect.top,
            'bottom': rect.bottom,
            'left': rect.left,
            'right': rect.right });
        var elts = this.editor.getElementsByClassName("guppy_elt");
        for (var i = 0; i < elts.length; i++) {
            var elt = elts[i];
            if (elt.nodeName == "mstyle") continue;
            rect = elt.getBoundingClientRect();
            if (rect.top == 0 && rect.bottom == 0 && rect.left == 0 && rect.right == 0) continue;
            var cl = elt.classList;
            for (var j = 0; j < cl.length; j++) {
                if (cl[j].indexOf("guppy_loc") == 0) {
                    ans.push({ 'path': cl[j],
                        'top': rect.top,
                        'bottom': rect.bottom,
                        'left': rect.left,
                        'right': rect.right,
                        'mid_x': (rect.left + rect.right) / 2,
                        'mid_y': (rect.bottom + rect.top) / 2,
                        'blank': (' ' + elt.className + ' ').indexOf(' guppy_blank ') >= 0 });
                    break;
                }
            }
        }
        this.boxes = ans;
    };

    Guppy.get_loc = function (x, y, current_node, current_caret) {
        var g = Guppy.active_guppy;
        var min_dist = -1;
        var mid_dist = 0;
        var pos = "";
        var opt = null;
        var cur = null;
        var car = null;
        // check if we go to first or last element
        var bb = g.editor.getElementsByClassName("katex")[0];
        if (!bb) return;
        if (current_node) {
            var current_path = Utils.path_to(current_node);
            var current_pos = parseInt(current_path.substring(current_path.lastIndexOf("e") + 1));
        }

        var boxes = g.boxes;
        if (!boxes) return;
        if (current_node) {
            current_path = current_path.replace(/e[0-9]+$/, "e");
            var boxes2 = [];
            for (var i = 0; i < boxes.length; i++) {
                if (boxes[i].path == "all") continue;
                var loc = boxes[i].path.substring(0, boxes[i].path.lastIndexOf("_"));
                loc = loc.replace(/e[0-9]+$/, "e");
                if (loc == current_path) {
                    boxes2.push(boxes[i]);
                }
            }
            boxes = boxes2;
        }
        if (!boxes) return;
        for (var j = 0; j < boxes.length; j++) {
            var box = boxes[j];
            if (box.path == "all") {
                if (!opt) opt = { 'path': 'guppy_loc_m_e1_0' };
                continue;
            }
            var xdist = Math.max(box.left - x, x - box.right, 0);
            var ydist = Math.max(box.top - y, y - box.bottom, 0);
            var dist = Math.sqrt(xdist * xdist + ydist * ydist);
            if (min_dist == -1 || dist < min_dist) {
                min_dist = dist;
                mid_dist = x - box.mid_x;
                opt = box;
            }
        }
        loc = opt.path.substring("guppy_loc".length);
        loc = loc.replace(/_/g, "/");
        loc = loc.replace(/([0-9]+)(?=.*?\/)/g, "[$1]");
        cur = g.engine.doc.xpath_node(loc.substring(0, loc.lastIndexOf("/")), g.engine.doc.root());
        car = parseInt(loc.substring(loc.lastIndexOf("/") + 1));
        // Check if we want the cursor before or after the element
        if (mid_dist > 0 && !opt.blank) {
            car++;
        }
        var ans = { "current": cur, "caret": car, "pos": pos };
        if (current_node && opt) {
            var opt_pos = parseInt(opt.path.substring(opt.path.lastIndexOf("e") + 1, opt.path.lastIndexOf("_")));
            if (opt_pos < current_pos) pos = "left";else if (opt_pos > current_pos) pos = "right";else if (car < current_caret) pos = "left";else if (car > current_caret) pos = "right";
            if (pos) ans['pos'] = pos;else ans['pos'] = "none";
        }
        return ans;
    };

    Guppy.mouse_up = function () {
        Guppy.kb.is_mouse_down = false;
        var g = Guppy.active_guppy;
        if (g) g.render(true);
    };

    Guppy.touch_start = function (e) {
        var touchobj = e.changedTouches[0];
        var n = touchobj.target;
        while (n != null) {
            var instance = Guppy.instances.get(n);
            if (instance) {
                e.preventDefault();
                var prev_active = Guppy.active_guppy;
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = Guppy.instances[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var _step4$value = slicedToArray(_step4.value, 2),
                            element = _step4$value[0],
                            gup = _step4$value[1];

                        if (element !== n) gup.deactivate();else gup.activate();
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }

                var g = Guppy.active_guppy;
                var b = Guppy.active_guppy.engine;
                g.space_caret = 0;
                if (prev_active == g) {
                    var loc = Guppy.get_loc(touchobj.clientX, touchobj.clientY);
                    if (!loc) return;
                    b.current = loc.current;
                    b.caret = loc.caret;
                    b.sel_status = Engine.SEL_NONE;
                    g.render(true);
                }
                return;
            }
            if (n.classList && n.classList.contains("guppy_osk")) {
                return;
            }
            n = n.parentNode;
        }
    };

    Guppy.touch_move = function (e) {
        var touchobj = e.changedTouches[0];
        var g = Guppy.active_guppy;
        if (!g) return;
        var n = touchobj.target;
        while (n != null) {
            var instance = Guppy.instances.get(n);
            if (instance == g) {
                g.select_to(touchobj.clientX, touchobj.clientY, true);
                g.render(g.is_changed());
            }
            n = n.parentNode;
        }
    };

    Guppy.mouse_down = function (e) {
        if (e.target.getAttribute("class") == "guppy-button") return;
        var n = e.target;
        Guppy.kb.is_mouse_down = true;
        while (n != null) {
            var instance = Guppy.instances.get(n);
            if (instance) {
                e.preventDefault();
                var prev_active = Guppy.active_guppy;
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = Guppy.instances[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var _step5$value = slicedToArray(_step5.value, 2),
                            element = _step5$value[0],
                            gup = _step5$value[1];

                        if (element !== n) gup.deactivate();else gup.activate();
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }

                var g = Guppy.active_guppy;
                var b = Guppy.active_guppy.engine;
                g.space_caret = 0;
                if (prev_active == g) {
                    if (e.shiftKey) {
                        g.select_to(e.clientX, e.clientY, true);
                    } else {
                        var loc = Guppy.get_loc(e.clientX, e.clientY);
                        if (!loc) return;
                        b.current = loc.current;
                        b.caret = loc.caret;
                        b.sel_status = Engine.SEL_NONE;
                    }
                    g.render(true);
                }
                return;
            }
            if (n.classList && n.classList.contains("guppy_osk")) {
                return;
            }
            n = n.parentNode;
        }
        Guppy.active_guppy = null;
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = Guppy.instances[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var _step6$value = slicedToArray(_step6.value, 2),
                    gup2 = _step6$value[1];

                gup2.deactivate();
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }
    };

    Guppy.mouse_move = function (e) {
        var g = Guppy.active_guppy;
        if (!g) return;
        if (!Guppy.kb.is_mouse_down) {
            var bb = g.editor;
            var rect = bb.getBoundingClientRect();
            if (e.clientX < rect.left || e.clientX > rect.right || e.clientY > rect.bottom || e.clientY < rect.top) {
                g.temp_cursor = { "node": null, "caret": 0 };
            } else {
                var loc = Guppy.get_loc(e.clientX, e.clientY);
                if (!loc) return;
                g.temp_cursor = { "node": loc.current, "caret": loc.caret };
            }
            g.render(g.is_changed());
        } else {
            g.select_to(e.clientX, e.clientY, true);
            g.render(g.is_changed());
        }
    };

    Guppy.prototype.select_to = function (x, y, mouse) {
        var sel_caret = this.engine.caret;
        var sel_cursor = this.engine.current;
        if (this.engine.sel_status == Engine.SEL_CURSOR_AT_START) {
            sel_cursor = this.engine.sel_end.node;
            sel_caret = this.engine.sel_end.caret;
        } else if (this.engine.sel_status == Engine.SEL_CURSOR_AT_END) {
            sel_cursor = this.engine.sel_start.node;
            sel_caret = this.engine.sel_start.caret;
        }
        var loc = Guppy.get_loc(x, y, sel_cursor, sel_caret);
        if (!loc) return;
        this.engine.select_to(loc, sel_cursor, sel_caret, mouse);
    };

    window.addEventListener("touchstart", Guppy.touch_start, true);
    window.addEventListener("touchmove", Guppy.touch_move, true);
    window.addEventListener("mousedown", Guppy.mouse_down, true);
    window.addEventListener("mouseup", Guppy.mouse_up, true);
    window.addEventListener("mousemove", Guppy.mouse_move, false);

    Guppy.prototype.render_node = function (t) {
        // All the interesting work is done by transform.  This function just adds in the cursor and selection-start cursor
        var output = "";
        if (t == "render") {
            var root = this.engine.doc.root();
            this.engine.add_paths(root, "m");
            this.engine.temp_cursor = this.temp_cursor;
            this.engine.add_classes_cursors(root);
            this.engine.current.setAttribute("current", "yes");
            if (this.temp_cursor.node) this.temp_cursor.node.setAttribute("temp", "yes");
            output = this.engine.get_content("latex", true);
            this.engine.remove_cursors_classes(root);
            output = output.replace(new RegExp('&amp;', 'g'), '&');
            return output;
        } else {
            output = this.engine.get_content(t);
        }
        return output;
    };

    /**
        Render the document
        @memberof Guppy
        @param {boolean} [updated=false] - Whether there have been visible
        changes to the document (i.e. that affect the positions of
        elements)
    */
    Guppy.prototype.render = function (updated) {
        if (!this.editor_active && this.engine.doc.is_blank()) {
            katex.render(this.engine.setting("empty_content"), this.editor);
            if (this.buttons_div) this.editor.appendChild(this.buttons_div);
            return;
        }
        var tex = this.render_node("render");
        katex.render(tex, this.editor);
        if (this.buttons_div) this.editor.appendChild(this.buttons_div);
        if (updated) {
            this.recompute_locations_paths();
        }
    };

    /**
        Get the content of the editor as LaTeX
        @memberof Guppy
    */
    Guppy.prototype.latex = function () {
        return this.engine.get_content("latex");
    };

    /**
        Get the content of the editor as XML
        @memberof Guppy
    */
    Guppy.prototype.xml = function () {
        return this.engine.get_content("xml");
    };

    /**
        Get the content of the editor as a syntax tree, serialised using JSON
        @memberof Guppy
    */
    Guppy.prototype.syntax_tree = function () {
        return this.engine.get_content("ast");
    };

    /**
        Get the content of the editor as a list of equations, serialised
        using JSON.  For example, `x < y = z` will be returned as `[["<", [["var", "x"], ["var", "y"]]],["=", [["var", "y"], ["var", "z"]]]]
        @memberof Guppy
    */
    Guppy.prototype.equations = function () {
        return this.engine.get_content("eqns");
    };

    /**
        Get the content of the editor in a parseable text format.
        @memberof Guppy
    */
    Guppy.prototype.text = function () {
        return this.engine.get_content("text");
    };

    /**
        Get the content of the editor in AsciiMath.
        @memberof Guppy
    */
    Guppy.prototype.asciimath = function () {
        return this.engine.get_content("asciimath");
    };

    /**
        Get the Doc object representing the editor's contents.
        @memberof Guppy
    */
    Guppy.prototype.doc = function () {
        return this.engine.doc;
    };

    /**
        Get the content of the editor as a Javascript function, with
        user-supplied interpretations of the various symbols.  If not
        supplied, default interpretations will be given for the following
        symbols: `*,+,/,-,^,sqrt,sin,cos,tan,log`
        @param {Object} [evaluators] - An object with a key for each
        possible symbol type ("exponential", "integral", etc.)
        whose values are functions.  These functions take in a single
        argument, `args`, which is an array of that symbol's arguments,
        and should return a function that takes in an object argument
        `vars`.  In this inner function, to compute e.g. the sum of the
        first and second arguments, you would do
        `args[0](vars)+args[1](vars)`.  This function should return the
        result of that symbol's operation.
        @returns {function(Object)} - Returns a function that takes in an
        object with a key for each variable in the expression and whose
        values are the values that will be passed in for those variables.
        In addition, this function is augmented with a `vars` member which
        is a list of the variables that appear in the expression.
        @memberof Guppy
    */
    Guppy.prototype.func = function (evaluators) {
        var res = this.engine.get_content("function", evaluators);
        var f = res['function'];
        f.vars = res.vars;
        return f;
    };

    /**
        Recursively evaluate the syntax tree of the editor's contents using specified functions.
        @param {Object} [evaluators] - An object with a key for each
        possible symbol type ("exponential", "integral", etc.)
        whose values are functions that will be applied whenever that
        symbol is encountered in the syntax tree.  These functions take a
        single argument, `args`, which is a list of the results of
        evaluating that symbol's arguments.
        @returns - Whatever the `evaluators` function for the root symbol
        in the syntax tree returns.
        @memberof Guppy
    */
    Guppy.prototype.evaluate = function (evaluators) {
        return this.engine.doc.evaluate(evaluators);
    };

    /**
        Get a list of the symbols used in the document, in order of
        appearance, with each kind of symbol appearing only once.  For
        example, a document representing `sin(x^3)+sqrt(x^2+x)` will
        have symbols `["sin","exponential","square_root"]`.
        @param {String[]} [groups] - A list of the groups whose symbols
        may be included in the output.  If absent, all symbols in the
        document will be returned.
        @memberof Guppy
    */
    Guppy.prototype.symbols_used = function (groups) {
        return this.engine.doc.get_symbols(groups);
    };

    /**
        Get a list of the variable names used in the document.
        @memberof Guppy
    */
    Guppy.prototype.vars = function () {
        return this.engine.get_content("function").vars;
    };

    /**
        Set the content of the document from text in the format outputted by `guppy.text()`.
        @param {String} text - A string representing the document to import.
        @memberof Guppy
    */
    Guppy.prototype.import_text = function (text) {
        return this.engine.import_text(text);
    };

    /**
        Set the content of the document from input text in "semantic
        LaTeX" format.  That is, all functions are represented as
        `\funcname{arg1}{arg2}`.  For example,
        `\defintegral{1}{2}{x^2}{x}`.
        @param {String} text - A string representing the document to import.
        @memberof Guppy
    */
    Guppy.prototype.import_latex = function (text) {
        return this.engine.import_latex(text);
    };

    /**
        Set the content of the document from XML in the format outputted
        by `guppy.xml()`.
        @param {String} xml - An XML string representing the document to
        import.
        @memberof Guppy
    */
    Guppy.prototype.import_xml = function (xml) {
        return this.engine.set_content(xml);
    };

    /**
        Import a syntax tree from a JSON object formatted as outputted by `guppy.syntax_tree()`.
        @param {Object} tree - A JSON object representing the syntax tree to import.
        @memberof Guppy
    */
    Guppy.prototype.import_syntax_tree = function (tree) {
        return this.engine.import_ast(tree);
    };

    /**
        Focus this instance of the editor
        @memberof Guppy
    */
    Guppy.prototype.activate = function () {
        var newly_active = !this.editor_active;
        Guppy.active_guppy = this;
        this.editor_active = true;
        this.editor.className = this.editor.className.replace(new RegExp('(\\s|^)guppy_inactive(\\s|$)'), ' guppy_active ');
        this.editor.focus();
        this.render(true);
        if (newly_active) {
            this.engine.fire_event("focus", { "focused": true });
        }
        if (Guppy.raw_input_target == this) {
            Guppy.hide_raw_input();
        }
    };

    /**
        Unfocus this instance of the editor
        @memberof Guppy
    */
    Guppy.prototype.deactivate = function () {
        var newly_inactive = this.editor_active;
        this.editor_active = false;
        var r1 = new RegExp('(?:\\s|^)guppy_active(?:\\s|$)');
        var r2 = new RegExp('(?:\\s|^)guppy_inactive(?:\\s|$)');
        if (this.editor.className.match(r1)) {
            this.editor.className = this.editor.className.replace(r1, ' guppy_inactive ');
        } else if (!this.editor.className.match(r2)) {
            this.editor.className += ' guppy_inactive ';
        }
        Guppy.kb.shift_down = false;
        Guppy.kb.ctrl_down = false;
        Guppy.kb.alt_down = false;
        Settings.hide_all();
        Guppy.hide_raw_input();
        if (newly_inactive) {
            this.render();
            this.engine.fire_event("focus", { "focused": false });
        }
    };

    // Keyboard stuff

    Guppy.kb = new Keyboard();

    Guppy.register_keyboard_handlers = function () {
        mousetrap_min.addKeycodes({ 173: '-' }); // Firefox's special minus (needed for _ = sub binding)
        var i, name;
        // Pull symbol shortcuts from Symbols:
        for (name in Symbols.symbols) {
            var s = Symbols.symbols[name];
            if (s.keys) for (i = 0; i < s.keys.length; i++) {
                Guppy.kb.k_syms[s.keys[i]] = s.attrs.type;
            }
        }
        for (i in Guppy.kb.k_chars) {
            mousetrap_min.bind(i, function (i) {
                return function () {
                    if (!Guppy.active_guppy) return true;
                    Guppy.active_guppy.temp_cursor.node = null;
                    if (Utils.is_text(Guppy.active_guppy.engine.current) && Guppy.kb.k_text[i]) {
                        Guppy.active_guppy.engine.insert_string(Guppy.kb.k_text[i]);
                    } else {
                        Guppy.active_guppy.engine.insert_string(Guppy.kb.k_chars[i]);
                    }
                    Guppy.active_guppy.render(true);
                    return false;
                };
            }(i));
        }for (i in Guppy.kb.k_syms) {
            mousetrap_min.bind(i, function (i) {
                return function () {
                    if (!Guppy.active_guppy) return true;
                    Guppy.active_guppy.temp_cursor.node = null;
                    // We always want to skip using this symbol insertion if
                    // we are in text mode, and additionally we want only to
                    // insert the corresponding text if there is an overriding
                    // text representation in Guppy.kb.k_text
                    if (Utils.is_text(Guppy.active_guppy.engine.current)) {
                        if (Guppy.kb.k_text[i]) Guppy.active_guppy.engine.insert_string(Guppy.kb.k_text[i]);
                    } else {
                        Guppy.active_guppy.engine.space_caret = 0;
                        //Guppy.active_guppy.engine.insert_symbol(Guppy.kb.k_syms[i]);
                        Guppy.active_guppy.engine.insert_symbol(Symbols.lookup_type(Guppy.kb.k_syms[i]));
                    }
                    Guppy.active_guppy.render(true);
                    return false;
                };
            }(i));
        }for (i in Guppy.kb.k_controls) {
            mousetrap_min.bind(i, function (i) {
                return function () {
                    if (!Guppy.active_guppy) return true;
                    // We want to skip using this control sequence only if there is an overriding text representation in Guppy.kb.k_text
                    if (Utils.is_text(Guppy.active_guppy.engine.current) && Guppy.kb.k_text[i]) {
                        Guppy.active_guppy.engine.insert_string(Guppy.kb.k_text[i]);
                    } else {
                        Guppy.active_guppy.engine.space_caret = 0;
                        Guppy.active_guppy.engine[Guppy.kb.k_controls[i]]();
                        Guppy.active_guppy.temp_cursor.node = null;
                    }
                    Guppy.active_guppy.render(["up", "down", "right", "left", "home", "end", "sel_left", "sel_right"].indexOf(i) < 0);
                    //Guppy.active_guppy.render(false);
                    return false;
                };
            }(i));
        }for (i in Guppy.kb.k_text) {
            if (!(Guppy.kb.k_chars[i] || Guppy.kb.k_syms[i] || Guppy.kb.k_controls[i])) {
                mousetrap_min.bind(i, function (i) {
                    return function () {
                        if (!Guppy.active_guppy) return true;
                        Guppy.active_guppy.temp_cursor.node = null;
                        if (Utils.is_text(Guppy.active_guppy.engine.current)) {
                            Guppy.active_guppy.engine.insert_string(Guppy.kb.k_text[i]);
                        }
                        Guppy.active_guppy.render(true);
                        return false;
                    };
                }(i));
            }
        }
        mousetrap_min.bind(Guppy.kb.k_raw, function () {
            if (!Guppy.active_guppy) return true;
            Guppy.get_raw_input();
            return false;
        });
    };

    Guppy.initialised = false;

    Guppy.init = function () {
        if (Guppy.initialised) return;
        Settings.init(Symbols.symbols);
        Guppy.register_keyboard_handlers();
        document.body.appendChild(Guppy.raw_input);
        Guppy.initialised = true;
    };

    return Guppy;

}());

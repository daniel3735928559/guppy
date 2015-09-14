// var CARET = "\\color{red}{\\cdot}"
// var SEL_CARET = "\\color{blue}{\\cdot}"
var CARET = "\\color{red}{\\rule[-0.5ex]{0em}{0.7em}}"
var SMALL_CARET = "\\color{red}{\\rule[0em]{0em}{0.3em}}"
var SEL_CARET = "\\color{blue}{\\rule[-0.5ex]{0em}{0.7em}}"
var SMALL_SEL_CARET = "\\color{blue}{\\rule[0em]{0em}{0.3em}}"
var SEL_COLOR = "red"
var CURRENT_BLANK = "\\color{red}{[?]}"
var BLANK = "\\color{blue}{[?]}"
var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;
var RPAREN = 48;
var BACKSPACE = 8;
var ENTER = 13;
var HOME = 36;
var END = 35;
var shift_down = false;
var ctrl_down = false;
var alt_down = false;

var k_syms = [];
var sk_syms = []

var k_chars = [];
var sk_chars = [];

k_chars[107] = "+";
k_chars[108] = "-";
k_chars[109] = "*";
k_chars[110] = ".";
k_chars[111] = "/";

//Chrome

k_chars[187] = "=";
k_chars[188] = ",";
k_chars[189] = "-";
k_chars[190] = ".";
sk_chars[191] = "/";

// Firefox

k_chars[61] = "=";
k_chars[173] = "-";

k_syms[219] = "sqbrack";

sk_chars[61] = "+"; // Firefox
sk_chars[187] = "+"; // Chrome
sk_chars[49] = "!";

k_syms[191] = "slash";

sk_syms[54] = "exp";
sk_syms[56] = "*";
sk_syms[57] = "paren";
sk_syms[188] = "angle";
sk_syms[173] = "sub";
sk_syms[189] = "sub";
sk_syms[219] = "curlbrack";
sk_syms[220] = "abs";

var symbols = {
    "norm":
    {"output":{
        "latex":["||",1,"||"],
        "calc":["norm(",1,")"]},
     "current":0,
     "type":"norm"},
    
    "abs":
    {"output":{
        "latex":["\\left|",1,"\\right|"],
	"calc":["abs(",1,")"]},
     "current":0,
     "type":"absolute_value"},
    
    "sqrt":
    {"output":{
        "latex":["\\sqrt{",1,"}"],
        "calc":["sqrt(",1,")"]},
     "current":0,
     "type":"square_root"},
    
    "paren":
    {"output":{
        "latex":["\\left(",1,"\\right)"],
	"calc":["(",1,")"]},
     "current":1,
     "type":"bracket",
     "attrs":{
	 "is_bracket":["yes"]}
    },

    "floor":
    {"output":{
        "latex":["\\lfloor",1,"\\rfloor"],
	"calc":["floor(",1,")"]},
     "current":0,
     "type":"floor"},
    
    "exp":
    {"output":{
        "latex":["{",1,"}^{",2,"}"],
	"calc":["(",1,")^(",2,")"]},
     "current":1,
     "type":"exponenial",
     "current_type":"token",
     "attrs":{
	 "up":[2,0],
	 "down":[0,1],
	 "bracket":["yes",0],
	 "size":[0,"s"],
	 "name":["base","exponent"]}
    },
    
    "sub":
    {"output":{
        "latex":["{",1,"}_{",2,"}"],
	"calc":[1,"",2]},
     "current":1,
     "type":"subscript",
     "current_type":"token",
     "attrs":{
	 "up":[0,1],
	 "down":[2,0],
	 "bracket":["yes",0],
	 "size":[0,"s"]}
    },
    
    "frac":
    {"output":{
        "latex":["\\dfrac{",1,"}{",2,"}"],
	"calc":["(",1,")/(",2,")"]},
     "current":0,
     "type":"fraction",
     "attrs":{
	 "up":[1,1],
	 "down":[2,2],
	 "name":["numerator","denominator"]}
    },
    
    "slash":
    {"output":{
        "latex":["\\dfrac{",1,"}{",2,"}"],
	"calc":["(",1,")/(",2,")"]},
     "current":1,
     "current_type":"token",
     "type":"fraction",
     "attrs":{
	 "up":[1,1],
	 "down":[2,2],
	 "name":["numerator","denominator"]}
    },
    
    "int":
    {"output":{
        "latex":["\\displaystyle\\int{",1,"}d",2],
	"calc":["integrate(",1,",",2,")"]},
     "current":0,
     "type":"indefinite_integral",
     "attrs":{
	 "bracket":[0,"yes"],
	 "name":["integrand","variable"]}
    },
    
    "defi":
    {"output":{
        "latex":["\\displaystyle\\int_{",1,"}^{",2,"}",3,"d",4],
	"calc":["integrate(",3,",",4,",",1,",",2,")"]},
     "current":0,
     "type":"definite_integral",
     "attrs":{
	 "up":[2,2,2,2],
	 "down":[1,1,1,1],
	 "bracket":[0,0,0,"yes"],
	 "size":["s","s",0,0],
	 "name":["integrand","variable","lower_limit","upper_limit"]}
    },
    
    "smi":
    {"output":{
        "latex":["\\int{",1,"}d",2],
	"calc":["integrate(",1,",",2,")"]},
     "current":0,
     "type":"indefinite_integral",
     "attrs":{
	 "bracket":[0,"yes"],
	 "name":["integrand","variable"]}
    },
    
    "smd":
    {"output":{
        "latex":["\\int_{",1,"}^{",2,"}",3,"d",4],
	"calc":["integrate(",3,",",4,",",1,",",2,")"]},
     "current":0,
     "type":"definite_integral",
     "attrs":{
	 "up":[2,2,2,2],
	 "down":[1,1,1,1],
	 "bracket":[0,0,0,"yes"],
	 "size":["s","s",0,0],
	 "name":["integrand","variable","lower_limit","upper_limit"]}
    },
    
    "diff":
    {"output":{
        "latex":["\\frac{d}{d",1,"}",2],
	"calc":["diff(",2,",",1,")"]},
     "current":0,
     "type":"derivative",
     "attrs":{
	 "up":[2,2],
	 "down":[1,1],
	 "bracket":["yes","yes"],
	 "name":["function","variable"]}
    },
    
    "deriv":
    {"output":{
        "latex":["\\frac{d}{d",1,"}",2],
	"calc":["diff(",2,",",1,")"]},
     "current":0,
     "type":"derivative",
     "attrs":{
	 "up":[2,2],
	 "down":[1,1],
	 "bracket":["yes","yes"],
	 "name":["function","variable"]}
    },
    
    "sum":
    {"output":{
        "latex":["\\displaystyle\\sum_{",1,"}^{",2,"}",3],
	"calc":["sum(",3,",",1,",",2,")"]},
     "current":0,
     "type":"summation",
     "attrs":{
	 "up":[2,2,2],
	 "down":[1,1,1],
	 "bracket":[0,0,"yes"],
	 "name":["lower_limit","upper_limit","summand"]}
    }
}

function is_blacklisted(symb_type){
    for(var i = 0; i < active_guppy.type_blacklist.length; i++)
	if(symb_type == active_guppy.type_blacklist[i]) return true;
    return false;
}

function symb_raw(symb_name,latex_symb,calc_symb){
    symbols[symb_name] = {"output":{"latex":[latex_symb],
				    "calc":[calc_symb]},"char":true}
}

function symb_func(func_name){
    symbols[func_name] = {"output":{"latex":["\\"+func_name+"\\left(",1,"\\right)"],
				    "calc":[func_name+"(",1,")"]}}
}

symb_raw("*","\\cdot ","*");
symb_raw("pi","{\\pi}"," PI ");
symb_func("sin");
symb_func("cos");
symb_func("tan");
symb_func("sec");
symb_func("csc");
symb_func("cot");
symb_func("log");
symb_func("ln");

function key_up(e){
    var keycode = e.keyCode;
    if(keycode == 18) alt_down = false;
    else if(keycode == 17) ctrl_down = false;
    else if(keycode == 16) shift_down = false;
}
function key_down(e){
    if(active_guppy == null){
	console.log("INACTIVE");
	return;
    }
    var keycode = e.keyCode;
    if(ctrl_down){
	if(keycode == 67){ e.returnValue = false; e.preventDefault(); active_guppy.sel_copy(); }
	if(keycode == 86){ e.returnValue = false; e.preventDefault(); active_guppy.sel_paste(); }
	if(keycode == 88){ e.returnValue = false; e.preventDefault(); active_guppy.sel_cut(); }
	if(keycode == 89){ e.returnValue = false; e.preventDefault(); active_guppy.redo(); }
	if(keycode == 90){ e.returnValue = false; e.preventDefault(); active_guppy.undo(); }
    }
    else if(shift_down){
	e.returnValue = false; e.preventDefault(); 
	console.log(e.keyCode,e.srcElement);
	if(keycode == UP){ active_guppy.insert_symbol(active_guppy.current,active_guppy.caret,"exp"); }
	else if(keycode == DOWN){ active_guppy.insert_symbol(active_guppy.current,active_guppy.caret,"sub"); }
	else if(keycode == LEFT){ active_guppy.sel_left(); }
	else if(keycode == RIGHT){ active_guppy.sel_right(); }
	else if(keycode == RPAREN){ console.log("RP"); active_guppy.right_paren(); }
	else if(keycode in sk_chars){ active_guppy.node_insert(sk_chars[keycode]); }
	else if(keycode in sk_syms){ active_guppy.insert_symbol(active_guppy.current,active_guppy.caret,sk_syms[keycode]); }
	else if(65 <= e.keyCode && e.keyCode <= 90){ active_guppy.node_insert(String.fromCharCode(e.keyCode)); }
    }
    else if(!alt_down){
	e.returnValue = false; e.preventDefault(); 
	console.log(e.keyCode,e.srcElement);
	if(keycode == UP){ e.returnValue = false; e.preventDefault(); active_guppy.up(); }
	else if(keycode == DOWN){ e.returnValue = false; e.preventDefault(); active_guppy.down(); }
	else if(keycode == LEFT){ e.returnValue = false; e.preventDefault(); active_guppy.left(); }
	else if(keycode == RIGHT){ e.returnValue = false; e.preventDefault(); active_guppy.right(); }
	else if(keycode == HOME){ e.returnValue = false; e.preventDefault(); active_guppy.home(); }
	else if(keycode == END){ e.returnValue = false; e.preventDefault(); active_guppy.end(); }
	else if(keycode == BACKSPACE){ e.returnValue = false; e.preventDefault(); console.log("AA"); active_guppy.backspace(); }
	else if(keycode == 16) shift_down = true;
	else if(keycode == 17) ctrl_down = true;
	else if(keycode == 18) alt_down = true;
	else if(keycode in k_chars){ active_guppy.node_insert(k_chars[keycode]); }
	else if(keycode in k_syms){ active_guppy.insert_symbol(active_guppy.current,active_guppy.caret,k_syms[keycode]); }
	else if((65 <= e.keyCode && e.keyCode <= 90) || (48 <= e.keyCode && e.keyCode <= 57)){
	    var ch = String.fromCharCode(e.keyCode).toLowerCase();
	    active_guppy.node_insert(ch);
	}
    }
    for(var s in symbols){
	// console.log(current);
	if(active_guppy.current.nodeName == 'e' && !guppy_is_blank(active_guppy.current) && active_guppy.current.firstChild.nodeValue.search_at(active_guppy.caret,s)){
	    //console.log("INSERTION OF ",s);
	    //console.log(current.nodeValue);
	    var temp = active_guppy.current.firstChild.nodeValue;
	    var temp_caret = active_guppy.caret;
	    active_guppy.current.firstChild.nodeValue = active_guppy.current.firstChild.nodeValue.slice(0,active_guppy.caret-s.length)+active_guppy.current.firstChild.nodeValue.slice(active_guppy.caret);
	    //console.log(current.nodeValue);
	    active_guppy.caret -= s.length;
	    var success = active_guppy.insert_symbol(active_guppy.current,active_guppy.caret,s);
	    if(!success){
		active_guppy.current.firstChild.nodeValue = temp;
		active_guppy.caret = temp_caret;
	    }
	    break;
	}
    }
    active_guppy.render();
}

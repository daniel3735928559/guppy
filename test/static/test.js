var covered_functions = {};
var tests = [
    {
	"description":"Ready",
	"content":"none",
	"type":"asciimath",
	"expected":"READY",
	"run":function(g){}
    },
    {
	"description":"Done",
	"type":"asciimath",
	"expected":"DONE",
	"run":function(g){
	    do_keys(['enter']);
	}
    },
    {
	"description":"Basic",
	"content":"<m><e>x+1</e></m>",
	"type":"asciimath",
	"expected":"+1",
	"run":function(g){
	    do_keys(['right','backspace']);
	}
    },
    {
	"description":"Basic undo",
	"type":"text",
	"expected":"(x * y)",
	"run":function(g){
	    do_keys(['x','y','z','mod+z']);
	}
    },
    {
	"description":"Basic redo",
	"type":"text",
	"expected":"((x * y) * z)",
	"run":function(g){
	    do_keys(['x','y','z','mod+z','mod+y']);
	}
    },
    {
	"description":"nop undo",
	"content":"<m><e>xy</e></m>",
	"type":"text",
	"expected":"(x * y)",
	"run":function(g){
	    do_keys(['mod+z']);
	}
    },
    {
	"description":"nop redo",
	"content":"<m><e>xy</e></m>",
	"type":"text",
	"expected":"(x * y)",
	"run":function(g){
	    do_keys(['mod+z','mod+y']);
	}
    },
    {
	"description":"Sine",
	"type":"text",
	"expected":"sin(x)",
	"run":function(g){
	    do_keys(['s','i','n','x']);
	}
    },
    {
	"description":"Sine undo",
	"type":"asciimath",
	"expected":"sin",
	"run":function(g){
	    do_keys(['s','i','n','mod+z']);
	}
    },
    {
	"description":"Exponent undo",
	"type":"text",
	"expected":"(2 * x)",
	"run":function(g){
	    do_keys(['2','x','^','mod+z']);
	}
    },
    {
	"description":"Basic select delete",
	"content":"<m><e>x+1</e></m>",
	"type":"text",
	"expected":"1",
	"run":function(g){
	    do_keys(['shift+right','shift+right','backspace']);
	}
    },
    {
	"description":"Basic select replace",
	"content":"<m><e>x+1</e></m>",
	"type":"text",
	"expected":"(a * 1)",
	"run":function(g){
	    do_keys(['shift+right','shift+right','a']);
	}
    },
    {
	"description":"Basic select left",
	"content":"<m><e>x+1</e></m>",
	"type":"text",
	"expected":"(a + 1)",
	"run":function(g){
	    do_keys(['right','shift+left','a']);
	}
    },
    {
	"description":"Basic cut/paste",
	"content":"<m><e>x+1</e></m>",
	"type":"asciimath",
	"expected":"1x+",
	"run":function(g){
	    do_keys(['shift+right','shift+right','mod+x','right','mod+v']);
	}
    },
    {
	"description":"Basic copy/paste",
	"content":"<m><e>x+1</e></m>",
	"type":"asciimath",
	"expected":"x+1x+",
	"run":function(g){
	    do_keys(['shift+right','shift+right','mod+c','right','mod+v']);
	}
    },
    {
	"description":"f-char delete",
	"type":"asciimath",
	"expected":"(2)^(x)",
	"run":function(g){
	    do_keys(['2','^','x','p','i','backspace']);
	}
    },
    {
	"description":"f-char cut/paste",
	"content":'<m><e></e><f type="sin" group="functions"><b p="latex">\\sin\\left(<r ref="1"/>\\right)</b><b p="asciimath"> sin(<r ref="1"/>)</b><c delete="1"><e>x</e></c></f><e>+</e><f group="greek" char="yes" type="pi"><b p="latex">\\pi</b><b p="asciimath"> pi </b></f><e>+</e><f type="cos" group="functions"><b p="latex">\\cos\\left(<r ref="1"/>\\right)</b><b p="asciimath"> cos(<r ref="1"/>)</b><c delete="1"><e>x</e></c></f><e></e></m>',
	"type":"text",
	"expected":"((sin(x) + cos(x)) + pi)",
	"run":function(g){
	    do_keys(['right','right','right','shift+right','shift+right','mod+x','right','right','right','right','mod+v']);
	}
    },
    {
	"description":"matrix add row",
	"type":"asciimath",
	"expected":"matrix(1;2)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+down','2']);
	}
    },
    {
	"description":"matrix copy row",
	"type":"asciimath",
	"expected":"matrix(1;1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+down']);
	}
    },
    {
	"description":"matrix add col",
	"type":"asciimath",
	"expected":"matrix(1,2)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+right','2']);
	}
    },
    {
	"description":"matrix copy col",
	"type":"asciimath",
	"expected":"matrix(1,1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+right']);
	}
    },
    {
	"description":"2x2 matrix",
	"type":"asciimath",
	"expected":"matrix(1,2;(x)^(2),3)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+right','2','mod+down','right','3','left','left','x','^','2']);
	}
    },
    {
	"description":"2x2 matrix delete col",
	"type":"asciimath",
	"expected":"matrix(2;3)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+right','2','mod+down','right','3','left','left','x','^','2','mod+backspace']);
	}
    },
    {
	"description":"2x2 matrix delete row",
	"type":"asciimath",
	"expected":"matrix(1,2)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+right','2','mod+down','right','3','left','left','x','^','2','mod+shift+backspace']);
	}
    },
    {
	"description":"matrix extend up",
	"type":"asciimath",
	"expected":"matrix(2;1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+up','2']);
	}
    },
    {
	"description":"matrix extend left",
	"type":"asciimath",
	"expected":"matrix(2,1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+left','2']);
	}
    },
    {
	"description":"matrix copy up",
	"type":"asciimath",
	"expected":"matrix(21;1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+up','2']);
	}
    },
    {
	"description":"matrix copy up move",
	"type":"asciimath",
	"expected":"matrix(1;21)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+up','down','2']);
	}
    },
    {
	"description":"matrix copy left",
	"type":"asciimath",
	"expected":"matrix(12,1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+left','2']);
	}
    },
    {
	"description":"matrix copy left undo",
	"type":"asciimath",
	"expected":"matrix(1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+left','mod+z']);
	}
    },
    {
	"description":"sel all delete",
	"type":"asciimath",
	"expected":"",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+up','down','x','^','2','+','mod+a','backspace']);
	}
    },
    {
	"description":"whole autoreplace",
	"type":"asciimath",
	"expected":"xsin* sin(x)",
	"run":function(g){
	    g.engine.settings.autoreplace="whole";
	    do_keys(['x','s','i','n','*','s','i','n','x']);
	    g.engine.settings.autoreplace="auto";
	}
    },
    {
	"description":"delay autoreplace",
	"type":"asciimath",
	"expected":"sinx",
	"run":function(g){
	    g.engine.settings.autoreplace="delay";
	    do_keys(['s','i','n','x']);
	    g.engine.settings.autoreplace="auto";
	}
    },
    {
	"description":"spacebar",
	"type":"asciimath",
	"expected":"cos",
	"run":function(g){
	    do_keys(['c','o','space','s']);
	}
    },
    {
	"description":"backslash",
	"type":"asciimath",
	"expected":" theta ",
	"run":function(g){
	    do_keys(['\\','t','h','e','t','a','enter']);
	}
    },
    {
	"description":"theta",
	"type":"asciimath",
	"expected":" theta ",
	"run":function(g){
	    do_keys(['t','h','e','t','a']);
	}
    },
    {
	"description":"completion",
	"type":"asciimath",
	"expected":" cos()",
	"run":function(g){
	    do_keys(['c','o','space','s','tab']);
	}
    },
    {
	"description":"selection squaring",
	"type":"asciimath",
	"expected":"(x+1)^(2)",
	"run":function(g){
	    do_keys(['x','+','1','shift+left','shift+left','shift+left','^','2']);
	}
    },
    {
	"description":"text selection",
	"type":"asciimath",
	"expected":"text(ad)",
	"run":function(g){
	    do_keys(['t','e','x','t','a','b','c','shift+left','shift+left','d']);
	}
    },
    {
	"description":"text copy",
	"type":"asciimath",
	"expected":"text(abcc)",
	"run":function(g){
	    do_keys(['t','e','x','t','a','b','c','shift+left','mod+c','right','mod+v']);
	}
    },
    {
	"description":"right paren",
	"type":"asciimath",
	"expected":"((x+1))^(2)",
	"run":function(g){
	    do_keys(['(','x','+','1',')','^','2']);
	}
    },
    {
	"description":"paren completion",
	"type":"asciimath",
	"expected":"((x+1))^(2)",
	"run":function(g){
	    do_keys(['(','x','+','1','right','^','2']);
	}
    },
    {
	"description":"definite integral",
	"type":"asciimath",
	"expected":"int_{0}^{2} (x)^(2) dx",
	"run":function(g){
	    do_keys(['d','e','f','i','1','right','2','down','backspace','0','up','right','x','shift+up','2','right','right','x']);
	}
    },
    {
	"description":"delete",
	"type":"asciimath",
	"expected":"",
	"run":function(g){
	    do_keys(['x','s','i','n','x','home','del','del']);
	}
    },
    {
	"description":"click",
	"type":"asciimath",
	"expected":"x sin(ax)",
	"run":function(g){
	    do_keys(['x','s','i','n','x']);
	    do_mouse_down("m_f1_c1_e1_0", .2, .2);
	    do_mouse_up();
	    do_keys(['a']);
	}
    },
    {
	"description":"click select left",
	"type":"asciimath",
	"expected":"x+(x)^(2)",
	"run":function(g){
	    do_keys(['x','s','i','n','x',')','y','x','^','2']);
	    do_mouse_down("m_e2_0", .7, .8);
	    do_mouse_up();
	    do_mouse_down("m_e1_0", .9, .9, true);
	    do_mouse_up();
	    do_keys(['+']);
	}
    },
    {
	"description":"click select right",
	"type":"asciimath",
	"expected":"x+(x)^(2)",
	"run":function(g){
	    do_keys(['x','s','i','n','x',')','y','x','^','2']);
	    do_mouse_down("m_e1_0", .7, .1);
	    do_mouse_up();
	    do_mouse_down("m_e2_0", .9, .9, true);
	    do_mouse_up();
	    do_keys(['+']);
	}
    },
    {
	"description":"click unselect",
	"type":"asciimath",
	"expected":"x+ sin(x)y(x)^(2)",
	"run":function(g){
	    do_keys(['x','s','i','n','x',')','y','x','^','2']);
	    do_mouse_down("m_e1_0", .7, .1);
	    do_mouse_up();
	    do_mouse_down("m_e1_0", .7, .1, true);
	    do_mouse_up();
	    do_keys(['+']);
	}
    },
    {
	"description":"mouse move",
	"type":"asciimath",
	"expected":"x+y",
	"run":function(g){
	    do_keys(['x','+','s','i','n','y']);
	    do_mouse_move("m_e1_0", .1, .1);
	    do_mouse_down("m_f1_c1_e1_0", .1, .1);
	    do_mouse_up();
	    do_keys(['backspace']);
	}
    },
    {
	"description":"delete exponent",
	"type":"asciimath",
	"expected":"x",
	"run":function(g){
	    do_keys(['x','^','2','backspace','backspace']);
	}
    },
    {
	"description":"problem",
	"type":"asciimath",
	"expected":"!z",
	"run":function(g){
	    test_guppy.engine.problem("!z");
	}
    },
    {
	"description":"symbol",
	"type":"asciimath",
	"expected":" tan^(2)(x)",
	"run":function(g){
	    test_guppy.engine.add_symbol("pta",{
		"output":{
		    "latex":"\\tan^{{$1}}({$2})",
		    "asciimath":" tan^({$1})({$2})"
		},
		"attrs":{"group":"test","type":"ptan"},
		"args":[{"down":"2"},{"up":"1"}]
	    });
	    do_keys(['p','t','a','2','right','x']);
	}
    },
    {
	"description":"remove symbol",
	"type":"asciimath",
	"expected":"tanx",
	"run":function(g){
	    test_guppy.engine.remove_symbol("tan");
	    do_keys(['t','a','n','x']);
	}
    },
    {
	"description":"remove global symbol",
	"type":"asciimath",
	"expected":"lnx",
	"run":function(g){
	    Guppy.remove_global_symbol("ln");
	    do_keys(['l','n','x']);
	}
    },
    {
	"description":"symbol_func",
	"type":"text",
	"expected":"Re(i)",
	"run":function(g){
	    Guppy.add_global_symbol("Re",{},"latex_func");
	    do_keys(['shift+r','e','i']);
	}
    },
    {
	"description":"symbol_char",
	"type":"ast",
	"expected":`["var",["sim"]]`,
	"run":function(g){
	    Guppy.add_global_symbol("sim",{},"char");
	    do_keys(['s','i','m']);
	}
    },
    {
	"description":"export sub",
	"type":"text",
	"expected":`(x_2)`,
	"run":function(g){
	    do_keys(['x','_','2']);
	}
    },
    {
	"description":"left_end",
	"content":"<m><e>x</e></m>",
	"type":"asciimath",
	"expected":"LEFT",
	"run":function(g){
	    do_keys(['left']);
	}
    },
    {
	"description":"right_end",
	"content":"<m><e>x</e></m>",
	"type":"asciimath",
	"expected":"RIGHT",
	"run":function(g){
	    do_keys(['right','right']);
	}
    },
    {
	"description":"delete",
	"content":"<m><e>xy</e></m>",
	"type":"asciimath",
	"expected":"y",
	"run":function(g){
	    do_keys(['home','del']);
	}
    },
    {
	"description":"matrix nav",
	"type":"ast",
	"expected":`["*",[["*",[["var",["x"]],["matrix",[["list",[["list",[["val",[1]],["val",[2]]]],["list",[["val",[3]],["val",[4]]]]]]]]]],["var",["y"]]]]`,
	"run":function(g){
	    do_keys(['m','a','t','1',',','2',';','3','right','4','right','y','left','left','left','left','left','left','left','left','left','left','x']);
	}
    },
    {
	"description":"export_text",
	"type":"text",
	"expected":"definite_integral(1,2,((x^2) + 1),x)",
	"run":function(g){
	    do_keys(['d','e','f','i','1','right','2','right','x','^','2','right','+','1','right','x']);
	}
    },
    {
	"description":"export_xml",
	"type":"xml",
	"expected":"<m><e>xy</e></m>",
	"run":function(g){
	    do_keys(['x','y']);
	}
    },
    {
	"description":"export_ast",
	"type":"ast",
	"expected":`["definite_integral",[["val",[1]],["val",[2]],["+",[["exponential",[["var",["x"]],["val",[2]]]],["val",[1]]]],["var",["x"]]]]`,
	"run":function(g){
	    do_keys(['d','e','f','i','1','right','2','right','x','^','2','right','+','1','right','x']);
	}
    },
    {
	"description":"export_text text node",
	"type":"text",
	"expected":"text(abc)",
	"run":function(g){
	    do_keys(['t','e','x','t','a','b','c']);
	}
    },
    {
	"description":"import_text",
	"type":"ast",
	"expected":`["-",[["var",["x"]],["sin",[["var",["x"]]]]]]`,
	"run":function(g){
	    Guppy("guppy1").import_text("x-sin(x)");
	}
    },
    {
	"description":"insert_doc",
	"content":"<m><e>x</e></m>",
	"type":"ast",
	"expected":`["*",[["var",["x"]],["sin",[["var",["x"]]]]]]`,
	"run":function(g){
	    Guppy("guppy1").engine.right();
	    Guppy("guppy1").engine.insert_doc(new Guppy.Doc("sin(x)","text"));
	}
    },
    {
	"description":"import_text arithmetic",
	"type":"ast",
	"expected":`["factorial",[["exponential",[["var",["x"]],["val",[2]]]]]]`,
	"run":function(g){
	    Guppy("guppy1").import_text("x^2!");
	}
    },
    {
	"description":"import_text frac",
	"type":"ast",
	"expected":`["fraction",[["val",[1]],["+",[["val",[1]],["fraction",[["val",[1]],["+",[["val",[1]],["fraction",[["val",[1]],["val",[1]]]]]]]]]]]]`,
	"run":function(g){
	    Guppy("guppy1").import_text("1/(1+1/(1+1/1)))");
	}
    },
    {
	"description":"import_text calc",
	"type":"ast",
	"expected":`["*",[["-",[["val",[2]]]],["+",[["val",[1]],["val",[3]]]]]]`,
	"run":function(g){
	    Guppy("guppy1").import_text("-2(1+3)");
	}
    },
    {
	"description":"import_text order of operations",
	"type":"ast",
	"expected":`["+",[["val",[1]],["*",[["val",[2]],["val",[3]]]]]]`,
	"run":function(g){
	    Guppy("guppy1").import_text("1+2*3");
	}
    },
    {
	"description":"import_text matrix",
	"type":"ast",
	"expected":`["matrix",[["list",[["list",[["val",[1]],["val",[2]]]],["list",[["val",[3]],["val",[4]]]]]]]]`,
	"run":function(g){
	    Guppy("guppy1").import_text("matrix(list(list(1,2),list(3,4)))");
	}
    },
    {
	"description":"import_text char",
	"type":"ast",
	"expected":`["+",[["var",["epsilon"]],["var",["theta"]]]]`,
	"run":function(g){
	    Guppy("guppy1").import_text("epsilon()+theta()");
	}
    },
    {
	"description":"import_text subscript",
	"type":"ast",
	"expected":`["subscript",[["var",["x"]],["val",[2]]]]`,
	"run":function(g){
	    Guppy("guppy1").import_text("x_2");
	}
    },
    {
	"description":"import_ast",
	"type":"text",
	"expected":"-sin(((pi * omega) / 2))",
	"run":function(g){
	    Guppy("guppy1").import_syntax_tree(["-",[["sin",[["fraction",[["*",[["var",["pi"]],["var",["omega"]]]],["val",[2]]]]]]]]);
	}
    },
    {
	"description":"import_ast vector",
	"type":"text",
	"expected":"vector(list((1 / 2),(2 / 3)))",
	"run":function(g){
	    Guppy("guppy1").import_syntax_tree(["vector",[["list",[["fraction",[["val",[1]],["val",[2]]]],["fraction",[["val",[2]],["val",[3]]]]]]]]);
	}
    },
    {
	"description":"import_ast matrix",
	"type":"text",
	"expected":"matrix(list(list((pi / 2),(x^2)),list(definite_integral(1,2,square_root(x),x),sin(x))))",
	"run":function(g){
	    Guppy("guppy1").import_syntax_tree(["matrix",[["list",[["list",[["fraction",[["var",["pi"]],["val",[2]]]],["exponential",[["var",["x"]],["val",[2]]]]]],["list",[["definite_integral",[["val",[1]],["val",[2]],["square_root",[["var",["x"]]]],["var",["x"]]]],["sin",[["var",["x"]]]]]]]]]]);
	}
    },
    {
	"description":"Comparisons",
	"type":"ast",
	"expected":`["=",[["<",[[">",[["var",["x"]],["var",["y"]]]],["var",["z"]]]],["var",["w"]]]]`,
	"run":function(g){
	    do_keys(['x','>','y','<','z','=','w']);
	}
    },
    {
	"description":"Simple comparisons list",
	"type":"eqns",
	"expected":`[[">",[["var",["x"]],["var",["y"]]]],["<",[["var",["y"]],["var",["z"]]]]]`,
	"run":function(g){
	    do_keys(['x','>','y','<','z']);
	}
    },
    {
	"description":"Simple comparisons text",
	"type":"text",
	"expected":`x > y < z`,
	"run":function(g){
	    do_keys(['x','>','y','<','z']);
	}
    },
    {
	"description":"Complex comparisons text",
	"type":"text",
	"expected":"x >= y <= z != w",
	"run":function(g){
	    do_keys(['x','g','e','q','y','l','e','q','z','n','e','q','w']);
	}
    },
    {
	"description":"Fractions and factorials",
	"type":"text",
	"expected":"(2 * ((x + 1))!) = (1 / 2)",
	"run":function(g){
	    do_keys(['2','(','x','+','1','right','!','=','1','shift+/','2']);
	}
    },
    {
	"description":"Comparisons list",
	"type":"eqns",
	"expected":`[[">=",[["var",["x"]],["var",["y"]]]],["<=",[["var",["y"]],["var",["z"]]]],["!=",[["var",["z"]],["var",["w"]]]]]`,
	"run":function(g){
	    do_keys(['x','g','e','q','y','l','e','q','z','n','e','q','w']);
	}
    },
    {
	"description":"evaluate basic",
	"observe":function(g){
	    return g.func()({"x":2,"y":-1})
	},
	"expected":1,
	"run":function(g){
	    do_keys(['x','+','y']);
	}
    },
    {
	"description":"evaluate trig",
	"observe":function(g){
	    return g.func()({"x":0})
	},
	"expected":-1,
	"run":function(g){
	    do_keys(['-','x','^','2','right','-','c','o','s','x']);
	}
    },
    {
	"description":"evaluate complex",
	"observe":function(g){
	    return g.func()({"x":4,"y":-5})
	},
	"expected":-2,
	"run":function(g){
	    do_keys(['s','q','r','t','x','right','*','y','/','1','+','x']);
	}
    },
    {
	"description":"cards x",
	"type":"asciimath",
	"expected":"10x10x10x",
	"run":function(g){
	    var bs = document.getElementsByClassName("guppy-button");
	    var cs = document.getElementsByClassName("guppy_help");
	    var xs = document.getElementsByClassName("guppy-card-x");
	    var cards = 0;
	    for(var i = 0; i < bs.length; i++){
		bs[i].click();
		cards = 0;
		for(var j = 0; j < cs.length; j++) if(cs[j].style.display != "none") cards++;
		do_keys([cards+""]);
		for(var j = 0; j < xs.length; j++) xs[j].click();
		cards = 0;
		for(var j = 0; j < cs.length; j++) if(cs[j].style.display != "none") cards++;
		do_keys([cards+""]);
		do_keys(["x"]);
	    }
	}
    },
    {
	"description":"cards toggle",
	"type":"asciimath",
	"expected":"10x10x10x",
	"run":function(g){
	    var bs = document.getElementsByClassName("guppy-button");
	    var cs = document.getElementsByClassName("guppy_help");
	    var xs = document.getElementsByClassName("guppy-card-x");
	    var cards = 0;
	    for(var i = 0; i < bs.length; i++){
		bs[i].click();
		cards = 0;
		for(var j = 0; j < cs.length; j++) if(cs[j].style.display != "none") cards++;
		do_keys([cards+""]);
		bs[i].click();
		cards = 0;
		for(var j = 0; j < cs.length; j++) if(cs[j].style.display != "none") cards++;
		do_keys([cards+""]);
		do_keys(["x"]);
	    }
	}
    },
    {
	"description":"simplified API latex",
	"observe":function(g){
	    return g.latex();
	},
	"expected":"\\sqrt{-x+2y\\phantom{\\tiny{!}}}=z",
	"run":function(g){
	    do_keys(['s','q','r','t','-','x','+','2','y','right','=','z']);
	}
    },
    {
	"description":"simplified API syntax tree",
	"observe":function(g){
	    return g.syntax_tree();
	},
	"expected":`["=",[["square_root",[["+",[["-",[["var",["x"]]]],["*",[["val",[2]],["var",["y"]]]]]]]],["var",["z"]]]]`,
	"run":function(g){
	    do_keys(['s','q','r','t','-','x','+','2','y','right','=','z']);
	}
    },
    {
	"description":"simplified API asciimath",
	"observe":function(g){
	    return g.asciimath();
	},
	"expected":"sqrt(-x+2y) = z",
	"run":function(g){
	    do_keys(['s','q','r','t','-','x','+','2','y','right','=','z']);
	}
    },
    {
	"description":"simplified API equations",
	"observe":function(g){
	    return g.equations();
	},
	"expected":`[["=",[["square_root",[["+",[["-",[["var",["x"]]]],["*",[["val",[2]],["var",["y"]]]]]]]],["var",["z"]]]]]`,
	"run":function(g){
	    do_keys(['s','q','r','t','-','x','+','2','y','right','=','z']);
	}
    },
    {
	"description":"simplified API text",
	"observe":function(g){
	    return g.text();
	},
	"expected":"square_root((-x + (2 * y))) = z",
	"run":function(g){
	    do_keys(['s','q','r','t','-','x','+','2','y','right','=','z']);
	}
    },
    {
	"description":"simplified API xml",
	"observe":function(g){
	    return g.xml();
	},
	"expected":`<m><e></e><f type="square_root" group="functions"><b p="latex">\\sqrt{<r ref="1"/>\\phantom{\\tiny{!}}}</b><b p="asciimath">sqrt(<r ref="1"/>)</b><c delete="1"><e>-x+2y</e></c></f><e></e><f group="operations" char="yes" type="=" ast_type="operator"><b p="latex">=</b><b p="asciimath"> = </b></f><e>z</e></m>`,
	"run":function(g){
	    do_keys(['s','q','r','t','-','x','+','2','y','right','=','z']);
	}
    },
    {
	"description":"symbols used",
	"observe":function(g){
	    return JSON.stringify(g.symbols_used());
	},
	"expected":`["square_root","sin","exponential"]`,
	"run":function(g){
	    do_keys(['s','q','r','t','s','i','n','x','^','2']);
	}
    },
    {
	"description":"vars used",
	"observe":function(g){
	    return JSON.stringify(g.vars());
	},
	"expected":`["x","alpha","y"]`,
	"run":function(g){
	    do_keys(['x','+','a','l','p','h','a','^','y']);
	}
    },
    {
	"description":"func",
	"observe":function(g){
	    var f = g.func();
	    vars = {};
	    for(var i = 0; i < f.vars.length; i++)
		vars[f.vars[i]] = 2;
	    return f(vars);
	},
	"expected":10,
	"run":function(g){
	    do_keys(['x','+','a','^','y','+','1']);
	}
    },
    {
	"description":"eval",
	"observe":function(g){
	    return g.evaluate({
		"+":function(args){return args[0]+args[1]},
		"val":function(args){return args[0]}
	    });
	},
	"expected":3,
	"run":function(g){
	    do_keys(['1','+','2']);
	}
    },
    {
	"description":"text weird chars",
	"type":"text",
	"expected":"text(1+,!@a\"')",
	"run":function(g){
	    do_keys(['t','e','x','t','1','+',',','!','@','a','"',"'"]);
	}
    },
    {
	"description":"focus",
	"type":"text",
	"observe":function(g){
	    g.activate();
	    var f = focuses;
	    var u = unfocuses;
	    g.deactivate();
	    ans_u = unfocuses-u;
	    g.activate();
	    ans_f = focuses-f;
	    return ans_u+ans_f;
	},
	"expected":2,
	"run":function(g){
	}
    }
];

function do_keys(chs){
    test_guppy.activate();
    for(var i = 0; i < chs.length; i++)
	Mousetrap.trigger(chs[i]);
}

function do_mouse_move(path,x_frac,y_frac){
    elts = test_guppy.editor.getElementsByClassName("guppy_loc_"+path);
    var rect = elts[1].getBoundingClientRect();
    var x = rect.left + (rect.right - rect.left)*x_frac;
    var y = rect.top + (rect.bottom - rect.top)*y_frac;
    Guppy.mouse_move({"target":test_guppy.editor,"clientX":x,"clientY":y,"preventDefault":function(){}});
}

function do_mouse_down(path,x_frac,y_frac, shift){
    elts = test_guppy.editor.getElementsByClassName("guppy_loc_"+path);
    var rect = elts[1].getBoundingClientRect();
    var x = rect.left + (rect.right - rect.left)*x_frac;
    var y = rect.top + (rect.bottom - rect.top)*y_frac;
    Guppy.mouse_down({"target":test_guppy.editor,"clientX":x,"clientY":y,"preventDefault":function(){},"shiftKey":shift});
}

function do_mouse_up(){
    Guppy.mouse_up();
}

function append_result(name, result, i){
    var res = document.getElementById("results");
    var d = document.createElement("div");
    d.setAttribute("style","padding:5px;background-color:"+(result == "PASS" ? "#6c0" : "#f30"));
    var rerun = document.createElement("a");
    rerun.appendChild(document.createTextNode(name));
    rerun.setAttribute("href","#");
    rerun.setAttribute("onclick", "run_test("+i+", test_guppy)");
    d.appendChild(rerun);
    d.appendChild(document.createTextNode(": " + result));
    res.appendChild(d);
}

function start_tests(){
    var g = test_guppy;
    g.activate();
    //track_coverage(g);
    var tot = 0, pass = 0;
    for(var i = 0; i < tests.length; i++){
    	if(run_test(i, g)) pass++;
	tot++;
    }
    document.getElementById("pass_rate").innerHTML = (Math.round(10000*pass/tot)/100)+"% pass rate (" + pass + " pass, " + (tot-pass) + " fails)";
    //display_coverage();
    g.import_xml("<m><e>x</e></m>");
}

function run_test(i, g){
    var t = tests[i];
    test_guppy.activate();
    if(!t.content) test_guppy.import_xml("<m><e></e></m>");
    else if(t.content != "none") test_guppy.import_xml(t.content);
    test_guppy.render();
    var observed = ""
    try{
	t.run(test_guppy);
	test_guppy.render();
	if(t.observe) observed = t.observe(test_guppy);
	else observed = test_guppy.engine.get_content(t.type);
	console.log(observed);
    } catch(e) {
	observed = e + "\n" + e.stack;
    }
    test_guppy.deactivate();
    if(t.expected == observed){
	append_result(t.description,"PASS", i);
	return true;
    }
    else {
	append_result(t.description,"Observed="+observed + ", Expected="+t.expected, i);
	return false;
    }
}

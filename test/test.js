var covered_functions = {};
var tests = [
    {
	"description":"Basic",
	"content":"<m><e>x+1</e></m>",
	"type":"text",
	"expected":"+1",
	"run":function(g){
	    do_keys(['right','backspace']);
	}
    },
    {
	"description":"Basic undo",
	"content":"<m><e></e></m>",
	"type":"text",
	"expected":"xy",
	"run":function(g){
	    do_keys(['x','y','z','mod+z']);
	}
    },
    {
	"description":"Basic redo",
	"content":"<m><e></e></m>",
	"type":"text",
	"expected":"xyz",
	"run":function(g){
	    do_keys(['x','y','z','mod+z','mod+y']);
	}
    },
    {
	"description":"Sine",
	"content":"<m><e></e></m>",
	"type":"text",
	"expected":"sin(x)",
	"run":function(g){
	    do_keys(['s','i','n','x']);
	}
    },
    {
	"description":"Sine undo",
	"content":"<m><e></e></m>",
	"type":"text",
	"expected":"sin",
	"run":function(g){
	    do_keys(['s','i','n','mod+z']);
	}
    },
    {
	"description":"Exponent undo",
	"content":"<m><e></e></m>",
	"type":"text",
	"expected":"2x",
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
	"expected":"a1",
	"run":function(g){
	    do_keys(['shift+right','shift+right','a']);
	}
    },
    {
	"description":"Basic select left",
	"content":"<m><e>x+1</e></m>",
	"type":"text",
	"expected":"a+1",
	"run":function(g){
	    do_keys(['right','shift+left','a']);
	}
    },
    {
	"description":"Basic cut/paste",
	"content":"<m><e>x+1</e></m>",
	"type":"text",
	"expected":"1x+",
	"run":function(g){
	    do_keys(['shift+right','shift+right','mod+x','right','mod+v']);
	}
    },
    {
	"description":"Basic copy/paste",
	"content":"<m><e>x+1</e></m>",
	"type":"text",
	"expected":"x+1x+",
	"run":function(g){
	    do_keys(['shift+right','shift+right','mod+c','right','mod+v']);
	}
    },
    {
	"description":"f-char delete",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"(2)^(x)",
	"run":function(g){
	    do_keys(['2','^','x','p','i','backspace']);
	}
    },
    {
	"description":"f-char cut/paste",
	"content":'<m><e></e><f><b p="latex">\\sin\\left(<r ref="1"/>\\right)</b><b p="text">sin(<r ref="1"/>)</b><c><e>x</e></c></f><e>+</e><f c="yes"><b p="latex">{\\pi}</b><b p="text"> PI </b></f><e>+</e><f><b p="latex">\\cos\\left(<r ref="1"/>\\right)</b><b p="text">cos(<r ref="1"/>)</b><c><e>x</e></c></f><e></e></m>',
	"type":"text",
	"expected":"sin(x)+cos(x)+ PI ",
	"run":function(g){
	    do_keys(['right','right','right','shift+right','shift+right','mod+x','right','right','right','right','mod+v']);
	}
    },
    {
	"description":"matrix add row",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"matrix(1;2)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+down','2']);
	}
    },
    {
	"description":"matrix copy row",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"matrix(1;1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+down']);
	}
    },
    {
	"description":"matrix add col",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"matrix(1,2)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+right','2']);
	}
    },
    {
	"description":"matrix copy col",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"matrix(1,1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+right']);
	}
    },
    {
	"description":"2x2 matrix",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"matrix(1,2;(x)^(2),3)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+right','2','mod+down','right','3','left','left','x','^','2']);
	}
    },
    {
	"description":"2x2 matrix delete col",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"matrix(2;3)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+right','2','mod+down','right','3','left','left','x','^','2','mod+backspace']);
	}
    },
    {
	"description":"2x2 matrix delete row",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"matrix(1,2)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+right','2','mod+down','right','3','left','left','x','^','2','mod+shift+backspace']);
	}
    },
    {
	"description":"matrix extend up",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"matrix(2;1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+up','2']);
	}
    },
    {
	"description":"matrix extend left",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"matrix(2,1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+left','2']);
	}
    },
    {
	"description":"matrix copy up",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"matrix(21;1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+up','2']);
	}
    },
    {
	"description":"matrix copy up move",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"matrix(1;21)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+up','down','2']);
	}
    },
    {
	"description":"matrix copy left",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"matrix(12,1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+left','2']);
	}
    },
    {
	"description":"matrix copy left undo",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"matrix(1)",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+left','mod+z']);
	}
    },
    {
	"description":"sel all delete",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"",
	"run":function(g){
	    do_keys(['m','a','t','1','mod+shift+up','down','x','^','2','+','mod+a','backspace']);
	}
    },
    {
	"description":"spacebar",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"cos",
	"run":function(g){
	    do_keys(['c','o','space','s']);
	}
    },
    {
	"description":"backslash",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":" $theta ",
	"run":function(g){
	    do_keys(['\\','t','h','e','t','a','enter']);
	}
    },
    {
	"description":"theta",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"th $eta ",
	"run":function(g){
	    do_keys(['t','h','e','t','a']);
	}
    },
    {
	"description":"completion",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"cos()",
	"run":function(g){
	    do_keys(['c','o','space','s','tab']);
	}
    },
    {
	"description":"selection squaring",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"(x+1)^(2)",
	"run":function(g){
	    do_keys(['x','+','1','shift+left','shift+left','shift+left','^','2']);
	}
    },
    {
	"description":"right paren",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"((x+1))^(2)",
	"run":function(g){
	    do_keys(['(','x','+','1',')','^','2']);
	}
    },
    {
	"description":"paren completion",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"((x+1))^(2)",
	"run":function(g){
	    do_keys(['(','x','+','1','right','^','2']);
	}
    },
    {
	"description":"definite integral",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"integrate((x)^(2),x,0,2)",
	"run":function(g){
	    do_keys(['d','e','f','i','1','right','2','down','backspace','0','up','right','x','shift+up','2','right','right','x']);
	}
    },
    {
	"description":"delete",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"",
	"run":function(g){
	    do_keys(['x','s','i','n','x','home','del','del']);
	}
    },
    {
	"description":"click",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"xsin(ax)",
	"run":function(g){
	    do_keys(['x','s','i','n','x']);
	    do_mouse_down("m_f1_c1_e1_0", .2, .2);
	    do_mouse_up();
	    do_keys(['a']);
	}
    },
    {
	"description":"click select",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"x(x)^(2)",
	"run":function(g){
	    do_keys(['x','s','i','n','x',')','y','x','^','2']);
	    do_mouse_down("m_e1_0", .7, .1);
	    //do_mouse_down("m_e2_0", .7, .1);
	    do_mouse_up();
	    do_mouse_down("m_e2_0", .9, .9, true);
	    do_mouse_up();
	    do_keys(['+']);
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
    console.log(elts);
    var rect = elts[1].getBoundingClientRect();
    var x = rect.left + (rect.right - rect.left)*x_frac;
    var y = rect.top + (rect.bottom - rect.top)*y_frac;
    console.log("R",JSON.stringify(rect),x,y);
    Guppy.mouse_move({"target":test_guppy.editor,"clientX":x,"clientY":y,"preventDefault":function(){}});
}

function do_mouse_down(path,x_frac,y_frac, shift){
    elts = test_guppy.editor.getElementsByClassName("guppy_loc_"+path);
    console.log(elts);
    var rect = elts[1].getBoundingClientRect();
    console.log("R",rect.top,rect.bottom,rect.left,rect.right,x,y);
    var x = rect.left + (rect.right - rect.left)*x_frac;
    var y = rect.top + (rect.bottom - rect.top)*y_frac;
    Guppy.mouse_down({"target":test_guppy.editor,"clientX":x,"clientY":y,"preventDefault":function(){},"shiftKey":shift});
}

function do_mouse_up(){
    Guppy.mouse_up();
}

function append_result(name, result, i){
    var res = document.getElementById("results");
    res.appendChild(document.createElement("br"));
    var rerun = document.createElement("a");
    rerun.appendChild(document.createTextNode(name));
    rerun.setAttribute("href","#");
    rerun.setAttribute("onclick", "run_test("+i+", test_guppy)");
    res.appendChild(rerun);
    res.appendChild(document.createTextNode(": " + result));
}

function patch_object_functions(name, obj, is_class, exclude){
    var proto = is_class ? obj : Object.getPrototypeOf(obj);
    var props = Object.getOwnPropertyNames(proto);
    for(var i = 0; i < props.length; i++){
	var fun = obj[props[i]]
	if(typeof fun === 'function' && !exclude[props[i]]){
	    covered_functions[name + "." + props[i]] = {"calls":0,"fun":fun};
	    var nf = function(objname, funname, o, f){
		o[funname] = function(){
		    covered_functions[objname + "." + funname].calls++;
		    return f.apply(o, arguments);
		}
	    };
	    nf(name, props[i], obj, fun);
	}
    }
}

function track_coverage(g){
    // get all functions of a function object
    var function_functions = {};
    var f = function(){};
    var props = Object.getOwnPropertyNames(f);
    for(var i = 0; i < props.length; i++)
	if(typeof f[props[i]] === 'function')
	    function_functions[props[i]] = true;
    // get all functions of the various target objects
    patch_object_functions("guppy.backend", g.backend, false, function_functions);
    patch_object_functions("guppy", g, false, function_functions);
    //patch_object_functions("GuppyBackend", GuppyBackend, true, function_functions);
    //patch_object_functions("Guppy", Guppy, true, function_functions);
    display_coverage();
}

function display_coverage(){
    document.getElementById("coverage").innerHTML = "<b>Test coverage: </b><span id='cov'></span>";
    var res = document.getElementById("coverage");
    var tot = 0, cov = 0;
    for(var n in covered_functions){
	tot++;
	var calls = covered_functions[n].calls;
	if(calls > 0) cov++;
	//res.appendChild(document.createElement("br"));
	s = document.createElement("div");
	s.setAttribute("style","padding:5px; background-color:" + (calls > 0 ? "#0c0;" : "#c00;"));
	s.appendChild(document.createTextNode(n + ": " + calls));
	res.appendChild(s);
    }
    document.getElementById("cov").innerHTML = (Math.round(10000*cov/tot)/100)+"%";
}

function start_tests(){
    var g = test_guppy;
    g.activate();
    track_coverage(g);
    var tot = 0, pass = 0;
    for(var i = 0; i < tests.length; i++){
	console.log("running",tests[i]);
    	if(run_test(i, g)) pass++;
	tot++;
    }
    document.getElementById("pass_rate").innerHTML = (Math.round(10000*pass/tot)/100)+"% pass rate";
    display_coverage();
}

function run_test(i, g){
    var t = tests[i];
    console.log(i,t);
    test_guppy.activate();
    test_guppy.backend.set_content(t.content);
    test_guppy.render();
    t.run(test_guppy);
    test_guppy.render();
    var observed = test_guppy.backend.get_content(t.type);
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

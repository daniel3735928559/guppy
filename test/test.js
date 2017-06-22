var covered_functions = {};
var tests = [
    {
	"description":"Basic test",
	"content":"<m><e>x+1</e></m>",
	"type":"text",
	"expected":"+1",
	"run":function(g){
	    do_keys(['right','backspace']);
	}
    },
    {
	"description":"Basic undo test",
	"content":"<m><e></e></m>",
	"type":"text",
	"expected":"xy",
	"run":function(g){
	    do_keys(['x','y','z','mod+z']);
	}
    },
    {
	"description":"Sine test",
	"content":"<m><e></e></m>",
	"type":"text",
	"expected":"sin(x)",
	"run":function(g){
	    do_keys(['s','i','n','x']);
	}
    },
    {
	"description":"Sine undo test",
	"content":"<m><e></e></m>",
	"type":"text",
	"expected":"sin",
	"run":function(g){
	    do_keys(['s','i','n','mod+z']);
	}
    },
    {
	"description":"Exponent undo test",
	"content":"<m><e></e></m>",
	"type":"text",
	"expected":"2x",
	"run":function(g){
	    do_keys(['2','x','^','mod+z']);
	}
    },
    {
	"description":"Basic select delete test",
	"content":"<m><e>x+1</e></m>",
	"type":"text",
	"expected":"1",
	"run":function(g){
	    do_keys(['shift+right','shift+right','backspace']);
	}
    },
    {
	"description":"Basic select replace test",
	"content":"<m><e>x+1</e></m>",
	"type":"text",
	"expected":"a1",
	"run":function(g){
	    do_keys(['shift+right','shift+right','a']);
	}
    },
    {
	"description":"Basic cut/paste test",
	"content":"<m><e>x+1</e></m>",
	"type":"text",
	"expected":"1x+",
	"run":function(g){
	    do_keys(['shift+right','shift+right','mod+x','right','mod+v']);
	}
    },
    {
	"description":"Basic copy/paste test",
	"content":"<m><e>x+1</e></m>",
	"type":"text",
	"expected":"x+1x+",
	"run":function(g){
	    do_keys(['shift+right','shift+right','mod+c','right','mod+v']);
	}
    },
    {
	"description":"f-char delete test",
	"content":'<m><e></e></m>',
	"type":"text",
	"expected":"(2)^(x)",
	"run":function(g){
	    do_keys(['2','^','x','p','i','backspace']);
	}
    },
    {
	"description":"f-char cut/paste test",
	"content":'<m><e></e><f><b p="latex">\\sin\\left(<r ref="1"/>\\right)</b><b p="text">sin(<r ref="1"/>)</b><c><e>x</e></c></f><e>+</e><f c="yes"><b p="latex">{\\pi}</b><b p="text"> PI </b></f><e>+</e><f><b p="latex">\\cos\\left(<r ref="1"/>\\right)</b><b p="text">cos(<r ref="1"/>)</b><c><e>x</e></c></f><e></e></m>',
	"type":"text",
	"expected":"sin(x)+cos(x)+ PI ",
	"run":function(g){
	    do_keys(['right','right','right','shift+right','shift+right','mod+x','right','right','right','right','mod+v']);
	}
    },
];

function do_keys(chs){
    test_guppy.activate();
    for(var i = 0; i < chs.length; i++)
	Mousetrap.trigger(chs[i]);
}
function append_result(name, result){
    var res = document.getElementById("results");
    res.appendChild(document.createElement("br"));
    res.appendChild(document.createTextNode(name + ": " + result));
}

function track_coverage(g){
    // get all functions of a function object
    var function_functions = {};
    var f = function(){};
    var props = Object.getOwnPropertyNames(f);
    for(var i = 0; i < props.length; i++)
	if(typeof f[props[i]] === 'function')
	    function_properties[props[i]] = true;
    // get all functions of the various target objects
    var function_sources = {"guppy_backend":{"proto":Object.getPrototypeOf(g.backend),"obj":g.backend},
			    "guppy_frontend":{"proto":Object.getPrototypeOf(g),"obj":g},
			    "Guppy":{"obj":Guppy},
			    "GuppyEditor":{"obj":GuppyEditor}};
    for(var n in function_sources){
	var proto = function_sources[n].proto ? function_sources[n].proto : function_sources[n].obj;
	var obj = function_sources[n].obj;
	var props = Object.getOwnPropertyNames(proto);
	for(var i = 0; i < props.length; i++){
	    var fun = obj[props[i]]
	    if(typeof fun === 'function' && !function_functions[props[i]]){
		covered_functions[n + "." + props[i]] = {"calls":0,"fun":fun};
		var nf = function(objname, funname, o, f){
		    o[funname] = function(){
			covered_functions[objname + "." + funname].calls++;
			return f.apply(o, arguments);
		    }
		};
		nf(n, props[i], obj, fun);
	    }
	}
    }
    display_coverage();
}

function display_coverage(){
    document.getElementById("coverage").innerHTML = "<b>Test coverage: </b>";
    var res = document.getElementById("coverage");
    console.log(covered_functions["guppy_backend.list_extend"].calls);
    for(var n in covered_functions){
	var calls = covered_functions[n].calls;
	//res.appendChild(document.createElement("br"));
	s = document.createElement("div");
	s.setAttribute("style","padding:5px; background-color:" + (calls > 0 ? "#0c0;" : "#c00;"));
	s.appendChild(document.createTextNode(n + ": " + calls));
	res.appendChild(s);
    }
}

function start_tests(){
    var g = test_guppy;
    g.activate();
    track_coverage(g);
    for(var t in tests){
	console.log("running",tests[t]);
    	run_test(tests[t], g);
	display_coverage();
    }
}

function run_test(t, g){
    test_guppy.backend.set_content(t.content);
    test_guppy.render();
    t.run(test_guppy);
    test_guppy.render();
    var observed = test_guppy.backend.get_content(t.type);
    if(t.expected == observed){
	append_result(t.description,"PASS");
    }
    else {
	append_result(t.description,"Observed="+observed + ", Expected="+t.expected);
    }
}

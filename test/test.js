var tests = {
    "basic":{
	"description":"Basic test",
	"content":"<m><e>x+1</e></m>",
	"type":"calc",
	"expected":"+1",
	"run":function(g){
	    g.right();
	    g.backspace();
	}
    },
    "ftest":{
	"description":"Sine test",
	"content":"<m><e></e></m>",
	"type":"calc",
	"expected":"sin(x)",
	"run":function(g){
	    key_do('s');
	    key_do('i');
	    key_do('n');
	    key_do('x');
	}
    }
}

function key_do(ch){
    Guppy.key_down({'keyCode':ch.toUpperCase().charCodeAt(0),'preventDefault':function(){}});
}

function append_result(name, result){
    var res = document.getElementById("results");
    res.appendChild(document.createElement("br"));
    res.appendChild(document.createTextNode(name + ": " + result));
}

function start_tests(g){
    for(var t in tests){
	g.activate();
	run_test(tests[t], g);
    }
}

function run_test(t, g){
    g.set_content(t.content);
    t.run(g);
    var observed = g.get_content(t.type);
    if(t.expected == observed){
	append_result(t.description,"PASS");
    }
    else {
	append_result(t.description,"Observed="+observed + ", Expected="+t.expected);
    }
}

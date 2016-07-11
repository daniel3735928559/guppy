var tests = [
    {
	"description":"Basic test",
	"content":"<m><e>x+1</e></m>",
	"type":"calc",
	"expected":"+1",
	"run":function(g){
	    g.right();
	    g.backspace();
	}
    },
    {
	"description":"Basic undo test",
	"content":"<m><e></e></m>",
	"type":"calc",
	"expected":"xy",
	"run":function(g){
	    key_do('x');
	    key_do('y');
	    key_do('z');
	    g.undo();
	}
    },
    {
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
    },
    {
	"description":"Sine undo test",
	"content":"<m><e></e></m>",
	"type":"calc",
	"expected":"si",
	"run":function(g){
	    key_do('s');
	    key_do('i');
	    key_do('n');
	    g.undo();
	}
    },
    {
	"description":"Basic select delete test",
	"content":"<m><e>x+1</e></m>",
	"type":"calc",
	"expected":"1",
	"run":function(g){
	    g.sel_right();
	    g.sel_right();
	    g.backspace();
	}
    },
    {
	"description":"Basic select replace test",
	"content":"<m><e>x+1</e></m>",
	"type":"calc",
	"expected":"a1",
	"run":function(g){
	    g.sel_right();
	    g.sel_right();
	    key_do('a');
	}
    },
    {
	"description":"Basic cut/paste test",
	"content":"<m><e>x+1</e></m>",
	"type":"calc",
	"expected":"1x+",
	"run":function(g){
	    g.sel_right();
	    g.sel_right();
	    g.sel_cut();
	    g.right();
	    g.sel_paste();
	}
    },
    {
	"description":"Basic copy/paste test",
	"content":"<m><e>x+1</e></m>",
	"type":"calc",
	"expected":"x+1x+",
	"run":function(g){
	    g.sel_right();
	    g.sel_right();
	    g.sel_copy();
	    g.right();
	    g.sel_paste();
	}
    },
    {
	"description":"f-char delete test",
	"content":'<m><e></e></m>',
	"type":"calc",
	"expected":"(2)^(x)",
	"run":function(g){
	    key_do('2');
	    sym_do('exp');
	    key_do('x');
	    key_do('p');
	    key_do('i');
	    g.backspace();
	}
    },
    {
	"description":"f-char cut/paste test",
	"content":'<m><e></e><f><b p="latex">\\sin\\left(<r ref="1"/>\\right)</b><b p="calc">sin(<r ref="1"/>)</b><c><e>x</e></c></f><e>+</e><f c="yes"><b p="latex">{\\pi}</b><b p="calc"> PI </b></f><e>+</e><f><b p="latex">\\cos\\left(<r ref="1"/>\\right)</b><b p="calc">cos(<r ref="1"/>)</b><c><e>x</e></c></f><e></e></m>',
	"type":"calc",
	"expected":"sin(x)+cos(x)+ PI ",
	"run":function(g){
	    g.right();
	    g.right();
	    g.right();
	    g.sel_right();
	    g.sel_right();
	    g.sel_cut();
	    g.right();
	    g.right();
	    g.right();
	    g.right();
	    g.sel_paste();
	}
    },
];

function sym_do(s){
    g.insert_symbol(s);
}
function key_do(ch){
    g.insert_string(ch);
}

function append_result(name, result){
    var res = document.getElementById("results");
    res.appendChild(document.createElement("br"));
    res.appendChild(document.createTextNode(name + ": " + result));
}

function start_tests(g){
    for(var t in tests){
    	run_test(tests[t], g);
    }
}

function run_test(t, g){
    g.activate();
    g.set_content(t.content);
    t.run(g);
    g.render();
    var observed = g.get_content(t.type);
    if(t.expected == observed){
	append_result(t.description,"PASS");
    }
    else {
	append_result(t.description,"Observed="+observed + ", Expected="+t.expected);
    }
}

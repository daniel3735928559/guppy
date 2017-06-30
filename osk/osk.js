$('document').ready(function() {
    OSK = new GuppyOSK();
    var g1 = new Guppy("guppy1", {
	"events":{"ready":function(){
	    OSK.attach(g1);
	}},
	"options":{}
    });
    Guppy.init_symbols(["/sym/symbols.json"]);

});

function GuppyOSK(){}

GuppyOSK.blank = "\\color{blue}{[?]}";
GuppyOSK.text_blank = "[?]";

GuppyOSK.prototype.attach = function(guppy){
    var syms = guppy.backend.symbols;
    var osk = $("<div />").addClass("guppy_osk");
    var sym_tabs = $("<div />").addClass("keys");
    var controls = $("<div />").addClass("controls");
    var tab_bar = $("<ul />");
    sym_tabs.append(tab_bar);
    var grouped = {"abc":[],"ABC":[]};
    var abc = "0123456789abcdefghijklmnopqrstuvwxyz.,"
    for(var i = 0; i < abc.length; i++){
	grouped["abc"].push({"name":abc[i], "latex":abc[i]});
	var u = abc[i].toUpperCase()
	grouped["ABC"].push({"name":u, "latex":u});
    }
    console.log(syms);
    for(var s in syms){
	console.log(s,syms[s].output.latex);
	var group = syms[s].group;
	if(!grouped[group]) grouped[group] = [];
	var display = s == "text" ? GuppyOSK.text_blank : syms[s].output.latex.replace(/\{\$[0-9]+\}/g, GuppyOSK.blank);
	grouped[group].push({"name":s,"latex":display});
    }
    for(var g in grouped){
	var group_elt = $("<div />").addClass("guppy_osk_group").attr("id",g);
	tab_bar.append($("<li><a href='#"+g+"'>"+g+"</a></li>"));
	for(var s in grouped[g]){
	    var sym = grouped[g][s];
	    var key = $("<span>").addClass("guppy_osk_key");
	    if(g == "abc" || g == "ABC"){
		var f = function(n){ key.click(function(){ guppy.backend.insert_string(n); guppy.render(true);}); };
		f(sym.name);
	    } else {
		var f = function(n){ key.click(function(){ guppy.backend.insert_symbol(n); guppy.render(true); }); };
		f(sym.name);
	    }
	    group_elt.append(key);
	    katex.render(sym.latex, key.get(0));
	}
	sym_tabs.append(group_elt);
    }
    sym_tabs.tabs();
    osk.append(sym_tabs);

    
    controls.append($("<span>").addClass("guppy_osk_key").html("&larr;").click(function(){guppy.backend.left();guppy.render();}));
    controls.append($("<span>").addClass("guppy_osk_key").html("&uarr;").click(function(){guppy.backend.up();guppy.render();}));
    controls.append($("<span>").addClass("guppy_osk_key").html("&darr;").click(function(){guppy.backend.down();guppy.render();}));
    controls.append($("<span>").addClass("guppy_osk_key").html("&rarr;").click(function(){guppy.backend.right();guppy.render();}));
    
    osk.append(controls);
    $("body").append(osk);
}

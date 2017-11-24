window.onload = function() {
    Guppy.init_symbols(["../sym/symbols.json"]);
    output_type = "latex";
    var g1 = new Guppy("guppy1", {
	"events":{
            'right_end': function() {},
            'left_end': function() {},
            'change': update_output,
            'completion': completion,
	},
	"options":
	{
	    'cliptype':'latex',
            'empty_content': "{\\text{Click to start typing math!}}"
	}
    });
    document.getElementById("sample_output").readOnly = true;
    update_output();
};

function select_output(t){
    output_type = t;
    update_output();
    var l = document.getElementsByClassName("output-select");
    for(var i = 0; i < l.length; i++){
	var new_class = l[i].getAttribute("class").replace(new RegExp("output-selected","g"),"output-unselected");
	l[i].setAttribute("class", new_class);
    }
    var cur = document.getElementById("output_"+t);
    var new_class = cur.getAttribute("class").replace(new RegExp("output-unselected","g"),"output-selected");
    cur.setAttribute("class", new_class);
}

function update_output(){
    try{
	content = Guppy.instances['guppy1'].backend.get_content(output_type)+"";
	if(content.replace(/\s/g,"").length == 0) content = "Output " + output_type + " will appear here";
	document.getElementById("sample_output").value = content;
    }
    catch(e){
	document.getElementById("sample_output").value = "Failed to parse input";
	console.log(e.stack);
    }
}

function completion(target, data) {
    document.getElementById("sample_output").value = data.candidates.join(", ");
}

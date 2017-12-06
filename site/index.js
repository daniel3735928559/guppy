window.onload = function() {
    output_type = "latex";
    document.getElementById("sample_output").readOnly = true;
    Guppy.init({"osk":new GuppyOSK({"goto_tab":"qwerty"}),
		"path":"../build",
		"symbols":"../sym/symbols.json",
		"events":{
		    "ready": update_output,
		    "change": update_output,
		    "completion": completion,
		},
		"settings":{
		    "empty_content": "{\\text{Click to start typing math!}}"
		}});
    var g1 = new Guppy("guppy1");
};

function select_output(t){
    output_type = t;
    update_output({"target":Guppy.instances.guppy1});
    var l = document.getElementsByClassName("output-select");
    for(var i = 0; i < l.length; i++){
	var new_class = l[i].getAttribute("class").replace(new RegExp("output-selected","g"),"output-unselected");
	l[i].setAttribute("class", new_class);
    }
    var cur = document.getElementById("output_"+t);
    var new_class = cur.getAttribute("class").replace(new RegExp("output-unselected","g"),"output-selected");
    cur.setAttribute("class", new_class);
}

function update_output(e){
    try{
	content = e.target.backend.get_content(output_type)+"";
	if(content.replace(/\s/g,"").length == 0) content = "Output " + output_type + " will appear here";
	document.getElementById("sample_output").value = content;
    }
    catch(e){
    	document.getElementById("sample_output").value = "Failed to parse input";
    	console.log(e.stack);
    }
}

function completion(e) {
    document.getElementById("sample_output").value = e.candidates.join(", ");
}

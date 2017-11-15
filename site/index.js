$('document').ready(function() {
    Guppy.init_symbols(["../sym/symbols.json"]);
    output_type = "latex";
    var g1 = new Guppy("guppy1", {
	"events":{
	    //'debug':10,
            'right_end': function() {},
            'left_end': function() {},
            'change': update_output,
            'completion': completion,
	},
	"options":
	{
            //'blank_caret': "[?]",
	    //'autoreplace':true,
	    'cliptype':'latex',
            'empty_content': "{\\text{Click to start typing math!}}"
	}
    });
    document.getElementById("sample_output").readOnly = true;
    update_output();
});

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
	//content = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	if(content.replace(/\s/g,"").length == 0) content = "Output " + output_type + " will appear here";
	$('#sample_output')[0].value = content;
    }
    catch(e){
	$('#sample_output')[0].value = "Malformed input";
	//throw e;
    }
}

function completion(target, data) {
    $('#sample_output')[0].value = data.candidates.join(", ");
}

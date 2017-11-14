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
            'empty_content': "\\gray{\\text{Click to start typing math!}}"
	}
    });
});

function select_output(t){
    output_type = t;
    update_output();
    var l = document.getElementsByClassName("output-select");
    for(var i = 0; i < l.length; i++){
	var new_class = l[i].getAttribute("class").replace(new RegExp("btn-primary","g"),"btn-default");
	l[i].setAttribute("class", new_class);
    }
    var cur = document.getElementById("output_"+t);
    var new_class = cur.getAttribute("class").replace(new RegExp("btn-default","g"),"btn-primary");
    cur.setAttribute("class", new_class);
}

function update_output(){
    try{
	content = Guppy.instances['guppy1'].backend.get_content(output_type);
	content = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	if(content.replace(/\s/g,"").length == 0) content = "Output will appear here";
	$('#sample_output')[0].innerHTML = content;
    }
    catch(e){
	$('#sample_output')[0].innerHTML = "Syntax error";
    }
}

function completion(target, data) {
    $('#stuff')[0].innerHTML = "INFO: <br />"+data.candidates.join(", ");
}

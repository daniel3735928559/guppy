$('document').ready(function() {
    Guppy.init_symbols(["../sym/symbols.json","../sym/extra_symbols.json"]);
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

function update_output(){
    console.log("ASD");
    try{
	$('#latex_output')[0].innerHTML = Guppy.instances['guppy1'].backend.get_content("latex");
	$('#text_output')[0].innerHTML = Guppy.instances['guppy1'].backend.get_content("text");
	$('#ast_output')[0].innerHTML = Guppy.instances['guppy1'].backend.get_content("ast");
	$('#xml_output')[0].innerHTML = Guppy.instances['guppy1'].backend.get_content("xml").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    }
    catch(e){
	console.log(e);
    }
}

function completion(target, data) {
    $('#stuff')[0].innerHTML = "INFO: <br />"+data.candidates.join(", ");
}

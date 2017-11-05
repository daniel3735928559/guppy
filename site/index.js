$('document').ready(function() {
    Guppy.init_symbols(["../sym/symbols.json","../sym/extra_symbols.json"]);
    var g1 = new Guppy("guppy1", {
	"events":{
	    //'debug':10,
            'right_end': function() {},
            'left_end': function() {},
            'done': function() { createText('text'); },
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

function completion(target, data) {
    $('#stuff')[0].innerHTML = "INFO: <br />"+data.candidates.join(", ");
}

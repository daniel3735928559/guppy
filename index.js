$('document').ready(function() {
    $('#xml_btn').on('click', function() {
        createText('xml');
    });
    $('#text_btn').on('click', function() {
        createText('text');
    });
    $('#latex_btn').on('click', function() {
        createText('latex');
    });
    $('#clear_btn').on('click', function() {
        $('#stuff')[0].innerHTML = '';
    });

    Guppy.get_symbols(["builtins","sym/symbols.json","sym/extra_symbols.json"]);
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
            'empty_content': "\\color{gray}{\\text{Click here to start typing a mathematical expression}}"
	}
    });

var draggeable = function (elem) {
        if (typeof elem === 'string' || elem instanceof String)
            elem = document.getElementById(elem);
        
        this.x_elem = this.y_elem = undefined;
        var thisClosure = this;
        elem.addEventListener("mousedown",function (e) {
            var   x_pos = document.all ? window.event.clientX : e.pageX;
            var   y_pos = document.all ? window.event.clientY : e.pageY;
            thisClosure.x_elem = x_pos - elem.offsetLeft;
            thisClosure.y_elem = y_pos - elem.offsetTop;
            document.onmousemove = thisClosure.move;
            return false;
        });
        
        this.move = function(e) {
            var x_pos = document.all ? window.event.clientX : e.pageX;
            var y_pos = document.all ? window.event.clientY : e.pageY;
            elem.style.left = (x_pos - thisClosure.x_elem) + 'px';
            elem.style.top  = (y_pos - thisClosure.y_elem) + 'px';
        }
        elem.onmouseup  = function() {document.onmousemove = function() {return true}};
    }
    new draggeable('guppyToolbox');
    new Guppy.Gui("guppyGui",{'style':{'height':'90%','color':'black'}});
});

function flash_help(){
    $("#help_card").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}

function completion(data) {
    $('#stuff')[0].innerHTML = "INFO: <br />"+data.candidates.join(", ");
}

function createText(texttype) {
    //clear screen
    $('#stuff')[0].innerHTML = texttype.toUpperCase() + ": ";
    //display text
    $('#stuff')[0].appendChild(document.createElement('br'));
    $('#stuff')[0].appendChild(document.createTextNode(Guppy.instances.guppy1.get_content(texttype)));
}

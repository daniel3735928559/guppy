var Keyboard = function(){
    this.is_mouse_down = false;

    /* keyboard behaviour definitions */

    // keys aside from 0-9,a-z,A-Z
    this.k_chars = {
	"+":"+",
	"-":"-",
	"*":"*",
	".":"."
    };
    this.k_text = {
	"/":"/",
	"*":"*",
	"(":"(",
	")":")",
	"<":"<",
	">":">",
	"|":"|",
	"!":"!",
	",":",",
	".":".",
	";":";",
	"=":"=",
	"[":"[",
	"]":"]",
	"@":"@",
	"'":"'",
	"`":"`",
	":":":",
	"\"":"\"",
	"?":"?",
	"space":" ",
    };
    this.k_controls = {
	"up":"up",
	"down":"down",
	"right":"right",
	"left":"left",
	"alt+k":"up",
	"alt+j":"down",
	"alt+l":"right",
	"alt+h":"left",
	"space":"spacebar",
	"home":"home",
	"end":"end",
	"backspace":"backspace",
	"del":"delete_key",
	"mod+a":"sel_all",
	"mod+c":"sel_copy",
	"mod+x":"sel_cut",
	"mod+v":"sel_paste",
	"mod+z":"undo",
	"mod+y":"redo",
	"enter":"done",
	"mod+shift+right":"list_extend_copy_right",
	"mod+shift+left":"list_extend_copy_left",
	",":"list_extend_right",
	";":"list_extend_down",
	"mod+right":"list_extend_right",
	"mod+left":"list_extend_left",
	"mod+up":"list_extend_up",
	"mod+down":"list_extend_down",
	"mod+shift+up":"list_extend_copy_up",
	"mod+shift+down":"list_extend_copy_down",
	"mod+backspace":"list_remove",
	"mod+shift+backspace":"list_remove_row",
	"shift+left":"sel_left",
	"shift+right":"sel_right",
	")":"right_paren",
	"\\":"backslash",
	"tab":"tab"
    };

    // Will populate keyboard shortcuts for symbols from symbol files
    this.k_syms = {};

    this.k_raw = "mod+space";
    
    var i = 0;

    // letters

    for(i = 65; i <= 90; i++){
	this.k_chars[String.fromCharCode(i).toLowerCase()] = String.fromCharCode(i).toLowerCase();
	this.k_chars['shift+'+String.fromCharCode(i).toLowerCase()] = String.fromCharCode(i).toUpperCase();
    }

    // numbers

    for(i = 48; i <= 57; i++)
	this.k_chars[String.fromCharCode(i)] = String.fromCharCode(i);

}


export default Keyboard;

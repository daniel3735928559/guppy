
// keys aside from 0-9,a-z,A-Z
kb = {};
kb.is_mouse_down = false;

kb.CARET = "\\cursor[-0.2ex]{0.7em}"
kb.TEMP_SMALL_CARET = "\\cursor[0em]{0.6em}"
kb.TEMP_CARET = "\\cursor[-0.2ex]{0.7em}"
kb.SMALL_CARET = "\\cursor[-0.05em]{0.5em}"
kb.SEL_CARET = "\\cursor[-0.2ex]{0.7em}"
kb.SMALL_SEL_CARET = "\\cursor[-0.05em]{0.5em}"
kb.SEL_COLOR = "red"

kb.symbols = {};
kb.k_chars = {
    "=":"=",
    "+":"+",
    "-":"-",
    "*":"*",
    ".":".",
    ",":",",
    "shift+/":"/",
    "shift+=":"+",
    "!":"!"
};
kb.k_syms = {
    "/":"slash",
    "^":"exp",
    "*":"*",
    "(":"paren",
    "<":"less",
    ">":"greater",
    "_":"sub",
    "|":"abs",
    "shift+up":"exp",
    "shift+down":"sub"
};
kb.k_controls = {
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

// letters

for(var i = 65; i <= 90; i++) {
    kb.k_chars[String.fromCharCode(i).toLowerCase()] = String.fromCharCode(i).toLowerCase();
    kb.k_chars['shift+'+String.fromCharCode(i).toLowerCase()] = String.fromCharCode(i).toUpperCase();
}

// numbers

for(var i = 48; i <= 57; i++)
    kb.k_chars[String.fromCharCode(i)] = String.fromCharCode(i);

module.exports = kb;


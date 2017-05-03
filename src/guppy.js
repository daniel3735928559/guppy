var Mousetrap = require('mousetrap');
//Guppy modules
var protodefs = [
    require('./selection_methods.js'),
    require('./insert_symbol.js'),
    require('./render_methods.js'),
    require('./manipulate_xml.js'),
    require('./proto_utils.js'),
    require('./key_methods.js'),
    require('./list_utils.js')
]
var guppydefs = [
    require('./init.js'),
    require('./transform.js'),
    require('./get_location.js'),
    require('./guppy_utils.js'),
    require('./mouse_methods.js')
]

String.prototype.splice = function(idx, s) { return (this.slice(0,idx) + s + this.slice(idx)); };
String.prototype.splicen = function(idx, s, n) { return (this.slice(0,idx) + s + this.slice(idx+n));};
String.prototype.search_at = function(idx, s) { return (this.substring(idx-s.length,idx) == s); };

var Guppy = function(guppy_div, config) {
    var self = this;
    var config = config || {};
    var events = config['events'] || {}
    var options = config['options'] || {};

    if (typeof guppy_div === 'string' || guppy_div instanceof String)
        guppy_div = document.getElementById(guppy_div);

    // Set the id on the div if it is not currently set.
    if ( ! guppy_div.id ) {
        var i = Guppy.max_uid || 0;
        while (document.getElementById("guppy_uid_"+i)) i++;
        Guppy.max_uid = i;
        guppy_div.id = "guppy_uid_"+i;
    }
    var i = Guppy.max_tabIndex || 0;
    guppy_div.tabIndex = i;
    Guppy.max_tabIndex = i+1;
    
    this.editor_active = true;
    this.empty_content = "\\color{red}{[?]}"
    this.editor = guppy_div;
    this.blacklist = [];
    this.autoreplace = true;
    this.ready = false;
    this.katexMode = 0;

    this.events = {};
    
    var evts = ["ready", "change", "left_end", "right_end", "done", "completion", "debug", "error", "focus"];
    
    for (var i = 0; i < evts.length; i++) {
        var e = evts[i];
        if (e in events) this.events[e] = e in events ? events[e] : null;
    }

    var opts = ["blank_caret", "empty_content", "blacklist", "autoreplace"];
    
    for (var i = 0; i < opts.length; i++) {
        var p = opts[i];
        if (p in options) this[p] = options[p];
    }
   
    this.base =  (new window.DOMParser()).parseFromString('xml_content' in options ? options.xml_content : "<m><e></e></m>", "text/xml");
    
    Guppy.instances[guppy_div.id] = this;
    
    this.clipboard = null;
    this.current = this.base.documentElement.firstChild;
    this.temp_cursor = {"node":null,"caret":0}
    if ( ! this.current.firstChild ) this.current.appendChild(this.base.createTextNode(""));
    this.caret = 0;
    this.space_caret = 0;
    this.sel_start = null;
    this.sel_end = null;
    this.undo_data = [];
    this.undo_now = -1;
    this.sel_status = Guppy.SEL_NONE;
    this.checkpoint();
    this.editor.addEventListener("keydown",Guppy.key_down, false);
    this.editor.addEventListener("keyup",Guppy.key_up, false);
    this.editor.addEventListener("focus", function(e) { Guppy.kb.alt_down = false; if (self.activate) self.activate();}, false);
    if (Guppy.ready && !this.ready) {
        this.ready = true;
        this.fire_event("ready");
        this.render(true);
    }
    this.deactivate();
    this.recompute_locations_paths();
}

Guppy.kb = require('./keyboard_defs.js');
for (var i = 0; i < protodefs.length; ++i) {
    defs = protodefs[i];
    for (var prop in defs) 
        if (defs.hasOwnProperty(prop))
            Guppy.prototype[prop] = defs[prop];
}
for (var i = 0; i < guppydefs.length; ++i) {
    defs = guppydefs[i];
    for (var prop in defs) 
        if (defs.hasOwnProperty(prop))
            Guppy[prop] = defs[prop];
}

Guppy.is_blank = function(n) {
    return n.firstChild == null || n.firstChild.nodeValue == '';
}

Guppy.register_keyboard_handlers = function() {
    Mousetrap.addKeycodes({173: '-'}); // Firefox's special minus (needed for _ = sub binding)
    for (var i in Guppy.kb.k_chars)
        Mousetrap.bind(i,function(i) { return function() {
            if (!Guppy.active_guppy) return true;
            if (i=='!') return Guppy.active_guppy.toggleMode(); 
            Guppy.active_guppy.temp_cursor.node = null;
            Guppy.active_guppy.insert_string(Guppy.kb.k_chars[i]);
            return false;
        }}(i));  
    for (var i in Guppy.kb.k_syms)
        Mousetrap.bind(i,function(i) { return function() {
            if (!Guppy.active_guppy || Guppy.active_guppy.current.parentNode.nodeName == 'm') return true;
            Guppy.active_guppy.temp_cursor.node = null;
            Guppy.active_guppy.space_caret = 0;
            Guppy.active_guppy.insert_symbol(Guppy.kb.k_syms[i]);
            return false;
        }}(i));
    for (var i in Guppy.kb.k_controls)
        Mousetrap.bind(i,function(i) { return function() {
            if (!Guppy.active_guppy) return true;
            Guppy.active_guppy.space_caret = 0;
            Guppy.active_guppy[Guppy.kb.k_controls[i]]();
            Guppy.active_guppy.temp_cursor.node = null;
            Guppy.active_guppy.render(["up","down","right","left","home","end","sel_left","sel_right"].indexOf(i) < 0);
            return false;
        }}(i));
}

module.exports = Guppy;


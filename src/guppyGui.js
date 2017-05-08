var katex = require('../lib/katex/katex-modified.min.js');
var Gui = function(guppy_gui_div, config) {
    config      =  config || {}
    var options =  config['options'] || {};
    var style   =  config['style']   || {};
    if (typeof guppy_gui_div === 'string' || guppy_gui_div instanceof String)
        guppy_gui_div = document.getElementById(guppy_gui_div);

    this.element = guppy_gui_div;
    //Format
    this.element.style['text-align'] = 'center';
    this.element.style['height'] = '100%'  ;
    this.element.style['overflow-y'] = 'auto'  ;
    for(var styleatt in style) {
        if (style.hasOwnProperty(styleatt))
            this.element.style[styleatt] = style[styleatt];
    }
  
    this.buttonSize = "5em";
    //Expanded: Button per symbol, all visible.
    this.style      = "Expanded"; 
    opts = ["buttonSize","style"];

    for(var i = 0; i< opts.length; ++i) {
        var option = opts[i];
        if (option in options)
            this[option] = options[option];
    }
    this.createButtons();
}

Gui.prototype.createButtons = function() {
    for (var i in Guppy.kb.symbols) {
        //Don't know what to do with this
        if (i=='mat')  continue
        var b = document.createElement("button"); 
        var render = Guppy.kb.symbols[i]["output"]["latex"];
        if (! (typeof render === 'string' || render instanceof String) ) render = render[0];
        else render = render.replace(/\$./g,'[]');
        b.innerHTML = katex.renderToString(render);
        b.style["display"] = "inline-block";
        b.style["width"]   = this.buttonSize;
        b.style["height"]  = this.buttonSize;

        b.addEventListener("mouseenter", function () {
            this.target = Guppy.active_guppy;
        });

        var closurize = function(symbol) {
            b.addEventListener("mousedown",function (e) {
                if (this.target) {
                    this.target.insert_symbol(symbol);
                    this.target.editor.focus();
                    this.target.activate();
                }
                e.stopPropagation();
            });
        }(i);
        this.element.appendChild(b);
    }
}

module.exports = {"Gui": Gui};


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
  
    this.buttonSize = "2.5em";
    //Expanded: Button per symbol, all visible.
    //Grouped : Menu selector for symbol types. #Default
    this.style      = "Grouped"; 
    opts = ["buttonSize","style"];
    
    for(var i = 0; i< opts.length; ++i) {
        var option = opts[i];
        if (option in options)
            this[option] = options[option];
    }
    if (this.style == "Grouped") this.createMenu()
    this.createButtons();
}

Gui.prototype.createMenu = function() {
    var menu    = document.createElement('select');
    var selects = Object.keys(Gui.types);
    var options = selects.length

    thisClosure = this;
    menu.addEventListener('change', function() {
        var gui = this.parentNode
        while(this.nextSibling)
            gui.removeChild(this.nextSibling);
        var type = this.options[this.selectedIndex].value;
        thisClosure.createButtons(type == "All" ? undefined : type);
    });

    for (var i = 0; i < options; ++i) {
        var select = document.createElement('option');
        select.value     = selects[i];
        select.innerHTML = selects[i];
        menu.appendChild(select)
    }
    menu.style["display"] = "block";
    menu.style["width"] =   "100%";
    this.element.appendChild(menu);
}

Gui.types = {
    "All"             : undefined,
    "Greek lowercase" : ["alpha","beta","gamma","delta","epsilon","zeta","eta","theta","iota","kappa","lambda","mu","nu","xi","omicron","pi","rho","sigma","tau","upsilon","phi","chi","psi","omega" ],
    "Greek uppercase" : ["Gamma","Delta","Theta","Lambda","Xi","Pi","Sigma","Phi","Psi","Omega" ],
	"Positions"       : ["paren","exp","sub","frac","vec"],
	"Functions"       : ["sin","cos","tan","sec","csc","cot","log","ln","sqrt","root"],
	"Operators"       : ["norm","abs","floor","int","defi","smi","smd","deriv","sum","cohom"],
    "Other"           : ["less","greater","leq","geq","infty","*"]
}

//Don't know what to do with these
Gui.skips = [ 'mat','text','sym_name','slash','diff' ];

Gui.prototype.createButtons = function(type) {
    for (var i in Guppy.kb.symbols) {
        if (Gui.skips.indexOf(i) > -1 || (type && Gui.types[type].indexOf(i) == -1))  continue
        var b = document.createElement("button"); 
        var render = Guppy.kb.symbols[i]["output"]["latex"];
        if (! (typeof render === 'string' || render instanceof String) ) render = render[0];
        else render = render.replace(/\$./g,'[]');
        b.innerHTML = katex.renderToString("\\tiny{"+render+"}");
        b.style["display"] = "inline-block";
        b.style["width"]   = this.buttonSize;
        b.style["height"]  = this.buttonSize;
        b.style["margin"]  = "0";
        b.style["padding"] = "0";
        b.style["vertical-align"] = "top";

        
        b.addEventListener("mouseleave", function () {
            clearTimeout(this.timeout)
            this.tooltip.style["visibility"] = "hidden";
        });

        closurize = function(symbol,bclose) {
            b.addEventListener("mousemove", function (e) {
                clearTimeout(this.timeout)
                this.tooltip.style["visibility"] = "hidden";
                
                this.timeout= setTimeout(function () {
                    bclose.tooltip.style["visibility"] = "visible";
                },1000)
                this.tooltip.style["left"] = (e.clientX+10)+'px';
                this.tooltip.style["top"]  = (e.clientY+10)+'px';
                this.target = Guppy.active_guppy;
            });

            b.addEventListener("mousedown",function (e) {
                if (this.target) {
                    this.target.insert_symbol(symbol);
                    this.target.editor.focus();
                    this.target.activate();
                }
                e.stopPropagation();
            });
        }(i,b);
        b.tooltip = this.createTooltip(i)
        this.element.appendChild(b);
        this.element.appendChild(b.tooltip);
    }
}

Gui.prototype.createTooltip = function(symbol) {
    var tooltip = document.createElement('div');
    tooltip.innerHTML           = '\\'+symbol;
    tooltip.style["visibility"] = "hidden";
    tooltip.style["margin"]     = "0";
    tooltip.style["padding"]    = "0";
    tooltip.style["border"]     = "1px solid gray";
    tooltip.style["background"] = "black";
    tooltip.style["color"]      = "white";
    tooltip.style["position"]   = "fixed";
    tooltip.style["z-index"]    = 1;
    return tooltip;
}

module.exports = {"Gui": Gui};


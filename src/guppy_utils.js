var GuppyUtils = {};

GuppyUtils.CARET = "\\cursor[-0.2ex]{0.7em}"
GuppyUtils.TEMP_SMALL_CARET = "\\cursor{0.7ex}"
GuppyUtils.TEMP_CARET = "\\cursor[-0.2ex]{0.7em}"
GuppyUtils.SMALL_CARET = "\\cursor{0.7ex}"
GuppyUtils.SEL_CARET = "\\cursor[-0.2ex]{0.7em}"
GuppyUtils.SMALL_SEL_CARET = "\\cursor{0.7ex}"
GuppyUtils.SEL_COLOR = "red"

GuppyUtils.is_blank = function(n){
    return n.firstChild == null || n.firstChild.nodeValue == '';
}

GuppyUtils.get_length = function(n){
    if(GuppyUtils.is_blank(n) || n.nodeName == 'f') return 0
    return n.firstChild.nodeValue.length;
}

GuppyUtils.path_to = function(n){
    var name = n.nodeName;
    if(name == "m") return "guppy_loc_m";
    var ns = 0;
    for(var nn = n; nn != null; nn = nn.previousSibling) if(nn.nodeType == 1 && nn.nodeName == name) ns++;
    return GuppyUtils.path_to(n.parentNode)+"_"+name+""+ns;
}

GuppyUtils.is_text = function(nn){
    return nn.parentNode.hasAttribute("mode") && (nn.parentNode.getAttribute("mode") == "text" || nn.parentNode.getAttribute("mode") == "symbol");
}

GuppyUtils.is_symbol = function(nn){
    return nn.parentNode.getAttribute("mode") && nn.parentNode.getAttribute("mode") == "symbol";
}

GuppyUtils.is_small = function(nn){
    var n = nn.parentNode;
    while(n != null && n.nodeName != 'm'){
	if(n.getAttribute("small") == "yes"){
	    return true;
	}
	n = n.parentNode
	while(n != null && n.nodeName != 'c')
	    n = n.parentNode;
    }
    return false;
}

module.exports = GuppyUtils;

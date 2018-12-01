var Utils = {};

Utils.CARET = "\\xmlClass{cursor}{\\hspace{0pt}}";
Utils.TEMP_SMALL_CARET = "\\xmlClass{cursor}{\\hspace{0pt}}";
Utils.TEMP_CARET = "\\xmlClass{cursor}{\\hspace{0pt}}";
Utils.SMALL_CARET = "\\xmlClass{cursor}{\\hspace{0pt}}";
Utils.SEL_CARET = "\\xmlClass{cursor}{\\hspace{0pt}}";
Utils.SMALL_SEL_CARET = "\\xmlClass{cursor}{\\hspace{0pt}}";
Utils.SEL_COLOR = "red";

Utils.is_blank = function(n){
    return n.firstChild == null || n.firstChild.nodeValue == '';
}

Utils.get_length = function(n){
    if(Utils.is_blank(n) || n.nodeName == 'f') return 0
    return n.firstChild.nodeValue.length;
}

Utils.path_to = function(n){
    var name = n.nodeName;
    if(name == "m") return "guppy_loc_m";
    var ns = 0;
    for(var nn = n; nn != null; nn = nn.previousSibling) if(nn.nodeType == 1 && nn.nodeName == name) ns++;
    return Utils.path_to(n.parentNode)+"_"+name+""+ns;
}

Utils.is_text = function(nn){
    return nn.parentNode.hasAttribute("mode") && (nn.parentNode.getAttribute("mode") == "text" || nn.parentNode.getAttribute("mode") == "symbol");
}

Utils.is_char = function(nn){
    for(var n = nn.firstChild; n; n = n.nextSibling){
	if(n.nodeName == "c" || n.nodeName == "l") return false;
    }
    return true;
}

Utils.is_symbol = function(nn){
    return nn.parentNode.getAttribute("mode") && nn.parentNode.getAttribute("mode") == "symbol";
}

Utils.is_utf8entry = function(nn){
    return nn.parentNode.getAttribute("utf8") && nn.parentNode.getAttribute("utf8") == "entry";
}

Utils.is_small = function(nn){
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

export default Utils;

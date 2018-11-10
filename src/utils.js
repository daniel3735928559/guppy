var Utils = {};

Utils.CARET = "\\cursor[-0.2ex]{0.7em}"
Utils.TEMP_SMALL_CARET = "\\cursor{0.7ex}"
Utils.TEMP_CARET = "\\cursor[-0.2ex]{0.7em}"
Utils.SMALL_CARET = "\\cursor{0.7ex}"
Utils.SEL_CARET = "\\cursor[-0.2ex]{0.7em}"
Utils.SMALL_SEL_CARET = "\\cursor{0.7ex}"
Utils.SEL_COLOR = "red"

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

Utils.xhr_request = function ( uri, callback ) {
  return new Promise ((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var response = JSON.parse(this.responseText);
                resolve(response)
            } else {
                reject(request.statusText);
            }
        }
    };
    request.open("get", uri, true);
    request.send();
  })
}

export default Utils;

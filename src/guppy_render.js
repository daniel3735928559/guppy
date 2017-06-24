katex = require('../lib/katex/katex-modified.min.js');
GuppyDoc = require('./guppy_doc.js');

function guppy_render(){
    var l = document.getElementsByTagName("script");
    var ans = []
    for(var i = 0; i < l.length; i++){
	if(l[i].getAttribute("type") == "text/guppy_xml"){
	    var n = l[i];
	    var d = new GuppyDoc(n.innerHTML);
	    var s = document.createElement("span");
	    s.setAttribute("id","eqn1_render");
	    katex.render(d.get_content("latex"), s);
	    n.parentNode.replaceChild(s, n);
	    ans.push({"container":s, "doc":d})
	}
    }
    return ans;
}

module.exports = guppy_render;

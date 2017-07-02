katex = require('../lib/katex/katex-modified.min.js');
GuppyDoc = require('./guppy_doc.js');

GuppyRender = {}

GuppyRender.render_all = function(){
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

GuppyRender.render = function(doc, target_id){
    var d = new GuppyDoc(doc);
    var target = document.getElementById(target_id);
    katex.render(d.get_content("latex"), target);
    return {"container":target, "doc":d};
}

module.exports = GuppyRender;

var katex = require('../lib/katex/katex-modified.min.js');
var GuppyDoc = require('./guppy_doc.js');

/**
   @class
   @classdesc Utility methods for rendering documents in HTML
 */
var GuppyRender = {}


/** 
    Render all guppy documents on the page. 
    @memberof GuppyRender
*/
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
            n.parentNode.insertBefore(s, n);
            ans.push({"container":s, "doc":d})
        }
    }
    return ans;
}

/** 
    Render a given document into a specified HTML element.
    @param {string} doc - A GuppyXML string to be rendered
    @param {string} target_id - The ID of the HTML element to render into
    @memberof GuppyRender
*/
GuppyRender.render = function(doc, target_id){
    var d = new GuppyDoc(doc);
    var target = document.getElementById(target_id);
    katex.render(d.get_content("latex"), target);
    return {"container":target, "doc":d};
}

module.exports = GuppyRender;

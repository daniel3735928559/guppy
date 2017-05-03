module.exports = {
    'transform' : function(t, base, r) {
        var result = [];
        for(var n = base.firstChild.firstChild; n != null; n = n.nextSibling)
            if (n.nodeName == 'T')
                result.push(Guppy.manual_render(base,t,n,r));
            else
                result.push(Guppy.manual_render(base,t,n,r));
        return result;
    },

    'bracket_xpath' : "(count(./*) != 1 and not \
                      ( \
                                count(./e)=2 and \
                    count(./f)=1 and \
                    count(./e[string-length(text())=0])=2 and \
                    ( \
                      (\
                                    count(./f/c)=1 and\
                        count(./f/c[@is_bracket='yes'])=1\
                      )\
                      or\
                      (\
                        f/@c='yes' and \
                    count(./e[@current='yes'])=0 and \
                    count(./e[@temp='yes'])=0 \
                      )\
                    )\
                  )\
                )  \
                or\
                    (\
                  count(./*) = 1 and \
                  string-length(./e/text()) != 1 and \
                  number(./e/text()) != ./e/text() \
                ) \
                or \
                    ( \
                  count(./*) = 1 and \
                  ./e/@current = 'yes' \
                ) \
                or \
                    ( \
                  count(./*) = 1 and \
                  ./e/@temp = 'yes' \
                )",
    
    //*///Fix VIM coloring due to comment in mess above
    'manual_render' : function(base,t,n,r) {
        var ans = "";
        if (n.nodeName == "e") {
            if (t == "latex" && r)
                ans = n.getAttribute("render");
            else
                ans = n.firstChild.textContent;
        } else if (n.nodeName == "f") {
            for(var nn = n.firstChild; nn != null; nn = nn.nextSibling) {
                if (nn.nodeName == "b" && nn.getAttribute("p") == t) {
                    ans = Guppy.manual_render(base,t,nn,r);
                    break;
                }
            }
        } else if (n.nodeName == "b") {
            var cs = []
            var i = 1;
            var par = n.parentNode;
            for(var nn = par.firstChild; nn != null; nn = nn.nextSibling)
                if (nn.nodeName == "c" || nn.nodeName == "l") cs[i++] = Guppy.manual_render(base,t,nn,r);
            for(var nn = n.firstChild; nn != null; nn = nn.nextSibling) {
                if (nn.nodeType == 3) ans += nn.textContent;
                else if (nn.nodeType == 1) {
                    if (nn.hasAttribute("d")) {
                        var dim = parseInt(nn.getAttribute("d"));
                        var joiner = function(d,l) {
                            if (d > 1) for (var k = 0; k < l.length; k++) l[k] = joiner(d-1,l[k]);
                            return l.join(nn.getAttribute('sep'+(d-1)));
                        }
                        ans += joiner(dim,cs[parseInt(nn.getAttribute("ref"))]);
                    }
                    else ans += cs[parseInt(nn.getAttribute("ref"))];
                }
            }
        } else if (n.nodeName == "l") {
            ans = [];
            var i = 0;
            for(var nn = n.firstChild; nn != null; nn = nn.nextSibling)
                ans[i++] = Guppy.manual_render(base,t,nn,r);
        } else if (n.nodeName == "c" || n.nodeName == "m") {
            for(var nn = n.firstChild; nn != null; nn = nn.nextSibling)
                ans += Guppy.manual_render(base,t,nn,r);
            if (t == "latex" && n.getAttribute("bracket") == "yes" &&
                base.evaluate(Guppy.bracket_xpath, n, null, XPathResult.BOOLEAN_TYPE, null).booleanValue) {
                ans = "\\left("+ans+"\\right)";
            }
        } else if (n.nodeName == "T") {
            for(var nn = n.firstChild; nn != null; nn = nn.nextSibling)
                ans += Guppy.manual_render(base,t,nn,r);
        }
        return ans;
    }
}
//Exports end


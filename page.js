
var tests = ["q+p \\cdot i",
	     "(x+1)(x+3)",
	     "2(\\cos(3x))^2+\\sin(\\pi x)",
	     "\\dfrac{-b+\\sqrt{b^2-4ac}}{2a}",
	     "\\dfrac{4}{3}\\pi R^3",
	     "\\frac{1}{2} + \\frac{1}{3} + \\frac{1}{4}",
	     "\\dfrac{1}{\\dfrac{1}{R_1}+\\dfrac{1}{R_2}}",
	     "1+\\dfrac{1}{2+\\dfrac{1}{1+\\dfrac{1}{3}}}",
	     "\\displaystyle\\int_0^x \\sqrt{1-t^2}dt",
	     "\\displaystyle\\int_{x^3}^{x^2} \\sqrt{1-(\\tan(t))^2}dt"];
function make_user_test(s,i,p){
    var d = document.createElement("div");
    p.appendChild(d);
    p.appendChild(document.createElement("br"));
    katex.render("("+i+"): "+s,d);
}
var test_div = document.getElementById("tests");
for(var i = 0; i < tests.length; i++){
    make_user_test(tests[i],i+1,test_div);
}
function toggle_div(divid){
    var s = document.getElementById(divid);
    if(s.style.display == 'none') s.style.display = "inline-block";
    else s.style.display = 'none'
}

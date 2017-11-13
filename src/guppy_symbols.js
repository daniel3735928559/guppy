GuppySymbols = {"symbols":{}};

GuppySymbols.eval_template = function(template, name, args){
    args['name'] = name;
    if(Object.prototype.toString.call(template) == "[object String]"){
	var ans = template;
	for(var name in args){
	    ans = ans.replace(new RegExp("\\{\\$"+name+"\\}"),args[name]);
	}
	return ans;
    }
    else{
	for(var x in template) {
	    template[x] = GuppySymbols.eval_template(template[x], name, args)
	}
	return template;
    }
}

module.exports = GuppySymbols;

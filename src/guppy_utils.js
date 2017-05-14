module.exports = {
    'symb_raw' : function(symb_name,latex_symb,text_symb) {
        Guppy.kb.symbols[symb_name] = {
            "output":{
                "latex":[latex_symb],
                "text" :[text_symb]
            },
            "char"  :true,
            "type"  :symb_name
         };
    },
    
    'symb_func' : function(func_name) {
        Guppy.kb.symbols[func_name] = {"output":{"latex":"\\"+func_name+"\\left({$1}\\right)",
            "text":func_name+"({$1})"},
            "type":func_name,
            "attrs": { 
                "delete":[1]
            }
        };
    }
}
//Exports ned


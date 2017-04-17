module.exports = {
    'instances' :  {},
    'ready' :  false,
    
    'active_guppy' :  null,
    
    'SEL_NONE' :  0,
    'SEL_CURSOR_AT_START' :  1,
    'SEL_CURSOR_AT_END' :  2,
    
    'get_symbols' :  function(symbols, callback) {
        var all_ready = function() {
           Guppy.register_keyboard_handlers();
           for (var i in Guppy.instances) {
               Guppy.instances[i].ready = true;
               Guppy.instances[i].render(true);
               Guppy.instances[i].fire_event("ready")
               Guppy.instances[i].events["ready"] = null;
           }
           Guppy.ready = true;
           if (callback) callback();
        };
        var get_builtins = function(callback) {
            var greek_syms = ["alpha","beta","gamma","delta","epsilon","zeta","eta","theta","iota","kappa","lambda","mu","nu","xi","omicron","pi","rho","sigma","tau","upsilon","phi","chi","psi","omega","Gamma","Delta","Theta","Lambda","Xi","Pi","Sigma","Phi","Psi","Omega"];
            var raw_syms = ["leq","geq","infty"];
            var func_syms = ["sin","cos","tan","sec","csc","cot","log","ln"];
            var other_syms = {"less":["<","<"],"greater":[">",">"]};
            
            for (var i = 0; i < greek_syms.length; i++) 
                Guppy.symb_raw(greek_syms[i],"{\\"+greek_syms[i]+"}"," $"+greek_syms[i]+" ");
            
            for (var i = 0; i < raw_syms.length; i++) 
                Guppy.symb_raw(raw_syms[i],"{\\"+raw_syms[i]+"}"," "+raw_syms[i]+" ");
            
            for (var i = 0; i < func_syms.length; i++) 
                Guppy.symb_func(func_syms[i]);
            
            for (var i in other_syms) 
                Guppy.symb_raw(i, other_syms[i][0], other_syms[i][1]);
            
            Guppy.symb_raw("*","\\cdot ","*");
            if (callback) callback();
        };
    
        if ( ! Array.isArray(symbols) )
            symbols = [symbols];
        
        var answers = [];
        var calls = [];
        var set_symbols = function() {
            for (var i = 0; i < answers.length; i++) {
                for (var s in answers[i])
                    Guppy.kb.symbols[s] = answers[i][s];
            }
            if (callback) callback();
        }
        for (var i = 0; i < symbols.length; i++) {
            answers.push(null);
            if (symbols[i] == "builtins") {
                calls.push(get_builtins);
                continue;
            }
            var x = function outer(j) {
                return function(callback) {
                    var req = new XMLHttpRequest();
                    req.onload = function() {
                        var syms = JSON.parse(this.responseText);
                        for (var s in syms) {
                        Guppy.kb.symbols[s] = syms[s];
                        }
                        callback();
                    };
                    req.open("get", symbols[j], true);
                    req.send();
                }
            }(i);
            calls.push(x);
        }
        calls.push(all_ready);
        var j = 0;
        var cb = function() {
            j += 1;
            if (j < calls.length) calls[j](cb);
        }
        if (calls.length > 0) calls[0](cb);
    }
}
//Exports end


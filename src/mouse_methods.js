module.exports = {
    'mouse_up' : function(e) {
        Guppy.kb.is_mouse_down = false;
        var g = Guppy.active_guppy;
        if (g) g.render(true);
    },
    
    'mouse_down' : function(e) {
        var n = e.target;
        Guppy.kb.is_mouse_down = true;
        if (e.target == document.getElementById("toggle_ref")) toggle_div("help_card");
        else while (n != null) {
            if (n.id in Guppy.instances) {
                e.preventDefault();
                var prev_active = Guppy.active_guppy;
                for (var i in Guppy.instances) {
                    if (i != n.id) Guppy.instances[i].deactivate();
                    Guppy.active_guppy = Guppy.instances[n.id];
                    Guppy.active_guppy.activate();
                }
                var g = Guppy.active_guppy;
                g.space_caret = 0;
                if (prev_active == g) {
                    if (e.shiftKey) {
                       g.select_to(e.clientX, e.clientY, true);
                    } else {
                        var loc = Guppy.get_loc(e.clientX,e.clientY);
                        if (!loc) return;
                        g.current = loc.current;
                        g.caret = loc.caret;
                        g.sel_status = Guppy.SEL_NONE;
                    }
                    g.render(true);
               }
               return;
            }
            n = n.parentNode;
        }
        Guppy.active_guppy = null;
        for (var i in Guppy.instances) {
            Guppy.instances[i].deactivate();
        }
    },
    
    'mouse_move' : function(e) {
        var g = Guppy.active_guppy;
        if (!g) return;
        if (!Guppy.kb.is_mouse_down) {
            var bb = g.editor;
            var rect = bb.getBoundingClientRect();
            if ((e.clientX < rect.left || e.clientX > rect.right) || (e.clientY > rect.bottom || e.clientY < rect.top)) {
                g.temp_cursor = {"node":null,"caret":0};
            } else {
                var loc = Guppy.get_loc(e.clientX,e.clientY);
                if (!loc) return;
                g.temp_cursor = {"node":loc.current,"caret":loc.caret};
            }
            g.render(g.is_changed());
        } else {
            g.select_to(e.clientX,e.clientY, true);
            g.render(g.is_changed());
        }
    }
}
//Exports end

window.addEventListener("mousedown",module.exports.mouse_down, false);
window.addEventListener("mouseup"  ,module.exports.mouse_up, false);
window.addEventListener("mousemove",module.exports.mouse_move, false);


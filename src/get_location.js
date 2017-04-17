module.exports = {
    'get_loc' : function(x,y,current_node,current_caret) {
        var g = Guppy.active_guppy;
        var min_dist = -1;
        var mid_dist = 0;
        var pos = "";
        var opt = null;
        var cur = null;
        var car = null;
        // check if we go to first or last element
        var bb = g.editor.getElementsByClassName("katex")[0];
        if (!bb) return;
            var rect = bb.getBoundingClientRect();
        if (current_node) {
            var current_path = g.path_to(current_node);
            var current_pos = parseInt(current_path.substring(current_path.lastIndexOf("e")+1));
        }
    
        var boxes = g.boxes;
        if (! boxes) return;
        if (current_node) {
            current_path = current_path.replace(/e[0-9]+$/,"e");
            var boxes2 = [];
            for(var i = 0; i < boxes.length; i++) {
                if (boxes[i].path == "all") continue;
                var loc = boxes[i].path.substring(0,boxes[i].path.lastIndexOf("_"));
                loc = loc.replace(/e[0-9]+$/,"e");
                if (loc == current_path) {
                boxes2.push(boxes[i]);
                }
            }
            boxes = boxes2;
        }
        if (!boxes) return;
        for (var i = 0; i < boxes.length; i++) {
            var box = boxes[i];
            if (box.path == "all") {
                if (!opt) opt = {'path':'guppy_loc_m_e1_0'};
                continue;
            }
            var xdist = Math.max(box.left - x, x - box.right, 0)
            var ydist = Math.max(box.top - y, y - box.bottom, 0)
            var dist = Math.sqrt(xdist*xdist + ydist*ydist);
            if (min_dist == -1 || dist < min_dist) {
                min_dist = dist;
                mid_dist = x - box.mid_x;
                opt = box;
            }
        }
        var loc = opt.path.substring("guppy_loc".length);
        loc = loc.replace(/_/g,"/");
        loc = loc.replace(/([0-9]+)(?=.*?\/)/g,"[$1]");
        cur = g.base.evaluate(loc.substring(0,loc.lastIndexOf("/")), 
                              g.base.documentElement, null, 
                              XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        car = parseInt(loc.substring(loc.lastIndexOf("/")+1));
        // Check if we want the cursor before or after the element
        if (mid_dist > 0 && !(opt.blank)) {
            car++;
        }
        ans = {"current":cur,"caret":car,"pos":pos};
        if (current_node && opt) {
            var opt_pos = parseInt(opt.path.substring(opt.path.lastIndexOf("e")+1,opt.path.lastIndexOf("_")));
            if (opt_pos < current_pos) pos = "left";
            else if (opt_pos > current_pos) pos = "right";
            else if (car < current_caret) pos = "left";
            else if (car > current_caret) pos = "right";
            if (pos) ans['pos'] = pos;
            else ans['pos'] = "none";
        }
        return ans;
    }
}
//Exports end


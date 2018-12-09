var g1
window.onload = function() {
    output_type = "latex";
    document.getElementById("sample_output").readOnly = true;
    Guppy.event("change", update_output);
    Guppy.event("completion", completion);
    Guppy.configure("empty_content", "{\\text{Click to start typing math!}}");
    Guppy.use_osk(new GuppyOSK({"goto_tab":"qwerty"}));
    Guppy.configure("buttons", ["osk","settings","symbols","controls"]);
    g1 = new Guppy("guppy1");
};

function select_output(t){
    output_type = t;
    update_output({"target": g1});
    var l = document.getElementsByClassName("output-select");
    for(var i = 0; i < l.length; i++){
      var new_class = l[i].getAttribute("class").replace(new RegExp("output-selected","g"),"output-unselected");
      l[i].setAttribute("class", new_class);
    }
    var cur = document.getElementById("output_"+t);
    var new_class = cur.getAttribute("class").replace(new RegExp("output-unselected","g"),"output-selected");
    cur.setAttribute("class", new_class);
}

function update_output(e){
    try{
      content = e.target.engine.get_content(output_type)+"";
      if(content.replace(/\s/g,"").length == 0) content = "Output " + output_type + " will appear here";
      document.getElementById("sample_output").value = content;
    }
    catch(e){
    	document.getElementById("sample_output").value = "Failed to parse input";
    	console.log(e.stack);
    }
}

function completion(e) {
    document.getElementById("sample_output").value = e.candidates.join(", ");
}


(function(stringFromCharCode) {
    var fromCodePoint = function(_) {
	var codeUnits = [], codeLen = 0, result = "";
	for (var index=0, len = arguments.length; index !== len; ++index) {
            var codePoint = +arguments[index];
            // correctly handles all cases including `NaN`, `-Infinity`, `+Infinity`
            // The surrounding `!(...)` is required to correctly handle `NaN` cases
            // The (codePoint>>>0) === codePoint clause handles decimals and negatives
            if (!(codePoint < 0x10FFFF && (codePoint>>>0) === codePoint))
		throw RangeError("Invalid code point: " + codePoint);
            if (codePoint <= 0xFFFF) { // BMP code point
		codeLen = codeUnits.push(codePoint);
            } else { // Astral code point; split in surrogate halves
		// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
		codePoint -= 0x10000;
		codeLen = codeUnits.push(
		    (codePoint >> 10) + 0xD800,  // highSurrogate
		    (codePoint % 0x400) + 0xDC00 // lowSurrogate
		);
            }
            if (codeLen >= 0x3fff) {
		result += stringFromCharCode.apply(null, codeUnits);
		codeUnits.length = 0;
            }
	}
	return result + stringFromCharCode.apply(null, codeUnits);
    };
    try { // IE 8 only supports `Object.defineProperty` on DOM elements
	Object.defineProperty(String, "fromCharCode", {
            "value": fromCodePoint, "configurable": true, "writable": true
	});
    } catch(e) {
	String.fromCharCode = fromCodePoint;
    }
}(String.fromCharCode));

/*! https://mths.be/codepointat v0.2.0 by @mathias */
(function(stringCharCodeAt) {
    'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
    var defineProperty = (function() {
	// IE 8 only supports `Object.defineProperty` on DOM elements
	try {
            var object = {};
            var $defineProperty = Object.defineProperty;
            var result = $defineProperty(object, object, object) && $defineProperty;
	} catch(error) {}
	return result;
    }());
    var codePointAt = function(position) {
	if (this == null) {
            throw TypeError();
	}
	var string = String(this);
	var size = string.length;
	// `ToInteger`
	var index = position ? Number(position) : 0;
	if (index != index) { // better `isNaN`
            index = 0;
	}
	// Account for out-of-bounds indices:
	if (index < 0 || index >= size) {
            return undefined;
	}
	// Get the first code unit
	var first = stringCharCodeAt(index);
	var second;
	if ( // check if it’s the start of a surrogate pair
            first >= 0xD800 && first <= 0xDBFF && // high surrogate
		size > index + 1 // there is a next code unit
	) {
            second = stringCharCodeAt(index + 1);
            if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
		// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
		return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
            }
	}
	return first;
    };
    if (defineProperty) {
	defineProperty(String, 'charCodeAt', {
            'value': codePointAt,
            'configurable': true,
            'writable': true
	});
    } else {
	String.charCodeAt = codePointAt;
    }
}(String.charCodeAt));

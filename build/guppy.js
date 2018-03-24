(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Guppy = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function(e){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=e()}else if(typeof define==="function"&&define.amd){define([],e)}else{var t;if(typeof window!=="undefined"){t=window}else if(typeof global!=="undefined"){t=global}else if(typeof self!=="undefined"){t=self}else{t=this}t.katex=e()}})(function(){var e,t,r;return function e(t,r,a){function n(l,u){if(!r[l]){if(!t[l]){var o=typeof require=="function"&&require;if(!u&&o)return o(l,!0);if(i)return i(l,!0);var s=new Error("Cannot find module '"+l+"'");throw s.code="MODULE_NOT_FOUND",s}var f=r[l]={exports:{}};t[l][0].call(f.exports,function(e){var r=t[l][1][e];return n(r?r:e)},f,f.exports,e,t,r,a)}return r[l].exports}var i=typeof require=="function"&&require;for(var l=0;l<a.length;l++)n(a[l]);return n}({1:[function(e,t,r){"use strict";var a=e("./src/ParseError");var n=h(a);var i=e("./src/Settings");var l=h(i);var u=e("./src/buildTree");var o=h(u);var s=e("./src/parseTree");var f=h(s);var d=e("./src/utils");var c=h(d);function h(e){return e&&e.__esModule?e:{default:e}}var v=function e(t,r,a){c.default.clearNode(r);var n=g(t,a).toNode();r.appendChild(n)};if(typeof document!=="undefined"){if(document.compatMode!=="CSS1Compat"){typeof console!=="undefined"&&console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your "+"website has a suitable doctype.");v=function e(){throw new n.default("KaTeX doesn't work in quirks mode.")}}}var p=function e(t,r){var a=g(t,r).toMarkup();return a};var m=function e(t,r){var a=new l.default(r);return(0,f.default)(t,a)};var g=function e(t,r){var a=new l.default(r);var n=(0,f.default)(t,a);return(0,o.default)(n,t,a)};t.exports={render:v,renderToString:p,__parse:m,__getBuildTree:g,ParseError:n.default}},{"./src/ParseError":84,"./src/Settings":87,"./src/buildTree":94,"./src/parseTree":122,"./src/utils":128}],2:[function(e,t,r){t.exports={default:e("core-js/library/fn/array/from"),__esModule:true}},{"core-js/library/fn/array/from":12}],3:[function(e,t,r){t.exports={default:e("core-js/library/fn/get-iterator"),__esModule:true}},{"core-js/library/fn/get-iterator":13}],4:[function(e,t,r){t.exports={default:e("core-js/library/fn/is-iterable"),__esModule:true}},{"core-js/library/fn/is-iterable":14}],5:[function(e,t,r){t.exports={default:e("core-js/library/fn/json/stringify"),__esModule:true}},{"core-js/library/fn/json/stringify":15}],6:[function(e,t,r){t.exports={default:e("core-js/library/fn/object/define-property"),__esModule:true}},{"core-js/library/fn/object/define-property":16}],7:[function(e,t,r){t.exports={default:e("core-js/library/fn/object/freeze"),__esModule:true}},{"core-js/library/fn/object/freeze":17}],8:[function(e,t,r){"use strict";r.__esModule=true;r.default=function(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}},{}],9:[function(e,t,r){"use strict";r.__esModule=true;var a=e("../core-js/object/define-property");var n=i(a);function i(e){return e&&e.__esModule?e:{default:e}}r.default=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||false;a.configurable=true;if("value"in a)a.writable=true;(0,n.default)(e,a.key,a)}}return function(t,r,a){if(r)e(t.prototype,r);if(a)e(t,a);return t}}()},{"../core-js/object/define-property":6}],10:[function(e,t,r){"use strict";r.__esModule=true;var a=e("../core-js/is-iterable");var n=u(a);var i=e("../core-js/get-iterator");var l=u(i);function u(e){return e&&e.__esModule?e:{default:e}}r.default=function(){function e(e,t){var r=[];var a=true;var n=false;var i=undefined;try{for(var u=(0,l.default)(e),o;!(a=(o=u.next()).done);a=true){r.push(o.value);if(t&&r.length===t)break}}catch(e){n=true;i=e}finally{try{if(!a&&u["return"])u["return"]()}finally{if(n)throw i}}return r}return function(t,r){if(Array.isArray(t)){return t}else if((0,n.default)(Object(t))){return e(t,r)}else{throw new TypeError("Invalid attempt to destructure non-iterable instance")}}}()},{"../core-js/get-iterator":3,"../core-js/is-iterable":4}],11:[function(e,t,r){"use strict";r.__esModule=true;var a=e("../core-js/array/from");var n=i(a);function i(e){return e&&e.__esModule?e:{default:e}}r.default=function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++){r[t]=e[t]}return r}else{return(0,n.default)(e)}}},{"../core-js/array/from":2}],12:[function(e,t,r){e("../../modules/es6.string.iterator");e("../../modules/es6.array.from");t.exports=e("../../modules/_core").Array.from},{"../../modules/_core":24,"../../modules/es6.array.from":73,"../../modules/es6.string.iterator":77}],13:[function(e,t,r){e("../modules/web.dom.iterable");e("../modules/es6.string.iterator");t.exports=e("../modules/core.get-iterator")},{"../modules/core.get-iterator":71,"../modules/es6.string.iterator":77,"../modules/web.dom.iterable":78}],14:[function(e,t,r){e("../modules/web.dom.iterable");e("../modules/es6.string.iterator");t.exports=e("../modules/core.is-iterable")},{"../modules/core.is-iterable":72,"../modules/es6.string.iterator":77,"../modules/web.dom.iterable":78}],15:[function(e,t,r){var a=e("../../modules/_core"),n=a.JSON||(a.JSON={stringify:JSON.stringify});t.exports=function e(t){return n.stringify.apply(n,arguments)}},{"../../modules/_core":24}],16:[function(e,t,r){e("../../modules/es6.object.define-property");var a=e("../../modules/_core").Object;t.exports=function e(t,r,n){return a.defineProperty(t,r,n)}},{"../../modules/_core":24,"../../modules/es6.object.define-property":75}],17:[function(e,t,r){e("../../modules/es6.object.freeze");t.exports=e("../../modules/_core").Object.freeze},{"../../modules/_core":24,"../../modules/es6.object.freeze":76}],18:[function(e,t,r){t.exports=function(e){if(typeof e!="function")throw TypeError(e+" is not a function!");return e}},{}],19:[function(e,t,r){t.exports=function(){}},{}],20:[function(e,t,r){var a=e("./_is-object");t.exports=function(e){if(!a(e))throw TypeError(e+" is not an object!");return e}},{"./_is-object":40}],21:[function(e,t,r){var a=e("./_to-iobject"),n=e("./_to-length"),i=e("./_to-index");t.exports=function(e){return function(t,r,l){var u=a(t),o=n(u.length),s=i(l,o),f;if(e&&r!=r)while(o>s){f=u[s++];if(f!=f)return true}else for(;o>s;s++)if(e||s in u){if(u[s]===r)return e||s||0}return!e&&-1}}},{"./_to-index":62,"./_to-iobject":64,"./_to-length":65}],22:[function(e,t,r){var a=e("./_cof"),n=e("./_wks")("toStringTag"),i=a(function(){return arguments}())=="Arguments";var l=function(e,t){try{return e[t]}catch(e){}};t.exports=function(e){var t,r,u;return e===undefined?"Undefined":e===null?"Null":typeof(r=l(t=Object(e),n))=="string"?r:i?a(t):(u=a(t))=="Object"&&typeof t.callee=="function"?"Arguments":u}},{"./_cof":23,"./_wks":69}],23:[function(e,t,r){var a={}.toString;t.exports=function(e){return a.call(e).slice(8,-1)}},{}],24:[function(e,t,r){var a=t.exports={version:"2.4.0"};if(typeof __e=="number")__e=a},{}],25:[function(e,t,r){"use strict";var a=e("./_object-dp"),n=e("./_property-desc");t.exports=function(e,t,r){if(t in e)a.f(e,t,n(0,r));else e[t]=r}},{"./_object-dp":50,"./_property-desc":56}],26:[function(e,t,r){var a=e("./_a-function");t.exports=function(e,t,r){a(e);if(t===undefined)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,a){return e.call(t,r,a)};case 3:return function(r,a,n){return e.call(t,r,a,n)}}return function(){return e.apply(t,arguments)}}},{"./_a-function":18}],27:[function(e,t,r){t.exports=function(e){if(e==undefined)throw TypeError("Can't call method on  "+e);return e}},{}],28:[function(e,t,r){t.exports=!e("./_fails")(function(){return Object.defineProperty({},"a",{get:function(){return 7}}).a!=7})},{"./_fails":32}],29:[function(e,t,r){var a=e("./_is-object"),n=e("./_global").document,i=a(n)&&a(n.createElement);t.exports=function(e){return i?n.createElement(e):{}}},{"./_global":33,"./_is-object":40}],30:[function(e,t,r){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},{}],31:[function(e,t,r){var a=e("./_global"),n=e("./_core"),i=e("./_ctx"),l=e("./_hide"),u="prototype";var o=function(e,t,r){var s=e&o.F,f=e&o.G,d=e&o.S,c=e&o.P,h=e&o.B,v=e&o.W,p=f?n:n[t]||(n[t]={}),m=p[u],g=f?a:d?a[t]:(a[t]||{})[u],b,y,x;if(f)r=t;for(b in r){y=!s&&g&&g[b]!==undefined;if(y&&b in p)continue;x=y?g[b]:r[b];p[b]=f&&typeof g[b]!="function"?r[b]:h&&y?i(x,a):v&&g[b]==x?function(e){var t=function(t,r,a){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,r)}return new e(t,r,a)}return e.apply(this,arguments)};t[u]=e[u];return t}(x):c&&typeof x=="function"?i(Function.call,x):x;if(c){(p.virtual||(p.virtual={}))[b]=x;if(e&o.R&&m&&!m[b])l(m,b,x)}}};o.F=1;o.G=2;o.S=4;o.P=8;o.B=16;o.W=32;o.U=64;o.R=128;t.exports=o},{"./_core":24,"./_ctx":26,"./_global":33,"./_hide":35}],32:[function(e,t,r){t.exports=function(e){try{return!!e()}catch(e){return true}}},{}],33:[function(e,t,r){var a=t.exports=typeof window!="undefined"&&window.Math==Math?window:typeof self!="undefined"&&self.Math==Math?self:Function("return this")();if(typeof __g=="number")__g=a},{}],34:[function(e,t,r){var a={}.hasOwnProperty;t.exports=function(e,t){return a.call(e,t)}},{}],35:[function(e,t,r){var a=e("./_object-dp"),n=e("./_property-desc");t.exports=e("./_descriptors")?function(e,t,r){return a.f(e,t,n(1,r))}:function(e,t,r){e[t]=r;return e}},{"./_descriptors":28,"./_object-dp":50,"./_property-desc":56}],36:[function(e,t,r){t.exports=e("./_global").document&&document.documentElement},{"./_global":33}],37:[function(e,t,r){t.exports=!e("./_descriptors")&&!e("./_fails")(function(){return Object.defineProperty(e("./_dom-create")("div"),"a",{get:function(){return 7}}).a!=7})},{"./_descriptors":28,"./_dom-create":29,"./_fails":32}],38:[function(e,t,r){var a=e("./_cof");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return a(e)=="String"?e.split(""):Object(e)}},{"./_cof":23}],39:[function(e,t,r){var a=e("./_iterators"),n=e("./_wks")("iterator"),i=Array.prototype;t.exports=function(e){return e!==undefined&&(a.Array===e||i[n]===e)}},{"./_iterators":46,"./_wks":69}],40:[function(e,t,r){t.exports=function(e){return typeof e==="object"?e!==null:typeof e==="function"}},{}],41:[function(e,t,r){var a=e("./_an-object");t.exports=function(e,t,r,n){try{return n?t(a(r)[0],r[1]):t(r)}catch(t){var i=e["return"];if(i!==undefined)a(i.call(e));throw t}}},{"./_an-object":20}],42:[function(e,t,r){"use strict";var a=e("./_object-create"),n=e("./_property-desc"),i=e("./_set-to-string-tag"),l={};e("./_hide")(l,e("./_wks")("iterator"),function(){return this});t.exports=function(e,t,r){e.prototype=a(l,{next:n(1,r)});i(e,t+" Iterator")}},{"./_hide":35,"./_object-create":49,"./_property-desc":56,"./_set-to-string-tag":58,"./_wks":69}],43:[function(e,t,r){"use strict";var a=e("./_library"),n=e("./_export"),i=e("./_redefine"),l=e("./_hide"),u=e("./_has"),o=e("./_iterators"),s=e("./_iter-create"),f=e("./_set-to-string-tag"),d=e("./_object-gpo"),c=e("./_wks")("iterator"),h=!([].keys&&"next"in[].keys()),v="@@iterator",p="keys",m="values";var g=function(){return this};t.exports=function(e,t,r,b,y,x,w){s(r,t,b);var k=function(e){if(!h&&e in z)return z[e];switch(e){case p:return function t(){return new r(this,e)};case m:return function t(){return new r(this,e)}}return function t(){return new r(this,e)}};var M=t+" Iterator",_=y==m,S=false,z=e.prototype,T=z[c]||z[v]||y&&z[y],C=T||k(y),A=y?!_?C:k("entries"):undefined,O=t=="Array"?z.entries||T:T,N,L,j;if(O){j=d(O.call(new e));if(j!==Object.prototype){f(j,M,true);if(!a&&!u(j,c))l(j,c,g)}}if(_&&T&&T.name!==m){S=true;C=function e(){return T.call(this)}}if((!a||w)&&(h||S||!z[c])){l(z,c,C)}o[t]=C;o[M]=g;if(y){N={values:_?C:k(m),keys:x?C:k(p),entries:A};if(w)for(L in N){if(!(L in z))i(z,L,N[L])}else n(n.P+n.F*(h||S),t,N)}return N}},{"./_export":31,"./_has":34,"./_hide":35,"./_iter-create":42,"./_iterators":46,"./_library":47,"./_object-gpo":52,"./_redefine":57,"./_set-to-string-tag":58,"./_wks":69}],44:[function(e,t,r){var a=e("./_wks")("iterator"),n=false;try{var i=[7][a]();i["return"]=function(){n=true};Array.from(i,function(){throw 2})}catch(e){}t.exports=function(e,t){if(!t&&!n)return false;var r=false;try{var i=[7],l=i[a]();l.next=function(){return{done:r=true}};i[a]=function(){return l};e(i)}catch(e){}return r}},{"./_wks":69}],45:[function(e,t,r){t.exports=function(e,t){return{value:t,done:!!e}}},{}],46:[function(e,t,r){t.exports={}},{}],47:[function(e,t,r){t.exports=true},{}],48:[function(e,t,r){var a=e("./_uid")("meta"),n=e("./_is-object"),i=e("./_has"),l=e("./_object-dp").f,u=0;var o=Object.isExtensible||function(){return true};var s=!e("./_fails")(function(){return o(Object.preventExtensions({}))});var f=function(e){l(e,a,{value:{i:"O"+ ++u,w:{}}})};var d=function(e,t){if(!n(e))return typeof e=="symbol"?e:(typeof e=="string"?"S":"P")+e;if(!i(e,a)){if(!o(e))return"F";if(!t)return"E";f(e)}return e[a].i};var c=function(e,t){if(!i(e,a)){if(!o(e))return true;if(!t)return false;f(e)}return e[a].w};var h=function(e){if(s&&v.NEED&&o(e)&&!i(e,a))f(e);return e};var v=t.exports={KEY:a,NEED:false,fastKey:d,getWeak:c,onFreeze:h}},{"./_fails":32,"./_has":34,"./_is-object":40,"./_object-dp":50,"./_uid":68}],49:[function(e,t,r){var a=e("./_an-object"),n=e("./_object-dps"),i=e("./_enum-bug-keys"),l=e("./_shared-key")("IE_PROTO"),u=function(){},o="prototype";var s=function(){var t=e("./_dom-create")("iframe"),r=i.length,a="<",n=">",l;t.style.display="none";e("./_html").appendChild(t);t.src="javascript:";l=t.contentWindow.document;l.open();l.write(a+"script"+n+"document.F=Object"+a+"/script"+n);l.close();s=l.F;while(r--)delete s[o][i[r]];return s()};t.exports=Object.create||function e(t,r){var i;if(t!==null){u[o]=a(t);i=new u;u[o]=null;i[l]=t}else i=s();return r===undefined?i:n(i,r)}},{"./_an-object":20,"./_dom-create":29,"./_enum-bug-keys":30,"./_html":36,"./_object-dps":51,"./_shared-key":59}],50:[function(e,t,r){var a=e("./_an-object"),n=e("./_ie8-dom-define"),i=e("./_to-primitive"),l=Object.defineProperty;r.f=e("./_descriptors")?Object.defineProperty:function e(t,r,u){a(t);r=i(r,true);a(u);if(n)try{return l(t,r,u)}catch(e){}if("get"in u||"set"in u)throw TypeError("Accessors not supported!");if("value"in u)t[r]=u.value;return t}},{"./_an-object":20,"./_descriptors":28,"./_ie8-dom-define":37,"./_to-primitive":67}],51:[function(e,t,r){var a=e("./_object-dp"),n=e("./_an-object"),i=e("./_object-keys");t.exports=e("./_descriptors")?Object.defineProperties:function e(t,r){n(t);var l=i(r),u=l.length,o=0,s;while(u>o)a.f(t,s=l[o++],r[s]);return t}},{"./_an-object":20,"./_descriptors":28,"./_object-dp":50,"./_object-keys":54}],52:[function(e,t,r){var a=e("./_has"),n=e("./_to-object"),i=e("./_shared-key")("IE_PROTO"),l=Object.prototype;t.exports=Object.getPrototypeOf||function(e){e=n(e);if(a(e,i))return e[i];if(typeof e.constructor=="function"&&e instanceof e.constructor){return e.constructor.prototype}return e instanceof Object?l:null}},{"./_has":34,"./_shared-key":59,"./_to-object":66}],53:[function(e,t,r){var a=e("./_has"),n=e("./_to-iobject"),i=e("./_array-includes")(false),l=e("./_shared-key")("IE_PROTO");t.exports=function(e,t){var r=n(e),u=0,o=[],s;for(s in r)if(s!=l)a(r,s)&&o.push(s);while(t.length>u)if(a(r,s=t[u++])){~i(o,s)||o.push(s)}return o}},{"./_array-includes":21,"./_has":34,"./_shared-key":59,"./_to-iobject":64}],54:[function(e,t,r){var a=e("./_object-keys-internal"),n=e("./_enum-bug-keys");t.exports=Object.keys||function e(t){return a(t,n)}},{"./_enum-bug-keys":30,"./_object-keys-internal":53}],55:[function(e,t,r){var a=e("./_export"),n=e("./_core"),i=e("./_fails");t.exports=function(e,t){var r=(n.Object||{})[e]||Object[e],l={};l[e]=t(r);a(a.S+a.F*i(function(){r(1)}),"Object",l)}},{"./_core":24,"./_export":31,"./_fails":32}],56:[function(e,t,r){t.exports=function(e,t){return{enumerable:!(e&1),configurable:!(e&2),writable:!(e&4),value:t}}},{}],57:[function(e,t,r){t.exports=e("./_hide")},{"./_hide":35}],58:[function(e,t,r){var a=e("./_object-dp").f,n=e("./_has"),i=e("./_wks")("toStringTag");t.exports=function(e,t,r){if(e&&!n(e=r?e:e.prototype,i))a(e,i,{configurable:true,value:t})}},{"./_has":34,"./_object-dp":50,"./_wks":69}],59:[function(e,t,r){var a=e("./_shared")("keys"),n=e("./_uid");t.exports=function(e){return a[e]||(a[e]=n(e))}},{"./_shared":60,"./_uid":68}],60:[function(e,t,r){var a=e("./_global"),n="__core-js_shared__",i=a[n]||(a[n]={});t.exports=function(e){return i[e]||(i[e]={})}},{"./_global":33}],61:[function(e,t,r){var a=e("./_to-integer"),n=e("./_defined");t.exports=function(e){return function(t,r){var i=String(n(t)),l=a(r),u=i.length,o,s;if(l<0||l>=u)return e?"":undefined;o=i.charCodeAt(l);return o<55296||o>56319||l+1===u||(s=i.charCodeAt(l+1))<56320||s>57343?e?i.charAt(l):o:e?i.slice(l,l+2):(o-55296<<10)+(s-56320)+65536}}},{"./_defined":27,"./_to-integer":63}],62:[function(e,t,r){var a=e("./_to-integer"),n=Math.max,i=Math.min;t.exports=function(e,t){e=a(e);return e<0?n(e+t,0):i(e,t)}},{"./_to-integer":63}],63:[function(e,t,r){var a=Math.ceil,n=Math.floor;t.exports=function(e){return isNaN(e=+e)?0:(e>0?n:a)(e)}},{}],64:[function(e,t,r){var a=e("./_iobject"),n=e("./_defined");t.exports=function(e){return a(n(e))}},{"./_defined":27,"./_iobject":38}],65:[function(e,t,r){var a=e("./_to-integer"),n=Math.min;t.exports=function(e){return e>0?n(a(e),9007199254740991):0}},{"./_to-integer":63}],66:[function(e,t,r){var a=e("./_defined");t.exports=function(e){return Object(a(e))}},{"./_defined":27}],67:[function(e,t,r){var a=e("./_is-object");t.exports=function(e,t){if(!a(e))return e;var r,n;if(t&&typeof(r=e.toString)=="function"&&!a(n=r.call(e)))return n;if(typeof(r=e.valueOf)=="function"&&!a(n=r.call(e)))return n;if(!t&&typeof(r=e.toString)=="function"&&!a(n=r.call(e)))return n;throw TypeError("Can't convert object to primitive value")}},{"./_is-object":40}],68:[function(e,t,r){var a=0,n=Math.random();t.exports=function(e){return"Symbol(".concat(e===undefined?"":e,")_",(++a+n).toString(36))}},{}],69:[function(e,t,r){var a=e("./_shared")("wks"),n=e("./_uid"),i=e("./_global").Symbol,l=typeof i=="function";var u=t.exports=function(e){return a[e]||(a[e]=l&&i[e]||(l?i:n)("Symbol."+e))};u.store=a},{"./_global":33,"./_shared":60,"./_uid":68}],70:[function(e,t,r){var a=e("./_classof"),n=e("./_wks")("iterator"),i=e("./_iterators");t.exports=e("./_core").getIteratorMethod=function(e){if(e!=undefined)return e[n]||e["@@iterator"]||i[a(e)]}},{"./_classof":22,"./_core":24,"./_iterators":46,"./_wks":69}],71:[function(e,t,r){var a=e("./_an-object"),n=e("./core.get-iterator-method");t.exports=e("./_core").getIterator=function(e){var t=n(e);if(typeof t!="function")throw TypeError(e+" is not iterable!");return a(t.call(e))}},{"./_an-object":20,"./_core":24,"./core.get-iterator-method":70}],72:[function(e,t,r){var a=e("./_classof"),n=e("./_wks")("iterator"),i=e("./_iterators");t.exports=e("./_core").isIterable=function(e){var t=Object(e);return t[n]!==undefined||"@@iterator"in t||i.hasOwnProperty(a(t))}},{"./_classof":22,"./_core":24,"./_iterators":46,"./_wks":69}],73:[function(e,t,r){"use strict";var a=e("./_ctx"),n=e("./_export"),i=e("./_to-object"),l=e("./_iter-call"),u=e("./_is-array-iter"),o=e("./_to-length"),s=e("./_create-property"),f=e("./core.get-iterator-method");n(n.S+n.F*!e("./_iter-detect")(function(e){Array.from(e)}),"Array",{from:function e(t){var r=i(t),n=typeof this=="function"?this:Array,d=arguments.length,c=d>1?arguments[1]:undefined,h=c!==undefined,v=0,p=f(r),m,g,b,y;if(h)c=a(c,d>2?arguments[2]:undefined,2);if(p!=undefined&&!(n==Array&&u(p))){for(y=p.call(r),g=new n;!(b=y.next()).done;v++){s(g,v,h?l(y,c,[b.value,v],true):b.value)}}else{m=o(r.length);for(g=new n(m);m>v;v++){s(g,v,h?c(r[v],v):r[v])}}g.length=v;return g}})},{"./_create-property":25,"./_ctx":26,"./_export":31,"./_is-array-iter":39,"./_iter-call":41,"./_iter-detect":44,"./_to-length":65,"./_to-object":66,"./core.get-iterator-method":70}],74:[function(e,t,r){"use strict";var a=e("./_add-to-unscopables"),n=e("./_iter-step"),i=e("./_iterators"),l=e("./_to-iobject");t.exports=e("./_iter-define")(Array,"Array",function(e,t){this._t=l(e);this._i=0;this._k=t},function(){var e=this._t,t=this._k,r=this._i++;if(!e||r>=e.length){this._t=undefined;return n(1)}if(t=="keys")return n(0,r);if(t=="values")return n(0,e[r]);return n(0,[r,e[r]])},"values");i.Arguments=i.Array;a("keys");a("values");a("entries")},{"./_add-to-unscopables":19,"./_iter-define":43,"./_iter-step":45,"./_iterators":46,"./_to-iobject":64}],75:[function(e,t,r){var a=e("./_export");a(a.S+a.F*!e("./_descriptors"),"Object",{defineProperty:e("./_object-dp").f})},{"./_descriptors":28,"./_export":31,"./_object-dp":50}],76:[function(e,t,r){var a=e("./_is-object"),n=e("./_meta").onFreeze;e("./_object-sap")("freeze",function(e){return function t(r){return e&&a(r)?e(n(r)):r}})},{"./_is-object":40,"./_meta":48,"./_object-sap":55}],77:[function(e,t,r){"use strict";var a=e("./_string-at")(true);e("./_iter-define")(String,"String",function(e){this._t=String(e);this._i=0},function(){var e=this._t,t=this._i,r;if(t>=e.length)return{value:undefined,done:true};r=a(e,t);this._i+=r.length;return{value:r,done:false}})},{"./_iter-define":43,"./_string-at":61}],78:[function(e,t,r){e("./es6.array.iterator");var a=e("./_global"),n=e("./_hide"),i=e("./_iterators"),l=e("./_wks")("toStringTag");for(var u=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],o=0;o<5;o++){var s=u[o],f=a[s],d=f&&f.prototype;if(d&&!d[l])n(d,l,s);i[s]=i.Array}},{"./_global":33,"./_hide":35,"./_iterators":46,"./_wks":69,"./es6.array.iterator":74}],79:[function(e,t,r){function a(e){if(!e.__matchAtRelocatable){var t=e.source+"|()";var r="g"+(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"");e.__matchAtRelocatable=new RegExp(t,r)}return e.__matchAtRelocatable}function n(e,t,r){if(e.global||e.sticky){throw new Error("matchAt(...): Only non-global regexes are supported")}var n=a(e);n.lastIndex=r;var i=n.exec(t);if(i[i.length-1]==null){i.length=i.length-1;return i}else{return null}}t.exports=n},{}],80:[function(e,t,r){"use strict";var a=Object.getOwnPropertySymbols;var n=Object.prototype.hasOwnProperty;var i=Object.prototype.propertyIsEnumerable;function l(e){if(e===null||e===undefined){throw new TypeError("Object.assign cannot be called with null or undefined")}return Object(e)}function u(){try{if(!Object.assign){return false}var e=new String("abc");e[5]="de";if(Object.getOwnPropertyNames(e)[0]==="5"){return false}var t={};for(var r=0;r<10;r++){t["_"+String.fromCharCode(r)]=r}var a=Object.getOwnPropertyNames(t).map(function(e){return t[e]});if(a.join("")!=="0123456789"){return false}var n={};"abcdefghijklmnopqrst".split("").forEach(function(e){n[e]=e});if(Object.keys(Object.assign({},n)).join("")!=="abcdefghijklmnopqrst"){return false}return true}catch(e){return false}}t.exports=u()?Object.assign:function(e,t){var r;var u=l(e);var o;for(var s=1;s<arguments.length;s++){r=Object(arguments[s]);for(var f in r){if(n.call(r,f)){u[f]=r[f]}}if(a){o=a(r);for(var d=0;d<o.length;d++){if(i.call(r,o[d])){u[o[d]]=r[o[d]]}}}}return u}},{}],81:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});r.controlWordRegex=undefined;var a=e("babel-runtime/helpers/classCallCheck");var n=v(a);var i=e("babel-runtime/helpers/createClass");var l=v(i);var u=e("match-at");var o=v(u);var s=e("./ParseError");var f=v(s);var d=e("./SourceLocation");var c=v(d);var h=e("./Token");function v(e){return e&&e.__esModule?e:{default:e}}var p="%[^\n]*[\n]";var m="\\\\[a-zA-Z@]+";var g="\\\\[^\ud800-\udfff]";var b=new RegExp("([ \r\n\t]+)|"+("("+p+"|")+"[!-\\[\\]-\u2027\u202a-\ud7ff\uf900-\uffff]"+"|[\ud800-\udbff][\udc00-\udfff]"+"|\\\\verb\\*([^]).*?\\3"+"|\\\\verb([^*a-zA-Z]).*?\\4"+("|"+m)+("|"+g)+")");var y=r.controlWordRegex=new RegExp("^"+m);var x=new RegExp("^"+p);var w=function(){function e(t){(0,n.default)(this,e);this.input=t;this.pos=0}(0,l.default)(e,[{key:"lex",value:function e(){var t=this.input;var r=this.pos;if(r===t.length){return new h.Token("EOF",new c.default(this,r,r))}var a=(0,o.default)(b,t,r);if(a===null){throw new f.default("Unexpected character: '"+t[r]+"'",new h.Token(t[r],new c.default(this,r,r+1)))}var n=a[2]||" ";var i=this.pos;this.pos+=a[0].length;var l=this.pos;if(x.test(n)){return this.lex()}else{return new h.Token(n,new c.default(this,i,l))}}}]);return e}();r.default=w},{"./ParseError":84,"./SourceLocation":88,"./Token":90,"babel-runtime/helpers/classCallCheck":8,"babel-runtime/helpers/createClass":9,"match-at":79}],82:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("babel-runtime/helpers/toConsumableArray");var n=b(a);var i=e("babel-runtime/helpers/classCallCheck");var l=b(i);var u=e("babel-runtime/helpers/createClass");var o=b(u);var s=e("./Lexer");var f=b(s);var d=e("./Token");var c=e("./macros");var h=b(c);var v=e("./ParseError");var p=b(v);var m=e("object-assign");var g=b(m);function b(e){return e&&e.__esModule?e:{default:e}}var y=function(){function e(t,r){(0,l.default)(this,e);this.lexer=new f.default(t);this.macros=(0,g.default)({},h.default,r);this.stack=[]}(0,o.default)(e,[{key:"future",value:function e(){if(this.stack.length===0){this.pushToken(this.lexer.lex())}return this.stack[this.stack.length-1]}},{key:"popToken",value:function e(){this.future();return this.stack.pop()}},{key:"pushToken",value:function e(t){this.stack.push(t)}},{key:"pushTokens",value:function e(t){var r;(r=this.stack).push.apply(r,(0,n.default)(t))}},{key:"consumeSpaces",value:function e(){for(;;){var t=this.future();if(t.text===" "){this.stack.pop()}else{break}}}},{key:"consumeArgs",value:function e(t){var r=[];for(var a=0;a<t;++a){this.consumeSpaces();var n=this.popToken();if(n.text==="{"){var i=[];var l=1;while(l!==0){var u=this.popToken();i.push(u);if(u.text==="{"){++l}else if(u.text==="}"){--l}else if(u.text==="EOF"){throw new p.default("End of input in macro argument",n)}}i.pop();i.reverse();r[a]=i}else if(n.text==="EOF"){throw new p.default("End of input expecting macro argument")}else{r[a]=[n]}}return r}},{key:"expandOnce",value:function e(){var t=this.popToken();var r=t.text;var a=r.charAt(0)==="\\";if(a&&s.controlWordRegex.test(r)){this.consumeSpaces()}if(!this.macros.hasOwnProperty(r)){this.pushToken(t);return t}var i=this._getExpansion(r),l=i.tokens,u=i.numArgs;var o=l;if(u){var f=this.consumeArgs(u);o=o.slice();for(var d=o.length-1;d>=0;--d){var c=o[d];if(c.text==="#"){if(d===0){throw new p.default("Incomplete placeholder at end of macro body",c)}c=o[--d];if(c.text==="#"){o.splice(d+1,1)}else if(/^[1-9]$/.test(c.text)){var h;(h=o).splice.apply(h,[d,2].concat((0,n.default)(f[+c.text-1])))}else{throw new p.default("Not a valid argument number",c)}}}}this.pushTokens(o);return o}},{key:"expandAfterFuture",value:function e(){this.expandOnce();return this.future()}},{key:"expandNextToken",value:function e(){for(;;){var t=this.expandOnce();if(t instanceof d.Token){if(t.text==="\\relax"){this.stack.pop()}else{return this.stack.pop()}}}throw new Error}},{key:"_getExpansion",value:function e(t){var r=this.macros[t];var a=typeof r==="function"?r(this):r;if(typeof a==="string"){var n=0;if(a.indexOf("#")!==-1){var i=a.replace(/##/g,"");while(i.indexOf("#"+(n+1))!==-1){++n}}var l=new f.default(a);var u=[];var o=l.lex();while(o.text!=="EOF"){u.push(o);o=l.lex()}u.reverse();var s={tokens:u,numArgs:n};if(typeof r!=="function"){this.macros[t]=s}return s}return a}}]);return e}();r.default=y},{"./Lexer":81,"./ParseError":84,"./Token":90,"./macros":120,"babel-runtime/helpers/classCallCheck":8,"babel-runtime/helpers/createClass":9,"babel-runtime/helpers/toConsumableArray":11,"object-assign":80}],83:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("babel-runtime/helpers/classCallCheck");var n=s(a);var i=e("babel-runtime/helpers/createClass");var l=s(i);var u=e("./fontMetrics");var o=s(u);function s(e){return e&&e.__esModule?e:{default:e}}var f=[[1,1,1],[2,1,1],[3,1,1],[4,2,1],[5,2,1],[6,3,1],[7,4,2],[8,6,3],[9,7,6],[10,8,7],[11,10,9]];var d=[.5,.6,.7,.8,.9,1,1.2,1.44,1.728,2.074,2.488];var c=function e(t,r){return r.size<2?t:f[t-1][r.size-1]};var h=function(){function e(t){(0,n.default)(this,e);this.style=t.style;this.color=t.color;this.size=t.size||e.BASESIZE;this.textSize=t.textSize||this.size;this.phantom=!!t.phantom;this.fontFamily=t.fontFamily;this.fontWeight=t.fontWeight||"";this.fontShape=t.fontShape||"";this.sizeMultiplier=d[this.size-1];this.maxSize=t.maxSize;this._fontMetrics=undefined}(0,l.default)(e,[{key:"extend",value:function t(r){var a={style:this.style,size:this.size,textSize:this.textSize,color:this.color,phantom:this.phantom,fontFamily:this.fontFamily,fontWeight:this.fontWeight,fontShape:this.fontShape,maxSize:this.maxSize};for(var n in r){if(r.hasOwnProperty(n)){a[n]=r[n]}}return new e(a)}},{key:"havingStyle",value:function e(t){if(this.style===t){return this}else{return this.extend({style:t,size:c(this.textSize,t)})}}},{key:"havingCrampedStyle",value:function e(){return this.havingStyle(this.style.cramp())}},{key:"havingSize",value:function e(t){if(this.size===t&&this.textSize===t){return this}else{return this.extend({style:this.style.text(),size:t,textSize:t})}}},{key:"havingBaseStyle",value:function t(r){r=r||this.style.text();var a=c(e.BASESIZE,r);if(this.size===a&&this.textSize===e.BASESIZE&&this.style===r){return this}else{return this.extend({style:r,size:a})}}},{key:"withColor",value:function e(t){return this.extend({color:t})}},{key:"withPhantom",value:function e(){return this.extend({phantom:true})}},{key:"withFontFamily",value:function e(t){return this.extend({fontFamily:t||this.fontFamily})}},{key:"withFontWeight",value:function e(t){return this.extend({fontWeight:t})}},{key:"withFontShape",value:function e(t){return this.extend({fontShape:t})}},{key:"sizingClasses",value:function e(t){if(t.size!==this.size){return["sizing","reset-size"+t.size,"size"+this.size]}else{return[]}}},{key:"baseSizingClasses",value:function t(){if(this.size!==e.BASESIZE){return["sizing","reset-size"+this.size,"size"+e.BASESIZE]}else{return[]}}},{key:"fontMetrics",value:function e(){if(!this._fontMetrics){this._fontMetrics=o.default.getFontMetrics(this.size)}return this._fontMetrics}},{key:"getColor",value:function t(){if(this.phantom){return"transparent"}else if(this.color!=null&&e.colorMap.hasOwnProperty(this.color)){return e.colorMap[this.color]}else{return this.color}}}]);return e}();h.BASESIZE=6;h.colorMap={"katex-blue":"#6495ed","katex-orange":"#ffa500","katex-pink":"#ff00af","katex-red":"#df0030","katex-green":"#28ae7b","katex-gray":"gray","katex-purple":"#9d38bd","katex-blueA":"#ccfaff","katex-blueB":"#80f6ff","katex-blueC":"#63d9ea","katex-blueD":"#11accd","katex-blueE":"#0c7f99","katex-tealA":"#94fff5","katex-tealB":"#26edd5","katex-tealC":"#01d1c1","katex-tealD":"#01a995","katex-tealE":"#208170","katex-greenA":"#b6ffb0","katex-greenB":"#8af281","katex-greenC":"#74cf70","katex-greenD":"#1fab54","katex-greenE":"#0d923f","katex-goldA":"#ffd0a9","katex-goldB":"#ffbb71","katex-goldC":"#ff9c39","katex-goldD":"#e07d10","katex-goldE":"#a75a05","katex-redA":"#fca9a9","katex-redB":"#ff8482","katex-redC":"#f9685d","katex-redD":"#e84d39","katex-redE":"#bc2612","katex-maroonA":"#ffbde0","katex-maroonB":"#ff92c6","katex-maroonC":"#ed5fa6","katex-maroonD":"#ca337c","katex-maroonE":"#9e034e","katex-purpleA":"#ddd7ff","katex-purpleB":"#c6b9fc","katex-purpleC":"#aa87ff","katex-purpleD":"#7854ab","katex-purpleE":"#543b78","katex-mintA":"#f5f9e8","katex-mintB":"#edf2df","katex-mintC":"#e0e5cc","katex-grayA":"#f6f7f7","katex-grayB":"#f0f1f2","katex-grayC":"#e3e5e6","katex-grayD":"#d6d8da","katex-grayE":"#babec2","katex-grayF":"#888d93","katex-grayG":"#626569","katex-grayH":"#3b3e40","katex-grayI":"#21242c","katex-kaBlue":"#314453","katex-kaGreen":"#71B307"};r.default=h},{"./fontMetrics":101,"babel-runtime/helpers/classCallCheck":8,"babel-runtime/helpers/createClass":9
}],84:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("babel-runtime/helpers/classCallCheck");var n=o(a);var i=e("./ParseNode");var l=o(i);var u=e("./Token");function o(e){return e&&e.__esModule?e:{default:e}}var s=function e(t,r){(0,n.default)(this,e);var a="KaTeX parse error: "+t;var i=void 0;var l=r&&r.loc;if(l&&l.start<=l.end){var u=l.lexer.input;i=l.start;var o=l.end;if(i===u.length){a+=" at end of input: "}else{a+=" at position "+(i+1)+": "}var s=u.slice(i,o).replace(/[^]/g,"$&\u0332");var f=void 0;if(i>15){f="\u2026"+u.slice(i-15,i)}else{f=u.slice(0,i)}var d=void 0;if(o+15<u.length){d=u.slice(o,o+15)+"\u2026"}else{d=u.slice(o)}a+=f+s+d}var c=new Error(a);c.name="ParseError";c.__proto__=e.prototype;c.position=i;return c};s.prototype.__proto__=Error.prototype;r.default=s},{"./ParseNode":85,"./Token":90,"babel-runtime/helpers/classCallCheck":8}],85:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("babel-runtime/helpers/classCallCheck");var n=o(a);var i=e("./Token");var l=e("./SourceLocation");var u=o(l);function o(e){return e&&e.__esModule?e:{default:e}}var s=function e(t,r,a,i,l){(0,n.default)(this,e);this.type=t;this.value=r;this.mode=a;this.loc=u.default.range(i,l)};r.default=s},{"./SourceLocation":88,"./Token":90,"babel-runtime/helpers/classCallCheck":8}],86:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("babel-runtime/helpers/classCallCheck");var n=M(a);var i=e("babel-runtime/helpers/createClass");var l=M(i);var u=e("./functions");var o=M(u);var s=e("./environments");var f=M(s);var d=e("./MacroExpander");var c=M(d);var h=e("./symbols");var v=M(h);var p=e("./utils");var m=M(p);var g=e("./units");var b=e("./unicodeRegexes");var y=e("./ParseNode");var x=M(y);var w=e("./ParseError");var k=M(w);function M(e){return e&&e.__esModule?e:{default:e}}function _(e,t){return{type:"arg",result:e,token:t}}function S(e){return{type:"fn",result:e.text,token:e}}function z(e){return{type:"$",result:"$",token:e}}function T(e){if(e.type==="$"){throw new k.default("Unexpected $",e.token)}return e}var C=function(){function e(t,r){(0,n.default)(this,e);this.gullet=new c.default(t,r.macros);if(r.colorIsTextColor){this.gullet.macros["\\color"]="\\textcolor"}this.settings=r;this.leftrightDepth=0}(0,l.default)(e,[{key:"expect",value:function e(t,r){if(this.nextToken.text!==t){throw new k.default("Expected '"+t+"', got '"+this.nextToken.text+"'",this.nextToken)}if(r!==false){this.consume()}}},{key:"consume",value:function e(){this.nextToken=this.gullet.expandNextToken()}},{key:"switchMode",value:function e(t){this.mode=t}},{key:"parse",value:function e(){this.mode="math";this.consume();var e=this.parseInput();return e}},{key:"parseInput",value:function e(){var t=this.parseExpression(false);this.expect("EOF",false);return t}},{key:"parseExpression",value:function t(r,a){var n=[];while(true){if(this.mode==="math"){this.consumeSpaces()}var i=this.nextToken;if(e.endOfExpression.indexOf(i.text)!==-1){break}if(a&&i.text===a){break}if(r&&o.default[i.text]&&o.default[i.text].infix){break}var l=this.parseAtom(a);if(!l){if(!this.settings.throwOnError&&i.text[0]==="\\"){var u=this.handleUnsupportedCmd();n.push(u);continue}break}n.push(l)}return this.handleInfixNodes(n)}},{key:"handleInfixNodes",value:function e(t){var r=-1;var a=void 0;for(var n=0;n<t.length;n++){var i=t[n];if(i.type==="infix"){if(r!==-1){throw new k.default("only one infix operator per group",i.value.token)}r=n;a=i.value.replaceWith}}if(r!==-1){var l=void 0;var u=void 0;var o=t.slice(0,r);var s=t.slice(r+1);if(o.length===1&&o[0].type==="ordgroup"){l=o[0]}else{l=new x.default("ordgroup",o,this.mode)}if(s.length===1&&s[0].type==="ordgroup"){u=s[0]}else{u=new x.default("ordgroup",s,this.mode)}var f=this.callFunction(a,[l,u],[]);return[new x.default(f.type,f,this.mode)]}else{return t}}},{key:"handleSupSubscript",value:function t(r){var a=this.nextToken;var n=a.text;this.consume();this.consumeSpaces();var i=this.parseGroup();if(!i){if(!this.settings.throwOnError&&this.nextToken.text[0]==="\\"){return this.handleUnsupportedCmd()}else{throw new k.default("Expected group after '"+n+"'",a)}}var l=T(i);if(l.type==="fn"){var u=o.default[i.result].greediness;if(u>e.SUPSUB_GREEDINESS){return this.parseGivenFunction(i)}else{throw new k.default("Got function '"+i.result+"' with no arguments "+"as "+r,a)}}else{return i.result}}},{key:"handleUnsupportedCmd",value:function e(){var t=this.nextToken.text;var r=[];for(var a=0;a<t.length;a++){r.push(new x.default("textord",t[a],"text"))}var n=new x.default("text",{body:r,type:"text"},this.mode);var i=new x.default("color",{color:this.settings.errorColor,value:[n],type:"color"},this.mode);this.consume();return i}},{key:"parseAtom",value:function e(t){var r=this.parseImplicitGroup(t);if(this.mode==="text"){return r}var a=void 0;var n=void 0;while(true){this.consumeSpaces();var i=this.nextToken;if(i.text==="\\limits"||i.text==="\\nolimits"){if(!r||r.type!=="op"){throw new k.default("Limit controls must follow a math operator",i)}else{var l=i.text==="\\limits";r.value.limits=l;r.value.alwaysHandleSupSub=true}this.consume()}else if(i.text==="^"){if(a){throw new k.default("Double superscript",i)}a=this.handleSupSubscript("superscript")}else if(i.text==="_"){if(n){throw new k.default("Double subscript",i)}n=this.handleSupSubscript("subscript")}else if(i.text==="'"){if(a){throw new k.default("Double superscript",i)}var u=new x.default("textord","\\prime",this.mode);var o=[u];this.consume();while(this.nextToken.text==="'"){o.push(u);this.consume()}if(this.nextToken.text==="^"){o.push(this.handleSupSubscript("superscript"))}a=new x.default("ordgroup",o,this.mode)}else{break}}if(a||n){return new x.default("supsub",{base:r,sup:a,sub:n},this.mode)}else{return r}}},{key:"parseImplicitGroup",value:function t(r){var a=this.parseSymbol();if(a==null){return this.parseFunction()}var n=a.result;if(n==="\\left"){var i=this.parseGivenFunction(a);++this.leftrightDepth;var l=this.parseExpression(false);--this.leftrightDepth;this.expect("\\right",false);var u=this.parseFunction();return new x.default("leftright",{body:l,left:i.value.value,right:u.value.value},this.mode)}else if(n==="\\begin"){var o=this.parseGivenFunction(a);var s=o.value.name;if(!f.default.has(s)){throw new k.default("No such environment: "+s,o.value.nameGroup)}var d=f.default.get(s);var c=this.parseArguments("\\begin{"+s+"}",d),h=c.args,v=c.optArgs;var p={mode:this.mode,envName:s,parser:this};var g=d.handler(p,h,v);this.expect("\\end",false);var b=this.nextToken;var y=this.parseFunction();if(y.value.name!==s){throw new k.default("Mismatch: \\begin{"+s+"} matched "+"by \\end{"+y.value.name+"}",b)}g.position=y.position;return g}else if(m.default.contains(e.sizeFuncs,n)){this.consumeSpaces();var w=this.parseExpression(false,r);return new x.default("sizing",{size:m.default.indexOf(e.sizeFuncs,n)+1,value:w},this.mode)}else if(m.default.contains(e.styleFuncs,n)){this.consumeSpaces();var M=this.parseExpression(true,r);return new x.default("styling",{style:n.slice(1,n.length-5),value:M},this.mode)}else if(n in e.oldFontFuncs){var _=e.oldFontFuncs[n];this.consumeSpaces();var S=this.parseExpression(true,r);if(_.slice(0,4)==="text"){return new x.default("text",{style:_,body:new x.default("ordgroup",S,this.mode)},this.mode)}else{return new x.default("font",{font:_,body:new x.default("ordgroup",S,this.mode)},this.mode)}}else if(n==="\\color"){var z=this.parseColorGroup(false);if(!z){throw new k.default("\\color not followed by color")}var T=this.parseExpression(true,r);return new x.default("color",{type:"color",color:z.result.value,value:T},this.mode)}else if(n==="$"){if(this.mode==="math"){throw new k.default("$ within math mode")}this.consume();var C=this.mode;this.switchMode("math");var A=this.parseExpression(false,"$");this.expect("$",true);this.switchMode(C);return new x.default("styling",{style:"text",value:A},"math")}else{return this.parseGivenFunction(a)}}},{key:"parseFunction",value:function e(){var t=this.parseGroup();return t?this.parseGivenFunction(t):null}},{key:"parseGivenFunction",value:function e(t){t=T(t);if(t.type==="fn"){var r=t.result;var a=o.default[r];if(this.mode==="text"&&!a.allowedInText){throw new k.default("Can't use function '"+r+"' in text mode",t.token)}else if(this.mode==="math"&&a.allowedInMath===false){throw new k.default("Can't use function '"+r+"' in math mode",t.token)}var n=this.parseArguments(r,a),i=n.args,l=n.optArgs;var u=t.token;var s=this.callFunction(r,i,l,u);return new x.default(s.type,s,this.mode)}else{return t.result}}},{key:"callFunction",value:function e(t,r,a,n){var i={funcName:t,parser:this,token:n};return o.default[t].handler(i,r,a)}},{key:"parseArguments",value:function e(t,r){var a=r.numArgs+r.numOptionalArgs;if(a===0){return{args:[],optArgs:[]}}var n=r.greediness;var i=[];var l=[];for(var u=0;u<a;u++){var s=r.argTypes&&r.argTypes[u];var f=u<r.numOptionalArgs;if(u>0&&!f){this.consumeSpaces()}if(u===0&&!f&&this.mode==="math"){this.consumeSpaces()}var d=this.nextToken;var c=s?this.parseGroupOfType(s,f):this.parseGroup(f);if(!c){if(f){l.push(null);continue}if(!this.settings.throwOnError&&this.nextToken.text[0]==="\\"){c=_(this.handleUnsupportedCmd(),d)}else{throw new k.default("Expected group after '"+t+"'",d)}}var h=void 0;c=T(c);if(c.type==="fn"){var v=o.default[c.result].greediness;if(v>n){h=this.parseGivenFunction(c)}else{throw new k.default("Got function '"+c.result+"' as "+"argument to '"+t+"'",d)}}else{h=c.result}(f?l:i).push(h)}return{args:i,optArgs:l}}},{key:"parseGroupOfType",value:function e(t,r){var a=this.mode;if(t==="original"){t=a}if(t==="color"){return this.parseColorGroup(r)}if(t==="size"){return this.parseSizeGroup(r)}if(t==="string"){var n=this.parseStringGroup("string",r);return new _(n.text,false)}if(t==="url"){return this.parseUrlGroup(r)}this.switchMode(t);var i=this.parseGroup(r);this.switchMode(a);return i}},{key:"consumeSpaces",value:function e(){while(this.nextToken.text===" "){this.consume()}}},{key:"parseStringGroup",value:function e(t,r){if(r&&this.nextToken.text!=="["){return null}var a=this.mode;this.mode="text";this.expect(r?"[":"{");var n="";var i=this.nextToken;var l=i;while(this.nextToken.text!==(r?"]":"}")){if(this.nextToken.text==="EOF"){throw new k.default("Unexpected end of input in "+t,i.range(this.nextToken,n))}l=this.nextToken;n+=l.text;this.consume()}this.mode=a;this.expect(r?"]":"}");return i.range(l,n)}},{key:"parseStringGroupWithBalancedBraces",value:function e(t,r){if(r&&this.nextToken.text!=="["){return null}var a=this.mode;this.mode="text";this.expect(r?"[":"{");var n="";var i=0;var l=this.nextToken;var u=l;while(i>0||this.nextToken.text!==(r?"]":"}")){if(this.nextToken.text==="EOF"){throw new k.default("Unexpected end of input in "+t,l.range(this.nextToken,n))}u=this.nextToken;n+=u.text;if(u.text==="{"){i+=1}else if(u.text==="}"){if(i<=0){throw new k.default("Unbalanced brace of input in "+t,l.range(this.nextToken,n))}else{i-=1}}this.consume()}this.mode=a;this.expect(r?"]":"}");return l.range(u,n)}},{key:"parseRegexGroup",value:function e(t,r){var a=this.mode;this.mode="text";var n=this.nextToken;var i=n;var l="";while(this.nextToken.text!=="EOF"&&t.test(l+this.nextToken.text)){i=this.nextToken;l+=i.text;this.consume()}if(l===""){throw new k.default("Invalid "+r+": '"+n.text+"'",n)}this.mode=a;return n.range(i,l)}},{key:"parseColorGroup",value:function e(t){var r=this.parseStringGroup("color",t);if(!r){return null}var a=/^(#[a-f0-9]{3}|#[a-f0-9]{6}|[a-z]+)$/i.exec(r.text);if(!a){throw new k.default("Invalid color: '"+r.text+"'",r)}return _(new x.default("color",a[0],this.mode),r)}},{key:"parseUrlGroup",value:function e(t){var r=this.parseStringGroupWithBalancedBraces("url",t);if(!r){return null}var a=r.text;var n=a.replace(/\\([#$%&~_^{}])/g,"$1");return _(new x.default("url",n,this.mode),r)}},{key:"parseSizeGroup",value:function e(t){var r=void 0;if(!t&&this.nextToken.text!=="{"){r=this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/,"size")}else{r=this.parseStringGroup("size",t)}if(!r){return null}var a=/([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(r.text);if(!a){throw new k.default("Invalid size: '"+r.text+"'",r)}var n={number:+(a[1]+a[2]),unit:a[3]};if(!(0,g.validUnit)(n)){throw new k.default("Invalid unit: '"+n.unit+"'",r)}return _(new x.default("size",n,this.mode),r)}},{key:"parseGroup",value:function e(t){var r=this.nextToken;if(this.nextToken.text===(t?"[":"{")){this.consume();var a=this.parseExpression(false,t?"]":"}");var n=this.nextToken;this.expect(t?"]":"}");if(this.mode==="text"){this.formLigatures(a)}return _(new x.default("ordgroup",a,this.mode,r,n),r.range(n,r.text))}else{return t?null:this.parseSymbol()}}},{key:"formLigatures",value:function e(t){var r=t.length-1;for(var a=0;a<r;++a){var n=t[a];var i=n.value;if(i==="-"&&t[a+1].value==="-"){if(a+1<r&&t[a+2].value==="-"){t.splice(a,3,new x.default("textord","---","text",n,t[a+2]));r-=2}else{t.splice(a,2,new x.default("textord","--","text",n,t[a+1]));r-=1}}if((i==="'"||i==="`")&&t[a+1].value===i){t.splice(a,2,new x.default("textord",i+i,"text",n,t[a+1]));r-=1}}}},{key:"parseSymbol",value:function e(){var t=this.nextToken;if(o.default[t.text]){this.consume();return S(t)}else if(v.default[this.mode][t.text]){this.consume();return _(new x.default(v.default[this.mode][t.text].group,t.text,this.mode,t),t)}else if(this.mode==="text"&&b.cjkRegex.test(t.text)){this.consume();return _(new x.default("textord",t.text,this.mode,t),t)}else if(t.text==="$"){return z(t)}else if(/^\\verb[^a-zA-Z]/.test(t.text)){this.consume();var r=t.text.slice(5);var a=r.charAt(0)==="*";if(a){r=r.slice(1)}if(r.length<2||r.charAt(0)!==r.slice(-1)){throw new k.default("\\verb assertion failed --\n                    please report what input caused this bug")}r=r.slice(1,-1);return _(new x.default("verb",{body:r,star:a},"text"),t)}else{return null}}}]);return e}();C.endOfExpression=["}","\\end","\\right","&","\\\\","\\cr"];C.SUPSUB_GREEDINESS=1;C.sizeFuncs=["\\tiny","\\sixptsize","\\scriptsize","\\footnotesize","\\small","\\normalsize","\\large","\\Large","\\LARGE","\\huge","\\Huge"];C.styleFuncs=["\\displaystyle","\\textstyle","\\scriptstyle","\\scriptscriptstyle"];C.oldFontFuncs={"\\rm":"mathrm","\\sf":"mathsf","\\tt":"mathtt","\\bf":"mathbf","\\it":"mathit"};r.default=C},{"./MacroExpander":82,"./ParseError":84,"./ParseNode":85,"./environments":99,"./functions":103,"./symbols":125,"./unicodeRegexes":126,"./units":127,"./utils":128,"babel-runtime/helpers/classCallCheck":8,"babel-runtime/helpers/createClass":9}],87:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("babel-runtime/helpers/classCallCheck");var n=u(a);var i=e("./utils");var l=u(i);function u(e){return e&&e.__esModule?e:{default:e}}var o=function e(t){(0,n.default)(this,e);t=t||{};this.displayMode=l.default.deflt(t.displayMode,false);this.throwOnError=l.default.deflt(t.throwOnError,true);this.errorColor=l.default.deflt(t.errorColor,"#cc0000");this.macros=t.macros||{};this.colorIsTextColor=l.default.deflt(t.colorIsTextColor,false);this.maxSize=Math.max(0,l.default.deflt(t.maxSize,Infinity))};r.default=o},{"./utils":128,"babel-runtime/helpers/classCallCheck":8}],88:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("babel-runtime/core-js/object/freeze");var n=s(a);var i=e("babel-runtime/helpers/classCallCheck");var l=s(i);var u=e("babel-runtime/helpers/createClass");var o=s(u);function s(e){return e&&e.__esModule?e:{default:e}}var f=function(){function e(t,r,a){(0,l.default)(this,e);this.lexer=t;this.start=r;this.end=a;(0,n.default)(this)}(0,o.default)(e,null,[{key:"range",value:function t(r,a){if(!a){return r&&r.loc}else if(!r||!r.loc||!a.loc||r.loc.lexer!==a.loc.lexer){return null}else{return new e(r.loc.lexer,r.loc.start,a.loc.end)}}}]);return e}();r.default=f},{"babel-runtime/core-js/object/freeze":7,"babel-runtime/helpers/classCallCheck":8,"babel-runtime/helpers/createClass":9}],89:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("babel-runtime/helpers/classCallCheck");var n=u(a);var i=e("babel-runtime/helpers/createClass");var l=u(i);function u(e){return e&&e.__esModule?e:{default:e}}var o=function(){function e(t,r,a){(0,n.default)(this,e);this.id=t;this.size=r;this.cramped=a}(0,l.default)(e,[{key:"sup",value:function e(){return g[b[this.id]]}},{key:"sub",value:function e(){return g[y[this.id]]}},{key:"fracNum",value:function e(){return g[x[this.id]]}},{key:"fracDen",value:function e(){return g[w[this.id]]}},{key:"cramp",value:function e(){return g[k[this.id]]}},{key:"text",value:function e(){return g[M[this.id]]}},{key:"isTight",value:function e(){return this.size>=2}}]);return e}();var s=0;var f=1;var d=2;var c=3;var h=4;var v=5;var p=6;var m=7;var g=[new o(s,0,false),new o(f,0,true),new o(d,1,false),new o(c,1,true),new o(h,2,false),new o(v,2,true),new o(p,3,false),new o(m,3,true)];var b=[h,v,h,v,p,m,p,m];var y=[v,v,v,v,m,m,m,m];var x=[d,c,h,v,p,m,p,m];var w=[c,c,v,v,m,m,m,m];var k=[f,f,c,c,v,v,m,m];var M=[s,f,d,c,d,c,d,c];r.default={DISPLAY:g[s],TEXT:g[d],SCRIPT:g[h],SCRIPTSCRIPT:g[p]}},{"babel-runtime/helpers/classCallCheck":8,"babel-runtime/helpers/createClass":9}],90:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});r.Token=undefined;var a=e("babel-runtime/helpers/classCallCheck");var n=s(a);var i=e("babel-runtime/helpers/createClass");var l=s(i);var u=e("./SourceLocation");var o=s(u);function s(e){return e&&e.__esModule?e:{default:e}}var f=r.Token=function(){function e(t,r){(0,n.default)(this,e);this.text=t;this.loc=r}(0,l.default)(e,[{key:"range",value:function t(r,a){return new e(a,o.default.range(this,r))}}]);return e}()},{"./SourceLocation":88,"babel-runtime/helpers/classCallCheck":8,"babel-runtime/helpers/createClass":9}],91:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("babel-runtime/core-js/get-iterator");var n=p(a);var i=e("./domTree");var l=p(i);var u=e("./fontMetrics");var o=p(u);var s=e("./symbols");var f=p(s);var d=e("./utils");var c=p(d);var h=e("./stretchy");var v=p(h);function p(e){return e&&e.__esModule?e:{default:e}}var m=["\\imath","\\jmath","\\pounds"];var g=function e(t,r,a){if(f.default[a][t]&&f.default[a][t].replace){t=f.default[a][t].replace}return{value:t,metrics:o.default.getCharacterMetrics(t,r)}};var b=function e(t,r,a,n,i){var u=g(t,r,a);var o=u.metrics;t=u.value;var s=void 0;if(o){var f=o.italic;if(a==="text"){f=0}s=new l.default.symbolNode(t,o.height,o.depth,f,o.skew,i)}else{typeof console!=="undefined"&&console.warn("No character metrics for '"+t+"' in style '"+r+"'");s=new l.default.symbolNode(t,0,0,0,0,i)}if(n){s.maxFontSize=n.sizeMultiplier;if(n.style.isTight()){s.classes.push("mtight")}var d=n.getColor();if(d){s.style.color=d}}return s};var y=function e(t,r,a){var n=arguments.length>3&&arguments[3]!==undefined?arguments[3]:[];if(a&&a.fontFamily&&a.fontFamily==="boldsymbol"&&g(t,"Main-Bold",r).metrics){return b(t,"Main-Bold",r,a,n.concat(["mathbf"]))}else if(t==="\\"||f.default[r][t].font==="main"){return b(t,"Main-Regular",r,a,n)}else{return b(t,"AMS-Regular",r,a,n.concat(["amsrm"]))}};var x=function e(t,r,a,n,i){if(i==="mathord"){var l=w(t,r,a,n);return b(t,l.fontName,r,a,n.concat([l.fontClass]))}else if(i==="textord"){var u=f.default[r][t]&&f.default[r][t].font;if(u==="ams"){var o=E("amsrm",a.fontWeight,a.fontShape);return b(t,o,r,a,n.concat("amsrm",a.fontWeight,a.fontShape))}else{var s=E("textrm",a.fontWeight,a.fontShape);return b(t,s,r,a,n.concat(a.fontWeight,a.fontShape))}}else{throw new Error("unexpected type: "+i+" in mathDefault")}};var w=function e(t,r,a,n){if(/[0-9]/.test(t.charAt(0))||c.default.contains(m,t)){return{fontName:"Main-Italic",fontClass:"mainit"}}else{return{fontName:"Math-Italic",fontClass:"mathit"}}};var k=function e(t,r,a,n){if(g(t,"Math-BoldItalic",r).metrics){return{fontName:"Math-BoldItalic",fontClass:"boldsymbol"}}else{return{fontName:"Main-Bold",fontClass:"mathbf"}}};var M=function e(t,r,a){var n=t.mode;var i=t.value;var l=["mord"];var u=r.fontFamily;if(u){var o=void 0;var s=void 0;if(u==="boldsymbol"){var f=k(i,n,r,l);o=f.fontName;s=[f.fontClass]}else if(u==="mathit"||c.default.contains(m,i)){var d=w(i,n,r,l);o=d.fontName;s=[d.fontClass]}else if(u.includes("math")||n==="math"){o=F[u].fontName;s=[u]}else{o=E(u,r.fontWeight,r.fontShape);s=[u,r.fontWeight,r.fontShape]}if(g(i,o,n).metrics){return b(i,o,n,r,l.concat(s))}else{return x(i,n,r,l,a)}}else{return x(i,n,r,l,a)}};var _=function e(t){for(var r=0;r<t.length-1;r++){if(t[r].tryCombine(t[r+1])){t.splice(r+1,1);r--}}return t};var S=function e(t){var r=0;var a=0;var i=0;var l=true;var u=false;var o=undefined;try{for(var s=(0,n.default)(t.children),f;!(l=(f=s.next()).done);l=true){var d=f.value;if(d.height>r){r=d.height}if(d.depth>a){a=d.depth}if(d.maxFontSize>i){i=d.maxFontSize}}}catch(e){u=true;o=e}finally{try{if(!l&&s.return){s.return()}}finally{if(u){throw o}}}t.height=r;t.depth=a;t.maxFontSize=i};var z=function e(t,r,a){var n=new l.default.span(t,r,a);S(n);return n};var T=function e(t,r){var a=v.default.ruleSpan(t,r);a.height=r.fontMetrics().defaultRuleThickness;a.style.height=a.height+"em";a.maxFontSize=1;return a};var C=function e(t,r,a,n){var i=new l.default.anchor(t,r,a,n);S(i);return i};var A=function e(t,r){t.children=r.concat(t.children);S(t)};var O=function e(t,r){var a=new l.default.documentFragment(t,r);S(a);return a};var N=function e(t){if(t.positionType==="individualShift"){var r=t.children;var a=[r[0]];var i=-r[0].shift-r[0].elem.depth;var l=i;for(var u=1;u<r.length;u++){var o=-r[u].shift-l-r[u].elem.depth;var s=o-(r[u-1].elem.height+r[u-1].elem.depth);l=l+o;a.push({type:"kern",size:s});a.push(r[u])}return{children:a,depth:i}}var f=void 0;if(t.positionType==="top"){var d=t.positionData;var c=true;var h=false;var v=undefined;try{for(var p=(0,n.default)(t.children),m;!(c=(m=p.next()).done);c=true){var g=m.value;d-=g.type==="kern"?g.size:g.elem.height+g.elem.depth}}catch(e){h=true;v=e}finally{try{if(!c&&p.return){p.return()}}finally{if(h){throw v}}}f=d}else if(t.positionType==="bottom"){f=-t.positionData}else{var b=t.children[0];if(b.type!=="elem"){throw new Error('First child must have type "elem".')}if(t.positionType==="shift"){f=-b.elem.depth-t.positionData}else if(t.positionType==="firstBaseline"){f=-b.elem.depth}else{throw new Error("Invalid positionType "+t.positionType+".")}}return{children:t.children,depth:f}};var L=function e(t,r){var a=N(t),i=a.children,u=a.depth;var o=0;var s=true;var f=false;var d=undefined;try{for(var c=(0,n.default)(i),h;!(s=(h=c.next()).done);s=true){var v=h.value;if(v.type==="elem"){var p=v.elem;o=Math.max(o,p.maxFontSize,p.height)}}}catch(e){f=true;d=e}finally{try{if(!s&&c.return){c.return()}}finally{if(f){throw d}}}o+=2;var m=z(["pstrut"],[]);m.style.height=o+"em";var g=[];var b=u;var y=u;var x=u;var w=true;var k=false;var M=undefined;try{for(var _=(0,n.default)(i),S;!(w=(S=_.next()).done);w=true){var T=S.value;if(T.type==="kern"){x+=T.size}else{var C=T.elem;var A=z([],[m,C]);A.style.top=-o-x-C.depth+"em";if(T.marginLeft){A.style.marginLeft=T.marginLeft}if(T.marginRight){A.style.marginRight=T.marginRight}g.push(A);x+=C.height+C.depth}b=Math.min(b,x);y=Math.max(y,x)}}catch(e){k=true;M=e}finally{try{if(!w&&_.return){_.return()}}finally{if(k){throw M}}}var O=z(["vlist"],g);O.style.height=y+"em";var L=void 0;if(b<0){var j=z(["vlist"],[]);j.style.height=-b+"em";var E=z(["vlist-s"],[new l.default.symbolNode("\u200b")]);L=[z(["vlist-r"],[O,E]),z(["vlist-r"],[j])]}else{L=[z(["vlist-r"],[O])]}var q=z(["vlist-t"],L);if(L.length===2){q.classes.push("vlist-t2")}q.height=y;q.depth=-b;return q};var j=function e(t,r){var a=t.value.body;if(t.value.star){a=a.replace(/ /g,"\u2423")}else{a=a.replace(/ /g,"\xa0")}return a};var E=function e(t,r,a){var n=q(t);var i=P(r,a);return n+"-"+i};var q=function e(t){var r="";switch(t){case"amsrm":r="AMS";break;case"textrm":r="Main";break;case"textsf":r="SansSerif";break;case"texttt":r="Typewriter";break;default:throw new Error("Invalid font provided: "+t)}return r};var P=function e(t,r){var a="";if(t==="textbf"){a+="Bold"}if(r==="textit"){a+="Italic"}return a||"Regular"};var B={"\\qquad":{size:"2em",className:"qquad"},"\\quad":{size:"1em",className:"quad"},"\\enspace":{size:"0.5em",className:"enspace"},"\\;":{size:"0.277778em",className:"thickspace"},"\\:":{size:"0.22222em",className:"mediumspace"},"\\,":{size:"0.16667em",className:"thinspace"},"\\!":{size:"-0.16667em",className:"negativethinspace"}};var F={mathbf:{variant:"bold",fontName:"Main-Bold"},mathrm:{variant:"normal",fontName:"Main-Regular"},textit:{variant:"italic",fontName:"Main-Italic"},mathbb:{variant:"double-struck",fontName:"AMS-Regular"},mathcal:{variant:"script",fontName:"Caligraphic-Regular"},mathfrak:{variant:"fraktur",fontName:"Fraktur-Regular"},mathscr:{variant:"script",fontName:"Script-Regular"},mathsf:{variant:"sans-serif",fontName:"SansSerif-Regular"},mathtt:{variant:"monospace",fontName:"Typewriter-Regular"}};r.default={fontMap:F,makeSymbol:b,mathsym:y,makeSpan:z,makeLineSpan:T,makeAnchor:C,makeFragment:O,makeVList:L,makeOrd:M,makeVerb:j,tryCombineChars:_,prependChildren:A,spacingFunctions:B}},{"./domTree":98,"./fontMetrics":101,"./stretchy":123,"./symbols":125,"./utils":128,"babel-runtime/core-js/get-iterator":3}],92:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});r.buildGroup=r.groupTypes=r.makeNullDelimiter=r.getTypeOfDomTree=r.buildExpression=r.spliceSpaces=undefined;var a=e("babel-runtime/core-js/json/stringify");var n=x(a);r.default=P;var i=e("./ParseError");var l=x(i);var u=e("./Style");var o=x(u);var s=e("./buildCommon");var f=x(s);var d=e("./delimiter");var c=x(d);var h=e("./domTree");var v=x(h);var p=e("./units");var m=e("./utils");var g=x(m);var b=e("./stretchy");var y=x(b);function x(e){return e&&e.__esModule?e:{default:e}}var w=f.default.makeSpan;var k=function e(t){return t instanceof v.default.span&&t.classes[0]==="mspace"};var M=function e(t){return t&&t.classes[0]==="mbin"};var _=function e(t,r){if(t){return g.default.contains(["mbin","mopen","mrel","mop","mpunct"],t.classes[0])}else{return r}};var S=function e(t,r){if(t){return g.default.contains(["mrel","mclose","mpunct"],t.classes[0])}else{return r}};var z=r.spliceSpaces=function e(t,r){var a=r;while(a<t.length&&k(t[a])){a++}if(a===r){return null}else{return t.splice(r,a-r)}};var T=r.buildExpression=function e(t,r,a){var n=[];for(var i=0;i<t.length;i++){var l=t[i];var u=q(l,r);if(u instanceof v.default.documentFragment){Array.prototype.push.apply(n,u.children)}else{n.push(u)}}for(var o=0;o<n.length;o++){var s=z(n,o);if(s){if(o<n.length){if(n[o]instanceof v.default.symbolNode){n[o]=w([].concat(n[o].classes),[n[o]])}f.default.prependChildren(n[o],s)}else{Array.prototype.push.apply(n,s);break}}}for(var d=0;d<n.length;d++){var c=1;var h=1;while(n[d-c]&&n[d-c].classes[0]==="cursor"){c++}while(n[d+h]&&n[d+h].classes[0]==="cursor"){h++}if(M(n[d])&&(_(n[d-c],a)||S(n[d+h],a))){n[d].classes[0]="mord"}}for(var p=0;p<n.length;p++){if(n[p].value==="\u0338"&&p+1<n.length){var m=n.slice(p,p+2);m[0].classes=["mainrm"];m[0].style.position="absolute";m[0].style.right="0";var g=n[p+1].classes;var b=w(g,m);if(g.indexOf("mord")!==-1){b.style.paddingLeft="0.277771em"}b.style.position="relative";n.splice(p,2,b)}}return n};var C=r.getTypeOfDomTree=function e(t){if(t instanceof v.default.documentFragment){if(t.children.length){return e(t.children[t.children.length-1])}}else{if(g.default.contains(["mord","mop","mbin","mrel","mopen","mclose","mpunct","minner"],t.classes[0])){return t.classes[0]}}return null};var A=function e(t,r){if(!t.value.base){return false}else{var a=t.value.base;if(a.type==="op"){return a.value.limits&&(r.style.size===o.default.DISPLAY.size||a.value.alwaysHandleSupSub)}else if(a.type==="accent"){return N(a.value.base)}else if(a.type==="horizBrace"){var n=t.value.sub?false:true;return n===a.value.isOver}else{return null}}};var O=function e(t){if(!t){return false}else if(t.type==="ordgroup"){if(t.value.length===1){return e(t.value[0])}else{return t}}else if(t.type==="color"){if(t.value.value.length===1){return e(t.value.value[0])}else{return t}}else if(t.type==="font"){return e(t.value.body)}else{return t}};var N=function e(t){var r=O(t);return r.type==="mathord"||r.type==="textord"||r.type==="bin"||r.type==="rel"||r.type==="inner"||r.type==="open"||r.type==="close"||r.type==="punct"};var L=r.makeNullDelimiter=function e(t,r){var a=["nulldelimiter"].concat(t.baseSizingClasses());return w(r.concat(a))};var j=r.groupTypes={};j.mathord=function(e,t){return f.default.makeOrd(e,t,"mathord")};j.textord=function(e,t){return f.default.makeOrd(e,t,"textord")};j.bin=function(e,t){return f.default.mathsym(e.value,e.mode,t,["mbin"])};j.rel=function(e,t){return f.default.mathsym(e.value,e.mode,t,["mrel"])};j.open=function(e,t){return f.default.mathsym(e.value,e.mode,t,["mopen"])};j.close=function(e,t){return f.default.mathsym(e.value,e.mode,t,["mclose"])};j.inner=function(e,t){return f.default.mathsym(e.value,e.mode,t,["minner"])};j.punct=function(e,t){return f.default.mathsym(e.value,e.mode,t,["mpunct"])};j.ordgroup=function(e,t){return w(["mord"],T(e.value,t,true),t)};j.xmlClass=function(e,t,r){var a=T(e.value.value,t,r);return new f.default.makeFragment(a,[e.value.cl])};j.supsub=function(e,t){if(A(e,t)){return j[e.value.base.type](e,t)}var r=q(e.value.base,t);var a=void 0;var n=void 0;var i=t.fontMetrics();var l=void 0;var u=0;var s=0;if(e.value.sup){l=t.havingStyle(t.style.sup());a=q(e.value.sup,l,t);if(!N(e.value.base)){u=r.height-l.fontMetrics().supDrop*l.sizeMultiplier/t.sizeMultiplier}}if(e.value.sub){l=t.havingStyle(t.style.sub());n=q(e.value.sub,l,t);if(!N(e.value.base)){s=r.depth+l.fontMetrics().subDrop*l.sizeMultiplier/t.sizeMultiplier}}var d=void 0;if(t.style===o.default.DISPLAY){d=i.sup1}else if(t.style.cramped){d=i.sup3}else{d=i.sup2}var c=t.sizeMultiplier;var h=.5/i.ptPerEm/c+"em";var p=void 0;if(!e.value.sup){s=Math.max(s,i.sub1,n.height-.8*i.xHeight);var m=[{type:"elem",elem:n,marginRight:h}];if(r instanceof v.default.symbolNode){m[0].marginLeft=-r.italic+"em"}p=f.default.makeVList({positionType:"shift",positionData:s,children:m},t)}else if(!e.value.sub){u=Math.max(u,d,a.depth+.25*i.xHeight);p=f.default.makeVList({positionType:"shift",positionData:-u,children:[{type:"elem",elem:a,marginRight:h}]},t)}else{u=Math.max(u,d,a.depth+.25*i.xHeight);s=Math.max(s,i.sub2);var g=i.defaultRuleThickness;if(u-a.depth-(n.height-s)<4*g){s=4*g-(u-a.depth)+n.height;var b=.8*i.xHeight-(u-a.depth);if(b>0){u+=b;s-=b}}var y=[{type:"elem",elem:n,shift:s,marginRight:h},{type:"elem",elem:a,shift:-u,marginRight:h}];if(r instanceof v.default.symbolNode){y[0].marginLeft=-r.italic+"em"}p=f.default.makeVList({positionType:"individualShift",children:y},t)}var x=C(r)||"mord";return w([x],[r,w(["msupsub"],[p])],t)};j.spacing=function(e,t){if(e.value==="\\ "||e.value==="\\space"||e.value===" "||e.value==="~"){if(e.mode==="text"){return f.default.makeOrd(e,t,"textord")}else{return w(["mspace"],[f.default.mathsym(e.value,e.mode,t)],t)}}else{return w(["mspace",f.default.spacingFunctions[e.value].className],[],t)}};j.sqrt=function(e,t){var r=q(e.value.body,t.havingCrampedStyle());if(r.height===0){r.height=t.fontMetrics().xHeight}if(r instanceof v.default.documentFragment){r=w([],[r],t)}var a=t.fontMetrics();var n=a.defaultRuleThickness;var i=n;if(t.style.id<o.default.TEXT.id){i=t.fontMetrics().xHeight}var l=n+i/4;var u=(r.height+r.depth+l+n)*t.sizeMultiplier;var s=c.default.sqrtImage(u,t),d=s.span,h=s.ruleWidth;var p=d.height-h;if(p>r.height+r.depth+l){l=(l+p-r.height-r.depth)/2}var m=d.height-r.height-l-h;r.style.paddingLeft=d.advanceWidth+"em";var g=f.default.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:r},{
type:"kern",size:-(r.height+m)},{type:"elem",elem:d},{type:"kern",size:h}]},t);g.children[0].children[0].classes.push("svg-align");if(!e.value.index){return w(["mord","sqrt"],[g],t)}else{var b=t.havingStyle(o.default.SCRIPTSCRIPT);var y=q(e.value.index,b,t);var x=.6*(g.height-g.depth);var k=f.default.makeVList({positionType:"shift",positionData:-x,children:[{type:"elem",elem:y}]},t);var M=w(["root"],[k]);return w(["mord","sqrt"],[M,g],t)}};function E(e,t,r){var a=T(e,t,false);var n=t.sizeMultiplier/r.sizeMultiplier;for(var i=0;i<a.length;i++){var l=g.default.indexOf(a[i].classes,"sizing");if(l<0){Array.prototype.push.apply(a[i].classes,t.sizingClasses(r))}else if(a[i].classes[l+1]==="reset-size"+t.size){a[i].classes[l+1]="reset-size"+r.size}a[i].height*=n;a[i].depth*=n}return f.default.makeFragment(a)}j.sizing=function(e,t){var r=t.havingSize(e.value.size);return E(e.value.value,r,t)};j.styling=function(e,t){var r={display:o.default.DISPLAY,text:o.default.TEXT,script:o.default.SCRIPT,scriptscript:o.default.SCRIPTSCRIPT};var a=r[e.value.style];var n=t.havingStyle(a);return E(e.value.value,n,t)};j.font=function(e,t){var r=e.value.font;return q(e.value.body,t.withFontFamily(r))};j.verb=function(e,t){var r=f.default.makeVerb(e,t);var a=[];var n=t.havingStyle(t.style.text());for(var i=0;i<r.length;i++){if(r[i]==="\xa0"){var l=w(["mord","rule"],[],n);l.style.marginLeft="0.525em";a.push(l)}else{a.push(f.default.makeSymbol(r[i],"Typewriter-Regular",e.mode,n,["mathtt"]))}}f.default.tryCombineChars(a);return w(["mord","text"].concat(n.sizingClasses(t)),a,n)};j.cursor=function(e,t,r){var a=w(["cursor"],[],t);var n=0;var i=(0,p.calculateSize)(e.value.height,t);if(e.value.shift){n=(0,p.calculateSize)(e.value.shift,t)}n/=t.sizeMultiplier;i/=t.sizeMultiplier;a.style.marginRight="-1px";a.style.borderRight="1px solid";a.style.marginBottom=n+"em";a.style.height=i+"em";a.width=1;a.height=i+n;a.depth=-n;e.value.previous=r;return a};j.accent=function(e,t){var r=e.value.base;var a=void 0;if(e.type==="supsub"){var n=e;e=n.value.base;r=e.value.base;n.value.base=r;a=q(n,t)}var i=q(r,t.havingCrampedStyle());var l=e.value.isShifty&&N(r);var u=0;if(l){var o=O(r);var s=q(o,t.havingCrampedStyle());u=s.skew}var d=Math.min(i.height,t.fontMetrics().xHeight);var c=void 0;if(!e.value.isStretchy){var h=f.default.makeSymbol(e.value.label,"Main-Regular",e.mode,t);h.italic=0;var v=null;if(e.value.label==="\\vec"){v="accent-vec"}else if(e.value.label==="\\H"){v="accent-hungarian"}c=w([],[h]);c=w(["accent-body",v],[c]);c.style.marginLeft=2*u+"em";c=f.default.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:i},{type:"kern",size:-d},{type:"elem",elem:c}]},t)}else{c=y.default.svgSpan(e,t);c=f.default.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:i},{type:"elem",elem:c}]},t);var p=c.children[0].children[0].children[1];p.classes.push("svg-align");if(u>0){p.style.width="calc(100% - "+2*u+"em)";p.style.marginLeft=2*u+"em"}}var m=w(["mord","accent"],[c],t);if(a){a.children[0]=m;a.height=Math.max(m.height,a.height);a.classes[0]="mord";return a}else{return m}};j.horizBrace=function(e,t){var r=t.style;var a=e.type==="supsub";var n=void 0;var i=void 0;if(a){if(e.value.sup){i=t.havingStyle(r.sup());n=q(e.value.sup,i,t)}else{i=t.havingStyle(r.sub());n=q(e.value.sub,i,t)}e=e.value.base}var l=q(e.value.base,t.havingBaseStyle(o.default.DISPLAY));var u=y.default.svgSpan(e,t);var s=void 0;if(e.value.isOver){s=f.default.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:l},{type:"kern",size:.1},{type:"elem",elem:u}]},t);s.children[0].children[0].children[1].classes.push("svg-align")}else{s=f.default.makeVList({positionType:"bottom",positionData:l.depth+.1+u.height,children:[{type:"elem",elem:u},{type:"kern",size:.1},{type:"elem",elem:l}]},t);s.children[0].children[0].children[0].classes.push("svg-align")}if(a){var d=w(["mord",e.value.isOver?"mover":"munder"],[s],t);if(e.value.isOver){s=f.default.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:d},{type:"kern",size:.2},{type:"elem",elem:n}]},t)}else{s=f.default.makeVList({positionType:"bottom",positionData:d.depth+.2+n.height,children:[{type:"elem",elem:n},{type:"kern",size:.2},{type:"elem",elem:d}]},t)}}return w(["mord",e.value.isOver?"mover":"munder"],[s],t)};j.accentUnder=function(e,t){var r=q(e.value.base,t);var a=y.default.svgSpan(e,t);var n=/tilde/.test(e.value.label)?.12:0;var i=f.default.makeVList({positionType:"bottom",positionData:a.height+n,children:[{type:"elem",elem:a},{type:"kern",size:n},{type:"elem",elem:r}]},t);i.children[0].children[0].children[0].classes.push("svg-align");return w(["mord","accentunder"],[i],t)};j.enclose=function(e,t){var r=q(e.value.body,t);var a=e.value.label.substr(1);var n=t.sizeMultiplier;var i=void 0;var l=0;var u=/color/.test(a);if(a==="sout"){i=w(["stretchy","sout"]);i.height=t.fontMetrics().defaultRuleThickness/n;l=-.5*t.fontMetrics().xHeight}else{r.classes.push(/cancel/.test(a)?"cancel-pad":"boxpad");var o=0;if(/box/.test(a)){o=a==="colorbox"?.3:.34}else{o=N(e.value.body)?.2:0}i=y.default.encloseSpan(r,a,o,t);l=r.depth+o;if(u){i.style.backgroundColor=e.value.backgroundColor.value;if(a==="fcolorbox"){i.style.borderColor=e.value.borderColor.value}}}var s=void 0;if(u){s=f.default.makeVList({positionType:"individualShift",children:[{type:"elem",elem:i,shift:l},{type:"elem",elem:r,shift:0}]},t)}else{s=f.default.makeVList({positionType:"individualShift",children:[{type:"elem",elem:r,shift:0},{type:"elem",elem:i,shift:l}]},t)}if(/cancel/.test(a)){s.children[0].children[0].children[1].classes.push("svg-align");return w(["mord","cancel-lap"],[s],t)}else{return w(["mord"],[s],t)}};j.xArrow=function(e,t){var r=t.style;var a=t.havingStyle(r.sup());var n=q(e.value.body,a,t);n.classes.push("x-arrow-pad");var i=void 0;if(e.value.below){a=t.havingStyle(r.sub());i=q(e.value.below,a,t);i.classes.push("x-arrow-pad")}var l=y.default.svgSpan(e,t);var u=-t.fontMetrics().axisHeight+.5*l.height;var o=-t.fontMetrics().axisHeight-.5*l.height-.111;var s=void 0;if(e.value.below){var d=-t.fontMetrics().axisHeight+i.height+.5*l.height+.111;s=f.default.makeVList({positionType:"individualShift",children:[{type:"elem",elem:n,shift:o},{type:"elem",elem:l,shift:u},{type:"elem",elem:i,shift:d}]},t)}else{s=f.default.makeVList({positionType:"individualShift",children:[{type:"elem",elem:n,shift:o},{type:"elem",elem:l,shift:u}]},t)}s.children[0].children[0].children[1].classes.push("svg-align");return w(["mrel","x-arrow"],[s],t)};j.mclass=function(e,t){var r=T(e.value.value,t,true);return w([e.value.mclass],r,t)};j.raisebox=function(e,t){var r=j.sizing({value:{value:[{type:"text",value:{body:e.value.value,font:"mathrm"}}],size:6}},t);var a=(0,p.calculateSize)(e.value.dy.value,t);return f.default.makeVList({positionType:"shift",positionData:-a,children:[{type:"elem",elem:r}]},t)};var q=r.buildGroup=function e(t,r,a){if(!t){return w()}if(j[t.type]){var n=j[t.type](t,r);if(a&&r.size!==a.size){n=w(r.sizingClasses(a),[n],r);var i=r.sizeMultiplier/a.sizeMultiplier;n.height*=i;n.depth*=i}return n}else{throw new l.default("Got group of unknown type: '"+t.type+"'")}};function P(e,t){e=JSON.parse((0,n.default)(e));var r=T(e,t,true);var a=w(["base"],r,t);var i=w(["strut"]);var l=w(["strut","bottom"]);i.style.height=a.height+"em";l.style.height=a.height+a.depth+"em";l.style.verticalAlign=-a.depth+"em";var u=w(["katex-html"],[i,l,a]);u.setAttribute("aria-hidden","true");return u}},{"./ParseError":84,"./Style":89,"./buildCommon":91,"./delimiter":97,"./domTree":98,"./stretchy":123,"./units":127,"./utils":128,"babel-runtime/core-js/json/stringify":5}],93:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});r.buildGroup=r.buildExpression=r.groupTypes=r.makeText=undefined;r.default=z;var a=e("./buildCommon");var n=y(a);var i=e("./fontMetrics");var l=y(i);var u=e("./mathMLTree");var o=y(u);var s=e("./ParseError");var f=y(s);var d=e("./Style");var c=y(d);var h=e("./symbols");var v=y(h);var p=e("./utils");var m=y(p);var g=e("./stretchy");var b=y(g);function y(e){return e&&e.__esModule?e:{default:e}}var x=r.makeText=function e(t,r){if(v.default[r][t]&&v.default[r][t].replace){t=v.default[r][t].replace}return new o.default.TextNode(t)};var w=function e(t,r){var a=r.fontFamily;if(!a){return null}var i=t.mode;if(a==="mathit"){return"italic"}else if(a==="boldsymbol"){return"bold-italic"}var u=t.value;if(m.default.contains(["\\imath","\\jmath"],u)){return null}if(v.default[i][u]&&v.default[i][u].replace){u=v.default[i][u].replace}var o=n.default.fontMap[a].fontName;if(l.default.getCharacterMetrics(u,o)){return n.default.fontMap[a].variant}return null};var k=r.groupTypes={};var M={mi:"italic",mn:"normal",mtext:"normal"};k.mathord=function(e,t){var r=new o.default.MathNode("mi",[x(e.value,e.mode)]);var a=w(e,t)||"italic";if(a!==M[r.type]){r.setAttribute("mathvariant",a)}return r};k.textord=function(e,t){var r=x(e.value,e.mode);var a=w(e,t)||"normal";var n=void 0;if(e.mode==="text"){n=new o.default.MathNode("mtext",[r])}else if(/[0-9]/.test(e.value)){n=new o.default.MathNode("mn",[r])}else if(e.value==="\\prime"){n=new o.default.MathNode("mo",[r])}else{n=new o.default.MathNode("mi",[r])}if(a!==M[n.type]){n.setAttribute("mathvariant",a)}return n};k.bin=function(e,t){var r=new o.default.MathNode("mo",[x(e.value,e.mode)]);var a=w(e,t);if(a==="bold-italic"){r.setAttribute("mathvariant",a)}return r};k.rel=function(e){var t=new o.default.MathNode("mo",[x(e.value,e.mode)]);return t};k.open=function(e){var t=new o.default.MathNode("mo",[x(e.value,e.mode)]);return t};k.close=function(e){var t=new o.default.MathNode("mo",[x(e.value,e.mode)]);return t};k.inner=function(e){var t=new o.default.MathNode("mo",[x(e.value,e.mode)]);return t};k.punct=function(e){var t=new o.default.MathNode("mo",[x(e.value,e.mode)]);t.setAttribute("separator","true");return t};k.ordgroup=function(e,t){var r=_(e.value,t);var a=new o.default.MathNode("mrow",r);return a};k.xmlClass=function(e,t){var r=_(e.value.value,t);var a=new o.default.MathNode("mstyle",r);a.setAttribute("class",e.value.cl);return a};k.supsub=function(e,t){var r=false;var a=void 0;var n=void 0;if(e.value.base){if(e.value.base.value.type==="horizBrace"){n=e.value.sup?true:false;if(n===e.value.base.value.isOver){r=true;a=e.value.base.value.isOver}}}var i=true;var l=[S(e.value.base,t,i)];if(e.value.sub){l.push(S(e.value.sub,t,i))}if(e.value.sup){l.push(S(e.value.sup,t,i))}var u=void 0;if(r){u=a?"mover":"munder"}else if(!e.value.sub){u="msup"}else if(!e.value.sup){u="msub"}else{var s=e.value.base;if(s&&s.value.limits&&t.style===c.default.DISPLAY){u="munderover"}else{u="msubsup"}}var f=new o.default.MathNode(u,l);return f};k.sqrt=function(e,t){var r=void 0;if(e.value.index){r=new o.default.MathNode("mroot",[S(e.value.body,t),S(e.value.index,t)])}else{r=new o.default.MathNode("msqrt",[S(e.value.body,t)])}return r};k.accent=function(e,t){var r=void 0;if(e.value.isStretchy){r=b.default.mathMLnode(e.value.label)}else{r=new o.default.MathNode("mo",[x(e.value.label,e.mode)])}var a=new o.default.MathNode("mover",[S(e.value.base,t),r]);a.setAttribute("accent","true");return a};k.spacing=function(e){var t=void 0;if(e.value==="\\ "||e.value==="\\space"||e.value===" "||e.value==="~"){t=new o.default.MathNode("mtext",[new o.default.TextNode("\xa0")])}else{t=new o.default.MathNode("mspace");t.setAttribute("width",n.default.spacingFunctions[e.value].size)}return t};k.cursor=function(e){var t=new o.default.MathNode("mtext",[new o.default.TextNode("|")]);return t};k.font=function(e,t){var r=e.value.font;return S(e.value.body,t.withFontFamily(r))};k.styling=function(e,t){var r={display:c.default.DISPLAY,text:c.default.TEXT,script:c.default.SCRIPT,scriptscript:c.default.SCRIPTSCRIPT};var a=r[e.value.style];var n=t.havingStyle(a);var i=_(e.value.value,n);var l=new o.default.MathNode("mstyle",i);var u={display:["0","true"],text:["0","false"],script:["1","false"],scriptscript:["2","false"]};var s=u[e.value.style];l.setAttribute("scriptlevel",s[0]);l.setAttribute("displaystyle",s[1]);return l};k.sizing=function(e,t){var r=t.havingSize(e.value.size);var a=_(e.value.value,r);var n=new o.default.MathNode("mstyle",a);n.setAttribute("mathsize",r.sizeMultiplier+"em");return n};k.verb=function(e,t){var r=new o.default.TextNode(n.default.makeVerb(e,t));var a=new o.default.MathNode("mtext",[r]);a.setAttribute("mathvariant",n.default.fontMap["mathtt"].variant);return a};k.accentUnder=function(e,t){var r=b.default.mathMLnode(e.value.label);var a=new o.default.MathNode("munder",[S(e.value.body,t),r]);a.setAttribute("accentunder","true");return a};k.enclose=function(e,t){var r=new o.default.MathNode("menclose",[S(e.value.body,t)]);switch(e.value.label){case"\\cancel":r.setAttribute("notation","updiagonalstrike");break;case"\\bcancel":r.setAttribute("notation","downdiagonalstrike");break;case"\\sout":r.setAttribute("notation","horizontalstrike");break;case"\\fbox":r.setAttribute("notation","box");break;case"\\colorbox":r.setAttribute("mathbackground",e.value.backgroundColor.value);break;case"\\fcolorbox":r.setAttribute("mathbackground",e.value.backgroundColor.value);r.setAttribute("notation","box");break;default:r.setAttribute("notation","updiagonalstrike downdiagonalstrike")}return r};k.horizBrace=function(e,t){var r=b.default.mathMLnode(e.value.label);return new o.default.MathNode(e.value.isOver?"mover":"munder",[S(e.value.base,t),r])};k.xArrow=function(e,t){var r=b.default.mathMLnode(e.value.label);var a=void 0;var n=void 0;if(e.value.body){var i=S(e.value.body,t);if(e.value.below){n=S(e.value.below,t);a=new o.default.MathNode("munderover",[r,n,i])}else{a=new o.default.MathNode("mover",[r,i])}}else if(e.value.below){n=S(e.value.below,t);a=new o.default.MathNode("munder",[r,n])}else{a=new o.default.MathNode("mover",[r])}return a};k.mclass=function(e,t){var r=_(e.value.value,t);return new o.default.MathNode("mstyle",r)};k.raisebox=function(e,t){var r=new o.default.MathNode("mpadded",[S(e.value.body,t)]);var a=e.value.dy.value.number+e.value.dy.value.unit;r.setAttribute("voffset",a);return r};var _=r.buildExpression=function e(t,r){var a=[];for(var n=0;n<t.length;n++){var i=t[n];a.push(S(i,r))}return a};var S=r.buildGroup=function e(t,r){var a=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;if(!t){return new o.default.MathNode("mrow")}if(k[t.type]){var n=k[t.type](t,r);if(a){if(n.type==="mrow"&&n.children.length===1){return n.children[0]}}return n}else{throw new f.default("Got group of unknown type: '"+t.type+"'")}};function z(e,t,r){var a=_(e,r);var i=new o.default.MathNode("mrow",a);var l=new o.default.MathNode("annotation",[new o.default.TextNode(t)]);l.setAttribute("encoding","application/x-tex");var u=new o.default.MathNode("semantics",[i,l]);var s=new o.default.MathNode("math",[u]);return n.default.makeSpan(["katex-mathml"],[s])}},{"./ParseError":84,"./Style":89,"./buildCommon":91,"./fontMetrics":101,"./mathMLTree":121,"./stretchy":123,"./symbols":125,"./utils":128}],94:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("./buildHTML");var n=p(a);var i=e("./buildMathML");var l=p(i);var u=e("./buildCommon");var o=p(u);var s=e("./Options");var f=p(s);var d=e("./Settings");var c=p(d);var h=e("./Style");var v=p(h);function p(e){return e&&e.__esModule?e:{default:e}}var m=function e(t,r,a){a=a||new c.default({});var i=v.default.TEXT;if(a.displayMode){i=v.default.DISPLAY}var u=new f.default({style:i,maxSize:a.maxSize});var s=(0,l.default)(t,r,u);var d=(0,n.default)(t,u);var h=o.default.makeSpan(["katex"],[s,d]);if(a.displayMode){return o.default.makeSpan(["katex-display"],[h])}else{return h}};r.default=m},{"./Options":83,"./Settings":87,"./Style":89,"./buildCommon":91,"./buildHTML":92,"./buildMathML":93}],95:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});r._environments=undefined;r.default=d;var a=e("./buildHTML");var n=e("./buildMathML");var i=e("./Options");var l=s(i);var u=e("./ParseNode");var o=s(u);function s(e){return e&&e.__esModule?e:{default:e}}var f=r._environments={};function d(e){var t=e.type,r=e.names,i=e.props,l=e.handler,u=e.htmlBuilder,o=e.mathmlBuilder;var s={numArgs:i.numArgs||0,greediness:1,allowedInText:false,numOptionalArgs:0,handler:l};for(var d=0;d<r.length;++d){f[r[d]]=s}if(u){a.groupTypes[t]=u}if(o){n.groupTypes[t]=o}}},{"./Options":83,"./ParseNode":85,"./buildHTML":92,"./buildMathML":93}],96:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});r.ordargument=r._functions=undefined;r.default=l;var a=e("./buildHTML");var n=e("./buildMathML");var i=r._functions={};function l(e){var t=e.type,r=e.names,l=e.props,u=e.handler,o=e.htmlBuilder,s=e.mathmlBuilder;var f={numArgs:l.numArgs,argTypes:l.argTypes,greediness:l.greediness===undefined?1:l.greediness,allowedInText:!!l.allowedInText,allowedInMath:l.allowedInMath===undefined?true:l.allowedInMath,numOptionalArgs:l.numOptionalArgs||0,infix:!!l.infix,handler:u};for(var d=0;d<r.length;++d){i[r[d]]=f}if(t){if(o){a.groupTypes[t]=o}if(s){n.groupTypes[t]=s}}}var u=r.ordargument=function e(t){if(t.type==="ordgroup"){return t.value}else{return[t]}}},{"./buildHTML":92,"./buildMathML":93}],97:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("./ParseError");var n=g(a);var i=e("./Style");var l=g(i);var u=e("./domTree");var o=g(u);var s=e("./buildCommon");var f=g(s);var d=e("./fontMetrics");var c=g(d);var h=e("./symbols");var v=g(h);var p=e("./utils");var m=g(p);function g(e){return e&&e.__esModule?e:{default:e}}var b=function e(t,r){if(v.default.math[t]&&v.default.math[t].replace){return c.default.getCharacterMetrics(v.default.math[t].replace,r)}else{return c.default.getCharacterMetrics(t,r)}};var y=function e(t,r,a,n){var i=a.havingBaseStyle(r);var l=f.default.makeSpan((n||[]).concat(i.sizingClasses(a)),[t],a);l.delimSizeMultiplier=i.sizeMultiplier/a.sizeMultiplier;l.height*=l.delimSizeMultiplier;l.depth*=l.delimSizeMultiplier;l.maxFontSize=i.sizeMultiplier;return l};var x=function e(t,r,a){var n=r.havingBaseStyle(a);var i=(1-r.sizeMultiplier/n.sizeMultiplier)*r.fontMetrics().axisHeight;t.classes.push("delimcenter");t.style.top=i+"em";t.height-=i;t.depth+=i};var w=function e(t,r,a,n,i,l){var u=f.default.makeSymbol(t,"Main-Regular",i,n);var o=y(u,r,n,l);if(a){x(o,n,r)}return o};var k=function e(t,r,a,n){return f.default.makeSymbol(t,"Size"+r+"-Regular",a,n)};var M=function e(t,r,a,n,i,u){var o=k(t,r,i,n);var s=y(f.default.makeSpan(["delimsizing","size"+r],[o],n),l.default.TEXT,n,u);if(a){x(s,n,l.default.TEXT)}return s};var _=function e(t,r,a){var n=void 0;if(r==="Size1-Regular"){n="delim-size1"}else if(r==="Size4-Regular"){n="delim-size4"}var i=f.default.makeSpan(["delimsizinginner",n],[f.default.makeSpan([],[f.default.makeSymbol(t,r,a)])]);return{type:"elem",elem:i}};var S=function e(t,r,a,n,i,u){var o=void 0;var s=void 0;var d=void 0;var c=void 0;o=d=c=t;s=null;var h="Size1-Regular";if(t==="\\uparrow"){d=c="\u23d0"}else if(t==="\\Uparrow"){d=c="\u2016"}else if(t==="\\downarrow"){o=d="\u23d0"}else if(t==="\\Downarrow"){o=d="\u2016"}else if(t==="\\updownarrow"){o="\\uparrow";d="\u23d0";c="\\downarrow"}else if(t==="\\Updownarrow"){o="\\Uparrow";d="\u2016";c="\\Downarrow"}else if(t==="["||t==="\\lbrack"){o="\u23a1";d="\u23a2";c="\u23a3";h="Size4-Regular"}else if(t==="]"||t==="\\rbrack"){o="\u23a4";d="\u23a5";c="\u23a6";h="Size4-Regular"}else if(t==="\\lfloor"){d=o="\u23a2";c="\u23a3";h="Size4-Regular"}else if(t==="\\lceil"){o="\u23a1";d=c="\u23a2";h="Size4-Regular"}else if(t==="\\rfloor"){d=o="\u23a5";c="\u23a6";h="Size4-Regular"}else if(t==="\\rceil"){o="\u23a4";d=c="\u23a5";h="Size4-Regular"}else if(t==="("){o="\u239b";d="\u239c";c="\u239d";h="Size4-Regular"}else if(t===")"){o="\u239e";d="\u239f";c="\u23a0";h="Size4-Regular"}else if(t==="\\{"||t==="\\lbrace"){o="\u23a7";s="\u23a8";c="\u23a9";d="\u23aa";h="Size4-Regular"}else if(t==="\\}"||t==="\\rbrace"){o="\u23ab";s="\u23ac";c="\u23ad";d="\u23aa";h="Size4-Regular"}else if(t==="\\lgroup"){o="\u23a7";c="\u23a9";d="\u23aa";h="Size4-Regular"}else if(t==="\\rgroup"){o="\u23ab";c="\u23ad";d="\u23aa";h="Size4-Regular"}else if(t==="\\lmoustache"){o="\u23a7";c="\u23ad";d="\u23aa";h="Size4-Regular"}else if(t==="\\rmoustache"){o="\u23ab";c="\u23a9";d="\u23aa";h="Size4-Regular"}var v=b(o,h);var p=v.height+v.depth;var m=b(d,h);var g=m.height+m.depth;var x=b(c,h);var w=x.height+x.depth;var k=0;var M=1;if(s!==null){var S=b(s,h);k=S.height+S.depth;M=2}var z=p+w+k;var T=Math.ceil((r-z)/(M*g));var C=z+T*M*g;var A=n.fontMetrics().axisHeight;if(a){A*=n.sizeMultiplier}var O=C/2-A;var N=[];N.push(_(c,h,i));if(s===null){for(var L=0;L<T;L++){N.push(_(d,h,i))}}else{for(var j=0;j<T;j++){N.push(_(d,h,i))}N.push(_(s,h,i));for(var E=0;E<T;E++){N.push(_(d,h,i))}}N.push(_(o,h,i));var q=n.havingBaseStyle(l.default.TEXT);var P=f.default.makeVList({positionType:"bottom",positionData:O,children:N},q);return y(f.default.makeSpan(["delimsizing","mult"],[P],q),l.default.TEXT,n,u)};var z=function e(t,r,a,n){var i=void 0;if(t==="sqrtTall"){var l=a-54;i="M702 0H400000v40H742v"+l+"l-4 4-4 4c-.667.667\n-2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1h-12l-28-84c-16.667-52-96.667\n-294.333-240-727l-212 -643 -85 170c-4-3.333-8.333-7.667-13 -13l-13-13l77-155\n 77-156c66 199.333 139 419.667 219 661 l218 661zM702 0H400000v40H742z"}var u=new o.default.pathNode(t,i);var s=new o.default.svgNode([u],{width:"400em",height:r+"em",viewBox:"0 0 400000 "+a,preserveAspectRatio:"xMinYMin slice"});return f.default.makeSpan(["hide-tail"],[s],n)};var T=function e(t,r){var a=B("\\surd",t,q,r);var n=void 0;var i=r.sizeMultiplier;var l=void 0;var u=void 0;if(a.type==="small"){u=1e3;var o=r.havingBaseStyle(a.style);i=o.sizeMultiplier/r.sizeMultiplier;l=1*i;n=z("sqrtMain",l,u,r);n.style.minWidth="0.853em";n.advanceWidth=.833*i}else if(a.type==="large"){u=1e3*N[a.size];l=N[a.size]/i;n=z("sqrtSize"+a.size,l,u,r);n.style.minWidth="1.02em";n.advanceWidth=1/i}else{l=t/i;u=Math.floor(1e3*t);n=z("sqrtTall",l,u,r);n.style.minWidth="0.742em";n.advanceWidth=1.056/i}n.height=l;n.style.height=l+"em";return{span:n,ruleWidth:r.fontMetrics().sqrtRuleThickness*i}};var C=["(",")","[","\\lbrack","]","\\rbrack","\\{","\\lbrace","\\}","\\rbrace","\\lfloor","\\rfloor","\\lceil","\\rceil","\\surd"];var A=["\\uparrow","\\downarrow","\\updownarrow","\\Uparrow","\\Downarrow","\\Updownarrow","|","\\|","\\vert","\\Vert","\\lvert","\\rvert","\\lVert","\\rVert","\\lgroup","\\rgroup","\\lmoustache","\\rmoustache"];var O=["<",">","\\langle","\\rangle","/","\\backslash","\\lt","\\gt"];var N=[0,1.2,1.8,2.4,3];var L=function e(t,r,a,i,l){if(t==="<"||t==="\\lt"){t="\\langle"}else if(t===">"||t==="\\gt"){t="\\rangle"}if(m.default.contains(C,t)||m.default.contains(O,t)){return M(t,r,false,a,i,l)}else if(m.default.contains(A,t)){return S(t,N[r],false,a,i,l)}else{throw new n.default("Illegal delimiter: '"+t+"'")}};var j=[{type:"small",style:l.default.SCRIPTSCRIPT},{type:"small",style:l.default.SCRIPT},{type:"small",style:l.default.TEXT},{type:"large",size:1},{type:"large",size:2},{type:"large",size:3},{type:"large",size:4}];var E=[{type:"small",style:l.default.SCRIPTSCRIPT},{type:"small",style:l.default.SCRIPT},{type:"small",style:l.default.TEXT},{type:"stack"}];var q=[{type:"small",style:l.default.SCRIPTSCRIPT},{type:"small",style:l.default.SCRIPT},{type:"small",style:l.default.TEXT},{type:"large",size:1},{type:"large",size:2},{type:"large",size:3},{type:"large",size:4},{type:"stack"}];var P=function e(t){if(t.type==="small"){return"Main-Regular"}else if(t.type==="large"){return"Size"+t.size+"-Regular"}else if(t.type==="stack"){return"Size4-Regular"}};var B=function e(t,r,a,n){var i=Math.min(2,3-n.style.size);for(var l=i;l<a.length;l++){if(a[l].type==="stack"){break}var u=b(t,P(a[l]));var o=u.height+u.depth;if(a[l].type==="small"){var s=n.havingBaseStyle(a[l].style);o*=s.sizeMultiplier}if(o>r){return a[l]}}return a[a.length-1]};var F=function e(t,r,a,n,i,l){if(t==="<"||t==="\\lt"){t="\\langle"}else if(t===">"||t==="\\gt"){t="\\rangle"}var u=void 0;if(m.default.contains(O,t)){u=j}else if(m.default.contains(C,t)){u=q}else{u=E}var o=B(t,r,u,n);if(o.type==="small"){return w(t,o.style,a,n,i,l)}else if(o.type==="large"){return M(t,o.size,a,n,i,l)}else{return S(t,r,a,n,i,l)}};var R=function e(t,r,a,n,i,l){var u=n.fontMetrics().axisHeight*n.sizeMultiplier;var o=901;var s=5/n.fontMetrics().ptPerEm;var f=Math.max(r-u,a+u);var d=Math.max(f/500*o,2*f-s);return F(t,d,true,n,i,l)};r.default={sqrtImage:T,sizedDelim:L,customSizedDelim:F,leftRightDelim:R}},{"./ParseError":84,"./Style":89,"./buildCommon":91,"./domTree":98,"./fontMetrics":101,"./symbols":125,"./utils":128}],98:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("babel-runtime/core-js/get-iterator");var n=v(a);var i=e("babel-runtime/helpers/classCallCheck");var l=v(i);var u=e("babel-runtime/helpers/createClass");var o=v(u);var s=e("./unicodeRegexes");var f=e("./utils");var d=v(f);var c=e("./svgGeometry");var h=v(c);function v(e){return e&&e.__esModule?e:{default:e}}var p=function e(t){t=t.slice();for(var r=t.length-1;r>=0;r--){if(!t[r]){t.splice(r,1)}}return t.join(" ")};var m=function(){function e(t,r,a){(0,l.default)(this,e);this.classes=t||[];this.children=r||[];this.height=0;this.depth=0;this.maxFontSize=0;this.style={};this.attributes={};if(a){if(a.style.isTight()){this.classes.push("mtight")}var n=a.getColor();if(n){this.style.color=n}}}(0,o.default)(e,[{key:"setAttribute",value:function e(t,r){this.attributes[t]=r}},{key:"tryCombine",value:function e(t){return false}},{key:"toNode",value:function e(){var t=document.createElement("span");t.className=p(this.classes);for(var r in this.style){if(Object.prototype.hasOwnProperty.call(this.style,r)){t.style[r]=this.style[r]}}for(var a in this.attributes){if(Object.prototype.hasOwnProperty.call(this.attributes,a)){t.setAttribute(a,this.attributes[a])}}for(var n=0;n<this.children.length;n++){t.appendChild(this.children[n].toNode())}return t}},{key:"toMarkup",value:function e(){var t="<span";if(this.classes.length){t+=' class="';t+=d.default.escape(p(this.classes));t+='"'}var r="";for(var a in this.style){if(this.style.hasOwnProperty(a)){r+=d.default.hyphenate(a)+":"+this.style[a]+";"}}if(r){t+=' style="'+d.default.escape(r)+'"'}for(var n in this.attributes){if(Object.prototype.hasOwnProperty.call(this.attributes,n)){t+=" "+n+'="';t+=d.default.escape(this.attributes[n]);t+='"'}}t+=">";for(var i=0;i<this.children.length;i++){t+=this.children[i].toMarkup()}t+="</span>";return t}}]);return e}();var g=function(){function e(t,r,a,n){(0,l.default)(this,e);this.href=t;this.classes=r;this.children=a;this.height=0;this.depth=0;this.maxFontSize=0;this.style={};this.attributes={};if(n.style.isTight()){this.classes.push("mtight")}var i=n.getColor();if(i){this.style.color=i}}(0,o.default)(e,[{key:"setAttribute",value:function e(t,r){this.attributes[t]=r}},{key:"tryCombine",value:function e(t){return false}},{key:"toNode",value:function e(){var t=document.createElement("a");t.setAttribute("href",this.href);if(this.classes.length){t.className=p(this.classes)}for(var r in this.style){if(Object.prototype.hasOwnProperty.call(this.style,r)){t.style[r]=this.style[r]}}for(var a in this.attributes){if(Object.prototype.hasOwnProperty.call(this.attributes,a)){t.setAttribute(a,this.attributes[a])}}for(var n=0;n<this.children.length;n++){t.appendChild(this.children[n].toNode())}return t}},{key:"toMarkup",value:function e(){var t="<a";t+='href="'+(t+=d.default.escape(this.href))+'"';if(this.classes.length){t+=' class="'+d.default.escape(p(this.classes))+'"'}var r="";for(var a in this.style){if(this.style.hasOwnProperty(a)){r+=d.default.hyphenate(a)+":"+this.style[a]+";"}}if(r){t+=' style="'+d.default.escape(r)+'"'}for(var i in this.attributes){if(i!=="href"&&Object.prototype.hasOwnProperty.call(this.attributes,i)){t+=" "+i+'="'+d.default.escape(this.attributes[i])+'"'}}t+=">";var l=true;var u=false;var o=undefined;try{for(var s=(0,n.default)(this.children),f;!(l=(f=s.next()).done);l=true){var c=f.value;t+=c.toMarkup()}}catch(e){u=true;o=e}finally{try{if(!l&&s.return){s.return()}}finally{if(u){throw o}}}t+="</a>";return t}}]);return e}();var b=function(){function e(t,r){(0,l.default)(this,e);this.children=t||[];this.classes=r||[];this.height=0;this.depth=0;this.maxFontSize=0;if(r){for(var a=0;a<this.children.length;a++){for(var n=0;n<this.classes.length;n++){this.children[a].classes.push(r[n])}}}}(0,o.default)(e,[{key:"toNode",value:function e(){var t=document.createDocumentFragment();for(var r=0;r<this.children.length;r++){t.appendChild(this.children[r].toNode())}return t}},{key:"toMarkup",value:function e(){var t="";for(var r=0;r<this.children.length;r++){t+=this.children[r].toMarkup()}return t}}]);return e}();var y={"\xee":"\u0131\u0302","\xef":"\u0131\u0308","\xed":"\u0131\u0301","\xec":"\u0131\u0300"};var x=function(){function e(t,r,a,n,i,u,o){(0,l.default)(this,e);this.value=t;this.height=r||0;this.depth=a||0;this.italic=n||0;this.skew=i||0;this.classes=u||[];this.style=o||{};this.maxFontSize=0;if(s.cjkRegex.test(this.value)){if(s.hangulRegex.test(this.value)){this.classes.push("hangul_fallback")}else{this.classes.push("cjk_fallback")}}if(/[\xee\xef\xed\xec]/.test(this.value)){this.value=y[this.value]}}(0,o.default)(e,[{key:"tryCombine",value:function t(r){if(!r||!(r instanceof e)||this.italic>0||p(this.classes)!==p(r.classes)||this.skew!==r.skew||this.maxFontSize!==r.maxFontSize){return false}for(var a in this.style){if(this.style.hasOwnProperty(a)&&this.style[a]!==r.style[a]){return false}}for(var n in r.style){if(r.style.hasOwnProperty(n)&&this.style[n]!==r.style[n]){return false}}this.value+=r.value;this.height=Math.max(this.height,r.height);this.depth=Math.max(this.depth,r.depth);this.italic=r.italic;return true}},{key:"toNode",value:function e(){var t=document.createTextNode(this.value);var r=null;if(this.italic>0){r=document.createElement("span");r.style.marginRight=this.italic+"em"}if(this.classes.length>0){r=r||document.createElement("span");r.className=p(this.classes)}for(var a in this.style){if(this.style.hasOwnProperty(a)){r=r||document.createElement("span");r.style[a]=this.style[a]}}if(r){r.appendChild(t);return r}else{return t}}},{key:"toMarkup",value:function e(){var t=false;var r="<span";if(this.classes.length){t=true;r+=' class="';r+=d.default.escape(p(this.classes));r+='"'}var a="";if(this.italic>0){a+="margin-right:"+this.italic+"em;"}for(var n in this.style){if(this.style.hasOwnProperty(n)){a+=d.default.hyphenate(n)+":"+this.style[n]+";"}}if(a){t=true;r+=' style="'+d.default.escape(a)+'"'}var i=d.default.escape(this.value);if(t){r+=">";r+=i;r+="</span>";return r}else{return i}}}]);return e}();var w=function(){function e(t,r,a){(0,l.default)(this,e);this.children=t||[];this.classes=a||[];this.attributes=r||{};this.height=0;this.depth=0;this.maxFontSize=0}(0,o.default)(e,[{key:"toNode",value:function e(){var t="http://www.w3.org/2000/svg";var r=document.createElementNS(t,"svg");r.setAttribute("class",this.classes.join(" "));for(var a in this.attributes){if(Object.prototype.hasOwnProperty.call(this.attributes,a)){r.setAttribute(a,this.attributes[a])}}for(var n=0;n<this.children.length;n++){r.appendChild(this.children[n].toNode())}return r}},{key:"toMarkup",value:function e(){var t="<svg";for(var r in this.attributes){if(Object.prototype.hasOwnProperty.call(this.attributes,r)){t+=" "+r+"='"+this.attributes[r]+"'"}}t+=">";for(var a=0;a<this.children.length;a++){t+=this.children[a].toMarkup()}t+="</svg>";return t}}]);return e}();var k=function(){function e(t,r){(0,l.default)(this,e);this.pathName=t;this.alternate=r}(0,o.default)(e,[{key:"toNode",value:function e(){var t="http://www.w3.org/2000/svg";var r=document.createElementNS(t,"path");if(this.alternate){r.setAttribute("d",this.alternate)}else{r.setAttribute("d",h.default.path[this.pathName]);
}return r}},{key:"toMarkup",value:function e(){if(this.alternate){return"<path d='"+this.alternate+"'/>"}else{return"<path d='"+h.default.path[this.pathName]+"'/>"}}}]);return e}();var M=function(){function e(t){(0,l.default)(this,e);this.attributes=t||{}}(0,o.default)(e,[{key:"toNode",value:function e(){var t="http://www.w3.org/2000/svg";var r=document.createElementNS(t,"line");for(var a in this.attributes){if(Object.prototype.hasOwnProperty.call(this.attributes,a)){r.setAttribute(a,this.attributes[a])}}return r}},{key:"toMarkup",value:function e(){var t="<line";for(var r in this.attributes){if(Object.prototype.hasOwnProperty.call(this.attributes,r)){t+=" "+r+"='"+this.attributes[r]+"'"}}t+="/>";return t}}]);return e}();r.default={span:m,anchor:g,documentFragment:b,symbolNode:x,svgNode:w,pathNode:k,lineNode:M}},{"./svgGeometry":124,"./unicodeRegexes":126,"./utils":128,"babel-runtime/core-js/get-iterator":3,"babel-runtime/helpers/classCallCheck":8,"babel-runtime/helpers/createClass":9}],99:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("./defineEnvironment");e("./environments/array.js");var n={has:function e(t){return a._environments.hasOwnProperty(t)},get:function e(t){return a._environments[t]}};r.default=n},{"./defineEnvironment":95,"./environments/array.js":100}],100:[function(e,t,r){"use strict";var a=e("../buildCommon");var n=M(a);var i=e("../defineEnvironment");var l=M(i);var u=e("../mathMLTree");var o=M(u);var s=e("../ParseError");var f=M(s);var d=e("../ParseNode");var c=M(d);var h=e("../units");var v=e("../utils");var p=M(v);var m=e("../stretchy");var g=M(m);var b=e("../buildHTML");var y=k(b);var x=e("../buildMathML");var w=k(x);function k(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function M(e){return e&&e.__esModule?e:{default:e}}function _(e,t,r){var a=[];var n=[a];var i=[];while(true){var l=e.parseExpression(false,null);l=new c.default("ordgroup",l,e.mode);if(r){l=new c.default("styling",{style:r,value:[l]},e.mode)}a.push(l);var u=e.nextToken.text;if(u==="&"){e.consume()}else if(u==="\\end"){var o=n[n.length-1];if(n.length>1&&o.length===1&&o[0].value.value[0].value.length===0){n.pop()}break}else if(u==="\\\\"||u==="\\cr"){var s=e.parseFunction();i.push(s.value.size);a=[];n.push(a)}else{throw new f.default("Expected & or \\\\ or \\end",e.nextToken)}}t.body=n;t.rowGaps=i;return new c.default(t.type,t,e.mode)}function S(e){if(e.substr(0,1)==="d"){return"display"}else{return"text"}}var z=function e(t,r){var a=void 0;var i=void 0;var l=t.value.body.length;var u=0;var o=new Array(l);var s=1/r.fontMetrics().ptPerEm;var d=5*s;var c=12*s;var v=3*s;var m=p.default.deflt(t.value.arraystretch,1);var b=m*c;var x=.7*b;var w=.3*b;var k=0;for(a=0;a<t.value.body.length;++a){var M=t.value.body[a];var _=x;var S=w;if(u<M.length){u=M.length}var z=new Array(M.length);for(i=0;i<M.length;++i){var T=y.buildGroup(M[i],r);if(S<T.depth){S=T.depth}if(_<T.height){_=T.height}z[i]=T}var C=0;if(t.value.rowGaps[a]){C=(0,h.calculateSize)(t.value.rowGaps[a].value,r);if(C>0){C+=w;if(S<C){S=C}C=0}}if(t.value.addJot){S+=v}z.height=_;z.depth=S;k+=_;z.pos=k;k+=S+C;o[a]=z}var A=k/2+r.fontMetrics().axisHeight;var O=t.value.cols||[];var N=[];var L=void 0;var j=void 0;for(i=0,j=0;i<u||j<O.length;++i,++j){var E=O[j]||{};var q=true;while(E.type==="separator"){if(!q){L=n.default.makeSpan(["arraycolsep"],[]);L.style.width=r.fontMetrics().doubleRuleSep+"em";N.push(L)}if(E.separator==="|"){var P=g.default.ruleSpan("vertical-separator",r);P.style.height=k+"em";P.style.verticalAlign=-(k-A)+"em";N.push(P)}else{throw new f.default("Invalid separator type: "+E.separator)}j++;E=O[j]||{};q=false}if(i>=u){continue}var B=void 0;if(i>0||t.value.hskipBeforeAndAfter){B=p.default.deflt(E.pregap,d);if(B!==0){L=n.default.makeSpan(["arraycolsep"],[]);L.style.width=B+"em";N.push(L)}}var F=[];for(a=0;a<l;++a){var R=o[a];var D=R[i];if(!D){continue}var H=R.pos-A;D.depth=R.depth;D.height=R.height;F.push({type:"elem",elem:D,shift:H})}F=n.default.makeVList({positionType:"individualShift",children:F},r);F=n.default.makeSpan(["col-align-"+(E.align||"c")],[F]);N.push(F);if(i<u-1||t.value.hskipBeforeAndAfter){B=p.default.deflt(E.postgap,d);if(B!==0){L=n.default.makeSpan(["arraycolsep"],[]);L.style.width=B+"em";N.push(L)}}}o=n.default.makeSpan(["mtable"],N);return n.default.makeSpan(["mord"],[o],r)};var T=function e(t,r){return new o.default.MathNode("mtable",t.value.body.map(function(e){return new o.default.MathNode("mtr",e.map(function(e){return new o.default.MathNode("mtd",[w.buildGroup(e,r)])}))}))};var C=function e(t,r){var a={type:"array",cols:[],addJot:true};a=_(t.parser,a,"display");var n=void 0;var i=0;var l=new c.default("ordgroup",[],t.mode);if(r[0]&&r[0].value){var u="";for(var o=0;o<r[0].value.length;o++){u+=r[0].value[o].value}n=Number(u);i=n*2}var s=!i;a.value.body.forEach(function(e){for(var t=1;t<e.length;t+=2){var r=e[t].value.value[0];r.value.unshift(l)}if(!s){var a=e.length/2;if(n<a){throw new f.default("Too many math in a row: "+("expected "+n+", but got "+a),e)}}else if(i<e.length){i=e.length}});for(var d=0;d<i;++d){var h="r";var v=0;if(d%2===1){h="l"}else if(d>0&&s){v=1}a.value.cols[d]={type:"align",align:h,pregap:v,postgap:0}}return a};(0,l.default)({type:"array",names:["array","darray"],props:{numArgs:1},handler:function e(t,r){var a=r[0];a=a.value.map?a.value:[a];var n=a.map(function(e){var t=e.value;if("lcr".indexOf(t)!==-1){return{type:"align",align:t}}else if(t==="|"){return{type:"separator",separator:"|"}}throw new f.default("Unknown column alignment: "+e.value,e)});var i={type:"array",cols:n,hskipBeforeAndAfter:true};i=_(t.parser,i,S(t.envName));return i},htmlBuilder:z,mathmlBuilder:T});(0,l.default)({type:"array",names:["matrix","pmatrix","bmatrix","Bmatrix","vmatrix","Vmatrix"],props:{numArgs:0},handler:function e(t){var r={matrix:null,pmatrix:["(",")"],bmatrix:["[","]"],Bmatrix:["\\{","\\}"],vmatrix:["|","|"],Vmatrix:["\\Vert","\\Vert"]}[t.envName];var a={type:"array",hskipBeforeAndAfter:false};a=_(t.parser,a,S(t.envName));if(r){a=new c.default("leftright",{body:[a],left:r[0],right:r[1]},t.mode)}return a},htmlBuilder:z,mathmlBuilder:T});(0,l.default)({type:"array",names:["cases","dcases"],props:{numArgs:0},handler:function e(t){var r={type:"array",arraystretch:1.2,cols:[{type:"align",align:"l",pregap:0,postgap:1},{type:"align",align:"l",pregap:0,postgap:0}]};r=_(t.parser,r,S(t.envName));r=new c.default("leftright",{body:[r],left:"\\{",right:"."},t.mode);return r},htmlBuilder:z,mathmlBuilder:T});(0,l.default)({type:"array",names:["aligned"],props:{numArgs:0},handler:C,htmlBuilder:z,mathmlBuilder:T});(0,l.default)({type:"array",names:["gathered"],props:{numArgs:0},handler:function e(t){var r={type:"array",cols:[{type:"align",align:"c"}],addJot:true};r=_(t.parser,r,"display");return r},htmlBuilder:z,mathmlBuilder:T});(0,l.default)({type:"array",names:["alignedat"],props:{numArgs:1},handler:C,htmlBuilder:z,mathmlBuilder:T})},{"../ParseError":84,"../ParseNode":85,"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineEnvironment":95,"../mathMLTree":121,"../stretchy":123,"../units":127,"../utils":128}],101:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("./unicodeRegexes");var n=e("./fontMetricsData");var i=l(n);function l(e){return e&&e.__esModule?e:{default:e}}var u={slant:[.25,.25,.25],space:[0,0,0],stretch:[0,0,0],shrink:[0,0,0],xHeight:[.431,.431,.431],quad:[1,1.171,1.472],extraSpace:[0,0,0],num1:[.677,.732,.925],num2:[.394,.384,.387],num3:[.444,.471,.504],denom1:[.686,.752,1.025],denom2:[.345,.344,.532],sup1:[.413,.503,.504],sup2:[.363,.431,.404],sup3:[.289,.286,.294],sub1:[.15,.143,.2],sub2:[.247,.286,.4],supDrop:[.386,.353,.494],subDrop:[.05,.071,.1],delim1:[2.39,1.7,1.98],delim2:[1.01,1.157,1.42],axisHeight:[.25,.25,.25],defaultRuleThickness:[.04,.049,.049],bigOpSpacing1:[.111,.111,.111],bigOpSpacing2:[.166,.166,.166],bigOpSpacing3:[.2,.2,.2],bigOpSpacing4:[.6,.611,.611],bigOpSpacing5:[.1,.143,.143],sqrtRuleThickness:[.04,.04,.04],ptPerEm:[10,10,10],doubleRuleSep:[.2,.2,.2]};var o={"\xc0":"A","\xc1":"A","\xc2":"A","\xc3":"A","\xc4":"A","\xc5":"A","\xc6":"A","\xc7":"C","\xc8":"E","\xc9":"E","\xca":"E","\xcb":"E","\xcc":"I","\xcd":"I","\xce":"I","\xcf":"I","\xd0":"D","\xd1":"N","\xd2":"O","\xd3":"O","\xd4":"O","\xd5":"O","\xd6":"O","\xd8":"O","\xd9":"U","\xda":"U","\xdb":"U","\xdc":"U","\xdd":"Y","\xde":"o","\xdf":"B","\xe0":"a","\xe1":"a","\xe2":"a","\xe3":"a","\xe4":"a","\xe5":"a","\xe6":"a","\xe7":"c","\xe8":"e","\xe9":"e","\xea":"e","\xeb":"e","\xec":"i","\xed":"i","\xee":"i","\xef":"i","\xf0":"d","\xf1":"n","\xf2":"o","\xf3":"o","\xf4":"o","\xf5":"o","\xf6":"o","\xf8":"o","\xf9":"u","\xfa":"u","\xfb":"u","\xfc":"u","\xfd":"y","\xfe":"o","\xff":"y","\u0410":"A","\u0411":"B","\u0412":"B","\u0413":"F","\u0414":"A","\u0415":"E","\u0416":"K","\u0417":"3","\u0418":"N","\u0419":"N","\u041a":"K","\u041b":"N","\u041c":"M","\u041d":"H","\u041e":"O","\u041f":"N","\u0420":"P","\u0421":"C","\u0422":"T","\u0423":"y","\u0424":"O","\u0425":"X","\u0426":"U","\u0427":"h","\u0428":"W","\u0429":"W","\u042a":"B","\u042b":"X","\u042c":"B","\u042d":"3","\u042e":"X","\u042f":"R","\u0430":"a","\u0431":"b","\u0432":"a","\u0433":"r","\u0434":"y","\u0435":"e","\u0436":"m","\u0437":"e","\u0438":"n","\u0439":"n","\u043a":"n","\u043b":"n","\u043c":"m","\u043d":"n","\u043e":"o","\u043f":"n","\u0440":"p","\u0441":"c","\u0442":"o","\u0443":"y","\u0444":"b","\u0445":"x","\u0446":"n","\u0447":"n","\u0448":"w","\u0449":"w","\u044a":"a","\u044b":"m","\u044c":"a","\u044d":"e","\u044e":"m","\u044f":"r"};var s=function e(t,r){if(!i.default[r]){throw new Error("Font metrics not found for font: "+r+".")}var n=t.charCodeAt(0);if(t[0]in o){n=o[t[0]].charCodeAt(0)}else if(a.cjkRegex.test(t[0])){n="M".charCodeAt(0)}var l=i.default[r][""+n];if(l){return{depth:l[0],height:l[1],italic:l[2],skew:l[3],width:l[4]}}};var f={};var d=function e(t){var r=void 0;if(t>=5){r=0}else if(t>=3){r=1}else{r=2}if(!f[r]){var a=f[r]={cssEmPerMu:u.quad[r]/18};for(var n in u){if(u.hasOwnProperty(n)){a[n]=u[n][r]}}}return f[r]};r.default={getFontMetrics:d,getCharacterMetrics:s}},{"./fontMetricsData":102,"./unicodeRegexes":126}],102:[function(e,t,r){"use strict";t.exports={"AMS-Regular":{65:[0,.68889,0,0],66:[0,.68889,0,0],67:[0,.68889,0,0],68:[0,.68889,0,0],69:[0,.68889,0,0],70:[0,.68889,0,0],71:[0,.68889,0,0],72:[0,.68889,0,0],73:[0,.68889,0,0],74:[.16667,.68889,0,0],75:[0,.68889,0,0],76:[0,.68889,0,0],77:[0,.68889,0,0],78:[0,.68889,0,0],79:[.16667,.68889,0,0],80:[0,.68889,0,0],81:[.16667,.68889,0,0],82:[0,.68889,0,0],83:[0,.68889,0,0],84:[0,.68889,0,0],85:[0,.68889,0,0],86:[0,.68889,0,0],87:[0,.68889,0,0],88:[0,.68889,0,0],89:[0,.68889,0,0],90:[0,.68889,0,0],107:[0,.68889,0,0],165:[0,.675,.025,0],174:[.15559,.69224,0,0],240:[0,.68889,0,0],295:[0,.68889,0,0],710:[0,.825,0,0],732:[0,.9,0,0],770:[0,.825,0,0],771:[0,.9,0,0],989:[.08167,.58167,0,0],1008:[0,.43056,.04028,0],8245:[0,.54986,0,0],8463:[0,.68889,0,0],8487:[0,.68889,0,0],8498:[0,.68889,0,0],8502:[0,.68889,0,0],8503:[0,.68889,0,0],8504:[0,.68889,0,0],8513:[0,.68889,0,0],8592:[-.03598,.46402,0,0],8594:[-.03598,.46402,0,0],8602:[-.13313,.36687,0,0],8603:[-.13313,.36687,0,0],8606:[.01354,.52239,0,0],8608:[.01354,.52239,0,0],8610:[.01354,.52239,0,0],8611:[.01354,.52239,0,0],8619:[0,.54986,0,0],8620:[0,.54986,0,0],8621:[-.13313,.37788,0,0],8622:[-.13313,.36687,0,0],8624:[0,.69224,0,0],8625:[0,.69224,0,0],8630:[0,.43056,0,0],8631:[0,.43056,0,0],8634:[.08198,.58198,0,0],8635:[.08198,.58198,0,0],8638:[.19444,.69224,0,0],8639:[.19444,.69224,0,0],8642:[.19444,.69224,0,0],8643:[.19444,.69224,0,0],8644:[.1808,.675,0,0],8646:[.1808,.675,0,0],8647:[.1808,.675,0,0],8648:[.19444,.69224,0,0],8649:[.1808,.675,0,0],8650:[.19444,.69224,0,0],8651:[.01354,.52239,0,0],8652:[.01354,.52239,0,0],8653:[-.13313,.36687,0,0],8654:[-.13313,.36687,0,0],8655:[-.13313,.36687,0,0],8666:[.13667,.63667,0,0],8667:[.13667,.63667,0,0],8669:[-.13313,.37788,0,0],8672:[-.064,.437,0,0],8674:[-.064,.437,0,0],8705:[0,.825,0,0],8708:[0,.68889,0,0],8709:[.08167,.58167,0,0],8717:[0,.43056,0,0],8722:[-.03598,.46402,0,0],8724:[.08198,.69224,0,0],8726:[.08167,.58167,0,0],8733:[0,.69224,0,0],8736:[0,.69224,0,0],8737:[0,.69224,0,0],8738:[.03517,.52239,0,0],8739:[.08167,.58167,0,0],8740:[.25142,.74111,0,0],8741:[.08167,.58167,0,0],8742:[.25142,.74111,0,0],8756:[0,.69224,0,0],8757:[0,.69224,0,0],8764:[-.13313,.36687,0,0],8765:[-.13313,.37788,0,0],8769:[-.13313,.36687,0,0],8770:[-.03625,.46375,0,0],8774:[.30274,.79383,0,0],8776:[-.01688,.48312,0,0],8778:[.08167,.58167,0,0],8782:[.06062,.54986,0,0],8783:[.06062,.54986,0,0],8785:[.08198,.58198,0,0],8786:[.08198,.58198,0,0],8787:[.08198,.58198,0,0],8790:[0,.69224,0,0],8791:[.22958,.72958,0,0],8796:[.08198,.91667,0,0],8806:[.25583,.75583,0,0],8807:[.25583,.75583,0,0],8808:[.25142,.75726,0,0],8809:[.25142,.75726,0,0],8812:[.25583,.75583,0,0],8814:[.20576,.70576,0,0],8815:[.20576,.70576,0,0],8816:[.30274,.79383,0,0],8817:[.30274,.79383,0,0],8818:[.22958,.72958,0,0],8819:[.22958,.72958,0,0],8822:[.1808,.675,0,0],8823:[.1808,.675,0,0],8828:[.13667,.63667,0,0],8829:[.13667,.63667,0,0],8830:[.22958,.72958,0,0],8831:[.22958,.72958,0,0],8832:[.20576,.70576,0,0],8833:[.20576,.70576,0,0],8840:[.30274,.79383,0,0],8841:[.30274,.79383,0,0],8842:[.13597,.63597,0,0],8843:[.13597,.63597,0,0],8847:[.03517,.54986,0,0],8848:[.03517,.54986,0,0],8858:[.08198,.58198,0,0],8859:[.08198,.58198,0,0],8861:[.08198,.58198,0,0],8862:[0,.675,0,0],8863:[0,.675,0,0],8864:[0,.675,0,0],8865:[0,.675,0,0],8872:[0,.69224,0,0],8873:[0,.69224,0,0],8874:[0,.69224,0,0],8876:[0,.68889,0,0],8877:[0,.68889,0,0],8878:[0,.68889,0,0],8879:[0,.68889,0,0],8882:[.03517,.54986,0,0],8883:[.03517,.54986,0,0],8884:[.13667,.63667,0,0],8885:[.13667,.63667,0,0],8888:[0,.54986,0,0],8890:[.19444,.43056,0,0],8891:[.19444,.69224,0,0],8892:[.19444,.69224,0,0],8901:[0,.54986,0,0],8903:[.08167,.58167,0,0],8905:[.08167,.58167,0,0],8906:[.08167,.58167,0,0],8907:[0,.69224,0,0],8908:[0,.69224,0,0],8909:[-.03598,.46402,0,0],8910:[0,.54986,0,0],8911:[0,.54986,0,0],8912:[.03517,.54986,0,0],8913:[.03517,.54986,0,0],8914:[0,.54986,0,0],8915:[0,.54986,0,0],8916:[0,.69224,0,0],8918:[.0391,.5391,0,0],8919:[.0391,.5391,0,0],8920:[.03517,.54986,0,0],8921:[.03517,.54986,0,0],8922:[.38569,.88569,0,0],8923:[.38569,.88569,0,0],8926:[.13667,.63667,0,0],8927:[.13667,.63667,0,0],8928:[.30274,.79383,0,0],8929:[.30274,.79383,0,0],8934:[.23222,.74111,0,0],8935:[.23222,.74111,0,0],8936:[.23222,.74111,0,0],8937:[.23222,.74111,0,0],8938:[.20576,.70576,0,0],8939:[.20576,.70576,0,0],8940:[.30274,.79383,0,0],8941:[.30274,.79383,0,0],8994:[.19444,.69224,0,0],8995:[.19444,.69224,0,0],9416:[.15559,.69224,0,0],9484:[0,.69224,0,0],9488:[0,.69224,0,0],9492:[0,.37788,0,0],9496:[0,.37788,0,0],9585:[.19444,.68889,0,0],9586:[.19444,.74111,0,0],9632:[0,.675,0,0],9633:[0,.675,0,0],9650:[0,.54986,0,0],9651:[0,.54986,0,0],9654:[.03517,.54986,0,0],9660:[0,.54986,0,0],9661:[0,.54986,0,0],9664:[.03517,.54986,0,0],9674:[.11111,.69224,0,0],9733:[.19444,.69224,0,0],10003:[0,.69224,0,0],10016:[0,.69224,0,0],10731:[.11111,.69224,0,0],10846:[.19444,.75583,0,0],10877:[.13667,.63667,0,0],10878:[.13667,.63667,0,0],10885:[.25583,.75583,0,0],10886:[.25583,.75583,0,0],10887:[.13597,.63597,0,0],10888:[.13597,.63597,0,0],10889:[.26167,.75726,0,0],10890:[.26167,.75726,0,0],10891:[.48256,.98256,0,0],10892:[.48256,.98256,0,0],10901:[.13667,.63667,0,0],10902:[.13667,.63667,0,0],10933:[.25142,.75726,0,0],10934:[.25142,.75726,0,0],10935:[.26167,.75726,0,0],10936:[.26167,.75726,0,0],10937:[.26167,.75726,0,0],10938:[.26167,.75726,0,0],10949:[.25583,.75583,0,0],10950:[.25583,.75583,0,0],10955:[.28481,.79383,0,0],10956:[.28481,.79383,0,0],57350:[.08167,.58167,0,0],57351:[.08167,.58167,0,0],57352:[.08167,.58167,0,0],57353:[0,.43056,.04028,0],57356:[.25142,.75726,0,0],57357:[.25142,.75726,0,0],57358:[.41951,.91951,0,0],57359:[.30274,.79383,0,0],57360:[.30274,.79383,0,0],57361:[.41951,.91951,0,0],57366:[.25142,.75726,0,0],57367:[.25142,.75726,0,0],57368:[.25142,.75726,0,0],57369:[.25142,.75726,0,0],57370:[.13597,.63597,0,0],57371:[.13597,.63597,0,0]},"Caligraphic-Regular":{48:[0,.43056,0,0],49:[0,.43056,0,0],50:[0,.43056,0,0],51:[.19444,.43056,0,0],52:[.19444,.43056,0,0],53:[.19444,.43056,0,0],54:[0,.64444,0,0],55:[.19444,.43056,0,0],56:[0,.64444,0,0],57:[.19444,.43056,0,0],65:[0,.68333,0,.19445],66:[0,.68333,.03041,.13889],67:[0,.68333,.05834,.13889],68:[0,.68333,.02778,.08334],69:[0,.68333,.08944,.11111],70:[0,.68333,.09931,.11111],71:[.09722,.68333,.0593,.11111],72:[0,.68333,.00965,.11111],73:[0,.68333,.07382,0],74:[.09722,.68333,.18472,.16667],75:[0,.68333,.01445,.05556],76:[0,.68333,0,.13889],77:[0,.68333,0,.13889],78:[0,.68333,.14736,.08334],79:[0,.68333,.02778,.11111],80:[0,.68333,.08222,.08334],81:[.09722,.68333,0,.11111],82:[0,.68333,0,.08334],83:[0,.68333,.075,.13889],84:[0,.68333,.25417,0],85:[0,.68333,.09931,.08334],86:[0,.68333,.08222,0],87:[0,.68333,.08222,.08334],88:[0,.68333,.14643,.13889],89:[.09722,.68333,.08222,.08334],90:[0,.68333,.07944,.13889]},"Fraktur-Regular":{33:[0,.69141,0,0],34:[0,.69141,0,0],38:[0,.69141,0,0],39:[0,.69141,0,0],40:[.24982,.74947,0,0],41:[.24982,.74947,0,0],42:[0,.62119,0,0],43:[.08319,.58283,0,0],44:[0,.10803,0,0],45:[.08319,.58283,0,0],46:[0,.10803,0,0],47:[.24982,.74947,0,0],48:[0,.47534,0,0],49:[0,.47534,0,0],50:[0,.47534,0,0],51:[.18906,.47534,0,0],52:[.18906,.47534,0,0],53:[.18906,.47534,0,0],54:[0,.69141,0,0],55:[.18906,.47534,0,0],56:[0,.69141,0,0],57:[.18906,.47534,0,0],58:[0,.47534,0,0],59:[.12604,.47534,0,0],61:[-.13099,.36866,0,0],63:[0,.69141,0,0],65:[0,.69141,0,0],66:[0,.69141,0,0],67:[0,.69141,0,0],68:[0,.69141,0,0],69:[0,.69141,0,0],70:[.12604,.69141,0,0],71:[0,.69141,0,0],72:[.06302,.69141,0,0],73:[0,.69141,0,0],74:[.12604,.69141,0,0],75:[0,.69141,0,0],76:[0,.69141,0,0],77:[0,.69141,0,0],78:[0,.69141,0,0],79:[0,.69141,0,0],80:[.18906,.69141,0,0],81:[.03781,.69141,0,0],82:[0,.69141,0,0],83:[0,.69141,0,0],84:[0,.69141,0,0],85:[0,.69141,0,0],86:[0,.69141,0,0],87:[0,.69141,0,0],88:[0,.69141,0,0],89:[.18906,.69141,0,0],90:[.12604,.69141,0,0],91:[.24982,.74947,0,0],93:[.24982,.74947,0,0],94:[0,.69141,0,0],97:[0,.47534,0,0],98:[0,.69141,0,0],99:[0,.47534,0,0],100:[0,.62119,0,0],101:[0,.47534,0,0],102:[.18906,.69141,0,0],103:[.18906,.47534,0,0],104:[.18906,.69141,0,0],105:[0,.69141,0,0],106:[0,.69141,0,0],107:[0,.69141,0,0],108:[0,.69141,0,0],109:[0,.47534,0,0],110:[0,.47534,0,0],111:[0,.47534,0,0],112:[.18906,.52396,0,0],113:[.18906,.47534,0,0],114:[0,.47534,0,0],115:[0,.47534,0,0],116:[0,.62119,0,0],117:[0,.47534,0,0],118:[0,.52396,0,0],119:[0,.52396,0,0],120:[.18906,.47534,0,0],121:[.18906,.47534,0,0],122:[.18906,.47534,0,0],8216:[0,.69141,0,0],8217:[0,.69141,0,0],58112:[0,.62119,0,0],58113:[0,.62119,0,0],58114:[.18906,.69141,0,0],58115:[.18906,.69141,0,0],58116:[.18906,.47534,0,0],58117:[0,.69141,0,0],58118:[0,.62119,0,0],58119:[0,.47534,0,0]},"Main-Bold":{33:[0,.69444,0,0],34:[0,.69444,0,0],35:[.19444,.69444,0,0],36:[.05556,.75,0,0],37:[.05556,.75,0,0],38:[0,.69444,0,0],39:[0,.69444,0,0],40:[.25,.75,0,0],41:[.25,.75,0,0],42:[0,.75,0,0],43:[.13333,.63333,0,0],44:[.19444,.15556,0,0],45:[0,.44444,0,0],46:[0,.15556,0,0],47:[.25,.75,0,0],48:[0,.64444,0,0],49:[0,.64444,0,0],50:[0,.64444,0,0],51:[0,.64444,0,0],52:[0,.64444,0,0],53:[0,.64444,0,0],54:[0,.64444,0,0],55:[0,.64444,0,0],56:[0,.64444,0,0],57:[0,.64444,0,0],58:[0,.44444,0,0],59:[.19444,.44444,0,0],60:[.08556,.58556,0,0],61:[-.10889,.39111,0,0],62:[.08556,.58556,0,0],63:[0,.69444,0,0],64:[0,.69444,0,0],65:[0,.68611,0,0],66:[0,.68611,0,0],67:[0,.68611,0,0],68:[0,.68611,0,0],69:[0,.68611,0,0],70:[0,.68611,0,0],71:[0,.68611,0,0],72:[0,.68611,0,0],73:[0,.68611,0,0],74:[0,.68611,0,0],75:[0,.68611,0,0],76:[0,.68611,0,0],77:[0,.68611,0,0],78:[0,.68611,0,0],79:[0,.68611,0,0],80:[0,.68611,0,0],81:[.19444,.68611,0,0],82:[0,.68611,0,0],83:[0,.68611,0,0],84:[0,.68611,0,0],85:[0,.68611,0,0],86:[0,.68611,.01597,0],87:[0,.68611,.01597,0],88:[0,.68611,0,0],89:[0,.68611,.02875,0],90:[0,.68611,0,0],91:[.25,.75,0,0],92:[.25,.75,0,0],93:[.25,.75,0,0],94:[0,.69444,0,0],95:[.31,.13444,.03194,0],96:[0,.69444,0,0],97:[0,.44444,0,0],98:[0,.69444,0,0],99:[0,.44444,0,0],100:[0,.69444,0,0],101:[0,.44444,0,0],102:[0,.69444,.10903,0],103:[.19444,.44444,.01597,0],104:[0,.69444,0,0],105:[0,.69444,0,0],106:[.19444,.69444,0,0],107:[0,.69444,0,0],108:[0,.69444,0,0],109:[0,.44444,0,0],110:[0,.44444,0,0],111:[0,.44444,0,0],112:[.19444,.44444,0,0],113:[.19444,.44444,0,0],114:[0,.44444,0,0],115:[0,.44444,0,0],116:[0,.63492,0,0],117:[0,.44444,0,0],118:[0,.44444,.01597,0],119:[0,.44444,.01597,0],120:[0,.44444,0,0],121:[.19444,.44444,.01597,0],122:[0,.44444,0,0],123:[.25,.75,0,0],124:[.25,.75,0,0],125:[.25,.75,0,0],126:[.35,.34444,0,0],168:[0,.69444,0,0],172:[0,.44444,0,0],175:[0,.59611,0,0],176:[0,.69444,0,0],177:[.13333,.63333,0,0],180:[0,.69444,0,0],215:[.13333,.63333,0,0],247:[.13333,.63333,0,0],305:[0,.44444,0,0],567:[.19444,.44444,0,0],710:[0,.69444,0,0],711:[0,.63194,0,0],713:[0,.59611,0,0],714:[0,.69444,0,0],715:[0,.69444,0,0],728:[0,.69444,0,0],729:[0,.69444,0,0],730:[0,.69444,0,0],732:[0,.69444,0,0],768:[0,.69444,0,0],769:[0,.69444,0,0],770:[0,.69444,0,0],771:[0,.69444,0,0],772:[0,.59611,0,0],774:[0,.69444,0,0],775:[0,.69444,0,0],776:[0,.69444,0,0],778:[0,.69444,0,0],779:[0,.69444,0,0],780:[0,.63194,0,0],824:[.19444,.69444,0,0],915:[0,.68611,0,0],916:[0,.68611,0,0],920:[0,.68611,0,0],923:[0,.68611,0,0],926:[0,.68611,0,0],928:[0,.68611,0,0],931:[0,.68611,0,0],933:[0,.68611,0,0],934:[0,.68611,0,0],936:[0,.68611,0,0],937:[0,.68611,0,0],8211:[0,.44444,.03194,0],8212:[0,.44444,.03194,0],8216:[0,.69444,0,0],8217:[0,.69444,0,0],8220:[0,.69444,0,0],8221:[0,.69444,0,0],8224:[.19444,.69444,0,0],8225:[.19444,.69444,0,0],8242:[0,.55556,0,0],8407:[0,.72444,.15486,0],8463:[0,.69444,0,0],8465:[0,.69444,0,0],8467:[0,.69444,0,0],8472:[.19444,.44444,0,0],8476:[0,.69444,0,0],8501:[0,.69444,0,0],8592:[-.10889,.39111,0,0],8593:[.19444,.69444,0,0],8594:[-.10889,.39111,0,0],8595:[.19444,.69444,0,0],8596:[-.10889,.39111,0,0],8597:[.25,.75,0,0],8598:[.19444,.69444,0,0],8599:[.19444,.69444,0,0],8600:[.19444,.69444,0,0],8601:[.19444,.69444,0,0],8636:[-.10889,.39111,0,0],8637:[-.10889,.39111,0,0],8640:[-.10889,.39111,0,0],8641:[-.10889,.39111,0,0],8656:[-.10889,.39111,0,0],8657:[.19444,.69444,0,0],8658:[-.10889,.39111,0,0],8659:[.19444,.69444,0,0],8660:[-.10889,.39111,0,0],8661:[.25,.75,0,0],8704:[0,.69444,0,0],8706:[0,.69444,.06389,0],8707:[0,.69444,0,0],8709:[.05556,.75,0,0],8711:[0,.68611,0,0],8712:[.08556,.58556,0,0],8715:[.08556,.58556,0,0],8722:[.13333,.63333,0,0],8723:[.13333,.63333,0,0],8725:[.25,.75,0,0],8726:[.25,.75,0,0],8727:[-.02778,.47222,0,0],8728:[-.02639,.47361,0,0],8729:[-.02639,.47361,0,0],8730:[.18,.82,0,0],8733:[0,.44444,0,0],8734:[0,.44444,0,0],8736:[0,.69224,0,0],8739:[.25,.75,0,0],8741:[.25,.75,0,0],8743:[0,.55556,0,0],8744:[0,.55556,0,0],8745:[0,.55556,0,0],8746:[0,.55556,0,0],8747:[.19444,.69444,.12778,0],8764:[-.10889,.39111,0,0],8768:[.19444,.69444,0,0],8771:[.00222,.50222,0,0],8776:[.02444,.52444,0,0],8781:[.00222,.50222,0,0],8801:[.00222,.50222,0,0],8804:[.19667,.69667,0,0],8805:[.19667,.69667,0,0],8810:[.08556,.58556,0,0],8811:[.08556,.58556,0,0],8826:[.08556,.58556,0,0],8827:[.08556,.58556,0,0],8834:[.08556,.58556,0,0],8835:[.08556,.58556,0,0],8838:[.19667,.69667,0,0],8839:[.19667,.69667,0,0],8846:[0,.55556,0,0],8849:[.19667,.69667,0,0],8850:[.19667,.69667,0,0],8851:[0,.55556,0,0],8852:[0,.55556,0,0],8853:[.13333,.63333,0,0],8854:[.13333,.63333,0,0],8855:[.13333,.63333,0,0],8856:[.13333,.63333,0,0],8857:[.13333,.63333,0,0],8866:[0,.69444,0,0],8867:[0,.69444,0,0],8868:[0,.69444,0,0],8869:[0,.69444,0,0],8900:[-.02639,.47361,0,0],8901:[-.02639,.47361,0,0],8902:[-.02778,.47222,0,0],8968:[.25,.75,0,0],8969:[.25,.75,0,0],8970:[.25,.75,0,0],8971:[.25,.75,0,0],8994:[-.13889,.36111,0,0],8995:[-.13889,.36111,0,0],9651:[.19444,.69444,0,0],9657:[-.02778,.47222,0,0],9661:[.19444,.69444,0,0],9667:[-.02778,.47222,0,0],9711:[.19444,.69444,0,0],9824:[.12963,.69444,0,0],9825:[.12963,.69444,0,0],9826:[.12963,.69444,0,0],9827:[.12963,.69444,0,0],9837:[0,.75,0,0],9838:[.19444,.69444,0,0],9839:[.19444,.69444,0,0],10216:[.25,.75,0,0],10217:[.25,.75,0,0],10815:[0,.68611,0,0],10927:[.19667,.69667,0,0],10928:[.19667,.69667,0,0]},"Main-Italic":{33:[0,.69444,.12417,0],34:[0,.69444,.06961,0],35:[.19444,.69444,.06616,0],37:[.05556,.75,.13639,0],38:[0,.69444,.09694,0],39:[0,.69444,.12417,0],40:[.25,.75,.16194,0],41:[.25,.75,.03694,0],42:[0,.75,.14917,0],43:[.05667,.56167,.03694,0],44:[.19444,.10556,0,0],45:[0,.43056,.02826,0],46:[0,.10556,0,0],47:[.25,.75,.16194,0],48:[0,.64444,.13556,0],49:[0,.64444,.13556,0],50:[0,.64444,.13556,0],51:[0,.64444,.13556,0],52:[.19444,.64444,.13556,0],53:[0,.64444,.13556,0],54:[0,.64444,.13556,0],55:[.19444,.64444,.13556,0],56:[0,.64444,.13556,0],57:[0,.64444,.13556,0],58:[0,.43056,.0582,0],59:[.19444,.43056,.0582,0],61:[-.13313,.36687,.06616,0],63:[0,.69444,.1225,0],64:[0,.69444,.09597,0],65:[0,.68333,0,0],66:[0,.68333,.10257,0],67:[0,.68333,.14528,0],68:[0,.68333,.09403,0],69:[0,.68333,.12028,0],70:[0,.68333,.13305,0],71:[0,.68333,.08722,0],72:[0,.68333,.16389,0],73:[0,.68333,.15806,0],74:[0,.68333,.14028,0],75:[0,.68333,.14528,0],76:[0,.68333,0,0],77:[0,.68333,.16389,0],78:[0,.68333,.16389,0],79:[0,.68333,.09403,0],80:[0,.68333,.10257,0],81:[.19444,.68333,.09403,0],82:[0,.68333,.03868,0],83:[0,.68333,.11972,0],84:[0,.68333,.13305,0],85:[0,.68333,.16389,0],86:[0,.68333,.18361,0],87:[0,.68333,.18361,0],88:[0,.68333,.15806,0],89:[0,.68333,.19383,0],90:[0,.68333,.14528,0],91:[.25,.75,.1875,0],93:[.25,.75,.10528,0],94:[0,.69444,.06646,0],95:[.31,.12056,.09208,0],97:[0,.43056,.07671,0],98:[0,.69444,.06312,0],99:[0,.43056,.05653,0],100:[0,.69444,.10333,0],101:[0,.43056,.07514,0],102:[.19444,.69444,.21194,0],103:[.19444,.43056,.08847,0],104:[0,.69444,.07671,0],105:[0,.65536,.1019,0],106:[.19444,.65536,.14467,0],107:[0,.69444,.10764,0],108:[0,.69444,.10333,0],109:[0,.43056,.07671,0],110:[0,.43056,.07671,0],111:[0,.43056,.06312,0],112:[.19444,.43056,.06312,0],113:[.19444,.43056,.08847,0],114:[0,.43056,.10764,0],115:[0,.43056,.08208,0],116:[0,.61508,.09486,0],117:[0,.43056,.07671,0],118:[0,.43056,.10764,0],119:[0,.43056,.10764,0],120:[0,.43056,.12042,0],121:[.19444,.43056,.08847,0],122:[0,.43056,.12292,0],126:[.35,.31786,.11585,0],163:[0,.69444,0,0],305:[0,.43056,0,.02778],567:[.19444,.43056,0,.08334],768:[0,.69444,0,0],769:[0,.69444,.09694,0],770:[0,.69444,.06646,0],771:[0,.66786,.11585,0],772:[0,.56167,.10333,0],774:[0,.69444,.10806,0],775:[0,.66786,.11752,0],776:[0,.66786,.10474,0],778:[0,.69444,0,0],779:[0,.69444,.1225,0],780:[0,.62847,.08295,0],915:[0,.68333,.13305,0],916:[0,.68333,0,0],920:[0,.68333,.09403,0],923:[0,.68333,0,0],926:[0,.68333,.15294,0],928:[0,.68333,.16389,0],931:[0,.68333,.12028,0],933:[0,.68333,.11111,0],934:[0,.68333,.05986,0],936:[0,.68333,.11111,0],937:[0,.68333,.10257,0],8211:[0,.43056,.09208,0],8212:[0,.43056,.09208,0],8216:[0,.69444,.12417,0],8217:[0,.69444,.12417,0],8220:[0,.69444,.1685,0],8221:[0,.69444,.06961,0],8463:[0,.68889,0,0]},"Main-Regular":{32:[0,0,0,0],33:[0,.69444,0,0],34:[0,.69444,0,0],35:[.19444,.69444,0,0],36:[.05556,.75,0,0],37:[.05556,.75,0,0],38:[0,.69444,0,0],39:[0,.69444,0,0],40:[.25,.75,0,0],41:[.25,.75,0,0],42:[0,.75,0,0],43:[.08333,.58333,0,0],44:[.19444,.10556,0,0],45:[0,.43056,0,0],46:[0,.10556,0,0],47:[.25,.75,0,0],48:[0,.64444,0,0],49:[0,.64444,0,0],50:[0,.64444,0,0],51:[0,.64444,0,0],52:[0,.64444,0,0],53:[0,.64444,0,0],54:[0,.64444,0,0],55:[0,.64444,0,0],56:[0,.64444,0,0],57:[0,.64444,0,0],58:[0,.43056,0,0],59:[.19444,.43056,0,0],60:[.0391,.5391,0,0],61:[-.13313,.36687,0,0],62:[.0391,.5391,0,0],63:[0,.69444,0,0],64:[0,.69444,0,0],65:[0,.68333,0,0],66:[0,.68333,0,0],67:[0,.68333,0,0],68:[0,.68333,0,0],69:[0,.68333,0,0],70:[0,.68333,0,0],71:[0,.68333,0,0],72:[0,.68333,0,0],73:[0,.68333,0,0],74:[0,.68333,0,0],75:[0,.68333,0,0],76:[0,.68333,0,0],77:[0,.68333,0,0],78:[0,.68333,0,0],79:[0,.68333,0,0],80:[0,.68333,0,0],81:[.19444,.68333,0,0],82:[0,.68333,0,0],83:[0,.68333,0,0],84:[0,.68333,0,0],85:[0,.68333,0,0],86:[0,.68333,.01389,0],87:[0,.68333,.01389,0],88:[0,.68333,0,0],89:[0,.68333,.025,0],90:[0,.68333,0,0],91:[.25,.75,0,0],92:[.25,.75,0,0],93:[.25,.75,0,0],94:[0,.69444,0,0],95:[.31,.12056,.02778,0],96:[0,.69444,0,0],97:[0,.43056,0,0],98:[0,.69444,0,0],99:[0,.43056,0,0],100:[0,.69444,0,0],101:[0,.43056,0,0],102:[0,.69444,.07778,0],103:[.19444,.43056,.01389,0],104:[0,.69444,0,0],105:[0,.66786,0,0],106:[.19444,.66786,0,0],107:[0,.69444,0,0],108:[0,.69444,0,0],109:[0,.43056,0,0],110:[0,.43056,0,0],111:[0,.43056,0,0],112:[.19444,.43056,0,0],113:[.19444,.43056,0,0],114:[0,.43056,0,0],115:[0,.43056,0,0],116:[0,.61508,0,0],117:[0,.43056,0,0],118:[0,.43056,.01389,0],119:[0,.43056,.01389,0],120:[0,.43056,0,0],121:[.19444,.43056,.01389,0],122:[0,.43056,0,0],123:[.25,.75,0,0],124:[.25,.75,0,0],125:[.25,.75,0,0],126:[.35,.31786,0,0],160:[0,0,0,0],168:[0,.66786,0,0],172:[0,.43056,0,0],175:[0,.56778,0,0],176:[0,.69444,0,0],177:[.08333,.58333,0,0],180:[0,.69444,0,0],215:[.08333,.58333,0,0],247:[.08333,.58333,0,0],305:[0,.43056,0,0],567:[.19444,.43056,0,0],710:[0,.69444,0,0],711:[0,.62847,0,0],713:[0,.56778,0,0],714:[0,.69444,0,0],715:[0,.69444,0,0],728:[0,.69444,0,0],729:[0,.66786,0,0],730:[0,.69444,0,0],732:[0,.66786,0,0],768:[0,.69444,0,0],769:[0,.69444,0,0],770:[0,.69444,0,0],771:[0,.66786,0,0],772:[0,.56778,0,0],774:[0,.69444,0,0],775:[0,.66786,0,0],776:[0,.66786,0,0],778:[0,.69444,0,0],779:[0,.69444,0,0],780:[0,.62847,0,0],824:[.19444,.69444,0,0],915:[0,.68333,0,0],916:[0,.68333,0,0],920:[0,.68333,0,0],923:[0,.68333,0,0],926:[0,.68333,0,0],928:[0,.68333,0,0],931:[0,.68333,0,0],933:[0,.68333,0,0],934:[0,.68333,0,0],936:[0,.68333,0,0],937:[0,.68333,0,0],8211:[0,.43056,.02778,0],8212:[0,.43056,.02778,0],8216:[0,.69444,0,0],8217:[0,.69444,0,0],8220:[0,.69444,0,0],8221:[0,.69444,0,0],8224:[.19444,.69444,0,0],8225:[.19444,.69444,0,0],8230:[0,.12,0,0],8242:[0,.55556,0,0],8407:[0,.71444,.15382,0],8463:[0,.68889,0,0],8465:[0,.69444,0,0],8467:[0,.69444,0,.11111],8472:[.19444,.43056,0,.11111],8476:[0,.69444,0,0],8501:[0,.69444,0,0],8592:[-.13313,.36687,0,0],8593:[.19444,.69444,0,0],8594:[-.13313,.36687,0,0],8595:[.19444,.69444,0,0],8596:[-.13313,.36687,0,0],8597:[.25,.75,0,0],8598:[.19444,.69444,0,0],8599:[.19444,.69444,0,0],8600:[.19444,.69444,0,0],8601:[.19444,.69444,0,0],8614:[.011,.511,0,0],8617:[.011,.511,0,0],8618:[.011,.511,0,0],8636:[-.13313,.36687,0,0],8637:[-.13313,.36687,0,0],8640:[-.13313,.36687,0,0],8641:[-.13313,.36687,0,0],8652:[.011,.671,0,0],8656:[-.13313,.36687,0,0],8657:[.19444,.69444,0,0],8658:[-.13313,.36687,0,0],8659:[.19444,.69444,0,0],8660:[-.13313,.36687,0,0],8661:[.25,.75,0,0],8704:[0,.69444,0,0],8706:[0,.69444,.05556,.08334],8707:[0,.69444,0,0],8709:[.05556,.75,0,0],8711:[0,.68333,0,0],8712:[.0391,.5391,0,0],8715:[.0391,.5391,0,0],8722:[.08333,.58333,0,0],8723:[.08333,.58333,0,0],8725:[.25,.75,0,0],8726:[.25,.75,0,0],8727:[-.03472,.46528,0,0],8728:[-.05555,.44445,0,0],8729:[-.05555,.44445,0,0],8730:[.2,.8,0,0],8733:[0,.43056,0,0],8734:[0,.43056,0,0],8736:[0,.69224,0,0],8739:[.25,.75,0,0],8741:[.25,.75,0,0],8743:[0,.55556,0,0],8744:[0,.55556,0,0],8745:[0,.55556,0,0],8746:[0,.55556,0,0],8747:[.19444,.69444,.11111,0],8764:[-.13313,.36687,0,0],8768:[.19444,.69444,0,0],8771:[-.03625,.46375,0,0],8773:[-.022,.589,0,0],8776:[-.01688,.48312,0,0],8781:[-.03625,.46375,0,0],8784:[-.133,.67,0,0],8800:[.215,.716,0,0],8801:[-.03625,.46375,0,0],8804:[.13597,.63597,0,0],8805:[.13597,.63597,0,0],8810:[.0391,.5391,0,0],8811:[.0391,.5391,0,0],8826:[.0391,.5391,0,0],8827:[.0391,.5391,0,0],8834:[.0391,.5391,0,0],8835:[.0391,.5391,0,0],8838:[.13597,.63597,0,0],8839:[.13597,.63597,0,0],8846:[0,.55556,0,0],8849:[.13597,.63597,0,0],8850:[.13597,.63597,0,0],
8851:[0,.55556,0,0],8852:[0,.55556,0,0],8853:[.08333,.58333,0,0],8854:[.08333,.58333,0,0],8855:[.08333,.58333,0,0],8856:[.08333,.58333,0,0],8857:[.08333,.58333,0,0],8866:[0,.69444,0,0],8867:[0,.69444,0,0],8868:[0,.69444,0,0],8869:[0,.69444,0,0],8872:[.249,.75,0,0],8900:[-.05555,.44445,0,0],8901:[-.05555,.44445,0,0],8902:[-.03472,.46528,0,0],8904:[.005,.505,0,0],8942:[.03,.9,0,0],8943:[-.19,.31,0,0],8945:[-.1,.82,0,0],8968:[.25,.75,0,0],8969:[.25,.75,0,0],8970:[.25,.75,0,0],8971:[.25,.75,0,0],8994:[-.14236,.35764,0,0],8995:[-.14236,.35764,0,0],9136:[.244,.744,0,0],9137:[.244,.744,0,0],9651:[.19444,.69444,0,0],9657:[-.03472,.46528,0,0],9661:[.19444,.69444,0,0],9667:[-.03472,.46528,0,0],9711:[.19444,.69444,0,0],9824:[.12963,.69444,0,0],9825:[.12963,.69444,0,0],9826:[.12963,.69444,0,0],9827:[.12963,.69444,0,0],9837:[0,.75,0,0],9838:[.19444,.69444,0,0],9839:[.19444,.69444,0,0],10216:[.25,.75,0,0],10217:[.25,.75,0,0],10222:[.244,.744,0,0],10223:[.244,.744,0,0],10229:[.011,.511,0,0],10230:[.011,.511,0,0],10231:[.011,.511,0,0],10232:[.024,.525,0,0],10233:[.024,.525,0,0],10234:[.024,.525,0,0],10236:[.011,.511,0,0],10815:[0,.68333,0,0],10927:[.13597,.63597,0,0],10928:[.13597,.63597,0,0]},"Math-BoldItalic":{47:[.19444,.69444,0,0],65:[0,.68611,0,0],66:[0,.68611,.04835,0],67:[0,.68611,.06979,0],68:[0,.68611,.03194,0],69:[0,.68611,.05451,0],70:[0,.68611,.15972,0],71:[0,.68611,0,0],72:[0,.68611,.08229,0],73:[0,.68611,.07778,0],74:[0,.68611,.10069,0],75:[0,.68611,.06979,0],76:[0,.68611,0,0],77:[0,.68611,.11424,0],78:[0,.68611,.11424,0],79:[0,.68611,.03194,0],80:[0,.68611,.15972,0],81:[.19444,.68611,0,0],82:[0,.68611,.00421,0],83:[0,.68611,.05382,0],84:[0,.68611,.15972,0],85:[0,.68611,.11424,0],86:[0,.68611,.25555,0],87:[0,.68611,.15972,0],88:[0,.68611,.07778,0],89:[0,.68611,.25555,0],90:[0,.68611,.06979,0],97:[0,.44444,0,0],98:[0,.69444,0,0],99:[0,.44444,0,0],100:[0,.69444,0,0],101:[0,.44444,0,0],102:[.19444,.69444,.11042,0],103:[.19444,.44444,.03704,0],104:[0,.69444,0,0],105:[0,.69326,0,0],106:[.19444,.69326,.0622,0],107:[0,.69444,.01852,0],108:[0,.69444,.0088,0],109:[0,.44444,0,0],110:[0,.44444,0,0],111:[0,.44444,0,0],112:[.19444,.44444,0,0],113:[.19444,.44444,.03704,0],114:[0,.44444,.03194,0],115:[0,.44444,0,0],116:[0,.63492,0,0],117:[0,.44444,0,0],118:[0,.44444,.03704,0],119:[0,.44444,.02778,0],120:[0,.44444,0,0],121:[.19444,.44444,.03704,0],122:[0,.44444,.04213,0],915:[0,.68611,.15972,0],916:[0,.68611,0,0],920:[0,.68611,.03194,0],923:[0,.68611,0,0],926:[0,.68611,.07458,0],928:[0,.68611,.08229,0],931:[0,.68611,.05451,0],933:[0,.68611,.15972,0],934:[0,.68611,0,0],936:[0,.68611,.11653,0],937:[0,.68611,.04835,0],945:[0,.44444,0,0],946:[.19444,.69444,.03403,0],947:[.19444,.44444,.06389,0],948:[0,.69444,.03819,0],949:[0,.44444,0,0],950:[.19444,.69444,.06215,0],951:[.19444,.44444,.03704,0],952:[0,.69444,.03194,0],953:[0,.44444,0,0],954:[0,.44444,0,0],955:[0,.69444,0,0],956:[.19444,.44444,0,0],957:[0,.44444,.06898,0],958:[.19444,.69444,.03021,0],959:[0,.44444,0,0],960:[0,.44444,.03704,0],961:[.19444,.44444,0,0],962:[.09722,.44444,.07917,0],963:[0,.44444,.03704,0],964:[0,.44444,.13472,0],965:[0,.44444,.03704,0],966:[.19444,.44444,0,0],967:[.19444,.44444,0,0],968:[.19444,.69444,.03704,0],969:[0,.44444,.03704,0],977:[0,.69444,0,0],981:[.19444,.69444,0,0],982:[0,.44444,.03194,0],1009:[.19444,.44444,0,0],1013:[0,.44444,0,0]},"Math-Italic":{47:[.19444,.69444,0,0],65:[0,.68333,0,.13889],66:[0,.68333,.05017,.08334],67:[0,.68333,.07153,.08334],68:[0,.68333,.02778,.05556],69:[0,.68333,.05764,.08334],70:[0,.68333,.13889,.08334],71:[0,.68333,0,.08334],72:[0,.68333,.08125,.05556],73:[0,.68333,.07847,.11111],74:[0,.68333,.09618,.16667],75:[0,.68333,.07153,.05556],76:[0,.68333,0,.02778],77:[0,.68333,.10903,.08334],78:[0,.68333,.10903,.08334],79:[0,.68333,.02778,.08334],80:[0,.68333,.13889,.08334],81:[.19444,.68333,0,.08334],82:[0,.68333,.00773,.08334],83:[0,.68333,.05764,.08334],84:[0,.68333,.13889,.08334],85:[0,.68333,.10903,.02778],86:[0,.68333,.22222,0],87:[0,.68333,.13889,0],88:[0,.68333,.07847,.08334],89:[0,.68333,.22222,0],90:[0,.68333,.07153,.08334],97:[0,.43056,0,0],98:[0,.69444,0,0],99:[0,.43056,0,.05556],100:[0,.69444,0,.16667],101:[0,.43056,0,.05556],102:[.19444,.69444,.10764,.16667],103:[.19444,.43056,.03588,.02778],104:[0,.69444,0,0],105:[0,.65952,0,0],106:[.19444,.65952,.05724,0],107:[0,.69444,.03148,0],108:[0,.69444,.01968,.08334],109:[0,.43056,0,0],110:[0,.43056,0,0],111:[0,.43056,0,.05556],112:[.19444,.43056,0,.08334],113:[.19444,.43056,.03588,.08334],114:[0,.43056,.02778,.05556],115:[0,.43056,0,.05556],116:[0,.61508,0,.08334],117:[0,.43056,0,.02778],118:[0,.43056,.03588,.02778],119:[0,.43056,.02691,.08334],120:[0,.43056,0,.02778],121:[.19444,.43056,.03588,.05556],122:[0,.43056,.04398,.05556],915:[0,.68333,.13889,.08334],916:[0,.68333,0,.16667],920:[0,.68333,.02778,.08334],923:[0,.68333,0,.16667],926:[0,.68333,.07569,.08334],928:[0,.68333,.08125,.05556],931:[0,.68333,.05764,.08334],933:[0,.68333,.13889,.05556],934:[0,.68333,0,.08334],936:[0,.68333,.11,.05556],937:[0,.68333,.05017,.08334],945:[0,.43056,.0037,.02778],946:[.19444,.69444,.05278,.08334],947:[.19444,.43056,.05556,0],948:[0,.69444,.03785,.05556],949:[0,.43056,0,.08334],950:[.19444,.69444,.07378,.08334],951:[.19444,.43056,.03588,.05556],952:[0,.69444,.02778,.08334],953:[0,.43056,0,.05556],954:[0,.43056,0,0],955:[0,.69444,0,0],956:[.19444,.43056,0,.02778],957:[0,.43056,.06366,.02778],958:[.19444,.69444,.04601,.11111],959:[0,.43056,0,.05556],960:[0,.43056,.03588,0],961:[.19444,.43056,0,.08334],962:[.09722,.43056,.07986,.08334],963:[0,.43056,.03588,0],964:[0,.43056,.1132,.02778],965:[0,.43056,.03588,.02778],966:[.19444,.43056,0,.08334],967:[.19444,.43056,0,.05556],968:[.19444,.69444,.03588,.11111],969:[0,.43056,.03588,0],977:[0,.69444,0,.08334],981:[.19444,.69444,0,.08334],982:[0,.43056,.02778,0],1009:[.19444,.43056,0,.08334],1013:[0,.43056,0,.05556]},"Math-Regular":{65:[0,.68333,0,.13889],66:[0,.68333,.05017,.08334],67:[0,.68333,.07153,.08334],68:[0,.68333,.02778,.05556],69:[0,.68333,.05764,.08334],70:[0,.68333,.13889,.08334],71:[0,.68333,0,.08334],72:[0,.68333,.08125,.05556],73:[0,.68333,.07847,.11111],74:[0,.68333,.09618,.16667],75:[0,.68333,.07153,.05556],76:[0,.68333,0,.02778],77:[0,.68333,.10903,.08334],78:[0,.68333,.10903,.08334],79:[0,.68333,.02778,.08334],80:[0,.68333,.13889,.08334],81:[.19444,.68333,0,.08334],82:[0,.68333,.00773,.08334],83:[0,.68333,.05764,.08334],84:[0,.68333,.13889,.08334],85:[0,.68333,.10903,.02778],86:[0,.68333,.22222,0],87:[0,.68333,.13889,0],88:[0,.68333,.07847,.08334],89:[0,.68333,.22222,0],90:[0,.68333,.07153,.08334],97:[0,.43056,0,0],98:[0,.69444,0,0],99:[0,.43056,0,.05556],100:[0,.69444,0,.16667],101:[0,.43056,0,.05556],102:[.19444,.69444,.10764,.16667],103:[.19444,.43056,.03588,.02778],104:[0,.69444,0,0],105:[0,.65952,0,0],106:[.19444,.65952,.05724,0],107:[0,.69444,.03148,0],108:[0,.69444,.01968,.08334],109:[0,.43056,0,0],110:[0,.43056,0,0],111:[0,.43056,0,.05556],112:[.19444,.43056,0,.08334],113:[.19444,.43056,.03588,.08334],114:[0,.43056,.02778,.05556],115:[0,.43056,0,.05556],116:[0,.61508,0,.08334],117:[0,.43056,0,.02778],118:[0,.43056,.03588,.02778],119:[0,.43056,.02691,.08334],120:[0,.43056,0,.02778],121:[.19444,.43056,.03588,.05556],122:[0,.43056,.04398,.05556],915:[0,.68333,.13889,.08334],916:[0,.68333,0,.16667],920:[0,.68333,.02778,.08334],923:[0,.68333,0,.16667],926:[0,.68333,.07569,.08334],928:[0,.68333,.08125,.05556],931:[0,.68333,.05764,.08334],933:[0,.68333,.13889,.05556],934:[0,.68333,0,.08334],936:[0,.68333,.11,.05556],937:[0,.68333,.05017,.08334],945:[0,.43056,.0037,.02778],946:[.19444,.69444,.05278,.08334],947:[.19444,.43056,.05556,0],948:[0,.69444,.03785,.05556],949:[0,.43056,0,.08334],950:[.19444,.69444,.07378,.08334],951:[.19444,.43056,.03588,.05556],952:[0,.69444,.02778,.08334],953:[0,.43056,0,.05556],954:[0,.43056,0,0],955:[0,.69444,0,0],956:[.19444,.43056,0,.02778],957:[0,.43056,.06366,.02778],958:[.19444,.69444,.04601,.11111],959:[0,.43056,0,.05556],960:[0,.43056,.03588,0],961:[.19444,.43056,0,.08334],962:[.09722,.43056,.07986,.08334],963:[0,.43056,.03588,0],964:[0,.43056,.1132,.02778],965:[0,.43056,.03588,.02778],966:[.19444,.43056,0,.08334],967:[.19444,.43056,0,.05556],968:[.19444,.69444,.03588,.11111],969:[0,.43056,.03588,0],977:[0,.69444,0,.08334],981:[.19444,.69444,0,.08334],982:[0,.43056,.02778,0],1009:[.19444,.43056,0,.08334],1013:[0,.43056,0,.05556]},"SansSerif-Bold":{33:[0,.69444,0,0],34:[0,.69444,0,0],35:[.19444,.69444,0,0],36:[.05556,.75,0,0],37:[.05556,.75,0,0],38:[0,.69444,0,0],39:[0,.69444,0,0],40:[.25,.75,0,0],41:[.25,.75,0,0],42:[0,.75,0,0],43:[.11667,.61667,0,0],44:[.10556,.13056,0,0],45:[0,.45833,0,0],46:[0,.13056,0,0],47:[.25,.75,0,0],48:[0,.69444,0,0],49:[0,.69444,0,0],50:[0,.69444,0,0],51:[0,.69444,0,0],52:[0,.69444,0,0],53:[0,.69444,0,0],54:[0,.69444,0,0],55:[0,.69444,0,0],56:[0,.69444,0,0],57:[0,.69444,0,0],58:[0,.45833,0,0],59:[.10556,.45833,0,0],61:[-.09375,.40625,0,0],63:[0,.69444,0,0],64:[0,.69444,0,0],65:[0,.69444,0,0],66:[0,.69444,0,0],67:[0,.69444,0,0],68:[0,.69444,0,0],69:[0,.69444,0,0],70:[0,.69444,0,0],71:[0,.69444,0,0],72:[0,.69444,0,0],73:[0,.69444,0,0],74:[0,.69444,0,0],75:[0,.69444,0,0],76:[0,.69444,0,0],77:[0,.69444,0,0],78:[0,.69444,0,0],79:[0,.69444,0,0],80:[0,.69444,0,0],81:[.10556,.69444,0,0],82:[0,.69444,0,0],83:[0,.69444,0,0],84:[0,.69444,0,0],85:[0,.69444,0,0],86:[0,.69444,.01528,0],87:[0,.69444,.01528,0],88:[0,.69444,0,0],89:[0,.69444,.0275,0],90:[0,.69444,0,0],91:[.25,.75,0,0],93:[.25,.75,0,0],94:[0,.69444,0,0],95:[.35,.10833,.03056,0],97:[0,.45833,0,0],98:[0,.69444,0,0],99:[0,.45833,0,0],100:[0,.69444,0,0],101:[0,.45833,0,0],102:[0,.69444,.07639,0],103:[.19444,.45833,.01528,0],104:[0,.69444,0,0],105:[0,.69444,0,0],106:[.19444,.69444,0,0],107:[0,.69444,0,0],108:[0,.69444,0,0],109:[0,.45833,0,0],110:[0,.45833,0,0],111:[0,.45833,0,0],112:[.19444,.45833,0,0],113:[.19444,.45833,0,0],114:[0,.45833,.01528,0],115:[0,.45833,0,0],116:[0,.58929,0,0],117:[0,.45833,0,0],118:[0,.45833,.01528,0],119:[0,.45833,.01528,0],120:[0,.45833,0,0],121:[.19444,.45833,.01528,0],122:[0,.45833,0,0],126:[.35,.34444,0,0],305:[0,.45833,0,0],567:[.19444,.45833,0,0],768:[0,.69444,0,0],769:[0,.69444,0,0],770:[0,.69444,0,0],771:[0,.69444,0,0],772:[0,.63778,0,0],774:[0,.69444,0,0],775:[0,.69444,0,0],776:[0,.69444,0,0],778:[0,.69444,0,0],779:[0,.69444,0,0],780:[0,.63542,0,0],915:[0,.69444,0,0],916:[0,.69444,0,0],920:[0,.69444,0,0],923:[0,.69444,0,0],926:[0,.69444,0,0],928:[0,.69444,0,0],931:[0,.69444,0,0],933:[0,.69444,0,0],934:[0,.69444,0,0],936:[0,.69444,0,0],937:[0,.69444,0,0],8211:[0,.45833,.03056,0],8212:[0,.45833,.03056,0],8216:[0,.69444,0,0],8217:[0,.69444,0,0],8220:[0,.69444,0,0],8221:[0,.69444,0,0]},"SansSerif-Italic":{33:[0,.69444,.05733,0],34:[0,.69444,.00316,0],35:[.19444,.69444,.05087,0],36:[.05556,.75,.11156,0],37:[.05556,.75,.03126,0],38:[0,.69444,.03058,0],39:[0,.69444,.07816,0],40:[.25,.75,.13164,0],41:[.25,.75,.02536,0],42:[0,.75,.11775,0],43:[.08333,.58333,.02536,0],44:[.125,.08333,0,0],45:[0,.44444,.01946,0],46:[0,.08333,0,0],47:[.25,.75,.13164,0],48:[0,.65556,.11156,0],49:[0,.65556,.11156,0],50:[0,.65556,.11156,0],51:[0,.65556,.11156,0],52:[0,.65556,.11156,0],53:[0,.65556,.11156,0],54:[0,.65556,.11156,0],55:[0,.65556,.11156,0],56:[0,.65556,.11156,0],57:[0,.65556,.11156,0],58:[0,.44444,.02502,0],59:[.125,.44444,.02502,0],61:[-.13,.37,.05087,0],63:[0,.69444,.11809,0],64:[0,.69444,.07555,0],65:[0,.69444,0,0],66:[0,.69444,.08293,0],67:[0,.69444,.11983,0],68:[0,.69444,.07555,0],69:[0,.69444,.11983,0],70:[0,.69444,.13372,0],71:[0,.69444,.11983,0],72:[0,.69444,.08094,0],73:[0,.69444,.13372,0],74:[0,.69444,.08094,0],75:[0,.69444,.11983,0],76:[0,.69444,0,0],77:[0,.69444,.08094,0],78:[0,.69444,.08094,0],79:[0,.69444,.07555,0],80:[0,.69444,.08293,0],81:[.125,.69444,.07555,0],82:[0,.69444,.08293,0],83:[0,.69444,.09205,0],84:[0,.69444,.13372,0],85:[0,.69444,.08094,0],86:[0,.69444,.1615,0],87:[0,.69444,.1615,0],88:[0,.69444,.13372,0],89:[0,.69444,.17261,0],90:[0,.69444,.11983,0],91:[.25,.75,.15942,0],93:[.25,.75,.08719,0],94:[0,.69444,.0799,0],95:[.35,.09444,.08616,0],97:[0,.44444,.00981,0],98:[0,.69444,.03057,0],99:[0,.44444,.08336,0],100:[0,.69444,.09483,0],101:[0,.44444,.06778,0],102:[0,.69444,.21705,0],103:[.19444,.44444,.10836,0],104:[0,.69444,.01778,0],105:[0,.67937,.09718,0],106:[.19444,.67937,.09162,0],107:[0,.69444,.08336,0],108:[0,.69444,.09483,0],109:[0,.44444,.01778,0],110:[0,.44444,.01778,0],111:[0,.44444,.06613,0],112:[.19444,.44444,.0389,0],113:[.19444,.44444,.04169,0],114:[0,.44444,.10836,0],115:[0,.44444,.0778,0],116:[0,.57143,.07225,0],117:[0,.44444,.04169,0],118:[0,.44444,.10836,0],119:[0,.44444,.10836,0],120:[0,.44444,.09169,0],121:[.19444,.44444,.10836,0],122:[0,.44444,.08752,0],126:[.35,.32659,.08826,0],305:[0,.44444,.04169,0],567:[.19444,.44444,.04169,0],768:[0,.69444,0,0],769:[0,.69444,.09205,0],770:[0,.69444,.0799,0],771:[0,.67659,.08826,0],772:[0,.60889,.08776,0],774:[0,.69444,.09483,0],775:[0,.67937,.07774,0],776:[0,.67937,.06385,0],778:[0,.69444,0,0],779:[0,.69444,.09205,0],780:[0,.63194,.08432,0],915:[0,.69444,.13372,0],916:[0,.69444,0,0],920:[0,.69444,.07555,0],923:[0,.69444,0,0],926:[0,.69444,.12816,0],928:[0,.69444,.08094,0],931:[0,.69444,.11983,0],933:[0,.69444,.09031,0],934:[0,.69444,.04603,0],936:[0,.69444,.09031,0],937:[0,.69444,.08293,0],8211:[0,.44444,.08616,0],8212:[0,.44444,.08616,0],8216:[0,.69444,.07816,0],8217:[0,.69444,.07816,0],8220:[0,.69444,.14205,0],8221:[0,.69444,.00316,0]},"SansSerif-Regular":{33:[0,.69444,0,0],34:[0,.69444,0,0],35:[.19444,.69444,0,0],36:[.05556,.75,0,0],37:[.05556,.75,0,0],38:[0,.69444,0,0],39:[0,.69444,0,0],40:[.25,.75,0,0],41:[.25,.75,0,0],42:[0,.75,0,0],43:[.08333,.58333,0,0],44:[.125,.08333,0,0],45:[0,.44444,0,0],46:[0,.08333,0,0],47:[.25,.75,0,0],48:[0,.65556,0,0],49:[0,.65556,0,0],50:[0,.65556,0,0],51:[0,.65556,0,0],52:[0,.65556,0,0],53:[0,.65556,0,0],54:[0,.65556,0,0],55:[0,.65556,0,0],56:[0,.65556,0,0],57:[0,.65556,0,0],58:[0,.44444,0,0],59:[.125,.44444,0,0],61:[-.13,.37,0,0],63:[0,.69444,0,0],64:[0,.69444,0,0],65:[0,.69444,0,0],66:[0,.69444,0,0],67:[0,.69444,0,0],68:[0,.69444,0,0],69:[0,.69444,0,0],70:[0,.69444,0,0],71:[0,.69444,0,0],72:[0,.69444,0,0],73:[0,.69444,0,0],74:[0,.69444,0,0],75:[0,.69444,0,0],76:[0,.69444,0,0],77:[0,.69444,0,0],78:[0,.69444,0,0],79:[0,.69444,0,0],80:[0,.69444,0,0],81:[.125,.69444,0,0],82:[0,.69444,0,0],83:[0,.69444,0,0],84:[0,.69444,0,0],85:[0,.69444,0,0],86:[0,.69444,.01389,0],87:[0,.69444,.01389,0],88:[0,.69444,0,0],89:[0,.69444,.025,0],90:[0,.69444,0,0],91:[.25,.75,0,0],93:[.25,.75,0,0],94:[0,.69444,0,0],95:[.35,.09444,.02778,0],97:[0,.44444,0,0],98:[0,.69444,0,0],99:[0,.44444,0,0],100:[0,.69444,0,0],101:[0,.44444,0,0],102:[0,.69444,.06944,0],103:[.19444,.44444,.01389,0],104:[0,.69444,0,0],105:[0,.67937,0,0],106:[.19444,.67937,0,0],107:[0,.69444,0,0],108:[0,.69444,0,0],109:[0,.44444,0,0],110:[0,.44444,0,0],111:[0,.44444,0,0],112:[.19444,.44444,0,0],113:[.19444,.44444,0,0],114:[0,.44444,.01389,0],115:[0,.44444,0,0],116:[0,.57143,0,0],117:[0,.44444,0,0],118:[0,.44444,.01389,0],119:[0,.44444,.01389,0],120:[0,.44444,0,0],121:[.19444,.44444,.01389,0],122:[0,.44444,0,0],126:[.35,.32659,0,0],305:[0,.44444,0,0],567:[.19444,.44444,0,0],768:[0,.69444,0,0],769:[0,.69444,0,0],770:[0,.69444,0,0],771:[0,.67659,0,0],772:[0,.60889,0,0],774:[0,.69444,0,0],775:[0,.67937,0,0],776:[0,.67937,0,0],778:[0,.69444,0,0],779:[0,.69444,0,0],780:[0,.63194,0,0],915:[0,.69444,0,0],916:[0,.69444,0,0],920:[0,.69444,0,0],923:[0,.69444,0,0],926:[0,.69444,0,0],928:[0,.69444,0,0],931:[0,.69444,0,0],933:[0,.69444,0,0],934:[0,.69444,0,0],936:[0,.69444,0,0],937:[0,.69444,0,0],8211:[0,.44444,.02778,0],8212:[0,.44444,.02778,0],8216:[0,.69444,0,0],8217:[0,.69444,0,0],8220:[0,.69444,0,0],8221:[0,.69444,0,0]},"Script-Regular":{65:[0,.7,.22925,0],66:[0,.7,.04087,0],67:[0,.7,.1689,0],68:[0,.7,.09371,0],69:[0,.7,.18583,0],70:[0,.7,.13634,0],71:[0,.7,.17322,0],72:[0,.7,.29694,0],73:[0,.7,.19189,0],74:[.27778,.7,.19189,0],75:[0,.7,.31259,0],76:[0,.7,.19189,0],77:[0,.7,.15981,0],78:[0,.7,.3525,0],79:[0,.7,.08078,0],80:[0,.7,.08078,0],81:[0,.7,.03305,0],82:[0,.7,.06259,0],83:[0,.7,.19189,0],84:[0,.7,.29087,0],85:[0,.7,.25815,0],86:[0,.7,.27523,0],87:[0,.7,.27523,0],88:[0,.7,.26006,0],89:[0,.7,.2939,0],90:[0,.7,.24037,0]},"Size1-Regular":{40:[.35001,.85,0,0],41:[.35001,.85,0,0],47:[.35001,.85,0,0],91:[.35001,.85,0,0],92:[.35001,.85,0,0],93:[.35001,.85,0,0],123:[.35001,.85,0,0],125:[.35001,.85,0,0],710:[0,.72222,0,0],732:[0,.72222,0,0],770:[0,.72222,0,0],771:[0,.72222,0,0],8214:[-99e-5,.601,0,0],8593:[1e-5,.6,0,0],8595:[1e-5,.6,0,0],8657:[1e-5,.6,0,0],8659:[1e-5,.6,0,0],8719:[.25001,.75,0,0],8720:[.25001,.75,0,0],8721:[.25001,.75,0,0],8730:[.35001,.85,0,0],8739:[-.00599,.606,0,0],8741:[-.00599,.606,0,0],8747:[.30612,.805,.19445,0],8748:[.306,.805,.19445,0],8749:[.306,.805,.19445,0],8750:[.30612,.805,.19445,0],8896:[.25001,.75,0,0],8897:[.25001,.75,0,0],8898:[.25001,.75,0,0],8899:[.25001,.75,0,0],8968:[.35001,.85,0,0],8969:[.35001,.85,0,0],8970:[.35001,.85,0,0],8971:[.35001,.85,0,0],9168:[-99e-5,.601,0,0],10216:[.35001,.85,0,0],10217:[.35001,.85,0,0],10752:[.25001,.75,0,0],10753:[.25001,.75,0,0],10754:[.25001,.75,0,0],10756:[.25001,.75,0,0],10758:[.25001,.75,0,0]},"Size2-Regular":{40:[.65002,1.15,0,0],41:[.65002,1.15,0,0],47:[.65002,1.15,0,0],91:[.65002,1.15,0,0],92:[.65002,1.15,0,0],93:[.65002,1.15,0,0],123:[.65002,1.15,0,0],125:[.65002,1.15,0,0],710:[0,.75,0,0],732:[0,.75,0,0],770:[0,.75,0,0],771:[0,.75,0,0],8719:[.55001,1.05,0,0],8720:[.55001,1.05,0,0],8721:[.55001,1.05,0,0],8730:[.65002,1.15,0,0],8747:[.86225,1.36,.44445,0],8748:[.862,1.36,.44445,0],8749:[.862,1.36,.44445,0],8750:[.86225,1.36,.44445,0],8896:[.55001,1.05,0,0],8897:[.55001,1.05,0,0],8898:[.55001,1.05,0,0],8899:[.55001,1.05,0,0],8968:[.65002,1.15,0,0],8969:[.65002,1.15,0,0],8970:[.65002,1.15,0,0],8971:[.65002,1.15,0,0],10216:[.65002,1.15,0,0],10217:[.65002,1.15,0,0],10752:[.55001,1.05,0,0],10753:[.55001,1.05,0,0],10754:[.55001,1.05,0,0],10756:[.55001,1.05,0,0],10758:[.55001,1.05,0,0]},"Size3-Regular":{40:[.95003,1.45,0,0],41:[.95003,1.45,0,0],47:[.95003,1.45,0,0],91:[.95003,1.45,0,0],92:[.95003,1.45,0,0],93:[.95003,1.45,0,0],123:[.95003,1.45,0,0],125:[.95003,1.45,0,0],710:[0,.75,0,0],732:[0,.75,0,0],770:[0,.75,0,0],771:[0,.75,0,0],8730:[.95003,1.45,0,0],8968:[.95003,1.45,0,0],8969:[.95003,1.45,0,0],8970:[.95003,1.45,0,0],8971:[.95003,1.45,0,0],10216:[.95003,1.45,0,0],10217:[.95003,1.45,0,0]},"Size4-Regular":{40:[1.25003,1.75,0,0],41:[1.25003,1.75,0,0],47:[1.25003,1.75,0,0],91:[1.25003,1.75,0,0],92:[1.25003,1.75,0,0],93:[1.25003,1.75,0,0],123:[1.25003,1.75,0,0],125:[1.25003,1.75,0,0],710:[0,.825,0,0],732:[0,.825,0,0],770:[0,.825,0,0],771:[0,.825,0,0],8730:[1.25003,1.75,0,0],8968:[1.25003,1.75,0,0],8969:[1.25003,1.75,0,0],8970:[1.25003,1.75,0,0],8971:[1.25003,1.75,0,0],9115:[.64502,1.155,0,0],9116:[1e-5,.6,0,0],9117:[.64502,1.155,0,0],9118:[.64502,1.155,0,0],9119:[1e-5,.6,0,0],9120:[.64502,1.155,0,0],9121:[.64502,1.155,0,0],9122:[-99e-5,.601,0,0],9123:[.64502,1.155,0,0],9124:[.64502,1.155,0,0],9125:[-99e-5,.601,0,0],9126:[.64502,1.155,0,0],9127:[1e-5,.9,0,0],9128:[.65002,1.15,0,0],9129:[.90001,0,0,0],9130:[0,.3,0,0],9131:[1e-5,.9,0,0],9132:[.65002,1.15,0,0],9133:[.90001,0,0,0],9143:[.88502,.915,0,0],10216:[1.25003,1.75,0,0],10217:[1.25003,1.75,0,0],57344:[-.00499,.605,0,0],57345:[-.00499,.605,0,0],57680:[0,.12,0,0],57681:[0,.12,0,0],57682:[0,.12,0,0],57683:[0,.12,0,0]},"Typewriter-Regular":{33:[0,.61111,0,0],34:[0,.61111,0,0],35:[0,.61111,0,0],36:[.08333,.69444,0,0],37:[.08333,.69444,0,0],38:[0,.61111,0,0],39:[0,.61111,0,0],40:[.08333,.69444,0,0],41:[.08333,.69444,0,0],42:[0,.52083,0,0],43:[-.08056,.53055,0,0],44:[.13889,.125,0,0],45:[-.08056,.53055,0,0],46:[0,.125,0,0],47:[.08333,.69444,0,0],48:[0,.61111,0,0],49:[0,.61111,0,0],50:[0,.61111,0,0],51:[0,.61111,0,0],52:[0,.61111,0,0],53:[0,.61111,0,0],54:[0,.61111,0,0],55:[0,.61111,0,0],56:[0,.61111,0,0],57:[0,.61111,0,0],58:[0,.43056,0,0],59:[.13889,.43056,0,0],60:[-.05556,.55556,0,0],61:[-.19549,.41562,0,0],62:[-.05556,.55556,0,0],63:[0,.61111,0,0],64:[0,.61111,0,0],65:[0,.61111,0,0],66:[0,.61111,0,0],67:[0,.61111,0,0],68:[0,.61111,0,0],69:[0,.61111,0,0],70:[0,.61111,0,0],71:[0,.61111,0,0],72:[0,.61111,0,0],73:[0,.61111,0,0],74:[0,.61111,0,0],75:[0,.61111,0,0],76:[0,.61111,0,0],77:[0,.61111,0,0],78:[0,.61111,0,0],79:[0,.61111,0,0],80:[0,.61111,0,0],81:[.13889,.61111,0,0],82:[0,.61111,0,0],83:[0,.61111,0,0],84:[0,.61111,0,0],85:[0,.61111,0,0],86:[0,.61111,0,0],87:[0,.61111,0,0],88:[0,.61111,0,0],89:[0,.61111,0,0],90:[0,.61111,0,0],91:[.08333,.69444,0,0],92:[.08333,.69444,0,0],93:[.08333,.69444,0,0],94:[0,.61111,0,0],95:[.09514,0,0,0],96:[0,.61111,0,0],97:[0,.43056,0,0],98:[0,.61111,0,0],99:[0,.43056,0,0],100:[0,.61111,0,0],101:[0,.43056,0,0],102:[0,.61111,0,0],103:[.22222,.43056,0,0],104:[0,.61111,0,0],105:[0,.61111,0,0],106:[.22222,.61111,0,0],107:[0,.61111,0,0],108:[0,.61111,0,0],109:[0,.43056,0,0],110:[0,.43056,0,0],111:[0,.43056,0,0],112:[.22222,.43056,0,0],113:[.22222,.43056,0,0],114:[0,.43056,0,0],115:[0,.43056,0,0],116:[0,.55358,0,0],117:[0,.43056,0,0],118:[0,.43056,0,0],119:[0,.43056,0,0],120:[0,.43056,0,0],121:[.22222,.43056,0,0],122:[0,.43056,0,0],123:[.08333,.69444,0,0],124:[.08333,.69444,0,0],125:[.08333,.69444,0,0],126:[0,.61111,0,0],127:[0,.61111,0,0],305:[0,.43056,0,0],567:[.22222,.43056,0,0],768:[0,.61111,0,0],769:[0,.61111,0,0],770:[0,.61111,0,0],771:[0,.61111,0,0],772:[0,.56555,0,0],774:[0,.61111,0,0],776:[0,.61111,0,0],778:[0,.61111,0,0],780:[0,.56597,0,0],915:[0,.61111,0,0],916:[0,.61111,0,0],920:[0,.61111,0,0],923:[0,.61111,0,0],926:[0,.61111,0,0],928:[0,.61111,0,0],931:[0,.61111,0,0],933:[0,.61111,0,0],934:[0,.61111,0,0],936:[0,.61111,0,0],937:[0,.61111,0,0],8216:[0,.61111,0,0],8217:[0,.61111,0,0],8242:[0,.61111,0,0],9251:[.11111,.21944,0,0]}}},{}],103:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("./utils");var n=d(a);var i=e("./ParseError");var l=d(i);var u=e("./ParseNode");var o=d(u);var s=e("./defineFunction");var f=d(s);e("./functions/color");e("./functions/text");e("./functions/overline");e("./functions/underline");e("./functions/rule");e("./functions/kern");e("./functions/phantom");e("./functions/mod");e("./functions/op");e("./functions/operatorname");e("./functions/genfrac");e("./functions/lap");e("./functions/smash");e("./functions/delimsizing");e("./functions/href");e("./functions/mathchoice");function d(e){return e&&e.__esModule?e:{default:e}}var c=s._functions;r.default=c;var h=function e(t,r,a){(0,f.default)({names:t,props:r,handler:a})};h(["\\sqrt"],{numArgs:1,numOptionalArgs:1},function(e,t,r){var a=r[0];var n=t[0];return{type:"sqrt",body:n,index:a}});h(["\\xmlClass"],{numArgs:2,allowedInText:true,greediness:3,argTypes:["string","original"]},function(e,t){var r=t[0];var a=t[1];var n=void 0;if(a.type==="ordgroup"){n=a.value}else{n=[a]}return{type:"xmlClass",cl:r,value:n}});h(["\\color"],{numArgs:1,allowedInText:true,greediness:3,argTypes:["color"]},null);h(["\\colorbox"],{numArgs:2,allowedInText:true,greediness:3,argTypes:["color","text"]},function(e,t){var r=t[0];var a=t[1];return{type:"enclose",label:e.funcName,backgroundColor:r,body:a}});h(["\\fcolorbox"],{numArgs:3,allowedInText:true,greediness:3,argTypes:["color","color","text"]},function(e,t){var r=t[0];var a=t[1];var n=t[2];return{type:"enclose",label:e.funcName,backgroundColor:a,borderColor:r,body:n}});h(["\\cursor"],{numArgs:1,numOptionalArgs:1,argTypes:["size","size"]},function(e,t,r){var a=r[0];var n=t[0];return{type:"cursor",shift:a&&a.value,height:n.value}});h(["\\mathord","\\mathbin","\\mathrel","\\mathopen","\\mathclose","\\mathpunct","\\mathinner"],{numArgs:1},function(e,t){var r=t[0];return{type:"mclass",mclass:"m"+e.funcName.substr(5),value:(0,s.ordargument)(r)}});h(["\\stackrel"],{numArgs:2},function(e,t){var r=t[0];var a=t[1];var n=new o.default("op",{type:"op",limits:true,alwaysHandleSupSub:true,symbol:false,value:(0,s.ordargument)(a)},a.mode);var i=new o.default("supsub",{base:n,sup:r,sub:null},r.mode);return{type:"mclass",mclass:"mrel",value:[i]}});var v={"\\Bbb":"\\mathbb","\\bold":"\\mathbf","\\frak":"\\mathfrak","\\bm":"\\boldsymbol"};var p={"\u222b":"\\int","\u222c":"\\iint","\u222d":"\\iiint","\u222e":"\\oint"};h(["\\arcsin","\\arccos","\\arctan","\\arctg","\\arcctg","\\arg","\\ch","\\cos","\\cosec","\\cosh","\\cot","\\cotg","\\coth","\\csc","\\ctg","\\cth","\\deg","\\dim","\\exp","\\hom","\\ker","\\lg","\\ln","\\log","\\sec","\\sin","\\sinh","\\sh","\\tan","\\tanh","\\tg","\\th"],{numArgs:0},function(e){return{type:"op",limits:false,symbol:false,body:e.funcName}});h(["\\det","\\gcd","\\inf","\\lim","\\liminf","\\limsup","\\max","\\min","\\Pr","\\sup"],{numArgs:0},function(e){return{type:"op",limits:true,symbol:false,body:e.funcName}});h(["\\int","\\iint","\\iiint","\\oint","\u222b","\u222c","\u222d","\u222e"],{numArgs:0},function(e){var t=e.funcName;if(t.length===1){t=p[t]}return{type:"op",limits:false,symbol:true,body:t}});h(["\\tiny","\\scriptsize","\\footnotesize","\\small","\\normalsize","\\large","\\Large","\\LARGE","\\huge","\\Huge"],{numArgs:0},null);h(["\\displaystyle","\\textstyle","\\scriptstyle","\\scriptscriptstyle"],{numArgs:0},null);h(["\\rm","\\sf","\\tt","\\bf","\\it"],{numArgs:0},null);h(["\\mathrm","\\mathit","\\mathbf","\\boldsymbol","\\mathbb","\\mathcal","\\mathfrak","\\mathscr","\\mathsf","\\mathtt","\\Bbb","\\bold","\\frak","\\bm"],{numArgs:1,greediness:2},function(e,t){var r=t[0];var a=e.funcName;if(a in v){a=v[a]}return{type:"font",font:a.slice(1),body:r}});h(["\\acute","\\grave","\\ddot","\\tilde","\\bar","\\breve","\\check","\\hat","\\vec","\\dot","\\widehat","\\widetilde","\\overrightarrow","\\overleftarrow","\\Overrightarrow","\\overleftrightarrow","\\overgroup","\\overlinesegment","\\overleftharpoon","\\overrightharpoon"],{numArgs:1},function(e,t){var r=t[0];var a=!n.default.contains(["\\acute","\\grave","\\ddot","\\tilde","\\bar","\\breve","\\check","\\hat","\\vec","\\dot"],e.funcName);var i=!a||n.default.contains(["\\widehat","\\widetilde"],e.funcName);return{type:"accent",label:e.funcName,isStretchy:a,isShifty:i,base:r}});h(["\\'","\\`","\\^","\\~","\\=","\\u","\\.",'\\"',"\\r","\\H","\\v"],{numArgs:1,allowedInText:true,allowedInMath:false},function(e,t){var r=t[0];return{type:"accent",label:e.funcName,isStretchy:false,isShifty:true,base:r}});h(["\\overbrace","\\underbrace"],{numArgs:1},function(e,t){var r=t[0];return{type:"horizBrace",label:e.funcName,isOver:/^\\over/.test(e.funcName),base:r}});h(["\\underleftarrow","\\underrightarrow","\\underleftrightarrow","\\undergroup","\\underlinesegment","\\utilde"],{numArgs:1},function(e,t){var r=t[0];return{type:"accentUnder",label:e.funcName,base:r}});h(["\\xleftarrow","\\xrightarrow","\\xLeftarrow","\\xRightarrow","\\xleftrightarrow","\\xLeftrightarrow","\\xhookleftarrow","\\xhookrightarrow","\\xmapsto","\\xrightharpoondown","\\xrightharpoonup","\\xleftharpoondown","\\xleftharpoonup","\\xrightleftharpoons","\\xleftrightharpoons","\\xlongequal","\\xtwoheadrightarrow","\\xtwoheadleftarrow","\\xtofrom"],{numArgs:1,numOptionalArgs:1},function(e,t,r){var a=r[0];var n=t[0];return{type:"xArrow",label:e.funcName,body:n,below:a}});h(["\\cancel","\\bcancel","\\xcancel","\\sout","\\fbox"],{numArgs:1},function(e,t){var r=t[0];return{type:"enclose",label:e.funcName,body:r}});h(["\\over","\\choose","\\atop"],{numArgs:0,infix:true},function(e){var t=void 0;switch(e.funcName){case"\\over":t="\\frac";break;case"\\choose":t="\\binom";break;case"\\atop":t="\\\\atopfrac";break;default:throw new Error("Unrecognized infix genfrac command")}return{type:"infix",replaceWith:t,token:e.token}});h(["\\\\","\\cr"],{numArgs:0,numOptionalArgs:1,argTypes:["size"]},function(e,t,r){var a=r[0];return{type:"cr",size:a}});h(["\\begin","\\end"],{numArgs:1,argTypes:["text"]},function(e,t){var r=t[0];if(r.type!=="ordgroup"){throw new l.default("Invalid environment name",r)}var a="";for(var n=0;n<r.value.length;++n){a+=r.value[n].value}return{type:"environment",name:a,nameGroup:r}});h(["\\raisebox"],{numArgs:2,argTypes:["size","text"],allowedInText:true},function(e,t){var r=t[0];var a=t[1];return{type:"raisebox",dy:r,body:a,value:(0,s.ordargument)(a)}});h(["\\verb"],{numArgs:0,allowedInText:true},function(e){throw new l.default("\\verb ended by end of line instead of matching delimiter")})},{"./ParseError":84,"./ParseNode":85,"./defineFunction":96,"./functions/color":104,"./functions/delimsizing":105,"./functions/genfrac":106,"./functions/href":107,"./functions/kern":108,"./functions/lap":109,"./functions/mathchoice":110,"./functions/mod":111,"./functions/op":112,"./functions/operatorname":113,"./functions/overline":114,"./functions/phantom":115,"./functions/rule":116,"./functions/smash":117,"./functions/text":118,"./functions/underline":119,"./utils":128}],104:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=v(a);var i=e("../buildCommon");var l=v(i);var u=e("../mathMLTree");var o=v(u);var s=e("../buildHTML");var f=h(s);var d=e("../buildMathML");var c=h(d);function h(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function v(e){return e&&e.__esModule?e:{default:e}}var p=function e(t,r){var a=f.buildExpression(t.value.value,r.withColor(t.value.color),false);return new l.default.makeFragment(a)};var m=function e(t,r){var a=c.buildExpression(t.value.value,r);var n=new o.default.MathNode("mstyle",a);n.setAttribute("mathcolor",t.value.color);return n};(0,n.default)({type:"color",names:["\\textcolor"],props:{numArgs:2,allowedInText:true,greediness:3,argTypes:["color","original"]},handler:function e(t,r){var n=r[0];var i=r[1];return{type:"color",color:n.value,value:(0,a.ordargument)(i)}},htmlBuilder:p,mathmlBuilder:m});(0,n.default)({type:"color",names:["\\blue","\\orange","\\pink","\\red","\\green","\\gray","\\purple","\\blueA","\\blueB","\\blueC","\\blueD","\\blueE","\\tealA","\\tealB","\\tealC","\\tealD","\\tealE","\\greenA","\\greenB","\\greenC","\\greenD","\\greenE","\\goldA","\\goldB","\\goldC","\\goldD","\\goldE","\\redA","\\redB","\\redC","\\redD","\\redE","\\maroonA","\\maroonB","\\maroonC","\\maroonD","\\maroonE","\\purpleA","\\purpleB","\\purpleC","\\purpleD","\\purpleE","\\mintA","\\mintB","\\mintC","\\grayA","\\grayB","\\grayC","\\grayD","\\grayE","\\grayF","\\grayG","\\grayH","\\grayI","\\kaBlue","\\kaGreen"],props:{numArgs:1,allowedInText:true,greediness:3},handler:function e(t,r){var n=r[0];return{type:"color",color:"katex-"+t.funcName.slice(1),value:(0,a.ordargument)(n)}},htmlBuilder:p,mathmlBuilder:m})},{"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../mathMLTree":121}],105:[function(e,t,r){"use strict";var a=e("../buildCommon");var n=x(a);var i=e("../defineFunction");var l=x(i);var u=e("../delimiter");var o=x(u);var s=e("../mathMLTree");var f=x(s);var d=e("../ParseError");var c=x(d);var h=e("../utils");var v=x(h);var p=e("../buildHTML");var m=y(p);var g=e("../buildMathML");var b=y(g);function y(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function x(e){return e&&e.__esModule?e:{default:e}}var w={"\\bigl":{mclass:"mopen",size:1},"\\Bigl":{mclass:"mopen",size:2},"\\biggl":{mclass:"mopen",size:3},"\\Biggl":{mclass:"mopen",size:4},"\\bigr":{mclass:"mclose",size:1},"\\Bigr":{mclass:"mclose",size:2},"\\biggr":{mclass:"mclose",size:3},"\\Biggr":{mclass:"mclose",size:4},"\\bigm":{mclass:"mrel",size:1},"\\Bigm":{mclass:"mrel",size:2},"\\biggm":{mclass:"mrel",size:3},"\\Biggm":{mclass:"mrel",size:4},"\\big":{mclass:"mord",size:1},"\\Big":{mclass:"mord",size:2},"\\bigg":{mclass:"mord",size:3},"\\Bigg":{mclass:"mord",size:4}};var k=["(",")","[","\\lbrack","]","\\rbrack","\\{","\\lbrace","\\}","\\rbrace","\\lfloor","\\rfloor","\\lceil","\\rceil","<",">","\\langle","\\rangle","\\lt","\\gt","\\lvert","\\rvert","\\lVert","\\rVert","\\lgroup","\\rgroup","\\lmoustache","\\rmoustache","/","\\backslash","|","\\vert","\\|","\\Vert","\\uparrow","\\Uparrow","\\downarrow","\\Downarrow","\\updownarrow","\\Updownarrow","."];
function M(e,t){if(v.default.contains(k,e.value)){return e}else{throw new c.default("Invalid delimiter: '"+e.value+"' after '"+t.funcName+"'",e)}}(0,l.default)({type:"delimsizing",names:["\\bigl","\\Bigl","\\biggl","\\Biggl","\\bigr","\\Bigr","\\biggr","\\Biggr","\\bigm","\\Bigm","\\biggm","\\Biggm","\\big","\\Big","\\bigg","\\Bigg"],props:{numArgs:1},handler:function e(t,r){var a=M(r[0],t);return{type:"delimsizing",size:w[t.funcName].size,mclass:w[t.funcName].mclass,value:a.value}},htmlBuilder:function e(t,r){var a=t.value.value;if(a==="."){return n.default.makeSpan([t.value.mclass])}return o.default.sizedDelim(a,t.value.size,r,t.mode,[t.value.mclass])},mathmlBuilder:function e(t){var r=[];if(t.value.value!=="."){r.push(b.makeText(t.value.value,t.mode))}var a=new f.default.MathNode("mo",r);if(t.value.mclass==="mopen"||t.value.mclass==="mclose"){a.setAttribute("fence","true")}else{a.setAttribute("fence","false")}return a}});(0,l.default)({type:"leftright",names:["\\left","\\right"],props:{numArgs:1},handler:function e(t,r){var a=M(r[0],t);return{type:"leftright",value:a.value}},htmlBuilder:function e(t,r){var a=m.buildExpression(t.value.body,r,true);var i=0;var l=0;var u=false;for(var s=0;s<a.length;s++){if(a[s].isMiddle){u=true}else{i=Math.max(a[s].height,i);l=Math.max(a[s].depth,l)}}i*=r.sizeMultiplier;l*=r.sizeMultiplier;var f=void 0;if(t.value.left==="."){f=m.makeNullDelimiter(r,["mopen"])}else{f=o.default.leftRightDelim(t.value.left,i,l,r,t.mode,["mopen"])}a.unshift(f);if(u){for(var d=1;d<a.length;d++){var c=a[d];if(c.isMiddle){a[d]=o.default.leftRightDelim(c.isMiddle.value,i,l,c.isMiddle.options,t.mode,[]);var h=m.spliceSpaces(c.children,0);if(h){n.default.prependChildren(a[d],h)}}}}var v=void 0;if(t.value.right==="."){v=m.makeNullDelimiter(r,["mclose"])}else{v=o.default.leftRightDelim(t.value.right,i,l,r,t.mode,["mclose"])}a.push(v);return n.default.makeSpan(["minner"],a,r)},mathmlBuilder:function e(t,r){var a=b.buildExpression(t.value.body,r);if(t.value.left!=="."){var n=new f.default.MathNode("mo",[b.makeText(t.value.left,t.mode)]);n.setAttribute("fence","true");a.unshift(n)}if(t.value.right!=="."){var i=new f.default.MathNode("mo",[b.makeText(t.value.right,t.mode)]);i.setAttribute("fence","true");a.push(i)}var l=new f.default.MathNode("mrow",a);return l}});(0,l.default)({type:"middle",names:["\\middle"],props:{numArgs:1},handler:function e(t,r){var a=M(r[0],t);if(!t.parser.leftrightDepth){throw new c.default("\\middle without preceding \\left",a)}return{type:"middle",value:a.value}},htmlBuilder:function e(t,r){var a=void 0;if(t.value.value==="."){a=m.makeNullDelimiter(r,[])}else{a=o.default.sizedDelim(t.value.value,1,r,t.mode,[]);a.isMiddle={value:t.value.value,options:r}}return a},mathmlBuilder:function e(t,r){var a=new f.default.MathNode("mo",[b.makeText(t.value.middle,t.mode)]);a.setAttribute("fence","true");return a}})},{"../ParseError":84,"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../delimiter":97,"../mathMLTree":121,"../utils":128}],106:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=b(a);var i=e("../buildCommon");var l=b(i);var u=e("../delimiter");var o=b(u);var s=e("../mathMLTree");var f=b(s);var d=e("../Style");var c=b(d);var h=e("../buildHTML");var v=g(h);var p=e("../buildMathML");var m=g(p);function g(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function b(e){return e&&e.__esModule?e:{default:e}}(0,n.default)({type:"genfrac",names:["\\dfrac","\\frac","\\tfrac","\\dbinom","\\binom","\\tbinom","\\\\atopfrac"],props:{numArgs:2,greediness:2},handler:function e(t,r){var a=r[0];var n=r[1];var i=void 0;var l=null;var u=null;var o="auto";switch(t.funcName){case"\\dfrac":case"\\frac":case"\\tfrac":i=true;break;case"\\\\atopfrac":i=false;break;case"\\dbinom":case"\\binom":case"\\tbinom":i=false;l="(";u=")";break;default:throw new Error("Unrecognized genfrac command")}switch(t.funcName){case"\\dfrac":case"\\dbinom":o="display";break;case"\\tfrac":case"\\tbinom":o="text";break}return{type:"genfrac",numer:a,denom:n,hasBarLine:i,leftDelim:l,rightDelim:u,size:o}},htmlBuilder:function e(t,r){var a=r.style;if(t.value.size==="display"){a=c.default.DISPLAY}else if(t.value.size==="text"){a=c.default.TEXT}var n=a.fracNum();var i=a.fracDen();var u=void 0;u=r.havingStyle(n);var s=v.buildGroup(t.value.numer,u,r);u=r.havingStyle(i);var f=v.buildGroup(t.value.denom,u,r);var d=void 0;var h=void 0;var p=void 0;if(t.value.hasBarLine){d=l.default.makeLineSpan("frac-line",r);h=d.height;p=d.height}else{d=null;h=0;p=r.fontMetrics().defaultRuleThickness}var m=void 0;var g=void 0;var b=void 0;if(a.size===c.default.DISPLAY.size){m=r.fontMetrics().num1;if(h>0){g=3*p}else{g=7*p}b=r.fontMetrics().denom1}else{if(h>0){m=r.fontMetrics().num2;g=p}else{m=r.fontMetrics().num3;g=3*p}b=r.fontMetrics().denom2}var y=void 0;if(h===0){var x=m-s.depth-(f.height-b);if(x<g){m+=.5*(g-x);b+=.5*(g-x)}y=l.default.makeVList({positionType:"individualShift",children:[{type:"elem",elem:f,shift:b},{type:"elem",elem:s,shift:-m}]},r)}else{var w=r.fontMetrics().axisHeight;if(m-s.depth-(w+.5*h)<g){m+=g-(m-s.depth-(w+.5*h))}if(w-.5*h-(f.height-b)<g){b+=g-(w-.5*h-(f.height-b))}var k=-(w-.5*h);y=l.default.makeVList({positionType:"individualShift",children:[{type:"elem",elem:f,shift:b},{type:"elem",elem:d,shift:k},{type:"elem",elem:s,shift:-m}]},r)}u=r.havingStyle(a);y.height*=u.sizeMultiplier/r.sizeMultiplier;y.depth*=u.sizeMultiplier/r.sizeMultiplier;var M=void 0;if(a.size===c.default.DISPLAY.size){M=r.fontMetrics().delim1}else{M=r.fontMetrics().delim2}var _=void 0;var S=void 0;if(t.value.leftDelim==null){_=v.makeNullDelimiter(r,["mopen"])}else{_=o.default.customSizedDelim(t.value.leftDelim,M,true,r.havingStyle(a),t.mode,["mopen"])}if(t.value.rightDelim==null){S=v.makeNullDelimiter(r,["mclose"])}else{S=o.default.customSizedDelim(t.value.rightDelim,M,true,r.havingStyle(a),t.mode,["mclose"])}return l.default.makeSpan(["mord"].concat(u.sizingClasses(r)),[_,l.default.makeSpan(["mfrac"],[y]),S],r)},mathmlBuilder:function e(t,r){var a=new f.default.MathNode("mfrac",[m.buildGroup(t.value.numer,r),m.buildGroup(t.value.denom,r)]);if(!t.value.hasBarLine){a.setAttribute("linethickness","0px")}if(t.value.leftDelim!=null||t.value.rightDelim!=null){var n=[];if(t.value.leftDelim!=null){var i=new f.default.MathNode("mo",[new f.default.TextNode(t.value.leftDelim)]);i.setAttribute("fence","true");n.push(i)}n.push(a);if(t.value.rightDelim!=null){var l=new f.default.MathNode("mo",[new f.default.TextNode(t.value.rightDelim)]);l.setAttribute("fence","true");n.push(l)}var u=new f.default.MathNode("mrow",n);return u}return a}})},{"../Style":89,"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../delimiter":97,"../mathMLTree":121}],107:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=v(a);var i=e("../buildCommon");var l=v(i);var u=e("../mathMLTree");var o=v(u);var s=e("../buildHTML");var f=h(s);var d=e("../buildMathML");var c=h(d);function h(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function v(e){return e&&e.__esModule?e:{default:e}}(0,n.default)({type:"href",names:["\\href"],props:{numArgs:2,argTypes:["url","original"]},handler:function e(t,r){var n=r[1];var i=r[0].value;return{type:"href",href:i,body:(0,a.ordargument)(n)}},htmlBuilder:function e(t,r){var a=f.buildExpression(t.value.body,r,false);var n=t.value.href;var i=[];var u=void 0;var o=void 0;if(a.length===1){i=a[0].classes}else if(a.length>=2){u=f.getTypeOfDomTree(a[0])||"mord";o=f.getTypeOfDomTree(a[a.length-1])||"mord";if(u===o){i=[u]}else{var s=l.default.makeAnchor(n,[],a,r);return new l.default.makeFragment([new l.default.makeSpan([u],[],r),s,new l.default.makeSpan([o],[],r)])}}return new l.default.makeAnchor(n,i,a,r)},mathmlBuilder:function e(t,r){var a=c.buildExpression(t.value.body,r);var n=new o.default.MathNode("mrow",a);n.setAttribute("href",t.value.href);return n}})},{"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../mathMLTree":121}],108:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=c(a);var i=e("../buildCommon");var l=c(i);var u=e("../mathMLTree");var o=c(u);var s=e("../units");var f=e("../ParseError");var d=c(f);function c(e){return e&&e.__esModule?e:{default:e}}(0,n.default)({type:"kern",names:["\\kern","\\mkern","\\hskip","\\mskip"],props:{numArgs:1,argTypes:["size"],allowedInText:true},handler:function e(t,r){var a=t.funcName[1]==="m";var n=r[0].value.unit==="mu";if(a){if(!n){typeof console!=="undefined"&&console.warn("In LaTeX, "+t.funcName+" supports only mu units, "+("not "+r[0].value.unit+" units"))}if(t.parser.mode!=="math"){throw new d.default("Can't use function '"+t.funcName+"' in text mode")}}else{if(n){typeof console!=="undefined"&&console.warn("In LaTeX, "+t.funcName+" does not support mu units")}}return{type:"kern",dimension:r[0].value}},htmlBuilder:function e(t,r){var a=l.default.makeSpan(["mord","rule"],[],r);if(t.value.dimension){var n=(0,s.calculateSize)(t.value.dimension,r);a.style.marginLeft=n+"em"}return a},mathmlBuilder:function e(t,r){var a=new o.default.MathNode("mspace");if(t.value.dimension){var n=(0,s.calculateSize)(t.value.dimension,r);a.setAttribute("width",n+"em")}return a}})},{"../ParseError":84,"../buildCommon":91,"../defineFunction":96,"../mathMLTree":121,"../units":127}],109:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=v(a);var i=e("../buildCommon");var l=v(i);var u=e("../mathMLTree");var o=v(u);var s=e("../buildHTML");var f=h(s);var d=e("../buildMathML");var c=h(d);function h(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function v(e){return e&&e.__esModule?e:{default:e}}(0,n.default)({type:"lap",names:["\\mathllap","\\mathrlap","\\mathclap"],props:{numArgs:1,allowedInText:true},handler:function e(t,r){var a=r[0];return{type:"lap",alignment:t.funcName.slice(5),body:a}},htmlBuilder:function e(t,r){var a=void 0;if(t.value.alignment==="clap"){a=l.default.makeSpan([],[f.buildGroup(t.value.body,r)]);a=l.default.makeSpan(["inner"],[a],r)}else{a=l.default.makeSpan(["inner"],[f.buildGroup(t.value.body,r)])}var n=l.default.makeSpan(["fix"],[]);return l.default.makeSpan(["mord",t.value.alignment],[a,n],r)},mathmlBuilder:function e(t,r){var a=new o.default.MathNode("mpadded",[c.buildGroup(t.value.body,r)]);if(t.value.alignment!=="rlap"){var n=t.value.alignment==="llap"?"-1":"-0.5";a.setAttribute("lspace",n+"width")}a.setAttribute("width","0px");return a}})},{"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../mathMLTree":121}],110:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=m(a);var i=e("../buildCommon");var l=m(i);var u=e("../mathMLTree");var o=m(u);var s=e("../Style");var f=m(s);var d=e("../buildHTML");var c=p(d);var h=e("../buildMathML");var v=p(h);function p(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function m(e){return e&&e.__esModule?e:{default:e}}var g=function e(t,r){var a=r.style;if(a.size===f.default.DISPLAY.size){return t.value.display}else if(a.size===f.default.TEXT.size){return t.value.text}else if(a.size===f.default.SCRIPT.size){return t.value.script}else if(a.size===f.default.SCRIPTSCRIPT.size){return t.value.scriptscript}return t.value.text};(0,n.default)({type:"mathchoice",names:["\\mathchoice"],props:{numArgs:4},handler:function e(t,r){return{type:"mathchoice",display:(0,a.ordargument)(r[0]),text:(0,a.ordargument)(r[1]),script:(0,a.ordargument)(r[2]),scriptscript:(0,a.ordargument)(r[3])}},htmlBuilder:function e(t,r){var a=g(t,r);var n=c.buildExpression(a,r,false);return new l.default.makeFragment(n)},mathmlBuilder:function e(t,r){var a=g(t,r);var n=v.buildExpression(a,r,false);return new o.default.MathNode("mrow",n)}})},{"../Style":89,"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../mathMLTree":121}],111:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=m(a);var i=e("../buildCommon");var l=m(i);var u=e("../mathMLTree");var o=m(u);var s=e("../Style");var f=m(s);var d=e("../buildHTML");var c=p(d);var h=e("../buildMathML");var v=p(h);function p(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function m(e){return e&&e.__esModule?e:{default:e}}var g=function e(t,r){var a=[];if(t.value.modType==="bmod"){if(!r.style.isTight()){a.push(l.default.makeSpan(["mspace","muspace"],[],r))}else{a.push(l.default.makeSpan(["mspace","thickspace"],[],r))}}else if(r.style.size===f.default.DISPLAY.size){a.push(l.default.makeSpan(["mspace","quad"],[],r))}else if(t.value.modType==="mod"){a.push(l.default.makeSpan(["mspace","twelvemuspace"],[],r))}else{a.push(l.default.makeSpan(["mspace","eightmuspace"],[],r))}if(t.value.modType==="pod"||t.value.modType==="pmod"){a.push(l.default.mathsym("(",t.mode))}if(t.value.modType!=="pod"){var n=[l.default.mathsym("m",t.mode),l.default.mathsym("o",t.mode),l.default.mathsym("d",t.mode)];if(t.value.modType==="bmod"){a.push(l.default.makeSpan(["mbin"],n,r));if(!r.style.isTight()){a.push(l.default.makeSpan(["mspace","muspace"],[],r))}else{a.push(l.default.makeSpan(["mspace","thickspace"],[],r))}}else{Array.prototype.push.apply(a,n);a.push(l.default.makeSpan(["mspace","sixmuspace"],[],r))}}if(t.value.value){Array.prototype.push.apply(a,c.buildExpression(t.value.value,r,false))}if(t.value.modType==="pod"||t.value.modType==="pmod"){a.push(l.default.mathsym(")",t.mode))}return l.default.makeFragment(a)};var b=function e(t,r){var a=[];if(t.value.modType==="pod"||t.value.modType==="pmod"){a.push(new o.default.MathNode("mo",[v.makeText("(",t.mode)]))}if(t.value.modType!=="pod"){a.push(new o.default.MathNode("mo",[v.makeText("mod",t.mode)]))}if(t.value.value){var n=new o.default.MathNode("mspace");n.setAttribute("width","0.333333em");a.push(n);a=a.concat(v.buildExpression(t.value.value,r))}if(t.value.modType==="pod"||t.value.modType==="pmod"){a.push(new o.default.MathNode("mo",[v.makeText(")",t.mode)]))}return new o.default.MathNode("mo",a)};(0,n.default)({type:"mod",names:["\\bmod"],props:{numArgs:0},handler:function e(t,r){return{type:"mod",modType:"bmod",value:null}},htmlBuilder:g,mathmlBuilder:b});(0,n.default)({type:"mod",names:["\\pod","\\pmod","\\mod"],props:{numArgs:1},handler:function e(t,r){var n=r[0];return{type:"mod",modType:t.funcName.substr(1),value:(0,a.ordargument)(n)}},htmlBuilder:g,mathmlBuilder:b})},{"../Style":89,"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../mathMLTree":121}],112:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=x(a);var i=e("../buildCommon");var l=x(i);var u=e("../domTree");var o=x(u);var s=e("../mathMLTree");var f=x(s);var d=e("../utils");var c=x(d);var h=e("../Style");var v=x(h);var p=e("../buildHTML");var m=y(p);var g=e("../buildMathML");var b=y(g);function y(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function x(e){return e&&e.__esModule?e:{default:e}}var w=function e(t,r){var a=void 0;var n=void 0;var i=false;if(t.type==="supsub"){a=t.value.sup;n=t.value.sub;t=t.value.base;i=true}var u=r.style;var s=["\\smallint"];var f=false;if(u.size===v.default.DISPLAY.size&&t.value.symbol&&!c.default.contains(s,t.value.body)){f=true}var d=void 0;if(t.value.symbol){var h=f?"Size2-Regular":"Size1-Regular";d=l.default.makeSymbol(t.value.body,h,"math",r,["mop","op-symbol",f?"large-op":"small-op"])}else if(t.value.value){var p=m.buildExpression(t.value.value,r,true);if(p.length===1&&p[0]instanceof o.default.symbolNode){d=p[0];d.classes[0]="mop"}else{d=l.default.makeSpan(["mop"],p,r)}}else{var g=[];for(var b=1;b<t.value.body.length;b++){g.push(l.default.mathsym(t.value.body[b],t.mode))}d=l.default.makeSpan(["mop"],g,r)}var y=0;var x=0;if(d instanceof o.default.symbolNode){y=(d.height-d.depth)/2-r.fontMetrics().axisHeight;x=d.italic}if(i){d=l.default.makeSpan([],[d]);var w=void 0;var k=void 0;if(a){var M=m.buildGroup(a,r.havingStyle(u.sup()),r);k={elem:M,kern:Math.max(r.fontMetrics().bigOpSpacing1,r.fontMetrics().bigOpSpacing3-M.depth)}}if(n){var _=m.buildGroup(n,r.havingStyle(u.sub()),r);w={elem:_,kern:Math.max(r.fontMetrics().bigOpSpacing2,r.fontMetrics().bigOpSpacing4-_.height)}}var S=void 0;if(k&&w){var z=r.fontMetrics().bigOpSpacing5+w.elem.height+w.elem.depth+w.kern+d.depth+y;S=l.default.makeVList({positionType:"bottom",positionData:z,children:[{type:"kern",size:r.fontMetrics().bigOpSpacing5},{type:"elem",elem:w.elem,marginLeft:-x+"em"},{type:"kern",size:w.kern},{type:"elem",elem:d},{type:"kern",size:k.kern},{type:"elem",elem:k.elem,marginLeft:x+"em"},{type:"kern",size:r.fontMetrics().bigOpSpacing5}]},r)}else if(w){var T=d.height-y;S=l.default.makeVList({positionType:"top",positionData:T,children:[{type:"kern",size:r.fontMetrics().bigOpSpacing5},{type:"elem",elem:w.elem,marginLeft:-x+"em"},{type:"kern",size:w.kern},{type:"elem",elem:d}]},r)}else if(k){var C=d.depth+y;S=l.default.makeVList({positionType:"bottom",positionData:C,children:[{type:"elem",elem:d},{type:"kern",size:k.kern},{type:"elem",elem:k.elem,marginLeft:x+"em"},{type:"kern",size:r.fontMetrics().bigOpSpacing5}]},r)}else{return d}return l.default.makeSpan(["mop","op-limits"],[S],r)}else{if(y){d.style.position="relative";d.style.top=y+"em"}return d}};var k=function e(t,r){var a=void 0;if(t.value.symbol){a=new f.default.MathNode("mo",[b.makeText(t.value.body,t.mode)])}else if(t.value.value){a=new f.default.MathNode("mo",b.buildExpression(t.value.value,r))}else{a=new f.default.MathNode("mi",[new f.default.TextNode(t.value.body.slice(1))]);var n=new f.default.MathNode("mo",[b.makeText("\u2061","text")]);return new o.default.documentFragment([a,n])}return a};var M={"\u220f":"\\prod","\u2210":"\\coprod","\u2211":"\\sum","\u22c0":"\\bigwedge","\u22c1":"\\bigvee","\u22c2":"\\bigcap","\u22c3":"\\bigcap","\u2a00":"\\bigodot","\u2a01":"\\bigoplus","\u2a02":"\\bigotimes","\u2a04":"\\biguplus","\u2a06":"\\bigsqcup"};(0,n.default)({type:"op",names:["\\coprod","\\bigvee","\\bigwedge","\\biguplus","\\bigcap","\\bigcup","\\intop","\\prod","\\sum","\\bigotimes","\\bigoplus","\\bigodot","\\bigsqcup","\\smallint","\u220f","\u2210","\u2211","\u22c0","\u22c1","\u22c2","\u22c3","\u2a00","\u2a01","\u2a02","\u2a04","\u2a06"],props:{numArgs:0},handler:function e(t,r){var a=t.funcName;if(a.length===1){a=M[a]}return{type:"op",limits:true,symbol:true,body:a}},htmlBuilder:w,mathmlBuilder:k});(0,n.default)({type:"op",names:["\\mathop"],props:{numArgs:1},handler:function e(t,r){var n=r[0];return{type:"op",limits:false,symbol:false,value:(0,a.ordargument)(n)}},htmlBuilder:w,mathmlBuilder:k})},{"../Style":89,"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../domTree":98,"../mathMLTree":121,"../utils":128}],113:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=m(a);var i=e("../buildCommon");var l=m(i);var u=e("../mathMLTree");var o=m(u);var s=e("../domTree");var f=m(s);var d=e("../buildHTML");var c=p(d);var h=e("../buildMathML");var v=p(h);function p(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function m(e){return e&&e.__esModule?e:{default:e}}(0,n.default)({type:"operatorname",names:["\\operatorname"],props:{numArgs:1},handler:function e(t,r){var n=r[0];return{type:"operatorname",value:(0,a.ordargument)(n)}},htmlBuilder:function e(t,r){var a=[];if(t.value.value.length>0){var n="";var i="";var u=c.buildExpression(t.value.value,r,true);for(var o=0;o<u.length;o++){n=u[o].value;n=n.replace(/\u2212/,"-");n=n.replace(/\u2217/,"*");i=/[\u0391-\u03D7]/.test(n)?"math":"text";a.push(l.default.mathsym(n,i))}}return l.default.makeSpan(["mop"],a,r)},mathmlBuilder:function e(t,r){var a=[];if(t.value.value.length>0){var n=v.buildExpression(t.value.value,r);var i="";for(var l=0;l<n.length;l++){i+=n[l].children[0].text}i=i.replace(/\u2212/g,"-");i=i.replace(/\u2217/g,"*");a=[new o.default.TextNode(i)]}var u=new o.default.MathNode("mi",a);u.setAttribute("mathvariant","normal");var s=new o.default.MathNode("mo",[v.makeText("\u2061","text")]);return new f.default.documentFragment([u,s])}})},{"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../domTree":98,"../mathMLTree":121}],114:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=v(a);var i=e("../buildCommon");var l=v(i);var u=e("../mathMLTree");var o=v(u);var s=e("../buildHTML");var f=h(s);var d=e("../buildMathML");var c=h(d);function h(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function v(e){return e&&e.__esModule?e:{default:e}}(0,n.default)({type:"overline",names:["\\overline"],props:{numArgs:1},handler:function e(t,r){var a=r[0];return{type:"overline",body:a}},htmlBuilder:function e(t,r){var a=f.buildGroup(t.value.body,r.havingCrampedStyle());var n=l.default.makeLineSpan("overline-line",r);var i=l.default.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:a},{type:"kern",size:3*n.height},{type:"elem",elem:n},{type:"kern",size:n.height}]},r);return l.default.makeSpan(["mord","overline"],[i],r)},mathmlBuilder:function e(t,r){var a=new o.default.MathNode("mo",[new o.default.TextNode("\u203e")]);a.setAttribute("stretchy","true");var n=new o.default.MathNode("mover",[c.buildGroup(t.value.body,r),a]);n.setAttribute("accent","true");return n}})},{"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../mathMLTree":121}],115:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=v(a);var i=e("../buildCommon");var l=v(i);var u=e("../mathMLTree");var o=v(u);var s=e("../buildHTML");var f=h(s);var d=e("../buildMathML");var c=h(d);function h(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function v(e){return e&&e.__esModule?e:{default:e}}(0,n.default)({type:"phantom",names:["\\phantom"],props:{numArgs:1},handler:function e(t,r){var n=r[0];return{type:"phantom",value:(0,a.ordargument)(n)}},htmlBuilder:function e(t,r){var a=f.buildExpression(t.value.value,r.withPhantom(),false);return new l.default.makeFragment(a)},mathmlBuilder:function e(t,r){var a=c.buildExpression(t.value.value,r);return new o.default.MathNode("mphantom",a)}});(0,n.default)({type:"hphantom",names:["\\hphantom"],props:{numArgs:1},handler:function e(t,r){var n=r[0];return{type:"hphantom",value:(0,a.ordargument)(n),body:n}},htmlBuilder:function e(t,r){var a=l.default.makeSpan([],[f.buildGroup(t.value.body,r.withPhantom())]);a.height=0;a.depth=0;if(a.children){for(var n=0;n<a.children.length;n++){a.children[n].height=0;a.children[n].depth=0}}a=l.default.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:a}]},r);return a},mathmlBuilder:function e(t,r){var a=c.buildExpression(t.value.value,r);var n=new o.default.MathNode("mphantom",a);n.setAttribute("height","0px");return n}});(0,n.default)({type:"vphantom",names:["\\vphantom"],props:{numArgs:1},handler:function e(t,r){var n=r[0];return{type:"vphantom",value:(0,a.ordargument)(n),body:n}},htmlBuilder:function e(t,r){var a=l.default.makeSpan(["inner"],[f.buildGroup(t.value.body,r.withPhantom())]);var n=l.default.makeSpan(["fix"],[]);return l.default.makeSpan(["mord","rlap"],[a,n],r)},mathmlBuilder:function e(t,r){var a=c.buildExpression(t.value.value,r);var n=new o.default.MathNode("mphantom",a);n.setAttribute("width","0px");return n}})},{"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../mathMLTree":121}],116:[function(e,t,r){"use strict";var a=e("../buildCommon");var n=f(a);var i=e("../defineFunction");var l=f(i);var u=e("../mathMLTree");var o=f(u);var s=e("../units");function f(e){return e&&e.__esModule?e:{default:e}}(0,l.default)({type:"rule",names:["\\rule"],props:{numArgs:2,numOptionalArgs:1,argTypes:["size","size","size"]},handler:function e(t,r,a){var n=a[0];var i=r[0];var l=r[1];return{type:"rule",shift:n&&n.value,width:i.value,height:l.value}},htmlBuilder:function e(t,r){var a=n.default.makeSpan(["mord","rule"],[],r);var i=0;if(t.value.shift){i=(0,s.calculateSize)(t.value.shift,r)}var l=(0,s.calculateSize)(t.value.width,r);var u=(0,s.calculateSize)(t.value.height,r);a.style.borderRightWidth=l+"em";a.style.borderTopWidth=u+"em";a.style.bottom=i+"em";a.width=l;a.height=u+i;a.depth=-i;a.maxFontSize=u*1.125*r.sizeMultiplier;return a},mathmlBuilder:function e(t,r){var a=new o.default.MathNode("mrow");return a}})},{"../buildCommon":91,"../defineFunction":96,"../mathMLTree":121,"../units":127}],117:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=v(a);var i=e("../buildCommon");var l=v(i);var u=e("../mathMLTree");var o=v(u);var s=e("../buildHTML");var f=h(s);var d=e("../buildMathML");var c=h(d);function h(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function v(e){return e&&e.__esModule?e:{default:e}}(0,n.default)({type:"smash",names:["\\smash"],props:{numArgs:1,numOptionalArgs:1,allowedInText:true},handler:function e(t,r,a){var n=false;var i=false;var l=a[0];if(l){var u="";for(var o=0;o<l.value.length;++o){u=l.value[o].value;if(u==="t"){n=true}else if(u==="b"){i=true}else{n=false;i=false;break}}}else{n=true;i=true}var s=r[0];return{type:"smash",body:s,smashHeight:n,smashDepth:i}},htmlBuilder:function e(t,r){var a=l.default.makeSpan(["mord"],[f.buildGroup(t.value.body,r)]);if(!t.value.smashHeight&&!t.value.smashDepth){return a}if(t.value.smashHeight){a.height=0;if(a.children){for(var n=0;n<a.children.length;n++){a.children[n].height=0}}}if(t.value.smashDepth){a.depth=0;if(a.children){for(var i=0;i<a.children.length;i++){a.children[i].depth=0}}}return l.default.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:a}]},r)},mathmlBuilder:function e(t,r){var a=new o.default.MathNode("mpadded",[c.buildGroup(t.value.body,r)]);if(t.value.smashHeight){a.setAttribute("height","0px")}if(t.value.smashDepth){a.setAttribute("depth","0px")}return a}})},{"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../mathMLTree":121}],118:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=v(a);var i=e("../buildCommon");var l=v(i);var u=e("../mathMLTree");var o=v(u);var s=e("../buildHTML");var f=h(s);var d=e("../buildMathML");var c=h(d);function h(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function v(e){return e&&e.__esModule?e:{default:e}}var p={"\\text":undefined,"\\textrm":"textrm","\\textsf":"textsf","\\texttt":"texttt","\\textnormal":"textrm"};var m={"\\textbf":"textbf"};var g={"\\textit":"textit"};(0,n.default)({type:"text",names:["\\text","\\textrm","\\textsf","\\texttt","\\textnormal","\\textbf","\\textit"],props:{numArgs:1,argTypes:["text"],greediness:2,allowedInText:true},handler:function e(t,r){var n=r[0];return{type:"text",body:(0,a.ordargument)(n),font:t.funcName}},htmlBuilder:function e(t,r){var a=t.value.font;var n=void 0;if(p[a]){n=r.withFontFamily(p[a])}else if(m[a]){n=r.withFontWeight(m[a])}else{n=r.withFontShape(g[a])}var i=f.buildExpression(t.value.body,n,true);l.default.tryCombineChars(i);return l.default.makeSpan(["mord","text"],i,n)},mathmlBuilder:function e(t,r){var a=t.value.body;var n=[];var i=null;for(var l=0;l<a.length;l++){var u=c.buildGroup(a[l],r);if(u.type==="mtext"&&i!=null){Array.prototype.push.apply(i.children,u.children)}else{n.push(u);if(u.type==="mtext"){i=u}}}if(n.length===1){return n[0]}else{return new o.default.MathNode("mrow",n)}}})},{"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../mathMLTree":121}],119:[function(e,t,r){"use strict";var a=e("../defineFunction");var n=v(a);var i=e("../buildCommon");var l=v(i);var u=e("../mathMLTree");var o=v(u);var s=e("../buildHTML");var f=h(s);var d=e("../buildMathML");var c=h(d);function h(e){if(e&&e.__esModule){return e}else{var t={};if(e!=null){for(var r in e){if(Object.prototype.hasOwnProperty.call(e,r))t[r]=e[r]}}t.default=e;return t}}function v(e){return e&&e.__esModule?e:{default:e}}(0,n.default)({type:"underline",names:["\\underline"],props:{numArgs:1},handler:function e(t,r){var a=r[0];return{type:"underline",body:a}},htmlBuilder:function e(t,r){var a=f.buildGroup(t.value.body,r);var n=l.default.makeLineSpan("underline-line",r);var i=l.default.makeVList({positionType:"top",positionData:a.height,children:[{type:"kern",size:n.height},{type:"elem",elem:n},{type:"kern",size:3*n.height},{type:"elem",elem:a}]},r);return l.default.makeSpan(["mord","underline"],[i],r)},mathmlBuilder:function e(t,r){var a=new o.default.MathNode("mo",[new o.default.TextNode("\u203e")]);a.setAttribute("stretchy","true");var n=new o.default.MathNode("munder",[c.buildGroup(t.value.body,r),a]);n.setAttribute("accentunder","true");return n}})},{"../buildCommon":91,"../buildHTML":92,"../buildMathML":93,"../defineFunction":96,"../mathMLTree":121}],120:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("./fontMetricsData");var n=f(a);var i=e("./symbols");var l=f(i);var u=e("./utils");var o=f(u);var s=e("./Token");function f(e){return e&&e.__esModule?e:{default:e}}var d={};r.default=d;function c(e,t){d[e]=t}c("\\@firstoftwo",function(e){var t=e.consumeArgs(2);return{tokens:t[0],numArgs:0}});c("\\@ifnextchar",function(e){var t=e.consumeArgs(3);var r=e.future();if(t[0].length===1&&t[0][0].text===r.text){return{tokens:t[1],numArgs:0}}else{return{tokens:t[2],numArgs:0}}});c("\\@ifstar","\\@ifnextchar *{\\@firstoftwo{#1}}");c("\\bgroup","{");c("\\egroup","}");c("\\begingroup","{");c("\\endgroup","}");c("\u2102","\\mathbb{C}");c("\u210d","\\mathbb{H}");c("\u2115","\\mathbb{N}");c("\u2119","\\mathbb{P}");c("\u211a","\\mathbb{Q}");c("\u211d","\\mathbb{R}");c("\u2124","\\mathbb{Z}");c("\xb7","\\cdotp");c("\\llap","\\mathllap{\\textrm{#1}}");c("\\rlap","\\mathrlap{\\textrm{#1}}");c("\\clap","\\mathclap{\\textrm{#1}}");c("\\overset","\\mathop{#2}\\limits^{#1}");c("\\underset","\\mathop{#2}\\limits_{#1}");c("\\boxed","\\fbox{\\displaystyle{#1}}");c("\\iff","\\DOTSB\\;\\Longleftrightarrow\\;");c("\\implies","\\DOTSB\\;\\Longrightarrow\\;");c("\\impliedby","\\DOTSB\\;\\Longleftarrow\\;");var h={",":"\\dotsc","\\not":"\\dotsb","+":"\\dotsb","=":"\\dotsb","<":"\\dotsb",">":"\\dotsb","-":"\\dotsb","*":"\\dotsb",":":"\\dotsb","\\DOTSB":"\\dotsb","\\coprod":"\\dotsb","\\bigvee":"\\dotsb","\\bigwedge":"\\dotsb","\\biguplus":"\\dotsb","\\bigcap":"\\dotsb","\\bigcup":"\\dotsb","\\prod":"\\dotsb","\\sum":"\\dotsb","\\bigotimes":"\\dotsb","\\bigoplus":"\\dotsb","\\bigodot":"\\dotsb","\\bigsqcup":"\\dotsb","\\implies":"\\dotsb","\\impliedby":"\\dotsb","\\And":"\\dotsb","\\longrightarrow":"\\dotsb","\\Longrightarrow":"\\dotsb","\\longleftarrow":"\\dotsb","\\Longleftarrow":"\\dotsb","\\longleftrightarrow":"\\dotsb","\\Longleftrightarrow":"\\dotsb","\\mapsto":"\\dotsb","\\longmapsto":"\\dotsb","\\hookrightarrow":"\\dotsb","\\iff":"\\dotsb","\\doteq":"\\dotsb","\\mathbin":"\\dotsb","\\bmod":"\\dotsb","\\mathrel":"\\dotsb","\\relbar":"\\dotsb","\\Relbar":"\\dotsb","\\xrightarrow":"\\dotsb","\\xleftarrow":"\\dotsb","\\DOTSI":"\\dotsi","\\int":"\\dotsi","\\oint":"\\dotsi","\\iint":"\\dotsi","\\iiint":"\\dotsi","\\iiiint":"\\dotsi",
"\\idotsint":"\\dotsi","\\DOTSX":"\\dotsx"};c("\\dots",function(e){var t="\\dotso";var r=e.expandAfterFuture().text;if(r in h){t=h[r]}else if(r.substr(0,4)==="\\not"){t="\\dotsb"}else if(r in l.default.math){if(o.default.contains(["bin","rel"],l.default.math[r].group)){t="\\dotsb"}}return t});var v={")":true,"]":true,"\\rbrack":true,"\\}":true,"\\rbrace":true,"\\rangle":true,"\\rceil":true,"\\rfloor":true,"\\rgroup":true,"\\rmoustache":true,"\\right":true,"\\bigr":true,"\\biggr":true,"\\Bigr":true,"\\Biggr":true,$:true,";":true,".":true,",":true};c("\\dotso",function(e){var t=e.future().text;if(t in v){return"\\ldots\\,"}else{return"\\ldots"}});c("\\dotsc",function(e){var t=e.future().text;if(t in v&&t!==","){return"\\ldots\\,"}else{return"\\ldots"}});c("\\cdots",function(e){var t=e.future().text;if(t in v){return"\\@cdots\\,"}else{return"\\@cdots"}});c("\\dotsb","\\cdots");c("\\dotsm","\\cdots");c("\\dotsi","\\!\\cdots");c("\\dotsx","\\ldots\\,");c("\\DOTSI","\\relax");c("\\DOTSB","\\relax");c("\\DOTSX","\\relax");c("\\thinspace","\\,");c("\\medspace","\\:");c("\\thickspace","\\;");c("\\TeX","\\textrm{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}");var p=n.default["Main-Regular"]["T".charCodeAt(0)][1]-.7*n.default["Main-Regular"]["A".charCodeAt(0)][1]+"em";c("\\LaTeX","\\textrm{L\\kern-.36em\\raisebox{"+p+"}{\\scriptsize A}"+"\\kern-.15em\\TeX}");c("\\KaTeX","\\textrm{K\\kern-.17em\\raisebox{"+p+"}{\\scriptsize A}"+"\\kern-.15em\\TeX}");c("\\hspace","\\@ifstar\\kern\\kern");c("\\ordinarycolon",":");c("\\vcentcolon","\\mathrel{\\mathop\\ordinarycolon}");c("\\dblcolon","\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon");c("\\coloneqq","\\vcentcolon\\mathrel{\\mkern-1.2mu}=");c("\\Coloneqq","\\dblcolon\\mathrel{\\mkern-1.2mu}=");c("\\coloneq","\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}");c("\\Coloneq","\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}");c("\\eqqcolon","=\\mathrel{\\mkern-1.2mu}\\vcentcolon");c("\\Eqqcolon","=\\mathrel{\\mkern-1.2mu}\\dblcolon");c("\\eqcolon","\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon");c("\\Eqcolon","\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon");c("\\colonapprox","\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx");c("\\Colonapprox","\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx");c("\\colonsim","\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim");c("\\Colonsim","\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim");c("\\ratio","\\vcentcolon");c("\\coloncolon","\\dblcolon");c("\\colonequals","\\coloneqq");c("\\coloncolonequals","\\Coloneqq");c("\\equalscolon","\\eqqcolon");c("\\equalscoloncolon","\\Eqqcolon");c("\\colonminus","\\coloneq");c("\\coloncolonminus","\\Coloneq");c("\\minuscolon","\\eqcolon");c("\\minuscoloncolon","\\Eqcolon");c("\\coloncolonapprox","\\Colonapprox");c("\\coloncolonsim","\\Colonsim");c("\\simcolon","\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon");c("\\simcoloncolon","\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon");c("\\approxcolon","\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon");c("\\approxcoloncolon","\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon");c("\\notni","\\not\\ni")},{"./Token":90,"./fontMetricsData":102,"./symbols":125,"./utils":128}],121:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("babel-runtime/core-js/get-iterator");var n=d(a);var i=e("babel-runtime/helpers/classCallCheck");var l=d(i);var u=e("babel-runtime/helpers/createClass");var o=d(u);var s=e("./utils");var f=d(s);function d(e){return e&&e.__esModule?e:{default:e}}var c=function(){function e(t,r){(0,l.default)(this,e);this.type=t;this.attributes={};this.children=r||[]}(0,o.default)(e,[{key:"setAttribute",value:function e(t,r){this.attributes[t]=r}},{key:"toNode",value:function e(){var t=document.createElementNS("http://www.w3.org/1998/Math/MathML",this.type);for(var r in this.attributes){if(Object.prototype.hasOwnProperty.call(this.attributes,r)){t.setAttribute(r,this.attributes[r])}}var a=true;var i=false;var l=undefined;try{for(var u=(0,n.default)(this.children),o;!(a=(o=u.next()).done);a=true){var s=o.value;t.appendChild(s.toNode())}}catch(e){i=true;l=e}finally{try{if(!a&&u.return){u.return()}}finally{if(i){throw l}}}return t}},{key:"toMarkup",value:function e(){var t="<"+this.type;for(var r in this.attributes){if(Object.prototype.hasOwnProperty.call(this.attributes,r)){t+=" "+r+'="';t+=f.default.escape(this.attributes[r]);t+='"'}}t+=">";for(var a=0;a<this.children.length;a++){t+=this.children[a].toMarkup()}t+="</"+this.type+">";return t}}]);return e}();var h=function(){function e(t){(0,l.default)(this,e);this.text=t}(0,o.default)(e,[{key:"toNode",value:function e(){return document.createTextNode(this.text)}},{key:"toMarkup",value:function e(){return f.default.escape(this.text)}}]);return e}();r.default={MathNode:c,TextNode:h}},{"./utils":128,"babel-runtime/core-js/get-iterator":3,"babel-runtime/helpers/classCallCheck":8,"babel-runtime/helpers/createClass":9}],122:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("./Parser");var n=i(a);function i(e){return e&&e.__esModule?e:{default:e}}var l=function e(t,r){if(!(typeof t==="string"||t instanceof String)){throw new TypeError("KaTeX can only parse string typed expression")}var a=new n.default(t,r);return a.parse()};r.default=l},{"./Parser":86}],123:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=e("babel-runtime/helpers/slicedToArray");var n=h(a);var i=e("./domTree");var l=h(i);var u=e("./buildCommon");var o=h(u);var s=e("./mathMLTree");var f=h(s);var d=e("./utils");var c=h(d);function h(e){return e&&e.__esModule?e:{default:e}}var v={widehat:"^",widetilde:"~",utilde:"~",overleftarrow:"\u2190",underleftarrow:"\u2190",xleftarrow:"\u2190",overrightarrow:"\u2192",underrightarrow:"\u2192",xrightarrow:"\u2192",underbrace:"\u23b5",overbrace:"\u23de",overleftrightarrow:"\u2194",underleftrightarrow:"\u2194",xleftrightarrow:"\u2194",Overrightarrow:"\u21d2",xRightarrow:"\u21d2",overleftharpoon:"\u21bc",xleftharpoonup:"\u21bc",overrightharpoon:"\u21c0",xrightharpoonup:"\u21c0",xLeftarrow:"\u21d0",xLeftrightarrow:"\u21d4",xhookleftarrow:"\u21a9",xhookrightarrow:"\u21aa",xmapsto:"\u21a6",xrightharpoondown:"\u21c1",xleftharpoondown:"\u21bd",xrightleftharpoons:"\u21cc",xleftrightharpoons:"\u21cb",xtwoheadleftarrow:"\u219e",xtwoheadrightarrow:"\u21a0",xlongequal:"=",xtofrom:"\u21c4"};var p=function e(t){var r=new f.default.MathNode("mo",[new f.default.TextNode(v[t.substr(1)])]);r.setAttribute("stretchy","true");return r};var m={overrightarrow:[["rightarrow"],.888,522,"xMaxYMin"],overleftarrow:[["leftarrow"],.888,522,"xMinYMin"],underrightarrow:[["rightarrow"],.888,522,"xMaxYMin"],underleftarrow:[["leftarrow"],.888,522,"xMinYMin"],xrightarrow:[["rightarrow"],1.469,522,"xMaxYMin"],xleftarrow:[["leftarrow"],1.469,522,"xMinYMin"],Overrightarrow:[["doublerightarrow"],.888,560,"xMaxYMin"],xRightarrow:[["doublerightarrow"],1.526,560,"xMaxYMin"],xLeftarrow:[["doubleleftarrow"],1.526,560,"xMinYMin"],overleftharpoon:[["leftharpoon"],.888,522,"xMinYMin"],xleftharpoonup:[["leftharpoon"],.888,522,"xMinYMin"],xleftharpoondown:[["leftharpoondown"],.888,522,"xMinYMin"],overrightharpoon:[["rightharpoon"],.888,522,"xMaxYMin"],xrightharpoonup:[["rightharpoon"],.888,522,"xMaxYMin"],xrightharpoondown:[["rightharpoondown"],.888,522,"xMaxYMin"],xlongequal:[["longequal"],.888,334,"xMinYMin"],xtwoheadleftarrow:[["twoheadleftarrow"],.888,334,"xMinYMin"],xtwoheadrightarrow:[["twoheadrightarrow"],.888,334,"xMaxYMin"],overleftrightarrow:[["leftarrow","rightarrow"],.888,522],overbrace:[["leftbrace","midbrace","rightbrace"],1.6,548],underbrace:[["leftbraceunder","midbraceunder","rightbraceunder"],1.6,548],underleftrightarrow:[["leftarrow","rightarrow"],.888,522],xleftrightarrow:[["leftarrow","rightarrow"],1.75,522],xLeftrightarrow:[["doubleleftarrow","doublerightarrow"],1.75,560],xrightleftharpoons:[["leftharpoondownplus","rightharpoonplus"],1.75,716],xleftrightharpoons:[["leftharpoonplus","rightharpoondownplus"],1.75,716],xhookleftarrow:[["leftarrow","righthook"],1.08,522],xhookrightarrow:[["lefthook","rightarrow"],1.08,522],overlinesegment:[["leftlinesegment","rightlinesegment"],.888,522],underlinesegment:[["leftlinesegment","rightlinesegment"],.888,522],overgroup:[["leftgroup","rightgroup"],.888,342],undergroup:[["leftgroupunder","rightgroupunder"],.888,342],xmapsto:[["leftmapsto","rightarrow"],1.5,522],xtofrom:[["leftToFrom","rightToFrom"],1.75,528]};var g=function e(t){if(t.type==="ordgroup"){return t.value.length}else{return 1}};var b=function e(t,r){function a(){var e=4e5;var a=t.value.label.substr(1);if(c.default.contains(["widehat","widetilde","utilde"],a)){var i=g(t.value.base);var u=void 0;var s=void 0;var f=void 0;if(i>5){u=a==="widehat"?420:312;e=a==="widehat"?2364:2340;f=a==="widehat"?.42:.34;s=(a==="widehat"?"widehat":"tilde")+"4"}else{var d=[1,1,2,2,3,3][i];if(a==="widehat"){e=[0,1062,2364,2364,2364][d];u=[0,239,300,360,420][d];f=[0,.24,.3,.3,.36,.42][d];s="widehat"+d}else{e=[0,600,1033,2339,2340][d];u=[0,260,286,306,312][d];f=[0,.26,.286,.3,.306,.34][d];s="tilde"+d}}var h=new l.default.pathNode(s);var v=new l.default.svgNode([h],{width:"100%",height:f+"em",viewBox:"0 0 "+e+" "+u,preserveAspectRatio:"none"});return{span:o.default.makeSpan([],[v],r),minWidth:0,height:f}}else{var p=[];var b=(0,n.default)(m[a],4),y=b[0],x=b[1],w=b[2],k=b[3];var M=w/1e3;var _=y.length;var S=void 0;var z=void 0;if(_===1){S=["hide-tail"];z=[k]}else if(_===2){S=["halfarrow-left","halfarrow-right"];z=["xMinYMin","xMaxYMin"]}else if(_===3){S=["brace-left","brace-center","brace-right"];z=["xMinYMin","xMidYMin","xMaxYMin"]}else{throw new Error("Correct katexImagesData or update code here to support\n                    "+_+" children.")}for(var T=0;T<_;T++){var C=new l.default.pathNode(y[T]);var A=new l.default.svgNode([C],{width:"400em",height:M+"em",viewBox:"0 0 "+e+" "+w,preserveAspectRatio:z[T]+" slice"});var O=o.default.makeSpan([S[T]],[A],r);if(_===1){return{span:O,minWidth:x,height:M}}else{O.style.height=M+"em";p.push(O)}}return{span:o.default.makeSpan(["stretchy"],p,r),minWidth:x,height:M}}}var i=a(),u=i.span,s=i.minWidth,f=i.height;u.height=f;u.style.height=f+"em";if(s>0){u.style.minWidth=s+"em"}return u};var y=function e(t,r,a,n){var i=void 0;var u=t.height+t.depth+2*a;if(/fbox|color/.test(r)){i=o.default.makeSpan(["stretchy",r],[],n);if(r==="fbox"){var s=n.color&&n.getColor();if(s){i.style.borderColor=s}}}else{var f=[];if(/^[bx]cancel$/.test(r)){f.push(new l.default.lineNode({x1:"0",y1:"0",x2:"100%",y2:"100%","stroke-width":"0.046em"}))}if(/^x?cancel$/.test(r)){f.push(new l.default.lineNode({x1:"0",y1:"100%",x2:"100%",y2:"0","stroke-width":"0.046em"}))}var d=new l.default.svgNode(f,{width:"100%",height:u+"em"});i=o.default.makeSpan([],[d],n)}i.height=u;i.style.height=u+"em";return i};var x=function e(t,r){var a=new l.default.pathNode("bigRule");var n=new l.default.svgNode([a],{width:"400em",height:"400em",viewBox:"0 0 400000 400000",preserveAspectRatio:"xMinYMin slice"});return o.default.makeSpan([t,"hide-tail"],[n],r)};r.default={encloseSpan:y,mathMLnode:p,ruleSpan:x,svgSpan:b}},{"./buildCommon":91,"./domTree":98,"./mathMLTree":121,"./utils":128,"babel-runtime/helpers/slicedToArray":10}],124:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a={bigRule:"M0 0 h400000 v400000 h-400000z M0 0 h400000 v400000 h-400000z",sqrtMain:"M95 622c-2.667 0-7.167-2.667-13.5\n-8S72 604 72 600c0-2 .333-3.333 1-4 1.333-2.667 23.833-20.667 67.5-54s\n65.833-50.333 66.5-51c1.333-1.333 3-2 5-2 4.667 0 8.667 3.333 12 10l173\n378c.667 0 35.333-71 104-213s137.5-285 206.5-429S812 17.333 812 14c5.333\n-9.333 12-14 20-14h399166v40H845.272L620 507 385 993c-2.667 4.667-9 7-19\n7-6 0-10-1-12-3L160 575l-65 47zM834 0h399166v40H845z",sqrtSize1:"M263 601c.667 0 18 39.667 52 119s68.167\n 158.667 102.5 238 51.833 119.333 52.5 120C810 373.333 980.667 17.667 982 11\nc4.667-7.333 11-11 19-11h398999v40H1012.333L741 607c-38.667 80.667-84 175-136\n 283s-89.167 185.333-111.5 232-33.833 70.333-34.5 71c-4.667 4.667-12.333 7-23\n 7l-12-1-109-253c-72.667-168-109.333-252-110-252-10.667 8-22 16.667-34 26-22\n 17.333-33.333 26-34 26l-26-26 76-59 76-60zM1001 0h398999v40H1012z",sqrtSize2:"M1001 0h398999v40H1013.084S929.667 308 749\n 880s-277 876.333-289 913c-4.667 4.667-12.667 7-24 7h-12c-1.333-3.333-3.667\n-11.667-7-25-35.333-125.333-106.667-373.333-214-744-10 12-21 25-33 39l-32 39\nc-6-5.333-15-14-27-26l25-30c26.667-32.667 52-63 76-91l52-60 208 722c56-175.333\n 126.333-397.333 211-666s153.833-488.167 207.5-658.5C944.167 129.167 975 32.667\n 983 10c4-6.667 10-10 18-10zm0 0h398999v40H1013z",sqrtSize3:"M424 2398c-1.333-.667-38.5-172-111.5-514 S202.667 1370.667 202\n 1370c0-2-10.667 14.333-32 49-4.667 7.333-9.833 15.667-15.5 25s-9.833 16-12.5\n 20l-5 7c-4-3.333-8.333-7.667-13-13l-13-13 76-122 77-121 209 968c0-2 84.667\n-361.667 254-1079C896.333 373.667 981.667 13.333 983 10c4-6.667 10-10 18-10\nh398999v40H1014.622S927.332 418.667 742 1206c-185.333 787.333-279.333 1182.333\n-282 1185-2 6-10 9-24 9-8 0-12-.667-12-2zM1001 0h398999v40H1014z",sqrtSize4:"M473 2713C812.333 913.667 982.333 13 983 11c3.333-7.333 9.333\n-11 18-11h399110v40H1017.698S927.168 518 741.5 1506C555.833 2494 462 2989 460\n 2991c-2 6-10 9-24 9-8 0-12-.667-12-2s-5.333-32-16-92c-50.667-293.333-119.667\n-693.333-207-1200 0-1.333-5.333 8.667-16 30l-32 64-16 33-26-26 76-153 77-151\nc.667.667 35.667 202 105 604 67.333 400.667 102 602.667 104 606z\nM1001 0h398999v40H1017z",doubleleftarrow:"M262 157\nl10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3\n 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28\n 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5\nc2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5\n 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87\n-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7\n-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z\nm8 0v40h399730v-40zm0 194v40h399730v-40z",doublerightarrow:"M399738 392l\n-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5\n 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88\n-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68\n-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18\n-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782\nc-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3\n-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z",leftarrow:"M400000 241H110l3-3c68.7-52.7 113.7-120\n 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8\n-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247\nc-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208\n 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3\n 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202\n l-3-3h399890zM100 241v40h399900v-40z",leftbrace:"M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117\n-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7\n 5-6 9-10 13-.7 1-7.3 1-20 1H6z",leftbraceunder:"M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13\n 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688\n 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7\n-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z",leftgroup:"M400000 80\nH435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0\n 435 0h399565z",leftgroupunder:"M400000 262\nH435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219\n 435 219h399565z",leftharpoon:"M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3\n-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5\n-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7\n-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z",leftharpoonplus:"M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5\n 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3\n-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7\n-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z\nm0 0v40h400000v-40z",leftharpoondown:"M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333\n 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5\n 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667\n-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z",leftharpoondownplus:"M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12\n 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7\n-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0\nv40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z",lefthook:"M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5\n-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3\n-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21\n 71.5 23h399859zM103 281v-40h399897v40z",leftlinesegment:"M40 281 V428 H0 V94 H40 V241 H400000 v40z\nM40 281 V428 H0 V94 H40 V241 H400000 v40z",leftmapsto:"M40 281 V448H0V74H40V241H400000v40z\nM40 281 V448H0V74H40V241H400000v40z",leftToFrom:"M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23\n-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8\nc28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3\n 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z",longequal:"M0 50 h400000 v40H0z m0 194h40000v40H0z\nM0 50 h400000 v40H0z m0 194h40000v40H0z",midbrace:"M200428 334\nc-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14\n-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7\n 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11\n 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z",midbraceunder:"M199572 214\nc100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14\n 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3\n 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0\n-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z",rightarrow:"M0 241v40h399891c-47.3 35.3-84 78-110 128\n-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20\n 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7\n 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85\n-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n 151.7 139 205zm0 0v40h399900v-40z",rightbrace:"M400000 542l\n-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5\ns-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1\nc124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z",rightbraceunder:"M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3\n 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237\n-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z",rightgroup:"M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0\n 3-1 3-3v-38c-76-158-257-219-435-219H0z",rightgroupunder:"M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18\n 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z",rightharpoon:"M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3\n-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2\n-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58\n 69.2 92 94.5zm0 0v40h399900v-40z",rightharpoonplus:"M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11\n-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7\n 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z\nm0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z",rightharpoondown:"M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8\n 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5\n-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95\n-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z",rightharpoondownplus:"M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8\n 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3\n 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3\n-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z\nm0-194v40h400000v-40zm0 0v40h400000v-40z",righthook:"M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3\n 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0\n-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21\n 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z",rightlinesegment:"M399960 241 V94 h40 V428 h-40 V281 H0 v-40z\nM399960 241 V94 h40 V428 h-40 V281 H0 v-40z",rightToFrom:"M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23\n 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32\n-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142\n-167z M100 147v40h399900v-40zM0 341v40h399900v-40z",twoheadleftarrow:"M0 167c68 40\n 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69\n-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3\n-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19\n-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101\n 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z",twoheadrightarrow:"M400000 167\nc-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3\n 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42\n 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333\n-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70\n 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z",tilde1:"M200 55.538c-77 0-168 73.953-177 73.953-3 0-7\n-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0\n 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0\n 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128\n-68.267.847-113-73.952-191-73.952z",tilde2:"M344 55.266c-142 0-300.638 81.316-311.5 86.418\n-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9\n 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114\nc1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751\n 181.476 676 181.476c-149 0-189-126.21-332-126.21z",tilde3:"M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457\n-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0\n 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697\n 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696\n -338 0-409-156.573-744-156.573z",tilde4:"M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345\n-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409\n 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9\n 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409\n -175.236-744-175.236z",widehat1:"M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22\nc-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z",widehat2:"M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",widehat3:"M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",widehat4:"M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z"};r.default={path:a}},{}],125:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a={math:{},text:{}};r.default=a;function n(e,t,r,n,i,l){a[e][i]={font:t,group:r,replace:n};if(l&&n){a[e][n]=a[e][i]}}var i="math";var l="text";var u="main";var o="ams";var s="accent";var f="bin";var d="close";var c="inner";var h="mathord";var v="op";var p="open";var m="punct";var g="rel";var b="spacing";var y="textord";n(i,u,g,"\u2261","\\equiv",true);n(i,u,g,"\u227a","\\prec",true);n(i,u,g,"\u227b","\\succ",true);n(i,u,g,"\u223c","\\sim",true);n(i,u,g,"\u22a5","\\perp");n(i,u,g,"\u2aaf","\\preceq",true);n(i,u,g,"\u2ab0","\\succeq",true);n(i,u,g,"\u2243","\\simeq",true);n(i,u,g,"\u2223","\\mid",true);n(i,u,g,"\u226a","\\ll");n(i,u,g,"\u226b","\\gg",true);n(i,u,g,"\u224d","\\asymp",true);n(i,u,g,"\u2225","\\parallel");n(i,u,g,"\u22c8","\\bowtie",true);n(i,u,g,"\u2323","\\smile",true);n(i,u,g,"\u2291","\\sqsubseteq",true);n(i,u,g,"\u2292","\\sqsupseteq",true);n(i,u,g,"\u2250","\\doteq",true);n(i,u,g,"\u2322","\\frown",true);n(i,u,g,"\u220b","\\ni",true);n(i,u,g,"\u221d","\\propto",true);n(i,u,g,"\u22a2","\\vdash",true);n(i,u,g,"\u22a3","\\dashv",true);n(i,u,g,"\u220b","\\owns");n(i,u,m,".","\\ldotp");n(i,u,m,"\u22c5","\\cdotp");n(i,u,y,"#","\\#");n(l,u,y,"#","\\#");n(i,u,y,"&","\\&");n(l,u,y,"&","\\&");n(i,u,y,"\u2135","\\aleph",true);n(i,u,y,"\u2200","\\forall",true);n(i,u,y,"\u210f","\\hbar");n(i,u,y,"\u2203","\\exists",true);n(i,u,y,"\u2207","\\nabla",true);n(i,u,y,"\u266d","\\flat",true);n(i,u,y,"\u2113","\\ell",true);n(i,u,y,"\u266e","\\natural",true);n(i,u,y,"\u2663","\\clubsuit",true);n(i,u,y,"\u2118","\\wp",true);n(i,u,y,"\u266f","\\sharp",true);n(i,u,y,"\u2662","\\diamondsuit",true);n(i,u,y,"\u211c","\\Re",true);n(i,u,y,"\u2661","\\heartsuit",true);n(i,u,y,"\u2111","\\Im",true);n(i,u,y,"\u2660","\\spadesuit",true);n(i,u,y,"\u2020","\\dag");n(l,u,y,"\u2020","\\dag");n(l,u,y,"\u2020","\\textdagger");n(i,u,y,"\u2021","\\ddag");n(l,u,y,"\u2021","\\ddag");n(l,u,y,"\u2020","\\textdaggerdbl");n(i,u,d,"\u23b1","\\rmoustache");n(i,u,p,"\u23b0","\\lmoustache");n(i,u,d,"\u27ef","\\rgroup");n(i,u,p,"\u27ee","\\lgroup");n(i,u,f,"\u2213","\\mp",true);n(i,u,f,"\u2296","\\ominus",true);n(i,u,f,"\u228e","\\uplus",true);n(i,u,f,"\u2293","\\sqcap",true);n(i,u,f,"\u2217","\\ast");n(i,u,f,"\u2294","\\sqcup",true);n(i,u,f,"\u25ef","\\bigcirc");n(i,u,f,"\u2219","\\bullet");n(i,u,f,"\u2021","\\ddagger");n(i,u,f,"\u2240","\\wr",true);n(i,u,f,"\u2a3f","\\amalg");n(i,u,f,"&","\\And");n(i,u,g,"\u27f5","\\longleftarrow",true);n(i,u,g,"\u21d0","\\Leftarrow",true);n(i,u,g,"\u27f8","\\Longleftarrow",true);n(i,u,g,"\u27f6","\\longrightarrow",true);n(i,u,g,"\u21d2","\\Rightarrow",true);n(i,u,g,"\u27f9","\\Longrightarrow",true);n(i,u,g,"\u2194","\\leftrightarrow",true);n(i,u,g,"\u27f7","\\longleftrightarrow",true);n(i,u,g,"\u21d4","\\Leftrightarrow",true);n(i,u,g,"\u27fa","\\Longleftrightarrow",true);n(i,u,g,"\u21a6","\\mapsto",true);n(i,u,g,"\u27fc","\\longmapsto",true);n(i,u,g,"\u2197","\\nearrow",true);n(i,u,g,"\u21a9","\\hookleftarrow",true);n(i,u,g,"\u21aa","\\hookrightarrow",true);n(i,u,g,"\u2198","\\searrow",true);n(i,u,g,"\u21bc","\\leftharpoonup",true);n(i,u,g,"\u21c0","\\rightharpoonup",true);n(i,u,g,"\u2199","\\swarrow",true);n(i,u,g,"\u21bd","\\leftharpoondown",true);n(i,u,g,"\u21c1","\\rightharpoondown",true);n(i,u,g,"\u2196","\\nwarrow",true);n(i,u,g,"\u21cc","\\rightleftharpoons",true);n(i,o,g,"\u226e","\\nless",true);n(i,o,g,"\ue010","\\nleqslant");n(i,o,g,"\ue011","\\nleqq");n(i,o,g,"\u2a87","\\lneq",true);n(i,o,g,"\u2268","\\lneqq",true);n(i,o,g,"\ue00c","\\lvertneqq");n(i,o,g,"\u22e6","\\lnsim",true);n(i,o,g,"\u2a89","\\lnapprox",true);n(i,o,g,"\u2280","\\nprec",true);n(i,o,g,"\u22e0","\\npreceq",true);n(i,o,g,"\u22e8","\\precnsim",true);n(i,o,g,"\u2ab9","\\precnapprox",true);n(i,o,g,"\u2241","\\nsim",true);n(i,o,g,"\ue006","\\nshortmid");n(i,o,g,"\u2224","\\nmid",true);n(i,o,g,"\u22ac","\\nvdash",true);n(i,o,g,"\u22ad","\\nvDash",true);n(i,o,g,"\u22ea","\\ntriangleleft");n(i,o,g,"\u22ec","\\ntrianglelefteq",true);n(i,o,g,"\u228a","\\subsetneq",true);n(i,o,g,"\ue01a","\\varsubsetneq");n(i,o,g,"\u2acb","\\subsetneqq",true);n(i,o,g,"\ue017","\\varsubsetneqq");n(i,o,g,"\u226f","\\ngtr",true);n(i,o,g,"\ue00f","\\ngeqslant");n(i,o,g,"\ue00e","\\ngeqq");n(i,o,g,"\u2a88","\\gneq",true);n(i,o,g,"\u2269","\\gneqq",true);n(i,o,g,"\ue00d","\\gvertneqq");n(i,o,g,"\u22e7","\\gnsim",true);n(i,o,g,"\u2a8a","\\gnapprox",true);n(i,o,g,"\u2281","\\nsucc",true);n(i,o,g,"\u22e1","\\nsucceq",true);n(i,o,g,"\u22e9","\\succnsim",true);n(i,o,g,"\u2aba","\\succnapprox",true);n(i,o,g,"\u2246","\\ncong",true);n(i,o,g,"\ue007","\\nshortparallel");n(i,o,g,"\u2226","\\nparallel",true);n(i,o,g,"\u22af","\\nVDash",true);n(i,o,g,"\u22eb","\\ntriangleright");n(i,o,g,"\u22ed","\\ntrianglerighteq",true);n(i,o,g,"\ue018","\\nsupseteqq");n(i,o,g,"\u228b","\\supsetneq",true);n(i,o,g,"\ue01b","\\varsupsetneq");n(i,o,g,"\u2acc","\\supsetneqq",true);n(i,o,g,"\ue019","\\varsupsetneqq");n(i,o,g,"\u22ae","\\nVdash",true);n(i,o,g,"\u2ab5","\\precneqq",true);n(i,o,g,"\u2ab6","\\succneqq",true);n(i,o,g,"\ue016","\\nsubseteqq");n(i,o,f,"\u22b4","\\unlhd");n(i,o,f,"\u22b5","\\unrhd");n(i,o,g,"\u219a","\\nleftarrow",true);n(i,o,g,"\u219b","\\nrightarrow",true);n(i,o,g,"\u21cd","\\nLeftarrow",true);n(i,o,g,"\u21cf","\\nRightarrow",true);n(i,o,g,"\u21ae","\\nleftrightarrow",true);n(i,o,g,"\u21ce","\\nLeftrightarrow",true);n(i,o,g,"\u25b3","\\vartriangle");n(i,o,y,"\u210f","\\hslash");n(i,o,y,"\u25bd","\\triangledown");n(i,o,y,"\u25ca","\\lozenge");n(i,o,y,"\u24c8","\\circledS");n(i,o,y,"\xae","\\circledR");n(l,o,y,"\xae","\\circledR");n(i,o,y,"\u2221","\\measuredangle",true);n(i,o,y,"\u2204","\\nexists");n(i,o,y,"\u2127","\\mho");n(i,o,y,"\u2132","\\Finv",true);n(i,o,y,"\u2141","\\Game",true);n(i,o,y,"k","\\Bbbk");n(i,o,y,"\u2035","\\backprime");n(i,o,y,"\u25b2","\\blacktriangle");n(i,o,y,"\u25bc","\\blacktriangledown");n(i,o,y,"\u25a0","\\blacksquare");n(i,o,y,"\u29eb","\\blacklozenge");n(i,o,y,"\u2605","\\bigstar");n(i,o,y,"\u2222","\\sphericalangle",true);n(i,o,y,"\u2201","\\complement",true);n(i,o,y,"\xf0","\\eth",true);n(i,o,y,"\u2571","\\diagup");n(i,o,y,"\u2572","\\diagdown");n(i,o,y,"\u25a1","\\square");n(i,o,y,"\u25a1","\\Box");n(i,o,y,"\u25ca","\\Diamond");n(i,o,y,"\xa5","\\yen",true);n(i,o,y,"\u2713","\\checkmark",true);n(l,o,y,"\u2713","\\checkmark");n(i,o,y,"\u2136","\\beth",true);n(i,o,y,"\u2138","\\daleth",true);n(i,o,y,"\u2137","\\gimel",true);n(i,o,y,"\u03dd","\\digamma");n(i,o,y,"\u03f0","\\varkappa");n(i,o,p,"\u250c","\\ulcorner");n(i,o,d,"\u2510","\\urcorner");n(i,o,p,"\u2514","\\llcorner");n(i,o,d,"\u2518","\\lrcorner");n(i,o,g,"\u2266","\\leqq",true);n(i,o,g,"\u2a7d","\\leqslant");n(i,o,g,"\u2a95","\\eqslantless",true);n(i,o,g,"\u2272","\\lesssim");n(i,o,g,"\u2a85","\\lessapprox");n(i,o,g,"\u224a","\\approxeq",true);n(i,o,f,"\u22d6","\\lessdot");n(i,o,g,"\u22d8","\\lll");n(i,o,g,"\u2276","\\lessgtr");n(i,o,g,"\u22da","\\lesseqgtr");n(i,o,g,"\u2a8b","\\lesseqqgtr");n(i,o,g,"\u2251","\\doteqdot");n(i,o,g,"\u2253","\\risingdotseq",true);n(i,o,g,"\u2252","\\fallingdotseq",true);n(i,o,g,"\u223d","\\backsim",true);n(i,o,g,"\u22cd","\\backsimeq",true);n(i,o,g,"\u2ac5","\\subseteqq",true);n(i,o,g,"\u22d0","\\Subset",true);n(i,o,g,"\u228f","\\sqsubset",true);n(i,o,g,"\u227c","\\preccurlyeq",true);n(i,o,g,"\u22de","\\curlyeqprec",true);n(i,o,g,"\u227e","\\precsim",true);n(i,o,g,"\u2ab7","\\precapprox",true);n(i,o,g,"\u22b2","\\vartriangleleft");n(i,o,g,"\u22b4","\\trianglelefteq");n(i,o,g,"\u22a8","\\vDash");n(i,o,g,"\u22aa","\\Vvdash",true);n(i,o,g,"\u2323","\\smallsmile");n(i,o,g,"\u2322","\\smallfrown");n(i,o,g,"\u224f","\\bumpeq",true);
n(i,o,g,"\u224e","\\Bumpeq",true);n(i,o,g,"\u2267","\\geqq",true);n(i,o,g,"\u2a7e","\\geqslant",true);n(i,o,g,"\u2a96","\\eqslantgtr",true);n(i,o,g,"\u2273","\\gtrsim",true);n(i,o,g,"\u2a86","\\gtrapprox",true);n(i,o,f,"\u22d7","\\gtrdot");n(i,o,g,"\u22d9","\\ggg",true);n(i,o,g,"\u2277","\\gtrless",true);n(i,o,g,"\u22db","\\gtreqless",true);n(i,o,g,"\u2a8c","\\gtreqqless",true);n(i,o,g,"\u2256","\\eqcirc",true);n(i,o,g,"\u2257","\\circeq",true);n(i,o,g,"\u225c","\\triangleq",true);n(i,o,g,"\u223c","\\thicksim");n(i,o,g,"\u2248","\\thickapprox");n(i,o,g,"\u2ac6","\\supseteqq",true);n(i,o,g,"\u22d1","\\Supset",true);n(i,o,g,"\u2290","\\sqsupset",true);n(i,o,g,"\u227d","\\succcurlyeq",true);n(i,o,g,"\u22df","\\curlyeqsucc",true);n(i,o,g,"\u227f","\\succsim",true);n(i,o,g,"\u2ab8","\\succapprox",true);n(i,o,g,"\u22b3","\\vartriangleright");n(i,o,g,"\u22b5","\\trianglerighteq");n(i,o,g,"\u22a9","\\Vdash",true);n(i,o,g,"\u2223","\\shortmid");n(i,o,g,"\u2225","\\shortparallel");n(i,o,g,"\u226c","\\between",true);n(i,o,g,"\u22d4","\\pitchfork",true);n(i,o,g,"\u221d","\\varpropto");n(i,o,g,"\u25c0","\\blacktriangleleft");n(i,o,g,"\u2234","\\therefore",true);n(i,o,g,"\u220d","\\backepsilon");n(i,o,g,"\u25b6","\\blacktriangleright");n(i,o,g,"\u2235","\\because",true);n(i,o,g,"\u22d8","\\llless");n(i,o,g,"\u22d9","\\gggtr");n(i,o,f,"\u22b2","\\lhd");n(i,o,f,"\u22b3","\\rhd");n(i,o,g,"\u2242","\\eqsim",true);n(i,u,g,"\u22c8","\\Join");n(i,o,g,"\u2251","\\Doteq",true);n(i,o,f,"\u2214","\\dotplus",true);n(i,o,f,"\u2216","\\smallsetminus");n(i,o,f,"\u22d2","\\Cap",true);n(i,o,f,"\u22d3","\\Cup",true);n(i,o,f,"\u2a5e","\\doublebarwedge",true);n(i,o,f,"\u229f","\\boxminus",true);n(i,o,f,"\u229e","\\boxplus",true);n(i,o,f,"\u22c7","\\divideontimes",true);n(i,o,f,"\u22c9","\\ltimes",true);n(i,o,f,"\u22ca","\\rtimes",true);n(i,o,f,"\u22cb","\\leftthreetimes",true);n(i,o,f,"\u22cc","\\rightthreetimes",true);n(i,o,f,"\u22cf","\\curlywedge",true);n(i,o,f,"\u22ce","\\curlyvee",true);n(i,o,f,"\u229d","\\circleddash",true);n(i,o,f,"\u229b","\\circledast",true);n(i,o,f,"\u22c5","\\centerdot");n(i,o,f,"\u22ba","\\intercal",true);n(i,o,f,"\u22d2","\\doublecap");n(i,o,f,"\u22d3","\\doublecup");n(i,o,f,"\u22a0","\\boxtimes",true);n(i,o,g,"\u21e2","\\dashrightarrow",true);n(i,o,g,"\u21e0","\\dashleftarrow",true);n(i,o,g,"\u21c7","\\leftleftarrows",true);n(i,o,g,"\u21c6","\\leftrightarrows",true);n(i,o,g,"\u21da","\\Lleftarrow",true);n(i,o,g,"\u219e","\\twoheadleftarrow",true);n(i,o,g,"\u21a2","\\leftarrowtail",true);n(i,o,g,"\u21ab","\\looparrowleft",true);n(i,o,g,"\u21cb","\\leftrightharpoons",true);n(i,o,g,"\u21b6","\\curvearrowleft",true);n(i,o,g,"\u21ba","\\circlearrowleft",true);n(i,o,g,"\u21b0","\\Lsh",true);n(i,o,g,"\u21c8","\\upuparrows",true);n(i,o,g,"\u21bf","\\upharpoonleft",true);n(i,o,g,"\u21c3","\\downharpoonleft",true);n(i,o,g,"\u22b8","\\multimap",true);n(i,o,g,"\u21ad","\\leftrightsquigarrow",true);n(i,o,g,"\u21c9","\\rightrightarrows",true);n(i,o,g,"\u21c4","\\rightleftarrows",true);n(i,o,g,"\u21a0","\\twoheadrightarrow",true);n(i,o,g,"\u21a3","\\rightarrowtail",true);n(i,o,g,"\u21ac","\\looparrowright",true);n(i,o,g,"\u21b7","\\curvearrowright",true);n(i,o,g,"\u21bb","\\circlearrowright",true);n(i,o,g,"\u21b1","\\Rsh",true);n(i,o,g,"\u21ca","\\downdownarrows",true);n(i,o,g,"\u21be","\\upharpoonright",true);n(i,o,g,"\u21c2","\\downharpoonright",true);n(i,o,g,"\u21dd","\\rightsquigarrow",true);n(i,o,g,"\u21dd","\\leadsto");n(i,o,g,"\u21db","\\Rrightarrow",true);n(i,o,g,"\u21be","\\restriction");n(i,u,y,"\u2018","`");n(i,u,y,"$","\\$");n(l,u,y,"$","\\$");n(l,u,y,"$","\\textdollar");n(i,u,y,"%","\\%");n(l,u,y,"%","\\%");n(i,u,y,"_","\\_");n(l,u,y,"_","\\_");n(l,u,y,"_","\\textunderscore");n(i,u,y,"\u2220","\\angle",true);n(i,u,y,"\u221e","\\infty",true);n(i,u,y,"\u2032","\\prime");n(i,u,y,"\u25b3","\\triangle");n(i,u,y,"\u0393","\\Gamma",true);n(i,u,y,"\u0394","\\Delta",true);n(i,u,y,"\u0398","\\Theta",true);n(i,u,y,"\u039b","\\Lambda",true);n(i,u,y,"\u039e","\\Xi",true);n(i,u,y,"\u03a0","\\Pi",true);n(i,u,y,"\u03a3","\\Sigma",true);n(i,u,y,"\u03a5","\\Upsilon",true);n(i,u,y,"\u03a6","\\Phi",true);n(i,u,y,"\u03a8","\\Psi",true);n(i,u,y,"\u03a9","\\Omega",true);n(i,u,y,"\xac","\\neg");n(i,u,y,"\xac","\\lnot");n(i,u,y,"\u22a4","\\top");n(i,u,y,"\u22a5","\\bot");n(i,u,y,"\u2205","\\emptyset");n(i,o,y,"\u2205","\\varnothing");n(i,u,h,"\u03b1","\\alpha",true);n(i,u,h,"\u03b2","\\beta",true);n(i,u,h,"\u03b3","\\gamma",true);n(i,u,h,"\u03b4","\\delta",true);n(i,u,h,"\u03f5","\\epsilon",true);n(i,u,h,"\u03b6","\\zeta",true);n(i,u,h,"\u03b7","\\eta",true);n(i,u,h,"\u03b8","\\theta",true);n(i,u,h,"\u03b9","\\iota",true);n(i,u,h,"\u03ba","\\kappa",true);n(i,u,h,"\u03bb","\\lambda",true);n(i,u,h,"\u03bc","\\mu",true);n(i,u,h,"\u03bd","\\nu",true);n(i,u,h,"\u03be","\\xi",true);n(i,u,h,"\u03bf","\\omicron",true);n(i,u,h,"\u03c0","\\pi",true);n(i,u,h,"\u03c1","\\rho",true);n(i,u,h,"\u03c3","\\sigma",true);n(i,u,h,"\u03c4","\\tau",true);n(i,u,h,"\u03c5","\\upsilon",true);n(i,u,h,"\u03d5","\\phi",true);n(i,u,h,"\u03c7","\\chi",true);n(i,u,h,"\u03c8","\\psi",true);n(i,u,h,"\u03c9","\\omega",true);n(i,u,h,"\u03b5","\\varepsilon",true);n(i,u,h,"\u03d1","\\vartheta",true);n(i,u,h,"\u03d6","\\varpi",true);n(i,u,h,"\u03f1","\\varrho",true);n(i,u,h,"\u03c2","\\varsigma",true);n(i,u,h,"\u03c6","\\varphi",true);n(i,u,f,"\u2217","*");n(i,u,f,"+","+");n(i,u,f,"\u2212","-");n(i,u,f,"\u22c5","\\cdot",true);n(i,u,f,"\u2218","\\circ");n(i,u,f,"\xf7","\\div",true);n(i,u,f,"\xb1","\\pm",true);n(i,u,f,"\xd7","\\times",true);n(i,u,f,"\u2229","\\cap",true);n(i,u,f,"\u222a","\\cup",true);n(i,u,f,"\u2216","\\setminus");n(i,u,f,"\u2227","\\land");n(i,u,f,"\u2228","\\lor");n(i,u,f,"\u2227","\\wedge",true);n(i,u,f,"\u2228","\\vee",true);n(i,u,y,"\u221a","\\surd");n(i,u,p,"(","(");n(i,u,p,"[","[");n(i,u,p,"\u27e8","\\langle");n(i,u,p,"\u2223","\\lvert");n(i,u,p,"\u2225","\\lVert");n(i,u,d,")",")");n(i,u,d,"]","]");n(i,u,d,"?","?");n(i,u,d,"!","!");n(i,u,d,"\u27e9","\\rangle");n(i,u,d,"\u2223","\\rvert");n(i,u,d,"\u2225","\\rVert");n(i,u,g,"=","=");n(i,u,g,"<","<");n(i,u,g,">",">");n(i,u,g,":",":");n(i,u,g,"\u2248","\\approx",true);n(i,u,g,"\u2245","\\cong",true);n(i,u,g,"\u2265","\\ge");n(i,u,g,"\u2265","\\geq",true);n(i,u,g,"\u2190","\\gets");n(i,u,g,">","\\gt");n(i,u,g,"\u2208","\\in",true);n(i,u,g,"\u2209","\\notin",true);n(i,u,g,"\u0338","\\not");n(i,u,g,"\u2282","\\subset",true);n(i,u,g,"\u2283","\\supset",true);n(i,u,g,"\u2286","\\subseteq",true);n(i,u,g,"\u2287","\\supseteq",true);n(i,o,g,"\u2288","\\nsubseteq",true);n(i,o,g,"\u2289","\\nsupseteq",true);n(i,u,g,"\u22a8","\\models");n(i,u,g,"\u2190","\\leftarrow",true);n(i,u,g,"\u2264","\\le");n(i,u,g,"\u2264","\\leq",true);n(i,u,g,"<","\\lt");n(i,u,g,"\u2260","\\ne",true);n(i,u,g,"\u2260","\\neq");n(i,u,g,"\u2192","\\rightarrow",true);n(i,u,g,"\u2192","\\to");n(i,o,g,"\u2271","\\ngeq",true);n(i,o,g,"\u2270","\\nleq",true);n(i,u,b,null,"\\!");n(i,u,b,"\xa0","\\ ");n(i,u,b,"\xa0","~");n(i,u,b,null,"\\,");n(i,u,b,null,"\\:");n(i,u,b,null,"\\;");n(i,u,b,null,"\\enspace");n(i,u,b,null,"\\qquad");n(i,u,b,null,"\\quad");n(i,u,b,"\xa0","\\space");n(i,u,m,",",",");n(i,u,m,";",";");n(i,u,m,":","\\colon");n(i,o,f,"\u22bc","\\barwedge",true);n(i,o,f,"\u22bb","\\veebar",true);n(i,u,f,"\u2299","\\odot",true);n(i,u,f,"\u2295","\\oplus",true);n(i,u,f,"\u2297","\\otimes",true);n(i,u,y,"\u2202","\\partial",true);n(i,u,f,"\u2298","\\oslash",true);n(i,o,f,"\u229a","\\circledcirc",true);n(i,o,f,"\u22a1","\\boxdot",true);n(i,u,f,"\u25b3","\\bigtriangleup");n(i,u,f,"\u25bd","\\bigtriangledown");n(i,u,f,"\u2020","\\dagger");n(i,u,f,"\u22c4","\\diamond");n(i,u,f,"\u22c6","\\star");n(i,u,f,"\u25c3","\\triangleleft");n(i,u,f,"\u25b9","\\triangleright");n(i,u,p,"{","\\{");n(l,u,y,"{","\\{");n(l,u,y,"{","\\textbraceleft");n(i,u,d,"}","\\}");n(l,u,y,"}","\\}");n(l,u,y,"}","\\textbraceright");n(i,u,p,"{","\\lbrace");n(i,u,d,"}","\\rbrace");n(i,u,p,"[","\\lbrack");n(i,u,d,"]","\\rbrack");n(l,u,y,"<","\\textless");n(l,u,y,">","\\textgreater");n(i,u,p,"\u230a","\\lfloor");n(i,u,d,"\u230b","\\rfloor");n(i,u,p,"\u2308","\\lceil");n(i,u,d,"\u2309","\\rceil");n(i,u,y,"\\","\\backslash");n(i,u,y,"\u2223","|");n(i,u,y,"\u2223","\\vert");n(l,u,y,"|","\\textbar");n(i,u,y,"\u2225","\\|");n(i,u,y,"\u2225","\\Vert");n(l,u,y,"\u2225","\\textbardbl");n(i,u,g,"\u2191","\\uparrow",true);n(i,u,g,"\u21d1","\\Uparrow",true);n(i,u,g,"\u2193","\\downarrow",true);n(i,u,g,"\u21d3","\\Downarrow",true);n(i,u,g,"\u2195","\\updownarrow",true);n(i,u,g,"\u21d5","\\Updownarrow",true);n(i,u,v,"\u2210","\\coprod");n(i,u,v,"\u22c1","\\bigvee");n(i,u,v,"\u22c0","\\bigwedge");n(i,u,v,"\u2a04","\\biguplus");n(i,u,v,"\u22c2","\\bigcap");n(i,u,v,"\u22c3","\\bigcup");n(i,u,v,"\u222b","\\int");n(i,u,v,"\u222b","\\intop");n(i,u,v,"\u222c","\\iint");n(i,u,v,"\u222d","\\iiint");n(i,u,v,"\u220f","\\prod");n(i,u,v,"\u2211","\\sum");n(i,u,v,"\u2a02","\\bigotimes");n(i,u,v,"\u2a01","\\bigoplus");n(i,u,v,"\u2a00","\\bigodot");n(i,u,v,"\u222e","\\oint");n(i,u,v,"\u2a06","\\bigsqcup");n(i,u,v,"\u222b","\\smallint");n(l,u,c,"\u2026","\\textellipsis");n(i,u,c,"\u2026","\\mathellipsis");n(l,u,c,"\u2026","\\ldots",true);n(i,u,c,"\u2026","\\ldots",true);n(i,u,c,"\u22ef","\\@cdots",true);n(i,u,c,"\u22f1","\\ddots",true);n(i,u,y,"\u22ee","\\vdots",true);n(i,u,s,"\xb4","\\acute");n(i,u,s,"`","\\grave");n(i,u,s,"\xa8","\\ddot");n(i,u,s,"~","\\tilde");n(i,u,s,"\xaf","\\bar");n(i,u,s,"\u02d8","\\breve");n(i,u,s,"\u02c7","\\check");n(i,u,s,"^","\\hat");n(i,u,s,"\u20d7","\\vec");n(i,u,s,"\u02d9","\\dot");n(i,u,h,"\u0131","\\imath");n(i,u,h,"\u0237","\\jmath");n(l,u,s,"\u02ca","\\'");n(l,u,s,"\u02cb","\\`");n(l,u,s,"\u02c6","\\^");n(l,u,s,"\u02dc","\\~");n(l,u,s,"\u02c9","\\=");n(l,u,s,"\u02d8","\\u");n(l,u,s,"\u02d9","\\.");n(l,u,s,"\u02da","\\r");n(l,u,s,"\u02c7","\\v");n(l,u,s,"\xa8",'\\"');n(l,u,s,"\u030b","\\H");n(l,u,y,"\u2013","--");n(l,u,y,"\u2013","\\textendash");n(l,u,y,"\u2014","---");n(l,u,y,"\u2014","\\textemdash");n(l,u,y,"\u2018","`");n(l,u,y,"\u2018","\\textquoteleft");n(l,u,y,"\u2019","'");n(l,u,y,"\u2019","\\textquoteright");n(l,u,y,"\u201c","``");n(l,u,y,"\u201c","\\textquotedblleft");n(l,u,y,"\u201d","''");n(l,u,y,"\u201d","\\textquotedblright");n(i,u,y,"\xb0","\\degree");n(l,u,y,"\xb0","\\degree");n(i,u,h,"\xa3","\\pounds");n(i,u,h,"\xa3","\\mathsterling",true);n(l,u,h,"\xa3","\\pounds");n(l,u,h,"\xa3","\\textsterling");n(i,o,y,"\u2720","\\maltese");n(l,o,y,"\u2720","\\maltese");n(l,u,b,"\xa0","\\ ");n(l,u,b,"\xa0"," ");n(l,u,b,"\xa0","~");var x='0123456789/@."';for(var w=0;w<x.length;w++){var k=x.charAt(w);n(i,u,y,k,k)}var M='0123456789!@*()-=+[]<>|";:?/.,';for(var _=0;_<M.length;_++){var S=M.charAt(_);n(l,u,y,S,S)}var z="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(var T=0;T<z.length;T++){var C=z.charAt(T);n(i,u,h,C,C);n(l,u,y,C,C)}for(var A=192;A<=214;A++){var O=String.fromCharCode(A);n(i,u,h,O,O);n(l,u,y,O,O)}for(var N=216;N<=246;N++){var L=String.fromCharCode(N);n(i,u,h,L,L);n(l,u,y,L,L)}for(var j=248;j<=255;j++){var E=String.fromCharCode(j);n(i,u,h,E,E);n(l,u,y,E,E)}for(var q=1040;q<=1103;q++){var P=String.fromCharCode(q);n(l,u,y,P,P)}n(l,u,y,"\u2013","\u2013");n(l,u,y,"\u2014","\u2014");n(l,u,y,"\u2018","\u2018");n(l,u,y,"\u2019","\u2019");n(l,u,y,"\u201c","\u201c");n(l,u,y,"\u201d","\u201d")},{}],126:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=r.hangulRegex=/[\uAC00-\uD7AF]/;var n=r.cjkRegex=/[\u3000-\u30FF\u4E00-\u9FAF\uAC00-\uD7AF\uFF00-\uFF60]/},{}],127:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});r.calculateSize=r.validUnit=undefined;var a=e("./ParseError");var n=u(a);var i=e("./Options");var l=u(i);function u(e){return e&&e.__esModule?e:{default:e}}var o={pt:1,mm:7227/2540,cm:7227/254,in:72.27,bp:803/800,pc:12,dd:1238/1157,cc:14856/1157,nd:685/642,nc:1370/107,sp:1/65536,px:803/800};var s={ex:true,em:true,mu:true};var f=r.validUnit=function e(t){if(typeof t!=="string"){t=t.unit}return t in o||t in s||t==="ex"};var d=r.calculateSize=function e(t,r){var a=void 0;if(t.unit in o){a=o[t.unit]/r.fontMetrics().ptPerEm/r.sizeMultiplier}else if(t.unit==="mu"){a=r.fontMetrics().cssEmPerMu}else{var i=void 0;if(r.style.isTight()){i=r.havingStyle(r.style.text())}else{i=r}if(t.unit==="ex"){a=i.fontMetrics().xHeight}else if(t.unit==="em"){a=i.fontMetrics().quad}else{throw new n.default("Invalid unit: '"+t.unit+"'")}if(i!==r){a*=i.sizeMultiplier/r.sizeMultiplier}}return Math.min(t.number*a,r.maxSize)}},{"./Options":83,"./ParseError":84}],128:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});var a=Array.prototype.indexOf;var n=function e(t,r){if(t==null){return-1}if(a&&t.indexOf===a){return t.indexOf(r)}var n=t.length;for(var i=0;i<n;i++){if(t[i]===r){return i}}return-1};var i=function e(t,r){return n(t,r)!==-1};var l=function e(t,r){return t===undefined?r:t};var u=/([A-Z])/g;var o=function e(t){return t.replace(u,"-$1").toLowerCase()};var s={"&":"&amp;",">":"&gt;","<":"&lt;",'"':"&quot;","'":"&#x27;"};var f=/[&><"']/g;function d(e){return String(e).replace(f,function(e){return s[e]})}var c=void 0;if(typeof document!=="undefined"){var h=document.createElement("span");if("textContent"in h){c=function e(t,r){t.textContent=r}}else{c=function e(t,r){t.innerText=r}}}function v(e){c(e,"")}r.default={contains:i,deflt:l,escape:d,hyphenate:o,indexOf:n,setTextContent:c,clearNode:v}},{}]},{},[1])(1)});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
/* mousetrap v1.6.1 craig.is/killing/mice */
(function(r,v,f){function w(a,b,g){a.addEventListener?a.addEventListener(b,g,!1):a.attachEvent("on"+b,g)}function A(a){if("keypress"==a.type){var b=String.fromCharCode(a.which);a.shiftKey||(b=b.toLowerCase());return b}return p[a.which]?p[a.which]:t[a.which]?t[a.which]:String.fromCharCode(a.which).toLowerCase()}function F(a){var b=[];a.shiftKey&&b.push("shift");a.altKey&&b.push("alt");a.ctrlKey&&b.push("ctrl");a.metaKey&&b.push("meta");return b}function x(a){return"shift"==a||"ctrl"==a||"alt"==a||
"meta"==a}function B(a,b){var g,c,d,f=[];g=a;"+"===g?g=["+"]:(g=g.replace(/\+{2}/g,"+plus"),g=g.split("+"));for(d=0;d<g.length;++d)c=g[d],C[c]&&(c=C[c]),b&&"keypress"!=b&&D[c]&&(c=D[c],f.push("shift")),x(c)&&f.push(c);g=c;d=b;if(!d){if(!n){n={};for(var q in p)95<q&&112>q||p.hasOwnProperty(q)&&(n[p[q]]=q)}d=n[g]?"keydown":"keypress"}"keypress"==d&&f.length&&(d="keydown");return{key:c,modifiers:f,action:d}}function E(a,b){return null===a||a===v?!1:a===b?!0:E(a.parentNode,b)}function c(a){function b(a){a=
a||{};var b=!1,l;for(l in n)a[l]?b=!0:n[l]=0;b||(y=!1)}function g(a,b,u,e,c,g){var l,m,k=[],f=u.type;if(!h._callbacks[a])return[];"keyup"==f&&x(a)&&(b=[a]);for(l=0;l<h._callbacks[a].length;++l)if(m=h._callbacks[a][l],(e||!m.seq||n[m.seq]==m.level)&&f==m.action){var d;(d="keypress"==f&&!u.metaKey&&!u.ctrlKey)||(d=m.modifiers,d=b.sort().join(",")===d.sort().join(","));d&&(d=e&&m.seq==e&&m.level==g,(!e&&m.combo==c||d)&&h._callbacks[a].splice(l,1),k.push(m))}return k}function f(a,b,c,e){h.stopCallback(b,
b.target||b.srcElement,c,e)||!1!==a(b,c)||(b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopPropagation?b.stopPropagation():b.cancelBubble=!0)}function d(a){"number"!==typeof a.which&&(a.which=a.keyCode);var b=A(a);b&&("keyup"==a.type&&z===b?z=!1:h.handleKey(b,F(a),a))}function p(a,c,u,e){function l(c){return function(){y=c;++n[a];clearTimeout(r);r=setTimeout(b,1E3)}}function g(c){f(u,c,a);"keyup"!==e&&(z=A(c));setTimeout(b,10)}for(var d=n[a]=0;d<c.length;++d){var m=d+1===c.length?g:l(e||
B(c[d+1]).action);q(c[d],m,e,a,d)}}function q(a,b,c,e,d){h._directMap[a+":"+c]=b;a=a.replace(/\s+/g," ");var f=a.split(" ");1<f.length?p(a,f,b,c):(c=B(a,c),h._callbacks[c.key]=h._callbacks[c.key]||[],g(c.key,c.modifiers,{type:c.action},e,a,d),h._callbacks[c.key][e?"unshift":"push"]({callback:b,modifiers:c.modifiers,action:c.action,seq:e,level:d,combo:a}))}var h=this;a=a||v;if(!(h instanceof c))return new c(a);h.target=a;h._callbacks={};h._directMap={};var n={},r,z=!1,t=!1,y=!1;h._handleKey=function(a,
c,d){var e=g(a,c,d),k;c={};var h=0,l=!1;for(k=0;k<e.length;++k)e[k].seq&&(h=Math.max(h,e[k].level));for(k=0;k<e.length;++k)e[k].seq?e[k].level==h&&(l=!0,c[e[k].seq]=1,f(e[k].callback,d,e[k].combo,e[k].seq)):l||f(e[k].callback,d,e[k].combo);e="keypress"==d.type&&t;d.type!=y||x(a)||e||b(c);t=l&&"keydown"==d.type};h._bindMultiple=function(a,b,c){for(var d=0;d<a.length;++d)q(a[d],b,c)};w(a,"keypress",d);w(a,"keydown",d);w(a,"keyup",d)}if(r){var p={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",
18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},t={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},D={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},C={option:"alt",command:"meta","return":"enter",
escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},n;for(f=1;20>f;++f)p[111+f]="f"+f;for(f=0;9>=f;++f)p[f+96]=f.toString();c.prototype.bind=function(a,b,c){a=a instanceof Array?a:[a];this._bindMultiple.call(this,a,b,c);return this};c.prototype.unbind=function(a,b){return this.bind.call(this,a,function(){},b)};c.prototype.trigger=function(a,b){if(this._directMap[a+":"+b])this._directMap[a+":"+b]({},a);return this};c.prototype.reset=function(){this._callbacks={};
this._directMap={};return this};c.prototype.stopCallback=function(a,b){return-1<(" "+b.className+" ").indexOf(" mousetrap ")||E(b,this.target)?!1:"INPUT"==b.tagName||"SELECT"==b.tagName||"TEXTAREA"==b.tagName||b.isContentEditable};c.prototype.handleKey=function(){return this._handleKey.apply(this,arguments)};c.addKeycodes=function(a){for(var b in a)a.hasOwnProperty(b)&&(p[b]=a[b]);n=null};c.init=function(){var a=c(v),b;for(b in a)"_"!==b.charAt(0)&&(c[b]=function(b){return function(){return a[b].apply(a,
arguments)}}(b))};c.init();r.Mousetrap=c;"undefined"!==typeof module&&module.exports&&(module.exports=c);"function"===typeof define&&define.amd&&define(function(){return c})}})("undefined"!==typeof window?window:null,"undefined"!==typeof window?document:null);

},{}],3:[function(require,module,exports){
var AST = {};

AST.to_eqlist = function(ast){
    var comparators = ["=","!=","<=",">=","<",">"];
    if(ast[1].length == 0 || comparators.indexOf(ast[1][0][0]) < 0) return [ast];
    return AST.to_eqlist(ast[1][0]).concat([[ast[0],[ast[1][0][1][1],ast[1][1]]]]);
}

AST.to_text = function(ast){
    var functions = {};
    functions["bracket"] = function(args){return "("+args[0]+")";};
    functions["="] = function(args){return args[0]+" = "+args[1];};
    functions["!="] = function(args){return args[0]+" != "+args[1];};
    functions["<="] = function(args){return args[0]+" <= "+args[1];};
    functions[">="] = function(args){return args[0]+" >= "+args[1];};
    functions["<"] = function(args){return args[0]+" < "+args[1];};
    functions[">"] = function(args){return args[0]+" > "+args[1];};
    functions["*"] = function(args){return "("+args[0]+" * "+args[1]+")";};
    functions["+"] = function(args){return "("+args[0]+" + "+args[1]+")";};
    functions["/"] = function(args){return "("+args[0]+" / "+args[1]+")";};
    functions["fraction"] = function(args){return "("+args[0]+" / "+args[1]+")";};
    functions["-"] = function(args){return args.length == 1 ? "-"+args[0] : "("+args[0]+" - "+args[1]+")";};
    functions["val"] = function(args){return args[0]+"";};
    functions["var"] = function(args){return args[0];};
    functions["subscript"] = function(args){return "("+args[0]+"_"+args[1]+")";};
    functions["exponential"] = function(args){return "("+args[0]+"^"+args[1]+")";};
    functions["factorial"] = function(args){return "("+args[0]+")!";};
    functions["_default"] = function(name, args){return name + "(" + args.join(",") + ")";};
    return AST.eval(ast, functions);
}

AST.to_xml = function(ast, symbols, symbol_to_node){
    var prepend_str = function(doc, str){
        doc.documentElement.firstChild.textContent = str + doc.documentElement.firstChild.textContent;
    }
    var append_str = function(doc, str){
        doc.documentElement.lastChild.textContent += str;
    }
    var tail = function(doc){
        var n = doc.documentElement.lastChild;
        return n.firstChild.textContent.slice(-1);
    }
    var head = function(doc){
        var n = doc.documentElement.firstChild;
        return n.firstChild.textContent.slice(0,1);
    }
    var append_doc = function(doc, doc2){
        var n = doc.documentElement.lastChild;
        var nn = doc2.documentElement.firstChild
        n.firstChild.textContent += nn.firstChild.textContent;
        for(nn = nn.nextSibling; nn; nn = nn.nextSibling){
            n.parentNode.insertBefore(nn.cloneNode(true),null); 
        }
    }
    var ensure_text_nodes = function(base){
        var l = base.getElementsByTagName("e");
        for(var i = 0; i < l.length; i++){
            if(!(l[i].firstChild)) l[i].appendChild(base.createTextNode(""));
        }
    }
    var get_symbol = function(name, symbols){
        for(var s in symbols){
            if(symbols[s].attrs.type == name) return symbols[s];
        }
    }
    var get_content_array = function(args){
        var content = {};
        for(var i = 0; i < args.length; i++){
            content[i] = [];
            if(args[i].documentElement.nodeName == "l") content[i].push(args[i].documentElement);
            else for(var nn = args[i].documentElement.firstChild; nn; nn = nn.nextSibling) content[i].push(nn);
        }
        return content;
    }
    var binop_low = function(args, op, parent){
        var d = args[0].cloneNode(true);
        append_str(d, op);
        append_doc(d, args[1].cloneNode(true));
        if(parent && (parent[0] == "*" || (parent[0] == "-" && parent[1].length == 1)))
            return make_sym("bracket", [d]);
        else
            return d;
    }
    var binop_high = function(args, op){
        var d = args[0].cloneNode(true);
        append_doc(d, make_sym(op,[]));
        append_doc(d, args[1].cloneNode(true));
        return d;
    }
    var make_sym = function(name, args){
        var sym = get_symbol(name, symbols);
        if(!sym) throw "Unrecognised symbol: "+name;
        var base = (new window.DOMParser()).parseFromString("<c><e></e><e></e></c>", "text/xml");
        ensure_text_nodes(base);
        var e0 = base.documentElement.firstChild;
        var content = get_content_array(args);
        var f = symbol_to_node(sym, content, base)['f'];
        e0.parentNode.insertBefore(f,e0.nextSibling);
        ensure_text_nodes(base);
        return base;
    }
    var functions = {};

    var ops = ["<",">","=","<=",">=","!="];
    for(var i = 0; i < ops.length; i++){
        functions[ops[i]] = function(o){ return function(args){ return binop_high(args, o); }}(ops[i]);
    }
    functions["*"] = function(args){
        var d = args[0].cloneNode(true);
	if(/[\d.]/.test(tail(args[0])) && /[\d.]/.test(head(args[1]))) append_doc(d, make_sym("*",[]));
        append_doc(d, args[1].cloneNode(true));
        return d;
    };
    functions["/"] = function(args){
        return make_sym("fraction",args);
    };
    functions["+"] = function(args, parent){ return binop_low(args, "+", parent); };
    functions["-"] = function(args, parent) {
        if(args.length == 1) {
            var d = args[0].cloneNode(true);
            prepend_str(d, "-");
            return d;
        }
        else {
            return binop_low(args, "-", parent);
        }
    }
    functions["val"] = function(args){ return (new window.DOMParser()).parseFromString("<c><e>" + args[0] + "</e></c>", "text/xml");};
    functions["var"] = function(args){
        if(args[0].length == 1) return (new window.DOMParser()).parseFromString("<c><e>" + args[0] + "</e></c>", "text/xml");
        else return make_sym(args[0], {});
    };
    functions["list"] = function(args){
        var base = (new window.DOMParser()).parseFromString("<l></l>", "text/xml");
        for(var i = 0; i < args.length; i++){
            base.documentElement.appendChild(args[i].documentElement.cloneNode(true));
        }
        base.documentElement.setAttribute("s",String(args.length))
        return base;
    };
    // var comparators = {"<":"less",">":"greater","=":"eq","!=":"neq",">=":"geq","<=":"leq"};
    // for(var c in comparators){
    //     functions[c] = function(args){
    //         return make_sym(comparators[c], args);
    //     }
    // }
    functions["_default"] = function(name, args){
        return make_sym(name, args);
    }
    var ans = AST.eval(ast, functions);
    var new_base = (new window.DOMParser()).parseFromString("<m></m>", "text/xml");
    for(var nn = ans.documentElement.firstChild; nn; nn = nn.nextSibling){
        new_base.documentElement.insertBefore(nn.cloneNode(true),null);
    }
    return new_base;

}

AST.get_nodes = function(ast, name){
    if(ast.length < 2) return [];
    var ans = [];
    if(ast[0] == name) ans.push(ast[1]);
    if(ast[0] == "var" || ast[0] == "val") return ans;
    for(var i = 0; i < ast[1].length; i++) ans = ans.concat(AST.get_nodes(ast[1][i], name));
    return ans;
}

AST.get_vars = function(ast){
    var vars = {};
    var ans = [];
    var l = AST.get_nodes(ast, "var");
    for(var i = 0; i < l.length; i++) vars[l[i][0]] = true;
    for(var x in vars) ans.push(x);
    return ans;
}

AST.to_function = function(ast, functions){
    functions = functions || {}
    var defaults = {}
    defaults["*"] = function(args){return function(vars){return args[0](vars)*args[1](vars)};};
    defaults["+"] = function(args){return function(vars){return args[0](vars)+args[1](vars)};};
    defaults["fraction"] = function(args){return function(vars){return args[0](vars)/args[1](vars)};};
    defaults["/"] = function(args){return function(vars){return args[0](vars)/args[1](vars)};};
    defaults["-"] = function(args){return args.length == 1 ? function(vars){return -args[0](vars)} : function(vars){return args[0](vars)-args[1](vars)};};
    defaults["val"] = function(args){return function(){ return args[0]; };};
    defaults["var"] = function(args){return function(vars){ if(args[0] == "pi") return Math.PI; if(args[0] == "e") return Math.E; return vars[args[0]]; };};
    defaults["exponential"] = function(args){return function(vars){return Math.pow(args[0](vars),args[1](vars))};};
    defaults["squareroot"] = function(args){return function(vars){return Math.sqrt(args[0](vars))};};
    defaults["absolutevalue"] = function(args){return function(vars){return Math.abs(args[0](vars))};};
    defaults["sin"] = function(args){return function(vars){return Math.sin(args[0](vars))};};
    defaults["cos"] = function(args){return function(vars){return Math.cos(args[0](vars))};};
    defaults["tan"] = function(args){return function(vars){return Math.tan(args[0](vars))};};
    defaults["log"] = function(args){return function(vars){return Math.log(args[0](vars))};};
    for(var n in defaults) if(!functions[n]) functions[n] = defaults[n];
    return {"function":AST.eval(ast, functions),"vars":AST.get_vars(ast)};
}

AST.eval = function(ast, functions, parent){
    ans = null;
    if(!functions["_default"]) functions["_default"] = function(name, args){ throw Error("Function not implemented: " + name + "(" + args + ")");}
    
    var args = []
    for(var i = 0; i < ast[1].length; i++){
        if(Object.prototype.toString.call(ast[1][i]) === '[object Array]'){
            args.push(AST.eval(ast[1][i], functions, ast));
        }
        else{
            args.push(ast[1][i]);
        }
    }
    var ans = null;
    if(functions[ast[0]]) ans = functions[ast[0]](args, parent);
    else if(functions["_default"]) ans = functions["_default"](ast[0], args, parent);
    
    return ans
}

module.exports = AST;

},{}],4:[function(require,module,exports){
var katex = require('../lib/katex/katex-modified.min.js');
var AST = require('./ast.js');
var Symbols = require('./symbols.js');
var Utils = require('./utils.js');
var Parsers = require('./parser.js');
var Version = require('./version.js');

/**
   @class
   @classdesc A class representing a Guppy document.  To access this
   class, use `Guppy.Doc`.  To get the document for a particular guppy
   instance, say called `"guppy1"`, do `Guppy("guppy1").doc()`.
   @param {string} [doc=<m><e></e></m>] - An XML string representing the document
   @constructor 
 */
var Doc = function(doc, type){
    type = type || "xml";
    if(type == "xml") this.set_content(doc || "<m><e></e></m>");
    else if(type == "latex") this.import_latex(doc);
    else if(type == "text") this.import_text(doc);
    else if(type == "ast") this.import_ast(doc);
    if(this.root().hasAttribute("v") && this.root().getAttribute("v") != Version.DOC_VERSION)
	throw Version.DOC_ERROR;
    else
	this.root().setAttribute("v",Version.DOC_VERSION);
}

Doc.prototype.is_small = function(nn){
    var n = nn.parentNode;
    while(n != null && n.nodeName != 'm'){
        if(n.getAttribute("small") == "yes") return true;
        n = n.parentNode
        while(n != null && n.nodeName != 'c') n = n.parentNode;
    }
    return false;
}

Doc.prototype.ensure_text_nodes = function(){
    var l = this.base.getElementsByTagName("e");
    for(var i = 0; i < l.length; i++){
        if(!(l[i].firstChild)) l[i].appendChild(this.base.createTextNode(""));
    }
}

Doc.prototype.is_blank = function(){
    if(this.base.getElementsByTagName("f").length > 0) return false;
    var l = this.base.getElementsByTagName("e");
    if(l.length == 1 && (!(l[0].firstChild) || l[0].firstChild.textContent == "")) return true;
    return false;
}


/** 
    Get the document as a DOM object
    @memberof Doc
    @returns {Element}
*/
Doc.prototype.root = function(){
    return this.base.documentElement;
}

/** 
    Get the content of the document as a string
    @memberof Doc
    @param {string} t - The rendering method to use ("latex", "text", "ast" (for syntax tree), or "xml" (for internal XML representation))
    @returns {string}
*/
Doc.prototype.get_content = function(t,r){
    if(t == "xml") return (new XMLSerializer()).serializeToString(this.base);
    else if(t == "ast") return JSON.stringify(this.syntax_tree());
    else if(t == "text") return AST.to_text(this.syntax_tree());
    else if(t == "function") return AST.to_function(this.syntax_tree());
    else if(t == "eqns") return JSON.stringify(AST.to_eqlist(this.syntax_tree()));
    else return this.manual_render(t,this.root(),r);
}

/** 
    Evaluate the document using user-supplied functions to interpret symbols
    @memberof Doc
    @param {Object} evaluators - A dictionary where each key is a node
    type in the AST ("var", "val", "sin", "cos", etc.) and the
    corresponding value is a function that takes a list of argument
    (the results of evaluating that AST node's arguments) as well as,
    optionally, a second argument for the parent AST node to the one
    currently being evaluated.
    @returns {Object}
*/
Doc.prototype.evaluate = function(evaluators){
    return AST.eval(this.syntax_tree(), evaluators);
}

Doc.prototype.import_text = function(text, syms, s2n){
    var ast = Parsers.TextParser.tokenise_and_parse(text);
    this.import_ast(ast, syms, s2n);
}

Doc.prototype.import_latex = function(text, syms, s2n){
    var ast = Parsers.LaTeXParser.tokenise_and_parse(text);
    this.import_ast(ast, syms, s2n);
}

Doc.prototype.import_ast = function(ast, syms, s2n){
    syms = syms || Symbols.symbols;
    s2n = s2n || Symbols.symbol_to_node;
    var doc = AST.to_xml(ast, syms, s2n);
    this.base = doc;
    this.ensure_text_nodes();
}

Doc.prototype.syntax_tree = function(n){
    n = n || this.root()
    if(n.nodeName == "f"){
        var ans = {"args":[], "kwargs":{}};
        ans['value'] = n.getAttribute("type");
        ans['type'] = "function";
        if(n.hasAttribute("ast_value")) ans['value'] = n.getAttribute("ast_value");
        if(n.hasAttribute("ast_type")) ans['type'] = n.getAttribute("ast_type");
        else if(Utils.is_char(n)) ans['type'] = "name";
        
        var iterator = this.xpath_list("./*[name()='c' or name()='l']", n)
        for(var nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()){
            //if(nn.hasAttribute("name")) ans.kwargs[nn.getAttribute("name")] = this.syntax_tree(nn)
            //else ans.args.push(this.syntax_tree(nn))
            ans.args.push(this.syntax_tree(nn))
        }
    }
    else if(n.nodeName == "l"){
        ans = [];
        for(nn = n.firstChild; nn != null; nn = nn.nextSibling){
        ans.push(this.syntax_tree(nn));
        }
        ans = ["list",ans];
    }
    else if(n.nodeName == "c" || n.nodeName == "m"){
        if(n.hasAttribute("mode") && n.getAttribute("mode") == "text"){
            ans = n.firstChild.firstChild.textContent;
        }
        else{
            var tokens = []
            for(nn = n.firstChild; nn != null; nn = nn.nextSibling){
                if(nn.nodeName == "e"){
                    tokens = tokens.concat(Parsers.EParser.tokenise(nn.firstChild.textContent));
                }
                else if(nn.nodeName == "f"){
                    tokens.push(this.syntax_tree(nn));
                }
            }
            ans = Parsers.EParser.parse(tokens);
        }
    }
    return ans;
}

Doc.prototype.xpath_node = function(xpath, node){
    node = node || this.root()
    return this.base.evaluate(xpath, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

Doc.prototype.xpath_list = function(xpath, node){
    node = node || this.root()
    return this.base.evaluate(xpath, node, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
}

/** 
    Get the names of symbols used in this document
    @memberof Doc
    @param {string[]} [groups] - A list of groups you want strings for
    @returns {string[]}
*/
Doc.prototype.get_symbols = function(groups){
    var types = {};
    var ans = [];
    var groups_selector = "//f";
    if(groups) groups_selector += "[" + groups.map(function(){ return ""; }).join(" or ") + "]";
    var iterator = this.xpath_list(groups_selector)
    for(var nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext())
        types[nn.getAttribute("type")] = true;
    for(var t in types)
        ans.push(t);
    return ans;
}

/** 
    Set the content of the document
    @memberof Doc
    @param {string} xml_data - An XML string representing the content of the document
*/
Doc.prototype.set_content = function(xml_data){
    this.base = (new window.DOMParser()).parseFromString(xml_data, "text/xml");
    this.ensure_text_nodes();
}

Doc.prototype.auto_bracket = function(n){
    var e0 = n.firstChild;
    var e1 = n.lastChild;
    if(n.childElementCount == 3 && e0.firstChild.textContent == "" && e1.firstChild.textContent == ""){ // single f child, all e children empty
        var f = e0.nextSibling;
	var cs = 0;
	var c = null;
	// Count immediate children of f that are c nodes in cs and store the last one in c
	for(var nn = f.firstChild; nn; nn = nn.nextSibling) if(nn.tagName == "c"){ c = nn; cs++; }
        if(cs == 1 && c.getAttribute("is_bracket") == "yes") return false; // if the f child is a bracket, don't bracket
        if(Utils.is_char(f) && e0.getAttribute("current") != "yes" && e0.getAttribute("temp") != "yes" && e1.getAttribute("current") != "yes" && e1.getAttribute("temp") != "yes") return false; // if the f child is a character and not current or temp cursor location, don't bracket
    }
    else if(n.childElementCount == 1){ // Single e child
        var s = e0.firstChild.textContent;
        if(s.length != 1 && Number(s)+"" != s) return true; // If content is neither a single character nor a number, bracket it
        if(e0.getAttribute("current") == "yes" || e0.getAttribute("temp") == "yes") return true; // If content has the cursor or temp cursor, bracket it
        return false;
    }
    return true;
}

Doc.prototype.manual_render = function(t,n,r){
    var ans = "";
    var nn = null;
    var i = null;
    var spacer = t == "latex" ? " " : "";
    if(n.nodeName == "e"){
        if(t == "latex" && r){
            ans = n.getAttribute("render");
        }
        else{
            ans = n.firstChild.textContent;
        }
    }
    else if(n.nodeName == "f"){
        var real_type = (t == "latex" && this.is_small(n)) ? "small_latex" : t;
        nn = this.xpath_node("./b[@p='"+real_type+"']", n) || this.xpath_node("./b[@p='"+t+"']", n);
        if(nn) ans = this.manual_render(t,nn,r);
    }
    else if(n.nodeName == "b"){
        var cs = []
        i = 1;
        var par = n.parentNode;
        for(nn = par.firstChild; nn != null; nn = nn.nextSibling)
            if(nn.nodeName == "c" || nn.nodeName == "l") cs[i++] = this.manual_render(t,nn,r);
        for(nn = n.firstChild; nn != null; nn = nn.nextSibling){
            if(nn.nodeType == 3) ans += nn.textContent + spacer;
            else if(nn.nodeType == 1){
                if(nn.hasAttribute("d")){
                    var dim = parseInt(nn.getAttribute("d"));
                    var joiner = function(d,l){
                        if(d > 1) for(var k = 0; k < l.length; k++) l[k] = joiner(d-1,l[k]);
                        return l.join(nn.getAttribute('sep'+(d-1)));
                    }
                ans += joiner(dim,cs[parseInt(nn.getAttribute("ref"))]) + spacer;
                }
                else ans += cs[parseInt(nn.getAttribute("ref"))] + spacer;
            }
        }
    }
    else if(n.nodeName == "l"){
        ans = [];
        i = 0;
        for(nn = n.firstChild; nn != null; nn = nn.nextSibling){
            ans[i++] = this.manual_render(t,nn,r);
        }
    }
    else if(n.nodeName == "c" || n.nodeName == "m"){
        for(nn = n.firstChild; nn != null; nn = nn.nextSibling)
            ans += this.manual_render(t,nn,r) + spacer;
        if(t == "latex" && n.getAttribute("bracket") == "yes" && this.auto_bracket(n)) {
            ans = "\\left("+ans+"\\right)";
        }
    }
    return ans;
}

/** 
    Render all guppy documents on the page. 
    @memberof Doc
*/
Doc.render_all = function(t, delim){
    var l,i,n,d,s,ans = [];
    if(!t || t == "xml"){
        l = document.getElementsByTagName("script");
        for(i = 0; i < l.length; i++){
            if(l[i].getAttribute("type") == "text/guppy_xml"){
                n = l[i];
                d = new Doc(n.innerHTML);
                s = document.createElement("span");
		var len = ans.length;
		var new_id = "guppy-"+t+"-render-"+len;
		while(document.getElementById(new_id)) new_id = "guppy-xml-render-"+(++len);
                s.setAttribute("id",new_id);
                s.setAttribute("class","guppy-render");
                katex.render(d.get_content("latex"), s);
                n.parentNode.insertBefore(s, n);
                n.parentNode.removeChild(n);
                ans.push({"container":s, "doc":d})
            }
        }
    }
    else {
        var subs = function(node) {
            if(!node) return;
            var excludeElements = ['script', 'style', 'iframe', 'canvas'];
            do {
                switch (node.nodeType) {
                case 1:
                    // Don't process KaTeX elements, Guppy instances, Javascript, or CSS
                    if (excludeElements.indexOf(node.tagName.toLowerCase()) > -1 || (" "+node.getAttribute("class")+" ").indexOf(" katex ") > -1 || (""+node.getAttribute("class")).indexOf("guppy") > -1) {
                        continue;
                    }
                    subs(node.firstChild);
                    break;
                case 3:
                    var text_node = node;
                    var offset = text_node.textContent.indexOf(delim);
                    while(offset > -1){
                        var next = text_node.textContent.substring(offset+delim.length).indexOf(delim);
                        if(next == -1) break;
                        var before = text_node.textContent.substring(0,offset);
                        var content = text_node.textContent.substring(offset+delim.length,offset+delim.length+next);
                        var after = text_node.textContent.substring(offset+delim.length+next+delim.length);

                        // Make the span to render the doc in
                        var s = document.createElement("span");
			var l = ans.length;
			var new_id = "guppy-"+t+"-render-"+l;
			while(document.getElementById(new_id)) new_id = "guppy-"+t+"-render-"+(++l);
                        s.setAttribute("id",new_id);
			s.setAttribute("class","guppy-render");

			try {
                            // Create the document
                            d = new Doc(content,t);
                            
                            // Render the doc
                            katex.render(d.get_content("latex"), s);
			}
			catch (e) {
			    s.innerHTML = "ERROR: "+e.message;
			}
                        var new_node = document.createTextNode(after)
                        text_node.parentNode.insertBefore(document.createTextNode(before), text_node);
                        text_node.parentNode.insertBefore(s, text_node);
                        text_node.parentNode.insertBefore(new_node, text_node);
                        text_node.parentNode.removeChild(text_node);
                        text_node = new_node;
                        ans.push({"id":new_id, "doc":d});

                        offset = text_node.textContent.indexOf(delim);
                    }
                    break;
		default:
                    break;
                }
            } while ((node = node.nextSibling));

        }
        delim = delim || "$$";
        subs(document.documentElement);
    }
    return ans;
}

/** 
    Render a given document into a specified HTML element.
    @param {string} doc - A GuppyXML string to be rendered
    @param {string} target_id - The ID of the HTML element to render into
    @memberof Doc
*/
Doc.render = function(doc, target_id){
    var d = new Doc(doc);
    var target = document.getElementById(target_id);
    katex.render(d.get_content("latex"), target);
    return {"container":target, "doc":d};
}


module.exports = Doc;

},{"../lib/katex/katex-modified.min.js":1,"./ast.js":3,"./parser.js":7,"./symbols.js":9,"./utils.js":10,"./version.js":11}],5:[function(require,module,exports){
var Utils = require('./utils.js');
var Doc = require('./doc.js');
var Symbols = require('./symbols.js');
var Settings = require('./settings.js');

String.prototype.splice = function(idx, s){ return (this.slice(0,idx) + s + this.slice(idx)); };
String.prototype.splicen = function(idx, s, n){ return (this.slice(0,idx) + s + this.slice(idx+n));};
String.prototype.search_at = function(idx, s){ return (this.substring(idx-s.length,idx) == s); };

/**
 * @class
 * @classdesc The engine for scripting the editor.  To access the
 * engine for scripting a particular Guppy instance, say called
 * `"guppy1"`, do `Guppy("guppy1").engine`.  
 *
 * At that point, you can, for example, move that editor's cursor
 * one spot to the left with `Guppy("guppy1").engine.left()`.
*/
var Engine = function(config){
    config = config || {};
    var events = config['events'] || {};
    var settings = config['settings'] || {};
    this.parent = config['parent'];
    this.id = this.parent.editor.id;
    
    this.ready = false;
    this.events = {};
    this.settings = {};
    
    var evts = ["ready", "change", "left_end", "right_end", "done", "completion", "debug", "error", "focus"];
    
    for(var i = 0; i < evts.length; i++){
        var e = evts[i];
        if(e in events) this.events[e] = e in events ? events[e] : null;
    }

    var opts = ["blank_caret", "empty_content", "blacklist", "autoreplace", "cliptype"];
    
    for(var j = 0; j < opts.length; j++){
        var p = opts[j];
        if(p in settings) this.settings[p] = settings[p];
    }

    this.symbols = {};
    this.doc = new Doc(settings["xml_content"]);
    
    this.current = this.doc.root().firstChild;
    this.caret = 0;
    this.space_caret = 0;
    this.sel_start = null;
    this.sel_end = null;
    this.undo_data = [];
    this.undo_now = -1;
    this.sel_status = Engine.SEL_NONE;
    this.checkpoint();
    if(Engine.ready && !this.ready){
        this.ready = true;
        this.symbols = JSON.parse(JSON.stringify(Symbols.symbols));
        this.fire_event("ready");
    }
}

Engine.ready = false;
Engine.SEL_NONE = 0;
Engine.SEL_CURSOR_AT_START = 1;
Engine.SEL_CURSOR_AT_END = 2;
Engine.clipboard = null;

Engine.prototype.setting = function(name){
    return name in this.settings ? this.settings[name] : Settings.config.settings[name];
}

Engine.prototype.event = function(name){
    return name in this.events ? this.events[name] : Settings.config.events[name];
}

/** 
    Get the content of the editor
    @memberof Engine
    @param {string} t - The type of content to render ("latex", "text", or "xml").
*/
Engine.prototype.get_content = function(t,r){
    return this.doc.get_content(t,r);
}

/** 
    Set the XML content of the editor
    @memberof Engine
    @param {string} xml_data - An XML string of the content to place in the editor
*/
Engine.prototype.set_content = function(xml_data){
    this.set_doc(new Doc(xml_data));
}

/** 
    Set the document of the editor
    @memberof Engine
    @param {Doc} doc - The Doc that will be the editor's source
*/
Engine.prototype.set_doc = function(doc){
    this.doc = doc;
    this.current = this.doc.root().firstChild;
    this.caret = 0;
    this.sel_start = null;
    this.sel_end = null;
    this.undo_data = [];
    this.undo_now = -1;
    this.sel_status = Engine.SEL_NONE;
    this.checkpoint();
}

Engine.prototype.import_text = function(text){
    this.doc.import_text(text, this.symbols);
    this.set_doc(this.doc);
}

Engine.prototype.import_latex = function(text){
    this.doc.import_latex(text, this.symbols);
    this.set_doc(this.doc);
}

Engine.prototype.import_ast = function(ast){
    this.doc.import_ast(ast, this.symbols);
    this.set_doc(this.doc);
}

Engine.prototype.fire_event = function(event, args){
    args = args || {};
    args.target = this.parent || this;
    args.type = event;
    var ev = this.event(event);
    if(ev && this.ready && Engine.ready) ev(args);
}

/** 
    Remove a symbol from this instance of the editor.
    @memberof Engine
    @param {string} name - The name of the symbol to remove.
*/
Engine.prototype.remove_symbol = function(name){
    if(this.symbols[name]) delete this.symbols[name];
}

/** 
    Add a symbol to this instance of the editor.
    @memberof Engine
    @param {string} name - param
    @param {Object} symbol - If `template` is present, this is the
    template arguments.  Otherwise, it is a complete specification
    of the symbol, the format for which can be found in the
    documentation for Guppy.add_global_symbol.
    @param {string} [template] - The name of the template to use.
*/
Engine.prototype.add_symbol = function(name, symbol){
    this.symbols[name] = symbol;
}

Engine.prototype.select_to = function(loc, sel_cursor, sel_caret, mouse){
    if(loc.current == sel_cursor && loc.caret == sel_caret){
        this.current = loc.current;
        this.caret = loc.caret;
        this.sel_status = Engine.SEL_NONE;
    }
    else if(loc.pos == "left"){
        this.sel_end = {"node":sel_cursor,"caret":sel_caret};
        this.current = loc.current;
        this.caret = loc.caret;
        this.set_sel_boundary(Engine.SEL_CURSOR_AT_START, mouse);
    }
    else if(loc.pos == "right"){
        this.sel_start = {"node":sel_cursor,"caret":sel_caret};
        this.current = loc.current;
        this.caret = loc.caret;
        this.set_sel_boundary(Engine.SEL_CURSOR_AT_END, mouse);
    }
}

Engine.prototype.set_sel_start = function(){
    this.sel_start = {"node":this.current, "caret":this.caret};
}

Engine.prototype.set_sel_end = function(){
    this.sel_end = {"node":this.current, "caret":this.caret};
}

Engine.prototype.add_paths = function(n,path){
    if(n.nodeName == "e"){
        n.setAttribute("path",path);
    }
    else{
        var es = 1, fs = 1, cs = 1, ls = 1;
        for(var c = n.firstChild; c != null; c = c.nextSibling){
            if(c.nodeName == "c"){ this.add_paths(c, path+"_c"+cs); cs++; }
            else if(c.nodeName == "f"){ this.add_paths(c, path+"_f"+fs); fs++; }
            else if(c.nodeName == "l"){ this.add_paths(c, path+"_l"+ls); ls++; }
            else if(c.nodeName == "e"){ this.add_paths(c, path+"_e"+es); es++; }
        }
    }
}

Engine.prototype.add_classes_cursors = function(n){
    if(n.nodeName == "e"){
        var text = n.firstChild.nodeValue;
        var ans = "";
        var sel_cursor;
        var text_node = Utils.is_text(n);
        if(this.sel_status == Engine.SEL_CURSOR_AT_START) sel_cursor = this.sel_end;
        if(this.sel_status == Engine.SEL_CURSOR_AT_END) sel_cursor = this.sel_start;
        if(this.sel_status != Engine.SEL_NONE){
            var sel_caret_text = Utils.is_small(sel_cursor.node) ? Utils.SMALL_SEL_CARET : Utils.SEL_CARET;
            if(!text_node && text.length == 0 && n.parentNode.childElementCount > 1){
                sel_caret_text = "\\blue{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0}{"+sel_caret_text+"}}";
            }
            else{
                sel_caret_text = "\\blue{"+sel_caret_text+"}";
            }
            if(this.sel_status == Engine.SEL_CURSOR_AT_END) sel_caret_text = text_node ? "[" : sel_caret_text + "\\"+Utils.SEL_COLOR+"{";
            if(this.sel_status == Engine.SEL_CURSOR_AT_START) sel_caret_text = text_node ? "]" : "}" + sel_caret_text;
        }
        var caret_text = "";
        var temp_caret_text = "";
        if(text.length == 0){
            if(text_node) caret_text = "\\_";
            else if(n.parentNode.childElementCount == 1){
                if(this.current == n){
                    var blank_caret = this.setting("blank_caret") || (Utils.is_small(this.current) ? Utils.SMALL_CARET : Utils.CARET);
                    ans = "\\red{\\xmlClass{main_cursor guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{"+blank_caret+"}}";
                }
                else if(this.temp_cursor.node == n)
                    ans = "\\gray{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{[?]}}";
                else
                    ans = "\\blue{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{[?]}}";
            }
            else if(this.temp_cursor.node != n && this.current != n && (!(sel_cursor) || sel_cursor.node != n)){
                // These are the empty e elements at either end of
                // a c or m node, such as the space before and
                // after both the sin and x^2 in sin(x^2)
                //
                // Here, we add in a small element so that we can
                // use the mouse to select these areas
                ans = "\\phantom{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0"+"}{\\cursor[0.1ex]{1ex}}}";
            }
        }
        for(var i = 0; i < text.length+1; i++){
            if(n == this.current && i == this.caret && (text.length > 0 || n.parentNode.childElementCount > 1)){
                if(text_node){
                    if(this.sel_status == Engine.SEL_CURSOR_AT_START)
                        caret_text = "[";
                    else if(this.sel_status == Engine.SEL_CURSOR_AT_END)
                        caret_text = "]";
                    else
                        caret_text = "\\_";
                }
                else{
                    caret_text = Utils.is_small(this.current) ? Utils.SMALL_CARET : Utils.CARET;
                    if(text.length == 0)
                        caret_text = "\\red{\\xmlClass{main_cursor guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0}{"+caret_text+"}}";
                    else{
                        caret_text = "\\red{\\xmlClass{main_cursor}{"+caret_text+"}}"
                    }
                    if(this.sel_status == Engine.SEL_CURSOR_AT_START)
                        caret_text = caret_text + "\\"+Utils.SEL_COLOR+"{";
                    else if(this.sel_status == Engine.SEL_CURSOR_AT_END)
                        caret_text = "}" + caret_text;
                }
                ans += caret_text;
            }
            else if(n == this.current && i == this.caret && text_node){
                ans += caret_text;
            }
            else if(this.sel_status != Engine.SEL_NONE && sel_cursor.node == n && i == sel_cursor.caret){
                ans += sel_caret_text;
            }
            else if(this.temp_cursor.node == n && i == this.temp_cursor.caret && (text.length > 0 || n.parentNode.childElementCount > 1)){
                if(text_node) 
                    temp_caret_text = ".";
                else{
                    temp_caret_text = Utils.is_small(this.current) ? Utils.TEMP_SMALL_CARET : Utils.TEMP_CARET;
                    if(text.length == 0){
                        temp_caret_text = "\\gray{\\xmlClass{guppy_elt guppy_blank guppy_loc_"+n.getAttribute("path")+"_0}{"+temp_caret_text+"}}";
                    }
                    else
                        temp_caret_text = "\\gray{"+temp_caret_text+"}";
                }
                ans += temp_caret_text;
            }
            if(i < text.length) ans += "\\xmlClass{guppy_elt guppy_loc_"+n.getAttribute("path")+"_"+i+"}{"+text[i]+"}";
        }
        if(text_node && n == this.current){
            ans = "\\xmlClass{guppy_text_current}{{"+ans+"}}";
        }
        n.setAttribute("render", ans);
        n.removeAttribute("path");
    }
    else{
        for(var c = n.firstChild; c != null; c = c.nextSibling){
            if(c.nodeName == "c" || c.nodeName == "l" || c.nodeName == "f" || c.nodeName == "e"){ this.add_classes_cursors(c); }
        }
    }
}

Engine.prototype.remove_cursors_classes = function(n){
    if(n.nodeName == "e"){
        n.removeAttribute("path");
        n.removeAttribute("render");
        n.removeAttribute("current");
        n.removeAttribute("temp");
    }
    else{
        for(var c = n.firstChild; c != null; c = c.nextSibling){
            if(c.nodeType == 1){ this.remove_cursors_classes(c); }
        }
    }
}

Engine.prototype.down_from_f = function(){
    var nn = this.current.firstChild;
    while(nn != null && nn.nodeName != 'c' && nn.nodeName != 'l') nn = nn.nextSibling;
    if(nn != null){
        while(nn.nodeName == 'l') nn = nn.firstChild;
        this.current = nn.firstChild;
    }
}

Engine.prototype.down_from_f_to_blank = function(){
    var nn = this.current.firstChild;
    while(nn != null && !(nn.nodeName == 'c' && nn.children.length == 1 && nn.firstChild.firstChild.nodeValue == "")){
        nn = nn.nextSibling;
    }
    if(nn != null){
        //Sanity check:
        
        while(nn.nodeName == 'l') nn = nn.firstChild;
        if(nn.nodeName != 'c' || nn.firstChild.nodeName != 'e'){
            this.problem('dfftb');
            return;
        }
        this.current = nn.firstChild;
    }
    else this.down_from_f();
}

Engine.prototype.delete_from_f = function(to_insert){
    var n = this.current;
    var p = n.parentNode;
    var prev = n.previousSibling;
    var next = n.nextSibling;
    var middle = to_insert || "";
    var new_node = this.make_e(prev.firstChild.textContent + middle + next.firstChild.textContent);
    this.current = new_node;
    this.caret = prev.firstChild.textContent.length;
    p.insertBefore(new_node, prev);
    p.removeChild(prev);
    p.removeChild(n);
    p.removeChild(next);
}

Engine.prototype.symbol_to_node = function(sym_name, content){
    return Symbols.symbol_to_node(this.symbols[sym_name], content, this.doc.base);
}

/** 
    Insert a symbol into the document at the current cursor position.
    @memberof Engine
    @param {string} sym_name - The name of the symbol to insert.
    Should match one of the keys in the symbols JSON object
*/
Engine.prototype.insert_symbol = function(sym_name){
    var s = this.symbols[sym_name];
    if(s.attrs && this.is_blacklisted(s.attrs.type)){
        return false;
    }
    var content = {};
    var left_piece,right_piece;
    var cur = "input" in s ? s.input : 0;
    var to_remove = [];
    var to_replace = null;
    var replace_f = false;
    var sel;
    
    if(cur > 0){
        cur--;
        if(this.sel_status != Engine.SEL_NONE){
            sel = this.sel_get();
            to_remove = sel.involved;
            left_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(0,this.sel_start.caret));
            right_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(this.sel_start.caret));
            content[cur] = sel.node_list;
        }
        else if("input" in s){
            // If we're at the beginning, then the token is the previous f node
            if(this.caret == 0 && this.current.previousSibling != null){
                content[cur] = [this.make_e(""), this.current.previousSibling, this.make_e("")];
                to_replace = this.current.previousSibling;
                replace_f = true;
            }
            else{
                // look for [0-9.]+|[a-zA-Z] immediately preceeding the caret and use that as token
                var prev = this.current.firstChild.nodeValue.substring(0,this.caret);
                var token = prev.match(/[0-9.]+$|[a-zA-Z]$/);
                if(token != null && token.length > 0){
                    token = token[0];
                    left_piece = this.make_e(this.current.firstChild.nodeValue.slice(0,this.caret-token.length));
                    right_piece = this.make_e(this.current.firstChild.nodeValue.slice(this.caret));
                    content[cur] = [this.make_e(token)];
                }
            }
        }
    }
    if(!replace_f && (left_piece == null || right_piece == null)){
        if(this.sel_status != Engine.SEL_NONE){
            sel = this.sel_get();
            to_remove = sel.involved;
            left_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(0,this.sel_start.caret));
            right_piece = this.make_e(sel.remnant.firstChild.nodeValue.slice(this.sel_start.caret));
            content = [sel.node_list];
	}
	else{
            left_piece = this.make_e(this.current.firstChild.nodeValue.slice(0,this.caret));
            right_piece = this.make_e(this.current.firstChild.nodeValue.slice(this.caret));
            to_remove = [this.current];
	}
    }

    // By now:
    // 
    // content contains whatever we want to pre-populate the 'current' field with (if any)
    //
    // right_piece contains whatever content was in an involved node
    // to the right of the cursor but is not part of the insertion.
    // Analogously for left_piece
    //
    // Thus all we should have to do now is symbol_to_node(sym_type,
    // content) and then add the left_piece, resulting node, and
    // right_piece in that order.
    var sym = this.symbol_to_node(sym_name,content);
    var current_parent = this.current.parentNode;
    
    var f = sym.f;

    var next = this.current.nextSibling;

    if(replace_f){
        current_parent.replaceChild(f,to_replace);
    }
    else{
        if(to_remove.length == 0) this.current.parentNode.removeChild(this.current);
        
        for(var i = 0; i < to_remove.length; i++){
            if(next == to_remove[i]) next = next.nextSibling;
            current_parent.removeChild(to_remove[i]);
        }
        current_parent.insertBefore(left_piece, next);
        current_parent.insertBefore(f, next);
        current_parent.insertBefore(right_piece, next);
    }
    
    this.caret = 0;
    this.current = f;
    if(sym.args.length == 0 || ("input" in s && s.input >= sym.args.length)){
        this.current = this.current.nextSibling;
    }
    else{
        this.down_from_f_to_blank();
        this.caret = this.current.firstChild.textContent.length;
    }

    this.sel_clear();
    this.checkpoint();
    return true;
}

Engine.prototype.sel_get = function(){
    if(this.sel_status == Engine.SEL_NONE){
        return null;
    }
    var involved = [];
    var node_list = [];
    var remnant = null;

    if(this.sel_start.node == this.sel_end.node){
        return {"node_list":[this.make_e(this.sel_start.node.firstChild.nodeValue.substring(this.sel_start.caret, this.sel_end.caret))],
                "remnant":this.make_e(this.sel_start.node.firstChild.nodeValue.substring(0, this.sel_start.caret) + this.sel_end.node.firstChild.nodeValue.substring(this.sel_end.caret)),
                "involved":[this.sel_start.node]};
    }
    
    node_list.push(this.make_e(this.sel_start.node.firstChild.nodeValue.substring(this.sel_start.caret)));
    involved.push(this.sel_start.node);
    involved.push(this.sel_end.node);
    remnant = this.make_e(this.sel_start.node.firstChild.nodeValue.substring(0, this.sel_start.caret) + this.sel_end.node.firstChild.nodeValue.substring(this.sel_end.caret));
    var n = this.sel_start.node.nextSibling;
    while(n != null && n != this.sel_end.node){
        involved.push(n);
        node_list.push(n);
        n = n.nextSibling;
    }
    node_list.push(this.make_e(this.sel_end.node.firstChild.nodeValue.substring(0, this.sel_end.caret)));
    return {"node_list":node_list,
            "remnant":remnant,
            "involved":involved,
            "cursor":0};
}

Engine.prototype.make_e = function(text){
    var base = this.doc.base;
    var new_node = base.createElement("e");
    new_node.appendChild(base.createTextNode(text));
    return new_node;
}

/** 
    Insert a string into the document at the current cursor position.
    @memberof Engine
    @param {string} s - The string to insert.
*/
Engine.prototype.insert_string = function(s){
    var self = this;
    if(this.sel_status != Engine.SEL_NONE){
        this.sel_delete();
        this.sel_clear();
    }
    this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splice(this.caret,s)
    this.caret += s.length;
    this.checkpoint();
    if(this.setting("autoreplace") == "auto") this.check_for_symbol(false);
    if(this.setting("autoreplace") == "whole") this.check_for_symbol(true);
    if(this.setting("autoreplace") == "delay" && setTimeout){
        if(this.delayed_check) clearTimeout(this.delayed_check);
        this.delayed_check = setTimeout(function(){ self.check_for_symbol(false); }, 200);
    }
}

/** 
    Insert a copy of the given document into the editor at the current cursor position.
    @memberof Engine
    @param {Doc} doc - The document to insert.
*/
Engine.prototype.insert_doc = function(doc){
    this.insert_nodes(doc.root().childNodes, true);
}

/** 
    Copy the current selection, leaving the document unchanged but
    placing the contents of the current selection on the clipboard.
    @memberof Engine
*/
Engine.prototype.sel_copy = function(){
    var sel = this.sel_get();
    if(!sel) return;
    Engine.clipboard = [];
    var cliptype = this.setting("cliptype");
    if(cliptype != "none") var clip_doc = new Doc("<m></m>");
    for(var i = 0; i < sel.node_list.length; i++){
        var node = sel.node_list[i].cloneNode(true);
        Engine.clipboard.push(node);
        if(cliptype != "none") clip_doc.root().appendChild(node.cloneNode(true));//clip_text += this.doc.manual_render(cliptype, node);
    }
    if(cliptype != "none"){
        try{
            this.system_copy(clip_doc.get_content(cliptype));
        }
        catch(e){
            this.system_copy("Syntax error");
        }
    }
    this.sel_clear();
}

Engine.prototype.system_copy = function(text) {
    if (window.clipboardData && window.clipboardData.setData)
        return window.clipboardData.setData("Text", text);
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";
        textarea.style.background = "transparent";
        document.body.appendChild(textarea);
        textarea.select();
        try { return document.execCommand("copy"); }
        catch (ex) { return false; }
        finally { document.body.removeChild(textarea); }
    }
}

/** 
    Cut the current selection, removing it from the document and placing it in the clipboard.
    @memberof Engine
*/
Engine.prototype.sel_cut = function(){
    var node_list = this.sel_delete();
    if(!node_list) return;
    Engine.clipboard = [];
    var cliptype = this.setting("cliptype");
    var clip_text = "";
    for(var i = 0; i < node_list.length; i++){
        var node = node_list[i].cloneNode(true);
        Engine.clipboard.push(node);
        if(cliptype != "none") clip_text += this.doc.manual_render(cliptype, node);
    }
    if(cliptype != "none") this.system_copy(clip_text);
    this.sel_clear();
    this.checkpoint();
}

Engine.prototype.insert_nodes = function(node_list, move_cursor){
    var real_clipboard = [];
    for(var i = 0; i < node_list.length; i++){
        real_clipboard.push(node_list[i].cloneNode(true));
    }

    if(real_clipboard.length == 1){
        this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.substring(0,this.caret) + real_clipboard[0].firstChild.nodeValue + this.current.firstChild.nodeValue.substring(this.caret);
        if(move_cursor) this.caret += real_clipboard[0].firstChild.nodeValue.length;
    }
    else{
        var nn = this.make_e(real_clipboard[real_clipboard.length-1].firstChild.nodeValue + this.current.firstChild.nodeValue.substring(this.caret));
        this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.substring(0,this.caret) + real_clipboard[0].firstChild.nodeValue;
        if(this.current.nextSibling == null)
            this.current.parentNode.appendChild(nn)
        else
            this.current.parentNode.insertBefore(nn, this.current.nextSibling)
        for(var j = 1; j < real_clipboard.length - 1; j++)
            this.current.parentNode.insertBefore(real_clipboard[j], nn);
        if(move_cursor){
            this.current = nn;
            this.caret = real_clipboard[real_clipboard.length-1].firstChild.nodeValue.length
        }
    }
}

/** 
    Paste the current contents of the clipboard.
    @memberof Engine
*/
Engine.prototype.sel_paste = function(){
    this.sel_delete();
    this.sel_clear();
    if(!(Engine.clipboard) || Engine.clipboard.length == 0) return;
    this.insert_nodes(Engine.clipboard, true);
    this.checkpoint();
    return;
}

/** 
    Clear the current selection, leaving the document unchanged and
    nothing selected.
    @memberof Engine
*/
Engine.prototype.sel_clear = function(){
    this.sel_start = null;    
    this.sel_end = null;
    this.sel_status = Engine.SEL_NONE;
}

/** 
    Delete the current selection.
    @memberof Engine
*/
Engine.prototype.sel_delete = function(){
    var sel = this.sel_get();
    if(!sel) return null;
    var sel_parent = sel.involved[0].parentNode;
    var sel_prev = sel.involved[0].previousSibling;
    for(var i = 0; i < sel.involved.length; i++){
        var n = sel.involved[i];
        sel_parent.removeChild(n);
    }
    if(sel_prev == null){
        if(sel_parent.firstChild == null)
            sel_parent.appendChild(sel.remnant);
        else
            sel_parent.insertBefore(sel.remnant, sel_parent.firstChild);
    }
    else if(sel_prev.nodeName == 'f'){
        if(sel_prev.nextSibling == null)
            sel_parent.appendChild(sel.remnant);
        else
            sel_parent.insertBefore(sel.remnant, sel_prev.nextSibling);
    }
    this.current = sel.remnant
    this.caret = this.sel_start.caret;
    return sel.node_list;
}

/** 
    Select the entire contents of the editor.
    @memberof Engine
*/
Engine.prototype.sel_all = function(){
    this.home();
    this.set_sel_start();
    this.end();
    this.set_sel_end();
    if(this.sel_start.node != this.sel_end.node || this.sel_start.caret != this.sel_end.caret)
        this.sel_status = Engine.SEL_CURSOR_AT_END;
}

/** 
    function
    @memberof Engine
    @param {string} name - param
*/
Engine.prototype.sel_right = function(){
    if(this.sel_status == Engine.SEL_NONE){
        this.set_sel_start();
        this.sel_status = Engine.SEL_CURSOR_AT_END;
    }
    if(this.caret >= Utils.get_length(this.current)){
        var nn = this.current.nextSibling;
        if(nn != null){
            this.current = nn.nextSibling;
            this.caret = 0;
            this.set_sel_boundary(Engine.SEL_CURSOR_AT_END);
        }
        else{
            this.set_sel_boundary(Engine.SEL_CURSOR_AT_END);
        }
    }
    else{
        this.caret += 1;
        this.set_sel_boundary(Engine.SEL_CURSOR_AT_END);
    }
    if(this.sel_start.node == this.sel_end.node && this.sel_start.caret == this.sel_end.caret){
        this.sel_status = Engine.SEL_NONE;
    }
}

Engine.prototype.set_sel_boundary = function(sstatus, mouse){
    if(this.sel_status == Engine.SEL_NONE || mouse) this.sel_status = sstatus;
    if(this.sel_status == Engine.SEL_CURSOR_AT_START)
        this.set_sel_start();
    else if(this.sel_status == Engine.SEL_CURSOR_AT_END)
        this.set_sel_end();
}

/** 
    Move the cursor to the left, adjusting the selection along with
    the cursor.
    @memberof Engine
*/
Engine.prototype.sel_left = function(){
    if(this.sel_status == Engine.SEL_NONE){
        this.set_sel_end();
        this.sel_status = Engine.SEL_CURSOR_AT_START;
    }
    if(this.caret <= 0){
        var nn = this.current.previousSibling;
        if(nn != null){
            this.current = nn.previousSibling;
            this.caret = this.current.firstChild.nodeValue.length;
            this.set_sel_boundary(Engine.SEL_CURSOR_AT_START);
        }
        else{
            this.set_sel_boundary(Engine.SEL_CURSOR_AT_START);
        }
    }
    else{
        this.caret -= 1;
        this.set_sel_boundary(Engine.SEL_CURSOR_AT_START);
    }
    if(this.sel_start.node == this.sel_end.node && this.sel_start.caret == this.sel_end.caret){
        this.sel_status = Engine.SEL_NONE;
    }
}

Engine.prototype.list_extend_copy_right = function(){this.list_extend("right", true);}
Engine.prototype.list_extend_copy_left = function(){this.list_extend("left", true);}
Engine.prototype.list_extend_right = function(){this.list_extend("right", false);}
Engine.prototype.list_extend_left = function(){this.list_extend("left", false);}
Engine.prototype.list_extend_up = function(){this.list_extend("up", false);}
Engine.prototype.list_extend_down = function(){this.list_extend("down", false);}
Engine.prototype.list_extend_copy_up = function(){this.list_extend("up", true);}
Engine.prototype.list_extend_copy_down = function(){this.list_extend("down", true);}

/** 
    Move the cursor by one row up or down in a matrix. 
    @memberof Engine
    @param {boolean} down - If `true`, move down in the matrix;
    otherwise, up.
*/
Engine.prototype.list_vertical_move = function(down){
    var n = this.current;
    while(n.parentNode && n.parentNode.parentNode && !(n.nodeName == 'c' && n.parentNode.nodeName == 'l' && n.parentNode.parentNode.nodeName == 'l')){
        n = n.parentNode;
    }
    if(!n.parentNode) return;
    var pos = 1;
    var cc = n;
    while(cc.previousSibling != null){
        pos++;
        cc = cc.previousSibling;
    }
    var new_l = down ? n.parentNode.nextSibling : n.parentNode.previousSibling
    if(!new_l) return;
    var idx = 1;
    var nn = new_l.firstChild;
    while(idx < pos){
        idx++;
        nn = nn.nextSibling;
    }
    this.current = nn.firstChild;
    this.caret = down ? 0 : this.current.firstChild.textContent.length;
}

/** 
    Add an element to a list (or row/column to a matrix) in the
    specified direction.  Can optionally copy the current
    element/row/column to the new one.
    @memberof Engine
    @param {string} direction - One of `"up"`, `"down"`, `"left"`, or
    `"right"`.  
    @param {boolean} copy - Whether or not to copy the current
    element/row/column into the new one.
*/
Engine.prototype.list_extend = function(direction, copy){
    var base = this.doc.base;
    var vertical = direction == "up" || direction == "down";
    var before = direction == "up" || direction == "left";
    var this_name = vertical ? "l" : "c";
    var n = this.current;
    while(n.parentNode && !(n.nodeName == this_name && n.parentNode.nodeName == 'l')){
        n = n.parentNode;
    }
    if(!n.parentNode) return;
    var to_insert;
    
    // check if 2D and horizontal and extend all the other rows if so 
    if(!vertical && n.parentNode.parentNode.nodeName == "l"){
        to_insert = base.createElement("c");
        to_insert.appendChild(this.make_e(""));
        var pos = 1;
        var cc = n;
        while(cc.previousSibling != null){
            pos++;
            cc = cc.previousSibling;
        }
        var to_modify = [];
        var iterator = this.doc.xpath_list("./l/c[position()="+pos+"]", n.parentNode.parentNode);
	var nn = null;
        try{ for(nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()){ to_modify.push(nn); }}
        catch(e) { this.fire_event("error",{"message":'XML modified during iteration? ' + e}); }
        for(var j = 0; j < to_modify.length; j++){
            nn = to_modify[j];
            if(copy) nn.parentNode.insertBefore(nn.cloneNode(true), before ? nn : nn.nextSibling);
            else nn.parentNode.insertBefore(to_insert.cloneNode(true), before ? nn : nn.nextSibling);
            nn.parentNode.setAttribute("s",parseInt(nn.parentNode.getAttribute("s"))+1);
        }
        this.sel_clear();
        this.current = before ? n.previousSibling.lastChild : n.nextSibling.firstChild;
        this.caret = this.current.firstChild.textContent.length;
        this.checkpoint();
        return;
    }
    
    if(copy){
        to_insert = n.cloneNode(true);
    }
    else{
        if(vertical){
            to_insert = base.createElement("l");
            to_insert.setAttribute("s",n.getAttribute("s"))
            for(var i = 0; i < parseInt(n.getAttribute("s")); i++){
                var c = base.createElement("c");
                c.appendChild(this.make_e(""));
                to_insert.appendChild(c);
            }
        }
        else{
            to_insert = base.createElement("c");
            to_insert.appendChild(this.make_e(""));
        }
    }
    n.parentNode.setAttribute("s",parseInt(n.parentNode.getAttribute("s"))+1);
    n.parentNode.insertBefore(to_insert, before ? n : n.nextSibling);
    this.sel_clear();
    if(vertical) this.current = to_insert.firstChild.firstChild;
    else this.current = to_insert.firstChild;
    this.caret = 0;
    this.checkpoint();
}

/** 
    Remove the current column from a matrix
    @memberof Engine
*/
Engine.prototype.list_remove_col = function(){
    var n = this.current;
    while(n.parentNode && n.parentNode.parentNode && !(n.nodeName == 'c' && n.parentNode.nodeName == 'l' && n.parentNode.parentNode.nodeName == 'l')){
        n = n.parentNode;
    }
    if(!n.parentNode) return;
    
    // Don't remove if there is only a single column:
    if(n.previousSibling != null){
        this.current = n.previousSibling.lastChild;
        this.caret = n.previousSibling.lastChild.firstChild.textContent.length;
    }
    else if(n.nextSibling != null){
        this.current = n.nextSibling.firstChild;
        this.caret = 0;
    }
    else return;
    
    var pos = 1;
    var cc = n;
    
    // Find position of column
    while(cc.previousSibling != null){
        pos++;
        cc = cc.previousSibling;
    }
    var to_modify = [];
    var iterator = this.doc.xpath_list("./l/c[position()="+pos+"]", n.parentNode.parentNode)
    var nn = null;
    try{ for(nn = iterator.iterateNext(); nn != null; nn = iterator.iterateNext()){ to_modify.push(nn); }}
    catch(e) { this.fire_event("error",{"message":'XML modified during iteration? ' + e}); }
    for(var j = 0; j < to_modify.length; j++){
        nn = to_modify[j];
        nn.parentNode.setAttribute("s",parseInt(nn.parentNode.getAttribute("s"))-1);
        nn.parentNode.removeChild(nn);
    }
    this.checkpoint();
}

/** 
    Remove the current row from a matrix
    @memberof Engine
*/
Engine.prototype.list_remove_row = function(){
    var n = this.current;
    while(n.parentNode && !(n.nodeName == 'l' && n.parentNode.nodeName == 'l')){
        n = n.parentNode;
    }
    if(!n.parentNode) return;
    // Don't remove if there is only a single row:
    if(n.previousSibling != null){
        this.current = n.previousSibling.firstChild.lastChild;
        this.caret = n.previousSibling.lastChild.firstChild.textContent.length;
    }
    else if(n.nextSibling != null){
        this.current = n.nextSibling.firstChild.firstChild;
        this.caret = 0;
    }
    else return;

    n.parentNode.setAttribute("s",parseInt(n.parentNode.getAttribute("s"))-1);
    n.parentNode.removeChild(n);
    this.checkpoint();
}

/** 
    Remove the current element from a list (or column from a matrix)
    @memberof Engine
*/
Engine.prototype.list_remove = function(){
    var n = this.current;
    while(n.parentNode && !(n.nodeName == 'c' && n.parentNode.nodeName == 'l')){
        n = n.parentNode;
    }
    if(!n.parentNode) return;
    if(n.parentNode.parentNode && n.parentNode.parentNode.nodeName == "l"){
        this.list_remove_col();
        return;
    }
    if(n.previousSibling != null){
        this.current = n.previousSibling.lastChild;
        this.caret = n.previousSibling.lastChild.firstChild.textContent.length;
    }
    else if(n.nextSibling != null){
        this.current = n.nextSibling.firstChild;
        this.caret = 0;
    }
    else return;
    n.parentNode.setAttribute("s",parseInt(n.parentNode.getAttribute("s"))-1);
    n.parentNode.removeChild(n);
    this.checkpoint();
}

/** 
    Simulate the right arrow key press
    @memberof Engine
*/
Engine.prototype.right = function(){
    this.sel_clear();
    if(this.caret >= Utils.get_length(this.current)){
        var nn = this.doc.xpath_node("following::e[1]", this.current);
        if(nn != null){
            this.current = nn;
            this.caret = 0;
        }
        else{
            this.fire_event("right_end");
        }
    }
    else{
        this.caret += 1;
    }
}

/** 
    Simulate the spacebar key press
    @memberof Engine
*/
Engine.prototype.spacebar = function(){
    if(Utils.is_text(this.current)) this.insert_string(" ");
    else this.space_caret = this.caret;
}

/** 
    Simulate the left arrow key press
    @memberof Engine
*/
Engine.prototype.left = function(){
    this.sel_clear();
    if(this.caret <= 0){
        var pn = this.doc.xpath_node("preceding::e[1]", this.current);
        if(pn != null){
            this.current = pn;
            this.caret = this.current.firstChild.nodeValue.length;
        }
        else{
            this.fire_event("left_end");
        }
    }
    else{
        this.caret -= 1;
    }
}

Engine.prototype.delete_from_c = function(){
    var pos = 0;
    var c = this.current.parentNode;
    while(c && c.nodeName == "c"){
        pos++;
        c = c.previousSibling;
    }
    var idx = this.current.parentNode.getAttribute("delete");
    var survivor_node = this.doc.xpath_node("./c[position()="+idx+"]", this.current.parentNode.parentNode);
    var survivor_nodes = [];
    for(var n = survivor_node.firstChild; n != null; n = n.nextSibling){
        survivor_nodes.push(n);
    }
    this.current = this.current.parentNode.parentNode;
    this.delete_from_f();
    this.insert_nodes(survivor_nodes, pos > idx);
}

Engine.prototype.delete_from_e = function(){
    // return false if we deleted something, and true otherwise.
    if(this.caret > 0){
        this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splicen(this.caret-1,"",1);
        this.caret--;
    }
    else{
        // The order of these is important
        if(this.current.previousSibling != null && Utils.is_char(this.current.previousSibling)){
            // The previous node is an f node but is really just a character.  Delete it.
            this.current = this.current.previousSibling;
            this.delete_from_f();
        }
        else if(this.current.previousSibling != null && this.current.previousSibling.nodeName == 'f'){
            // We're in an e node just after an f node.  Move back into the f node (delete it?)
            this.left();
            return false;
        }
        else if(this.current.parentNode.previousSibling != null && this.current.parentNode.previousSibling.nodeName == 'c'){
            // We're in a c child of an f node, but not the first one.  Go to the previous c
            if(this.current.parentNode.hasAttribute("delete")){
                this.delete_from_c();
            }
            else{
                this.left();
                return false;
            }
        }
        else if(this.current.previousSibling == null && this.current.parentNode.nodeName == 'c' && (this.current.parentNode.previousSibling == null || this.current.parentNode.previousSibling.nodeName != 'c')){
            // We're in the first c child of an f node and at the beginning--delete the f node
            var par = this.current.parentNode;
            while(par.parentNode.nodeName == 'l' || par.parentNode.nodeName == 'c'){
                par = par.parentNode;
            }
            if(par.hasAttribute("delete")){
                this.delete_from_c();
            }
            else{
                this.current = par.parentNode;
                this.delete_from_f();
            }
        }
        else{
            // We're at the beginning (hopefully!) 
            return false;
        }
    }
    return true;
}

Engine.prototype.delete_forward_from_e = function(){
    // return false if we deleted something, and true otherwise.
    if(this.caret < this.current.firstChild.nodeValue.length){
        this.current.firstChild.nodeValue = this.current.firstChild.nodeValue.splicen(this.caret,"",1);
    }
    else{
        //We're at the end
        if(this.current.nextSibling != null){
            // The next node is an f node.  Delete it.
            this.current = this.current.nextSibling;
            this.delete_from_f();
        }
        else if(this.current.parentNode.nodeName == 'c'){
            // We're in a c child of an f node.  Do nothing
            return false;
        }
    }
    return true;
}

/** 
    Simulate the "backspace" key press
    @memberof Engine
*/
Engine.prototype.backspace = function(){
    if(this.sel_status != Engine.SEL_NONE){
        this.sel_delete();
        this.sel_status = Engine.SEL_NONE;
        this.checkpoint();
    }
    else if(this.delete_from_e()){
        this.checkpoint();
    }
}

/** 
    Simulate the "delete" key press
    @memberof Engine
*/
Engine.prototype.delete_key = function(){
    if(this.sel_status != Engine.SEL_NONE){
        this.sel_delete();
        this.sel_status = Engine.SEL_NONE;
        this.checkpoint();
    }
    else if(this.delete_forward_from_e()){
        this.checkpoint();
    }
}

Engine.prototype.backslash = function(){
    if(Utils.is_text(this.current)) return;
    this.insert_symbol("sym_name");
}

/** 
    Simulate a tab key press
    @memberof Engine
*/
Engine.prototype.tab = function(){
    if(!Utils.is_symbol(this.current)){
        this.check_for_symbol();
        return;
    }
    var sym_name = this.current.firstChild.textContent;
    var candidates = [];
    for(var n in this.symbols){
        if(n.startsWith(sym_name)) candidates.push(n);
    }
    if(candidates.length == 1){
        this.current.firstChild.textContent = candidates[0];
        this.caret = candidates[0].length;
    }
    else {
        this.fire_event("completion",{"candidates":candidates});
    }
}

Engine.prototype.right_paren = function(){
    if(this.current.nodeName == 'e' && this.caret < this.current.firstChild.nodeValue.length - 1) return;
    else this.right();
}

/** 
    Simulate an up arrow key press
    @memberof Engine
*/
Engine.prototype.up = function(){
    this.sel_clear();
    if(this.current.parentNode.hasAttribute("up")){
        var t = parseInt(this.current.parentNode.getAttribute("up"));
        var f = this.current.parentNode.parentNode;
        var n = f.firstChild;
        while(n != null && t > 0){
            if(n.nodeName == 'c') t--;
            if(t > 0) n = n.nextSibling;
        }
        this.current = n.lastChild;
        this.caret = this.current.firstChild.nodeValue.length;
    }
    else this.list_vertical_move(false);
}

/** 
    Simulate a down arrow key press
    @memberof Engine
*/
Engine.prototype.down = function(){
    this.sel_clear();
    if(this.current.parentNode.hasAttribute("down")){
        var t = parseInt(this.current.parentNode.getAttribute("down"));
        var f = this.current.parentNode.parentNode;
        var n = f.firstChild;
        while(n != null && t > 0){
            if(n.nodeName == 'c') t--;
            if(t > 0) n = n.nextSibling;
        }
        this.current = n.lastChild;
        this.caret = this.current.firstChild.nodeValue.length;
    }
    else this.list_vertical_move(true);
}

/** 
    Move the cursor to the beginning of the document
    @memberof Engine
*/
Engine.prototype.home = function(){
    this.current = this.doc.root().firstChild;
    this.caret = 0;
}

/** 
    Move the cursor to the end of the document
    @memberof Engine
*/
Engine.prototype.end = function(){
    this.current = this.doc.root().lastChild;
    this.caret = this.current.firstChild.nodeValue.length;
}

Engine.prototype.checkpoint = function(){
    var base = this.doc.base;
    this.current.setAttribute("current","yes");
    this.current.setAttribute("caret",this.caret.toString());
    this.undo_now++;
    this.undo_data[this.undo_now] = base.cloneNode(true);
    this.undo_data.splice(this.undo_now+1, this.undo_data.length);
    var old_data = this.undo_data[this.undo_now-1] ? (new XMLSerializer()).serializeToString(this.undo_data[this.undo_now-1]) : "[none]";
    var new_data = (new XMLSerializer()).serializeToString(this.undo_data[this.undo_now]);
    this.fire_event("change",{"old":old_data,"new":new_data});
    this.current.removeAttribute("current");
    this.current.removeAttribute("caret");
    if(this.parent && this.parent.ready) this.parent.render(true);
}

Engine.prototype.restore = function(t){
    this.doc.base = this.undo_data[t].cloneNode(true);
    this.find_current();
    this.current.removeAttribute("current");
    this.current.removeAttribute("caret");
}

Engine.prototype.find_current = function(){
    this.current = this.doc.xpath_node("//*[@current='yes']");
    this.caret = parseInt(this.current.getAttribute("caret"));
}

/** 
    Undo the last action
    @memberof Engine
*/
Engine.prototype.undo = function(){
    this.sel_clear();
    if(this.undo_now <= 0) return;
    this.undo_now--;
    this.restore(this.undo_now);
    var old_data = this.undo_data[this.undo_now+1] ? (new XMLSerializer()).serializeToString(this.undo_data[this.undo_now+1]) : "[none]";
    var new_data = (new XMLSerializer()).serializeToString(this.undo_data[this.undo_now]);
    this.fire_event("change",{"old":old_data,"new":new_data});
}

/** 
    Redo the last undone action
    @memberof Engine
*/
Engine.prototype.redo = function(){
    this.sel_clear();
    if(this.undo_now >= this.undo_data.length-1) return;
    this.undo_now++;
    this.restore(this.undo_now);
    var old_data = this.undo_data[this.undo_now-1] ? (new XMLSerializer()).serializeToString(this.undo_data[this.undo_now-1]) : "[none]";
    var new_data = (new XMLSerializer()).serializeToString(this.undo_data[this.undo_now]);
    this.fire_event("change",{"old":old_data,"new":new_data});
}

/** 
    Execute the "done" callback
    @memberof Engine
*/
Engine.prototype.done = function(){
    if(Utils.is_symbol(this.current)) this.complete_symbol();
    else this.fire_event("done");
}

Engine.prototype.complete_symbol = function(){
    var sym_name = this.current.firstChild.textContent;
    if(!(this.symbols[sym_name])) return;
    this.current = this.current.parentNode.parentNode;
    this.delete_from_f();
    this.insert_symbol(sym_name);
}

Engine.prototype.problem = function(message){
    this.fire_event("error",{"message":message});
}

Engine.prototype.is_blacklisted = function(symb_type){
    var blacklist = this.setting("blacklist");
    for(var i = 0; i < blacklist.length; i++)
        if(symb_type == blacklist[i]) return true;
    return false;
}

Engine.prototype.check_for_symbol = function(whole_node){
    var instance = this;
    if(Utils.is_text(this.current)) return;
    var sym = "";
    var n = null;
    if(whole_node){
        n = instance.current.firstChild.nodeValue.substring(instance.space_caret, instance.caret);
        var m = /[a-zA-Z_]+$/.exec(n);
        if(m){
            var s = m[0];
            if(this.symbols[s]) sym = s;
        }
    }
    else{    
        n = instance.current.firstChild.nodeValue.substring(instance.space_caret, instance.caret);
        while(n.length > 0){
            if(n in this.symbols){
                sym = n;
                break;
            }
            n = n.substring(1);
        }
    }

    if(sym == "") return;
    
    var temp = instance.current.firstChild.nodeValue;
    var temp_caret = instance.caret;
    instance.current.firstChild.nodeValue = instance.current.firstChild.nodeValue.slice(0,instance.caret-sym.length)+instance.current.firstChild.nodeValue.slice(instance.caret);
    instance.caret -= sym.length;
    var success = instance.insert_symbol(sym);
    if(!success){
        instance.current.firstChild.nodeValue = temp;
        instance.caret = temp_caret;
    }
}

module.exports = Engine;

},{"./doc.js":4,"./settings.js":8,"./symbols.js":9,"./utils.js":10}],6:[function(require,module,exports){
var Mousetrap = require('../lib/mousetrap/mousetrap.min.js');
var katex = require('../lib/katex/katex-modified.min.js');
var Engine = require('./engine.js');
var Utils = require('./utils.js');
var Symbols = require('./symbols.js');
var Settings = require('./settings.js');
var Doc = require('./doc.js');

/**
   @class
   @classdesc An instance of Guppy.  Calling `Guppy(id)` with the ID of
   an existing editor will simply return that instance.
   @param {string} id - The string ID of the element that should be converted to an editor.  
   @param {Object} [config] - The configuration options for this instance
   @param {Object} [config.events] - A dictionary of events.
   Available events are as specified in Guppy.init.  Values in this
   dictionary will, for this instance of the editor, override events
   specified through Guppy.init.
   @param {Object} [config.settings] - A dictionary of settings.
   Values in this dictionary will override any global settings
   specified in `Guppy.init`.  This dictionary takes the same keys as
   the `config.settings` dictionary passed to `Guppy.init`.  See that
   function's documentation for the complete list.
   @constructor 
*/
var Guppy = function(id, config){
    if(Guppy.instances[id]){
        if(Guppy.instances[id].ready){
            return Guppy.instances[id];
        }
        return null;
    }
    var self = this;
    config = config || {};
    var settings = config['settings'] || {};
    
    this.id = id;
    var guppy_div = document.getElementById(id);
    
    var tab_idx = Guppy.max_tabIndex || 0;
    guppy_div.tabIndex = tab_idx;
    Guppy.max_tabIndex = tab_idx+1;

    var buttons = settings['buttons'] || Settings.config.settings['buttons'];
    this.buttons_div = document.createElement("div");
    this.buttons_div.setAttribute("class","guppy_buttons");
    if(buttons){
        for(var i = 0; i < buttons.length; i++){
            if(buttons[i] == "osk" && Settings.osk){
                Guppy.make_button("icons/keyboard.png", this.buttons_div, function() {
                    if(Settings.osk.guppy == self){ Settings.osk.detach(self); }
                    else{ Settings.osk.attach(self); }});
            }
            else if(buttons[i] == "settings") Guppy.make_button("icons/settings.png", this.buttons_div, function(){ Settings.toggle("settings", self); });
            else if(buttons[i] == "symbols") Guppy.make_button("icons/symbols.png", this.buttons_div, function(){ Settings.toggle("symbols", self); });
            else if(buttons[i] == "controls") Guppy.make_button("icons/help.png", this.buttons_div, function(){ Settings.toggle("controls", self); });
        }
    }

    this.editor_active = true;
    //this.empty_content = settings['empty_content'] || "\\red{[?]}"
    this.editor = guppy_div;
    this.blacklist = [];
    this.autoreplace = true;
    this.ready = false;

    Guppy.instances[guppy_div.id] = this;

    config['parent'] = self;

    /**   @member {Engine} */
    this.engine = new Engine(config);
    this.temp_cursor = {"node":null,"caret":0}
    this.editor.addEventListener("keydown",Guppy.key_down, false);
    this.editor.addEventListener("keyup",Guppy.key_up, false);
    this.editor.addEventListener("focus", function() { Guppy.kb.alt_down = false; if(self.activate) self.activate();}, false);
    if(Guppy.ready && !this.ready){
        this.ready = true;
        this.engine.fire_event("ready");
        this.render(true);
    }
    this.deactivate();
    this.recompute_locations_paths();
}

Guppy.instances = {};
Guppy.ready = false;
Guppy.Doc = Doc;
Guppy.active_guppy = null;
Guppy.Symbols = Symbols;

Guppy.make_button = function(url, parent, cb){
    var b = document.createElement("img");
    b.setAttribute("class","guppy-button");
    b.setAttribute("src", Settings.config.path + "/" + url);
    parent.appendChild(b);
    if(cb){
        b.addEventListener("mouseup", function(e){
            cb(e);
            if(e.cancelBubble!=null) e.cancelBubble = true;
            if(e.stopPropagation) e.stopPropagation();
            e.preventDefault();
            return false;
        }, false);
    }
    return b;
}

/** 
    Add a symbol to all instances of the editor
    @memberof Guppy
    @param {string} name - The name of the symbol to add.  This is
    also the string that will be autoreplaced with the symbol.
    @param {Object} symbol - If `template` is present, this is just
    the template arguments.  Otherwise, it is the complete symbol
    specification
    @param {Object} symbol.output - Key/value pairs where the key is
    the output type (such as "latex" or "asciimath") and the value is
    the string by which the output will be rendered in that format.
    In this string, {$n} will be substituted with the rendering of the
    nth argument.  If the nth argument is a d-dimensional list, then
    the argument should be specified as {$n{sep_1}{sep_2}...{sep_d}}
    where sep_i will be the separator used to separate entries in the
    ith dimension.  Note that keys are not necessary to describe the
    AST or plain-text outputs.
    @param {Array} symbol.keys - A list of strings representing
    keystrokes that can be used to trigger the insertion of this
    symbol.  For example, `"^" or `"shift+up"` for the `exponential`
    symbol.
    @param {Object} symbol.attrs - A specification of the attributes
    of the symbol
    @param {string} symbol.attrs.type - A longer description of the
    symbol type, suitable for searching and text rendering.
    @param {string} symbol.attrs.group - The group in which to place
    this symbol (for OSK)
    @param {Object} [symbol.input] - If the symbol should subsume part
    of the existing content of the editor (as in, for example, the
    case of exponent), this object will contain the (1-based) index of
    the argument in which that content should be placed.
    @param {Object} [symbol.ast] - Modifies the default construction
    of an entry in the AST for this symbol.  
    @param {Object} [symbol.ast.type="operator"] - The type of symbol
    for AST purposes.  Can be "name" (meaning this symbol represents
    a variable, as in the case of pi), "number" (meaning this symbol
    is a literal value), "operator" (meaning this symbol is a
    function or otherwise takes arguments (as in cos or +), or
    "pass" (meaning this symbol's first argument will be used as its
    AST entry, as in the case of brackets/parentheses).
    @param {Object[]} [symbol.args] - A list of specifications, one
    for each argument
    @param {string} [symbol.args.down] - The index of the argument
    to jump to when the "down" arrow is pressed in this argument
    @param {string} [symbol.args.up] - The index of the argument
    to jump to when the "up" arrow is pressed in this argument
    @param {string} [symbol.args.small="no"] - "yes" if the symbol is
    small (as in an exponent)
    @param {string} [symbol.args.name] - The name of this particular
    argument (suitable for searching)
    @param {string} [symbol.args.bracket="no"] - "yes" if brackets
    should automatically be rendered around this argument when they
    might be needed to disambiguate.
    @param {string} [symbol.args.delete] - If present, when the
    "backspace" key is pressed at the beginning of this argument,
    the symbol will be deleted and replaced with the argument whose
    index is specified in this parameter.  For example, the second
    argument of an exponent has this value set to "1", so that when
    the exponent is deleted, the base remains.
    @param {string} [symbol.args.mode="math"] - Change the mode of an
    argument.  Can be "text" (meaning the argument will be editable
    as and rendered as plain text), "symbol" (meaning the argument
    will specify a symbol name and will complete to an actual symbol
    when this is entered--only used for the backslash symbol), or
    "math" (the default)
    @param {string} [symbol.args.is_bracket="no"] - Set to "yes" if
    the symbol is itself a bracket/parenthesis equivalent.
    @param {string} [template] - The name of the template to use
*/
Guppy.add_global_symbol = function(name, symbol, template){
    if(template){
        symbol = Symbols.make_template_symbol(template, name, symbol);
    }
    Symbols.symbols[name] = JSON.parse(JSON.stringify(symbol));
    for(var i in Guppy.instances){
        Guppy.instances[i].engine.symbols[name] = JSON.parse(JSON.stringify(symbol));
    }
}

/** 
    Remove a symbol from all instances of the editor
    @memberof Guppy
    @param {string} name - The name of the symbol to remove
*/
Guppy.remove_global_symbol = function(name){
    if(Symbols.symbols[name]){
        delete Symbols.symbols[name]
        for(var i in Guppy.instances){
            if(Guppy.instances[i].engine.symbols[name]){
                delete Guppy.instances[i].engine.symbols[name];
            }
        }
    }
}

/**
   Initialise global settings for all instances of the editor.  Most
   of these can be overridden for specific instances later.  Should be
   called before instantiating the Guppy class.
   @static 
   @memberof Guppy
   @param {Object} config - The configuration options for this instance
   @param {string[]} [config.symbols] - A list of URLs for symbol JSON files to request
   @param {string} [config.path="/lib/guppy"] - The path to the guppy build folder.
   @param {GuppyOSK} [config.osk] - A GuppyOSK object to use for the on-screen keyboard if one is desired
   @param {Object} [config.events] - A dictionary of events
   @param {function} [config.events.ready] - Called when the instance is ready to render things. 
   @param {function} [config.events.change] - Called when the editor's content changes.  Argument will be a dictionary with keys `old` and `new` containing the old and new documents, respectively. 
   @param {function} [config.events.left_end] - Called when the cursor is at the left-most point and a command is received to move the cursor to the left (e.g., via the left arrow key).  Argument will be null.
   @param {function} [config.events.left_end] - Called when the cursor is at the right-most point and a command is received to move the cursor to the right (e.g., via the right arrow key).  Argument will be null.
   @param {function} [config.events.done] - Called when the enter key is pressed in the editor.
   @param {function} [config.events.completion] - Called when the editor outputs tab completion
   options.  Argument is a dictionary with the key `candidates`, a
   list of the options for tab-completion.
   @param {function} [config.events.debug] - Called when the editor outputs some debug information.
   Argument is a dictionary with the key `message`.
   @param {function} [config.events.error] - Called when the editor receives an error.  Argument is
   a dictionary with the key `message`.
   @param {function} [config.events.focus] - Called when the editor is focused or unfocused.
   Argument will have a single key `focused` which will be `true`
   or `false` according to whether the editor is newly focused or
   newly unfocused (respectively).
   @param {Object} [config.settings] - A dictionary of settings
   @param {string} [config.settings.xml_content=<m><e/></m>] - An XML
   string with which to initialise the editor's state.
   @param {string} [config.settings.autoreplace="auto"] - Determines
   whether or not to autoreplace typed text with the corresponding
   symbols when possible.
   @param {string} [config.settings.blank_caret=""] - A LaTeX string
   that specifies what the caret should look like when in a blank
   spot.  If `""`, the default caret is used.
   @param {string} [config.settings.empty_content=\color{red}{[?]}] - A
   LaTeX string that will be displayed when the editor is both
   inactive and contains no content.
   @param {string[]} [config.settings.blacklist=[]] - A list of string
   symbol names, corresponding to symbols that should not be
   allowed in this instance of the editor.
   @param {string[]} [config.settings.buttons=["osk","settings","symbols","controls"]] - A list of strings corresponding to the helper buttons that should be displayed in the editor when focused.
   @param {string} [config.settings.cliptype] - A string, either
   "text" or "latex".  If this option is present, when text is
   placed onto the editor clipboard, the contents of the editor
   will be rendered into either plain text or LaTeX (depending on
   the value of this option) and an attempt will be made to copy
   the result to the system clipboard.
   @param {function} [config.callback] - A function to be called when
   initialisation is complete.
*/
Guppy.init = function(config){
    var all_ready = function(){
        Settings.init(Symbols.symbols);
        Guppy.register_keyboard_handlers();
        for(var i in Guppy.instances){
            Guppy.instances[i].ready = true;
            Guppy.instances[i].render(true);

            // Set backend symbols
            Guppy.instances[i].engine.symbols = JSON.parse(JSON.stringify(Symbols.symbols));

            // Set backend settings
            // for(var s in Settings.config.settings){
            //     Guppy.instances[i].engine.settings[s] = JSON.parse(JSON.stringify(Settings.config.settings[s]));
            // }

            // Set backend events
            for(var e in Settings.config.events){
                Guppy.instances[i].engine.events[e] = Settings.config.events[e];
            }
        }
        Engine.ready = true;
        for(var j in Guppy.instances){
            Guppy.instances[j].engine.ready = true;
            Guppy.instances[j].engine.fire_event("ready");
        }
	if(config.callback) config.callback();
    }
    if(config.settings){
        var settings = JSON.parse(JSON.stringify(config.settings));
        for(var s in settings){
            Settings.config.settings[s] = settings[s];
        }
    }
    if(config.events){
        Settings.config.events = config.events;
    }
    if(config.osk){
	Guppy.OSK = config.osk;
        Settings.osk = config.osk;
        if(config.osk.config.attach == "focus"){
            var f = Settings.config.events["focus"];
            Settings.config.events["focus"] = function(e){
                if(f) f(e);
                if(e.focused) config.osk.attach(e.target);
                else config.osk.detach(e.target);
            };
        }
    }
    if(config.path){
        Settings.config.path = config.path;
    }
    if(config.symbols){
        var symbols = config.symbols;
        if(!(Array.isArray(symbols))){
            symbols = [symbols];
        }
        var calls = [];
        for(var i = 0; i < symbols.length; i++){
            var x = function outer(j){
                return function(callback){
                    var req = new XMLHttpRequest();
                    req.onload = function(){
                        var syms = JSON.parse(this.responseText);
                        Symbols.add_symbols(syms);
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
        var cb = function(){
            j += 1;
            if(j < calls.length) calls[j](cb);
        }
        if(calls.length > 0) calls[0](cb);
    }
    else{
        all_ready();
    }
}

Guppy.prototype.is_changed = function(){
    var bb = this.editor.getElementsByClassName("katex")[0];
    if(!bb) return;
    var rect = bb.getBoundingClientRect();
    var ans = null;
    if(this.bounding_box)
        ans = this.bounding_box.top != rect.top || this.bounding_box.bottom != rect.bottom || this.bounding_box.right != rect.right || this.bounding_box.left != rect.left;
    else
        ans = true;
    this.bounding_box = rect;
    return ans;
}

Guppy.prototype.recompute_locations_paths = function(){
    var ans = [];
    var bb = this.editor.getElementsByClassName("katex")[0];
    if(!bb) return;
    var rect = bb.getBoundingClientRect();
    ans.push({'path':'all',
              'top':rect.top,
              'bottom':rect.bottom,
              'left':rect.left,
              'right':rect.right});
    var elts = this.editor.getElementsByClassName("guppy_elt");
    for(var i = 0; i < elts.length; i++){
        var elt = elts[i];
        if(elt.nodeName == "mstyle") continue;
        rect = elt.getBoundingClientRect();
        if(rect.top == 0 && rect.bottom == 0 && rect.left == 0 && rect.right == 0) continue;
        var cl = elt.classList;
        for(var j = 0; j < cl.length; j++){
            if(cl[j].indexOf("guppy_loc") == 0){
                ans.push({'path':cl[j],
                          'top':rect.top,
                          'bottom':rect.bottom,
                          'left':rect.left,
                          'right':rect.right,
                          'mid_x':(rect.left+rect.right)/2,
                          'mid_y':(rect.bottom+rect.top)/2,
                          'blank':(' '+elt.className+' ').indexOf(' guppy_blank ') >= 0});
                break;
            }
        }
    }
    this.boxes = ans;
}

Guppy.get_loc = function(x,y,current_node,current_caret){
    var g = Guppy.active_guppy;
    var min_dist = -1;
    var mid_dist = 0;
    var pos = "";
    var opt = null;
    var cur = null;
    var car = null;
    // check if we go to first or last element
    var bb = g.editor.getElementsByClassName("katex")[0];
    if(!bb) return;
    if(current_node){
        var current_path = Utils.path_to(current_node);
        var current_pos = parseInt(current_path.substring(current_path.lastIndexOf("e")+1));
    }
    
    var boxes = g.boxes;
    if(!boxes) return;
    if(current_node){
        current_path = current_path.replace(/e[0-9]+$/,"e");
        var boxes2 = [];
        for(var i = 0; i < boxes.length; i++){
            if(boxes[i].path == "all") continue;
            var loc = boxes[i].path.substring(0,boxes[i].path.lastIndexOf("_"));
            loc = loc.replace(/e[0-9]+$/,"e");
            if(loc == current_path){
                boxes2.push(boxes[i]);
            }
        }
        boxes = boxes2;
    }
    if(!boxes) return;
    for(var j = 0; j < boxes.length; j++){
        var box = boxes[j];
        if(box.path == "all"){
            if(!opt) opt = {'path':'guppy_loc_m_e1_0'};
            continue;
        }
        var xdist = Math.max(box.left - x, x - box.right, 0)
        var ydist = Math.max(box.top - y, y - box.bottom, 0)
        var dist = Math.sqrt(xdist*xdist + ydist*ydist);
        if(min_dist == -1 || dist < min_dist){
            min_dist = dist;
            mid_dist = x - box.mid_x;
            opt = box;
        }
    }
    loc = opt.path.substring("guppy_loc".length);
    loc = loc.replace(/_/g,"/");
    loc = loc.replace(/([0-9]+)(?=.*?\/)/g,"[$1]");
    cur = g.engine.doc.xpath_node(loc.substring(0,loc.lastIndexOf("/")), g.engine.doc.root());
    car = parseInt(loc.substring(loc.lastIndexOf("/")+1));
    // Check if we want the cursor before or after the element
    if(mid_dist > 0 && !(opt.blank)){
        car++;
    }
    var ans = {"current":cur,"caret":car,"pos":pos};
    if(current_node && opt){
        var opt_pos = parseInt(opt.path.substring(opt.path.lastIndexOf("e")+1,opt.path.lastIndexOf("_")));
        if(opt_pos < current_pos) pos = "left";
        else if(opt_pos > current_pos) pos = "right";
        else if(car < current_caret) pos = "left";
        else if(car > current_caret) pos = "right";
        if(pos) ans['pos'] = pos;
        else ans['pos'] = "none";
    }
    return ans;
}

Guppy.mouse_up = function(){
    Guppy.kb.is_mouse_down = false;
    var g = Guppy.active_guppy;
    if(g) g.render(true);
}

Guppy.mouse_down = function(e){
    if(e.target.getAttribute("class") == "guppy-button") return;
    var n = e.target;
    Guppy.kb.is_mouse_down = true;
    while(n != null){
        if(n.id in Guppy.instances){
            e.preventDefault();
            var prev_active = Guppy.active_guppy;
            for(var i in Guppy.instances){
                if(i != n.id) Guppy.instances[i].deactivate();
                Guppy.active_guppy = Guppy.instances[n.id];
                Guppy.active_guppy.activate();
            }
            var g = Guppy.active_guppy;
            var b = Guppy.active_guppy.engine;
            g.space_caret = 0;
            if(prev_active == g){
                if(e.shiftKey){
                    g.select_to(e.clientX, e.clientY, true);
                }
                else {
                    var loc = Guppy.get_loc(e.clientX,e.clientY);
                    if(!loc) return;
                    b.current = loc.current;
                    b.caret = loc.caret;
                    b.sel_status = Engine.SEL_NONE;
                }
                g.render(true);
            }
            return;
        }
        if(n.classList && n.classList.contains("guppy_osk")){
            return;
        }
        n = n.parentNode;
    }
    Guppy.active_guppy = null;
    for(var j in Guppy.instances){
        Guppy.instances[j].deactivate();
    }
}

Guppy.mouse_move = function(e){
    var g = Guppy.active_guppy;
    if(!g) return;
    if(!Guppy.kb.is_mouse_down){
        var bb = g.editor;
        var rect = bb.getBoundingClientRect();
        if((e.clientX < rect.left || e.clientX > rect.right) || (e.clientY > rect.bottom || e.clientY < rect.top)){
            g.temp_cursor = {"node":null,"caret":0};
        }
        else{
            var loc = Guppy.get_loc(e.clientX,e.clientY);
            if(!loc) return;
            g.temp_cursor = {"node":loc.current,"caret":loc.caret};
        }
        g.render(g.is_changed());
    }
    else{
        g.select_to(e.clientX,e.clientY, true);
        g.render(g.is_changed());
    }
}

Guppy.prototype.select_to = function(x, y, mouse){
    var sel_caret = this.engine.caret;
    var sel_cursor = this.engine.current;
    if(this.engine.sel_status == Engine.SEL_CURSOR_AT_START){
        sel_cursor = this.engine.sel_end.node;
        sel_caret = this.engine.sel_end.caret;
    }
    else if(this.engine.sel_status == Engine.SEL_CURSOR_AT_END){
        sel_cursor = this.engine.sel_start.node;
        sel_caret = this.engine.sel_start.caret;
    }
    var loc = Guppy.get_loc(x,y,sel_cursor,sel_caret);
    if(!loc) return;
    this.engine.select_to(loc, sel_cursor, sel_caret, mouse);
}


window.addEventListener("mousedown",Guppy.mouse_down, true);
window.addEventListener("mouseup",Guppy.mouse_up, true);
window.addEventListener("mousemove",Guppy.mouse_move, false);

Guppy.prototype.render_node = function(t){
    // All the interesting work is done by transform.  This function just adds in the cursor and selection-start cursor
    var output = "";
    if(t == "render"){
        var root = this.engine.doc.root();
        this.engine.add_paths(root,"m");
        this.engine.temp_cursor = this.temp_cursor;
        this.engine.add_classes_cursors(root);
        this.engine.current.setAttribute("current","yes");
        if(this.temp_cursor.node) this.temp_cursor.node.setAttribute("temp","yes");
        output = this.engine.get_content("latex",true);
        this.engine.remove_cursors_classes(root);
        output = output.replace(new RegExp('&amp;','g'), '&');
        return output;
    }
    else{
        output = this.engine.get_content(t);
    }
    return output
}

/** 
    Render the document
    @memberof Guppy
    @param {boolean} [updated=false] - Whether there have been visible
    changes to the document (i.e. that affect the positions of
    elements)
*/
Guppy.prototype.render = function(updated){
    if(!this.editor_active && this.engine.doc.is_blank()){
        katex.render(this.engine.setting("empty_content"),this.editor);
        this.editor.appendChild(this.buttons_div);
        return;
    }
    var tex = this.render_node("render");
    katex.render(tex,this.editor);
    this.editor.appendChild(this.buttons_div);
    if(updated){
        this.recompute_locations_paths();
    }
}

/** 
    Get the content of the editor as LaTeX
    @memberof Guppy
*/
Guppy.prototype.latex = function(){
    return this.engine.get_content("latex");
}

/** 
    Get the content of the editor as XML
    @memberof Guppy
*/
Guppy.prototype.xml = function(){
    return this.engine.get_content("xml");
}

/** 
    Get the content of the editor as a syntax tree, serialised using JSON
    @memberof Guppy
*/
Guppy.prototype.syntax_tree = function(){
    return this.engine.get_content("ast");
}

/** 
    Get the content of the editor as a list of equations, serialised
    using JSON.  For example, `x < y = z` will be returned as `[["<", [["var", "x"], ["var", "y"]]],["=", [["var", "y"], ["var", "z"]]]]
    @memberof Guppy
*/
Guppy.prototype.equations = function(){
    return this.engine.get_content("eqns");
}

/** 
    Get the content of the editor in a parseable text format.
    @memberof Guppy
*/
Guppy.prototype.text = function(){
    return this.engine.get_content("text");
}


/** 
    Get the content of the editor in AsciiMath.
    @memberof Guppy
*/
Guppy.prototype.asciimath = function(){
    return this.engine.get_content("asciimath");
}

/** 
    Get the Doc object representing the editor's contents.
    @memberof Guppy
*/
Guppy.prototype.doc = function(){
    return this.engine.doc;
}

/** 
    Get the content of the editor as a Javascript function, with
    user-supplied interpretations of the various symbols.  If not
    supplied, default interpretations will be given for the following
    symbols: `*,+,/,-,^,sqrt,sin,cos,tan,log`
    @param {Object} [evaluators] - An object with a key for each
    possible symbol type ("exponential", "integral", etc.)
    whose values are functions.  These functions take in a single
    argument, `args`, which is an array of that symbol's arguments,
    and should return a function that takes in an object argument
    `vars`.  In this inner function, to compute e.g. the sum of the
    first and second arguments, you would do
    `args[0](vars)+args[1](vars)`.  This function should return the
    result of that symbol's operation.  
    @returns {function(Object)} - Returns a function that takes in an
    object with a key for each variable in the expression and whose
    values are the values that will be passed in for those variables.
    In addition, this function is augmented with a `vars` member which
    is a list of the variables that appear in the expression.
    @memberof Guppy
*/
Guppy.prototype.func = function(evaluators){
    var res = this.engine.get_content("function", evaluators);
    var f = res['function'];
    f.vars = res.vars;
    return f;
}

/** 
    Recursively evaluate the syntax tree of the editor's contents using specified functions.
    @param {Object} [evaluators] - An object with a key for each
    possible symbol type ("exponential", "integral", etc.)
    whose values are functions that will be applied whenever that
    symbol is encountered in the syntax tree.  These functions take a
    single argument, `args`, which is a list of the results of
    evaluating that symbol's arguments.  
    @returns - Whatever the `evaluators` function for the root symbol
    in the syntax tree returns.
    @memberof Guppy
*/
Guppy.prototype.evaluate = function(evaluators){
    return this.engine.doc.evaluate(evaluators);
}

/** 
    Get a list of the symbols used in the document, in order of
    appearance, with each kind of symbol appearing only once.  For
    example, a document representing `sin(x^3)+sqrt(x^2+x)` will
    have symbols `["sin","exponential","square_root"]`.
    @param {String[]} [groups] - A list of the groups whose symbols
    may be included in the output.  If absent, all symbols in the
    document will be returned.
    @memberof Guppy
*/
Guppy.prototype.symbols_used = function(groups){
    return this.engine.doc.get_symbols(groups);
}

/** 
    Get a list of the variable names used in the document.  
    @memberof Guppy
*/
Guppy.prototype.vars = function(){
    return this.engine.get_content("function").vars;
}

/** 
    Set the content of the document from text in the format outputted by `guppy.text()`.
    @param {String} text - A string representing the document to import.
    @memberof Guppy
*/
Guppy.prototype.import_text = function(text){
    return this.engine.import_text(text);
}

/** 
    Set the content of the document from input text in "semantic
    LaTeX" format.  That is, all functions are represented as
    `\funcname{arg1}{arg2}`.  For example,
    `\defintegral{1}{2}{x^2}{x}`.
    @param {String} text - A string representing the document to import.
    @memberof Guppy
*/
Guppy.prototype.import_latex = function(text){
    return this.engine.import_latex(text);
}

/** 
    Set the content of the document from XML in the format outputted
    by `guppy.xml()`.
    @param {String} xml - An XML string representing the document to
    import.
    @memberof Guppy
*/
Guppy.prototype.import_xml = function(xml){
    return this.engine.set_content(xml);
}

/** 
    Import a syntax tree from a JSON object formatted as outputted by `guppy.syntax_tree()`.
    @param {Object} tree - A JSON object representing the syntax tree to import.
    @memberof Guppy
*/
Guppy.prototype.import_syntax_tree = function(tree){
    return this.engine.import_ast(tree);
}

/** 
    Focus this instance of the editor
    @memberof Guppy
*/
Guppy.prototype.activate = function(){
    Guppy.active_guppy = this;
    this.editor_active = true;
    this.editor.className = this.editor.className.replace(new RegExp('(\\s|^)guppy_inactive(\\s|$)'),' guppy_active ');
    this.editor.focus();
    if(this.ready){
        this.render(true);
        this.engine.fire_event("focus",{"focused":true});
    }
}

/** 
    Unfocus this instance of the editor
    @memberof Guppy
*/
Guppy.prototype.deactivate = function(){
    this.editor_active = false;
    var r1 = new RegExp('(?:\\s|^)guppy_active(?:\\s|$)');
    var r2 = new RegExp('(?:\\s|^)guppy_inactive(?:\\s|$)');
    if(this.editor.className.match(r1)){
        this.editor.className = this.editor.className.replace(r1,' guppy_inactive ');
    }
    else if(!this.editor.className.match(r2)){
        this.editor.className += ' guppy_inactive ';
    }
    Guppy.kb.shift_down = false;
    Guppy.kb.ctrl_down = false;
    Guppy.kb.alt_down = false;
    if(this.ready){
        this.render();
        this.engine.fire_event("focus",{"focused":false});
    }
}


// Keyboard stuff

Guppy.kb = {};

Guppy.kb.is_mouse_down = false;

/* keyboard behaviour definitions */

// keys aside from 0-9,a-z,A-Z
Guppy.kb.k_chars = {
    "+":"+",
    "-":"-",
    "*":"*",
    ".":"."
};
Guppy.kb.k_text = {
    "/":"/",
    "*":"*",
    "(":"(",
    ")":")",
    "<":"<",
    ">":">",
    "|":"|",
    "!":"!",
    ",":",",
    ".":".",
    ";":";",
    "=":"=",
    "[":"[",
    "]":"]",
    "@":"@",
    "'":"'",
    "`":"`",
    ":":":",
    "\"":"\"",
    "?":"?",
    "space":" ",
};
Guppy.kb.k_controls = {
    "up":"up",
    "down":"down",
    "right":"right",
    "left":"left",
    "alt+k":"up",
    "alt+j":"down",
    "alt+l":"right",
    "alt+h":"left",
    "space":"spacebar",
    "home":"home",
    "end":"end",
    "backspace":"backspace",
    "del":"delete_key",
    "mod+a":"sel_all",
    "mod+c":"sel_copy",
    "mod+x":"sel_cut",
    "mod+v":"sel_paste",
    "mod+z":"undo",
    "mod+y":"redo",
    "enter":"done",
    "mod+shift+right":"list_extend_copy_right",
    "mod+shift+left":"list_extend_copy_left",
    ",":"list_extend_right",
    ";":"list_extend_down",
    "mod+right":"list_extend_right",
    "mod+left":"list_extend_left",
    "mod+up":"list_extend_up",
    "mod+down":"list_extend_down",
    "mod+shift+up":"list_extend_copy_up",
    "mod+shift+down":"list_extend_copy_down",
    "mod+backspace":"list_remove",
    "mod+shift+backspace":"list_remove_row",
    "shift+left":"sel_left",
    "shift+right":"sel_right",
    ")":"right_paren",
    "\\":"backslash",
    "tab":"tab"
};

// Will populate keyboard shortcuts for symbols from symbol files
Guppy.kb.k_syms = {};

var i = 0;

// letters

for(i = 65; i <= 90; i++){
    Guppy.kb.k_chars[String.fromCharCode(i).toLowerCase()] = String.fromCharCode(i).toLowerCase();
    Guppy.kb.k_chars['shift+'+String.fromCharCode(i).toLowerCase()] = String.fromCharCode(i).toUpperCase();
}

// numbers

for(i = 48; i <= 57; i++)
    Guppy.kb.k_chars[String.fromCharCode(i)] = String.fromCharCode(i);

Guppy.register_keyboard_handlers = function(){
    Mousetrap.addKeycodes({173: '-'}); // Firefox's special minus (needed for _ = sub binding)
    var i, name;
    // Pull symbol shortcuts from Symbols:
    for(name in Symbols.symbols){
	var s = Symbols.symbols[name];
	if(s.keys)
                for(i = 0; i < s.keys.length; i++)
                Guppy.kb.k_syms[s.keys[i]] = s.attrs.type;
    }
    for(i in Guppy.kb.k_chars)
        Mousetrap.bind(i,function(i){ return function(){
            if(!Guppy.active_guppy) return true;
            Guppy.active_guppy.temp_cursor.node = null;
            if(Utils.is_text(Guppy.active_guppy.engine.current) && Guppy.kb.k_text[i]){
                Guppy.active_guppy.engine.insert_string(Guppy.kb.k_text[i]);
            }
            else{
                Guppy.active_guppy.engine.insert_string(Guppy.kb.k_chars[i]);
            }
            Guppy.active_guppy.render(true);
            return false;
        }}(i));
    for(i in Guppy.kb.k_syms)
        Mousetrap.bind(i,function(i){ return function(){
            if(!Guppy.active_guppy) return true;
            Guppy.active_guppy.temp_cursor.node = null;
            // We always want to skip using this symbol insertion if
            // we are in text mode, and additionally we want only to
            // insert the corresponding text if there is an overriding
            // text representation in Guppy.kb.k_text
            if(Utils.is_text(Guppy.active_guppy.engine.current)){
                if(Guppy.kb.k_text[i]) Guppy.active_guppy.engine.insert_string(Guppy.kb.k_text[i]);
            }
            else{
                Guppy.active_guppy.engine.space_caret = 0;
                //Guppy.active_guppy.engine.insert_symbol(Guppy.kb.k_syms[i]);
                Guppy.active_guppy.engine.insert_symbol(Symbols.lookup_type(Guppy.kb.k_syms[i]));
            }
            Guppy.active_guppy.render(true);
            return false;
        }}(i));
    for(i in Guppy.kb.k_controls)
        Mousetrap.bind(i,function(i){ return function(){
            if(!Guppy.active_guppy) return true;
            // We want to skip using this control sequence only if there is an overriding text representation in Guppy.kb.k_text
            if(Utils.is_text(Guppy.active_guppy.engine.current) && Guppy.kb.k_text[i]){
                Guppy.active_guppy.engine.insert_string(Guppy.kb.k_text[i]);
            }
            else{
                Guppy.active_guppy.engine.space_caret = 0;
                Guppy.active_guppy.engine[Guppy.kb.k_controls[i]]();
                Guppy.active_guppy.temp_cursor.node = null;
            }
            Guppy.active_guppy.render(["up","down","right","left","home","end","sel_left","sel_right"].indexOf(i) < 0);
            //Guppy.active_guppy.render(false);
            return false;
        }}(i));
    for(i in Guppy.kb.k_text)
        if(!(Guppy.kb.k_chars[i] || Guppy.kb.k_syms[i] || Guppy.kb.k_controls[i])){
            Mousetrap.bind(i,function(i){ return function(){
                if(!Guppy.active_guppy) return true;
                Guppy.active_guppy.temp_cursor.node = null;
                if(Utils.is_text(Guppy.active_guppy.engine.current)){
                    Guppy.active_guppy.engine.insert_string(Guppy.kb.k_text[i]);
                    Guppy.active_guppy.render(true);
                }
                return false;
            }}(i));
        }
}

module.exports = Guppy;

},{"../lib/katex/katex-modified.min.js":1,"../lib/mousetrap/mousetrap.min.js":2,"./doc.js":4,"./engine.js":5,"./settings.js":8,"./symbols.js":9,"./utils.js":10}],7:[function(require,module,exports){
var Parser = function(token_types){
    var self = this;
    this.token_types = token_types;
    this.symbol_table = {};

    this.original_symbol = {
        nud: function () { throw Error("Undefined"); },
        led: function () { throw Error("Missing operator"); }
    };

    this.mul = function(left){ return ["*", [left, this.nud()]]; };
    
    this.symbol = function (id, bp) {
        var s = self.symbol_table[id];
        bp = bp || 0;
        if (s) {
            if (bp >= s.lbp) {
                s.lbp = bp;
            }
        } else {
            s = Object.create(self.original_symbol);
            s.id = s.value = id;
            s.lbp = bp;
            s.parent = self;
            self.symbol_table[id] = s;
        }
        return s;
    };
    
    this.advance = function (id) {
        var a, o, t, v;
        if (id && this.token.id !== id) {
            throw Error("Expected '" + id + "'");
        }
        if (self.token_nr >= self.tokens.length) {
            self.token = this.symbol_table["(end)"];
            return;
        }
        t = self.tokens[self.token_nr];
        self.token_nr += 1;
        v = t.value;
        var args = null;
        a = t.type;
        if (a === "name") {
            o = this.symbol_table["(var)"];
        } else if (a === "operator") {
            o = this.symbol_table[v];
            if (!o) {
                throw Error("Unknown operator");
            }
        } else if (a === "pass") {
            a = "pass";
            o = this.symbol_table["(pass)"];
            args = t.args;
        } else if (a === "number") {
            a = "literal";
            o = this.symbol_table["(literal)"];
        } else if (a === "function") {
            a = "function";
            o = this.symbol_table["(function)"];
            args = t.args;
        } else {
            throw Error("Unexpected token",t);
        }
        self.token = Object.create(o);
        self.token.type = a;
        self.token.value = v;
        if(args) self.token.args = args;
        return self.token;
    };

    this.expression = function (rbp) {
        var left;
        var t = self.token;
        self.advance();
        left = t.nud();
        while (rbp < self.token.lbp) {
            t = self.token;
            self.advance();
            left = t.led(left);
        }
        return left;
    };

    this.infix = function (id, bp, led) {
        var s = this.symbol(id, bp);
        s.led = led || function (left) {
            return [this.value, [left, self.expression(bp)]];
        };
        return s;
    };
    
    this.prefix = function (id, nud) {
        var s = self.symbol(id);
        s.nud = nud || function () {
            return [this.value, [self.expression(70)]];
        };
        return s;
    }

    this.symbol("(end)");
    var s = null;
    
    s = this.symbol("(blank)", 60);
    s.nud = function(){ return ["blank"];};

    s = this.symbol("(function)", 60);
    s.led = this.mul;
    s.nud = function(){ return [this.value, this.args || []];};
    
    s = this.symbol("(literal)", 60);
    s.led = this.mul;
    s.nud = function(){ return ["val", [this.value]] };

    s = this.symbol("(pass)", 60);
    s.led = this.mul;
    s.nud = function(){ return this.args[0] };
    
    s = this.symbol("(var)", 60);
    s.led = this.mul;
    s.nud = function(){ return ["var", [this.value]] };
        
    this.token_nr = 0;
    this.tokens = [];
    
    this.infix("=", 40);
    this.infix("!=", 40);
    this.infix("<", 40);
    this.infix(">", 40);
    this.infix("<=", 40);
    this.infix(">=", 40);
    this.infix("+", 50);
    this.infix("-", 50);
    this.infix("*", 60);
    this.infix("/", 60);
    this.infix("!", 70, function(left){ return ["factorial", [left]]; });
    this.infix("^", 70, function(left){ return ["exponential", [left, self.expression(70)]]; });
    this.infix("_", 70, function(left){ return ["subscript", [left, self.expression(70)]]; });
    this.infix("(", 80, self.mul);
    this.symbol("(").nud = function(){ var ans = self.expression(0); self.advance(")"); return ans; }
    this.symbol(")");
    this.symbol("{").nud = function(){ var ans = self.expression(0); self.advance("}"); return ans; }
    this.symbol("}");
    this.symbol(",");
    this.prefix("-");

    this.tokenise_and_parse = function(str){
        return this.parse(this.tokenise(str));
    }
    
    this.parse = function(tokens){
        this.tokens = tokens;
        this.token_nr = 0;
        if(this.tokens.length == 0) return ["blank"];
        this.advance();
        return this.expression(10);
    }
}

Parser.prototype.tokenise = function(text){
    var ans = [];
    while(text.length > 0){
        var ok = false;
        for(var i = 0; i < this.token_types.length; i++){
            var t = this.token_types[i];
            var re = RegExp(t.re);
            var m = re.exec(text);
            if(m){
                m = m[0];
                text = text.substring(m.length);
                ok = true;
                if(t.type != "space") ans.push({"type":t.type, "value": t.value(m)})
                break;
            }
        }
        if(!ok){
            return [];
        }
    }
    return ans;
}

var EParser = new Parser([
    {"type":"number", "re":"^[0-9.]+", "value":function(m){
        if(isNaN(Number(m))) throw Error("Invalid number: "+m);
        return Number(m);
    }},
    {"type":"operator", "re":"^(<=|>=|!=|>|<|=)", "value":function(m){return m}},
    {"type":"operator", "re":"^[-+*/!]", "value":function(m){return m}},
    {"type":"name", "re":"^[a-zA-Z]", "value":function(m){return m}},
    {"type":"space", "re":"^\\s+", "value":function(m){return m}}
]);

var TextParser = new Parser([
    {"type":"number", "re":"^[0-9.]+", "value":function(m){
        if(isNaN(Number(m))) throw Error("Invalid number: "+m);
        return Number(m);
    }},
    {"type":"operator", "re":"^(!=|>=|<=)", "value":function(m){return m;}},
    {"type":"operator", "re":"^[-+*/,!()=<>_^]", "value":function(m){return m}},
    {"type":"name", "re":"^[a-zA-Z_]*[a-zA-Z]", "value":function(m){return m}},
    {"type":"comma", "re":"^,", "value":function(m){return m}},
    {"type":"space", "re":"^\\s+", "value":function(m){return m}}
]);


var s = TextParser.symbol("(var)", 60);
s.led = TextParser.mul;
s.nud = function(){
    if(this.parent.token.id == "("){
        var args = [];
        TextParser.advance()
        if(this.parent.token.id !== ")"){
            while(true){
                args.push(TextParser.expression(0));
                if (this.parent.token.id !== ",") {
                    break;
                }
                TextParser.advance(",");
            }
        }
        TextParser.advance(")");
        return [this.value, args];
    }
    else{
        return ["var", [this.value]]
    }
};

var LaTeXParser = new Parser([
    {"type":"number", "re":"^[0-9.]+", "value":function(m){
        if(isNaN(Number(m))) throw Error("Invalid number: "+m);
        return Number(m);
    }},
    {"type":"operator", "re":"^(!=|>=|<=)", "value":function(m){return m;}},
    {"type":"operator", "re":"^[-+*/,!()=<>_^}{]", "value":function(m){return m}},
    {"type":"name", "re":"^[a-zA-Z_]*[a-zA-Z]", "value":function(m){return m}},
    {"type":"name", "re":"^\\\\[a-zA-Z]*[a-zA-Z]", "value":function(m){return m.substring(1)}},
    {"type":"space", "re":"^\\s+", "value":function(m){return m}}
]);

s = LaTeXParser.symbol("(var)", 60);
s.led = LaTeXParser.mul;
s.nud = function(){
    var args = [];
    
    while(this.parent.token.id == "{"){
        LaTeXParser.advance()
        if(this.parent.token.id !== "}"){
            args.push(LaTeXParser.expression(0));
            LaTeXParser.advance("}");
        }
    }
    if(args.length > 0) return [this.value, args];
    else return ["var", [this.value]]
};

module.exports = {"Parser":Parser,
                  "TextParser":TextParser,
                  "LaTeXParser":LaTeXParser,
                  "EParser": EParser};


},{}],8:[function(require,module,exports){
var katex = require('../lib/katex/katex-modified.min.js');
var Symbols = require('./symbols.js');
var Settings = {}
Settings.config = {};
Settings.config.path = "/lib/guppy";
Settings.config.events = {};
Settings.config.settings = {
    "autoreplace":"auto",
    "empty_content":"\\blue{[?]}",
    "blank_caret":"",
    "blacklist":[],
    "buttons":["osk","settings","symbols","controls"],
    "cliptype":"latex",
};

Settings.settings_options = {
    "autoreplace":["auto","whole","delay","none"],
    "cliptype":["latex","text","xml","ast","asciimath"],
};

Settings.panels = {};
Settings.panels.controls = document.createElement("div");
Settings.panels.controls.setAttribute("class","guppy_help");
Settings.panels.controls.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
Settings.panels.controls.innerHTML = "<p>Start typing the name of a mathematical function to automatically insert it.  </p><p>(For example, \"sqrt\" for root, \"mat\" for matrix, or \"defi\" for definite integral.)</p>\n\
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>\n\
<h3>Controls</h3><table id=\"guppy_help_table\"><tr><td><b>Press...</b></td><td><b>...to do</b></td></tr></table>";

Settings.panels.symbols = document.createElement("div");
Settings.panels.symbols.setAttribute("class","guppy_help");
Settings.panels.symbols.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
Settings.panels.symbols.innerHTML = "<p>Start typing the name of a mathematical function to automatically insert it.  </p><p>(For example, \"sqrt\" for root, \"mat\" for matrix, or \"defi\" for definite integral.)</p>\n\
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>\n\
<h3>Symbols</h3><table id=\"guppy_syms_table\"><tr><td><b>Type...</b></td><td><b>...to get</b></td></tr></table>";

Settings.panels.settings = document.createElement("div");
Settings.panels.settings.setAttribute("class","guppy_help");
Settings.panels.settings.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
Settings.panels.settings.innerHTML = "<p>Global settings: </p>\n\
<style>div.guppy_help td{ vertical-align:top;padding: 2px;}</style>\n\
<h3>Settings</h3><table id=\"guppy_settings_table\"></table>";

Settings.div_names = ["controls","symbols","settings"];

var make_row = function(table_id, c1, c2){
    var row = document.createElement("tr");
    row.innerHTML = "<td><font face=\"monospace\">"+c1+"</font></td><td>"+c2+"</td>";
    document.getElementById(table_id).appendChild(row);
    return row;
}

var make_x = function(elt){
    var x = document.createElement("div");
    x.setAttribute("class","guppy-card-x");
    x.innerHTML = "<font size=\"6pt\">&times;</font>";
    x.style = "cursor:pointer;position:absolute;top:0;right:0;padding-right:5px;line-height:1;";
    x.onclick = function(){ elt.style.display = "none"; }
    elt.appendChild(x);
}

Settings.hide_all = function(){
    for(var i = 0; i < Settings.div_names.length; i++)
        Settings.panels[Settings.div_names[i]].style.display = "none";
}

Settings.toggle = function(card, g){
    if(Settings.div_names.indexOf(card) >= 0){
        Settings.init_card(card, g);
        if(Settings.panels[card].style.display == "none"){
            Settings.hide_all();
            var r = g.editor.getBoundingClientRect();
            Settings.panels[card].style.top = (r.bottom+document.documentElement.scrollTop) + "px";
            Settings.panels[card].style.left = (r.left+document.documentElement.scrollLeft) + "px";
            Settings.panels[card].style.display = "block";
        }
        else{
            Settings.hide_all();
        }
    }
}

Settings.init_card = function(card, g){
    if(card == "settings"){
        document.getElementById("guppy_settings_table").innerHTML = "";
        for(var s in Settings.settings_options){
            var opt = Settings.settings_options[s];
            var val = g.engine.setting(s);
            var sel = document.createElement("select");
            sel.setAttribute("selected", val);
            sel.setAttribute("id","guppy_settings_select_"+s);
            sel.onchange = function(ss){
                return function(){
                    Settings.config.settings[ss] = document.getElementById("guppy_settings_select_"+ss).value;
                }
            }(s);
            for(var i = 0; i < opt.length; i++){
                var o = document.createElement("option");
                o.setAttribute("value",opt[i]);
                o.innerHTML = opt[i];
                sel.appendChild(o);
            }
            var row = document.createElement("tr");
            row.innerHTML = "<td><font face=\"monospace\">"+s+"</font></td>";
            var td = document.createElement("td");
            td.appendChild(sel);
            row.appendChild(td);
            document.getElementById("guppy_settings_table").appendChild(row);
        }
    }
}

Settings.init = function(symbols){
    for(var i = 0; i < Settings.div_names.length; i++){
        make_x(Settings.panels[Settings.div_names[i]]);
        document.body.appendChild(Settings.panels[Settings.div_names[i]])
    }
    
    make_row("guppy_help_table","left/right arrows","Move cursor");
    make_row("guppy_help_table","shift+left/right arrows","Select region")
    make_row("guppy_help_table","ctrl+a","Select all");
    make_row("guppy_help_table","ctrl+x/c/v","Cut/copy/paste");
    make_row("guppy_help_table","ctrl+z/y","Undo/redo");
    make_row("guppy_help_table","ctrl+left/right","Add entry to list or column to matrix");
    make_row("guppy_help_table","shift+ctrl+left/right","Add copy of current entry/column to to list/matrix");
    make_row("guppy_help_table","ctrl+up/down","Add row to matrix");
    make_row("guppy_help_table","shift+ctrl+up/down","Add copy of current row to matrix");
    make_row("guppy_help_table","ctrl+backspace","Delete current entry in list or column in matrix");
    make_row("guppy_help_table","ctrl+shift+backspace","Delete current row in matrix");

    
    
    for(var s in symbols){
        var latex = Symbols.add_blanks(symbols[s].output.latex, "\\blue{[?]}");
        var row = make_row("guppy_syms_table",s," ");
        katex.render(latex, row.lastChild);
    }
}

module.exports = Settings;

},{"../lib/katex/katex-modified.min.js":1,"./symbols.js":9}],9:[function(require,module,exports){
var Version = require('./version.js');
var Symbols = {"symbols":{}, "templates":{}};

Symbols.make_template_symbol = function(template_name, name, args){
    var template = JSON.parse(JSON.stringify(Symbols.templates[template_name]));
    return Symbols.eval_template(template, name, args);
}

Symbols.eval_template = function(template, name, args){
    args['name'] = name;
    if(Object.prototype.toString.call(template) == "[object String]") {
        var ans = template;
        for(var nam in args) {
            ans = ans.replace(new RegExp("\\{\\$"+nam+"\\}"),args[nam]);
        }
        return ans;
    }
    else {
        for(var x in template) {
            template[x] = Symbols.eval_template(template[x], name, args)
        }
        return template;
    }
}

Symbols.lookup_type = function(type){
    for(var s in Symbols.symbols){
        if(Symbols.symbols[s].attrs.type == type) return s;
    }
}

Symbols.add_symbols = function(syms){
    var version = syms["_version"];
    var collection_name = syms["_name"];
    delete syms["_version"];
    delete syms["_name"];
    if(!version || version != Version.SYMBOL_VERSION) Version.SYMBOL_ERROR(collection_name, version);
    var templates = syms["_templates"];
    if(templates){
        for(var t in templates){
            Symbols.templates[t] = templates[t];
        }
        delete syms["_templates"];
    }
    for(var s in syms){
        if(syms[s].template){
            for(var v in syms[s].values){
                var name = null;
                var args = null;
                if(Object.prototype.toString.call(syms[s].values) == "[object Array]"){
                    name = syms[s].values[v];
                    args = {}
                }
                else{
                    name = v;
                    args = syms[s].values[v];
                }
                Symbols.symbols[name] = Symbols.make_template_symbol(syms[s].template, name, args);
            }
        }
        else{
            Symbols.symbols[s] = syms[s];
        }
    }
}

Symbols.validate = function(){
    for(var sym in Symbols.symbols){
	if(!Symbols.symbols[sym].output.latex) throw "Symbol " + sym + " missing output.latex (needed for display)";
	if(!Symbols.symbols[sym].attrs.name) throw "Symbol " + sym + " missing attrs.name (needed for text output)";
	if(!Symbols.symbols[sym].attrs.group) throw "Symbol " + sym + " missing attrs.group (needed for mobile)";
        //for(var i = 0; i < sym.length; i++)
        //    if(sym.substring(0,i) in Symbols.symbols) throw "WARNING: Symbols are not prefix free: '" + sym.substring(0,i) + "' and '" + sym + "' are both symbols";
    }
}

// Returns an array with alternating text and argument elements of the form
// {"type":"text", "val":the_text} or {"type":"arg", "index":the_index, "seperators":[sep1,sep2,...]}
Symbols.split_output = function(output){
    var regex = /\{\$([0-9]+)/g, result, starts = [], indices = [], i;
    var ans = [];
    while ((result = regex.exec(output))){
        starts.push(result.index);
        indices.push(parseInt(result[1]));
    }
    ans.push({"type":"text","val":output.substring(0,starts.length > 0 ? starts[0] : output.length)}); // Push the first text bit
    for(i = 0; i < starts.length; i++){
        var idx = starts[i]+1;
        var separators = [];
        var sep = "";
        var opens = 1
        while(opens > 0 && idx < output.length){
            if(output[idx] == "}"){
                if(opens == 2){ separators.push(sep); sep = ""; }
                opens--; }
            if(opens >= 2){ sep += output[idx]; }
            if(output[idx] == "{"){ opens++; }
            idx++;
        }
        ans.push({"type":"arg","index":indices[i],"separators":separators});
        var next = (i == starts.length - 1) ? output.length : starts[i+1];
        ans.push({"type":"text","val":output.substring(idx,next)}); // Push the next text bit
    }
    return ans;
}

Symbols.add_blanks = function(output, blank){
    var out = Symbols.split_output(output);
    var ans = "";
    for(var i = 0; i < out.length; i++){
        if(out[i]["type"] == "text"){
            ans += out[i]['val'];
        }
        else ans += blank;
    }
    return ans;
}

Symbols.symbol_to_node = function(s, content, base){
    
    // s is a symbol
    //
    // content is a list of nodes to insert
    var f = base.createElement("f");
    for(var attr in s.attrs){
        f.setAttribute(attr, s.attrs[attr]);
    }
    if("ast" in s){
        if("type" in s.ast) f.setAttribute("ast_type",s.ast["type"])
        if("value" in s.ast) f.setAttribute("ast_value",s.ast["value"])
    }
    //if(s['char']) f.setAttribute("c","yes");
    
    var first_ref=-1, arglist = [];
    var first, i;
    
    // Make the b nodes for rendering each output    
    for(var t in s["output"]){
        var b = base.createElement("b");
        b.setAttribute("p",t);

        var out = Symbols.split_output(s["output"][t]);
        for(i = 0; i < out.length; i++){
            if(out[i]["type"] == "text"){
                if(out[i]["val"].length > 0) b.appendChild(base.createTextNode(out[i]['val']));
            }
            else{
                if(t == 'latex') arglist.push(out[i]);
                var nt = base.createElement("r");
                nt.setAttribute("ref",out[i]["index"]);
                if(out[i]["separators"].length > 0) nt.setAttribute("d",out[i]["separators"].length);
                for(var j = 0; j < out[i]["separators"].length; j++) nt.setAttribute("sep"+j,out[i]["separators"][j]);
                if(t == 'latex' && first_ref == -1) first_ref = out[i]["index"];
                b.appendChild(nt);
            }
        }
        f.appendChild(b);
    }
    // Now make the c/l nodes for storing the content
    for(i = 0; i < arglist.length; i++){
        var a = arglist[i];
        var nc;
        if(i in content && a['separators'].length > 0) {  // If the content for this node is provided and is an array, then dig down to find the first c child
            f.appendChild(content[i][0]);
            nc = content[i][0];
            while(nc.nodeName != "c")
                nc = nc.firstChild;
        }
        else if(i in content) {                                  // If the content for this node is provided and not an array, create the c node and populate its content
            var node_list = content[i];
            nc = base.createElement("c");
            for(var se = 0; se < node_list.length; se++)
                nc.appendChild(node_list[se].cloneNode(true));
            f.appendChild(nc)
        }
        else{                                             // Otherwise create the c node and possibly l nodes
            nc = base.createElement("c");
            var new_e = base.createElement("e");
            new_e.appendChild(base.createTextNode(""));
            nc.appendChild(new_e);
            var par = f;                                  // Now we add nested l elements if this is an array of dimension > 0
            for(j = 0; j < a['separators'].length; j++){
                var nl = base.createElement("l");
                nl.setAttribute("s","1");
                par.appendChild(nl);
                par = nl;
            }
            par.appendChild(nc);
        }
        if(i+1 == first_ref) first = nc.lastChild;        // Note the first node we should visit based on the LaTeX output
        if(s['args'] && s['args'][i]){                    // Set the arguments for the c node based on the symbol
            for(var arg in s['args'][i]){
                nc.setAttribute(arg,s['args'][i][arg]);
            }
        }
    }
    return {"f":f, "first":first, "args":arglist};
}


module.exports = Symbols;

},{"./version.js":11}],10:[function(require,module,exports){
var Utils = {};

Utils.CARET = "\\cursor[-0.2ex]{0.7em}"
Utils.TEMP_SMALL_CARET = "\\cursor{0.7ex}"
Utils.TEMP_CARET = "\\cursor[-0.2ex]{0.7em}"
Utils.SMALL_CARET = "\\cursor{0.7ex}"
Utils.SEL_CARET = "\\cursor[-0.2ex]{0.7em}"
Utils.SMALL_SEL_CARET = "\\cursor{0.7ex}"
Utils.SEL_COLOR = "red"

Utils.is_blank = function(n){
    return n.firstChild == null || n.firstChild.nodeValue == '';
}

Utils.get_length = function(n){
    if(Utils.is_blank(n) || n.nodeName == 'f') return 0
    return n.firstChild.nodeValue.length;
}

Utils.path_to = function(n){
    var name = n.nodeName;
    if(name == "m") return "guppy_loc_m";
    var ns = 0;
    for(var nn = n; nn != null; nn = nn.previousSibling) if(nn.nodeType == 1 && nn.nodeName == name) ns++;
    return Utils.path_to(n.parentNode)+"_"+name+""+ns;
}

Utils.is_text = function(nn){
    return nn.parentNode.hasAttribute("mode") && (nn.parentNode.getAttribute("mode") == "text" || nn.parentNode.getAttribute("mode") == "symbol");
}

Utils.is_char = function(nn){
    for(var n = nn.firstChild; n; n = n.nextSibling){
	if(n.nodeName == "c" || n.nodeName == "l") return false;
    }
    return true;
}

Utils.is_symbol = function(nn){
    return nn.parentNode.getAttribute("mode") && nn.parentNode.getAttribute("mode") == "symbol";
}

Utils.is_small = function(nn){
    var n = nn.parentNode;
    while(n != null && n.nodeName != 'm'){
        if(n.getAttribute("small") == "yes"){
            return true;
        }
        n = n.parentNode
        while(n != null && n.nodeName != 'c')
            n = n.parentNode;
    }
    return false;
}

module.exports = Utils;

},{}],11:[function(require,module,exports){
var Version = {}
Version.GUPPY_VERSION = "2.0.0-alpha.1";
Version.DOC_VERSION = "1.2.0";
Version.SYMBOL_VERSION = "2.0.0-alpha.3";

Version.DOC_ERROR = function(id, found_ver){
    throw Error("Document version mismatch for " + id + ": Found " + found_ver + ", required " + Version.DOC_VERSION + ".  To update your document, please see daniel3735928559.github.io/guppy/doc/version.html");
}

Version.SYMBOL_ERROR = function(id, found_ver){
    throw Error("Symbol version mismatch for " + id + ": Found " + found_ver + ", required " + Version.SYMBOL_VERSION + ".  To update your document, please see daniel3735928559.github.io/guppy/doc/version.html");
}
module.exports = Version

},{}]},{},[6])(6)
});
/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-adownload-blobconstructor-bloburls-contenteditable-cookies-cors-documentfragment-eventlistener-fetch-hashchange-history-indexeddb-indexeddbblob-intl-json-queryselector-requestanimationframe-serviceworker-unicode-urlsearchparams-xhrresponsetypearraybuffer-xhrresponsetypeblob-xhrresponsetypedocument-xhrresponsetypejson-setclasses !*/
!function(e,n,t){function r(e,n){return typeof e===n}function o(){var e,n,t,o,i,s,a;for(var d in T)if(T.hasOwnProperty(d)){if(e=[],n=T[d],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=r(n.fn,"function")?n.fn():n.fn,i=0;i<e.length;i++)s=e[i],a=s.split("."),1===a.length?Modernizr[a[0]]=o:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=o),x.push((o?"":"no-")+a.join("-"))}}function i(e){var n=w.className,t=Modernizr._config.classPrefix||"";if(S&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),S?w.className.baseVal=n:w.className=n)}function s(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):S?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function a(e,n){if("object"==typeof e)for(var t in e)L(e,t)&&a(t,e[t]);else{e=e.toLowerCase();var r=e.split("."),o=Modernizr[r[0]];if(2==r.length&&(o=o[r[1]]),"undefined"!=typeof o)return Modernizr;n="function"==typeof n?n():n,1==r.length?Modernizr[r[0]]=n:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=n),i([(n&&0!=n?"":"no-")+r.join("-")]),Modernizr._trigger(e,n)}return Modernizr}function d(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function u(){var e=n.body;return e||(e=s(S?"svg":"body"),e.fake=!0),e}function l(e,t,r,o){var i,a,d,l,f="modernizr",c=s("div"),p=u();if(parseInt(r,10))for(;r--;)d=s("div"),d.id=o?o[r]:f+(r+1),c.appendChild(d);return i=s("style"),i.type="text/css",i.id="s"+f,(p.fake?p:c).appendChild(i),p.appendChild(c),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(n.createTextNode(e)),c.id=f,p.fake&&(p.style.background="",p.style.overflow="hidden",l=w.style.overflow,w.style.overflow="hidden",w.appendChild(p)),a=t(c,e),p.fake?(p.parentNode.removeChild(p),w.style.overflow=l,w.offsetHeight):c.parentNode.removeChild(c),!!a}function f(e,n){return!!~(""+e).indexOf(n)}function c(e,n){return function(){return e.apply(n,arguments)}}function p(e,n,t){var o;for(var i in e)if(e[i]in n)return t===!1?e[i]:(o=n[e[i]],r(o,"function")?c(o,t||n):o);return!1}function h(n,t,r){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,n,t);var i=e.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(i){var s=i.error?"error":"log";i[s].call(i,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!t&&n.currentStyle&&n.currentStyle[r];return o}function v(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function y(n,r){var o=n.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(v(n[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];o--;)i.push("("+v(n[o])+":"+r+")");return i=i.join(" or "),l("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==h(e,null,"position")})}return t}function m(e,n,o,i){function a(){l&&(delete R.style,delete R.modElem)}if(i=r(i,"undefined")?!1:i,!r(o,"undefined")){var u=y(e,o);if(!r(u,"undefined"))return u}for(var l,c,p,h,v,m=["modernizr","tspan","samp"];!R.style&&m.length;)l=!0,R.modElem=s(m.shift()),R.style=R.modElem.style;for(p=e.length,c=0;p>c;c++)if(h=e[c],v=R.style[h],f(h,"-")&&(h=d(h)),R.style[h]!==t){if(i||r(o,"undefined"))return a(),"pfx"==n?h:!0;try{R.style[h]=o}catch(b){}if(R.style[h]!=v)return a(),"pfx"==n?h:!0}return a(),!1}function b(e,n,t,o,i){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+j.join(s+" ")+s).split(" ");return r(n,"string")||r(n,"undefined")?m(a,n,o,i):(a=(e+" "+q.join(s+" ")+s).split(" "),p(a,n,t))}function g(e,n){var t=e.deleteDatabase(n);t.onsuccess=function(){a("indexeddb.deletedatabase",!0)},t.onerror=function(){a("indexeddb.deletedatabase",!1)}}var x=[],T=[],C={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){T.push({name:e,fn:n,options:t})},addAsyncTest:function(e){T.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=C,Modernizr=new Modernizr,Modernizr.addTest("blobconstructor",function(){try{return!!new Blob}catch(e){return!1}},{aliases:["blob-constructor"]}),Modernizr.addTest("cookies",function(){try{n.cookie="cookietest=1";var e=-1!=n.cookie.indexOf("cookietest=");return n.cookie="cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT",e}catch(t){return!1}}),Modernizr.addTest("cors","XMLHttpRequest"in e&&"withCredentials"in new XMLHttpRequest),Modernizr.addTest("eventlistener","addEventListener"in e),Modernizr.addTest("history",function(){var n=navigator.userAgent;return-1===n.indexOf("Android 2.")&&-1===n.indexOf("Android 4.0")||-1===n.indexOf("Mobile Safari")||-1!==n.indexOf("Chrome")||-1!==n.indexOf("Windows Phone")||"file:"===location.protocol?e.history&&"pushState"in e.history:!1}),Modernizr.addTest("json","JSON"in e&&"parse"in JSON&&"stringify"in JSON),Modernizr.addTest("queryselector","querySelector"in n&&"querySelectorAll"in n),Modernizr.addTest("serviceworker","serviceWorker"in navigator),Modernizr.addTest("fetch","fetch"in e),Modernizr.addTest("urlsearchparams","URLSearchParams"in e);var w=n.documentElement;Modernizr.addTest("documentfragment",function(){return"createDocumentFragment"in n&&"appendChild"in w});var S="svg"===w.nodeName.toLowerCase();Modernizr.addTest("contenteditable",function(){if("contentEditable"in w){var e=s("div");return e.contentEditable=!0,"true"===e.contentEditable}}),Modernizr.addTest("adownload",!e.externalHost&&"download"in s("a"));var _=function(){function e(e,n){var o;return e?(n&&"string"!=typeof n||(n=s(n||"div")),e="on"+e,o=e in n,!o&&r&&(n.setAttribute||(n=s("div")),n.setAttribute(e,""),o="function"==typeof n[e],n[e]!==t&&(n[e]=t),n.removeAttribute(e)),o):!1}var r=!("onblur"in n.documentElement);return e}();C.hasEvent=_,Modernizr.addTest("hashchange",function(){return _("hashchange",e)===!1?!1:n.documentMode===t||n.documentMode>7});var O=function(e){if("undefined"==typeof XMLHttpRequest)return!1;var n=new XMLHttpRequest;n.open("get","/",!0);try{n.responseType=e}catch(t){return!1}return"response"in n&&n.responseType==e};Modernizr.addTest("xhrresponsetypearraybuffer",O("arraybuffer")),Modernizr.addTest("xhrresponsetypeblob",O("blob")),Modernizr.addTest("xhrresponsetypedocument",O("document")),Modernizr.addTest("xhrresponsetypejson",O("json"));var L;!function(){var e={}.hasOwnProperty;L=r(e,"undefined")||r(e.call,"undefined")?function(e,n){return n in e&&r(e.constructor.prototype[n],"undefined")}:function(n,t){return e.call(n,t)}}(),C._l={},C.on=function(e,n){this._l[e]||(this._l[e]=[]),this._l[e].push(n),Modernizr.hasOwnProperty(e)&&setTimeout(function(){Modernizr._trigger(e,Modernizr[e])},0)},C._trigger=function(e,n){if(this._l[e]){var t=this._l[e];setTimeout(function(){var e,r;for(e=0;e<t.length;e++)(r=t[e])(n)},0),delete this._l[e]}},Modernizr._q.push(function(){C.addTest=a});var E=C.testStyles=l;Modernizr.addTest("unicode",function(){var e,n=s("span"),t=s("span");return E("#modernizr{font-family:Arial,sans;font-size:300em;}",function(r){n.innerHTML=S?"妇":"&#5987;",t.innerHTML=S?"☆":"&#9734;",r.appendChild(n),r.appendChild(t),e="offsetWidth"in n&&n.offsetWidth!==t.offsetWidth}),e});var k="Moz O ms Webkit",j=C._config.usePrefixes?k.split(" "):[];C._cssomPrefixes=j;var A=function(n){var r,o=prefixes.length,i=e.CSSRule;if("undefined"==typeof i)return t;if(!n)return!1;if(n=n.replace(/^@/,""),r=n.replace(/-/g,"_").toUpperCase()+"_RULE",r in i)return"@"+n;for(var s=0;o>s;s++){var a=prefixes[s],d=a.toUpperCase()+"_"+r;if(d in i)return"@-"+a.toLowerCase()+"-"+n}return!1};C.atRule=A;var q=C._config.usePrefixes?k.toLowerCase().split(" "):[];C._domPrefixes=q;var P={elem:s("modernizr")};Modernizr._q.push(function(){delete P.elem});var R={style:P.elem.style};Modernizr._q.unshift(function(){delete R.style}),C.testAllProps=b;var z=C.prefixed=function(e,n,t){return 0===e.indexOf("@")?A(e):(-1!=e.indexOf("-")&&(e=d(e)),n?b(e,n,t):b(e,"pfx"))};Modernizr.addAsyncTest(function(){var n;try{n=z("indexedDB",e)}catch(t){}if(n){var r="modernizr-"+Math.random(),o=n.open(r);o.onerror=function(){o.error&&"InvalidStateError"===o.error.name?a("indexeddb",!1):(a("indexeddb",!0),g(n,r))},o.onsuccess=function(){a("indexeddb",!0),g(n,r)}}else a("indexeddb",!1)}),Modernizr.addAsyncTest(function(){var n,t,r,o,i="detect-blob-support",s=!1;try{n=z("indexedDB",e)}catch(d){}if(!Modernizr.indexeddb||!Modernizr.indexeddb.deletedatabase)return!1;try{n.deleteDatabase(i).onsuccess=function(){t=n.open(i,1),t.onupgradeneeded=function(){t.result.createObjectStore("store")},t.onsuccess=function(){r=t.result;try{o=r.transaction("store","readwrite").objectStore("store").put(new Blob,"key"),o.onsuccess=function(){s=!0},o.onerror=function(){s=!1}}catch(e){s=!1}finally{a("indexeddbblob",s),r.close(),n.deleteDatabase(i)}}}}catch(d){a("indexeddbblob",!1)}}),Modernizr.addTest("intl",!!z("Intl",e)),Modernizr.addTest("requestanimationframe",!!z("requestAnimationFrame",e),{aliases:["raf"]});var M=z("URL",e,!1);M=M&&e[M],Modernizr.addTest("bloburls",M&&"revokeObjectURL"in M&&"createObjectURL"in M),o(),i(x),delete C.addTest,delete C.addAsyncTest;for(var N=0;N<Modernizr._q.length;N++)Modernizr._q[N]();e.Modernizr=Modernizr}(window,document);
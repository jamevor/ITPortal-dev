"use strict";function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(a){if(Symbol.iterator in Object(a)||"[object Arguments]"===Object.prototype.toString.call(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var ListIndent=function(){function a(b){var c=b.data,d=b.config,e=b.api;_classCallCheck(this,a),this.data=c,this.config=d,this.api=e,this.button=null,this.state=!1}return _createClass(a,null,[{key:"isInline",get:function(){return!0}}]),_createClass(a,[{key:"render",value:function(){return this.button=document.createElement("button"),this.button.type="button",this.button.innerHTML="<i class='far fa-indent'></i>",this.button.classList.add(this.api.styles.inlineToolButton),this.button}},{key:"surround",value:function(a){if(this.state){var b=a.commonAncestorContainer.parentElement,c=b.innerHTML,d=b.previousSibling,e=_toConsumableArray(d.childNodes).filter(function(a){return a.tagName&&"UL"===a.tagName.toUpperCase()}),f=e.length?e[0]:document.createElement("UL");f.classList=this.CSS.wrapperNested;var g=document.createElement("LI");g.classList=this.CSS.item,g.innerHTML=c,f.appendChild(g),e.length||d.appendChild(f),b.parentElement.removeChild(b)}}},{key:"checkState",value:function(a){var b=a.anchorNode;if(b){var c=b instanceof Element?b:b.parentElement,d=c&&c.previousSibling&&c.previousSibling.tagName&&"LI"===c.previousSibling.tagName.toUpperCase();this.state=d}}},{key:"CSS",get:function(){return{wrapperNested:"cdx-list--nested",item:"cdx-list__item"}}}]),a}();
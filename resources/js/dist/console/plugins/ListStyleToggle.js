"use strict";function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var ListStyleToggle=function(){function a(b){var c=b.data,d=b.config,e=b.api;_classCallCheck(this,a),this.data=c,this.config=d,this.api=e,this.button=null,this.state=!1}return _createClass(a,null,[{key:"isInline",get:function(){return!0}}]),_createClass(a,[{key:"render",value:function(){return this.button=document.createElement("button"),this.button.type="button",this.button.innerHTML="<i id='cdx-list-style-toggle' class='far fa-list-ul'></i>",this.button.classList.add(this.api.styles.inlineToolButton),this.button}},{key:"surround",value:function(a){if(this.state){for(var b=a.commonAncestorContainer.parentNode.parentNode,c="UL"===b.tagName.toUpperCase()?"ol":"ul",d=document.createElement(c);b.firstChild;)d.appendChild(b.firstChild);for(var e=b.attributes.length-1;0<=e;--e)d.attributes.setNamedItem(b.attributes[e].cloneNode());b.parentNode.replaceChild(d,b),document.getElementsByClassName("ce-inline-toolbar")[0].classList.remove("ce-inline-toolbar--showed")}}},{key:"checkState",value:function(a){var b=a.anchorNode;if(b){var c=b instanceof Element?b:b.parentNode;c&&c.parentNode&&c.parentNode.tagName&&"UL"===c.parentNode.tagName.toUpperCase()?(document.getElementById("cdx-list-style-toggle").classList.remove("fa-list-ul"),document.getElementById("cdx-list-style-toggle").classList.add("fa-list-ol")):(document.getElementById("cdx-list-style-toggle").classList.add("fa-list-ul"),document.getElementById("cdx-list-style-toggle").classList.remove("fa-list-ol")),this.state=!0}}},{key:"CSS",get:function(){return{wrapperNested:"cdx-list--nested",item:"cdx-list__item"}}}]),a}();
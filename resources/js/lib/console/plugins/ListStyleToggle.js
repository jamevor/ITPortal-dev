"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
	exported ListStyleToggle
*/
var ListStyleToggle =
/*#__PURE__*/
function () {
  _createClass(ListStyleToggle, null, [{
    key: "isInline",
    get: function get() {
      return true;
    }
  }]);

  function ListStyleToggle(_ref) {
    var data = _ref.data,
        config = _ref.config,
        api = _ref.api;

    _classCallCheck(this, ListStyleToggle);

    this.data = data;
    this.config = config;
    this.api = api;
    this.button = null;
    this.state = false;
  }

  _createClass(ListStyleToggle, [{
    key: "render",
    value: function render() {
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.innerHTML = '<i id=\'cdx-list-style-toggle\' class=\'far fa-list-ul\'></i>';
      this.button.classList.add(this.api.styles.inlineToolButton);
      return this.button;
    }
    /**
      * Styles
      * @private
      */

  }, {
    key: "surround",
    value: function surround(range) {
      // console.log(range);
      if (!this.state) {
        return;
      }

      var elt = range.commonAncestorContainer.parentNode.parentNode; // console.log(elt);

      var newTagName = elt.tagName.toUpperCase() === 'UL' ? 'ol' : 'ul';
      var newElt = document.createElement(newTagName);

      while (elt.firstChild) {
        newElt.appendChild(elt.firstChild);
      }

      for (var i = elt.attributes.length - 1; i >= 0; --i) {
        newElt.attributes.setNamedItem(elt.attributes[i].cloneNode());
      }

      elt.parentNode.replaceChild(newElt, elt);
      document.getElementsByClassName('ce-inline-toolbar')[0].classList.remove('ce-inline-toolbar--showed');
    }
  }, {
    key: "checkState",
    value: function checkState(selection) {
      // console.log(selection);
      var text = selection.anchorNode;

      if (!text) {
        return;
      }

      var anchorElement = text instanceof Element ? text : text.parentNode;

      if (anchorElement && anchorElement.parentNode && anchorElement.parentNode.tagName && anchorElement.parentNode.tagName.toUpperCase() === 'UL') {
        document.getElementById('cdx-list-style-toggle').classList.remove('fa-list-ul');
        document.getElementById('cdx-list-style-toggle').classList.add('fa-list-ol');
      } else {
        document.getElementById('cdx-list-style-toggle').classList.add('fa-list-ul');
        document.getElementById('cdx-list-style-toggle').classList.remove('fa-list-ol');
      } // const state = anchorElement && anchorElement.parentNode && anchorElement.parentNode.tagName
      // && (anchorElement.parentNode.tagName.toUpperCase() === 'UL' || anchorElement.parentNode.tagName.toUpperCase() === 'OL') && !anchorElement.parentNode.classList.includes('cdx-list');


      this.state = true;
    }
  }, {
    key: "CSS",
    get: function get() {
      return {
        wrapperNested: 'cdx-list--nested',
        item: 'cdx-list__item'
      };
    }
  }]);

  return ListStyleToggle;
}();
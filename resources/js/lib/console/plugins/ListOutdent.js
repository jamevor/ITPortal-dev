"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* exported ListOutdent */
var ListOutdent =
/*#__PURE__*/
function () {
  _createClass(ListOutdent, null, [{
    key: "isInline",
    get: function get() {
      return true;
    }
  }]);

  function ListOutdent(_ref) {
    var data = _ref.data,
        config = _ref.config,
        api = _ref.api;

    _classCallCheck(this, ListOutdent);

    this.data = data;
    this.config = config;
    this.api = api;
    this.button = null;
    this.state = false;
  }

  _createClass(ListOutdent, [{
    key: "render",
    value: function render() {
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.innerHTML = '<i class=\'far fa-outdent\'></i>';
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
      /**
         * @type HTMLElement
         */


      var elt = range.commonAncestorContainer.parentElement;
      var eltWrapper = elt.parentNode; // ul containing items

      /**
         * @type HTMLElement
         */

      var parent = eltWrapper.parentNode;
      var siblings = [];

      for (var cursor = elt.nextSibling; cursor !== null; cursor = cursor.nextSibling) {
        siblings.push(cursor);
      }

      if (siblings.length) {
        var newUL = document.createElement('ul');
        newUL.classList.add(this.CSS.wrapperNested);
        newUL.appendChild.apply(newUL, siblings);
        elt.appendChild(newUL);
      }

      if (parent) {
        parent.after(elt);
      }
    }
  }, {
    key: "checkState",
    value: function checkState(selection) {
      // console.log(selection);
      var text = selection.anchorNode;

      if (!text) {
        return;
      }

      var anchorElement = text instanceof Element ? text : text.parentElement;

      var state = anchorElement && anchorElement.parentNode && anchorElement.parentNode.tagName && (anchorElement.parentNode.tagName.toUpperCase() === 'UL' || anchorElement.parentNode.tagName.toUpperCase() === 'OL') && anchorElement.parentNode.classList && _toConsumableArray(anchorElement.parentNode.classList).includes(this.CSS.wrapperNested);

      this.state = state;
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

  return ListOutdent;
}();
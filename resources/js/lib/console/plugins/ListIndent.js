"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
	exported ListIndent
*/
var ListIndent =
/*#__PURE__*/
function () {
  _createClass(ListIndent, null, [{
    key: "isInline",
    get: function get() {
      return true;
    }
  }]);

  function ListIndent(_ref) {
    var data = _ref.data,
        config = _ref.config,
        api = _ref.api;

    _classCallCheck(this, ListIndent);

    this.data = data;
    this.config = config;
    this.api = api;
    this.button = null;
    this.state = false;
  }

  _createClass(ListIndent, [{
    key: "render",
    value: function render() {
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.innerHTML = '<i class=\'far fa-indent\'></i>';
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

      var elt = range.commonAncestorContainer.parentElement;
      var listItemText = elt.innerHTML;
      var prev = elt.previousSibling;

      var prevUL = _toConsumableArray(prev.childNodes).filter(function (n) {
        return n.tagName && n.tagName.toUpperCase() === 'UL';
      });

      var listToAdd = prevUL.length ? prevUL[0] : document.createElement('UL');
      listToAdd.classList = this.CSS.wrapperNested;
      var newListItem = document.createElement('LI');
      newListItem.classList = this.CSS.item;
      newListItem.innerHTML = listItemText;
      listToAdd.appendChild(newListItem);
      if (!prevUL.length) prev.appendChild(listToAdd);
      elt.parentElement.removeChild(elt);
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
      var state = anchorElement && anchorElement.previousSibling && anchorElement.previousSibling.tagName && anchorElement.previousSibling.tagName.toUpperCase() === 'LI';
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

  return ListIndent;
}();
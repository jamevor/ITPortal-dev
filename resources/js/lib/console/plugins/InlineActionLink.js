"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
	exported InlineActionLink
*/

/**
 * @class InlineActionLink
 * @classdesc InlineActionLink Tool for Editor.js
 * @property {InlineActionLinkData} data - Tool`s input and output data
 * @propert {object} api - Editor.js API instance
 *
 * @typedef {object} InlineActionLinkData
 * @description InlineActionLink Tool`s input and output data
 * @property {string} link - link
 * @property {string} title - title
 *
 */
var InlineActionLink =
/*#__PURE__*/
function () {
  _createClass(InlineActionLink, [{
    key: "CSS",

    /**
      * Tool`s styles
      *
      * @returns {{baseClass: string, wrapper: string, title: string, input: string, link: string}}
      */
    get: function get() {
      return {
        baseClass: this.api.styles.block,
        wrapper: 'cdx-action-link',
        title: 'cdx-action-link__title',
        input: this.api.styles.input,
        link: 'cdx-action-link__link'
      };
    }
    /**
      * Render plugin`s main Element and fill it with saved data
      *
      * @param {{data: InlineActionLinkData, api: object}}
      *   data — previously saved data
      *   config - user config for Tool
      *   api - Editor.js API
      */

  }], [{
    key: "toolbox",

    /**
      * Get Tool toolbox settings
      * icon - Tool icon's SVG
      * title - title to show in toolbox
      *
      * @return {{icon: string, title: string}}
      */
    get: function get() {
      return {
        icon: '<svg aria-hidden="true" focusable="false" width="16px" data-prefix="fas" data-icon="link" class="svg-inline--fa fa-link fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path></svg>',
        title: 'Button Link'
      };
    }
    /**
      * Empty InlineActionLink is not empty Block
      * @public
      * @returns {boolean}
      */

  }, {
    key: "contentless",
    get: function get() {
      return true;
    }
    /**
      * Default placeholder for link
      *
      * @public
      * @returns {string}
      */

  }, {
    key: "DEFAULT_LINK_PLACEHOLDER",
    get: function get() {
      return 'Button Link';
    }
    /**
      * Default placeholder for title
      *
      * @public
      * @returns {string}
      */

  }, {
    key: "DEFAULT_TITLE_PLACEHOLDER",
    get: function get() {
      return 'Button Title';
    }
  }]);

  function InlineActionLink(_ref) {
    var data = _ref.data,
        api = _ref.api;

    _classCallCheck(this, InlineActionLink);

    this.api = api;
    this.titlePlaceholder = InlineActionLink.DEFAULT_TITLE_PLACEHOLDER;
    this.linkPlaceholder = InlineActionLink.DEFAULT_LINK_PLACEHOLDER;
    this.data = {
      link: data.link || '',
      title: data.title || ''
    };
  }
  /**
    * Create InlineActionLink Tool container with inputs
    *
    * @returns {Element}
    */


  _createClass(InlineActionLink, [{
    key: "render",
    value: function render() {
      var container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]);

      var title = this._make('div', [this.CSS.input, this.CSS.title], {
        contentEditable: true,
        innerHTML: this.data.title
      });

      var link = this._make('div', [this.CSS.input, this.CSS.link], {
        contentEditable: true,
        innerHTML: this.data.link
      });

      title.dataset.placeholder = this.titlePlaceholder;
      link.dataset.placeholder = this.linkPlaceholder;
      container.appendChild(title);
      container.appendChild(link);
      return container;
    }
    /**
      * Extract InlineActionLink data from InlineActionLink Tool element
      *
      * @param {HTMLDivElement} inlineActionLinkElement - element to save
      * @returns {InlineActionLinkData}
      */

  }, {
    key: "save",
    value: function save(inlineActionLinkElement) {
      var title = inlineActionLinkElement.querySelector(".".concat(this.CSS.title));
      var link = inlineActionLinkElement.querySelector(".".concat(this.CSS.link));
      return Object.assign(this.data, {
        title: title.innerHTML,
        link: link.innerHTML
      });
    }
    /**
      * Sanitizer rules
      */

  }, {
    key: "_make",

    /**
      * Helper for making Elements with attributes
      *
      * @param  {string} tagName           - new Element tag name
      * @param  {array|string} classNames  - list or name of CSS classname(s)
      * @param  {Object} attributes        - any attributes
      * @return {Element}
      */
    value: function _make(tagName) {
      var classNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var el = document.createElement(tagName);

      if (Array.isArray(classNames)) {
        var _el$classList;

        (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray(classNames));
      } else if (classNames) {
        el.classList.add(classNames);
      }

      for (var attrName in attributes) {
        el[attrName] = attributes[attrName];
      }

      return el;
    }
  }], [{
    key: "sanitize",
    get: function get() {
      return {
        title: {
          br: true
        },
        link: {}
      };
    }
  }]);

  return InlineActionLink;
}();
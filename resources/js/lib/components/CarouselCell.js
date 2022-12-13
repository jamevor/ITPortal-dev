"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* exported CarouselCell */
var CarouselCell =
/*#__PURE__*/
function () {
  function CarouselCell(title, imgSrc, action, backgroundPosition) {
    _classCallCheck(this, CarouselCell);

    this.title = title;
    this.imgSrc = imgSrc;
    this.action = action;
    this.backgroundPosition = backgroundPosition || 'center';
  }

  _createClass(CarouselCell, [{
    key: "render",
    value: function render() {
      return "<a href=\"".concat(this.action, "\" class=\"cell carousel-cell small-12 medium-4\" style=\"background: url('").concat(this.imgSrc, "'); background-position: ").concat(this.backgroundPosition, "; background-size: cover;\">\n      <div class=\"featured-title\">").concat(this.title, "</div>\n    </a>");
    }
  }]);

  return CarouselCell;
}();
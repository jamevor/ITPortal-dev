"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* exported MyAppCard */
var MyAppCard =
/*#__PURE__*/
function () {
  function MyAppCard(app, installed, isFavorite, isUserLoggedIn) {
    _classCallCheck(this, MyAppCard);

    this.app = app;
    this.installed = installed;
    this.isFavorite = isFavorite;
    this.isUserLoggedIn = typeof isUserLoggedIn !== 'undefined' ? isUserLoggedIn : true;
  }

  _createClass(MyAppCard, [{
    key: "render",
    value: function render() {
      var buttons = '';
      var heartStart = '';
      var heartEnd = '';

      if (this.installed) {
        buttons = "<div class=\"secondary-group\">\n          <a class=\"action secondary button\" href=\"/App/".concat(this.app.id, "\"><i class=\"fas fa-info-circle\"></i><br>Info</a>\n          <a class=\"action secondary button button-remove-app\" href=\"#\"><i class=\"fas fa-minus-circle\"></i><br>Remove</a>\n        </div>");
        heartStart = "<div class=\"favoriteMe\">\n          <input class=\"toggle-heart".concat(!this.isFavorite ? ' checkable' : '', "\" id=\"toggle-heart-").concat(this.app.guid, "\" type=\"checkbox\"").concat(this.isFavorite ? ' checked=\'true\'' : '', ">\n          <label class=\"toggle-heart-label\" for=\"toggle-heart-").concat(this.app.guid, "\" aria-label=\"like\"><i class='fas fa-heart'></i></label>\n        </div>\n        <a href=\"").concat(this.app.link, "\" target=\"_blank\">");
        heartEnd = '</a>';
      } else if (this.isUserLoggedIn) {
        buttons = "<a class=\"action button expanded button-add-app\" href=\"#\"><i class=\"fas fa-plus-circle\"></i> Add</a>\n      <a class=\"action button secondary expanded\" href=\"/App/".concat(this.app.id, "\"><i class=\"fas fa-info-circle\"></i> Info</a>");
      } else {
        buttons = "<a class=\"action button secondary expanded\" href=\"/App/".concat(this.app.id, "\"><i class=\"fas fa-info-circle\"></i> Info</a>");
      }

      return "<div class=\"cell medium-3 box card app\" data-appid=\"".concat(this.app.id, "\">\n      ").concat(heartStart, "\n        <div class=\"img\" style=\"background-image:url('").concat(this.app.imageSrc || '/img/ico-intro.svg', "')\"></div>\n        <div class=\"title\">").concat(this.app.title, "</div>\n      ").concat(heartEnd, "\n      ").concat(buttons, "\n    </div>");
    }
  }], [{
    key: "renderSpinner",
    value: function renderSpinner() {
      return '<i class="fas fa-circle-notch fa-3x fa-spin"></i>';
    }
  }, {
    key: "renderProgressBar",
    value: function renderProgressBar(id) {
      return "<div id=\"install-progress-".concat(id, "\" class=\"progress\" role=\"progressbar\" tabindex=\"0\" aria-valuenow=\"0\" aria-valuemin=\"0\"\n        aria-valuetext=\"0 percent\" aria-valuemax=\"100\">\n        <div class=\"progress-meter\" style=\"width: 0%\"></div>\n      </div>");
    }
  }]);

  return MyAppCard;
}();
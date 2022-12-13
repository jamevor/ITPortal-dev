"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* exported AssetCard */

/* global grecaptcha, Foundation */
var AssetCard =
/*#__PURE__*/
function () {
  function AssetCard(_ref) {
    var assetTag = _ref.assetTag,
        friendly = _ref.friendly,
        model = _ref.model,
        icon = _ref.icon,
        image = _ref.image,
        status = _ref.status,
        type = _ref.type;

    _classCallCheck(this, AssetCard);

    this.assetTag = assetTag;
    this.friendly = friendly;
    this.model = model;
    this.icon = icon;
    this.image = image || null;
    this.status = status;
    this.type = type || 'Device';
  }

  _createClass(AssetCard, [{
    key: "render",
    value: function render() {
      var result = "<div class=\"cell small-12 medium-12 large-6 box card asset\">\n\t\t\t<a class=\"kabob\" data-asset-tag=\"".concat(this.assetTag, "\" data-asset-friendly=\"").concat(this.friendly, "\" href=\"#\"><i class=\"far fa-ellipsis-v\"></i><span class=\"show-for-sr\">Asset Options Menu for ").concat(this.friendly, "</span></a>\n\t\t\t<div class=\"d-menu\">\n\t\t\t\t<a href=\"#\" class=\"button-asset-issue\">Report an Issue with Your ").concat(this.type, "</a>\n\t\t\t\t<a href=\"#\" class=\"button-asset-replacement\">Assess Replacement</a>\n\t\t\t\t<a href=\"#\" class=\"button-asset-not-mine\">What is this device?</a>\n\t\t\t</div>\n\t\t\t<a class=\"asset-link-wrapper\" href=\"/Asset/").concat(this.assetTag, "\">\n\t\t\t<div class=\"asset-img\" ");

      if (this.image) {
        result += "style=\"background-image:url('".concat(this.image, "')\">");
      } else {
        result += ">\n\t\t\t<i class=\"fad fa-fw ".concat(this.icon, "\"></i>");
      }

      result += "</div>\n\t\t\t\t<div class=\"asset-dataBar grid-x grid-margin-x\">\n\t\t\t\t\t<div class=\"asset-dataBar-icon cell medium-6\">\n\t\t\t\t\t\t<i class='fal fa-fw fa-2x ".concat(this.icon, "'></i>\n\t\t\t\t\t\t<span>").concat(this.assetTag, "</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"asset-dataBar-name cell medium-6\">\n\t\t\t\t\t\t<span class=\"hostname\">").concat(this.friendly, "</span>\n\t\t\t\t\t\t<span class=\"model\">").concat(this.model, "</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</a>\n\t\t</div>");
      return result;
    }
  }], [{
    key: "attachKabobListeners",
    value: function attachKabobListeners() {
      $('.kabob').click(function (event) {
        event.preventDefault();
        AssetCard.cursor.assetTag = $(this).data('assetTag');
        AssetCard.cursor.assetFriendly = $(this).data('assetFriendly');
        $('#help-form-asset-tag').html("".concat(AssetCard.cursor.assetTag));
        $('#help-form-asset-friendly').html("".concat(AssetCard.cursor.assetFriendly));
        $(this).siblings('.d-menu').fadeToggle(200);
      });
      $('.asset').on('mouseleave', function () {
        $(this).children('.d-menu').fadeOut(200);
      });
      $('.button-asset-issue').click(function (event) {
        event.preventDefault();
        $('#help-form-title').html('Report an Issue With Asset');
        $('#modal-asset-form').foundation('open');
      });
      $('.button-asset-replacement').click(function (event) {
        event.preventDefault();
        $('#help-form-title').html('Assess a Replacement');
        $('#modal-asset-form').foundation('open');
      });
      $('.button-asset-not-mine').click(function (event) {
        event.preventDefault();
        $('#help-form-title').html('What is This Device?');
        $('#modal-asset-form').foundation('open');
      });
    }
  }, {
    key: "attachActionListeners",
    value: function attachActionListeners() {
      $('.kabob').click(function (event) {
        event.preventDefault();
        AssetCard.cursor.assetTag = $(this).data('assetTag');
        AssetCard.cursor.assetFriendly = $(this).data('assetFriendly');
        $('#help-form-asset-tag').html("".concat(AssetCard.cursor.assetTag));
        $('#help-form-asset-friendly').html("".concat(AssetCard.cursor.assetFriendly));
        $(this).siblings('.d-menu').fadeToggle(200);
      });
      $('.asset').on('mouseleave', function () {
        $(this).children('.d-menu').fadeOut(200);
      });
      $('.button-asset-issue').click(function (event) {
        event.preventDefault();
        $('#help-form-title').html('Report an Issue With Asset');
        $('#modal-asset-form').foundation('open');
      });
      $('.button-asset-replacement').click(function (event) {
        event.preventDefault();
        $('#help-form-title').html('Assess a Replacement');
        $('#modal-asset-form').foundation('open');
      });
      $('.button-asset-not-mine').click(function (event) {
        event.preventDefault();
        $('#help-form-title').html('What is This Device?');
        $('#modal-asset-form').foundation('open');
      });
    }
  }, {
    key: "renderForm",
    value: function renderForm() {
      $('body').append("<style>\n\t\t\t.help-form label {\n\t\t\t\t/* font-weight: 600; */\n\t\t\t}\n\t\t\t.help-form .box {\n\t\t\t\tbackground: var(--color-lane);\n\t\t\t\tpadding: 0.5em 1em;\n\t\t\t}\n\t\t\t.help-form textarea {\n\t\t\t\tmin-width:100%;\n\t\t\t}\n\t\t\t.help-form input, .help-form textarea {\n\t\t\t\tbackground: var(--color-body);\n\t\t\t\tcolor: var(--color-body-text);\n\t\t\t}\n\t\t\t.night .help-form input:focus, .night .help-form textarea:focus {\n\t\t\t\tbackground: var(--color-lane-subtler);\n\t\t\t}\n\t\t\t.help-form .button-submit {\n\t\t\t\twidth: 100%;\n\t\t\t\ttext-align: center;\n\t\t\t\tbackground: var(--color-pop);\n\t\t\t\theight: 3em;\n\t\t\t\tcolor: var(--color-light);\n\t\t\t\tcursor: pointer;\n\t\t\t\toutline: none;\n\t\t\t\tbox-shadow: var(--shadow-standard-y);\n\t\t\t\ttransition: background .5s ease;\n\t\t\t}\n\t\t\t.help-form .button-submit:hover {\n\t\t\t\tbackground: var(--color-pop-h);\n\t\t\t}\n\t\t\t.help-form .button-submit.disabled {\n\t\t\t\tcursor: not-allowed;\n\t\t\t\tbackground: var(--color-pop-h);\n\t\t\t}\n\t\t\t.help-form .impact-boxes .cell input {\n\t\t\t\tdisplay: none;\n\t\t\t}\n\t\t\t.help-form .impact-boxes .cell label {\n\t\t\t\tborder: 1px solid var(--color-lane);\n\t\t\t\tpadding: .5em;\n\t\t\t\ttext-align: center;\n\t\t\t\tmargin: 0;\n\t\t\t\twidth: 100%;\n\t\t\t\ttransition: all .5s ease;\n\t\t\t}\n\t\t\t.help-form .impact-boxes .cell input:checked + label {\n\t\t\t\tbackground-color: var(--color-pop);\n\t\t\t\tcolor: var(--color-light);\n\t\t\t\tborder-color: var(--color-pop-h);\n\t\t\t}\n\t\t\t.help-form .impact-boxes .cell label:hover {\n\t\t\t\tbackground: var(--color-lane);\n\t\t\t}\n\t\t\t.input-box .content-label{\n\t\t\t\tfont-size: 1rem;\n\t\t\t\tmargin: 0;\n\t\t\t\tline-height:1;\n\t\t\t}\n\t\t\t.input-box .content{\n\t\t\t\tfont-weight: 800;\n\t\t\t\tmargin: 0;\n\t\t\t\tmargin-bottom: 0.5em;\n\t\t\t}\n\t\t\t.box-verified-profile {\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex-direction: column;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t}\n\t\t\t.profile-img-square {\n\t\t\t\tbackground: var(--color-user);\n\t\t\t\twidth: 2em;\n\t\t\t\theight: 2em;\n\t\t\t\tfont-size: 3em;\n\t\t\t}\n\t\t\t\n\t\t\t/* Asset help form */\n\t\t\t#modal-asset-form h4, #modal-asset-form h5 {\n\t\t\t\tmargin: 0;\n\t\t\t}\n\t\t\t#modal-asset-form h5 {\n\t\t\t\tcolor: var(--color-pop);\n\t\t\t\tfont-weight: bold;\n\t\t\t}\n\t\t\t#modal-asset-form h5:last-of-type {\n\t\t\t\tmargin-bottom: 1em;\n\t\t\t}\n\t\t</style>\n\t\t\n\t\t<div class=\"reveal help-form\" id=\"modal-asset-form\" data-reveal>\n\t\t\t<h4 id='help-form-title'>Request Help With</h4>\n\t\t\t<h5 id='help-form-asset-tag'></h5>\n\t\t\t<h5 id='help-form-asset-friendly'></h5>\n\t\t\t<label for=\"details\"><strong>In detail</strong>, describe your request or issue</label>\n\t\t\t<textarea id=\"details\" name=\"details\" rows=\"5\"></textarea>\n\t\t\t<p style=\"font-size:.875rem;\"><em>Include details such as your location (on or off campus), how long the issue has been occuring, etc.</em></p>\n\t\t\t<button id=\"button-submit-help-form\" class=\"button-submit\">Request Help</button>\n\t\t\t<p style=\"font-size: 0.75rem;margin-top: 1em;color: var(--color-body-subtitle);\">This site is protected by reCAPTCHA and the Google <a href=\"https://policies.google.com/privacy\">Privacy Policy</a> and <a href=\"https://policies.google.com/terms\">Terms of Service</a> apply.</p>\n\t\t\t<button class=\"close-button\" data-close aria-label=\"Close modal\" type=\"button\">\n\t\t\t\t<span aria-hidden=\"true\"><i class='fas fa-times'></i></span>\n\t\t\t</button>\n\t\t</div>");
      new Foundation.Reveal($('#modal-asset-form'));
    }
  }, {
    key: "attachFormListener",
    value: function attachFormListener() {
      $('#button-submit-help-form').click(function (event) {
        event.preventDefault();

        if (!$('#button-submit-help-form').hasClass('disabled')) {
          $('#button-submit-help-form').addClass('disabled');
          grecaptcha.ready(function () {
            grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {
              action: 'button_submit_help_form_asset'
            }).then(function (token) {
              $.ajax({
                url: '/api/v1/cherwell/ticket/asset/create/one',
                method: 'POST',
                data: {
                  token: token,
                  assetTag: AssetCard.cursor.assetTag,
                  formData: {
                    source: window.location.href,
                    type: $('#help-form-title').html(),
                    assetTag: AssetCard.cursor.assetTag,
                    friendly: AssetCard.cursor.assetFriendly,
                    details: $('#details').val()
                  }
                },
                beforeSend: function beforeSend() {
                  $('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
                },
                success: function success() {
                  $('#toast-save-success').addClass('show');
                  $('#button-submit-help-form').html('Request Help');
                },
                error: function error(resp) {
                  $('#toast-save-error').addClass('show');
                  $('#button-submit-help-form').html('Request Help');
                }
              });
            });
          });
        }
      });
    }
  }]);

  return AssetCard;
}();

_defineProperty(AssetCard, "cursor", {
  assetTag: null,
  assetFriendly: null
});
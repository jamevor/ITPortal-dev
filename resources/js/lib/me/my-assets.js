"use strict";

/* global spinner, AssetCard */
$(document).ready(function () {
  $.ajax({
    url: '/api/v1/cherwell/me/asset/get/all',
    method: 'GET',
    beforeSend: function beforeSend() {
      $('#my-assets').append(spinner());
    },
    success: function success(data) {
      $('#my-assets').children('.spinner').remove();

      if (!(data && data.length)) {
        $('#my-assets').append("<div class=\"cell medium-12 my-apps empty\">\n            <p>You don't have any assets</p>\n          </div>");
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var datum = _step.value;
            $('#my-assets').append(new AssetCard({
              assetTag: datum.busObPublicId,
              friendly: datum.fields.find(function (f) {
                return f.name === 'FriendlyName';
              }).value,
              model: datum.fields.find(function (f) {
                return f.name === 'Model';
              }).value,
              status: datum.fields.find(function (f) {
                return f.name === 'Status';
              }).value,
              type: datum.fields.find(function (f) {
                return f.name === 'AssetType';
              }).value,
              icon: datum._icon,
              image: datum._image
            }).render());
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        AssetCard.renderForm();
        AssetCard.attachKabobListeners();
        AssetCard.attachFormListener();
      }
    },
    error: function error(resp) {
      console.error(resp);
    }
  });
});
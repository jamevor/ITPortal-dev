"use strict";

/* global TicketCard, AssetCard, spinner */
$(document).ready(function () {
  $.ajax({
    url: '/api/v1/cherwell/me/ticket/get/open',
    method: 'GET',
    beforeSend: function beforeSend() {
      $('#tickets-open').append(spinner());
    },
    success: function success(data) {
      $('#userOpenTicketCount').html("".concat(data.length));
      $('#tickets-open').children('.spinner').remove();

      if (!(data && data.length)) {
        $('#tickets-open').append("<div class=\"cell medium-12 my-apps empty\">\n            <p>You don't have any open tickets</p>\n            <a href=\"/Request\" class=\"button\"><i class=\"far fa-plus-circle\"></i> Open a Ticket</a>\n          </div>");
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data.slice(0, 4)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var datum = _step.value;
            $('#tickets-open').append(new TicketCard(datum.busObPublicId, datum.fields.find(function (elt) {
              return elt.name === 'Summary';
            }).value, datum.fields.find(function (elt) {
              return elt.name === 'Status';
            }).value, datum.fields.find(function (elt) {
              return elt.name === 'CreatedDateTime';
            }).value, datum.fields.find(function (elt) {
              return elt.name === 'LastModifiedDateTime';
            }).value).render());
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
      }
    },
    error: function error(resp) {
      console.error(resp);
    }
  });
  $.ajax({
    url: '/api/v1/cherwell/me/asset/get/primary',
    method: 'GET',
    beforeSend: function beforeSend() {
      $('#my-assets').append(spinner());
    },
    success: function success(data) {
      $('#userAssetCount').html("".concat(data.length));
      $('#my-assets').children('.spinner').remove();

      if (!(data && data.length)) {
        $('#my-assets').append("<div class=\"cell medium-12 my-apps empty\">\n            <p>You don't have any assets</p>\n          </div>");
      } else {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var datum = _step2.value;
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
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
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
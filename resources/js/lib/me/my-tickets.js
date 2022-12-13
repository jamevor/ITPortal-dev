"use strict";

/* global TicketCard, spinner */
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
        $('#tickets-open').append("<div class=\"cell medium-12 my-apps empty\">\n              <p>You don't have any open tickets</p>\n              <a href=\"/Request\" class=\"button\"><i class=\"far fa-question-circle\"></i> Open a Ticket</a>\n            </div>");
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
    url: '/api/v1/cherwell/me/ticket/get/subscribed',
    method: 'GET',
    beforeSend: function beforeSend() {
      $('#tickets-subscribed').append(spinner());
    },
    success: function success(data) {
      $('#tickets-subscribed').children('.spinner').remove();

      if (!(data && data.length)) {
        $('#tickets-subscribed').append("<div class=\"cell medium-12 my-apps empty\">\n            <p>You are not subscribed to any open tickets</p>\n          </div>");
      } else {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var datum = _step2.value;
            $('#tickets-subscribed').append(new TicketCard(datum.busObPublicId, datum.fields.find(function (elt) {
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
      }
    },
    error: function error(resp) {
      console.error(resp);
    }
  });
  $.ajax({
    url: '/api/v1/cherwell/me/ticket/get/closed',
    method: 'GET',
    beforeSend: function beforeSend() {
      $('#tickets-history').append(spinner());
    },
    success: function success(data) {
      $('#tickets-history').children('.spinner').remove();

      if (!(data && data.length)) {
        $('#tickets-history').append("<div class=\"cell medium-12 my-apps empty\">\n            <p>We couldn't find anything in your ticket history</p>\n          </div>");
      } else {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var datum = _step3.value;
            $('#tickets-history').append(new TicketCard(datum.busObPublicId, datum.fields.find(function (elt) {
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
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    },
    error: function error(resp) {
      console.error(resp);
    }
  });
});
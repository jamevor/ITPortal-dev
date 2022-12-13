"use strict";

/* global grecaptcha */
$(document).ready(function () {
  // get portal journals for ticket
  refreshJournals(); // store text in button for adding an update

  var buttonAddUpdateText = $('#button-add-update').html();
  $('#comment').on('keyup change paste', function () {
    if ($('#comment').val().length) {
      $('#button-add-update').removeClass('disabled');
    } else {
      $('#button-add-update').addClass('disabled');
    }
  }); // submit the comment

  $('#button-add-update').click(function (event) {
    event.preventDefault();

    if (!$('#button-add-update').hasClass('disabled') && $('#comment').val().length) {
      $('#button-add-update').addClass('disabled');
      grecaptcha.ready(function () {
        grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {
          action: 'button_add_ticket_update'
        }).then(function (token) {
          $.ajax({
            url: '/api/v1/cherwell/ticket/journal/create/one',
            method: 'POST',
            data: {
              token: token,
              ticketID: $('#ticket-id').val(),
              formData: {
                details: $('#comment').val()
              }
            },
            beforeSend: function beforeSend() {
              $('#button-add-update').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
            },
            success: function success() {
              $('#toast-save-success').addClass('show');
              $('#button-add-update').html(buttonAddUpdateText);
              refreshJournals();
              setTimeout(function () {
                $('#toast-save-success').removeClass('show');
              }, 3000);
            },
            error: function error(resp) {
              $('#toast-save-error').addClass('show');
              $('#button-add-update').html(buttonAddUpdateText);
            }
          });
        });
      });
    }
  });
});

var refreshJournals = function refreshJournals() {
  $.ajax({
    url: "/api/v1/cherwell/ticket/journal-portal/get/all/".concat($('#ticket-id').val()),
    method: 'GET',
    beforeSend: function beforeSend() {
      clearJournals();
      $('#ticket-sub').append(renderSpinner());
    },
    success: function success(data) {
      $('#spinner-journal').fadeOut(function () {
        $(this).remove();

        if (Array.isArray(data.portalJournals)) {
          $('.news-status-updates .badge').text("".concat(data.portalJournals.length));
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = data.portalJournals[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var journal = _step.value;
              $('#ticket-sub').append(renderTicketSub(journal));
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
      });
    },
    error: function error(resp) {},
    complete: function complete() {
      resetAddUpdateForm();
    }
  });
};

var clearJournals = function clearJournals() {
  $('.ticket-sub-item').fadeOut(function () {
    $(this).remove();
  });
};

var renderSpinner = function renderSpinner() {
  return "<div id=\"spinner-journal\" class=\"cell small-12 text-center\">\n    <i class=\"fas fa-3x fa-circle-notch fa-spin\" style=\"color: var(--color-pop);\"></i>\n  </div>";
};

var renderTicketSub = function renderTicketSub(journal) {
  var result = "<div class=\"ticket-sub-item ".concat(journal.fields.find(function (f) {
    return f.name === 'Direction';
  })['value'] === 'Incoming' ? 'incoming' : 'outgoing', "\">\n    <div class=\"ticket-sub-item-icon\"></div>\n    <div class=\"ticket-sub-item-event-group\">\n      <p class=\"ticket-sub-item-event-author\"> ").concat(journal.fields.find(function (f) {
    return f.name === 'Direction';
  })['value'] === 'Incoming' ? journal.fields.find(function (f) {
    return f.name === 'IncomingUser';
  })['value'] : journal.fields.find(function (f) {
    return f.name === 'OutgoingUser';
  })['value'], "</p>\n      <div class=\"ticket-sub-item-event\"><pre>").concat(journal.fields.find(function (f) {
    return f.name === 'Details';
  })['value'], "</pre>");

  if (journal.fields.find(function (f) {
    return f.name === 'OutgoingLink';
  })['value'].length) {
    result += "<ul class=\"ticket-sub-item-links\">\n            <li><a href=\"".concat(journal.fields.find(function (f) {
      return f.name === 'OutgoingLink';
    })['value'], "\">").concat(journal.fields.find(function (f) {
      return f.name === 'OutgoingLink';
    })['value'], "</a></li>\n          </ul>");
  }

  result += "</div>\n      <p class=\"ticket-sub-item-event-date\"> ".concat(journal.fields.find(function (f) {
    return f.name === 'LastModifiedDateTime';
  })['value'], " </p>\n    </div>\n    <div class=\"ticket-sub-item-icon\"><i class=\"fas fa-user fa-lg\"></i></div>\n  </div>");
  return result;
};

var resetAddUpdateForm = function resetAddUpdateForm() {
  $('#comment').val('');
  $('#button-add-update').removeClass('disabled');
};
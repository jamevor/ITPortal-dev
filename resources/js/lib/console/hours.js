"use strict";

/* global moment */
$(document).ready(function () {
  $('#location').val('null').change();
  var standardHours = window.standardHoursData;
  var specialHours = window.specialHoursData;
  var standardHoursTable = $('#hours-standard').DataTable({
    dom: 't',
    ordering: false
  });
  var specialHoursTable = $('#hours-special').DataTable({
    dom: 't',
    ordering: false
  });
  $('#location').change(function () {
    $('#hours-standard-editable, #hours-special-editable').prop('checked', false).change();

    if ($('#location').val() === 'null') {
      reset(standardHoursTable, specialHoursTable);
    } else {
      var selectedLocationStandardHours = standardHours.filter(function (hour) {
        return hour.idLocation == $('#location').val();
      });
      standardHoursTable.rows().every(function () {
        var _this = this;

        var hour = selectedLocationStandardHours.find(function (hour) {
          return "hours-standard-day-".concat(hour.idDayOfWeek) == _this.id();
        });

        if (hour) {
          this.data([hour.dayOfWeek.id, hour.dayOfWeek.title, isClosedToInput(hour.isClosed, 'standard', true), timeToInput(hour.timeOpen, 'standard', hour.isClosed, true), timeToInput(hour.timeClosed, 'standard', hour.isClosed, true)]);
        } else {
          this.data([this.data()[0], this.data()[1], isClosedToInput(false, 'standard', true), timeToInput('09:00:00', 'standard', false, true), timeToInput('17:00:00', 'standard', false, true)]);
        }
      });
      var selectedLocationSpecialHours = specialHours.filter(function (hour) {
        return hour.idLocation == $('#location').val();
      });
      specialHoursTable.rows().remove();
      var disabled = !$('#hours-special-editable').is(':checked');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = selectedLocationSpecialHours[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var hour = _step.value;
          specialHoursTable.row.add([dateToInput(hour.date, disabled), isClosedToInput(hour.isClosed, 'special', disabled), timeToInput(hour.timeOpen, 'special', hour.isClosed, disabled), timeToInput(hour.timeClosed, 'special', hour.isClosed, disabled)]);
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

      specialHoursTable.draw();
    }
  });
  $('#hours-standard-editable').change(function () {
    $('.hours-standard-input').prop('disabled', !$('#hours-standard-editable').is(':checked'));
  });
  $('#hours-special-editable').change(function () {
    $('.hours-special-input').prop('disabled', !$('#hours-special-editable').is(':checked'));
  });
  $('#hours-special-add-row').click(function (event) {
    event.preventDefault();
    var disabled = !$('#hours-special-editable').is(':checked');
    specialHoursTable.row.add([dateToInput('', disabled), isClosedToInput(true, 'special', disabled), timeToInput('09:00:00', 'special', true, disabled), timeToInput('17:00:00', 'special', true, disabled)]).draw();
  });
  $('.table').on('change', 'input.hours-standard-input[type=checkbox], input.hours-special-input[type=checkbox]', function () {
    $(this).parent().siblings().children('input.hours-standard-input[type=time], input.hours-special-input[type=time]').toggle();
  }); // save

  $('.button-save').click(function (event) {
    event.preventDefault();

    if ($('#location').val() === 'null') {
      return false;
    } else {
      var _standardHours = {};
      var hoursValid = true;
      standardHoursTable.rows().nodes().to$().each(function () {
        var idDayOfWeek = $(this).find('td').first().text();
        var isClosed = $(this).find('.hours-standard-input').eq(0).is(':checked');
        var timeOpen = $(this).find('.hours-standard-input').eq(1).val();
        var timeClosed = $(this).find('.hours-standard-input').eq(2).val();
        var momentOpen = moment.utc(timeOpen, 'HH:mm:ss', true);
        var momentClosed = moment.utc(timeClosed, 'HH:mm:ss', true);

        if (!momentOpen.isValid() || !momentClosed.isValid() || momentOpen.isAfter(momentClosed)) {
          hoursValid = false;
        }

        _standardHours["".concat(idDayOfWeek)] = {
          isClosed: isClosed,
          timeOpen: timeOpen,
          timeClosed: timeClosed
        };
      });
      var _specialHours = {};
      specialHoursTable.rows().nodes().to$().each(function () {
        var date = $(this).find('.hours-special-input').eq(0).val();
        var isClosed = $(this).find('.hours-special-input').eq(1).is(':checked');
        var timeOpen = $(this).find('.hours-special-input').eq(2).val();
        var timeClosed = $(this).find('.hours-special-input').eq(3).val();
        var momentOpen = moment.utc(timeOpen, 'HH:mm:ss', true);
        var momentClosed = moment.utc(timeClosed, 'HH:mm:ss', true);

        if (!momentOpen.isValid() || !momentClosed.isValid() || momentOpen.isAfter(momentClosed) || "".concat(date) in _specialHours) {
          hoursValid = false;
        }

        _specialHours["".concat(date)] = {
          isClosed: isClosed,
          timeOpen: timeOpen,
          timeClosed: timeClosed
        };
      });

      if (hoursValid) {
        $.ajax({
          url: "/api/v1/location/hours/update/one/".concat($('#location').val()),
          method: 'POST',
          data: {
            standardHours: JSON.stringify(_standardHours),
            specialHours: JSON.stringify(_specialHours)
          },
          success: function success() {
            $('#toast-save-success').addClass('show');
          },
          error: function error() {
            $('#toast-save-error').addClass('show');
          }
        });
      } else {
        $('#toast-invalid-times').addClass('show');
      }
    }
  });
});

var timeToInput = function timeToInput(time, type, isClosed, disabled) {
  return "<input class='hours-".concat(type, "-input' type=\"time\" value=\"").concat(time, "\"").concat(disabled ? ' disabled' : '').concat(isClosed ? ' style="display: none"' : '', ">");
};

var dateToInput = function dateToInput(date, disabled) {
  return "<input class='hours-special-input' type=\"date\" value=\"".concat(date, "\"").concat(disabled ? ' disabled' : '', ">");
};

var isClosedToInput = function isClosedToInput(isClosed, type, disabled) {
  return "<td><input class='hours-".concat(type, "-input' type='checkbox'").concat(isClosed ? ' checked' : '').concat(disabled ? ' disabled' : '', "></td>");
};

var reset = function reset(standardHoursTable, specialHoursTable) {
  specialHoursTable.rows().remove().draw();
  standardHoursTable.rows().every(function () {
    this.data([this.data()[0], this.data()[1], isClosedToInput(false, 'standard', true), timeToInput('', 'standard', false, true), timeToInput('', 'standard', false, true)]);
  });
};
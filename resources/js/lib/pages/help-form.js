"use strict";

/* global grecaptcha */
$(document).ready(function () {
  $('#button-submit-help-form').click(function (event) {
    event.preventDefault();
    console.log('confirming im in the right place');
    if (!$('#button-submit-help-form').hasClass('disabled')) {
      $('#button-submit-help-form').addClass('disabled');
      grecaptcha.ready(function () {
        grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {
          action: 'button_submit_help_form'
        }).then(function (token) {
          $.ajax({
            url: '/api/v1/cherwell/ticket/create/one',
            method: 'POST',
            data: {
              token: token,
              formData: {
                source: window.location.href,
                type: 'request help',
                fullName: $('#full-name').val() || $('#full-name').text(),
                wpiEmail: $('#wpi-email').val() || $('#wpi-email').text(),
                wpiID: $('#wpi-id').val() || $('#wpi-id').text(),
                preferredEmail: $('#preferred-email').length ? $('#preferred-email').val() : '',
                preferredPhone: $('#preferred-phone').length ? $('#preferred-phone').val() : '',
                impact: $('input[name=impact]:checked').val(),
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
});
"use strict";

$(document).ready(function () {
  $('#button-clear-history').click(function () {
    $.ajax({
      url: '/api/v1/me/history/delete/all',
      method: 'DELETE',
      success: function success() {
        $('.results-card').remove();
        $('#toast-clear-success').addClass('show');
      },
      error: function error() {
        $('#toast-clear-error').addClass('show');
      }
    });
  });
});
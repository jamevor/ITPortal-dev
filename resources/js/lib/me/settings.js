"use strict";

$(document).ready(function () {
  $('input[name="theme"]').change(function () {
    var allThemes = $('input[name="theme"]').map(function (index, elt) {
      return $(elt).val();
    }).toArray();
    $('body').removeClass(allThemes);
    var selectedTheme = $('input[name="theme"]:checked').val();
    $('body').addClass(selectedTheme);
    updateSettings();
  });
  $('input[name="textDisplay"],input[name="seasonalTheme"]').change(function () {
    updateSettings();
  });
});

function updateSettings() {
  $.ajax({
    url: '/api/v1/user/settings/update',
    method: 'PATCH',
    data: {
      themePreference: $('input[name="theme"]:checked').val(),
      textDisplay: $('input[name="textDisplay"]:checked').val(),
      seasonalTheme: $('input[name="seasonalTheme"]:checked').val()
    },
    success: function success() {
      window.location.reload();
    }
  });
}
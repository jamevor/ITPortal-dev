"use strict";

$(document).ready(function () {
  $('#permissions-table').DataTable({
    dom: 'tr',
    paging: false,
    searching: true
  });
  $('#permissions-table select.permission-level').change(function () {
    var addClass = $(this).children('option:checked').data('permissionlevelclass');
    $(this).removeClass();
    $(this).addClass(['permission-level', addClass]);
  }); // save

  $('.button-save').click(function (event) {
    event.preventDefault();

    if ($(event.currentTarget).hasClass('disabled')) {
      return false;
    }

    var permissions = [];
    $('#permissions-table').find('select').each(function () {
      permissions.push({
        permissionID: $(this).data('permissionid'),
        permissionLevelID: $(this).val()
      });
    }).toArray();
    $.ajax({
      url: $('#update-endpoint').val(),
      method: $('#update-method').val(),
      data: {
        admin: $('#isAdmin').length > 0 && $('#isAdmin').is(':checked'),
        permissions: permissions
      },
      success: function success(data) {
        disableSave();

        if (data.created) {
          window.location.replace('/user/' + data.user.id);
        } else {
          $('#toast-save-success').addClass('show');
        }
      },
      error: function error(resp) {
        $('#toast-save-error').addClass('show');
      }
    });
  }); // save state

  $('.user, .console-modal').on('keyup change paste', ':input, [contenteditable=true]', function () {
    enableSave();
  });
});

var enableSave = function enableSave() {
  $('.button-save').removeClass('disabled');
};

var disableSave = function disableSave() {
  $('.button-save').addClass('disabled');
};
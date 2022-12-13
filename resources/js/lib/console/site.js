"use strict";

$(document).ready(function () {
  var featuredContentPublishedTable = $('#featured-content-published-table').DataTable({
    dom: 't',
    paging: false,
    searching: true
  });
  var featuredContentUnpublishedTable = $('#featured-content-unpublished-table').DataTable({
    dom: 'tipr',
    pageLength: 25,
    searching: true
  });
  $('.table').on('click', '.button-publish', function (event) {
    event.preventDefault();
    $.ajax({
      url: "/api/v1/meta-home/featured-content/set-published/".concat($(event.currentTarget).data('metaid')),
      method: 'PATCH',
      data: {
        published: 'true'
      },
      success: function success() {
        $('#toast-save-success').addClass('show');
      },
      error: function error() {
        $('#toast-save-error').addClass('show');
      }
    });
  });
  $('.table').on('click', '.button-unpublish', function (event) {
    event.preventDefault();
    $.ajax({
      url: "/api/v1/meta-home/featured-content/set-published/".concat($(event.currentTarget).data('metaid')),
      method: 'PATCH',
      data: {
        published: 'false'
      },
      success: function success() {
        $('#toast-save-success').addClass('show');
        var elt = featuredContentPublishedTable.row($(event.currentTarget).parents('tr').first());
        var newElt = featuredContentUnpublishedTable.row.add(elt.data()).draw().node();
        $(newElt).css('background', 'pink!important'); // elt.find('.action-links a i.fa-eye-slash').toggleClass(['fa-eye', 'fa-eye-slash']);

        elt.remove();
        featuredContentPublishedTable.draw();
      },
      error: function error() {
        $('#toast-save-error').addClass('show');
      }
    });
  });
  $('#console-add').click(function (event) {
    event.preventDefault();
    $('#modal-console-add').foundation('open');
  });
  $('.console-add-save').click(function (event) {
    event.preventDefault();
    var fd = new FormData();
    fd.append('title', $('#title').val());
    fd.append('link', $('#link').val());
    fd.append('published', $('#published').is(':checked'));
    fd.append('position', $('#position').val());
    fd.append('img', $('#img')[0].files[0]);
    $.ajax({
      url: '/api/v1/meta-home/featured-content/create/one',
      method: 'POST',
      contentType: false,
      processData: false,
      data: fd,
      success: function success() {
        $('#toast-save-success').addClass('show');
        $('#modal-console-add').foundation('close');
      },
      error: function error() {
        $('#toast-save-error').addClass('show');
      }
    });
  });
  $('.button-edit').click(function (event) {
    event.preventDefault();
    $('#edit-id').val($(event.currentTarget).data('metaid'));
    $('#edit-title').val($(event.currentTarget).data('metatitle'));
    $('#edit-link').val($(event.currentTarget).data('metalink'));
    $('#edit-published').prop('checked', $(event.currentTarget).closest('#featured-content-published-table').length);
    $('#edit-img-changed').val('false');
    $('#edit-position').val($(event.currentTarget).data('positionid')).change();
    $('#modal-console-edit').foundation('open');
  });
  $('#edit-img').change(function () {
    $('#edit-img-changed').val('true');
  });
  $('.console-edit-save').click(function (event) {
    event.preventDefault();
    var fd = new FormData();
    fd.append('title', $('#edit-title').val());
    fd.append('link', $('#edit-link').val());
    fd.append('published', $('#edit-published').is(':checked'));
    fd.append('position', $('#edit-position').val());

    if ($('#edit-img-changed').val() === 'true') {
      fd.append('img', $('#edit-img')[0].files[0]);
    }

    $.ajax({
      url: "/api/v1/meta-home/featured-content/update/one/".concat($('#edit-id').val()),
      method: 'PUT',
      contentType: false,
      processData: false,
      data: fd,
      success: function success() {
        $('#toast-save-success').addClass('show');
        $('#modal-console-edit').foundation('close');
      },
      error: function error() {
        $('#toast-save-error').addClass('show');
      }
    });
  });
});
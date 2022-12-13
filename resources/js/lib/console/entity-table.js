"use strict";

/*
	global DTFilterState
*/
$(document).ready(function () {
  var entityTable = $('#entity-table').DataTable({
    stateSave: true,
    dom: 'tipr',
    pageLength: 25,
    searching: true,
    order: [[0, window.entityTable_defaultSortOrder]]
  });
  $('.filter-find').keyup(function () {
    entityTable.search($(this).val()).draw();
  });

  if ($('.section-filters').length) {
    new DTFilterState(entityTable, null, null, $('.section-filters').children(':checkbox').map(function () {
      return this.id;
    }));
  }

  $('#entity-table').on('click', '.console-copy', function (event) {
    event.preventDefault();
    $('#toast-copy-wait').addClass('show');
    setTimeout(function () {
      $.ajax({
        url: "".concat($('#copy-endpoint').val(), "/").concat($(event.currentTarget).data('entityid')),
        method: $('#copy-method').val(),
        data: {},
        success: function success(data) {
          window.location.replace("/".concat(data.type, "/").concat(data.id));
        },
        error: function error(resp) {
          $('#toast-copy-error').addClass('show');
        }
      });
    }, 300);
  });
});
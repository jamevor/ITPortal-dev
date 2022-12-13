"use strict";

$(document).ready(function () {
  var permissionsTable = $('#permissions-table').DataTable({
    dom: 'tipr',
    pageLength: 25,
    searching: true
  });
  $('.filter-find').keyup(function () {
    permissionsTable.search($(this).val()).draw();
  });
});
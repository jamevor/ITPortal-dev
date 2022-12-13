"use strict";

$(document).ready(function () {
  var usersTable = $('#users-table').DataTable({
    dom: 'tipr',
    pageLength: 25,
    searching: true
  });
  $('.filter-find').keyup(function () {
    usersTable.search($(this).val()).draw();
  });
});
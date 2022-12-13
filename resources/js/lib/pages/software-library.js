"use strict";

$(document).ready(function () {
  var softwareTable = $('#softwareTable').DataTable({
    pageLength: 25,
    searching: true,
    dom: 'tipr',
    columnDefs: [{
      targets: 'table-hidden',
      visible: false,
      searchable: true
    }]
  });
  $('.filter-find').keyup(function () {
    softwareTable.search($(this).val()).draw();
  });
});
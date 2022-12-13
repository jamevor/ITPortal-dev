"use strict";

$(document).ready(function () {
  window.locationsTable = $('#locationsTable').DataTable({
    lengthChange: false,
    pageLength: 10,
    info: true,
    searching: true,
    language: {
      'search': '<span class=\'sr-only\'>Search</span>_INPUT_',
      'searchPlaceholder': 'Search'
    },
    columnDefs: [{
      targets: 'table-hidden',
      visible: false,
      searchable: true
    }]
  });
});
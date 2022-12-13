"use strict";

/*
	global DTFilterState
*/
$(document).ready(function () {
  var locationsTable = $('#locationsTable').DataTable({
    dom: 'tipr',
    pageLength: 25,
    searching: true,
    language: {
      'emptyTable': 'There are no available Locations.',
      'info': 'Showing _START_ to _END_ of _TOTAL_ Locations',
      'infoEmpty': 'Showing 0 to 0 of 0 Locations',
      'infoFiltered': '(filtered from _MAX_ total Locations)',
      'loadingRecords': '<div class=\'spintro-wrapper\'><div class=\'spintro\'></div></div>'
    },
    dataType: 'json',
    ajax: {
      url: '/api/v1/location/get/all',
      type: 'get',
      data: {},
      dataSrc: ''
    },
    columns: [{
      data: 'building.title',
      name: 'building',
      visible: true,
      searchable: true,
      orderable: true,
      render: function render(data, type, row) {
        if (data) {
          return "\n                <td>\n                  <a href=\"/building/".concat(row.building.id, "\">").concat(data, "</a>\n                </td>\n              ");
        } else {
          return '<td></td>';
        }
      }
    }, {
      data: 'title',
      visible: true,
      searchable: true,
      orderable: true,
      render: function render(data, type, row) {
        if (data) {
          return "\n                <td>\n                  <a href=\"/location/".concat(row.id, "\">").concat(data, "</a>\n                </td>\n              ");
        } else {
          return '<td></td>';
        }
      }
    }, {
      data: 'locationType',
      name: 'locationType',
      visible: true,
      searchable: true,
      orderable: true,
      className: 'text-capitalize',
      render: function render(data) {
        if (data) {
          return "<td>".concat(data.title, "</td>");
        } else {
          return '<td></td>';
        }
      }
    }, {
      data: 'room',
      visible: true,
      searchable: true,
      orderable: true,
      render: function render(data) {
        if (data) {
          return "<td>".concat(data, "</td>");
        } else {
          return '<td></td>';
        }
      }
    }, {
      data: 'seats',
      visible: true,
      searchable: true,
      orderable: true,
      render: function render(data) {
        if (data) {
          return "<td>".concat(data, "</td>");
        } else {
          return '<td></td>';
        }
      }
    }, {
      data: 'computers',
      visible: true,
      searchable: true,
      orderable: true,
      render: function render(data) {
        if (data) {
          return "<td>".concat(data, "</td>");
        } else {
          return '<td></td>';
        }
      }
    }, {
      data: 'hasPrinter',
      name: 'hasPrinter',
      visible: false,
      searchable: true,
      orderable: false,
      render: function render(data) {
        return "<td>".concat(data, "</td>");
      }
    }, {
      data: 'hasColorPrinter',
      name: 'hasColorPrinter',
      visible: false,
      searchable: true,
      orderable: false,
      render: function render(data) {
        return "<td>".concat(data, "</td>");
      }
    }, {
      data: 'hasPharos',
      name: 'hasPharos',
      visible: false,
      searchable: true,
      orderable: false,
      render: function render(data) {
        return "<td>".concat(data, "</td>");
      }
    }, {
      data: 'hasProjection',
      name: 'hasProjection',
      visible: false,
      searchable: true,
      orderable: false,
      render: function render(data) {
        return "<td>".concat(data, "</td>");
      }
    }, {
      data: 'hasDualProjection',
      name: 'hasDualProjection',
      visible: false,
      searchable: true,
      orderable: false,
      render: function render(data) {
        return "<td>".concat(data, "</td>");
      }
    }, {
      data: 'hasDocCamera',
      name: 'hasDocCamera',
      visible: false,
      searchable: true,
      orderable: false,
      render: function render(data) {
        return "<td>".concat(data, "</td>");
      }
    }, {
      data: 'hasLectureCap',
      name: 'hasLectureCap',
      visible: false,
      searchable: true,
      orderable: false,
      render: function render(data) {
        return "<td>".concat(data, "</td>");
      }
    }, {
      data: 'hasVoiceAmp',
      name: 'hasVoiceAmp',
      visible: false,
      searchable: true,
      orderable: false,
      render: function render(data) {
        return "<td>".concat(data, "</td>");
      }
    }, {
      data: 'hasWirelessVoiceAmp',
      name: 'hasWirelessVoiceAmp',
      visible: false,
      searchable: true,
      orderable: false,
      render: function render(data) {
        return "<td>".concat(data, "</td>");
      }
    }, {
      data: 'hasPOD',
      name: 'hasPOD',
      visible: false,
      searchable: true,
      orderable: false,
      render: function render(data) {
        return "<td>".concat(data, "</td>");
      }
    }, {
      data: 'hasDisplay',
      name: 'hasDisplay',
      visible: false,
      searchable: true,
      orderable: false,
      render: function render(data) {
        return "<td>".concat(data, "</td>");
      }
    }, {
      data: 'hasHostPC',
      name: 'hasHostPC',
      visible: false,
      searchable: true,
      orderable: false,
      render: function render(data) {
        return "<td>".concat(data, "</td>");
      }
    }]
  });
  $('.filter-find').keyup(function () {
    locationsTable.search($(this).val()).draw();
  });
  $('.filter-button.show-more').click(function (event) {
    event.preventDefault();
    $('.advanced-filter').slideToggle();
  });
  new DTFilterState(locationsTable, ['hasPrinter', 'hasColorPrinter', 'hasPharos', 'hasProjection', 'hasDualProjection', 'hasDocCamera', 'hasLectureCap', 'hasVoiceAmp', 'hasWirelessVoiceAmp', 'hasPOD', 'hasDisplay', 'hasHostPC'], ['building', 'locationType']);
});
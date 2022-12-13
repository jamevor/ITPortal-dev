"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/*
	global DTFilterState, HTMLReplace
*/
var sectionFiltersInitialized = false;
var tableInitialized = false;

var _phasesWithRelatedItems;

$(document).ready(function () {
  var modalTable = $('#modal-table').DataTable({
    ajax: {
      url: $('#ajax-source').val(),
      dataSrc: function dataSrc(data) {
        _phasesWithRelatedItems = data.phasesWithRelatedItems;
        var result = [];

        var _loop = function _loop(phase) {
          result.push.apply(result, _toConsumableArray(data.phasesWithRelatedItems[phase].items.map(function (i) {
            i.phase = phase;
            return i;
          })));
        };

        for (var phase in data.phasesWithRelatedItems) {
          _loop(phase);
        }

        return result;
      }
    },
    stateSave: false,
    dom: 'tipr',
    pageLength: 25,
    searching: true,
    order: [[0, window.modalTable_defaultSortOrder]],
    initComplete: function initComplete() {
      refreshSectionFilters(_phasesWithRelatedItems);
      tableInitialized = true;
    },
    drawCallback: function drawCallback() {
      if (tableInitialized) {
        refreshSectionFilters(_phasesWithRelatedItems);
      }
    },
    columns: [{
      data: 'id'
    }, {
      data: 'title'
    }, {
      name: 'phase',
      data: 'phase',
      searchable: true,
      visible: false
    }, {
      className: 'action-links',
      data: function data(row) {
        return row;
      },
      render: function render(data) {
        return "<a class=\"console-edit\" href=\"#\" data-d='".concat(HTMLReplace(JSON.stringify(data)), "'><i class=\"far fa-fw fa-edit\"></i> </a>");
      }
    }]
  });
  $('.filter-find').keyup(function () {
    modalTable.search($(this).val()).draw();
  });
  /**
   * Create
   */

  $('#button-console-add').click(function (event) {
    event.preventDefault();
    $('#modal-console-add').find(':input').not($('#endpoint, #method')).val('');
    $('#modal-console-add').foundation('open');
  });
  $('.console-add-save').click(function (event) {
    event.preventDefault();
    var data = {};
    $('#modal-console-add').find(':input').not('button').not($('#endpoint, #method')).each(function (index, element) {
      data[$(element).attr('id')] = $(element).val();
    });
    $.ajax({
      url: $('#endpoint').val(),
      method: $('#method').val(),
      data: data,
      success: function success() {
        $('#toast-save-success').addClass('show');
        $('#modal-console-add').foundation('close');
        refreshTable();
      },
      error: function error(resp) {
        $('#toast-save-error').addClass('show');
      }
    });
  });
  /**
   * Edit
   */

  $('#modal-table').on('click', '.console-edit', function (event) {
    event.preventDefault();
    var data = $(event.currentTarget).data('d');
    $('#modal-console-edit').find(':input').not('button').not($('#edit-endpoint, #edit-method')).each(function (index, element) {
      $(element).val(data[$(element).attr('id').split('edit')[1].substring(1)]);
    });
    $('#modal-console-edit').foundation('open');
  });
  $('.console-edit-save').click(function (event) {
    event.preventDefault();
    var data = {};
    $('#modal-console-edit').find(':input').not('button').not(':hidden').each(function (index, element) {
      data[$(element).attr('id').split('edit')[1].substring(1)] = $(element).val();
    });
    $.ajax({
      url: "".concat($('#edit-endpoint').val(), "/").concat($('#edit-id').val()),
      method: $('#edit-method').val(),
      data: data,
      success: function success() {
        $('#toast-save-success').addClass('show');
        $('#modal-console-edit').foundation('close');
        refreshTable();
      },
      error: function error(resp) {
        $('#toast-save-error').addClass('show');
      }
    });
  });

  function refreshSectionFilters(phasesWithRelatedItems) {
    for (var phaseIndex in phasesWithRelatedItems) {
      if ($("#section-filter-".concat(phaseIndex)).length) {
        $("label[for=section-filter-".concat(phaseIndex, "]")).find('.filter-count').first().html("".concat(phasesWithRelatedItems[phaseIndex].count));
      } else {
        $('.section-filters').append("<input type=\"checkbox\" data-filtercolumn=\"phase\" id=\"section-filter-".concat(phaseIndex, "\" name=\"section-filter-").concat(phaseIndex, "\" value=\"").concat(phaseIndex, "\"></input>\n\t\t\t\t<label class=\"cell medium-3\" for=\"section-filter-").concat(phaseIndex, "\">\n\t\t\t\t\t<div class=\"filter-count\">").concat(phasesWithRelatedItems[phaseIndex].count, "</div>\n\t\t\t\t\t<div class=\"filter-label\">").concat(phaseIndex, "</div>\n\t\t\t\t</label>"));
      }
    }

    if (!sectionFiltersInitialized) {
      new DTFilterState(modalTable, null, null, $('.section-filters').children(':checkbox').map(function () {
        return this.id;
      }));
    }

    sectionFiltersInitialized = true;
  }

  function refreshTable() {
    modalTable.ajax.reload().draw();
  }
});
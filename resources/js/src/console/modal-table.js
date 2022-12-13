/*
	global DTFilterState, HTMLReplace
*/
var sectionFiltersInitialized = false;
var tableInitialized = false;
var _phasesWithRelatedItems;
$(document).ready(function() {

	const modalTable = $('#modal-table').DataTable(
		{
			ajax: {
				url: $('#ajax-source').val(),
				dataSrc: function(data) {
					_phasesWithRelatedItems = data.phasesWithRelatedItems;
					const result = [];
					for (let phase in data.phasesWithRelatedItems) {
						result.push(...data.phasesWithRelatedItems[phase].items.map(i => {
							i.phase = phase;
							return i;
						}));
					}
					return result;
				}
			},
			stateSave: false,
			dom: 'tipr',
			pageLength: 25,
			searching: true,
			order: [
				[ 0, window.modalTable_defaultSortOrder ]
			],
			initComplete: function() {
				refreshSectionFilters(_phasesWithRelatedItems);
				tableInitialized = true;
			},
			drawCallback: function() {
				if (tableInitialized) {
					refreshSectionFilters(_phasesWithRelatedItems);
				}
			},
			columns: [
				{
					data: 'id'
				},
				{
					data: 'title'
				},
				{
					name: 'phase',
					data: 'phase',
					searchable: true,
					visible: false
				},
				{
					className: 'action-links',
					data: function(row) {
						return row;
					},
					render: function(data) {
						return `<a class="console-edit" href="#" data-d='${JSON.stringify(data)}'><i class="far fa-fw fa-edit"></i> </a>`;
					}
				}
			]
		}
	);

	$('.filter-find').keyup(function() {
		modalTable.search($(this).val()).draw();
	});

	/**
	 * Create
	 */

	$('#button-console-add').click(function(event) {
		event.preventDefault();
		$('#modal-console-add').find(':input').not($('#endpoint, #method')).val('');
		$('#modal-console-add').foundation('open');
	});

	$('.console-add-save').click(function(event) {
		event.preventDefault();
		const data = {};
		$('#modal-console-add').find(':input').not('button').not($('#endpoint, #method')).each(function(index, element) {
			data[$(element).attr('id')] = $(element).val();
		});
		$.ajax(
			{
				url: $('#endpoint').val(),
				method: $('#method').val(),
				data,
				success: function() {
					$('#toast-save-success').addClass('show');
					$('#modal-console-add').foundation('close');
					refreshTable();
				},
				error: function(resp) {
					$('#toast-save-error').addClass('show');
				}
			}
		);
	});


	/**
	 * Edit
	 */


	$('#modal-table').on('click', '.console-edit', function(event) {
		event.preventDefault();
		const data = $(event.currentTarget).data('d');
		$('#modal-console-edit').find(':input').not('button').not($('#edit-endpoint, #edit-method')).each(function(index, element) {
			$(element).val(data[$(element).attr('id').split('edit')[1].substring(1)]);
		});
		$('#modal-console-edit').foundation('open');
	});

	$('.console-edit-save').click(function(event) {
		event.preventDefault();
		const data = {};
		$('#modal-console-edit').find(':input').not('button').not(':hidden').each(function(index, element) {
			data[$(element).attr('id').split('edit')[1].substring(1)] = $(element).val();
		});
		$.ajax(
			{
				url: `${$('#edit-endpoint').val()}/${$('#edit-id').val()}`,
				method: $('#edit-method').val(),
				data,
				success: function() {
					$('#toast-save-success').addClass('show');
					$('#modal-console-edit').foundation('close');
					refreshTable();
				},
				error: function(resp) {
					$('#toast-save-error').addClass('show');
				}
			}
		);
	});

	function refreshSectionFilters(phasesWithRelatedItems) {
		for (let phaseIndex in phasesWithRelatedItems) {
			if ($(`#section-filter-${phaseIndex}`).length) {
				$(`label[for=section-filter-${phaseIndex}]`).find('.filter-count').first().html(`${phasesWithRelatedItems[phaseIndex].count}`);
			} else {
				$('.section-filters').append(`<input type="checkbox" data-filtercolumn="phase" id="section-filter-${phaseIndex}" name="section-filter-${phaseIndex}" value="${phaseIndex}"></input>
				<label class="cell medium-3" for="section-filter-${phaseIndex}">
					<div class="filter-count">${phasesWithRelatedItems[phaseIndex].count}</div>
					<div class="filter-label">${phaseIndex}</div>
				</label>`);
			}
		}
		if (!sectionFiltersInitialized) {
			new DTFilterState(modalTable,
				null,
				null,
				$('.section-filters').children(':checkbox').map(function() {
					return this.id;
				})
			);
		}
		sectionFiltersInitialized = true;
	}

	function refreshTable() {
		modalTable.ajax.reload().draw();
	}

});


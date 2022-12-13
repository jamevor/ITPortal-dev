/*
	global DTFilterState
*/
$(document).ready(function() {

	const canCopy = $('#canCopy').val() === 'true';
	const entityType = $('#entity-type').val();
	const entityTypePlural = $('#entity-type-plural').val();

	let phases;

	const entityTable = $('#entity-table').DataTable(
		{
			stateSave: false,
			dom: 'tipr',
			pageLength: 25,
			searching: true,
			order: [
				[ 0, window.entityTable_defaultSortOrder ]
			],
			language: {
				'emptyTable': `There are no available ${entityTypePlural}.`,
				'info': `Showing _START_ to _END_ of _TOTAL_ ${entityTypePlural}`,
				'infoEmpty': `Showing 0 to 0 of 0 ${entityTypePlural}`,
				'infoFiltered': `(filtered from _MAX_ total ${entityTypePlural})`,
				'loadingRecords': '<div class=\'spintro-wrapper\'><div class=\'spintro\'></div></div>'
			},
			dataType: 'json',
			ajax: {
				url: $('#data-source-endpoint').val(),
				type: 'get',
				data: {},
				dataSrc: function(data) {
					phases = data.phases;
					return data.data;
				}
			},
			deferRender: true,
			initComplete: function() {
				// build DOM
				for (const phase in phases) {
					$('.section-filters').append(renderFilter({filterColumn: 'phase', id: `section-filter-${phase}`, value: phase, data: phases[phase], label: phase}));
				}
				$('.section-filters').append(renderFilter({filterColumn: 'canView', id: 'section-filter-canView', value: 'true', data: '', label: 'Viewable'}));
				$('.section-filters').append(renderFilter({filterColumn: 'canEdit', id: 'section-filter-canEdit', value: 'true', data: '', label: 'Editable', isChecked: true}));

				if ($('.section-filters').length) {
					// show filters
					setTimeout(function() {
						$('#filters-wrapper').slideDown('slow');
					}, 150);
					// bind event listener class for filter state management
					new DTFilterState(entityTable,
						null,
						null,
						$('.section-filters').children(':checkbox').map(function() {
							return this.id;
						})
					);
				}
			},
			columns: [
				{
					data: 'id',
					defaultContent: ''
				},
				{
					data: 'phase',
					defaultContent: '',
					render: function(data) {
						return `<span class='label' style="background:#${data.color}">${data.title}</span>`;
					}
				},
				{
					data: 'permissions.canView',
					defaultContent: '',
					render: function(data, type, row) {
						return `<a ${data ? `href="/${entityType}/${row.id}"` : 'href="#" class="disabled"'}> ${row.title}</a>`;
					}
				},
				{
					data: 'permissions.canView',
					defaultContent: '',
					visible: false,
					searchable: true,
					render: function(data) {
						return data === true ? 'true' : 'false';
					}
				},
				{
					data: 'permissions.canEdit',
					defaultContent: '',
					visible: false,
					searchable: true,
					render: function(data) {
						return data === true ? 'true' : 'false';
					}
				},
				{
					data: 'permissions',
					defaultContent: '',
					className: 'action-links',
					render: function(data, type, row) {
						return `
							${canCopy && data.canEdit ? `<a class="console-copy" data-entityid="${row.id}" href="#"><i class="far fa-fw fa-copy"></i> </a>` : ''}
							${data.canEdit ? `<a href="/console/${entityType}/edit/${row.id}"><i class="far fa-fw fa-edit"></i> </a>` : ''}
							`;
					}
				}
			]
		}
	);

	$('.filter-find').keyup(function() {
		entityTable.search($(this).val()).draw();
	});

	$('#entity-table').on('click', '.console-copy', function(event) {
		event.preventDefault();
		$('#toast-copy-wait').addClass('show');
		setTimeout(function() {
			$.ajax(
				{
					url: `${$('#copy-endpoint').val()}/${$(event.currentTarget).data('entityid')}`,
					method: $('#copy-method').val(),
					data: {},
					success: function(data) {
						window.location.replace(`/console/${data.type}/edit/${data.id}?copy_token=${data.copyToken}`);
					},
					error: function(resp) {
						$('#toast-copy-error').addClass('show');
					}
				}
			);
		}, 300);
	});

});

const renderFilter = ({filterColumn, id, value, data, label, isChecked}) => {
	return `<input type="checkbox" data-filtercolumn="${filterColumn}" id="${id}" name="${id}" value="${value}"${isChecked === true ? ' checked' : ''}></input>
	<label class="cell medium-3" for="${id}">
		<div class="filter-count">${data}</div>
		<div class="filter-label">${label}</div>
	</label>`;
};

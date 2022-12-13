/* global moment */
$(document).ready(function() {

	const historyTable = $('#history-table').DataTable(
		{
			stateSave: false,
			dom: 'tipr',
			pageLength: 10,
			ordering: false,
			searching: true,
			language: {
				'emptyTable': 'There are no available items.',
				'info': 'Showing _START_ to _END_ of _TOTAL_ items',
				'infoEmpty': 'Showing 0 to 0 of 0 items',
				'infoFiltered': '(filtered from _MAX_ total items)',
				'loadingRecords': '<div class=\'spintro-wrapper\'><div class=\'spintro\'></div></div>'
			},
			dataType: 'json',
			ajax: {
				url: '/api/v1/history-table/data/get/all',
				type: 'get',
				data: {},
				dataSrc: 'data'
			},
			columns: [
				{
					data: 'updatedAt',
					defaultContent: '',
					render: function(data) {
						return `${moment(data).format('ll')}`;
					}
				},
				{
					data: 'entity',
					defaultContent: ''
				},
				{
					data: 'id',
					defaultContent: ''
				},
				{
					data: 'permissions.canView',
					defaultContent: '',
					render: function(data, type, row) {
						return `<a ${data ? `href="/${row.entity}/${row.id}"` : 'href="#" class="disabled"'}> ${row.title}</a>`;
					}
				},
				{
					data: 'permissions.canEdit',
					defaultContent: '',
					className: 'action-links',
					render: function(data, type, row) {
						return `<a ${data ? `href="/console/${row.entity}/edit/${row.id}"` : 'href="#" class="disabled"'}><i class="far fa-fw fa-edit"></i> </a>`;
					}
				}
			]
		}
	);

	$('.filter-find').keyup(function() {
		historyTable.search($(this).val()).draw();
	});

});

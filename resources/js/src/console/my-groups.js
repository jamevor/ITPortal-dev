$(document).ready(function() {

	const groupsTable = $('#groups-table').DataTable(
		{
			stateSave: false,
			dom: 'tipr',
			pageLength: 25,
			searching: true,
			language: {
				'emptyTable': 'You do not belong to any groups.',
				'info': 'Showing _START_ to _END_ of _TOTAL_ groups',
				'infoEmpty': 'Showing 0 to 0 of 0 groups',
				'infoFiltered': '(filtered from _MAX_ total groups)',
				'loadingRecords': '<div class=\'spintro-wrapper\'><div class=\'spintro\'></div></div>'
			},
			dataType: 'json',
			ajax: {
				url: '/api/v1/me/group/get/all',
				type: 'get',
				data: {},
				dataSrc: 'groups'
			},
			columns: [
				{
					data: 'id',
					defaultContent: ''
				},
				{
					data: 'title',
					defaultContent: '',
					render: function(data, type, row) {
						return `<a href="/group/${row.id}">${data}</a>`;
					}
				},
				{
					data: 'isDefault',
					defaultContent: '',
					visible: false,
					searchable: true,
					render: function(data) {
						return data === true ? 'true' : 'false';
					}
				}
			]
		}
	);

	$('.filter-find').keyup(function() {
		groupsTable.search($(this).val()).draw();
	});

});

/* global DTFilterState */
$(document).ready(function() {

	const softwareTable = $('#softwareTable').DataTable(
		{
			pageLength: 25,
			searching: true,
			dom: 'tipr',
			language: {
				'emptyTable': 'There is no available Software.',
				'info': 'Showing _START_ to _END_ of _TOTAL_ Software',
				'infoEmpty': 'Showing 0 to 0 of 0 Software',
				'infoFiltered': '(filtered from _MAX_ total Software)',
				'loadingRecords': '<div class=\'spintro-wrapper\'><div class=\'spintro\'></div></div>'
			},
			dataType: 'json',
			ajax: {
				url: '/api/v1/software/get/all',
				type: 'get',
				data: {},
				dataSrc: ''
			},
			columns: [
				{
					data: 'title',
					visible: true,
					searchable: true,
					orderable: true,
					render: function(data, type, row) {
						return `<td><a href="/software/${row.id}">${data}</a></td>`;
					},
					defaultContent: ''
				},
				{
					data: 'version',
					visible: true,
					searchable: true,
					orderable: true,
					defaultContent: ''
				},
				{
					data: 'publisher',
					visible: true,
					searchable: true,
					orderable: true,
					defaultContent: ''
				},
				{
					data: 'softwareOs',
					visible: true,
					searchable: true,
					orderable: true,
					defaultContent: '',
					render: function(data) {
						let result = '<td>';
						for (let os of data) {
							result += `<a href="#"><i title="${os.title}" class="fab fa-lg ${os.icon}"></i><span class="show-for-sr">${os.title}</span></a>`;
						}
						result += '</td>';
						return result;
					}
				},
				{
					data: 'softwareOs',
					name: 'softwareOs',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						if (data) {
							return `<td>${data.map(d => d.title).join(',')}</td>`;
						} else {
							return '<td></td>';
						}
					}
				},
				{
					data: 'isLicensed',
					name: 'isLicensed',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'isCLA',
					name: 'isCLA',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'useWPI',
					name: 'useWPI',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'usePersonal',
					name: 'usePersonal',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'isSCCM',
					name: 'isSCCM',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
			]
		}
	);

	$('.filter-find').keyup(function() {
		softwareTable.search($(this).val()).draw();
	});

	$('.filter-button.show-more').click(function(event) {
		event.preventDefault();
		$('.advanced-filter').slideToggle();
	});

	new DTFilterState(softwareTable,
		['isLicensed',
			'isCLA',
			'useWPI',
			'usePersonal',
			'isSCCM'],
		[
			'softwareOs'
		]
	);

});
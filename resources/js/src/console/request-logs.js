$(document).ready(function() {

	const requestLogsTable = $('#request-logs-table').DataTable(
		{
			ajax: {
				url: '/api/v1/request-log/get/today',
				method: 'GET',
				dataSrc: ''
			},
			stateSave: false,
			dom: 'tipr',
			pageLength: 25,
			searching: true,
			columns: [
				{
					data: 'timestamp',
					defaultContent: ''
				},
				{
					data: 'method',
					defaultContent: ''
				},
				{
					data: 'endpoint',
					defaultContent: ''
				},
				{
					data: 'responseMS',
					defaultContent: ''
				},
				{
					data: 'responseCode',
					defaultContent: ''
				},
				{
					data: 'responseBytes',
					defaultContent: ''
				},
				{
					data: 'responseType',
					defaultContent: ''
				},
				{
					data: 'referrer',
					defaultContent: ''
				},
				{
					data: 'userAgent',
					defaultContent: ''
				},
				{
					data: 'browser.name',
					defaultContent: ''
				},
				{
					data: 'browser.version',
					defaultContent: ''
				},
				{
					data: 'remoteIP',
					defaultContent: ''
				},
				{
					data: 'protocol',
					defaultContent: ''
				},
				{
					data: 'isFresh',
					defaultContent: ''
				},
				{
					data: 'isXHR',
					defaultContent: ''
				},
				{
					data: 'app.instance',
					defaultContent: ''
				},
				{
					data: 'app.version',
					defaultContent: ''
				}
			]
		}
	);

	$('.filter-find').keyup(function() {
		requestLogsTable.search($(this).val()).draw();
	});

});
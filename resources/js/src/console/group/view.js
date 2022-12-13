'use strict';

$(document).ready(function() {

	window.permissionsTable = $('#permissions-table').DataTable(
		{
			dom: 'tr',
			paging: false,
			searching: false
		}
	);

	window.membersTable = $('#members-table').DataTable(
		{
			dom: 'tr',
			paging: false,
			searching: false
		}
	);

});
$(document).ready(function() {
	const permissionsTable = $('#permissions-table').DataTable(
		{
			dom: 'tipr',
			pageLength: 25,
			searching: true
		}
	);

	$('.filter-find').keyup(function() {
		permissionsTable.search($(this).val()).draw();
	});
});
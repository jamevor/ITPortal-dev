$(document).ready(function() {
	const groupsTable = $('#groups-table').DataTable(
		{
			dom: 'tipr',
			pageLength: 25,
			searching: true
		}
	);

	$('.filter-find').keyup(function() {
		groupsTable.search($(this).val()).draw();
	});
});
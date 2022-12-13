$(document).ready(function() {

	let title = "";
	let filename ="";


	var buttonCommon = {
		init: function(dt, node, config) {
		  var table = dt.table().context[0].nTable;
		  if (table) config.title = $(table).data('export-title')
		  if (table) config.filename = $(table).data('export-file')
		},
		title: "WPI Hub - Class List",
		filename: "WPI Hub-Class List",
	};
	$.extend( $.fn.dataTable.defaults, {
		"buttons": [
			

		]
	} );

	window.dataTables = $('.dataTable').DataTable(
		{
			lengthChange: true,
			pageLength: 10,
			info: true,
			searching: true,
			dom: '<"grid-x grid-margin-x"<"cell small-12 medium-6"B><"cell small-12 medium-6"f>>rt<"grid-x grid-margin-x"<"cell small-12 medium-6"i><"cell small-12 medium-6"p>>',
			order: [[ 1, 'asc' ]],
			language: {
				'search': '<span class=\'sr-only\'>Search</span>_INPUT_',
				'searchPlaceholder': 'Search',
				"lengthMenu":     "Show _MENU_ students",
				"infoEmpty":      "Showing 0 to 0 of 0 students",
				"infoFiltered":   "(filtered from _MAX_ total students)",
				"info":           "Showing _START_ to _END_ of _TOTAL_ students",
			},
			columnDefs: [
				{
					targets: 'table-hidden',
					visible: false,
					searchable: true
				},
				{ 
					orderable: false, 
					targets: 0 
				}
			],
			buttons: [
				{
					extend: 'copy',
					text: '<i class="fas fa-copy"></i><span class="show-for-sr>Copy</span>',
					titleAttr: 'Copy'
				},
				$.extend( true, {}, buttonCommon, {
					extend: 'excel',
					text: '<i class="fas fa-file-excel"></i><span class="show-for-sr>Download Excel</span>',
					titleAttr: 'Download Excel',
				} ),
				$.extend( true, {}, buttonCommon, {
					extend: 'csv',
					text: '<i class="fas fa-file-csv"></i><span class="show-for-sr>Download CSV</span>',
					titleAttr: 'Download CSV',
				} ),
				$.extend( true, {}, buttonCommon, {
					extend: 'pdf',
					text: '<i class="fas fa-file-pdf"></i><span class="show-for-sr>Download PDF</span>',
					titleAttr: 'Download PDF',
					orientation: 'landscape',
					customize: function(doc) {
						doc.styles.tableHeader = {
							color: 'white',
							fillColor: '#740c10',
							alignment: "center",
							bold: true,
							fontSize: 11
						},
						doc.content[1].table.widths = 
						Array(doc.content[1].table.body[0].length + 1).join('*').split('');
				  
					}

				} ),
				$.extend( true, {}, buttonCommon, {
					extend: 'print',
					text: '<i class="fas fa-print"></i><span class="show-for-sr>Print Table</span>',
					titleAttr: 'Print Table',
					orientation: 'landscape',
				} ),
			]
		}
	);
	
});
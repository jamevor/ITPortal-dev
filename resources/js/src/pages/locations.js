/*
	global DTFilterState
*/
$(document).ready(function() {
	/**
	 * Locations
	 */
	const boolOptions = ['hasPrinter',
	'hasColorPrinter',
	'hasPharos',
	'hasProjection',
	'hasDualProjection',
	'hasDocCamera',
	'hasLectureCap',
	'hasVoiceAmp',
	'hasWirelessVoiceAmp',
	'hasPOD',
	'hasDisplay',
	'hasHostPC',
	'hasWacomTouchscreen',
	'hasHDMILaptopCable',
	'hasUSBCLaptopCable',
	'hasBlurayPlayer',
	'hasZoomCapable']


	if(gfeatures){
	const validFeatures = gfeatures.filter(feature =>{
		return boolOptions.includes(feature);
	})
	
	for(let validFeature of validFeatures){
		$("#" + validFeature).prop('checked',true).change()
	}
	}
	if(gcontext){
		if(gcontext == "locations"){
			toggleLocations();
		}
		if(gcontext == "servers"){
			toggleServers();
		}
	}
	const locationsTable = $('#locationsTable').DataTable(
		{
			dom: 'tipr',
			pageLength: 25,
			searching: true,
			language: {
				'emptyTable': 'There are no available Locations.',
				'info': 'Showing _START_ to _END_ of _TOTAL_ Locations',
				'infoEmpty': 'Showing 0 to 0 of 0 Locations',
				'infoFiltered': '(filtered from _MAX_ total Locations)',
				'loadingRecords': '<div class=\'spintro-wrapper\'><div class=\'spintro\'></div></div>'
			},
			dataType: 'json',
			ajax: {
				url: '/api/v1/location/get/all',
				type: 'get',
				data: {},
				dataSrc: ''
			},
			columns: [
				{
					data: 'building.title',
					name: 'building',
					visible: true,
					searchable: true,
					orderable: true,
					render: function(data, type, row) {
						if (data) {
							return `
                <td>
                  <a href="/building/${row.building.id}">${data}</a>
                </td>
              `;
						} else {
							return '<td></td>';
						}
					}
				},
				{
					data: 'title',
					visible: true,
					searchable: true,
					orderable: true,
					render: function(data, type, row) {
						if (data) {
							return `
                <td>
                  <a href="/location/${row.id}">${data}</a>
                </td>
              `;
						} else {
							return '<td></td>';
						}
					}
				},
				{
					data: 'locationType',
					name: 'locationType',
					visible: true,
					searchable: true,
					orderable: true,
					className: 'text-capitalize',
					render: function(data) {
						if (data) {
							return `<td>${data.title}</td>`;
						} else {
							return '<td></td>';
						}
					}
				},
				{
					data: 'room',
					visible: true,
					searchable: true,
					orderable: true,
					render: function(data) {
						if (data) {
							return `<td>${data}</td>`;
						} else {
							return '<td></td>';
						}
					}
				},
				{
					data: 'seats',
					visible: true,
					searchable: true,
					orderable: true,
					render: function(data) {
						if (data) {
							return `<td>${data}</td>`;
						} else {
							return '<td></td>';
						}
					}
				},
				{
					data: 'computers',
					visible: true,
					searchable: true,
					orderable: true,
					render: function(data) {
						if (data) {
							return `<td>${data}</td>`;
						} else {
							return '<td></td>';
						}
					}
				},
				{
					data: 'hasPrinter',
					name: 'hasPrinter',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasColorPrinter',
					name: 'hasColorPrinter',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasPharos',
					name: 'hasPharos',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasProjection',
					name: 'hasProjection',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasDualProjection',
					name: 'hasDualProjection',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasDocCamera',
					name: 'hasDocCamera',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasLectureCap',
					name: 'hasLectureCap',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasVoiceAmp',
					name: 'hasVoiceAmp',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasWirelessVoiceAmp',
					name: 'hasWirelessVoiceAmp',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasPOD',
					name: 'hasPOD',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasDisplay',
					name: 'hasDisplay',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasHostPC',
					name: 'hasHostPC',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasWacomTouchscreen',
					name: 'hasWacomTouchscreen',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasHDMILaptopCable',
					name: 'hasHDMILaptopCable',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasUSBCLaptopCable',
					name: 'hasUSBCLaptopCable',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasBlurayPlayer',
					name: 'hasBlurayPlayer',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'hasZoomCapable',
					name: 'hasZoomCapable',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						return `<td>${data}</td>`;
					}
				},
				{
					data: 'descriptionShort',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						if (data) {
							return `<td>${data}</td>`;
						} else {
							return '<td></td>';
						}
					}
				},
				{
					data: 'aliases',
					visible: false,
					searchable: true,
					orderable: false,
					render: function(data) {
						if (Array.isArray(data) && data.length) {
							return `<td>${data.map(a => a.title || '').join('')}</td>`;
						} else {
							return '<td></td>';
						}
					}
				},
			]
		}
	);

	$('#filter-locations').keyup(function() {
		locationsTable.search($(this).val()).draw();
	});

	$('.filter-button.show-more').click(function(event) {
		event.preventDefault();
		$('.advanced-filter').slideToggle();
	});



	new DTFilterState(locationsTable,
		boolOptions,
		[
			'building',
			'locationType'
		]
	);


	/**
	 * Servers
	 */

	const serversTable = $('#serversTable').DataTable(
		{
			dom: 'tipr',
			pageLength: 25,
			searching: true,
			language: {
				'emptyTable': 'There are no available Servers.',
				'info': 'Showing _START_ to _END_ of _TOTAL_ Servers',
				'infoEmpty': 'Showing 0 to 0 of 0 Servers',
				'infoFiltered': '(filtered from _MAX_ total Servers)',
				'loadingRecords': '<div class=\'spintro-wrapper\'><div class=\'spintro\'></div></div>'
			},
			dataType: 'json',
			ajax: {
				url: '/api/v1/server/get/all',
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
						if (data) {
							return `
                <td>
                  <a href="/server/${row.id}">${data}</a>
                </td>
              `;
						} else {
							return '<td></td>';
						}
					}
				},
				{
					data: 'host',
					visible: true,
					searchable: true,
					orderable: true,
					render: function(data, type, row) {
						if (data) {
							return `
                <td>
                  <a href="/server/${row.id}">${data}</a>
                </td>
              `;
						} else {
							return '<td></td>';
						}
					}
				},
			]
		}
	);

	$('#filter-servers').keyup(function() {
		serversTable.search($(this).val()).draw();
	});


	/**
	 * Toggle
	 */
	$('#toggle-servers').click(function(event) {
		event.preventDefault();
		toggleServers()
	});

	$('#toggle-locations').click(function(event) {
		event.preventDefault();
		toggleLocations()
	});

	function toggleServers(){
		$('.advanced-filter').hide();
		$('.toggle-locations').hide();
		$('#toggle-locations').removeClass('active');
		$('.toggle-servers').slideDown();
		$('#toggle-servers').addClass('active');
	}
	function toggleLocations(){
		$('.toggle-servers').hide();
		$('#toggle-servers').removeClass('active');
		$('.toggle-locations').slideDown();
		$('#toggle-locations').addClass('active');
	}
});
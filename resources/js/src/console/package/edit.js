$(document).ready(function() {
	// breadcrumbs
	$('.article-heading').on('keyup change paste', function() {
		$('.breadcrumbs li:last-child > a').text($('.article-heading').text());
	});

	// software

	$('#add-software-input').easyAutocomplete(
		{
			url: '/api/v1/software/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#software').val(JSON.stringify($('#add-software-input').getSelectedItemData()));
				}
			},
			placeholder: 'Search for software...',
			requestDelay: 200
		}
	);

	$('#add-software-button').click(function(event) {
		event.preventDefault();
		if ($('#software').val().length) {
			renderSoftware(JSON.parse($('#software').val()));
			$('#add-software-input, #software').val('');
		}
	});

	$('#softwareTable tbody').on('click', '.button-remove-software', function(event) {
		window.softwareTable.row($(event.currentTarget).closest('tr')).remove();
		window.softwareTable.draw();
		enableSave();
	});

	/**
	 *
	 *
	 * Related items
	 *
	 *
	 */

	// location
	$('#add-location-input').easyAutocomplete(
		{
			url: '/api/v1/location/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#location').val(JSON.stringify($('#add-location-input').getSelectedItemData()));
				}
			},
			placeholder: 'Search for a location...',
			requestDelay: 200
		}
	);

	$('#add-location-button').click(function(event) {
		event.preventDefault();
		if ($('#location').val().length) {
			addRelationshipItem(JSON.parse($('#location').val()), 'location');
			$('#location', '#add-location-input').val('');
		}
	});

	// server
	$('#add-server-input').easyAutocomplete(
		{
			url: '/api/v1/server/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#server').val(JSON.stringify($('#add-server-input').getSelectedItemData()));
				}
			},
			placeholder: 'Search for a server...',
			requestDelay: 200
		}
	);

	$('#add-server-button').click(function(event) {
		event.preventDefault();
		if ($('#server').val().length) {
			addRelationshipItem(JSON.parse($('#server').val()), 'server');
			$('#server', '#add-server-input').val('');
		}
	});

	$('.console-modal').on('click', '.remove-related-item-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
	});





	// save

	$('.button-save').click(function(event) {
		event.preventDefault();
		if ($(event.currentTarget).hasClass('disabled')) {
			return false;
		}
		const software = window.softwareTable.columns(0).data().eq(0).unique().toArray();
		// related items
		const locations = $('.locations-wrapper').children('li.location-item').map(function(index, value) {
			return $(value).data('locationid');
		}).toArray();
		const servers = $('.servers-wrapper').children('li.server-item').map(function(index, value) {
			return $(value).data('serverid');
		}).toArray();
		$.ajax(
			{
				url: $('#update-endpoint').val(),
				method: $('#update-method').val(),
				data: {
					title: $('#article-title').text(),
					descriptionShort: $('#article-summary').text(),
					idPackagePhase: $('#phase').val(),
					software,
					locations,
					servers
				},
				success: function(data) {
					disableSave();
					if (data.created) {
						window.location.replace('/package/' + data.package.id);
					} else {
						$('#toast-save-success').addClass('show');
					}
				},
				error: function(resp) {
					$('#toast-save-error').addClass('show');
				}
			}
		);
	});

	// save state
	$('.article, .console-modal').on('keyup change paste', ':input, [contenteditable=true]', function() {
		if ($('#article-title').text().length) {
			enableSave();
		} else {
			disableSave();
		}
	});
	$('.article').on('click', '.ce-settings__plugin-zone *, .ce-settings__default-zone *', function() {
		if ($('#article-title').text().length) {
			enableSave();
		} else {
			disableSave();
		}
	});

	$('#button-generate-preview').click(function(event) {
		event.preventDefault();
		$.ajax(
			{
				url: '/api/v1/preview/create/one',
				method: 'POST',
				data: {
					entity: 'package',
					entityID: $('#package-id').val()
				},
				success: function(data) {
					// set preview link in modal
					$('#preview-link').val(data.link);
					// open modal
					$('#modal-preview').foundation('open');
				},
				error: function(resp) {
					console.error(resp);
				}
			}
		);
	});

});



// helpers

const renderSoftware = software => {
	let found = false;
	window.softwareTable.rows().every(function() {
		if (this.data()[0] == software.id) {
			found = true;
			return false;
		}
	});
	if (!found) {
		window.softwareTable.row.add(
			[
				software.id,
				software.title ? `<a href='#'>${software.title}</a>` : '',
				software.version ? software.version : '',
				software.publisher ? software.publisher : '',
				'<button class=\'button-remove-software\'><i class=\'fas fa-unlink\'></i> Remove</button>'
			]
		);
		window.softwareTable.draw();
	}
};

const addRelationshipItem = (item, type) => {
	let found = false, itemExists = false;
	$(`.${type}-item`).each(function() {
		if ($(this).data(`${type}id`) == item.id) {
			itemExists = true;
			return false;
		}
		if ($(this).text() > item.title) {
			found = true;
			$(this).before(relatedItemToDOM(item, type));
			return false;
		}
	});
	if (!(found || itemExists)) {
		if ($(`.${type}-item`).length) {
			$(`.${type}-item`).last().after(relatedItemToDOM(item, type));
		} else {
			$(`.${type}s-wrapper`).append(relatedItemToDOM(item, type));
		}
	}
};

const relatedItemToDOM = (item, type) => {
	return `<li data-${type}id="${item.id}" class="${type}-item related-item">${item.title}<button class='remove-related-item-button'><i class='fas fa-times'></i> Remove</button></li>`;
};

const enableSave = () => {
	$('.button-save').removeClass('disabled');
};
const disableSave = () => {
	$('.button-save').addClass('disabled');
};

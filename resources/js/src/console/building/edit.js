/* global EntityGroupsUtility */
$(document).ready(function() {

	// groups and sharing
	window.egu = new EntityGroupsUtility(
		{
			container: '#egu',
			entity: 'building',
			entityID: $('#building-id').length ? $('#building-id').val() : null,
			isNewEntity: !$('#building-id').length,
			isAccessRestricted: $('#is-access-restricted').val() === 'true',
			canRemoveGroups: $('#can-remove-groups').val() === 'true'
		}
	);
	window.egu.init();

	// breadcrumbs
	$('.article-heading').on('keyup change paste', function() {
		$('.breadcrumbs li:last-child > a').text($('.article-heading').text());
	});



	$('.card-list').on('click', '.remove-catalog-item-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
	});

	// locations

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


	$('#add-location-input').on('keyup', function(event) {
		event.preventDefault();
		if (event.which == 13 && $('#add-location-input').val().length) {
			renderLocation(JSON.parse($('#location').val()));
			$('#add-location-input, #location').val('');
		}
	});

	$('#add-location-button').click(function(event) {
		event.preventDefault();
		if ($('#location').val().length) {
			renderLocation(JSON.parse($('#location').val()));
			$('#location, #location').val('');
		}
	});



	// save

	$('#button-submit-for-review').click(function(event) {
		event.preventDefault();
		$('#phase').val('2'); // set to review
		saveHandler(false);
	});

	$('.button-save').click(function(event) {
		event.preventDefault();
		if ($(event.currentTarget).hasClass('disabled')) {
			return false;
		}
		saveHandler();
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
					entity: 'building',
					entityID: $('#building-id').val()
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

// saveHandler
const saveHandler = (stay = true) => {
	const locations = $('.location-item').map(function(index, value) {
		return $(value).data('locationid');
	}).toArray();
	const groups = window.egu.getGroups();
	$.ajax(
		{
			url: $('#update-endpoint').val(),
			method: $('#update-method').val(),
			data: {
				title: $('#article-title').text(),
				idSpacePhase: $('#phase').val(),
				abbr: $('#abbr').text(),
				common: $('#building-common').text(),
				address: $('#building-address').text(),
				geo: $('#geo').val(),
				descriptionShort: $('#article-summary').text(),
				locations,
				groups,
				accessRestricted: $('#restrictAccess').is(':checked')
			},
			success: function(data) {
				disableSave();
				window.egu.canRemoveGroups = data.canRemoveGroups;
				window.egu.lockGroups();
				if (data.created || !stay) {
					window.location.replace('/building/' + data.building.id);
				} else {
					$('#toast-save-success').addClass('show');
					setTimeout(function() {
						$('#toast-save-success').removeClass('show');
					}, 5000);
				}
			},
			error: function(resp) {
				$('#toast-save-error').addClass('show');
			}
		}
	);
};



const renderLocation = location => {
	let found = false, itemExists = false;
	$('.location-item').each(function() {
		if ($(this).data('locationid') == location.id) {
			itemExists = true;
			return false;
		}
		if ($(this).text() > location.title) {
			found = true;
			$(this).before(locationToDOM(location));
			return false;
		}
	});
	if (!(found || itemExists)) {
		if ($('.location-item').length) {
			$('.location-item').last().after(locationToDOM(location));
		} else {
			$('.locations-wrapper').append(locationToDOM(location));
		}
	}
};

const locationToDOM = location => {
	return `
  <li class="cell location-item" data-locationid="${location.id}">
    <a class="location-card" href="#">
      <i class="location-card-icon fas ${location.locationType && location.locationType.icon ? location.locationType.icon : 'fa-globe'}"></i>
      <h3 class="location-card-title">${location.title}</h3>
      <p class="location-card-room">${location.room}</p>
    </a>
  </li>
  `;
};

const enableSave = () => {
	$('.button-save').removeClass('disabled');
};
const disableSave = () => {
	$('.button-save').addClass('disabled');
};
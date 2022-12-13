/* global EntityGroupsUtility */
$(document).ready(function() {

	// groups and sharing
	window.egu = new EntityGroupsUtility(
		{
			container: '#egu',
			entity: 'server',
			entityID: $('#server-id').length ? $('#server-id').val() : null,
			isNewEntity: !$('#server-id').length,
			isAccessRestricted: $('#is-access-restricted').val() === 'true',
			canRemoveGroups: $('#can-remove-groups').val() === 'true'
		}
	);
	window.egu.init();

	// breadcrumbs
	$('.article-heading').on('keyup change paste', function() {
		$('.breadcrumbs li:last-child > a').text($('.article-heading').text());
	});


	// tags

	$('#add-tag-input').easyAutocomplete(
		{
			url: '/api/v1/tag/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#tag').val(JSON.stringify($('#add-tag-input').getSelectedItemData()));
				}
			},
			requestDelay: 200
		}
	);

	$('#add-tag-input').on('keyup', function(event) {
		event.preventDefault();
		if (event.which == 13 && $('#add-tag-input').val().length) {
			renderTag(JSON.parse($('#tag').val()));
			$('#add-tag-input, #tag').val('');
		}
	});

	$('.tags').on('click', '.remove-tag-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
	});



	// audiences

	$('#add-audience-input').easyAutocomplete(
		{
			url: '/api/v1/audience/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#audience').val(JSON.stringify($('#add-audience-input').getSelectedItemData()));
				}
			},
			requestDelay: 200
		}
	);

	$('#add-audience-input').on('keyup', function(event) {
		event.preventDefault();
		if (event.which == 13 && $('#add-audience-input').val().length) {
			renderAudience(JSON.parse($('#audience').val()));
			$('#add-audience-input, #audience').val('');
		}
	});

	$('.audience').on('click', '.remove-audience-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
	});


	// aliases

	$('#add-alias-input').easyAutocomplete(
		{
			url: '/api/v1/alias/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#alias').val(JSON.stringify($('#add-alias-input').getSelectedItemData()));
				}
			},
			requestDelay: 200
		}
	);

	$('#add-alias-input').on('keyup', function(event) {
		event.preventDefault();
		if (event.which == 13 && $('#add-alias-input').val().length) {
			renderAlias(JSON.parse($('#alias').val()));
			$('#add-alias-input, #alias').val('');
		}
	});

	$('.alias').on('click', '.remove-alias-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
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
			$('#software, #add-software-input').val('');
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

	$('.console-modal').on('click', '.remove-related-item-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
	});

	$('#add-package-input').easyAutocomplete(
		{
			url: '/api/v1/package/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#package').val(JSON.stringify($('#add-package-input').getSelectedItemData()));
				}
			},
			placeholder: 'Search for a package...',
			requestDelay: 200
		}
	);

	$('#add-package-button').click(function(event) {
		event.preventDefault();
		if ($('#package').val().length) {
			addRelationshipItem(JSON.parse($('#package').val()), 'package');
			$('#package', '#add-package-input').val('');
		}
	});

	$('.console-modal').on('click', '.remove-related-item-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
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
					entity: 'server',
					entityID: $('#server-id').val()
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
	const tags = $('.tags').children('li.tag').map(function(index, value) {
		return $(value).data('tagid');
	}).toArray();
	const audiences = $('.audience').children('li.audience-item').map(function(index, value) {
		return $(value).data('audienceid');
	}).toArray();
	const aliases = $('.alias').children('li.alias-item').map(function(index, value) {
		return $(value).data('aliasid');
	}).toArray();
	const software = window.softwareTable.columns(0).data().eq(0).unique().toArray();
	// related items
	const packages = $('.packages-wrapper').children('li.package-item').map(function(index, value) {
		return $(value).data('packageid');
	}).toArray();
	const groups = window.egu.getGroups();
	$.ajax(
		{
			url: $('#update-endpoint').val(),
			method: $('#update-method').val(),
			data: {
				title: $('#article-title').text(),
				descriptionShort: $('#article-summary').text(),
				idServerPhase: $('#phase').val(),
				requirements: $('#requirements').text(),
				host: $('#host').val(),
				tags,
				audiences,
				aliases,
				software,
				packages,
				groups,
				accessRestricted: $('#restrictAccess').is(':checked')
			},
			success: function(data) {
				disableSave();
				window.egu.canRemoveGroups = data.canRemoveGroups;
				window.egu.lockGroups();
				if (data.created || !stay) {
					window.location.replace('/server/' + data.server.id);
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

// helpers

const renderTag = tag => {
	let found = false, tagExists = false;
	$('.tags').children('.tag').each(function() {
		if ($(this).data('tagid') == tag.id) {
			tagExists = true;
			return false;
		}
		if ($(this).children('a').text() > tag.title) {
			found = true;
			$(this).before(tagToDOM(tag));
			return false;
		}
	});
	if (!(found || tagExists)) {
		if ($('.tags').children('.tag').length) {
			$('.tags').children('.tag').last().before(tagToDOM(tag));
		} else {
			$('.tags').children().last().before(tagToDOM(tag));
		}
	}
};

const tagToDOM = tag => {
	return `<li data-tagid="${tag.id}" class="tag"><a href="#">${tag.title}<button class='remove-tag-button'><i class='fas fa-times-circle'></i></button></a></li>`;
};

const renderAudience = audience => {
	let found = false, audienceExists = false;
	$('.audience').children('.audience-item').each(function() {
		if ($(this).data('audienceid') == audience.id) {
			audienceExists = true;
			return false;
		}
		if ($(this).children('a').text() > audience.title) {
			found = true;
			$(this).before(audienceToDOM(audience));
			return false;
		}
	});
	if (!(found || audienceExists)) {
		if ($('.audience').children('.audience-item').length) {
			$('.audience').children('.audience-item').last().before(audienceToDOM(audience));
		} else {
			$('.audience').children().last().before(audienceToDOM(audience));
		}
	}
};

const audienceToDOM = audience => {
	return `<li data-audienceid="${audience.id}" class="audience-item"><a href="#">${audience.title}<button class='remove-audience-button'><i class='fas fa-times-circle'></i></button></a></li>`;
};

const renderAlias = alias => {
	let found = false, aliasExists = false;
	$('.alias').children('.alias-item').each(function() {
		if ($(this).data('aliasid') == alias.id) {
			aliasExists = true;
			return false;
		}
		if ($(this).children('a').text() > alias.title) {
			found = true;
			$(this).before(aliasToDOM(alias));
			return false;
		}
	});
	if (!(found || aliasExists)) {
		if ($('.alias').children('.alias-item').length) {
			$('.alias').children('.alias-item').last().before(aliasToDOM(alias));
		} else {
			$('.alias').children().last().before(aliasToDOM(alias));
		}
	}
};

const aliasToDOM = alias => {
	return `<li data-aliasid="${alias.id}" class="alias-item"><a href="#">${alias.title}<button class='remove-alias-button'><i class='fas fa-times-circle'></i></button></a></li>`;
};

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

/* global EntityGroupsUtility, dragula */
$(document).ready(function() {
	// groups and sharing
	window.egu = new EntityGroupsUtility(
		{
			container: '#egu',
			entity: 'article',
			entityID: $('#article-id').length ? $('#article-id').val() : null,
			isNewEntity: !$('#article-id').length,
			isAccessRestricted: $('#is-access-restricted').val() === 'true',
			canRemoveGroups: $('#can-remove-groups').val() === 'true'
		}
	);
	window.egu.init();

	// breadcrumbs
	$('.article-heading').on('keyup change paste', function() {
		$('.breadcrumbs li:last-child > a').text($('.article-heading').text());
	});

	// Image change
	$('#file').change(function() {
		$('#img-changed').val('true');
		$('#button-remove-image').show();
		$('#img-removed').val('false');
		if ($('#file') && $('#file')[0] && $('#file')[0].files && $('#file')[0].files[0]) {
			const reader = new FileReader();
			reader.onload = function(event2) {
				$('.section-img').css('background-image', `url('${event2.target.result}')`);
			};
			reader.readAsDataURL($('#file')[0].files[0]);
		}
		$('.arrow-pulse-down').show();
		enableSave();
	});

	$('#button-remove-image').click(function(event) {
		event.preventDefault();
		$('.section-img').css('background-image', '');
		$('#button-remove-image').hide();
		$('#img-removed').val('true');
		$('.arrow-pulse-down').hide();
		enableSave();
	});

	$('input[name=gizmo-type]').change(function() {
		if ($(this).val() === 'text') {
			$('#query-options-wrapper').slideUp();
		} else {
			$('#query-options-wrapper').slideDown();
		}
	});

	// subsite metadata
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

	/**
	 * Gizmos
	 */
	$('#button-add-gizmo').click(function() {
		$('#gizmo-modal').find('input[type=text]').each(function() {
			$(this).val('');
		});
		$('#gizmo-text').prop('checked', true);
		$('#gizmo-modal').find('.tag').remove();
		$('#gizmo-modal').find('.audience-item').remove();
		$('#button-create-gizmo').show();
		$('#button-update-gizmo').hide();
		$('#button-delete-gizmo').hide();
		$('#gizmo-modal').foundation('open');
	});
	$('#gizmo-wrapper').on('click', '.gizzy-edit', function() {
		// clear
		$('#gizmo-modal').find('input[type=text]').each(function() {
			$(this).val('');
		});
		$('#gizmo-modal').find('.tag').remove();
		$('#gizmo-modal').find('.audience-item').remove();
		$('#button-create-gizmo').hide();
		$('#button-update-gizmo').show();
		$('#button-delete-gizmo').show();
		// fill
		const gizmoData = $(this).closest('.gizzy').data('gizmo');
		const { id, title, gizmoType, content, limit, maxHeightPx, orderResults, orderResultsIsAsc, widthPct, displayMode } = gizmoData;
		$('#gizmo-id').val(id);
		$('#gizzy-title').val(title);
		$(`input[name=gizmo-type][value=${gizmoType}]`).prop('checked', true).change();
		$('#gizzy-content').text(content);
		$('#gizzy-display-width').val(widthPct);
		$('#gizzy-display-mheight').val(maxHeightPx);
		$('#gizzy-display-style').val(displayMode);
		$('#gizzy-query-limit').val(limit);
		$('#gizzy-query-orderBy').val(orderResults);
		$('#gizzy-query-order').val(orderResultsIsAsc === true ? 'asc' : 'desc');
		// open
		$('#gizmo-modal').foundation('open');
		for (const tag of gizmoData.tags) {
			renderGizzyTag(tag);
		}
		for (const audience of gizmoData.audiences) {
			renderGizzyAudience(audience);
		}
	});
	$('#button-create-gizmo').click(function() {
		createGizmo();
	});
	$('#button-update-gizmo').click(function() {
		updateGizmo();
	});
	$('#button-delete-gizmo').click(function() {
		if (!$(this).hasClass('active')) {
			$(this).addClass('active');
			let that = this;
			setTimeout(function() {
				$(that).removeClass('active');
			}, 5000);
			return false;
		} else {
			deleteGizmo($('#gizmo-id').val());
		}
	});
	// gizmo tags
	$('#gizzy-tags').easyAutocomplete(
		{
			url: '/api/v1/tag/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#gizzy-tag').val(JSON.stringify($('#gizzy-tags').getSelectedItemData()));
				}
			},
			requestDelay: 200
		}
	);
	$('#gizzy-tags').on('keyup', function(event) {
		event.preventDefault();
		if (event.which == 13 && $('#gizzy-tags').val().length) {
			renderGizzyTag(JSON.parse($('#gizzy-tag').val()));
			$('#gizzy-tags, #gizzy-tag').val('');
		}
	});
	$('.tags').on('click', '.remove-tag-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
	});
	// gizmo audiences
	$('#gizzy-audiences').easyAutocomplete(
		{
			url: '/api/v1/audience/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#gizzy-audience').val(JSON.stringify($('#gizzy-audiences').getSelectedItemData()));
				}
			},
			requestDelay: 200
		}
	);
	$('#gizzy-audiences').on('keyup', function(event) {
		event.preventDefault();
		if (event.which == 13 && $('#gizzy-audiences').val().length) {
			renderGizzyAudience(JSON.parse($('#gizzy-audience').val()));
			$('#gizzy-audiences, #gizzy-audience').val('');
		}
	});
	$('.audience').on('click', '.remove-audience-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
	});

	/**
	 * Featured Content
	 */
	const featuredContentPublishedTable = $('#featured-content-published-table').DataTable(
		{
			dom: 't',
			paging: false,
			searching: true,
			ordering: false
		}
	);

	const featuredContentUnpublishedTable = $('#featured-content-unpublished-table').DataTable(
		{
			dom: 'tp',
			pageLength: 10,
			searching: true
		}
	);

	$('.table').on('click', '.button-publish', function(event) {
		event.preventDefault();
		$.ajax(
			{
				url: `/api/v1/subsite/${$('#subsite-id').val()}/featured-content/set-published`,
				method: 'PATCH',
				data: {
					published: 'true',
					id: $(event.currentTarget).data('metaid')
				},
				success: function() {
					$('#toast-save-success').addClass('show');
					setTimeout(function() {
						window.location.reload();
					}, 3000);
				},
				error: function() {
					$('#toast-save-error').addClass('show');
				}
			}
		);
	});

	$('.table').on('click', '.button-unpublish', function(event) {
		event.preventDefault();
		$.ajax(
			{
				url: `/api/v1/subsite/${$('#subsite-id').val()}/featured-content/set-published`,
				method: 'PATCH',
				data: {
					published: 'false',
					id: $(event.currentTarget).data('metaid')
				},
				success: function() {
					$('#toast-save-success').addClass('show');
					setTimeout(function() {
						window.location.reload();
					}, 3000);
				},
				error: function() {
					$('#toast-save-error').addClass('show');
				}
			}
		);
	});

	$('#console-add').click(function(event) {
		event.preventDefault();
		$('#modal-console-add').foundation('open');
	});

	$('.console-add-save').click(function(event) {
		event.preventDefault();
		const fd = new FormData();
		fd.append('title', $('#title').val());
		fd.append('link', $('#link').val());
		fd.append('published', $('#published').is(':checked'));
		fd.append('position', $('#position').val());
		fd.append('img', $('#img')[0].files[0]);
		$.ajax(
			{
				url: '/api/v1/subsite/' + $('#subsite-id').val() + '/featured-content/create/one',
				method: 'POST',
				contentType: false,
				processData: false,
				data: fd,
				success: function() {
					$('#toast-save-success').addClass('show');
					$('#modal-console-add').foundation('close');
				},
				error: function() {
					$('#toast-save-error').addClass('show');
				}
			}
		);
	});

	$('.button-edit').click(function(event) {
		event.preventDefault();
		$('#edit-id').val($(event.currentTarget).data('metaid'));
		$('#edit-title').val($(event.currentTarget).data('metatitle'));
		$('#edit-link').val($(event.currentTarget).data('metalink'));
		$('#edit-published').prop('checked', $(event.currentTarget).closest('#featured-content-published-table').length);
		$('#edit-img-changed').val('false');
		$('#edit-position').val($(event.currentTarget).data('positionid')).change();
		$('#modal-console-edit').foundation('open');
	});

	$('#edit-img').change(function() {
		$('#edit-img-changed').val('true');
	});

	$('.console-edit-save').click(function(event) {
		event.preventDefault();
		const fd = new FormData();
		fd.append('title', $('#edit-title').val());
		fd.append('link', $('#edit-link').val());
		fd.append('published', $('#edit-published').is(':checked'));
		fd.append('position', $('#edit-position').val());
		if ($('#edit-img-changed').val() === 'true') {
			fd.append('img', $('#edit-img')[0].files[0]);
		}
		fd.append('id', $('#edit-id').val());
		$.ajax(
			{
				url: `/api/v1/subsite/${$('#subsite-id').val()}/featured-content/update/one`,
				method: 'PUT',
				contentType: false,
				processData: false,
				data: fd,
				success: function() {
					$('#toast-save-success').addClass('show');
					$('#modal-console-edit').foundation('close');
				},
				error: function() {
					$('#toast-save-error').addClass('show');
				}
			}
		);
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
		if ($('.article-heading').text().length) {
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
					entity: 'subsite',
					entityID: $('#subsite-id').val()
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

const saveHandler = (stay = true) => {
	const tags = $('.tags').not('.gizmo-tags').children('li.tag').map(function(index, value) {
		return $(value).data('tagid');
	}).toArray();
	const audiences = $('.audience').not('.gizmo-audiences').children('li.audience-item').map(function(index, value) {
		return $(value).data('audienceid');
	}).toArray();
	const fd = new FormData();
	fd.append('title', $('#article-title').text());
	fd.append('titleRoute', $('#title-route').val());
	fd.append('idSubSitePhase', $('#phase').val());
	// fd.append('icon', $('#icon').val());
	// fd.append('color', $('#color').val());
	fd.append('isPublic', $('#isPublic').is(':checked'));
	fd.append('isFeatured', $('#isFeatured').is(':checked'));
	for (const tag of tags) {
		fd.append('tags[]', tag);
	}
	for (const audience of audiences) {
		fd.append('audiences[]', audience);
	}
	if ($('#img-changed').val() === 'true') {
		fd.append('fileupload', $('#file')[0].files[0]);
	}
	fd.append('imageRemoved', $('#img-removed').val());
	fd.append('accessRestricted', $('#restrictAccess').is(':checked'));
	const groups = window.egu.getGroups();
	for (const group of groups) {
		fd.append('groups[]', group);
	}
	$.ajax(
		{
			url: `${$('#update-endpoint').val()}`,
			method: $('#update-method').val(),
			contentType: false,
			processData: false,
			data: fd,
			success: function(data) {
				disableSave();
				window.egu.canRemoveGroups = data.canRemoveGroups;
				window.egu.lockGroups();
				if (data.created || !stay) {
					window.location.replace('/s/' + data.subsite.id);
				} else {
					$('#toast-save-success').addClass('show');
					setTimeout(function() {
						$('#toast-save-success').removeClass('show');
					}, 5000);
				}
			},
			error: function(resp) {
				if ('responseJSON' in resp && 'reason' in resp.responseJSON) {
					$('#toast-save-error').find('.toast-message').html(resp.responseJSON.reason);
				} else {
					$('#toast-save-error').find('.toast-message').html('Something went wrong when trying to save your subsite');
				}
				$('#toast-save-error').addClass('show');
				setTimeout(function() {
					$('#toast-save-error').removeClass('show');
				}, 5000);
			}
		}
	);
};

const enableSave = () => {
	$('.button-save').removeClass('disabled');
};
const disableSave = () => {
	$('.button-save').addClass('disabled');
};

const getGizmoModalData = () => {
	return {
		id: $('#gizmo-id').val(),
		title: $('#gizzy-title').val(),
		gizmoType: $('input[name=gizmo-type]:checked').val(),
		content: $('#gizzy-content').val(),
		widthPct: $('#gizzy-display-width').val(),
		maxHeightPx: $('#gizzy-display-mheight').val(),
		displayMode: $('#gizzy-display-style').val(),
		limit: $('#gizzy-query-limit').val(),
		orderResults: $('#gizzy-query-orderBy').val(),
		orderResultsIsAsc: $('#gizzy-query-order').val() === 'asc',
		tags: $('.gizmo-tags').children('.tag').map(function() {
			return $(this).data('tagid');
		}).toArray(),
		audiences: $('.gizmo-audiences').children('.audience-item').map(function() {
			return $(this).data('audienceid');
		}).toArray()
	};
};

const createGizmo = () => {
	const gizmoData = getGizmoModalData();
	$.ajax(
		{
			url: `/api/v1/subsite/${$('#subsite-id').val()}/gizmo/create/one`,
			method: 'POST',
			data: gizmoData,
			success: function() {
				window.location.reload();
			},
			error: function(resp) {
				console.error({resp});
			}
		}
	);
};
const updateGizmo = () => {
	const gizmoData = getGizmoModalData();
	$.ajax(
		{
			url: `/api/v1/subsite/${$('#subsite-id').val()}/gizmo/update/one`,
			method: 'PUT',
			data: gizmoData,
			success: function() {
				window.location.reload();
			},
			error: function(resp) {
				console.error({resp});
			}
		}
	);
};
const deleteGizmo = id => {
	$.ajax(
		{
			url: `/api/v1/subsite/${$('#subsite-id').val()}/gizmo/delete/one`,
			method: 'DELETE',
			data: {
				id
			},
			success: function() {
				window.location.reload();
			},
			error: function(resp) {
				console.error({resp});
			}
		}
	);
};

const renderGizzyTag = tag => {
	let found = false, tagExists = false;
	$('.gizmo-tags').children('.tag').each(function() {
		if ($(this).data('tagid') == tag.id) {
			tagExists = true;
			return false;
		}
		if ($(this).children('a').text().toLowerCase() > tag.title.toLowerCase()) {
			found = true;
			$(this).before(tagToDOM(tag));
			return false;
		}
	});
	if (!(found || tagExists)) {
		if ($('.gizmo-tags').children('.tag').length) {
			$('.gizmo-tags').children('.tag').last().before(tagToDOM(tag));
		} else {
			$('.gizmo-tags').append(tagToDOM(tag));
		}
	}
};

const tagToDOM = tag => {
	return `<li data-tagid="${tag.id}" class="tag"><a href="#">${tag.title}<button class='remove-tag-button'><i class='fas fa-times-circle'></i></button></a></li>`;
};

const renderGizzyAudience = audience => {
	let found = false, audienceExists = false;
	$('.gizmo-audiences').children('.audience-item').each(function() {
		if ($(this).data('audienceid') == audience.id) {
			audienceExists = true;
			return false;
		}
		if ($(this).children('a').text().toLowerCase() > audience.title.toLowerCase()) {
			found = true;
			$(this).before(audienceToDOM(audience));
			return false;
		}
	});
	if (!(found || audienceExists)) {
		if ($('.gizmo-audiences').children('.audience-item').length) {
			$('.gizmo-audiences').children('.audience-item').last().before(audienceToDOM(audience));
		} else {
			$('.gizmo-audiences').append(audienceToDOM(audience));
		}
	}
};

const audienceToDOM = audience => {
	return `<li data-audienceid="${audience.id}" class="audience-item"><a href="#">${audience.title}<button class='remove-audience-button'><i class='fas fa-times-circle'></i></button></a></li>`;
};

const renderTag = tag => {
	let found = false, tagExists = false;
	$('.tags').not('.gizmo-tags').children('.tag').each(function() {
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
		if ($('.tags').not('.gizmo-tags').children('.tag').length) {
			$('.tags').not('.gizmo-tags').children('.tag').last().before(tagToDOM(tag));
		} else {
			$('.tags').not('.gizmo-tags').children().last().before(tagToDOM(tag));
		}
	}
};

const renderAudience = audience => {
	let found = false, audienceExists = false;
	$('.audience').not('.gizmo-audiences').children('.audience-item').each(function() {
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
		if ($('.audience').not('.gizmo-audiences').children('.audience-item').length) {
			$('.audience').not('.gizmo-audiences').children('.audience-item').last().before(audienceToDOM(audience));
		} else {
			$('.audience').not('.gizmo-audiences').children().last().before(audienceToDOM(audience));
		}
	}
};
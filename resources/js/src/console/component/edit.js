/* global EditorJS, Header, List, InlineCode, ListIndent, ListOutdent, ListStyleToggle, ImageTool, EntityGroupsUtility */
$(document).ready(function() {

	// groups and sharing
	window.egu = new EntityGroupsUtility(
		{
			container: '#egu',
			entity: 'component',
			entityID: $('#component-id').length ? $('#component-id').val() : null,
			isNewEntity: !$('#component-id').length,
			isAccessRestricted: $('#is-access-restricted').val() === 'true',
			canRemoveGroups: $('#can-remove-groups').val() === 'true'
		}
	);
	window.egu.init();

	// editor js instances
	window.descriptionLongEditor = new EditorJS(
		{
			holder: 'descriptionLong',
			placeholder: 'Begin your description here...',
			minHeight: 1,
			tools: {
				paragraph: {
					inlineToolbar: ['bold', 'italic']
				},
				header: {
					class: Header,
					config: {
						minHeader: 3,
						maxHeader: 6,
						defaultLevel: 3
					},
					inlineToolbar: []
				},
				list: {
					class: List,
					inlineToolbar: ['bold', 'italic', 'inlineCode', 'outdent', 'indent', 'styleToggle']
				},
				inlineCode: {
					class: InlineCode
				},
				indent: {
					class: ListIndent
				},
				outdent: {
					class: ListOutdent
				},
				styleToggle: {
					class: ListStyleToggle
				},
				image: {
					class: ImageTool,
					config: {
						field: 'fileupload',
						endpoints: {
							byFile: '/api/v1/file-upload/create/one',
							byUrl: '/api/v1/file-upload/create/one'
						},
						additionalRequestData: {
							via: 'editorjs'
						}
					}
				},
			},
			data: window.editorjs_initialize_data.descriptionLong
		}
	);


	// breadcrumbs
	$('.article-heading').on('keyup change paste', function() {
		$('.breadcrumbs li:last-child > a').text($('.article-heading').text());
	});

	$('#icon').change(function() {
		$('#component-icon').removeClass();
		$('#component-icon').addClass(['fas', 'fa-4x', $('#icon').val() || 'fa-globe']);
	});



	// actions

	$('#actionTitle').easyAutocomplete(
		{
			url: '/api/v1/action/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onSelectItemEvent: () => {
					$('#action').val(JSON.stringify($('#actionTitle').getSelectedItemData()));
				},
				showAnimation: {
					type: 'slide',
					time: 300,
					callback: function() {}
				},
				hideAnimation: {
					type: 'slide',
					time: 300,
					callback: function() {}
				}
			},
			template: {
				type: 'custom',
				method: (value, item) => {
					return actionToDOM(item, false);
				}
			},
			placeholder: 'Search for an action...',
			requestDelay: 200
		}
	);

	$('#add-action-button').click(function(event) {
		event.preventDefault();
		if ($('#action').val().length) {
			renderAction(JSON.parse($('#action').val()));
			$('#action, #actionTitle').val('');
		}
	});

	$('#link-cards-action').on('click', '.remove-action-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
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
				onSelectItemEvent: () => {
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
				onSelectItemEvent: () => {
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
				onSelectItemEvent: () => {
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




	/**
   * Catalog items
   */

	$('#relationshipsTab .card-list').on('click', '.remove-catalog-item-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		$('#relate-service-input-group').slideDown();
		enableSave();
	});

	// service

	$('#relate-service-input').easyAutocomplete(
		{
			url: '/api/v1/service/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onSelectItemEvent: () => {
					$('#service').val(JSON.stringify($('#relate-service-input').getSelectedItemData()));
				}
			},
			placeholder: 'Search for a service...',
			requestDelay: 200
		}
	);

	$('#relate-service-input').on('keyup', function(event) {
		event.preventDefault();
		if (event.which == 13 && $('#relate-service-input').val().length) {
			renderParentService(JSON.parse($('#service').val()), 'service');
			$('#relate-service-input, #service').val('');
		}
	});

	$('#relate-service-button').click(function(event) {
		event.preventDefault();
		if ($('#service').val().length) {
			renderParentService(JSON.parse($('#service').val()), 'service');
			$('#relate-service-input, #service').val('');
		}
	});



	// articles

	$('.card-list').on('click', '.remove-article-card-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
	});

	$('#add-article-input').easyAutocomplete(
		{
			url: '/api/v1/article/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onSelectItemEvent: () => {
					$('#article').val(JSON.stringify($('#add-article-input').getSelectedItemData()));
				}
			},
			placeholder: 'Search for an article...',
			requestDelay: 200
		}
	);

	$('#add-article-input').on('keyup', function(event) {
		event.preventDefault();
		if (event.which == 13 && $('#add-article-input').val().length) {
			renderArticleItem(JSON.parse($('#article').val()), 'article');
			$('#add-article-input, #article').val('');
		}
	});
	$('#add-article-button').click(function(event) {
		event.preventDefault();
		if ($('#article').val().length) {
			renderArticleItem(JSON.parse($('#article').val()), 'article');
			$('#add-article-input, #article').val('');
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
					entity: 'component',
					entityID: $('#component-id').val()
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
const saveHandler = async(stay = true) => {
	const actions = $('#link-cards-action').children('li').map(function(index, value) {
		return $(value).data('actionid');
	}).toArray();
	const tags = $('.tags').children('li.tag').map(function(index, value) {
		return $(value).data('tagid');
	}).toArray();
	const audiences = $('.audience').children('li.audience-item').map(function(index, value) {
		return $(value).data('audienceid');
	}).toArray();
	const aliases = $('.alias').children('li.alias-item').map(function(index, value) {
		return $(value).data('aliasid');
	}).toArray();
	const articles = $('.article-card-item').map(function(index, value) {
		return $(value).data('articleid');
	}).toArray();
	const idService = $('.service-card-item').first().data('serviceid');
	const groups = window.egu.getGroups();
	$.ajax(
		{
			url: $('#update-endpoint').val(),
			method: $('#update-method').val(),
			data: {
				title: $('#article-title').text(),
				descriptionShort: $('#article-summary').text(),
				descriptionLong: await window.descriptionLongEditor.save(),
				idCatalogPhase: $('#phase').val(),
				idCatalogStatus: $('#status').val(),
				availability: $('#availability').text(),
				cost: $('#cost').text(),
				support: $('#support').text(),
				requirements: $('#requirements').text(),
				requesting: $('#requesting').text(),
				icon: $('#icon').val(),
				color: $('#color').val().replace('#', ' ').trim(),
				actions,
				tags,
				audiences,
				aliases,
				articles,
				idService,
				groups,
				accessRestricted: $('#restrictAccess').is(':checked')
			},
			success: function(data) {
				disableSave();
				window.egu.canRemoveGroups = data.canRemoveGroups;
				window.egu.lockGroups();
				if (data.created || !stay) {
					window.location.replace('/component/' + data.component.id);
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

const renderAction = action => {
	let found = false, actionExists = false;
	$('#link-cards-action').children().each(function() {
		if ($(this).data('actionid') == action.id) {
			actionExists = true;
			return false;
		}
		if ($(this).text() > action.title) {
			found = true;
			$(this).before(actionToDOM(action, false, true));
			return false;
		}
	});
	if (!(found || actionExists)) {
		$('#link-cards-action').append(actionToDOM(action, false, true));
	}
};

const actionToDOM = (action, renderLink, renderRemoveButton) => {
	renderLink = renderLink != undefined ? renderLink : true;
	renderRemoveButton = renderRemoveButton != undefined ? renderRemoveButton : false;
	return `<li data-actionid="${action.id}"><a class="${action.actionType.title}" target="_self" href="${renderLink ? action.link : '#'}">${action.title}${renderRemoveButton ? '<button class=\'remove-action-button\'><i class=\'fas fa-times-circle\'></i></button>' : ''}</a></li>`;
};

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

const catalogItemToDOM = (item, type, renderRemoveButton, compact) => {
	renderRemoveButton = renderRemoveButton != undefined ? renderRemoveButton : false;
	return `<li data-${type}id="${item.id}" class="cell ${type}-card-item${compact ? ' compact' : '' }">
    <a class="service-card" href="#">
      <i class="service-card-icon fas ${item.icon}"></i>
      <h3 class="service-card-title">${item.title}</h3>
      ${renderRemoveButton ? '<button class=\'remove-catalog-item-button\'><i class=\'fas fa-times-circle\'></i></button>' : ''}
    </a>
  </li>`;
};

const renderParentService = (item, type) => {
	$('#relate-service-input-group').slideUp();
	$(`.${type}-card-item`).remove();
	$(`.${type}-cards-wrapper`).append(catalogItemToDOM(item, type, true, true));
	$('.breadcrumbs li:nth-last-child(2) > a').text(item.title);
};

const renderArticleItem = item => {
	let found = false, articleItemExists = false;
	$('.article-card-item').each(function() {
		if ($(this).data('articleid') == item.id) {
			articleItemExists = true;
			return false;
		}
		if ($(this).find('h3').first().text() > item.title) {
			found = true;
			$(this).before(articleItemToDOM(item, true));
			return false;
		}
	});
	if (!(found || articleItemExists)) {
		if ($('.article-card-item').length) {
			$('.article-card-item').last().after(articleItemToDOM(item, true));
		} else {
			$('.article-cards-wrapper').append(articleItemToDOM(item, true));
		}
	}
};

const articleItemToDOM = (item, renderRemoveButton) => {
	renderRemoveButton = renderRemoveButton != undefined ? renderRemoveButton : false;
	return `<li data-articleid="${item.id}" class="cell article-card-item">
  <a class="article-card" href="#">
    <h3 class="article-card-title">${item.title}</h3>
    ${renderRemoveButton ? '<button class=\'remove-article-card-button\'><i class=\'fas fa-times-circle\'></i></button>' : '' }
  </a>
  </li>`;
};

const enableSave = () => {
	$('.button-save').removeClass('disabled');
};
const disableSave = () => {
	$('.button-save').addClass('disabled');
};

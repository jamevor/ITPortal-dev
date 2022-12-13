/* global moment, ColorConverter, EditorJS, Header, List, InlineCode, ListIndent, ListOutdent, ListStyleToggle, ImageTool, EntityGroupsUtility */
const subTypes = window.subTypes;
$(document).ready(function() {

	// groups and sharing
	window.egu = new EntityGroupsUtility(
		{
			container: '#egu',
			entity: 'news',
			entityID: $('#news-id').length ? $('#news-id').val() : null,
			isNewEntity: !$('#news-id').length,
			isAccessRestricted: $('#is-access-restricted').val() === 'true',
			canRemoveGroups: $('#can-remove-groups').val() === 'true'
		}
	);
	window.egu.init();

	// editor js instances
	window.detailsEditor = new EditorJS(
		{
			holder: 'details',
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
			data: window.editorjs_initialize_data.details
		}
	);


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
		enableSave();
	});

	$('#button-remove-image').click(function(event) {
		event.preventDefault();
		$('.section-img').css('background-image', '');
		$('#button-remove-image').hide();
		$('#img-removed').val('true');
		enableSave();
	});


	// breadcrumbs
	$('.article-heading').on('keyup change paste', function() {
		$('.breadcrumbs li:last-child > a').text($('.article-heading').text());
	});

	// status listener
	$('#status').change(function() {
		// color icon title
		const selectedItem = $('#status').find('option:selected');
		const data = {
			color: $(selectedItem).data('color'),
			icon: $(selectedItem).data('icon'),
			title: $(selectedItem).data('title')
		};
		$('.news-status-card').css('background', `#${data.color}`);
		$('.news-status-icon i').removeClass().addClass(['far', 'fa-2x', data.icon]);
		$('.news-status-title').text(data.title);
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
				onChooseEvent: () => {
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


	// articles

	$('#add-article-input').easyAutocomplete(
		{
			url: '/api/v1/article/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#article').val(JSON.stringify($('#add-article-input').getSelectedItemData()));
				}
			},
			template: {
				type: 'custom',
				method: (value, item) => {
					return catalogItemToDOM(item, 'article', false, true);
				}
			},
			placeholder: 'Search for an article...',
			requestDelay: 200
		}
	);

	$('#add-article-input').on('keyup', function(event) {
		event.preventDefault();
		if (event.which == 13 && $('#add-article-input').val().length) {
			renderCatalogItem(JSON.parse($('#article').val()), 'article');
			$('#add-article-input, #article').val('');
		}
	});
	$('#add-article-button').click(function(event) {
		event.preventDefault();
		if ($('#article').val().length) {
			renderCatalogItem(JSON.parse($('#article').val()), 'article');
			$('#add-article-input, #article').val('');
		}
	});


	/**
   * Catalog items
   */

	$('.link-cards, .news-sub').on('click', '.remove-catalog-item-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
	});

	// components

	$('#add-component-input').easyAutocomplete(
		{
			url: '/api/v1/component/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#component').val(JSON.stringify($('#add-component-input').getSelectedItemData()));
				}
			},
			template: {
				type: 'custom',
				method: (value, item) => {
					return catalogItemToDOM(item, 'component', false, true);
				}
			},
			placeholder: 'Search for a component...',
			requestDelay: 200
		}
	);

	$('#add-component-input').on('keyup', function(event) {
		event.preventDefault();
		if (event.which == 13 && $('#add-component-input').val().length) {
			renderCatalogItem(JSON.parse($('#component').val()), 'component');
			$('#add-component-input, #component').val('');
		}
	});
	$('#add-component-button').click(function(event) {
		event.preventDefault();
		if ($('#component').val().length) {
			renderCatalogItem(JSON.parse($('#component').val()), 'component');
			$('#add-component-input, #component').val('');
		}
	});

	// services

	$('#add-service-input').easyAutocomplete(
		{
			url: '/api/v1/service/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#service').val(JSON.stringify($('#add-service-input').getSelectedItemData()));
				}
			},
			template: {
				type: 'custom',
				method: (value, item) => {
					return catalogItemToDOM(item, 'service', false, true);
				}
			},
			placeholder: 'Search for a service...',
			requestDelay: 200
		}
	);

	$('#add-service-input').on('keyup', function(event) {
		event.preventDefault();
		if (event.which == 13 && $('#add-service-input').val().length) {
			renderCatalogItem(JSON.parse($('#service').val()), 'service');
			$('#add-service-input, #service').val('');
		}
	});
	$('#add-service-button').click(function(event) {
		event.preventDefault();
		if ($('#service').val().length) {
			renderCatalogItem(JSON.parse($('#service').val()), 'service');
			$('#add-service-input, #service').val('');
		}
	});


	// softwares

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
				},
			},
			template: {
				type: 'custom',
				method: (value, item) => {
					return catalogItemToDOM(item, 'software', false, true);
				}
			},
			placeholder: 'Search for software...',
			requestDelay: 200
		}
	);

	$('#add-software-input').on('keyup', function(event) {
		event.preventDefault();
		if (event.which == 13 && $('#add-software-input').val().length) {
			renderCatalogItem(JSON.parse($('#software').val()), 'software');
			$('#add-software-input, #software').val('');
		}
	});
	$('#add-software-button').click(function(event) {
		event.preventDefault();
		if ($('#software').val().length) {
			renderCatalogItem(JSON.parse($('#software').val()), 'software');
			$('#add-software-input, #software').val('');
		}
	});




	// news sub posts
	$('.news-sub').on('change', '.news-sub-type', function() {
		const selectedItem = $(this).children('option:selected');
		const selectedItemData = {
			color: $(selectedItem).data('color'),
			colorLight: $(selectedItem).data('colorlight'),
			icon: $(selectedItem).data('icon')
		};
		const wrapper = $(this).closest('.news-sub-item').first();
		$(wrapper).find('.news-sub-item-icon').css('background', selectedItemData.color).find('i').removeClass().addClass(['far', 'fa-fw', selectedItemData.icon]);
		$(wrapper).find('.news-sub-item-event').css('background', selectedItemData.colorLight);
	});

	$('#button-add-update').click(function(event) {
		event.preventDefault();
		createNewsSub();
	});



	// news sub actions

	$('.news-sub').on('click', '.button-open-news-sub-add-action-modal', function(event) {
		$('#cursor-news-sub-id').val($(event.currentTarget).closest('.news-sub-item').data('newssubid'));
	});

	$('#news-sub-action-input').easyAutocomplete(
		{
			url: '/api/v1/action/get/all',
			getValue: 'title',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#news-sub-action').val(JSON.stringify($('#news-sub-action-input').getSelectedItemData()));
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
			placeholder: 'Search for an action...',
			requestDelay: 200
		}
	);

	$('#news-sub-add-action-button').click(function(event) {
		event.preventDefault();
		if ($('#news-sub-action').val().length) {
			addActionToNewsSub($('#cursor-news-sub-id').val(), JSON.parse($('#news-sub-action').val()));
			$('#news-sub-action, #news-sub-action-input').val('');
		}
	});

	$('.news-sub').on('click', '.remove-action-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
	});

	$('.news-sub').on('click', '.remove-news-sub-button', function(event) {
		event.preventDefault();
		$(event.currentTarget).closest('.news-sub-item').slideUp(500, function() {
			$(this).data('isdeleted', 'true');
		});
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
					entity: 'news',
					entityID: $('#news-id').val()
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

// save handler
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
	const services = $('.service-item').not('.ignore').map(function(index, value) {
		return $(value).data('serviceid');
	}).toArray();
	const components = $('.component-item').not('.ignore').map(function(index, value) {
		return $(value).data('componentid');
	}).toArray();
	const software = $('.software-item').not('.ignore').map(function(index, value) {
		return $(value).data('softwareid');
	}).toArray();
	const articles = $('.article-item').not('.ignore').map(function(index, value) {
		return $(value).data('articleid');
	}).toArray();
	const newsSubs = $('.news-sub-item').not('.timestamp').map(function(index, value) {
		return {
			id: $(value).data('newssubid'),
			isNew: $(value).data('isnew'),
			isDeleted: $(value).data('isdeleted'),
			newsSubType: $(value).find('.news-sub-type').first().val(),
			title: $(value).find('.news-sub-title').first().text(),
			descriptionShort: $(value).find('.news-sub-description-short').first().text(),
			datePost: $(value).find('.news-sub-date-post').first().val(),
			actions: $(value).find('.news-sub-action-item').map(function(index_, value_) {
				return $(value_).data('actionid');
			}).toArray()
		};
	}).toArray();
	const fd = new FormData();
	fd.append('title', $('#article-title').text());
	fd.append('idNewsPhase', $('#phase').val());
	fd.append('idNewsType', $('#newsType').val());
	fd.append('idNewsStatus', $('#status').val());
	fd.append('descriptionShort', $('#article-summary').text());
	fd.append('why', $('#why').text());
	fd.append('impact', $('#impact').text());
	fd.append('benefits', $('#benefits').text());
	fd.append('actionDescription', $('#action-description').text());
	fd.append('details', JSON.stringify(await window.detailsEditor.save()));
	fd.append('datePost', $('#datePost').val());
	fd.append('dateStart', $('#dateStart').val());
	fd.append('dateEnd', $('#dateEnd').val());
	fd.append('showAlert', $('#showAlert').is(':checked'));
	fd.append('isWPIToday', $('#isWPIToday').is(':checked'));
	fd.append('isPinned', $('#isPinned').is(':checked'));
	fd.append('isHome', $('#isHome').is(':checked'));
	if ($('#img-changed').val() === 'true') {
		fd.append('fileupload', $('#file')[0].files[0]);
	}
	fd.append('imageRemoved', $('#img-removed').val());
	for (const action of actions) {
		fd.append('actions[]', action);
	}
	for (const tag of tags) {
		fd.append('tags[]', tag);
	}
	for (const audience of audiences) {
		fd.append('audiences[]', audience);
	}
	for (const service of services) {
		fd.append('services[]', service);
	}
	for (const component of components) {
		fd.append('components[]', component);
	}
	for (const software_ of software) {
		fd.append('software[]', software_);
	}
	for (const article of articles) {
		fd.append('articles[]', article);
	}

	let i = 0;
	for (const newsSub of newsSubs) {
		for (const key in newsSub) {
			if (key == 'actions') {
				for (const action of newsSub[key]) {
					fd.append(`newsSubs[${i}][${key}][]`, action);
				}
			} else {
				fd.append(`newsSubs[${i}][${key}]`, newsSub[key]);
			}
		}
		++i;
	}

	const groups = window.egu.getGroups();
	for (const group of groups) {
		fd.append('groups[]', group);
	}
	fd.append('accessRestricted', $('#restrictAccess').is(':checked'));

	const copyToken = new URLSearchParams(window.location.search).get('copy_token');

	$.ajax(
		{
			url: `${$('#update-endpoint').val()}${copyToken ? `?copy_token=${new URLSearchParams(window.location.search).get('copy_token')}` : ''}`,
			method: $('#update-method').val(),
			contentType: false,
			processData: false,
			data: fd,
			success: function(data) {
				disableSave();
				window.egu.canRemoveGroups = data.canRemoveGroups;
				window.egu.lockGroups();
				if (data.created || !stay) {
					window.location.replace('/news/' + data.news.id);
				} else {
					$('#toast-save-success').addClass('show');
					setTimeout(function() {
						$('#toast-save-success').removeClass('show');
						window.location.reload();
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

const renderCatalogItem = (item, type) => {
	let found = false, catalogItemExists = false;
	$(`.catalog-items > li.${type}-item`).each(function() {
		if ($(this).data(`${type}id`) == item.id) {
			catalogItemExists = true;
			return false;
		}
		if ($(this).children('a').text() > item.title) {
			found = true;
			$(this).before(catalogItemToDOM(item, type, true));
			return false;
		}
	});
	if (!(found || catalogItemExists)) {
		if ($(`.catalog-items > li.${type}-item`).length) {
			$(`.catalog-items > li.${type}-item`).last().after(catalogItemToDOM(item, type, true));
		} else {
			$(`#add-${type}-input`).closest('li').append(catalogItemToDOM(item, type, true));
		}
	}
};

const catalogItemToDOM = (item, type, renderRemoveButton, ignoreData) => {
	renderRemoveButton = renderRemoveButton != undefined ? renderRemoveButton : false;
	ignoreData = ignoreData != undefined ? ignoreData : false;
	return `<li data-${type}id="${item.id}" class="${type}-item${ignoreData ? ' ignore' : ''}"><a class="catalog ${type}" href="#">${item.title}${renderRemoveButton ? '<button class=\'remove-catalog-item-button\'><i class=\'fas fa-times-circle\'></i></button>' : ''}</a></li>`;
};

const createNewsSub = () => {
	const item = newsSubToDOM(
		{
			'idNewsSubType': 4,
			'title': '',
			'descriptionShort': '',
			'newsSubType': window.subTypes[3],
			'actions': []
		}
	);
	if ($('.news-sub').children('.news-sub-item').length) {
		$('.news-sub').children('.news-sub-item').first().before(item);
	} else {
		$('.news-sub').append(item);
	}
};

const newsSubToDOM = newsSub => {
	newsSub.id = newsSub.id || Math.random();
	const cc = ColorConverter(`#${newsSub.newsSubType.color}`, 'hex');
	return `
  <div class="news-sub-item${newsSub && newsSub.datePost && newsSub.datePost > new Date() ? ' future' : '' }" data-newsSubId="${newsSub.id}" data-isNew="true" data-isDeleted="false">
    <div class="news-sub-item-icon" style="background: ${cc.toHSL().toCSS()};">
      <i class="far fa-fw ${newsSub && newsSub.newsSubType && newsSub.newsSubType.icon ? newsSub.newsSubType.icon : 'fa-clock'}"></i>
    </div>
    <div class="news-sub-item-event" style="background: ${cc.set('l', 95).toCSS()};">
        <label for="newsSubType-${newsSub.id}">Update Type</label>
        <select name="newsSubType" id="newsSubType-${newsSub.id}" class='title-case news-sub-type'>
        ${
	subTypes.map(subType => {
		return `
              <option class='title-case' value="${ subType.id }" data-color="${ '#' + subType.color }"
              data-colorlight="${ ColorConverter('#' + subType.color, 'hex').toHSL().set('l',95).toCSS() }"
              data-icon="${ subType.icon }" ${ newsSub && newsSub.idNewsSubType == subType.id ? 'selected' : '' }>${ subType.title }</option>
            `;
	}).join('')
}
        </select>
        <label for="datePost-${newsSub.id}">Posted</label>
        <input type='datetime-local' id="datePost-${newsSub.id}" class='news-sub-date-post' value="${newsSub.datePost ? moment(newsSub.datePost).format(moment.HTML5_FMT.DATETIME_LOCAL) : moment(new Date()).format(moment.HTML5_FMT.DATETIME_LOCAL) }" name='datePost'>
        <h3 class="news-sub-title" contenteditable=true placeholder='News update title'>${newsSub.title}</h3>
        <p class='news-sub-description-short' contenteditable=true placeholder='News update description'>${newsSub.descriptionShort}</p>
        <a data-open="news-sub-add-action-modal" class="button-open-news-sub-add-action-modal button-news-update"><i class='far fa-link'></i> Link Action</a>
        <ul class="news-sub-item-links">
        </ul>
        </div>
    <button class='remove-news-sub-button'><i class='fas fa-times-circle'></i></button>
  </div>
  `;
};

const addActionToNewsSub = (newsSubId, action) => {
	const LI = `<li class="news-sub-action-item" data-actionid="${action.id}"><a href="#" target="self">${action.title}<button class='remove-catalog-item-button'><i class='fas fa-times-circle'></i></button></a></li>`;
	$(`.news-sub-item[data-newssubid="${newsSubId}"]`).find('.news-sub-item-links').append(LI);
};

const enableSave = () => {
	$('.button-save').removeClass('disabled');
};
const disableSave = () => {
	$('.button-save').addClass('disabled');
};

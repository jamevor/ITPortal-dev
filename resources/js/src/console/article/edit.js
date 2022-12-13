/* global EntityGroupsUtility, EditorJS, Header, List, InlineCode, ListIndent, ListOutdent, ListStyleToggle, ImageTool, CodeTool, Note, Table, Checklist, dragula */
const articleContentEditors = [];
const deletedSections = [];
let newContentCounter = 0;

// editor js instances
const tools = {
	paragraph: {
		inlineToolbar: ['bold', 'italic', 'inlineCode']
	},
	header: {
		class: Header,
		config: {
			minHeader: 2,
			maxHeader: 6,
			defaultLevel: 2
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
	table: {
		class: Table,
		inlineToolbar: ['bold', 'italic'],
		config: {
			rows: 2,
			cols: 2
		},
	},
	code: {
		class: CodeTool
	},
	embed: {
		class: Embed,
		inlineToolbar: false,
		config: {
			services: {
				youtube: true
			}
		}
	},
	checklist: {
		class: Checklist,
		inlineToolbar: ['bold', 'italic', 'inlineCode']
	},
	note: {
		class: Note,
		inlineToolbar: ['bold', 'italic', 'inlineCode'],
		config: {
			titlePlaceholder: 'Note Title',
			messagePlaceholder: 'Note Message'
		}
	},
};

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


	window.articleMainEditor = new EditorJS(
		{
			holder: 'articleMainEditor',
			placeholder: 'Begin your article here...',
			tools,
			data: window.editorjs_initialize_data.articleMain
		}
	);
	window.articleAdvancedEditor = new EditorJS(
		{
			holder: 'articleAdvanced',
			placeholder: 'Begin your article here...',
			tools,
			data: window.editorjs_initialize_data.articleAlternate
		}
	);
	window.articleInternalEditor = new EditorJS(
		{
			holder: 'articleInternal',
			placeholder: 'Begin your article here...',
			tools,
			data: window.editorjs_initialize_data.articleInternal
		}
	);

	/**
	 * Dynamic article content
	 */
	$('.article-article-contents').each(function() {
		console.log($(this).data('content'));
		console.log(decodeURIComponent($(this).data('content')));
		console.log(JSON.parse(decodeURIComponent($(this).data('content'))));
		const content = JSON.parse(decodeURIComponent($(this).data('content')));
		const guid = $(this).data('guid');
		const id = $(this).data('id');
		const holder = `article-content-${guid}`;
		articleContentEditors.push(
			[
				id,
				holder,
				new EditorJS(
					{
						holder,
						placeholder: 'Begin your article here...',
						tools,
						data: content
					}
				)
			]
		);
	});
	$('#button-add-article-content').click(addArticleContent);
	$('.layout-option').click(function(event) {
		event.preventDefault();
		$('.layout-option').removeClass('chosen');
		$(this).addClass('chosen');
		enableSave();
	});

	/**
	 * Remove article content
	 */
	$('#articleMain').on('click', '.article-content-drag-x', function() {
		if ($(this).hasClass('active')) {
			const holder = $(this).closest('.article-article-contents').attr('id');
			const id = $(this).closest('.article-article-contents').data('id');
			const editorIndex = articleContentEditors.findIndex(ace => ace[1] == holder);
			articleContentEditors.splice(editorIndex, 1);
			deletedSections.push(id);
			$(this).closest('.article-article-contents').slideUp('slow', function() {
				$(this).remove();
			});
			enableSave();
		} else {
			$(this).addClass('active');
			const that = this;
			setTimeout(function() {
				$(that).removeClass('active');
			}, 5000);
		}
	});

	/**
	 * Dragula on dynamic article content
	 */
	const drake = dragula([document.getElementById('drag-container')],
		{
			direction: 'vertical',
			ignoreInputTextSelection: true,
			mirrorContainer: document.getElementById('drag-container'),
			moves: function(el, container, handle) {
				return handle.classList.contains('article-content-drag') || handle.classList.contains('article-content-drag-handle');
			}
		}
	);
	drake.on('drop', enableSave);

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







	/**
   * Catalog items
   */

	$('.link-cards').on('click', '.remove-catalog-item-button', function(event) {
		event.preventDefault();
		$(event.target).closest('li').remove();
		enableSave();
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
					entity: 'article',
					entityID: $('#article-id').val()
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
	const softwares = $('.software-item').not('.ignore').map(function(index, value) {
		return $(value).data('softwareid');
	}).toArray();
	const siblingArticles = $('.article-item').not('.ignore').map(function(index, value) {
		return $(value).data('articleid');
	}).toArray();
	const fd = new FormData();
	fd.append('title', $('#article-title').text());
	fd.append('descriptionShort', $('#article-summary').text());
	fd.append('idArticlePhase', $('#phase').val());
	fd.append('requireAuth', $('#requireAuth').is(':checked'));
	fd.append('content', JSON.stringify(await window.articleMainEditor.save()));
	fd.append('contentAlt', JSON.stringify(await window.articleAdvancedEditor.save()));
	fd.append('contentInternal', JSON.stringify(await window.articleInternalEditor.save()));
	fd.append('useLegacy', $('#useLegacy').is(':checked'));
	fd.append('contentLegacy', $('#contentLegacy').val());
	fd.append('contentAltLegacy', $('#contentAltLegacy').val());
	fd.append('contentInternalLegacy', $('#contentInternalLegacy').val());
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
	for (const software of softwares) {
		fd.append('softwares[]', software);
	}
	for (const siblingArticle of siblingArticles) {
		fd.append('siblingArticles[]', siblingArticle);
	}
	fd.append('accessRestricted', $('#restrictAccess').is(':checked'));
	const groups = window.egu.getGroups();
	for (const group of groups) {
		fd.append('groups[]', group);
	}
	if ($('#img-changed').val() === 'true') {
		fd.append('fileupload', $('#file')[0].files[0]);
	}
	fd.append('imageRemoved', $('#img-removed').val());

	fd.append('displayMode', $('.layout-option.chosen').data('displaymode'));
	const articleContents = $('.article-article-contents').map(async function(index) {
		const handle = $(this).attr('id');
		const articleContentEditor = articleContentEditors.find(ace => ace[1] == handle);
		fd.append(`articleContent[${index}][id]`, articleContentEditor[0]);
		fd.append(`articleContent[${index}][title]`, $(`#${articleContentEditor[1]}`).children('.article-article-contents-title').text());
		fd.append(`articleContent[${index}][content]`, JSON.stringify(await articleContentEditor[2].save()));
		fd.append(`articleContent[${index}][order]`, index + 1);
	});

	await Promise.all(articleContents);

	for (const id of deletedSections) {
		fd.append('deletedArticleContent[]', id);
	}
	$.ajax(
		{
			url: $('#update-endpoint').val(),
			method: $('#update-method').val(),
			contentType: false,
			processData: false,
			data: fd,
			dataType: 'json',
			success: function(data) {
				disableSave();
				window.egu.lockGroups();
				if (data.created || !stay) {
					window.location.replace('/article/' + data.article.id);
				} else {
					$('#toast-save-success').addClass('show');
					setTimeout(function() {
						$('#toast-save-success').removeClass('show');
						window.location.reload();
					}, 3000);
				}
			},
			error: function(resp) {
				if ('responseJSON' in resp && 'reason' in resp.responseJSON) {
					$('#toast-save-error').find('.toast-message').html(resp.responseJSON.reason);
				} else {
					$('#toast-save-error').find('.toast-message').html('Something went wrong when trying to save your article');
				}
				$('#toast-save-error').addClass('show');
				setTimeout(function() {
					$('#toast-save-error').removeClass('show');
				}, 5000);
			}
		}
	);
};

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
			$(`#add-${type}-input`).closest('li').after(catalogItemToDOM(item, type, true));
		}
	}
};

const catalogItemToDOM = (item, type, renderRemoveButton, ignoreData) => {
	renderRemoveButton = renderRemoveButton != undefined ? renderRemoveButton : false;
	ignoreData = ignoreData != undefined ? ignoreData : false;
	return `<li data-${type}id="${item.id}" class="${type}-item${ignoreData ? ' ignore' : ''}"><a class="catalog ${type}" href="#">${item.title}${renderRemoveButton ? '<button class=\'remove-catalog-item-button\'><i class=\'fas fa-times-circle\'></i></button>' : ''}</a></li>`;
};

const addArticleContent = () => {
	let result = `<section class="article-article-contents" id="article-content-${newContentCounter}">
		<div class="article-content-drag"><i class="fas fa-grip-lines article-content-drag-handle"></i><div class="article-content-drag-x"><i class="fas fa-times article-content-drag-x-icon"></i></div></div>
		<h2 contenteditable=true placeholder="Section Title" class="article-article-contents-title"></h2>
	</section>`;
	$('#drag-container').append(result);
	const id = null;
	const holder = `article-content-${newContentCounter}`;
	articleContentEditors.push(
		[
			id,
			holder,
			new EditorJS(
				{
					holder,
					placeholder: 'Begin your article here...',
					tools
				}
			)
		]
	);
	newContentCounter++;
};

const enableSave = () => {
	$('.button-save').removeClass('disabled');
};
const disableSave = () => {
	$('.button-save').addClass('disabled');
};
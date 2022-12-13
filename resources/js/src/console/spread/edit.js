/* global EntityGroupsUtility, EditorJS, Header, List, InlineCode, ListIndent, ListOutdent, ListStyleToggle, ImageTool, CodeTool, Note, Table, Embed, Checklist, Quote, InlineActionLink */
$(document).ready(function() {
	// apply layouts
	$('.layout-option').click(function(event) {
		event.preventDefault();
		let template = $(this).data('layout');
		$('.layout-option').removeClass('chosen');
		$(this).addClass('chosen');
		if (template && template['spread-column-1'] && template['spread-column-2'] && template['spread-column-3']) {
			const spreadEm = (templateItem, templateClasses) => {
				templateItem.hasClass('box') ? templateClasses += ' box' : templateClasses;
				templateItem.css({ 'opacity': 1, 'background': 'var(--color-lane)' }).removeClass().addClass(function() {
					let item = $(this);
					setTimeout(function() {
						item.addClass(templateClasses).css({'opacity': 1,'background': ''});
					}, 200);
				});
			};
			spreadEm($('#spread-column-1'), template['spread-column-1']);
			spreadEm($('#spread-column-2'), template['spread-column-2']);
			spreadEm($('#spread-column-3'), template['spread-column-3']);
		}
		enableSave();
	});

	// groups and sharing
	window.egu = new EntityGroupsUtility(
		{
			container: '#egu',
			entity: 'spread',
			entityID: $('#spread-id').length ? $('#spread-id').val() : null,
			isNewEntity: !$('#spread-id').length,
			isAccessRestricted: $('#is-access-restricted').val() === 'true',
			canRemoveGroups: $('#can-remove-groups').val() === 'true'
		}
	);
	window.egu.init();

	// toggle boxes for columns
	$('.box-toggle').change(function() {
		$(`#${$(this).data('boxtarget')}`).toggleClass('box');
		enableSave();
	});

	const spreadTools = {
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
		quote: {
			class: Quote,
			inlineToolbar: false,
			config: {
				quotePlaceholder: 'Enter a Quote',
				captionPlaceholder: 'Enter the Author'
			}
		},
		actionLink: {
			class: InlineActionLink,
			inlineToolbar: false
		}
	};

	// editor js instances
	window.column1Editor = new EditorJS(
		{
			holder: 'spread-column-1',
			placeholder: 'Column 1...',
			tools: spreadTools,
			data: window.editorjs_initialize_data.column1
		}
	);
	window.column2Editor = new EditorJS(
		{
			holder: 'spread-column-2',
			placeholder: 'Column 2...',
			tools: spreadTools,
			data: window.editorjs_initialize_data.column2
		}
	);
	window.column3Editor = new EditorJS(
		{
			holder: 'spread-column-3',
			placeholder: 'Column 3...',
			tools: spreadTools,
			data: window.editorjs_initialize_data.column3
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
					entity: 'spread',
					entityID: $('#spread-id').val()
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

const saveHandler = async(stay = true) => {
	const tags = $('.tags').children('li.tag').map(function(index, value) {
		return $(value).data('tagid');
	}).toArray();
	const audiences = $('.audience').children('li.audience-item').map(function(index, value) {
		return $(value).data('audienceid');
	}).toArray();
	const aliases = $('.alias').children('li.alias-item').map(function(index, value) {
		return $(value).data('aliasid');
	}).toArray();
	const fd = new FormData();
	fd.append('title', $('#article-title').text());
	fd.append('idSpreadPhase', $('#phase').val());
	fd.append('idSpreadLayout', $('.layout-option.chosen').data('layoutid'));
	fd.append('column1', JSON.stringify(await window.column1Editor.save()));
	fd.append('column2', JSON.stringify(await window.column2Editor.save()));
	fd.append('column3', JSON.stringify(await window.column3Editor.save()));
	fd.append('column1IsBox', $('#column1IsBox').is(':checked'));
	fd.append('column2IsBox', $('#column2IsBox').is(':checked'));
	fd.append('column3IsBox', $('#column3IsBox').is(':checked'));
	for (const tag of tags) {
		fd.append('tags[]', tag);
	}
	for (const audience of audiences) {
		fd.append('audiences[]', audience);
	}
	for (const alias of aliases) {
		fd.append('aliases[]', alias);
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
					window.location.replace('/spread/' + data.spread.id);
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
					$('#toast-save-error').find('.toast-message').html('Something went wrong when trying to save your spread');
				}
				$('#toast-save-error').addClass('show');
				setTimeout(function() {
					$('#toast-save-error').removeClass('show');
				}, 5000);
			}
		}
	);
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

const enableSave = () => {
	$('.button-save').removeClass('disabled');
};
const disableSave = () => {
	$('.button-save').addClass('disabled');
};
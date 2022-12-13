/* global dragula */
$(document).ready(function() {

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
			dom: 'tipr',
			paging: false,
			searching: true
		}
	);

	$('.table').on('click', '.button-publish', function(event) {
		event.preventDefault();
		$.ajax(
			{
				url: `/api/v1/meta-home/featured-content/set-published/${$(event.currentTarget).data('metaid')}`,
				method: 'PATCH',
				data: {
					published: 'true'
				},
				success: function() {
					$('#toast-save-success').addClass('show');
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
				url: `/api/v1/meta-home/featured-content/set-published/${$(event.currentTarget).data('metaid')}`,
				method: 'PATCH',
				data: {
					published: 'false'
				},
				success: function() {
					$('#toast-save-success').addClass('show');
					const elt = featuredContentPublishedTable.row($(event.currentTarget).parents('tr').first());
					const newElt = featuredContentUnpublishedTable.row.add(elt.data()).draw().node();
					$(newElt).css('background', 'pink!important');
					// elt.find('.action-links a i.fa-eye-slash').toggleClass(['fa-eye', 'fa-eye-slash']);
					elt.remove();
					featuredContentPublishedTable.draw();
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
				url: '/api/v1/meta-home/featured-content/create/one',
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
		$.ajax(
			{
				url: `/api/v1/meta-home/featured-content/update/one/${$('#edit-id').val()}`,
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

	/**
	 * Dragula
	 */
	const containers = [document.getElementById('featured-content-published-table-tbody')];
	const drake = dragula(containers, {
		isContainer: function() {
			return false;
		},
		moves: function() {
			return true;
		},
		accepts: function() {
			return true;
		},
		invalid: function() {
			return false;
		},
		direction: 'vertical',
		copy: false,
		copySortSource: false,
		revertOnSpill: false,
		removeOnSpill: false,
		mirrorContainer: document.getElementById('featured-content-published-table-tbody'),
		ignoreInputTextSelection: true
	});

	drake.on('out', function() {
		const rows = $('#featured-content-published-table-tbody').children();
		const items = [];
		for (let i = 1; i <= rows.length; i++) {
			items.push(
				{
					id: parseInt($(rows[i - 1]).children().first().text()),
					order: i
				}
			);
		}
		$.ajax(
			{
				url: '/api/v1/meta-home/featured-content/update/order',
				method: 'POST',
				data: {
					items
				},
				success: function() {
					$('#toast-save-success').addClass('show');
				},
				error: function(resp) {
					$('#toast-save-error').addClass('show');
				}
			}
		);
	});

});
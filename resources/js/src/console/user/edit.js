$(document).ready(function() {

	$('#permissions-table').DataTable(
		{
			dom: 'tr',
			paging: false,
			searching: true
		}
	);

	$('#permissions-table select.permission-level').change(function() {
		const addClass = $(this).children('option:checked').data('permissionlevelclass');
		$(this).removeClass();
		$(this).addClass(['permission-level', addClass]);
	});

	// save

	$('.button-save').click(function(event) {
		event.preventDefault();
		if ($(event.currentTarget).hasClass('disabled')) {
			return false;
		}
		const permissions = [];
		$('#permissions-table').find('select').each(function() {
			permissions.push(
				{
					permissionID: $(this).data('permissionid'),
					permissionLevelID: $(this).val()
				}
			);

		}).toArray();
		$.ajax(
			{
				url: $('#update-endpoint').val(),
				method: $('#update-method').val(),
				data: {
					admin: $('#isAdmin').length > 0 && $('#isAdmin').is(':checked'),
					permissions
				},
				success: function(data) {
					disableSave();
					if (data.created) {
						window.location.replace('/user/' + data.user.id);
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
	$('.user, .console-modal').on('keyup change paste', ':input, [contenteditable=true]', function() {
		enableSave();
	});

});

const enableSave = () => {
	$('.button-save').removeClass('disabled');
};
const disableSave = () => {
	$('.button-save').addClass('disabled');
};
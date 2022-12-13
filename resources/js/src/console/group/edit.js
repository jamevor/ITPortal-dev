$(document).ready(function() {

	$('#permissions-table select.permission-level').change(function() {
		const addClass = $(this).children('option:checked').data('permissionlevelclass');
		$(this).removeClass();
		$(this).addClass(['permission-level', addClass]);
	});

	$('#add-user-input').easyAutocomplete(
		{
			url: '/api/v1/user/get/all',
			getValue: 'username',
			list: {
				maxNumberOfElements: 5,
				match: {
					enabled: true
				},
				onChooseEvent: () => {
					$('#user').val(JSON.stringify($('#add-user-input').getSelectedItemData()));
				}
			},
			placeholder: 'Search for a user...',
			requestDelay: 200
		}
	);


	$('#add-user-button').click(function(event) {
		event.preventDefault();
		if ($('#user').val().length) {
			renderUser(JSON.parse($('#user').val()));
			$('#add-user-input, #user').val('');
		}
	});

	$('#members-table tbody').on('click', '.button-remove-user', function(event) {
		window.membersTable.row($(event.currentTarget).closest('tr')).remove();
		window.membersTable.draw();
		enableSave();
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

		const users = window.membersTable.columns(0).data().eq(0).unique().toArray();

		$.ajax(
			{
				url: $('#update-endpoint').val(),
				method: $('#update-method').val(),
				data: {
					title: $('.user-name').first().text(),
					isSuper: $('#isSuper').is(':checked'),
					users,
					permissions
				},
				success: function(data) {
					disableSave();
					if (data.created) {
						window.location.replace('/group/' + data.group.id);
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

const renderUser = user => {
	let found = false;
	window.membersTable.rows().every(function() {
		if (this.data()[0] == user.id) {
			found = true;
			return false;
		}
	});
	if (!found) {
		window.membersTable.row.add(
			[
				user.id,
				`${user.givenname} ${user.surname}`,
				user.username,
				'<button class=\'button-remove-user\'><i class=\'fas fa-minus-circle\'></i> Remove</button>'
			]
		);
		window.membersTable.draw();
	}
};
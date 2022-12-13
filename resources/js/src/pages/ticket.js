/* global grecaptcha */
let buttonReopenAddUpdateText;
$(document).ready(function() {

	// get portal journals for ticket
	refreshJournals();

	// store text in button for adding an update
	let buttonAddUpdateText = $('#button-add-update').html();
	buttonReopenAddUpdateText = $('#button-reopen-ticket-submit').html();

	$('#comment').on('keyup change paste', function() {
		if ($('#comment').val().length) {
			$('#button-add-update,#button-reopen-ticket-submit').removeClass('disabled');
		} else {
			$('#button-add-update,#button-reopen-ticket-submit').addClass('disabled');
		}
	});

	// submit the comment
	$('#button-add-update').click(function(event) {
		event.preventDefault();
		if (!$('#button-add-update').hasClass('disabled') && $('#comment').val().length) {
			$('#button-add-update').addClass('disabled');
			grecaptcha.ready(function() {
				grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_add_ticket_update'}).then(function(token) {
					$.ajax(
						{
							url: '/api/v1/cherwell/ticket/journal/create/one',
							method: 'POST',
							data: {
								token,
								ticketID: $('#ticket-id').val(),
								formData: {
									details: $('#comment').val()
								}
							},
							beforeSend: function() {
								$('#button-add-update').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
							},
							success: function() {
								$('#toast-save-success').addClass('show');
								$('#button-add-update').html(buttonAddUpdateText);
								refreshJournals();
								setTimeout(function() {
									$('#toast-save-success').removeClass('show');
								}, 3000);
							},
							error: function(resp) {
								$('#toast-save-error').addClass('show');
								$('#button-add-update').html(buttonAddUpdateText);
							}
						}
					);
				});
			});
		}
	});

	$('#button-reopen-ticket').click(reopenIncidentClicked);
	$('#button-reopen-ticket-submit').click(reopenIncident);
	$('#button-close-ticket').click(closeIncident);

	$('.approval-approve').click(function(event) {
		event.preventDefault();

		let dataStatus = $(this).data("value");
		let dataRecID = $(this).closest(".approval-item").data("approvalrecid");
		let dataPublicID = $(this).closest(".approval-item").data("approvalpublicid");
		const getParent = $(this).closest(".approval-item");
		const formData = {
			status: dataStatus,
			busObRecId: dataRecID,
			busObPublicId: dataPublicID
		};
		grecaptcha.ready(function() {
			grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_add_ticket_update'}).then(function(token) {

				$.ajax(
					{
						url: '/api/v1/cherwell/regApproval/update/one/',
						method: 'POST',
						data: {
							token,
							formData
						},
						beforeSend: function() {
							getParent.find(".approval-item-actions").hide();
							getParent.find(".approval-item-status").html("<i class='fa fa-spinner-third fa-spin></i>");
							getParent.find(".approval-item-status").show()
						},
						success: function() {
							getParent.find(".approval-item-status").text(dataStatus);
							getParent.find(".approval-item-status").addClass(dataStatus.toLowerCase());

						},
						error: function() {
							getParent.find(".approval-item-status").hide();
							getParent.find(".approval-item-actions").show();
							getParent.find(".approval-item-status").text("Waiting");
							getParent.find(".approval-item-status").addClass("waiting");
						}
					}
				);
			})
		})

		});
});

const refreshJournals = () => {
	$.ajax(
		{
			url: `/api/v1/cherwell/ticket/journal-portal/get/all/${$('#ticket-id').val()}`,
			method: 'GET',
			beforeSend: function() {
				clearJournals();
				$('#ticket-sub').append(renderSpinner());
			},
			success: function(data) {
				$('#spinner-journal').fadeOut(function() {
					$(this).remove();
					if (Array.isArray(data.portalJournals)) {
						$('.news-status-updates .badge').text(`${data.portalJournals.length}`);
						for (let journal of data.portalJournals) {
							$('#ticket-sub').append(renderTicketSub(journal));
						}
					}
				});
			},
			error: function(resp) {

			},
			complete: function() {
				resetAddUpdateForm();
			}
		}
	);
};

const clearJournals = () => {
	$('.ticket-sub-item').fadeOut(function() {
		$(this).remove();
	});
};

const renderSpinner = () => {
	return `<div id="spinner-journal" class="cell small-12 text-center">
    <i class="fas fa-3x fa-circle-notch fa-spin" style="color: var(--color-pop);"></i>
  </div>`;
};

const renderTicketSub = journal => {
	let result = `<div class="ticket-sub-item ${journal.fields.find(f => f.name === 'Direction')['value'] === 'Incoming' ? 'incoming' : 'outgoing'}">
    <div class="ticket-sub-item-icon"></div>
    <div class="ticket-sub-item-event-group">
      <p class="ticket-sub-item-event-author"> ${journal.fields.find(f => f.name === 'Direction')['value'] === 'Incoming' ? journal.fields.find(f => f.name === 'IncomingUser')['value'] : journal.fields.find(f => f.name === 'OutgoingUser')['value']}</p>
      <div class="ticket-sub-item-event"><pre>${journal.fields.find(f => f.name === 'Details')['value']}</pre>`;
	if (journal.fields.find(f => f.name === 'OutgoingLink')['value'].length) {
		result += `<ul class="ticket-sub-item-links">
            <li><a href="${journal.fields.find(f => f.name === 'OutgoingLink')['value']}">${journal.fields.find(f => f.name === 'OutgoingLink')['value']}</a></li>
          </ul>`;
	}
	result += `</div>
      <p class="ticket-sub-item-event-date"> ${journal.fields.find(f => f.name === 'LastModifiedDateTime')['value']} </p>
    </div>
    <div class="ticket-sub-item-icon"><i class="fas fa-user fa-lg"></i></div>
  </div>`;
	return result;
};

const resetAddUpdateForm = () => {
	$('#comment').val('');
	$('#button-add-update').removeClass('disabled');
};

const reopenIncidentClicked = event => {
	event.preventDefault();
	$('.reopen-ticket').slideDown();
};

const reopenIncident = event => {
	event.preventDefault();
	if (!$('#button-reopen-ticket-submit').hasClass('disabled') && $('#comment').val().length) {
		$('#button-reopen-ticket-submit').addClass('disabled');
		grecaptcha.ready(function() {
			grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_reopen_incident'}).then(function(token) {
				$.ajax(
					{
						url: '/api/v1/cherwell/ticket/reopen',
						method: 'POST',
						data: {
							token,
							ticketID: $('#ticket-id').val(),
							journal: {
								formData: {
									details: $('#comment').val()
								}
							},
						},
						beforeSend: function() {
							$('#button-reopen-ticket-submit').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
						},
						success: function() {
							window.location.reload();
						},
						error: function(resp) {
							$('#toast-save-error').addClass('show');
							$('#button-reopen-ticket-submit').html(buttonReopenAddUpdateText);
						}
					}
				);
			});
		});
	}
};

const closeIncident = event => {
	if (!$('#button-close-ticket').hasClass('disabled')) {
		$('#button-close-ticket').addClass('disabled');
		event.preventDefault();
		grecaptcha.ready(function() {
			grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_close_incident'}).then(function(token) {
				$.ajax(
					{
						url: '/api/v1/cherwell/ticket/close',
						method: 'POST',
						data: {
							token,
							ticketID: $('#ticket-id').val()
						},
						beforeSend: function() {
							$('#button-close-ticket').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
						},
						success: function() {
							window.location.reload();
						},
						error: function(resp) {
							$('#toast-save-error').addClass('show');
						}
					}
				);
			});
		});
	}
};

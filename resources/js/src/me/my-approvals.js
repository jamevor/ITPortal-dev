/* global TicketCard, spinner */
$(document).ready(function() {

	$.ajax(
		{
			url: '/api/v1/cherwell/me/regApproval/get/open',
			method: 'GET',
			beforeSend: function() {
				$('#approvals-open').append(spinner());
			},
			success: function(data) {
				$('#userOpenApprovalsCount').html(`${data.length}`);
				$('#approvals-open').children('.spinner').remove();
				if (!(data && data.length)) {
					$('#approvals-open').append(`<div class="cell medium-12 my-apps empty">
              <p>You don't have any waiting approval requests</p>
            </div>`);
				} else {
					for (let datum of data) {
						$('#approvals-open').append(
							new ApprovalCard(
								datum.busObPublicId,
								datum.fields.find(elt => elt.name === 'ParentPublicID').value,
								datum.fields.find(elt => elt.name === 'StudentName').value,
								datum.fields.find(elt => elt.name === 'Status').value,
								datum.fields.find(elt => elt.name === 'Type').value,
								datum.fields.find(elt => elt.name === 'Course').value,
								datum.fields.find(elt => elt.name === 'Relation').value,
							).render()
						);
					}
				}
			},
			error: function(resp) {
				console.error(resp);
			}
		}
	);


	$.ajax(
		{
			url: '/api/v1/cherwell/me/regApproval/get/closed',
			method: 'GET',
			beforeSend: function() {
				$('#approvals-history').append(spinner());
			},
			success: function(data) {
				$('#approvals-history').children('.spinner').remove();
				if (!(data && data.length)) {
					$('#approvals-history').append(`<div class="cell medium-12 my-apps empty">
            <p>We couldn't find anything in your approvals history</p>
          </div>`);
				} else {
					for (let datum of data) {
						$('#approvals-history').append(
							new ApprovalCard(
								datum.busObPublicId,
								datum.fields.find(elt => elt.name === 'ParentPublicID').value,
								datum.fields.find(elt => elt.name === 'StudentName').value,
								datum.fields.find(elt => elt.name === 'Status').value,
								datum.fields.find(elt => elt.name === 'Type').value,
								datum.fields.find(elt => elt.name === 'Course').value,
								datum.fields.find(elt => elt.name === 'Relation').value,
							).render()
						);
					}
				}
			},
			error: function(resp) {
				console.error(resp);
			}
		}
	);

});
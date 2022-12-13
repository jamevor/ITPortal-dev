/* global TicketCard, spinner */
$(document).ready(function() {

	$.ajax(
		{
			url: '/api/v1/cherwell/me/ticket/get/open',
			method: 'GET',
			beforeSend: function() {
				$('#tickets-open').append(spinner());
			},
			success: function(data) {
				$('#userOpenTicketCount').html(`${data.length}`);
				$('#tickets-open').children('.spinner').remove();
				if (!(data && data.length)) {
					$('#tickets-open').append(`<div class="cell medium-12 my-apps empty">
              <p>You don't have any open tickets</p>
              <a href="/Request" class="button"><i class="far fa-question-circle"></i> Open a Ticket</a>
            </div>`);
				} else {
					for (let datum of data) {
						$('#tickets-open').append(
							new TicketCard(
								datum.busObPublicId,
								datum.fields.find(elt => elt.name === 'Summary').value,
								datum.fields.find(elt => elt.name === 'Status').value,
								datum.fields.find(elt => elt.name === 'CreatedDateTime').value,
								datum.fields.find(elt => elt.name === 'LastModifiedDateTime').value
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
			url: '/api/v1/cherwell/me/ticket/get/subscribed',
			method: 'GET',
			beforeSend: function() {
				$('#tickets-subscribed').append(spinner());
			},
			success: function(data) {
				$('#tickets-subscribed').children('.spinner').remove();
				if (!(data && data.length)) {
					$('#tickets-subscribed').append(`<div class="cell medium-12 my-apps empty">
            <p>You are not subscribed to any open tickets</p>
          </div>`);
				} else {
					for (let datum of data) {
						$('#tickets-subscribed').append(
							new TicketCard(
								datum.busObPublicId,
								datum.fields.find(elt => elt.name === 'Summary').value,
								datum.fields.find(elt => elt.name === 'Status').value,
								datum.fields.find(elt => elt.name === 'CreatedDateTime').value,
								datum.fields.find(elt => elt.name === 'LastModifiedDateTime').value
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
			url: '/api/v1/cherwell/me/ticket/get/closed',
			method: 'GET',
			beforeSend: function() {
				$('#tickets-history').append(spinner());
			},
			success: function(data) {
				$('#tickets-history').children('.spinner').remove();
				if (!(data && data.length)) {
					$('#tickets-history').append(`<div class="cell medium-12 my-apps empty">
            <p>We couldn't find anything in your ticket history</p>
          </div>`);
				} else {
					for (let datum of data) {
						$('#tickets-history').append(
							new TicketCard(
								datum.busObPublicId,
								datum.fields.find(elt => elt.name === 'Summary').value,
								datum.fields.find(elt => elt.name === 'Status').value,
								datum.fields.find(elt => elt.name === 'CreatedDateTime').value,
								datum.fields.find(elt => elt.name === 'LastModifiedDateTime').value
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
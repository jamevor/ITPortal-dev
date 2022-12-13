$(document).ready(function() {
	const container = '#widget-myTickets,#widget-myTickets--dashboard';
	$.ajax(
		{
			url: '/api/v1/cherwell/me/ticket/get/open',
			method: 'GET',
			success: function(tickets) {
				renderTickets(tickets);
			},
			error: function(resp) {
				console.error({resp});
			}
		}
	);

	function getStatusIcon(status) {
		const statusIcons = {
			'New': 'fa-plus-circle',
			'Assigned': 'fa-sync',
			'In Progress': 'fa-sync',
			'Pending': 'fa-clock',
			'Resolved': 'fa-check-circle',
			'Reopened': 'fa-redo',
			'Closed': 'fa-check-circle',
		};
		return statusIcons[status];
	}

	function renderTickets(tickets) {
		let result = '<div class="ticket-wrapper" data-simplebar>';
		for (const ticket of tickets) {
			result += `<a class="ticket-item" href="/Ticket/${ticket.busObPublicId}">
				<div class="ticket-item-label">
						<div class="ticket-item-id">${ticket.busObPublicId}</div>
						<div class="ticket-item-title">${ticket.fields.find(elt => elt.name === 'Summary').value}</div>
				</div>

				<div class="ticket-item-status">
						<div class="ticket-item-status-icon"><i class="far ${getStatusIcon(ticket.fields.find(elt => elt.name === 'Status').value)}"></i></div>
						<div class="ticket-item-status-label">${ticket.fields.find(elt => elt.name === 'Status').value}</div>
				</div>
			</a>`;
		}
		result += '</div>';
		$(container).append(result);
	}
});
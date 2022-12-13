/* global moment */
/* exported TicketCard */
class TicketCard {
	constructor(publicID, summary, status, createdDateTime, updatedDateTime) {
		this.publicID = publicID;
		this.summary = summary;
		this.status = status;
		this.createdDateTime = createdDateTime;
		this.updatedDateTime = updatedDateTime;
		this.statusIcons = {
			'New': 'fa-plus-circle',
			'Assigned': 'fa-sync',
			'In Progress': 'fa-sync',
			'Pending': 'fa-clock',
			'Resolved': 'fa-check-circle',
			'Reopened': 'fa-redo',
			'Closed': 'fa-check-circle',
		};
	}
	render() {
		return `<a class="news-card ticket-card cell small-12 medium-6" href="/Ticket/${this.publicID}">
      <div class="news-card-details ticket-card-details">
        <div class="grid-x align-middle">
          <div class="cell show-for-large large-2 text-center news-card-icon"><i class="far fa-2x fa-ticket" style="color: var(--color-body-text)"></i></div>
          <div class="cell small-9 large-8">
            <p class="ticket-card-id">${this.publicID}</p>
            <h3 class="news-card-title ticket-card-title">${this.summary}</h3>
            <div class="grid-x align-middle">
              <div class="cell small-6 news-card-date ticket-card-date"><strong>Created:</strong> ${moment(this.createdDateTime).format('ll')}</span></div>
              <div class="cell small-6 news-card-date ticket-card-date"><strong>Last Updated:</strong> ${moment(this.updatedDateTime).format('ll')}</span></div>
            </div>
          </div>
          <div class="cell small-3 large-2 align-self-stretch align-middle news-card-metrics ticket-card-metrics">
            <div class="cell auto news-card-status ticket-card-status">
              <span class="news-card-badge ticket-card-badge"><i class="fas fa-2x ${this.statusIcons[this.status]}" style="color: var(--color-body-text)"></i></span>
              <span class="hide-for-small-only">${this.status}</span>
            </div>
          </div>
        </div>
      </div>
    </a>`;
	}
}
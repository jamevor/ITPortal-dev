/* global moment */
/* exported ApprovalCard */
class ApprovalCard{
	constructor(publicID, parentPublicID, studentName, status, type, course, relation) {
    this.publicID = publicID;
    this.parentPublicID = parentPublicID;
    this.studentName = studentName;
    this.status = status;
    this.type = type;
    this.course = course;
    this.relation = relation;

	}
	render() {
		return `<a class="approval-card cell small-12 medium-6" href="/Ticket/${this.parentPublicID}">
        <div class="approval-item" data-approvalPublicID="${this.publicID}">
        <div class="approval-item-relation">
        ${this.relation}
        </div>
        <div class="approval-content">
          <div class="approval-item-approver">
            <div class="approval-item-approver-course">${this.course}</div>
            <div class="approval-item-approver-student">${this.studentName}</div>
          </div>
          <div class="approval-item-type">${this.type}</div>
          
        </div>
          <div class="approval-item-status ${this.status.toLowerCase()}">${this.status}</div>
      </div>
    </a>`;
	}
}
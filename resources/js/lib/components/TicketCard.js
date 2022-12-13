"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* global moment */

/* exported TicketCard */
var TicketCard =
/*#__PURE__*/
function () {
  function TicketCard(publicID, summary, status, createdDateTime, updatedDateTime) {
    _classCallCheck(this, TicketCard);

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
      'Closed': 'fa-check-circle'
    };
  }

  _createClass(TicketCard, [{
    key: "render",
    value: function render() {
      return "<a class=\"news-card ticket-card cell small-12 medium-6\" href=\"/Ticket/".concat(this.publicID, "\">\n      <div class=\"news-card-details ticket-card-details\">\n        <div class=\"grid-x align-middle\">\n          <div class=\"cell show-for-large large-2 text-center news-card-icon\"><i class=\"far fa-2x fa-ticket\" style=\"color: var(--color-body-text)\"></i></div>\n          <div class=\"cell small-9 large-8\">\n            <p class=\"ticket-card-id\">").concat(this.publicID, "</p>\n            <h3 class=\"news-card-title ticket-card-title\">").concat(this.summary, "</h3>\n            <div class=\"grid-x align-middle\">\n              <div class=\"cell small-6 news-card-date ticket-card-date\"><strong>Created:</strong> ").concat(moment(this.createdDateTime).format('ll'), "</span></div>\n              <div class=\"cell small-6 news-card-date ticket-card-date\"><strong>Last Updated:</strong> ").concat(moment(this.updatedDateTime).format('ll'), "</span></div>\n            </div>\n          </div>\n          <div class=\"cell small-3 large-2 align-self-stretch align-middle news-card-metrics ticket-card-metrics\">\n            <div class=\"cell auto news-card-status ticket-card-status\">\n              <span class=\"news-card-badge ticket-card-badge\"><i class=\"fas fa-2x ").concat(this.statusIcons[this.status], "\" style=\"color: var(--color-body-text)\"></i></span>\n              <span class=\"hide-for-small-only\">").concat(this.status, "</span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </a>");
    }
  }]);

  return TicketCard;
}();
"use strict";$(document).ready(function(){refreshJournals();var a=$("#button-add-update").html();$("#comment").on("keyup change paste",function(){$("#comment").val().length?$("#button-add-update").removeClass("disabled"):$("#button-add-update").addClass("disabled")}),$("#button-add-update").click(function(b){b.preventDefault(),!$("#button-add-update").hasClass("disabled")&&$("#comment").val().length&&($("#button-add-update").addClass("disabled"),grecaptcha.ready(function(){grecaptcha.execute("6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD",{action:"button_add_ticket_update"}).then(function(b){$.ajax({url:"/api/v1/cherwell/ticket/journal/create/one",method:"POST",data:{token:b,ticketID:$("#ticket-id").val(),formData:{details:$("#comment").val()}},beforeSend:function(){$("#button-add-update").html("<i class='fas fa-circle-notch fa-spin'></i>")},success:function(){$("#toast-save-success").addClass("show"),$("#button-add-update").html(a),refreshJournals(),setTimeout(function(){$("#toast-save-success").removeClass("show")},3e3)},error:function(){$("#toast-save-error").addClass("show"),$("#button-add-update").html(a)}})})}))})});var refreshJournals=function(){$.ajax({url:"/api/v1/cherwell/ticket/journal-portal/get/all/".concat($("#ticket-id").val()),method:"GET",beforeSend:function(){clearJournals(),$("#ticket-sub").append(renderSpinner())},success:function(a){$("#spinner-journal").fadeOut(function(){if($(this).remove(),Array.isArray(a.portalJournals)){$(".news-status-updates .badge").text("".concat(a.portalJournals.length));var b=!0,c=!1,d=void 0;try{for(var e,f,g=a.portalJournals[Symbol.iterator]();!(b=(e=g.next()).done);b=!0)f=e.value,$("#ticket-sub").append(renderTicketSub(f))}catch(a){c=!0,d=a}finally{try{b||null==g.return||g.return()}finally{if(c)throw d}}}})},error:function(){},complete:function(){resetAddUpdateForm()}})},clearJournals=function(){$(".ticket-sub-item").fadeOut(function(){$(this).remove()})},renderSpinner=function(){return"<div id=\"spinner-journal\" class=\"cell small-12 text-center\">\n    <i class=\"fas fa-3x fa-circle-notch fa-spin\" style=\"color: var(--color-pop);\"></i>\n  </div>"},renderTicketSub=function(a){var b="<div class=\"ticket-sub-item ".concat("Incoming"===a.fields.find(function(a){return"Direction"===a.name}).value?"incoming":"outgoing","\">\n    <div class=\"ticket-sub-item-icon\"></div>\n    <div class=\"ticket-sub-item-event-group\">\n      <p class=\"ticket-sub-item-event-author\"> ").concat("Incoming"===a.fields.find(function(a){return"Direction"===a.name}).value?a.fields.find(function(a){return"IncomingUser"===a.name}).value:a.fields.find(function(a){return"OutgoingUser"===a.name}).value,"</p>\n      <div class=\"ticket-sub-item-event\"><pre>").concat(a.fields.find(function(a){return"Details"===a.name}).value,"</pre>");return a.fields.find(function(a){return"OutgoingLink"===a.name}).value.length&&(b+="<ul class=\"ticket-sub-item-links\">\n            <li><a href=\"".concat(a.fields.find(function(a){return"OutgoingLink"===a.name}).value,"\">").concat(a.fields.find(function(a){return"OutgoingLink"===a.name}).value,"</a></li>\n          </ul>")),b+="</div>\n      <p class=\"ticket-sub-item-event-date\"> ".concat(a.fields.find(function(a){return"LastModifiedDateTime"===a.name}).value," </p>\n    </div>\n    <div class=\"ticket-sub-item-icon\"><i class=\"fas fa-user fa-lg\"></i></div>\n  </div>"),b},resetAddUpdateForm=function(){$("#comment").val(""),$("#button-add-update").removeClass("disabled")};
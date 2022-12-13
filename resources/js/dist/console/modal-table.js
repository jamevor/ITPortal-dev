"use strict";function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(a){if(Symbol.iterator in Object(a)||"[object Arguments]"===Object.prototype.toString.call(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}}var _phasesWithRelatedItems,sectionFiltersInitialized=!1,tableInitialized=!1;$(document).ready(function(){function a(a){for(var b in a)$("#section-filter-".concat(b)).length?$("label[for=section-filter-".concat(b,"]")).find(".filter-count").first().html("".concat(a[b].count)):$(".section-filters").append("<input type=\"checkbox\" data-filtercolumn=\"phase\" id=\"section-filter-".concat(b,"\" name=\"section-filter-").concat(b,"\" value=\"").concat(b,"\"></input>\n\t\t\t\t<label class=\"cell medium-3\" for=\"section-filter-").concat(b,"\">\n\t\t\t\t\t<div class=\"filter-count\">").concat(a[b].count,"</div>\n\t\t\t\t\t<div class=\"filter-label\">").concat(b,"</div>\n\t\t\t\t</label>"));sectionFiltersInitialized||new DTFilterState(c,null,null,$(".section-filters").children(":checkbox").map(function(){return this.id})),sectionFiltersInitialized=!0}function b(){c.ajax.reload().draw()}var c=$("#modal-table").DataTable({ajax:{url:$("#ajax-source").val(),dataSrc:function(a){_phasesWithRelatedItems=a.phasesWithRelatedItems;var b=[],c=function(c){b.push.apply(b,_toConsumableArray(a.phasesWithRelatedItems[c].items.map(function(a){return a.phase=c,a})))};for(var d in a.phasesWithRelatedItems)c(d);return b}},stateSave:!1,dom:"tipr",pageLength:25,searching:!0,order:[[0,window.modalTable_defaultSortOrder]],initComplete:function(){a(_phasesWithRelatedItems),tableInitialized=!0},drawCallback:function(){tableInitialized&&a(_phasesWithRelatedItems)},columns:[{data:"id"},{data:"title"},{name:"phase",data:"phase",searchable:!0,visible:!1},{className:"action-links",data:function(a){return a},render:function(a){return"<a class=\"console-edit\" href=\"#\" data-d='".concat(HTMLReplace(JSON.stringify(a)),"'><i class=\"far fa-fw fa-edit\"></i> </a>")}}]});$(".filter-find").keyup(function(){c.search($(this).val()).draw()}),$("#button-console-add").click(function(a){a.preventDefault(),$("#modal-console-add").find(":input").not($("#endpoint, #method")).val(""),$("#modal-console-add").foundation("open")}),$(".console-add-save").click(function(a){a.preventDefault();var c={};$("#modal-console-add").find(":input").not("button").not($("#endpoint, #method")).each(function(a,b){c[$(b).attr("id")]=$(b).val()}),$.ajax({url:$("#endpoint").val(),method:$("#method").val(),data:c,success:function(){$("#toast-save-success").addClass("show"),$("#modal-console-add").foundation("close"),b()},error:function(){$("#toast-save-error").addClass("show")}})}),$("#modal-table").on("click",".console-edit",function(a){a.preventDefault();var b=$(a.currentTarget).data("d");$("#modal-console-edit").find(":input").not("button").not($("#edit-endpoint, #edit-method")).each(function(a,c){$(c).val(b[$(c).attr("id").split("edit")[1].substring(1)])}),$("#modal-console-edit").foundation("open")}),$(".console-edit-save").click(function(a){a.preventDefault();var c={};$("#modal-console-edit").find(":input").not("button").not(":hidden").each(function(a,b){c[$(b).attr("id").split("edit")[1].substring(1)]=$(b).val()}),$.ajax({url:"".concat($("#edit-endpoint").val(),"/").concat($("#edit-id").val()),method:$("#edit-method").val(),data:c,success:function(){$("#toast-save-success").addClass("show"),$("#modal-console-edit").foundation("close"),b()},error:function(){$("#toast-save-error").addClass("show")}})})});
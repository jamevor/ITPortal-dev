"use strict";function asyncGeneratorStep(a,b,c,d,e,f,g){try{var h=a[f](g),i=h.value}catch(a){return void c(a)}h.done?b(i):Promise.resolve(i).then(d,e)}function _asyncToGenerator(a){return function(){var b=this,c=arguments;return new Promise(function(d,e){function f(a){asyncGeneratorStep(h,d,e,f,g,"next",a)}function g(a){asyncGeneratorStep(h,d,e,f,g,"throw",a)}var h=a.apply(b,c);f(void 0)})}}$(document).ready(function(){var a=new EditorJS({holder:"descriptionLong",placeholder:"Begin your description here...",minHeight:1,tools:{paragraph:{inlineToolbar:["bold","italic"]},header:{class:Header,config:{minHeader:3,maxHeader:6,defaultLevel:3}},list:{class:List,inlineToolbar:["bold","italic","inlineCode","outdent","indent","styleToggle"]},inlineCode:{class:InlineCode},indent:{class:ListIndent},outdent:{class:ListOutdent},styleToggle:{class:ListStyleToggle},image:{class:ImageTool,config:{field:"fileupload",endpoints:{byFile:"/api/v1/file-upload/create/one",byUrl:"/api/v1/file-upload/create/one"},additionalRequestData:{via:"editorjs"}}}},data:window.editorjs_initialize_data.descriptionLong});$(".article-heading").on("keyup change paste",function(){$(".breadcrumbs li:last-child > a").text($(".article-heading").text())}),$("#icon").change(function(){$("#portfolio-icon").removeClass(),$("#portfolio-icon").addClass(["fas","fa-4x",$("#icon").val()||"fa-globe"])}),$("#actionTitle").easyAutocomplete({url:"/api/v1/action/get/all",getValue:"title",list:{maxNumberOfElements:2,match:{enabled:!0},onChooseEvent:function(){$("#action").val(JSON.stringify($("#actionTitle").getSelectedItemData()))},showAnimation:{type:"slide",time:300,callback:function(){}},hideAnimation:{type:"slide",time:300,callback:function(){}}},template:{type:"custom",method:function(a,b){return actionToDOM(b,!1)}},placeholder:"Search for an action...",requestDelay:200}),$("#add-action-button").click(function(a){a.preventDefault(),$("#action").val().length&&(renderAction(JSON.parse($("#action").val())),$("#action, #actionTitle").val(""))}),$("#link-cards-action").on("click",".remove-action-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$("#add-tag-input").easyAutocomplete({url:"/api/v1/tag/get/all",getValue:"title",list:{maxNumberOfElements:2,match:{enabled:!0},onChooseEvent:function(){$("#tag").val(JSON.stringify($("#add-tag-input").getSelectedItemData()))}},requestDelay:200}),$("#add-tag-input").on("keyup",function(a){a.preventDefault(),13==a.which&&$("#add-tag-input").val().length&&(renderTag(JSON.parse($("#tag").val())),$("#add-tag-input, #tag").val(""))}),$(".tags").on("click",".remove-tag-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$("#add-alias-input").easyAutocomplete({url:"/api/v1/alias/get/all",getValue:"title",list:{maxNumberOfElements:2,match:{enabled:!0},onChooseEvent:function(){$("#alias").val(JSON.stringify($("#add-alias-input").getSelectedItemData()))}},requestDelay:200}),$("#add-alias-input").on("keyup",function(a){a.preventDefault(),13==a.which&&$("#add-alias-input").val().length&&(renderAlias(JSON.parse($("#alias").val())),$("#add-alias-input, #alias").val(""))}),$(".alias").on("click",".remove-alias-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$(".card-list").on("click",".remove-catalog-item-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$("#add-service-input").easyAutocomplete({url:"/api/v1/service/get/all",getValue:"title",list:{maxNumberOfElements:3,match:{enabled:!0},onChooseEvent:function(){$("#service").val(JSON.stringify($("#add-service-input").getSelectedItemData()))}},placeholder:"Search for a service...",requestDelay:200}),$("#add-service-input").on("keyup",function(a){a.preventDefault(),13==a.which&&$("#add-service-input").val().length&&(renderCatalogItem(JSON.parse($("#service").val()),"service"),$("#add-service-input, #service").val(""))}),$("#add-service-button").click(function(a){a.preventDefault(),$("#service").val().length&&(renderCatalogItem(JSON.parse($("#service").val()),"service"),$("#add-service-input, #service").val(""))}),$(".button-save").click(function(){var b=_asyncToGenerator(regeneratorRuntime.mark(function b(c){var d,e,f,g;return regeneratorRuntime.wrap(function(b){for(;;)switch(b.prev=b.next){case 0:if(c.preventDefault(),!$(c.currentTarget).hasClass("disabled")){b.next=3;break}return b.abrupt("return",!1);case 3:return d=$("#link-cards-action").children("li").map(function(a,b){return $(b).data("actionid")}).toArray(),e=$(".tags").children("li.tag").map(function(a,b){return $(b).data("tagid")}).toArray(),f=$(".alias").children("li.alias-item").map(function(a,b){return $(b).data("aliasid")}).toArray(),g=$(".service-card-item").map(function(a,b){return $(b).data("serviceid")}).toArray(),b.t0=$,b.t1=$("#update-endpoint").val(),b.t2=$("#update-method").val(),b.t3=$("#article-title").text(),b.t4=$("#article-summary").text(),b.next=14,a.save();case 14:b.t5=b.sent,b.t6=$("#phase").val(),b.t7=$("#status").val(),b.t8=$("#icon").val(),b.t9=$("#color").val().replace("#"," ").trim(),b.t10=d,b.t11=e,b.t12=f,b.t13=g,b.t14={title:b.t3,descriptionShort:b.t4,descriptionLong:b.t5,idCatalogPhase:b.t6,idCatalogStatus:b.t7,icon:b.t8,color:b.t9,actions:b.t10,tags:b.t11,aliases:b.t12,services:b.t13},b.t15=function(a){disableSave(),a.created?window.location.replace("/portfolio/"+a.portfolio.id):$("#toast-save-success").addClass("show")},b.t16=function(){$("#toast-save-error").addClass("show")},b.t17={url:b.t1,method:b.t2,data:b.t14,success:b.t15,error:b.t16},b.t0.ajax.call(b.t0,b.t17);case 28:case"end":return b.stop();}},b)}));return function(){return b.apply(this,arguments)}}()),$(".article, .console-modal").on("keyup change paste",":input, [contenteditable=true]",function(){$("#article-title").text().length?enableSave():disableSave()}),$(".article").on("click",".ce-settings__plugin-zone *, .ce-settings__default-zone *",function(){$("#article-title").text().length?enableSave():disableSave()}),$("#button-generate-preview").click(function(a){a.preventDefault(),$.ajax({url:"/api/v1/preview/create/one",method:"POST",data:{entity:"portfolio",entityID:$("#portfolio-id").val()},success:function(a){$("#preview-link").val(a.link),$("#modal-preview").foundation("open")},error:function(a){console.error(a)}})})});var renderAction=function(a){var b=!1,c=!1;$("#link-cards-action").children().each(function(){return $(this).data("actionid")==a.id?(c=!0,!1):$(this).text()>a.title?(b=!0,$(this).before(actionToDOM(a,!1,!0)),!1):void 0}),b||c||$("#link-cards-action").append(actionToDOM(a,!1,!0))},actionToDOM=function(a,b,c){return b=null==b||b,c=null!=c&&c,"<li data-actionid=\"".concat(a.id,"\"><a class=\"").concat(a.actionType.title,"\" target=\"_self\" href=\"").concat(b?a.link:"#","\">").concat(a.title).concat(c?"<button class='remove-action-button'><i class='fas fa-times-circle'></i></button>":"","</a></li>")},renderTag=function(a){var b=!1,c=!1;$(".tags").children(".tag").each(function(){return $(this).data("tagid")==a.id?(c=!0,!1):$(this).children("a").text()>a.title?(b=!0,$(this).before(tagToDOM(a)),!1):void 0}),b||c||($(".tags").children(".tag").length?$(".tags").children(".tag").last().before(tagToDOM(a)):$(".tags").children().last().before(tagToDOM(a)))},tagToDOM=function(a){return"<li data-tagid=\"".concat(a.id,"\" class=\"tag\"><a href=\"#\">").concat(a.title,"<button class='remove-tag-button'><i class='fas fa-times-circle'></i></button></a></li>")},renderAlias=function(a){var b=!1,c=!1;$(".alias").children(".alias-item").each(function(){return $(this).data("aliasid")==a.id?(c=!0,!1):$(this).children("a").text()>a.title?(b=!0,$(this).before(aliasToDOM(a)),!1):void 0}),b||c||($(".alias").children(".alias-item").length?$(".alias").children(".alias-item").last().before(aliasToDOM(a)):$(".alias").children().last().before(aliasToDOM(a)))},aliasToDOM=function(a){return"<li data-aliasid=\"".concat(a.id,"\" class=\"alias-item\"><a href=\"#\">").concat(a.title,"<button class='remove-alias-button'><i class='fas fa-times-circle'></i></button></a></li>")},renderCatalogItem=function(a,b){var c=!1,d=!1;$(".".concat(b,"-card-item")).each(function(){return $(this).data("".concat(b,"id"))==a.id?(d=!0,!1):$(this).find("h3").first().text()>a.title?(c=!0,$(this).before(catalogItemToDOM(a,b,!0,$(this).hasClass("compact"))),!1):void 0}),c||d||($(".".concat(b,"-card-item")).length?$(".".concat(b,"-card-item")).last().after(catalogItemToDOM(a,b,!0,$(".".concat(b,"-card-item")).last().hasClass("compact"))):$(".".concat(b,"-cards-wrapper")).append(catalogItemToDOM(a,b,!0,!0)))},catalogItemToDOM=function(a,b,c,d){return c=null!=c&&c,"<li data-".concat(b,"id=\"").concat(a.id,"\" class=\"cell ").concat(b,"-card-item").concat(d?" compact":"","\">\n    <a class=\"service-card\" href=\"#\">\n      <i class=\"service-card-icon fas ").concat(a.icon,"\"></i>\n      <h3 class=\"service-card-title\">").concat(a.title,"</h3>\n      ").concat(c?"<button class='remove-catalog-item-button'><i class='fas fa-times-circle'></i></button>":"","\n    </a>\n  </li>")},enableSave=function(){$(".button-save").removeClass("disabled")},disableSave=function(){$(".button-save").addClass("disabled")};
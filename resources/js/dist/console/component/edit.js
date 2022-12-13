"use strict";function asyncGeneratorStep(a,b,c,d,e,f,g){try{var h=a[f](g),i=h.value}catch(a){return void c(a)}h.done?b(i):Promise.resolve(i).then(d,e)}function _asyncToGenerator(a){return function(){var b=this,c=arguments;return new Promise(function(d,e){function f(a){asyncGeneratorStep(h,d,e,f,g,"next",a)}function g(a){asyncGeneratorStep(h,d,e,f,g,"throw",a)}var h=a.apply(b,c);f(void 0)})}}$(document).ready(function(){var a=new EditorJS({holder:"descriptionLong",placeholder:"Begin your description here...",minHeight:1,tools:{paragraph:{inlineToolbar:["bold","italic"]},header:{class:Header,config:{minHeader:3,maxHeader:6,defaultLevel:3}},list:{class:List,inlineToolbar:["bold","italic","inlineCode","outdent","indent","styleToggle"]},inlineCode:{class:InlineCode},indent:{class:ListIndent},outdent:{class:ListOutdent},styleToggle:{class:ListStyleToggle},image:{class:ImageTool,config:{field:"fileupload",endpoints:{byFile:"/api/v1/file-upload/create/one",byUrl:"/api/v1/file-upload/create/one"},additionalRequestData:{via:"editorjs"}}}},data:window.editorjs_initialize_data.descriptionLong});$(".article-heading").on("keyup change paste",function(){$(".breadcrumbs li:last-child > a").text($(".article-heading").text())}),$("#icon").change(function(){$("#component-icon").removeClass(),$("#component-icon").addClass(["fas","fa-4x",$("#icon").val()||"fa-globe"])}),$("#actionTitle").easyAutocomplete({url:"/api/v1/action/get/all",getValue:"title",list:{maxNumberOfElements:2,match:{enabled:!0},onSelectItemEvent:function(){$("#action").val(JSON.stringify($("#actionTitle").getSelectedItemData()))},showAnimation:{type:"slide",time:300,callback:function(){}},hideAnimation:{type:"slide",time:300,callback:function(){}}},template:{type:"custom",method:function(a,b){return actionToDOM(b,!1)}},placeholder:"Search for an action...",requestDelay:200}),$("#add-action-button").click(function(a){a.preventDefault(),$("#action").val().length&&(renderAction(JSON.parse($("#action").val())),$("#action, #actionTitle").val(""))}),$("#link-cards-action").on("click",".remove-action-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$("#add-tag-input").easyAutocomplete({url:"/api/v1/tag/get/all",getValue:"title",list:{maxNumberOfElements:2,match:{enabled:!0},onSelectItemEvent:function(){$("#tag").val(JSON.stringify($("#add-tag-input").getSelectedItemData()))}},requestDelay:200}),$("#add-tag-input").on("keyup",function(a){a.preventDefault(),13==a.which&&$("#add-tag-input").val().length&&(renderTag(JSON.parse($("#tag").val())),$("#add-tag-input, #tag").val(""))}),$(".tags").on("click",".remove-tag-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$("#add-audience-input").easyAutocomplete({url:"/api/v1/audience/get/all",getValue:"title",list:{maxNumberOfElements:2,match:{enabled:!0},onSelectItemEvent:function(){$("#audience").val(JSON.stringify($("#add-audience-input").getSelectedItemData()))}},requestDelay:200}),$("#add-audience-input").on("keyup",function(a){a.preventDefault(),13==a.which&&$("#add-audience-input").val().length&&(renderAudience(JSON.parse($("#audience").val())),$("#add-audience-input, #audience").val(""))}),$(".audience").on("click",".remove-audience-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$("#add-alias-input").easyAutocomplete({url:"/api/v1/alias/get/all",getValue:"title",list:{maxNumberOfElements:2,match:{enabled:!0},onSelectItemEvent:function(){$("#alias").val(JSON.stringify($("#add-alias-input").getSelectedItemData()))}},requestDelay:200}),$("#add-alias-input").on("keyup",function(a){a.preventDefault(),13==a.which&&$("#add-alias-input").val().length&&(renderAlias(JSON.parse($("#alias").val())),$("#add-alias-input, #alias").val(""))}),$(".alias").on("click",".remove-alias-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$("#relationshipsTab .card-list").on("click",".remove-catalog-item-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),$("#relate-service-input-group").slideDown(),enableSave()}),$("#relate-service-input").easyAutocomplete({url:"/api/v1/service/get/all",getValue:"title",list:{maxNumberOfElements:3,match:{enabled:!0},onSelectItemEvent:function(){$("#service").val(JSON.stringify($("#relate-service-input").getSelectedItemData()))}},placeholder:"Search for a service...",requestDelay:200}),$("#relate-service-input").on("keyup",function(a){a.preventDefault(),13==a.which&&$("#relate-service-input").val().length&&(renderParentService(JSON.parse($("#service").val()),"service"),$("#relate-service-input, #service").val(""))}),$("#relate-service-button").click(function(a){a.preventDefault(),$("#service").val().length&&(renderParentService(JSON.parse($("#service").val()),"service"),$("#relate-service-input, #service").val(""))}),$(".card-list").on("click",".remove-article-card-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$("#add-article-input").easyAutocomplete({url:"/api/v1/article/get/all",getValue:"title",list:{maxNumberOfElements:3,match:{enabled:!0},onSelectItemEvent:function(){$("#article").val(JSON.stringify($("#add-article-input").getSelectedItemData()))}},placeholder:"Search for an article...",requestDelay:200}),$("#add-article-input").on("keyup",function(a){a.preventDefault(),13==a.which&&$("#add-article-input").val().length&&(renderArticleItem(JSON.parse($("#article").val()),"article"),$("#add-article-input, #article").val(""))}),$("#add-article-button").click(function(a){a.preventDefault(),$("#article").val().length&&(renderArticleItem(JSON.parse($("#article").val()),"article"),$("#add-article-input, #article").val(""))}),$(".button-save").click(function(){var b=_asyncToGenerator(regeneratorRuntime.mark(function b(c){var d,e,f,g,h,i;return regeneratorRuntime.wrap(function(b){for(;;)switch(b.prev=b.next){case 0:if(c.preventDefault(),!$(c.currentTarget).hasClass("disabled")){b.next=3;break}return b.abrupt("return",!1);case 3:return d=$("#link-cards-action").children("li").map(function(a,b){return $(b).data("actionid")}).toArray(),e=$(".tags").children("li.tag").map(function(a,b){return $(b).data("tagid")}).toArray(),f=$(".audience").children("li.audience-item").map(function(a,b){return $(b).data("audienceid")}).toArray(),g=$(".alias").children("li.alias-item").map(function(a,b){return $(b).data("aliasid")}).toArray(),h=$(".article-card-item").map(function(a,b){return $(b).data("articleid")}).toArray(),i=$(".service-card-item").first().data("serviceid"),b.t0=$,b.t1=$("#update-endpoint").val(),b.t2=$("#update-method").val(),b.t3=$("#article-title").text(),b.t4=$("#article-summary").text(),b.next=16,a.save();case 16:b.t5=b.sent,b.t6=$("#phase").val(),b.t7=$("#status").val(),b.t8=$("#availability").text(),b.t9=$("#cost").text(),b.t10=$("#support").text(),b.t11=$("#requirements").text(),b.t12=$("#requesting").text(),b.t13=$("#icon").val(),b.t14=$("#color").val().replace("#"," ").trim(),b.t15=d,b.t16=e,b.t17=f,b.t18=g,b.t19=h,b.t20=i,b.t21={title:b.t3,descriptionShort:b.t4,descriptionLong:b.t5,idCatalogPhase:b.t6,idCatalogStatus:b.t7,availability:b.t8,cost:b.t9,support:b.t10,requirements:b.t11,requesting:b.t12,icon:b.t13,color:b.t14,actions:b.t15,tags:b.t16,audiences:b.t17,aliases:b.t18,articles:b.t19,idService:b.t20},b.t22=function(a){disableSave(),a.created?window.location.replace("/component/"+a.component.id):$("#toast-save-success").addClass("show")},b.t23=function(){$("#toast-save-error").addClass("show")},b.t24={url:b.t1,method:b.t2,data:b.t21,success:b.t22,error:b.t23},b.t0.ajax.call(b.t0,b.t24);case 37:case"end":return b.stop();}},b)}));return function(){return b.apply(this,arguments)}}()),$(".article, .console-modal").on("keyup change paste",":input, [contenteditable=true]",function(){$("#article-title").text().length?enableSave():disableSave()}),$(".article").on("click",".ce-settings__plugin-zone *, .ce-settings__default-zone *",function(){$("#article-title").text().length?enableSave():disableSave()}),$("#button-generate-preview").click(function(a){a.preventDefault(),$.ajax({url:"/api/v1/preview/create/one",method:"POST",data:{entity:"component",entityID:$("#component-id").val()},success:function(a){$("#preview-link").val(a.link),$("#modal-preview").foundation("open")},error:function(a){console.error(a)}})})});var renderAction=function(a){var b=!1,c=!1;$("#link-cards-action").children().each(function(){return $(this).data("actionid")==a.id?(c=!0,!1):$(this).text()>a.title?(b=!0,$(this).before(actionToDOM(a,!1,!0)),!1):void 0}),b||c||$("#link-cards-action").append(actionToDOM(a,!1,!0))},actionToDOM=function(a,b,c){return b=null==b||b,c=null!=c&&c,"<li data-actionid=\"".concat(a.id,"\"><a class=\"").concat(a.actionType.title,"\" target=\"_self\" href=\"").concat(b?a.link:"#","\">").concat(a.title).concat(c?"<button class='remove-action-button'><i class='fas fa-times-circle'></i></button>":"","</a></li>")},renderTag=function(a){var b=!1,c=!1;$(".tags").children(".tag").each(function(){return $(this).data("tagid")==a.id?(c=!0,!1):$(this).children("a").text()>a.title?(b=!0,$(this).before(tagToDOM(a)),!1):void 0}),b||c||($(".tags").children(".tag").length?$(".tags").children(".tag").last().before(tagToDOM(a)):$(".tags").children().last().before(tagToDOM(a)))},tagToDOM=function(a){return"<li data-tagid=\"".concat(a.id,"\" class=\"tag\"><a href=\"#\">").concat(a.title,"<button class='remove-tag-button'><i class='fas fa-times-circle'></i></button></a></li>")},renderAudience=function(a){var b=!1,c=!1;$(".audience").children(".audience-item").each(function(){return $(this).data("audienceid")==a.id?(c=!0,!1):$(this).children("a").text()>a.title?(b=!0,$(this).before(audienceToDOM(a)),!1):void 0}),b||c||($(".audience").children(".audience-item").length?$(".audience").children(".audience-item").last().before(audienceToDOM(a)):$(".audience").children().last().before(audienceToDOM(a)))},audienceToDOM=function(a){return"<li data-audienceid=\"".concat(a.id,"\" class=\"audience-item\"><a href=\"#\">").concat(a.title,"<button class='remove-audience-button'><i class='fas fa-times-circle'></i></button></a></li>")},renderAlias=function(a){var b=!1,c=!1;$(".alias").children(".alias-item").each(function(){return $(this).data("aliasid")==a.id?(c=!0,!1):$(this).children("a").text()>a.title?(b=!0,$(this).before(aliasToDOM(a)),!1):void 0}),b||c||($(".alias").children(".alias-item").length?$(".alias").children(".alias-item").last().before(aliasToDOM(a)):$(".alias").children().last().before(aliasToDOM(a)))},aliasToDOM=function(a){return"<li data-aliasid=\"".concat(a.id,"\" class=\"alias-item\"><a href=\"#\">").concat(a.title,"<button class='remove-alias-button'><i class='fas fa-times-circle'></i></button></a></li>")},catalogItemToDOM=function(a,b,c,d){return c=null!=c&&c,"<li data-".concat(b,"id=\"").concat(a.id,"\" class=\"cell ").concat(b,"-card-item").concat(d?" compact":"","\">\n    <a class=\"service-card\" href=\"#\">\n      <i class=\"service-card-icon fas ").concat(a.icon,"\"></i>\n      <h3 class=\"service-card-title\">").concat(a.title,"</h3>\n      ").concat(c?"<button class='remove-catalog-item-button'><i class='fas fa-times-circle'></i></button>":"","\n    </a>\n  </li>")},renderParentService=function(a,b){$("#relate-service-input-group").slideUp(),$(".".concat(b,"-card-item")).remove(),$(".".concat(b,"-cards-wrapper")).append(catalogItemToDOM(a,b,!0,!0)),$(".breadcrumbs li:nth-last-child(2) > a").text(a.title)},renderArticleItem=function(a){var b=!1,c=!1;$(".article-card-item").each(function(){return $(this).data("articleid")==a.id?(c=!0,!1):$(this).find("h3").first().text()>a.title?(b=!0,$(this).before(articleItemToDOM(a,!0)),!1):void 0}),b||c||($(".article-card-item").length?$(".article-card-item").last().after(articleItemToDOM(a,!0)):$(".article-cards-wrapper").append(articleItemToDOM(a,!0)))},articleItemToDOM=function(a,b){return b=null!=b&&b,"<li data-articleid=\"".concat(a.id,"\" class=\"cell article-card-item\">\n  <a class=\"article-card\" href=\"#\">\n    <h3 class=\"article-card-title\">").concat(a.title,"</h3>\n    ").concat(b?"<button class='remove-article-card-button'><i class='fas fa-times-circle'></i></button>":"","\n  </a>\n  </li>")},enableSave=function(){$(".button-save").removeClass("disabled")},disableSave=function(){$(".button-save").addClass("disabled")};
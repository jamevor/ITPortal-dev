"use strict";function asyncGeneratorStep(a,b,c,d,e,f,g){try{var h=a[f](g),i=h.value}catch(a){return void c(a)}h.done?b(i):Promise.resolve(i).then(d,e)}function _asyncToGenerator(a){return function(){var b=this,c=arguments;return new Promise(function(d,e){function f(a){asyncGeneratorStep(h,d,e,f,g,"next",a)}function g(a){asyncGeneratorStep(h,d,e,f,g,"throw",a)}var h=a.apply(b,c);f(void 0)})}}$(document).ready(function(){var a=new EditorJS({holder:"descriptionLong",placeholder:"Begin your description here...",minHeight:1,tools:{paragraph:{inlineToolbar:["bold","italic"]},header:{class:Header,config:{minHeader:3,maxHeader:6,defaultLevel:3}},list:{class:List,inlineToolbar:["bold","italic","inlineCode","outdent","indent","styleToggle"]},inlineCode:{class:InlineCode},indent:{class:ListIndent},outdent:{class:ListOutdent},styleToggle:{class:ListStyleToggle},image:{class:ImageTool,config:{field:"fileupload",endpoints:{byFile:"/api/v1/file-upload/create/one",byUrl:"/api/v1/file-upload/create/one"},additionalRequestData:{via:"editorjs"}}}},data:window.editorjs_initialize_data.descriptionLong});$(".article-heading").on("keyup change paste",function(){$(".breadcrumbs li:last-child > a").text($(".article-heading").text())}),$("#supported").change(function(){$("#supported").is(":checked")?($(".news-status-card").css("background-color","var(--color-bright-2)"),$(".news-status-icon i").removeClass("fa-exclamation-circle").addClass("fa-check-circle"),$(".news-status-title").text("WPI Supported")):($(".news-status-card").css("background-color","var(--color-bright-3)"),$(".news-status-icon i").removeClass("fa-check-circle").addClass("fa-exclamation-circle"),$(".news-status-title").text("Best Effort Support"))}),$("#actionTitle").easyAutocomplete({url:"/api/v1/action/get/all",getValue:"title",list:{maxNumberOfElements:2,match:{enabled:!0},onChooseEvent:function(){$("#action").val(JSON.stringify($("#actionTitle").getSelectedItemData()))},showAnimation:{type:"slide",time:300,callback:function(){}},hideAnimation:{type:"slide",time:300,callback:function(){}}},template:{type:"custom",method:function(a,b){return actionToDOM(b,!1)}},placeholder:"Search for an action...",requestDelay:200}),$("#add-action-button").click(function(a){a.preventDefault(),$("#action").val().length&&(renderAction(JSON.parse($("#action").val())),$("#action, #actionTitle").val(""))}),$("#link-cards-action").on("click",".remove-action-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$("#add-softwareos-input").easyAutocomplete({url:"/api/v1/softwareos/get/all",getValue:"title",list:{maxNumberOfElements:2,match:{enabled:!0},onChooseEvent:function(){$("#softwareos").val(JSON.stringify($("#add-softwareos-input").getSelectedItemData()))}},requestDelay:200}),$("#add-softwareos-input").on("keyup",function(a){a.preventDefault(),13==a.which&&$("#add-softwareos-input").val().length&&(renderSoftwareOS(JSON.parse($("#softwareos").val())),$("#add-softwareos-input, #softwareos").val(""))}),$(".os").on("click",".remove-softwareos-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$("#add-tag-input").easyAutocomplete({url:"/api/v1/tag/get/all",getValue:"title",list:{maxNumberOfElements:2,match:{enabled:!0},onChooseEvent:function(){$("#tag").val(JSON.stringify($("#add-tag-input").getSelectedItemData()))}},requestDelay:200}),$("#add-tag-input").on("keyup",function(a){a.preventDefault(),13==a.which&&$("#add-tag-input").val().length&&(renderTag(JSON.parse($("#tag").val())),$("#add-tag-input, #tag").val(""))}),$(".tags").on("click",".remove-tag-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$("#add-audience-input").easyAutocomplete({url:"/api/v1/audience/get/all",getValue:"title",list:{maxNumberOfElements:2,match:{enabled:!0},onChooseEvent:function(){$("#audience").val(JSON.stringify($("#add-audience-input").getSelectedItemData()))}},requestDelay:200}),$("#add-audience-input").on("keyup",function(a){a.preventDefault(),13==a.which&&$("#add-audience-input").val().length&&(renderAudience(JSON.parse($("#audience").val())),$("#add-audience-input, #audience").val(""))}),$(".audience").on("click",".remove-audience-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$("#add-alias-input").easyAutocomplete({url:"/api/v1/alias/get/all",getValue:"title",list:{maxNumberOfElements:2,match:{enabled:!0},onChooseEvent:function(){$("#alias").val(JSON.stringify($("#add-alias-input").getSelectedItemData()))}},requestDelay:200}),$("#add-alias-input").on("keyup",function(a){a.preventDefault(),13==a.which&&$("#add-alias-input").val().length&&(renderAlias(JSON.parse($("#alias").val())),$("#add-alias-input, #alias").val(""))}),$(".alias").on("click",".remove-alias-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$(".card-list").on("click",".remove-article-card-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()}),$("#add-article-input").easyAutocomplete({url:"/api/v1/article/get/all",getValue:"title",list:{maxNumberOfElements:3,match:{enabled:!0},onChooseEvent:function(){$("#article").val(JSON.stringify($("#add-article-input").getSelectedItemData()))}},placeholder:"Search for an article...",requestDelay:200}),$("#add-article-input").on("keyup",function(a){a.preventDefault(),13==a.which&&$("#add-article-input").val().length&&(renderArticleItem(JSON.parse($("#article").val()),"article"),$("#add-article-input, #article").val(""))}),$("#add-article-button").click(function(a){a.preventDefault(),$("#article").val().length&&(renderArticleItem(JSON.parse($("#article").val()),"article"),$("#add-article-input, #article").val(""))}),$("#add-location-input").easyAutocomplete({url:"/api/v1/location/get/all",getValue:"title",list:{maxNumberOfElements:3,match:{enabled:!0},onChooseEvent:function(){$("#location").val(JSON.stringify($("#add-location-input").getSelectedItemData()))}},placeholder:"Search for a location...",requestDelay:200}),$("#add-location-button").click(function(a){a.preventDefault(),$("#location").val().length&&(renderLocation(JSON.parse($("#location").val())),$("#location, #add-location-input").val(""))}),$("#locationsTable tbody").on("click",".button-remove-location",function(a){window.locationsTable.row($(a.currentTarget).closest("tr")).remove(),window.locationsTable.draw(),enableSave()}),$(".console-modal").on("click",".remove-related-item-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()});for(var b=["license","package","server","softwareType","component","service"],c=function(){var a=e[d];$("#add-".concat(a,"-input")).easyAutocomplete({url:"/api/v1/".concat(a,"/get/all"),getValue:"title",list:{maxNumberOfElements:3,match:{enabled:!0},onChooseEvent:function(){$("#".concat(a)).val(JSON.stringify($("#add-".concat(a,"-input")).getSelectedItemData()))}},placeholder:"Search for a ".concat(a,"..."),requestDelay:200}),$("#add-".concat(a,"-button")).click(function(b){b.preventDefault(),$("#".concat(a)).val().length&&(addRelationshipItem(JSON.parse($("#".concat(a)).val()),a),$("#".concat(a),"#add-".concat(a,"-input")).val(""))}),$(".console-modal").on("click",".remove-related-item-button",function(a){a.preventDefault(),$(a.target).closest("li").remove(),enableSave()})},d=0,e=b;d<e.length;d++)c();$(".button-save").click(function(){var b=_asyncToGenerator(regeneratorRuntime.mark(function b(c){var d,e,f,g,h,i,j,k,l,m,n,o,p;return regeneratorRuntime.wrap(function(b){for(;;)switch(b.prev=b.next){case 0:if(c.preventDefault(),!$(c.currentTarget).hasClass("disabled")){b.next=3;break}return b.abrupt("return",!1);case 3:return d=$("#link-cards-action").children("li").map(function(a,b){return $(b).data("actionid")}).toArray(),e=$(".tags").children("li.tag").map(function(a,b){return $(b).data("tagid")}).toArray(),f=$(".audience").children("li.audience-item").map(function(a,b){return $(b).data("audienceid")}).toArray(),g=$(".alias").children("li.alias-item").map(function(a,b){return $(b).data("aliasid")}).toArray(),h=$(".article-card-item").map(function(a,b){return $(b).data("articleid")}).toArray(),i=$(".os").children("li.softwareos-item").map(function(a,b){return $(b).data("softwareosid")}).toArray(),j=window.locationsTable.columns(0).data().eq(0).unique().toArray(),k=$(".licenses-wrapper").children("li.license-item").map(function(a,b){return $(b).data("licenseid")}).toArray(),l=$(".packages-wrapper").children("li.package-item").map(function(a,b){return $(b).data("packageid")}).toArray(),m=$(".servers-wrapper").children("li.server-item").map(function(a,b){return $(b).data("serverid")}).toArray(),n=$(".softwareTypes-wrapper").children("li.softwareType-item").map(function(a,b){return $(b).data("softwaretypeid")}).toArray(),o=$(".components-wrapper").children("li.component-item").map(function(a,b){return $(b).data("componentid")}).toArray(),p=$(".services-wrapper").children("li.service-item").map(function(a,b){return $(b).data("serviceid")}).toArray(),b.t0=$,b.t1=$("#update-endpoint").val(),b.t2=$("#update-method").val(),b.t3=$("#article-title").text(),b.t4=$("#supported").is(":checked"),b.t5=$("#article-summary").text(),b.next=24,a.save();case 24:b.t6=b.sent,b.t7=$("#phase").val(),b.t8=$("#isAvailable").is(":checked"),b.t9=$("#isLicensed").is(":checked"),b.t10=$("#isCLA").is(":checked"),b.t11=$("#isSCCM").is(":checked"),b.t12=$("#useWPI").is(":checked"),b.t13=$("#usePersonal").is(":checked"),b.t14=$("#version").text(),b.t15=$("#releaseYear").val(),b.t16=$("#publisher").text(),b.t17=$("#installWho").text(),b.t18=$("#requirements").text(),b.t19=$("#dependencies").text(),b.t20=$("#requesting").text(),b.t21=$("#installPointPublic").val(),b.t22=d,b.t23=e,b.t24=f,b.t25=g,b.t26=h,b.t27=i,b.t28=j,b.t29=k,b.t30=l,b.t31=m,b.t32=n,b.t33=o,b.t34=p,b.t35={title:b.t3,supported:b.t4,descriptionShort:b.t5,descriptionLong:b.t6,idSoftwarePhase:b.t7,isAvailable:b.t8,isLicensed:b.t9,isCLA:b.t10,isSCCM:b.t11,useWPI:b.t12,usePersonal:b.t13,version:b.t14,releaseYear:b.t15,publisher:b.t16,installWho:b.t17,requirements:b.t18,dependencies:b.t19,requesting:b.t20,installPointPublic:b.t21,actions:b.t22,tags:b.t23,audiences:b.t24,aliases:b.t25,articles:b.t26,softwareos:b.t27,locations:b.t28,licenses:b.t29,packages:b.t30,servers:b.t31,softwareTypes:b.t32,components:b.t33,services:b.t34},b.t36=function(a){disableSave(),a.created?window.location.replace("/software/"+a.software.id):$("#toast-save-success").addClass("show")},b.t37=function(){$("#toast-save-error").addClass("show")},b.t38={url:b.t1,method:b.t2,data:b.t35,success:b.t36,error:b.t37},b.t0.ajax.call(b.t0,b.t38);case 58:case"end":return b.stop();}},b)}));return function(){return b.apply(this,arguments)}}()),$(".article, .console-modal").on("keyup change paste",":input, [contenteditable=true]",function(){$("#article-title").text().length?enableSave():disableSave()}),$(".article").on("click",".ce-settings__plugin-zone *, .ce-settings__default-zone *",function(){$("#article-title").text().length?enableSave():disableSave()}),$("#button-generate-preview").click(function(a){a.preventDefault(),$.ajax({url:"/api/v1/preview/create/one",method:"POST",data:{entity:"software",entityID:$("#software-id").val()},success:function(a){$("#preview-link").val(a.link),$("#modal-preview").foundation("open")},error:function(a){console.error(a)}})})});var renderAction=function(a){var b=!1,c=!1;$("#link-cards-action").children().each(function(){return $(this).data("actionid")==a.id?(c=!0,!1):$(this).text()>a.title?(b=!0,$(this).before(actionToDOM(a,!1,!0)),!1):void 0}),b||c||$("#link-cards-action").append(actionToDOM(a,!1,!0))},actionToDOM=function(a,b,c){return b=null==b||b,c=null!=c&&c,"<li data-actionid=\"".concat(a.id,"\"><a class=\"").concat(a.actionType.title,"\" target=\"_self\" href=\"").concat(b?a.link:"#","\">").concat(a.title).concat(c?"<button class='remove-action-button'><i class='fas fa-times-circle'></i></button>":"","</a></li>")},renderSoftwareOS=function(a){var b=!1,c=!1;$(".os").children(".softwareos-item").each(function(){return $(this).data("softwareosid")==a.id?(c=!0,!1):$(this).children("a i").attr("title")>a.title?(b=!0,$(this).before(softwareOSToDOM(a)),!1):void 0}),b||c||($(".os").children(".softwareos-item").length?$(".os").children(".softwareos-item").last().before(softwareOSToDOM(a)):$(".os").children().last().before(softwareOSToDOM(a)))},softwareOSToDOM=function(a){return"<li data-softwareosid=\"".concat(a.id,"\" class=\"softwareos-item\"><a href=\"#\"><i title=\"").concat(a.title,"\" class=\"fab fa-lg ").concat(a.icon,"\"></i><button class='remove-softwareos-button'><i class='fas fa-times-circle'></i></button></a></li>")},renderTag=function(a){var b=!1,c=!1;$(".tags").children(".tag").each(function(){return $(this).data("tagid")==a.id?(c=!0,!1):$(this).children("a").text()>a.title?(b=!0,$(this).before(tagToDOM(a)),!1):void 0}),b||c||($(".tags").children(".tag").length?$(".tags").children(".tag").last().before(tagToDOM(a)):$(".tags").children().last().before(tagToDOM(a)))},tagToDOM=function(a){return"<li data-tagid=\"".concat(a.id,"\" class=\"tag\"><a href=\"#\">").concat(a.title,"<button class='remove-tag-button'><i class='fas fa-times-circle'></i></button></a></li>")},renderAudience=function(a){var b=!1,c=!1;$(".audience").children(".audience-item").each(function(){return $(this).data("audienceid")==a.id?(c=!0,!1):$(this).children("a").text()>a.title?(b=!0,$(this).before(audienceToDOM(a)),!1):void 0}),b||c||($(".audience").children(".audience-item").length?$(".audience").children(".audience-item").last().before(audienceToDOM(a)):$(".audience").children().last().before(audienceToDOM(a)))},audienceToDOM=function(a){return"<li data-audienceid=\"".concat(a.id,"\" class=\"audience-item\"><a href=\"#\">").concat(a.title,"<button class='remove-audience-button'><i class='fas fa-times-circle'></i></button></a></li>")},renderAlias=function(a){var b=!1,c=!1;$(".alias").children(".alias-item").each(function(){return $(this).data("aliasid")==a.id?(c=!0,!1):$(this).children("a").text()>a.title?(b=!0,$(this).before(aliasToDOM(a)),!1):void 0}),b||c||($(".alias").children(".alias-item").length?$(".alias").children(".alias-item").last().before(aliasToDOM(a)):$(".alias").children().last().before(aliasToDOM(a)))},aliasToDOM=function(a){return"<li data-aliasid=\"".concat(a.id,"\" class=\"alias-item\"><a href=\"#\">").concat(a.title,"<button class='remove-alias-button'><i class='fas fa-times-circle'></i></button></a></li>")},renderArticleItem=function(a){var b=!1,c=!1;$(".article-card-item").each(function(){return $(this).data("articleid")==a.id?(c=!0,!1):$(this).find("h3").first().text()>a.title?(b=!0,$(this).before(articleItemToDOM(a,!0)),!1):void 0}),b||c||($(".article-card-item").length?$(".article-card-item").last().after(articleItemToDOM(a,!0)):$(".article-cards-wrapper").append(articleItemToDOM(a,!0)))},articleItemToDOM=function(a,b){return b=null!=b&&b,"<li data-articleid=\"".concat(a.id,"\" class=\"cell article-card-item\">\n  <a class=\"article-card\" href=\"#\">\n    <h3 class=\"article-card-title\">").concat(a.title,"</h3>\n    ").concat(b?"<button class='remove-article-card-button'><i class='fas fa-times-circle'></i></button>":"","\n  </a>\n  </li>")},renderLocation=function(a){var b=!1;window.locationsTable.rows().every(function(){if(this.data()[0]==a.id)return b=!0,!1}),b||(window.locationsTable.row.add([a.id,a.building&&a.building.abbr?a.building.abbr:"",a.building&&a.building.title?"<a href='#'>".concat(a.building.title,"</a>"):"","<a href='#'>".concat(a.title,"</a>"),a.room,a.locationType&&a.locationType.title?a.locationType.title:"","<button class='button-remove-location'><i class='fas fa-unlink'></i> Remove</button>"]),window.locationsTable.draw())},addRelationshipItem=function(a,b){var c=!1,d=!1;$(".".concat(b,"-item")).each(function(){return $(this).data("".concat(b,"id"))==a.id?(d=!0,!1):$(this).text()>a.title?(c=!0,$(this).before(relatedItemToDOM(a,b)),!1):void 0}),c||d||($(".".concat(b,"-item")).length?$(".".concat(b,"-item")).last().after(relatedItemToDOM(a,b)):$(".".concat(b,"s-wrapper")).append(relatedItemToDOM(a,b)))},relatedItemToDOM=function(a,b){return"<li data-".concat(b,"id=\"").concat(a.id,"\" class=\"").concat(b,"-item related-item\">").concat(a.title,"<button class='remove-related-item-button'><i class='fas fa-times'></i> Remove</button></li>")},enableSave=function(){$(".button-save").removeClass("disabled")},disableSave=function(){$(".button-save").addClass("disabled")};
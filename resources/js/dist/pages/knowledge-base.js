"use strict";$(document).ready(function(){$.ajax({url:"/api/v1/article/get/many",method:"GET",data:{sort:["createdAt","desc"],limit:5,attributes:["id","title"]},success:function(a){var b=!0,c=!1,d=void 0;try{for(var e,f,g=a[Symbol.iterator]();!(b=(e=g.next()).done);b=!0)f=e.value,$("#recentlyCreatedArticles").append(renderArticleCard(f))}catch(a){c=!0,d=a}finally{try{b||null==g.return||g.return()}finally{if(c)throw d}}$.ajax({url:"/api/v1/article/get/many",method:"GET",data:{sort:["updatedAt","desc"],limit:5,attributes:["id","title"],filterByColumn:[["updatedAt","ne","createdAt"]],filterByValue:[["id","notIn",a.map(function(a){return a.id})]]},success:function(a){var b=!0,c=!1,d=void 0;try{for(var e,f,g=a[Symbol.iterator]();!(b=(e=g.next()).done);b=!0)f=e.value,$("#recentlyUpdatedArticles").append(renderArticleCard(f))}catch(a){c=!0,d=a}finally{try{b||null==g.return||g.return()}finally{if(c)throw d}}},error:function(a){console.error({resp:a})}})},error:function(a){console.error({resp:a})}}),$.ajax({url:"/api/v1/article/get/many",method:"GET",data:{sort:["title","asc"]},success:function(a){var b=!0,c=!1,d=void 0;try{for(var e,f,g=a[Symbol.iterator]();!(b=(e=g.next()).done);b=!0)f=e.value,$("#allArticles").append(renderArticleCard(f))}catch(a){c=!0,d=a}finally{try{b||null==g.return||g.return()}finally{if(c)throw d}}},error:function(a){console.error({resp:a})}}),$.extend($.expr[":"],{containsi:function(a,b,c){return 0<=(a.textContent||a.innerText||"").toLowerCase().indexOf((c[3]||"").toLowerCase())}});var a=debounce(function(a){a.preventDefault(),doneTyping()},400);$("#filter-articles").on("keyup",a)});var renderArticleCard=function(a){return"\n    <li class=\"cell\">\n      <a class=\"article-card\" href=\"/article/".concat(a.id,"\">\n        <h3 class=\"article-card-title\">").concat(a.title,"</h3>\n      </a>\n    </li>\n  ")},filterArticles=function(){var a=$("#filter-articles").val().toLowerCase();"string"==typeof a&&a.length&&$("#allArticles").find(".cell").not(":containsi(\"".concat(a,"\")")).hide()},doneTyping=function(){resetArticlesFilter(),filterArticles()},resetArticlesFilter=function(){$("#allArticles").find(".cell").show()},debounce=function(a,b){var c;return function(){var d=arguments,e=this;clearTimeout(c),c=setTimeout(function(){return a.apply(e,d)},b)}};
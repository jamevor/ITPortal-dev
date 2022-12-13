"use strict";

/*
 global NewsCard Foundation
*/
var ALL_NEWS;
var CURSOR;
$(document).ready(function () {
  $.ajax({
    url: '/api/v1/news/get/all',
    method: 'GET',
    success: function success(data) {
      if (data && data.length) {
        init(data);
      }
    },
    error: function error(resp) {
      console.error(resp);
    }
  });
  $(window).scroll(function () {
    if (ALL_NEWS && ALL_NEWS.length && $(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
      if (CURSOR < ALL_NEWS.length) {
        // TODO debounce this and do something cute $('#newsCardsWrapper').append(`<div class='spintro'></div>`);
        // setTimeout(function() {
        $('.spintro').remove();
        var CURSOR_ = Math.min(ALL_NEWS.length, CURSOR + 20);

        for (var i = CURSOR; i < CURSOR_; i++) {
          var newsCard = new NewsCard(ALL_NEWS[i], false, 'small-12');
          $('#newsCardsWrapper').append(newsCard.render());
        }

        CURSOR = CURSOR_; // }, 3000);
      }
    }
  }); // Extend Jquery to allow for containsi selector, for filtering case-insensitive

  $.extend($.expr[':'], {
    'containsi': function containsi(elem, i, match) {
      return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0;
    }
  });
  var newsFilterCallback = debounce(function (event) {
    event.preventDefault();
    doneTyping();
  }, 400);
  $('#filter-news').on('keyup', newsFilterCallback);
});

var init = function init(data) {
  ALL_NEWS = data; // store for later use on scroll

  var newsCard_1 = new NewsCard(data[0], true, 'auto');
  $('#featuredNewsCard1').append(newsCard_1.render());

  if (data.length >= 2) {
    var newsCard_2 = new NewsCard(data[1], true, 'auto');
    $('#featuredNewsCard2').append(newsCard_2.render());
  }

  new Foundation.Interchange($('#featuredNewsCard1 .news-card, #featuredNewsCard2 .news-card'));
  CURSOR = Math.min(data.length, 20);

  for (var i = 2; i < CURSOR; i++) {
    var newsCard = new NewsCard(data[i], false, 'small-12');
    $('#newsCardsWrapper').append(newsCard.render());
  }
};

var filterNews = function filterNews(catFilter) {
  if (ALL_NEWS && ALL_NEWS.length) {
    if (CURSOR < ALL_NEWS.length) {
      var CURSOR_ = ALL_NEWS.length;

      for (var i = CURSOR; i < CURSOR_; i++) {
        var newsCard = new NewsCard(ALL_NEWS[i], false, 'small-12');
        $('#newsCardsWrapper').append(newsCard.render());
      }

      CURSOR = CURSOR_;
    }
  }

  $('.service-catalog-portfolio').find('.news-card.small-12').not(":containsi(\"".concat(catFilter, "\")")).hide();
  $('.service-catalog-portfolio').find('.news-card.auto').not(":containsi(\"".concat(catFilter, "\")")).parents('.cell').hide();
};

var doneTyping = function doneTyping() {
  resetNewsFilter();
  var catFilter = $('#filter-news').val().toLowerCase();

  if (typeof catFilter === 'string' && catFilter.length) {
    filterNews(catFilter);
  }
};

var resetNewsFilter = function resetNewsFilter() {
  $('.service-catalog-portfolio').find('.news-card.auto').parents('.cell').show();
  $('#featuredNewsCard1, #featuredNewsCard2, #newsCardsWrapper').children().remove();
  init(ALL_NEWS);
};

var debounce = function debounce(fn, time) {
  var timeout;
  return function () {
    var _arguments = arguments,
        _this = this;

    var functionCall = function functionCall() {
      return fn.apply(_this, _arguments);
    };

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};
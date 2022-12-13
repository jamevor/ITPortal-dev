"use strict";

/*
	global NewsCard Foundation CarouselCell Flickity
*/
$(document).ready(function () {
  $.ajax({
    url: '/api/v1/meta-home/news/get',
    method: 'GET',
    success: function success(data) {
      if (data && data.length) {
        var newsCard = new NewsCard(data[0], true);
        $('.featured-news-card-wrapper').append(newsCard.render());
        new Foundation.Interchange($('.featured-news-card-wrapper .news-card'));

        for (var i = 1; i < data.length; i++) {
          var _newsCard = new NewsCard(data[i], false);

          $('.news-cards-wrapper').append(_newsCard.render());
        }
      } else {
        $('.featured-news-card-wrapper').parents('.swim-lane').first().hide();
      }
    },
    error: function error(resp) {
      $('.featured-news-card-wrapper').parents('.swim-lane').first().hide();
    }
  });
  $.ajax({
    url: '/api/v1/meta-home/featured-content/get',
    method: 'GET',
    success: function success(data) {
      if (data && data.length) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var datum = _step.value;
            var backgroundPosition = datum.meta_home_featuredContentPosition ? datum.meta_home_featuredContentPosition.title : 'center';
            var f = new CarouselCell(datum.title, datum.fileUploadURL, datum.link, backgroundPosition);
            $('.featured-content').append(f.render());
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (data.length > 2) {
          new Flickity('.featured-content', {
            wrapAround: true,
            pageDots: false,
            accessibility: false
          });
        } else {
          $('.featured-content').css({
            'opacity': 1,
            'height': 'auto'
          });
        }
      } else {
        $('.featured-content').parents('.swim-lane').first().hide();
      }
    },
    error: function error(resp) {
      $('.featured-content').parents('.swim-lane').first().hide();
    }
  });
  $('.alert .close-button').click(function (event) {
    event.preventDefault();
    event.stopPropagation();
    $('.alert').slideUp();
    $.ajax({
      url: '/api/v1/session/update',
      method: 'PATCH',
      data: {
        alertClosed: true
      }
    });
  });
});
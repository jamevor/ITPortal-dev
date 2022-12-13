"use strict";

$(document).ready(function () {
  // get 5 recently created articles
  $.ajax({
    url: '/api/v1/article/get/many',
    method: 'GET',
    data: {
      sort: ['createdAt', 'desc'],
      limit: 5,
      attributes: ['id', 'title']
    },
    success: function success(data) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var datum = _step.value;
          $('#recentlyCreatedArticles').append(renderArticleCard(datum));
        } // get 5 recently updated articles

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

      $.ajax({
        url: '/api/v1/article/get/many',
        method: 'GET',
        data: {
          sort: ['updatedAt', 'desc'],
          limit: 5,
          attributes: ['id', 'title'],
          filterByColumn: [['updatedAt', 'ne', 'createdAt']],
          filterByValue: [['id', 'notIn', data.map(function (d) {
            return d.id;
          })]]
        },
        success: function success(data_) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = data_[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var datum_ = _step2.value;
              $('#recentlyUpdatedArticles').append(renderArticleCard(datum_));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        },
        error: function error(resp_) {
          console.error({
            resp: resp_
          });
        }
      });
    },
    error: function error(resp) {
      console.error({
        resp: resp
      });
    }
  }); // get all articles A-Z

  $.ajax({
    url: '/api/v1/article/get/many',
    method: 'GET',
    data: {
      sort: ['title', 'asc']
    },
    success: function success(data) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var datum = _step3.value;
          $('#allArticles').append(renderArticleCard(datum));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    },
    error: function error(resp) {
      console.error({
        resp: resp
      });
    }
  }); // Extend Jquery to allow for containsi selector, for filtering case-insensitive

  $.extend($.expr[':'], {
    'containsi': function containsi(elem, i, match) {
      return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0;
    }
  });
  var articlesFilterCallback = debounce(function (event) {
    event.preventDefault();
    doneTyping();
  }, 400);
  $('#filter-articles').on('keyup', articlesFilterCallback);
});

var renderArticleCard = function renderArticleCard(article) {
  return "\n    <li class=\"cell\">\n      <a class=\"article-card\" href=\"/article/".concat(article.id, "\">\n        <h3 class=\"article-card-title\">").concat(article.title, "</h3>\n      </a>\n    </li>\n  ");
};

var filterArticles = function filterArticles() {
  var catFilter = $('#filter-articles').val().toLowerCase();

  if (typeof catFilter === 'string' && catFilter.length) {
    $('#allArticles').find('.cell').not(":containsi(\"".concat(catFilter, "\")")).hide();
  }
};

var doneTyping = function doneTyping() {
  resetArticlesFilter();
  filterArticles();
};

var resetArticlesFilter = function resetArticlesFilter() {
  $('#allArticles').find('.cell').show();
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
"use strict";

/* global MyAppCard */
$(document).ready(function () {
  // Extend Jquery to allow for containsi selector, for filtering case-insensitive
  $.extend($.expr[':'], {
    'containsi': function containsi(elem, i, match) {
      return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0;
    }
  });
  var appsFilterCallback = debounce(function (event) {
    event.preventDefault();
    doneTyping();
  }, 400);
  $('#filter-apps').on('keyup', appsFilterCallback);
  $.ajax({
    url: '/api/v1/app/get/all',
    method: 'GET',
    success: function success(apps) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = apps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var app = _step.value;
          $('#app-marketplace-container').append(new MyAppCard(app, app.isInstalled, app.isFavorite, app.isUserLoggedIn).render());
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
    },
    error: function error(resp) {
      console.error(resp);
    }
  });
  $('#app-marketplace-container').on('change', '.toggle-heart', function (event) {
    updateFavorite($(event.target).closest('.app').data('appid'), $(event.target).hasClass('checkable'));
  });
  $('#app-marketplace-container').on('click', '.button-remove-app', function (event) {
    event.preventDefault();
    updateInstallation($(event.target).closest('.app').data('appid'), false);
  });
  $('#app-marketplace-container').on('click', '.button-add-app', function (event) {
    event.preventDefault();
    updateInstallation($(event.target).closest('.app').data('appid'), true);
  });
});

var filterApps = function filterApps() {
  var catFilter = $('#filter-apps').val().toLowerCase();

  if (typeof catFilter === 'string' && catFilter.length) {
    $('#app-marketplace-container').find('.app').not(":containsi(\"".concat(catFilter, "\")")).hide();
    $('#app-marketplace-container').find('.app').filter(":containsi(\"".concat(catFilter, "\")")).addClass('filtered');
  }
};

var doneTyping = function doneTyping() {
  resetAppsFilter();
  filterApps();
};

var resetAppsFilter = function resetAppsFilter() {
  $('#app-marketplace-container').find('.app').show();
  $('#app-marketplace-container').find('.filtered').removeClass('filtered');
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

function updateFavorite(id, setFavoriteTo) {
  setTimeout(function () {
    sendUpdateFavorites(id, setFavoriteTo);
    $(".app[data-appid='".concat(id, "'")).find('.toggle-heart').toggleClass('checkable');
  }, 800);
}

function sendUpdateFavorites(id, setFavoriteTo) {
  setTimeout(function () {
    $.ajax({
      url: '/api/v1/me/app/set-favorite/one',
      method: 'PATCH',
      data: {
        id: id,
        favorite: setFavoriteTo
      },
      success: function success() {},
      error: function error(resp) {
        console.error(resp);
      }
    });
  }, 100);
}

function updateInstallation(id, setInstalledTo) {
  if (setInstalledTo) {
    var app = $(".app[data-appid='".concat(id, "'"));
    app.find('div.img').removeAttr('style').html(MyAppCard.renderSpinner());
    app.find('a.action').remove();
    app.append(MyAppCard.renderProgressBar(id));

    (function pushProgress(pct) {
      setTimeout(function () {
        pct += pct < 90 ? Math.ceil(Math.random() * Math.min(pct, 16)) : 3;
        $("#install-progress-".concat(id)).children('.progress-meter').width("".concat(pct, "%"));

        if (pct < 100) {
          pushProgress(pct);
        } else {
          sendUpdateInstallation(id, setInstalledTo);
        }
      }, Math.max(400 / pct, 50));
    })(1);
  } else {
    sendUpdateInstallation(id, setInstalledTo);
  }
}

function sendUpdateInstallation(id, setInstalledTo) {
  setTimeout(function () {
    $.ajax({
      url: '/api/v1/me/app/set-installed/one',
      method: 'POST',
      data: {
        id: id,
        installed: setInstalledTo
      },
      success: function success(data) {
        $(".app[data-appid='".concat(id, "'")).replaceWith(new MyAppCard(data.app, setInstalledTo, false, data.app.isUserLoggedIn).render());
      },
      error: function error(resp) {
        console.error(resp);
      }
    });
  }, 100);
}
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
  refreshFavorites();
  refreshInstalled();
  refreshAvailable();
  $('.profile-section-content').on('change', '.toggle-heart', function (event) {
    updateFavorite($(event.target).closest('.app').data('appid'), $(event.target).hasClass('checkable'));
  });
  $('#favorite-apps-container, #installed-apps-container').on('click', '.button-remove-app', function (event) {
    event.preventDefault();
    updateInstallation($(event.target).closest('.app').data('appid'), false);
  });
  $('.profile-section-content').on('click', '.button-add-app', function (event) {
    event.preventDefault();
    updateInstallation($(event.target).closest('.app').data('appid'), true);
  });
});

var filterApps = function filterApps() {
  var catFilter = $('#filter-apps').val().toLowerCase();

  if (typeof catFilter === 'string' && catFilter.length) {
    $('#available-apps-container').find('.app').not(":containsi(\"".concat(catFilter, "\")")).hide();
    $('#available-apps-container').find('.app').filter(":containsi(\"".concat(catFilter, "\")")).addClass('filtered');
  }
};

var doneTyping = function doneTyping() {
  resetAppsFilter();
  filterApps();
};

var resetAppsFilter = function resetAppsFilter() {
  $('#available-apps-container').find('.app').show();
  $('#available-apps-container').find('.filtered').removeClass('filtered');
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

function refreshFavorites() {
  $.ajax({
    url: '/api/v1/me/app/get/favorites',
    method: 'GET',
    beforeSend: function beforeSend() {
      $('#favorite-apps-container').empty();
    },
    success: function success(apps) {
      if (!apps.length) {
        $('#favorite-apps-container').append(renderEmptyFavoritesBox());
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = apps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var app = _step.value;
          $('#favorite-apps-container').append(new MyAppCard(app, true, true).render());
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
}

function refreshInstalled() {
  $.ajax({
    url: '/api/v1/me/app/get/installed',
    method: 'GET',
    beforeSend: function beforeSend() {
      $('#installed-apps-container').empty();
    },
    success: function success(apps) {
      if (!apps.length) {
        $('#installed-apps-container').append(renderEmptyInstalledBox());
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = apps[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var app = _step2.value;
          $('#installed-apps-container').append(new MyAppCard(app, true, false).render());
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
    error: function error(resp) {
      console.error(resp);
    }
  });
}

function refreshAvailable() {
  $.ajax({
    url: '/api/v1/me/app/get/available',
    method: 'GET',
    beforeSend: function beforeSend() {
      $('#available-apps-container').empty();
    },
    success: function success(apps) {
      if (!apps.length) {
        $('#available-apps-container').append(renderEmptyAvailableBox());
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = apps[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var app = _step3.value;
          $('#available-apps-container').append(new MyAppCard(app, false, false).render());
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
      console.error(resp);
    }
  });
}

function updateFavorite(id, setFavoriteTo) {
  setTimeout(function () {
    sendUpdateFavorites(id, setFavoriteTo);
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
      success: function success(data) {
        if (!$(".app[data-appid='".concat(id, "'")).siblings().length) {
          if ($(".app[data-appid='".concat(id, "'")).closest('#favorite-apps-container').length) {
            $('#favorite-apps-container').append(renderEmptyFavoritesBox());
          } else {
            $('#installed-apps-container').append(renderEmptyInstalledBox());
          }
        }

        if (setFavoriteTo) {
          $(".app[data-appid='".concat(id, "'")).remove();
          $('#favorite-apps-container').append(new MyAppCard(data.app, true, true).render());
        } else {
          $(".app[data-appid='".concat(id, "'")).remove();
          $('#installed-apps-container').append(new MyAppCard(data.app, true, false).render());
        }

        $(".app[data-appid='".concat(id, "'")).siblings('.empty').remove();
      },
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
        if (!$(".app[data-appid='".concat(id, "'")).siblings().length) {
          if ($(".app[data-appid='".concat(id, "'")).closest('#favorite-apps-container').length) {
            $('#favorite-apps-container').append(renderEmptyFavoritesBox());
          } else if ($(".app[data-appid='".concat(id, "'")).closest('#installed-apps-container').length) {
            $('#installed-apps-container').append(renderEmptyInstalledBox());
          } else {
            $('#available-apps-container').append(renderEmptyAvailableBox());
          }
        }

        if (setInstalledTo) {
          $(".app[data-appid='".concat(id, "'")).remove();
          $('#installed-apps-container').append(new MyAppCard(data.app, true, false).render());
        } else {
          $(".app[data-appid='".concat(id, "'")).remove();
          $('#available-apps-container').append(new MyAppCard(data.app, false, false).render());
        }

        $(".app[data-appid='".concat(id, "'")).siblings('.empty').remove();
      },
      error: function error(resp) {
        console.error(resp);
      }
    });
  }, 100);
}

function renderEmptyFavoritesBox() {
  return "<div class=\"cell medium-12 my-apps empty\">\n    <p>You can add shortcuts to your frequently used Apps & Utilities</p>\n  </div>";
}

function renderEmptyInstalledBox() {
  return "<div class=\"cell medium-12 my-apps empty\">\n    <p>You can install Apps & Utilities to have easy access to them through your profile.</p>\n  </div>";
}

function renderEmptyAvailableBox() {
  return "<div class=\"cell medium-12 my-apps empty\">\n    <p>There are no available Apps & Utilities for you to install.</p>\n  </div>";
}
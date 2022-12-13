"use strict";

$(document).ready(function () {
  registerFavoriteHandler();
  $('.app').on('click', '.button-remove-app', function (event) {
    event.preventDefault();
    updateInstallation($('#app-id').val(), false);
  });
  $('.app').on('click', '.button-add-app', function (event) {
    event.preventDefault();
    updateInstallation($('#app-id').val(), true);
  });
});

function updateFavorites(id, setFavoriteTo) {
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
}

function updateInstallation(id, setInstalledTo) {
  $.ajax({
    url: '/api/v1/me/app/set-installed/one',
    method: 'POST',
    data: {
      id: id,
      installed: setInstalledTo
    },
    success: function success() {
      $('.box.card.app').html(renderBoxCardApp(setInstalledTo, false, $('#app-link').val(), $('#app-guid').val()));
      registerFavoriteHandler();
    },
    error: function error(resp) {
      console.error(resp);
    }
  });
}

function renderBoxCardApp(installed, favorited, link, guid) {
  if (installed) {
    return "<div class=\"favoriteable\">\n        <input class=\"toggle-heart".concat(!favorited ? ' checkable' : '', "\" id=\"toggle-heart-").concat(guid, "\" type=\"checkbox\"").concat(favorited ? ' checked="true"' : '', ">\n        <label class=\"toggle-heart-label\" for=\"toggle-heart-").concat(guid, "\" aria-label=\"like\">\u2764</label>\n      </div>\n      <a class=\"action button expanded\" href=\"").concat(link, "\" target=\"_blank\"><i class=\"fas fa-power-off\"></i> Open</a>\n      <a class=\"action secondary button button-remove-app\" href=\"#\"><i class=\"fas fa-minus-circle\"></i> Remove</a>");
  } else {
    return '<a class="action button expanded button-add-app" href="#"><i class="fas fa-plus-circle"></i> Add</a>';
  }
}

function registerFavoriteHandler() {
  $('.toggle-heart').change(function () {
    updateFavorites($('#app-id').val(), $('.toggle-heart').hasClass('checkable'));
    setTimeout(function () {
      $('.toggle-heart').toggleClass('checkable');
    }, 1000);
  });
}
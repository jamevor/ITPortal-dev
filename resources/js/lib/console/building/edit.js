"use strict";

$(document).ready(function () {
  // breadcrumbs
  $('.article-heading').on('keyup change paste', function () {
    $('.breadcrumbs li:last-child > a').text($('.article-heading').text());
  });
  $('.card-list').on('click', '.remove-catalog-item-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    enableSave();
  }); // locations

  $('#add-location-input').easyAutocomplete({
    url: '/api/v1/location/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 3,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#location').val(JSON.stringify($('#add-location-input').getSelectedItemData()));
      }
    },
    placeholder: 'Search for a location...',
    requestDelay: 200
  });
  $('#add-location-input').on('keyup', function (event) {
    event.preventDefault();

    if (event.which == 13 && $('#add-location-input').val().length) {
      renderLocation(JSON.parse($('#location').val()));
      $('#add-location-input, #location').val('');
    }
  });
  $('#add-location-button').click(function (event) {
    event.preventDefault();

    if ($('#location').val().length) {
      renderLocation(JSON.parse($('#location').val()));
      $('#location, #location').val('');
    }
  }); // save

  $('.button-save').click(function (event) {
    event.preventDefault();

    if ($(event.currentTarget).hasClass('disabled')) {
      return false;
    }

    var locations = $('.location-item').map(function (index, value) {
      return $(value).data('locationid');
    }).toArray();
    $.ajax({
      url: $('#update-endpoint').val(),
      method: $('#update-method').val(),
      data: {
        title: $('#article-title').text(),
        abbr: $('#abbr').text(),
        common: $('#building-common').text(),
        address: $('#building-address').text(),
        locations: locations
      },
      success: function success(data) {
        disableSave();

        if (data.created) {
          window.location.replace('/building/' + data.building.id);
        } else {
          $('#toast-save-success').addClass('show');
        }
      },
      error: function error(resp) {
        $('#toast-save-error').addClass('show');
      }
    });
  }); // save state

  $('.article, .console-modal').on('keyup change paste', ':input, [contenteditable=true]', function () {
    if ($('#article-title').text().length) {
      enableSave();
    } else {
      disableSave();
    }
  });
  $('.article').on('click', '.ce-settings__plugin-zone *, .ce-settings__default-zone *', function () {
    if ($('#article-title').text().length) {
      enableSave();
    } else {
      disableSave();
    }
  });
  $('#button-generate-preview').click(function (event) {
    event.preventDefault();
    $.ajax({
      url: '/api/v1/preview/create/one',
      method: 'POST',
      data: {
        entity: 'building',
        entityID: $('#building-id').val()
      },
      success: function success(data) {
        // set preview link in modal
        $('#preview-link').val(data.link); // open modal

        $('#modal-preview').foundation('open');
      },
      error: function error(resp) {
        console.error(resp);
      }
    });
  });
});

var renderLocation = function renderLocation(location) {
  var found = false,
      itemExists = false;
  $('.location-item').each(function () {
    if ($(this).data('locationid') == location.id) {
      itemExists = true;
      return false;
    }

    if ($(this).text() > location.title) {
      found = true;
      $(this).before(locationToDOM(location));
      return false;
    }
  });

  if (!(found || itemExists)) {
    if ($('.location-item').length) {
      $('.location-item').last().after(locationToDOM(location));
    } else {
      $('.locations-wrapper').append(locationToDOM(location));
    }
  }
};

var locationToDOM = function locationToDOM(location) {
  return "\n  <li class=\"cell location-item\" data-locationid=\"".concat(location.id, "\">\n    <a class=\"location-card\" href=\"#\">\n      <i class=\"location-card-icon fas ").concat(location.locationType && location.locationType.icon ? location.locationType.icon : 'fa-globe', "\"></i>\n      <h3 class=\"location-card-title\">").concat(location.title, "</h3>\n      <p class=\"location-card-room\">").concat(location.room, "</p>\n    </a>\n  </li>\n  ");
};

var enableSave = function enableSave() {
  $('.button-save').removeClass('disabled');
};

var disableSave = function disableSave() {
  $('.button-save').addClass('disabled');
};
"use strict";

$(document).ready(function () {
  // breadcrumbs
  $('.article-heading').on('keyup change paste', function () {
    $('.breadcrumbs li:last-child > a').text($('.article-heading').text());
  }); // articles

  $('.card-list').on('click', '.remove-article-card-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    enableSave();
  });
  $('#add-article-input').easyAutocomplete({
    url: '/api/v1/article/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 3,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#article').val(JSON.stringify($('#add-article-input').getSelectedItemData()));
      }
    },
    placeholder: 'Search for an article...',
    requestDelay: 200
  });
  $('#add-article-input').on('keyup', function (event) {
    event.preventDefault();

    if (event.which == 13 && $('#add-article-input').val().length) {
      renderArticleItem(JSON.parse($('#article').val()), 'article');
      $('#add-article-input, #article').val('');
    }
  });
  $('#add-article-button').click(function (event) {
    event.preventDefault();

    if ($('#article').val().length) {
      renderArticleItem(JSON.parse($('#article').val()), 'article');
      $('#add-article-input, #article').val('');
    }
  }); // Image change

  $('#file').change(function () {
    $('#img-changed').val('true');

    if ($('#file') && $('#file')[0] && $('#file')[0].files && $('#file')[0].files[0]) {
      var reader = new FileReader();

      reader.onload = function (event2) {
        $('#file-img').css('background-image', "url('".concat(event2.target.result, "')"));
      };

      reader.readAsDataURL($('#file')[0].files[0]);
    }
  }); // save

  $('.button-save').click(function (event) {
    event.preventDefault();

    if ($(event.currentTarget).hasClass('disabled')) {
      return false;
    }

    var articles = $('.article-card-item').map(function (index, value) {
      return $(value).data('articleid');
    }).toArray();
    var fd = new FormData();
    fd.append('title', $('#article-title').text());
    fd.append('descriptionShort', $('#article-summary').text());
    fd.append('link', $('#link').val());
    fd.append('idMyAppPhase', $('#phase').val());
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = articles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var article = _step.value;
        fd.append('articles[]', article);
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

    if ($('#img-changed').val() === 'true') {
      fd.append('fileupload', $('#file')[0].files[0]);
    }

    $.ajax({
      url: $('#update-endpoint').val(),
      method: $('#update-method').val(),
      contentType: false,
      processData: false,
      data: fd,
      success: function success(data) {
        disableSave();

        if (data.created) {
          window.location.replace('/app/' + data.app.id);
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
        entity: 'app',
        entityID: $('#app-id').val()
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
}); // helpers

var renderArticleItem = function renderArticleItem(item) {
  var found = false,
      articleItemExists = false;
  $('.article-card-item').each(function () {
    if ($(this).data('articleid') == item.id) {
      articleItemExists = true;
      return false;
    }

    if ($(this).find('h3').first().text() > item.title) {
      found = true;
      $(this).before(articleItemToDOM(item, true));
      return false;
    }
  });

  if (!(found || articleItemExists)) {
    if ($('.article-card-item').length) {
      $('.article-card-item').last().after(articleItemToDOM(item, true));
    } else {
      $('.article-cards-wrapper').append(articleItemToDOM(item, true));
    }
  }
};

var articleItemToDOM = function articleItemToDOM(item, renderRemoveButton) {
  renderRemoveButton = renderRemoveButton != undefined ? renderRemoveButton : false;
  return "<li data-articleid=\"".concat(item.id, "\" class=\"cell article-card-item\">\n  <a class=\"article-card\" href=\"#\">\n    <h3 class=\"article-card-title\">").concat(item.title, "</h3>\n    ").concat(renderRemoveButton ? '<button class=\'remove-article-card-button\'><i class=\'fas fa-times-circle\'></i></button>' : '', "\n  </a>\n  </li>");
};

var enableSave = function enableSave() {
  $('.button-save').removeClass('disabled');
};

var disableSave = function disableSave() {
  $('.button-save').addClass('disabled');
};
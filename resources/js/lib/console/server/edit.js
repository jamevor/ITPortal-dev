"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

$(document).ready(function () {
  // breadcrumbs
  $('.article-heading').on('keyup change paste', function () {
    $('.breadcrumbs li:last-child > a').text($('.article-heading').text());
  }); // tags

  $('#add-tag-input').easyAutocomplete({
    url: '/api/v1/tag/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 2,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#tag').val(JSON.stringify($('#add-tag-input').getSelectedItemData()));
      }
    },
    requestDelay: 200
  });
  $('#add-tag-input').on('keyup', function (event) {
    event.preventDefault();

    if (event.which == 13 && $('#add-tag-input').val().length) {
      renderTag(JSON.parse($('#tag').val()));
      $('#add-tag-input, #tag').val('');
    }
  });
  $('.tags').on('click', '.remove-tag-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    enableSave();
  }); // audiences

  $('#add-audience-input').easyAutocomplete({
    url: '/api/v1/audience/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 2,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#audience').val(JSON.stringify($('#add-audience-input').getSelectedItemData()));
      }
    },
    requestDelay: 200
  });
  $('#add-audience-input').on('keyup', function (event) {
    event.preventDefault();

    if (event.which == 13 && $('#add-audience-input').val().length) {
      renderAudience(JSON.parse($('#audience').val()));
      $('#add-audience-input, #audience').val('');
    }
  });
  $('.audience').on('click', '.remove-audience-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    enableSave();
  }); // aliases

  $('#add-alias-input').easyAutocomplete({
    url: '/api/v1/alias/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 2,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#alias').val(JSON.stringify($('#add-alias-input').getSelectedItemData()));
      }
    },
    requestDelay: 200
  });
  $('#add-alias-input').on('keyup', function (event) {
    event.preventDefault();

    if (event.which == 13 && $('#add-alias-input').val().length) {
      renderAlias(JSON.parse($('#alias').val()));
      $('#add-alias-input, #alias').val('');
    }
  });
  $('.alias').on('click', '.remove-alias-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    enableSave();
  }); // software

  $('#add-software-input').easyAutocomplete({
    url: '/api/v1/software/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 3,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#software').val(JSON.stringify($('#add-software-input').getSelectedItemData()));
      }
    },
    placeholder: 'Search for software...',
    requestDelay: 200
  });
  $('#add-software-button').click(function (event) {
    event.preventDefault();

    if ($('#software').val().length) {
      renderSoftware(JSON.parse($('#software').val()));
      $('#software, #add-software-input').val('');
    }
  });
  $('#softwareTable tbody').on('click', '.button-remove-software', function (event) {
    window.softwareTable.row($(event.currentTarget).closest('tr')).remove();
    window.softwareTable.draw();
    enableSave();
  });
  /**
    *
    *
    * Related items
    *
    *
    */

  $('.console-modal').on('click', '.remove-related-item-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    enableSave();
  });
  $('#add-package-input').easyAutocomplete({
    url: '/api/v1/package/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 3,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#package').val(JSON.stringify($('#add-package-input').getSelectedItemData()));
      }
    },
    placeholder: 'Search for a package...',
    requestDelay: 200
  });
  $('#add-package-button').click(function (event) {
    event.preventDefault();

    if ($('#package').val().length) {
      addRelationshipItem(JSON.parse($('#package').val()), 'package');
      $('#package', '#add-package-input').val('');
    }
  });
  $('.console-modal').on('click', '.remove-related-item-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    enableSave();
  }); // save

  $('.button-save').click(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(event) {
      var tags, audiences, aliases, software, packages;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              event.preventDefault();

              if (!$(event.currentTarget).hasClass('disabled')) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", false);

            case 3:
              tags = $('.tags').children('li.tag').map(function (index, value) {
                return $(value).data('tagid');
              }).toArray();
              audiences = $('.audience').children('li.audience-item').map(function (index, value) {
                return $(value).data('audienceid');
              }).toArray();
              aliases = $('.alias').children('li.alias-item').map(function (index, value) {
                return $(value).data('aliasid');
              }).toArray();
              software = window.softwareTable.columns(0).data().eq(0).unique().toArray(); // related items

              packages = $('.packages-wrapper').children('li.package-item').map(function (index, value) {
                return $(value).data('packageid');
              }).toArray();
              $.ajax({
                url: $('#update-endpoint').val(),
                method: $('#update-method').val(),
                data: {
                  title: $('#article-title').text(),
                  descriptionShort: $('#article-summary').text(),
                  idServerPhase: $('#phase').val(),
                  requirements: $('#requirements').text(),
                  host: $('#host').val(),
                  tags: tags,
                  audiences: audiences,
                  aliases: aliases,
                  software: software,
                  packages: packages
                },
                success: function success(data) {
                  disableSave();

                  if (data.created) {
                    window.location.replace('/server/' + data.server.id);
                  } else {
                    $('#toast-save-success').addClass('show');
                  }
                },
                error: function error(resp) {
                  $('#toast-save-error').addClass('show');
                }
              });

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()); // save state

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
        entity: 'server',
        entityID: $('#server-id').val()
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

var renderTag = function renderTag(tag) {
  var found = false,
      tagExists = false;
  $('.tags').children('.tag').each(function () {
    if ($(this).data('tagid') == tag.id) {
      tagExists = true;
      return false;
    }

    if ($(this).children('a').text() > tag.title) {
      found = true;
      $(this).before(tagToDOM(tag));
      return false;
    }
  });

  if (!(found || tagExists)) {
    if ($('.tags').children('.tag').length) {
      $('.tags').children('.tag').last().before(tagToDOM(tag));
    } else {
      $('.tags').children().last().before(tagToDOM(tag));
    }
  }
};

var tagToDOM = function tagToDOM(tag) {
  return "<li data-tagid=\"".concat(tag.id, "\" class=\"tag\"><a href=\"#\">").concat(tag.title, "<button class='remove-tag-button'><i class='fas fa-times-circle'></i></button></a></li>");
};

var renderAudience = function renderAudience(audience) {
  var found = false,
      audienceExists = false;
  $('.audience').children('.audience-item').each(function () {
    if ($(this).data('audienceid') == audience.id) {
      audienceExists = true;
      return false;
    }

    if ($(this).children('a').text() > audience.title) {
      found = true;
      $(this).before(audienceToDOM(audience));
      return false;
    }
  });

  if (!(found || audienceExists)) {
    if ($('.audience').children('.audience-item').length) {
      $('.audience').children('.audience-item').last().before(audienceToDOM(audience));
    } else {
      $('.audience').children().last().before(audienceToDOM(audience));
    }
  }
};

var audienceToDOM = function audienceToDOM(audience) {
  return "<li data-audienceid=\"".concat(audience.id, "\" class=\"audience-item\"><a href=\"#\">").concat(audience.title, "<button class='remove-audience-button'><i class='fas fa-times-circle'></i></button></a></li>");
};

var renderAlias = function renderAlias(alias) {
  var found = false,
      aliasExists = false;
  $('.alias').children('.alias-item').each(function () {
    if ($(this).data('aliasid') == alias.id) {
      aliasExists = true;
      return false;
    }

    if ($(this).children('a').text() > alias.title) {
      found = true;
      $(this).before(aliasToDOM(alias));
      return false;
    }
  });

  if (!(found || aliasExists)) {
    if ($('.alias').children('.alias-item').length) {
      $('.alias').children('.alias-item').last().before(aliasToDOM(alias));
    } else {
      $('.alias').children().last().before(aliasToDOM(alias));
    }
  }
};

var aliasToDOM = function aliasToDOM(alias) {
  return "<li data-aliasid=\"".concat(alias.id, "\" class=\"alias-item\"><a href=\"#\">").concat(alias.title, "<button class='remove-alias-button'><i class='fas fa-times-circle'></i></button></a></li>");
};

var renderSoftware = function renderSoftware(software) {
  var found = false;
  window.softwareTable.rows().every(function () {
    if (this.data()[0] == software.id) {
      found = true;
      return false;
    }
  });

  if (!found) {
    window.softwareTable.row.add([software.id, software.title ? "<a href='#'>".concat(software.title, "</a>") : '', software.version ? software.version : '', software.publisher ? software.publisher : '', '<button class=\'button-remove-software\'><i class=\'fas fa-unlink\'></i> Remove</button>']);
    window.softwareTable.draw();
  }
};

var addRelationshipItem = function addRelationshipItem(item, type) {
  var found = false,
      itemExists = false;
  $(".".concat(type, "-item")).each(function () {
    if ($(this).data("".concat(type, "id")) == item.id) {
      itemExists = true;
      return false;
    }

    if ($(this).text() > item.title) {
      found = true;
      $(this).before(relatedItemToDOM(item, type));
      return false;
    }
  });

  if (!(found || itemExists)) {
    if ($(".".concat(type, "-item")).length) {
      $(".".concat(type, "-item")).last().after(relatedItemToDOM(item, type));
    } else {
      $(".".concat(type, "s-wrapper")).append(relatedItemToDOM(item, type));
    }
  }
};

var relatedItemToDOM = function relatedItemToDOM(item, type) {
  return "<li data-".concat(type, "id=\"").concat(item.id, "\" class=\"").concat(type, "-item related-item\">").concat(item.title, "<button class='remove-related-item-button'><i class='fas fa-times'></i> Remove</button></li>");
};

var enableSave = function enableSave() {
  $('.button-save').removeClass('disabled');
};

var disableSave = function disableSave() {
  $('.button-save').addClass('disabled');
};
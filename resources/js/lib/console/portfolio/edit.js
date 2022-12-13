"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* global EditorJS, Header, List, InlineCode, ListIndent, ListOutdent, ListStyleToggle, ImageTool */
$(document).ready(function () {
  // editor js instances
  var descriptionLongEditor = new EditorJS({
    holder: 'descriptionLong',
    placeholder: 'Begin your description here...',
    minHeight: 1,
    tools: {
      paragraph: {
        inlineToolbar: ['bold', 'italic']
      },
      header: {
        class: Header,
        config: {
          minHeader: 3,
          maxHeader: 6,
          defaultLevel: 3
        }
      },
      list: {
        class: List,
        inlineToolbar: ['bold', 'italic', 'inlineCode', 'outdent', 'indent', 'styleToggle']
      },
      inlineCode: {
        class: InlineCode
      },
      indent: {
        class: ListIndent
      },
      outdent: {
        class: ListOutdent
      },
      styleToggle: {
        class: ListStyleToggle
      },
      image: {
        class: ImageTool,
        config: {
          field: 'fileupload',
          endpoints: {
            byFile: '/api/v1/file-upload/create/one',
            byUrl: '/api/v1/file-upload/create/one'
          },
          additionalRequestData: {
            via: 'editorjs'
          }
        }
      }
    },
    data: window.editorjs_initialize_data.descriptionLong
  }); // breadcrumbs

  $('.article-heading').on('keyup change paste', function () {
    $('.breadcrumbs li:last-child > a').text($('.article-heading').text());
  });
  $('#icon').change(function () {
    $('#portfolio-icon').removeClass();
    $('#portfolio-icon').addClass(['fas', 'fa-4x', $('#icon').val() || 'fa-globe']);
  }); // actions

  $('#actionTitle').easyAutocomplete({
    url: '/api/v1/action/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 2,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#action').val(JSON.stringify($('#actionTitle').getSelectedItemData()));
      },
      showAnimation: {
        type: 'slide',
        time: 300,
        callback: function callback() {}
      },
      hideAnimation: {
        type: 'slide',
        time: 300,
        callback: function callback() {}
      }
    },
    template: {
      type: 'custom',
      method: function method(value, item) {
        return actionToDOM(item, false);
      }
    },
    placeholder: 'Search for an action...',
    requestDelay: 200
  });
  $('#add-action-button').click(function (event) {
    event.preventDefault();

    if ($('#action').val().length) {
      renderAction(JSON.parse($('#action').val()));
      $('#action, #actionTitle').val('');
    }
  });
  $('#link-cards-action').on('click', '.remove-action-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    enableSave();
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
  });
  /**
    * Catalog items
    */

  $('.card-list').on('click', '.remove-catalog-item-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    enableSave();
  }); // services

  $('#add-service-input').easyAutocomplete({
    url: '/api/v1/service/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 3,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#service').val(JSON.stringify($('#add-service-input').getSelectedItemData()));
      }
    },
    placeholder: 'Search for a service...',
    requestDelay: 200
  });
  $('#add-service-input').on('keyup', function (event) {
    event.preventDefault();

    if (event.which == 13 && $('#add-service-input').val().length) {
      renderCatalogItem(JSON.parse($('#service').val()), 'service');
      $('#add-service-input, #service').val('');
    }
  });
  $('#add-service-button').click(function (event) {
    event.preventDefault();

    if ($('#service').val().length) {
      renderCatalogItem(JSON.parse($('#service').val()), 'service');
      $('#add-service-input, #service').val('');
    }
  }); // save

  $('.button-save').click(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(event) {
      var actions, tags, aliases, services;
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
              actions = $('#link-cards-action').children('li').map(function (index, value) {
                return $(value).data('actionid');
              }).toArray();
              tags = $('.tags').children('li.tag').map(function (index, value) {
                return $(value).data('tagid');
              }).toArray();
              aliases = $('.alias').children('li.alias-item').map(function (index, value) {
                return $(value).data('aliasid');
              }).toArray();
              services = $('.service-card-item').map(function (index, value) {
                return $(value).data('serviceid');
              }).toArray();
              _context.t0 = $;
              _context.t1 = $('#update-endpoint').val();
              _context.t2 = $('#update-method').val();
              _context.t3 = $('#article-title').text();
              _context.t4 = $('#article-summary').text();
              _context.next = 14;
              return descriptionLongEditor.save();

            case 14:
              _context.t5 = _context.sent;
              _context.t6 = $('#phase').val();
              _context.t7 = $('#status').val();
              _context.t8 = $('#icon').val();
              _context.t9 = $('#color').val().replace('#', ' ').trim();
              _context.t10 = actions;
              _context.t11 = tags;
              _context.t12 = aliases;
              _context.t13 = services;
              _context.t14 = {
                title: _context.t3,
                descriptionShort: _context.t4,
                descriptionLong: _context.t5,
                idCatalogPhase: _context.t6,
                idCatalogStatus: _context.t7,
                icon: _context.t8,
                color: _context.t9,
                actions: _context.t10,
                tags: _context.t11,
                aliases: _context.t12,
                services: _context.t13
              };

              _context.t15 = function success(data) {
                disableSave();

                if (data.created) {
                  window.location.replace('/portfolio/' + data.portfolio.id);
                } else {
                  $('#toast-save-success').addClass('show');
                }
              };

              _context.t16 = function error(resp) {
                $('#toast-save-error').addClass('show');
              };

              _context.t17 = {
                url: _context.t1,
                method: _context.t2,
                data: _context.t14,
                success: _context.t15,
                error: _context.t16
              };

              _context.t0.ajax.call(_context.t0, _context.t17);

            case 28:
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
        entity: 'portfolio',
        entityID: $('#portfolio-id').val()
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

var renderAction = function renderAction(action) {
  var found = false,
      actionExists = false;
  $('#link-cards-action').children().each(function () {
    if ($(this).data('actionid') == action.id) {
      actionExists = true;
      return false;
    }

    if ($(this).text() > action.title) {
      found = true;
      $(this).before(actionToDOM(action, false, true));
      return false;
    }
  });

  if (!(found || actionExists)) {
    $('#link-cards-action').append(actionToDOM(action, false, true));
  }
};

var actionToDOM = function actionToDOM(action, renderLink, renderRemoveButton) {
  renderLink = renderLink != undefined ? renderLink : true;
  renderRemoveButton = renderRemoveButton != undefined ? renderRemoveButton : false;
  return "<li data-actionid=\"".concat(action.id, "\"><a class=\"").concat(action.actionType.title, "\" target=\"_self\" href=\"").concat(renderLink ? action.link : '#', "\">").concat(action.title).concat(renderRemoveButton ? '<button class=\'remove-action-button\'><i class=\'fas fa-times-circle\'></i></button>' : '', "</a></li>");
};

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

var renderCatalogItem = function renderCatalogItem(item, type) {
  var found = false,
      catalogItemExists = false;
  $(".".concat(type, "-card-item")).each(function () {
    if ($(this).data("".concat(type, "id")) == item.id) {
      catalogItemExists = true;
      return false;
    }

    if ($(this).find('h3').first().text() > item.title) {
      found = true;
      $(this).before(catalogItemToDOM(item, type, true, $(this).hasClass('compact')));
      return false;
    }
  });

  if (!(found || catalogItemExists)) {
    if ($(".".concat(type, "-card-item")).length) {
      $(".".concat(type, "-card-item")).last().after(catalogItemToDOM(item, type, true, $(".".concat(type, "-card-item")).last().hasClass('compact')));
    } else {
      $(".".concat(type, "-cards-wrapper")).append(catalogItemToDOM(item, type, true, true));
    }
  }
};

var catalogItemToDOM = function catalogItemToDOM(item, type, renderRemoveButton, compact) {
  renderRemoveButton = renderRemoveButton != undefined ? renderRemoveButton : false;
  return "<li data-".concat(type, "id=\"").concat(item.id, "\" class=\"cell ").concat(type, "-card-item").concat(compact ? ' compact' : '', "\">\n    <a class=\"service-card\" href=\"#\">\n      <i class=\"service-card-icon fas ").concat(item.icon, "\"></i>\n      <h3 class=\"service-card-title\">").concat(item.title, "</h3>\n      ").concat(renderRemoveButton ? '<button class=\'remove-catalog-item-button\'><i class=\'fas fa-times-circle\'></i></button>' : '', "\n    </a>\n  </li>");
};

var enableSave = function enableSave() {
  $('.button-save').removeClass('disabled');
};

var disableSave = function disableSave() {
  $('.button-save').addClass('disabled');
};
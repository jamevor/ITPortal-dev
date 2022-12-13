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
    $('#service-icon').removeClass();
    $('#service-icon').addClass(['fas', 'fa-4x', $('#icon').val() || 'fa-globe']);
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
  });
  /**
    * Catalog items
    */

  $('.card-list').on('click', '.remove-catalog-item-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    enableSave();
  }); // components

  $('#add-component-input').easyAutocomplete({
    url: '/api/v1/component/get/many?service=null',
    getValue: 'title',
    list: {
      maxNumberOfElements: 3,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#component').val(JSON.stringify($('#add-component-input').getSelectedItemData()));
      }
    },
    placeholder: 'Search for a component...',
    requestDelay: 200
  });
  $('#add-component-input').on('keyup', function (event) {
    event.preventDefault();

    if (event.which == 13 && $('#add-component-input').val().length) {
      renderCatalogItem(JSON.parse($('#component').val()), 'component');
      $('#add-component-input, #component').val('');
    }
  });
  $('#add-component-button').click(function (event) {
    event.preventDefault();

    if ($('#component').val().length) {
      renderCatalogItem(JSON.parse($('#component').val()), 'component');
      $('#add-component-input, #component').val('');
    }
  }); // portfolios

  $('#add-portfolio-input').easyAutocomplete({
    url: '/api/v1/portfolio/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 3,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#portfolio').val(JSON.stringify($('#add-portfolio-input').getSelectedItemData()));
      }
    },
    placeholder: 'Search for a portfolio...',
    requestDelay: 200
  });
  $('#add-portfolio-input').on('keyup', function (event) {
    event.preventDefault();

    if (event.which == 13 && $('#add-portfolio-input').val().length) {
      renderCatalogItem(JSON.parse($('#portfolio').val()), 'portfolio');
      $('#add-portfolio-input, #portfolio').val('');
    }
  });
  $('#add-portfolio-button').click(function (event) {
    event.preventDefault();

    if ($('#portfolio').val().length) {
      renderCatalogItem(JSON.parse($('#portfolio').val()), 'portfolio');
      $('#add-portfolio-input, #portfolio').val('');
    }
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
  }); // save

  $('.button-save').click(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(event) {
      var actions, tags, audiences, aliases, components, articles, portfolios;
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
              audiences = $('.audience').children('li.audience-item').map(function (index, value) {
                return $(value).data('audienceid');
              }).toArray();
              aliases = $('.alias').children('li.alias-item').map(function (index, value) {
                return $(value).data('aliasid');
              }).toArray();
              components = $('.component-card-item').map(function (index, value) {
                return $(value).data('componentid');
              }).toArray();
              articles = $('.article-card-item').map(function (index, value) {
                return $(value).data('articleid');
              }).toArray();
              portfolios = $('.portfolio-card-item').map(function (index, value) {
                return $(value).data('portfolioid');
              }).toArray();
              _context.t0 = $;
              _context.t1 = $('#update-endpoint').val();
              _context.t2 = $('#update-method').val();
              _context.t3 = $('#article-title').text();
              _context.t4 = $('#article-summary').text();
              _context.next = 17;
              return descriptionLongEditor.save();

            case 17:
              _context.t5 = _context.sent;
              _context.t6 = $('#phase').val();
              _context.t7 = $('#status').val();
              _context.t8 = $('#availability').text();
              _context.t9 = $('#cost').text();
              _context.t10 = $('#support').text();
              _context.t11 = $('#requirements').text();
              _context.t12 = $('#requesting').text();
              _context.t13 = $('#icon').val();
              _context.t14 = $('#color').val().replace('#', ' ').trim();
              _context.t15 = actions;
              _context.t16 = tags;
              _context.t17 = audiences;
              _context.t18 = aliases;
              _context.t19 = components;
              _context.t20 = articles;
              _context.t21 = portfolios;
              _context.t22 = {
                title: _context.t3,
                descriptionShort: _context.t4,
                descriptionLong: _context.t5,
                idCatalogPhase: _context.t6,
                idCatalogStatus: _context.t7,
                availability: _context.t8,
                cost: _context.t9,
                support: _context.t10,
                requirements: _context.t11,
                requesting: _context.t12,
                icon: _context.t13,
                color: _context.t14,
                actions: _context.t15,
                tags: _context.t16,
                audiences: _context.t17,
                aliases: _context.t18,
                components: _context.t19,
                articles: _context.t20,
                portfolios: _context.t21
              };

              _context.t23 = function success(data) {
                disableSave();

                if (data.created) {
                  window.location.replace('/service/' + data.service.id);
                } else {
                  $('#toast-save-success').addClass('show');
                }
              };

              _context.t24 = function error(resp) {
                $('#toast-save-error').addClass('show');
              };

              _context.t25 = {
                url: _context.t1,
                method: _context.t2,
                data: _context.t22,
                success: _context.t23,
                error: _context.t24
              };

              _context.t0.ajax.call(_context.t0, _context.t25);

            case 39:
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
        entity: 'service',
        entityID: $('#service-id').val()
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
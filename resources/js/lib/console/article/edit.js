"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* global EditorJS, Header, List, InlineCode, ListIndent, ListOutdent, ListStyleToggle, ImageTool, CodeTool, Note */
$(document).ready(function () {
  // editor js instances
  var tools = {
    paragraph: {
      inlineToolbar: ['bold', 'italic']
    },
    header: {
      class: Header,
      config: {
        minHeader: 2,
        maxHeader: 6,
        defaultLevel: 2
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
    },
    code: {
      class: CodeTool
    },
    note: {
      class: Note,
      inlineToolbar: ['bold', 'italic', 'inlineCode'],
      config: {
        titlePlaceholder: 'Note Title',
        messagePlaceholder: 'Note Message'
      }
    }
  };
  var articleMainEditor = new EditorJS({
    holder: 'articleMain',
    placeholder: 'Begin your article here...',
    tools: tools,
    data: window.editorjs_initialize_data.articleMain
  });
  var articleAdvancedEditor = new EditorJS({
    holder: 'articleAdvanced',
    placeholder: 'Begin your article here...',
    tools: tools,
    data: window.editorjs_initialize_data.articleAlternate
  });
  var articleInternalEditor = new EditorJS({
    holder: 'articleInternal',
    placeholder: 'Begin your article here...',
    tools: tools,
    data: window.editorjs_initialize_data.articleInternal
  }); // Image change

  $('#file').change(function () {
    $('#img-changed').val('true');
    $('#button-remove-image').show();
    $('#img-removed').val('false');

    if ($('#file') && $('#file')[0] && $('#file')[0].files && $('#file')[0].files[0]) {
      var reader = new FileReader();

      reader.onload = function (event2) {
        $('.section-img').css('background-image', "url('".concat(event2.target.result, "')"));
      };

      reader.readAsDataURL($('#file')[0].files[0]);
    }

    enableSave();
  });
  $('#button-remove-image').click(function (event) {
    event.preventDefault();
    $('.section-img').css('background-image', '');
    $('#button-remove-image').hide();
    $('#img-removed').val('true');
    enableSave();
  }); // breadcrumbs

  $('.article-heading').on('keyup change paste', function () {
    $('.breadcrumbs li:last-child > a').text($('.article-heading').text());
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
  });
  /**
    * Catalog items
    */

  $('.link-cards').on('click', '.remove-catalog-item-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    enableSave();
  }); // services

  $('#add-service-input').easyAutocomplete({
    url: '/api/v1/service/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 2,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#service').val(JSON.stringify($('#add-service-input').getSelectedItemData()));
      }
    },
    template: {
      type: 'custom',
      method: function method(value, item) {
        return catalogItemToDOM(item, 'service', false, true);
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
  }); // components

  $('#add-component-input').easyAutocomplete({
    url: '/api/v1/component/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 2,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#component').val(JSON.stringify($('#add-component-input').getSelectedItemData()));
      }
    },
    template: {
      type: 'custom',
      method: function method(value, item) {
        return catalogItemToDOM(item, 'component', false, true);
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
  }); // softwares

  $('#add-software-input').easyAutocomplete({
    url: '/api/v1/software/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 2,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#software').val(JSON.stringify($('#add-software-input').getSelectedItemData()));
      }
    },
    template: {
      type: 'custom',
      method: function method(value, item) {
        return catalogItemToDOM(item, 'software', false);
      }
    },
    placeholder: 'Search for software...',
    requestDelay: 200
  });
  $('#add-software-input').on('keyup', function (event) {
    event.preventDefault();

    if (event.which == 13 && $('#add-software-input').val().length) {
      renderCatalogItem(JSON.parse($('#software').val()), 'software');
      $('#add-software-input, #software').val('');
    }
  });
  $('#add-software-button').click(function (event) {
    event.preventDefault();

    if ($('#software').val().length) {
      renderCatalogItem(JSON.parse($('#software').val()), 'software');
      $('#add-software-input, #software').val('');
    }
  }); // save

  $('.button-save').click(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(event) {
      var actions, tags, audiences, services, components, softwares, fd, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, action, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, tag, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, audience, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, service, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, component, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, software;

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
              services = $('.service-item').not('.ignore').map(function (index, value) {
                return $(value).data('serviceid');
              }).toArray();
              components = $('.component-item').not('.ignore').map(function (index, value) {
                return $(value).data('componentid');
              }).toArray();
              softwares = $('.software-item').map(function (index, value) {
                return $(value).data('softwareid');
              }).toArray();
              fd = new FormData();
              fd.append('title', $('#article-title').text());
              fd.append('descriptionShort', $('#article-summary').text());
              fd.append('idArticlePhase', $('#phase').val());
              fd.append('requireAuth', $('#requireAuth').is(':checked'));
              _context.t0 = fd;
              _context.t1 = JSON;
              _context.next = 18;
              return articleMainEditor.save();

            case 18:
              _context.t2 = _context.sent;
              _context.t3 = _context.t1.stringify.call(_context.t1, _context.t2);

              _context.t0.append.call(_context.t0, 'content', _context.t3);

              _context.t4 = fd;
              _context.t5 = JSON;
              _context.next = 25;
              return articleAdvancedEditor.save();

            case 25:
              _context.t6 = _context.sent;
              _context.t7 = _context.t5.stringify.call(_context.t5, _context.t6);

              _context.t4.append.call(_context.t4, 'contentAlt', _context.t7);

              _context.t8 = fd;
              _context.t9 = JSON;
              _context.next = 32;
              return articleInternalEditor.save();

            case 32:
              _context.t10 = _context.sent;
              _context.t11 = _context.t9.stringify.call(_context.t9, _context.t10);

              _context.t8.append.call(_context.t8, 'contentInternal', _context.t11);

              fd.append('useLegacy', $('#useLegacy').is(':checked'));
              fd.append('contentLegacy', $('#contentLegacy').val());
              fd.append('contentAltLegacy', $('#contentAltLegacy').val());
              fd.append('contentInternalLegacy', $('#contentInternalLegacy').val());
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 42;

              for (_iterator = actions[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                action = _step.value;
                fd.append('actions[]', action);
              }

              _context.next = 50;
              break;

            case 46:
              _context.prev = 46;
              _context.t12 = _context["catch"](42);
              _didIteratorError = true;
              _iteratorError = _context.t12;

            case 50:
              _context.prev = 50;
              _context.prev = 51;

              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }

            case 53:
              _context.prev = 53;

              if (!_didIteratorError) {
                _context.next = 56;
                break;
              }

              throw _iteratorError;

            case 56:
              return _context.finish(53);

            case 57:
              return _context.finish(50);

            case 58:
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context.prev = 61;

              for (_iterator2 = tags[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                tag = _step2.value;
                fd.append('tags[]', tag);
              }

              _context.next = 69;
              break;

            case 65:
              _context.prev = 65;
              _context.t13 = _context["catch"](61);
              _didIteratorError2 = true;
              _iteratorError2 = _context.t13;

            case 69:
              _context.prev = 69;
              _context.prev = 70;

              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }

            case 72:
              _context.prev = 72;

              if (!_didIteratorError2) {
                _context.next = 75;
                break;
              }

              throw _iteratorError2;

            case 75:
              return _context.finish(72);

            case 76:
              return _context.finish(69);

            case 77:
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context.prev = 80;

              for (_iterator3 = audiences[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                audience = _step3.value;
                fd.append('audiences[]', audience);
              }

              _context.next = 88;
              break;

            case 84:
              _context.prev = 84;
              _context.t14 = _context["catch"](80);
              _didIteratorError3 = true;
              _iteratorError3 = _context.t14;

            case 88:
              _context.prev = 88;
              _context.prev = 89;

              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }

            case 91:
              _context.prev = 91;

              if (!_didIteratorError3) {
                _context.next = 94;
                break;
              }

              throw _iteratorError3;

            case 94:
              return _context.finish(91);

            case 95:
              return _context.finish(88);

            case 96:
              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context.prev = 99;

              for (_iterator4 = services[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                service = _step4.value;
                fd.append('services[]', service);
              }

              _context.next = 107;
              break;

            case 103:
              _context.prev = 103;
              _context.t15 = _context["catch"](99);
              _didIteratorError4 = true;
              _iteratorError4 = _context.t15;

            case 107:
              _context.prev = 107;
              _context.prev = 108;

              if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                _iterator4.return();
              }

            case 110:
              _context.prev = 110;

              if (!_didIteratorError4) {
                _context.next = 113;
                break;
              }

              throw _iteratorError4;

            case 113:
              return _context.finish(110);

            case 114:
              return _context.finish(107);

            case 115:
              _iteratorNormalCompletion5 = true;
              _didIteratorError5 = false;
              _iteratorError5 = undefined;
              _context.prev = 118;

              for (_iterator5 = components[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                component = _step5.value;
                fd.append('components[]', component);
              }

              _context.next = 126;
              break;

            case 122:
              _context.prev = 122;
              _context.t16 = _context["catch"](118);
              _didIteratorError5 = true;
              _iteratorError5 = _context.t16;

            case 126:
              _context.prev = 126;
              _context.prev = 127;

              if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                _iterator5.return();
              }

            case 129:
              _context.prev = 129;

              if (!_didIteratorError5) {
                _context.next = 132;
                break;
              }

              throw _iteratorError5;

            case 132:
              return _context.finish(129);

            case 133:
              return _context.finish(126);

            case 134:
              _iteratorNormalCompletion6 = true;
              _didIteratorError6 = false;
              _iteratorError6 = undefined;
              _context.prev = 137;

              for (_iterator6 = softwares[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                software = _step6.value;
                fd.append('softwares[]', software);
              }

              _context.next = 145;
              break;

            case 141:
              _context.prev = 141;
              _context.t17 = _context["catch"](137);
              _didIteratorError6 = true;
              _iteratorError6 = _context.t17;

            case 145:
              _context.prev = 145;
              _context.prev = 146;

              if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                _iterator6.return();
              }

            case 148:
              _context.prev = 148;

              if (!_didIteratorError6) {
                _context.next = 151;
                break;
              }

              throw _iteratorError6;

            case 151:
              return _context.finish(148);

            case 152:
              return _context.finish(145);

            case 153:
              if ($('#img-changed').val() === 'true') {
                fd.append('fileupload', $('#file')[0].files[0]);
              }

              fd.append('imageRemoved', $('#img-removed').val());
              $.ajax({
                url: $('#update-endpoint').val(),
                method: $('#update-method').val(),
                contentType: false,
                processData: false,
                data: fd,
                success: function success(data) {
                  disableSave();

                  if (data.created) {
                    window.location.replace('/article/' + data.article.id);
                  } else {
                    $('#toast-save-success').addClass('show');
                  }
                },
                error: function error(resp) {
                  $('#toast-save-error').addClass('show');
                }
              });

            case 156:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[42, 46, 50, 58], [51,, 53, 57], [61, 65, 69, 77], [70,, 72, 76], [80, 84, 88, 96], [89,, 91, 95], [99, 103, 107, 115], [108,, 110, 114], [118, 122, 126, 134], [127,, 129, 133], [137, 141, 145, 153], [146,, 148, 152]]);
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
        entity: 'article',
        entityID: $('#article-id').val()
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

var renderCatalogItem = function renderCatalogItem(item, type) {
  var found = false,
      catalogItemExists = false;
  $(".catalog-items > li.".concat(type, "-item")).each(function () {
    if ($(this).data("".concat(type, "id")) == item.id) {
      catalogItemExists = true;
      return false;
    }

    if ($(this).children('a').text() > item.title) {
      found = true;
      $(this).before(catalogItemToDOM(item, type, true));
      return false;
    }
  });

  if (!(found || catalogItemExists)) {
    if ($(".catalog-items > li.".concat(type, "-item")).length) {
      $(".catalog-items > li.".concat(type, "-item")).last().after(catalogItemToDOM(item, type, true));
    } else {
      $("#add-".concat(type, "-input")).closest('li').after(catalogItemToDOM(item, type, true));
    }
  }
};

var catalogItemToDOM = function catalogItemToDOM(item, type, renderRemoveButton, ignoreData) {
  renderRemoveButton = renderRemoveButton != undefined ? renderRemoveButton : false;
  ignoreData = ignoreData != undefined ? ignoreData : false;
  return "<li data-".concat(type, "id=\"").concat(item.id, "\" class=\"").concat(type, "-item").concat(ignoreData ? ' ignore' : '', "\"><a class=\"catalog\" href=\"#\">").concat(item.title).concat(renderRemoveButton ? '<button class=\'remove-catalog-item-button\'><i class=\'fas fa-times-circle\'></i></button>' : '', "</a></li>");
};

var enableSave = function enableSave() {
  $('.button-save').removeClass('disabled');
};

var disableSave = function disableSave() {
  $('.button-save').addClass('disabled');
};
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* global EditorJS, Header, List, InlineCode, ListIndent, ListOutdent, ListStyleToggle, ImageTool, CodeTool, Note, Table, Embed, Checklist, Quote, InlineActionLink */
$(document).ready(function () {
  // apply layouts
  $('.layout-option').click(function (event) {
    event.preventDefault();
    var template = $(this).data('layout');
    $('.layout-option').removeClass('chosen');
    $(this).addClass('chosen');

    if (template && template['spread-column-1'] && template['spread-column-2'] && template['spread-column-3']) {
      var spreadEm = function spreadEm(templateItem, templateClasses) {
        templateItem.hasClass('box') ? templateClasses += ' box' : templateClasses;
        templateItem.css({
          'opacity': 1,
          'background': 'var(--color-lane)'
        }).removeClass().addClass(function () {
          var item = $(this);
          setTimeout(function () {
            item.addClass(templateClasses).css({
              'opacity': 1,
              'background': ''
            });
          }, 200);
        });
      };

      spreadEm($('#spread-column-1'), template['spread-column-1']);
      spreadEm($('#spread-column-2'), template['spread-column-2']);
      spreadEm($('#spread-column-3'), template['spread-column-3']);
    }

    enableSave();
  }); // toggle boxes for columns

  $('.box-toggle').change(function () {
    $("#".concat($(this).data('boxtarget'))).toggleClass('box');
    enableSave();
  });
  var spreadTools = {
    paragraph: {
      inlineToolbar: ['bold', 'italic', 'inlineCode']
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
    table: {
      class: Table,
      inlineToolbar: ['bold', 'italic'],
      config: {
        rows: 2,
        cols: 2
      }
    },
    code: {
      class: CodeTool
    },
    embed: {
      class: Embed,
      inlineToolbar: false,
      config: {
        services: {
          youtube: true
        }
      }
    },
    checklist: {
      class: Checklist,
      inlineToolbar: ['bold', 'italic', 'inlineCode']
    },
    note: {
      class: Note,
      inlineToolbar: ['bold', 'italic', 'inlineCode'],
      config: {
        titlePlaceholder: 'Note Title',
        messagePlaceholder: 'Note Message'
      }
    },
    quote: {
      class: Quote,
      inlineToolbar: false,
      config: {
        quotePlaceholder: 'Enter a Quote',
        captionPlaceholder: 'Enter the Author'
      }
    },
    actionLink: {
      class: InlineActionLink,
      inlineToolbar: false
    }
  }; // editor js instances

  var column1Editor = new EditorJS({
    holder: 'spread-column-1',
    placeholder: 'Column 1...',
    tools: spreadTools,
    data: window.editorjs_initialize_data.column1
  });
  var column2Editor = new EditorJS({
    holder: 'spread-column-2',
    placeholder: 'Column 2...',
    tools: spreadTools,
    data: window.editorjs_initialize_data.column2
  });
  var column3Editor = new EditorJS({
    holder: 'spread-column-3',
    placeholder: 'Column 3...',
    tools: spreadTools,
    data: window.editorjs_initialize_data.column3
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

    $('.arrow-pulse-down').show();
    enableSave();
  });
  $('#button-remove-image').click(function (event) {
    event.preventDefault();
    $('.section-img').css('background-image', '');
    $('#button-remove-image').hide();
    $('#img-removed').val('true');
    $('.arrow-pulse-down').hide();
    enableSave();
  }); // breadcrumbs

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
  }); // save

  $('.button-save').click(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(event) {
      var tags, audiences, aliases, fd, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, tag, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, audience, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, alias;

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
              fd = new FormData();
              fd.append('title', $('#article-title').text());
              fd.append('idSpreadPhase', $('#phase').val());
              fd.append('idSpreadLayout', $('.layout-option.chosen').data('layoutid'));
              _context.t0 = fd;
              _context.t1 = JSON;
              _context.next = 14;
              return column1Editor.save();

            case 14:
              _context.t2 = _context.sent;
              _context.t3 = _context.t1.stringify.call(_context.t1, _context.t2);

              _context.t0.append.call(_context.t0, 'column1', _context.t3);

              _context.t4 = fd;
              _context.t5 = JSON;
              _context.next = 21;
              return column2Editor.save();

            case 21:
              _context.t6 = _context.sent;
              _context.t7 = _context.t5.stringify.call(_context.t5, _context.t6);

              _context.t4.append.call(_context.t4, 'column2', _context.t7);

              _context.t8 = fd;
              _context.t9 = JSON;
              _context.next = 28;
              return column3Editor.save();

            case 28:
              _context.t10 = _context.sent;
              _context.t11 = _context.t9.stringify.call(_context.t9, _context.t10);

              _context.t8.append.call(_context.t8, 'column3', _context.t11);

              fd.append('column1IsBox', $('#column1IsBox').is(':checked'));
              fd.append('column2IsBox', $('#column2IsBox').is(':checked'));
              fd.append('column3IsBox', $('#column3IsBox').is(':checked'));
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 37;

              for (_iterator = tags[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                tag = _step.value;
                fd.append('tags[]', tag);
              }

              _context.next = 45;
              break;

            case 41:
              _context.prev = 41;
              _context.t12 = _context["catch"](37);
              _didIteratorError = true;
              _iteratorError = _context.t12;

            case 45:
              _context.prev = 45;
              _context.prev = 46;

              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }

            case 48:
              _context.prev = 48;

              if (!_didIteratorError) {
                _context.next = 51;
                break;
              }

              throw _iteratorError;

            case 51:
              return _context.finish(48);

            case 52:
              return _context.finish(45);

            case 53:
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context.prev = 56;

              for (_iterator2 = audiences[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                audience = _step2.value;
                fd.append('audiences[]', audience);
              }

              _context.next = 64;
              break;

            case 60:
              _context.prev = 60;
              _context.t13 = _context["catch"](56);
              _didIteratorError2 = true;
              _iteratorError2 = _context.t13;

            case 64:
              _context.prev = 64;
              _context.prev = 65;

              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }

            case 67:
              _context.prev = 67;

              if (!_didIteratorError2) {
                _context.next = 70;
                break;
              }

              throw _iteratorError2;

            case 70:
              return _context.finish(67);

            case 71:
              return _context.finish(64);

            case 72:
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context.prev = 75;

              for (_iterator3 = aliases[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                alias = _step3.value;
                fd.append('aliases[]', alias);
              }

              _context.next = 83;
              break;

            case 79:
              _context.prev = 79;
              _context.t14 = _context["catch"](75);
              _didIteratorError3 = true;
              _iteratorError3 = _context.t14;

            case 83:
              _context.prev = 83;
              _context.prev = 84;

              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }

            case 86:
              _context.prev = 86;

              if (!_didIteratorError3) {
                _context.next = 89;
                break;
              }

              throw _iteratorError3;

            case 89:
              return _context.finish(86);

            case 90:
              return _context.finish(83);

            case 91:
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
                    window.location.replace('/spread/' + data.spread.id);
                  } else {
                    $('#toast-save-success').addClass('show');
                  }
                },
                error: function error(resp) {
                  $('#toast-save-error').addClass('show');
                }
              });

            case 94:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[37, 41, 45, 53], [46,, 48, 52], [56, 60, 64, 72], [65,, 67, 71], [75, 79, 83, 91], [84,, 86, 90]]);
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
        entity: 'spread',
        entityID: $('#spread-id').val()
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

var enableSave = function enableSave() {
  $('.button-save').removeClass('disabled');
};

var disableSave = function disableSave() {
  $('.button-save').addClass('disabled');
};
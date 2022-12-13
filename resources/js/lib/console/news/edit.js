"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* global moment, ColorConverter, EditorJS, Header, List, InlineCode, ListIndent, ListOutdent, ListStyleToggle, ImageTool */
var subTypes = window.subTypes;
$(document).ready(function () {
  // editor js instances
  var detailsEditor = new EditorJS({
    holder: 'details',
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
    data: window.editorjs_initialize_data.details
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
  }); // status listener

  $('#status').change(function () {
    // color icon title
    var selectedItem = $('#status').find('option:selected');
    var data = {
      color: $(selectedItem).data('color'),
      icon: $(selectedItem).data('icon'),
      title: $(selectedItem).data('title')
    };
    $('.news-status-card').css('background', "#".concat(data.color));
    $('.news-status-icon i').removeClass().addClass(['far', 'fa-2x', data.icon]);
    $('.news-status-title').text(data.title);
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

  $('.link-cards, .news-sub').on('click', '.remove-catalog-item-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    enableSave();
  }); // components

  $('#add-component-input').easyAutocomplete({
    url: '/api/v1/component/get/all',
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
        return catalogItemToDOM(item, 'software', false, true);
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
  }); // news sub posts

  $('.news-sub').on('change', '.news-sub-type', function () {
    var selectedItem = $(this).children('option:selected');
    var selectedItemData = {
      color: $(selectedItem).data('color'),
      colorLight: $(selectedItem).data('colorlight'),
      icon: $(selectedItem).data('icon')
    };
    var wrapper = $(this).closest('.news-sub-item').first();
    $(wrapper).find('.news-sub-item-icon').css('background', selectedItemData.color).find('i').removeClass().addClass(['far', 'fa-fw', selectedItemData.icon]);
    $(wrapper).find('.news-sub-item-event').css('background', selectedItemData.colorLight);
  });
  $('#button-add-update').click(function (event) {
    event.preventDefault();
    createNewsSub();
  }); // news sub actions

  $('.news-sub').on('click', '.button-open-news-sub-add-action-modal', function (event) {
    $('#cursor-news-sub-id').val($(event.currentTarget).closest('.news-sub-item').data('newssubid'));
  });
  $('#news-sub-action-input').easyAutocomplete({
    url: '/api/v1/action/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 2,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#news-sub-action').val(JSON.stringify($('#news-sub-action-input').getSelectedItemData()));
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
    placeholder: 'Search for an action...',
    requestDelay: 200
  });
  $('#news-sub-add-action-button').click(function (event) {
    event.preventDefault();

    if ($('#news-sub-action').val().length) {
      addActionToNewsSub($('#cursor-news-sub-id').val(), JSON.parse($('#news-sub-action').val()));
      $('#news-sub-action, #news-sub-action-input').val('');
    }
  });
  $('.news-sub').on('click', '.remove-action-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    enableSave();
  });
  $('.news-sub').on('click', '.remove-news-sub-button', function (event) {
    event.preventDefault();
    $(event.currentTarget).closest('.news-sub-item').slideUp(500, function () {
      $(this).remove();
    });
    enableSave();
  }); // save

  $('.button-save').click(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(event) {
      var actions, tags, audiences, services, components, software, newsSubs, fd, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, action, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, tag, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, audience, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, service, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, component, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, software_, i, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, newsSub, key, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, _action;

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
              software = $('.software-item').not('.ignore').map(function (index, value) {
                return $(value).data('softwareid');
              }).toArray();
              newsSubs = $('.news-sub-item').not('.timestamp').map(function (index, value) {
                return {
                  id: $(value).data('newssubid'),
                  isNew: $(value).data('isnew'),
                  newsSubType: $(value).find('.news-sub-type').first().val(),
                  title: $(value).find('.news-sub-title').first().text(),
                  descriptionShort: $(value).find('.news-sub-description-short').first().text(),
                  datePost: $(value).find('.news-sub-date-post').first().val(),
                  actions: $(value).find('.news-sub-action-item').map(function (index_, value_) {
                    return $(value_).data('actionid');
                  }).toArray()
                };
              }).toArray();
              fd = new FormData();
              fd.append('title', $('#article-title').text());
              fd.append('idNewsPhase', $('#phase').val());
              fd.append('idNewsType', $('#newsType').val());
              fd.append('idNewsStatus', $('#status').val());
              fd.append('descriptionShort', $('#article-summary').text());
              fd.append('why', $('#why').text());
              fd.append('impact', $('#impact').text());
              fd.append('benefits', $('#benefits').text());
              fd.append('actionDescription', $('#action-description').text());
              _context.t0 = fd;
              _context.t1 = JSON;
              _context.next = 24;
              return detailsEditor.save();

            case 24:
              _context.t2 = _context.sent;
              _context.t3 = _context.t1.stringify.call(_context.t1, _context.t2);

              _context.t0.append.call(_context.t0, 'details', _context.t3);

              fd.append('datePost', $('#datePost').val());
              fd.append('dateStart', $('#dateStart').val());
              fd.append('dateEnd', $('#dateEnd').val());
              fd.append('showAlert', $('#showAlert').is(':checked'));
              fd.append('isWPIToday', $('#isWPIToday').is(':checked'));
              fd.append('isPinned', $('#isPinned').is(':checked'));
              fd.append('isHome', $('#isHome').is(':checked'));

              if ($('#img-changed').val() === 'true') {
                fd.append('fileupload', $('#file')[0].files[0]);
              }

              fd.append('imageRemoved', $('#img-removed').val());
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 39;

              for (_iterator = actions[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                action = _step.value;
                fd.append('actions[]', action);
              }

              _context.next = 47;
              break;

            case 43:
              _context.prev = 43;
              _context.t4 = _context["catch"](39);
              _didIteratorError = true;
              _iteratorError = _context.t4;

            case 47:
              _context.prev = 47;
              _context.prev = 48;

              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }

            case 50:
              _context.prev = 50;

              if (!_didIteratorError) {
                _context.next = 53;
                break;
              }

              throw _iteratorError;

            case 53:
              return _context.finish(50);

            case 54:
              return _context.finish(47);

            case 55:
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context.prev = 58;

              for (_iterator2 = tags[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                tag = _step2.value;
                fd.append('tags[]', tag);
              }

              _context.next = 66;
              break;

            case 62:
              _context.prev = 62;
              _context.t5 = _context["catch"](58);
              _didIteratorError2 = true;
              _iteratorError2 = _context.t5;

            case 66:
              _context.prev = 66;
              _context.prev = 67;

              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }

            case 69:
              _context.prev = 69;

              if (!_didIteratorError2) {
                _context.next = 72;
                break;
              }

              throw _iteratorError2;

            case 72:
              return _context.finish(69);

            case 73:
              return _context.finish(66);

            case 74:
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context.prev = 77;

              for (_iterator3 = audiences[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                audience = _step3.value;
                fd.append('audiences[]', audience);
              }

              _context.next = 85;
              break;

            case 81:
              _context.prev = 81;
              _context.t6 = _context["catch"](77);
              _didIteratorError3 = true;
              _iteratorError3 = _context.t6;

            case 85:
              _context.prev = 85;
              _context.prev = 86;

              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }

            case 88:
              _context.prev = 88;

              if (!_didIteratorError3) {
                _context.next = 91;
                break;
              }

              throw _iteratorError3;

            case 91:
              return _context.finish(88);

            case 92:
              return _context.finish(85);

            case 93:
              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context.prev = 96;

              for (_iterator4 = services[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                service = _step4.value;
                fd.append('services[]', service);
              }

              _context.next = 104;
              break;

            case 100:
              _context.prev = 100;
              _context.t7 = _context["catch"](96);
              _didIteratorError4 = true;
              _iteratorError4 = _context.t7;

            case 104:
              _context.prev = 104;
              _context.prev = 105;

              if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                _iterator4.return();
              }

            case 107:
              _context.prev = 107;

              if (!_didIteratorError4) {
                _context.next = 110;
                break;
              }

              throw _iteratorError4;

            case 110:
              return _context.finish(107);

            case 111:
              return _context.finish(104);

            case 112:
              _iteratorNormalCompletion5 = true;
              _didIteratorError5 = false;
              _iteratorError5 = undefined;
              _context.prev = 115;

              for (_iterator5 = components[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                component = _step5.value;
                fd.append('components[]', component);
              }

              _context.next = 123;
              break;

            case 119:
              _context.prev = 119;
              _context.t8 = _context["catch"](115);
              _didIteratorError5 = true;
              _iteratorError5 = _context.t8;

            case 123:
              _context.prev = 123;
              _context.prev = 124;

              if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                _iterator5.return();
              }

            case 126:
              _context.prev = 126;

              if (!_didIteratorError5) {
                _context.next = 129;
                break;
              }

              throw _iteratorError5;

            case 129:
              return _context.finish(126);

            case 130:
              return _context.finish(123);

            case 131:
              _iteratorNormalCompletion6 = true;
              _didIteratorError6 = false;
              _iteratorError6 = undefined;
              _context.prev = 134;

              for (_iterator6 = software[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                software_ = _step6.value;
                fd.append('software[]', software_);
              }

              _context.next = 142;
              break;

            case 138:
              _context.prev = 138;
              _context.t9 = _context["catch"](134);
              _didIteratorError6 = true;
              _iteratorError6 = _context.t9;

            case 142:
              _context.prev = 142;
              _context.prev = 143;

              if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                _iterator6.return();
              }

            case 145:
              _context.prev = 145;

              if (!_didIteratorError6) {
                _context.next = 148;
                break;
              }

              throw _iteratorError6;

            case 148:
              return _context.finish(145);

            case 149:
              return _context.finish(142);

            case 150:
              i = 0;
              _iteratorNormalCompletion7 = true;
              _didIteratorError7 = false;
              _iteratorError7 = undefined;
              _context.prev = 154;
              _iterator7 = newsSubs[Symbol.iterator]();

            case 156:
              if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                _context.next = 190;
                break;
              }

              newsSub = _step7.value;
              _context.t10 = regeneratorRuntime.keys(newsSub);

            case 159:
              if ((_context.t11 = _context.t10()).done) {
                _context.next = 186;
                break;
              }

              key = _context.t11.value;

              if (!(key == 'actions')) {
                _context.next = 183;
                break;
              }

              _iteratorNormalCompletion8 = true;
              _didIteratorError8 = false;
              _iteratorError8 = undefined;
              _context.prev = 165;

              for (_iterator8 = newsSub[key][Symbol.iterator](); !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                _action = _step8.value;
                fd.append("newsSubs[".concat(i, "][").concat(key, "][]"), _action);
              }

              _context.next = 173;
              break;

            case 169:
              _context.prev = 169;
              _context.t12 = _context["catch"](165);
              _didIteratorError8 = true;
              _iteratorError8 = _context.t12;

            case 173:
              _context.prev = 173;
              _context.prev = 174;

              if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
                _iterator8.return();
              }

            case 176:
              _context.prev = 176;

              if (!_didIteratorError8) {
                _context.next = 179;
                break;
              }

              throw _iteratorError8;

            case 179:
              return _context.finish(176);

            case 180:
              return _context.finish(173);

            case 181:
              _context.next = 184;
              break;

            case 183:
              fd.append("newsSubs[".concat(i, "][").concat(key, "]"), newsSub[key]);

            case 184:
              _context.next = 159;
              break;

            case 186:
              ++i;

            case 187:
              _iteratorNormalCompletion7 = true;
              _context.next = 156;
              break;

            case 190:
              _context.next = 196;
              break;

            case 192:
              _context.prev = 192;
              _context.t13 = _context["catch"](154);
              _didIteratorError7 = true;
              _iteratorError7 = _context.t13;

            case 196:
              _context.prev = 196;
              _context.prev = 197;

              if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                _iterator7.return();
              }

            case 199:
              _context.prev = 199;

              if (!_didIteratorError7) {
                _context.next = 202;
                break;
              }

              throw _iteratorError7;

            case 202:
              return _context.finish(199);

            case 203:
              return _context.finish(196);

            case 204:
              $.ajax({
                url: $('#update-endpoint').val(),
                method: $('#update-method').val(),
                contentType: false,
                processData: false,
                data: fd,
                success: function success(data) {
                  disableSave();

                  if (data.created) {
                    window.location.replace('/news/' + data.news.id);
                  } else {
                    window.location.reload();
                  }
                },
                error: function error(resp) {
                  $('#toast-save-error').addClass('show');
                }
              });

            case 205:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[39, 43, 47, 55], [48,, 50, 54], [58, 62, 66, 74], [67,, 69, 73], [77, 81, 85, 93], [86,, 88, 92], [96, 100, 104, 112], [105,, 107, 111], [115, 119, 123, 131], [124,, 126, 130], [134, 138, 142, 150], [143,, 145, 149], [154, 192, 196, 204], [165, 169, 173, 181], [174,, 176, 180], [197,, 199, 203]]);
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
        entity: 'news',
        entityID: $('#news-id').val()
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
      $("#add-".concat(type, "-input")).closest('li').append(catalogItemToDOM(item, type, true));
    }
  }
};

var catalogItemToDOM = function catalogItemToDOM(item, type, renderRemoveButton, ignoreData) {
  renderRemoveButton = renderRemoveButton != undefined ? renderRemoveButton : false;
  ignoreData = ignoreData != undefined ? ignoreData : false;
  return "<li data-".concat(type, "id=\"").concat(item.id, "\" class=\"").concat(type, "-item").concat(ignoreData ? ' ignore' : '', "\"><a class=\"catalog\" href=\"#\">").concat(item.title).concat(renderRemoveButton ? '<button class=\'remove-catalog-item-button\'><i class=\'fas fa-times-circle\'></i></button>' : '', "</a></li>");
};

var createNewsSub = function createNewsSub() {
  var item = newsSubToDOM({
    'idNewsSubType': 4,
    'title': '',
    'descriptionShort': '',
    'newsSubType': window.subTypes[3],
    'actions': []
  });

  if ($('.news-sub').children('.news-sub-item').length) {
    $('.news-sub').children('.news-sub-item').first().before(item);
  } else {
    $('.news-sub').append(item);
  }
};

var newsSubToDOM = function newsSubToDOM(newsSub) {
  newsSub.id = newsSub.id || Math.random();
  var cc = ColorConverter("#".concat(newsSub.newsSubType.color), 'hex');
  return "\n  <div class=\"news-sub-item".concat(newsSub && newsSub.datePost && newsSub.datePost > new Date() ? ' future' : '', "\" data-newsSubId=\"").concat(newsSub.id, "\" data-isNew=\"true\">\n    <div class=\"news-sub-item-icon\" style=\"background: ").concat(cc.toHSL().toCSS(), ";\">\n      <i class=\"far fa-fw ").concat(newsSub && newsSub.newsSubType && newsSub.newsSubType.icon ? newsSub.newsSubType.icon : 'fa-clock', "\"></i>\n    </div>\n    <div class=\"news-sub-item-event\" style=\"background: ").concat(cc.set('l', 95).toCSS(), ";\">\n        <label for=\"newsSubType-").concat(newsSub.id, "\">Update Type</label>\n        <select name=\"newsSubType\" id=\"newsSubType-").concat(newsSub.id, "\" class='title-case news-sub-type'>\n        ").concat(subTypes.map(function (subType) {
    return "\n              <option class='title-case' value=\"".concat(subType.id, "\" data-color=\"").concat('#' + subType.color, "\"\n              data-colorlight=\"").concat(ColorConverter('#' + subType.color, 'hex').toHSL().set('l', 95).toCSS(), "\"\n              data-icon=\"").concat(subType.icon, "\" ").concat(newsSub && newsSub.idNewsSubType == subType.id ? 'selected' : '', ">").concat(subType.title, "</option>\n            ");
  }).join(''), "\n        </select>\n        <label for=\"datePost-").concat(newsSub.id, "\">Posted</label>\n        <input type='datetime-local' id=\"datePost-").concat(newsSub.id, "\" class='news-sub-date-post' value=\"").concat(newsSub.datePost ? moment(newsSub.datePost).format(moment.HTML5_FMT.DATETIME_LOCAL) : moment(new Date()).format(moment.HTML5_FMT.DATETIME_LOCAL), "\" name='datePost'>\n        <h3 class=\"news-sub-title\" contenteditable=true placeholder='News update title'>").concat(newsSub.title, "</h3>\n        <p class='news-sub-description-short' contenteditable=true placeholder='News update description'>").concat(newsSub.descriptionShort, "</p>\n        <a data-open=\"news-sub-add-action-modal\" class=\"button-open-news-sub-add-action-modal button-news-update\"><i class='far fa-link'></i> Link Action</a>\n        <ul class=\"news-sub-item-links\">\n        </ul>\n        </div>\n    <button class='remove-news-sub-button'><i class='fas fa-times-circle'></i></button>\n  </div>\n  ");
};

var addActionToNewsSub = function addActionToNewsSub(newsSubId, action) {
  var LI = "<li class=\"news-sub-action-item\" data-actionid=\"".concat(action.id, "\"><a href=\"#\" target=\"self\">").concat(action.title, "<button class='remove-catalog-item-button'><i class='fas fa-times-circle'></i></button></a></li>");
  $(".news-sub-item[data-newssubid=\"".concat(newsSubId, "\"]")).find('.news-sub-item-links').append(LI);
};

var enableSave = function enableSave() {
  $('.button-save').removeClass('disabled');
};

var disableSave = function disableSave() {
  $('.button-save').addClass('disabled');
};
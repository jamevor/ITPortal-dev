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
  $('#supported').change(function () {
    if ($('#supported').is(':checked')) {
      $('.news-status-card').css('background-color', 'var(--color-bright-2)');
      $('.news-status-icon i').removeClass('fa-exclamation-circle').addClass('fa-check-circle');
      $('.news-status-title').text('WPI Supported');
    } else {
      $('.news-status-card').css('background-color', 'var(--color-bright-3)');
      $('.news-status-icon i').removeClass('fa-check-circle').addClass('fa-exclamation-circle');
      $('.news-status-title').text('Best Effort Support');
    }
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
  }); // softwareOS

  $('#add-softwareos-input').easyAutocomplete({
    url: '/api/v1/softwareos/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 2,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#softwareos').val(JSON.stringify($('#add-softwareos-input').getSelectedItemData()));
      }
    },
    requestDelay: 200
  });
  $('#add-softwareos-input').on('keyup', function (event) {
    event.preventDefault();

    if (event.which == 13 && $('#add-softwareos-input').val().length) {
      renderSoftwareOS(JSON.parse($('#softwareos').val()));
      $('#add-softwareos-input, #softwareos').val('');
    }
  });
  $('.os').on('click', '.remove-softwareos-button', function (event) {
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
  $('#add-location-button').click(function (event) {
    event.preventDefault();

    if ($('#location').val().length) {
      renderLocation(JSON.parse($('#location').val()));
      $('#location, #add-location-input').val('');
    }
  });
  $('#locationsTable tbody').on('click', '.button-remove-location', function (event) {
    window.locationsTable.row($(event.currentTarget).closest('tr')).remove();
    window.locationsTable.draw();
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
  var relatedItemTypes = ['license', 'package', 'server', 'softwareType', 'component', 'service'];

  var _loop = function _loop() {
    var type = _relatedItemTypes[_i];
    $("#add-".concat(type, "-input")).easyAutocomplete({
      url: "/api/v1/".concat(type, "/get/all"),
      getValue: 'title',
      list: {
        maxNumberOfElements: 3,
        match: {
          enabled: true
        },
        onChooseEvent: function onChooseEvent() {
          $("#".concat(type)).val(JSON.stringify($("#add-".concat(type, "-input")).getSelectedItemData()));
        }
      },
      placeholder: "Search for a ".concat(type, "..."),
      requestDelay: 200
    });
    $("#add-".concat(type, "-button")).click(function (event) {
      event.preventDefault();

      if ($("#".concat(type)).val().length) {
        addRelationshipItem(JSON.parse($("#".concat(type)).val()), type);
        $("#".concat(type), "#add-".concat(type, "-input")).val('');
      }
    });
    $('.console-modal').on('click', '.remove-related-item-button', function (event) {
      event.preventDefault();
      $(event.target).closest('li').remove();
      enableSave();
    });
  };

  for (var _i = 0, _relatedItemTypes = relatedItemTypes; _i < _relatedItemTypes.length; _i++) {
    _loop();
  } // save


  $('.button-save').click(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(event) {
      var actions, tags, audiences, aliases, articles, softwareos, locations, licenses, packages, servers, softwareTypes, components, services;
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
              articles = $('.article-card-item').map(function (index, value) {
                return $(value).data('articleid');
              }).toArray();
              softwareos = $('.os').children('li.softwareos-item').map(function (index, value) {
                return $(value).data('softwareosid');
              }).toArray();
              locations = window.locationsTable.columns(0).data().eq(0).unique().toArray(); // related items

              licenses = $('.licenses-wrapper').children('li.license-item').map(function (index, value) {
                return $(value).data('licenseid');
              }).toArray();
              packages = $('.packages-wrapper').children('li.package-item').map(function (index, value) {
                return $(value).data('packageid');
              }).toArray();
              servers = $('.servers-wrapper').children('li.server-item').map(function (index, value) {
                return $(value).data('serverid');
              }).toArray();
              softwareTypes = $('.softwareTypes-wrapper').children('li.softwareType-item').map(function (index, value) {
                return $(value).data('softwaretypeid');
              }).toArray();
              components = $('.components-wrapper').children('li.component-item').map(function (index, value) {
                return $(value).data('componentid');
              }).toArray();
              services = $('.services-wrapper').children('li.service-item').map(function (index, value) {
                return $(value).data('serviceid');
              }).toArray();
              _context.t0 = $;
              _context.t1 = $('#update-endpoint').val();
              _context.t2 = $('#update-method').val();
              _context.t3 = $('#article-title').text();
              _context.t4 = $('#supported').is(':checked');
              _context.t5 = $('#article-summary').text();
              _context.next = 24;
              return descriptionLongEditor.save();

            case 24:
              _context.t6 = _context.sent;
              _context.t7 = $('#phase').val();
              _context.t8 = $('#isAvailable').is(':checked');
              _context.t9 = $('#isLicensed').is(':checked');
              _context.t10 = $('#isCLA').is(':checked');
              _context.t11 = $('#isSCCM').is(':checked');
              _context.t12 = $('#useWPI').is(':checked');
              _context.t13 = $('#usePersonal').is(':checked');
              _context.t14 = $('#version').text();
              _context.t15 = $('#releaseYear').val();
              _context.t16 = $('#publisher').text();
              _context.t17 = $('#installWho').text();
              _context.t18 = $('#requirements').text();
              _context.t19 = $('#dependencies').text();
              _context.t20 = $('#requesting').text();
              _context.t21 = $('#installPointPublic').val();
              _context.t22 = actions;
              _context.t23 = tags;
              _context.t24 = audiences;
              _context.t25 = aliases;
              _context.t26 = articles;
              _context.t27 = softwareos;
              _context.t28 = locations;
              _context.t29 = licenses;
              _context.t30 = packages;
              _context.t31 = servers;
              _context.t32 = softwareTypes;
              _context.t33 = components;
              _context.t34 = services;
              _context.t35 = {
                title: _context.t3,
                supported: _context.t4,
                descriptionShort: _context.t5,
                descriptionLong: _context.t6,
                idSoftwarePhase: _context.t7,
                isAvailable: _context.t8,
                isLicensed: _context.t9,
                isCLA: _context.t10,
                isSCCM: _context.t11,
                useWPI: _context.t12,
                usePersonal: _context.t13,
                version: _context.t14,
                releaseYear: _context.t15,
                publisher: _context.t16,
                installWho: _context.t17,
                requirements: _context.t18,
                dependencies: _context.t19,
                requesting: _context.t20,
                installPointPublic: _context.t21,
                actions: _context.t22,
                tags: _context.t23,
                audiences: _context.t24,
                aliases: _context.t25,
                articles: _context.t26,
                softwareos: _context.t27,
                locations: _context.t28,
                licenses: _context.t29,
                packages: _context.t30,
                servers: _context.t31,
                softwareTypes: _context.t32,
                components: _context.t33,
                services: _context.t34
              };

              _context.t36 = function success(data) {
                disableSave();

                if (data.created) {
                  window.location.replace('/software/' + data.software.id);
                } else {
                  $('#toast-save-success').addClass('show');
                }
              };

              _context.t37 = function error(resp) {
                $('#toast-save-error').addClass('show');
              };

              _context.t38 = {
                url: _context.t1,
                method: _context.t2,
                data: _context.t35,
                success: _context.t36,
                error: _context.t37
              };

              _context.t0.ajax.call(_context.t0, _context.t38);

            case 58:
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
        entity: 'software',
        entityID: $('#software-id').val()
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

var renderSoftwareOS = function renderSoftwareOS(os) {
  var found = false,
      osExists = false;
  $('.os').children('.softwareos-item').each(function () {
    if ($(this).data('softwareosid') == os.id) {
      osExists = true;
      return false;
    }

    if ($(this).children('a i').attr('title') > os.title) {
      found = true;
      $(this).before(softwareOSToDOM(os));
      return false;
    }
  });

  if (!(found || osExists)) {
    if ($('.os').children('.softwareos-item').length) {
      $('.os').children('.softwareos-item').last().before(softwareOSToDOM(os));
    } else {
      $('.os').children().last().before(softwareOSToDOM(os));
    }
  }
};

var softwareOSToDOM = function softwareOSToDOM(os) {
  return "<li data-softwareosid=\"".concat(os.id, "\" class=\"softwareos-item\"><a href=\"#\"><i title=\"").concat(os.title, "\" class=\"fab fa-lg ").concat(os.icon, "\"></i><button class='remove-softwareos-button'><i class='fas fa-times-circle'></i></button></a></li>");
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

var renderLocation = function renderLocation(location) {
  var found = false;
  window.locationsTable.rows().every(function () {
    if (this.data()[0] == location.id) {
      found = true;
      return false;
    }
  });

  if (!found) {
    window.locationsTable.row.add([location.id, location.building && location.building.abbr ? location.building.abbr : '', location.building && location.building.title ? "<a href='#'>".concat(location.building.title, "</a>") : '', "<a href='#'>".concat(location.title, "</a>"), location.room, location.locationType && location.locationType.title ? location.locationType.title : '', '<button class=\'button-remove-location\'><i class=\'fas fa-unlink\'></i> Remove</button>']);
    window.locationsTable.draw();
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
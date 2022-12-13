"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* global EditorJS, Header, List, InlineCode, ListIndent, ListOutdent, ListStyleToggle, ImageTool */
$(document).ready(function () {
  // editor js instances
  var roomNotesEditor = new EditorJS({
    holder: 'roomNotes',
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
    data: window.editorjs_initialize_data.roomNotes
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
      $('#add-software-input, #software').val('');
    }
  });
  $('#softwareTable tbody').on('click', '.button-remove-software', function (event) {
    window.softwareTable.row($(event.currentTarget).closest('tr')).remove();
    window.softwareTable.draw();
    enableSave();
  }); // building

  $('.building-cards-wrapper').on('click', '.remove-catalog-item-button', function (event) {
    event.preventDefault();
    $(event.target).closest('li').remove();
    $('#relate-building-input-group').slideDown();
    $('.breadcrumbs li:nth-last-child(2) > a').text('');
    $('#building-address').text('');
    $('#building-common a').text('');
    enableSave();
  });
  $('#relate-building-input').easyAutocomplete({
    url: '/api/v1/building/get/all',
    getValue: 'title',
    list: {
      maxNumberOfElements: 3,
      match: {
        enabled: true
      },
      onChooseEvent: function onChooseEvent() {
        $('#building').val(JSON.stringify($('#relate-building-input').getSelectedItemData()));
      }
    },
    placeholder: 'Search for a building...',
    requestDelay: 200
  });
  $('#relate-building-input').on('keyup', function (event) {
    event.preventDefault();

    if (event.which == 13 && $('#relate-building-input').val().length) {
      renderParentBuilding(JSON.parse($('#building').val()), 'building');
      $('#relate-building-input, #building').val('');
    }
  });
  $('#relate-building-button').click(function (event) {
    event.preventDefault();

    if ($('#building').val().length) {
      renderParentBuilding(JSON.parse($('#building').val()), 'building');
      $('#relate-building-input, #building').val('');
    }
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
      var tags, audiences, aliases, software, packages, idBuilding;
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
              idBuilding = $('.building-card-item').first().data('buildingid') || null;
              _context.t0 = $;
              _context.t1 = $('#update-endpoint').val();
              _context.t2 = $('#update-method').val();
              _context.t3 = $('#article-title').text();
              _context.t4 = $('#article-summary').text();
              _context.next = 16;
              return roomNotesEditor.save();

            case 16:
              _context.t5 = _context.sent;
              _context.t6 = $('#locationType').val();
              _context.t7 = $('#hasPrinter').is(':checked');
              _context.t8 = $('#hasColorPrinter').is(':checked');
              _context.t9 = $('#hasPharos').is(':checked');
              _context.t10 = $('#hasProjection').is(':checked');
              _context.t11 = $('#hasDualProjection').is(':checked');
              _context.t12 = $('#hasDocCamera').is(':checked');
              _context.t13 = $('#hasLectureCap').is(':checked');
              _context.t14 = $('#hasVoiceAmp').is(':checked');
              _context.t15 = $('#hasWirelessVoiceAmp').is(':checked');
              _context.t16 = $('#hasPOD').is(':checked');
              _context.t17 = $('#hasDisplay').is(':checked');
              _context.t18 = $('#hasHostPC').is(':checked');
              _context.t19 = $('#room').text();
              _context.t20 = $('#seats').val();
              _context.t21 = $('#computers').val();
              _context.t22 = idBuilding;
              _context.t23 = tags;
              _context.t24 = audiences;
              _context.t25 = aliases;
              _context.t26 = software;
              _context.t27 = packages;
              _context.t28 = {
                title: _context.t3,
                descriptionShort: _context.t4,
                roomNotes: _context.t5,
                idLocationType: _context.t6,
                hasPrinter: _context.t7,
                hasColorPrinter: _context.t8,
                hasPharos: _context.t9,
                hasProjection: _context.t10,
                hasDualProjection: _context.t11,
                hasDocCamera: _context.t12,
                hasLectureCap: _context.t13,
                hasVoiceAmp: _context.t14,
                hasWirelessVoiceAmp: _context.t15,
                hasPOD: _context.t16,
                hasDisplay: _context.t17,
                hasHostPC: _context.t18,
                room: _context.t19,
                seats: _context.t20,
                computers: _context.t21,
                idBuilding: _context.t22,
                tags: _context.t23,
                audiences: _context.t24,
                aliases: _context.t25,
                software: _context.t26,
                packages: _context.t27
              };

              _context.t29 = function success(data) {
                disableSave();

                if (data.created) {
                  window.location.replace('/location/' + data.location.id);
                } else {
                  $('#toast-save-success').addClass('show');
                }
              };

              _context.t30 = function error(resp) {
                $('#toast-save-error').addClass('show');
              };

              _context.t31 = {
                url: _context.t1,
                method: _context.t2,
                data: _context.t28,
                success: _context.t29,
                error: _context.t30
              };

              _context.t0.ajax.call(_context.t0, _context.t31);

            case 44:
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
        entity: 'location',
        entityID: $('#location-id').val()
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

var catalogItemToDOM = function catalogItemToDOM(item, type, renderRemoveButton, compact) {
  renderRemoveButton = renderRemoveButton != undefined ? renderRemoveButton : false;
  return "<li data-".concat(type, "id=\"").concat(item.id, "\" class=\"cell ").concat(type, "-card-item").concat(compact ? ' compact' : '', "\">\n    <a class=\"service-card\" href=\"#\">\n      <i class=\"service-card-icon fas ").concat(item.icon, "\"></i>\n      <h3 class=\"service-card-title\">").concat(item.title, "</h3>\n      ").concat(renderRemoveButton ? '<button class=\'remove-catalog-item-button\'><i class=\'fas fa-times-circle\'></i></button>' : '', "\n    </a>\n  </li>");
};

var renderParentBuilding = function renderParentBuilding(item, type) {
  $('#relate-building-input-group').slideUp();
  $(".".concat(type, "-card-item")).remove();
  $(".".concat(type, "-cards-wrapper")).append(catalogItemToDOM(item, type, true, true));
  $('.breadcrumbs li:nth-last-child(2) > a').text(item.title);
  $('#building-address').text(item.address);
  $('#building-common a').text(item.common);
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
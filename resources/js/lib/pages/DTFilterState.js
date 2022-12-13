"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* exported DTFilterState */
var DTFilterState =
/*#__PURE__*/
function () {
  function DTFilterState(table, checkboxes, selects, searchCheckboxFilters) {
    var _this = this;

    _classCallCheck(this, DTFilterState);

    this.table = table;
    checkboxes = checkboxes || [];
    this.checkboxFilters = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = checkboxes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;
        this.checkboxFilters[key] = false;
        $("#".concat(key)).on('change', function () {
          _this.refresh();
        });
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

    selects = selects || [];
    this.selectFilters = {};
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = selects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _key = _step2.value;
        this.selectFilters[_key] = '';
        $("#".concat(_key)).on('change', function () {
          _this.refresh();
        });
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    searchCheckboxFilters = searchCheckboxFilters || [];
    this.searchCheckboxFilters = {};
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = searchCheckboxFilters[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _key2 = _step3.value;
        this.searchCheckboxFilters[_key2] = '';
        $("#".concat(_key2)).on('change', function () {
          _this.refresh();
        });
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  }

  _createClass(DTFilterState, [{
    key: "draw",
    value: function draw() {
      for (var key in this.checkboxFilters) {
        this.table.columns("".concat(key, ":name")).search("".concat(this.checkboxFilters[key] ? 'true' : ''));
      }

      for (var _key3 in this.selectFilters) {
        this.table.columns("".concat(_key3, ":name")).search("".concat(this.selectFilters[_key3]));
      }

      var regexes = {};
      var allColumnNames = [];

      for (var _key4 in this.searchCheckboxFilters) {
        var columnName = $("#".concat(_key4)).data('filtercolumn');

        if (!allColumnNames.includes(columnName)) {
          allColumnNames.push(columnName);
        }

        if (columnName in regexes) {
          if (this.searchCheckboxFilters[_key4].length) {
            regexes[columnName] += "|".concat(this.searchCheckboxFilters[_key4]);
          }
        } else {
          if (this.searchCheckboxFilters[_key4].length) {
            regexes[columnName] = this.searchCheckboxFilters[_key4];
          }
        }
      }

      for (var _i = 0, _allColumnNames = allColumnNames; _i < _allColumnNames.length; _i++) {
        var _columnName = _allColumnNames[_i];

        if (_columnName in regexes) {
          this.table.columns("".concat(_columnName, ":name")).search(regexes[_columnName], true, false, true);
        } else {
          this.table.columns("".concat(_columnName, ":name")).search('');
        }
      }

      this.table.draw();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      for (var key in this.checkboxFilters) {
        this.checkboxFilters[key] = $("#".concat(key)).is(':checked');
      }

      for (var _key5 in this.selectFilters) {
        this.selectFilters[_key5] = $("#".concat(_key5)).val() || '';
      }

      for (var _key6 in this.searchCheckboxFilters) {
        this.searchCheckboxFilters[_key6] = $("#".concat(_key6)).is(':checked') ? $("#".concat(_key6)).val() : '';
      }

      this.draw();
    }
  }]);

  return DTFilterState;
}();
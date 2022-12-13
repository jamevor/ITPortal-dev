"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var sarcasm = function sarcasm(str) {
  return _toConsumableArray(str).map(function (char, i) {
    return char["to".concat(i % Math.floor(Math.random() * 6) ? 'Upper' : 'Lower', "Case")]();
  }).join('');
};

var textNodesUnder = function textNodesUnder(el) {
  var n,
      a = [],
      walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  var blackListNodes = ['SVG', 'PATTERN', 'PATH', 'DEFS', 'RECT', 'STYLE', 'SCRIPT'];

  while (n) {
    if (!(blackListNodes.includes(n.parentNode.nodeName.toUpperCase()) || blackListNodes.includes(n.nodeName.toUpperCase()))) {
      a.push(n);
    }

    n = walk.nextNode();
  }

  return a;
};

window.addEventListener('load', function () {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = textNodesUnder(document.querySelector('body'))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var elt = _step.value;
      elt.textContent = sarcasm(elt.textContent);
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
});
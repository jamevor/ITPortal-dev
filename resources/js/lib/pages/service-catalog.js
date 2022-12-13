"use strict";

$(document).ready(function () {
  // Extend Jquery to allow for containsi selector, for filtering case-insensitive
  $.extend($.expr[':'], {
    'containsi': function containsi(elem, i, match) {
      return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0;
    }
  });
  var servicesFilterCallback = debounce(function (event) {
    event.preventDefault();
    doneTyping();
  }, 400);
  $('#filter-services').on('keyup', servicesFilterCallback);
});

var filterServices = function filterServices() {
  var catFilter = $('#filter-services').val().toLowerCase();

  if (typeof catFilter === 'string' && catFilter.length) {
    $('.service-catalog-portfolio').find('.cell').not(":containsi(\"".concat(catFilter, "\")")).hide();
    $('.service-catalog-portfolio').find('.cell').filter(":containsi(\"".concat(catFilter, "\")")).addClass('filtered');
    $('.service-catalog-portfolio').find('.service-catalog-box-list-item').filter(":containsi(\"".concat(catFilter, "\")")).addClass('filtered');
  }
};

var doneTyping = function doneTyping() {
  resetServicesFilter();
  filterServices();
};

var resetServicesFilter = function resetServicesFilter() {
  $('.service-catalog-portfolio').find('.grid-x, .cell').show();
  $('.service-catalog-portfolio').find('.filtered').removeClass('filtered');
};

var debounce = function debounce(fn, time) {
  var timeout;
  return function () {
    var _arguments = arguments,
        _this = this;

    var functionCall = function functionCall() {
      return fn.apply(_this, _arguments);
    };

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};
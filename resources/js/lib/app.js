"use strict";

$(document).ready(function () {
  var consoleCss = 'background-color:#fff;font-size:4em;color:grey;';
  var consoleCssb = 'font-weight:800;font-size:2em;'; // eslint-disable-next-line

  console.log('%c    _\n' + '  _|_|_ \n' + '   (_( \n' + '  /_/\'_____/) \n' + '  "  |      | \n' + '     |""""""| \n' + '%c        What\'s Goating On?', consoleCss, consoleCssb);
  $(document).foundation();

  if ($(window).width() / parseFloat($('body').css('font-size')) <= 39.9375) {
    $('#menuButton').removeClass('is-active');
    $('.site-wrapper').removeClass('is-active');
    updateUserPreferences();
  }

  $('#menuButton').click(function () {
    $(this).toggleClass('is-active');
    $('.site-wrapper').toggleClass('is-active');
    updateUserPreferences();
  });
  var resizeTimer;
  $(window).resize(function () {
    $('.site-nav').addClass('notransition');
    $('.site-content').addClass('notransition');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeDone, 300);
  });

  function resizeDone() {
    $('.site-nav').removeClass('notransition');
    $('.site-content').removeClass('notransition');
  }

  $('.swim-lane').each(function () {
    var options = $(this).data('size-control');

    if (options && options.display == true) {
      var outputTemplate = '';
      outputTemplate += '<div class="size-control">';

      if (options.compactor == true && options['compactor-item']) {
        outputTemplate += '<a href="#" class="compactor" data-compactor-item="' + options['compactor-item'] + '"><i class="fas fa-compress"></i><span class="show-for-sr"> Toggle Compact View</span></a>';
      }

      if (options.thiccener == true && options['thiccener-item']) {
        outputTemplate += '<a href="#" class="thiccener" data-thiccener-item="' + options['thiccener-item'] + '"><i class="fas fa-arrows-alt-h"></i><span class="show-for-sr"> Toggle Expanded View</span></a>';
      }

      outputTemplate += '</div>';
      $(this).prepend(outputTemplate);
    }
  });
  $('.compactor').on('click', function (event) {
    event.preventDefault();
    $(this).parent().siblings().find('.' + $(this).data('compactor-item')).toggleClass('compact');
  });
  $('.thiccener').on('click', function (event) {
    event.preventDefault();
    $(this).parent().siblings('.' + $(this).data('thiccener-item')).toggleClass('fluid');
  });
  $('#menuShrink').on('click', function (event) {
    event.preventDefault();
    $('.site-wrapper').toggleClass('compact-nav');
    $('.shrink i').toggleClass('fa-arrow-from-left fa-arrow-from-right');
    updateUserPreferences();
  });
  $('.alert .close-button').click(function () {
    $(this).closest('.alert').slideUp();
  });
  $('#button-print').click(function (event) {
    event.preventDefault();
    document.execCommand('print', false, false);
  }); // set share link in modal

  $('#share-link').val(window.location); // open modal

  $('#button-share').click(function (event) {
    event.preventDefault();
    $('#modal-share').foundation('open');
  }); // select text on focus

  $('.copy-text').focus(function (event) {
    event.currentTarget.select();
  }); // copy share link

  $('.copy-button').click(function (event) {
    event.preventDefault();
    copyToClipboard(event.currentTarget.parentElement.getElementsByClassName('copy-text')[0].id, event.currentTarget.id);
  });
  $('[data-reveal]').on('open.zf.reveal', function () {
    $('.site-content').first().css('margin-top', $('html').first().css('top'));
    $('html').first().attr('style', null);
  });
  $('[data-reveal]').on('closed.zf.reveal', function () {
    $('html').first().attr('style', null);

    try {
      var scrollYLoc = parseFloat($('.site-content').first().css('margin-top')) * -1;
      $('.site-content').first().css('margin-top', 0);
      window.scrollTo(0, scrollYLoc);
    } catch (err) {
      console.error(err);
    }
  });
});

function updateUserPreferences() {
  $.ajax({
    url: '/api/v1/user/settings/update',
    method: 'PATCH',
    data: {
      navbarCompact: $('.site-wrapper').hasClass('compact-nav'),
      navbarOpen: $('.site-wrapper').hasClass('is-active')
    }
  });
}

function copyToClipboard(elementId, buttonId) {
  var item = document.getElementById(elementId);
  item.select();
  document.execCommand('copy');

  if (typeof buttonId === 'string') {
    $("#".concat(buttonId)).addClass('clicked');
    $("#".concat(buttonId, " i")).removeClass('fa-copy').addClass('fa-check');
    setTimeout(function () {
      $("#".concat(buttonId)).removeClass('clicked');
      $("#".concat(buttonId, " i")).addClass('fa-copy').removeClass('fa-check');
    }, 2000);
  }
}
/* exported spinner */


var spinner = function spinner() {
  return '<div class="cell small-12 text-center color-pop spinner"><i class="fas fa-2x fa-circle-notch fa-spin"></i></div>';
};
/* exported HTMLReplace */


var HTMLReplace = function HTMLReplace(str) {
  return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
};
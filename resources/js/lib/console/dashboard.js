"use strict";

/* global Chart, ColorConverter */
$(document).ready(function () {
  var pop = ColorConverter(getComputedStyle(document.documentElement).getPropertyValue('--color-pop'), 'hex');
  var c1 = ColorConverter(getComputedStyle(document.documentElement).getPropertyValue('--color-bright-1'), 'hex');
  var c2 = ColorConverter(getComputedStyle(document.documentElement).getPropertyValue('--color-bright-2'), 'hex');
  var c3 = ColorConverter(getComputedStyle(document.documentElement).getPropertyValue('--color-bright-3'), 'hex');
  var c4 = ColorConverter(getComputedStyle(document.documentElement).getPropertyValue('--color-bright-4'), 'hex');
  var popCSS = pop.toCSS();
  var c1CSS = c1.toCSS();
  var c2CSS = c2.toCSS();
  var c3CSS = c3.toCSS();
  var c4CSS = c4.toCSS();
  var popCSS_a = pop.toHSL().toHSLA().set('a', 0.5).toCSS();
  var c1CSS_a = c1.toHSL().toHSLA().set('a', 0.5).toCSS();
  var c2CSS_a = c2.toHSL().toHSLA().set('a', 0.5).toCSS();
  var c3CSS_a = c3.toHSL().toHSLA().set('a', 0.5).toCSS();
  var c4CSS_a = c4.toHSL().toHSLA().set('a', 0.5).toCSS(); // chart 1

  new Chart(document.getElementById('db-overview').getContext('2d'), {
    type: 'radar',
    data: {
      labels: Object.keys(window.counts),
      datasets: [{
        label: 'Total',
        borderColor: c1CSS,
        backgroundColor: c1CSS_a,
        data: Object.values(window.counts)
      }]
    },
    options: {
      legend: {
        display: false
      }
    }
  }); // chart 2

  new Chart(document.getElementById('up-for-review').getContext('2d'), {
    type: 'horizontalBar',
    data: {
      labels: Object.keys(window.reviewCounts),
      datasets: [{
        label: 'Up for Review',
        borderColor: c3CSS,
        backgroundColor: c3CSS_a,
        data: Object.values(window.reviewCounts)
      }]
    },
    options: {
      legend: {
        display: false
      }
    }
  }); // chart3

  new Chart(document.getElementById('users-logging-in').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(window.usersLoggingIn),
      datasets: [{
        label: 'Users',
        data: Object.values(window.usersLoggingIn),
        borderColor: [c2CSS, c1CSS, c3CSS, c4CSS],
        backgroundColor: [c2CSS_a, c1CSS_a, c3CSS_a, c4CSS_a]
      }]
    },
    options: {}
  }); // chart 4

  new Chart(document.getElementById('theme-preferences').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(window.themePreferences),
      datasets: [{
        label: 'Users',
        data: Object.values(window.themePreferences),
        borderColor: [c2CSS, c1CSS, c3CSS, c4CSS],
        backgroundColor: [c2CSS_a, c1CSS_a, c3CSS_a, c4CSS_a]
      }]
    },
    options: {}
  }); // chart 5

  new Chart(document.getElementById('most-installed-apps').getContext('2d'), {
    type: 'polarArea',
    data: {
      labels: Object.keys(window.mostInstalledApps),
      datasets: [{
        label: 'Apps',
        data: Object.values(window.mostInstalledApps),
        borderColor: [c2CSS, c1CSS, c3CSS, c4CSS, popCSS],
        backgroundColor: [c2CSS_a, c1CSS_a, c3CSS_a, c4CSS_a, popCSS_a]
      }]
    },
    options: {}
  });
});
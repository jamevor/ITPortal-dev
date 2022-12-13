"use strict";

/* global L */
$(document).ready(function () {
  var tileSrc = $('body').hasClass('night') || !($('body').hasClass('light') || $('body').hasClass('highContrast')) && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var point = window.buildingGeoData.split(',').map(function (s) {
    return +s.trim();
  });
  var title = window.buildingTitle;
  createMap('buildingMap', tileSrc, point, title);
});

var createMap = function createMap(id, tileSrc, point, title) {
  var tileLayer = new L.TileLayer(tileSrc, {
    minZoom: 8,
    maxZoom: 20,
    attribution: false
  });
  var map = L.map(id, {
    attributionControl: false
  }).setView(point, 18);
  map.addLayer(tileLayer);
  var marker = L.marker(point).addTo(map);
  marker.bindPopup("<b>".concat(title, "</b>"));
  return map;
};
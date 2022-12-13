/* global L */
$(document).ready(function() {

	const tileSrc = $('body').hasClass('night') || (!($('body').hasClass('light') || $('body').hasClass('highContrast')) && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const point = window.buildingGeoData.split(',').map(s => +s.trim());
	const title = window.buildingTitle;
	createMap('buildingMap', tileSrc, point, title);
});

const createMap = (id, tileSrc, point, title) => {
	const tileLayer = new L.TileLayer(tileSrc,
		{
			minZoom: 8,
			maxZoom: 20,
			attribution: false
		}
	);

	const map = L.map(id, {
		attributionControl: false
	}).setView(point, 18);

	map.addLayer(tileLayer);

	const marker = L.marker(point).addTo(map);
	marker.bindPopup(`<b>${title}</b>`);

	return map;
};
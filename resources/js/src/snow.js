// Amount of snowflakes
let snowMax = 50;
// Snowflake colors
let snowColor = '#28b1d5';

// Snow Entity
let snowEntity = '❄️';
snowEntity = '🌼';

// Falling velocity
let snowSpeed = 0.25;

// Minimum flake size
let snowMinSize = 8;

// Maximum flake size
let snowMaxSize = 14;

// Refresh Rate (in milliseconds)
let snowRefresh = 50;

// Additional Styles
let snowStyles = 'cursor: default; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none; position:fixed; top:0; opacity: 0.75;';

let snow = [],
	pos = [],
	coords = [],
	lefr = [],
	marginBottom,
	marginRight,
	i;

function randomize(range) {
	return Math.floor(range * Math.random());
}

function initSnow() {
	let snowSize = snowMaxSize - snowMinSize;
	marginBottom = document.body.offsetHeight;
	marginRight = document.body.clientWidth - 15;

	for (i = 0; i <= snowMax; i++) {
		coords[i] = 0;
		lefr[i] = Math.random() * 15;
		pos[i] = 0.03 + Math.random() / 10;
		snow[i] = document.getElementById('flake' + i);
		snow[i].style.fontFamily = 'inherit';
		snow[i].size = randomize(snowSize) + snowMinSize;
		snow[i].style.fontSize = snow[i].size + 'px';
		snow[i].style.color = snowColor;
		snow[i].style.zIndex = 9999;
		snow[i].sink = snowSpeed * snow[i].size / 5;
		snow[i].posX = randomize(marginRight - snow[i].size);
		snow[i].posY = randomize(2 * marginBottom - marginBottom - 2 * snow[i].size);
		snow[i].style.left = snow[i].posX + 'px';
		snow[i].style.top = snow[i].posY + 'px';
	}

	moveSnow();
}

function resize() {
	marginBottom = document.body.scrollHeight - 5;
	marginRight = document.body.clientWidth - 15;
}

function moveSnow() {
	for (i = 0; i <= snowMax; i++) {
		coords[i] += pos[i];
		snow[i].posY += snow[i].sink;
		snow[i].style.left = snow[i].posX + lefr[i] * Math.sin(coords[i]) + 'px';
		snow[i].style.top = snow[i].posY + 'px';

		if (snow[i].posY >= marginBottom - 2 * snow[i].size || parseInt(snow[i].style.left) > (marginRight - 3 * lefr[i])) {
			snow[i].posX = randomize(marginRight - snow[i].size);
			snow[i].posY = 0;
		}
	}

	setTimeout('moveSnow()', snowRefresh);
}

for (i = 0; i <= snowMax; i++) {
	const span = document.createElement('span');
	span.innerHTML = snowEntity;
	span.id = `flake${i}`;
	span.style = snowStyles;
	span.classList.add('hide-for-sr');
	document.querySelector('body').appendChild(span);
}

window.addEventListener('resize', resize);
window.addEventListener('load', initSnow);

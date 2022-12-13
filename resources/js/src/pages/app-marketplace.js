/* global MyAppCard */
$(document).ready(function() {
	// Extend Jquery to allow for containsi selector, for filtering case-insensitive
	$.extend($.expr[':'], {
		'containsi': function(elem, i, match) {
			return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0;
		}
	});
	const appsFilterCallback = debounce(function(event) {
		event.preventDefault();
		doneTyping();
	}, 400);
	$('#filter-apps').on('keyup', appsFilterCallback);

	$.ajax(
		{
			url: '/api/v1/app/get/all',
			method: 'GET',
			success: function(apps) {
				for (let app of apps) {
					$('#app-marketplace-container').append(new MyAppCard(app, app.isInstalled, app.isFavorite, app.isUserLoggedIn).render());
				}
			},
			error: function(resp) {
				console.error(resp);
			}
		}
	);

	$('#app-marketplace-container').on('change', '.toggle-heart', function(event) {
		updateFavorite($(event.target).closest('.app').data('appid'), $(event.target).hasClass('checkable'));
	});

	$('#app-marketplace-container').on('click', '.button-remove-app', function(event) {
		event.preventDefault();
		updateInstallation($(event.target).closest('.app').data('appid'), false);
	});

	$('#app-marketplace-container').on('click', '.button-add-app', function(event) {
		event.preventDefault();
		updateInstallation($(event.target).closest('.app').data('appid'), true);
	});

});

const filterApps = () => {
	const catFilter = $('#filter-apps').val().toLowerCase();
	if (typeof catFilter === 'string' && catFilter.length) {
		$('#app-marketplace-container').find('.app').not(`:containsi("${catFilter}")`).hide();
		$('#app-marketplace-container').find('.app').filter(`:containsi("${catFilter}")`).addClass('filtered');
	}
};

const doneTyping = () => {
	resetAppsFilter();
	filterApps();
};

const resetAppsFilter = () => {
	$('#app-marketplace-container').find('.app').show();
	$('#app-marketplace-container').find('.filtered').removeClass('filtered');
};

const debounce = (fn, time) => {
	let timeout;
	return function() {
		const functionCall = () => fn.apply(this, arguments);
		clearTimeout(timeout);
		timeout = setTimeout(functionCall, time);
	};
};

function updateFavorite(id, setFavoriteTo) {
	setTimeout(function() {
		sendUpdateFavorites(id, setFavoriteTo);
		$(`.app[data-appid='${id}'`).find('.toggle-heart').toggleClass('checkable');
	}, 800);
}

function sendUpdateFavorites(id, setFavoriteTo) {
	setTimeout(function() {
		$.ajax(
			{
				url: '/api/v1/me/app/set-favorite/one',
				method: 'PATCH',
				data: {
					id,
					favorite: setFavoriteTo
				},
				success: function() {

				},
				error: function(resp) {
					console.error(resp);
				}
			}
		);
	}, 100);
}

function updateInstallation(id, setInstalledTo) {
	if (setInstalledTo) {
		const app = $(`.app[data-appid='${id}'`);
		app.find('div.img').removeAttr('style').html(MyAppCard.renderSpinner());
		app.find('a.action').remove();
		app.append(MyAppCard.renderProgressBar(id));
		(function pushProgress(pct) {
			setTimeout(function() {
				pct += pct < 90 ? Math.ceil(Math.random() * Math.min(pct, 16)) : 3;
				$(`#install-progress-${id}`).children('.progress-meter').width(`${pct}%`);
				if (pct < 100) {
					pushProgress(pct);
				} else {
					sendUpdateInstallation(id, setInstalledTo);
				}
			}, Math.max(400 / pct, 50));
		})(1);
	} else {
		sendUpdateInstallation(id, setInstalledTo);
	}
}

function sendUpdateInstallation(id, setInstalledTo) {
	setTimeout(function() {
		$.ajax(
			{
				url: '/api/v1/me/app/set-installed/one',
				method: 'POST',
				data: {
					id,
					installed: setInstalledTo
				},
				success: function(data) {
					$(`.app[data-appid='${id}'`).replaceWith(new MyAppCard(data.app, setInstalledTo, false, data.app.isUserLoggedIn).render());
				},
				error: function(resp) {
					console.error(resp);
				}
			}
		);
	}, 100);
}
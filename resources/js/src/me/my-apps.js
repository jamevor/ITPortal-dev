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


	refreshFavorites();
	refreshInstalled();
	refreshAvailable();

	$('.profile-section-content').on('change', '.toggle-heart', function(event) {
		updateFavorite($(event.target).closest('.app').data('appid'), $(event.target).hasClass('checkable'));
	});

	$('#favorite-apps-container, #installed-apps-container').on('click', '.button-remove-app', function(event) {
		event.preventDefault();
		updateInstallation($(event.target).closest('.app').data('appid'), false);
	});

	$('.profile-section-content').on('click', '.button-add-app', function(event) {
		event.preventDefault();
		updateInstallation($(event.target).closest('.app').data('appid'), true);
	});

});

const filterApps = () => {
	const catFilter = $('#filter-apps').val().toLowerCase();
	if (typeof catFilter === 'string' && catFilter.length) {
		$('#available-apps-container').find('.app').not(`:containsi("${catFilter}")`).hide();
		$('#available-apps-container').find('.app').filter(`:containsi("${catFilter}")`).addClass('filtered');
	}
};

const doneTyping = () => {
	resetAppsFilter();
	filterApps();
};

const resetAppsFilter = () => {
	$('#available-apps-container').find('.app').show();
	$('#available-apps-container').find('.filtered').removeClass('filtered');
};

const debounce = (fn, time) => {
	let timeout;
	return function() {
		const functionCall = () => fn.apply(this, arguments);
		clearTimeout(timeout);
		timeout = setTimeout(functionCall, time);
	};
};


function refreshFavorites() {
	$.ajax(
		{
			url: '/api/v1/me/app/get/favorites',
			method: 'GET',
			beforeSend: function() {
				$('#favorite-apps-container').empty();
			},
			success: function(apps) {
				if (!apps.length) {
					$('#favorite-apps-container').append(renderEmptyFavoritesBox());
				}
				for (let app of apps) {
					$('#favorite-apps-container').append(
						new MyAppCard(app, true, true).render()
					);
				}
			},
			error: function(resp) {
				console.error(resp);
			}
		}
	);
}

function refreshInstalled() {
	$.ajax(
		{
			url: '/api/v1/me/app/get/installed',
			method: 'GET',
			beforeSend: function() {
				$('#installed-apps-container').empty();
			},
			success: function(apps) {
				if (!apps.length) {
					$('#installed-apps-container').append(renderEmptyInstalledBox());
				}
				for (let app of apps) {
					$('#installed-apps-container').append(
						new MyAppCard(app, true, false).render()
					);
				}
			},
			error: function(resp) {
				console.error(resp);
			}
		}
	);
}

function refreshAvailable() {
	$.ajax(
		{
			url: '/api/v1/me/app/get/available',
			method: 'GET',
			beforeSend: function() {
				$('#available-apps-container').empty();
			},
			success: function(apps) {
				if (!apps.length) {
					$('#available-apps-container').append(renderEmptyAvailableBox());
				}
				for (let app of apps) {
					$('#available-apps-container').append(
						new MyAppCard(app, false, false).render()
					);
				}
			},
			error: function(resp) {
				console.error(resp);
			}
		}
	);
}

function updateFavorite(id, setFavoriteTo) {
	setTimeout(function() {
		sendUpdateFavorites(id, setFavoriteTo);
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
				success: function(data) {
					if (!$(`.app[data-appid='${id}'`).siblings().length) {
						if ($(`.app[data-appid='${id}'`).closest('#favorite-apps-container').length) {
							$('#favorite-apps-container').append(renderEmptyFavoritesBox());
						} else {
							$('#installed-apps-container').append(renderEmptyInstalledBox());
						}
					}
					if (setFavoriteTo) {
						$(`.app[data-appid='${id}'`).remove();
						$('#favorite-apps-container').append(new MyAppCard(data.app, true, true).render());
					} else {
						$(`.app[data-appid='${id}'`).remove();
						$('#installed-apps-container').append(new MyAppCard(data.app, true, false).render());
					}
					$(`.app[data-appid='${id}'`).siblings('.empty').remove();
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
					if (!$(`.app[data-appid='${id}'`).siblings().length) {
						if ($(`.app[data-appid='${id}'`).closest('#favorite-apps-container').length) {
							$('#favorite-apps-container').append(renderEmptyFavoritesBox());
						} else if ($(`.app[data-appid='${id}'`).closest('#installed-apps-container').length) {
							$('#installed-apps-container').append(renderEmptyInstalledBox());
						} else {
							$('#available-apps-container').append(renderEmptyAvailableBox());
						}
					}
					if (setInstalledTo) {
						$(`.app[data-appid='${id}'`).remove();
						$('#installed-apps-container').append(new MyAppCard(data.app, true, false).render());
					} else {
						$(`.app[data-appid='${id}'`).remove();
						$('#available-apps-container').append(new MyAppCard(data.app, false, false).render());
					}
					$(`.app[data-appid='${id}'`).siblings('.empty').remove();
				},
				error: function(resp) {
					console.error(resp);
				}
			}
		);
	}, 100);
}

function renderEmptyFavoritesBox() {
	return `<div class="cell medium-12 my-apps empty">
    <p>You can add shortcuts to your frequently used Apps & Utilities</p>
  </div>`;
}

function renderEmptyInstalledBox() {
	return `<div class="cell medium-12 my-apps empty">
    <p>You can install Apps & Utilities to have easy access to them through your profile.</p>
  </div>`;
}

function renderEmptyAvailableBox() {
	return `<div class="cell medium-12 my-apps empty">
    <p>There are no available Apps & Utilities for you to install.</p>
  </div>`;
}
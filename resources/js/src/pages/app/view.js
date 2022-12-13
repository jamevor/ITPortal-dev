$(document).ready(function() {

	registerFavoriteHandler();

	$('.app').on('click', '.button-remove-app', function(event) {
		event.preventDefault();
		updateInstallation($('#app-id').val(), false);
	});

	$('.app').on('click', '.button-add-app', function(event) {
		event.preventDefault();
		updateInstallation($('#app-id').val(), true);
	});

});

function updateFavorites(id, setFavoriteTo) {
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
}

function updateInstallation(id, setInstalledTo) {
	$.ajax(
		{
			url: '/api/v1/me/app/set-installed/one',
			method: 'POST',
			data: {
				id,
				installed: setInstalledTo
			},
			success: function() {
				$('.box.card.app').html(renderBoxCardApp(setInstalledTo, false, $('#app-link').val(), $('#app-guid').val()));
				registerFavoriteHandler();
			},
			error: function(resp) {
				console.error(resp);
			}
		}
	);
}

function renderBoxCardApp(installed, favorited, link, guid) {
	if (installed) {
		return `<div class="favoriteable">
        <input class="toggle-heart${!favorited ? ' checkable' : ''}" id="toggle-heart-${guid}" type="checkbox"${favorited ? ' checked="true"' : '' }>
        <label class="toggle-heart-label" for="toggle-heart-${guid}" aria-label="like"><i class="fas fa-heart"></i></label>
      </div>
      <a class="action button expanded" href="${link}" target="_blank"><i class="fas fa-power-off"></i> Open</a>
      <a class="action secondary button button-remove-app" href="#"><i class="fas fa-minus-circle"></i> Remove</a>`;
	} else {
		return '<a class="action button expanded button-add-app" href="#"><i class="fas fa-plus-circle"></i> Add</a>';
	}
}

function registerFavoriteHandler() {
	$('.toggle-heart').change(function() {
		updateFavorites($('#app-id').val(), $('.toggle-heart').hasClass('checkable'));
		setTimeout(function() {
			$('.toggle-heart').toggleClass('checkable');
		}, 1000);
	});
}
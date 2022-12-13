$(document).ready(function() {

	$('.quickapp').on('change', '.toggle-heart', function(event) {
		updateFavorite($(event.target).closest('.quickapp').data('appid'), $(event.target).hasClass('checkable'));
	});

});

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
				success: function() {},
				error: function(resp) {
					console.error(resp);
				}
			}
		);
	}, 100);
}

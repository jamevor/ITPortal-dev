$(document).ready(function() {

	$('#button-clear-history').click(function() {
		$.ajax(
			{
				url: '/api/v1/me/history/delete/all',
				method: 'DELETE',
				success: function() {
					$('.results-card').remove();
					$('#toast-clear-success').addClass('show');
				},
				error: function() {
					$('#toast-clear-error').addClass('show');
				}
			}
		);
	});

});
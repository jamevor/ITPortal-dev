/* global spinner, CanvasCourseCard */
$(document).ready(function() {

	$.ajax(
		{
			url: '/api/v1/canvas/getUserFavoriteCourses',
			method: 'GET',
			beforeSend: function() {
				$('#my-courses').append(spinner());
			},
			success: function(data) {
				$('#my-courses').children('.spinner').remove();
				if (!(data && data.length)) {
					$('#my-courses').append(`<div class="cell medium-12 my-apps empty">
            <p>You don't have any courses</p>
          </div>`);
				} else {
					for (let datum of data) {
						$('#my-courses').append(
							new CanvasCourseCard(datum).render()
						);
					}
					// CanvasCourseCard.renderForm();
					// CanvasCourseCard.attachKabobListeners();
					// CanvasCourseCard.attachFormListener();
				}
			},
			error: function(resp) {
				console.error(resp);
			}
		}
	);

});
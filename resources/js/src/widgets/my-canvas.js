$(document).ready(function() {
	const container = '#widget-myCanvas,#widget-myCanvas--dashboard';

	$.ajax(
		{
			url: '/api/v1/canvas/getUserFavoriteCourses',
			method: 'GET',
			success: function(courses) {
				renderCourses(courses);
			},
			error: function(resp) {
			}
		}
	);

	function renderCourses(courses) {
		let result = '<div class="Canvas-wrapper" data-simplebar>';
		for (const course of courses) {
			result += `<a class="course-item" href="https://canvas.wpi.edu/courses/${course.id}" target="_blank">
				<div class="course-item-img" style="background-color:${course.user_color};`;
			if (course.image_download_url) {
				result += ` background-image:url('${course.image_download_url}');">`;
			} else {
				result += '">';
			}
			result += `</div>
				<div class="course-item-label">
					<div class="course-item-title" style="color:${course.user_color};">${course.name}</div>
					<div class="course-item-crn">${course.course_code}</div>
				</div>
			</a>`;
		}
		result += '</div>';
		$(container).append(result);
	}

});
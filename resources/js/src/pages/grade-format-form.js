/* global grecaptcha */
$(document).ready(function() {

	const initialCourseData = {};

	$('#courses-list .course-item').each(function() {
		const course = $(this).find('.course-item-crn').html();
		const choice = $(this).find('input[name$=_choice]:checked').val();
		initialCourseData[course] = choice;
	});

	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		if (!$('#button-submit-help-form').hasClass('disabled')) {
			$('#button-submit-help-form').addClass('disabled');
			grecaptcha.ready(function() {
				grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
					const formData = {
						source: window.location.href,
						type: 'd term grading format change request',
						fullName: $('#full-name').val() || $('#full-name').text(),
						department: $('#wpi-department').val() || $('#wpi-department').text(),
						wpiID: $('#wpi-id').val() || $('#wpi-id').text(),
						wpiEmail: $('#wpi-email').val() || $('#wpi-email').text(),
						wpiPhone: $('#wpi-phone').val() || $('#wpi-phone').text(),
						details: $('#details').val(),
					};
					const courses = [];
					$('#courses-list .course-item').each(function() {
						const course = $(this).find('.course-item-crn').html();
						const choice = $(this).find('input[name$=_choice]:checked').val();
						if (initialCourseData[course] != choice) {
							courses.push(
								{
									course: $(this).find('.course-item-crn').html(),
									choice: $(this).find('input[name$=_choice]:checked').val()
								}
							);
						}
					});
					if (!courses.length) {
						$('#toast-courses').addClass('show');
						setTimeout(function() {
							$('#button-submit-help-form').removeClass('disabled');
						}, 5000);
						setTimeout(function() {
							$('#toast-courses').removeClass('show');
						}, 10000);
					} else {
						formData.courses = courses;
						$.ajax(
							{
								url: '/api/v1/cherwell/ticket/create/one/grade-format',
								method: 'POST',
								data: {
									token,
									formData
								},
								beforeSend: function() {
									$('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
								},
								success: function() {
									$('#toast-save-success').addClass('show');
									$('#button-submit-help-form').html('Request Help');
								},
								error: function(resp) {
									$('#toast-save-error').addClass('show');
									$('#button-submit-help-form').html('Request Help');
								}
							}
						);
					}
				});
			});
		}
	});

});
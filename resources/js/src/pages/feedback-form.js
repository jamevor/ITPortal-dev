/* global grecaptcha */
$(document).ready(function() {

	$('#button-submit-feedback-form').click(function(event) {
		event.preventDefault();
		if (!$('#button-submit-feedback-form').hasClass('disabled')) {
			$('#button-submit-feedback-form').addClass('disabled');
			grecaptcha.ready(function() {
				grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_feedback_form'}).then(function(token) {
					$.ajax(
						{
							url: '/api/v1/cherwell/ticket/create/one',
							method: 'POST',
							data: {
								token,
								formData: {
									source: window.location.href,
									type: 'feedback',
									fullName: $('#full-name').val() || $('#full-name').text(),
									wpiEmail: $('#wpi-email').val() || $('#wpi-email').text(),
									wpiID: $('#wpi-id').val() || $('#wpi-id').text(),
									preferredEmail: $('#preferred-email').length ? $('#preferred-email').val() : '',
									preferredPhone: $('#preferred-phone').length ? $('#preferred-phone').val() : '',
									experience: $('input[name=experience]:checked').val(),
									details: $('#details').val()
								}
							},
							beforeSend: function() {
								$('#button-submit-feedback-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
							},
							success: function() {
								$('#toast-save-success').addClass('show');
								$('#button-submit-feedback-form').html('Submit Feedback');
							},
							error: function(resp) {
								$('#toast-save-error').addClass('show');
								$('#button-submit-feedback-form').html('Submit Feedback');
							}
						}
					);
				});
			});
		}
	});

});
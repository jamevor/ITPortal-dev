/* global grecaptcha */
$(document).ready(function() {
	$("#agree").change(function(){
		if($(this).is(":checked")) {
            $('#button-submit-feedback-form').removeClass('disabled');
        }else{
			$('#button-submit-feedback-form').addClass('disabled');
		}
	})
	$('#button-submit-feedback-form').click(function(event) {
		event.preventDefault();
		if (!$('#button-submit-feedback-form').hasClass('disabled')) {
			$('#button-submit-feedback-form').addClass('disabled');
			grecaptcha.ready(function() {
				grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_feedback_form'}).then(function(token) {
					$.ajax(
						{
							url: '/api/v1/cherwell/ticket/create/one/changeArrival',
							method: 'POST',
							data: {
								token,
								formData: {
									source: window.location.href,
									type: 'Request Change of Move-In Day',
									fullName: $('#full-name').val() || $('#full-name').text(),
									wpiEmail: $('#wpi-email').val() || $('#wpi-email').text(),
									wpiID: $('#wpi-id').val() || $('#wpi-id').text(),
									currentDay: $('#current').val(),
									choice: $('#dayChoice').val(),
									reason: $('#changeReason').val()
								}
							},
							beforeSend: function() {
								$('#button-submit-feedback-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
							},
							success: function(resp) {
								$('#toast-save-success .toast-message').text("Your request has been submitted, and ticket "+ resp.busObPublicId +" has been created. You should also have a confirmation message emailed to your WPI Email")
								$('#toast-save-success').addClass('show');
								$('#button-submit-help-form').html('<i class=\'fas fa-check-circle \'></i>');
							},
							error: function(resp) {
								$('#toast-save-error').addClass('show');
								$('#button-submit-feedback-form').html('Submit Request for Change of Move-In');
							}
						}
					);
				});
			});
		}
	});

});
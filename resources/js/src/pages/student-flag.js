/* global grecaptcha */
$(document).ready(function() {
	
	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		if (!$('#button-submit-help-form').hasClass('disabled')) {
			
			$('#button-submit-help-form').addClass('disabled');
			grecaptcha.ready(function() {
				grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
					$.ajax(
						{
							url: '/api/v1/cherwell/ticket/create/one/student-flag',
							method: 'POST',
							data: {
								token,
								formData: {
									source: window.location.href,
									type: $('input[name=type]:checked').val() || "",
									flagClass: $("#flag-class").is(":checked") ? true : false,
									flagResponse: $("#flag-response").is(":checked") ? true : false,
									flagAssignments: $("#flag-assignments").is(":checked") ? true : false,
									flagOutreach: $("#flag-outreach").is(":checked") ? true : false,
									flagOther: $("#flag-other").is(":checked") ? true : false,
									reason: $('#reason').val() || "",
									studentID: $('#student-id').val() || "",
									studentName: $('#student-name').val() || "",
									crn: $('#course-crn').val() || "",
									courseTitle: $('#course-title').val() || "",
								}
							},
							beforeSend: function(data) {
								$('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
							},
							success: function(resp) {
								$('#toast-save-success').addClass('show');
								$('#button-submit-help-form').html('Submit Concern Report');
								setTimeout(function(){ 
									window.location.href = "/ticket/" + resp.busObPublicId;
								}, 2000);
								
							},
							error: function(resp) {
								$('#toast-save-error').addClass('show');
								$('#button-submit-help-form').removeClass('disabled')
								$('#button-submit-help-form').html('Submit Concern Report');
							}
						}
					);
				});
			});
		}
		}
	);
});
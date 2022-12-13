/* global grecaptcha */
$(document).ready(function() {

	$('input[name=type]').change(function(){
		if($('input[name=type]:checked').val() == "Vendor"){
			$('#company-group').fadeIn();
		}else{
			$('#company-group').hide();
		}
	})
	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		if (!$('#button-submit-help-form').hasClass('disabled')) {
			$('#button-submit-help-form').addClass('disabled');
			grecaptcha.ready(function() {
				grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
					$.ajax(
						{
							url: '/api/v1/cherwell/ticket/create/one/covid-dept-log',
							method: 'POST',
							data: {
								token,
								formData: {
									source: window.location.href,
									firstName: $('#visitor-first').val() || "",
									lastName: $('#visitor-last').val() || "",
									companyName: $('#visitor-company').val() || "",
									visitStart: $('#visit-start').val() || "",
									visitEnd: $('#visit-end').val() || "",
									deptVisit: $('#visit-department').val() || "",
									deptContactName: $('#visit-contact').val() || "",
									deptContactEmail: $('#visit-email').val() || "",
									building: $('#visit-building').val() || "",
									room: $('#visit-room').val() || "",
									note: $('#visit-note').val() || "",
									userName: $('#full-name').text() || "",
									userEmail: $('#wpi-email').text() || "",
									userID: $('#wpi-id').text() || "",
									userDept: $('#wpi-department').text() || "",
									type: $('input[name=type]:checked').val() || "",
								}
							},
							beforeSend: function(data) {
								$('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
							},
							success: function() {
								$('#toast-save-success').addClass('show');
								$('#button-submit-help-form').html('Submit Log');
							},
							error: function(resp) {
								$('#toast-save-error').addClass('show');
								$('#button-submit-help-form').removeClass('disabled')
								$('#button-submit-help-form').html('Submit Log');
							}
						}
					);
				});
			});
		}
	});

});
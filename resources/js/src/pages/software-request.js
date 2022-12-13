/* global grecaptcha */
$(document).ready(function() {
	
	$('input[name=type]').on('change', function(){
		let value = $('input[name=type]:checked').val();
		if(value == "Security"){
			$("#securityIssue").show();
		}else{
			$("#securityIssue").hide();
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
							url: '/api/v1/cherwell/ticket/create/one/software-request',
							method: 'POST',
							data: {
								token,
								formData: {
									source: window.location.href,
									course: $('#course').val() || "",
									software: $('#software').val() || "",
									location: $('#location').val() || "",
									note: $('#note').val() || "",
								}
							},
							beforeSend: function(data) {
								$('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
							},
							success: function(resp) {
								$('#toast-save-success').addClass('show');
								$('#button-submit-help-form').html('Submit Software Request');
								setTimeout(function(){ 
									window.location.href = "/ticket/" + resp.busObPublicId;
								}, 2000);
								
							},
							error: function(resp) {
								$('#toast-save-error').addClass('show');
								$('#button-submit-help-form').removeClass('disabled')
								$('#button-submit-help-form').html('Submit Software Request');
							}
						}
					);
				});
			});
		}
		}
	);
});
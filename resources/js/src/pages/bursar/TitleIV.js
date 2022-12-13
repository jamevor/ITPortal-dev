/* global grecaptcha */
$(document).ready(function() {
	
	$('input[name=agree]').on('change', function(){
		let value = $('input[name=agree]:checked').val();
		if(value == "on"){
			$('#button-submit-help-form').removeClass('disabled').prop("disabled",false);
		}else{
			$('#button-submit-help-form').addClass('disabled').prop("disabled",true);
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
							url: '/api/v1/cherwell/ticket/create/one/bursar-titleiv',
							method: 'POST',
							data: {
								token,
								formData: {
									source: window.location.href,
									agree: $('input[name=agree]:checked').val()
								}
							},
							beforeSend: function(data) {
								$('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
							},
							success: function(resp) {
								$('#toast-save-success').addClass('show');
								$('#button-submit-help-form').html('Submit Title IV Authorization');
								setTimeout(function(){ 
									window.location.href = "/ticket/" + resp.busObPublicId;
								}, 2000);
								
							},
							error: function(resp) {
								$('#toast-save-error').addClass('show');
								$('#button-submit-help-form').removeClass('disabled')
								$('#button-submit-help-form').html('Submit Title IV Authorization');
							}
						}
					);
				});
			});
		}
		}
	);
});
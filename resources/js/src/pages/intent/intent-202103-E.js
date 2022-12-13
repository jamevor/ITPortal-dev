/* global grecaptcha */

$(document).ready(function() {
	
	$('input[name=employed]').on('change',function(){
		if($(this).val()=="Yes"){
			$('#employedBlock').slideDown();
			$('#address-block').slideDown();
		}else{
			$('#employedBlock').hide();
			$('#address-block').hide();
		}
	})

	$('input[name=summerHousing]').on('change',function(){
		if($(this).val()=="Yes"){
			$('#summerGreekHousing-no').prop('checked',true)
			$('#address-block').hide();
			$('#housing-reminder').fadeIn()
		}else{
			$('#address-block').slideDown();
			$('#housing-reminder').hide()
		}
	})

	$('input[name=summerGreekHousing]').on('change',function(){
		if($(this).val()=="Yes"){
			$('#summerHousing-no').prop('checked',true);
			$('#housing-reminder').hide()
		
		}
	})

	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		let error = false;
		let error2 = false;

		if($('input[name=employed]:checked').val() == "Yes" && $('#employedSupervisor').val() == ''){
			error = true;
			$('#supError').show();
			$('#error1').text('Supervisor is a Required Field').show()
		}else{
			$('#error1').text('').hide()
		}

		if( error == false && error2 == false){
			if (!$('#button-submit-help-form').hasClass('disabled')) {
			
				$('#button-submit-help-form').addClass('disabled');
				grecaptcha.ready(function() {
					grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
						const formData = {
							busObRecId: $("#recID").text(),
							busObPublicId: $("#publicID").text(),
							term:"202103",
							pterm:"E",
							source: window.location.href,
							type: 'Student Intent Survey',
							status: $("#status").text(),
							colCode: $('#wpi-colCode').text(),
							isInternational:$('#isInternational').is(':checked'),
							isResident:$('#isResident').is(':checked'),
							isFirstYear:$('#isFirstYear').is(':checked'),
							isGrad:$('#isGrad').is(':checked'),
							isAthlete:$('#isAthlete').is(':checked'),
							employed:$('input[name=employed]:checked').val(),
							employedSupervisor:$('#employedSupervisor').val(),
							summerHousing:$('input[name=summerHousing]:checked').val(),
							summerGreekHousing:$('input[name=summerGreekHousing]:checked').val(),
							permAddress:$('input[name=permAddress]:checked').val(),
							address1:$('#address1').val(),
							address2:$('#address2').val(),
							city:$('#city').val(),
							state:$('#state').val(),
							zip:$('#zip').val(),
							phone:$('#telephone-area-code').val() + $('#telephone-number').val() + $('#telephone-extension').val(),
							areaCode:$('#telephone-area-code').val(),
							number:$('#telephone-number').val(),
							extension:$('#telephone-extension').val(),
						};

						$.ajax(
							{
								url: '/api/v1/cherwell/intent/update/one/',
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
									$('#button-submit-help-form').removeClass('disabled');
									$('#button-submit-help-form').html('Update Intent Form');
								},
								error: function(resp) {
									$('#toast-save-error').addClass('show');
									$('#button-submit-help-form').removeClass('disabled');
									$('#button-submit-help-form').html('Update Intent Form');
								}
							}
						);
					});
				});
			}else{
				$('#toast-unfilled').addClass('show');
			}
		}
	});
})
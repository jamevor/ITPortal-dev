/* global grecaptcha */

$(document).ready(function() {
	
	$('input[name=intInUS]').on('change',function(){
		if($(this).val()=="No"){
			$('#intAble-block').slideDown()
		}else{
			$('#intAble-block').hide()
			$('#intAfter-block').hide()
		}
	})

	$('input[name=intAble]').on('change',function(){
		if($(this).val()=="No" || $(this).val()=="Maybe"){
			$('#intAfter-block').slideDown()
		}else{
			$('#intAfter-block').hide()
		}
	})
	
	$('input[name=comeToCampus]').on('change',function(){
		if($(this).val()=="Yes"){
			$('#yesComeToCampusBlock').slideDown()
			$('#onboardblock').slideDown()
			
		}else{
			$('#yesComeToCampusBlock').hide()
			$('#onboardblock').hide()
		}
	})

	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		let error = false;
		let error2 = false;
		if($('input[name=comeToCampus]:checked').length && $('input[name=comeToCampus]:checked').val().length && $('input[name=comeToCampus]:checked').val() == "Yes"){
			if($('input[name=date]:checked').val() == "" || $('input[name=date]:checked').val() == undefined){
				error = true;
				$('#error1').text('You must choose a date').show()
			}else{
				$('#error1').text('').hide()
			}
		}

		if( error == false && error2 == false){
			if (!$('#button-submit-help-form').hasClass('disabled')) {
			
				$('#button-submit-help-form').addClass('disabled');
				grecaptcha.ready(function() {
					grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
						const formData = {
							busObRecId: $("#recID").text(),
							busObPublicId: $("#publicID").text(),
							term:"202201",
							pterm:"A",
							source: window.location.href,
							type: 'Student Intent Survey',
							date: $('input[name=date]:checked').val() || "",
							comeToCampus:$('input[name=comeToCampus]:checked').val() || ""
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
									if($("#resCheck").val() == "True"){
										setTimeout(function(){ 
											window.location = "/io/Move-In";
										}, 300);
									}else{
										setTimeout(function(){ 
											window.location = "/Me/My-TechFlex";
										}, 1000);
									}
									
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
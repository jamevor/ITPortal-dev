$(document).ready(function() {

	$('input[name=isGuardian]').on('change',function(){
		if($('input[name=isGuardian]').is(':checked')){
			$('#guardianBox').show();
			$('#iAgreeText').text('This is to certify that I, as parent/guardian with legal responsibility for the individual named above, do consent and agree to all of the provisions of this Acknowledgement Form, and for myself and the individual named above.')
		}else{
			$('#guardianBox').hide();
			$('#iAgreeText').text('I have read this Acknowledgement Form, fully understand its terms and sign it freely and voluntarily without any inducement.  In executing this Acknowledgment Form, I assert that I am 18 years of age or older and make this decision informed of its implications and entirely of my own free will.')

		}
	})

	$('#recordFinder').on('click',function(event){
		event.preventDefault();
		$('#caMenu').hide();
		$('#recordLookup').fadeIn();

	})
	$('#lookupID').click(function(event) {
		event.preventDefault();

		var cleanCode = $("#locatorText").val()
		cleanCode = cleanCode.toUpperCase();
		cleanCode = cleanCode.replace(/\./g, "");
		$.ajax(
			{
				url: '/api/v1/cherwell/commencementAcknowledgement/get/one/'+ cleanCode,
				method: 'GET',
				dataType: "json",
				cache: "false",
	
				beforeSend: function() {
					$('#lookupID').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
				},
				success: function(data) {
					$('#lookupID').removeClass('disabled');
					$('#button-submit-help-form').html('<i class="fas fa-search"></i> Find Form by Record Locator');
					window.location.replace("/io/CA/" + data.RecID);
				},
				error: function(resp) {
					$('#lookupID').removeClass('disabled');
					$('#lookupID').html('<i class="fas fa-search"></i> Find Form by Record Locator');
					$('#lookupError').text("No Record found by that Locator ID").show()
				}
			}
		);
	
	});

	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		let error = false;


		if(!$('input[name=iAgree]').is(':checked')){
			error = true;
			$('.error-text').text('You must agree to the terms to continue').show()
		}

		if( error == false){
			if (!$('#button-submit-help-form').hasClass('disabled')) {
			
				$('#button-submit-help-form').addClass('disabled');
				grecaptcha.ready(function() {
					grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
						const formData = {	
							source: window.location.href,
							type: 'Commencement Acknowledgement',
							busObRecId: $("#busObRecId").val(),
							submitType: $("#submitType").val(),
							name:$("#name").val(),
							email:$("#email").val(),
							phone:$("#phone").val(),
							wpiID:$("#wpiID").val(),
							isGuardian:$("#isGuardian").is(':checked'),
							guardName:$("#guardName").val(),
							guardEmail:$("#guardEmail").val(),
							guardPhone:$("#guardPhone").val()
						};

						$.ajax(
							{
								url: '/api/v1/cherwell/commencementAcknowledgement/update/one/',
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
									$('#button-submit-help-form').html('Submit Commencement Acknowledgement Form');
									setTimeout(function(){
										window.location.replace("https://hub.wpi.edu");
									},800)
								},
								error: function(resp) {
									$('#toast-save-error').addClass('show');
									$('#button-submit-help-form').removeClass('disabled');
									$('#button-submit-help-form').html('Submit Commencement Acknowledgement Form');
								}
							}
						);
					});
				});
			}
		};

		
	});
})
/* global grecaptcha */

$(document).ready(function() {
	
	$('#signName, #initials,#guardName,#guardRel').on('input blur change',function(){
		if($('#isMinor').val() == "true"){
			if($('#signName').val() != "" 
			&& $('#initials').val() != ""
			&& $('#guardName').val() != ""
			&& $('#guardRel').val() != ""
			){
				$('#continuePrompt').fadeOut();
				$('#hmaFields').fadeIn();
				$('#waiverFields').fadeIn();
				$('#button-submit-help-form').fadeIn();
			}else{
			}
		}else{
			if($('#signName').val() != "" && $('#initials').val() != ""){
				$('#continuePrompt').fadeOut();
				$('#hmaFields').fadeIn();
				$('#waiverFields').fadeIn();
				$('#button-submit-help-form').fadeIn();
			}else{
			}
		}
		
	})

	$('.initial-item').on('click', function(){
		if($(this).hasClass('skip')){
			$(this).text($('#initials').val()).addClass('initialed')
			$(this).siblings('.initial-item').hide()
		}else{
			$(this).text($('#initials').val()).addClass('initialed')
		}
		let initialCount = $('.initial-item.initialed').length;
		$('#initialCounter').text(initialCount);
		if(initialCount >= 14){
			$('#initialCounter').text(14);
			$('#error-initial-count').text("").hide()
			$('#initialCounter').css('color','var(--color-bright-2)')
		}

	})

	$('#hmaSig.sig-item').on('click', function(){
		let initialCount = $('.initial-item.initialed').length;
		if(initialCount >= 14){
			$(this).text($('#signName').val()).addClass('signed')
		}else{
			$('#error-initial-count').text("You must initial all blocks").fadeIn()
		}
		
	})

	$('#waiverSig.sig-item').on('click', function(){
		$(this).text($('#signName').val()).addClass('signed')
	})

	$('.sig-item-guard').on('click', function(){
		$(this).text($('#guardName').val()).addClass('signed')
	})

	$('#waiverSig, #hmaSig, #waiverSigGuard, #hmaSigGuard').on('click', function(){
		if($('#isMinor').val() == "true"){
			if($('#waiverSig').hasClass('signed') 
			&& $('#hmaSig').hasClass('signed')
			&& $('#waiverSigGuard').hasClass('signed')
			&& $('#hmaSigGuard').hasClass('signed')
			){
				$('#button-submit-help-form').removeClass('disabled');
			}
		}else{
			if($('#waiverSig').hasClass('signed') 
			&& $('#hmaSig').hasClass('signed')){
				$('#button-submit-help-form').removeClass('disabled');
			}
		}
		
	
	})
	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		let error = false;
		let error2 = false;

		if($('input[name=employed]:checked').val() == "Yes" && $('#employedSupervisor').val() == ''){

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
							term:"202201",
							pterm:"A",
							source: window.location.href,
							type: 'Waivers',
							consent: true,
							text1: $('#hmaFields').html(),
							text2: $('#waiverFields').html(),
							isMinor: $('#isMinor').val(),
							guardName: $('#guardName').val(),
							guardRel: $('#guardRel').val()
						};

						$.ajax(
							{
								url: '/api/v1/cherwell/waiver/update/one/',
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
									$('#button-submit-help-form').html('Submit Waivers');
									setTimeout(function(){ 
										window.location = "/Me/My-TechFlex";
									}, 2000);
								},
								error: function(resp) {
									$('#toast-save-error').addClass('show');
									$('#button-submit-help-form').removeClass('disabled');
									$('#button-submit-help-form').html('Submit Waivers');
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
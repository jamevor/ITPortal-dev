/* global grecaptcha */

$(document).ready(function() {

	$('#button-continue').click(function(event) {
		event.preventDefault();
		$("#terms").hide();
		$("#commenceForm").fadeIn(function(){
			$("#gobacktext").fadeIn();
		});
		
	})
	$('#gobacktext').click(function(event) {
		event.preventDefault();
		$('#gobacktext').hide();
		$("#commenceForm").hide();
		$("#terms").fadeIn();
	})
	
	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		let error = false;

		if($('input[name=commence1Choice]:checked').val() == undefined || $('input[name=commence1Choice]:checked').val() == ""){
			$("#errorBlock").text("Please select an Option for Ceremony 1").fadeIn();
			error = true;
		}else if($('#multipleCeremonies').val() == "True" && ($('input[name=commence2Choice]:checked').val() == undefined || $('input[name=commence2Choice]:checked').val() == "")){
			$("#errorBlock").text("Please select an Option for Ceremony 2").fadeIn();
			error = true;
		}else{
			$("#errorBlock").hide();
			error = false;
		}

		if( error == false){
			if (!$('#button-submit-help-form').hasClass('disabled')) {
			
				$('#button-submit-help-form').addClass('disabled');
				grecaptcha.ready(function() {
					grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
						const formData = {	
							source: window.location.href,
							type: 'Commencement RSVP',
							status: $("#status").val(),
							busObRecId: $("#busObRecId").val(),
							busObPublicId: $("#busObPublicId").val(),
							multiple: $('#multipleCeremonies').val(),
							commence1Choice:$('input[name=commence1Choice]:checked').val(),
							commence2Choice:$('input[name=commence2Choice]:checked').val(),
							advisorName:$('#advisorName').val(),

						};

						$.ajax(
							{
								url: '/api/v1/cherwell/commencementRSVP/update/one/',
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
									$('#button-submit-help-form').html('Submit Commencement RSVP Form');
								},
								error: function(resp) {
									$('#toast-save-error').addClass('show');
									$('#button-submit-help-form').removeClass('disabled');
									$('#button-submit-help-form').html('Submit Commencement RSVP Form');
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
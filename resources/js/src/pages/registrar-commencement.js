/* global grecaptcha */
$(document).ready(function() {
	$(":checkbox, :radio").attr("autocomplete", "off");
	$(":checkbox, :radio").prop("checked", false);
	var isUpdate = false;
	var oldTicket = "";
	var perfEntries = performance.getEntriesByType("navigation") || null;

	if(typeof perfEntries === 'object' && perfEntries !== null && typeof perfEntries !== 'undefined' && perfEntries.length){
		if (perfEntries[0].type === "back_forward") {
			location.reload(true);
		}
	}
	$.ajax(
		{
			url: '/api/v1/cherwell/ticket/get/commencement-participation',
			method: 'GET',
			beforeSend: function() {
				$('#loader').show();
				$('#show-form, #intro-text').hide();
				$('#already-complete').hide();
			},
			success: function(resp) {
				$('#loader').hide();
				if(resp.count >= 1 && resp.tickets[0].customerDisplayName != "Default Customer"){
					
					oldTicket = resp.tickets[0];
					isUpdate = true;
					$('#responseID').attr("href", "/ticket/" + resp.tickets[0].id);
					$('#commencement-questions').hide();
					$('#oldResp').text(oldTicket.oldResponseDesc);
					$('#already-complete').show();
					console.log("Existing Tickets found")
				}else{
					$('#commencement-questions').show();
					$('#already-complete').hide();
					isUpdate = false;
					console.log("No Existing Tickets")
				}
			},
			error: function(resp) {
				$('#loader').hide();
				$('#commencement-questions').show();
				$('#already-complete').hide();
				console.log("error checking history")
			}
		}
	);
	$('#continue').click(function(event){
		event.preventDefault();
		$('#commencement-questions').show();
		$('#already-complete').hide();
		console.log(isUpdate);
	})
		
	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		let error = false;
		if($("input[name=commenceChoice]:checked").val() == '' || $("input[name=commenceChoice]:checked").val() === undefined){
			error = true;
		}
		if(error == false){
			$('#errorBlock').hide();
			if (!$('#button-submit-help-form').hasClass('disabled')) {
				
				$('#button-submit-help-form').addClass('disabled');
				grecaptcha.ready(function() {
					grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
						$.ajax(
							{
								url: '/api/v1/cherwell/ticket/create/one/commencement-participation',
								method: 'POST',
								data: {
									token,
									formData: {
										source: window.location.href,
										choice: $("input[name=commenceChoice]:checked").val(),
										choiceText: $("input[name=commenceChoice]:checked").siblings('label').text(),
										isUpdate: isUpdate,
										oldResponse:oldTicket.oldResponse || "",
										oldResponseDesc:oldTicket.oldResponseDesc || "",
									}
								},
								beforeSend: function(data) {
									$('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
								},
								success: function(resp) {
									$('#toast-save-success').addClass('show');
									$('#button-submit-help-form').html('Submit Commencement Participation Form');
									setTimeout(function(){ 
										window.location.href = "/ticket/" + resp.busObPublicId;
									}, 2000);
									
								},
								error: function(resp) {
									$('#toast-save-error').addClass('show');
									$('#button-submit-help-form').removeClass('disabled')
									$('#button-submit-help-form').html('Submit Commencement Participation Form');
								}
							}
						);
					});
				});
			}
		}else{
			$('#errorBlock').fadeIn();
		}
	}
	);
});
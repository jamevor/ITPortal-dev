/* global grecaptcha */
$(document).ready(function() {
	$(":checkbox, :radio").attr("autocomplete", "off");
	$(":checkbox, :radio").prop("checked", false);

	$.ajax(
		{
			url: '/api/v1/cherwell/ticket/get/my-intent-to-grad',
			method: 'GET',
			beforeSend: function() {
				$('#loader').show();
				$('#show-form, #intro-text').hide();
				$('#already-complete').hide();
			},
			success: function(resp) {
				$('#loader').hide();
				if(resp.count >= 1 && resp.tickets[0].customerDisplayName != "Default Customer"){
					
					$('#responseID').attr("href", "/ticket/" + resp.tickets[0].id);
					$('#degree-questions').hide();
					$('#already-complete').show();
					console.log("Existing Tickets found")
				}else{
					$('#degree-questions').show();
					$('#already-complete').hide();
					console.log("No Existing Tickets")
				}
			},
			error: function(resp) {
				$('#loader').hide();
				$('#degree-questions').show();
				$('#already-complete').hide();
				console.log("error checking history")
			}
		}
	);

	$('#continue').click(function(event){
		event.preventDefault();
		$('#degree-questions').show();
		$('#already-complete').hide();
	})
	$('input[name=type]').change(function(){
		
		if($('input[name=type]:checked').val() == "Undergraduate"){
			$(".toggled").hide()
			$('.show-undergrad').show();
			$('#postChoice').slideDown();

		}else if($('input[name=type]:checked').val() == "Graduate"){
			$(".toggled").hide()
			$('.show-grad').show();
			$('.show-grad-only').show();
			$('#postChoice').slideDown();
			$('#note-name').text("Notes for Graduate Students");

		}else if($('input[name=type]:checked').val() == "PhD"){
			$(".toggled").hide()
			$('.show-grad').show();
			$('.show-grad-only').hide();
			$('#postChoice').slideDown();
			$('#note-name').text("Notes for PhD Students");

		}else if($('input[name=type]:checked').val() == ""){
			$(".toggled").hide()
			$('#postChoice').hide();

		}else{
			$(".toggled").hide()
			$('#postChoice').hide();

		}
	})

	$(".nameField").on('input', function(){
		let outputText = $('#name-first').val() + " " + $('#name-middle').val()+ " " + $('#name-last').val()+ " " + $('#name-suffix').val()
		outputText.length >= 28 ? $(".preview").addClass('longName') : $(".preview").removeClass('longName');
		outputText.length >= 38 ? $(".preview").addClass('longerName') : $(".preview").removeClass('longerName');
		outputText.length >= 39 ? $(".preview").addClass('longestName') : $(".preview").removeClass('longestName');
		$(".preview").text(outputText).fadeIn();
		$(".preview-warn").fadeIn();
	})
	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		if (!$('#button-submit-help-form').hasClass('disabled')) {
			$('#button-submit-help-form').addClass('disabled');
			grecaptcha.ready(function() {
				grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {

					let isThesis = '';

					if($('input[name=thesis]:checked').val() == "True"){
						isThesis = true;
					}
					if($('input[name=thesis]:checked').val() == "False"){
						isThesis = false;
					}
					$.ajax(
						{
							url: '/api/v1/cherwell/ticket/create/one/intent-to-grad',
							method: 'POST',
							data: {
								token,
								formData: {
									source: window.location.href,
									userID:  $('#wpi-id').text() || "",
									degreeType: $('input[name=type]:checked').val() || "",
									dateName: $('input[name=type]:checked').val(),
									date: $('input[name=date]:checked').val() || "Not Set",
									firstName: $('#name-first').val() || "",
									middleName: $('#name-middle').val() || "",
									lastName: $('#name-last').val() || "",
									suffix: $('#name-suffix').val() || "",
									nameCombined: $('#name-last').val() + ", " + $('#name-first').val()+ " " + $('#name-middle').val(),
									address1: $('#address-1').val() || "",
									address2: $('#address-2').val() || "",
									city: $('#address-city').val() || "",
									state: $('#address-state').val() || "",
									zip: $('#address-zip').val() || "",
									country: $('#address-country').val() || "",
									degree:$('#degree').val() || "",
									major:$('#major').val() || "",
									thesis: isThesis || null
								}
							},
							beforeSend: function(data) {
								$('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
							},
							success: function() {
								$('#toast-save-success').addClass('show');
								$('#button-submit-help-form').html('Submit Intent To Graduate');
							},
							error: function(resp) {
								$('#toast-save-error').addClass('show');
								$('#button-submit-help-form').removeClass('disabled')
								$('#button-submit-help-form').html('Submit Intent To Graduate');
							}
						}
					);
				});
			});
		}
	});

});
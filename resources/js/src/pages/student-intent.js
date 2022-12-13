/* global grecaptcha */
$(document).ready(function() {

	
	$.ajax(
		{
			url: '/api/v1/cherwell/ticket/get/my-student-intent',
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
					$('#show-form, #intro-text').hide();
					$('#already-complete').show();
				}else{
					$('#show-form, #intro-text').show();
					$('#already-complete').hide();
				}
			},
			error: function(resp) {
				$('#loader').hide();
				$('#show-form, #intro-text').show();
				$('#already-complete').hide();
			}
		}
	);

	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		if (!$('#button-submit-help-form').hasClass('disabled')) {
			
			if($('input[name=student-plan]:checked').val() != undefined){
				$('#button-submit-help-form').addClass('disabled');
				
				grecaptcha.ready(function() {
					grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
						const formData = {
							source: window.location.href,
							type: 'Student Intent Fall 2020',
							fullName: $('#full-name').text(),
							wpiID: $('#wpi-id').text(),
							email: $('#wpi-email').text(),
							colCode: $('#wpi-colCode').text(),
							isInternational:$('#isInternational').is(':checked'),
							isResident:$('#isResident').is(':checked'),
							isFirstYear:$('#isFirstYear').is(':checked'),
							isGrad:$('#isGrad').is(':checked'),
							plan: $('input[name=student-plan]:checked').val() != undefined ? $('input[name=student-plan]:checked').val() : "",
							housing: $('input[name=housing]:checked').val() != undefined ? $('input[name=housing]:checked').val() : "",
							visaLocation: $('#visa-location').val(),
							visaSecured: $('#visa-secured').val(),
							visaAppointment: $('#visa-appointment').val(),
							visaDate: $('#visa-date').val(),
							addressOK: $('#addressOK').val(),
							address1:$('#addressOK').val() == "no" ? $('#address1').val() : "",
							address2:$('#addressOK').val() == "no" ? $('#address2').val() : "",
							city:$('#addressOK').val() == "no" ? $('#city').val() : "",
							state:$('#addressOK').val() == "no" ? $('#state').val() : "",
							zip:$('#addressOK').val() == "no" ? $('#zip').val() : "",
							country:$('#addressOK').val() == "no" ? $('#country').val() : "",
							special:$('#special').val(),
							specialDetail:$('#special-detail').val()
						};

						$.ajax(
							{
								url: '/api/v1/cherwell/ticket/create/one/student-intent',
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
									$('#button-submit-help-form').html('Submit Form');
								},
								error: function(resp) {
									$('#toast-save-error').addClass('show');
									$('#button-submit-help-form').html('Submit Form');
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


	$('#show-form').click(function(){
		$('#back-text').show()
		$('#intro-text').fadeOut(function(){
			$('.help-form').fadeIn();
		})
		$("html, body").animate({ scrollTop: 0 }, "slow");
		
	})
	$('#back-text').click(function(e){
		e.preventDefault();
		$('#back-text').hide();
		$('.help-form').fadeOut(function(){
			$('#intro-text').fadeIn();
		})
		$("html, body").animate({ scrollTop: 0 }, "slow");
		
	})
	var isResident = $('#isResident');
	var isFirstYear = $('#isFirstYear');
	var isInternational = $('#isInternational');
	var isGrad = $('#isGrad')

	function formBuilder(isResident,isFirstYear,isInternational,isGrad){
		
		var studentPlan = $('input[name=student-plan]:checked');
		
		if(isInternational.is(":checked")){
			$('#visa-toggle').slideDown()
		}else{
			$('#visa-toggle').hide()
		}
		if(isGrad.is(":checked")){
			$('#intro-text-grad').show()
			$('#intro-text-undergrad').hide()

			$( "label[for='student-plan-remote'] span").text("Work at a campus job or conduct research remotely");
			$( "label[for='student-plan-onCampus'] span").text("Work at a campus job or conduct research physically on campus ");
			$( "label[for='student-plan-none'] span").text("I will not work or conduct research");
			$( "#student-plan-none" ).parent().show();
			console.log("path 1")
		}else{
			$('#intro-text-undergrad').show()
			$('#intro-text-grad').hide()
			$( "#student-plan-none" ).parent().hide();
			$( "label[for='student-plan-remote'] span").text("Take all classes remotely; do not plan to come to campus at all");
			$( "label[for='student-plan-onCampus'] span").text("Plan to physically come to campus for classes or other activities");
			$( "label[for='student-plan-defer'] span").text("Defer for a semester");
			console.log("path 2")
		}

		// First years
		// first year resident builder
		if(isResident.is(":checked") && isFirstYear.is(":checked")){
			// Options - Student-Plan
			$( "#student-plan-remote" ).parent().show();
			$( "#student-plan-onCampus" ).parent().show();
			$( "#student-plan-defer" ).parent().show();
			$( "#student-plan-other" ).parent().hide();
			console.log("path 3")
		}
		// first year non-resident builder
		if(!isResident.is(":checked") && isFirstYear.is(":checked")){
			// Options - Student-Plan
			$( "#student-plan-remote" ).parent().show();
			$( "#student-plan-onCampus" ).parent().show();
			$( "#student-plan-defer" ).parent().show();
			$( "#student-plan-other" ).parent().hide();
			console.log("path 4")
		}
		// Upper-class Resident builder
		if(isResident.is(":checked") && !isFirstYear.is(":checked")){
			// Options - Student-Plan
			$( "#student-plan-remote" ).parent().show();
			$( "#student-plan-onCampus" ).parent().show();
			$( "#student-plan-defer" ).parent().hide();
			$( "#student-plan-other" ).parent().hide();
			console.log("path 5")
		}
		// Upper-class Non-Resident builder
		if(!isResident.is(":checked") && !isFirstYear.is(":checked")){
			// Options - Student-Plan
			$( "#student-plan-remote" ).parent().show();
			$( "#student-plan-onCampus" ).parent().show();
			$( "#student-plan-defer" ).parent().hide();
			$( "#student-plan-other" ).parent().hide();
			console.log("path 6")
		}
		// First Year Resident - Remote
		if(isResident.is(":checked") && isFirstYear.is(":checked") && studentPlan.val() == "remotely"){	
			//Options

			// Options - Student-Plan
			$( "#housing-onCampus" ).parent().hide();
			$( "#housing-offCampus" ).parent().show();
			$( "#housing-greek" ).parent().hide();
			$( "#housing-permanent" ).parent().show();
			$( "#housing-other" ).parent().hide();

			$( "#housing-note" ).hide();

			$( "#housing-onCampus" ).prop( "checked", true );
			$('#on-campus-toggle').slideDown();
			$('#address-toggle').hide();
			$('#student-plan-other-toggle').hide();
			console.log("path 7")

		}
		// First Year non-resident - Remote
		if(!isResident.is(":checked") && isFirstYear.is(":checked") && studentPlan.val() == "remotely"){
			//Options
			
			// Options - Student-Plan
			$( "#housing-onCampus" ).parent().hide();
			$( "#housing-offCampus" ).parent().show();
			$( "#housing-greek" ).parent().hide();
			$( "#housing-permanent" ).parent().show();
			$( "#housing-other" ).parent().hide();

			$( "#housing-note" ).hide();

			$("#housing-onCampus").prop( "checked", false );
			$('#on-campus-toggle').slideDown();
			$('#address-toggle').hide();
			$('#student-plan-other-toggle').hide();
			console.log("path 8")
		}
		// First Year Resident - OnCampus
		if(isResident.is(":checked") && isFirstYear.is(":checked") && studentPlan.val() == "on-campus"){
			//Options
			
			// Options - Student-Plan
			$( "#housing-onCampus" ).parent().show();
			$( "#housing-offCampus" ).parent().hide();
			$( "#housing-greek" ).parent().hide();
			$( "#housing-permanent" ).parent().hide();
			$( "#housing-other" ).parent().hide();

			$( "#housing-note" ).show();

			$( "#housing-onCampus" ).prop( "checked", true );
			$('#on-campus-toggle').slideDown();
			$('#address-toggle').slideDown();
			$('#student-plan-other-toggle').hide();
			console.log("path 9")

		}
		// First Year non-resident - OnCampus
		if(!isResident.is(":checked") && isFirstYear.is(":checked") && studentPlan.val() == "on-campus"){
			//Options
			
			// Options - Student-Plan
			$( "#housing-onCampus" ).parent().hide();
			$( "#housing-offCampus" ).parent().show();
			$( "#housing-greek" ).parent().hide();
			$( "#housing-permanent" ).parent().show();
			$( "#housing-other" ).parent().hide();

			$( "#housing-note" ).hide();

			$( "#housing-onCampus" ).prop( "checked", false );
			$('#on-campus-toggle').slideDown();
			$('#address-toggle').slideDown();
			$('#student-plan-other-toggle').hide();
			console.log("path 10")
		}

		// Upper Class
		// Upper-class Resident - Remote
		if(isResident.is(":checked") && !isFirstYear.is(":checked") && (studentPlan.val() == "remotely" || studentPlan.val() == "none")){	
			//Options
			
			// Options - Student-Plan
			$( "#housing-onCampus" ).parent().hide();
			$( "#housing-offCampus" ).parent().show();
			$( "#housing-greek" ).parent().show();
			$( "#housing-permanent" ).parent().show();
			$( "#housing-other" ).parent().hide();

			$( "#housing-note" ).hide();

			$( "#housing-onCampus" ).prop( "checked", true );
			$('#on-campus-toggle').slideDown();
			$('#address-toggle').hide();
			$('#student-plan-other-toggle').hide();
			console.log("path 11")
		}
		// upper-class non-resident - Remote
		if(!isResident.is(":checked") && !isFirstYear.is(":checked") && (studentPlan.val() == "remotely" || studentPlan.val() == "none")){
			//Options
			
			// Options - Student-Plan
			$( "#housing-onCampus" ).parent().hide();
			$( "#housing-offCampus" ).parent().show();
			$( "#housing-greek" ).parent().show();
			$( "#housing-permanent" ).parent().show();
			$( "#housing-other" ).parent().hide();

			$( "#housing-note" ).hide();

			$("#housing-onCampus").prop( "checked", false );
			$('#on-campus-toggle').slideDown();
			$('#address-toggle').hide();
			$('#student-plan-other-toggle').hide();
			console.log("path 12")
		}
		// Upper-class Resident - OnCampus
		if(isResident.is(":checked") && !isFirstYear.is(":checked") && (studentPlan.val() == "on-campus" || studentPlan.val() == "none")){
			//Options
			// Options - Student-Plan
			$( "#housing-onCampus" ).parent().show();
			$( "#housing-offCampus" ).parent().hide();
			$( "#housing-greek" ).parent().hide();
			$( "#housing-permanent" ).parent().hide();
			$( "#housing-other" ).parent().hide();

			$( "#housing-note" ).show();

			$( "#housing-onCampus" ).prop( "checked", true );
			$('#on-campus-toggle').slideDown();
			$('#address-toggle').slideDown();
			$('#student-plan-other-toggle').hide();
			console.log("path 13")
		}
		// upper-class non-resident - OnCampus
		if(!isResident.is(":checked") && !isFirstYear.is(":checked") && (studentPlan.val() == "on-campus" || studentPlan.val() == "none")){
			//Options

			// Options - Student-Plan
			$( "#housing-onCampus" ).parent().hide();
			$( "#housing-offCampus" ).parent().show();
			$( "#housing-greek" ).parent().show();
			$( "#housing-permanent" ).parent().show();
			$( "#housing-other" ).parent().hide();

			$( "#housing-note" ).hide();

			$( "#housing-onCampus" ).prop( "checked", false );
			$('#on-campus-toggle').slideDown();
			$('#address-toggle').slideDown();
			$('#student-plan-other-toggle').hide();
			console.log("path 14")
		}

		if(studentPlan.val() == 'defer') {
			$('#on-campus-toggle').hide();
			$('#student-plan-other-toggle').hide();
			$('#address-toggle').hide();
			console.log("path 15")

		}

		if (studentPlan.val() == 'Other') {
			$('#student-plan-other-toggle').slideDown();
			$('#on-campus-toggle').hide();
			$('#address-toggle').hide();
			console.log("path 16")
		}
	}
	formBuilder(isResident,isFirstYear,isInternational,isGrad);
	$('input[name=student-plan],#isResident,#isFirstYear,#isInternational,#isGrad').change(function(){
		formBuilder(isResident,isFirstYear,isInternational,isGrad)
	})
	$('input[name=housing]').change(function(){	
		if (this.value == 'Other') {
			$('#housing-other-toggle').slideDown();
		}else{
			$('#housing-other-toggle').hide();
		}
	})
	$('select[name=visa-appointment]').change(function(){	
		if (this.value == 'yes') {
			$('#visa-detail-toggle').slideDown();
		}else{
			$('#visa-detail-toggle').hide();
		}
	})
	$('select[name=visa-location],select[name=visa-secured]').change(function(){	
		if ($('select[name=visa-location]').val() == 'yes' && $('select[name=visa-secured]').val() == 'yes') {
			$('#visa-appointment-toggle').slideDown();
		}else{
			$('#visa-appointment-toggle').hide();
		}
	})
	$('select[name=addressOK]').change(function(){	
		if (this.value == 'no') {
			$('#address-block').slideDown();
			$('.address-check').addClass('no');
			$('.address-check').removeClass('ok');
		}else if (this.value == 'yes') {
			$('#address-block').hide();
			$('.address-check').removeClass('no');
			$('.address-check').addClass('ok');

		}else{
			$('#address-block').hide();
			$('.address-check').removeClass('no');
			$('.address-check').removeClass('ok');
		}
	})
	$('select[name=special]').change(function(){	
		if (this.value == 'yes') {
			$('#special-detail-toggle').slideDown();
		}else{
			$('#special-detail-toggle').hide();
		}
	})
	
});
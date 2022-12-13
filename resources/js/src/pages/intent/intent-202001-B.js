/* global grecaptcha */
$(document).ready(function() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10){
		dd='0'+dd
	} 
	if(mm<10){
		mm='0'+mm
	} 

	today = yyyy+'-'+mm+'-'+dd;
	document.getElementById("departure-date").setAttribute("min", today);

	$('input[name=planToLive]').change(function(){

	
		if($(this).val() == "Off-Campus More Than 0.5 Miles Away in the US"){
			$('#offCampusBlock').slideDown()
		}else{
			$('#offCampusBlock').hide()
			$('input[name=anotherState]').prop("checked",false).change()
			$('#outOfStateState').val("")
		}

		if($(this).val() == "Off-Campus Within 0.5 Miles in the US" 
		|| $(this).val() == "Fraternity or Sorority House" 
		|| ($(this).val() == "Off-Campus More Than 0.5 Miles Away in the US" && ($('input[name=comeToCampus]:checked').val() =="Yes" ||$('input[name=onlineOnly]:checked').val() == "No"))
		){
			$('#address-block').slideDown()
		}else{
			$('#address-block').hide()
			$('#address-block input').val("")
		}

		if($(this).val() == "Off-Campus Within 0.5 Miles in the US" || $(this).val() == "Off-Campus More Than 0.5 Miles Away in the US" || $(this).val() == "At An International Location" ){
			$('#permAddress-block').slideDown()
		}else{
			$('#permAddress-block').hide()
			$('input[name=permAddress]').prop("checked",false).change()
		}
		
	})
	
	$('input[name=anotherState]').change(function(){
		if($(this).val() == "Yes"){
			$('#offCampusStateBlock').slideDown()
		}else{
			$('#offCampusStateBlock').hide()
			$('#outOfStateState').val("")
		}
	})

	$('input[name=thanksgivingStatus]').change(function(){
		if($(this).val() == "Remaining"){
			$('#turkey-block').slideDown()
		}else{
			$('#turkey-block').hide()
			$('input[name=thanksgivingMeal]').prop("checked",false).change()
		}

	})

	$('input[name=PhaseYellowStatus]').change(function(){
		if($(this).val() == "Departing"){
			$('#departure-block').slideDown()
		}else{
			$('#departure-block').hide()
			$('input[name=departure-date]').val("")
		}
	})
	$('input[name=departure-date]').change(function () {
		if (!Date.parse($('input[name=departure-date]').val())) {
			$('#dateWarning').hide()
		} else {
			if(moment($(this).val()).isBefore("2020-12-13",'day')){
				$('#dateOut').hide()
				$("#deptDate").text($(this).val())
				$('#dateWarning').fadeIn()
			}else{
				$('#dateOut').fadeIn()
			}
		}
	})

	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		let error = false;
		if($('input[name=PhaseYellowStatus]:checked').val() == "" || $('input[name=PhaseYellowStatus]:checked').val() == null){
			$("#error1").fadeIn();
			error = true;
		}else{
			$("#error1").hide();
			if($('input[name=PhaseYellowStatus]:checked').val() == "Departing" && ($('#departure-date').val() == "" || $('#departure-date').val() == null || moment($('#departure-date').val()).isAfter("2020-12-12",'day'))){
				$("#error2").fadeIn();
				error = true;
			}else{
				$("#error2").hide();
				error = false;
			}
		}
		
		if( error == false){
			if (!$('#button-submit-help-form').hasClass('disabled')) {
			
				$('#button-submit-help-form').addClass('disabled');
				grecaptcha.ready(function() {
					grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
						const formData = {
							busObRecId: $("#recID").text(),
							busObPublicId: $("#publicID").text(),
							source: window.location.href,
							type: 'Student Intent Survey',
							term:"202001",
							pterm:"B",
							status: $("#status").text(),
							colCode: $('#wpi-colCode').text(),
							isInternational:$('#isInternational').is(':checked'),
							isResident:$('#isResident').is(':checked'),
							isFirstYear:$('#isFirstYear').is(':checked'),
							isGrad:$('#isGrad').is(':checked'),
							isAthlete:$('#isAthlete').is(':checked'),
							onlineOnly:$('input[name=onlineOnly]:checked').val(),
							comeToCampus:$('input[name=comeToCampus]:checked').val(),
							employedWPI:$('input[name=employedWPI]:checked').val(),
							planToLive:$('input[name=planToLive]:checked').val(),
							anotherState:$('input[name=anotherState]:checked').val(),
							anotherStateState:$('#outOfStateState').val(),
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
							thanksgivingStatus:$('input[name=thanksgivingStatus]:checked').val(),
							thanksgivingMeal:$('input[name=thanksgivingMeal]:checked').val(),
							PhaseYellowStatus:$('input[name=PhaseYellowStatus]:checked').val(),
							PhaseYellowDepartureDate:$('#departure-date').val(),
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
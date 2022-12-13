/* global grecaptcha */

$(document).ready(function() {

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
	$('input[name=requestHousing]').change(function(){
		if($(this).val() == "Yes"){
			$('#requestHousing-additional').slideDown()
			$('#yesHousing').hide();
			$('#noHousing').show();
		}else{
			$('#requestHousing-additional').hide()
			$('#noHousing').hide();
			$('#yesHousing').show();
			$('#housingBuilding').val("")
			$('#housingRoommate').val("")
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

	$('input[name=arrivingCountry]').change(function(){
		if($(this).val() == "USA"){
			$('#arriving-block').slideDown()
			$('##international-block').hide()
		}else if($(this).val() == "International"){
			$('#international-block').slideDown()
			$('#arriving-block').hide()
		}
		else{
			$('#arriving-block').hide()
			$('##international-block').hide()
			$('#arriving-block input').val("")
		}
	})
	$('#arrivingStateCode').change(function(){
		if($(this).val() == "VT"){
			$('#arrivingBoundry-north-label').text("Northern Vermont");
			$('#arrivingBoundry-south-label').text("Southern Vermont");
			$('#splainer-text').text("Are you located in Northern or Southern Vermont? Generally, Northern is defined as North of Brattleboro.");
			$('.boundmap').hide();
			$('#vtmap').show();
			$('#boundry-block').slideDown();
		}else if($(this).val() == "ME"){
			$('#arrivingBoundry-north-label').text("Northern Maine");
			$('#arrivingBoundry-south-label').text("Southern Maine");
			$('#splainer-text').text("Are you located in Northern or Southern Maine? Generally, Northern is defined as North of Portland.");
			$('.boundmap').hide();
			$('#memap').show();
			$('#boundry-block').slideDown();
		}else if($(this).val() == "NH"){
			$('#arrivingBoundry-north-label').text("Northern New Hampshire");
			$('#arrivingBoundry-south-label').text("Southern New Hampshire");
			$('#splainer-text').text("Are you located in Northern or Southern New Hampshire? Generally, Northern is defined as North of Manchester.");
			$('.boundmap').hide();
			$('#nhmap').show();
			$('#boundry-block').slideDown();
		}else{
			$('#ArrivingBoundry-north-label').text("North");
			$('#ArrivingBoundry-south-label').text("South");
			$('.boundmap').hide();
			$('#boundry-block').hide();
		}
	})

		if($('#arrivingStateCode') == "VT"){
			$('#arrivingBoundry-north-label').text("Northern Vermont")
			$('#arrivingBoundry-south-label').text("Southern Vermont")
			$('#splainer-text').text("Are you located in Northern or Southern Vermont? Generally, Northern is defined as North of Brattleboro.")
			$('#vtmap').show();
			$('#boundry-block').slideDown()
		}
		if($('#arrivingStateCode').val() == "ME"){
			$('#arrivingBoundry-north-label').text("Northern Maine")
			$('#arrivingBoundry-south-label').text("Southern Maine")
			$('#splainer-text').text("Are you located in Northern or Southern Maine? Generally, Northern is defined as North of Portland.")
			$('#memap').show();
			$('#boundry-block').slideDown()
		}
		if($('#arrivingStateCode').val() == "NH"){
			$('#arrivingBoundry-north-label').text("Northern New Hampshire")
			$('#arrivingBoundry-south-label').text("Southern New Hampshire")
			$('#splainer-text').text("Are you located in Northern or Southern New Hampshire? Generally, Northern is defined as North of Manchester.")
			$('#nhmap').show();
			$('#boundry-block').slideDown()
		}

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
		let error2 = false;

		if($('#isResident').is(':checked') 
		&& $('input[name=arrivingCountry]:checked').val() != "International"
		&& (
		   ($('input[name=arrivingCountry]:checked').val() == "" || $('input[name=arrivingCountry]:checked').val() == null)
		|| ($('#arrivingAddress1').val() == "" || $('#arrivingAddress1').val() == null)
		|| ($('#arrivingCity').val() == "" || $('#arrivingCity').val() == null)
		|| ($('#arrivingStateCode').val() == "" || $('#arrivingStateCode').val() == null)
		|| ($('#arrivingZip').val() == "" || $('#arrivingZip').val() == null)
		   )
		){
			$("#error1").text("Please provide a complete address").fadeIn();
			error = true;
		}else{
			$("#error1").hide();
			error = false;
		}

		if($("#address-block").is(":visible")){

			if(!$('#isResident').is(':checked')
			&& $('input[name=planToLive]:checked').val() != ""
			&& $('input[name=planToLive]:checked').val() != null
			&& $('input[name=planToLive]:checked').val() != "At An International Location"
			&& (
			($('#address1').val() == "" || $('#address1').val() == null)
			|| ($('#city').val() == "" || $('#city').val() == null)
			|| ($('#state').val() == "" || $('#state').val() == null)
			|| ($('#zip').val() == "" || $('#zip').val() == null)
			)
			){
				$("#error2").text("Please provide a complete address").fadeIn();
				error2 = true;
			}else{
				$("#error2").hide();
				error2 = false;
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
							term:"202102",
							pterm:"C",
							source: window.location.href,
							type: 'Student Intent Survey',
							status: $("#status").text(),
							colCode: $('#wpi-colCode').text(),
							isInternational:$('#isInternational').is(':checked'),
							isResident:$('#isResident').is(':checked'),
							isFirstYear:$('#isFirstYear').is(':checked'),
							isGrad:$('#isGrad').is(':checked'),
							isAthlete:$('#isAthlete').is(':checked'),
							ArrivingCountry:$('input[name=arrivingCountry]:checked').val(),
							ArrivingAddress1:$('#arrivingAddress1').val(),
							ArrivingAddress2:$('#arrivingAddress2').val(),
							ArrivingCity:$('#arrivingCity').val(),
							ArrivingStateCode:$('#arrivingStateCode').val(),
							ArrivingZip:$('#arrivingZip').val(),
							ArrivingBoundry:$('input[name=arrivingBoundry]:checked').val(),
							onlineOnly:$('input[name=onlineOnly]:checked').val(),
							comeToCampus:$('input[name=comeToCampus]:checked').val(),
							employedWPI:$('input[name=employedWPI]:checked').val(),
							planToLive:$('input[name=planToLive]:checked').val(),
							anotherState:$('input[name=anotherState]:checked').val(),
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
							timeZone:$('#timeZone').val(),
							housingRequest:$('input[name=requestHousing]:checked').val(),
							housingBuilding:$('#housingBuilding').val(),
							housingRooomate:$('#housingRoommate').val()
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
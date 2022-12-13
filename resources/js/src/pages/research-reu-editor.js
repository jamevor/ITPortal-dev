/* global grecaptcha */
$(document).ready(function() {

	$('#gender').on("change",function(){
		if($('#gender').val() == "Other"){


		}else{
			$('#genderOther').val('');
		}
	})

	$('#race').on("change",function(){
		if($('#race').val() == "Other"){

		}else{
			$('#raceOther').val('');
		}
	})

	$('input[name=planToLive]').on("change",function(){
		if($('input[name=planToLive]:checked').val() == "True"){
			$('#offCampusDate').val('');
			$('#addr1').val('Worcester Polytechnic Institute');
			$('#addr2').val('100 Institute Road');
			$('#city').val('Worcester');
			$('#state').val('MA');
			$('#zip').val('01609');
		}else{
			$('#addr1').val('');
			$('#addr2').val('');
			$('#city').val('');
			$('#state').val('');
			$('#zip').val('');
		}
	})

	
	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		let error = false;

		if( error == false){
			if (!$('#button-submit-help-form').hasClass('disabled')) {
			
				$('#button-submit-help-form').addClass('disabled');
				grecaptcha.ready(function() {
					grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
						const status = $("#wpiID").val() != "" ? "Active" : "Waiting";
						const formData = {	
							source: window.location.href,
							type: 'REU Form',
							status: status,
							isEditor:true,
							busObRecId:$("#busObRecId").val(),
							publicID:$("#busObPublicId").val(),
							department: $("#department").val(),
							nameFirst: $("#nameFirst").val(),
							nameLast: $("#nameLast").val(),
							homeUniversity: $("#homeUniversity").val(),
							personalCell: $("#personalCell").val(),
							personalEmail: $("#personalEmail").val(),
							dateOfBirth: $("#dateOfBirth").val(),
							gender: $("#gender").val(),
							genderOther: $("#genderOther").val(),
							race: $("#race").val(),
							raceOther: $("#raceOther").val(),
							planToLive:$('input[name=planToLive]:checked').val(),
							offCampusDate: $("#offCampusDate").val(),
							addr1: $("#addr1").val(),
							addr2: $("#addr2").val(),
							city: $("#city").val(),
							state: $("#state").val(),
							zip: $("#zip").val(),
							travelFrom: $("#travelFrom").val(),
							homeaddr1: $("#homeaddr1").val(),
							homeaddr2: $("#homeaddr2").val(),
							homecity: $("#homecity").val(),
							homestate: $("#homestate").val(),
							homezip: $("#homezip").val(),
							vaccineStatus:$('#vaccineStatus').val(),
							vaccineDate: $("#vaccineDate").val(),
							insuranceProvider: $("#insuranceProvider").val(),
							insuranceMember: $("#insuranceMember").val(),
							emergencyName: $("#emergencyName").val(),
							emergencyPhone: $("#emergencyPhone").val(),
							emergencyRelationship: $("#emergencyRelationship").val(),
							dietaryNeeds: $("#dietaryNeeds").val(),
							accomodations: $("#accomodations").val(),
							wpiID: $("#wpiID").val(),
							formsI9:$('#formsI9').is(':checked'),
							formsID:$('#formsID').is(':checked'),
							formsInternational:$('#formsInternational').is(':checked'),
							// clearedPreArrival:$('#clearedPreArrival').is(':checked'),
							// clearedWaiver:$('#clearedWaiver').is(':checked'),
							// clearedAlden:$('#clearedAlden').is(':checked'),
						};

						$.ajax(
							{
								url: '/api/v1/cherwell/REU/update/one/',
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
									$('#button-submit-help-form').html('Update REU Form');
								},
								error: function(resp) {
									$('#toast-save-error').addClass('show');
									$('#button-submit-help-form').removeClass('disabled');
									$('#button-submit-help-form').html('Update REU Form');
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
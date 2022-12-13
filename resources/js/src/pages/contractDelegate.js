
/* global grecaptcha */

$(document).ready(function() {
	$('#delgationType').on('input',function(){
		if($(this).val() == 'DateRange'){
			$('#delegationTypeDateBlock').slideDown()
		}else{
			$('#delegationTypeDateBlock').hide()
			$('#delegationTypeDateBlock input').val('')
		}
	})
	$('#submitButton').on('click',function(event){
		var requestType = $('#requestType').val()
		var recId = null;
		if (requestType == "updated"){
			recId = $('#requestType').data("recid");
		}
		if (document.getElementById("complete").checked == false){
			event.preventDefault();
		}
		else{
		$.ajax(
			{
				url: '/api/v1/cherwell/ContractDelegate/update/one/',
				method: 'POST',
				data: {
					formData: {
						busObRecId: recId,
						source: window.location.href,
						type: 'Initiate Contract Delegation Form',
						requestType: requestType,
						recId: recId,
						delegateeLegalName: $('#delegateeLegalName').val(),
						delegatorLegalName: $('#delegatorLegalName').val(),
						delegationPurpose: $('#delgationPurpose').val(),
						delegationAmount: $('#delgationAmount').val(),
						delegatorSignDate: $('#delegatorSignDate').val(),
						delegateeSignDate: $('#delegateeSignDate').val(),
						delegationType: $('#delgationType').val(),
						delegationTypeDateStart: $('#delegationTypeDateStart').val(),
						delegationTypeDateEnd: $('#delegationTypeDateEnd').val(),
						delegatorID:$('#delegatorRecID').text(),
						delegateeID:$('#delegateeRecID').text()
					}
				},
				beforeSend: function() {

				},
				success: function(resp) {
					window.location.replace("/Me/My-Delegations");
					
			
				},
				error: function(resp) {
					$('#toast-save-error').addClass('show');
					$('#button-submit-case').html('Submit Case');
					$('#slideControls').show()

				}
			}
		);
		}
	})

	$.get("/api/v1/cherwell/employees/get/all")
	.done(function(data) {
		initAutoComplete(data.employees);
		$('.data-loader').hide();
		$('.data-loaded').fadeIn();
	})
	.fail(function() {
		$('.data-loader i').removeClass('fa-spinner-third fa-spin');
		$('.data-loader i').addClass('fa-times-circle');
		$('.data-loader p').text("Unable to get Employee list. Please refresh or try again later.");
	});

	function initAutoComplete(autocompleteDataSource) {
		var options = {

			data: autocompleteDataSource,
		  
			getValue: function(element){
				return element.RecID+" - "+element.EmployeeID+" - "+element.FullName+" - "+element.Email
			 },
			template: {
				type: "custom",
				method: function(value, item) {
					return `
					<div class="course-lookup-item" data-crn="${item.RecID}">
						<div class="course-lookup-group group-text">
							<div class="course-lookup-item-title">${item.FullName}</div>
							<div class="course-lookup-item-crn">${item.EmployeeID}</div>
							<div class="course-lookup-item-crn">${item.Email}</div>
						</div>
	
					</div>`
				}
			},
			list: {
			  match: {
				enabled: true
			  },
			  onChooseEvent: function() {
				let employee = $("#employees").getSelectedItemData();
				$('.data-loaded').hide();
				$('.data-loader').parent().hide()
				$('#delegatee').html(`
				<p id="delegateeName">${employee.FullName}</p>
				<p id="delegateeEmail">${employee.Email}</p>
				<p id="delegateeID">${employee.EmployeeID}</p>
				<p id="delegateeRecID" style="display:none">${employee.RecID}</p>
				`).fadeIn()

				
			  }
			}
	
		  };
		  $("#employees").easyAutocomplete(options);
		}
})

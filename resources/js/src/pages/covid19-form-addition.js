/* global grecaptcha */
var studentNumber = 0;
$(document).ready(function() {


	$('.help-form').on('click', '[data-close-target|=student-fieldset]', function() {
		$(`#${$(this).data('close-target')}`).slideUp(400, function() {
			$(this).remove();
		});
	});

	var elem = document.querySelector('.carousel');
	var flkty = new Flickity( elem, {
		// options
		cellAlign: "left",
		contain: true,
		adaptiveHeight: false,
		setGallerySize: false,
		pageDots: false,
		prevNextButtons: false,
		draggable: false
	});

	// Buttons and status tracking
	$('#nav-back').on( 'click', function(e) {
		e.preventDefault();
		flkty.previous();
		$(".toc-item").removeClass('active');
		$(".toc-item[data-controls="+flkty.selectedIndex+"]").addClass('active');
		buttonVisibility();
	  });
	$('#nav-next').on( 'click', function(e) {
		e.preventDefault();
		
		flkty.next();
		$(".toc-item").removeClass('active');
		$(".toc-item[data-controls="+flkty.selectedIndex+"]").addClass('active');
		buttonVisibility();
	});
	$('.toc-item').on( 'click', function(e) {
		e.preventDefault();
		
		let index = $(this).data("controls");
		$(".toc-item").removeClass('active');
		$(this).addClass("active");
		flkty.select(index);
		buttonVisibility();
	  });
	
	  function buttonVisibility(){
		if(flkty.selectedIndex == 0){
			$('#nav-back').addClass("disabled");
			$('#nav-next').removeClass("disabled");
		}
		if(flkty.selectedIndex == (flkty.slides.length-1)){
			$('#nav-next').addClass("disabled");
			$('#nav-back').removeClass("disabled");
		}
		if((flkty.selectedIndex != (flkty.slides.length-1)) && (flkty.selectedIndex != 0)){
			$('#nav-next').removeClass("disabled");
			$('#nav-back').removeClass("disabled");
		}
	  }
	  $('#RLR-8-personnelCards').change(function() {
		  console.log("changed");
			if ($(this).val() === 'no') {
				$('#RLR-9-toggle').slideDown();
			} else {
				$('#RLR-9-toggle').slideUp();
			}
		});

		$('#RLR-13-shared').change(function() {
			  if ($(this).val() === 'yes') {
				  $('#RLR-14-toggle').slideDown();
			  } else {
				  $('#RLR-14-toggle').slideUp();
			  }
		  });
		  $('#RLR-23-core').change(function() {
			  if ($(this).val() === 'yes') {
				  $('#RLR-24-toggle').slideDown();
			  } else {
				  $('#RLR-24-toggle').slideUp();
			  }
		  });
		  $('#RLR-25-animalUse').change(function() {
			  if ($(this).val() === 'yes') {
				  $('#RLR-26-toggle').slideDown();
			  } else {
				  $('#RLR-26-toggle').slideUp();
			  }
		  });

	$('.help-form').on('keyup change paste', '.student-name-field', function(event) {
		if (typeof $(event.currentTarget).val() === 'string' && $(event.currentTarget).val().length) {
			$(event.currentTarget).siblings('legend').html(`${$(event.currentTarget).val()}`);
		} else {
			$(event.currentTarget).siblings('legend').html('Person');
		}
	});

	$('#button-add-student').click(function(event) {
		event.preventDefault();
		addStudent();
	});

	$('#button-submit-help-form').click(function(event) {
		event.preventDefault();
		if (!$('#button-submit-help-form').hasClass('disabled')) {
			$('#button-submit-help-form').addClass('disabled');
			grecaptcha.ready(function() {
				grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form'}).then(function(token) {
					const formData = {
						source: window.location.href,
						type: 'COVID19 Access Request',
						// User
						fullName: $('#full-name').val() || $('#full-name').text(),
						department: $('#wpi-department').val() || $('#wpi-department').text(),
						wpiID: $('#wpi-id').val() || $('#wpi-id').text(),
						wpiEmail: $('#wpi-email').val() || $('#wpi-email').text(),
						wpiPhone: $('#wpi-phone').val() || $('#wpi-phone').text(),
						
						// RLR
						RLR_1: $('#RLR-1-original-ticket').val(),
						RLR_2: $('#RLR-2-social').val(),
						RLR_4: $('#RLR-4-head').val(),
						RLR_5: $('#RLR-5-personnelJustification').val(),
						RLR_6: $('#RLR-6-personnelTravel').val(),
						RLR_7: $('#RLR-7-personnelSafety').val(),
						RLR_8: $('#RLR-8-personnelCards').val(),
						RLR_9: $('#RLR-9-personnelCardsWho').val(),
					}
					const users = [];
					for (let i = 0; i <= studentNumber; i++) {
						if ($(`#student-fieldset-${i}`).length > 0) {

							users.push(
								{
									usersName: $(`#student-name-${i}`).val(),
									usersID: $(`#student-id-${i}`).val(),
									usersEmail: $(`#student-email-${i}`).val(),
									usersType: $(`#student-type-${i}`).val(),
									usersPhase: $(`#student-phase-${i}`).val(),
									usersfunding: $(`#student-funding-${i}`).val(),
									usersRemote: $(`#student-remote-${i}`).val(),
									usersSafety: $(`#student-safety-${i}`).val(),
									usersReside: $(`#student-reside-${i}`).val(),
									usersAppointment: $(`#student-appointment-${i}`).val(),
									usersGradYear: $(`#student-gradyear-${i}`).val()
								}
							);
						}
					}
					
					formData.users = users;
					$.ajax(
						{
							url: '/api/v1/cherwell/ticket/create/one/covid19-add',
							method: 'POST',
							data: {
								token,
								formData
							},
							beforeSend: function() {
								$('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
							},
							success: function(resp) {
								$('#toast-save-success .toast-message').text("Your request has been submitted, and ticket "+ resp.busObPublicId +" has been created")
								$('#toast-save-success').addClass('show');
								$('#button-submit-help-form').html('<i class=\'fas fa-check-circle \'></i>');
							},
							error: function(resp) {
								$('#toast-save-error').addClass('show');
								$('#button-submit-help-form').html('<i class=\'fas fa-times-octagon\'></i>');
							}
						}
					);
				});
			});
		}
	});

});

const addStudent = () => {
	$('legend').show();
	studentNumber++;
	let result = `

	<fieldset id="student-fieldset-${studentNumber}">
		<legend>Person ${studentNumber + 1}</legend>

		<button class="close-button" aria-label="Close Fieldset" type="button" data-close-target="student-fieldset-${studentNumber}"> <span aria-hidden="true">&times;</span> </button>

		<label class="form-label"  for="student-name-${studentNumber}">Person's Full Name</label>
		<input type="text" id="student-name-${studentNumber}" name="student-name-${studentNumber}" class='student-name-field'>

		<label class="form-label"  for="student-id-0">Person's WPI ID #</label>
		<input type="number" id="student-id-${studentNumber}" name="student-id-${studentNumber}">

		<label class="form-label"  for="student-email-${studentNumber}">Person's WPI Email</label>
		<input type="email" id="student-email-${studentNumber}" name="student-email-${studentNumber}">

		<label class="form-label"  for="student-type-${studentNumber}">Type</label>
		<p class="form-label-help">Faculty, Academic Researcher, Staff, Postdoc, Doctoral Student, etc.</p>
		<input type="text" id="student-type-${studentNumber}" name="student-type-${studentNumber}">

		<label class="form-label"  for="student-phase-${studentNumber}">During which <a href="https://www.wpi.edu/news/coronavirus/guidance-research/research-lab-reopening-guidance" target="_blank">Reopening Phase</a> will they need to return to campus?</label>
		<select id="student-phase-${studentNumber}" name="student-phase-${studentNumber}">
			<option value="">-</option>
			<option value="Phase 1">Phase 1 - Critical Research</option>
			<option value="Phase 2">Phase 2 - Time Sensitive Existing Research</option>
			<option value="Phase 3">Phase 3 - Critical New Research</option>
			<option value="Phase 4">Phase 4 - Expansion of On-Campus Research</option>
		</select>
			
		<label class="form-label"  for="student-funding-${studentNumber}">Funding Support</label>
		<p class="form-label-help">If sponsored specify grant or contract</p>
		<input type="text" id="student-funding-${studentNumber}" name="student-funding-${studentNumber}">

		<label class="form-label"  for="student-remote-${studentNumber}">Are they able to perform research Remotely?</label>
		<select id="student-remote-${studentNumber}" name="student-remote-${studentNumber}">
		<option value="">-</option>
		<option value="yes">Yes</option>
		<option value="no">No</option>
		</select>

		<label class="form-label"  for="student-safety-${studentNumber}">Are they able to safely return to the Lab?</label>
		<select id="student-safety-${studentNumber}" name="student-safety-${studentNumber}">
		<option value="">-</option>
		<option value="yes">Yes</option>
		<option value="no">No</option>
		</select>

		<label class="form-label"  for="student-reside-${studentNumber}">Do they Reside On-Campus or Off-Campus?</label>
		<select id="student-reside-${studentNumber}" name="student-reside-${studentNumber}">
		<option value="">-</option>
		<option value="on-campus">On-Campus</option>
		<option value="off-campus">Off-Campus</option>
		</select>

		<label class="form-label"  for="student-appointment-${studentNumber}">Appointment Year</label>
		<p class="form-label-help">Postdocs only</p>
		<input  type="number" min="1990" max="2099" step="1" placeholder="2020" id="student-appointment-${studentNumber}" name="student-appointment-${studentNumber}">

		<label class="form-label"  for="student-gradyear-${studentNumber}">Anticipated Graduation Year and Year of Study </label>
		<p class="form-label-help">Doctoral Students Only</p>
		<input  type="text" id="student-gradyear-${studentNumber}" name="student-gradyear-${studentNumber}" placeholder="eg. 2022 / Year 3">
		
	</fieldset>
	`;
	$('#button-add-student').before(result);
};

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
						DRW_1:$('#DRW-1-department-name').val(),
						DRW_2:$('#DRW-2-department-location').val(),
						DRW_3:$('#DRW-3-department-rationale').val(),
						DRW_4:$('#DRW-4-distancing').val(),
						DRW_5:$('#DRW-5-hygiene').val(),
						DRW_6:$('#DRW-6-staffing').val(),
						DRW_7:$('#DRW-7-cleaning').val(),
						DRW_8:$('#DRW-8-other').val(),
						DRW_9:$('#DRW-9-rampdown').val(),
					}
					let formUsers = document.getElementById('excelDataTable').outerHTML;
					formData.users = formUsers;
					// const users = [];
					// for (let i = 0; i <= studentNumber; i++) {
					// 	if ($(`#student-fieldset-${i}`).length > 0) {

					// 		users.push(
					// 			{
					// 				usersName: $(`#student-name-${i}`).val(),
					// 				usersID: $(`#student-id-${i}`).val(),
					// 				usersEmail: $(`#student-email-${i}`).val(),
					// 				usersidNeed: $(`#student-idNeed-${i}`).val()
					// 			}
					// 		);
					// 	}
					// }
					
					// formData.users = users;
					$.ajax(
						{
							url: '/api/v1/cherwell/ticket/create/one/covid19Department',
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

		<label class="form-label"  for="student-id-${studentNumber}">Person's WPI ID #</label>
		<input type="number" id="student-id-${studentNumber}" name="student-id-${studentNumber}">

		<label class="form-label"  for="student-email-${studentNumber}">Person's WPI Email</label>
		<input type="email" id="student-email-${studentNumber}" name="student-email-${studentNumber}">

		<label class="form-label" for="student-idNeed-${studentNumber}">Need New WPI ID?</label>
		<p class="form-label-help">Has this person lost or misplaced their WPI ID and needs a replacement?</p>
		<select id="student-idNeed-${studentNumber}" name="student-idNeed-${studentNumber}">
		<option value="">-</option>
		<option value="yes">Yes</option>
		<option value="no">No</option>
		</select>
	</fieldset>
	`;
	$('#button-add-student').before(result);
};

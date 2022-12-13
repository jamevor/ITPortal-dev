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
						
						// RLR previous
						RLR_1: $('#RLR-1-original-ticket').val(),
						RLR_4: $('#RLR-4-head').val(),
						// RLR 
						RLR_5: $('#RLR-5').val() || '',
						RLR_6: $('#RLR-6').val() || '',
						RLR_7: $('#RLR-7').val() || '',
						RLR_8: $('#RLR-8').val() || '',
						RLR_9: $('#RLR-9').val() || '',
						RLR_10: $('#RLR-10').val() || '',
						RLR_11: $('#RLR-11').val() || '',
						RLR_12: $('#RLR-12').val() || '',
						RLR_13: $('#RLR-13').val() || '',
						RLR_14: $('#RLR-14').val() || '',
						RLR_15: $('#RLR-15').val() || '',
						RLR_16: $('#RLR-16').val() || '',
						RLR_17: $('#RLR-17').val() || '',
					}

					$.ajax(
						{
							url: '/api/v1/cherwell/ticket/create/one/covid19-external-add',
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
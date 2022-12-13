$(function() {
    $('#RSVPChoices button').on('click', function(event) {
		event.preventDefault();

        const rsvpStatus = $(this).data('choice');
        console.log(rsvpStatus);

        grecaptcha.ready(function() {
            grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_commencement_rsvp'}).then(function(token) {
                $.ajax(
                    {
                        url: '/api/v1/cherwell/commencementRSVP/update/one',
                        method: 'POST',
                        data: {
                            token,
                            formData: {
                                source: window.location.href,
                                type: 'Commencement RSVP Change',
                                RSVP: rsvpStatus,
                                RecID:$('#RSVPModal-id').val()
                            }
                        },
                        beforeSend: function() {
                            $('#RSVPChoices').hide();
                            $('#RSVPLoader #success').hide()
                            $('#RSVPLoader #error').hide()
                            $('#RSVPLoader #spinner').show()
                            $('#RSVPLoader').fadeIn();
                        },
                        success: function(resp) {
                            $('#RSVPLoader #spinner').hide()
                            $('#RSVPLoader #success').fadeIn()
                            setTimeout(() => {
                                location.reload();
                            }, 150);
                        },
                        error: function(resp) {
                            $('#RSVPLoader #spinner').hide()
                            $('#RSVPLoader #error').fadeIn()
                            setTimeout(() => {
                                $('#RSVPLoader').hide();
                                $('#RSVPChoices').fadeIn();
                            }, 300);
                        }
                    }
                );
            });
        });
		
	});

    $('a[href$="#"]').on('click', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
    });

    $('a.rsvpChanger').on('click', function() {

        let thisID = $(this).data('rsvpid');
        let thisname = $(this).data('ceremony');
        let thisstatus = $(this).data('status');

        $('#RSVPModal-id').val(thisID)
        $('#RSVPModal-title').text(thisname)
        $('#RSVPModal-status').text(thisstatus)

        $('#RSVPChoices button').removeClass('chosen');

        if(thisstatus =="Attending"){
            $('#RSVPChoices button.yes').addClass('chosen');
        }else if(thisstatus =="Not Attending"){
            $('#RSVPChoices button.no').addClass('chosen');
        }


    });
    $('a.enrollPreview').on('click', function() {

        let enrollStatus = $(this).data('enrollstatus');
        let enrollName = $(this).data('enrollname');
        let enrollHonors = $(this).data('enrollhonors');
        let level = $(this).data('level')

        if(level == "Graduate"){
            $('#honorsShower').hide()
        }else{
            $('#honorsShower').show()
        }
        $('#previewModal-name').text(enrollName)
        $('#previewModal-status').text(enrollStatus)
        $('#previewModal-honors').text(enrollHonors)
    });


    $('#addGuestSubmit').on('click', function(event) {
		event.preventDefault();
        var isComplete = false;

        if($('#guestFirst').val().length === 0 || $('#guestLast').val().length === 0 || $('#guestEmail').val().length === 0){
            isComplete = false;
        }else{
            isComplete = true
        }
        if(isComplete){
            $('#required').hide()
            grecaptcha.ready(function() {
                grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_commencement_add'}).then(function(token) {
                    $.ajax(
                        {
                            url: '/api/v1/cherwell/commencementGuest/create/one',
                            method: 'POST',
                            data: {
                                token,
                                formData: {
                                    source: window.location.href,
                                    type: 'Commencement Guest Add',
                                    RecID:$('#rsvpID').val(),
                                    guestFirst:$('#guestFirst').val(),
                                    guestLast:$('#guestLast').val(),
                                    guestEmail:$('#guestEmail').val()
                                }
                            },
                            beforeSend: function() {
                                $('#guestChoices').hide();
                                $('#RSVPLoader #success').hide()
                                $('#RSVPLoader #error').hide()
                                $('#RSVPLoader #spinner').show()
                                $('#RSVPLoader').fadeIn();
                            },
                            success: function(resp) {
                                $('#RSVPLoader #spinner').hide()
                                $('#RSVPLoader #success').fadeIn()
                                setTimeout(() => {
                                    location.reload();
                                }, 150);
                            },
                            error: function(resp) {
                                $('#RSVPLoader #spinner').hide()
                                $('#RSVPLoader #error').fadeIn()
                                $("#LoaderText").text(resp.responseText).fadeIn()
                            }
                        }
                    );
                });
            });
    }else{
        $('#required').show()
    }
		
	});

    $('a.voidGuestSubmit').on('click', function() {

        let thisID = $(this).data('ticketid');
        let thisname = $(this).data('guestname');

        $('#voidID').val(thisID)
        $('#voidGuestName').text(thisname)
    });

    $('a.ticketLink').on('click', function() {

        let thisID = $(this).data('ticketid');

        $('#ticketLinkID').val("https://hub.wpi.edu/Commencement/Ticket/"+thisID)
    });

    $('#ticketLinkID').on('click blur', function(){
        $(this).select()
    })
    $('#voidGuestSubmit').on('click', function(event) {
		event.preventDefault();
            var ticketRec = $('#voidID').val()
            grecaptcha.ready(function() {
                grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_commencement_void'}).then(function(token) {

                    $.ajax(
                        {
                            url: '/api/v1/cherwell/commencementGuest/void/one',
                            method: 'POST',
                            data: {
                                token,
                                formData: {
                                    source: window.location.href,
                                    type: 'Commencement Guest Void',
                                    RecID:ticketRec,
                                }
                            },
                            beforeSend: function() {
                                $('#voidGuestSubmit').fadeOut();
                            },
                            success: function(resp) {
                                location.reload();
                            },
                            error: function(resp) {
                                $('#voidGuestSubmit').fadeIn();
                            }
                        }
                    );
                });
            });
    
		
	});


    
});
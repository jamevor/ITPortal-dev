$(function() {
    $('#flickityWrapper').flickity({
        adaptiveHeight: true,
        pageDots: false,
        prevNextButtons: false,
        draggable: false,
        cellAlign: 'left'
    })

    $('#flickityWrapper2').flickity({
        adaptiveHeight: true,
        pageDots: false,
        prevNextButtons: false,
        draggable: false,
        cellAlign: 'left'
    })
    $('#flickityWrapper').css('opacity',1)
    $('#flickityWrapper2').css('opacity',1)
    
    if($('#flickityWrapper').is(':visible')){
        $('.slideControls').show()
    }
    if($('#flickityWrapper2').is(':visible')){
        $('.slideControls').show()
    }

    
//TODO numberOfDaysToAdd is 6 because date uses GMT time zone && 0 based index to set isolation for 5 days
    $("#test-type-date").on('input',function(){

        var someDate = new Date($(this).val());
        someDate.setHours(0,0,0,0);
        var numberOfDaysToAdd = 6;
        var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
        var newDate = timeConverter(result);

        $("#isolation-end").text(newDate.toLocaleString('en-US', { timeZone: 'America/New_York' }))

    })

    function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year;
        return time;
    }

      $("#p-number").on("keyup",function() {
        var number = $(this).val();

        number = number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        $(this).val(number);
        if (number.match(/^\d{3}-\d{3}-\d{4}$/)) {
          ("#next").hide();
        } else {
          number = number.replace(/\D/g, "");
          $(this).val(number);
          ("#next").show();

        }
      });

    $("#back").on('click',function(){
        $('#flickityWrapper').flickity('previous');
        $('#flickityWrapper2').flickity('previous');
    })

    $("#next").on('click',function(){
        $('#flickityWrapper').flickity('next');
        $('#flickityWrapper2').flickity('next');
        $(window).scrollTop(0);
    })

    $('#flickityWrapper').flickity().on( 'select.flickity', function( event, index ) {

        var flkty = $(this).data('flickity');

        $("#back,#next").show()

        if(index == 0){
            $("#back").hide()
        }
        if(index == 1){
        //    $("#next").hide()
        //    $('#next').prop("disabled",true)
        }
        if(index == 2){
            $("#next").hide()
        }
        // if(index == 2){
        //     if($("input[name=symptoms-mild]").is(':checked')){
        //         $('#next').prop("disabled",false)
        //     }else{
        //       $('#next').prop("disabled",true)
        //     }
        // }
        // if(index == 5){
        //     if($('input[name=isolation-home]').is(':checked') && $('input[name=exposure-travel]').is(':checked') ){
        //         $('#next').prop("disabled",false)
                
        //     }else{
        //         $('#next').prop("disabled",true)
        //     }
        // }
        if(index == 5) {
            $("#next").hide()
        }
    });

    $('#flickityWrapper2').flickity().on( 'select.flickity', function( event, index ) {

        var flkty = $(this).data('flickity');

        $("#back,#next").show()

        if(index == 0){
            $("#back").hide()
        }
        if(index == 1) {
            $("#next").hide()
        }
    });


    $("input[name=symptoms-mild]").on('change',function(){
            $('#next').prop("disabled",false)

            if($("input[name=symptoms-mild]").prop("checked") == true){
                $('#symptoms-mild-block').slideDown(function(){
                    $('#flickityWrapper').flickity('resize')
                })
                
            }else{
                $('#symptoms-mild-block').hide(function(){
                    $('#flickityWrapper').flickity('resize')
                })
            }
    })

    $("input[name=isolation-home],input[name=exposure-travel]").on('change',function(){
        if($('input[name=isolation-home]').is(':checked') && $('input[name=exposure-travel]').is(':checked') ){
            $('#next').prop("disabled",false)
        }
    })
    $("input[name=exposure-other]").on('change',function(){
        if($("input[name=exposure-other]").prop("checked") == true){
            $('#exposure-other-block').slideDown(function(){
                $('#flickityWrapper').flickity('resize')
            })
            
        }else{
            $('#exposure-other-block').hide(function(){
                $('#flickityWrapper').flickity('resize')
            })
        }

    })

    $("input[name=exposure-travel]").on('change',function(){
        if($("input[name=exposure-travel]").prop("checked") == true){
            $('#exposure-travel-block').slideDown(function(){
                $('#flickityWrapper').flickity('resize')
            })
        }else{
            $('#exposure-travel-block').hide(function(){
                $('#flickityWrapper').flickity('resize')
            })
        }

    })

    $("input[name=isolation-home]").on('change',function(){
        if($("input[name=isolation-home]").prop("checked") == true){
            $('#isolation-block').slideDown(function(){
                $('#flickityWrapper').flickity('resize')
            })
        }else{
            $('#isolation-block').hide(function(){
                $('#flickityWrapper').flickity('resize')
            })
        }

    })


    $("input[name=diet-other]").on('change',function(){
        if($("input[name=diet-other]").prop("checked") == true){
            $('#diet-block').slideDown(function(){
                $('#flickityWrapper').flickity('resize')
            })
        }else{
            $('#diet-block').hide(function(){
                $('#flickityWrapper').flickity('resize')
            })
        }
    })

    $("input[name=healthCondition-mentalHealth]").on('change',function(){
        if($("input[name=healthCondition-mentalHealth]").prop("checked") == true){
            $('#mhconcern').fadeIn(function(){
                $('#flickityWrapper').flickity('resize')
            })
        }else{
            $('#mhconcern').hide(function(){
                $('#flickityWrapper').flickity('resize')
            })
        }
    })



    $("input[name^=symptoms-severe").on('change',function(){
        let checker = $("input[name=symptoms-severe-breathing]").prop("checked") == true ||
        $("input[name=symptoms-severe-chestPain]").prop("checked") == true ||
        $("input[name=symptoms-severe-confusion]").prop("checked") == true ||
        $("input[name=symptoms-severe-awake]").prop("checked") == true ||
        $("input[name=symptoms-severe-blueSkin]").prop("checked") == true ||
        $("input[name=symptoms-severe-fever]").prop("checked") == true;
        
        if(checker == true){
            $('#ebox').css({'border-color':'var(--color-pop)','background-color':"hsl(8, 88%, 95%)"})
        }else{
            $('#ebox').css({'border-color':'','background-color':''})
        }
    })

 



    $("input[name=acknowledgement]").on('change',function(){
        if($("input[name=acknowledgement]").prop("checked") == true){
            $('#button-submit-case').removeClass('disabled');
        }else{
            $('#button-submit-case').addClass('disabled');
        }
    })

    $("input[name^=check-").on('change',function(){
        let checker = $("input[name=check-isolation]").is(':checked') &&
        $("input[name=check-feverFree").is(':checked') &&
        $("input[name=check-asymptomatic]").is(':checked')
        $("input[name=check-test]").is(':checked');
        
        if(checker == true){
            $('#button-submit-clear').removeClass('disabled');
        }else{
            $('#button-submit-clear').addClass('disabled');
        }
    })

	$('#button-submit-case').click(function(event) {
		event.preventDefault();
		if (!$('#button-submit-case').hasClass('disabled')) {
			$('#button-submit-case').addClass('disabled');
			grecaptcha.ready(function() {
				grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_case'}).then(function(token) {
					$.ajax(
						{
							url: '/api/v1/cherwell/covidcase/create/one/',
							method: 'POST',
							data: {
								token,
								formData: {
									source: window.location.href,
									type: 'Covid Case Form',
                                    test:{
                                        type: $("input[name=test-type]:checked").val() ?? '',
                                        date: $("input[name=test-type-date]").val() ?? '',
                                    },
                                    symptoms: {
                                        mild: $("input[name=symptoms-mild]").prop("checked") ?? '',
                                        mildDate: $("input[name=symptoms-mild-date]").val() ?? '',
                                        severe:{
                                            breathing: $("input[name=symptoms-severe-breathing]").prop("checked") ?? '',
                                            chestPain: $("input[name=symptoms-severe-chestPain]").prop("checked") ?? '',
                                            confusion: $("input[name=symptoms-severe-confusion]").prop("checked") ?? '',
                                            awake: $("input[name=symptoms-severe-awake]").prop("checked") ?? '',
                                            blueSkin: $("input[name=symptoms-severe-blueSkin]").prop("checked") ?? '',
                                            fever: $("input[name=symptoms-severe-fever]").prop("checked") ?? '',
                                        }
                                    },
                                    healthCondition: {
                                        cancer: $("input[name=healthCondition-cancer]").prop("checked") ?? '',
                                        cerebrovascular: $("input[name=healthCondition-cerebrovascular]").prop("checked") ?? '',
                                        kidney: $("input[name=healthCondition-kidney]").prop("checked") ?? '',
                                        lung: $("input[name=healthCondition-lung]").prop("checked") ?? '',
                                        liver: $("input[name=healthCondition-liver]").prop("checked") ?? '',
                                        diabetes: $("input[name=healthCondition-diabetes]").prop("checked") ?? '',
                                        heart: $("input[name=healthCondition-heart]").prop("checked") ?? '',
                                        mentalHealth: $("input[name=healthCondition-mentalHealth]").prop("checked") ?? '',
                                        obesity: $("input[name=healthCondition-obesity]").prop("checked") ?? '',
                                        pregnant: $("input[name=healthCondition-pregnant]").prop("checked") ?? '',
                                        smoking: $("input[name=healthCondition-smoking]").prop("checked") ?? '',
                                        tuberculosis: $("input[name=healthCondition-tuberculosis]").prop("checked") ?? '',
                                        otherImmune: $("input[name=healthCondition-otherImmune]").prop("checked") ?? '',
                                        roommate: $("input[name=healthCondition-roommate]").prop("checked")?? ''
                                    },
                                    exposure:{
                                        recentCloseContact: $("input[name=exposure-recentCloseContact]").prop("checked") ?? '',
                                        aroundSick: $("input[name=exposure-aroundSick]").prop("checked") ?? '', 
                                        visitFamily: $("input[name=exposure-visitFamily]").prop("checked") ?? '', 
                                        socialGathering: $("input[name=exposure-socialGathering]").prop("checked") ?? '', 
                                        publicTransport: $("input[name=exposure-publicTransport]").prop("checked")?? '', 
                                        barRestaurant: $("input[name=exposure-barRestaurant]").prop("checked")?? '', 
                                        funeralWedding: $("input[name=exposure-funeralWedding]").prop("checked")?? '', 
                                        salon: $("input[name=exposure-salon]").prop("checked")?? '', 
                                        groupExercise: $("input[name=exposure-groupExercise]").prop("checked") ?? '', 
                                        pool: $("input[name=exposure-pool]").prop("checked") ?? '', 
                                        contactSport: $("input[name=exposure-contactSport]").prop("checked") ?? '', 
                                        recActivity: $("input[name=exposure-recActivity]").prop("checked") ?? '', 
                                        movieTheater: $("input[name=exposure-movieTheater]").prop("checked") ?? '', 
                                        libraryMuseum: $("input[name=exposure-libraryMuseum]").prop("checked") ?? '', 
                                        mallGrocery: $("input[name=exposure-mallGrocery]").prop("checked") ?? '', 
                                        largePublic: $("input[name=exposure-largePublic]").prop("checked") ?? '', 
                                        other: $("input[name=exposure-other]").prop("checked") ?? '' ,
                                        otherDetail: $("#exposure-otherDetail").val() ?? '',
                                        travel: $("input[name=exposure-travel]").prop("checked") ?? '',
                                        travelDestination: $("#exposure-travelDestination").val() ?? '',
                                        travelDetails: $("#exposure-travelDetails").val() ?? '',
                                        roommate: $("#exposure-roommate").val() ?? '',
                                        partners: $("#exposure-partners").val() ?? ''
                                    },
                                    diet:{
                                        vegetarian:$("input[name=diet-vegetarian]").prop("checked") ?? '',
                                        vegan:$("input[name=diet-vegan]").prop("checked") ?? '',
                                        lactose:$("input[name=diet-lactose]").prop("checked") ?? '',
                                        gluten:$("input[name=diet-gluten]").prop("checked") ?? '',
                                        kosherhallal:$("input[name=diet-kosherhallal]").prop("checked") ?? '',
                                        nut:$("input[name=diet-nut]").prop("checked") ?? '' ,
                                        seafood:$("input[name=diet-seafood]").prop("checked") ?? '',
                                        soy:$("input[name=diet-soy]").prop("checked") ?? '',
                                        other:$("input[name=diet-other]").prop("checked") ?? '',
                                        otherDetail:$("#diet-otherDetail").val() ?? ''
                                    },
                                    isolation:{
                                        home:$("input[name=isolation-home]").prop("checked") ?? '',
                                        city:$("#isolation-city").val() ?? '',
                                        state:$("#isolation-state").val() ?? '',
                                        telephone:$("input[name=p-number]").val() ?? '',
                                       // location:$('input[name="isoLocation"]:checked').val() ?? '',
                                        location: $("#isoLocation-greekHome").prop("checked") ? $("#isoLocation-greekHome-options").val() : '',
                                        contactMe: $("input[name=call-me]").prop("checked") ?? '',
                                        other: $("input[name=exposure-other]").prop("checked") ?? '' ,
                                        acknowledgement:$("input[name=acknowledgement]").prop("checked") ?? ''
                                    },
								}
							},
							beforeSend: function() {                             
								$('#button-submit-case').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
                                $('.slideControls').hide()
							},
							success: function(resp) {
                                $('#flickityWrapper').hide();
                                $('#afterCare').fadeIn();
							},
							error: function(resp) {
                                alert("error");
								$('#toast-save-error').addClass('show');
								$('#button-submit-case').html('Submit Case');
                                $('#slideControls').show()
							}
						}
					);
				});
			});
		}
	});

    $('#button-submit-clear').click(function(event) {
		event.preventDefault();
		if (!$('#button-submit-clear').hasClass('disabled')) {
			$('#button-submit-clear').addClass('disabled');
                $.ajax(
                    {
                        url: '/api/v1/cherwell/covidclear/create/one/',
                        method: 'POST',
                        data: {
                            formData: {
                                source: window.location.href,
                                type: 'Covid clear Form',
                                check:{
                                    asymptomatic: $("input[name=check-asymptomatic]").prop("checked"),
                                    feverFree: $("input[name=check-feverFree]").prop("checked"), 
                                    isolation: $("input[name=check-isolation]").prop("checked"),
                                    test: $("input[name=check-test]:checked").val() ?? '',
                                }
                            }
                        },
                        mydata: {
                            check:{
                                asymptomatic: $("input[name=check-asymptomatic]").prop("checked"),
                                feverFree: $("input[name=check-feverFree]").prop("checked"), 
                                isolation: $("input[name=check-isolation]").prop("checked"),
                                test: $("input[name=check-test]:checked").val() ?? '',

                            }
                        },
                        beforeSend: function() {
                            $('#button-submit-clear').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
                            $('.slideControls').hide()
                        },
                        success: function(resp) {
                            $('#flickityWrapper2').hide();
                            let d = this.mydata.check;
                            console.log(d);
                            if(d.asymptomatic == true && d.feverFree == true && d.isolation == true && (d.test != 'Positive')){
                                $('#cleared').fadeIn();
                            }else{
                                $('#notcleared').fadeIn();
                            }
                        },
                        error: function(resp) {
                            $('#toast-save-error').addClass('show');
                            $('#button-submit-clear').html('Check Clearance Eligibility');
                            $('#slideControls').show()
                        }
                    }
                );
        }
    });
});
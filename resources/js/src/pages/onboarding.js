$(function() {
    $('.button-submit').on('click',function(){
        const queryElement = $(this).parent();
        const dataElement = queryElement.children('.fieldChunkItem')
        const revealElement = queryElement.parent('.reveal')
        var dataValues = []
        dataElement.each(function(){
            let builder = {};
            var dataHolder = $(this).children('.fieldChunkData');
            builder.label = dataHolder.data('label')
            builder.type = dataHolder.data('type')


            if(dataHolder.data("type") == "Date"){
                builder.value = $(this).children('input').val()
            }else if(dataHolder.data("type") == "Multiline Text"){
                builder.value = $(this).children('Textarea').val()
            }else if(dataHolder.data("type") == "Number"){
                builder.value = $(this).children('input').val()
            }else if(dataHolder.data("type") == "Select"){
                builder.value = $(this).children('input').val()
            }else if(dataHolder.data("type") == "Text"){
                builder.value = $(this).children('input').val()
            }else if(dataHolder.data("type") == "Yes/No"){

                builder.value = $(this).children('.impact-boxes').find('input:checked').val()
            }
            dataValues.push(builder);
        })
        
        var onboardingPersonName = $('.onboardingPersonName span').text()
        var onboardingPersonID = $('.onboardingPersonID span').text()
        var onboardingRep = $('.onboardingRep span').text()
        var onboardingRecID = $('.onboardingRecID').text()
        var onboardingPublic = $('.onboardingPublic').text()
        var outputDescription = `${onboardingRep} has generated an onboarding Task for ${onboardingPersonName}(${onboardingPersonID}):`
        for(const dataValue of dataValues){
outputDescription += `
${dataValue.label}(${dataValue.type}):
${dataValue.value}
`
        }
        console.log(revealElement.data('recid'))
        $.ajax(
            {
                url: '/api/v1/cherwell/onboardingTask/create/one/',
                method: 'POST',
                data: {
                    recid: onboardingRecID,
                    publicid: onboardingPublic,
                    destination: revealElement.data('destination'),
                    title: revealElement.data('title'),
                    description: outputDescription
                },
                beforeSend: function() {
                    revealElement.children('.button-submit').hide()
                    revealElement.children('.loader').fadeIn();
                },
                success: function(resp) {
                    revealElement.children('.button-submit').show()
                    revealElement.children('.loader').hide();
                    revealElement.foundation('close')
                },
                error: function(resp) {
                    revealElement.children('.loader').hide();
                    revealElement.children('.button-submit').fadeIn()
                }
            }
        );
    })


});
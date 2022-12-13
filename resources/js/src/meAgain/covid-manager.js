$(function() {
     $('#idscanner').on('input', function(){
        if($(this).val().length >= 9){
            CheckIn($(this).val())
        }
     })
     $('#responseReveal').on('closed.zf.reveal',function(){
        $('#idscanner').val('')
     })
     $('#doAllocate').on('click',function(){
        
        $.ajax(
            {
                url: '/api/v1/cherwell/distributeTest/',
                method: 'POST',
                data: {
                    
                    ID: $('.rr-WPIID').text(),
                    name:$('.rr-attendee').text(),
                    recordType:$('.rr-type').text(),
                    createdBy:$('.rr-createdBy').text()
                    
                },
                beforeSend: function() {
                    $('#responseReveal button').hide();
                    $('#submitloader').fadeIn();
    
                },
                success: function(resp) {
                    $('#responseReveal').foundation('close')
                    $('#submitloader').hide();
                    $('#errorBlock span').text("Tests allocated successfully");
                    $('#errorBlock').show();
                    setTimeout(function(){
                        $('#errorBlock').fadeOut();
                    },1600)
                },
                error: function(resp) {
                    $('#submitloader').hide();
                    $('#responseReveal button').show();
                }
            }
        );
     })
});


onScan.attachTo(document, {
    suffixKeyCodes: [13], // enter-key expected at the end of a scan
    reactToPaste: true, // Compatibility to built-in scanners in paste-mode (as opposed to keyboard-mode)
    onScan: function(sCode, iQty) { // Alternative to document.addEventListener('scan')
        console.log('Scanned: ' + iQty + 'x ' + sCode); 
        CheckIn(sCode);
    }
});

function CheckIn(wpiID){
    $.ajax(
        {
            url: '/api/v1/cherwell/getTestDistribution/'+wpiID,
            method: 'GET',
            beforeSend: function() {
                $('#responseReveal button').show();
                $('#idscanner').hide();
                $('#errorBlock').hide();
                $('#loader').show()
                $('#responseReveal').foundation('close')
                $('#responseText h1, #responseText p').text('');
                $('#responseReveal').removeClass("errorColor warnColor successColor")
                $('i.icon').removeClass("fa-circle-check fa-info-circle fa-times-hexagon")
                $('#testTable').DataTable().destroy();

            },
            success: function(resp) {
                $('#idscanner').show();
                $('#loader').hide()
                var themeColor ='';
                var icon =''
                var respstatus ='';

                if(resp.Remaining > 0){
                    themeColor = "successColor"
                    icon = 'fa-check-circle'
                    respstatus = "Good to Go"
                }
                if(resp.Remaining > 0 && resp.TestingConsent == "False"){
                    themeColor = "warnColor"
                    icon = 'fa-info-circle'
                    respstatus = "Don't Forget Waivers!"
                }
                if(resp.Remaining <= 0){
                    themeColor = "errorColor"
                    icon = 'fa-times-hexagon'
                    respstatus = "Over Allocation!"
                }
                $('#responseReveal').addClass(themeColor)
                $('i.icon').addClass(icon)
                $('.rr-status').text(respstatus);
                $('.rr-attendee').text(resp.FullName);
                $('.rr-waivers').text(resp.TestingConsent);
                $('.rr-type').text(resp.RecordType);
                $('.rr-WPIID').text(resp.ID);
                $('.rr-tests').text(resp.Distributed + " / " + resp.Allocated);

                $('#testTable').DataTable( {
                    data:resp.Tests,
                    order: [[1, 'asc']],
                    paging:false,
                    searching:false,
                    info:false,
                    autoWidth: false,
                    columns: [
                        { data: 'CreatedDateTime' },
                        { data: 'DistributedBy' },
                        { data: 'Quantity' }
                    ],
                    language: {
                        emptyTable: "No Test Allocation History"
                      }
                } );


                $('#responseReveal').foundation('open')

            },
            error: function(resp) {
                $('#idscanner').show();
                $('#loader').hide()
                $('#errorBlock span').text('Something Went Wrong when looking up this ID');
                $('#errorBlock').show();
            }
        }
    );
};

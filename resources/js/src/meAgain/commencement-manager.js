$(function() {
    $('#ticketTable').DataTable( {
        ajax:{url:"/api/v1/cherwell/getCommencementTickets/all/",dataSrc:"",cache:true},
        order: [[1, 'asc']],
        columns: [
            { data: 'AttendeeEmail' },
            { data: 'AttendeeFirstName' },
            { data: 'AttendeeLastName' },
            { data: 'StudentWPIID',visible:false},
            { data: 'StudentName'},
            { data: 'TicketStatus',visible:false },
            { data: 'CheckInLocation',visible:false },
            {
                data: null,
                sortable: false,
                render: function (o) { 
                
                    if(o.TicketStatus == "Ready"){
                        return '<button class="checkerIn" data-checkin='+ o.RecID +'>' + 'Check In' + '</button>'; 
                    }else{
                        return null;
                    }
                }
            }
        ]
    } );

    $('#ticketTable').on('click','.checkerIn', function(){
        let thisRecID = $(this).data('checkin');
        CheckIn(thisRecID);
        console.log("firing")
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

function CheckIn(recID){
    $.ajax(
        {
            url: '/api/v1/cherwell/commencementTicketCheckIn',
            method: 'POST',
            data: {
                formData: {
                    RecID: recID,
                }
            },
            beforeSend: function() {
                $('#responseReveal').foundation('close')
                $('#responseText h1, #responseText p').text('');
                $('#responseReveal').removeClass("errorColor warnColor successColor")
                $('i.icon').removeClass("fa-circle-check fa-info-circle fa-times-hexagon")
            },
            success: function(resp) {
                console.log(resp)
                
                var themeColor ='';
                var icon =''
                var checkTime = ''
                if(resp.status == "Successfully Checked In"){
                    themeColor = "successColor"
                    icon = 'fa-check-circle'
                }
                if(resp.status == "Attendee Was Already Checked In"){
                    themeColor = "warnColor"
                    icon = 'fa-info-circle'
                    checkTime = "checked-in at: " + resp.ticketOut.CheckInDateTIme
                }
                if(resp.status == "Ticket Was Voided"){
                    themeColor = "errorColor"
                    icon = 'fa-times-hexagon'
                }
                $('#responseReveal').addClass(themeColor)
                $('i.icon').addClass(icon)
                $('.rr-status').text(resp.status);
                $('.rr-attendee').text(resp.ticketOut.AttendeeFirstName + ' ' + resp.ticketOut.AttendeeLastName);
                $('.rr-statustime').text(checkTime);
                $('#responseReveal').foundation('open')

            },
            error: function(resp) {

            }
        }
    );
};

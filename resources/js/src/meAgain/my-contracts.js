$(function() {
    $('#contractTable').DataTable( {
        ajax:{url:"/api/v1/cherwell/ContractDelegate/get/my/",dataSrc:"contracts",cache:true},
        order: [[1, 'asc']],
        columns: [
            { data: 'DelegatorName',visible:false},
            { data: 'DelegateeName' },
            { data: 'PeriodStart'},
            { data: 'PeriodEnd'},
            { data: 'Amount'},
            { data: 'Status' },
            {
                data: null,
                sortable: false,
                render: function (o) { 
                    return '<a class="viewLink" target="_blank" href=/io/contractdelegate/'+ o.RecID +'>' + 'View' + '</a>'; 
                }
            }
        ]
    } );
});

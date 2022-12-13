$(document).ready(function() {

    // init Isotope
    var $grid = $('.courseGrid').isotope({
        // options
        itemSelector: '.course-item',
        layoutMode: 'vertical',
        getSortData: {
            period: '[data-period]',
            title: '.course-item-title',
            section: '.course-item-section',
            component: '.course-item-format'
          },
          // sort
          sortBy: [ 'period', 'section', 'title','component'],
          sortAscending: {
            period: true,
            section: true,
            title: true,
            number: false
          }
    });

      
    var filters = {};

    $('.button-group').on( 'click', '.button', function() {
        var $this = $(this);

        // get group key
        var $buttonGroup = $this.parents('.button-group');
        var filterGroup = $buttonGroup.attr('data-filter-group');
        var filterCount = $('#courseCount');
        // Add class
        $buttonGroup.children('').removeClass('active');
        
        $this.addClass('active');
        
        // set filter for group
        filters[ filterGroup ] = $this.attr('data-filter');
        // combine filters
        var filterValue = concatValues( filters );
        $grid.isotope({ filter: filterValue });
        filterCount.text($grid.data('isotope').filteredItems.length)

        if(filterGroup == "courDef"){
            $('#courDefFilters').show();

            if(!$('#filters').is(":visible")){
                $('#filters').slideDown()
            }
        }
    });

    // flatten object by concatting values
    function concatValues( obj ) {
    var value = '';
    for ( var prop in obj ) {
        value += obj[ prop ];
    }
    return value;
    }

    $('#toggleFilters').on('click', function(){
        $('#filters').slideToggle()
    })

    $('#componentHide').on('click', function(){
        $('#courDefFilters').hide();
    })
    $("a.course-info-modal").on('click', function(){
        var $this = $(this);
        var $parentItem = $this.parents('.course-item');
        var $header = $parentItem.find('.course-item-title').text();
        var $section = $parentItem.find('.course-item-section').text();
        var $description =  $parentItem.find('.course-item-description').html();
        $('#CourseInfo course-item-title').text($header);
        $('#CourseInfo .course-item-description').html($description);
        $('#CourseInfo .course-item-section').html($section);
    })
})
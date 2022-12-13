
  $(function() {
      // Default options
      const options = {
        animationDuration: 0.5,
        delay: 0,
        delayMode: 'progressive',
        easing: 'ease-out',
        filterOutCss: {
          opacity: 0,
          transform: 'scale(0.5)'
        },
        filterInCss: {
          opacity: 1,
          transform: 'scale(1)'
        },
        callbacks: {
            onInit: function() { 
                $(this).show()
            },
       },
        gutterPixels: 10,
        gridItemsSelector: '.filtr-item',
        layout: 'sameSize',
        multifilterLogicalOperator: 'or',
        setupControls: true,
        spinner: {
          enabled: true,
          fillColor: '#2184D0',
          styles: {
            height: '75px',
            margin: '0 auto',
            width: '75px',
            'z-index': 2,
          },
        },
      }
    
    const filterGoals = $('.filtr-container').filterizr(options)
   
    
    $('.division-item').on("click", function () {
        var multifilter = $(this).data('multifilter');
        if (multifilter === 'all') {
            $('.division-item').removeClass('active');
            $(this).addClass('active');
            filterGoals.filterizr('filter', 'all');
        } else {
            $('.division-item[data-multifilter="all"]').removeClass('active');
            $(this).toggleClass('active');
            if($('.division-item.active').length == 0){
                $('.division-item[data-multifilter="all"]').addClass('active')
            }
        }
    });
    });

    const divisions = [
        "Division of Talent & Inclusion (T&I)",
        "Division of Student Affairs",
        "University Advancement",
        "Marketing Communications", 
        "Enrollment and Institutional Research", 
        "Finance and Operations", 
        "Information Technology (IT)",
        "Facilities", 
        "Office of General Counsel",
        "Academic Affairs",
        "STEM Education/Summer Activities/ROTC",
        "Graduate Studies and ACE",
        "Foisie Business School",
        "School of Engineering",
        "School of Arts & Sciences",
        "The Global School"
    ]
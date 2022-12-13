$(function() {
    WindowScroller()

    var timer = $('body'),
    flag = false;

    $(window).on('scroll', function() {
        if (!flag) {
            flag = true;
            $('#meHeaderInterior').addClass('scrolling');
        }
        clearTimeout(timer);
        WindowScroller()

        timer = setTimeout(function(){
            $('#meHeaderInterior').removeClass('scrolling');
            flag = false;
        }, 200)
    })

    $('#vis-table').on('click',function(){
        if($(this).prop('checked') == true){
            $('#caseTable').fadeIn()
            $('#caseMeter').hide()
        }else{
            $('#caseTable').hide()
            $('#caseMeter').fadeIn()
        }
    })
});

function WindowScroller(){
    if($(window).width() >= 1024){
        var scroll = $(window).scrollTop();
    

        if (scroll < 150) {
            //clearHeader, not clearheader - caps H
            $("#mePage").removeClass("scroll-stop-a scroll-stop-b scroll-stop-c");
        }
        if (scroll >= 150 && scroll < 170) {
            $("#mePage").addClass("scroll-stop-a");
            $("#mePage").removeClass(" scroll-stop-b scroll-stop-c");
        }
        if (scroll >= 170 && scroll < 200) {
            $("#mePage").addClass("scroll-stop-a scroll-stop-b");
            $("#mePage").removeClass("scroll-stop-c");
        }
        if (scroll >= 200 ) {
            $("#mePage").addClass("scroll-stop-a scroll-stop-b scroll-stop-c");
        }
        
    }
}
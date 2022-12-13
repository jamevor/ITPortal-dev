
$(document).ready(function() {
	$('#compactMode').on('change', function() { 
        if (this.checked) {
            $('.staffVoting').addClass('compact');
            $('.councilWrapper').removeClass('medium-12');
            $('.councilWrapper').addClass('medium-6');
            $('.councilPersonData').removeClass('medium-3');
            $('.councilPersonData').addClass('medium-12');
        }else{
            $('.staffVoting').removeClass('compact');
            $('.councilWrapper').removeClass('medium-6');
            $('.councilWrapper').addClass('medium-12');
            $('.councilPersonData').removeClass('medium-12');
            $('.councilPersonData').addClass('medium-3');
        }
    });
});
$(function() {

  $('.qr-qr').each(function(){
    QRCode.toCanvas(this, $(this).data('qrid'),{scale:8})
  })

});
$(document).ready(function() {

	$('#button').on("click",function(event){
		event.preventDefault();
		if($('#happy').is(":hidden")){
			$('#happy').slideDown();
		}


		let photoType = Math.floor(Math.random() * 3) ;
		let photoURL = "";

		if(photoType == 0){
			let photo = Math.floor(Math.random() * 14) + 1;
			photoURL = "url('/img/content/lever/" + photo + ".jpg'"
			console.log(photoURL);
			$('#happy').css('background-image',photoURL)
		}
		else if(photoType == 1){
			let seed = Math.random().toString(36).substring(7);
			photoURL = "url('https://cataas.com/cat?" + seed+")";
			console.log(photoURL);
			$('#happy').css('background-image',photoURL)
		}
		else if(photoType == 2){

			$.ajax({
				url: "https://dog.ceo/api/breeds/image/random",
			  }).done(function(data) {
				photoURL = "url('"+ data.message +"')";
				console.log(photoURL);
				$('#happy').css('background-image',photoURL)
			  });
			  
		}
		
	})

})

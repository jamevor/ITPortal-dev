/* global spinner, AssetCard */
$(document).ready(function() {

	$.ajax(
		{
			url: '/api/v1/cherwell/me/asset/get/all',
			method: 'GET',
			beforeSend: function() {
				$('#my-assets').append(spinner());
			},
			success: function(data) {
				$('#my-assets').children('.spinner').remove();
				if (!(data && data.length)) {
					$('#my-assets').append(`<div class="cell medium-12 my-apps empty">
            <p>You don't have any assets</p>
          </div>`);
				} else {
					for (let datum of data) {
						$('#my-assets').append(
							new AssetCard(
								{
									assetTag: datum.busObPublicId,
									friendly: datum.fields.find(f => f.name === 'FriendlyName').value,
									model: datum.fields.find(f => f.name === 'Model').value,
									status: datum.fields.find(f => f.name === 'Status').value,
									type: datum.fields.find(f => f.name === 'AssetType').value,
									icon: datum._icon,
									image: datum._image
								}
							).render()
						);
					}
					AssetCard.renderForm();
					AssetCard.attachKabobListeners();
					AssetCard.attachFormListener();
				}
			},
			error: function(resp) {
				console.error(resp);
			}
		}
	);

});
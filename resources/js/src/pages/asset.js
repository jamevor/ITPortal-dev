/* global AssetCard */
$(document).ready(function() {

	AssetCard.renderForm();
	AssetCard.cursor.assetTag = $('#assetTag').val();
	AssetCard.cursor.assetFriendly = $('#assetFriendly').val();
	$('#help-form-asset-tag').html($('#assetTag').val());
	$('#help-form-asset-friendly').html($('#assetFriendly').val());
	AssetCard.attachFormListener();
	AssetCard.attachActionListeners();

});
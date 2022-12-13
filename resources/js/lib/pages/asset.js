"use strict";

/* global AssetCard */
$(document).ready(function () {
  AssetCard.renderForm();
  AssetCard.attachFormListener();
  AssetCard.attachActionListeners();
});
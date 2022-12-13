/* exported AssetCard */
/* global grecaptcha, Foundation */
class AssetCard {
	static cursor = {
		assetTag: null,
		assetFriendly: null
	};
	constructor({assetTag, friendly, model, icon, image, status, type}) {
		this.assetTag = assetTag;
		this.friendly = friendly;
		this.model = model;
		this.icon = icon;
		this.image = image || null;
		this.status = status;
		this.type = type || 'Device';
	}
	render() {
		let result = `<div class="cell small-12 medium-12 large-6 box card asset">
			<a class="kabob" data-asset-tag="${this.assetTag}" data-asset-friendly="${this.friendly}" href="#"><i class="far fa-ellipsis-v"></i><span class="show-for-sr">Asset Options Menu for ${this.friendly}</span></a>
			<div class="d-menu">
				<a href="#" class="button-asset-issue">Report an Issue with Your ${this.type}</a>
				<a href="#" class="button-asset-replacement">Assess Replacement</a>
				<a href="#" class="button-asset-not-mine">What is this device?</a>
			</div>
			<a class="asset-link-wrapper" href="/Asset/${this.assetTag}">
			<div class="asset-img" `;
		if (this.image) {
			result += `style="background-image:url('${this.image}')">`;
		} else {
			result += `>
			<i class="fad fa-fw ${this.icon}"></i>`;
		}
		result += `</div>
				<div class="asset-dataBar grid-x grid-margin-x">
					<div class="asset-dataBar-icon cell medium-6">
						<i class='fal fa-fw fa-2x ${this.icon}'></i>
						<span>${this.assetTag}</span>
					</div>
					<div class="asset-dataBar-name cell medium-6">
						<span class="hostname">${this.friendly}</span>
						<span class="model">${this.model}</span>
					</div>
				</div>
			</a>
		</div>`;
		return result;
	}
	static attachKabobListeners() {
		$('.kabob').click(function(event) {
			event.preventDefault();
			AssetCard.cursor.assetTag = $(this).data('assetTag');
			AssetCard.cursor.assetFriendly = $(this).data('assetFriendly');
			$('#help-form-asset-tag').html(`${AssetCard.cursor.assetTag}`);
			$('#help-form-asset-friendly').html(`${AssetCard.cursor.assetFriendly}`);
			$(this).siblings('.d-menu').fadeToggle(200);
		});
		$('.asset').on('mouseleave', function() {
			$(this).children('.d-menu').fadeOut(200);
		});
		$('.button-asset-issue').click(function(event) {
			event.preventDefault();
			$('#help-form-title').html('Report an Issue With Asset');
			$('#modal-asset-form').foundation('open');
		});
		$('.button-asset-replacement').click(function(event) {
			event.preventDefault();
			$('#help-form-title').html('Assess a Replacement');
			$('#modal-asset-form').foundation('open');
		});
		$('.button-asset-not-mine').click(function(event) {
			event.preventDefault();
			$('#help-form-title').html('What is This Device?');
			$('#modal-asset-form').foundation('open');
		});
	}
	static attachActionListeners() {
		$('.button-asset-issue').click(function(event) {
			event.preventDefault();
			$('#help-form-title').html('Report an Issue With Asset');
			$('#modal-asset-form').foundation('open');
		});
		$('.button-asset-replacement').click(function(event) {
			event.preventDefault();
			$('#help-form-title').html('Assess a Replacement');
			$('#modal-asset-form').foundation('open');
		});
		$('.button-asset-not-mine').click(function(event) {
			event.preventDefault();
			$('#help-form-title').html('What is This Device?');
			$('#modal-asset-form').foundation('open');
		});
	}
	static renderForm() {
		$('body').append(`<style>
			.help-form label {
				/* font-weight: 600; */
			}
			.help-form .box {
				background: var(--color-lane);
				padding: 0.5em 1em;
			}
			.help-form textarea {
				min-width:100%;
			}
			.help-form input, .help-form textarea {
				background: var(--color-body);
				color: var(--color-body-text);
			}
			.night .help-form input:focus, .night .help-form textarea:focus {
				background: var(--color-lane-subtler);
			}
			.help-form .button-submit {
				width: 100%;
				text-align: center;
				background: var(--color-pop);
				height: 3em;
				color: var(--color-light);
				cursor: pointer;
				outline: none;
				box-shadow: var(--shadow-standard-y);
				transition: background .5s ease;
			}
			.help-form .button-submit:hover {
				background: var(--color-pop-h);
			}
			.help-form .button-submit.disabled {
				cursor: not-allowed;
				background: var(--color-pop-h);
			}
			.help-form .impact-boxes .cell input {
				display: none;
			}
			.help-form .impact-boxes .cell label {
				border: 1px solid var(--color-lane);
				padding: .5em;
				text-align: center;
				margin: 0;
				width: 100%;
				transition: all .5s ease;
			}
			.help-form .impact-boxes .cell input:checked + label {
				background-color: var(--color-pop);
				color: var(--color-light);
				border-color: var(--color-pop-h);
			}
			.help-form .impact-boxes .cell label:hover {
				background: var(--color-lane);
			}
			.input-box .content-label{
				font-size: 1rem;
				margin: 0;
				line-height:1;
			}
			.input-box .content{
				font-weight: 800;
				margin: 0;
				margin-bottom: 0.5em;
			}
			.box-verified-profile {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
			.profile-img-square {
				background: var(--color-user);
				width: 2em;
				height: 2em;
				font-size: 3em;
			}
			
			/* Asset help form */
			#modal-asset-form h4, #modal-asset-form h5 {
				margin: 0;
			}
			#modal-asset-form h5 {
				color: var(--color-pop);
				font-weight: bold;
			}
			#modal-asset-form h5:last-of-type {
				margin-bottom: 1em;
			}
		</style>
		
		<div class="reveal help-form" id="modal-asset-form" data-reveal>
			<h4 id='help-form-title'>Request Help With</h4>
			<h5 id='help-form-asset-tag'>Asset</h5>
			<h5 id='help-form-asset-friendly'>Asset</h5>
			<label for="details"><strong>In detail</strong>, describe your request or issue</label>
			<textarea id="details" name="details" rows="5"></textarea>
			<p style="font-size:.875rem;"><em>Include details such as your location (on or off campus), how long the issue has been occuring, etc.</em></p>
			<button id="button-submit-help-form" class="button-submit">Request Help</button>
			<p style="font-size: 0.75rem;margin-top: 1em;color: var(--color-body-subtitle);">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
			<button class="close-button" data-close aria-label="Close modal" type="button">
				<span aria-hidden="true"><i class='fas fa-times'></i></span>
			</button>
		</div>`);
		new Foundation.Reveal($('#modal-asset-form'));
	}
	static attachFormListener() {
		$('#button-submit-help-form').click(function(event) {
			event.preventDefault();
			if (!$('#button-submit-help-form').hasClass('disabled')) {
				$('#button-submit-help-form').addClass('disabled');
				grecaptcha.ready(function() {
					grecaptcha.execute('6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD', {action: 'button_submit_help_form_asset'}).then(function(token) {
						$.ajax(
							{
								url: '/api/v1/cherwell/ticket/asset/create/one',
								method: 'POST',
								data: {
									token,
									assetTag: AssetCard.cursor.assetTag,
									formData: {
										source: window.location.href,
										type: $('#help-form-title').html(),
										assetTag: AssetCard.cursor.assetTag,
										friendly: AssetCard.cursor.assetFriendly,
										details: $('#details').val()
									}
								},
								beforeSend: function() {
									$('#button-submit-help-form').html('<i class=\'fas fa-circle-notch fa-spin\'></i>');
								},
								success: function() {
									$('#toast-save-success').addClass('show');
									$('#button-submit-help-form').html('Request Help');
									$('#modal-asset-form').foundation('close');
								},
								error: function(resp) {
									$('#toast-save-error').addClass('show');
									$('#button-submit-help-form').html('Request Help');
									$('#modal-asset-form').foundation('close');
								}
							}
						);
					});
				});
			}
		});
	}
}
/**
 * PWA back button arrow
 */

//  const { SUBSCR_EVENT_TYPE_SHUTDOWN_ANY } = require("oracledb");

/* global dragula */
window.addEventListener('DOMContentLoaded', function() {
	if (isInStandaloneMode() && window.history.length > 1) {
		document.getElementById('pwa-back').style.display = 'block';
		if (window.history.length > 2) {
			document.getElementById('pwa-back').classList.add('enabled');
		}
		document.getElementById('pwa-back').classList.add('active');
	}
});

$(document).ready(function() {

	const consoleCss = 'background-color:#fff;font-size:4em;color:grey;';
	const consoleCssb = 'font-weight:800;font-size:2em;';
	// eslint-disable-next-line
	console.log('%c    _\n'+
								'  _|_|_ \n'+
								'   (_( \n'+
								'  /_/\'_____/) \n'+
								'  "  |      | \n'+
								'     |""""""| \n'+
								'%c        What\'s Goating On?', consoleCss, consoleCssb);

	$(document).foundation();

	if ($(window).width() / parseFloat($('body').css('font-size')) <= 39.9375) {
		$('#menuButton').removeClass('is-active-left');
		$('.site-wrapper').removeClass('is-active-left');
		updateUserPreferences();
	}

	$('#menuButton').click(function() {
		$(this).toggleClass('is-active-left');
		$('.site-wrapper').toggleClass('is-active-left');
		updateUserPreferences();
	});
	var resizeTimer;

	$(window).resize(function() {
		$('.site-nav').addClass('notransition');
		$('.site-content').addClass('notransition');

		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(resizeDone, 300);
	});

	function resizeDone() {
		$('.site-nav').removeClass('notransition');
		$('.site-content').removeClass('notransition');
	}

	$('.swim-lane').each(function() {
		var options = $(this).data('size-control');

		if(options && options.display == true) {
			var outputTemplate = '';
			outputTemplate += '<div class="size-control">';

			if(options.compactor == true && options['compactor-item']) {
				outputTemplate += '<a href="#" class="compactor" data-compactor-item="'+options['compactor-item']+'"><i class="fas fa-compress"></i><span class="show-for-sr"> Toggle Compact View</span></a>';
			}

			if(options.thiccener == true && options['thiccener-item']) {
				outputTemplate += '<a href="#" class="thiccener" data-thiccener-item="'+options['thiccener-item']+'"><i class="fas fa-arrows-alt-h"></i><span class="show-for-sr"> Toggle Expanded View</span></a>';
			}
			outputTemplate += '</div>';

			$(this).prepend(outputTemplate);
		}
	});

	$('.compactor').on('click', function(event) {
		event.preventDefault();
		$(this).parent().siblings().find('.'+ $(this).data('compactor-item')).toggleClass('compact');
	});

	$('.thiccener').on('click', function(event) {
		event.preventDefault();
		$(this).parent().siblings('.'+ $(this).data('thiccener-item')).toggleClass('fluid');
	});

	$('#menuShrink').on('click', function(event) {
		event.preventDefault();
		$('.site-wrapper').toggleClass('compact-nav');
		$('.shrink i').toggleClass('fa-arrow-from-left fa-arrow-from-right');
		updateUserPreferences();
	});
	$('.alert .close-button').click(function() {
		$(this).closest('.alert').slideUp();
	});

	$('#button-print').click(function(event) {
		event.preventDefault();
		document.execCommand('print', false, false);
	});


	// set share link in modal
	$('#share-link').val(window.location);

	// open modal or use navigator share API if it exists
	$('#button-share').click(function(event) {
		event.preventDefault();
		if ('share' in navigator) {
			navigator.share({
				title: document.title,
				text: 'Check out this page on the WPI Hub',
				url: $('#share-link').val()
			});
		} else {
			$('#modal-share').foundation('open');
		}
	});

	// select text on focus
	$('.copy-text').focus(function(event) {
		event.currentTarget.select();
	});

	// copy share link
	$('.copy-button').click(function(event) {
		event.preventDefault();
		copyToClipboard(event.currentTarget.parentElement.getElementsByClassName('copy-text')[0].id, event.currentTarget.id);
	});

	/**
	 * user menu
	 */
	$('#userMenuToggle').click(function() {
		$('.site-wrapper').toggleClass('is-active-right');
		moveIntro();
	});

	/**
	 * PWA back button arrow
	 */
	$('#pwa-back').click(function(event) {
		event.preventDefault();
		if (document.referrer.indexOf(window.location.host) !== -1) {
			window.history.back();
		} else {
			window.location.replace('/');
		}
	});

	/**
	 * open links in a new window and not in the standalone app if the link is external
	 */
	if (isInStandaloneMode()) {
		const baseRegex = new RegExp(`${window.location.hostname}`);
		window.addEventListener('click', function() {
			if (event.target.tagName === 'A' && !baseRegex.test(event.target.href)) {
				window.open(event.target.href);
				event.preventDefault();
			}
		});
	}

	/**
	 * Drag to reorder widgets in the sidebar
	 */
	setTimeout(function() {
		const containersSidebar = [document.querySelector('.user-sidebar .simplebar-content')];
		const drakeSidebar = dragula(containersSidebar, {
			moves: function(el) {
				return el.classList.contains('user-widget') && $('#sidebar-drag-toggle').is(':checked');
			},
			mirrorContainer: document.getElementsByClassName('user-sidebar')[0]
		});
		drakeSidebar.on('out', updateReorderSidebarWidgets);
	}, 5000);

	/**
	 * Theme selector for ShrekFest
	 */
	$('#ShrekTheme').click(function(event){
		event.preventDefault();
		shrekUser();
		
	})

});

function shrekUser() {
	$.ajax({
		url: '/api/v1/user/settings/update',
		method: 'PATCH',
		data: {
			themePreference: "shrek",
		},
		success: function() {
			window.location.reload();
		}
	});
}

function updateUserPreferences() {
	$.ajax({
		url: '/api/v1/user/settings/update',
		method: 'PATCH',
		data: {
			navbarCompact: $('.site-wrapper').hasClass('compact-nav'),
			navbarOpen: $('.site-wrapper').hasClass('is-active-left')
		}
	});
}

function copyToClipboard(elementId, buttonId) {
	const item = document.getElementById(elementId);
	item.select();
	document.execCommand('copy');
	if (typeof buttonId === 'string') {
		$(`#${buttonId}`).addClass('clicked');
		$(`#${buttonId} i`).removeClass('fa-copy').addClass('fa-check');
		setTimeout(function() {
			$(`#${buttonId}`).removeClass('clicked');
			$(`#${buttonId} i`).addClass('fa-copy').removeClass('fa-check');
		},2000);
	}
}

/* exported spinner */
const spinner = () => '<div class="cell small-12 text-center color-pop spinner"><i class="fas fa-2x fa-circle-notch fa-spin"></i></div>';

/* exported HTMLReplace */
const HTMLReplace = str => str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

/* exported isInStandaloneMode */
/**
 * window media is standalone display mode (should work for most) OR window.navigator.standalone (iOS safari) OR launched via TWA.
 */
const isInStandaloneMode = () => window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches || window.matchMedia('(display-mode: minimal-ui)').matches || window.navigator.standalone || document.referrer.includes('android-app://');

const moveIntro = () => {
	let move1, move2;
	if ($('.site-wrapper').hasClass('is-active-right')) {
		move1 = '200px';
		move2 = '0';
	} else {
		move1 = '0';
		move2 = '-200px';
	}

	setTimeout(function() {
		$('#userMenuToggle').children('.user-menu-avatar').css({ 'background-position-y': move1 });
	}, 480);

	setTimeout(function() {
		$('.user-menu .user-menu-avatar').css({ 'background-position-y': move2 });
	}, 510);
};

const updateReorderSidebarWidgets = () => {
	const widgets = {};
	const sidebarWidgets = $('.user-sidebar').find('.user-widget');
	for (let i = 1; i <= sidebarWidgets.length; i++) {
		widgets[$(sidebarWidgets.get(i - 1)).data('widgetid')] = {
			idWidget: parseInt($(sidebarWidgets.get(i - 1)).data('widgetid')),
			isSidebar: true,
			orderSidebar: i
		};
	}
	$.ajax(
		{
			url: '/api/v1/user/widgets/sidebar/update',
			method: 'PUT',
			data: {
				widgets: Object.values(widgets)
			},
			success: function() {
			},
			error: function() {
			}
		}
	);
};


	var GreekHousesShow = false;

    function showGreekHouses(){
	
	

	var elements = document.getElementsByClassName('flickity-viewport');
	var stupidFlickity = elements[0];
		stupidFlickity.style.height = "570px"

	var greekHouseList = document.getElementById('showGreekHomes');
		greekHouseList.style.display = "inherit";

	var x = document.getElementById("isoLocation-greekHome-options").value
	if (x == "none"){
	enableDisableNext();
	}}

function hideGreekHouses(){
	var greekHouseList = document.getElementById('showGreekHomes');
	greekHouseList.style.display = "none";
}


function enableDisableNext (house){
	document.getElementById("next").style.display = "none";
	if (house.value != "none")
	{
	document.getElementById("next").style.display = "block";
	if (document.getElementById('isoLocation-home').checked || document.getElementById('isoLocation-offCampusHome').checked || document.getElementById('isoLocation-residenceHall').checked || document.getElementById('isoLocation-greekHome').checked)
	{
		document.getElementById("next").style.display = "block";
	}
	else
	{
		document.getElementById("next").style.display = "none";
	}}
}

function enableDateNext () {
	d = (document.getElementById('test-type-date'));
	if (!d.value)
	{
		document.getElementById("next").style.display = "none";
	}
	else
	{
		document.getElementById("next").style.display = "block";
	}
}




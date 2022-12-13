/* global dragula */
var globalSaveCounter = 0;
$(document).ready(function() {
	/**
	 * Dragula
	 */
	const containersDashboard = [document.getElementById('widgey-target-dashboard')];
	const drakeDashboard = dragula(containersDashboard, {
		moves: function(el) {
			return el.classList.contains('widgey');
		},
		mirrorContainer: document.getElementById('widgey-target-dashboard')
	});
	drakeDashboard.on('out', updateWidgets);

	const containersSidebar = [document.getElementById('widgey-target-sidebar')];
	const drakeSidebar = dragula(containersSidebar, {
		moves: function(el) {
			return el.classList.contains('widgey');
		},
		mirrorContainer: document.getElementById('widgey-target-sidebar')
	});
	drakeSidebar.on('out', updateWidgets);

	$('.widgey-container').on('click', '.widgey-add-dashboard', function(event) {
		event.preventDefault();
		if ($(this).hasClass('active')) {
			return false;
		}
		$(this).addClass('active');
		const newWidgey = $(this).parents('.widgey').clone();
		newWidgey.find('.widgey-buttons').html('<a class="widgey-remove" href="#"><i class="far fa-fw fa-times"></i></a>');
		$('#widgey-target-dashboard').append(newWidgey);
		updateWidgets();
	});

	$('.widgey-container').on('click', '.widgey-add-sidebar', function(event) {
		event.preventDefault();
		if ($(this).hasClass('active')) {
			return false;
		}
		$(this).addClass('active');
		const newWidgey = $(this).parents('.widgey').clone();
		newWidgey.find('.widgey-buttons').html('<a class="widgey-remove" href="#"><i class="far fa-fw fa-times"></i></a>');
		$('#widgey-target-sidebar').append(newWidgey);
		updateWidgets();
	});

	$('.widgey-container').on('click', '.widgey-remove', function(event) {
		event.preventDefault();
		const widgetid = $(this).parents('.widgey').first().data('widgetid');
		const widgetInstallTypeClass = $(this).parents('#widgey-target-dashboard').length ? 'widgey-add-dashboard' : 'widgey-add-sidebar';
		$(this).parents('.widgey').slideUp('fast', function() {
			$(this).remove();
			updateWidgets();
		});
		$('#widgey-source').find(`.widgey[data-widgetid=${widgetid}] .${widgetInstallTypeClass}`).removeClass('active');
	});

});

const updateWidgets = () => {
	globalSaveCounter++;
	const saveCounter = globalSaveCounter;
	$('.save-status span').first().text('Saving');
	$('.save-status').addClass('saving');
	const dashboardWidgets = $('#widgey-target-dashboard').children('.widgey');
	const widgets = {};
	for (let i = 1; i <= dashboardWidgets.length; i++) {
		widgets[$(dashboardWidgets.get(i - 1)).data('widgetid')] = {
			idWidget: parseInt($(dashboardWidgets.get(i - 1)).data('widgetid')),
			isDashboard: true,
			isSidebar: false,
			orderDashboard: i,
			orderSidebar: null
		};
	}
	const sidebarWidgets = $('#widgey-target-sidebar').children('.widgey');
	for (let i = 1; i <= sidebarWidgets.length; i++) {
		if ($(sidebarWidgets.get(i - 1)).data('widgetid') in widgets) {
			widgets[$(sidebarWidgets.get(i - 1)).data('widgetid')].isSidebar = true;
			widgets[$(sidebarWidgets.get(i - 1)).data('widgetid')].orderSidebar = i;
		} else {
			widgets[$(sidebarWidgets.get(i - 1)).data('widgetid')] = {
				idWidget: parseInt($(sidebarWidgets.get(i - 1)).data('widgetid')),
				isDashboard: false,
				isSidebar: true,
				orderDashboard: null,
				orderSidebar: i
			};
		}
	}
	$.ajax(
		{
			url: '/api/v1/user/widgets/update',
			method: 'PUT',
			data: {
				widgets: Object.values(widgets)
			},
			success: function() {
				if (saveCounter === globalSaveCounter) {
					$('.save-status span').first().text('Saved');
					$('.save-status').removeClass('saving');
				}
			},
			error: function() {
			}
		}
	);
};
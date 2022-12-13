/* global dragula */
$(document).ready(function() {

	/**
	 * Dragula
	 */
	const containersDashboard = [document.getElementsByClassName('user-dashboard')[0]];
	const drakeDashboard = dragula(containersDashboard, {
		moves: function(el) {
			return el.classList.contains('user-widget') && $('#dashboard-drag-toggle').is(':checked');
		},
		mirrorContainer: document.getElementsByClassName('user-dashboard')[0]
	});
	drakeDashboard.on('out', updateWidgets);

});

const updateWidgets = () => {
	const dashboardWidgets = $('.user-dashboard').children('.user-widget');
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
	const sidebarWidgets = $('.user-sidebar').find('.user-widget');
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
			},
			error: function() {
			}
		}
	);
};
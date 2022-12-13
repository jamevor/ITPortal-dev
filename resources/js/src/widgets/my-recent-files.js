/* global moment */
$(document).ready(function() {
	const container = '#widget-myRecentFiles,#widget-myRecentFiles--dashboard';

	$.ajax(
		{
			url: '/api/v1/azure/getMyRecentFiles',
			method: 'GET',
			success: function(items) {
				renderMyRecentFiles(items);
			},
			error: function(resp) {
				console.error({resp});
			}
		}
	);

	const renderMyRecentFiles = items => {
		let result = '<div class="calendar-wrapper" data-simplebar>';
		for (const item of items) {
			const icon = getIcon(item.file.mimeType);
			result += `<a href="${item.webUrl}" target="_blank" class="calendar-event">
			<div class="file-icon">
				<i class="fad ${icon.icon}" style="--fa-primary-color: ${icon.primary}; --fa-secondary-color: ${icon.secondary};"></i>
			</div>
				<div class="calendar-event-line">
					<div class="calendar-event-title">${item.name}</div>
					<div class="calendar-event-timing">${moment.utc(item.lastModifiedDateTime).format('lll')}</div>
				</div>
				<div class="calendar-event-location"></div>
				<div class="calendar-event-organizer">${item.createdBy.user.displayName}</div>
			</a>`;
		}
		result += '</div>';
		$(container).append(result);
	};

	const getIcon = mime => {
		switch(mime) {
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			return {
				icon: 'fa-file-excel',
				primary: '#207245',
				secondary: '#207245'
			};
		case 'application/vnd.ms-excel':
			return {
				icon: 'fa-file-csv',
				primary: '#207245',
				secondary: '#207245'
			};
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			return {
				icon: 'fa-file-powerpoint',
				primary: '#cb4a32',
				secondary: '#cb4a32'
			};
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return {
				icon: 'fa-file-word',
				primary: '#2a5699',
				secondary: '#2a5699'
			};
		case 'application/pdf':
			return {
				icon: 'fa-file-pdf',
				primary: '#cf463c',
				secondary: '#cf463c'
			};
		case 'application/msonenote':
			return {
				icon: 'fa-sticky-note',
				primary: '#761ba8',
				secondary: '#761ba8'
			};
		case 'text/plain':
			return {
				icon: 'fa-file-alt',
				primary: '#333333',
				secondary: '#333333'
			};
		default:
			return {
				icon: 'fa-file',
				primary: '#333333',
				secondary: '#333333'
			};
		}
	};

});

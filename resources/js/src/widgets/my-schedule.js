/* global moment */
$(document).ready(function() {
	const container = '#widget-mySchedule,#widget-mySchedule--dashboard';

	$.ajax(
		{
			url: '/api/v1/azure/getMySchedule',
			method: 'GET',
			success: function(events) {
				renderMySchedule(events);
				init();
			},
			error: function(resp) {
				console.error({resp});
			}
		}
	);

	const renderMySchedule = events => {
		let result = `<div class="view-title">
			<a href="#left" class="calendar-nav">
				<i class="fas fa-chevron-left"><span class="show-for-sr">Go back one day</span></i>
			</a>
			<div class="view-date ce-0" style="display:none;">
				<span>${moment().local().subtract(1, 'day').format('M/D/YYYY')}</span>
				<span>(Yesterday)</span>
			</div>
			<div class="view-date ce-1 active">
				<span>${moment().local().format('M/D/YYYY')}</span>
				<span>(Today)</span>
			</div>
			<div class="view-date ce-2" style="display:none;">
				<span>${moment().local().add(1, 'day').format('M/D/YYYY')}</span>
				<span>(Tomorrow)</span>
			</div>
			<a href="#right" class="calendar-nav">
					<i class="fas fa-chevron-right"><span class="show-for-sr">Go forward one day</span></i>
			</a>
		</div>
		
		<div class="calendar-wrapper" data-simplebar>`;
		const todayStart = moment().local().startOf('day');
		const todayEnd = moment().local().endOf('day');
		for (const event of events) {
			const start = moment.utc(event.start.dateTime).local();
			const end = moment.utc(event.end.dateTime).local();
			let past = '';
			if (end.isBefore(moment().local())) {
				past = ' past';
			}
			if (start.isBefore(todayStart)) { // yesterday
				result += `<a href="${event.webLink}" target="_blank" class="calendar-event${past} ce-0" style="display: none;">
					<div class="calendar-event-line">
						<div class="calendar-event-title">${event.subject}</div>
						<div class="calendar-event-timing">${start.format('h:mm a')} - ${end.format('h:mm a')}</div>
					</div>
					<div class="calendar-event-location">${event.location.displayName}</div>
					<div class="calendar-event-organizer">${event.organizer.emailAddress.name}</div>
				</a>`;
			} else if (start.isBetween(todayStart, todayEnd)) { // today
				let borderLeft = '';
				if (moment().local().isBetween(start, end)) {
					borderLeft = 'border-left: 3px solid var(--color-bright-2);';
				}
				result += `<a href="${event.webLink}" target="_blank" class="calendar-event${past} ce-1 active" style="${borderLeft}">
					<div class="calendar-event-line">
						<div class="calendar-event-title">${event.subject}</div>
						<div class="calendar-event-timing">${start.format('h:mm a')} - ${end.format('h:mm a')}</div>
					</div>
					<div class="calendar-event-location">${event.location.displayName}</div>
					<div class="calendar-event-organizer">${event.organizer.emailAddress.name}</div>
				</a>`;
			} else { // tomorrow
				result += `<a href="${event.webLink}" target="_blank" class="calendar-event${past} ce-2" style="display: none;">
					<div class="calendar-event-line">
							<div class="calendar-event-title">${event.subject}</div>
							<div class="calendar-event-timing">${start.format('h:mm a')} - ${end.format('h:mm a')}</div>
					</div>
					<div class="calendar-event-location">${event.location.displayName}</div>
					<div class="calendar-event-organizer">${event.organizer.emailAddress.name}</div>
				</a>`;
			}
		}
		result += '</div>';
		$(container).append(result);
	};

	const init = () => {
		$('.calendar-nav').click(function(event) {
			if ($(this).hasClass('disabled')) {
				return false;
			}
			event.preventDefault();
			const parent = `#${$(this).closest('.user-widget').attr('id')}`;
			$(`${parent} .calendar-nav`).removeClass('disabled');
			if ($(this).attr('href') === '#left') {
				const result = left(parent);
				if (result === 0) {
					$(this).addClass('disabled');
				}
			} else {
				const result = right(parent);
				if (result === 2) {
					$(this).addClass('disabled');
				}
			}
		});
		/**
		 * left and right return new active state `i`.
		 */
		const left = parent => {
			if ($(`${parent} .ce-0`).hasClass('active')) {
				return -1;
			} else {
				for (let i = 1; i <= 2; i++) {
					if ($(`${parent} .ce-${i}`).hasClass('active')) {
						$(`${parent} .ce-${i}`).removeClass('active');
						$(`${parent} .ce-${i}`).hide();
						$(`${parent} .ce-${i - 1}`).addClass('active');
						$(`${parent} .ce-${i - 1}`).show();
						return i - 1;
					}
				}
			}
		};
		const right = parent => {
			if ($(`${parent} .ce-2`).hasClass('active')) {
				return -1;
			} else {
				for (let i = 0; i < 2; i++) {
					if ($(`${parent} .ce-${i}`).hasClass('active')) {
						$(`${parent} .ce-${i}`).removeClass('active');
						$(`${parent} .ce-${i}`).hide();
						$(`${parent} .ce-${i + 1}`).addClass('active');
						$(`${parent} .ce-${i + 1}`).show();
						return i + 1;
					}
				}
			}
		};
	};

});

/* global moment */
$(document).ready(function() {
	$('#location').val('null').change();

	const standardHours = window.standardHoursData;
	const specialHours = window.specialHoursData;

	const standardHoursTable = $('#hours-standard').DataTable(
		{
			dom: 't',
			paging: false,
			ordering: false
		}
	);

	const specialHoursTable = $('#hours-special').DataTable(
		{
			dom: 't',
			paging: false,
			ordering: false
		}
	);

	$('#location').change(function() {
		$('#hours-standard-editable, #hours-special-editable').prop('checked', false).change();

		if ($('#location').val() === 'null') {
			reset(standardHoursTable, specialHoursTable);
		} else {
			const selectedLocationStandardHours = standardHours.filter(hour => hour.idLocation == $('#location').val());
			standardHoursTable.rows().every(function() {
				const hour = selectedLocationStandardHours.find(hour => `hours-standard-day-${hour.idDayOfWeek}` == this.id());
				if (hour) {
					this.data([hour.dayOfWeek.id, hour.dayOfWeek.title, isClosedToInput(hour.isClosed, 'standard', true), timeToInput(hour.timeOpen, 'standard', hour.isClosed, true), timeToInput(hour.timeClosed, 'standard', hour.isClosed, true)]);
				} else {
					this.data([this.data()[0], this.data()[1], isClosedToInput(false, 'standard', true), timeToInput('09:00:00', 'standard', false, true), timeToInput('17:00:00', 'standard', false, true)]);
				}
			});

			const selectedLocationSpecialHours = specialHours.filter(hour => hour.idLocation == $('#location').val());
			specialHoursTable.rows().remove();
			let disabled = !$('#hours-special-editable').is(':checked');
			for (let hour of selectedLocationSpecialHours) {
				specialHoursTable.row.add([dateToInput(hour.date, disabled), isClosedToInput(hour.isClosed, 'special', disabled), timeToInput(hour.timeOpen, 'special', hour.isClosed, disabled), timeToInput(hour.timeClosed, 'special', hour.isClosed, disabled)]);
			}
			specialHoursTable.draw();
		}
	});

	$('#hours-standard-editable').change(function() {
		$('.hours-standard-input').prop('disabled', !$('#hours-standard-editable').is(':checked'));
	});

	$('#hours-special-editable').change(function() {
		$('.hours-special-input').prop('disabled', !$('#hours-special-editable').is(':checked'));
	});

	$('#hours-special-add-row').click(function(event) {
		event.preventDefault();
		let disabled = !$('#hours-special-editable').is(':checked');
		specialHoursTable.row.add([dateToInput('', disabled), isClosedToInput(true, 'special', disabled), timeToInput('09:00:00', 'special', true, disabled), timeToInput('17:00:00', 'special', true, disabled)]).draw();
	});

	$('.table').on('change', 'input.hours-standard-input[type=checkbox], input.hours-special-input[type=checkbox]', function() {
		$(this).parent().siblings().children('input.hours-standard-input[type=time], input.hours-special-input[type=time]').toggle();
	});

	// save

	$('.button-save').click(function(event) {
		event.preventDefault();
		if ($('#location').val() === 'null') {
			return false;
		} else {
			const standardHours = {};
			let hoursValid = true;
			standardHoursTable.rows().nodes().to$().each(function() {
				const idDayOfWeek = $(this).find('td').first().text();
				const isClosed = $(this).find('.hours-standard-input').eq(0).is(':checked');
				const timeOpen = $(this).find('.hours-standard-input').eq(1).val();
				const timeClosed = $(this).find('.hours-standard-input').eq(2).val();
				const momentOpen = moment.utc(timeOpen.length < 6 ? timeOpen + ':00' : timeOpen, 'HH:mm:ss', true);
				const momentClosed = moment.utc(timeClosed.length < 6 ? timeClosed + ':00' : timeClosed, 'HH:mm:ss', true);
				if (!momentOpen.isValid() || !momentClosed.isValid() || momentOpen.isAfter(momentClosed)) {
					hoursValid = false;
				}
				standardHours[`${idDayOfWeek}`] = {
					isClosed,
					timeOpen,
					timeClosed
				};
			});
			const specialHours = {};
			specialHoursTable.rows().nodes().to$().each(function() {
				const date = $(this).find('.hours-special-input').eq(0).val();
				const isClosed = $(this).find('.hours-special-input').eq(1).is(':checked');
				const timeOpen = $(this).find('.hours-special-input').eq(2).val();
				const timeClosed = $(this).find('.hours-special-input').eq(3).val();
				const momentOpen = moment.utc(timeOpen.length < 6 ? timeOpen + ':00' : timeOpen, 'HH:mm:ss', true);
				const momentClosed = moment.utc(timeClosed.length < 6 ? timeClosed + ':00' : timeClosed, 'HH:mm:ss', true);
				if (!momentOpen.isValid() || !momentClosed.isValid() || momentOpen.isAfter(momentClosed) || `${date}` in specialHours) {
					hoursValid = false;
				}
				specialHours[`${date}`] = {
					isClosed,
					timeOpen,
					timeClosed
				};
			});
			if (hoursValid) {
				$.ajax(
					{
						url: `/api/v1/location/hours/update/one/${$('#location').val()}`,
						method: 'POST',
						data: {
							standardHours: JSON.stringify(standardHours),
							specialHours: JSON.stringify(specialHours)
						},
						success: function() {
							$('#toast-save-success').addClass('show');
						},
						error: function() {
							$('#toast-save-error').addClass('show');
						}
					}
				);
			} else {
				$('#toast-invalid-times').addClass('show');
			}
		}
	});

});

const timeToInput = (time, type, isClosed, disabled) => {
	return `<input class='hours-${type}-input' type="time" value="${time}"${disabled ? ' disabled': ''}${isClosed ? ' style="display: none"' : ''} step="1">`;
};

const dateToInput = (date, disabled) => {
	return `<input class='hours-special-input' type="date" value="${date}"${disabled ? ' disabled': ''}>`;
};

const isClosedToInput = (isClosed, type, disabled) => {
	return `<td><input class='hours-${type}-input' type='checkbox'${isClosed ? ' checked' : ''}${disabled ? ' disabled': ''}></td>`;
};

const reset = (standardHoursTable, specialHoursTable) => {
	specialHoursTable.rows().remove().draw();

	standardHoursTable.rows().every(function() {
		this.data([this.data()[0], this.data()[1], isClosedToInput(false, 'standard', true), timeToInput('', 'standard', false, true), timeToInput('', 'standard', false, true)]);
	});
};
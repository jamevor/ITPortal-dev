'use strict';
const Location = require('../models/Location.js');
const StandardHours = require('../models/StandardHours.js');
const SpecialHours = require('../models/SpecialHours.js');
const DayOfWeek = require('../models/DayOfWeek.js');

module.exports = {
	updateOne: (req, res, next) => {
		Location.findById(req.params.id, false, false).then(async location => {
			const weekdays = await DayOfWeek.findAll();

			const standardHoursPromises = [];

			for (const weekday of weekdays) {
				standardHoursPromises.push(
					StandardHours.findOrCreate(
						{
							where: {
								idLocation: location.id,
								idDayOfWeek: weekday.id
							}
						}
					)
				);
			}

			Promise.all(standardHoursPromises).then(async standardHours => {
				const requestStandardHours = JSON.parse(req.body.standardHours);
				for (const standardHour of standardHours) {
					standardHour[0].isClosed = requestStandardHours[standardHour[0].idDayOfWeek].isClosed;
					standardHour[0].timeOpen = requestStandardHours[standardHour[0].idDayOfWeek].timeOpen;
					standardHour[0].timeClosed = requestStandardHours[standardHour[0].idDayOfWeek].timeClosed;
					try {
						await standardHour[0].save();
					} catch (err) {
						next(err);
						return null;
					}
				}
				const requestSpecialHours = JSON.parse(req.body.specialHours);
				for (const requestSpecialHourDate in requestSpecialHours) {
					const specialHour = await SpecialHours.findOrCreate(
						{
							where: {
								idLocation: location.id,
								date: requestSpecialHourDate
							}
						}
					);
					specialHour[0].timeOpen = requestSpecialHours[requestSpecialHourDate].timeOpen;
					specialHour[0].timeClosed = requestSpecialHours[requestSpecialHourDate].timeClosed;
					specialHour[0].isClosed = requestSpecialHours[requestSpecialHourDate].isClosed;
					try {
						await specialHour[0].save();
					} catch (err) {
						next(err);
						return null;
					}
				}
				res.json({success: true});
			}).catch(err => {
				next(err);
				return null;
			});


			// StandardHours.findAll(
			// 	{
			// 		where: {
			// 			idLocation: location.id
			// 		}
			// 	}
			// ).then(standardHours => {

			// }).catch(err => {
			// 	next(err);
			// 	return null;
			// });


		}).catch(err => {
			next(err);
			return null;
		});
	}
};
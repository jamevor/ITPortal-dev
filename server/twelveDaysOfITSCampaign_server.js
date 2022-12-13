const TwelveDaysOfITSCampaign = require('../models/TwelveDaysOfITSCampaign.js');
const Spread = require('../models/Spread.js');
const SpreadPhase = require('../models/SpreadPhase.js');
const logger = require('./logger.js');
const { Router } = require('express');
const { Op } = require('sequelize');
const moment = require('moment');
const router = Router();

router.use(async(req, res, next) => {
	const start = moment().local().year(2019).month(11).date(1).startOf('day'); // Dec. 1, 2019
	const end = moment().local().year(2019).month(11).date(13).endOf('day'); // Dec. 13, 2019
	if (moment().local().isAfter(start) && moment().local().isBefore(end)) {
		if (req.isAuthenticated()) {
			let viewedCampaignPage = null;
			switch (req.url.substring(0, 10)) {
				case '/news/321/':
					viewedCampaignPage = 'hasViewedNews';
			}
			switch(req.url.substring(0, 11)) {
				case '/spread/11/':
					viewedCampaignPage = 'hasViewedSpread1';
					break;
				case '/spread/12/':
					viewedCampaignPage = 'hasViewedSpread2';
					break;
				case '/spread/13/':
					viewedCampaignPage = 'hasViewedSpread3';
					break;
				case '/spread/14/':
					viewedCampaignPage = 'hasViewedSpread4';
					break;
				case '/spread/15/':
					viewedCampaignPage = 'hasViewedSpread5';
					break;
				case '/spread/16/':
					viewedCampaignPage = 'hasViewedSpread6';
					break;
				case '/spread/17/':
					viewedCampaignPage = 'hasViewedSpread7';
					break;
				case '/spread/18/':
					viewedCampaignPage = 'hasViewedSpread8';
					break;
				case '/spread/19/':
					viewedCampaignPage = 'hasViewedSpread9';
					break;
				case '/spread/20/':
					viewedCampaignPage = 'hasViewedSpread10';
					break;
				case '/spread/21/':
					viewedCampaignPage = 'hasViewedSpread11';
					break;
				case '/spread/22/':
					viewedCampaignPage = 'hasViewedSpread12';
					break;
			}
			try {
				await TwelveDaysOfITSCampaign.updateUserProgress(req.user.id, viewedCampaignPage);
			} catch (err) {
				logger.err(err);
			}
		}
		res.locals.twelveDaysOfITSCampaignIsActive = true;
		res.locals.twelveDaysOfITSCampaignStatus = await TwelveDaysOfITSCampaign.findOne(
			{
				where: {
					idUser: req.user && req.user.id ? req.user.id : null
				}
			}
		);
		if (res.locals.twelveDaysOfITSCampaignStatus) {
			let trueCount = 0;
			for (let i = 1; i <= 12; i++) {
				if (res.locals.twelveDaysOfITSCampaignStatus[`hasViewedSpread${i}`]) {
					trueCount++;
				}
			}
			res.locals.pizzaPrizeDone = trueCount === 12;
		}
		const allCampaignSpreads = await Spread.findAll(
			{
				where: {
					id: {
						[Op.in]: [11,12,13,14,15,16,17,18,19,20,21,22]
					}
				},
				include: [
					{
						model: SpreadPhase
					}
				]
			}
		);
		res.locals.spreadStatuses = [];
		for (let spreadIndex in allCampaignSpreads) {
			res.locals.spreadStatuses[spreadIndex] = allCampaignSpreads[spreadIndex].spreadPhase.title === 'publish';
		}
	}
	next();
	return null;
});

module.exports = router;
const BannerAPI = require('./BannerAPI.js');
const API = new BannerAPI();

module.exports = {
	getCourseEnrollmentForUser: async(req, res, next) => {
		try {
			const { rows } = await API.getCourseEnrollmentForUser(req.user.employeeID);
			res.json({courses: rows});
			return null;
		} catch (err) {
			next(err);
			return null;
		}
	},
	getCourseByCRN: async(req, res, next) => {
		CRN = req.params.CRN;
		try {
			const { rows } = await API.getAddDropCourses(CRN);
			res.json(rows);
			return null;
		} catch (err) {
			next(err);
			return null;
		}
	},
	getCourseAll: async(req, res, next) => {
		res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
		CRN = req.params.CRN;
		try {
			const { rows } = await API.getAddDropAllCourses();
			res.json(rows);
			return null;
		} catch (err) {
			next(err);
			return null;
		}
	},
	getCoursesSummer: async(req, res, next) => {
		res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
		CRN = req.params.CRN;
		try {
			const { rows } = await API.getAddDropSummerCourses();
			res.json(rows);
			return null;
		} catch (err) {
			next(err);
			return null;
		}
	},
	getMyInstructedAll: async(req, res, next) => {
		try {
			let PIDM = req.session.userAttributes["user.employeeNumber"];
			const { rows } = await API.getMyInstructedAll(PIDM);
			res.json(rows);
			return null;
		} catch (err) {
			next(err);
			return null;
		}
	},

	getInstructedOne: async(req, res, next) => {
		var PIDM = req.params.PIDM || req.session.userAttributes["user.employeeNumber"]; 
		var TERM = req.params.TERM || "";
		var PTERM = req.query.PTERM || "";
		try {
			const { rows } = await API.getMyInstructedAll(PIDM,TERM,PTERM);
			res.json(rows);
			return null;
		} catch (err) {
			next(err);
			return null;
		}
	}
};

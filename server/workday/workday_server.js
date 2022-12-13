const logger = require('../logger.js');
const WorkdayAPI = require('./WorkdayAPI.js');
const API = new WorkdayAPI();
const currentAcademicPeriod = '2022_Fall_Full_Semester_202301-1'

// const currentAcademicPeriod = '2022_Spring_Late_Start_Online_202202--2'
module.exports = {
	getCourseEnrollmentForUser: (req, res, next) => {
		API.getCourseEnrollmentForUser(req.user.employeeID,currentAcademicPeriod,'json').then(result => {
			result = JSON.parse(result).Report_Entry;

			let filteredResult = result.filter(item => item.CF_LRV_Course_Registration_Status == "Registered");
			filteredResult = result.filter(item => item.Offering_Period != "2022 Fall A Term")

			return res.json(filteredResult);

		}).catch(err => {
			return res.json([{}]);
		});
	},
	getCourseEnrollmentForUserByID: (req, res, next) => {
		const userID = req.params.ID;
		API.getCourseEnrollmentForUser(userID,currentAcademicPeriod,'json').then(result => {
			result = JSON.parse(result).Report_Entry;

			let filteredResult = result.filter(item => item.CF_LRV_Course_Registration_Status == "Registered")
			filteredResult = result.filter(item => item.Offering_Period != "2022 Fall A Term")
			return res.json(filteredResult);
		}).catch(err => {
			return res.json([{}]);
		});
	},
	getEnrollmentForUserByID: (req, res, next) => {
		const userID = req.params.ID;
		API.getEnrollmentForUser(userID,'json').then(result => {
			result = JSON.parse(result).Report_Entry;
			return res.json(result);
		}).catch(err => {
			logger.info(err);
			return res.json([{}]);
		});
	},
	getEnrollment: (req, res, next) => {
		API.getEnrollment('json').then(result => {
			result = JSON.parse(result).Report_Entry;
			return res.json(result);
		}).catch(err => {
			logger.info(err);
			return res.json([{}]);
		});
	},
	getCourseEnrollmentForUserByTermAndID: (req, res, next) => {
		const userID = req.params.ID;
		const term = req.params.Term;
		API.getCourseEnrollmentForUser(userID,term,'json').then(result => {
			result = JSON.parse(result).Report_Entry;
			// let filteredResult = result.filter(item => item.CF_LRV_Course_Registration_Status == "Registered")
			return res.json(result);
		}).catch(err => {
			return res.json([{}]);
		});
	},
	getCourseEnrollmentForUserByTerm: (req, res, next) => {
		const term = req.params.term;
		API.getCourseEnrollmentForUser(req.user.employeeID,term,'json').then(result => {
			result = JSON.parse(result).Report_Entry;
			return res.json(result);
		}).catch(err => {
			return res.json([{}]);
		});
	},
	getCourseAll: (req, res, next) => {
		res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
		API.getCourse(null,null,currentAcademicPeriod,null,'json').then(result => {
			return res.json(JSON.parse(result).Report_Entry);
		}).catch(err => {
			return res.json([{}]);
		});
	},
	getCourseAllFull: async(req, res, next) => {
		res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
		
		let period1 = await API.getCourse(null,null,'2022_Fall_B_Term_202301-B',0,'json');
		// let period2 = await API.getCourse(null,null,'2022_Fall_Full_Semester_202301-1',0,'json');

		period1 = JSON.parse(period1).Report_Entry;
		// period3 = JSON.parse(period3).Report_Entry;

		// const output = [...period2,...period3];
		const output = period1;
		return res.json(output)
	},
	getCourseAllSummer: async(req, res, next) => {
		res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');

		// let period1 = await API.getCourse(null,null,'2022_Summer_Full_Semester_202203-E',0,'json');
		let period3 = await API.getCourse(null,null,'2022_Summer_Session_I_202203-E1',0,'json');
		let period2 = await API.getCourse(null,null,'2022_Summer_Session_II_202203-E2',0,'json');

		// period1 = JSON.parse(period1).Report_Entry;
		period2 = JSON.parse(period2).Report_Entry;
		period3 = JSON.parse(period3).Report_Entry;
		
		const output = [...period2,...period3];
		return res.json(output)
	},
	getCourse: (req, res, next) => {
		
		const CourseID = req.params.courseID;
		API.getCourse(CourseID,null,currentAcademicPeriod,null,'json').then(result => {
			return res.json(JSON.parse(result).Report_Entry);
		}).catch(err => {
			return res.json([{}]);
		});
	},
	getSection: (req, res, next) => {
		
		const SectionID = req.params.sectionID;
		API.getCourse(null,SectionID,null,null,'json').then(result => {
			return res.json(JSON.parse(result).Report_Entry);
		}).catch(err => {
			return res.json([{}]);
		});
	},
};

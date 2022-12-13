const workdayConfig = require('../../config.js').workday;
const request = require('request');
const requestPromise = require('request-promise-native');
const jar = request.jar();
const logger = require('../logger.js');
const moment = require('moment');

module.exports = class WorkdayAPI {
	constructor() {
		this.baseURLReg = 'https://wd5-services1.myworkday.com/ccx/service/customreport2/wpi/rsharma2';
		this.baseURLTest = 'https://wd5-services1.myworkday.com/ccx/service/customreport2/wpi/medmonds'
		this.methods = {
			GET: 'GET',
			POST: 'POST'
		};
	}
	/**
	 * get banner course enrollments for user by wpi id
	 * @param {String} IDNO - wpi ID number
	 * @return {Promise<Object>} { metaData: [...], rows: [{...}] }
	 */
	getCourseEnrollmentForUser(ID,academicPeriod,format) {
		const qs = {
			'Student!Student_ID':ID,
			'Academic_Period!Academic_Period_ID':academicPeriod,
			'format':format
		}
		return makeARequest(this.methods.GET, '/Data_Validation_for_Add_Drop_User_enrollment', this.baseURLReg, qs);
	}
	/**
		 * get banner course enrollments for user by wpi id
		 * @param {String} IDNO - wpi ID number
		 * @return {Promise<Object>} { metaData: [...], rows: [{...}] }
		 */
	getCourse(CourseID,SectionID,academicPeriod,showHidden,format) {
		const qs = {
			'Course_Definition!Student_Course_ID':CourseID,
			'referenceID':SectionID,
			'Academic_Period!Academic_Period_ID':academicPeriod,
			'Hidden_Course_Section':showHidden,
			'format':format
		}
		return makeARequest(this.methods.GET, '/Data_Validation_for_Add_Drop_Course_Sections_V2', this.baseURLTest, qs);
	}

		/**
	 * get 
	 * @param {String} ID - wpi ID number
	 * @return {Promise<Object>} { metaData: [...], rows: [{...}] }
	 */
	getEnrollmentForUser(ID,format) {
		const qs = {
			'Student_ID':ID,
			'format':format,
			'Expected_Completion_Date_1':'2021-12-30',
			'Expected_Completion_Date_2':'2022-05-14',

		}

		return makeARequest(this.methods.GET, '/WPI_INT1221_Commencement_Management_Integration', this.baseURLReg, qs);
	}
	getEnrollment(format) {
		const qs = {
			'format':format,
			'Expected_Completion_Date_1':'2021-12-30',
			'Expected_Completion_Date_2':'2022-05-14',

		}

		return makeARequest(this.methods.GET, '/WPI_INT1221_Commencement_Management_Integration', this.baseURLReg, qs);
	}
}

function makeARequest(method, url, baseUrl, qs, form) {
	return requestPromise(
			{
				method,
				baseUrl,
				url,
				auth:{
					'user':workdayConfig.username,
					'pass':workdayConfig.password
				},
				qs,
				form,
				jar,
				headers: {
					'Cache-Control': 'no-cache',
				}
			}
		)
}
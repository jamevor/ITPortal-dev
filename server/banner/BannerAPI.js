const logger = require('../logger.js');
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

module.exports = class BannerAPI {
	constructor(etrm) {
		this._etrm = etrm || '202003';
	}

	/**
	 * get banner course enrollments for user by wpi id
	 * @param {String} IDNO - wpi ID number
	 * @return {Promise<Object>} { metaData: [...], rows: [{...}] }
	 */
	async getCourseEnrollmentForUser(IDNO) {
		let connection;
		try {
			connection = await oracledb.getConnection({
				user: process.env.ORACLE_USER,
				password: process.env.ORACLE_PASS,
				connectString: process.env.ORACLE_CONNECT_STRING
			});
			const result = await connection.execute(
				`select idno,etrm,title,crn,subj,crse,sect,course,course_gmod,course_gmod_desc,student_gmod,grade
				from Cherwell_course_data
				where idno = '${IDNO}'`
			);
			return result;
		} catch (err) {
			throw err;
		} finally {
			if (connection) {
				try {
					await connection.close();
				} catch (err) {
					logger.err(err);
				}
			}
		}
	}

		/**
	 * get banner course enrollments for user by wpi id
	 * @param {String} PIDM - wpi PIDM
	 * @return {Promise<Object>} { metaData: [...], rows: [{...}] }
	 */
	async getCourseEnrollmentForUserByPIDM(PIDM) {
		let connection;
		try {
			connection = await oracledb.getConnection({
				user: process.env.ORACLE_USER,
				password: process.env.ORACLE_PASS,
				connectString: process.env.ORACLE_CONNECT_STRING
			});
			const result = await connection.execute(
				`select *
				from Cherwell_course_data
				where PIDM = '${PIDM}'`
			);
			return result;
		} catch (err) {
			throw err;
		} finally {
			if (connection) {
				try {
					await connection.close();
				} catch (err) {
					logger.err(err);
				}
			}
		}
	}
	/**
	 * get banner course enrollments for user by wpi id
	 * @param {String} employeeNumber - wpi PIDM (Empployee Number)
	 * @return {Promise<Object>} { metaData: [...], rows: [{...}] }
	 */
	async getAddDropStudent(employeeNumber,eterm) {
		let connection;
		try {
			connection = await oracledb.getConnection({
				user: process.env.ORACLE_USER,
				password: process.env.ORACLE_PASS,
				connectString: process.env.ORACLE_CONNECT_STRING
			});

			const result = await connection.execute(
				`select *
				from CHERWELL_REG_STUDENTS
				where PIDM = '${employeeNumber}'
				AND ENROLL_TERM = '${eterm}'`
			);
			return result;
		} catch (err) {
			return false;
		} finally {
			if (connection) {
				try {
					await connection.close();
				} catch (err) {
					return false;
				}
			}
		}
	}
	/**
	 * get Add Drop Course by CRN
	 * @param {String} CRN - Course Number of Banner Course
	 * @return {Promise<Object>} { metaData: [...], rows: [{...}] }
	 */
	async getAddDropCourses(CRN) {
		let connection;
		try {
			connection = await oracledb.getConnection({
				user: process.env.ORACLE_USER,
				password: process.env.ORACLE_PASS,
				connectString: process.env.ORACLE_CONNECT_STRING
			});
			const result = await connection.execute(
				`select *
				from CHERWELL_REG_SECTIONS
				WHERE CRN IN (${CRN})`
			);
			return result;
		} catch (err) {
			throw err;
		} finally {
			if (connection) {
				try {
					await connection.close();
				} catch (err) {
					logger.err(err);
				}
			}
		}
	}
	/**
	 * get ALL add drop courses
	 * @return {Promise<Object>} { metaData: [...], rows: [{...}] }
	 */
	async getAddDropAllCourses() {
		let connection;
		try {
			connection = await oracledb.getConnection({
				user: process.env.ORACLE_USER,
				password: process.env.ORACLE_PASS,
				connectString: process.env.ORACLE_CONNECT_STRING
			});
			const result = await connection.execute(
				`select *
				from CHERWELL_REG_SECTIONS
				WHERE TERM = '202103'`
			);

				// select *
				// from CHERWELL_REG_SECTIONS
				// WHERE TERM = '202102'
				// AND PTRM <> '1'
				// AND PTRM <> 'A'
				// AND PTRM <> '1C'

			return result;
		} catch (err) {
			throw err;
		} finally {
			if (connection) {
				try {
					await connection.close();
				} catch (err) {
					logger.err(err);
				}
			}
		}
	}
		/**
	 * get ALL add drop courses
	 * @return {Promise<Object>} { metaData: [...], rows: [{...}] }
	 */
		 async getAddDropSummerCourses() {
			let connection;
			try {
				connection = await oracledb.getConnection({
					user: process.env.ORACLE_USER,
					password: process.env.ORACLE_PASS,
					connectString: process.env.ORACLE_CONNECT_STRING
				});
				const result = await connection.execute(
					`select *
					from CHERWELL_REG_SECTIONS
					WHERE TERM = '202103'`
				);
	
					// select *
					// from CHERWELL_REG_SECTIONS
					// WHERE TERM = '202102'
					// AND PTRM <> '1'
					// AND PTRM <> 'A'
					// AND PTRM <> '1C'
	
				return result;
			} catch (err) {
				throw err;
			} finally {
				if (connection) {
					try {
						await connection.close();
					} catch (err) {
						logger.err(err);
					}
				}
			}
		}
		/**
	 * get ball courses where user instructs
	 * @param {String} PIDM - wpi PIDM
	 * @param {String} TERM - wpi banner term ex 202101 (optional)
	 * @return {Promise<Object>} { metaData: [...], rows: [{...}] }
	 */
	async getMyInstructedAll(PIDM,TERM,PTERM) {
		let connection;
		try {
			connection = await oracledb.getConnection({
				user: process.env.ORACLE_USER,
				password: process.env.ORACLE_PASS,
				connectString: process.env.ORACLE_CONNECT_STRING
			});
			let termQuery = "";
			let ptermQuery = "";
			if(TERM){
				termQuery = `AND CRSE_TERM = '${TERM}'`;
			}
			if(PTERM){
				let ptermString = "'" + PTERM.join("','") + "'";
				ptermQuery = `AND CRSE_PTRM IN (${ptermString})`;
			}

			var result = await connection.execute(
				`select *
				from thanksgiving_intent
				WHERE INST_PIDM = '${PIDM}'
				${termQuery}
				${ptermQuery}`
			);

			return result;
		} catch (err) {
			throw err;
		} finally {
			if (connection) {
				try {
					await connection.close();
				} catch (err) {
					logger.err(err);
				}
			}
		}
	}

	/**
	 * get banner user from Cherwell Customer View for user by wpi id
	 * @param {String} IDNO - wpi ID number
	 * @return {Promise<Object>} { metaData: [...], rows: [{...}] }
	 */
	async getBannerUserByID(IDNO) {
		let connection;
		try {
			connection = await oracledb.getConnection({
				user: process.env.ORACLE_USER,
				password: process.env.ORACLE_PASS,
				connectString: process.env.ORACLE_CONNECT_STRING
			});
			const result = await connection.execute(
				`select *
				from WPI_CHERWELL_STUDENT
				where ID = '${IDNO}'`
			);
			return result;
		} catch (err) {
			throw err;
		} finally {
			if (connection) {
				try {
					await connection.close();
				} catch (err) {
					logger.err(err);
				}
			}
		}
	}
	/**
	 * get banner course enrollments for user by wpi PIDM
	 * @param {String} employeeNumber - wpi PIDM (Empployee Number)
	 * @param {String} term - WPI term (Employee Number)
	 * @return {Promise<Object>} { metaData: [...], rows: [{...}] }
	 */
	async getBannerUserByPIDM(employeeNumber,term) {
		term = term || null;
		let termConstraint = "";
		let connection;
		try {
			connection = await oracledb.getConnection({
				user: process.env.ORACLE_USER,
				password: process.env.ORACLE_PASS,
				connectString: process.env.ORACLE_CONNECT_STRING
			});
			const result = await connection.execute(
				`select *
				from WPI_CHERWELL_STUDENT
				where PIDM = '${employeeNumber}'
				${termConstraint}`
			);
			return result;
		} catch (err) {
			throw err;
		} finally {
			if (connection) {
				try {
					await connection.close();
				} catch (err) {
					logger.err(err);
				}
			}
		}
	}
}
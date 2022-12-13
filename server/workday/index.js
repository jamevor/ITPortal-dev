const router = require('express').Router();
const G = require('../_global_logic.js');
const workday = require('./workday_server.js');

/**
 * General
 */
router.get('/api/v1/workday/getUserCourseEnrollments', G.isAuthenticated, workday.getCourseEnrollmentForUser);
router.get('/api/v1/workday/getUserCourseEnrollmentsByID/:ID', G.nextIfAdmin, workday.getCourseEnrollmentForUserByID);
router.get('/api/v1/workday/getUserEnrollmentsByID/:ID', G.nextIfAdmin, workday.getEnrollmentForUserByID);
router.get('/api/v1/workday/getUserEnrollments/', workday.getEnrollment);
router.get('/api/v1/workday/getUserCourseEnrollmentsByTerm/:Term', G.nextIfAdmin, workday.getCourseEnrollmentForUserByTerm);
router.get('/api/v1/workday/getUserCourseEnrollmentsByTermAndID/:Term/:ID', G.nextIfAdmin, workday.getCourseEnrollmentForUserByTermAndID);

router.get('/api/v1/workday/getCourse/all/', G.isAuthenticated, workday.getCourseAll);
router.get('/api/v1/workday/getCourse/allFull/', G.isAuthenticated, workday.getCourseAllFull);
router.get('/api/v1/workday/getCourse/allSummer/', G.isAuthenticated, workday.getCourseAllSummer);
router.get('/api/v1/workday/getCourse/:courseID(*)', G.isAuthenticated, workday.getCourse);
router.get('/api/v1/workday/getSection/:sectionID(*)', G.isAuthenticated, workday.getSection);

module.exports = router;
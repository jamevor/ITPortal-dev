const router = require('express').Router();
const G = require('../_global_logic.js');
const banner = require('./banner_server.js');

/**
 * General
 */
router.get('/api/v1/banner/getUserCourseEnrollments', G.isAuthenticated, banner.getCourseEnrollmentForUser);

router.get('/api/v1/banner/getCourse/one/:CRN', banner.getCourseByCRN);
router.get('/api/v1/banner/getCourse/all/', banner.getCourseAll);
router.get('/api/v1/banner/getCourse/summer/', banner.getCoursesSummer);
router.get('/api/v1/banner/getMyInstructed/all/', G.isAuthenticated, banner.getMyInstructedAll);
router.get('/api/v1/banner/getInstructed/one/:PIDM?/:TERM?/:PTERM?', G.nextIfAdmin, banner.getInstructedOne);

module.exports = router;
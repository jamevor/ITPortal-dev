const router = require('express').Router();
const azure = require('./azure_server.js');
const canvas = require('./canvas_server.js');
const G = require('../_global_logic.js');
const UserOauth = require('../../models/UserOauth.js');

/**
 * Azure
 */
router.get('/api/v1/azure/oauth2/v2.0/authorize', G.ensureAuthenticated, azure.authorize);
router.get('/api/v1/azure/oauth2/callback', G.ensureAuthenticated, azure.oauthCallback);
router.get('/api/v1/azure/getMyMessages', G.ensureAuthenticated, azure.getMyMessages);
router.get('/api/v1/azure/getMyRecentFiles', G.ensureAuthenticated, azure.getMyRecentFiles);
router.get('/api/v1/azure/getMySchedule', G.ensureAuthenticated, azure.getMySchedule);

/**
 * Canvas
 */
router.get('/api/v1/canvas/oauth2/v2.0/authorize', G.ensureAuthenticated, canvas.authorize);
router.get('/api/v1/canvas/oauth2/callback', G.ensureAuthenticated, canvas.oauthCallback);
router.get('/api/v1/canvas/getUserTasks', G.ensureAuthenticated, canvas.getUserTasks);
router.get('/api/v1/canvas/getUserFavoriteCourses', G.ensureAuthenticated, canvas.getUserFavoriteCourses);

/**
 * General
 */
router.get('/api/v1/token/:type/get', async(req, res, next) => {
	try {
		const resp = await UserOauth.getToken(req.user.id, req.params.type);
		res.json(resp);
	} catch (err) {
		next(err);
		return null;
	}
});

module.exports = router;
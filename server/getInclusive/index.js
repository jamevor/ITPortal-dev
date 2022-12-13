const router = require('express').Router();
const G = require('../_global_logic.js');
const getInclusive = require('./getInclusive_server.js');

/**
 * General
 */
router.get('/api/v1/getInclusive/getCurrentUserStatus', G.isAuthenticated, getInclusive.getCurrentUserStatus);
router.get('/api/v1/getInclusive/getUserStatus/:ID', G.isAdminUser, getInclusive.getUserStatus);

module.exports = router;
const router = require('express').Router();
const cherwell = require('./cherwell_server.js');
const G = require('../_global_logic.js');
const multer = require( 'multer');
const upload = multer();
/**
 * ! Endpoints that do NOT require auth
 */
router.post('/api/v1/cherwell/ticket/create/one', cherwell.createIncident);
router.post('/api/v1/cherwell/ticket/create/one/covid19', cherwell.createIncidentCovid19);
router.post('/api/v1/cherwell/ticket/create/one/covid19Department', cherwell.createIncidentCovid19Department);
router.post('/api/v1/cherwell/ticket/create/one/covid19-add', cherwell.createIncidentCovid19Add);
router.post('/api/v1/cherwell/ticket/create/one/covid19-external-add', cherwell.createIncidentCovid19ExternalAdd);
router.post('/api/v1/cherwell/ticket/create/one/covid19-humans-add', cherwell.createIncidentCovid19HumansAdd);
router.post('/api/v1/cherwell/ticket/create/one/covid19-research-cont', cherwell.createIncidentCovid19ResearchCont);
router.post('/api/v1/cherwell/ticket/create/one/nso', cherwell.createIncidentNSO);
router.post('/api/v1/cherwell/ticket/create/one/changeTest', cherwell.changeTest);
router.post('/api/v1/cherwell/ticket/create/one/changeArrival', cherwell.changeArrival);
router.post('/api/v1/cherwell/ticket/create/one/changeOnboarding', cherwell.changeOnboarding);
router.post('/api/v1/cherwell/ticket/create/one/grade-format', cherwell.createIncidentGradeFormat);
router.post('/api/v1/cherwell/ticket/create/one/intent-to-grad', cherwell.createIncidentIntentToGrad);
router.post('/api/v1/cherwell/ticket/create/one/student-flag', cherwell.createIncidentStudentFlag);
router.post('/api/v1/cherwell/ticket/create/one/workday-request', cherwell.createIncidentWorkdayRequest);
router.post('/api/v1/cherwell/ticket/create/one/software-request', cherwell.createIncidentSoftwareRequest);
router.post('/api/v1/cherwell/ticket/create/one/commencement-participation', cherwell.createIncidentCommencement);
router.post('/api/v1/cherwell/ticket/create/one/add-drop', cherwell.createIncidentAddDrop);
// router.post('/api/v1/cherwell/ticket/create/one/student-intent', cherwell.createIncidentWorkdayRequest);
router.post('/api/v1/cherwell/ticket/create/one/covid-log', cherwell.createCovidLog);
router.post('/api/v1/cherwell/ticket/create/one/covid-dept-log', cherwell.createCovidDeptLog);
router.post('/api/v1/cherwell/ticket/create/one/covid-campus-visitor', cherwell.createCovidVisitor);
router.get('/api/v1/cherwell/ticket/get/my-student-intent', cherwell.getSurveyCheck);
router.get('/api/v1/cherwell/ticket/get/my-intent-to-grad', cherwell.getGradIntentCheck);
router.get('/api/v1/cherwell/sieDept/get/all', cherwell.getSIEDept);
router.get('/api/v1/cherwell/sieGoals/get/all', cherwell.getSIEGoals);
router.get('/api/v1/cherwell/sieGoals/get/one/:id(\\d+)?', cherwell.getASIEGoal);
router.get('/api/v1/cherwell/ticket/get/commencement-participation', cherwell.getcommencementCheck);
router.get('/api/v1/cherwell/approval-departments/get/all', cherwell.getApprovalDept);
// router.get('/api/v1/cherwell/move-in/get/all', cherwell.getMoveInCounts);
router.post('/api/v1/cherwell/move-in/remove/one/', cherwell.removeMoveIn);
router.post('/api/v1/cherwell/move-in/create/one/', cherwell.addMoveIn);
router.post('/api/v1/cherwell/onboardingTask/create/one/', cherwell.createOnboardingTask);


/**
 * ! Endpoints for Tufts systems
 */

 router.get('/api/v1/cherwell/waiver/get/one/:publicID', G.requireTuftsAPIKey, cherwell.getWaiverStatusOne);
 router.get('/api/v1/cherwell/waiver/get/all', G.requireTuftsAPIKey, cherwell.getWaiverStatusAll);
 router.post('/api/v1/cherwell/swipe/create/one', G.requireTuftsAPIKey, cherwell.createSwipeRecord);

/**
 * ! Endpoints that require NetOpsAPIKey
 */
router.get('/api/v1/cherwell/ticket/get/netops', G.requireNetOpsAPIKey, cherwell.getNetOpsTickets);
router.get('/api/v1/cherwell/task/get/netops', G.requireNetOpsAPIKey, cherwell.getNetOpsTasks);

router.options('/api/v1/cherwell/ticket/create/one/icigna', function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length");
    res.sendStatus(200);
});
router.post('/api/v1/cherwell/ticket/create/one/icigna', cherwell.createIncidentiCigna);

/**
 * ! Endpoints that ENSURE auth
 */
router.get('/Ticket/:publicID', G.ensureAuthenticated, cherwell.renderIncidentById);
router.get('/Approval/:recID', G.ensureAuthenticated, cherwell.renderApprovalById);
router.get('/io/Student-Intent/:recID', G.ensureAuthenticated, cherwell.renderIntentById);
router.get('/io/Waiver/:recID', G.ensureAuthenticated, cherwell.renderWaiverById);
router.get('/io/ContractDelegate/:recID?', G.ensureAuthenticated, cherwell.renderContractDelegateById);
router.get('/io/coi/:recID?', G.ensureAuthenticated, cherwell.renderCoiById);
router.get('/io/Onboarding/:recID?', G.ensureAuthenticated, cherwell.renderOnboardingById);

router.get('/io/CA/:recID?', cherwell.renderCommencementAcknowledgement);

router.get('/io/REU/:recID?', cherwell.renderREUById);
router.get('/me/REU/', G.ensureAuthenticated, cherwell.renderREUDash);
router.get('/io/Move-In/', G.ensureAuthenticated, cherwell.renderMoveIn);
router.get('/Asset/:assetTag', G.ensureAuthenticated, cherwell.renderAssetById);
router.post('/api/v1/cherwell/regApproval/update/one/', G.ensureAuthenticated, cherwell.updateRegApproval);
router.post('/api/v1/cherwell/Approval/update/one/', G.ensureAuthenticated, cherwell.updateApproval);
router.post('/api/v1/cherwell/intent/update/one/', G.ensureAuthenticated, cherwell.updateIntent);
router.post('/api/v1/cherwell/waiver/update/one/', G.ensureAuthenticated, cherwell.updateWaiver);
router.post('/api/v1/cherwell/ContractDelegate/update/one/', G.ensureAuthenticated, cherwell.updateContractDelegate);
router.post('/api/v1/cherwell/coi/update/one/', G.ensureAuthenticated, cherwell.updateCoi);
router.get('/api/v1/cherwell/ContractDelegate/get/my/', G.ensureAuthenticated, cherwell.getContracts);
router.get('/api/v1/cherwell/employees/get/all/', G.ensureAuthenticated, cherwell.getEmployees);

router.post('/api/v1/cherwell/REU/update/one/', cherwell.updateREU);
router.get('/api/v1/cherwell/getMyInstructedIntent/all/', G.ensureAuthenticated, cherwell.getMyInstructedIntent);
router.post('/api/v1/cherwell/covidcase/create/one/', G.ensureAuthenticated, cherwell.createCovidCase);
router.post('/api/v1/cherwell/covidclear/create/one/', G.ensureAuthenticated, cherwell.createCovidClear);

router.post('/api/v1/cherwell/commencementRSVP/update/one/', G.ensureAuthenticated, cherwell.updateCommencementRSVP);
router.post('/api/v1/cherwell/commencementGuest/create/one/', G.ensureAuthenticated, cherwell.createCommencementGuest);
router.post('/api/v1/cherwell/commencementGuest/void/one/', G.ensureAuthenticated, cherwell.voidCommencementGuest);
router.get('/api/v1/cherwell/getCommencementTickets/all/', G.ensureAuthenticated, cherwell.getAllCommencementTitckets);
router.get('/api/v1/cherwell/getCommencementAttendees/:level', G.ensureAuthenticated, cherwell.getCommencementAttendees);
router.post('/api/v1/cherwell/commencementTicketCheckIn', G.ensureAuthenticated, cherwell.commencementTicketCheckIn);


router.get('/api/v1/cherwell/getTestDistribution/:id', G.ensureAuthenticated, cherwell.getTestDistribution);
router.post('/api/v1/cherwell/distributeTest/', G.ensureAuthenticated, cherwell.createAllocationRecord);

/**
 * ! Endpoints that DO require auth
 */
router.use('/api/v1/cherwell/*', G.isAuthenticated);
// TODO router.use('/api/v1/cherwell/*, cherwell.refreshCustomerSessionCache?);

// ! admin only
router.get('/api/v1/cherwell/getRelationshipID/:busObjID/:relationshipDisplayName', G.nextIfAdmin, cherwell.getRelationshipID);
router.get('/api/v1/cherwell/getBusinessObject/:busObjID/:publicID', G.nextIfAdmin, cherwell.getBusinessObject);
router.get('/api/v1/cherwell/getBusinessObjectByRecID/:busObjID/:recID', G.nextIfAdmin, cherwell.getBusinessObjectByRecID);
router.get('/api/v1/cherwell/getBusinessObjectSummariesByType/:type', G.nextIfAdmin, cherwell.getBusinessObjectSummariesByType);
router.get('/api/v1/cherwell/getBusinessObjectSummaryByName/:name', G.nextIfAdmin, cherwell.getBusinessObjectSummaryByName);
router.get('/api/v1/cherwell/getBusinessObjectSchemaByBusObjID/:busObjID', G.nextIfAdmin, cherwell.getBusinessObjectSchemaByBusObjID);
router.get('/api/v1/cherwell/getBusinessObjectSchemaByName/:name', G.nextIfAdmin, cherwell.getBusinessObjectSchemaByName);
router.get('/api/v1/cherwell/me/getAttributes', G.nextIfAdmin, cherwell.getUserAttributes);
router.get('/api/v1/cherwell/getRelatedBusinessObjects/:busObjID/:busObjRecID/:relationshipId', G.nextIfAdmin, cherwell.getRelatedBusinessObjects);
router.get('/api/v1/cherwell/getRelatedBusinessObjectsWithGrid/:busObjID/:busObjRecID/:relationshipId/:gridId', G.nextIfAdmin, cherwell.getRelatedBusinessObjectsWithGrid);
router.get('/api/v1/cherwell/getOneStepActions', G.nextIfAdmin, cherwell.getOneStepActions);
router.post('/api/v1/cherwell/getBusinessObjectTemplate', G.nextIfAdmin, cherwell.getBusinessObjectTemplate);
router.get('/api/v1/cherwell/getInstructed/one/:PIDM?/:TERM?/', G.nextIfAdmin, cherwell.getInstructedIntentOne);
router.get('/api/v1/cherwell/refreshToken', G.nextIfAdmin, cherwell.refreshToken);
router.get('/api/v1/cherwell/getTokens', G.nextIfAdmin, cherwell.getTokens);


// endpoints for all auth users
router.get('/api/v1/cherwell/me/ticket/get/open', cherwell.getOpenIncidentsForUser);
router.get('/api/v1/cherwell/me/ticket/get/closed', cherwell.getClosedIncidentsForUser);
router.get('/api/v1/cherwell/me/ticket/get/all', cherwell.getAllIncidentsForUser);
router.get('/api/v1/cherwell/me/ticket/get/subscribed', cherwell.getSubscribedIncidentsForUser);
router.get('/api/v1/cherwell/me/intent/get/all', cherwell.getAllIntentsForUser);
router.get('/api/v1/cherwell/me/asset/get/all', cherwell.getAllCIsForUser);
router.get('/api/v1/cherwell/me/asset/get/primary', cherwell.getCIsForPrimaryUser);
router.get('/api/v1/cherwell/me/regApproval/get/open', cherwell.getWaitingRegApprovalsForUser);
router.get('/api/v1/cherwell/me/regApproval/get/closed', cherwell.getClosedRegApprovalsForUser);
router.post('/api/v1/cherwell/ticket/asset/create/one', cherwell.createIncidentWithAsset);
router.get('/api/v1/cherwell/ticket/get/one/:publicID', cherwell.getOneIncident);
router.get('/api/v1/cherwell/ticket/journal-portal/get/all/:publicID', cherwell.getPortalJournalsForIncident);
router.get('/api/v1/cherwell/asset/get/one/:assetTag', cherwell.getOneCI);
/**
 * expects form data as:
 * {
 *   token,
 *   ticketID: '123456',
 *   formData: {
 *      details: 'Please work on my ticket!'
 *   }
 * }
 */
router.post('/api/v1/cherwell/ticket/journal/create/one', cherwell.createJournalForIncident);
router.post('/api/v1/cherwell/ticket/reopen', cherwell.reopenIncident);
router.post('/api/v1/cherwell/ticket/close', cherwell.closeIncident);

module.exports = router;
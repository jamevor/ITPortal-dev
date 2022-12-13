// 3.0.0
'use strict';
const uuidv4 = require('uuid/v4');
const { QueryTypes } = require('sequelize');

module.exports = {
	up: async(queryInterface) => {
		const spreads = await queryInterface.sequelize.query('SELECT * FROM `spread`', { type: QueryTypes.SELECT });
		const spreadsResult = [];
		for (const spread of spreads) {
			spreadsResult.push(
				{
					idSpread: spread.id,
					idGroup: 2,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				}
			);
		}
		await queryInterface.bulkInsert('spreadHasGroup', spreadsResult);

		const services = await queryInterface.sequelize.query('SELECT * FROM `service`', { type: QueryTypes.SELECT });
		const servicesResult = [];
		for (const service of services) {
			servicesResult.push(
				{
					idService: service.id,
					idGroup: 2,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				}
			);
		}
		await queryInterface.bulkInsert('serviceHasGroup', servicesResult);

		const components = await queryInterface.sequelize.query('SELECT * FROM `component`', { type: QueryTypes.SELECT });
		const componentsResult = [];
		for (const component of components) {
			componentsResult.push(
				{
					idComponent: component.id,
					idGroup: 2,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				}
			);
		}
		await queryInterface.bulkInsert('componentHasGroup', componentsResult);

		// --------------------------------------------------------------------------------------

		const software = await queryInterface.sequelize.query('SELECT * FROM `software`', { type: QueryTypes.SELECT });
		const softwareResult = [];
		for (const software_ of software) {
			softwareResult.push(
				{
					idSoftware: software_.id,
					idGroup: 6,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				}
			);
		}
		await queryInterface.bulkInsert('softwareHasGroup', softwareResult);

		// --------------------------------------------------------------------------------------

		const locations = await queryInterface.sequelize.query('SELECT * FROM `location`', { type: QueryTypes.SELECT });
		const locationsResult = [];
		for (const location of locations) {
			locationsResult.push(
				{
					idLocation: location.id,
					idGroup: 7,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				}
			);
		}
		await queryInterface.bulkInsert('locationHasGroup', locationsResult);

		const buildings = await queryInterface.sequelize.query('SELECT * FROM `building`', { type: QueryTypes.SELECT });
		const buildingsResult = [];
		for (const building of buildings) {
			buildingsResult.push(
				{
					idBuilding: building.id,
					idGroup: 7,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				}
			);
		}
		await queryInterface.bulkInsert('buildingHasGroup', buildingsResult);

		// --------------------------------------------------------------------------------------

		const news = await queryInterface.sequelize.query('SELECT * FROM `news`', { type: QueryTypes.SELECT });
		const newsResult = [];
		for (const news_ of news) {
			newsResult.push(
				{
					idNews: news_.id,
					idGroup: 8,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				}
			);
		}
		await queryInterface.bulkInsert('newsHasGroup', newsResult);
	},
	down: () => {
	}
};
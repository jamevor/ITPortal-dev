// 3.0.0
'use strict';
const uuidv4 = require('uuid/v4');
const { QueryTypes } = require('sequelize');

module.exports = {
	up: async(queryInterface) => {
		const articles = await queryInterface.sequelize.query('SELECT * FROM `article`', { type: QueryTypes.SELECT });
		const result = [];
		for (const article of articles) {
			result.push(
				{
					idArticle: article.id,
					idGroup: 2,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				}
			);
		}
		await queryInterface.bulkInsert('articleHasGroup', result);
	},
	down: () => {
	}
};
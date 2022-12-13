// 2.4.0
const uuidv4 = require('uuid/v4');
module.exports = {
	up: async(queryInterface) => {
		try {
			await queryInterface.sequelize.query(
				'UPDATE `location` SET `location`.`hasHours` = ? WHERE `location`.`id` = ?',
				{
					replacements: ['1', '110']
				}
			);
			await queryInterface.sequelize.query(
				'UPDATE `location` SET `location`.`hasHours` = ? WHERE `location`.`id` = ?',
				{
					replacements: ['1', '111']
				}
			);
			await queryInterface.bulkInsert('standardHours', [
				{
					idLocation: 110,
					idDayOfWeek: 1,
					timeOpen: '8:00:00',
					timeClosed: '22:00:00',
					isClosed: false,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idLocation: 110,
					idDayOfWeek: 2,
					timeOpen: '8:00:00',
					timeClosed: '22:00:00',
					isClosed: false,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idLocation: 110,
					idDayOfWeek: 3,
					timeOpen: '8:00:00',
					timeClosed: '22:00:00',
					isClosed: false,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idLocation: 110,
					idDayOfWeek: 4,
					timeOpen: '8:00:00',
					timeClosed: '22:00:00',
					isClosed: false,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idLocation: 110,
					idDayOfWeek: 5,
					timeOpen: '8:00:00',
					timeClosed: '19:00:00',
					isClosed: false,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idLocation: 110,
					idDayOfWeek: 6,
					timeOpen: '8:00:00',
					timeClosed: '19:00:00',
					isClosed: true,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idLocation: 110,
					idDayOfWeek: 7,
					timeOpen: '14:00:00',
					timeClosed: '22:00:00',
					isClosed: false,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				}
			], {});
			await queryInterface.bulkInsert('standardHours', [
				{
					idLocation: 111,
					idDayOfWeek: 1,
					timeOpen: '8:00:00',
					timeClosed: '19:00:00',
					isClosed: false,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idLocation: 111,
					idDayOfWeek: 2,
					timeOpen: '8:00:00',
					timeClosed: '19:00:00',
					isClosed: false,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idLocation: 111,
					idDayOfWeek: 3,
					timeOpen: '8:00:00',
					timeClosed: '19:00:00',
					isClosed: false,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idLocation: 111,
					idDayOfWeek: 4,
					timeOpen: '8:00:00',
					timeClosed: '19:00:00',
					isClosed: false,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idLocation: 111,
					idDayOfWeek: 5,
					timeOpen: '8:00:00',
					timeClosed: '17:00:00',
					isClosed: false,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idLocation: 111,
					idDayOfWeek: 6,
					timeOpen: '8:00:00',
					timeClosed: '19:00:00',
					isClosed: true,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idLocation: 111,
					idDayOfWeek: 7,
					timeOpen: '14:00:00',
					timeClosed: '22:00:00',
					isClosed: true,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				}
			], {});
		} catch (err) {
			throw err;
		}
	},
	down: () => {

	}
};
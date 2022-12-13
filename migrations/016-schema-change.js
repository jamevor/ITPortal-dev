// 2.4.0
module.exports = {
	up: async(queryInterface, Sequelize) => {
		await queryInterface.createTable(
			'greeting',
			{
				languageTag: {
					type: Sequelize.STRING(2),
					primaryKey: true,
					unique: true,
					allowNull: false
				},
				greeting: {
					type: Sequelize.STRING(40),
					allowNull: false
				},
				createdAt: Sequelize.DATE,
				updatedAt: Sequelize.DATE
			}, {
				collate: 'utf8_general_ci'
			}
		);
		await queryInterface.bulkInsert('greeting', [
			{
				languageTag: 'af',
				greeting: 'Hi {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'sq',
				greeting: 'Hi {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'am',
				greeting: 'ሃይ {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'ar',
				greeting: '{{name}} مرحبا', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'eu',
				greeting: 'Hi  {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'bn',
				greeting: 'হাই {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'bs',
				greeting: 'Zdravo {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'ca',
				greeting: 'Hola {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'hr',
				greeting: 'Bok {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'da',
				greeting: 'Hej {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'nl',
				greeting: 'Hoi {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'et',
				greeting: 'Tere {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'fi',
				greeting: 'Moi {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'en',
				greeting: 'Hi {{name}}!', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'el',
				greeting: 'Γεια {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'he',
				greeting: '{{name}} היי', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'is',
				greeting: 'Hæ {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'id',
				greeting: 'Hai {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'it',
				greeting: 'Ciao {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'ja',
				greeting: 'こんにちは {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'ko',
				greeting: '안녕 {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'lt',
				greeting: 'Sveiki {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'mk',
				greeting: 'Здраво {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'pt',
				greeting: 'Oi {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'pa',
				greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'sk',
				greeting: 'Ahoj {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'sl',
				greeting: 'Zdravo {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'sv',
				greeting: 'Hej {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'th',
				greeting: 'สวัสดี {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'tr',
				greeting: 'Merhaba {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'ur',
				greeting: '{{name}} ہیلو', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'vi',
				greeting: 'Chào {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'cy',
				greeting: 'Hi {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'bg',
				greeting: 'здрасти {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'ru',
				greeting: 'Здравствуй {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'fr',
				greeting: 'Bonjour {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'nb',
				greeting: 'Hei {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'nn',
				greeting: 'Hei {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'ro',
				greeting: 'Bună {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'de',
				greeting: 'Hallo {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'gd',
				greeting: 'Haigh {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'zh',
				greeting: '你好 {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'pl',
				greeting: 'Cześć {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'be',
				greeting: 'прывітанне {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'hi',
				greeting: 'नमस्ते {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'hu',
				greeting: 'Szia {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'uk',
				greeting: 'Привіт {{name}}', createdAt: new Date(), updatedAt: new Date()
			},
			{
				languageTag: 'es',
				greeting: 'Hola {{name}}', createdAt: new Date(), updatedAt: new Date()
			}
		]);
	},
	down: () => {

	},
};
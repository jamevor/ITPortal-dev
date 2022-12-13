const logger = require('../logger.js');
const HTMLToEditorJSList = require('../../models/adapters/HTMLToEditorJSList.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../../config.js');
const G = require('../_global_logic.js');
const modelDefaults = require('./databaseDefaultValues.js').modelDefaults;
module.exports = async() => {
	for (let model in modelDefaults.findOrCreate) {
		const Model = require(`../../models/${model}.js`);
		for (let data of modelDefaults.findOrCreate[model]) {
			Model.findOrCreate(
				{
					where: data
				}
			).then(([instance, created]) => {
				if (created) {
					logger.notify(`successfully created default database value with title ${instance.title} for model ${model} at ${instance.createdAt}`);
				} else {
					logger.notify(`default database value with title ${instance.title} for model ${model} already exists as of ${instance.createdAt}`);
				}
			}).catch(err => {
				logger.err(`failed to save default database value with title ${data.title} for model ${model}`);
				logger.err(err);
			});
		}
	}

	for (let model in modelDefaults.bulkCreate) {
		const Model = require(`../../models/${model}.js`);
		const bulkData = [];
		for (let data of modelDefaults.bulkCreate[model]) {

			// convert room notes list to editorjs list
			if (model === 'Location' && typeof data['roomNotes'] === 'string') {
				const adapter = new HTMLToEditorJSList(data['roomNotes']);
				data['roomNotes'] = adapter.adapt();
			}

			for (let datum in data) {
				data[datum] = typeof data[datum] === 'string' ? sanitizeHTML(data[datum], config.sanitizeHTML.allowNone) : data[datum];
				if (datum === 'dateReviewBy') {
					data[datum] = data[datum] || G.defaultDateReviewByFunction();
				}
			}

			bulkData.push(data);
		}

		try {
			const instances = await Model.bulkCreate(bulkData);
			logger.notify(`successfully created ${instances.length} default database values for model ${model}`);
		} catch (err) {
			logger.err(err);
		}
	}
};
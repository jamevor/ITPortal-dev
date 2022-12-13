const Service = require('../../models/Service.js');
const Component = require('../../models/Component.js');
const Portfolio = require('../../models/Portfolio.js');
const Software = require('../../models/Software.js');

const HTMLToEditorJSParagraph = require('../../models/adapters/HTMLToEditorJSParagraph.js');

module.exports = {
	convert: (req, res, next) => {
		Service.findAll().then(async services => {
			for (const service_ of services) {
				service_.descriptionLong = new HTMLToEditorJSParagraph(service_.descriptionLong).adapt();
				await service_.save();
			}
			Component.findAll().then(async components => {
				for (const component of components) {
					component.descriptionLong = new HTMLToEditorJSParagraph(component.descriptionLong).adapt();
					await component.save();
				}
				Portfolio.findAll().then(async portfolios => {
					for (const portfolio of portfolios) {
						portfolio.descriptionLong = new HTMLToEditorJSParagraph(portfolio.descriptionLong).adapt();
						await portfolio.save();
					}
					Software.findAll().then(async software => {
						for (const software_ of software) {
							software_.descriptionLong = new HTMLToEditorJSParagraph(software_.descriptionLong).adapt();
							await software_.save();
						}
						return res.json({success: true});
					}).catch(err => {
						next(err);
						return null;
					});
				}).catch(err => {
					next(err);
					return null;
				});
			}).catch(err => {
				next(err);
				return null;
			});
		}).catch(err => {
			next(err);
			return null;
		});
	}
};
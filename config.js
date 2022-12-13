module.exports = {
	/**
	 * Level of verboseness in server-side logging
	 * 1. 'err'
	 * 2. 'warn'
	 * 3. 'info'
	 * 4. 'notify'
	 */
	loggerLevel: 'info',
	adapterDatabase: {
		enabled: false,
		host: 'its-db-p-u01.wpi.edu',
		user: 'itsdevquery',
		password: 'c2MAyR',
		database: 'itsdev'
	},
	algolia: {
		applicationID: 'ND7V55YXIV',
		apiKey: 'a61c2842d921e71efce4b54321390c2f',
		searchOnlyKey: '31d0312b16520769b2821ada86ee080f',
		monitorOnlyKey: '85dfc6bd63daaabcf54a6bb9e87b36c9'
	},
	cherwell: {
		username: 'portalproxy',
		password: 'M3@t&Che3seZ',
		client_id: '96bf999c-c4d1-44bb-bf87-e24ae1ddbe45',
		apiKeys: {
			NetOps: 'uK5yH6dEhJYeBq3jAGj7',
			Tufts: '5u19TdBeDt8uaZJhLOJ'
		}
	},
	 clearingHouse:{
		 username:'fvboj846!',
		 password:'awjkrvg!258',
		 requestURL:'https://secureapi.studentclearinghouse.org/sssportalui/authenticate',
	},
	workday: {
		username: 'ISU_Cherwell',
		password: 'xowcYx-muskeb-3kidmi',
	},
	getInclusive:{
		xapikey: 'bf585ea0-b025-0138-fc60-32b17cb80b5e'
	},
	tel8x8: {
		screenPopToken: 'Vzpej6Bg4HCfEDfu3NMfmnk4vLPMoR72EYBe1i5Ju1Iq7WuzYbfBr8UtqGK7qRSo'
	},
	fileUpload: {
		dir: './resources/uploads',
		mime: {
			gif: 'image/gif',
			jpg: 'image/jpeg',
			png: 'image/png',
			svg: 'image/svg+xml',
			pdf: 'application/pdf'
		}
	},
	siteInfo: {
		email: 'its@wpi.edu',
		phone: '15088315888',
		address: '100 Institute Road\nWorcester, Massachusetts, 01609 United States',
		headerInclude: true, // override to include header-brain.ejs instead of image or text
		headerImage: null,
		headerBrandFirst: 'Worcester Polytechnic Institute',
		headerBrandSecond: 'Information Technology Services'
	},
	defaultDateReviewByMonths: 6,
	sessionSecret: 'uSW0h36%C56^$2KI',
	grecaptcha: {
		publicKey: '6LcW7ZYUAAAAAJqH2HgvLFroSHpBBv5xgNoP5MZD',
		secretKey: '6LcW7ZYUAAAAAPVGl3_AVGveq12Y-eeC3_Ft_rQ4'
	},
	sanitizeHTML: {
		default: {
			allowedTags: [ 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'span', 'a', 'ul', 'ol',
				'li', 'b', 'i', 'u', 'strong', 'em', 'strike', 'sup', 'sub', 'code', 'div',
				'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre' ],
			allowedAttributes: {
				'a': [ 'href', 'name', 'target' ],
				'span': ['style'],
				'table': ['class']
			},
			allowedStyles: {
				'span': {
					// Match HEX and RGB
					'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
					'background-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
					'text-align': [/^left$/, /^right$/, /^center$/],
					// Match any number with px, em, rem, or %
					'font-size': [/^\d+(?:px|em|%|rem)$/]
				}
			},
			selfClosing: [],
			allowedSchemes: [ 'http', 'https', 'mailto' ], // URL schemes
			allowedSchemesByTag: {},
			allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
			allowProtocolRelative: true
		},
		allowNone: {
			allowedTags: [],
			allowedAttributes: {}
		}
	}
};
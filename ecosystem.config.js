module.exports = {
	apps: [
		{
			name: 'itportal',
			script: './app.js',
			instances: 'max',
			exec_mode: 'cluster',
			time: true,
			env: {
				PORT: 8080
			},
			env_production: {
				NODE_ENV: 'production',
				BUILD_DB: 'false',
				IMPORT_DATA: 'false',
				SERVER_ROOT: 'https://hub.wpi.edu',
				SAML_URL: 'https://login.microsoftonline.com/589c76f5-ca15-41f9-884b-55ec15a0672a/federationmetadata/2007-06/federationmetadata.xml?appid=b90eab9b-9852-4630-a390-0f5eb8256d2f',
				SAML_CALLBACK_URL: 'https://hub.wpi.edu/api/v1/saml/login/callback',
				SAML_ISSUER: 'https://its.wpi.edu/api/v1/saml/service-provider-metadata',
				DB_USER: 'itswebp_dba',
				DB_PASSWORD: '!TG8P6y^dTV%$s6GgZwx',
				DB_URI_SCHEME: 'mariadb://',
				DB_HOST: 'localhost',
				DB_PORT: '3306',
				DB_NAME: 'itswebp_db',
				DB_TIMEZONE: 'America/New_York',
				ALGOLIA_INDEX: 'Portal_prod',
				AES_ENCRYPTION_KEY: '4^7!DFm^Qx6uE2BdEPYnWxp^ptVm$69C',
				TZ: 'America/New_York',
				AZURE_OAUTH_CLIENT_ID: '11663dd9-e5fc-49aa-94ee-25a9cda74aac',
				AZURE_OAUTH_TENANT_ID: '589c76f5-ca15-41f9-884b-55ec15a0672a',
				AZURE_OAUTH_CLIENT_SECRET: 'AB3YsuE6qmb?7iz]f.nrDz8uGuWDg/A2',
				AZURE_OAUTH_SCOPE: 'email offline_access openid profile Calendars.Read Contacts.Read Files.Read.All Mail.Read Sites.Read.All TeamsApp.ReadWrite',
				AZURE_OAUTH_CALLBACK_URL: 'https://hub.wpi.edu/api/v1/azure/oauth2/callback',
				CANVAS_OAUTH_CLIENT_ID: '77820000000000055',
				CANVAS_OAUTH_CLIENT_SECRET: 'fHdh1jCxSrtx9bITuhWO08RG3OqRtSv0wCbtkqnIFKMeX7hCt2AYZ6OY0JXs84Da',
				CANVAS_OAUTH_CALLBACK_URL: 'https://hub.wpi.edu/api/v1/canvas/oauth2/callback',
				ORACLE_USER: 'cherwell',
				ORACLE_PASS: 'jled876igEhjr3f4_74hnf',
				ORACLE_DBO_SCHEMA: 'WPIOBJ',
				ORACLE_SERVICE_NAME: 'PROD',
				ORACLE_CONNECT_STRING: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=bannerprod.wpi.edu)(PORT=1527))(CONNECT_DATA=(SERVER=dedicated)(SERVICE_NAME=prod.admin.wpi.edu)))'
			},
			env_staging: {
				NODE_ENV: 'staging',
				BUILD_DB: 'false',
				IMPORT_DATA: 'false',
				SERVER_ROOT: 'https://itsdev.wpi.edu',
				SAML_URL: 'https://login.microsoftonline.com/589c76f5-ca15-41f9-884b-55ec15a0672a/federationmetadata/2007-06/federationmetadata.xml?appid=7d661fe5-1c57-4810-ac99-4647ca3120db',
				SAML_CALLBACK_URL: 'https://itsdev.wpi.edu/api/v1/saml/login/callback',
				SAML_ISSUER: 'https://itsdev.wpi.edu/api/v1/saml/service-provider-metadata',
				DB_USER: 'itswebd_db',
				DB_PASSWORD: '@ZcNqnXvk$9rkYVy5CrcFH',
				DB_URI_SCHEME: 'mariadb://',
				DB_HOST: 'localhost',
				DB_PORT: '3306',
				DB_NAME: 'itswebd_db',
				DB_TIMEZONE: 'America/New_York',
				ALGOLIA_INDEX: 'Portal_staging',
				AES_ENCRYPTION_KEY: 'pNEBqhj5v#UXnN*dMErtCpjFn3YQ&55p',
				TZ: 'America/New_York',
				AZURE_OAUTH_CLIENT_ID: '13716d3a-68c7-417c-8271-1b3ebb74b349',
				AZURE_OAUTH_TENANT_ID: '589c76f5-ca15-41f9-884b-55ec15a0672a',
				AZURE_OAUTH_CLIENT_SECRET: 'FsyUDwNRSgEx3=GtJ8teCgT7K=nNz9/@',
				AZURE_OAUTH_SCOPE: 'email offline_access openid profile Calendars.Read Contacts.Read Files.Read.All Mail.Read Sites.Read.All TeamsApp.ReadWrite',
				AZURE_OAUTH_CALLBACK_URL: 'https://itsdev.wpi.edu/api/v1/azure/oauth2/callback',
				CANVAS_OAUTH_CLIENT_ID: '77820000000000055',
				CANVAS_OAUTH_CLIENT_SECRET: 'fHdh1jCxSrtx9bITuhWO08RG3OqRtSv0wCbtkqnIFKMeX7hCt2AYZ6OY0JXs84Da',
				CANVAS_OAUTH_CALLBACK_URL: 'https://itsdev.wpi.edu/api/v1/canvas/oauth2/callback',
				ORACLE_USER: 'cherwell',
				ORACLE_PASS: 'jled876igEhjr3f4_74hnf',
				ORACLE_DBO_SCHEMA: 'WPIOBJ',
				ORACLE_SERVICE_NAME: 'PROD',
				ORACLE_CONNECT_STRING: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=bannerprod.wpi.edu)(PORT=1527))(CONNECT_DATA=(SERVER=dedicated)(SERVICE_NAME=prod.admin.wpi.edu)))'
			},
			env_development: {
				NODE_ENV: 'development',
				BUILD_DB: 'false',
				IMPORT_DATA: 'false',
				SERVER_ROOT: 'https://sirloin.wpi.edu',
				SAML_URL: 'https://login.microsoftonline.com/589c76f5-ca15-41f9-884b-55ec15a0672a/federationmetadata/2007-06/federationmetadata.xml?appid=1d79636f-7ec3-4b46-839c-f7ca3c027e33',
				SAML_CALLBACK_URL: 'https://sirloin.wpi.edu/api/v1/saml/login/callback',
				SAML_ISSUER: 'https://sirloin.wpi.edu/api/v1/saml/service-provider-metadata',
				DB_USER: 'portalproxy',
				DB_PASSWORD: 'M3@t&Che3seZ',
				DB_URI_SCHEME: 'mariadb://',
				DB_HOST: 'localhost',
				DB_PORT: '3306',
				DB_NAME: 'itsportal',
				DB_TIMEZONE: 'America/New_York',
				ALGOLIA_INDEX: 'Portal_prod',
				AES_ENCRYPTION_KEY: 'nG#vf9H&m9VcA*w!t7DRXv7Zkp4Ks3k#',
				TZ: 'America/New_York',
				AZURE_OAUTH_CLIENT_ID: '6037adba-9e96-468f-a2a1-e7da31c7a7a1',
				AZURE_OAUTH_TENANT_ID: '589c76f5-ca15-41f9-884b-55ec15a0672a',
				AZURE_OAUTH_CLIENT_SECRET: 'jnUWHBKSDjRP4Q?3T@CKY=uLC2us3_Hh',
				AZURE_OAUTH_SCOPE: 'email offline_access openid profile Calendars.Read Contacts.Read Files.Read.All Mail.Read Sites.Read.All TeamsApp.ReadWrite',
				AZURE_OAUTH_CALLBACK_URL: 'https://sirloin.wpi.edu/api/v1/azure/oauth2/callback',
				CANVAS_OAUTH_CLIENT_ID: '77820000000000055',
				CANVAS_OAUTH_CLIENT_SECRET: 'fHdh1jCxSrtx9bITuhWO08RG3OqRtSv0wCbtkqnIFKMeX7hCt2AYZ6OY0JXs84Da',
				CANVAS_OAUTH_CALLBACK_URL: 'https://sirloin.wpi.edu/api/v1/canvas/oauth2/callback',
				ORACLE_USER: 'cherwell',
				ORACLE_PASS: 'jled876igEhjr3f4_74hnf',
				ORACLE_DBO_SCHEMA: 'WPIOBJ',
				ORACLE_SERVICE_NAME: 'PPRD',
				// ORACLE_CONNECT_STRING: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=bannerprod.wpi.edu)(PORT=1527))(CONNECT_DATA=(SERVER=dedicated)(SERVICE_NAME=prod.admin.wpi.edu)))'
				ORACLE_CONNECT_STRING: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=bannertest2.wpi.edu)(PORT=1527))(CONNECT_DATA=(SERVER=dedicated)(SERVICE_NAME=pprd.admin.wpi.edu)))'
			}
		}
	]
};

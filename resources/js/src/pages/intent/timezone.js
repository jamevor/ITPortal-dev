const timezones = [
    {
        "label": "Pacific/Niue (GMT-11:00)",
        "tzCode": "Pacific/Niue",
        "name": "(GMT-11:00) Niue",
        "utc": "-11:00"
    },
    {
        "label": "Pacific/Pago_Pago (GMT-11:00)",
        "tzCode": "Pacific/Pago_Pago",
        "name": "(GMT-11:00) Pago Pago",
        "utc": "-11:00"
    },
    {
        "label": "Pacific/Honolulu (GMT-10:00)",
        "tzCode": "Pacific/Honolulu",
        "name": "(GMT-10:00) Hawaii Time",
        "utc": "-10:00"
    },
    {
        "label": "Pacific/Rarotonga (GMT-10:00)",
        "tzCode": "Pacific/Rarotonga",
        "name": "(GMT-10:00) Rarotonga",
        "utc": "-10:00"
    },
    {
        "label": "Pacific/Tahiti (GMT-10:00)",
        "tzCode": "Pacific/Tahiti",
        "name": "(GMT-10:00) Tahiti",
        "utc": "-10:00"
    },
    {
        "label": "Pacific/Marquesas (GMT-09:30)",
        "tzCode": "Pacific/Marquesas",
        "name": "(GMT-09:30) Marquesas",
        "utc": "-09:30"
    },
    {
        "label": "America/Anchorage (GMT-09:00)",
        "tzCode": "America/Anchorage",
        "name": "(GMT-09:00) Alaska Time",
        "utc": "-09:00"
    },
    {
        "label": "Pacific/Gambier (GMT-09:00)",
        "tzCode": "Pacific/Gambier",
        "name": "(GMT-09:00) Gambier",
        "utc": "-09:00"
    },
    {
        "label": "America/Los_Angeles (GMT-08:00)",
        "tzCode": "America/Los_Angeles",
        "name": "(GMT-08:00) Pacific Time",
        "utc": "-08:00"
    },
    {
        "label": "America/Tijuana (GMT-08:00)",
        "tzCode": "America/Tijuana",
        "name": "(GMT-08:00) Pacific Time - Tijuana",
        "utc": "-08:00"
    },
    {
        "label": "America/Vancouver (GMT-08:00)",
        "tzCode": "America/Vancouver",
        "name": "(GMT-08:00) Pacific Time - Vancouver",
        "utc": "-08:00"
    },
    {
        "label": "America/Whitehorse (GMT-08:00)",
        "tzCode": "America/Whitehorse",
        "name": "(GMT-08:00) Pacific Time - Whitehorse",
        "utc": "-08:00"
    },
    {
        "label": "Pacific/Pitcairn (GMT-08:00)",
        "tzCode": "Pacific/Pitcairn",
        "name": "(GMT-08:00) Pitcairn",
        "utc": "-08:00"
    },
    {
        "label": "America/Dawson_Creek (GMT-07:00)",
        "tzCode": "America/Dawson_Creek",
        "name": "(GMT-07:00) Mountain Time - Dawson Creek",
        "utc": "-07:00"
    },
    {
        "label": "America/Denver (GMT-07:00)",
        "tzCode": "America/Denver",
        "name": "(GMT-07:00) Mountain Time",
        "utc": "-07:00"
    },
    {
        "label": "America/Edmonton (GMT-07:00)",
        "tzCode": "America/Edmonton",
        "name": "(GMT-07:00) Mountain Time - Edmonton",
        "utc": "-07:00"
    },
    {
        "label": "America/Hermosillo (GMT-07:00)",
        "tzCode": "America/Hermosillo",
        "name": "(GMT-07:00) Mountain Time - Hermosillo",
        "utc": "-07:00"
    },
    {
        "label": "America/Mazatlan (GMT-07:00)",
        "tzCode": "America/Mazatlan",
        "name": "(GMT-07:00) Mountain Time - Chihuahua, Mazatlan",
        "utc": "-07:00"
    },
    {
        "label": "America/Phoenix (GMT-07:00)",
        "tzCode": "America/Phoenix",
        "name": "(GMT-07:00) Mountain Time - Arizona",
        "utc": "-07:00"
    },
    {
        "label": "America/Yellowknife (GMT-07:00)",
        "tzCode": "America/Yellowknife",
        "name": "(GMT-07:00) Mountain Time - Yellowknife",
        "utc": "-07:00"
    },
    {
        "label": "America/Belize (GMT-06:00)",
        "tzCode": "America/Belize",
        "name": "(GMT-06:00) Belize",
        "utc": "-06:00"
    },
    {
        "label": "America/Chicago (GMT-06:00)",
        "tzCode": "America/Chicago",
        "name": "(GMT-06:00) Central Time",
        "utc": "-06:00"
    },
    {
        "label": "America/Costa_Rica (GMT-06:00)",
        "tzCode": "America/Costa_Rica",
        "name": "(GMT-06:00) Costa Rica",
        "utc": "-06:00"
    },
    {
        "label": "America/El_Salvador (GMT-06:00)",
        "tzCode": "America/El_Salvador",
        "name": "(GMT-06:00) El Salvador",
        "utc": "-06:00"
    },
    {
        "label": "America/Guatemala (GMT-06:00)",
        "tzCode": "America/Guatemala",
        "name": "(GMT-06:00) Guatemala",
        "utc": "-06:00"
    },
    {
        "label": "America/Managua (GMT-06:00)",
        "tzCode": "America/Managua",
        "name": "(GMT-06:00) Managua",
        "utc": "-06:00"
    },
    {
        "label": "America/Mexico_City (GMT-06:00)",
        "tzCode": "America/Mexico_City",
        "name": "(GMT-06:00) Central Time - Mexico City",
        "utc": "-06:00"
    },
    {
        "label": "America/Regina (GMT-06:00)",
        "tzCode": "America/Regina",
        "name": "(GMT-06:00) Central Time - Regina",
        "utc": "-06:00"
    },
    {
        "label": "America/Tegucigalpa (GMT-06:00)",
        "tzCode": "America/Tegucigalpa",
        "name": "(GMT-06:00) Central Time - Tegucigalpa",
        "utc": "-06:00"
    },
    {
        "label": "America/Winnipeg (GMT-06:00)",
        "tzCode": "America/Winnipeg",
        "name": "(GMT-06:00) Central Time - Winnipeg",
        "utc": "-06:00"
    },
    {
        "label": "Pacific/Galapagos (GMT-06:00)",
        "tzCode": "Pacific/Galapagos",
        "name": "(GMT-06:00) Galapagos",
        "utc": "-06:00"
    },
    {
        "label": "America/Bogota (GMT-05:00)",
        "tzCode": "America/Bogota",
        "name": "(GMT-05:00) Bogota",
        "utc": "-05:00"
    },
    {
        "label": "America/Cancun (GMT-05:00)",
        "tzCode": "America/Cancun",
        "name": "(GMT-05:00) America Cancun",
        "utc": "-05:00"
    },
    {
        "label": "America/Cayman (GMT-05:00)",
        "tzCode": "America/Cayman",
        "name": "(GMT-05:00) Cayman",
        "utc": "-05:00"
    },
    {
        "label": "America/Guayaquil (GMT-05:00)",
        "tzCode": "America/Guayaquil",
        "name": "(GMT-05:00) Guayaquil",
        "utc": "-05:00"
    },
    {
        "label": "America/Havana (GMT-05:00)",
        "tzCode": "America/Havana",
        "name": "(GMT-05:00) Havana",
        "utc": "-05:00"
    },
    {
        "label": "America/Iqaluit (GMT-05:00)",
        "tzCode": "America/Iqaluit",
        "name": "(GMT-05:00) Eastern Time - Iqaluit",
        "utc": "-05:00"
    },
    {
        "label": "America/Jamaica (GMT-05:00)",
        "tzCode": "America/Jamaica",
        "name": "(GMT-05:00) Jamaica",
        "utc": "-05:00"
    },
    {
        "label": "America/Lima (GMT-05:00)",
        "tzCode": "America/Lima",
        "name": "(GMT-05:00) Lima",
        "utc": "-05:00"
    },
    {
        "label": "America/Nassau (GMT-05:00)",
        "tzCode": "America/Nassau",
        "name": "(GMT-05:00) Nassau",
        "utc": "-05:00"
    },
    {
        "label": "America/New_York (GMT-05:00)",
        "tzCode": "America/New_York",
        "name": "(GMT-05:00) Eastern Time",
        "utc": "-05:00"
    },
    {
        "label": "America/Panama (GMT-05:00)",
        "tzCode": "America/Panama",
        "name": "(GMT-05:00) Panama",
        "utc": "-05:00"
    },
    {
        "label": "America/Port-au-Prince (GMT-05:00)",
        "tzCode": "America/Port-au-Prince",
        "name": "(GMT-05:00) Port-au-Prince",
        "utc": "-05:00"
    },
    {
        "label": "America/Rio_Branco (GMT-05:00)",
        "tzCode": "America/Rio_Branco",
        "name": "(GMT-05:00) Rio Branco",
        "utc": "-05:00"
    },
    {
        "label": "America/Toronto (GMT-05:00)",
        "tzCode": "America/Toronto",
        "name": "(GMT-05:00) Eastern Time - Toronto",
        "utc": "-05:00"
    },
    {
        "label": "Pacific/Easter (GMT-05:00)",
        "tzCode": "Pacific/Easter",
        "name": "(GMT-05:00) Easter Island",
        "utc": "-05:00"
    },
    {
        "label": "America/Caracas (GMT-04:30)",
        "tzCode": "America/Caracas",
        "name": "(GMT-04:30) Caracas",
        "utc": "-04:30"
    },
    {
        "label": "America/Asuncion (GMT-03:00)",
        "tzCode": "America/Asuncion",
        "name": "(GMT-03:00) Asuncion",
        "utc": "-03:00"
    },
    {
        "label": "America/Barbados (GMT-04:00)",
        "tzCode": "America/Barbados",
        "name": "(GMT-04:00) Barbados",
        "utc": "-04:00"
    },
    {
        "label": "America/Boa_Vista (GMT-04:00)",
        "tzCode": "America/Boa_Vista",
        "name": "(GMT-04:00) Boa Vista",
        "utc": "-04:00"
    },
    {
        "label": "America/Campo_Grande (GMT-03:00)",
        "tzCode": "America/Campo_Grande",
        "name": "(GMT-03:00) Campo Grande",
        "utc": "-03:00"
    },
    {
        "label": "America/Cuiaba (GMT-03:00)",
        "tzCode": "America/Cuiaba",
        "name": "(GMT-03:00) Cuiaba",
        "utc": "-03:00"
    },
    {
        "label": "America/Curacao (GMT-04:00)",
        "tzCode": "America/Curacao",
        "name": "(GMT-04:00) Curacao",
        "utc": "-04:00"
    },
    {
        "label": "America/Grand_Turk (GMT-04:00)",
        "tzCode": "America/Grand_Turk",
        "name": "(GMT-04:00) Grand Turk",
        "utc": "-04:00"
    },
    {
        "label": "America/Guyana (GMT-04:00)",
        "tzCode": "America/Guyana",
        "name": "(GMT-04:00) Guyana",
        "utc": "-04:00"
    },
    {
        "label": "America/Halifax (GMT-04:00)",
        "tzCode": "America/Halifax",
        "name": "(GMT-04:00) Atlantic Time - Halifax",
        "utc": "-04:00"
    },
    {
        "label": "America/La_Paz (GMT-04:00)",
        "tzCode": "America/La_Paz",
        "name": "(GMT-04:00) La Paz",
        "utc": "-04:00"
    },
    {
        "label": "America/Manaus (GMT-04:00)",
        "tzCode": "America/Manaus",
        "name": "(GMT-04:00) Manaus",
        "utc": "-04:00"
    },
    {
        "label": "America/Martinique (GMT-04:00)",
        "tzCode": "America/Martinique",
        "name": "(GMT-04:00) Martinique",
        "utc": "-04:00"
    },
    {
        "label": "America/Port_of_Spain (GMT-04:00)",
        "tzCode": "America/Port_of_Spain",
        "name": "(GMT-04:00) Port of Spain",
        "utc": "-04:00"
    },
    {
        "label": "America/Porto_Velho (GMT-04:00)",
        "tzCode": "America/Porto_Velho",
        "name": "(GMT-04:00) Porto Velho",
        "utc": "-04:00"
    },
    {
        "label": "America/Puerto_Rico (GMT-04:00)",
        "tzCode": "America/Puerto_Rico",
        "name": "(GMT-04:00) Puerto Rico",
        "utc": "-04:00"
    },
    {
        "label": "America/Santo_Domingo (GMT-04:00)",
        "tzCode": "America/Santo_Domingo",
        "name": "(GMT-04:00) Santo Domingo",
        "utc": "-04:00"
    },
    {
        "label": "America/Thule (GMT-04:00)",
        "tzCode": "America/Thule",
        "name": "(GMT-04:00) Thule",
        "utc": "-04:00"
    },
    {
        "label": "Atlantic/Bermuda (GMT-04:00)",
        "tzCode": "Atlantic/Bermuda",
        "name": "(GMT-04:00) Bermuda",
        "utc": "-04:00"
    },
    {
        "label": "America/St_Johns (GMT-03:30)",
        "tzCode": "America/St_Johns",
        "name": "(GMT-03:30) Newfoundland Time - St. Johns",
        "utc": "-03:30"
    },
    {
        "label": "America/Araguaina (GMT-03:00)",
        "tzCode": "America/Araguaina",
        "name": "(GMT-03:00) Araguaina",
        "utc": "-03:00"
    },
    {
        "label": "America/Argentina/Buenos_Aires (GMT-03:00)",
        "tzCode": "America/Argentina/Buenos_Aires",
        "name": "(GMT-03:00) Buenos Aires",
        "utc": "-03:00"
    },
    {
        "label": "America/Bahia (GMT-03:00)",
        "tzCode": "America/Bahia",
        "name": "(GMT-03:00) Salvador",
        "utc": "-03:00"
    },
    {
        "label": "America/Belem (GMT-03:00)",
        "tzCode": "America/Belem",
        "name": "(GMT-03:00) Belem",
        "utc": "-03:00"
    },
    {
        "label": "America/Cayenne (GMT-03:00)",
        "tzCode": "America/Cayenne",
        "name": "(GMT-03:00) Cayenne",
        "utc": "-03:00"
    },
    {
        "label": "America/Fortaleza (GMT-03:00)",
        "tzCode": "America/Fortaleza",
        "name": "(GMT-03:00) Fortaleza",
        "utc": "-03:00"
    },
    {
        "label": "America/Godthab (GMT-03:00)",
        "tzCode": "America/Godthab",
        "name": "(GMT-03:00) Godthab",
        "utc": "-03:00"
    },
    {
        "label": "America/Maceio (GMT-03:00)",
        "tzCode": "America/Maceio",
        "name": "(GMT-03:00) Maceio",
        "utc": "-03:00"
    },
    {
        "label": "America/Miquelon (GMT-03:00)",
        "tzCode": "America/Miquelon",
        "name": "(GMT-03:00) Miquelon",
        "utc": "-03:00"
    },
    {
        "label": "America/Montevideo (GMT-03:00)",
        "tzCode": "America/Montevideo",
        "name": "(GMT-03:00) Montevideo",
        "utc": "-03:00"
    },
    {
        "label": "America/Paramaribo (GMT-03:00)",
        "tzCode": "America/Paramaribo",
        "name": "(GMT-03:00) Paramaribo",
        "utc": "-03:00"
    },
    {
        "label": "America/Recife (GMT-03:00)",
        "tzCode": "America/Recife",
        "name": "(GMT-03:00) Recife",
        "utc": "-03:00"
    },
    {
        "label": "America/Santiago (GMT-03:00)",
        "tzCode": "America/Santiago",
        "name": "(GMT-03:00) Santiago",
        "utc": "-03:00"
    },
    {
        "label": "America/Sao_Paulo (GMT-02:00)",
        "tzCode": "America/Sao_Paulo",
        "name": "(GMT-02:00) Sao Paulo",
        "utc": "-02:00"
    },
    {
        "label": "Antarctica/Palmer (GMT-03:00)",
        "tzCode": "Antarctica/Palmer",
        "name": "(GMT-03:00) Palmer",
        "utc": "-03:00"
    },
    {
        "label": "Antarctica/Rothera (GMT-03:00)",
        "tzCode": "Antarctica/Rothera",
        "name": "(GMT-03:00) Rothera",
        "utc": "-03:00"
    },
    {
        "label": "Atlantic/Stanley (GMT-03:00)",
        "tzCode": "Atlantic/Stanley",
        "name": "(GMT-03:00) Stanley",
        "utc": "-03:00"
    },
    {
        "label": "America/Noronha (GMT-02:00)",
        "tzCode": "America/Noronha",
        "name": "(GMT-02:00) Noronha",
        "utc": "-02:00"
    },
    {
        "label": "Atlantic/South_Georgia (GMT-02:00)",
        "tzCode": "Atlantic/South_Georgia",
        "name": "(GMT-02:00) South Georgia",
        "utc": "-02:00"
    },
    {
        "label": "America/Scoresbysund (GMT-01:00)",
        "tzCode": "America/Scoresbysund",
        "name": "(GMT-01:00) Scoresbysund",
        "utc": "-01:00"
    },
    {
        "label": "Atlantic/Azores (GMT-01:00)",
        "tzCode": "Atlantic/Azores",
        "name": "(GMT-01:00) Azores",
        "utc": "-01:00"
    },
    {
        "label": "Atlantic/Cape_Verde (GMT-01:00)",
        "tzCode": "Atlantic/Cape_Verde",
        "name": "(GMT-01:00) Cape Verde",
        "utc": "-01:00"
    },
    {
        "label": "Africa/Abidjan (GMT+00:00)",
        "tzCode": "Africa/Abidjan",
        "name": "(GMT+00:00) Abidjan",
        "utc": "+00:00"
    },
    {
        "label": "Africa/Accra (GMT+00:00)",
        "tzCode": "Africa/Accra",
        "name": "(GMT+00:00) Accra",
        "utc": "+00:00"
    },
    {
        "label": "Africa/Bissau (GMT+00:00)",
        "tzCode": "Africa/Bissau",
        "name": "(GMT+00:00) Bissau",
        "utc": "+00:00"
    },
    {
        "label": "Africa/Casablanca (GMT+00:00)",
        "tzCode": "Africa/Casablanca",
        "name": "(GMT+00:00) Casablanca",
        "utc": "+00:00"
    },
    {
        "label": "Africa/El_Aaiun (GMT+00:00)",
        "tzCode": "Africa/El_Aaiun",
        "name": "(GMT+00:00) El Aaiun",
        "utc": "+00:00"
    },
    {
        "label": "Africa/Monrovia (GMT+00:00)",
        "tzCode": "Africa/Monrovia",
        "name": "(GMT+00:00) Monrovia",
        "utc": "+00:00"
    },
    {
        "label": "America/Danmarkshavn (GMT+00:00)",
        "tzCode": "America/Danmarkshavn",
        "name": "(GMT+00:00) Danmarkshavn",
        "utc": "+00:00"
    },
    {
        "label": "Atlantic/Canary (GMT+00:00)",
        "tzCode": "Atlantic/Canary",
        "name": "(GMT+00:00) Canary Islands",
        "utc": "+00:00"
    },
    {
        "label": "Atlantic/Faroe (GMT+00:00)",
        "tzCode": "Atlantic/Faroe",
        "name": "(GMT+00:00) Faeroe",
        "utc": "+00:00"
    },
    {
        "label": "Atlantic/Reykjavik (GMT+00:00)",
        "tzCode": "Atlantic/Reykjavik",
        "name": "(GMT+00:00) Reykjavik",
        "utc": "+00:00"
    },
    {
        "label": "Etc/GMT (GMT+00:00)",
        "tzCode": "Etc/GMT",
        "name": "(GMT+00:00) GMT (no daylight saving)",
        "utc": "+00:00"
    },
    {
        "label": "Europe/Dublin (GMT+00:00)",
        "tzCode": "Europe/Dublin",
        "name": "(GMT+00:00) Dublin",
        "utc": "+00:00"
    },
    {
        "label": "Europe/Lisbon (GMT+00:00)",
        "tzCode": "Europe/Lisbon",
        "name": "(GMT+00:00) Lisbon",
        "utc": "+00:00"
    },
    {
        "label": "Europe/London (GMT+00:00)",
        "tzCode": "Europe/London",
        "name": "(GMT+00:00) London",
        "utc": "+00:00"
    },
    {
        "label": "Africa/Algiers (GMT+01:00)",
        "tzCode": "Africa/Algiers",
        "name": "(GMT+01:00) Algiers",
        "utc": "+01:00"
    },
    {
        "label": "Africa/Ceuta (GMT+01:00)",
        "tzCode": "Africa/Ceuta",
        "name": "(GMT+01:00) Ceuta",
        "utc": "+01:00"
    },
    {
        "label": "Africa/Lagos (GMT+01:00)",
        "tzCode": "Africa/Lagos",
        "name": "(GMT+01:00) Lagos",
        "utc": "+01:00"
    },
    {
        "label": "Africa/Ndjamena (GMT+01:00)",
        "tzCode": "Africa/Ndjamena",
        "name": "(GMT+01:00) Ndjamena",
        "utc": "+01:00"
    },
    {
        "label": "Africa/Tunis (GMT+01:00)",
        "tzCode": "Africa/Tunis",
        "name": "(GMT+01:00) Tunis",
        "utc": "+01:00"
    },
    {
        "label": "Africa/Windhoek (GMT+02:00)",
        "tzCode": "Africa/Windhoek",
        "name": "(GMT+02:00) Windhoek",
        "utc": "+02:00"
    },
    {
        "label": "Europe/Amsterdam (GMT+01:00)",
        "tzCode": "Europe/Amsterdam",
        "name": "(GMT+01:00) Amsterdam",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Andorra (GMT+01:00)",
        "tzCode": "Europe/Andorra",
        "name": "(GMT+01:00) Andorra",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Belgrade (GMT+01:00)",
        "tzCode": "Europe/Belgrade",
        "name": "(GMT+01:00) Central European Time - Belgrade",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Berlin (GMT+01:00)",
        "tzCode": "Europe/Berlin",
        "name": "(GMT+01:00) Berlin",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Brussels (GMT+01:00)",
        "tzCode": "Europe/Brussels",
        "name": "(GMT+01:00) Brussels",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Budapest (GMT+01:00)",
        "tzCode": "Europe/Budapest",
        "name": "(GMT+01:00) Budapest",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Copenhagen (GMT+01:00)",
        "tzCode": "Europe/Copenhagen",
        "name": "(GMT+01:00) Copenhagen",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Gibraltar (GMT+01:00)",
        "tzCode": "Europe/Gibraltar",
        "name": "(GMT+01:00) Gibraltar",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Luxembourg (GMT+01:00)",
        "tzCode": "Europe/Luxembourg",
        "name": "(GMT+01:00) Luxembourg",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Madrid (GMT+01:00)",
        "tzCode": "Europe/Madrid",
        "name": "(GMT+01:00) Madrid",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Malta (GMT+01:00)",
        "tzCode": "Europe/Malta",
        "name": "(GMT+01:00) Malta",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Monaco (GMT+01:00)",
        "tzCode": "Europe/Monaco",
        "name": "(GMT+01:00) Monaco",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Oslo (GMT+01:00)",
        "tzCode": "Europe/Oslo",
        "name": "(GMT+01:00) Oslo",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Paris (GMT+01:00)",
        "tzCode": "Europe/Paris",
        "name": "(GMT+01:00) Paris",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Prague (GMT+01:00)",
        "tzCode": "Europe/Prague",
        "name": "(GMT+01:00) Central European Time - Prague",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Rome (GMT+01:00)",
        "tzCode": "Europe/Rome",
        "name": "(GMT+01:00) Rome",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Stockholm (GMT+01:00)",
        "tzCode": "Europe/Stockholm",
        "name": "(GMT+01:00) Stockholm",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Tirane (GMT+01:00)",
        "tzCode": "Europe/Tirane",
        "name": "(GMT+01:00) Tirane",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Vienna (GMT+01:00)",
        "tzCode": "Europe/Vienna",
        "name": "(GMT+01:00) Vienna",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Warsaw (GMT+01:00)",
        "tzCode": "Europe/Warsaw",
        "name": "(GMT+01:00) Warsaw",
        "utc": "+01:00"
    },
    {
        "label": "Europe/Zurich (GMT+01:00)",
        "tzCode": "Europe/Zurich",
        "name": "(GMT+01:00) Zurich",
        "utc": "+01:00"
    },
    {
        "label": "Africa/Cairo (GMT+02:00)",
        "tzCode": "Africa/Cairo",
        "name": "(GMT+02:00) Cairo",
        "utc": "+02:00"
    },
    {
        "label": "Africa/Johannesburg (GMT+02:00)",
        "tzCode": "Africa/Johannesburg",
        "name": "(GMT+02:00) Johannesburg",
        "utc": "+02:00"
    },
    {
        "label": "Africa/Maputo (GMT+02:00)",
        "tzCode": "Africa/Maputo",
        "name": "(GMT+02:00) Maputo",
        "utc": "+02:00"
    },
    {
        "label": "Africa/Tripoli (GMT+02:00)",
        "tzCode": "Africa/Tripoli",
        "name": "(GMT+02:00) Tripoli",
        "utc": "+02:00"
    },
    {
        "label": "Asia/Amman (GMT+02:00)",
        "tzCode": "Asia/Amman",
        "name": "(GMT+02:00) Amman",
        "utc": "+02:00"
    },
    {
        "label": "Asia/Beirut (GMT+02:00)",
        "tzCode": "Asia/Beirut",
        "name": "(GMT+02:00) Beirut",
        "utc": "+02:00"
    },
    {
        "label": "Asia/Damascus (GMT+02:00)",
        "tzCode": "Asia/Damascus",
        "name": "(GMT+02:00) Damascus",
        "utc": "+02:00"
    },
    {
        "label": "Asia/Gaza (GMT+02:00)",
        "tzCode": "Asia/Gaza",
        "name": "(GMT+02:00) Gaza",
        "utc": "+02:00"
    },
    {
        "label": "Asia/Jerusalem (GMT+02:00)",
        "tzCode": "Asia/Jerusalem",
        "name": "(GMT+02:00) Jerusalem",
        "utc": "+02:00"
    },
    {
        "label": "Asia/Nicosia (GMT+02:00)",
        "tzCode": "Asia/Nicosia",
        "name": "(GMT+02:00) Nicosia",
        "utc": "+02:00"
    },
    {
        "label": "Europe/Athens (GMT+02:00)",
        "tzCode": "Europe/Athens",
        "name": "(GMT+02:00) Athens",
        "utc": "+02:00"
    },
    {
        "label": "Europe/Bucharest (GMT+02:00)",
        "tzCode": "Europe/Bucharest",
        "name": "(GMT+02:00) Bucharest",
        "utc": "+02:00"
    },
    {
        "label": "Europe/Chisinau (GMT+02:00)",
        "tzCode": "Europe/Chisinau",
        "name": "(GMT+02:00) Chisinau",
        "utc": "+02:00"
    },
    {
        "label": "Europe/Helsinki (GMT+02:00)",
        "tzCode": "Europe/Helsinki",
        "name": "(GMT+02:00) Helsinki",
        "utc": "+02:00"
    },
    {
        "label": "Europe/Istanbul (GMT+02:00)",
        "tzCode": "Europe/Istanbul",
        "name": "(GMT+02:00) Istanbul",
        "utc": "+02:00"
    },
    {
        "label": "Europe/Kaliningrad (GMT+02:00)",
        "tzCode": "Europe/Kaliningrad",
        "name": "(GMT+02:00) Moscow-01 - Kaliningrad",
        "utc": "+02:00"
    },
    {
        "label": "Europe/Kiev (GMT+02:00)",
        "tzCode": "Europe/Kiev",
        "name": "(GMT+02:00) Kiev",
        "utc": "+02:00"
    },
    {
        "label": "Europe/Riga (GMT+02:00)",
        "tzCode": "Europe/Riga",
        "name": "(GMT+02:00) Riga",
        "utc": "+02:00"
    },
    {
        "label": "Europe/Sofia (GMT+02:00)",
        "tzCode": "Europe/Sofia",
        "name": "(GMT+02:00) Sofia",
        "utc": "+02:00"
    },
    {
        "label": "Europe/Tallinn (GMT+02:00)",
        "tzCode": "Europe/Tallinn",
        "name": "(GMT+02:00) Tallinn",
        "utc": "+02:00"
    },
    {
        "label": "Europe/Vilnius (GMT+02:00)",
        "tzCode": "Europe/Vilnius",
        "name": "(GMT+02:00) Vilnius",
        "utc": "+02:00"
    },
    {
        "label": "Africa/Khartoum (GMT+03:00)",
        "tzCode": "Africa/Khartoum",
        "name": "(GMT+03:00) Khartoum",
        "utc": "+03:00"
    },
    {
        "label": "Africa/Nairobi (GMT+03:00)",
        "tzCode": "Africa/Nairobi",
        "name": "(GMT+03:00) Nairobi",
        "utc": "+03:00"
    },
    {
        "label": "Antarctica/Syowa (GMT+03:00)",
        "tzCode": "Antarctica/Syowa",
        "name": "(GMT+03:00) Syowa",
        "utc": "+03:00"
    },
    {
        "label": "Asia/Baghdad (GMT+03:00)",
        "tzCode": "Asia/Baghdad",
        "name": "(GMT+03:00) Baghdad",
        "utc": "+03:00"
    },
    {
        "label": "Asia/Qatar (GMT+03:00)",
        "tzCode": "Asia/Qatar",
        "name": "(GMT+03:00) Qatar",
        "utc": "+03:00"
    },
    {
        "label": "Asia/Riyadh (GMT+03:00)",
        "tzCode": "Asia/Riyadh",
        "name": "(GMT+03:00) Riyadh",
        "utc": "+03:00"
    },
    {
        "label": "Europe/Minsk (GMT+03:00)",
        "tzCode": "Europe/Minsk",
        "name": "(GMT+03:00) Minsk",
        "utc": "+03:00"
    },
    {
        "label": "Europe/Moscow (GMT+03:00)",
        "tzCode": "Europe/Moscow",
        "name": "(GMT+03:00) Moscow+00 - Moscow",
        "utc": "+03:00"
    },
    {
        "label": "Asia/Tehran (GMT+03:30)",
        "tzCode": "Asia/Tehran",
        "name": "(GMT+03:30) Tehran",
        "utc": "+03:30"
    },
    {
        "label": "Asia/Baku (GMT+04:00)",
        "tzCode": "Asia/Baku",
        "name": "(GMT+04:00) Baku",
        "utc": "+04:00"
    },
    {
        "label": "Asia/Dubai (GMT+04:00)",
        "tzCode": "Asia/Dubai",
        "name": "(GMT+04:00) Dubai",
        "utc": "+04:00"
    },
    {
        "label": "Asia/Tbilisi (GMT+04:00)",
        "tzCode": "Asia/Tbilisi",
        "name": "(GMT+04:00) Tbilisi",
        "utc": "+04:00"
    },
    {
        "label": "Asia/Yerevan (GMT+04:00)",
        "tzCode": "Asia/Yerevan",
        "name": "(GMT+04:00) Yerevan",
        "utc": "+04:00"
    },
    {
        "label": "Europe/Samara (GMT+04:00)",
        "tzCode": "Europe/Samara",
        "name": "(GMT+04:00) Moscow+01 - Samara",
        "utc": "+04:00"
    },
    {
        "label": "Indian/Mahe (GMT+04:00)",
        "tzCode": "Indian/Mahe",
        "name": "(GMT+04:00) Mahe",
        "utc": "+04:00"
    },
    {
        "label": "Indian/Mauritius (GMT+04:00)",
        "tzCode": "Indian/Mauritius",
        "name": "(GMT+04:00) Mauritius",
        "utc": "+04:00"
    },
    {
        "label": "Indian/Reunion (GMT+04:00)",
        "tzCode": "Indian/Reunion",
        "name": "(GMT+04:00) Reunion",
        "utc": "+04:00"
    },
    {
        "label": "Asia/Kabul (GMT+04:30)",
        "tzCode": "Asia/Kabul",
        "name": "(GMT+04:30) Kabul",
        "utc": "+04:30"
    },
    {
        "label": "Antarctica/Mawson (GMT+05:00)",
        "tzCode": "Antarctica/Mawson",
        "name": "(GMT+05:00) Mawson",
        "utc": "+05:00"
    },
    {
        "label": "Asia/Aqtau (GMT+05:00)",
        "tzCode": "Asia/Aqtau",
        "name": "(GMT+05:00) Aqtau",
        "utc": "+05:00"
    },
    {
        "label": "Asia/Aqtobe (GMT+05:00)",
        "tzCode": "Asia/Aqtobe",
        "name": "(GMT+05:00) Aqtobe",
        "utc": "+05:00"
    },
    {
        "label": "Asia/Ashgabat (GMT+05:00)",
        "tzCode": "Asia/Ashgabat",
        "name": "(GMT+05:00) Ashgabat",
        "utc": "+05:00"
    },
    {
        "label": "Asia/Dushanbe (GMT+05:00)",
        "tzCode": "Asia/Dushanbe",
        "name": "(GMT+05:00) Dushanbe",
        "utc": "+05:00"
    },
    {
        "label": "Asia/Karachi (GMT+05:00)",
        "tzCode": "Asia/Karachi",
        "name": "(GMT+05:00) Karachi",
        "utc": "+05:00"
    },
    {
        "label": "Asia/Tashkent (GMT+05:00)",
        "tzCode": "Asia/Tashkent",
        "name": "(GMT+05:00) Tashkent",
        "utc": "+05:00"
    },
    {
        "label": "Asia/Yekaterinburg (GMT+05:00)",
        "tzCode": "Asia/Yekaterinburg",
        "name": "(GMT+05:00) Moscow+02 - Yekaterinburg",
        "utc": "+05:00"
    },
    {
        "label": "Indian/Kerguelen (GMT+05:00)",
        "tzCode": "Indian/Kerguelen",
        "name": "(GMT+05:00) Kerguelen",
        "utc": "+05:00"
    },
    {
        "label": "Indian/Maldives (GMT+05:00)",
        "tzCode": "Indian/Maldives",
        "name": "(GMT+05:00) Maldives",
        "utc": "+05:00"
    },
    {
        "label": "Asia/Calcutta (GMT+05:30)",
        "tzCode": "Asia/Calcutta",
        "name": "(GMT+05:30) India Standard Time",
        "utc": "+05:30"
    },
    {
        "label": "Asia/Colombo (GMT+05:30)",
        "tzCode": "Asia/Colombo",
        "name": "(GMT+05:30) Colombo",
        "utc": "+05:30"
    },
    {
        "label": "Asia/Katmandu (GMT+05:45)",
        "tzCode": "Asia/Katmandu",
        "name": "(GMT+05:45) Katmandu",
        "utc": "+05:45"
    },
    {
        "label": "Antarctica/Vostok (GMT+06:00)",
        "tzCode": "Antarctica/Vostok",
        "name": "(GMT+06:00) Vostok",
        "utc": "+06:00"
    },
    {
        "label": "Asia/Almaty (GMT+06:00)",
        "tzCode": "Asia/Almaty",
        "name": "(GMT+06:00) Almaty",
        "utc": "+06:00"
    },
    {
        "label": "Asia/Bishkek (GMT+06:00)",
        "tzCode": "Asia/Bishkek",
        "name": "(GMT+06:00) Bishkek",
        "utc": "+06:00"
    },
    {
        "label": "Asia/Dhaka (GMT+06:00)",
        "tzCode": "Asia/Dhaka",
        "name": "(GMT+06:00) Dhaka",
        "utc": "+06:00"
    },
    {
        "label": "Asia/Omsk (GMT+06:00)",
        "tzCode": "Asia/Omsk",
        "name": "(GMT+06:00) Moscow+03 - Omsk, Novosibirsk",
        "utc": "+06:00"
    },
    {
        "label": "Asia/Thimphu (GMT+06:00)",
        "tzCode": "Asia/Thimphu",
        "name": "(GMT+06:00) Thimphu",
        "utc": "+06:00"
    },
    {
        "label": "Indian/Chagos (GMT+06:00)",
        "tzCode": "Indian/Chagos",
        "name": "(GMT+06:00) Chagos",
        "utc": "+06:00"
    },
    {
        "label": "Asia/Rangoon (GMT+06:30)",
        "tzCode": "Asia/Rangoon",
        "name": "(GMT+06:30) Rangoon",
        "utc": "+06:30"
    },
    {
        "label": "Indian/Cocos (GMT+06:30)",
        "tzCode": "Indian/Cocos",
        "name": "(GMT+06:30) Cocos",
        "utc": "+06:30"
    },
    {
        "label": "Antarctica/Davis (GMT+07:00)",
        "tzCode": "Antarctica/Davis",
        "name": "(GMT+07:00) Davis",
        "utc": "+07:00"
    },
    {
        "label": "Asia/Bangkok (GMT+07:00)",
        "tzCode": "Asia/Bangkok",
        "name": "(GMT+07:00) Bangkok",
        "utc": "+07:00"
    },
    {
        "label": "Asia/Hovd (GMT+07:00)",
        "tzCode": "Asia/Hovd",
        "name": "(GMT+07:00) Hovd",
        "utc": "+07:00"
    },
    {
        "label": "Asia/Jakarta (GMT+07:00)",
        "tzCode": "Asia/Jakarta",
        "name": "(GMT+07:00) Jakarta",
        "utc": "+07:00"
    },
    {
        "label": "Asia/Krasnoyarsk (GMT+07:00)",
        "tzCode": "Asia/Krasnoyarsk",
        "name": "(GMT+07:00) Moscow+04 - Krasnoyarsk",
        "utc": "+07:00"
    },
    {
        "label": "Asia/Saigon (GMT+07:00)",
        "tzCode": "Asia/Saigon",
        "name": "(GMT+07:00) Hanoi",
        "utc": "+07:00"
    },
    {
        "label": "Asia/Ho_Chi_Minh (GMT+07:00)",
        "tzCode": "Asia/Ho_Chi_Minh",
        "name": "(GMT+07:00) Ho Chi Minh",
        "utc": "+07:00"
    },
    {
        "label": "Indian/Christmas (GMT+07:00)",
        "tzCode": "Indian/Christmas",
        "name": "(GMT+07:00) Christmas",
        "utc": "+07:00"
    },
    {
        "label": "Antarctica/Casey (GMT+08:00)",
        "tzCode": "Antarctica/Casey",
        "name": "(GMT+08:00) Casey",
        "utc": "+08:00"
    },
    {
        "label": "Asia/Brunei (GMT+08:00)",
        "tzCode": "Asia/Brunei",
        "name": "(GMT+08:00) Brunei",
        "utc": "+08:00"
    },
    {
        "label": "Asia/Choibalsan (GMT+08:00)",
        "tzCode": "Asia/Choibalsan",
        "name": "(GMT+08:00) Choibalsan",
        "utc": "+08:00"
    },
    {
        "label": "Asia/Hong_Kong (GMT+08:00)",
        "tzCode": "Asia/Hong_Kong",
        "name": "(GMT+08:00) Hong Kong",
        "utc": "+08:00"
    },
    {
        "label": "Asia/Irkutsk (GMT+08:00)",
        "tzCode": "Asia/Irkutsk",
        "name": "(GMT+08:00) Moscow+05 - Irkutsk",
        "utc": "+08:00"
    },
    {
        "label": "Asia/Kuala_Lumpur (GMT+08:00)",
        "tzCode": "Asia/Kuala_Lumpur",
        "name": "(GMT+08:00) Kuala Lumpur",
        "utc": "+08:00"
    },
    {
        "label": "Asia/Macau (GMT+08:00)",
        "tzCode": "Asia/Macau",
        "name": "(GMT+08:00) Macau",
        "utc": "+08:00"
    },
    {
        "label": "Asia/Makassar (GMT+08:00)",
        "tzCode": "Asia/Makassar",
        "name": "(GMT+08:00) Makassar",
        "utc": "+08:00"
    },
    {
        "label": "Asia/Manila (GMT+08:00)",
        "tzCode": "Asia/Manila",
        "name": "(GMT+08:00) Manila",
        "utc": "+08:00"
    },
    {
        "label": "Asia/Shanghai (GMT+08:00)",
        "tzCode": "Asia/Shanghai",
        "name": "(GMT+08:00) China Time - Beijing",
        "utc": "+08:00"
    },
    {
        "label": "Asia/Singapore (GMT+08:00)",
        "tzCode": "Asia/Singapore",
        "name": "(GMT+08:00) Singapore",
        "utc": "+08:00"
    },
    {
        "label": "Asia/Taipei (GMT+08:00)",
        "tzCode": "Asia/Taipei",
        "name": "(GMT+08:00) Taipei",
        "utc": "+08:00"
    },
    {
        "label": "Asia/Ulaanbaatar (GMT+08:00)",
        "tzCode": "Asia/Ulaanbaatar",
        "name": "(GMT+08:00) Ulaanbaatar",
        "utc": "+08:00"
    },
    {
        "label": "Australia/Perth (GMT+08:00)",
        "tzCode": "Australia/Perth",
        "name": "(GMT+08:00) Western Time - Perth",
        "utc": "+08:00"
    },
    {
        "label": "Asia/Pyongyang (GMT+08:30)",
        "tzCode": "Asia/Pyongyang",
        "name": "(GMT+08:30) Pyongyang",
        "utc": "+08:30"
    },
    {
        "label": "Asia/Dili (GMT+09:00)",
        "tzCode": "Asia/Dili",
        "name": "(GMT+09:00) Dili",
        "utc": "+09:00"
    },
    {
        "label": "Asia/Jayapura (GMT+09:00)",
        "tzCode": "Asia/Jayapura",
        "name": "(GMT+09:00) Jayapura",
        "utc": "+09:00"
    },
    {
        "label": "Asia/Seoul (GMT+09:00)",
        "tzCode": "Asia/Seoul",
        "name": "(GMT+09:00) Seoul",
        "utc": "+09:00"
    },
    {
        "label": "Asia/Tokyo (GMT+09:00)",
        "tzCode": "Asia/Tokyo",
        "name": "(GMT+09:00) Tokyo",
        "utc": "+09:00"
    },
    {
        "label": "Asia/Yakutsk (GMT+09:00)",
        "tzCode": "Asia/Yakutsk",
        "name": "(GMT+09:00) Moscow+06 - Yakutsk",
        "utc": "+09:00"
    },
    {
        "label": "Pacific/Palau (GMT+09:00)",
        "tzCode": "Pacific/Palau",
        "name": "(GMT+09:00) Palau",
        "utc": "+09:00"
    },
    {
        "label": "Australia/Adelaide (GMT+10:30)",
        "tzCode": "Australia/Adelaide",
        "name": "(GMT+10:30) Central Time - Adelaide",
        "utc": "+10:30"
    },
    {
        "label": "Australia/Darwin (GMT+09:30)",
        "tzCode": "Australia/Darwin",
        "name": "(GMT+09:30) Central Time - Darwin",
        "utc": "+09:30"
    },
    {
        "label": "Antarctica/DumontDUrville (GMT+10:00)",
        "tzCode": "Antarctica/DumontDUrville",
        "name": "(GMT+10:00) Dumont D'Urville",
        "utc": "+10:00"
    },
    {
        "label": "Asia/Magadan (GMT+10:00)",
        "tzCode": "Asia/Magadan",
        "name": "(GMT+10:00) Moscow+07 - Magadan",
        "utc": "+10:00"
    },
    {
        "label": "Asia/Vladivostok (GMT+10:00)",
        "tzCode": "Asia/Vladivostok",
        "name": "(GMT+10:00) Moscow+07 - Yuzhno-Sakhalinsk",
        "utc": "+10:00"
    },
    {
        "label": "Australia/Brisbane (GMT+10:00)",
        "tzCode": "Australia/Brisbane",
        "name": "(GMT+10:00) Eastern Time - Brisbane",
        "utc": "+10:00"
    },
    {
        "label": "Australia/Hobart (GMT+11:00)",
        "tzCode": "Australia/Hobart",
        "name": "(GMT+11:00) Eastern Time - Hobart",
        "utc": "+11:00"
    },
    {
        "label": "Australia/Sydney (GMT+11:00)",
        "tzCode": "Australia/Sydney",
        "name": "(GMT+11:00) Eastern Time - Melbourne, Sydney",
        "utc": "+11:00"
    },
    {
        "label": "Pacific/Chuuk (GMT+10:00)",
        "tzCode": "Pacific/Chuuk",
        "name": "(GMT+10:00) Truk",
        "utc": "+10:00"
    },
    {
        "label": "Pacific/Guam (GMT+10:00)",
        "tzCode": "Pacific/Guam",
        "name": "(GMT+10:00) Guam",
        "utc": "+10:00"
    },
    {
        "label": "Pacific/Port_Moresby (GMT+10:00)",
        "tzCode": "Pacific/Port_Moresby",
        "name": "(GMT+10:00) Port Moresby",
        "utc": "+10:00"
    },
    {
        "label": "Pacific/Efate (GMT+11:00)",
        "tzCode": "Pacific/Efate",
        "name": "(GMT+11:00) Efate",
        "utc": "+11:00"
    },
    {
        "label": "Pacific/Guadalcanal (GMT+11:00)",
        "tzCode": "Pacific/Guadalcanal",
        "name": "(GMT+11:00) Guadalcanal",
        "utc": "+11:00"
    },
    {
        "label": "Pacific/Kosrae (GMT+11:00)",
        "tzCode": "Pacific/Kosrae",
        "name": "(GMT+11:00) Kosrae",
        "utc": "+11:00"
    },
    {
        "label": "Pacific/Norfolk (GMT+11:00)",
        "tzCode": "Pacific/Norfolk",
        "name": "(GMT+11:00) Norfolk",
        "utc": "+11:00"
    },
    {
        "label": "Pacific/Noumea (GMT+11:00)",
        "tzCode": "Pacific/Noumea",
        "name": "(GMT+11:00) Noumea",
        "utc": "+11:00"
    },
    {
        "label": "Pacific/Pohnpei (GMT+11:00)",
        "tzCode": "Pacific/Pohnpei",
        "name": "(GMT+11:00) Ponape",
        "utc": "+11:00"
    },
    {
        "label": "Asia/Kamchatka (GMT+12:00)",
        "tzCode": "Asia/Kamchatka",
        "name": "(GMT+12:00) Moscow+09 - Petropavlovsk-Kamchatskiy",
        "utc": "+12:00"
    },
    {
        "label": "Pacific/Auckland (GMT+13:00)",
        "tzCode": "Pacific/Auckland",
        "name": "(GMT+13:00) Auckland",
        "utc": "+13:00"
    },
    {
        "label": "Pacific/Fiji (GMT+13:00)",
        "tzCode": "Pacific/Fiji",
        "name": "(GMT+13:00) Fiji",
        "utc": "+13:00"
    },
    {
        "label": "Pacific/Funafuti (GMT+12:00)",
        "tzCode": "Pacific/Funafuti",
        "name": "(GMT+12:00) Funafuti",
        "utc": "+12:00"
    },
    {
        "label": "Pacific/Kwajalein (GMT+12:00)",
        "tzCode": "Pacific/Kwajalein",
        "name": "(GMT+12:00) Kwajalein",
        "utc": "+12:00"
    },
    {
        "label": "Pacific/Majuro (GMT+12:00)",
        "tzCode": "Pacific/Majuro",
        "name": "(GMT+12:00) Majuro",
        "utc": "+12:00"
    },
    {
        "label": "Pacific/Nauru (GMT+12:00)",
        "tzCode": "Pacific/Nauru",
        "name": "(GMT+12:00) Nauru",
        "utc": "+12:00"
    },
    {
        "label": "Pacific/Tarawa (GMT+12:00)",
        "tzCode": "Pacific/Tarawa",
        "name": "(GMT+12:00) Tarawa",
        "utc": "+12:00"
    },
    {
        "label": "Pacific/Wake (GMT+12:00)",
        "tzCode": "Pacific/Wake",
        "name": "(GMT+12:00) Wake",
        "utc": "+12:00"
    },
    {
        "label": "Pacific/Wallis (GMT+12:00)",
        "tzCode": "Pacific/Wallis",
        "name": "(GMT+12:00) Wallis",
        "utc": "+12:00"
    },
    {
        "label": "Pacific/Apia (GMT+14:00)",
        "tzCode": "Pacific/Apia",
        "name": "(GMT+14:00) Apia",
        "utc": "+14:00"
    },
    {
        "label": "Pacific/Enderbury (GMT+13:00)",
        "tzCode": "Pacific/Enderbury",
        "name": "(GMT+13:00) Enderbury",
        "utc": "+13:00"
    },
    {
        "label": "Pacific/Fakaofo (GMT+13:00)",
        "tzCode": "Pacific/Fakaofo",
        "name": "(GMT+13:00) Fakaofo",
        "utc": "+13:00"
    },
    {
        "label": "Pacific/Tongatapu (GMT+13:00)",
        "tzCode": "Pacific/Tongatapu",
        "name": "(GMT+13:00) Tongatapu",
        "utc": "+13:00"
    },
    {
        "label": "Pacific/Kiritimati (GMT+14:00)",
        "tzCode": "Pacific/Kiritimati",
        "name": "(GMT+14:00) Kiritimati",
        "utc": "+14:00"
    }
]
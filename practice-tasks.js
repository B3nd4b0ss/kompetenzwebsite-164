const ERD_SHOP = {
	type: 'svg',
	src: './data/shop_erd.svg',
	caption: 'ERD für einen kleinen Shop',
};

const ERD_LIBRARY = {
	type: 'svg',
	src: './data/library_erd.svg',
	caption: 'ERD einer Bibliothek',
};

const ERD_BAD_SUPPLIER = {
	type: 'svg',
	src: './data/bad_supplier_erd.svg',
	caption: 'Fehlerhaftes ERD eines Lieferantenmodells',
};

const ERD_RULES = {
	type: 'svg',
	src: './data/rules_erd.svg',
	caption: 'ERD für Lösch- und Änderungsregeln',
};

const QUERY_ORDER_TABLES = [
	{
		name: 'kunde',
		columns: ['kunde_id', 'name', 'ort'],
		rows: [
			['1', 'Lia Moser', 'Bern'],
			['2', 'Noah Keller', 'Zürich'],
			['3', 'Mia Frei', 'Bern'],
		],
	},
	{
		name: 'bestellung',
		columns: ['bestellung_id', 'kunde_id', 'bestelldatum'],
		rows: [
			['101', '1', '2026-04-11'],
			['102', '2', '2026-04-12'],
			['103', '3', '2026-04-13'],
		],
	},
];

const QUERY_PRODUCT_TABLES = [
	{
		name: 'produkt',
		columns: ['produkt_id', 'name', 'preis'],
		rows: [
			['1', 'USB-C Dock', '89.90'],
			['2', 'Mauspad', '12.50'],
			['3', 'HDMI-Kabel', '18.90'],
			['4', 'Monitor', '249.00'],
		],
	},
];

const VERIFY_CUSTOMER_TABLES = [
	{
		name: 'kunde',
		columns: ['kunde_id', 'vorname', 'nachname', 'email'],
		rows: [
			['1', 'Lia', 'Moser', 'lia.moser@example.ch'],
			['2', 'Noah', 'Keller', 'noah.keller@example.ch'],
			['3', 'Mia', 'Frei', 'mia.frei@example.ch'],
		],
	},
];

const VERIFY_PRODUCT_TABLES = [
	{
		name: 'produkt',
		columns: ['produkt_id', 'name', 'lagerbestand'],
		rows: [
			['1', 'USB-C Dock', '12'],
			['2', 'Mauspad', '55'],
			['3', 'HDMI-Kabel', '31'],
		],
	},
];

const IMPORT_CUSTOMER_PREVIEW = [
	{
		name: 'kunden_import.csv',
		columns: ['kundennr', 'vorname', 'nachname', 'ort', 'kommentar'],
		rows: [
			['1', 'Lia', 'Moser', 'Bern', 'Stammkundin'],
			['2', 'Noah', 'Keller', 'Basel', ''],
		],
	},
];

const IMPORT_DIRTY_PREVIEW = [
	{
		name: 'staging_kunden.csv',
		columns: ['name_gesamt', 'geburtsdatum', 'saldo', 'klasse '],
		rows: [
			['Lia Moser', '16.04.2026', '19,90', 'B1A'],
			['Noah Keller', '03.05.2026', '120,00', 'B2C'],
		],
	},
];

const PRACTICE_TASKS = {
	A1: {
		G: [
			{
				isPracticeTask: true,
				type: 'mapping',
				prompt: 'Ordne die markierten Begriffe im gezeichneten ERD der richtigen Rolle zu.',
				diagram: ERD_SHOP,
				options: ['Entität', 'Attribut', 'Beziehung', 'Kardinalität'],
				pairs: [
					{ label: 'Kunde', correctValue: 'Entität' },
					{ label: 'bestelldatum', correctValue: 'Attribut' },
					{ label: 'gibt auf', correctValue: 'Beziehung' },
					{ label: '1:n', correctValue: 'Kardinalität' },
					{ label: 'Bestellposition', correctValue: 'Entität' },
					{ label: 'menge', correctValue: 'Attribut' },
				],
			},
			{
				isPracticeTask: true,
				type: 'mapping',
				prompt: 'Lies das ERD und ordne jeder Verbindung die passende Kardinalität zu.',
				diagram: ERD_SHOP,
				options: ['1:1', '1:n', 'n:m'],
				pairs: [
					{ label: 'Kunde -> Bestellung', correctValue: '1:n' },
					{ label: 'Bestellung -> Bestellposition', correctValue: '1:n' },
					{ label: 'Produkt -> Bestellposition', correctValue: '1:n' },
				],
			},
		],
		F: [
			{
				isPracticeTask: true,
				type: 'mapping',
				prompt: 'Ordne die Attribute aus dem ERD der richtigen Entität zu.',
				diagram: ERD_LIBRARY,
				options: ['Mitglied', 'Ausleihe', 'Buch'],
				pairs: [
					{ label: 'mitglied_id', correctValue: 'Mitglied' },
					{ label: 'klasse', correctValue: 'Mitglied' },
					{ label: 'ausleihdatum', correctValue: 'Ausleihe' },
					{ label: 'rückgabedatum', correctValue: 'Ausleihe' },
					{ label: 'isbn', correctValue: 'Buch' },
					{ label: 'titel', correctValue: 'Buch' },
				],
			},
			{
				isPracticeTask: true,
				type: 'multi-select',
				prompt: 'Welche Aussagen passen zum gezeichneten Bibliotheks-ERD?',
				diagram: ERD_LIBRARY,
				options: [
					'Ein Mitglied kann mehrere Ausleihen haben.',
					'Ein Buch kann in mehreren Ausleihen vorkommen.',
					'Eine Ausleihe gehört direkt zu mehreren Mitgliedern gleichzeitig.',
					'Die Entität Ausleihe verbindet Mitglied und Buch.',
					'ISBN ist ein Attribut von Mitglied.',
				],
				correctValues: [
					'Ein Mitglied kann mehrere Ausleihen haben.',
					'Ein Buch kann in mehreren Ausleihen vorkommen.',
					'Die Entität Ausleihe verbindet Mitglied und Buch.',
				],
			},
		],
		E: [
			{
				isPracticeTask: true,
				type: 'multi-select',
				prompt: 'Markiere alle Modellprobleme, die du im gezeichneten ERD verbessern würdest.',
				diagram: ERD_BAD_SUPPLIER,
				options: [
					'Eine eigene Kontakt-Entität mit Bezug zum Lieferanten einführen',
					'Bestellungen über eine echte Beziehung oder Zwischentabelle modellieren',
					'Mehr kontakt1- bis kontakt10-Spalten anlegen',
					'Die Textliste bestellung_ids unverändert lassen',
					'Kontaktdaten komplett in den Primärschlüssel verschieben',
				],
				correctValues: [
					'Eine eigene Kontakt-Entität mit Bezug zum Lieferanten einführen',
					'Bestellungen über eine echte Beziehung oder Zwischentabelle modellieren',
				],
			},
			{
				isPracticeTask: true,
				type: 'mapping',
				prompt: 'Ordne jedem Modellproblem die passende Verbesserung zu.',
				diagram: ERD_BAD_SUPPLIER,
				options: [
					'Eigene Kontakt-Entität',
					'Zwischentabelle oder echte Beziehung',
					'Pflichtfelder und Schlüssel prüfen',
				],
				pairs: [
					{
						label: 'kontakt1_name und kontakt2_name stehen direkt in Lieferant',
						correctValue: 'Eigene Kontakt-Entität',
					},
					{
						label: 'bestellung_ids werden als Text gespeichert',
						correctValue: 'Zwischentabelle oder echte Beziehung',
					},
					{
						label: 'Ein Modell soll technisch sauber und eindeutig bleiben',
						correctValue: 'Pflichtfelder und Schlüssel prüfen',
					},
				],
			},
		],
	},
	B1: {
		F: [
			{
				isPracticeTask: true,
				type: 'grid-builder',
				prompt:
					'Konfiguriere im Tabellen-Designer die Tabelle kunde passend zum Modell.',
				diagram: ERD_SHOP,
				helperText:
					'Wähle die Einstellungen so, wie du sie in einem DB-Tool für die Tabelle kunde setzen würdest.',
				columns: [
					{
						id: 'datatype',
						label: 'Datentyp',
						options: ['INT', 'VARCHAR(100)', 'DATE', 'DECIMAL(10,2)'],
					},
					{
						id: 'required',
						label: 'Pflicht',
						options: ['NOT NULL', 'NULL erlaubt'],
					},
					{
						id: 'key',
						label: 'Schlüssel',
						options: ['PRIMARY KEY', '-'],
					},
				],
				rows: [
					{
						label: 'kunde_id',
						correctValues: {
							datatype: 'INT',
							required: 'NOT NULL',
							key: 'PRIMARY KEY',
						},
					},
					{
						label: 'vorname',
						correctValues: {
							datatype: 'VARCHAR(100)',
							required: 'NOT NULL',
							key: '-',
						},
					},
					{
						label: 'nachname',
						correctValues: {
							datatype: 'VARCHAR(100)',
							required: 'NOT NULL',
							key: '-',
						},
					},
					{
						label: 'ort',
						correctValues: {
							datatype: 'VARCHAR(100)',
							required: 'NOT NULL',
							key: '-',
						},
					},
				],
			},
			{
				isPracticeTask: true,
				type: 'grid-builder',
				prompt:
					'Konfiguriere im Tabellen-Designer die Tabelle bestellung passend zum Modell.',
				diagram: ERD_SHOP,
				helperText:
					'Hier geht es um die Tabellenstruktur im Tool. Die eigentlichen Fremdschlüssel-Regeln kommen separat.',
				columns: [
					{
						id: 'datatype',
						label: 'Datentyp',
						options: ['INT', 'VARCHAR(100)', 'DATE', 'DECIMAL(10,2)'],
					},
					{
						id: 'required',
						label: 'Pflicht',
						options: ['NOT NULL', 'NULL erlaubt'],
					},
					{
						id: 'key',
						label: 'Schlüssel',
						options: ['PRIMARY KEY', '-'],
					},
				],
				rows: [
					{
						label: 'bestellung_id',
						correctValues: {
							datatype: 'INT',
							required: 'NOT NULL',
							key: 'PRIMARY KEY',
						},
					},
					{
						label: 'bestelldatum',
						correctValues: {
							datatype: 'DATE',
							required: 'NOT NULL',
							key: '-',
						},
					},
					{
						label: 'kunde_id',
						correctValues: {
							datatype: 'INT',
							required: 'NOT NULL',
							key: '-',
						},
					},
				],
			},
		],
		E: [
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt: 'Schreibe die DDL für die Tabelle kunde direkt in SQL.',
				diagram: ERD_SHOP,
				helperText:
					'Die Tabelle soll die Spalten kunde_id, vorname, nachname und ort enthalten. kunde_id ist der Primärschlüssel.',
				placeholder: 'CREATE TABLE kunde (...);',
				requiredSnippets: [
					'create table kunde',
					'kunde_id int',
					'primary key',
					'vorname varchar(100) not null',
					'nachname varchar(100) not null',
					'ort varchar(100) not null',
				],
				solution:
					'CREATE TABLE kunde (\n  kunde_id INT PRIMARY KEY,\n  vorname VARCHAR(100) NOT NULL,\n  nachname VARCHAR(100) NOT NULL,\n  ort VARCHAR(100) NOT NULL\n);',
			},
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt: 'Schreibe die DDL für die Tabelle bestellung direkt in SQL.',
				diagram: ERD_SHOP,
				helperText:
					'Die Tabelle soll bestellung_id, bestelldatum und kunde_id enthalten. Der Primärschlüssel ist bestellung_id.',
				placeholder: 'CREATE TABLE bestellung (...);',
				requiredSnippets: [
					'create table bestellung',
					'bestellung_id int',
					'primary key',
					'bestelldatum date not null',
					'kunde_id int not null',
				],
				solution:
					'CREATE TABLE bestellung (\n  bestellung_id INT PRIMARY KEY,\n  bestelldatum DATE NOT NULL,\n  kunde_id INT NOT NULL\n);',
			},
		],
	},
	B2: {
		G: [
			{
				isPracticeTask: true,
				type: 'mapping',
				prompt: 'Ordne jedem Attribut den passendsten Datentyp zu.',
				options: ['INTEGER', 'DECIMAL(10,2)', 'DATE', 'BOOLEAN', 'TEXT'],
				pairs: [
					{ label: 'mitarbeiternummer', correctValue: 'INTEGER' },
					{ label: 'preis', correctValue: 'DECIMAL(10,2)' },
					{ label: 'geburtsdatum', correctValue: 'DATE' },
					{ label: 'aktiv', correctValue: 'BOOLEAN' },
					{ label: 'beschreibung', correctValue: 'TEXT' },
				],
			},
			{
				isPracticeTask: true,
				type: 'mapping',
				prompt: 'Ordne jedem Beispielwert den sinnvollsten Datentyp zu.',
				options: ['INT', 'DECIMAL', 'DATE', 'DATETIME', 'TEXT', 'BOOLEAN'],
				pairs: [
					{ label: '42', correctValue: 'INT' },
					{ label: '19.95', correctValue: 'DECIMAL' },
					{ label: '2026-04-16', correctValue: 'DATE' },
					{ label: '2026-04-16 14:30:00', correctValue: 'DATETIME' },
					{ label: 'Produktbeschreibung mit mehreren Sätzen', correctValue: 'TEXT' },
					{ label: 'true / false', correctValue: 'BOOLEAN' },
				],
			},
		],
		E: [
			{
				isPracticeTask: true,
				type: 'grid-builder',
				prompt:
					'Konfiguriere im Tabellen-Designer die Spalteneigenschaften für benutzer.',
				helperText:
					'Wende Datentypen, Pflichtfelder, Unique, Defaults und Auto Increment konkret an.',
				columns: [
					{
						id: 'datatype',
						label: 'Datentyp',
						options: [
							'INT',
							'VARCHAR(255)',
							'VARCHAR(20)',
							'BOOLEAN',
							'DATETIME',
							'TEXT',
						],
					},
					{
						id: 'required',
						label: 'Pflicht',
						options: ['NOT NULL', 'NULL erlaubt'],
					},
					{
						id: 'rule',
						label: 'Regel',
						options: [
							'PRIMARY KEY',
							'UNIQUE',
							'CHECK (rabatt_prozent >= 0)',
							'-',
						],
					},
					{
						id: 'extra',
						label: 'Standard / Extra',
						options: [
							'AUTO_INCREMENT',
							"DEFAULT 'kunde'",
							'DEFAULT 1',
							'DEFAULT CURRENT_TIMESTAMP',
							'DEFAULT 0',
							'-',
						],
					},
				],
				rows: [
					{
						label: 'benutzer_id',
						correctValues: {
							datatype: 'INT',
							required: 'NOT NULL',
							rule: 'PRIMARY KEY',
							extra: 'AUTO_INCREMENT',
						},
					},
					{
						label: 'email',
						correctValues: {
							datatype: 'VARCHAR(255)',
							required: 'NOT NULL',
							rule: 'UNIQUE',
							extra: '-',
						},
					},
					{
						label: 'rolle',
						correctValues: {
							datatype: 'VARCHAR(20)',
							required: 'NOT NULL',
							rule: '-',
							extra: "DEFAULT 'kunde'",
						},
					},
					{
						label: 'aktiv',
						correctValues: {
							datatype: 'BOOLEAN',
							required: 'NOT NULL',
							rule: '-',
							extra: 'DEFAULT 1',
						},
					},
					{
						label: 'erstellt_am',
						correctValues: {
							datatype: 'DATETIME',
							required: 'NOT NULL',
							rule: '-',
							extra: 'DEFAULT CURRENT_TIMESTAMP',
						},
					},
				],
			},
			{
				isPracticeTask: true,
				type: 'grid-builder',
				prompt:
					'Konfiguriere im Tabellen-Designer die Spalteneigenschaften für produkt.',
				helperText:
					'Hier musst du zusätzlich eine optionale Spalte und eine CHECK-Regel sauber setzen.',
				columns: [
					{
						id: 'datatype',
						label: 'Datentyp',
						options: [
							'INT',
							'VARCHAR(255)',
							'VARCHAR(20)',
							'BOOLEAN',
							'DATETIME',
							'TEXT',
						],
					},
					{
						id: 'required',
						label: 'Pflicht',
						options: ['NOT NULL', 'NULL erlaubt'],
					},
					{
						id: 'rule',
						label: 'Regel',
						options: [
							'PRIMARY KEY',
							'UNIQUE',
							'CHECK (rabatt_prozent >= 0)',
							'-',
						],
					},
					{
						id: 'extra',
						label: 'Standard / Extra',
						options: [
							'AUTO_INCREMENT',
							"DEFAULT 'kunde'",
							'DEFAULT 1',
							'DEFAULT CURRENT_TIMESTAMP',
							'DEFAULT 0',
							'-',
						],
					},
				],
				rows: [
					{
						label: 'produkt_id',
						correctValues: {
							datatype: 'INT',
							required: 'NOT NULL',
							rule: 'PRIMARY KEY',
							extra: 'AUTO_INCREMENT',
						},
					},
					{
						label: 'sku',
						correctValues: {
							datatype: 'VARCHAR(20)',
							required: 'NOT NULL',
							rule: 'UNIQUE',
							extra: '-',
						},
					},
					{
						label: 'rabatt_prozent',
						correctValues: {
							datatype: 'INT',
							required: 'NOT NULL',
							rule: 'CHECK (rabatt_prozent >= 0)',
							extra: 'DEFAULT 0',
						},
					},
					{
						label: 'beschreibung',
						correctValues: {
							datatype: 'TEXT',
							required: 'NULL erlaubt',
							rule: '-',
							extra: '-',
						},
					},
				],
			},
		],
	},
	B3: {
		G: [
			{
				isPracticeTask: true,
				type: 'mapping',
				prompt: 'Ordne jede Beziehung im ERD dem passenden technischen Mittel zu.',
				diagram: ERD_SHOP,
				options: ['Primärschlüssel', 'Fremdschlüssel in Kindtabelle', 'Zwischentabelle'],
				pairs: [
					{ label: 'Bestellung gehört zu Kunde', correctValue: 'Fremdschlüssel in Kindtabelle' },
					{ label: 'Bestellung enthält Produkte', correctValue: 'Zwischentabelle' },
					{ label: 'Jede Bestellung braucht eine eindeutige ID', correctValue: 'Primärschlüssel' },
				],
			},
			{
				isPracticeTask: true,
				type: 'mapping',
				prompt: 'Lies das ERD und ordne jeder Verbindung die Kardinalität zu.',
				diagram: ERD_SHOP,
				options: ['1:1', '1:n', 'n:m'],
				pairs: [
					{ label: 'Kunde -> Bestellung', correctValue: '1:n' },
					{ label: 'Bestellung -> Produkt über Bestellposition', correctValue: 'n:m' },
					{ label: 'Bestellung -> Bestellposition', correctValue: '1:n' },
				],
			},
		],
		F: [
			{
				isPracticeTask: true,
				type: 'grid-builder',
				prompt:
					'Richte im Beziehungs-Designer die Fremdschlüssel aus dem ERD ein.',
				diagram: ERD_SHOP,
				columns: [
					{
						id: 'childTable',
						label: 'Kindtabelle',
						options: ['bestellung', 'bestellposition', 'kunde', 'produkt'],
					},
					{
						id: 'fkField',
						label: 'FK-Feld',
						options: ['kunde_id', 'bestellung_id', 'produkt_id'],
					},
					{
						id: 'reference',
						label: 'Referenziert',
						options: [
							'kunde.kunde_id',
							'bestellung.bestellung_id',
							'produkt.produkt_id',
						],
					},
				],
				rows: [
					{
						label: 'Kunde 1:n Bestellung',
						correctValues: {
							childTable: 'bestellung',
							fkField: 'kunde_id',
							reference: 'kunde.kunde_id',
						},
					},
					{
						label: 'Bestellung 1:n Bestellposition',
						correctValues: {
							childTable: 'bestellposition',
							fkField: 'bestellung_id',
							reference: 'bestellung.bestellung_id',
						},
					},
					{
						label: 'Produkt 1:n Bestellposition',
						correctValues: {
							childTable: 'bestellposition',
							fkField: 'produkt_id',
							reference: 'produkt.produkt_id',
						},
					},
				],
			},
			{
				isPracticeTask: true,
				type: 'grid-builder',
				prompt:
					'Konfiguriere die Zwischentabelle bestellposition im Tool.',
				diagram: ERD_SHOP,
				columns: [
					{
						id: 'meaning',
						label: 'Bedeutung',
						options: [
							'Fremdschlüssel zu Bestellung',
							'Fremdschlüssel zu Produkt',
							'normale Nutzspalte',
						],
					},
					{
						id: 'reference',
						label: 'Referenziert',
						options: ['bestellung.bestellung_id', 'produkt.produkt_id', '-'],
					},
				],
				rows: [
					{
						label: 'bestellung_id',
						correctValues: {
							meaning: 'Fremdschlüssel zu Bestellung',
							reference: 'bestellung.bestellung_id',
						},
					},
					{
						label: 'produkt_id',
						correctValues: {
							meaning: 'Fremdschlüssel zu Produkt',
							reference: 'produkt.produkt_id',
						},
					},
					{
						label: 'menge',
						correctValues: {
							meaning: 'normale Nutzspalte',
							reference: '-',
						},
					},
				],
			},
		],
		E: [
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt:
					'Schreibe den SQL-Constraint für die Beziehung Bestellung -> Kunde.',
				diagram: ERD_SHOP,
				placeholder: 'ALTER TABLE bestellung ...',
				requiredSnippets: [
					'alter table bestellung',
					'add constraint fk_bestellung_kunde',
					'foreign key(kunde_id)',
					'references kunde(kunde_id)',
				],
				solution:
					'ALTER TABLE bestellung\nADD CONSTRAINT fk_bestellung_kunde\nFOREIGN KEY (kunde_id) REFERENCES kunde (kunde_id);',
			},
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt:
					'Schreibe den SQL-Constraint für die Beziehung Bestellposition -> Bestellung.',
				diagram: ERD_SHOP,
				placeholder: 'ALTER TABLE bestellposition ...',
				requiredSnippets: [
					'alter table bestellposition',
					'add constraint fk_position_bestellung',
					'foreign key(bestellung_id)',
					'references bestellung(bestellung_id)',
				],
				solution:
					'ALTER TABLE bestellposition\nADD CONSTRAINT fk_position_bestellung\nFOREIGN KEY (bestellung_id) REFERENCES bestellung (bestellung_id);',
			},
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt:
					'Schreibe den SQL-Constraint für die Beziehung Bestellposition -> Produkt.',
				diagram: ERD_SHOP,
				placeholder: 'ALTER TABLE bestellposition ...',
				requiredSnippets: [
					'alter table bestellposition',
					'add constraint fk_position_produkt',
					'foreign key(produkt_id)',
					'references produkt(produkt_id)',
				],
				solution:
					'ALTER TABLE bestellposition\nADD CONSTRAINT fk_position_produkt\nFOREIGN KEY (produkt_id) REFERENCES produkt (produkt_id);',
			},
		],
	},
	C1: {
		F: [
			{
				isPracticeTask: true,
				type: 'record-form',
				prompt: 'Trage einen neuen Produktdatensatz so ein, wie du es in einem Tool machen würdest.',
				helperText:
					'Tabelle produkt: produkt_id AUTO_INCREMENT, name NOT NULL, preis DECIMAL(10,2), lagerbestand INT, aktiv BOOLEAN DEFAULT 1.',
				fields: [
					{
						id: 'produkt_id',
						label: 'produkt_id',
						input: 'select',
						options: ['leer lassen', '1001'],
						correctValue: 'leer lassen',
					},
					{
						id: 'name',
						label: 'name',
						input: 'text',
						placeholder: 'Produktname',
						correctValue: 'USB-C Dock',
					},
					{
						id: 'preis',
						label: 'preis',
						input: 'text',
						placeholder: 'z. B. 89.90',
						correctValue: '89.90',
					},
					{
						id: 'lagerbestand',
						label: 'lagerbestand',
						input: 'text',
						placeholder: 'Anzahl',
						correctValue: '12',
					},
					{
						id: 'aktiv',
						label: 'aktiv',
						input: 'select',
						options: ['1', '0'],
						correctValue: '1',
					},
				],
			},
			{
				isPracticeTask: true,
				type: 'record-form',
				prompt: 'Trage einen neuen Kundendatensatz so ein, wie du es in einem Tool machen würdest.',
				helperText:
					'Tabelle kunde: kunde_id AUTO_INCREMENT, vorname NOT NULL, nachname NOT NULL, ort NOT NULL, newsletter BOOLEAN DEFAULT 0.',
				fields: [
					{
						id: 'kunde_id',
						label: 'kunde_id',
						input: 'select',
						options: ['leer lassen', '77'],
						correctValue: 'leer lassen',
					},
					{
						id: 'vorname',
						label: 'vorname',
						input: 'text',
						correctValue: 'Lia',
					},
					{
						id: 'nachname',
						label: 'nachname',
						input: 'text',
						correctValue: 'Moser',
					},
					{
						id: 'ort',
						label: 'ort',
						input: 'text',
						correctValue: 'Bern',
					},
					{
						id: 'newsletter',
						label: 'newsletter',
						input: 'select',
						options: ['0', '1'],
						correctValue: '0',
					},
				],
			},
		],
		E: [
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt: 'Schreibe den INSERT-Befehl für einen neuen Produktdatensatz direkt in SQL.',
				helperText:
					'Füge USB-C Dock mit dem Preis 89.90 und dem Lagerbestand 12 in die Tabelle produkt ein. produkt_id ist automatisch.',
				placeholder: 'INSERT INTO produkt (...) VALUES (...);',
				requiredSnippets: [
					'insert into produkt',
					'(name, preis, lagerbestand)',
					"values('usb-c dock',89.90,12)",
				],
				forbiddenSnippets: ['produkt_id'],
				solution:
					"INSERT INTO produkt (name, preis, lagerbestand)\nVALUES ('USB-C Dock', 89.90, 12);",
			},
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt: 'Schreibe einen INSERT-Befehl für zwei neue Kunden direkt in SQL.',
				helperText:
					'Füge Lia Moser aus Bern und Noah Keller aus Basel in die Tabelle kunde ein. kunde_id ist automatisch.',
				placeholder: 'INSERT INTO kunde (...) VALUES (...), (...);',
				requiredSnippets: [
					'insert into kunde',
					'(vorname, nachname, ort)',
					"('lia', 'moser', 'bern')",
					"('noah', 'keller', 'basel')",
				],
				forbiddenSnippets: ['kunde_id'],
				solution:
					"INSERT INTO kunde (vorname, nachname, ort)\nVALUES ('Lia', 'Moser', 'Bern'),\n       ('Noah', 'Keller', 'Basel');",
			},
		],
	},
	C2: {
		F: [
			{
				isPracticeTask: true,
				type: 'fill-blanks',
				prompt:
					'Setze in die CSV-Datei die richtigen Trenner ein. Verwende überall das passende Trennzeichen.',
				helperText:
					'Bei diesem Bulk-Import ist die Datei semikolongetrennt.',
				template:
					'kundennr [[sep1]] vorname [[sep2]] nachname [[sep3]] ort [[sep4]] kommentar\n1 [[sep5]] Lia [[sep6]] Moser [[sep7]] Bern [[sep8]] Stammkundin',
				blanks: [
					{ id: 'sep1', options: [';', ',', '|'], correctValue: ';' },
					{ id: 'sep2', options: [';', ',', '|'], correctValue: ';' },
					{ id: 'sep3', options: [';', ',', '|'], correctValue: ';' },
					{ id: 'sep4', options: [';', ',', '|'], correctValue: ';' },
					{ id: 'sep5', options: [';', ',', '|'], correctValue: ';' },
					{ id: 'sep6', options: [';', ',', '|'], correctValue: ';' },
					{ id: 'sep7', options: [';', ',', '|'], correctValue: ';' },
					{ id: 'sep8', options: [';', ',', '|'], correctValue: ';' },
				],
			},
			{
				isPracticeTask: true,
				type: 'record-form',
				prompt:
					'Stelle den Import-Assistenten für diese CSV-Datei korrekt ein.',
				referenceTables: IMPORT_CUSTOMER_PREVIEW,
				helperText:
					'Die Datei verwendet als Trenner ein Semikolon (;).',
				fields: [
					{
						id: 'format',
						label: 'Dateiformat',
						input: 'select',
						options: ['CSV', 'XML', 'JSON'],
						correctValue: 'CSV',
					},
					{
						id: 'delimiter',
						label: 'Trennzeichen',
						input: 'select',
						options: [';', ',', 'Tab'],
						correctValue: ';',
					},
					{
						id: 'encoding',
						label: 'Zeichensatz',
						input: 'select',
						options: ['UTF-8', 'ANSI'],
						correctValue: 'UTF-8',
					},
					{
						id: 'header',
						label: 'Kopfzeile vorhanden',
						input: 'select',
						options: ['Ja', 'Nein'],
						correctValue: 'Ja',
					},
					{
						id: 'target',
						label: 'Zieltabelle',
						input: 'select',
						options: ['kunde', 'produkt', 'bestellung'],
						correctValue: 'kunde',
					},
				],
			},
			{
				isPracticeTask: true,
				type: 'grid-builder',
				prompt:
					'Ordne die CSV-Spalten im Import-Tool den richtigen Datenbankfeldern zu.',
				referenceTables: IMPORT_CUSTOMER_PREVIEW,
				columns: [
					{
						id: 'target',
						label: 'Zielspalte',
						options: ['kunde_id', 'vorname', 'nachname', 'ort', 'ignorieren'],
					},
					{
						id: 'action',
						label: 'Aktion',
						options: ['importieren', 'nicht importieren'],
					},
				],
				rows: [
					{
						label: 'kundennr',
						correctValues: {
							target: 'kunde_id',
							action: 'importieren',
						},
					},
					{
						label: 'vorname',
						correctValues: {
							target: 'vorname',
							action: 'importieren',
						},
					},
					{
						label: 'nachname',
						correctValues: {
							target: 'nachname',
							action: 'importieren',
						},
					},
					{
						label: 'ort',
						correctValues: {
							target: 'ort',
							action: 'importieren',
						},
					},
					{
						label: 'kommentar',
						correctValues: {
							target: 'ignorieren',
							action: 'nicht importieren',
						},
					},
				],
			},
		],
		E: [
			{
				isPracticeTask: true,
				type: 'grid-builder',
				prompt:
					'Bereite die Rohdaten so auf, dass sie danach bulk-importiert werden können.',
				referenceTables: IMPORT_DIRTY_PREVIEW,
				columns: [
					{
						id: 'preparation',
						label: 'Vorbereitung',
						options: [
							'splitten',
							'ISO-Datum herstellen',
							'Dezimaltrennzeichen vereinheitlichen',
							'Spaltenname trimmen',
						],
					},
					{
						id: 'target',
						label: 'Ziel',
						options: ['vorname + nachname', 'geburtsdatum', 'saldo', 'klasse'],
					},
				],
				rows: [
					{
						label: 'name_gesamt',
						correctValues: {
							preparation: 'splitten',
							target: 'vorname + nachname',
						},
					},
					{
						label: 'geburtsdatum',
						correctValues: {
							preparation: 'ISO-Datum herstellen',
							target: 'geburtsdatum',
						},
					},
					{
						label: 'saldo',
						correctValues: {
							preparation: 'Dezimaltrennzeichen vereinheitlichen',
							target: 'saldo',
						},
					},
					{
						label: 'klasse ',
						correctValues: {
							preparation: 'Spaltenname trimmen',
							target: 'klasse',
						},
					},
				],
			},
			{
				isPracticeTask: true,
				type: 'grid-builder',
				prompt:
					'Lege für die typischen Importprobleme die passende Vorverarbeitung fest.',
				helperText:
					'Damit die Datei bulk-importiert werden kann, müssen die Werte zuerst technisch sauber werden.',
				columns: [
					{
						id: 'action',
						label: 'Aktion',
						options: [
							'Duplikat entfernen',
							'Pflichtwert ergänzen oder Zeile sperren',
							'ISO-Datum herstellen',
							'Währungssymbol entfernen',
						],
					},
					{
						id: 'goal',
						label: 'Ergebnis',
						options: [
							'kundennr eindeutig',
							'email verwendbar',
							'datum importierbar',
							'betrag numerisch',
						],
					},
				],
				rows: [
					{
						label: 'Doppelte kundennr',
						correctValues: {
							action: 'Duplikat entfernen',
							goal: 'kundennr eindeutig',
						},
					},
					{
						label: 'Leere email',
						correctValues: {
							action: 'Pflichtwert ergänzen oder Zeile sperren',
							goal: 'email verwendbar',
						},
					},
					{
						label: 'lieferdatum = 01.05.2026',
						correctValues: {
							action: 'ISO-Datum herstellen',
							goal: 'datum importierbar',
						},
					},
					{
						label: 'betrag = CHF 19.90',
						correctValues: {
							action: 'Währungssymbol entfernen',
							goal: 'betrag numerisch',
						},
					},
				],
			},
		],
	},
	C3: {
		F: [
			{
				isPracticeTask: true,
				type: 'mapping',
				prompt:
					'Ordne den Beziehungen aus dem ERD die passende Lösch- oder Änderungsregel zu.',
				diagram: ERD_RULES,
				options: [
					'ON DELETE RESTRICT',
					'ON DELETE CASCADE',
					'ON DELETE SET NULL',
					'ON UPDATE CASCADE',
				],
				pairs: [
					{
						label: 'Kunde -> Rechnung',
						correctValue: 'ON DELETE RESTRICT',
					},
					{
						label: 'Bestellung -> Bestellposition',
						correctValue: 'ON DELETE CASCADE',
					},
					{
						label: 'Abteilung -> Mitarbeiter',
						correctValue: 'ON DELETE SET NULL',
					},
					{
						label: 'Wenn sich kunde.kunde_id ändert',
						correctValue: 'ON UPDATE CASCADE',
					},
				],
			},
			{
				isPracticeTask: true,
				type: 'mapping',
				prompt:
					'Ordne jeder Regel die konkrete Auswirkung auf die Kinddatensätze zu.',
				diagram: ERD_RULES,
				options: [
					'Elternsatz darf nicht gelöscht werden, solange Kinddatensätze existieren',
					'Passende Kinddatensätze werden automatisch mitgelöscht',
					'Der Fremdschlüssel im Kinddatensatz wird auf NULL gesetzt',
					'Eine geänderte ID wird in den Kindtabellen automatisch mitgeführt',
				],
				pairs: [
					{
						label: 'ON DELETE RESTRICT bei Kunde -> Rechnung',
						correctValue:
							'Elternsatz darf nicht gelöscht werden, solange Kinddatensätze existieren',
					},
					{
						label: 'ON DELETE CASCADE bei Bestellung -> Bestellposition',
						correctValue:
							'Passende Kinddatensätze werden automatisch mitgelöscht',
					},
					{
						label: 'ON DELETE SET NULL bei Abteilung -> Mitarbeiter',
						correctValue:
							'Der Fremdschlüssel im Kinddatensatz wird auf NULL gesetzt',
					},
					{
						label: 'ON UPDATE CASCADE bei Kunde -> Rechnung',
						correctValue:
							'Eine geänderte ID wird in den Kindtabellen automatisch mitgeführt',
					},
				],
			},
		],
		E: [
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt:
					'Schreibe den Constraint für Mitarbeiter -> Abteilung mit ON DELETE SET NULL.',
				diagram: ERD_RULES,
				placeholder: 'ALTER TABLE mitarbeiter ...',
				requiredSnippets: [
					'alter table mitarbeiter',
					'add constraint fk_mitarbeiter_abteilung',
					'foreign key(abteilung_id)',
					'references abteilung(abteilung_id)',
					'on delete set null',
				],
				solution:
					'ALTER TABLE mitarbeiter\nADD CONSTRAINT fk_mitarbeiter_abteilung\nFOREIGN KEY (abteilung_id) REFERENCES abteilung (abteilung_id)\nON DELETE SET NULL;',
			},
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt:
					'Schreibe den Constraint für Rechnung -> Kunde mit ON DELETE RESTRICT und ON UPDATE CASCADE.',
				diagram: ERD_RULES,
				placeholder: 'ALTER TABLE rechnung ...',
				requiredSnippets: [
					'alter table rechnung',
					'add constraint fk_rechnung_kunde',
					'foreign key(kunde_id)',
					'references kunde(kunde_id)',
					'on delete restrict',
					'on update cascade',
				],
				solution:
					'ALTER TABLE rechnung\nADD CONSTRAINT fk_rechnung_kunde\nFOREIGN KEY (kunde_id) REFERENCES kunde (kunde_id)\nON DELETE RESTRICT\nON UPDATE CASCADE;',
			},
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt:
					'Schreibe den Constraint für Bestellposition -> Bestellung mit ON DELETE CASCADE.',
				diagram: ERD_RULES,
				placeholder: 'ALTER TABLE bestellposition ...',
				requiredSnippets: [
					'alter table bestellposition',
					'add constraint fk_position_bestellung',
					'foreign key(bestellung_id)',
					'references bestellung(bestellung_id)',
					'on delete cascade',
				],
				solution:
					'ALTER TABLE bestellposition\nADD CONSTRAINT fk_position_bestellung\nFOREIGN KEY (bestellung_id) REFERENCES bestellung (bestellung_id)\nON DELETE CASCADE;',
			},
		],
	},
	D1: {
		F: [
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt:
					'Schreibe die Abfrage für Bestellungen mit Kundennamen aus Bern.',
				referenceTables: QUERY_ORDER_TABLES,
				helperText:
					'Gib bestellung_id und name aus. Verwende JOIN, WHERE und sortiere nach dem Kundennamen aufsteigend.',
				placeholder: 'SELECT ...',
				requiredSnippets: [
					'select',
					'b.bestellung_id',
					'k.name',
					'from bestellung b',
					'join kunde k on b.kunde_id=k.kunde_id',
					"where k.ort='bern'",
					'order by k.name asc',
				],
				forbiddenSnippets: ['select *'],
				solution:
					"SELECT b.bestellung_id, k.name\nFROM bestellung b\nINNER JOIN kunde k ON b.kunde_id = k.kunde_id\nWHERE k.ort = 'Bern'\nORDER BY k.name ASC;",
			},
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt:
					'Schreibe eine Abfrage für Produkte im Preisbereich von 10 bis 20.',
				referenceTables: QUERY_PRODUCT_TABLES,
				helperText:
					'Gib name und preis aus. Verwende WHERE mit BETWEEN und sortiere nach preis aufsteigend.',
				placeholder: 'SELECT ...',
				requiredSnippets: [
					'select',
					'name',
					'preis',
					'from produkt',
					'where preis between 10 and 20',
					'order by preis asc',
				],
				forbiddenSnippets: ['select *'],
				solution:
					'SELECT name, preis\nFROM produkt\nWHERE preis BETWEEN 10 AND 20\nORDER BY preis ASC;',
			},
		],
		E: [
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt:
					'Schreibe eine Prüf-Abfrage, die pro Kundendatensatz einen HASHBYTES-Wert bildet.',
				referenceTables: VERIFY_CUSTOMER_TABLES,
				helperText:
					'Bilde einen Hash aus vorname, nachname und email, damit Änderungen an den Daten später erkannt werden können.',
				placeholder: 'SELECT ... HASHBYTES(...) ...',
				requiredSnippets: [
					'select',
					'kunde_id',
					'hashbytes',
					'sha2_256',
					'vorname',
					'nachname',
					'email',
					'from kunde',
				],
				solution:
					"SELECT kunde_id,\n       HASHBYTES('SHA2_256', CONCAT(vorname, '|', nachname, '|', email)) AS daten_hash\nFROM kunde;",
			},
			{
				isPracticeTask: true,
				type: 'sql-write',
				prompt:
					'Schreibe eine Prüf-Abfrage mit CHECKSUM_AGG und BINARY_CHECKSUM für den Lagerbestand.',
				referenceTables: VERIFY_PRODUCT_TABLES,
				helperText:
					'Die Abfrage soll eine Gesamtsumme liefern, mit der du spätere Änderungen am Lagerbestand erkennen kannst.',
				placeholder: 'SELECT CHECKSUM_AGG(...) ...',
				requiredSnippets: [
					'select',
					'checksum_agg',
					'binary_checksum',
					'produkt_id',
					'lagerbestand',
					'from produkt',
				],
				solution:
					'SELECT CHECKSUM_AGG(BINARY_CHECKSUM(produkt_id, lagerbestand)) AS bestand_checksum\nFROM produkt;',
			},
		],
	},
};

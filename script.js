const DATA_URL = './data/m164-quiz-data.json';
const LEVEL_ORDER = ['G', 'F', 'E'];
const LEVEL_LABELS = {
	G: 'Grundlagen',
	F: 'Fortgeschritten',
	E: 'Erweitert',
	ALL: 'Alle anzeigen',
};
const TASK_TYPE_LABELS = {
	'single-choice': 'Multiple Choice',
	'multi-select': 'Mehrfachauswahl',
	mapping: 'Zuordnen',
	sequence: 'Reihenfolge',
	'fill-blanks': 'SQL-Bausteine',
	'sql-write': 'SQL schreiben',
	'record-form': 'Datensatz eingeben',
	'grid-builder': 'Konfigurieren',
};

const MATRIX_OBJECTIVES = {
	A1: {
		G: 'A1G: Ich kann die Elemente eines logisch relationalen ERD erklären (z. B. Entitäten, Attribute, Beziehungen, Kardinalitäten...).',
		F: 'A1F: Ich kann eine Übersicht über ein einfaches ERD gewinnen, Zusammenhänge über mehrere Entitäten erkennen und erläutern.',
		E: 'A1E: Ich kann ein ERD mit Entitäten kritisch hinterfragen, Probleme erkennen und Verbesserungen vorschlagen.',
	},
	B1: {
		G: 'B1G: Ich kann die Begriffe für die Elemente eines Datenbankmanagementsystems erläutern (z. B. Datenbank, Zeichensatz, Schema, Tablespace, Tabelle, Partition, Feld usw.).',
		F: 'B1F: Ich kann ein logisch relationales Modell in eine relationale Datenbank implementieren, z. B. mit Hilfe eines Tools.',
		E: 'B1E: Ich kann ein logisch relationales Modell mit Hilfe der DDL in eine relationale Datenbank implementieren, z. B. direkt mit SQL.',
	},
	B2: {
		G: 'B2G: Ich kann die Datentypen von Attributen einer relationalen Datenbank unterscheiden (Ganzzahlen, Fliesskomma, Text, Datum, Zeit, Binärtypen usw.).',
		F: 'B2F: Ich kann die Datentypen von Attributen einer relationalen Datenbank gezielt anwenden (Wertebereiche, Datentypen von Ganzzahlen, Fliesskomma, Text, Datum, Zeit, Binärtypen usw.).',
		E: 'B2E: Ich kann zusätzlich zu den Datentypen weitere Eigenschaften wie Default Values, Not Null, Unique, Unsigned oder Auto Increment gezielt für Attributwerte einsetzen.',
	},
	B3: {
		G: 'B3G: Ich kann das Prinzip der Beziehung und Assoziationen erläutern (Primär- und Fremdschlüssel).',
		F: 'B3F: Ich kann die Beziehungen und Assoziationen eines logisch relationalen Modells mit Hilfe eines Tools in einer relationalen Datenbank implementieren.',
		E: 'B3E: Ich kann die Beziehungen und Assoziationen eines logisch relationalen Modells mit Hilfe der DDL direkt mit SQL Constraints in einer relationalen Datenbank implementieren.',
	},
	C1: {
		G: 'C1G: Ich kann den Unterschied zwischen Struktur und Daten einer Datenbanktabelle erläutern.',
		F: 'C1F: Ich kann Daten in eine relationale Datenbank mit Hilfe eines Tools einfügen.',
		E: 'C1E: Ich kann Daten direkt mit SQL in eine relationale Datenbank einfügen.',
	},
	C2: {
		G: 'C2G: Ich kann eine Datenbank exportieren und importieren.',
		F: 'C2F: Ich kann mit einem Bulk-Import Daten aus externen Quellen wie CSV, XML oder JSON importieren.',
		E: 'C2E: Ich kann Daten aufbereiten, damit sie danach mit einem Bulk-Import importiert werden können.',
	},
	C3: {
		G: 'C3G: Ich kann das Prinzip der referentiellen Integrität erläutern.',
		F: 'C3F: Ich kann die Auswirkungen von Löschen und Ändern von Daten auf die referentielle Integrität erläutern.',
		E: 'C3E: Ich kann Regeln für das Löschen und Ändern von referenzierten Daten anwenden (z. B. Aktualisierungsweitergabe oder Löschweitergabe), um die Datenbankkonsistenz zu gewährleisten.',
	},
	D1: {
		G: 'D1G: Ich kann eine einfache Abfrage für die Auswahl von Daten anwenden (Select, Group, Order ...).',
		F: 'D1F: Ich kann einfache Abfragen spezialisieren, z. B. mit Filtern und Kriterien (Where, Join ...).',
		E: 'D1E: Ich kann Überprüfungen von Daten in Datenbanktabellen anwenden, z. B. mit SQL Checksum, CHECKSUM_AGG(), HASHBYTES() oder BINARY_CHECKSUM().',
	},
};

const competenceGrid = document.querySelector('#competence-grid');
const overviewStats = document.querySelector('#overview-stats');
const difficultySwitcher = document.querySelector('#difficulty-switcher');
const quizShell = document.querySelector('#quiz-shell');
const quizTitle = document.querySelector('#quiz-title');
const quizSummary = document.querySelector('#quiz-summary');
const quizObjective = document.querySelector('#quiz-objective');
const quizBadges = document.querySelector('#quiz-badges');
const quizForm = document.querySelector('#quiz-form');
const quizContent = document.querySelector('#quiz-content');
const resultPanel = document.querySelector('#result-panel');
const submitButton = document.querySelector('#submit-button');
const restartButton = document.querySelector('#restart-button');
const backButton = document.querySelector('#back-button');

const state = {
	quizData: null,
	activeLevel: 'G',
	selectedCompetenceId: null,
	submission: null,
};

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function formatTemplateText(text) {
	return escapeHtml(text).replace(/ /g, '&nbsp;').replace(/\n/g, '<br />');
}

function normalizeValue(value) {
	return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function normalizeSql(value) {
	return String(value || '')
		.toLowerCase()
		.replace(/\r/g, '')
		.replace(/\s+/g, ' ')
		.replace(/\s*,\s*/g, ',')
		.replace(/\s*\(\s*/g, '(')
		.replace(/\s*\)\s*/g, ')')
		.replace(/\s*=\s*/g, '=')
		.replace(/\s*;\s*/g, ';')
		.trim();
}

function formatPoints(earnedPoints, totalPoints) {
	return `${earnedPoints}/${totalPoints} ${totalPoints === 1 ? 'Punkt' : 'Punkte'}`;
}

function getQuestionType(question) {
	return question.type || 'single-choice';
}

function isPracticeQuestion(question) {
	return Boolean(question.isPracticeTask);
}

function getCompetencies() {
	return state.quizData?.competencies || [];
}

function getSelectedCompetence() {
	return (
		getCompetencies().find(
			(competence) => competence.id === state.selectedCompetenceId,
		) || null
	);
}

function getObjective(competenceCode, level) {
	return MATRIX_OBJECTIVES[competenceCode]?.[level] || '';
}

function getPracticeTasks(competenceCode, level) {
	const practiceEntry = PRACTICE_TASKS[competenceCode]?.[level];

	if (!practiceEntry) {
		return [];
	}

	return Array.isArray(practiceEntry) ? practiceEntry : [practiceEntry];
}

function getActiveLevels(level = state.activeLevel) {
	return level === 'ALL' ? LEVEL_ORDER : [level];
}

function getLevelQuestions(competence, level) {
	const storedQuestions = competence.levels[level] || [];
	const practiceTasks = getPracticeTasks(competence.code, level);

	return practiceTasks.length > 0 ? practiceTasks : storedQuestions;
}

function getQuestionTotalForLevel(level = state.activeLevel) {
	return getCompetencies().reduce((sum, competence) => {
		return (
			sum +
			getActiveLevels(level).reduce(
				(levelSum, entryLevel) =>
					levelSum + getLevelQuestions(competence, entryLevel).length,
				0,
			)
		);
	}, 0);
}

function getQuestionTotalForCompetence(competence, level = state.activeLevel) {
	return getActiveLevels(level).reduce(
		(sum, entryLevel) => sum + getLevelQuestions(competence, entryLevel).length,
		0,
	);
}

function getPracticeTaskCount(competence, level = state.activeLevel) {
	return getActiveLevels(level).reduce((sum, entryLevel) => {
		return sum + getPracticeTasks(competence.code, entryLevel).length;
	}, 0);
}

function buildQuestionName(competenceId, level, index) {
	return `question-${competenceId}-${level}-${index}`;
}

function syncDifficultyControls() {
	Array.from(difficultySwitcher.querySelectorAll('[data-level]')).forEach(
		(button) => {
			const active = button.dataset.level === state.activeLevel;
			button.classList.toggle('is-active', active);
			button.setAttribute('aria-selected', String(active));
		},
	);
}

function renderOverviewStats() {
	const label =
		state.activeLevel === 'ALL'
			? 'alle Stufen'
			: `Stufe ${LEVEL_LABELS[state.activeLevel]}`;

	overviewStats.innerHTML = `
		<span class="stat-pill">${getCompetencies().length} Kompetenzen</span>
		<span class="stat-pill">${getQuestionTotalForLevel()} Aufgaben für ${label}</span>
		<span class="stat-pill">Bestanden ab ${state.quizData.passThreshold}%</span>
	`;
}

function startQuiz(competenceId) {
	state.selectedCompetenceId = competenceId;
	state.submission = null;
	renderCompetenceGrid();
	renderQuiz();
	quizShell.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function changeDifficulty(level) {
	state.activeLevel = level;
	state.submission = null;
	syncDifficultyControls();
	renderOverviewStats();
	renderCompetenceGrid();
	renderQuiz();
}

function renderObjectiveBox(competence, level = state.activeLevel, withTitle = true) {
	if (level === 'ALL') {
		return LEVEL_ORDER.map(
			(entryLevel) => `
				<div class="objective-entry">
					<p class="objective-label">${entryLevel} - ${LEVEL_LABELS[entryLevel]}</p>
					<p class="objective-text">${escapeHtml(getObjective(competence.code, entryLevel))}</p>
				</div>
			`,
		).join('');
	}

	return `
		<div class="objective-entry">
			<p class="objective-label">${withTitle ? 'Kompetenzziel' : `${level} - ${LEVEL_LABELS[level]}`}</p>
			<p class="objective-text">${escapeHtml(getObjective(competence.code, level))}</p>
		</div>
	`;
}

function renderQuestionDiagram(diagram) {
	if (!diagram) {
		return '';
	}

	if (diagram.type === 'svg' && diagram.src) {
		return `
			<figure class="question-diagram">
				<img
					class="erd-diagram"
					src="${escapeHtml(diagram.src)}"
					loading="lazy"
					decoding="async"
					alt="${escapeHtml(diagram.alt || diagram.caption || 'ERD-Diagramm')}"
				/>
				${diagram.caption ? `<figcaption class="diagram-caption">${escapeHtml(diagram.caption)}</figcaption>` : ''}
			</figure>
		`;
	}

	return '';
}

function renderReferenceTables(referenceTables = []) {
	if (!referenceTables.length) {
		return '';
	}

	return `
		<div class="reference-table-group">
			${referenceTables
				.map(
					(table) => `
						<div class="reference-card">
							<p class="reference-title">${escapeHtml(table.name)}</p>
							<div class="reference-table-shell">
								<table class="reference-table">
									<thead>
										<tr>
											${table.columns
												.map((column) => `<th>${escapeHtml(column)}</th>`)
												.join('')}
										</tr>
									</thead>
									<tbody>
										${table.rows
											.map(
												(row) => `
													<tr>
														${row
															.map((cell) => `<td>${escapeHtml(cell)}</td>`)
															.join('')}
													</tr>
												`,
											)
											.join('')}
									</tbody>
								</table>
							</div>
						</div>
					`,
				)
				.join('')}
		</div>
	`;
}

function createCompetenceCard(competence) {
	const card = document.createElement('button');
	const activeClass =
		state.selectedCompetenceId === competence.id ? ' is-active' : '';
	const practiceCount = getPracticeTaskCount(competence);
	const practicePill =
		practiceCount > 0
			? `<span class="level-pill">${practiceCount} Praxisaufgabe${practiceCount > 1 ? 'n' : ''}</span>`
			: '';
	const levelPills =
		state.activeLevel === 'ALL'
			? `
				<span class="level-pill">G: ${getLevelQuestions(competence, 'G').length}</span>
				<span class="level-pill">F: ${getLevelQuestions(competence, 'F').length}</span>
				<span class="level-pill">E: ${getLevelQuestions(competence, 'E').length}</span>
				<span class="level-pill">${getQuestionTotalForCompetence(competence)} Aufgaben total</span>
				${practicePill}
			`
			: `
				<span class="level-pill">${LEVEL_LABELS[state.activeLevel]}</span>
				<span class="level-pill">${getQuestionTotalForCompetence(competence)} Aufgaben</span>
				${practicePill}
			`;

	card.type = 'button';
	card.className = `competence-card${activeClass}`;
	card.innerHTML = `
		<div>
			<p class="competence-meta">${competence.code} ${state.activeLevel === 'ALL' ? 'ALLE' : state.activeLevel}</p>
			<h3>${escapeHtml(competence.title)}</h3>
		</div>
			<p>${escapeHtml(competence.summary)}</p>
		<div class="objective-box">
			${renderObjectiveBox(competence)}
		</div>
		<div class="level-row">
			${levelPills}
			<span class="level-pill">Aufgaben öffnen</span>
		</div>
	`;
	card.addEventListener('click', () => startQuiz(competence.id));

	return card;
}

function renderCompetenceGrid() {
	competenceGrid.replaceChildren(
		...getCompetencies().map(createCompetenceCard),
	);
}

function renderQuizBadges(competence) {
	const practiceCount = getPracticeTaskCount(competence);

	quizBadges.innerHTML = `
		<span class="stat-pill">${competence.code} ${state.activeLevel === 'ALL' ? 'ALLE' : state.activeLevel}</span>
		<span class="stat-pill">${LEVEL_LABELS[state.activeLevel]}</span>
		<span class="stat-pill">${getQuestionTotalForCompetence(competence)} Aufgaben</span>
		${practiceCount ? `<span class="stat-pill">${practiceCount} Praxisaufgabe${practiceCount > 1 ? 'n' : ''}</span>` : ''}
	`;
}

function renderSingleChoiceQuestion(question, inputName, result) {
	const selectedIndex =
		typeof result?.answer === 'number' ? result.answer : null;
	const disabled = result ? 'disabled' : '';

	return `
		<div class="option-list">
			${question.options
				.map((option, optionIndex) => {
					let optionClass = 'option-label';

					if (result) {
						if (optionIndex === question.correctIndex) {
							optionClass += ' is-correct';
						} else if (optionIndex === selectedIndex) {
							optionClass += ' is-selected-wrong';
						}
					}

					const checked = selectedIndex === optionIndex ? 'checked' : '';

					return `
						<label class="${optionClass}">
							<input type="radio" name="${inputName}" value="${optionIndex}" ${checked} ${disabled} />
							<span>${escapeHtml(option)}</span>
						</label>
					`;
				})
				.join('')}
		</div>
	`;
}

function renderMultiSelectQuestion(question, inputName, result) {
	const selectedValues = Array.isArray(result?.answer) ? result.answer : [];
	const detailMap = new Map(
		(result?.details || []).map((detail) => [detail.option, detail]),
	);
	const disabled = result ? 'disabled' : '';

	return `
		<div class="option-list">
			${question.options
				.map((option) => {
					let optionClass = 'option-label';
					const detail = detailMap.get(option);

					if (result) {
						if (detail?.shouldBeSelected) {
							optionClass += ' is-correct';
						} else if (detail?.selected) {
							optionClass += ' is-selected-wrong';
						}
					}

					const checked = selectedValues.includes(option) ? 'checked' : '';

					return `
						<label class="${optionClass}">
							<input type="checkbox" name="${inputName}" value="${escapeHtml(option)}" ${checked} ${disabled} />
							<span>${escapeHtml(option)}</span>
						</label>
					`;
				})
				.join('')}
		</div>
	`;
}

function renderMappingQuestion(question, inputName, result) {
	const selectedValues = Array.isArray(result?.answer) ? result.answer : [];
	const details = result?.details || [];
	const disabled = result ? 'disabled' : '';

	return `
		<div class="mapping-list">
			${question.pairs
				.map((pair, index) => {
					const pairResult = details[index];
					const selectedValue = selectedValues[index] || '';
					const rowClass = pairResult
						? `mapping-row ${pairResult.isCorrect ? 'is-correct' : 'is-wrong'}`
						: 'mapping-row';

					return `
						<label class="${rowClass}">
							<span class="mapping-label">${escapeHtml(pair.label)}</span>
							<select name="${inputName}-${index}" ${disabled}>
								<option value="">Bitte wählen</option>
								${question.options
									.map((option) => {
										const selected =
											selectedValue === option ? 'selected' : '';
										return `<option value="${escapeHtml(option)}" ${selected}>${escapeHtml(option)}</option>`;
									})
									.join('')}
							</select>
						</label>
					`;
				})
				.join('')}
		</div>
	`;
}

function renderSequenceQuestion(question, inputName, result) {
	const selectedValues = Array.isArray(result?.answer) ? result.answer : [];
	const details = result?.details || [];
	const disabled = result ? 'disabled' : '';
	const positions = Array.from({ length: question.entries.length }, (_, index) =>
		String(index + 1),
	);

	return `
		<div class="sequence-list">
			${question.entries
				.map((entry, index) => {
					const entryResult = details[index];
					const selectedValue =
						selectedValues[index] === null || selectedValues[index] === undefined
							? ''
							: String(selectedValues[index]);
					const rowClass = entryResult
						? `sequence-row ${entryResult.isCorrect ? 'is-correct' : 'is-wrong'}`
						: 'sequence-row';

					return `
						<label class="${rowClass}">
							<span class="mapping-label">${escapeHtml(entry.label)}</span>
							<select name="${inputName}-${index}" ${disabled}>
								<option value="">Position</option>
								${positions
									.map((position) => {
										const selected =
											selectedValue === position ? 'selected' : '';
										return `<option value="${position}" ${selected}>${position}</option>`;
									})
									.join('')}
							</select>
						</label>
					`;
				})
				.join('')}
		</div>
	`;
}

function buildTemplateFromValues(question, values) {
	return question.template.replace(/\[\[([a-zA-Z0-9_-]+)\]\]/g, (_, id) => {
		return values?.[id] || '';
	});
}

function renderFillBlanksQuestion(question, inputName, result) {
	const values = result?.answer || {};
	const detailMap = result?.details || {};
	const disabled = result ? 'disabled' : '';
	const blankMap = new Map(question.blanks.map((blank) => [blank.id, blank]));
	const templateParts = question.template.split(/(\[\[[a-zA-Z0-9_-]+\]\])/g);

	return `
		<div class="fill-template">
			${templateParts
				.map((part) => {
					const match = part.match(/^\[\[([a-zA-Z0-9_-]+)\]\]$/);

					if (!match) {
						return formatTemplateText(part);
					}

					const blank = blankMap.get(match[1]);
					const selectedValue = values[blank.id] || '';
					const detail = detailMap[blank.id];
					const className = detail
						? `inline-select ${detail.isCorrect ? 'is-correct' : 'is-wrong'}`
						: 'inline-select';

					return `
						<select class="${className}" name="${inputName}-${blank.id}" ${disabled}>
							<option value="">...</option>
							${blank.options
								.map((option) => {
									const selected =
										selectedValue === option ? 'selected' : '';
									return `<option value="${escapeHtml(option)}" ${selected}>${escapeHtml(option)}</option>`;
								})
								.join('')}
						</select>
					`;
				})
				.join('')}
		</div>
	`;
}

function renderSqlWriteQuestion(question, inputName, result) {
	const value = result?.answer ?? question.starterText ?? '';
	const disabled = result ? 'disabled' : '';

	return `
		<div class="sql-editor-shell">
			<textarea class="sql-editor" name="${inputName}" spellcheck="false" ${disabled} placeholder="${escapeHtml(question.placeholder || 'SQL hier eingeben')}">${escapeHtml(value)}</textarea>
		</div>
	`;
}

function renderRecordFormQuestion(question, inputName, result) {
	const values = result?.answer || {};
	const details = result?.details || {};
	const disabled = result ? 'disabled' : '';

	return `
		<div class="record-form">
			${question.fields
				.map((field) => {
					const value = values[field.id] ?? '';
					const detail = details[field.id];
					const className = detail
						? `record-input ${detail.isCorrect ? 'is-correct' : 'is-wrong'}`
						: 'record-input';

					if (field.input === 'select') {
						return `
							<label class="record-field">
								<span>${escapeHtml(field.label)}</span>
								<select class="${className}" name="${inputName}-${field.id}" ${disabled}>
									<option value="">Bitte wählen</option>
									${field.options
										.map((option) => {
											const selected = value === option ? 'selected' : '';
											return `<option value="${escapeHtml(option)}" ${selected}>${escapeHtml(option)}</option>`;
										})
										.join('')}
								</select>
							</label>
						`;
					}

					return `
						<label class="record-field">
							<span>${escapeHtml(field.label)}</span>
							<input class="${className}" type="${field.input || 'text'}" name="${inputName}-${field.id}" value="${escapeHtml(value)}" placeholder="${escapeHtml(field.placeholder || '')}" ${disabled} />
						</label>
					`;
				})
				.join('')}
		</div>
	`;
}

function renderGridBuilderQuestion(question, inputName, result) {
	const details = result?.details || [];
	const disabled = result ? 'disabled' : '';

	return `
		<div class="grid-builder-shell">
			<table class="builder-table">
				<thead>
					<tr>
						<th>Element</th>
						${question.columns
							.map((column) => `<th>${escapeHtml(column.label)}</th>`)
							.join('')}
					</tr>
				</thead>
				<tbody>
					${question.rows
						.map((row, rowIndex) => {
							const rowDetail = details[rowIndex] || {};
							return `
								<tr>
									<th scope="row">${escapeHtml(row.label)}</th>
									${question.columns
										.map((column) => {
											const selectedValue =
												rowDetail.answers?.[column.id] ??
												row.defaultValues?.[column.id] ??
												'';
											const cellDetail = rowDetail.cells?.[column.id];
											const className = cellDetail
												? `builder-select ${cellDetail.isCorrect ? 'is-correct' : 'is-wrong'}`
												: 'builder-select';

											return `
												<td>
													<select class="${className}" name="${inputName}-${rowIndex}-${column.id}" ${disabled}>
														<option value="">Bitte wählen</option>
														${column.options
															.map((option) => {
																const selected =
																	selectedValue === option ? 'selected' : '';
																return `<option value="${escapeHtml(option)}" ${selected}>${escapeHtml(option)}</option>`;
															})
															.join('')}
													</select>
												</td>
											`;
										})
										.join('')}
								</tr>
							`;
						})
						.join('')}
				</tbody>
			</table>
		</div>
	`;
}

function renderQuestionInput(question, inputName, result) {
	switch (getQuestionType(question)) {
		case 'multi-select':
			return renderMultiSelectQuestion(question, inputName, result);
		case 'mapping':
			return renderMappingQuestion(question, inputName, result);
		case 'sequence':
			return renderSequenceQuestion(question, inputName, result);
		case 'fill-blanks':
			return renderFillBlanksQuestion(question, inputName, result);
		case 'sql-write':
			return renderSqlWriteQuestion(question, inputName, result);
		case 'record-form':
			return renderRecordFormQuestion(question, inputName, result);
		case 'grid-builder':
			return renderGridBuilderQuestion(question, inputName, result);
		default:
			return renderSingleChoiceQuestion(question, inputName, result);
	}
}

function renderSolutionList(items) {
	return `
		<div class="question-solution">
			<p class="question-solution-title">So wäre es korrekt:</p>
			<div class="solution-list">
				${items
					.map((item) => `<span class="solution-item">${item}</span>`)
					.join('')}
			</div>
		</div>
	`;
}

function renderQuestionSolution(question) {
	switch (getQuestionType(question)) {
		case 'multi-select':
			return renderSolutionList(
				question.correctValues.map((value) => escapeHtml(value)),
			);
		case 'mapping':
			return renderSolutionList(
				question.pairs.map(
					(pair) =>
						`${escapeHtml(pair.label)} -> ${escapeHtml(pair.correctValue)}`,
				),
			);
		case 'sequence':
			return renderSolutionList(
				[...question.entries]
					.sort((left, right) => left.correctPosition - right.correctPosition)
					.map(
						(entry) =>
							`${entry.correctPosition}. ${escapeHtml(entry.label)}`,
					),
			);
		case 'fill-blanks':
			return `
				<div class="question-solution">
					<p class="question-solution-title">So wäre das Statement korrekt:</p>
					<div class="fill-template is-solution">
						${formatTemplateText(
							buildTemplateFromValues(
								question,
								Object.fromEntries(
									question.blanks.map((blank) => [blank.id, blank.correctValue]),
								),
							),
						)}
					</div>
				</div>
			`;
		case 'sql-write':
			return `
				<div class="question-solution">
					<p class="question-solution-title">So könnte die SQL-Lösung aussehen:</p>
					<div class="fill-template is-solution">${formatTemplateText(question.solution || question.acceptedAnswers?.[0] || '')}</div>
				</div>
			`;
		case 'record-form':
			return renderSolutionList(
				question.fields.map(
					(field) => `${escapeHtml(field.label)} = ${escapeHtml(field.correctValue)}`,
				),
			);
		case 'grid-builder':
			return renderSolutionList(
				question.rows.map((row) => {
					const values = question.columns
						.map(
							(column) =>
								`${column.label}: ${row.correctValues[column.id]}`,
						)
						.join(' | ');
					return `${escapeHtml(row.label)} -> ${escapeHtml(values)}`;
				}),
			);
		default:
			return '';
	}
}

function renderQuestionFeedback(question, result) {
	if (!result) {
		return '';
	}

	const pointsText = formatPoints(result.earnedPoints, result.totalPoints);

	if (result.isCorrect) {
		return `<p class="question-feedback is-correct">${pointsText}. Richtig bearbeitet.</p>`;
	}

	if (getQuestionType(question) === 'single-choice') {
		return `<p class="question-feedback is-wrong">${pointsText}. Falsch. Richtig wäre: ${escapeHtml(question.options[question.correctIndex])}</p>`;
	}

	return `
		<div class="question-feedback is-wrong">
			<p>${pointsText}. Noch nicht vollständig korrekt gelöst.</p>
			${renderQuestionSolution(question)}
		</div>
	`;
}

function renderQuestionCard(competence, question, index, level) {
	const inputName = buildQuestionName(competence.id, level, index);
	const result = state.submission?.questionResults?.[inputName] || null;
	const questionType = getQuestionType(question);
	const questionLabel = isPracticeQuestion(question)
		? 'Praxisaufgabe'
		: 'Theoriefrage';

	return `
		<fieldset class="question-card">
			<legend>
				<span class="question-number">Aufgabe ${index + 1}</span>
				${escapeHtml(question.prompt)}
			</legend>
			<div class="question-meta">
				<span class="question-kind ${isPracticeQuestion(question) ? 'is-practice' : ''}">${questionLabel}</span>
				<span class="question-kind is-secondary">${TASK_TYPE_LABELS[questionType]}</span>
			</div>
			${question.helperText ? `<p class="question-helper">${escapeHtml(question.helperText)}</p>` : ''}
			${renderQuestionDiagram(question.diagram)}
			${renderReferenceTables(question.referenceTables)}
			${renderQuestionInput(question, inputName, result)}
			${renderQuestionFeedback(question, result)}
		</fieldset>
	`;
}

function renderResultPanel() {
	if (!state.submission) {
		resultPanel.hidden = true;
		resultPanel.className = 'result-panel';
		resultPanel.innerHTML = '';
		return;
	}

	const outcomeClass = state.submission.passed ? 'is-pass' : 'is-fail';
	const outcomeLabel = state.submission.passed
		? `${state.selectedCompetenceId + state.activeLevel} Bestanden`
		: `${state.selectedCompetenceId + state.activeLevel} Nicht bestanden`;

	resultPanel.hidden = false;
	resultPanel.className = `result-panel ${outcomeClass}`;
	resultPanel.innerHTML = `
		<h3>${outcomeLabel}: ${formatPoints(state.submission.earnedPoints, state.submission.totalPoints)}</h3>
		<p>Score: ${state.submission.percent.toFixed(1)}%. Zum Bestehen brauchst du mindestens ${state.quizData.passThreshold}%.</p>
		<div class="result-breakdown">
			<span class="result-chip">${LEVEL_LABELS[state.activeLevel]}</span>
			<span class="result-chip">${state.submission.totalPoints} Punkte möglich</span>
			${state.submission.perLevelMarkup}
		</div>
	`;
}

function renderQuiz() {
	const competence = getSelectedCompetence();

	if (!competence) {
		quizShell.classList.add('is-hidden');
		renderResultPanel();
		return;
	}

	const quizSections = getActiveLevels().map((level) => {
		const questions = getLevelQuestions(competence, level);
		const practiceCount = getPracticeTasks(competence.code, level).length;

		return `
			<section class="quiz-section">
				<div class="quiz-section-head">
					<div>
						<p class="level-label">${level}</p>
						<h3>${LEVEL_LABELS[level]}</h3>
					</div>
					<div class="level-row">
						<span class="stat-pill">${questions.length} Aufgaben</span>
						${practiceCount ? `<span class="stat-pill">${practiceCount} Praxisaufgabe${practiceCount > 1 ? 'n' : ''}</span>` : ''}
					</div>
				</div>
				<div class="question-list">
					${questions
						.map((question, index) =>
							renderQuestionCard(competence, question, index, level),
						)
						.join('')}
				</div>
			</section>
		`;
	});

	const practiceCount = getPracticeTaskCount(competence);
	const practiceHint = practiceCount
		? ` Diese Auswahl enthält ${practiceCount} Praxisaufgabe${practiceCount > 1 ? 'n' : ''} passend zur Kompetenzmatrix.`
		: '';

	quizShell.classList.remove('is-hidden');
	quizTitle.textContent = `${competence.code} ${competence.title}`;
	quizSummary.textContent =
		state.activeLevel === 'ALL'
			? `${competence.summary} Aktiver Übungsmodus: alle Schwierigkeitsstufen zusammen.${practiceHint}`
			: `${competence.summary} Aktive Stufe: ${LEVEL_LABELS[state.activeLevel]}.${practiceHint}`;
	quizObjective.innerHTML = renderObjectiveBox(competence, state.activeLevel, false);
	renderQuizBadges(competence);
	quizContent.innerHTML = quizSections.join('');
	submitButton.hidden = Boolean(state.submission);
	renderResultPanel();
}

function evaluateSingleChoiceQuestion(question, formData, inputName) {
	const selectedValue = formData.get(inputName);
	const answer = selectedValue === null ? null : Number(selectedValue);
	const isCorrect = answer === question.correctIndex;

	return {
		answer,
		isCorrect,
		earnedPoints: isCorrect ? 1 : 0,
		totalPoints: 1,
	};
}

function evaluateMultiSelectQuestion(question, formData, inputName) {
	const answer = formData.getAll(inputName);
	const correctValues = question.correctValues || [];
	const details = question.options.map((option) => ({
		option,
		selected: answer.includes(option),
		shouldBeSelected: correctValues.includes(option),
		isCorrect: answer.includes(option) === correctValues.includes(option),
	}));
	const earnedPoints = details.filter((detail) => detail.isCorrect).length;
	const totalPoints = details.length;

	return {
		answer,
		isCorrect: earnedPoints === totalPoints,
		earnedPoints,
		totalPoints,
		details,
	};
}

function evaluateMappingQuestion(question, formData, inputName) {
	const details = question.pairs.map((pair, index) => {
		const selectedValue = formData.get(`${inputName}-${index}`) || '';

		return {
			label: pair.label,
			selectedValue,
			correctValue: pair.correctValue,
			isCorrect: selectedValue === pair.correctValue,
		};
	});

	return {
		answer: details.map((detail) => detail.selectedValue),
		isCorrect: details.every((detail) => detail.isCorrect),
		earnedPoints: details.filter((detail) => detail.isCorrect).length,
		totalPoints: details.length,
		details,
	};
}

function evaluateSequenceQuestion(question, formData, inputName) {
	const details = question.entries.map((entry, index) => {
		const selectedValue = formData.get(`${inputName}-${index}`) || '';
		const selectedPosition = selectedValue === '' ? null : Number(selectedValue);

		return {
			label: entry.label,
			selectedPosition,
			correctPosition: entry.correctPosition,
			isCorrect: selectedPosition === entry.correctPosition,
		};
	});

	return {
		answer: details.map((detail) => detail.selectedPosition),
		isCorrect: details.every((detail) => detail.isCorrect),
		earnedPoints: details.filter((detail) => detail.isCorrect).length,
		totalPoints: details.length,
		details,
	};
}

function evaluateFillBlanksQuestion(question, formData, inputName) {
	const answer = {};
	const details = {};
	let earnedPoints = 0;

	question.blanks.forEach((blank) => {
		const selectedValue = formData.get(`${inputName}-${blank.id}`) || '';
		const blankIsCorrect = selectedValue === blank.correctValue;

		answer[blank.id] = selectedValue;
		details[blank.id] = {
			selectedValue,
			correctValue: blank.correctValue,
			isCorrect: blankIsCorrect,
		};

		if (blankIsCorrect) {
			earnedPoints += 1;
		}
	});

	const totalPoints = question.blanks.length;

	return {
		answer,
		isCorrect: earnedPoints === totalPoints,
		earnedPoints,
		totalPoints,
		details,
	};
}

function evaluateSqlWriteQuestion(question, formData, inputName) {
	const answer = formData.get(inputName) || '';
	const normalizedAnswer = normalizeSql(answer);
	const details = [
		...((question.requiredSnippets || []).map((snippet) => ({
			label: snippet,
			type: 'required',
			isCorrect: normalizedAnswer.includes(normalizeSql(snippet)),
		}))),
		...((question.forbiddenSnippets || []).map((snippet) => ({
			label: snippet,
			type: 'forbidden',
			isCorrect: !normalizedAnswer.includes(normalizeSql(snippet)),
		}))),
	];

	let earnedPoints = details.filter((detail) => detail.isCorrect).length;
	let totalPoints = details.length;

	if (!totalPoints) {
		const isExactMatch =
			Array.isArray(question.acceptedAnswers) &&
			question.acceptedAnswers.some(
				(candidate) => normalizeSql(candidate) === normalizedAnswer,
			);
		earnedPoints = isExactMatch ? 1 : 0;
		totalPoints = 1;
	}

	return {
		answer,
		isCorrect: earnedPoints === totalPoints,
		earnedPoints,
		totalPoints,
		details,
	};
}

function evaluateRecordFormQuestion(question, formData, inputName) {
	const answer = {};
	const details = {};
	let earnedPoints = 0;

	question.fields.forEach((field) => {
		const value = formData.get(`${inputName}-${field.id}`) || '';
		const fieldIsCorrect =
			normalizeValue(value) === normalizeValue(field.correctValue);

		answer[field.id] = value;
		details[field.id] = {
			value,
			correctValue: field.correctValue,
			isCorrect: fieldIsCorrect,
		};

		if (fieldIsCorrect) {
			earnedPoints += 1;
		}
	});

	const totalPoints = question.fields.length;

	return {
		answer,
		isCorrect: earnedPoints === totalPoints,
		earnedPoints,
		totalPoints,
		details,
	};
}

function evaluateGridBuilderQuestion(question, formData, inputName) {
	let earnedPoints = 0;
	const details = question.rows.map((row, rowIndex) => {
		const answers = {};
		const cells = {};
		let rowIsCorrect = true;

		question.columns.forEach((column) => {
			const value = formData.get(`${inputName}-${rowIndex}-${column.id}`) || '';
			const correctValue = row.correctValues[column.id];
			const cellIsCorrect = value === correctValue;

			answers[column.id] = value;
			cells[column.id] = {
				value,
				correctValue,
				isCorrect: cellIsCorrect,
			};

			if (cellIsCorrect) {
				earnedPoints += 1;
			} else {
				rowIsCorrect = false;
			}
		});

		return {
			answers,
			cells,
			isCorrect: rowIsCorrect,
		};
	});

	const totalPoints = question.rows.length * question.columns.length;

	return {
		answer: details.map((row) => row.answers),
		isCorrect: earnedPoints === totalPoints,
		earnedPoints,
		totalPoints,
		details,
	};
}

function evaluateQuestion(question, formData, inputName) {
	switch (getQuestionType(question)) {
		case 'multi-select':
			return evaluateMultiSelectQuestion(question, formData, inputName);
		case 'mapping':
			return evaluateMappingQuestion(question, formData, inputName);
		case 'sequence':
			return evaluateSequenceQuestion(question, formData, inputName);
		case 'fill-blanks':
			return evaluateFillBlanksQuestion(question, formData, inputName);
		case 'sql-write':
			return evaluateSqlWriteQuestion(question, formData, inputName);
		case 'record-form':
			return evaluateRecordFormQuestion(question, formData, inputName);
		case 'grid-builder':
			return evaluateGridBuilderQuestion(question, formData, inputName);
		default:
			return evaluateSingleChoiceQuestion(question, formData, inputName);
	}
}

function evaluateQuiz(event) {
	event.preventDefault();

	const competence = getSelectedCompetence();

	if (!competence) {
		return;
	}

	const formData = new FormData(quizForm);
	const questionResults = {};
	let earnedPoints = 0;
	let totalPoints = 0;
	const perLevelMarkup = getActiveLevels()
		.map((level) => {
			let levelEarned = 0;
			let levelTotal = 0;
			const questions = getLevelQuestions(competence, level);

			questions.forEach((question, index) => {
				const inputName = buildQuestionName(competence.id, level, index);
				const questionResult = evaluateQuestion(question, formData, inputName);

				questionResults[inputName] = questionResult;
				totalPoints += questionResult.totalPoints;
				earnedPoints += questionResult.earnedPoints;
				levelTotal += questionResult.totalPoints;
				levelEarned += questionResult.earnedPoints;
			});

			return getActiveLevels().length > 1
				? `<span class="result-chip">${LEVEL_LABELS[level]}: ${formatPoints(levelEarned, levelTotal)}</span>`
				: '';
		})
		.join('');

	const percent = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

	state.submission = {
		questionResults,
		earnedPoints,
		totalPoints,
		percent,
		passed: percent >= state.quizData.passThreshold,
		perLevelMarkup,
	};

	renderQuiz();
	resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function restartQuiz() {
	if (!state.selectedCompetenceId) {
		return;
	}

	state.submission = null;
	renderQuiz();
	quizShell.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function returnToOverview() {
	document
		.querySelector('.overview-panel')
		.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function loadQuizData() {
	const response = await fetch(DATA_URL);

	if (!response.ok) {
		throw new Error(
			`Quizdaten konnten nicht geladen werden (${response.status}).`,
		);
	}

	return response.json();
}

async function init() {
	try {
		state.quizData = await loadQuizData();
		syncDifficultyControls();
		renderOverviewStats();
		renderCompetenceGrid();
		renderQuiz();
	} catch (error) {
		console.error(error);
		overviewStats.innerHTML =
			'<span class="stat-pill">Quizdaten konnten nicht geladen werden</span>';
		competenceGrid.innerHTML =
			'<p class="section-copy">Bitte prüfe die JSON-Datei im data-Ordner.</p>';
	}
}

function buildOrthogonalRelationPath(points) {
	const { x1, y1, x2, y2, orientation } = points;

	if (orientation === 'horizontal') {
		const midX = (x1 + x2) / 2;
		const midY = (y1 + y2) / 2;

		return {
			path: `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`,

			// Beziehungstext etwas über der Linie
			labelX: midX,
			labelY: midY - 14,

			// Kardinalitäten direkt AUF der Linie
			fromCardX: x1 + (x2 > x1 ? 28 : -28),
			fromCardY: y1,
			toCardX: x2 + (x2 > x1 ? -28 : 28),
			toCardY: y2,
		};
	}

	const midX = (x1 + x2) / 2;
	const midY = (y1 + y2) / 2;

	return {
		path: `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`,

		// Beziehungstext etwas über dem mittleren horizontalen Segment
		labelX: midX,
		labelY: midY - 14,

		// Kardinalitäten direkt AUF der Linie
		fromCardX: x1,
		fromCardY: y1 + (y2 > y1 ? 28 : -28),
		toCardX: x2,
		toCardY: y2 + (y2 > y1 ? -28 : 28),
	};
}

function renderERDDiagram(diagram) {
	return '';
}

difficultySwitcher.addEventListener('click', (event) => {
	const button = event.target.closest('[data-level]');

	if (!button) {
		return;
	}

	changeDifficulty(button.dataset.level);
});

quizForm.addEventListener('submit', evaluateQuiz);
restartButton.addEventListener('click', restartQuiz);
backButton.addEventListener('click', returnToOverview);

init();

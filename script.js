const DATA_URL = './data/m164-quiz-data.json';
const LEVEL_ORDER = ['G', 'F', 'E'];
const LEVEL_LABELS = {
	G: 'Grundlagen',
	F: 'Fortgeschritten',
	E: 'Erweitert',
	ALL: 'Alle anzeigen',
};

const MATRIX_OBJECTIVES = {
	A1: {
		G: 'A1G: Ich kann die Elemente eines logisch relationalen ERD erläutern (z. B. Entitäten, Attribute, Beziehungen, Kardinalitäten...).',
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
		F: 'C3F: Ich kann die Auswirkungen von Löschen und Ändern von Daten auf die referenzielle Integrität erläutern.',
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

function getActiveLevels(level = state.activeLevel) {
	return level === 'ALL' ? LEVEL_ORDER : [level];
}

function getLevelQuestions(competence, level) {
	return competence.levels[level];
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
    <span class="stat-pill">${getQuestionTotalForLevel()} Fragen für ${label}</span>
    <span class="stat-pill">Bestanden nur über ${state.quizData.passThreshold}%</span>
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
        <p class="objective-label">${entryLevel} · ${LEVEL_LABELS[entryLevel]}</p>
        <p class="objective-text">${getObjective(competence.code, entryLevel)}</p>
      </div>
    `,
		).join('');
	}

	return `
    <div class="objective-entry">
      <p class="objective-label">${withTitle ? 'Kompetenzziel' : `${level} · ${LEVEL_LABELS[level]}`}</p>
      <p class="objective-text">${getObjective(competence.code, level)}</p>
    </div>
  `;
}

function createCompetenceCard(competence) {
	const card = document.createElement('button');
	const activeClass =
		state.selectedCompetenceId === competence.id ? ' is-active' : '';
	const levelPills =
		state.activeLevel === 'ALL'
			? `
      <span class="level-pill">G: ${competence.levels.G.length}</span>
      <span class="level-pill">F: ${competence.levels.F.length}</span>
      <span class="level-pill">E: ${competence.levels.E.length}</span>
      <span class="level-pill">${getQuestionTotalForCompetence(competence)} Fragen total</span>
    `
			: `
      <span class="level-pill">${LEVEL_LABELS[state.activeLevel]}</span>
      <span class="level-pill">${getQuestionTotalForCompetence(competence)} Fragen</span>
    `;

	card.type = 'button';
	card.className = `competence-card${activeClass}`;
	card.innerHTML = `
    <div>
      <p class="competence-meta">${competence.code} ${state.activeLevel === 'ALL' ? 'ALLE' : state.activeLevel}</p>
      <h3>${competence.title}</h3>
    </div>
    <p>${competence.summary}</p>
    <div class="objective-box">
      ${renderObjectiveBox(competence)}
    </div>
    <div class="level-row">
      ${levelPills}
      <span class="level-pill">Quiz starten</span>
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
	quizBadges.innerHTML = `
    <span class="stat-pill">${competence.code} ${state.activeLevel === 'ALL' ? 'ALLE' : state.activeLevel}</span>
    <span class="stat-pill">${LEVEL_LABELS[state.activeLevel]}</span>
    <span class="stat-pill">${getQuestionTotalForCompetence(competence)} Fragen</span>
  `;
}

function renderQuestionCard(competence, question, index, level) {
	const name = buildQuestionName(competence.id, level, index);
	const selectedIndex = state.submission
		? state.submission.answers[name]
		: null;
	const feedback = !state.submission
		? ''
		: selectedIndex === question.correctIndex
			? '<p class="question-feedback is-correct">Richtig beantwortet.</p>'
			: `<p class="question-feedback is-wrong">Falsch. Richtig wäre: ${question.options[question.correctIndex]}</p>`;

	const optionMarkup = question.options
		.map((option, optionIndex) => {
			let optionClass = 'option-label';

			if (state.submission) {
				if (optionIndex === question.correctIndex) {
					optionClass += ' is-correct';
				} else if (optionIndex === selectedIndex) {
					optionClass += ' is-selected-wrong';
				}
			}

			const checked = selectedIndex === optionIndex ? 'checked' : '';
			const disabled = state.submission ? 'disabled' : '';

			return `
        <label class="${optionClass}">
          <input type="radio" name="${name}" value="${optionIndex}" ${checked} ${disabled} />
          <span>${option}</span>
        </label>
      `;
		})
		.join('');

	return `
    <fieldset class="question-card">
      <legend>Frage ${index + 1}: ${question.prompt}</legend>
      <div class="option-list">${optionMarkup}</div>
      ${feedback}
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
		? 'Bestanden'
		: 'Nicht bestanden';

	resultPanel.hidden = false;
	resultPanel.className = `result-panel ${outcomeClass}`;
	resultPanel.innerHTML = `
    <h3>${outcomeLabel}: ${state.submission.correctCount}/${state.submission.total} richtig</h3>
    <p>Score: ${state.submission.percent.toFixed(1)}%. Zum Bestehen brauchst du mehr als ${state.quizData.passThreshold}%.</p>
    <div class="result-breakdown">
      <span class="result-chip">${LEVEL_LABELS[state.activeLevel]}</span>
      <span class="result-chip">${state.submission.total} Fragen ausgewertet</span>
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
		return `
    <section class="quiz-section">
      <div class="quiz-section-head">
        <div>
          <p class="level-label">${level}</p>
          <h3>${LEVEL_LABELS[level]}</h3>
        </div>
        <span class="stat-pill">${questions.length} Fragen</span>
      </div>
      <div class="question-list">
        ${questions.map((question, index) => renderQuestionCard(competence, question, index, level)).join('')}
      </div>
    </section>
  `;
	});

	quizShell.classList.remove('is-hidden');
	quizTitle.textContent = `${competence.code} ${competence.title}`;
	quizSummary.textContent =
		state.activeLevel === 'ALL'
			? `${competence.summary} Aktiver Quizmodus: alle Schwierigkeitsstufen zusammen.`
			: `${competence.summary} Aktive Quizstufe: ${LEVEL_LABELS[state.activeLevel]}.`;
	quizObjective.innerHTML = renderObjectiveBox(competence, state.activeLevel, false);
	renderQuizBadges(competence);
	quizContent.innerHTML = quizSections.join('');
	submitButton.hidden = Boolean(state.submission);
	renderResultPanel();
}

function evaluateQuiz(event) {
	event.preventDefault();

	const competence = getSelectedCompetence();

	if (!competence) {
		return;
	}

	const formData = new FormData(quizForm);
	const answers = {};
	let correctCount = 0;
	let total = 0;
	const perLevelMarkup = getActiveLevels()
		.map((level) => {
			let levelCorrect = 0;
			const questions = getLevelQuestions(competence, level);

			questions.forEach((question, index) => {
				const name = buildQuestionName(competence.id, level, index);
				const selectedValue = formData.get(name);
				const selectedIndex =
					selectedValue === null ? null : Number(selectedValue);

				answers[name] = selectedIndex;
				total += 1;

				if (selectedIndex === question.correctIndex) {
					correctCount += 1;
					levelCorrect += 1;
				}
			});

			return getActiveLevels().length > 1
				? `<span class="result-chip">${LEVEL_LABELS[level]}: ${levelCorrect}/${questions.length}</span>`
				: '';
		})
		.join('');

	const percent = (correctCount / total) * 100;

	state.submission = {
		answers,
		correctCount,
		total,
		percent,
		passed: percent > state.quizData.passThreshold,
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

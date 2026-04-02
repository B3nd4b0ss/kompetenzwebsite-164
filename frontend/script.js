const clockElement = document.querySelector('#clock');
const visitCountElement = document.querySelector('#visit-count');
const refreshButton = document.querySelector('#refresh-button');

function updateClock() {
  clockElement.textContent = new Date().toLocaleTimeString();
}

function updateVisits() {
  const nextCount = Number(localStorage.getItem('dashboard-static-visits') || '0') + 1;
  localStorage.setItem('dashboard-static-visits', String(nextCount));
  visitCountElement.textContent = String(nextCount);
}

refreshButton.addEventListener('click', updateClock);

updateClock();
updateVisits();

const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');

const dayError = document.getElementById('day-error');
const monthError = document.getElementById('month-error');
const yearError = document.getElementById('year-error');

const yearsDisplay = document.getElementById('years');
const monthsDisplay = document.getElementById('months');
const daysDisplay = document.getElementById('days');

const submitBtn = document.getElementById('submitBtn');
const ageForm = document.getElementById('ageForm');

function isLeapYear(year) {
  return ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0));
}

function daysInMonth(month, year) {
  return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

function isValidDate(day, month, year) {
  if (month < 1 || month > 12) return false;
  const maxDay = daysInMonth(month, year);
  if (day < 1 || day > maxDay) return false;
  return true;
}

function resetErrors() {
  dayError.textContent = '';
  monthError.textContent = '';
  yearError.textContent = '';
  [dayInput, monthInput, yearInput].forEach(input => {
    input.classList.remove('input-error');
    input.closest('label').classList.remove('error'); 
  });
}

function showError(input, errorElem, message) {
  errorElem.textContent = message;
  input.classList.add('input-error');
  input.closest('label').classList.add('error'); 
}

function calculateAge(day, month, year) {
  const today = new Date();
  let d1 = parseInt(day, 10);
  let m1 = parseInt(month, 10);
  let y1 = parseInt(year, 10);

  let d2 = today.getDate();
  let m2 = today.getMonth() + 1;
  let y2 = today.getFullYear();

  let years = y2 - y1;
  let months = m2 - m1;
  let days = d2 - d1;

  if (days < 0) {
    months -= 1;
    days += daysInMonth((m2 - 1 === 0 ? 12 : m2 - 1), (m2 - 1 === 0 ? y2 - 1 : y2));
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

submitBtn.addEventListener('click', function (e) {
  e.preventDefault();
  resetErrors();

  const day = dayInput.value.trim();
  const month = monthInput.value.trim();
  const year = yearInput.value.trim();

  let hasError = false;
  const currentYear = new Date().getFullYear();

  if (!day) {
    showError(dayInput, dayError, "This field is required");
    hasError = true;
  }
  if (!month) {
    showError(monthInput, monthError, "This field is required");
    hasError = true;
  }
  if (!year) {
    showError(yearInput, yearError, "This field is required");
    hasError = true;
  }

  if (hasError) {
    yearsDisplay.textContent = '--';
    monthsDisplay.textContent = '--';
    daysDisplay.textContent = '--';
    return;
  }

  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
    showError(dayInput, dayError, "Must be a valid day");
    hasError = true;
  }
  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    showError(monthInput, monthError, "Must be a valid month");
    hasError = true;
  }
  if (isNaN(yearNum) || yearNum > currentYear) {
    showError(yearInput, yearError, "Must be in the past");
    hasError = true;
  }

  if (hasError) {
    yearsDisplay.textContent = '--';
    monthsDisplay.textContent = '--';
    daysDisplay.textContent = '--';
    return;
  }

  if (!isValidDate(dayNum, monthNum, yearNum)) {
    showError(dayInput, dayError, "Must be a valid date");
    showError(monthInput, monthError, "");
    showError(yearInput, yearError, "");
    yearsDisplay.textContent = '--';
    monthsDisplay.textContent = '--';
    daysDisplay.textContent = '--';
    return;
  }

  const inputDate = new Date(yearNum, monthNum - 1, dayNum);
  const now = new Date();
  if (inputDate > now) {
    showError(yearInput, yearError, "Must be in the past");
    yearsDisplay.textContent = '--';
    monthsDisplay.textContent = '--';
    daysDisplay.textContent = '--';
    return;
  }

  const { years, months, days } = calculateAge(dayNum, monthNum, yearNum);
  yearsDisplay.textContent = years;
  monthsDisplay.textContent = months;
  daysDisplay.textContent = days;
});

['day', 'month', 'year'].forEach(id => {
  const input = document.getElementById(id);
  input.addEventListener('focus', () => {
    input.classList.add('input-focus');
  });
  input.addEventListener('blur', () => {
    input.classList.remove('input-focus');
  });
});

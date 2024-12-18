document.getElementById('calculateBtn').addEventListener('click', calculateLoan);

function calculateLoan() {
  const loanAmount = parseFloat(document.getElementById('loanAmount').value);
  const annualInterestRate = parseFloat(document.getElementById('interestRate').value) / 100;
  const loanTermYears = parseInt(document.getElementById('loanTermYears').value) || 0;
  const loanTermMonths = parseInt(document.getElementById('loanTermMonths').value) || 0;
  const scheduleType = document.getElementById('scheduleType').value;

  if (isNaN(loanAmount) || isNaN(annualInterestRate) || (loanTermYears === 0 && loanTermMonths === 0)) {
    alert("Please enter valid input values.");
    return;
  }

  const totalMonths = loanTermYears * 12 + loanTermMonths;
  const monthlyRate = annualInterestRate / 12;

  const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
  const yearlyPayment = monthlyPayment * 12;

  displayPayments(monthlyPayment, yearlyPayment, scheduleType);

  const monthlySchedule = generateAmortizationSchedule(loanAmount, monthlyRate, monthlyPayment, totalMonths, "monthly");
  const yearlySchedule = generateAmortizationSchedule(loanAmount, annualInterestRate, yearlyPayment, Math.ceil(totalMonths / 12), "yearly");

  displayAmortizationSchedule(scheduleType === "monthly" ? monthlySchedule : yearlySchedule, scheduleType);
}

function displayPayments(monthlyPayment, yearlyPayment, scheduleType) {
  const paymentSection = document.getElementById('PaymentSection');
  const paymentHeading = paymentSection.querySelector('h2');

  if (scheduleType === "monthly") {
    paymentHeading.textContent = "Monthly Payment";
    document.getElementById('monthlyPayment').textContent = `$${monthlyPayment.toFixed(2)}`;
    document.getElementById('monthlyPayment').style.display = 'block';
    document.getElementById('yearlyPayment').style.display = 'none';
  } else if (scheduleType === "yearly") {
    paymentHeading.textContent = "Yearly Payment";
    document.getElementById('yearlyPayment').textContent = `$${yearlyPayment.toFixed(2)}`;
    document.getElementById('yearlyPayment').style.display = 'block';
    document.getElementById('monthlyPayment').style.display = 'none';
  }

  paymentSection.style.display = 'block';
}

function generateAmortizationSchedule(loanAmount, rate, payment, periods, type) {
  const schedule = [];
  let balance = loanAmount;

  for (let period = 1; period <= periods; period++) {
    const interest = balance * rate;
    const principal = payment - interest;
    balance -= principal;

    const periodLabel = type === "monthly" ? `Month ${period}` : `Year ${period}`;

    schedule.push({
      period: periodLabel,
      payment: payment.toFixed(2),
      interest: interest.toFixed(2),
      principal: principal.toFixed(2),
      balance: Math.max(balance, 0).toFixed(2),
    });

    if (balance <= 0) break;
  }

  return schedule;
}

function displayAmortizationSchedule(schedule, type) {
  const scheduleBody = document.getElementById('schedule');
  scheduleBody.innerHTML = '';

  const fragment = document.createDocumentFragment();

  schedule.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.period}</td>
      <td>${item.payment}</td>
      <td>${item.interest}</td>
      <td>${item.principal}</td>
      <td>${item.balance}</td>
    `;
    fragment.appendChild(row);
  });

  scheduleBody.appendChild(fragment);
  document.getElementById('results').style.display = 'block';
}
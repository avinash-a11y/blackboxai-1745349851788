const donorForm = document.getElementById('donorForm');
const receiverForm = document.getElementById('receiverForm');
const donorsList = document.getElementById('donorsList');
const receiversList = document.getElementById('receiversList');

const API_BASE = 'http://localhost:3000/api';

// Helper to create list item for donor/receiver
function createListItem(person) {
  const li = document.createElement('li');
  li.className = 'border border-gray-300 rounded p-3 bg-gray-50 hover:bg-gray-100 transition';
  li.innerHTML = `
    <p><strong>Name:</strong> ${person.name}</p>
    <p><strong>Email:</strong> ${person.email}</p>
    <p><strong>Phone:</strong> ${person.phone}</p>
    <p><strong>Blood Group:</strong> ${person.blood_group}</p>
    <p><strong>City:</strong> ${person.city}</p>
  `;
  return li;
}

// Fetch and display donors
async function loadDonors() {
  donorsList.innerHTML = '<li>Loading donors...</li>';
  try {
    const res = await fetch(`${API_BASE}/donors`);
    const donors = await res.json();
    donorsList.innerHTML = '';
    if (donors.length === 0) {
      donorsList.innerHTML = '<li>No donors found.</li>';
      return;
    }
    donors.forEach(donor => {
      donorsList.appendChild(createListItem(donor));
    });
  } catch (err) {
    donorsList.innerHTML = '<li>Error loading donors.</li>';
  }
}

// Fetch and display receivers
async function loadReceivers() {
  receiversList.innerHTML = '<li>Loading receivers...</li>';
  try {
    const res = await fetch(`${API_BASE}/receivers`);
    const receivers = await res.json();
    receiversList.innerHTML = '';
    if (receivers.length === 0) {
      receiversList.innerHTML = '<li>No receivers found.</li>';
      return;
    }
    receivers.forEach(receiver => {
      receiversList.appendChild(createListItem(receiver));
    });
  } catch (err) {
    receiversList.innerHTML = '<li>Error loading receivers.</li>';
  }
}

// Handle donor form submission
donorForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const donorData = {
    name: donorForm.donorName.value.trim(),
    email: donorForm.donorEmail.value.trim(),
    phone: donorForm.donorPhone.value.trim(),
    blood_group: donorForm.donorBloodGroup.value,
    city: donorForm.donorCity.value.trim()
  };
  try {
    const res = await fetch(\`\${API_BASE}/donors\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donorData)
    });
    if (!res.ok) throw new Error('Failed to add donor');
    donorForm.reset();
    loadDonors();
    alert('Donor registered successfully!');
  } catch (err) {
    alert('Error registering donor. Please try again.');
  }
});

// Handle receiver form submission
receiverForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const receiverData = {
    name: receiverForm.receiverName.value.trim(),
    email: receiverForm.receiverEmail.value.trim(),
    phone: receiverForm.receiverPhone.value.trim(),
    blood_group: receiverForm.receiverBloodGroup.value,
    city: receiverForm.receiverCity.value.trim()
  };
  try {
    const res = await fetch(\`\${API_BASE}/receivers\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(receiverData)
    });
    if (!res.ok) throw new Error('Failed to add receiver');
    receiverForm.reset();
    loadReceivers();
    alert('Receiver registered successfully!');
  } catch (err) {
    alert('Error registering receiver. Please try again.');
  }
});

const donorForm = document.getElementById('donorForm');
const receiverForm = document.getElementById('receiverForm');
const donorsList = document.getElementById('donorsList');
const receiversList = document.getElementById('receiversList');

const donorChartCtx = document.getElementById('donorChart').getContext('2d');
const receiverChartCtx = document.getElementById('receiverChart').getContext('2d');

const API_BASE = 'http://localhost:3000/api';

let donorChart;
let receiverChart;

// Helper to create list item for donor/receiver
function createListItem(person) {
  const li = document.createElement('li');
  li.className = 'border border-gray-300 rounded p-3 bg-gray-50 hover:bg-gray-100 transition';
  li.innerHTML = `
    <p><strong>Name:</strong> ${person.name}</p>
    <p><strong>Email:</strong> ${person.email}</p>
    <p><strong>Phone:</strong> ${person.phone}</p>
    <p><strong>Blood Group:</strong> ${person.blood_group}</p>
    <p><strong>City:</strong> ${person.city}</p>
  `;
  return li;
}

// Fetch and display donors
async function loadDonors() {
  donorsList.innerHTML = '<li>Loading donors...</li>';
  try {
    const res = await fetch(`${API_BASE}/donors`);
    const donors = await res.json();
    donorsList.innerHTML = '';
    if (donors.length === 0) {
      donorsList.innerHTML = '<li>No donors found.</li>';
      return;
    }
    donors.forEach(donor => {
      donorsList.appendChild(createListItem(donor));
    });
  } catch (err) {
    donorsList.innerHTML = '<li>Error loading donors.</li>';
  }
}

// Fetch and display receivers
async function loadReceivers() {
  receiversList.innerHTML = '<li>Loading receivers...</li>';
  try {
    const res = await fetch(`${API_BASE}/receivers`);
    const receivers = await res.json();
    receiversList.innerHTML = '';
    if (receivers.length === 0) {
      receiversList.innerHTML = '<li>No receivers found.</li>';
      return;
    }
    receivers.forEach(receiver => {
      receiversList.appendChild(createListItem(receiver));
    });
  } catch (err) {
    receiversList.innerHTML = '<li>Error loading receivers.</li>';
  }
}

// Fetch blood group distribution data and render charts
async function loadCharts() {
  try {
    const donorRes = await fetch(`${API_BASE}/donors/blood-group-distribution`);
    const donorData = await donorRes.json();
    const receiverRes = await fetch(`${API_BASE}/receivers/blood-group-distribution`);
    const receiverData = await receiverRes.json();

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const donorCounts = bloodGroups.map(bg => {
      const found = donorData.find(d => d.blood_group === bg);
      return found ? found.count : 0;
    });

    const receiverCounts = bloodGroups.map(bg => {
      const found = receiverData.find(d => d.blood_group === bg);
      return found ? found.count : 0;
    });

    if (donorChart) donorChart.destroy();
    donorChart = new Chart(donorChartCtx, {
      type: 'bar',
      data: {
        labels: bloodGroups,
        datasets: [{
          label: 'Donors',
          data: donorCounts,
          backgroundColor: 'rgba(220, 38, 38, 0.7)',
          borderColor: 'rgba(220, 38, 38, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, precision: 0 }
        }
      }
    });

    if (receiverChart) receiverChart.destroy();
    receiverChart = new Chart(receiverChartCtx, {
      type: 'bar',
      data: {
        labels: bloodGroups,
        datasets: [{
          label: 'Receivers',
          data: receiverCounts,
          backgroundColor: 'rgba(37, 99, 235, 0.7)',
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, precision: 0 }
        }
      }
    });
  } catch (err) {
    console.error('Error loading charts:', err);
  }
}

// Handle donor form submission
donorForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const donorData = {
    name: donorForm.donorName.value.trim(),
    email: donorForm.donorEmail.value.trim(),
    phone: donorForm.donorPhone.value.trim(),
    blood_group: donorForm.donorBloodGroup.value,
    city: donorForm.donorCity.value.trim()
  };
  try {
    const res = await fetch(`${API_BASE}/donors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donorData)
    });
    if (!res.ok) throw new Error('Failed to add donor');
    donorForm.reset();
    loadDonors();
    loadCharts();
    alert('Donor registered successfully!');
  } catch (err) {
    alert('Error registering donor. Please try again.');
  }
});

// Handle receiver form submission
receiverForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const receiverData = {
    name: receiverForm.receiverName.value.trim(),
    email: receiverForm.receiverEmail.value.trim(),
    phone: receiverForm.receiverPhone.value.trim(),
    blood_group: receiverForm.receiverBloodGroup.value,
    city: receiverForm.receiverCity.value.trim()
  };
  try {
    const res = await fetch(`${API_BASE}/receivers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(receiverData)
    });
    if (!res.ok) throw new Error('Failed to add receiver');
    receiverForm.reset();
    loadReceivers();
    loadCharts();
    alert('Receiver registered successfully!');
  } catch (err) {
    alert('Error registering receiver. Please try again.');
  }
});

// Initial load
loadDonors();
loadReceivers();
loadCharts();

const defaultTimeZones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];
let activeTimeZones = defaultTimeZones;

document.addEventListener('DOMContentLoaded', function() {
    loadTimeZonesFromStorage();
    initializeClocks();
    updateClocks();
    setInterval(updateClocks, 1000);
});

function initializeClocks() {
    const grid = document.getElementById('clocksGrid');
    grid.innerHTML = '';
    activeTimeZones.forEach(tz => {
        createClockCard(tz);
    });
}

function createClockCard(timezone) {
    const grid = document.getElementById('clocksGrid');
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.id = `clock-${timezone}`;
    card.innerHTML = `
        <div class="clock-content">
            <div class="timezone-name">${formatTimezoneName(timezone)}</div>
            <div class="time-display" id="time-${timezone}">00:00:00</div>
            <div class="date-display" id="date-${timezone}">Loading...</div>
            <div class="am-pm" id="ampm-${timezone}"></div>
            <button class="remove-btn" onclick="removeTimezone('${timezone}')">Remove</button>
        </div>
    `;
    grid.appendChild(card);
}

function updateClocks() {
    activeTimeZones.forEach(tz => {
        updateClock(tz);
    });
}

function updateClock(timezone) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const timeString = formatter.format(now);
    const dateString = dateFormatter.format(now);
    const timeParts = timeString.split(' ');
    const timeOnly = timeParts[0];
    const ampm = timeParts[1];
    const timeElement = document.getElementById(`time-${timezone}`);
    const dateElement = document.getElementById(`date-${timezone}`);
    const ampmElement = document.getElementById(`ampm-${timezone}`);
    if (timeElement) timeElement.textContent = timeOnly;
    if (dateElement) dateElement.textContent = dateString;
    if (ampmElement) ampmElement.textContent = ampm;
}

function formatTimezoneName(tz) {
    const parts = tz.split('/');
    if (parts.length === 1) return tz;
    let name = parts[parts.length - 1].replace(/_/g, ' ');
    if (parts[0]) name += ` (${parts[0].split('_')[0]})`;
    return name;
}

function addTimezone() {
    const select = document.getElementById('timezone-select');
    const timezone = select.value;
    if (!timezone) {
        alert('Please select a time zone');
        return;
    }
    if (activeTimeZones.includes(timezone)) {
        alert('This time zone is already displayed');
        return;
    }
    activeTimeZones.push(timezone);
    saveTimeZonesToStorage();
    createClockCard(timezone);
    updateClock(timezone);
    select.value = '';
}

function removeTimezone(timezone) {
    activeTimeZones = activeTimeZones.filter(tz => tz !== timezone);
    saveTimeZonesToStorage();
    const card = document.getElementById(`clock-${timezone}`);
    if (card) card.remove();
}

function resetClocks() {
    activeTimeZones = defaultTimeZones;
    saveTimeZonesToStorage();
    initializeClocks();
    updateClocks();
}

function saveTimeZonesToStorage() {
    localStorage.setItem('activeTimeZones', JSON.stringify(activeTimeZones));
}

function loadTimeZonesFromStorage() {
    const stored = localStorage.getItem('activeTimeZones');
    if (stored) {
        try {
            activeTimeZones = JSON.parse(stored);
        } catch (e) {
            activeTimeZones = defaultTimeZones;
        }
    }
}
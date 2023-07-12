// Show loading screen while fetching weather data
function showLoadingScreen() {
    document.getElementById('loading-screen').classList.remove('hidden');
}

// Hide loading screen after fetching weather data
function hideLoadingScreen() {
    document.getElementById('loading-screen').classList.add('hidden');
}

// Fetch weather data from API
function fetchWeatherData(location) {
    showLoadingScreen();

    // Make an API call to retrieve weather data for the location
    const apiKey = 'd9e1dae90b0f67a48a9a4778533117e2';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    // Use fetch or any AJAX library to make the request
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process the weather data and update the UI
            updateWeatherDisplay(data);
            hideLoadingScreen();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            hideLoadingScreen();
        });
}

// Update the weather display
function updateWeatherDisplay(data) {
    const weatherDisplay = document.getElementById('weather-display');
    const locationName = document.getElementById('location-name');
    const temperature = document.getElementById('temperature');
    const condition = document.getElementById('condition');
    const currentTime = document.getElementById('current-time');

    // Extract relevant data from the API response
    const location = data.name;
    const tempC = data.main.temp;
    const conditionText = data.weather[0].description;
    const currentTimestamp = data.dt;
    const timezoneOffset = data.timezone;

    // Update the UI
    locationName.textContent = location;
    temperature.textContent = `Temperature: ${tempC}°C`;
    condition.textContent = `Condition: ${conditionText}`;

    // Update current time
    const currentDate = new Date((currentTimestamp + timezoneOffset) * 1000);
    currentTime.textContent = `Current Time: ${currentDate.toLocaleString()}`;

    // Show the weather display
    weatherDisplay.classList.remove('hidden');
}

// Handle form submission
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent page reload on form submission

    const searchInput = document.getElementById('search-input');
    const location = searchInput.value.trim();

    if (location !== '') {
        fetchWeatherData(location);
        searchInput.value = '';
        hideSuggestions();
    }
});

// Handle input change
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', function () {
    const inputValue = this.value.trim();

    if (inputValue.length >= 2) {
        fetchLocationSuggestions(inputValue);
    } else {
        hideSuggestions();
    }
});

// Fetch location suggestions
function fetchLocationSuggestions(query) {
    const apiKey = 'd9e1dae90b0f67a48a9a4778533117e2';
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayLocationSuggestions(data);
        })
        .catch(error => {
            console.error('Error fetching location suggestions:', error);
            hideSuggestions();
        });
}

// Display location suggestions
function displayLocationSuggestions(locations) {
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';

    if (locations.length > 0) {
        locations.forEach(location => {
            const listItem = document.createElement('li');
            listItem.textContent = location.name;
            listItem.classList.add('cursor-pointer', 'hover:bg-gray-700', 'px-4', 'py-2');

            listItem.addEventListener('click', function () {
                const selectedLocation = this.textContent;
                fetchWeatherData(selectedLocation);
                hideSuggestions();
            });

            suggestionsList.appendChild(listItem);
        });

        suggestionsList.classList.remove('hidden');
    } else {
        hideSuggestions();
    }
}

// Hide location suggestions
function hideSuggestions() {
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';
    suggestionsList.classList.add('hidden');
}  
const API_KEY = window.API_KEYS.UNSPLASH;
const WEATHER_KEY = window.API_KEYS.WEATHER;

const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');  
const menuLinks = menu.getElementsByTagName('a'); 
menuBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    menuBtn.classList.toggle('open');
    if (menuBtn.classList.contains('open')) {
        menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
}); 
Array.from(menuLinks).forEach(link => {
    link.addEventListener('click', () => {
        if (!menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
            menuBtn.classList.remove('open');
            menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });
});


// Search using the value in the input with id "city-input"
async function searchCity() {
    const city = document.getElementById('city-input').value.trim();
    const errorEl = document.getElementById('error-message');
    const cityPhoto = document.getElementById('city-photo');
    const cityImage = document.getElementById('city-image');
    const weatherCard = document.getElementById('weather-card');

    // hide UI blocks until we have results
    errorEl.classList.add('hidden');
    cityPhoto.classList.add('hidden');
    weatherCard.classList.add('hidden');

    if (!city) {
        errorEl.classList.remove('hidden');
        return;
    }

    console.log(`Searching for city: ${city}`);

    // Fetch image from Unsplash
    try {
        const imgResponse = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&client_id=${API_KEY}`);
        const imgData = await imgResponse.json();
        if (imgData.results && imgData.results.length > 0) {
            cityImage.src = imgData.results[0].urls.regular;
            cityPhoto.classList.remove('hidden');
        } else {
            console.warn('No images found for this city.');
        }
    } catch (error) {
        console.error('Error fetching image:', error);
    }

    // Fetch weather from OpenWeatherMap
    try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_KEY}&units=metric`);
        const weatherData = await weatherResponse.json();
        console.log('Weather Data:', weatherData);

        if (weatherData.cod === 200) {
            document.getElementById('city-name').innerText = weatherData.name;
            // the HTML already contains labels, so set only the numeric values
            document.getElementById('temperature').innerText = weatherData.main.temp;
            document.getElementById('humidity').innerText = weatherData.main.humidity;
            document.getElementById('wind-speed').innerText = weatherData.wind.speed;
            weatherCard.classList.remove('hidden');
        } else {
            alert('City not found. Please check the city name and try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('An error occurred while fetching weather data. Please try again later.');
    }
}

function filterDestinations() {
    const filter = document.getElementById('search-input').value.toLowerCase();
    const destinations = document.getElementsByClassName('destination');
    Array.from(destinations).forEach(destination => {
        if (destination.innerText.toLowerCase().includes(filter)) {
            destination.classList.remove('hidden');
        } else {
            destination.classList.add('hidden');
        }
    });
}

function displayImage(url) {
    const imgElement = document.getElementById('city-image');
    imgElement.src = url;
    document.getElementById('city-photo').classList.remove('hidden');
}

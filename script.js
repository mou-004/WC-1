const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

$(document).ready(function () {
  weatherFn('Noida');

  $('#city-input-btn').click(function () {
    const city = $('#city-input').val();
    weatherFn(city);
  });
});

async function weatherFn(cName) {
  const apiURL = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
  try {
    const res = await fetch(apiURL);
    const data = await res.json();
    if (res.ok) {
      weatherShowFn(data);
    } else {
      alert('City not found. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function weatherShowFn(data) {
  $('#city-name').text(data.name);
  $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
  $('#temperature').html(`🌡 ${Math.round(data.main.temp)}°C`);
  $('#feels-like').html(`🔥 Feels Like: ${Math.round(data.main.feels_like)}°C`);
  $('#description').text(data.weather[0].description);
  $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
  $('#weather-icon').attr('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
  $('#weather-info').fadeIn();

  // Clothing suggestion
  const suggestion = getClothingSuggestion(data.main.temp, data.wind.speed);
  $('#weather-suggestion').text(suggestion);

  // Music links
  const musicURL = getMusicLink(data.weather[0].main);
  const ytURL = getYouTubeLink(data.weather[0].main);
  $('#music-link').attr('href', musicURL).show();
  $('#youtube-link').attr('href', ytURL).show();

  // Weather pet image
  $('#weather-pet-img').attr('src', getPetImage(data.weather[0].main)).show();

  // Update map
  updateMap(data.coord.lat, data.coord.lon);
}

function getClothingSuggestion(temp, wind) {
  if (temp < 5) return "❄️ It's freezing! Wear a heavy coat, gloves, and scarf.";
  if (temp < 15) return "🌬 It's cold and windy — Don’t forget your hoodie!";
  if (temp < 25) return "🌤 It's mild. A t-shirt with a light jacket works.";
  return "☀️ It's hot! Stay cool with light clothes and sunglasses.";
}

function getMusicLink(condition) {
  const cond = condition.toLowerCase();
  if (cond.includes('rain')) return "https://open.spotify.com/playlist/37i9dQZF1DXbvABJXBIyiY";
  if (cond.includes('snow')) return "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO";
  if (cond.includes('clear') || cond.includes('sun')) return "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC";
  return "https://open.spotify.com/playlist/37i9dQZF1DWUvHZA1zLcjW";
}

function getYouTubeLink(condition) {
  const cond = condition.toLowerCase();
  if (cond.includes("rain"))
    return "https://www.youtube.com/playlist?list=PLKpOiDpk2rt6lDAjrmXDRu9_kbWqSSSkC";
  if (cond.includes("snow"))
    return "https://www.youtube.com/playlist?list=PLzAUjV1U9k2P9dy93J3Zb7U4Lz7crhZ5k";
  if (cond.includes("clear") || cond.includes("sun"))
    return "https://www.youtube.com/playlist?list=PLH6wlw4DxXDFuFTlsVP_3FKwbJdy9C_Rr";
  return "https://www.youtube.com/playlist?list=PL4fGSI1pDJn7v7vNkpvRvdQWchUjGgYMi";
}

function getPetImage(condition) {
  const cond = condition.toLowerCase();
  if (cond.includes("rain"))
    return "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif";
  if (cond.includes("snow"))
    return "https://media.giphy.com/media/QvBoMEcQ7DQXK/giphy.gif";
  if (cond.includes("clear") || cond.includes("sun"))
    return "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif";
  return "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif";
}

function updateMap(lat, lon) {
  const mapFrame = `
    <iframe
      width="100%"
      height="300"
      frameborder="0"
      style="border:0; border-radius: 15px; margin-top: 20px;"
      src="https://www.openstreetmap.org/export/embed.html?bbox=${lon - 1}%2C${lat - 1}%2C${lon + 1}%2C${lat + 1}&layer=mapnik&marker=${lat}%2C${lon}"
      allowfullscreen>
    </iframe>`;
  $('#map').html(mapFrame);
}


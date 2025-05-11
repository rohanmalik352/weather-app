let btn = document.querySelector("button");
const apiKey = "4a48358afcab4fa7b2a4f59955396f58";

btn.addEventListener("click", async () => {
    let city = document.querySelector("input").value.trim();
    if (!city) return alert("Please enter a city name.");
    console.log("User entered:", city);
    await getTemperature(city);
});

async function getTemperature(city) {
    try {

        let geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKey}`;
        let geoRes = await axios.get(geoUrl);
        if (geoRes.data.results.length === 0) throw new Error("Location not found");

        let { lat, lng } = geoRes.data.results[0].geometry;

        let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`;
        let weatherRes = await axios.get(weatherUrl);

        let weather = weatherRes.data.current_weather;
        let code = weather.weathercode;
        let currentTime = weather.time;

      
        let humidityIndex = weatherRes.data.hourly.time.findIndex(t =>
            t.startsWith(currentTime.slice(0, 13)) 
        );
        let humidity = humidityIndex !== -1 ? weatherRes.data.hourly.relativehumidity_2m[humidityIndex] : "N/A";

        const imageMap = {
            0: "clear.png", 1: "clear.png", 2: "clouds.png", 3: "clouds.png",
            45: "mist.png", 48: "mist.png", 51: "drizzle.png", 53: "drizzle.png",
            55: "drizzle.png", 56: "drizzle.png", 57: "drizzle.png",
            61: "rain.png", 63: "rain.png", 65: "rain.png",
            66: "rain.png", 67: "rain.png", 71: "snow.png",
            73: "snow.png", 75: "snow.png", 77: "snow.png",
            80: "rain.png", 81: "rain.png", 82: "rain.png",
            85: "snow.png", 86: "snow.png", 95: "rain.png",
            96: "rain.png", 99: "rain.png"
        };

        let imageName = imageMap[code] || "default.png";

       
        document.getElementById("weather-output").innerHTML = `
            <img src="weather-image/${imageName}" alt="Weather Icon" width="80"><br>
            <p><strong>${city.charAt(0).toUpperCase() + city.slice(1)}</strong></p>
            <p>🌡️ Temperature: ${weather.temperature}°C</p>
            <p><img src="humidity.png" width="30" style="vertical-align: middle;"> Humidity: ${humidity}%</p>
            <p><img src="wind.png" width="30" style="vertical-align: middle;"> Wind Speed: ${weather.windspeed} km/h</p>
        `;
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("weather-output").innerText = "❌ Could not fetch weather data. Please check the city name.";
    }
}

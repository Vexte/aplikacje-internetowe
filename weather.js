const xhr = new XMLHttpRequest();

const weather_button = document.getElementById("weather-button");
const address_input = document.getElementById("address-input");
const forecast_list = document.getElementById("forecast-list");
const location_name = document.getElementById("location-name");

address_input.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
	  event.preventDefault();
	  weather_button.click();
	}
});

function make_weather_tile(id, time, icon_src, description, temperature, feels_like, pressure, humidity)
{
	const weather_tile = document.createElement("div");
	weather_tile.className = "weather-tile";
	weather_tile.id = id;

	const desc_elem = document.createElement("div");
	desc_elem.className = "weather-desc-elem";

	const icon = document.createElement("img");
	icon.className = "weather-icon";
	icon.alt = "icon";
	icon.src = icon_src;
	desc_elem.appendChild(icon);

	const desc_text = document.createElement("span");
	desc_text.textContent = description;
	desc_elem.appendChild(desc_text);

	weather_tile.appendChild(desc_elem);

	const data_elem = document.createElement("div");
	data_elem.className = "weather-data-elem";

	const time_elem = document.createElement("time");
	time_elem.textContent = time;
	data_elem.appendChild(time_elem);

	const temp_elem = document.createElement("div");
	temp_elem.className = "weather-temp";
	const temp_text = document.createElement("span");
	temp_text.textContent = "Temperature: " + temperature;
	temp_elem.appendChild(temp_text);
	const feels_like_text = document.createElement("span");
	feels_like_text.textContent = "Feels like: " + feels_like;
	temp_elem.appendChild(feels_like_text);
	
	data_elem.appendChild(temp_elem);

	const pres_elem = document.createElement("div");
	pres_elem.className = "weather-pres";
	const pres_text = document.createElement("span");
	pres_text.textContent = "Pressure: " + pressure;
	pres_elem.appendChild(pres_text);

	data_elem.appendChild(pres_elem);

	const humi_elem = document.createElement("div");
	humi_elem.className = "weather-humi";
	const humi_text = document.createElement("span");
	humi_text.textContent = "Humidity: " + humidity;
	humi_elem.appendChild(humi_text);

	data_elem.appendChild(humi_elem);

	weather_tile.appendChild(data_elem);

	return weather_tile;
}

function display_current_weather_data(lat, lon)
{
	const current_weather_div = document.getElementById("current-weather");

	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
	xhr.open("GET", url, true);
	xhr.responseType = "json";

	xhr.onload = () => {
		const json_response = xhr.response;
		if (json_response.weather.length === 0)
		{
			alert("Weather data not available");
			return;
		}

		const json_weather = json_response.weather[0];
		const json_main =  json_response.main;

		const date = new Date(json_response.dt * 1000);

		const weather_tile = make_weather_tile(
			current_weather_div.id,
			date.toLocaleString(),
			`https://openweathermap.org/img/wn/${json_weather.icon}@2x.png`,
			json_weather.description[0].toUpperCase() + json_weather.description.slice(1),
			json_main.temp + " °C",  json_main.feels_like + " °C",
			json_main.pressure + " hPa",  json_main.humidity + " %"
		)

		current_weather_div.replaceWith(weather_tile);
	}

	xhr.send();
}

function display_forecast(lat, lon)
{
	const dp_count = 5;
	const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`

	const response_handler = async (response) => {
		const response_json = await response.json();

		forecast_list.replaceChildren();
		for (const weather_data of response_json.list)
		{
			const json_weather = weather_data.weather[0];
			const json_main =  weather_data.main;

			const date = new Date(weather_data.dt * 1000);

			const weather_tile = make_weather_tile(
				"",
				date.toLocaleString(),
				`https://openweathermap.org/img/wn/${json_weather.icon}@2x.png`,
				json_weather.description[0].toUpperCase() + json_weather.description.slice(1),
				json_main.temp + " °C",  json_main.feels_like + " °C",
				json_main.pressure + " hPa",  json_main.humidity + " %"
			)

			forecast_list.appendChild(weather_tile);
		}
	};

	const error_handler = (err) => {
		alert(`Fetch failed: ${err}`);
	};

	fetch(url).then(response_handler).catch(error_handler);
}

weather_button.addEventListener("click", () => {

	const string_parts = address_input.value.split(',');
	if (string_parts.length !== 1 && string_parts.length !== 2)
	{
		alert("Invalid address, required format: City Name or City Name, Country code");
		return;
	}

	const city = string_parts[0].trim();
	const country_code = string_parts.length > 1 ? string_parts[1].trim() : "";    

	const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},,${country_code}&appid=${api_key}`
	xhr.open("GET", url, true);
	xhr.responseType = "json";

	xhr.onload = () => {
		const json_response = xhr.response;
		if (json_response.length === 0)
		{
			alert("Location not found");
			return;
		}

		const city_data = json_response[0];

		location_name.textContent = "";
		if (city_data.name !== undefined)
		{
			location_name.textContent += city_data.name;
		}
		if (city_data.state !== undefined)
		{
			if (location_name.textContent !== "")
			{
				location_name.textContent += ", ";
			}

			location_name.textContent += city_data.state;
		}
		if (city_data.country !== undefined)
		{
			if (location_name.textContent !== "")
			{
				location_name.textContent += ", ";
			}
	
			location_name.textContent += city_data.country;
		}

		display_current_weather_data(city_data.lat, city_data.lon);
		display_forecast(city_data.lat, city_data.lon);
	};

	xhr.send();
});
const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
cmd({
    pattern: "Météo",
    desc: "🌤 Obtenez les informations météorologiques pour un emplacement",
    react: "🌤",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❗ Veuillez fournir un nom de ville. Usage : .weather [nom de la ville]");
        const apiKey = '2d61a72574c11c4f36173b627f8cb177'; 
        const city = q;
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        const data = response.data;
        const weather = `
> 🌍 *Informations Météorologiques pour ${data.name}, ${data.sys.country}* 🌍
> 🌡️ *Température*: ${data.main.temp}°C
> 🌡️ *Ressenti*: ${data.main.feels_like}°C
> 🌡️ *Température Min*: ${data.main.temp_min}°C
> 🌡️ *Température Max*: ${data.main.temp_max}°C
> 💧 *Humidité*: ${data.main.humidity}%
> ☁️ *Météo*: ${data.weather[0].main}
> 🌫️ *Description*: ${data.weather[0].description}
> 💨 *Vitesse du Vent*: ${data.wind.speed} m/s
> 🔽 *Pression*: ${data.main.pressure} hPa

> *© Powered By DRACULA*
`;
        return reply(weather);
    } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 404) {
            return reply("🚫 Ville non trouvée. Veuillez vérifier l'orthographe et réessayer.");
        }
        return reply("⚠️ Une erreur est survenue lors de la récupération des informations météo. Veuillez réessayer plus tard.");
    }
});

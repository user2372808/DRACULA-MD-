const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "paysinfo",
    alias: ["cinfo", "country","cinfo2"],
    desc: "Obtenez des informations sur un pays",
    category: "info",
    react: "🟠",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Veuillez fournir un nom de pays.\nExemple : `.countryinfo Pakistan`");

        const apiUrl = `https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) {
            await react("❌");
            return reply(`Aucune information trouvée pour *${q}*. Veuillez vérifier le nom du pays.`);
        }

        const info = data.data;
        let neighborsText = info.neighbors.length > 0
            ? info.neighbors.map(n => `🌍 *${n.name}*`).join(", ")
            : "Aucun pays voisin trouvé.";

        const text = `🌍 *Informations sur le pays : ${info.name}* 🌍\n\n` +
                     `🏛 *Capitale:* ${info.capital}\n` +
                     `📍 *Continent:* ${info.continent.name} ${info.continent.emoji}\n` +
                     `📞 *Indicatif téléphonique:* ${info.phoneCode}\n` +
                     `📏 *Superficie:* ${info.area.squareKilometers} km² (${info.area.squareMiles} mi²)\n` +
                     `🚗 *Côté de conduite:* ${info.drivingSide}\n` +
                     `💱 *Monnaie:* ${info.currency}\n` +
                     `🔤 *Langues:* ${info.languages.native.join(", ")}\n` +
                     `🌟 *Célèbre pour:* ${info.famousFor}\n` +
                     `🌍 *Codes ISO:* ${info.isoCode.alpha2.toUpperCase()}, ${info.isoCode.alpha3.toUpperCase()}\n` +
                     `🌎 *TLD Internet:* ${info.internetTLD}\n\n` +
                     `🔗 *Pays voisins:* ${neighborsText}`;

        await conn.sendMessage(from, {
            image: { url: info.flag },
            caption: text,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        await react("✅"); // Réagir après une réponse réussie
    } catch (e) {
        console.error("Erreur dans la commande countryinfo :", e);
        await react("❌");
        reply("Une erreur est survenue lors de la récupération des informations du pays.");
    }
});

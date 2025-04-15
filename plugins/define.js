const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "define",
    desc: "📖 Obtiens la définition d’un mot",
    react: "🔍",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Merci de fournir un mot à définir.\n\n📌 *Utilisation :* .define [mot]");

        const word = q.trim();
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        const response = await axios.get(url);
        const definitionData = response.data[0];

        const definition = definitionData.meanings[0].definitions[0].definition;
        const example = definitionData.meanings[0].definitions[0].example || '❌ Aucun exemple disponible';
        const synonyms = definitionData.meanings[0].definitions[0].synonyms.join(', ') || '❌ Aucun synonyme disponible';
        const phonetics = definitionData.phonetics[0]?.text || '🔇 Aucune phonétique disponible';
        const audio = definitionData.phonetics[0]?.audio || null;

        const wordInfo = `
📖 *Mot* : *${definitionData.word}*  
🗣️ *Prononciation* : _${phonetics}_  
📚 *Définition* : ${definition}  
✍️ *Exemple* : ${example}  
📝 *Synonymes* : ${synonyms}  

🔗 *Propulsé par Jawad Tech X*`;

        if (audio) {
            await conn.sendMessage(from, { audio: { url: audio }, mimetype: 'audio/mpeg' }, { quoted: mek });
        }

        return reply(wordInfo);
    } catch (e) {
        console.error("❌ Erreur :", e);
        if (e.response && e.response.status === 404) {
            return reply("🚫 *Mot introuvable.* Vérifie l’orthographe et réessaye.");
        }
        return reply("⚠️ Une erreur est survenue lors de la récupération de la définition. Réessaye plus tard.");
    }
});

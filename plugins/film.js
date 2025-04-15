const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "film",
    desc: "Récupère des informations détaillées sur un film.",
    category: "utility",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, args }) => {
    try {
        const movieName = args.length > 0 ? args.join(' ') : m.text.replace(/^[\.\#\$\!]?movie\s?/i, '').trim();
        
        if (!movieName) {
            return reply("📽️ Veuillez fournir le nom du film.\nExemple : .film ip man");
        }

        const apiUrl = `https://apis.davidcyriltech.my.id/imdb?query=${encodeURIComponent(movieName)}`;
        const response = await axios.get(apiUrl);

        if (!response.data.status || !response.data.movie) {
            return reply("🚫 Film non trouvé. Veuillez vérifier le nom et réessayer.");
        }

        const movie = response.data.movie;
        
        const dec = `
🎬 *${movie.title}* (${movie.year}) ${movie.rated || ''}

⭐ *IMDb :* ${movie.imdbRating || 'N/A'} | 🍅 *Rotten Tomatoes :* ${movie.ratings.find(r => r.source === 'Rotten Tomatoes')?.value || 'N/A'} | 💰 *Box-office :* ${movie.boxoffice || 'N/A'}

📅 *Sortie :* ${new Date(movie.released).toLocaleDateString()}
⏳ *Durée :* ${movie.runtime}
🎭 *Genre :* ${movie.genres}

📝 *Synopsis :* ${movie.plot}

🎥 *Réalisateur :* ${movie.director}
✍️ *Scénariste :* ${movie.writer}
🌟 *Acteurs :* ${movie.actors}

🌍 *Pays :* ${movie.country}
🗣️ *Langue(s) :* ${movie.languages}
🏆 *Récompenses :* ${movie.awards || 'Aucune'}

[Voir sur IMDb](${movie.imdbUrl})
`;

        await conn.sendMessage(
            from,
            {
                image: { 
                    url: movie.poster && movie.poster !== 'N/A' ? movie.poster : 'https://files.catbox.moe/7zfdcq.jpg'
                },
                caption: dec,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '',
                        newsletterName: 'JawadTechX',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error('Erreur de la commande movie :', e);
        reply(`❌ Erreur : ${e.message}`);
    }
});

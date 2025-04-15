const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Télécharger une vidéo TikTok sans filigrane",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("Merci de fournir un lien de vidéo TikTok.");
        if (!q.includes("tiktok.com")) return reply("Lien TikTok invalide.");
        
        reply("Téléchargement de la vidéo en cours, merci de patienter...");
        
        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
        const { data } = await axios.get(apiUrl);
        
        if (!data.status || !data.data) return reply("Échec de la récupération de la vidéo TikTok.");
        
        const { title, like, comment, share, author, meta } = data.data;
        const videoUrl = meta.media.find(v => v.type === "video").org;
        
        const caption = `🎵 *Vidéo TikTok* 🎵\n\n` +
                        `👤 *Utilisateur :* ${author.nickname} (@${author.username})\n` +
                        `📖 *Titre :* ${title}\n` +
                        `👍 *Likes :* ${like}\n💬 *Commentaires :* ${comment}\n🔁 *Partages :* ${share}`;
        
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });
        
    } catch (e) {
        console.error("Erreur dans la commande TikTok :", e);
        reply(`Une erreur est survenue : ${e.message}`);
    }
});

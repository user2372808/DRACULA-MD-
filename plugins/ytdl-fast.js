const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

// MP4 video download
cmd({ 
    pattern: "mp4", 
    alias: ["video"], 
    react: "🎥", 
    desc: "Télécharger une vidéo YouTube", 
    category: "main", 
    use: '.mp4 < lien YouTube ou nom >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("Veuillez fournir un lien YouTube ou un nom de vidéo.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("Aucun résultat trouvé !");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("Impossible de récupérer la vidéo. Veuillez réessayer plus tard.");
        }

        let ytmsg = `📹 *Détails de la vidéo*
🎬 *Titre :* ${yts.title}
⏳ *Durée :* ${yts.timestamp}
👀 *Vues :* ${yts.views}
👤 *Auteur :* ${yts.author.name}
🔗 *Lien :* ${yts.url}

*Choisissez le format de téléchargement :*
1. 📄 Document (sans aperçu)
2. ▶️ Vidéo normale (avec aperçu)

_Répondez à ce message avec 1 ou 2 pour télécharger._`;

        let contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363354023106228@newsletter',
                newsletterName: 'KHAN-MD',
                serverMessageId: 143
            }
        };

        const videoMsg = await conn.sendMessage(from, { image: { url: yts.thumbnail }, caption: ytmsg, contextInfo }, { quoted: mek });

        conn.ev.on("messages.upsert", async (msgUpdate) => {
            const replyMsg = msgUpdate.messages[0];
            if (!replyMsg.message || !replyMsg.message.extendedTextMessage) return;

            const selected = replyMsg.message.extendedTextMessage.text.trim();

            if (
                replyMsg.message.extendedTextMessage.contextInfo &&
                replyMsg.message.extendedTextMessage.contextInfo.stanzaId === videoMsg.key.id
            ) {
                await conn.sendMessage(from, { react: { text: "⬇️", key: replyMsg.key } });

                switch (selected) {
                    case "1":
                        await conn.sendMessage(from, {
                            document: { url: data.result.download_url },
                            mimetype: "video/mp4",
                            fileName: `${yts.title}.mp4`,
                            contextInfo
                        }, { quoted: replyMsg });
                        break;

                    case "2":
                        await conn.sendMessage(from, {
                            video: { url: data.result.download_url },
                            mimetype: "video/mp4",
                            contextInfo
                        }, { quoted: replyMsg });
                        break;

                    default:
                        await conn.sendMessage(
                            from,
                            { text: "*Veuillez répondre avec (1 ou 2).*" },
                            { quoted: replyMsg }
                        );
                        break;
                }
            }
        });

    } catch (e) {
        console.log(e);
        reply("Une erreur s'est produite. Veuillez réessayer plus tard.");
    }
});

// MP3 song download
cmd({ 
    pattern: "song", 
    alias: ["ytdl3", "play"], 
    react: "🎶", 
    desc: "Télécharger une chanson YouTube", 
    category: "main", 
    use: '.song < lien YouTube ou nom >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("Veuillez fournir un lien YouTube ou un nom de chanson.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("Aucun résultat trouvé !");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.downloadUrl) {
            return reply("Impossible de récupérer l'audio. Veuillez réessayer plus tard.");
        }
        
        let ytmsg = `🎵 *Détails de la chanson*
🎶 *Titre :* ${yts.title}
⏳ *Durée :* ${yts.timestamp}
👀 *Vues :* ${yts.views}
👤 *Auteur :* ${yts.author.name}
🔗 *Lien :* ${yts.url}

*Choisissez le format de téléchargement :*
1. 📄 MP3 en Document
2. 🎧 MP3 en Audio (lecture)
3. 🎙️ MP3 en Note vocale (PTT)

_Répondez à ce message avec 1, 2 ou 3 pour télécharger._`;
        
        let contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '',
                newsletterName: 'JAWAD TECH X',
                serverMessageId: 143
            }
        };
        
        const songmsg = await conn.sendMessage(from, { image: { url: yts.thumbnail }, caption: ytmsg, contextInfo }, { quoted: mek });

        conn.ev.on("messages.upsert", async (msgUpdate) => {
            const mp3msg = msgUpdate.messages[0];
            if (!mp3msg.message || !mp3msg.message.extendedTextMessage) return;

            const selectedOption = mp3msg.message.extendedTextMessage.text.trim();

            if (
                mp3msg.message.extendedTextMessage.contextInfo &&
                mp3msg.message.extendedTextMessage.contextInfo.stanzaId === songmsg.key.id
            ) {
                await conn.sendMessage(from, { react: { text: "⬇️", key: mp3msg.key } });

                switch (selectedOption) {
                    case "1":
                        await conn.sendMessage(from, {
                            document: { url: data.result.downloadUrl },
                            mimetype: "audio/mpeg",
                            fileName: `${yts.title}.mp3`,
                            contextInfo
                        }, { quoted: mp3msg });
                        break;
                    case "2":
                        await conn.sendMessage(from, {
                            audio: { url: data.result.downloadUrl },
                            mimetype: "audio/mpeg",
                            contextInfo
                        }, { quoted: mp3msg });
                        break;
                    case "3":
                        await conn.sendMessage(from, {
                            audio: { url: data.result.downloadUrl },
                            mimetype: "audio/mpeg",
                            ptt: true,
                            contextInfo
                        }, { quoted: mp3msg });
                        break;
                    default:
                        await conn.sendMessage(
                            from,
                            {
                                text: "*Sélection invalide. Veuillez choisir entre 1, 2 ou 3.*",
                            },
                            { quoted: mp3msg }
                        );
                        break;
                }
            }
        });

    } catch (e) {
        console.log(e);
        reply("Une erreur s'est produite. Veuillez réessayer plus tard.");
    }
});

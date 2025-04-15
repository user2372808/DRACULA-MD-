const { fetchJson } = require("../lib/functions");
const { downloadTiktok } = require("@mrnima/tiktok-downloader");
const { facebook } = require("@mrnima/facebook-downloader");
const cheerio = require("cheerio");
const { igdl } = require("ruhend-scraper");
const axios = require("axios");
const { cmd, commands } = require('../command');

// Instagram Downloader
cmd({
  pattern: "ig",
  alias: ["insta", "Instagram"],
  desc: "Télécharger des vidéos Instagram.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("❌ Veuillez fournir un lien Instagram valide.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://api.davidcyriltech.my.id/instagram?url=${q}`);
    const data = response.data;

    if (!data || data.status !== 200 || !data.downloadUrl) {
      return reply("⚠️ Impossible de récupérer la vidéo Instagram. Vérifiez le lien et réessayez.");
    }

    await conn.sendMessage(from, {
      video: { url: data.downloadUrl },
      mimetype: "video/mp4",
      caption: "📥 *Vidéo Instagram téléchargée avec succès !*"
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.");
  }
});

// Twitter Downloader
cmd({
  pattern: "twitter",
  alias: ["tweet", "twdl"],
  desc: "Télécharger des vidéos Twitter.",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Veuillez fournir une URL Twitter valide." }, { quoted: m });
    }

    await conn.sendMessage(from, {
      react: { text: '⏳', key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result) {
      return reply("⚠️ Impossible de récupérer la vidéo Twitter. Vérifiez le lien et réessayez.");
    }

    const { desc, thumb, video_sd, video_hd } = data.result;

    const caption = `╭━━━〔 *TÉLÉCHARGEUR TWITTER* 〕━━━⊷\n`
      + `┃▸ *Description:* ${desc || "Aucune description"}\n`
      + `╰━━━⪼\n\n`
      + `📹 *Options de téléchargement :*\n`
      + `1️⃣  *Qualité SD*\n`
      + `2️⃣  *Qualité HD*\n`
      + `🎵 *Options audio :*\n`
      + `3️⃣  *Audio*\n`
      + `4️⃣  *Document*\n`
      + `5️⃣  *Voix*\n\n`
      + `📌 *Répondez avec le numéro pour télécharger votre choix.*`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumb },
      caption: caption
    }, { quoted: m });

    const messageID = sentMsg.key.id;

    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, {
          react: { text: '⬇️', key: receivedMsg.key }
        });

        switch (receivedText) {
          case "1":
            await conn.sendMessage(senderID, {
              video: { url: video_sd },
              caption: "📥 *Téléchargé en qualité SD*"
            }, { quoted: receivedMsg });
            break;

          case "2":
            await conn.sendMessage(senderID, {
              video: { url: video_hd },
              caption: "📥 *Téléchargé en qualité HD*"
            }, { quoted: receivedMsg });
            break;

          case "3":
            await conn.sendMessage(senderID, {
              audio: { url: video_sd },
              mimetype: "audio/mpeg"
            }, { quoted: receivedMsg });
            break;

          case "4":
            await conn.sendMessage(senderID, {
              document: { url: video_sd },
              mimetype: "audio/mpeg",
              fileName: "Twitter_Audio.mp3",
              caption: "📥 *Audio téléchargé en document*"
            }, { quoted: receivedMsg });
            break;

          case "5":
            await conn.sendMessage(senderID, {
              audio: { url: video_sd },
              mimetype: "audio/mp4",
              ptt: true
            }, { quoted: receivedMsg });
            break;

          default:
            reply("❌ Option invalide ! Veuillez répondre avec 1, 2, 3, 4 ou 5.");
        }
      }
    });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.");
  }
});

// MediaFire Downloader
cmd({
  pattern: "mediafire",
  alias: ["mfire"],
  desc: "Télécharger des fichiers depuis MediaFire.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q) {
      return reply("❌ Veuillez fournir un lien MediaFire valide.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result || !data.result.dl_link) {
      return reply("⚠️ Impossible de récupérer le lien de téléchargement MediaFire. Assurez-vous que le lien est valide et public.");
    }

    const { dl_link, fileName, fileType } = data.result;
    const file_name = fileName || "mediafire_download";
    const mime_type = fileType || "application/octet-stream";

    await conn.sendMessage(from, {
      react: { text: "⬆️", key: m.key }
    });

    const caption = `╭━━━〔 *TÉLÉCHARGEUR MEDIAFIRE* 〕━━━⊷\n`
      + `┃▸ *Nom du fichier:* ${file_name}\n`
      + `┃▸ *Type de fichier:* ${mime_type}\n`
      + `╰━━━⪼\n\n`
      + `📥 *Téléchargement en cours...*`;

    await conn.sendMessage(from, {
      document: { url: dl_link },
      mimetype: mime_type,
      fileName: file_name,
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.");
  }
});

// Aptoide APK Downloader
cmd({
  pattern: "apk",
  desc: "Télécharger une APK depuis Aptoide.",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q) {
      return reply("❌ Veuillez fournir le nom d'une application.");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.datalist || !data.datalist.list.length) {
      return reply("⚠️ Aucun résultat trouvé pour l'application donnée.");
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2); // Mo

    const caption = `╭━━━〔 *TÉLÉCHARGEUR APK* 〕━━━┈⊷
┃ 📦 *Nom :* ${app.name}
┃ 🏋 *Taille :* ${appSize} MB
┃ 📦 *Package :* ${app.package}
┃ 📅 *Mis à jour :* ${app.updated}
┃ 👨‍💻 *Développeur :* ${app.developer.name}
╰━━━━━━━━━━━━━━━┈⊷
🔗 *Propulsé par KhanX-AI*`;

    await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

    await conn.sendMessage(from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: caption
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ Une erreur est survenue lors du téléchargement de l'APK. Veuillez réessayer.");
  }
});

// Google Drive Downloader
cmd({
  pattern: "gdrive",
  desc: "Télécharger des fichiers Google Drive.",
  react: "🌐",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q) {
      return reply("❌ Veuillez fournir un lien Google Drive valide.");
    }

    await conn.sendMessage(from, { react: { text: "⬇️", key: m.key } });

    const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`;
    const response = await axios.get(apiUrl);
    const downloadUrl = response.data.result.downloadUrl;

    if (downloadUrl) {
      await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

      await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: response.data.result.mimetype,
        fileName: response.data.result.fileName,
        caption: "*© Propulsé par JawadTechX*"
      }, { quoted: m });

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    } else {
      return reply("⚠️ Aucun lien de téléchargement trouvé. Veuillez vérifier le lien et réessayer.");
    }
  } catch (error) {
    console.error("Error:", error);
    reply("❌ Une erreur est survenue lors de la récupération du fichier Google Drive. Veuillez réessayer.");
  }
});

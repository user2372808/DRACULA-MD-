const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
  pattern: 'version',
  alias: ["changelog", "cupdate", "checkupdate"],
  react: '🚀',
  desc: "Vérifie la version du bot, les infos système et les mises à jour.",
  category: 'info',
  filename: __filename
}, async (conn, mek, m, {
  from, sender, pushname, reply
}) => {
  try {
    // Lire les données de version locale
    const localVersionPath = path.join(__dirname, '../data/version.json');
    let localVersion = 'Inconnue';
    let changelog = 'Aucun changelog disponible.';
    if (fs.existsSync(localVersionPath)) {
      const localData = JSON.parse(fs.readFileSync(localVersionPath));
      localVersion = localData.version;
      changelog = localData.changelog;
    }

    // Récupérer la dernière version depuis GitHub
    const rawVersionUrl = 'https://raw.githubusercontent.com/DRACULA-MD/DRACULA-MD/main/data/version.json';
    let latestVersion = 'Inconnue';
    let latestChangelog = 'Aucun changelog disponible.';
    try {
      const { data } = await axios.get(rawVersionUrl);
      latestVersion = data.version;
      latestChangelog = data.changelog;
    } catch (error) {
      console.error('Échec de la récupération de la dernière version :', error);
    }

    // Compter le nombre total de plugins
    const pluginPath = path.join(__dirname, '../plugins');
    const pluginCount = fs.readdirSync(pluginPath).filter(file => file.endsWith('.js')).length;

    // Compter le nombre total de commandes enregistrées
    const totalCommands = commands.length;

    // Infos système
    const uptime = runtime(process.uptime());
    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
    const hostName = os.hostname();
    const lastUpdate = fs.statSync(localVersionPath).mtime.toLocaleString();

    // Statistiques GitHub
    const githubRepo = 'https://github.com/DRACULA-MD/DRACULA-MD.git';

    // Vérifier l'état de mise à jour
    let updateMessage = `✅ TON BOT DRACULA-MD EST BIEN À JOUR ☺️!`;
    if (localVersion !== latestVersion) {
      updateMessage = `🚀 TON BOT DRACULA-MD EST DÉPASSÉ
🔹 *Version actuelle :* ${localVersion}
🔹 *Dernière version :* ${latestVersion}

UTILISE *.update* pour le mettre à jour.`;
    }

    const statusMessage = `🌟 *BON${new Date().getHours() < 12 ? 'JOUR' : 'SOIR'}, ${pushname}!* 🌟\n\n` +
      `📌 *Nom du Bot:* DRACULA-MD\n🔖 *Version actuelle :* ${localVersion}\n📢 *Dernière version :* ${latestVersion}\n📂 *Total Plugins :* ${pluginCount}\n🔢 *Total Commandes :* ${totalCommands}\n\n` +
      `💾 *Infos Système :*\n⏳ *Uptime :* ${uptime}\n📟 *RAM :* ${ramUsage}MB / ${totalRam}MB\n⚙️ *Nom de l’Hôte :* ${hostName}\n📅 *Dernière mise à jour :* ${lastUpdate}\n\n` +
      `📝 *Changelog :*\n${latestChangelog}\n\n` +
      `⭐ *Dépôt GitHub :* ${githubRepo}\n👤 *PROPRIO :* [Pharouk](https://github.com/DRACULA-MD/DRACULA-MD.git)\n\n${updateMessage}\n\n🚀 *N'oublie pas de donner une 🌟 au repo!*`;

    // Envoyer le message avec une image
    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/z5882z.jpg' },
      caption: statusMessage,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '',
          newsletterName: 'Pharouk',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });
  } catch (error) {
    console.error('Erreur lors de la vérification de la version du bot :', error);
    reply('❌ Une erreur est survenue lors de la vérification de la version du bot.');
  }
});

const util = require('util');
const fs = require('fs-extra');
const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const moment = require("moment-timezone");
const { runtime, getBuffer } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "Menu du bot",
    category: "menu2",
    react: "🇨🇮",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        // Mode (public ou privé)
        const mode = config.MODE.toLowerCase() === 'public' ? 'Public' : 'Privé';
        const totalCommands = commands.length;
        const uptime = runtime(process.uptime());
        const temps = moment().format('HH:mm:ss');
        const date = moment().format('DD/MM/YYYY');

        // Organiser les commandes par catégorie
        let coms = {};
        commands.forEach(cmd => {
            if (!coms[cmd.category]) coms[cmd.category] = [];
            coms[cmd.category].push(cmd.pattern);
        });

        // Création du texte du menu
        let text = `╭━━━〔 *${config.BOT_NAME}* 〕━━━┈⊷
┃★╭──────────────
┃★│ 👑 Propriétaire : *${config.OWNER_NAME}*
┃★│ ⚙️ Mode : *${mode}*
┃★│ ⏱️ Uptime : *${uptime}*
┃★│ 📅 Date : *${date}*
┃★│ 🕰️ Heure : *${temps}*
┃★│ 🧠 Commandes : *${totalCommands}*
┃★│ 💾 Mémoire : *${Math.round((os.totalmem() - os.freemem()) / 1048576)}MB / ${Math.round(os.totalmem() / 1048576)}MB*
┃★│ 🧩 Plateforme : *${os.platform()}*
┃★╰──────────────
╰━━━━━━━━━━━━━━━━━━━⊷

👋 Salut *${pushname}* !

Voici la liste des commandes disponibles :
`;

        // Ajouter les commandes de chaque catégorie
        for (const cat in coms) {
            // Ne pas afficher la catégorie "misc" ou les catégories vides
            if (cat.toLowerCase() === "misc" || coms[cat].length === 0) continue;
            
            text += `╭───❏ *${cat}* ❏───\n`;
            coms[cat].forEach(cmd => {
                text += `┃★│ ${config.PREFIX}${cmd}\n`;
            });
            text += `╰═════════════⊷\n\n`;
        }

        // Ajouter les instructions pour l'utilisation
        text += `*»»————— ★ —————««*\nPour utiliser une commande, tapez *${config.PREFIX}<commande>*\n\n*Power by ${config.BOT_NAME}*`;

        // URL de l'image (mettez un lien valide ici)
        const imageUrl = "https://files.catbox.moe/z5882z.jpg"; // Lien d'image à utiliser
        const buffer = await getBuffer(imageUrl);

        // Envoi de l'image ou du texte
        if (buffer) {
            await conn.sendMessage(from, { image: buffer, caption: text }, { quoted: mek });
        } else {
            await reply(text);
        }
        
    } catch (e) {
        console.log("Erreur dans la commande menu :", e);
        reply("🥵 Une erreur s'est produite dans le menu : " + e.message);
    }
});

const util = require('util');
const fs = require('fs-extra');
const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const moment = require("moment-timezone");
const { runtime, getBuffer } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "Afficher le menu principal du bot",
    category: "menu",
    react: "⚡",
    filename: __filename
}, 
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const mode = config.MODE.toLowerCase() === 'public' ? 'Public' : 'Privé';
        const totalCommands = commands.length;
        const uptime = runtime(process.uptime());
        const temps = moment().format('HH:mm:ss');
        const date = moment().format('DD/MM/YYYY');

        // Organiser les commandes par catégorie
        const categorized = {};
        commands.forEach(c => {
            const cat = c.category || "Autres";
            if (!categorized[cat]) categorized[cat] = [];
            categorized[cat].push(c);
        });

        let text = `╭───────────〔 *${config.BOT_NAME}* 〕───────────╮
│ 👑 Propriétaire : *${config.OWNER_NAME}*
│ ⚙️ Mode : *${mode}*
│ ⏱️ Uptime : *${uptime}*
│ 📅 Date : *${date}*
│ 🕰️ Heure : *${temps}*
│ 🧠 Total commandes : *${totalCommands}*
│ 💾 RAM : *${Math.round((os.totalmem() - os.freemem()) / 1048576)}MB / ${Math.round(os.totalmem() / 1048576)}MB*
│ 🧩 Système : *${os.platform()}*
╰────────────────────────────────────────╯

👋 Salut *${pushname}* !

───────────────────────
*📖 LISTE DES COMMANDES :*
───────────────────────\n`;

        for (const [category, cmds] of Object.entries(categorized)) {
            text += `╭─〔 *${category.toUpperCase()}* 〕\n`;
            cmds.forEach(c => {
                text += `│ • *${config.PREFIX}${c.pattern}*`;
                if (c.desc) text += ` → ${c.desc}`;
                text += `\n`;
            });
            text += `╰───────────────────────\n\n`;
        }

        text += `───────────────
Pour utiliser une commande, tape :
*${config.PREFIX}<commande>*

✨ Powered by *${config.BOT_NAME}*
───────────────`;

        const imageUrl = "https://files.catbox.moe/z5882z.jpg";
        const buffer = await getBuffer(imageUrl);

        if (buffer) {
            await conn.sendMessage(from, { image: buffer, caption: text.trim() }, { quoted: mek });
        } else {
            await reply(text.trim());
        }

    } catch (e) {
        console.error("Erreur menu2 :", e);
        reply("❌ Une erreur s'est produite dans le menu : " + e.message);
    }
});

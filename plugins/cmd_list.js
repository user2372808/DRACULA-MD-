const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");

cmd({
    pattern: "list",
    alias: ["listcmd", "commands"],
    desc: "Afficher toutes les commandes disponibles avec leurs descriptions",
    category: "menu",
    react: "🟢",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let menuText = `*${config.BOT_NAME} COMMANDS*\n\n`;

        // Ajouter les informations du bot
        menuText += `*🛠️ BOT INFO*\n`;
        menuText += `• 👑 *Propriétaire* : ${config.OWNER_NAME}\n`;
        menuText += `• ⚙️ *Préfixe* : [${config.PREFIX}]\n`;
        menuText += `• 🌐 *Plateforme* : ${os.platform()}\n`;
        menuText += `• 📦 *Version* : 1.0.0\n`;
        menuText += `• ⚙️ *Mode* : ${config.MODE}\n\n`;

        // Organiser les commandes par catégorie
        const categorized = {};
        commands.forEach(cmd => {
            if (!categorized[cmd.category]) {
                categorized[cmd.category] = [];
            }
            categorized[cmd.category].push(cmd);
        });

        // Générer le menu pour chaque catégorie
        for (const [category, cmds] of Object.entries(categorized)) {
            menuText += `*${category.toUpperCase()}*\n`;

            cmds.forEach(c => {
                menuText += `• *Commande* : ${config.PREFIX}${c.pattern}\n`;
                if (c.desc) {
                    menuText += `  *Description* : ${c.desc}\n`;
                }
                if (c.alias && c.alias.length > 0) {
                    menuText += `  *Alias* : ${c.alias.map(a => `.${a}`).join(', ')}\n`;
                }
                menuText += `\n`;
            });
        }

        menuText += `\n> ${config.DESCRIPTION}`;

        // Envoi du message avec l'image et le texte
        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/fooqjk.jpg' },
                caption: menuText,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );
    } catch (e) {
        console.error(e);
        reply(`❌ Une erreur est survenue : ${e.message}`);
    }
});

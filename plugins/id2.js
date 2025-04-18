const { cmd } = require('../command');

cmd({
    pattern: "id",
    alias: ["id", "chatid", "gjid"],  
    desc: "Get full JID of current user (Creator Only)",
    react: "🆔",
    category: "utility",
    filename: __filename,
}, async (conn, mek, m, { 
    from, isGroup, isCreator, reply, sender 
}) => {
    try {
        // Vérification que seule la personne créatrice peut utiliser cette commande
        if (!isCreator) {
            return reply("❌ *Command Restricted* - Only my creator can use this.");
        }

        // Si c'est un groupe, on ne fait rien
        if (isGroup) {
            return reply("❌ *This command is not available in groups*");
        } else {
            // Si ce n'est pas un groupe, on récupère l'ID complet de l'utilisateur
            const userJID = sender.includes('@s.whatsapp.net') ? sender : `${sender}@s.whatsapp.net`;
            return reply(`👤 *User JID:*\n\`\`\`${userJID}\`\`\``);
        }

    } catch (e) {
        console.error("JID Error:", e);
        reply(`⚠️ Error fetching JID:\n${e.message}`);
    }
});

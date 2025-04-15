const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Rétrograde un administrateur du groupe en membre normal",
    category: "admin",
    react: "⬇️",
    filename: __filename
},
async(conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply
}) => {
    if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans un groupe.");

    if (!isAdmins) return reply("❌ Seuls les administrateurs du groupe peuvent utiliser cette commande.");

    if (!isBotAdmins) return reply("❌ Je dois être administrateur du groupe pour rétrograder quelqu’un.");

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0]; // Numéro de la personne citée
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, ''); // Nettoyage du @
    } else {
        return reply("❌ Veuillez répondre à un message ou fournir un numéro pour rétrograder.");
    }

    if (number === botNumber) return reply("❌ Je ne peux pas me rétrograder moi-même.");

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "demote");
        reply(`✅ @${number} a été rétrogradé(e) en simple membre.`, { mentions: [jid] });
    } catch (error) {
        console.error("Erreur dans la commande demote :", error);
        reply("❌ Impossible de rétrograder ce membre.");
    }
});

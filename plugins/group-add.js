const { cmd } = require('../command');

cmd({
    pattern: "add",
    alias: ["a", "invite"],
    desc: "Ajoute un membre dans le groupe",
    category: "admin",
    react: "➕",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, quoted, senderNumber
}) => {
    if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans un groupe.");

    // Récupérer dynamiquement le numéro du propriétaire du bot
    const botOwner = conn.user.id.split(":")[0];
    if (senderNumber !== botOwner) {
        return reply("❌ Seul le propriétaire de DRACULA-MD peut utiliser cette commande.");
    }

    if (!isBotAdmins) return reply("❌ Je dois être admin pour ajouter quelqu’un au groupe.");

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0]; // Numéro du message cité
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, ''); // Nettoyer le @
    } else if (q && /^\d+$/.test(q)) {
        number = q; // Numéro directement entré
    } else {
        return reply("❌ Veuillez répondre à un message, mentionner un utilisateur, ou fournir un numéro à ajouter.");
    }

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "add");
        reply(`✅ @${number} a bien été ajouté(e) au groupe !`, { mentions: [jid] });
    } catch (error) {
        console.error("Erreur dans la commande add :", error);
        reply("❌ Impossible d'ajouter ce membre. Vérifie le numéro ou les autorisations.");
    }
});

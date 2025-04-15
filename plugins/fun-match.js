const { cmd } = require("../command");

// Commande pour sélectionner un garçon au hasard
cmd({
  pattern: "jeunesse",
  alias: ["garçon", "morgor"],
  desc: "Sélectionne un garçon au hasard dans le groupe",
  react: "👦",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ Cette commande ne fonctionne que dans les groupes !");

    const participants = groupMetadata.participants;

    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ Aucun participant éligible trouvé !");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Voici ton beau gosse !*\n\n@${randomUser.id.split('@')[0]} est le garçon le plus stylé du groupe ! 😎`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Erreur dans la commande .bacha :", error);
    reply(`❌ Erreur : ${error.message}`);
  }
});

// Commande pour sélectionner une fille au hasard
cmd({
  pattern: "jeunesse",
  alias: ["femme", "mousso", "larki"],
  desc: "Sélectionne une fille au hasard dans le groupe",
  react: "👧",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ Cette commande ne fonctionne que dans les groupes !");

    const participants = groupMetadata.participants;

    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ Aucune participante éligible trouvée !");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👧 *Voici ta princesse !*\n\n@${randomUser.id.split('@')[0]} est la plus jolie fille du groupe ! 💖`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Erreur dans la commande .bachi :", error);
    reply(`❌ Erreur : ${error.message}`);
  }
});

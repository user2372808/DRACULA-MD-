const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "img",
    alias: ["image", "googleimage", "searchimg"],
    react: "🦋",
    desc: "Rechercher et télécharger des images Google",
    category: "fun",
    use: ".img <mots-clés>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("🖼️ Merci de fournir des mots-clés pour la recherche\nExemple : .img chats mignons");
        }

        await reply(`🔍 Recherche d’images pour « ${query} »...`);

        const url = `https://apis.davidcyriltech.my.id/googleimage?query=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        // Vérification de la réponse
        if (!response.data?.success || !response.data.results?.length) {
            return reply("❌ Aucune image trouvée. Essaie d'autres mots-clés.");
        }

        const results = response.data.results;
        // Sélectionne 5 images aléatoires
        const selectedImages = results
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        for (const imageUrl of selectedImages) {
            await conn.sendMessage(
                from,
                { 
                    image: { url: imageUrl },
                    caption: `📷 Résultat pour : ${query}\n> © Propulsé par Pharouk | DRACULA-MD`
                },
                { quoted: mek }
            );
            // Petite pause pour éviter les limites d'envoi
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error('Erreur de recherche d’image :', error);
        reply(`❌ Erreur : ${error.message || "Échec de la récupération des images"}`);
    }
});

const { cmd } = require("../command");
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require('../data/updateDB');

cmd({
    pattern: "update",
    alias: ["upgrade", "sync"],
    react: '🆕',
    desc: "Update the bot to the latest version.",
    category: "misc",
    filename: __filename
}, async (client, message, args, { reply, isOwner }) => {
    if (!isOwner) return reply("Cette commande est réservée au propriétaire du bot.");

    try {
        await reply("🔍 Vérification des mises à jour de DRACULA-MD...");

        // Récupérer le dernier commit de GitHub
        const { data: commitData } = await axios.get("https://api.github.com/repos/PHAROUK56/DRACULA-MD-/commits/main");
        const latestCommitHash = commitData.sha;

        // Récupérer le commit actuel
        const currentHash = await getCommitHash();

        if (latestCommitHash === currentHash) {
            return reply("✅ Votre bot DRACULA est déjà à jour !");
        }

        await reply("🚀 Mise à jour de DRACULA-MD en cours...");

        // Télécharger le zip du repo
        const zipPath = path.join(__dirname, "latest.zip");
        const { data: zipData } = await axios.get("https://github.com/PHAROUK56/DRACULA-MD-/archive/main.zip", { responseType: "arraybuffer" });
        fs.writeFileSync(zipPath, zipData);

        // Extraire le zip
        await reply("📦 Extraction des fichiers...");
        const extractPath = path.join(__dirname, 'latest');
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        // Copier les fichiers mis à jour
        await reply("🔄 Remplacement des fichiers...");
        const sourcePath = path.join(extractPath, "DRACULA-MD--main"); // double tiret important
        const destinationPath = path.join(__dirname, '..');
        copyFolderSync(sourcePath, destinationPath);

        // Enregistrer le nouveau hash
        await setCommitHash(latestCommitHash);

        // Nettoyage
        fs.unlinkSync(zipPath);
        fs.rmSync(extractPath, { recursive: true, force: true });

        await reply("✅ Mise à jour terminée ! Redémarrage du bot...");
        process.exit(0);
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        return reply("❌ La mise à jour a échoué. Essayez manuellement ou vérifiez la console.");
    }
});

// Fonction de copie
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const items = fs.readdirSync(source);
    for (const item of items) {
        const srcPath = path.join(source, item);
        const destPath = path.join(target, item);

        // Fichiers à préserver
        if (["config.js", "app.json", ".env"].includes(item)) {
            console.log(`Skipping ${item} pour préserver vos configurations.`);
            continue;
        }

        if (fs.lstatSync(srcPath).isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

require("dotenv").config();
const readline = require("readline");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Community = require("../models/community.model");
const kleur = require("kleur");
const bcrypt = require("bcryptjs");
const LOG = console.log;

mongoose.set("strictQuery", true); // Suppression du warning mongoose 7

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    LOG(kleur.green().bold("✅ Connected to MongoDB"));
    start();
  })
  .catch((err) => {
    LOG(kleur.red().bold("Error connecting to database: " + err.message));
    process.exit(1);
  });

async function start() {
  try {
    // Vérifier s’il existe déjà des modérateurs
    let moderators = await User.find({ role: "moderator" });

    // Si aucun modérateur, en créer un automatiquement
    if (moderators.length === 0) {
      const existing = await User.findOne({ email: "moderator@example.com" });
      if (!existing) {
        const hashed = await bcrypt.hash("password123", 10);
        const newMod = new User({
          name: "Moderateur Test",
          username: "mod1",
          email: "moderator@example.com",
          password: hashed,
          role: "moderator",
        });
        await newMod.save();
        LOG(kleur.green().bold("✅ Modérateur créé automatiquement."));
        moderators = [newMod];
      } else {
        LOG(kleur.yellow().bold("⚠️ Le modérateur avec cet email existe déjà."));
        moderators = [existing];
      }
    }

    const modChoiceIndex = await promptUserChoice(
      kleur.cyan().bold("Quel modérateur souhaitez-vous ajouter ? (Numéro)"),
      moderators.map((mod, index) => `${index + 1}. ${mod.name} - ${mod.email}`)
    );

    const moderatorToAdd = moderators[modChoiceIndex];
    if (!moderatorToAdd) {
      LOG(kleur.red().bold("❌ Modérateur introuvable."));
      return;
    }

    const communities = await Community.find({}, { name: 1, _id: 0 });
    const communityNames = communities.map((c) => c.name);

    if (communityNames.length === 0) {
      LOG(kleur.red().bold("❌ Aucune communauté trouvée."));
      process.exit(1);
    }

    const communityName = await promptUserInput(
      kleur.cyan().bold("À quelle communauté l’ajouter ? (Numéro)"),
      communityNames
    );

    const chosenCommunity = await Community.findOne({ name: communityName });

    if (!chosenCommunity) {
      LOG(kleur.yellow().bold(`⚠️ La communauté "${communityName}" n’existe pas.`));
      process.exit(1);
    }

    if (
      Array.isArray(chosenCommunity.moderators) &&
      chosenCommunity.moderators.includes(moderatorToAdd._id)
    ) {
      LOG(kleur.yellow().bold(`⚠️ ${moderatorToAdd.name} est déjà modérateur de "${communityName}".`));
      process.exit(1);
    }

    await Community.findOneAndUpdate(
      { name: communityName },
      {
        $addToSet: {
          moderators: moderatorToAdd._id,
          members: moderatorToAdd._id,
        },
      },
      { new: true }
    );

    LOG(kleur.green().bold(`✅ ${moderatorToAdd.name} ajouté comme modérateur de "${communityName}" avec succès.`));
    rl.close();
    process.exit(0);
  } catch (err) {
    LOG(kleur.red().bold("❌ Erreur : " + err.message));
    rl.close();
    process.exit(1);
  }
}

function promptUserInput(promptText, options) {
  return new Promise((resolve) => {
    if (options.length > 0) {
      LOG(kleur.cyan().bold("Choisissez une option :"));
      options.forEach((option, index) =>
        LOG(kleur.cyan().bold(`${index + 1}. ${option}`))
      );
    }
    rl.question(`${promptText} `, (answer) => {
      const index = parseInt(answer, 10) - 1;
      if (index >= 0 && index < options.length) {
        resolve(options[index]);
      } else {
        LOG(kleur.red().bold("❌ Sélection invalide."));
        process.exit(1);
      }
    });
  });
}

function promptUserChoice(prompt, choices) {
  return new Promise((resolve, reject) => {
    rl.question(`${prompt}\n${choices.join("\n")}\n`, (answer) => {
      const index = parseInt(answer, 10) - 1;
      if (isNaN(index) || index < 0 || index >= choices.length) {
        reject(new Error(kleur.red().bold("❌ Choix invalide.")));
      } else {
        resolve(index);
      }
    });
  });
}

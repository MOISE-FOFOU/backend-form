const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Définir le schéma de l'utilisateur
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    departement: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Avant de sauvegarder l'utilisateur, hasher le mot de passe
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour vérifier le mot de passe
userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

const baseSchemaOptions = {
    timestamps: true
};

// Fonction pour générer une combinaison unique
const generateCombinaisonUnique = (fields) => fields.join('-');

// Middleware pour générer la combinaison unique
const combinaisonUniqueMiddleware = function(next) {
    if (this.isModified('Description') || this.isModified('Image')) {
        this.combinaisonUnique = generateCombinaisonUnique([this.Description, this.Image]);
    }
    next();
};

// Schéma pour la classe Historique
const HistoriqueSchema = new mongoose.Schema({
    Description: String,
    Image: String,
    activated: { type: Boolean, default: true },
    combinaisonUnique: { type: String, unique: true }
}, baseSchemaOptions);

HistoriqueSchema.pre('save', combinaisonUniqueMiddleware);

// Schéma pour la classe Mission
const MissionSchema = new mongoose.Schema({
    Description: String,
    Image: String,
    activated: { type: Boolean, default: true },
    combinaisonUnique: { type: String, unique: true }
}, baseSchemaOptions);

MissionSchema.pre('save', combinaisonUniqueMiddleware);

// Schéma pour la classe Presentation
const PresentationSchema = new mongoose.Schema({
    Description: String,
    Image: String,
    telephone: String,
    email: String,
    adresse: String,
    activated: { type: Boolean, default: true },
    combinaisonUnique: { type: String, unique: true }
}, baseSchemaOptions);

PresentationSchema.pre('save', combinaisonUniqueMiddleware);

// Schéma pour la classe Entreprise
const EntrepriseSchema = new mongoose.Schema({
    nom: String,
    adresse: String,
    secteur: String,
    contact: String,
    activated: { type: Boolean, default: true },
    combinaisonUnique: { type: String, unique: true }
}, baseSchemaOptions);

EntrepriseSchema.pre('save', combinaisonUniqueMiddleware);

// Schéma pour la classe Enseignant
const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Schéma pour la classe Enseignant
const EnseignantSchema = new mongoose.Schema({
  nomComplet: String,
  adresseMail: String,
  telephone: String,
  domainesExpertise: String,
  grade: String,
  responsabilite: String,
  Image: String,
  activated: { type: Boolean, default: true },
  combinaisonUnique: { type: String, unique: true },
  password: { type: String, default: () => generatePassword() }
}, baseSchemaOptions);

EnseignantSchema.pre('save', combinaisonUniqueMiddleware);

// Schéma pour la classe Formation
const FormationSchema = new mongoose.Schema({
    titre: String,
    presentation: String,
    admission: String,
    parcours: String,
    Image: String,
    activated: { type: Boolean, default: true },
    combinaisonUnique: { type: String, unique: true }
}, baseSchemaOptions);

FormationSchema.pre('save', combinaisonUniqueMiddleware);

// Schéma pour la classe Realisation
const RealisationSchema = new mongoose.Schema({
    titre: String,
    annee: String,
    Description: String,
    activated: { type: Boolean, default: true },
    combinaisonUnique: { type: String, unique: true }
}, baseSchemaOptions);

RealisationSchema.pre('save', combinaisonUniqueMiddleware);

// Schéma pour la classe Actualite
const ActualiteSchema = new mongoose.Schema({
    titre: String,
    Description: String,
    semaine: String,
    activated: { type: Boolean, default: true },
    combinaisonUnique: { type: String, unique: true }
}, baseSchemaOptions);

ActualiteSchema.pre('save', combinaisonUniqueMiddleware);

// Schéma pour le groupe
const GroupSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    historiques: [HistoriqueSchema],
    missions: [MissionSchema],
    presentations: [PresentationSchema],
    enseignants: [EnseignantSchema],
    formations: [FormationSchema],
    realisations: [RealisationSchema],
    actualites: [ActualiteSchema],
    entreprises: [EntrepriseSchema]
}, baseSchemaOptions);

// Création des modèles
const User = mongoose.model('User', userSchema);
const Group = mongoose.model('Group', GroupSchema);

module.exports = { User, Group };

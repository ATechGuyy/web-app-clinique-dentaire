# DentalCare Pro - Application de Gestion de Clinique Dentaire

Application professionnelle de gestion pour cliniques dentaires, construite avec Next.js 15, TypeScript, Tailwind CSS et Supabase.

## 🚀 Fonctionnalités

- **Gestion des Patients** : Stockage et gestion des informations patients
- **Rendez-vous** : Planification et organisation des consultations
- **Finances** : Suivi des recettes et dépenses
- **Tableau de bord** : Vue d'ensemble de la clinique
- **Authentification** : Système de connexion sécurisé avec Supabase Auth

## 🛠️ Technologies

- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : Tailwind CSS, Framer Motion
- **Backend** : Supabase (PostgreSQL, Auth, Real-time)
- **Base de données** : PostgreSQL avec schéma optimisé

## 📋 Prérequis

- Node.js 18+ 
- Compte Supabase
- Base de données PostgreSQL

## 🔧 Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd dentist-web-app-windsurf
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   Créer un fichier `.env.local` à la racine du projet :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Configuration de la base de données**
   - Créer un projet Supabase
   - Exécuter le script SQL dans `supabase/schema.sql`
   - Configurer les variables d'environnement

5. **Lancer l'application**
   ```bash
   npm run dev
   ```

## 🗄️ Structure de la Base de Données

### Tables principales :
- **users** : Utilisateurs de l'application
- **patients** : Informations des patients
- **rendezvous** : Rendez-vous et consultations
- **finances** : Transactions financières

## 📱 Pages de l'Application

- **/** : Page d'accueil avec présentation
- **/sign-in** : Connexion utilisateur
- **/sign-up** : Création de compte
- **/dashboard** : Tableau de bord principal
- **/patients** : Gestion des patients
- **/rendezvous** : Gestion des rendez-vous
- **/finances** : Suivi financier
- **/settings** : Paramètres utilisateur et clinique
- **/config** : Diagnostic de configuration

## 🔐 Authentification

L'application utilise Supabase Auth pour :
- Inscription et connexion des utilisateurs
- Gestion des sessions sécurisées
- Protection des routes du tableau de bord

## 🎨 Interface Utilisateur

- Design moderne et responsive
- Animations fluides avec Framer Motion
- Composants réutilisables
- Thème personnalisable

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Autres plateformes
- Netlify
- Railway
- Docker

## 📊 Monitoring et Maintenance

- Page de diagnostic `/config`
- Logs d'erreur dans la console
- Vérification automatique de la connexion DB

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 🆘 Support

Pour toute question ou problème :
- Vérifier la page `/config`
- Consulter les logs de la console
- Vérifier la configuration Supabase

---

**DentalCare Pro** - Modernisez votre pratique dentaire avec une solution complète et professionnelle.

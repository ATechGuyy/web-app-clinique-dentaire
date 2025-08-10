# Guide de Configuration - DentalCare Pro

## 🚀 Configuration Rapide

### 1. Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Configuration Supabase

1. **Créer un projet Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un nouveau projet
   - Notez l'URL et les clés

2. **Exécuter le schéma SQL**
   - Ouvrez l'éditeur SQL dans votre dashboard Supabase
   - Copiez et exécutez le contenu de `supabase/schema.sql`

3. **Configurer l'authentification**
   - Dans Authentication > Settings
   - Activez Email auth
   - Configurez les URLs de redirection si nécessaire

### 3. Lancer l'Application

```bash
npm install
npm run dev
```

## 🔧 Configuration Détaillée

### Base de Données

Le schéma inclut 4 tables principales :

- **users** : Profils utilisateurs
- **patients** : Dossiers patients
- **rendezvous** : Rendez-vous
- **finances** : Transactions financières

### Authentification

- **Supabase Auth** gère l'inscription/connexion
- **Row Level Security (RLS)** protège les données
- **Sessions** gérées automatiquement

### Sécurité

- Toutes les requêtes incluent `user_id`
- RLS empêche l'accès aux données d'autres utilisateurs
- Validation côté client et serveur

## 🚨 Dépannage

### Erreurs Courantes

1. **"Invalid API key"**
   - Vérifiez vos variables d'environnement
   - Redémarrez le serveur après modification

2. **"Database connection failed"**
   - Vérifiez l'URL Supabase
   - Exécutez le schéma SQL
   - Vérifiez les permissions RLS

3. **"User not authenticated"**
   - Vérifiez la configuration Auth dans Supabase
   - Consultez la page `/config`

### Page de Diagnostic

Utilisez `/config` pour :
- Vérifier la configuration Supabase
- Tester la connexion à la base
- Identifier les problèmes

## 📱 Test de l'Application

1. **Page d'accueil** (`/`) : Présentation de l'app
2. **Inscription** (`/sign-up`) : Créer un compte
3. **Connexion** (`/sign-in`) : Se connecter
4. **Tableau de bord** (`/dashboard`) : Interface principale

## 🔄 Mise à Jour

Pour mettre à jour l'application :

```bash
git pull origin main
npm install
npm run build
npm start
```

## 📞 Support

- **Page de diagnostic** : `/config`
- **Logs** : Console du navigateur
- **Documentation Supabase** : [docs.supabase.com](https://docs.supabase.com)

---

**DentalCare Pro** - Configuration simplifiée pour une gestion dentaire professionnelle.

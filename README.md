# MON-ECOMMERCE - Application E-commerce MERN Stack

Une application e-commerce complète construite avec la stack MERN (MongoDB, Express.js, React.js, Node.js) avec intégration de paiement Stripe.

## Lien deployer

lien : `polite-empanada-8fd1a9.netlify.app`

## 🚀 Fonctionnalités

### Frontend

- Interface utilisateur moderne et responsive
- Navigation intuitive
- Gestion des produits
  - Affichage des produits
  - Filtrage et recherche
  - Détails des produits
- Gestion des utilisateurs
  - Inscription
  - Connexion
  - Profil utilisateur
- Panier d'achat
  - Ajout/Suppression de produits
  - Modification des quantités
  - Calcul automatique des totaux
- Système de commande
  - Processus de commande en plusieurs étapes
  - Historique des commandes
  - Détails des commandes
- Système de paiement
  - Intégration Stripe
  - Paiement par carte de crédit
  - Paiement PayPal
  - Virement bancaire

### Backend

- API RESTful
- Authentification JWT
- Gestion des utilisateurs
- Gestion des produits
- Gestion des commandes
- Gestion des paiements
- Base de données MongoDB

## 🛠️ Technologies Utilisées

### Frontend

- React.js
- Redux Toolkit
- React Router
- Axios
- Stripe.js
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Stripe API
- bcryptjs

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- MongoDB
- Compte Stripe (pour les paiements)
- npm ou yarn

## 🔧 Installation

1. Clonez le repository

```bash
git clone https://github.com/yvesplacide/Checkpoint-E-Commerce.git
```

2. Installation des dépendances Backend

```bash
cd backend
npm install
```

3. Installation des dépendances Frontend

```bash
cd frontend
npm install
```

4. Configuration des variables d'environnement

Créez un fichier `.env` dans le dossier `backend` :

```env
NODE_ENV=development
PORT=5000
MONGO_URI=votre_uri_mongodb
JWT_SECRET=votre_jwt_secret
STRIPE_SECRET_KEY=votre_cle_secrete_stripe
FRONTEND_URL=http://localhost:5173
```

Créez un fichier `.env` dans le dossier `frontend` :

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=votre_cle_publique_stripe
```

## 🚀 Démarrage

1. Démarrez le serveur backend

```bash
cd backend
npm run dev
```

2. Démarrez le serveur frontend

```bash
cd frontend
npm start
```

## 💳 Configuration Stripe

1. Créez un compte sur [Stripe](https://stripe.com)
2. Obtenez vos clés API dans le tableau de bord Stripe
3. Utilisez la clé secrète (sk*test*...) dans le backend
4. Utilisez la clé publique (pk*test*...) dans le frontend

## 🔐 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Authentification JWT
- Protection des routes sensibles
- Validation des données
- Gestion sécurisée des paiements

## 📝 Structure du Projet

```
mon-ecommerce/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── redux/
    │   ├── utils/
    │   └── App.js
    └── package.json
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👥 Auteurs

- Kouame Koffi Yves Placide - Développeur Principal

## 🙏 Remerciements

- Stripe pour leur API de paiement
- La communauté MERN Stack
- Tous les contributeurs

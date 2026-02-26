# SunuLamb - Billetterie Lutte Sénégalaise

SunuLamb est une plateforme de billetterie pour la lutte sénégalaise, conçue pour faciliter l'accès aux combats traditionnels de Lékk Bi Lékk.

## Fonctionnalités

- **Gestion des événements** : Création et gestion des combats de lutte
- **Billetterie numérique** : Achats sécurisés avec génération de QR codes
- **Systèmes de paiement mobile** : Intégration Wave, Orange Money, Free Money
- **Interface utilisateur moderne** : Expérience mobile-first
- **Gamification** : Système de points et récompenses en Wolof

## Structure du projet

- `src/` - Application Next.js principale
- `admin-panel/` - Panneau d'administration autonome (fonctionnel)
- `backend/` - API backend Node.js/Express (fonctionnel)

## Panneau d'administration autonome

Le panneau d'administration complet se trouve dans le dossier `admin-panel/` et est entièrement fonctionnel :

- Accès via http://localhost:5002 après démarrage
- Authentification administrateur
- Gestion des événements de lutte
- Suivi des ventes de billets
- Gestion des utilisateurs
- Tableau de bord analytique

Pour le démarrer :
```bash
cd admin-panel
npm install
node server.js
```

## Backend API

Un backend Node.js/Express complet est disponible dans le dossier `backend/` :

- Système d'authentification JWT
- Gestion des événements
- Gestion des billets avec codes QR
- Intégration des paiements mobiles
- Base de données MongoDB (ou base de données simulée)

Pour le démarrer :
```bash
cd backend
npm install
npm run dev
```

## Installation

1. Clonez le dépôt
2. Installez les dépendances : `npm install`
3. Créez un fichier `.env` basé sur `.env.example`
4. Démarrez le développement : `npm run dev`

## Technologies

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MongoDB
- Node.js
- Express

## Déploiement

Le projet peut être déployé sur Vercel ou tout autre service prenant en charge les applications Next.js.

## Contribuer

Les contributions sont les bienvenues ! Veuillez soumettre une Pull Request.

## Licence

Ce projet est sous licence MIT.
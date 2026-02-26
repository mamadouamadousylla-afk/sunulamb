# SunuLamb - Billetterie Lutte Sénégalaise 🥊🇸🇳

SunuLamb est une application mobile-first de billetterie dédiée à la lutte sénégalaise. Elle offre une expérience ludique, premium et sécurisée pour tous les fans de l'arène.

## ✨ Fonctionnalités

- **Découverte** : Parcourez les prochains grands combats.
- **Réservation intuitive** : Choisissez votre catégorie (VIP, Tribune, Pelouse) en un clic.
- **Paiement Mobile** : Intégration simulée de Wave, Orange Money et Free Money.
- **Tickets Numériques** : QR Code unique généré pour chaque accès.
- **Gamification** : Système de points et messages de bienvenue en Wolof ("Jërejëf").

## 🚀 Installation locale

1. **Clonez le dépôt** (une fois poussé sur GitHub).
2. **Installez les dépendances** :
   ```bash
   npm install
   ```
3. **Configurez les variables d'environnement** :
   ```bash
   cp .env.example .env.local
   # Éditez .env.local avec vos propres valeurs
   ```
4. **Initialisez la base de données** :
   ```bash
   npx prisma migrate dev
   ```
5. **Lancez le serveur de développement** :
   ```bash
   npm run dev
   ```
6. **Ouvrez [http://localhost:3000](http://localhost:3000)** sur votre navigateur (mode mobile recommandé).

## 🏗️ Architecture Production

Ce projet comprend une architecture complète pour la production :

### 1. Base de données (PostgreSQL)
- Modèles pour utilisateurs, événements, tickets et transactions
- Contrôle d'accès basé sur les rôles (ADMIN, ORGANISATEUR, UTILISATEUR)
- Gestion des paramètres dynamiques du site

### 2. Authentification & Autorisation
- NextAuth.js avec support multi-fournisseurs
- Contrôle d'accès basé sur les rôles
- Sessions sécurisées

### 3. Panneau d'administration
- Tableau de bord avec statistiques en temps réel
- Gestion des événements et des utilisateurs
- Suivi des transactions
- Système de gestion de contenu (CMS)

### 4. Intégrations de paiement
- Agrégateur de paiement (Hub2, PayTech ou API directe)
- Webhooks pour la génération automatique de tickets
- Support pour Wave, Free Money et Orange Money

### 5. Services de communication
- Gateway SMS pour l'envoi de codes QR
- Service SMTP pour les emails transactionnels
- Notifications push

## 📁 Structure du projet

```
src/
├── app/                 # Routes Next.js
│   ├── admin/          # Panneau d'administration
│   ├── api/            # Endpoints API
│   └── ...             # Autres pages
├── components/         # Composants réutilisables
│   ├── admin/          # Composants admin
│   ├── ui/             # Composants UI
│   └── ...             # Autres composants
├── lib/               # Utilitaires et bibliothèques
├── services/          # Services métier
└── auth/              # Configuration d'authentification
```

## 🛠️ Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run start` - Démarre le serveur de production
- `npm run db:migrate` - Applique les migrations de base de données
- `npm run db:studio` - Ouvre Prisma Studio

## 🚢 Déploiement

Le projet inclut un fichier Dockerfile pour le déploiement en production :
- Image optimisée avec multi-stage build
- Support pour les variables d'environnement
- Prêt pour les plateformes cloud (Vercel, AWS, GCP, etc.)

---

*Sunu Lamb, Sunu Fierté !*
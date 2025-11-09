# Eloquent AI 🎙️

Application web de coaching d'éloquence avec analyse IA de vidéos.

## 🚀 Fonctionnalités

- ✅ Analyse vidéo avec Gemini AI
- ✅ Rapports détaillés (débit, clarté, structure)
- ✅ Système de gamification (XP, niveaux, streaks)
- ✅ Dashboard moderne avec animations
- ✅ Upload drag & drop

## 🛠️ Stack Technique

- **Framework:** Next.js 14 (App Router)
- **Langage:** TypeScript
- **Styling:** Tailwind CSS
- **UI:** shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Database:** Prisma + SQLite
- **IA:** Gemini API 1.5 Pro

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Ajouter votre clé API Gemini

# Initialiser la base de données
npx prisma generate
npx prisma db push

# Lancer le serveur de développement
npm run dev
```

## 🌐 Déploiement sur Vercel

1. Pusher le code sur GitHub
2. Importer le projet sur [Vercel](https://vercel.com)
3. Ajouter les variables d'environnement :
   - `GEMINI_API_KEY`
   - `NEXTAUTH_SECRET`
4. Déployer !

## 📝 Variables d'environnement

Voir `.env.example` pour la liste complète.

## 🎨 Design

Interface moderne avec :
- Thème dark-first
- Effets glass morphism
- Animations fluides (Framer Motion)
- Gradients dynamiques
- Responsive design

## 📄 License

MIT

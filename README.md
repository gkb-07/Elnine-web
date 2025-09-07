# **Elnine Web App**

Elnine is a **modern audio streaming platform** built with **Next.js**, **TypeScript**, and **TailwindCSS**.
The goal is to create a platform where users can explore audio content, manage playlists, like tracks, and maintain a personal library — similar to apps like Spotify or Quinn.

This repository contains the **web application**, while the mobile app will live in a separate repo (`Elnine-mobile`).

---

## **Tech Stack**

| Category             | Technology                                    |
| -------------------- | --------------------------------------------- |
| **Frontend**         | Next.js (App Router), TypeScript, TailwindCSS |
| **Authentication**   | NextAuth.js (or Supabase/Clerk later)         |
| **API**              | Next.js API Routes                            |
| **Database**         | PostgreSQL with Prisma (planned)              |
| **State Management** | Zustand (for global audio player state)       |
| **Audio Player**     | HTML5 Audio API (custom player component)     |
| **Deployment**       | Vercel                                        |

---

## **Folder Structure**

```
Elnine-web/
├─ app/                            # Core Next.js routes and pages
│  ├─ layout.tsx                    # Root layout (header, footer, sticky player)
│  ├─ page.tsx                      # Home page (landing page)
│  │
│  ├─ about/                         # /about
│  │  └─ page.tsx
│  │
│  ├─ categories/                    # /categories
│  │  ├─ page.tsx                     # List all categories
│  │  └─ [slug]/page.tsx              # Dynamic category page, e.g., /categories/music
│  │
│  ├─ creators/                       # /creators
│  │  ├─ page.tsx                     # List of all creators
│  │  └─ [id]/page.tsx                # Dynamic creator page, e.g., /creators/123
│  │
│  ├─ library/                         # Authenticated user section
│  │  ├─ page.tsx                      # Library dashboard
│  │  ├─ history/                       # /library/history
│  │  │  └─ page.tsx
│  │  ├─ liked/                         # /library/liked
│  │  │  └─ page.tsx
│  │  └─ playlists/                     # /library/playlists
│  │     └─ page.tsx
│  │
│  └─ api/                              # Backend API routes
│     ├─ auth/route.ts                   # Authentication endpoints (NextAuth)
│     ├─ playlists/route.ts              # Playlist-related API
│     └─ tracks/route.ts                 # Tracks and audio data API
│
├─ components/                          # Reusable UI components
│  ├─ layout/                            # Layout components
│  │  ├─ Header.tsx
│  │  └─ Footer.tsx
│  │
│  ├─ player/                            # Audio player components
│  │  ├─ AudioPlayer.tsx
│  │  └─ PlayerControls.tsx
│  │
│  ├─ track/                             # Track-related components
│  │  ├─ TrackCard.tsx
│  │  └─ TrackList.tsx
│  │
│  └─ ui/                                # Generic UI elements (buttons, inputs, etc.)
│     ├─ Button.tsx
│     ├─ Input.tsx
│     └─ Card.tsx
│
├─ hooks/                               # Custom React hooks
│  ├─ useAudioPlayer.ts                  # Global audio player state with Zustand
│  └─ useDebounce.ts                      # Helper hook for search inputs
│
├─ lib/                                 # Helper utilities and configs
│  ├─ audio.ts                           # Audio helper functions
│  ├─ fetcher.ts                         # API client wrapper
│  ├─ prisma.ts                          # Prisma client setup (for DB)
│  └─ auth.ts                            # Authentication utilities
│
├─ prisma/                              # Prisma schema and migrations
│  └─ schema.prisma
│
├─ public/                              # Public static assets
│  ├─ logo.svg
│  └─ images/
│
├─ styles/                              # Global styling
│  └─ globals.css                        # Tailwind + custom styles
│
├─ types/                               # Shared TypeScript types
│  ├─ audio.ts
│  └─ api.ts
│
├─ .env.example                         # Documented environment variables
├─ tailwind.config.ts                    # Tailwind configuration
├─ tsconfig.json                         # TypeScript configuration
└─ README.md                             # Project documentation
```

---

## **Route Overview**

| Route                | Description                    |
| -------------------- | ------------------------------ |
| `/`                  | Landing page                   |
| `/about`             | About Elnine                   |
| `/categories`        | All categories                 |
| `/categories/[slug]` | Category details (dynamic)     |
| `/creators`          | List of all creators           |
| `/creators/[id]`     | Creator details (dynamic)      |
| `/library`           | User dashboard (auth required) |
| `/library/liked`     | User's liked tracks            |
| `/library/playlists` | User's playlists               |
| `/library/history`   | Recently played                |

---

## **Getting Started**

### 1. **Clone the repository**

```bash
git clone https://github.com/<your-username>/Elnine-web.git
cd Elnine-web
```

### 2. **Install dependencies**

```bash
npm install
# or
pnpm install
```

### 3. **Set up environment variables**

Create a `.env.local` file and add:

```
DATABASE_URL=your_postgres_connection_url
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000
```

---

## **Scripts**

| Command          | Description                  |
| ---------------- | ---------------------------- |
| `npm run dev`    | Start development server     |
| `npm run build`  | Create production build      |
| `npm run start`  | Run production build locally |
| `npm run lint`   | Lint project files           |
| `npm run prisma` | Run Prisma commands          |

---

## **Planned Features**

* [ ] Homepage with featured audio and trending section
* [ ] User authentication with NextAuth.js
* [ ] Audio streaming with a global sticky player
* [ ] Playlist creation and management
* [ ] Liked audio and personal library
* [ ] Search and category filters
* [ ] Creator profiles and content browsing
* [ ] PostgreSQL + Prisma integration
* [ ] Deployment on Vercel

---

## **Contributing**

1. Fork the repo
2. Create a new feature branch:

   ```bash
   git checkout -b feature/awesome-feature
   ```
3. Commit changes:

   ```bash
   git commit -m "feat: add awesome feature"
   ```
4. Push and open a Pull Request.

---

## **Deployment**

* **Frontend & API:** [Vercel](https://vercel.com/)
* **Database:** [Supabase](https://supabase.com/) or [Neon Postgres](https://neon.tech/)

---

## **License**

This project is licensed under the MIT License.

---

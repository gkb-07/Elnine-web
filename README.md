# **Elnine Web App**

Elnine is a **modern audio streaming platform** built with **Next.js**, **TypeScript**, **TailwindCSS**, and **Supabase**.
The platform allows users to **explore audio content**, **manage playlists**, **like tracks**, and **maintain a personal library** — similar to apps like **Spotify** or **Quinn**.

The **web application** is contained in this repository. A separate repository (`Elnine-mobile`) will handle the mobile app.

---

## **Tech Stack**

| Category             | Technology                                    |
| -------------------- | --------------------------------------------- |
| **Frontend**         | Next.js (App Router), TypeScript, TailwindCSS |
| **Authentication**   | Supabase Auth (Google & Email/Password)       |
| **Database**         | Supabase (PostgreSQL)                         |
| **API**              | Supabase Edge Functions + Next.js API Routes  |
| **State Management** | Zustand (for global audio player state)       |
| **Audio Player**     | HTML5 Audio API (custom player component)     |
| **Deployment**       | Vercel                                        |

---

## **Updated Folder Structure**

```
elnine-web/
├─ app/                                # Core Next.js routes and pages
│  ├─ layout.tsx                        # Root layout (header, footer, sticky player)
│  ├─ page.tsx                          # Home page (landing page)
│  │
│  ├─ about/                             # /about
│  │  └─ page.tsx
│  │
│  ├─ categories/                        # /categories
│  │  ├─ page.tsx                         # List all categories
│  │  └─ [slug]/page.tsx                  # Dynamic category page, e.g., /categories/music
│  │
│  ├─ creators/                           # /creators
│  │  ├─ page.tsx                         # List of all creators
│  │  └─ [id]/page.tsx                    # Dynamic creator page, e.g., /creators/123
│  │
│  ├─ signin/                             # /signin
│  │  └─ page.tsx                          # User login (Google + Email/Password)
│  │
│  ├─ signup/                             # /signup
│  │  └─ page.tsx                          # User registration (Google + Email/Password)
│  │
│  ├─ forgot-password/                     # /forgot-password
│  │  └─ page.tsx                          # Password reset request page
│  │
│  ├─ update-password/                     # /update-password
│  │  └─ page.tsx                          # Update password page
│  │
│  ├─ library/                             # Authenticated user section
│  │  ├─ page.tsx                          # Library dashboard
│  │  ├─ history/                           # /library/history
│  │  │  └─ page.tsx
│  │  ├─ liked/                             # /library/liked
│  │  │  └─ page.tsx
│  │  └─ playlists/                         # /library/playlists
│  │     └─ page.tsx
│  │
│  ├─ api/                                  # Backend API routes
│  │  ├─ auth/route.ts                       # Authentication handling (Supabase)
│  │  ├─ playlists/route.ts                  # Playlist-related API
│  │  └─ tracks/route.ts                     # Tracks and audio data API
│  │
│  └─ auth/callback/route.ts                # OAuth callback handler for Supabase
│
├─ components/                              # Reusable UI components
│  ├─ layout/                                # Layout components
│  │  ├─ Header.tsx
│  │  ├─ Footer.tsx
│  │  └─ HeaderClientMenu.tsx                # Shows Login/Signup or user profile dropdown
│  │
│  ├─ player/                                # Audio player components
│  │  ├─ AudioPlayer.tsx
│  │  └─ PlayerControls.tsx
│  │
│  ├─ track/                                 # Track-related components
│  │  ├─ TrackCard.tsx
│  │  └─ TrackList.tsx
│  │
│  └─ ui/                                    # Generic UI elements (buttons, inputs, etc.)
│     ├─ Button.tsx
│     ├─ Input.tsx
│     └─ Card.tsx
│
├─ hooks/                                   # Custom React hooks
│  ├─ useAudioPlayer.ts                      # Global audio player state with Zustand
│  └─ useDebounce.ts                         # Helper hook for search inputs
│
├─ lib/                                     # Helper utilities and configs
│  ├─ supabase/                              # Supabase client setup
│  │  ├─ browser.ts                          # Supabase client for client-side usage
│  │  └─ server.ts                           # Supabase client for server-side usage
│  │
│  ├─ audio.ts                               # Audio helper functions
│  ├─ fetcher.ts                             # API client wrapper
│  ├─ prisma.ts                              # Prisma setup (future database migration support)
│  └─ auth.ts                                # Authentication utilities
│
├─ prisma/                                  # Prisma schema and migrations
│  └─ schema.prisma
│
├─ public/                                  # Public static assets
│  ├─ logo.svg
│  └─ images/
│
├─ styles/                                  # Global styling
│  └─ globals.css                            # Tailwind + custom styles
│
├─ types/                                   # Shared TypeScript types
│  ├─ audio.ts
│  └─ api.ts
│
├─ .env.local                               # Environment variables
│
├─ tailwind.config.ts                        # Tailwind configuration
├─ tsconfig.json                             # TypeScript configuration
├─ postcss.config.js                         # PostCSS config
└─ README.md                                 # Project documentation
```

---

## **Authentication Flow**

We use **Supabase Auth** for authentication:

1. **Sign Up Options**

   * Google OAuth
   * Email + Password

2. **Login**

   * Google OAuth
   * Email + Password

3. **Password Management**

   * Forgot password flow
   * Update password flow

4. **User Session**

   * Once logged in, the `Log In` and `Sign Up` buttons are replaced with the **user's profile initial** and a dropdown menu containing:

     * Library
     * Settings
     * Logout

---

## **Environment Variables**

Create a `.env.local` file in the root directory and include:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional future use:
DATABASE_URL=your_postgres_connection_url
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000
```
---

## **Getting Started**

### 1. **Clone the repository**

```bash
git clone https://github.com/<your-username>/Elnine-web.git
cd elnine-web
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Run development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## **Supabase Setup**

1. **Enable Authentication Providers**

   * Go to `Supabase → Authentication → Providers`.
   * Enable **Google** and **Email/Password**.

2. **Add Redirect URL**

   ```
   http://localhost:3000/auth/callback
   ```

3. **Configure Policies**

   * Enable Row Level Security (RLS) on tables.
   * Add policies for playlists, liked songs, etc.

4. **Database Setup**

   * Supabase will handle database migrations.
   * Future support for Prisma migration tracking.

---

## **Routes Overview**

| Route                | Description                       |
| -------------------- | --------------------------------- |
| `/`                  | Landing page                      |
| `/about`             | About Elnine                      |
| `/signin`            | Login page (Google or Email/Pass) |
| `/signup`            | Sign up page                      |
| `/forgot-password`   | Request password reset            |
| `/update-password`   | Update password after reset       |
| `/library`           | User dashboard (auth required)    |
| `/library/liked`     | User's liked tracks               |
| `/library/playlists` | User's playlists                  |
| `/library/history`   | Recently played                   |
| `/categories`        | All categories                    |
| `/categories/[slug]` | Dynamic category details          |
| `/creators`          | All creators                      |
| `/creators/[id]`     | Dynamic creator details           |

---

## **Planned Features**

* [ ] Fully responsive UI
* [ ] Audio streaming with Supabase storage
* [ ] Playlist creation and sharing
* [ ] Search and category filtering
* [ ] Creator profiles and monetization features
* [ ] Deploy to Vercel with Supabase backend

---

## **Deployment**

* **Frontend & API:** [Vercel](https://vercel.com/)
* **Backend & Database:** [Supabase](https://supabase.com/)

---

This updated README reflects:

* Supabase integration for authentication and database.
* Clear folder organization with `signin`, `signup`, and password reset flows.
* Updated instructions for `.env.local` setup.
* Deployment-ready project structure.

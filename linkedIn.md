

## 📁 Folder Structure for Social Media Automation Dashboard

This project follows a modular, scalable structure to support automation for multiple social platforms — **YouTube**, **LinkedIn**, **Instagram**, and **Facebook**.

Each module contains its own routes, services, and hooks for clear separation and easy maintenance.

---

```bash
src/
├── app/                                # Next.js App Router
│   ├── auth/                           # Authentication pages
│   │   ├── login/                      # User login
│   │   ├── signup/                     # User registration
│   │   ├── credential/                 # API credentials setup
│   │   ├── youtube-connect/            # YouTube OAuth integration
│   │   ├── linkedin-connect/           # LinkedIn OAuth integration
│   │   ├── instagram-connect/          # Instagram OAuth integration
│   │   └── facebook-connect/           # Facebook OAuth integration
│
│   ├── dashboard/                      # Main dashboard
│   │   ├── videos/                     # Manage uploaded videos
│   │   ├── playlists/                  # Playlist management
│   │   ├── upload/                     # Video upload interface
│   │   ├── user-settings/              # User profile & account settings
│   │
│   │   ├── linkedin-automation/        # 🆕 LinkedIn Automation Module
│   │   │   ├── page.tsx                # LinkedIn automation UI
│   │   │   ├── services/
│   │   │   │   └── linkedinService.ts  # LinkedIn API integration
│   │   │   ├── hooks/
│   │   │   │   ├── useLinkedInAuth.ts  # Auth & token handling
│   │   │   │   ├── useAutoPost.ts      # Auto-posting logic
│   │   │   │   └── useLinkedInStats.ts # Stats & analytics
│   │   │   ├── assets/
│   │   │   │   └── linkedin.svg
│   │   │   └── components/
│   │   │       ├── LinkedInPostCard.tsx
│   │   │       ├── LinkedInScheduler.tsx
│   │   │       └── LinkedInStatsCard.tsx
│   │
│   │   ├── instagram-automation/       # 🆕 Instagram Automation Module
│   │   │   ├── page.tsx
│   │   │   ├── services/
│   │   │   │   └── instagramService.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useInstagramAuth.ts
│   │   │   │   ├── useAutoPost.ts
│   │   │   │   └── useInstagramStats.ts
│   │   │   └── assets/
│   │   │       └── instagram.svg
│   │
│   │   └── facebook-automation/        # 🆕 Facebook Automation Module
│   │       ├── page.tsx
│   │       ├── services/
│   │       │   └── facebookService.ts
│   │       ├── hooks/
│   │       │   ├── useFacebookAuth.ts
│   │       │   ├── useAutoPost.ts
│   │       │   └── useFacebookStats.ts
│   │       └── assets/
│   │           └── facebook.svg
│
│   ├── youtube-studio-dashboard/       # YouTube Studio clone
│   │   ├── Analytics/
│   │   ├── Content/
│   │   ├── Community/
│   │   ├── Earn/
│   │   └── [other studio features]/
│
│   ├── feature-showcase/               # Feature showcase page
│   ├── about-page/                     # About page
│   └── globals.css                     # Global styles
│
├── components/                         # Reusable UI components
│   ├── landing-page-components/
│   ├── dashboard/
│   │   ├── overview/
│   │   ├── videos/
│   │   ├── youtube-videos/
│   │   ├── linkedin-automation/
│   │   ├── instagram-automation/
│   │   └── facebook-automation/
│   ├── upload/
│   │   ├── sections/
│   │   └── ui/
│   └── ui/                             # Shadcn/UI base components
│
├── lib/                                # Shared logic, utilities & APIs
│   ├── hooks/
│   │   ├── auth/
│   │   ├── ai/
│   │   ├── youtube/
│   │   ├── linkedin/
│   │   ├── instagram/
│   │   ├── facebook/
│   │   ├── dashboard/
│   │   ├── upload/
│   │   └── common/
│   ├── auth.ts
│   ├── utils.ts
│   └── services/
│       ├── linkedinService.ts
│       ├── instagramService.ts
│       └── facebookService.ts
│
├── types/                              # TypeScript type definitions
│   ├── dashboard/
│   ├── linkedin.d.ts
│   ├── instagram.d.ts
│   ├── facebook.d.ts
│   └── upload.ts
│
├── styles/                             # Extra stylesheets
├── public/                             # Static assets
└── scripts/                            # Developer/utility scripts
```

---

### ⚙️ Modular Breakdown

| Module                | Purpose                                            |
| --------------------- | -------------------------------------------------- |
| **YouTube**           | Upload, schedule, and analyze YouTube videos       |
| **LinkedIn**          | Automate posts, schedule content, track engagement |
| **Instagram**         | Manage reels, stories, and posts via automation    |
| **Facebook**          | Handle Facebook page posting and analytics         |
| **Shared Components** | Reusable UI elements built with Shadcn & Tailwind  |

---

### 🧩 Highlights

* ✅ **Clean Modular Design** — Each social media platform isolated in its own module
* ♻️ **Code Reusability** — Shared UI & hooks for all automation modules
* 🚀 **Scalable Architecture** — Easily extend to future platforms (Twitter, TikTok, etc.)
* 🔐 **Secure OAuth Integration** — Platform-specific authentication flows

---



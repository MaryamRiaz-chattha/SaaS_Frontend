

```markdown
## 📂 Project Folder Structure

```

src/
├── app/                                # Next.js App Router
│   ├── auth/                           # Authentication pages
│   │   ├── login/                      # User login
│   │   ├── signup/                     # User registration
│   │   ├── credential/                 # API credentials setup
│   │   ├── youtube-connect/            # YouTube OAuth connection
│   │   ├── linkedin-connect/           # LinkedIn OAuth connection
│   │   ├── instagram-connect/          # Instagram OAuth connection
│   │   └── facebook-connect/           # Facebook OAuth connection
│
│   ├── dashboard/                      # Main dashboard
│   │   ├── videos/                     # Video management
│   │   ├── playlists/                  # Playlist management
│   │   ├── upload/                     # Video upload interface
│   │   ├── user-settings/              # User settings
│   │   ├── linkedin-automation/        # 🆕 LinkedIn Automation module
│   │   │   ├── page.tsx                # Main LinkedIn automation page (UI + logic)
│   │   │   ├── layout.tsx              # Optional layout (if needed)
│   │   │   ├── services/
│   │   │   │   └── linkedinService.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useLinkedInAuth.ts
│   │   │   │   ├── useAutoPost.ts
│   │   │   │   └── useLinkedInStats.ts
│   │   │   ├── assets/
│   │   │   │   └── linkedin.svg
│   │   │   └── components/
│   │   │       ├── LinkedInPostCard.tsx
│   │   │       ├── LinkedInScheduler.tsx
│   │   │       └── LinkedInStatsCard.tsx
│   │   │
│   │   ├── instagram-automation/       # 🆕 Instagram Automation module
│   │   │   ├── page.tsx
│   │   │   ├── services/
│   │   │   │   └── instagramService.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useInstagramAuth.ts
│   │   │   │   ├── useAutoPost.ts
│   │   │   │   └── useInstagramStats.ts
│   │   │   └── assets/
│   │   │       └── instagram.svg
│   │   │
│   │   └── facebook-automation/        # 🆕 Facebook Automation module
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
│   ├── feature-showcase/               # Feature showcase
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
├── lib/                                # Utilities, hooks, and API logic
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
└── scripts/                            # Dev/utility scripts

```
(for a professional README)?
```

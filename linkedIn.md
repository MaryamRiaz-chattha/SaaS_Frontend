src/
├── app/                                # Next.js App Router
│   ├── auth/                           # Authentication pages
│   │   ├── login/                     # User login
│   │   ├── signup/                    # User registration
│   │   ├── credential/                # API credentials setup
│   │   └── youtube-connect/           # YouTube OAuth connection
│   ├── dashboard/                     # Main dashboard
│   │   ├── videos/                    # Video management
│   │   ├── playlists/                 # Playlist management
│   │   ├── upload/                    # Video upload interface
│   │   ├── user-settings/             # User settings
│   │   └── linkedin-automation/       # 🆕 LinkedIn Automation module
│   │       ├── page.tsx               # Main LinkedIn automation page (UI + logic)
│   │       ├── layout.tsx             # Optional layout (if needed)
│   │       ├── services/              # LinkedIn API logic
│   │       │   └── linkedinService.ts
│   │       ├── hooks/                 # Custom LinkedIn hooks
│   │       │   ├── useLinkedInAuth.ts
│   │       │   └── useAutoPost.ts
│   │       ├── assets/                # Icons or images
│   │       │   └── linkedin.svg
│   │       └── components/ (optional) # If some UI parts are specific to this module
│   ├── youtube-studio-dashboard/      # YouTube Studio clone
│   │   ├── Analytics/
│   │   ├── content/
│   │   ├── Community/
│   │   ├── Earn/
│   │   └── [other studio features]/
│   ├── feature-showcase/              # Feature showcase
│   ├── about-page/                    # About page
│   └── globals.css                    # Global styles
│
├── components/                        # Reusable UI components
│   ├── landing-page-components/
│   ├── dashboard/
│   │   ├── overview/
│   │   ├── videos/
│   │   ├── youtube-videos/
│   │   └── linkedin-automation/       # 🆕 LinkedIn-specific reusable UI
│   │       ├── LinkedInPostCard.tsx
│   │       ├── LinkedInScheduler.tsx
│   │       └── LinkedInStatsCard.tsx
│   ├── upload/
│   │   ├── sections/
│   │   └── ui/
│   └── ui/                            # Shadcn/ui components
│
├── lib/                               # Utilities, hooks, and API logic
│   ├── hooks/
│   │   ├── auth/
│   │   ├── ai/
│   │   ├── youtube/
│   │   ├── dashboard/
│   │   ├── upload/
│   │   ├── common/
│   │   └── linkedin/                  # 🆕 LinkedIn automation hooks
│   │       ├── useLinkedInAuth.ts
│   │       ├── useAutoPost.ts
│   │       └── useLinkedInStats.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── services/
│       └── linkedinService.ts         # 🆕 Central LinkedIn API functions
│
├── types/                             # TypeScript type definitions
│   ├── dashboard/
│   ├── linkedin.d.ts                  # 🆕 LinkedIn-related types
│   └── upload.ts
│
├── styles/                            # Extra stylesheets
├── public/                            # Static assets
└── scripts/                           # Dev/utility scripts

# SaaS YouTube Management Platform

A comprehensive YouTube content management platform built with Next.js 15, React 19, and TypeScript. This SaaS application provides creators with powerful tools to manage, analyze, and optimize their YouTube content with AI-powered features.

## 🚀 Features

### Core Functionality
- **YouTube Integration**: Seamless OAuth integration with YouTube API
- **Video Management**: Upload, edit, and manage YouTube videos
- **Playlist Management**: Create and organize video playlists
- **Analytics Dashboard**: Comprehensive performance metrics and insights
- **AI-Powered Tools**: Gemini AI integration for content optimization
- **YouTube Studio Clone**: Full-featured studio interface

### Key Capabilities
- Video upload with drag-and-drop interface
- AI-generated titles, descriptions, and timestamps
- Thumbnail generation and management
- Real-time analytics and performance tracking
- Comment management system
- Content scheduling and automation
- Responsive design for all devices

## 🏗️ Project Structure

```
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── auth/                     # Authentication pages
│   │   │   ├── login/               # User login
│   │   │   ├── signup/              # User registration
│   │   │   ├── credential/          # API credentials setup
│   │   │   └── youtube-connect/     # YouTube OAuth connection
│   │   ├── dashboard/               # Main dashboard
│   │   │   ├── videos/              # Video management
│   │   │   ├── playlists/           # Playlist management
│   │   │   ├── upload/              # Video upload interface
│   │   │   └── user-settings/       # User settings
│   │   ├── youtube-studio-dashboard/ # YouTube Studio clone
│   │   │   ├── Analytics/           # Analytics interface
│   │   │   ├── content/             # Content management
│   │   │   ├── Community/           # Community features
│   │   │   ├── Earn/                # Monetization tools
│   │   │   └── [other studio features]/
│   │   ├── feature-showcase/        # Feature showcase
│   │   ├── about-page/              # About page
│   │   └── globals.css              # Global styles
│   ├── components/                   # Reusable UI components
│   │   ├── landing-page-components/ # Landing page components
│   │   ├── dashboard/               # Dashboard-specific components
│   │   │   ├── overview/            # Dashboard overview
│   │   │   ├── videos/              # Video components
│   │   │   └── youtube-videos/      # YouTube video components
│   │   ├── upload/                  # Upload workflow components
│   │   │   ├── sections/            # Upload step sections
│   │   │   └── ui/                  # Upload UI components
│   │   └── ui/                      # Shadcn/ui components
│   ├── lib/                          # Libraries, utils, and hooks
│   │   ├── hooks/                    # Custom React hooks (moved here)
│   │   │   ├── auth/                # Authentication hooks
│   │   │   ├── ai/                  # AI integration hooks
│   │   │   ├── youtube/             # YouTube API hooks
│   │   │   ├── dashboard/           # Dashboard data hooks
│   │   │   ├── upload/              # Upload workflow hooks
│   │   │   └── common/              # Shared utility hooks
│   │   ├── auth.ts                   # Auth utilities
│   │   └── utils.ts                  # Common utilities
│   ├── types/                         # TypeScript type definitions
│   │   ├── dashboard/                 # Dashboard types
│   │   └── upload.ts                  # Upload types
│   └── styles/                        # Additional stylesheets
├── public/                            # Static assets
└── scripts/                           # Dev scripts (e.g., import updaters)
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern UI component library

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library
- **Recharts**: Data visualization charts
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Integrations
- **YouTube API**: Video and channel management
- **Google Gemini AI**: Content generation and optimization
- **React Dropzone**: File upload handling
- **Axios**: HTTP client for API requests

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdul-hannan-coder/SaaS_Frontend_final.git
   cd SaaS_Frontend_final
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_YOUTUBE_CLIENT_ID=your_youtube_client_id
   NEXT_PUBLIC_YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Path Aliases
- The project uses an absolute import alias: `@/*` → `src/*` (configured in `tsconfig.json`).
- Examples:
  - `import { Button } from '@/components/ui/button'`
  - `import useAuth from '@/lib/hooks/auth/useAuth'`

### YouTube API Setup
1. Create a project in Google Cloud Console
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs
5. Configure consent screen

### Gemini AI Setup
1. Get API key from Google AI Studio
2. Add to environment variables
3. Configure AI model parameters

## 📱 Key Features Breakdown

### Authentication System
- OAuth integration with YouTube
- Secure credential management
- Session handling with NextAuth

### Video Management
- Drag-and-drop upload interface
- AI-powered metadata generation
- Thumbnail creation and editing
- Video preview and editing tools

### Analytics Dashboard
- Real-time performance metrics
- Channel growth insights
- Video performance tracking
- Engagement analytics

### AI Integration
- Automated title generation
- Description optimization
- Timestamp creation
- Content suggestions

## 🎯 Usage

### Getting Started
1. Sign up for an account
2. Connect your YouTube channel
3. Set up API credentials
4. Start uploading and managing content

### Uploading Videos
1. Navigate to Upload section
2. Drag and drop video files
3. Use AI tools for optimization
4. Schedule or publish immediately

### Managing Content
1. View all videos in dashboard
2. Edit metadata and thumbnails
3. Analyze performance metrics
4. Organize into playlists

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Other Platforms
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Repository**: [GitHub](https://github.com/Abdul-hannan-coder/SaaS_Frontend_final)
- **Live Demo**: [Coming Soon]
- **Documentation**: [Coming Soon]

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: [Your Email]

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- Google for YouTube API and Gemini AI
- Vercel for hosting platform

---

**Built with ❤️ by Abdul Hannan**
# Updated for main branch deployment

# Sleek Portfolio

A modern, responsive portfolio website built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn UI. Features a blog system, project showcase, work experience timeline, admin panel, and contact form with Telegram integration.

![Portfolio Preview](/public/meta/hero.png)

## Features

- **Next.js 15** with App Router
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **Dark/Light** mode with smooth transitions
- **Responsive** design
- **MDX** for blog posts and project details
- **Admin Panel** with NextAuth authentication
- **Blog Management** with CRUD operations
- **Advanced Code Editor** with CodeMirror
- **Math Rendering** with KaTeX
- **Contact Form** with Telegram integration
- **Smooth Scrolling** with Lenis
- **SEO** optimized
- **TypeScript** for type safety
- **Umami Analytics** for privacy-focused web analytics
- **Automated Code Quality** with Husky and Lint-Staged

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Telegram Integration
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_CHAT_ID="your-chat-id"

# AI Integration (Optional)
GEMINI_API_KEY="your-api-key"

# Environment
NODE_ENV="development"
NEXT_PUBLIC_URL="http://localhost:3000"

# Umami Analytics (Optional)
NEXT_PUBLIC_UMAMI_SRC="your-umami-script-url"
NEXT_PUBLIC_UMAMI_ID="your-umami-website-id"

# NextAuth (for Admin Panel)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### Setting up Telegram Integration

1. Create a new bot with [@BotFather](https://t.me/botfather) on Telegram
2. Copy the bot token and add it to your `.env.local` file as `TELEGRAM_BOT_TOKEN`
3. Start a chat with your bot and send any message (e.g., "hello")
4. Get your chat ID:

   ```bash
   npm run test-telegram
   ```

   - The script will show your Chat ID from the message you sent
   - Copy the Chat ID and add it to your `.env.local` file as `TELEGRAM_CHAT_ID`
   - Run the script again to verify everything works

### Setting up Umami Analytics (Optional)

1. Visit Umami:
   - Self-host Umami or use [Umami Cloud](https://cloud.umami.is)
   - Follow Umami's [installation guide](https://umami.is/docs/install)

2. Get your credentials:
   - Copy your Umami script URL (ends with `/script.js`)
   - Get your website ID from Umami dashboard

3. Configure environment variables:
   ```env
   NEXT_PUBLIC_UMAMI_SRC="https://[your-umami-instance]/script.js"
   NEXT_PUBLIC_UMAMI_ID="your-website-id"
   ```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/satyamsingh5512/portfolio.git
   cd portfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test-telegram # Test Telegram bot integration
npm run knip         # Find unused code and dependencies
```

## Configuration

The project uses configuration files in the `src/config` directory for easy customization:

- `About.tsx` - About section content
- `Contact.tsx` - Contact form settings
- `Experience.tsx` - Work experience details
- `Footer.tsx` - Footer links and content
- `Gears.tsx` - Equipment/gear section
- `Hero.tsx` - Hero section content
- `Meta.tsx` - SEO and metadata
- `Navbar.tsx` - Navigation links
- `Projects.tsx` - Project showcase settings
- `Quote.ts` - Random quotes configuration
- `Resume.ts` - Resume section details
- `Setup.tsx` - Development setup information
- `Cat.ts` - Enable/disable the cat animation

## Project Structure

```
portfolio/
├── public/              # Static assets
│   ├── assets/         # General assets
│   ├── blog/           # Blog post images
│   ├── company/        # Company logos
│   ├── meta/          # Meta images
│   ├── project/       # Project thumbnails
│   ├── setup/         # Setup files
│   └── skills/        # Skill icons
├── src/
│   ├── app/           # Next.js app router pages
│   │   ├── admin/    # Admin panel pages
│   │   ├── api/      # API routes
│   │   └── ...       # Other pages
│   ├── components/    # React components
│   │   ├── admin/    # Admin components
│   │   ├── blog/     # Blog components
│   │   ├── common/   # Shared components
│   │   ├── landing/  # Landing page sections
│   │   ├── svgs/     # SVG icons
│   │   ├── technologies/ # Technology icons
│   │   └── ui/       # Shadcn UI components
│   ├── config/       # Configuration files
│   ├── data/         # MDX content
│   │   ├── blog/    # Blog posts
│   │   └── projects/ # Project details
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── types/        # TypeScript types
│   └── validate/     # Validation scripts
└── scripts/          # Utility scripts
```

## Adding Content

### Blog Posts

1. Create a new MDX file in `src/data/blog/`
2. Add frontmatter with metadata:
   ```mdx
   ---
   title: "Your Blog Post Title"
   description: "Brief description"
   date: "2024-01-15"
   tags: ["nextjs", "react", "typescript"]
   image: "/blog/your-image.png"
   ---
   ```
3. Add blog thumbnail in `public/blog/`
4. Or use the admin panel at `/admin` to create posts

### Projects

1. Create a new MDX file in `src/data/projects/`
2. Add frontmatter with metadata:
   ```mdx
   ---
   title: "Your Project"
   description: "Project description"
   date: "2024-01-15"
   tags: ["react", "typescript"]
   image: "/project/your-image.png"
   github: "https://github.com/..."
   live: "https://..."
   ---
   ```
3. Add project thumbnail in `public/project/`

### Adding New Technology Icons

1. Visit [Devicon](https://devicon.dev/) to find the icon you want
2. Create a new component in `src/components/technologies/`
3. Follow the existing component structure

Example:

```tsx
export const NewTechIcon = () => {
  return <svg>// SVG content from devicon</svg>;
};
```

## Admin Panel

Access the admin panel at `/admin` to:

- Create, edit, and delete blog posts
- Use the advanced code editor with syntax highlighting
- Preview posts before publishing
- Manage content without touching code

Default admin credentials can be set up using the password hash generator:

```bash
node scripts/generate-password-hash.js
```

## Code Quality

This project uses automated code quality tools:

- **Husky** - Git hooks for pre-commit checks
- **Lint-Staged** - Run linters on staged files
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Knip** - Find unused code and dependencies

Pre-commit hooks will automatically:

- Format your code
- Run ESLint with auto-fix
- Ensure code quality before commits

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on [Sleek Portfolio](https://github.com/ramxcodes/sleek-portfolio) by ramxcodes
- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ by Satyam**

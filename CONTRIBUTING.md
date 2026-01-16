# Contributing to Portfolio

Thank you for considering contributing to this portfolio project!

## Development Setup

1. Clone the repository

   ```bash
   git clone https://github.com/satyamsingh5512/portfolio.git
   cd portfolio
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Copy environment variables

   ```bash
   cp .env.example .env.local
   ```

4. Run development server
   ```bash
   npm run dev
   ```

## Code Style

- Use TypeScript for all new code
- Follow existing naming conventions (PascalCase for components, camelCase for functions)
- Run `npm run lint` before committing
- Format code with `npm run format`
- Use Prettier and ESLint configurations provided

## Project Structure

```
portfolio/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── config/        # Configuration files
│   ├── data/          # MDX content (blog, projects)
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   └── types/         # TypeScript types
├── public/            # Static assets
└── scripts/           # Utility scripts
```

## Naming Conventions

### Files and Directories

- **PascalCase** for React components: `BlogCard.tsx`
- **camelCase** for utilities: `formatDate.ts`
- **kebab-case** for MDX content: `my-blog-post.mdx`

### Components

- Component files should use PascalCase
- Each component should have its own file
- Group related components in directories

## Commit Messages

Use conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:

```bash
git commit -m "feat: add smooth scroll with Lenis"
git commit -m "fix: resolve mobile navigation issue"
```

## Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests and linting: `npm run lint && npm run build`
5. Commit your changes with conventional commits
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create a Pull Request with a clear description

## Testing

- Run linting: `npm run lint`
- Build project: `npm run build`
- Test Telegram integration: `npm run test-telegram`
- Check for unused code: `npm run knip`

## Adding Content

### Blog Posts

1. Create MDX file in `src/data/blog/`
2. Use kebab-case for filename: `my-post.mdx`
3. Include required frontmatter:
   ```mdx
   ---
   title: "My Blog Post"
   description: "A brief description"
   date: "2024-03-20"
   tags: ["nextjs", "react"]
   ---
   ```

### Projects

1. Create MDX file in `src/data/projects/`
2. Add project thumbnail in `public/project/`
3. Include required frontmatter

## Questions?

If you have questions:

1. Check existing issues
2. Create a new issue with the `question` label
3. Reach out via email

Thank you for contributing! 🎉

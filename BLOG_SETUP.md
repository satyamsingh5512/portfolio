# Blog Platform Setup Guide

Your blog platform is now ready! Here's everything you need to know to start posting.

## 🚀 Quick Start

1. **Server is running**: Your development server is running at http://localhost:3000
2. **Admin login**: Go to http://localhost:3000/admin/login
3. **Login credentials**:
   - Email: `admin@example.com`
   - Password: `admin123`

## 📝 How to Use the Blog Admin

### Accessing the Admin Panel
1. Navigate to `/admin/login`
2. Use the credentials above to log in
3. You'll be redirected to the admin dashboard at `/admin`

### Creating a New Blog Post
1. From the admin dashboard, click "New Post"
2. Fill in the required fields:
   - **Title**: Your blog post title
   - **Description**: Brief summary for SEO and previews
   - **Content**: Write in MDX format (Markdown with React components)
   - **Cover Image**: Upload or paste image URL
   - **Tags**: Add relevant tags for categorization
   - **Author Info**: Your details and social links

3. Use the toggles to:
   - **Published**: Make the post live on your blog
   - **Featured**: Highlight the post on your homepage

4. Click "Create Post" to save

### Managing Existing Posts
- **View**: Click the eye icon to see the live post
- **Edit**: Click the pencil icon to modify
- **Delete**: Click the trash icon to remove (with confirmation)

## 🎨 Writing Content

Your blog supports **MDX**, which means you can use:

### Markdown Basics
```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point 1
- Bullet point 2

1. Numbered list
2. Another item

[Link text](https://example.com)

![Image alt text](image-url.jpg)
```

### Code Blocks
```javascript
function hello() {
  console.log("Hello, world!");
}
```

### Advanced Features
- Syntax highlighting for code blocks
- Automatic reading time calculation
- SEO optimization with meta images
- Tag-based filtering
- Author information with social links

## 🔧 Configuration

### Environment Variables
Your `.env.local` file contains:
- `ADMIN_EMAIL`: Your admin login email
- `ADMIN_PASSWORD_HASH`: Encrypted password
- `NEXTAUTH_SECRET`: Session encryption key
- `NEXTAUTH_URL`: Your site URL

### Changing Admin Password
1. Run: `node scripts/generate-password-hash.js "your-new-password"`
2. Copy the generated hash to `ADMIN_PASSWORD_HASH` in `.env.local`
3. Restart the development server

### Adding More Admins
Currently supports one admin. To add more users, you'd need to:
1. Set up a database (PostgreSQL, MySQL, etc.)
2. Modify the auth configuration in `src/lib/auth.ts`
3. Create user management pages

## 📁 File Structure

```
src/
├── app/
│   ├── admin/           # Admin panel pages
│   ├── blog/            # Public blog pages
│   └── api/             # API routes for CRUD operations
├── components/
│   ├── admin/           # Admin-specific components
│   └── blog/            # Blog display components
├── data/
│   └── blog/            # Your blog posts (.mdx files)
├── lib/
│   ├── auth.ts          # Authentication logic
│   ├── blog.ts          # Blog reading functions
│   └── blog-api.ts      # Blog CRUD operations
└── types/
    ├── auth.ts          # Authentication types
    └── blog.ts          # Blog data types
```

## 🌐 Going Live

When you're ready to deploy:

1. **Update environment variables** for production
2. **Set up a database** for user management (optional)
3. **Configure image storage** (AWS S3, Cloudinary, etc.)
4. **Set up your domain** and update `NEXTAUTH_URL`

## 🎯 Features Available

✅ **Authentication**: Secure admin login with NextAuth.js
✅ **Rich Editor**: Full-featured blog post editor
✅ **Image Upload**: Direct image upload with validation
✅ **MDX Support**: Markdown with React components
✅ **Tag System**: Organize posts with tags
✅ **Publishing Control**: Draft/published status
✅ **SEO Optimization**: Meta tags, OG images, structured data
✅ **Responsive Design**: Works on all devices
✅ **Dark Mode**: Theme switching support

## 🆘 Troubleshooting

### Can't log in?
- Check that the server is running
- Verify credentials in `.env.local`
- Clear browser cookies and try again

### Images not uploading?
- Check file size (max 5MB)
- Ensure file type is supported (JPEG, PNG, GIF, WebP)
- Verify the `public/blog` directory exists

### Posts not showing?
- Make sure the post is marked as "Published"
- Check that the `.mdx` file is in `src/data/blog/`
- Verify the frontmatter format is correct

---

**Happy blogging!** 🎉

Your blog platform is ready to use. Start creating amazing content!
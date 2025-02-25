# Andrii Furmanets - Personal Website

A modern, responsive personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. This website showcases my skills, experience, and projects as a Senior Full-Stack Developer specializing in React, TypeScript, Next.js, and Ruby on Rails.

![Website Preview](public/og-image.svg)

## 🚀 Live Demo

Visit the live website at [andriifurmanets.com](https://andriifurmanets.com)

## ✨ Features

- **Responsive Design**: Optimized for all device sizes from mobile to desktop
- **Dark/Light Mode**: Theme toggle with system preference detection
- **Modern UI**: Clean, professional design with smooth animations
- **SEO Optimized**: Comprehensive metadata, structured data, and OpenGraph images
- **Mobile-First Navigation**: Hamburger menu for mobile with smooth transitions
- **Interactive Sections**: About, Experience, Skills, Education, and Contact
- **Contact Form**: Email integration for direct communication
- **Optimized Performance**: Fast loading times and efficient rendering

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) and [React Icons](https://react-icons.github.io/react-icons/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://github.com/colinhacks/zod)
- **Email Integration**: [EmailJS](https://www.emailjs.com/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **SEO**: Next.js Metadata API, next-sitemap

## 📂 Project Structure

```
personal-website/
├── public/               # Static assets
│   ├── icons/            # Technology icons
│   ├── logos/            # Logo files
│   └── og-image.svg      # OpenGraph image
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout with metadata
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── sections/     # Page sections (Hero, About, etc.)
│   │   └── ui/           # Reusable UI components
│   └── lib/              # Utility functions and hooks
├── tailwind.config.js    # Tailwind configuration
├── next.config.js        # Next.js configuration
└── package.json          # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/afurm/personal-website.git
   cd personal-website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=your_user_id
```

### Contact Form

The contact form uses EmailJS for sending emails. You'll need to:

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create a service and email template
3. Update the environment variables with your credentials

### Favicon Setup

The website includes comprehensive favicon support for various devices and browsers. To properly set up the favicon:

1. Generate favicon files using the SVG templates in the `public` directory:
   - `favicon.svg` - Vector version of the favicon
   - `favicon-large.svg` - Larger vector version for generating different sizes

2. You'll need to create the following files (you can use an online favicon generator like [RealFaviconGenerator](https://realfavicongenerator.net/)):
   - `favicon.ico` - Multi-size ICO file (16x16, 32x32, 48x48)
   - `favicon-16x16.png` - 16x16 PNG favicon
   - `favicon-32x32.png` - 32x32 PNG favicon
   - `apple-touch-icon.png` - 180x180 PNG for iOS devices
   - `android-chrome-192x192.png` - 192x192 PNG for Android devices
   - `android-chrome-512x512.png` - 512x512 PNG for Android devices

3. The `site.webmanifest` file is already configured to reference these icons for PWA support.

## 📱 Mobile Optimization

The website is fully responsive with special considerations for mobile users:

- Hamburger menu for navigation
- Vertically stacked buttons in the hero section
- Optimized tech stack display
- Custom theme toggle in mobile menu

## 🔍 SEO Optimization

This website implements several SEO best practices:

- Comprehensive metadata in `layout.tsx`
- OpenGraph and Twitter card images
- Structured data with Schema.org markup
- Automatically generated sitemap and robots.txt
- Proper heading hierarchy
- Semantic HTML structure

## 🚢 Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

This will create an optimized production build and generate the sitemap.

### Deployment Platforms

The site can be easily deployed to:

- [Vercel](https://vercel.com/) (recommended for Next.js)
- [Netlify](https://www.netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)

## 🧩 Customization

### Changing Content

Most content is stored in the component files under `src/components/sections/`. Update these files to change the information displayed on the website.

### Styling

The website uses Tailwind CSS for styling. Customize the design by modifying:

- `tailwind.config.js` for theme colors and extensions
- Component-level classes for specific styling

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Andrii Furmanets** - Senior Full-Stack Developer

- [GitHub](https://github.com/afurm)
- [LinkedIn](https://linkedin.com/in/andrii-furmanets-1a5b6452/)
- [Website](https://andriifurmanets.com)

---

Built with ❤️ using Next.js and React

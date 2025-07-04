# Quentin Renaud - Portfolio

A modern, interactive portfolio website showcasing work in growth, code, and design. Built with Next.js (App Router), React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Interactive Chladni Background** - Dynamic visual patterns that respond to section changes
- **Smooth Animations** - Powered by Framer Motion for engaging user experience
- **Responsive Design** - Optimized for desktop and mobile devices
- **Touch Gestures** - Swipe navigation on mobile devices
- **Modern UI** - Clean, minimalist design with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with custom CSS variables)
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/qr3naud/portfolio.git
   cd portfolio
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) in your browser.

## 🏗️ Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx         # Root layout, imports global styles
│   └── page.tsx           # Main page component
├── components/            # Reusable UI components
│   ├── ChladniBackground.tsx
│   ├── Section.tsx
│   ├── RotatingText.tsx
│   └── ui/                # shadcn/ui components
├── styles/
│   └── globals.css        # Global styles (Tailwind + custom CSS)
├── tailwind.config.js     # Tailwind CSS configuration
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── postcss.config.js      # PostCSS configuration
├── Attributions.md        # Third-party attributions
├── LICENSE                # MIT License
└── README.md              # This file
```

## 📝 Notes & Troubleshooting

- **Uses the new Next.js App Router (`app/` directory).**
- **Tailwind CSS** is configured to use custom CSS variables for colors. If you add new color variables, also add them to `tailwind.config.js` under `extend.colors`.
- If you see errors about missing Tailwind classes (e.g., `border-border`), make sure the color is defined in the config.
- If you see errors about `@layer base` or missing Tailwind directives, ensure `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;` are at the top of `globals.css`.

## 🎨 Design Philosophy

This portfolio emphasizes:
- **Simplicity** - Clean, uncluttered design
- **Interactivity** - Engaging animations and transitions
- **Performance** - Optimized for fast loading
- **Accessibility** - Inclusive design principles

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📧 Contact

- Email: reno.quentin@gmail.com
- Portfolio: [Your deployed URL here]

---

Built with ❤️ by Quentin Renaud 
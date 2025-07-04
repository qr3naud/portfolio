import '../styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Quentin Renaud - Portfolio',
  description: 'Personal portfolio website built with React, Next.js, and Tailwind CSS.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

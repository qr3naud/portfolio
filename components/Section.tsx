'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className = '', id }: SectionProps) {
  return (
    <motion.section
      id={id}
      className={`min-w-full h-screen flex-shrink-0 flex items-center justify-center px-4 sm:px-8 py-12 sm:py-16 ${className}`}
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-20%' }}
    >
      <div className="max-w-5xl mx-auto text-center w-full">
        {children}
      </div>
    </motion.section>
  );
}
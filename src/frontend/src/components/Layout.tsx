import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A0A0A] via-[#141414] to-[#1A1A2E]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#8B0000]/10 via-transparent to-transparent pointer-events-none" />
      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}

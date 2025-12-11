import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/providers/query-client-provider';
import { Toaster } from 'sonner';
import Modals from '@/components/modals';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TeenUp LMS - Learning Management System',
  description: 'Hệ thống quản lý học sinh - TeenUp',
};

export default async function RootLayout({ children }: Readonly<IChildren>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Toaster />
          <Modals />
          {children}
        </Providers>
      </body>
    </html>
  );
}

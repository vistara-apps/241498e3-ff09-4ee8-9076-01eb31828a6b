import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeProvider } from './components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PlantPal AI - Your Plant\'s Personal Assistant',
  description: 'SMS service where houseplants text users personalized care reminders with personality',
  keywords: ['plants', 'AI', 'SMS', 'care', 'reminders', 'houseplants'],
  authors: [{ name: 'PlantPal AI Team' }],
  openGraph: {
    title: 'PlantPal AI',
    description: 'Your houseplant\'s personal AI assistant, sending texts with personality',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { DataProvider } from '@/lib/DataContext';

export const metadata: Metadata = {
  title: 'SEO Task Tracker',
  description: 'Ứng dụng theo dõi công việc SEO hàng ngày, kế hoạch, báo cáo và thứ hạng từ khoá.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="flex h-full flex-col overflow-hidden" suppressHydrationWarning>
        <DataProvider>
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 w-full">
            {children}
          </main>
        </DataProvider>
      </body>
    </html>
  );
}

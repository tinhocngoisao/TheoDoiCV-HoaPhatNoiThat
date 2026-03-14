'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, CheckSquare, LineChart, BarChart3 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Tổng quan', href: '/', icon: LayoutDashboard },
  { name: 'Kế hoạch', href: '/plans', icon: CalendarDays },
  { name: 'Công việc', href: '/tasks', icon: CheckSquare },
  { name: 'Thứ hạng', href: '/keywords', icon: LineChart },
  { name: 'Báo cáo', href: '/reports', icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-slate-200 shrink-0">
      <div className="flex h-16 items-center px-6 w-full">
        <div className="flex items-center gap-2 mr-8">
          <LineChart className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-bold text-indigo-600">
            SEO Tracker
          </span>
        </div>
        <nav className="flex flex-1 space-x-2 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-2 h-4 w-4',
                    isActive ? 'text-indigo-700' : 'text-slate-400'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
            S
          </div>
          <div className="text-sm font-medium text-slate-700 hidden sm:block">SEO Manager</div>
        </div>
      </div>
    </header>
  );
}

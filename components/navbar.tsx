'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, CheckSquare, LineChart, BarChart3, LogOut, Users } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useData } from '@/lib/DataContext';
import Image from 'next/image';
import { useState } from 'react';

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
  const { user, logout, workspaces, currentWorkspaceId, setCurrentWorkspaceId, sharedWith, addSharedEmail, removeSharedEmail } = useData();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail && !sharedWith.includes(newEmail)) {
      await addSharedEmail(newEmail);
      setNewEmail('');
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 shrink-0">
        {/* Desktop Layout */}
        <div className="hidden md:flex h-16 items-center px-6 w-full">
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
          {user && (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
              {workspaces.length > 1 && (
                <select 
                  value={currentWorkspaceId}
                  onChange={(e) => setCurrentWorkspaceId(e.target.value)}
                  className="text-sm border-slate-300 rounded-md py-1 pl-2 pr-8 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {workspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>
                      {ws.id === user.uid ? 'Cá nhân' : `Team: ${ws.email}`}
                    </option>
                  ))}
                </select>
              )}
              
              {currentWorkspaceId === user?.uid && (
                <button 
                  onClick={() => setIsTeamModalOpen(true)}
                  className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" 
                  title="Quản lý Team"
                >
                  <Users className="w-5 h-5" />
                </button>
              )}

              {user.photoURL ? (
                <Image src={user.photoURL} alt={user.displayName || 'User'} width={32} height={32} className="rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                  {user.email?.[0].toUpperCase() || 'U'}
                </div>
              )}
              <div className="text-sm font-medium text-slate-700">{user.displayName || user.email}</div>
              <button onClick={logout} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Đăng xuất">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col md:hidden w-full">
          <div className="flex h-14 items-center justify-between px-4 w-full border-b border-slate-100">
            <div className="flex items-center gap-2">
              <LineChart className="h-6 w-6 text-indigo-600" />
              <span className="text-lg font-bold text-indigo-600">SEO Tracker</span>
            </div>
            {user && (
              <div className="flex items-center gap-2">
                {workspaces.length > 1 && (
                  <select 
                    value={currentWorkspaceId}
                    onChange={(e) => setCurrentWorkspaceId(e.target.value)}
                    className="text-xs border-slate-300 rounded-md py-1 pl-2 pr-6 focus:ring-indigo-500 focus:border-indigo-500 max-w-[100px]"
                  >
                    {workspaces.map(ws => (
                      <option key={ws.id} value={ws.id}>
                        {ws.id === user.uid ? 'Cá nhân' : ws.email.split('@')[0]}
                      </option>
                    ))}
                  </select>
                )}
                
                {currentWorkspaceId === user?.uid && (
                  <button 
                    onClick={() => setIsTeamModalOpen(true)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors" 
                  >
                    <Users className="w-5 h-5" />
                  </button>
                )}

                {user.photoURL ? (
                  <Image src={user.photoURL} alt={user.displayName || 'User'} width={28} height={28} className="rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                )}
                <button onClick={logout} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors" title="Đăng xuất">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <nav className="flex overflow-x-auto px-2 py-2 space-x-1 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-lg px-2 py-2 text-[10px] sm:text-xs font-medium transition-colors flex-1 min-w-[64px]',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mb-1 h-5 w-5',
                      isActive ? 'text-indigo-700' : 'text-slate-400'
                    )}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Team Settings Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Quản lý Team</h2>
              <button onClick={() => setIsTeamModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="text-xl">&times;</span>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-4">
                Thêm email của thành viên để họ có thể xem và chỉnh sửa dữ liệu SEO của bạn.
              </p>
              
              <form onSubmit={handleAddEmail} className="flex gap-2 mb-4">
                <input 
                  type="email" 
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="Nhập email thành viên..."
                  className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                <button 
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Thêm
                </button>
              </form>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-900">Thành viên hiện tại:</h3>
                {sharedWith.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">Chưa có thành viên nào.</p>
                ) : (
                  <ul className="divide-y divide-slate-100 border border-slate-200 rounded-md">
                    {sharedWith.map(email => (
                      <li key={email} className="flex items-center justify-between p-3 text-sm">
                        <span className="text-slate-700">{email}</span>
                        <button 
                          onClick={() => removeSharedEmail(email)}
                          className="text-red-500 hover:text-red-700 font-medium text-xs"
                        >
                          Xoá
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

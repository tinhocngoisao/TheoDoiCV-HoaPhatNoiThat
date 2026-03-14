'use client';

import { useState } from 'react';
import { mockTasks, TaskType, TaskStatus } from '@/lib/data';
import { CheckCircle2, Clock, Filter, Plus, Search } from 'lucide-react';

export default function TasksPage() {
  const [filterType, setFilterType] = useState<TaskType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = mockTasks.filter(task => {
    if (filterType !== 'all' && task.type !== filterType) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý công việc</h1>
          <p className="text-sm text-slate-500">Theo dõi và cập nhật trạng thái công việc SEO hàng ngày.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <Plus className="h-5 w-5" />
          Thêm công việc
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Tìm kiếm công việc..."
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as TaskType | 'all')}
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="all">Tất cả loại</option>
                <option value="audit">Audit Website</option>
                <option value="content">Nội dung</option>
                <option value="backlink">Backlink</option>
                <option value="social">Social Entity</option>
              </select>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="todo">Chưa làm</option>
              <option value="in-progress">Đang làm</option>
              <option value="done">Hoàn thành</option>
            </select>
          </div>
        </div>
        <ul role="list" className="divide-y divide-slate-200">
          {filteredTasks.map((task) => (
            <li key={task.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {task.status === 'done' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : task.status === 'in-progress' ? (
                    <Clock className="h-5 w-5 text-amber-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Hạn chót: {task.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    task.type === 'audit' ? 'bg-blue-100 text-blue-800' :
                    task.type === 'content' ? 'bg-purple-100 text-purple-800' :
                    task.type === 'backlink' ? 'bg-orange-100 text-orange-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {task.type === 'audit' ? 'Audit Website' :
                     task.type === 'content' ? 'Nội dung' :
                     task.type === 'backlink' ? 'Backlink' :
                     task.type === 'social' ? 'Social Entity' : 'Khác'}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    task.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
                    task.status === 'in-progress' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {task.status === 'done' ? 'Hoàn thành' :
                     task.status === 'in-progress' ? 'Đang làm' : 'Chưa làm'}
                  </span>
                </div>
              </div>
            </li>
          ))}
          {filteredTasks.length === 0 && (
            <li className="px-6 py-8 text-center text-slate-500">
              Không tìm thấy công việc nào phù hợp với bộ lọc.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

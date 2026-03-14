'use client';

import { useState } from 'react';
import { TaskType, TaskStatus } from '@/lib/data';
import { useData } from '@/lib/DataContext';
import { CheckCircle2, Clock, Filter, Plus, Search, X } from 'lucide-react';

export default function TasksPage() {
  const { tasks, addTask } = useData();
  const [filterType, setFilterType] = useState<TaskType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState<TaskType>('audit');
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const filteredTasks = tasks.filter(task => {
    if (filterType !== 'all' && task.type !== filterType) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    return true;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title: newTaskTitle,
      type: newTaskType,
      status: newTaskStatus,
      date: new Date().toISOString().split('T')[0],
      dueDate: newTaskDueDate || new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(false);
    setNewTaskTitle('');
    setNewTaskType('audit');
    setNewTaskStatus('todo');
    setNewTaskDueDate('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý công việc</h1>
          <p className="text-sm text-slate-500">Theo dõi và cập nhật trạng thái công việc SEO hàng ngày.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus className="h-5 w-5" />
          Thêm công việc
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Thêm công việc mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên công việc</label>
                <input 
                  required
                  type="text" 
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  placeholder="Nhập tên công việc..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loại công việc</label>
                <select 
                  value={newTaskType}
                  onChange={e => setNewTaskType(e.target.value as TaskType)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  <option value="audit">Audit Website</option>
                  <option value="content">Nội dung</option>
                  <option value="backlink">Backlink</option>
                  <option value="social">Social Entity</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                <select 
                  value={newTaskStatus}
                  onChange={e => setNewTaskStatus(e.target.value as TaskStatus)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  <option value="todo">Chưa làm</option>
                  <option value="in-progress">Đang làm</option>
                  <option value="done">Hoàn thành</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hạn chót</label>
                <input 
                  required
                  type="date" 
                  value={newTaskDueDate}
                  onChange={e => setNewTaskDueDate(e.target.value)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                >
                  Huỷ
                </button>
                <button 
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Lưu công việc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

'use client';

import { useState } from 'react';
import { TaskType, TaskStatus, Task } from '@/lib/data';
import { useData } from '@/lib/DataContext';
import { CheckCircle2, Clock, Filter, Plus, Search, X, Edit, Trash2, Calendar } from 'lucide-react';

export default function TasksPage() {
  const { tasks, plans, addTask, updateTask, deleteTask } = useData();
  const [filterType, setFilterType] = useState<TaskType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState<TaskType>('audit');
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskMonth, setNewTaskMonth] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // Extract unique months from plans
  const availableMonths = Array.from(new Set(plans.map(p => p.month))) as string[];

  const filteredTasks = tasks.filter(task => {
    if (filterType !== 'all' && task.type !== filterType) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterMonth !== 'all' && task.month !== filterMonth) return false;
    return true;
  });

  const openAddModal = () => {
    setModalMode('add');
    setNewTaskTitle('');
    setNewTaskType('audit');
    setNewTaskStatus('todo');
    setNewTaskDueDate('');
    setNewTaskMonth('');
    setNewTaskDescription('');
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const openViewModal = (task: Task) => {
    setModalMode('view');
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setModalMode('edit');
    setSelectedTask(task);
    setNewTaskTitle(task.title);
    setNewTaskType(task.type);
    setNewTaskStatus(task.status);
    setNewTaskDueDate(task.dueDate);
    setNewTaskMonth(task.month || '');
    setNewTaskDescription(task.description || '');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xoá công việc này?')) {
      deleteTask(id);
      setIsModalOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addTask({
        title: newTaskTitle,
        type: newTaskType,
        status: newTaskStatus,
        date: new Date().toISOString().split('T')[0],
        dueDate: newTaskDueDate || new Date().toISOString().split('T')[0],
        month: newTaskMonth,
        description: newTaskDescription,
      });
    } else if (modalMode === 'edit' && selectedTask) {
      updateTask(selectedTask.id, {
        title: newTaskTitle,
        type: newTaskType,
        status: newTaskStatus,
        dueDate: newTaskDueDate,
        month: newTaskMonth,
        description: newTaskDescription,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Quản lý công việc</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi và cập nhật trạng thái công việc SEO hàng ngày.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-md bg-indigo-600 px-3 py-2 sm:px-4 sm:py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 shrink-0 whitespace-nowrap"
        >
          <Plus className="h-4 w-4 sm:h-5 w-5" />
          <span className="hidden sm:inline">Thêm công việc</span>
          <span className="sm:hidden">Thêm</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {modalMode === 'add' ? 'Thêm công việc mới' : modalMode === 'edit' ? 'Sửa công việc' : 'Chi tiết công việc'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {modalMode === 'view' && selectedTask ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Tên công việc</p>
                  <p className="mt-1 text-base text-slate-900">{selectedTask.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Loại công việc</p>
                    <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedTask.type === 'audit' ? 'bg-blue-100 text-blue-800' :
                      selectedTask.type === 'content' ? 'bg-purple-100 text-purple-800' :
                      selectedTask.type === 'backlink' ? 'bg-orange-100 text-orange-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {selectedTask.type === 'audit' ? 'Audit Website' :
                       selectedTask.type === 'content' ? 'Nội dung' :
                       selectedTask.type === 'backlink' ? 'Backlink' :
                       selectedTask.type === 'social' ? 'Social Entity' : 'Khác'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Trạng thái</p>
                    <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedTask.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
                      selectedTask.status === 'in-progress' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {selectedTask.status === 'done' ? 'Hoàn thành' :
                       selectedTask.status === 'in-progress' ? 'Đang làm' : 'Chưa làm'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Hạn chót</p>
                    <p className="mt-1 text-sm text-slate-900">{selectedTask.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Tháng</p>
                    <p className="mt-1 text-sm text-slate-900">{selectedTask.month || 'Không có'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Mô tả chi tiết</p>
                  <p className="mt-1 text-sm text-slate-900 whitespace-pre-wrap">{selectedTask.description || 'Không có mô tả'}</p>
                </div>
                
                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => handleDelete(selectedTask.id)}
                    className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Xoá
                  </button>
                  <button 
                    type="button" 
                    onClick={() => openEditModal(selectedTask)}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <Edit className="h-4 w-4" />
                    Sửa
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="grid grid-cols-2 gap-4">
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
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tháng (Tuỳ chọn)</label>
                    <select 
                      value={newTaskMonth}
                      onChange={e => setNewTaskMonth(e.target.value)}
                      className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    >
                      <option value="">Không có</option>
                      {plans.map(plan => (
                        <option key={plan.id} value={plan.month}>{plan.month}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả chi tiết</label>
                  <textarea 
                    value={newTaskDescription}
                    onChange={e => setNewTaskDescription(e.target.value)}
                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    placeholder="Nhập mô tả chi tiết..."
                    rows={3}
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
                    {modalMode === 'add' ? 'Lưu công việc' : 'Cập nhật'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="rounded-xl bg-white shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 px-4 py-4 sm:px-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-50">
          <div className="relative w-full xl:max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-9 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
              placeholder="Tìm kiếm công việc..."
            />
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2 col-span-1">
              <Calendar className="h-4 w-4 text-slate-500 hidden sm:block" />
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 pl-2 sm:pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 text-xs sm:text-sm sm:leading-6"
              >
                <option value="all">Tất cả tháng</option>
                {availableMonths.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 col-span-1">
              <Filter className="h-4 w-4 text-slate-500 hidden sm:block" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as TaskType | 'all')}
                className="block w-full rounded-md border-0 py-1.5 pl-2 sm:pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 text-xs sm:text-sm sm:leading-6"
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
              className="block w-full col-span-2 sm:w-auto rounded-md border-0 py-1.5 pl-2 sm:pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 text-xs sm:text-sm sm:leading-6"
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
            <li key={task.id} className="p-4 sm:px-6 sm:py-4 hover:bg-slate-50 transition-colors group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' });
                    }}
                    className="focus:outline-none shrink-0 mt-0.5 sm:mt-0"
                    title="Đánh dấu hoàn thành"
                  >
                    {task.status === 'done' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 hover:text-slate-400 transition-colors" />
                    ) : task.status === 'in-progress' ? (
                      <Clock className="h-5 w-5 text-amber-500 hover:text-emerald-500 transition-colors" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-300 hover:border-emerald-500 transition-colors" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p 
                      onClick={() => openViewModal(task)}
                      className={`text-sm font-medium cursor-pointer group-hover:text-indigo-600 transition-colors truncate ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-900'}`}
                    >
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      <p className="text-xs text-slate-500">Hạn chót: {task.dueDate} {task.month ? `(${task.month})` : ''}</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEditModal(task); }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-8 sm:pl-0">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium ${
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
                  <select
                    value={task.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateTask(task.id, { status: e.target.value as TaskStatus });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`text-[10px] sm:text-xs font-medium rounded-full px-2 py-0.5 border-0 cursor-pointer focus:ring-0 ${
                      task.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
                      task.status === 'in-progress' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <option value="todo" className="bg-white text-slate-900">Chưa làm</option>
                    <option value="in-progress" className="bg-white text-slate-900">Đang làm</option>
                    <option value="done" className="bg-white text-slate-900">Hoàn thành</option>
                  </select>
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

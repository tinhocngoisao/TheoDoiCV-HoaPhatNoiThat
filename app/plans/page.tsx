'use client';

import { useState } from 'react';
import { useData } from '@/lib/DataContext';
import { Calendar, ChevronRight, Plus, X } from 'lucide-react';

export default function PlansPage() {
  const { plans, addPlan } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newMonth, setNewMonth] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    addPlan({
      month: newMonth,
      title: newTitle,
      description: newDescription,
    });
    setIsModalOpen(false);
    setNewMonth('');
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kế hoạch công việc</h1>
          <p className="text-sm text-slate-500">Quản lý kế hoạch SEO tổng thể 12 tháng và chi tiết từng tháng.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus className="h-5 w-5" />
          Thêm kế hoạch
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Thêm kế hoạch mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddPlan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tháng</label>
                <input 
                  required
                  type="text" 
                  value={newMonth}
                  onChange={e => setNewMonth(e.target.value)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  placeholder="Ví dụ: Tháng 6/2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề</label>
                <input 
                  required
                  type="text" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  placeholder="Nhập tiêu đề kế hoạch..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả chi tiết</label>
                <textarea 
                  required
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
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
                  Lưu kế hoạch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Kế hoạch tổng thể năm 2026
          </h2>
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            Đang thực hiện
          </span>
        </div>
        <ul role="list" className="divide-y divide-slate-200">
          {plans.map((plan) => (
            <li key={plan.id} className="p-6 hover:bg-slate-50 transition-colors group cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600">{plan.month}</p>
                    <p className="text-sm text-slate-500">{plan.progress}% hoàn thành</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{plan.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <div className="mt-4 w-full bg-slate-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${plan.progress === 100 ? 'bg-emerald-500' : plan.progress > 0 ? 'bg-indigo-600' : 'bg-slate-300'}`} 
                      style={{ width: `${plan.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

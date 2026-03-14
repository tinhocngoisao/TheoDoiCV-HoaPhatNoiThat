'use client';

import { useState } from 'react';
import { useData } from '@/lib/DataContext';
import { Calendar, ChevronRight, Plus, X, Edit, Trash2 } from 'lucide-react';
import { MonthlyPlan } from '@/lib/data';

export default function PlansPage() {
  const { plans, addPlan, updatePlan, deletePlan } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedPlan, setSelectedPlan] = useState<MonthlyPlan | null>(null);
  
  const [newMonth, setNewMonth] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const openAddModal = () => {
    setModalMode('add');
    setNewMonth('');
    setNewTitle('');
    setNewDescription('');
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const openViewModal = (plan: MonthlyPlan) => {
    setModalMode('view');
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const openEditModal = (plan: MonthlyPlan) => {
    setModalMode('edit');
    setSelectedPlan(plan);
    setNewMonth(plan.month);
    setNewTitle(plan.title);
    setNewDescription(plan.description);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xoá kế hoạch này?')) {
      deletePlan(id);
      setIsModalOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addPlan({
        month: newMonth,
        title: newTitle,
        description: newDescription,
      });
    } else if (modalMode === 'edit' && selectedPlan) {
      updatePlan(selectedPlan.id, {
        month: newMonth,
        title: newTitle,
        description: newDescription,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kế hoạch công việc</h1>
          <p className="text-sm text-slate-500">Quản lý kế hoạch SEO tổng thể 12 tháng và chi tiết từng tháng.</p>
        </div>
        <button 
          onClick={openAddModal}
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
              <h2 className="text-lg font-semibold text-slate-900">
                {modalMode === 'add' ? 'Thêm kế hoạch mới' : modalMode === 'edit' ? 'Sửa kế hoạch' : 'Chi tiết kế hoạch'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {modalMode === 'view' && selectedPlan ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Tháng</p>
                  <p className="mt-1 text-base text-slate-900">{selectedPlan.month}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Tiêu đề</p>
                  <p className="mt-1 text-base text-slate-900">{selectedPlan.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Mô tả chi tiết</p>
                  <p className="mt-1 text-base text-slate-900 whitespace-pre-wrap">{selectedPlan.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Tiến độ</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${selectedPlan.progress === 100 ? 'bg-emerald-500' : selectedPlan.progress > 0 ? 'bg-indigo-600' : 'bg-slate-300'}`} 
                        style={{ width: `${selectedPlan.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{selectedPlan.progress}%</span>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => handleDelete(selectedPlan.id)}
                    className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Xoá
                  </button>
                  <button 
                    type="button" 
                    onClick={() => openEditModal(selectedPlan)}
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
                    {modalMode === 'add' ? 'Lưu kế hoạch' : 'Cập nhật'}
                  </button>
                </div>
              </form>
            )}
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
            <li key={plan.id} onClick={() => openViewModal(plan)} className="p-6 hover:bg-slate-50 transition-colors group cursor-pointer">
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

'use client';

import { useState } from 'react';
import { KeywordRanking, last30Days } from '@/lib/data';
import { useData } from '@/lib/DataContext';
import { ArrowUpRight, ArrowDownRight, Search, Plus, X, Edit, Trash2, RefreshCw } from 'lucide-react';

export default function KeywordsPage() {
  const { keywords, addKeyword, updateKeyword, deleteKeyword, checkKeywordRank } = useData();
  const [viewRange, setViewRange] = useState<'week' | 'month'>('week');
  const displayDates = viewRange === 'week' ? last30Days.slice(-7) : last30Days;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordRanking | null>(null);
  const [checkingIds, setCheckingIds] = useState<string[]>([]);
  
  const [newKeyword, setNewKeyword] = useState('');
  const [newVolume, setNewVolume] = useState('');

  const openAddModal = () => {
    setModalMode('add');
    setNewKeyword('');
    setNewVolume('');
    setSelectedKeyword(null);
    setIsModalOpen(true);
  };

  const openEditModal = (kw: KeywordRanking) => {
    setModalMode('edit');
    setNewKeyword(kw.keyword);
    setNewVolume(kw.volume.toString());
    setSelectedKeyword(kw);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xoá từ khoá này?')) {
      deleteKeyword(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addKeyword({
        keyword: newKeyword,
        url: '',
        volume: parseInt(newVolume) || 0,
      });
    } else if (modalMode === 'edit' && selectedKeyword) {
      updateKeyword(selectedKeyword.id, {
        keyword: newKeyword,
        volume: parseInt(newVolume) || 0,
      });
    }
    setIsModalOpen(false);
  };

  const handleCheckRank = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (checkingIds.includes(id)) return;
    
    setCheckingIds(prev => [...prev, id]);
    await checkKeywordRank(id);
    setCheckingIds(prev => prev.filter(checkId => checkId !== id));
  };

  const handleCheckAll = async () => {
    const idsToCheck = keywords.filter(k => !checkingIds.includes(k.id)).map(k => k.id);
    if (idsToCheck.length === 0) return;
    
    setCheckingIds(prev => [...prev, ...idsToCheck]);
    // Check concurrently
    await Promise.all(idsToCheck.map(id => checkKeywordRank(id)));
    setCheckingIds(prev => prev.filter(checkId => !idsToCheck.includes(checkId)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thứ hạng từ khoá</h1>
          <p className="text-sm text-slate-500">Theo dõi biến động thứ hạng từ khoá SEO trên nhiều ngày.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCheckAll}
            disabled={checkingIds.length > 0}
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${checkingIds.length > 0 ? 'animate-spin' : ''}`} />
            Check tất cả
          </button>
          <button 
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="h-5 w-5" />
            Thêm từ khoá
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {modalMode === 'add' ? 'Thêm từ khoá mới' : 'Sửa từ khoá'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Từ khoá</label>
                <input 
                  required
                  type="text" 
                  value={newKeyword}
                  onChange={e => setNewKeyword(e.target.value)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  placeholder="Nhập từ khoá..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Volume (Lượt tìm kiếm)</label>
                <input 
                  required
                  type="number" 
                  value={newVolume}
                  onChange={e => setNewVolume(e.target.value)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  placeholder="Ví dụ: 1000"
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
                  {modalMode === 'add' ? 'Lưu từ khoá' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-white shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Tìm kiếm từ khoá..."
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewRange('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewRange === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setViewRange('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewRange === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              30 ngày qua
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="sticky left-0 z-10 bg-slate-50 py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-slate-900 border-r border-slate-200 shadow-[1px_0_0_0_#e2e8f0]">Từ khoá</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 whitespace-nowrap">Volume</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 whitespace-nowrap">Hạng HT</th>
                {displayDates.map(d => (
                  <th key={d} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-slate-900 whitespace-nowrap">
                    {d.split('-')[2]}/{d.split('-')[1]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {keywords.map((kw) => {
                return (
                  <tr key={kw.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 py-4 pl-6 pr-3 text-sm font-medium text-slate-900 border-r border-slate-200 shadow-[1px_0_0_0_#e2e8f0]">
                      <div className="flex flex-col">
                        <span>{kw.keyword}</span>
                        <span className="text-xs text-slate-500 font-normal truncate max-w-[200px]">{kw.url}</span>
                        <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => handleCheckRank(kw.id, e)}
                            disabled={checkingIds.includes(kw.id)}
                            className="text-xs text-emerald-600 hover:text-emerald-800 font-medium disabled:opacity-50 flex items-center gap-1"
                          >
                            <RefreshCw className={`h-3 w-3 ${checkingIds.includes(kw.id) ? 'animate-spin' : ''}`} />
                            {checkingIds.includes(kw.id) ? 'Đang check...' : 'Check hạng'}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); openEditModal(kw); }}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Sửa
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(kw.id); }}
                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                          >
                            Xoá
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{kw.volume.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-indigo-600">
                      {kw.currentRank === 0 ? '>100' : kw.currentRank}
                    </td>
                    {displayDates.map((d, index) => {
                      const rankObj = kw.history.find(h => h.date === d);
                      const rank = rankObj ? (rankObj.rank === 0 ? '>100' : rankObj.rank) : '-';
                      
                      let changeIcon = null;
                      if (index > 0 && rankObj && rankObj.rank !== 0) {
                        const prevRankObj = kw.history.find(h => h.date === displayDates[index - 1]);
                        if (prevRankObj && typeof prevRankObj.rank === 'number' && prevRankObj.rank !== 0) {
                          const diff = prevRankObj.rank - rankObj.rank;
                          if (diff > 0) changeIcon = <ArrowUpRight className="h-3 w-3 text-emerald-500 inline" />;
                          else if (diff < 0) changeIcon = <ArrowDownRight className="h-3 w-3 text-red-500 inline" />;
                        }
                      }

                      return (
                        <td key={d} className="whitespace-nowrap px-3 py-4 text-center text-sm text-slate-600">
                          <div className="flex items-center justify-center gap-1">
                            <span>{rank}</span>
                            {changeIcon}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

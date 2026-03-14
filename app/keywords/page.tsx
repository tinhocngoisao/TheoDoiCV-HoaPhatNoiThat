'use client';

import { useState } from 'react';
import { last30Days } from '@/lib/data';
import { useData } from '@/lib/DataContext';
import { ArrowUpRight, ArrowDownRight, Search, Plus, X } from 'lucide-react';

export default function KeywordsPage() {
  const { keywords, addKeyword } = useData();
  const [viewRange, setViewRange] = useState<'week' | 'month'>('week');
  const displayDates = viewRange === 'week' ? last30Days.slice(-7) : last30Days;
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newKeyword, setNewKeyword] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newVolume, setNewVolume] = useState('');

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    addKeyword({
      keyword: newKeyword,
      url: newUrl,
      volume: parseInt(newVolume) || 0,
    });
    setIsModalOpen(false);
    setNewKeyword('');
    setNewUrl('');
    setNewVolume('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thứ hạng từ khoá</h1>
          <p className="text-sm text-slate-500">Theo dõi biến động thứ hạng từ khoá SEO trên nhiều ngày.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus className="h-5 w-5" />
          Thêm từ khoá
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Thêm từ khoá mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddKeyword} className="space-y-4">
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
                <label className="block text-sm font-medium text-slate-700 mb-1">URL Đích</label>
                <input 
                  required
                  type="text" 
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  placeholder="/duong-dan-bai-viet"
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
                  Lưu từ khoá
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
                  <tr key={kw.id} className="hover:bg-slate-50 transition-colors">
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 py-4 pl-6 pr-3 text-sm font-medium text-slate-900 border-r border-slate-200 shadow-[1px_0_0_0_#e2e8f0]">
                      <div className="flex flex-col">
                        <span>{kw.keyword}</span>
                        <span className="text-xs text-slate-500 font-normal truncate max-w-[200px]">{kw.url}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{kw.volume.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-indigo-600">{kw.currentRank}</td>
                    {displayDates.map((d, index) => {
                      const rankObj = kw.history.find(h => h.date === d);
                      const rank = rankObj?.rank || '-';
                      
                      let changeIcon = null;
                      if (index > 0 && typeof rank === 'number') {
                        const prevRankObj = kw.history.find(h => h.date === displayDates[index - 1]);
                        if (prevRankObj && typeof prevRankObj.rank === 'number') {
                          const diff = prevRankObj.rank - rank;
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

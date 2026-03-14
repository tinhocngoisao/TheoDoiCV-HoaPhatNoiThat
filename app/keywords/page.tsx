'use client';

import { useState } from 'react';
import { mockKeywords, last30Days } from '@/lib/data';
import { ArrowUpRight, ArrowDownRight, Search, Plus } from 'lucide-react';

export default function KeywordsPage() {
  const [viewRange, setViewRange] = useState<'week' | 'month'>('week');
  const displayDates = viewRange === 'week' ? last30Days.slice(-7) : last30Days;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thứ hạng từ khoá</h1>
          <p className="text-sm text-slate-500">Theo dõi biến động thứ hạng từ khoá SEO trên nhiều ngày.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <Plus className="h-5 w-5" />
          Thêm từ khoá
        </button>
      </div>

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
              {mockKeywords.map((kw) => {
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
                      if (index > 0 && rank !== '-') {
                        const prevRankObj = kw.history.find(h => h.date === displayDates[index - 1]);
                        if (prevRankObj && prevRankObj.rank !== '-') {
                          const diff = prevRankObj.rank - (rank as number);
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

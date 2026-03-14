'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { mockKeywords, completionData, mockTasks, last30Days } from '@/lib/data';
import Link from 'next/link';

export default function Dashboard() {
  const stats = [
    { name: 'Công việc hoàn thành', value: '85%', change: '+12%', changeType: 'positive', icon: CheckCircle2 },
    { name: 'Từ khoá tăng hạng', value: '24', change: '+4', changeType: 'positive', icon: ArrowUpRight },
    { name: 'Từ khoá giảm hạng', value: '3', change: '-2', changeType: 'negative', icon: ArrowDownRight },
    { name: 'Công việc quá hạn', value: '2', change: '+1', changeType: 'negative', icon: AlertCircle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan SEO</h1>
        <p className="text-sm text-slate-500">Theo dõi tiến độ công việc và thứ hạng từ khoá hôm nay.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm border border-slate-200 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-indigo-50 p-3">
                <stat.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="truncate text-sm font-medium text-slate-500">{stat.name}</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.change}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Tiến độ công việc (Tháng này)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="Hoàn thành" stackId="a" fill="#4f46e5" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Chưa hoàn thành" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-slate-900">Biến động thứ hạng (7 ngày)</h2>
            <Link href="/keywords" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Xem chi tiết &rarr;</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-slate-500 pb-2 pr-4">Từ khoá</th>
                  {last30Days.slice(-7).map(d => (
                    <th key={d} className="text-center text-xs font-medium text-slate-500 pb-2 px-2">
                      {d.split('-')[2]}/{d.split('-')[1]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockKeywords.slice(0, 5).map(kw => (
                  <tr key={kw.id}>
                    <td className="py-2 pr-4 text-sm font-medium text-slate-900 truncate max-w-[120px]">{kw.keyword}</td>
                    {last30Days.slice(-7).map(d => {
                      const rank = kw.history.find(h => h.date === d)?.rank || '-';
                      return <td key={d} className="py-2 px-2 text-center text-sm text-slate-600">{rank}</td>
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-medium text-slate-900">Công việc hôm nay</h2>
        </div>
        <ul role="list" className="divide-y divide-slate-200">
          {mockTasks.slice(0, 4).map((task) => (
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
                  <p className={`text-sm font-medium ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                    {task.title}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    task.type === 'audit' ? 'bg-blue-100 text-blue-800' :
                    task.type === 'content' ? 'bg-purple-100 text-purple-800' :
                    task.type === 'backlink' ? 'bg-orange-100 text-orange-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {task.type}
                  </span>
                  <span className="text-sm text-slate-500">{task.dueDate}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

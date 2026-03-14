'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, FileText } from 'lucide-react';
import { completionData } from '@/lib/data';

const taskTypeData = [
  { name: 'Audit Website', value: 15 },
  { name: 'Nội dung', value: 45 },
  { name: 'Backlink', value: 25 },
  { name: 'Social Entity', value: 15 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#10b981'];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Báo cáo SEO</h1>
          <p className="text-sm text-slate-500">Xem báo cáo chi tiết theo tháng và xuất dữ liệu.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-2 shadow-sm">
            <Calendar className="h-4 w-4 text-slate-500" />
            <select className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer">
              <option>Tháng 3/2026</option>
              <option>Tháng 2/2026</option>
              <option>Tháng 1/2026</option>
            </select>
          </div>
          <button className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Xuất PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm border border-slate-200 sm:p-6">
          <dt className="truncate text-sm font-medium text-slate-500">Tổng công việc</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">124</dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm border border-slate-200 sm:p-6">
          <dt className="truncate text-sm font-medium text-slate-500">Tỷ lệ hoàn thành</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-emerald-600">82%</dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm border border-slate-200 sm:p-6">
          <dt className="truncate text-sm font-medium text-slate-500">Từ khoá Top 10</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-indigo-600">45</dd>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Tỷ lệ hoàn thành theo tuần</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="Hoàn thành" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Chưa hoàn thành" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Phân bổ loại công việc</h2>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-medium text-slate-900">Báo cáo đã xuất</h2>
        </div>
        <ul role="list" className="divide-y divide-slate-200">
          {[
            { name: 'Báo cáo SEO Tháng 2/2026', date: '01/03/2026', size: '2.4 MB' },
            { name: 'Báo cáo SEO Tháng 1/2026', date: '01/02/2026', size: '2.1 MB' },
            { name: 'Báo cáo Tổng kết Năm 2025', date: '05/01/2026', size: '5.8 MB' },
          ].map((report, idx) => (
            <li key={idx} className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{report.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Xuất ngày {report.date} • {report.size}</p>
                </div>
              </div>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Tải xuống
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

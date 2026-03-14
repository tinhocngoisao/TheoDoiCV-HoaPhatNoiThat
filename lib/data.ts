export type TaskType = 'audit' | 'content' | 'backlink' | 'social' | 'other';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  date: string;
  dueDate: string;
  month?: string;
  description?: string;
}

export interface KeywordRanking {
  id: string;
  keyword: string;
  url: string;
  history: { date: string; rank: number }[];
  currentRank: number;
  previousRank: number;
}

export interface MonthlyPlan {
  id: string;
  month: string;
  title: string;
  description: string;
  progress: number;
}

export const mockTasks: Task[] = [
  { id: '1', title: 'Audit technical SEO trang chủ', type: 'audit', status: 'done', date: '2026-03-10', dueDate: '2026-03-11', month: 'Tháng 3/2026', description: 'Kiểm tra tốc độ, thẻ meta, sitemap.' },
  { id: '2', title: 'Viết bài "Hướng dẫn SEO 2026"', type: 'content', status: 'in-progress', date: '2026-03-11', dueDate: '2026-03-13', month: 'Tháng 3/2026', description: 'Bài viết dài 2000 từ, chuẩn SEO.' },
  { id: '3', title: 'Đi link forum công nghệ', type: 'backlink', status: 'todo', date: '2026-03-12', dueDate: '2026-03-14', month: 'Tháng 3/2026', description: 'Tìm 5 forum uy tín để đặt link.' },
  { id: '4', title: 'Đăng bài fanpage Facebook', type: 'social', status: 'done', date: '2026-03-12', dueDate: '2026-03-12', month: 'Tháng 3/2026', description: 'Chia sẻ bài viết mới nhất lên fanpage.' },
  { id: '5', title: 'Tối ưu tốc độ tải trang', type: 'audit', status: 'todo', date: '2026-03-13', dueDate: '2026-03-15', month: 'Tháng 3/2026', description: 'Nén ảnh, minify CSS/JS.' },
  { id: '6', title: 'Cập nhật nội dung bài cũ', type: 'content', status: 'todo', date: '2026-03-14', dueDate: '2026-03-16', month: 'Tháng 3/2026', description: 'Cập nhật thông tin cho bài viết năm ngoái.' },
];

export const last30Days = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return d.toISOString().split('T')[0];
});

const generateHistory = (baseRank: number, seed: number) => {
  return last30Days.map((date, index) => {
    const variation = Math.floor(Math.sin(index * seed) * 3);
    return { date, rank: Math.max(1, baseRank + variation) };
  });
};

const kwData = [
  { id: '1', keyword: 'dịch vụ seo', url: '/dich-vu-seo', baseRank: 4, seed: 0.5 },
  { id: '2', keyword: 'đào tạo seo', url: '/dao-tao-seo', baseRank: 2, seed: 0.8 },
  { id: '3', keyword: 'công ty seo', url: '/cong-ty-seo', baseRank: 11, seed: 0.3 },
  { id: '4', keyword: 'báo giá seo', url: '/bao-gia-seo', baseRank: 9, seed: 0.6 },
  { id: '5', keyword: 'seo tổng thể', url: '/seo-tong-the', baseRank: 5, seed: 0.4 }
];

export const mockKeywords: KeywordRanking[] = kwData.map(kw => {
  const history = generateHistory(kw.baseRank, kw.seed);
  return {
    id: kw.id,
    keyword: kw.keyword,
    url: kw.url,
    history,
    currentRank: history[history.length - 1].rank,
    previousRank: history[history.length - 2].rank,
  };
});

export const mockPlans: MonthlyPlan[] = [
  { id: '1', month: 'Tháng 1/2026', title: 'Audit toàn diện & Lập kế hoạch', description: 'Kiểm tra lỗi kỹ thuật, nghiên cứu từ khoá cho cả năm.', progress: 100 },
  { id: '2', month: 'Tháng 2/2026', title: 'Tối ưu On-page & Content mới', description: 'Tối ưu 50 bài cũ, viết 20 bài mới.', progress: 100 },
  { id: '3', month: 'Tháng 3/2026', title: 'Xây dựng Backlink & Social', description: 'Triển khai 50 backlink chất lượng, chăm sóc 5 kênh social.', progress: 45 },
  { id: '4', month: 'Tháng 4/2026', title: 'Đẩy mạnh Entity & Local SEO', description: 'Xác minh Google Business, tạo 100 profile.', progress: 0 },
  { id: '5', month: 'Tháng 5/2026', title: 'Tối ưu chuyển đổi (CRO)', description: 'Cải thiện UI/UX, A/B testing các nút CTA.', progress: 0 },
];

export const completionData = [
  { name: 'Tuần 1', 'Hoàn thành': 85, 'Chưa hoàn thành': 15 },
  { name: 'Tuần 2', 'Hoàn thành': 90, 'Chưa hoàn thành': 10 },
  { name: 'Tuần 3', 'Hoàn thành': 60, 'Chưa hoàn thành': 40 },
  { name: 'Tuần 4', 'Hoàn thành': 0, 'Chưa hoàn thành': 100 },
];

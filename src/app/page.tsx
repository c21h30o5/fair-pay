import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-10 text-center animate-fade-in-up">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-blue-600">
          Fair Pay ⚖️
        </h1>
        <p className="text-sm text-slate-500">
          หารค่ากิจกรรมกีฬาตามจริง แฟร์ๆ ทุกนาที
        </p>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in-up">
        <h2 className="text-lg font-bold text-slate-700 mb-4 text-center">
          เลือกประเภทกีฬาเพื่อเริ่มคำนวณ
        </h2>

        <div className="grid grid-cols-1 gap-3">
          <Link
            href="/badminton"
            className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏸</span>
              <span className="font-semibold text-blue-900 text-base">แบดมินตัน</span>
            </div>
            <span className="text-blue-500 group-hover:translate-x-1 transition-transform">➡️</span>
          </Link>

          <div className="flex items-center justify-between p-4 bg-slate-100 border border-slate-200 rounded-xl opacity-60 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚽</span>
              <span className="font-semibold text-slate-500 text-base">ฟุตบอล (Coming Soon)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

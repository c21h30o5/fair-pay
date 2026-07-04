'use client'; // บอก Next.js ว่าไฟล์นี้มีการใช้ปุ่ม/Event ของฝั่ง User

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* ส่วนหัวข้อแอป */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight mb-2">
          Fair Pay ⚖️
        </h1>
        <p className="text-slate-500 text-sm">
          หารค่ากิจกรรมกีฬาตามจริง แฟร์ๆ ทุกนาที
        </p>
      </div>

      {/* โซนเลือกประเภทกีฬา */}
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-700 mb-4 text-center">
          เลือกประเภทกีฬาเพื่อเริ่มคำนวณ
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {/* ปุ่มเลือกแบดมินตัน */}
          <Link 
            href="/badminton" 
            className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition duration-200 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏸</span>
              <span className="font-semibold text-blue-900 text-base">แบดมินตัน</span>
            </div>
            <span className="text-blue-500 group-hover:translate-x-1 transition-transform">➡️</span>
          </Link>

          {/* ปุ่มกีฬาอื่นๆ ในอนาคต (ทึบไว้ก่อน) */}
          <div className="flex items-center justify-between p-4 bg-slate-100 border border-slate-200 rounded-xl opacity-60 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚽</span>
              <span className="font-semibold text-slate-500 text-base">ฟุตบอล (Coming Soon)</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
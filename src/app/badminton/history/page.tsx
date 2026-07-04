"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BadmintonHistory, PlayerHistorySummary } from "../types";

export default function BadmintonHistoryPage() {
  const [historyList, setHistoryList] = useState<BadmintonHistory[]>([]);

  useEffect(() => {
    // 🔥 ดึงคีย์เฉพาะของแบดมินตัน
    const savedHistory = localStorage.getItem("fairpay_history_badminton");
    if (savedHistory) {
      try {
        const parsedData = JSON.parse(savedHistory);
        
        // 🚀 ครอบด้วย setTimeout เพื่อผลักไปรันในคิวถัดไป แก้อาการเตือนเรื่อง Cascading Renders
        setTimeout(() => {
          setHistoryList(parsedData);
        }, 0);
        
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const clearHistory = () => {
    if (
      confirm("⚠️ คุณต้องการลบประวัติการแชร์บิลแบดมินตันทั้งหมดใช่หรือไม่?")
    ) {
      // 🔥 ลบเฉพาะคีย์ของแบดมินตันเท่านั้น
      localStorage.removeItem("fairpay_history_badminton");
      setHistoryList([]);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* หัวหน้าจอ */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Link
              href="/badminton"
              className="text-slate-400 hover:text-slate-600"
            >
              ⬅️ หน้าแรก
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">
              📜 ประวัติแชร์บิล
            </h1>
          </div>
          {historyList.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs font-semibold text-rose-500 hover:text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg transition"
            >
              🗑️ ล้างประวัติ
            </button>
          )}
        </div>

        {/* รายการประวัติย้อนหลัง */}
        <div className="space-y-4">
          {historyList.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 shadow-sm"
            >
              <div className="flex justify-between items-start border-b border-slate-200/50 pb-2 mb-2.5">
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    {item.date}
                  </div>
                  <div className="text-xs text-slate-400">
                    🏟️ ยอดเฉพาะค่ากลาง: {item.totalCentral.toLocaleString()}.-
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    สุทธิ: {item.grandTotal.toLocaleString()}.-
                  </span>
                </div>
              </div>

              {/* 🔁 ปรับปรุงโซนรายชื่อย่อยของแต่ละคนในไฟล์ history/page.tsx */}

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600">
                {/* 🔥 เปลี่ยนจาก p: any เป็น Type ที่ถูกต้องแบบนี้ครับ */}
                {item.players.map(
                  (p: PlayerHistorySummary & { playedHours?: number }, idx) => (
                    <div key={idx} className="flex justify-between py-0.5">
                      <span className="text-slate-500">
                        👤 {p.name}{" "}
                        {p.playedHours !== undefined
                          ? `(${p.playedHours})`
                          : ""}
                      </span>
                      <span className="font-semibold text-slate-700">
                        {p.totalToPay.toLocaleString()} บาท
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}

          {historyList.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-3xl mb-2">📁</p>
              <p className="text-sm">ยังไม่มีประวัติการบันทึกบิลในเครื่องนี้</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

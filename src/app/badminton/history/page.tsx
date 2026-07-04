"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { calculateBadmintonBill } from "@/lib/badmintonBill";
import { BadmintonHistory } from "@/types/badminton";

export default function BadmintonHistoryPage() {
  const [historyList, setHistoryList] = useState<BadmintonHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("/badminton/api/fetch");
        const result: { data?: BadmintonHistory[]; error?: string } =
          await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch history");
        }

        setHistoryList(result.data || []);
      } catch (error) {
        console.error("Failed to fetch history", error);
        setErrorMessage("โหลดประวัติไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/badminton" className="text-slate-500 hover:text-slate-800">
            กลับหน้าแรก
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">ประวัติบิลแบดมินตัน</h1>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400">
            กำลังโหลดข้อมูล...
          </div>
        ) : errorMessage ? (
          <div className="text-center py-10 text-red-500 bg-white rounded-xl shadow-sm border">
            {errorMessage}
          </div>
        ) : historyList.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-white rounded-xl shadow-sm border">
            ยังไม่มีประวัติการบันทึก
          </div>
        ) : (
          <div className="space-y-4">
            {historyList.map((item) => {
              const summary =
                item.bill_data.summary || calculateBadmintonBill(item.bill_data);
              const playerNames = item.bill_data.players
                .map((player) => player.name)
                .join(", ");

              return (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-300 transition"
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        วันที่: {new Date(item.created_at).toLocaleString("th-TH")}
                      </p>
                      <p className="text-lg font-bold text-slate-800">
                        ยอดรวม: {summary.grandTotal.toLocaleString()} บาท
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        ผู้เล่น {item.bill_data.players.length} คน
                        {playerNames ? `: ${playerNames}` : ""}
                      </p>
                    </div>
                    <Link
                      href={`/badminton/bill/${item.id}`}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition whitespace-nowrap"
                    >
                      ดูบิล
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500 italic">
                    กลุ่ม ID: {item.id.slice(0, 8)}...
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

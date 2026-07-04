"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// 🔥 บรรทัดที่เพิ่มเข้ามา: ดึง Type จากส่วนกลางมาใช้งานแทน
import { Player, Court } from "../types";

/*interface Player {
  id: string;
  name: string;
  hours: number;
}

interface Court {
  id: string;
  hours: number;
}*/

export default function BadmintonReviewPage() {
  const router = useRouter();

  // --- State สำหรับรับค่าที่ดึงมาจาก localStorage ---
  const [players, setPlayers] = useState<Player[]>([]);
  const [courtRate, setCourtRate] = useState<number>(0);
  const [courts, setCourts] = useState<Court[]>([]);
  const [shuttleCount, setShuttleCount] = useState<number>(0);
  const [shuttlePrice, setShuttlePrice] = useState<number>(0);

  // 🔥 State ใหม่สำหรับหน้าสรุป: ค่าน้ำรายบุคคล (เก็บเป็นคู่ [playerId]: จำนวนเงิน)
  const [drinks, setDrinks] = useState<{ [key: string]: number }>({});

  // 1. ดึงข้อมูลจาก localStorage ตอนโหลดหน้าเว็บ
  useEffect(() => {
    const savedData = localStorage.getItem("fairpay_badminton_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setPlayers(parsed.players || []);
        setCourtRate(parsed.courtRate || 0);
        setCourts(parsed.courts || []);
        setShuttleCount(parsed.shuttleCount || 0);
        setShuttlePrice(parsed.shuttlePrice || 0);
      } catch (error) {
        console.error("Error parsing data", error);
      }
    }
  }, []);

  // 2. ฟังก์ชันอัปเดตค่าน้ำของแต่ละคน
  const handleDrinkChange = (playerId: string, amount: number) => {
    setDrinks({
      ...drinks,
      [playerId]: Math.max(0, amount), // ดักไม่ให้ใส่ค่าน้ำติดลบ
    });
  };

  // 3. ฟังก์ชันคำนวณยอดรวมค่าใช้จ่ายส่วนกลางทั้งหมด (ค่าคอร์ททั้งหมด + ค่าลูกแบดทั้งหมด)
  const totalCourtHours = courts.reduce((sum, court) => sum + court.hours, 0);
  const totalCourtCost = totalCourtHours * courtRate;
  const totalShuttleCost = shuttleCount * shuttlePrice;
  const totalCentralCost = totalCourtCost + totalShuttleCost;

  // 4. ฟังก์ชันเมื่อกดถัดไปเพื่อดูบิลฉบับสมบูรณ์
  // 🔁 แก้ไขฟังก์ชัน handleNext ในหน้า review/page.tsx ให้วิ่งมาหน้าสุดท้ายจริง
  const handleNext = () => {
    const finalData = {
      players,
      courtRate,
      courts,
      shuttleCount,
      shuttlePrice,
      drinks,
    };
    localStorage.setItem("fairpay_badminton_data", JSON.stringify(finalData));

    // สั่งวิ่งไปหน้า bill สรุปยอดสุดท้ายจริง
    router.push("/badminton/bill");
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* ส่วนหัว */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/badminton"
            className="text-slate-400 hover:text-slate-600"
          >
            ⬅️ แก้ไขฟอร์ม
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">
            📊 ทบทวนยอด & ค่าน้ำ
          </h1>
        </div>

        {/* บัตรสรุปค่าใช้จ่ายส่วนกลาง */}
        <div className="bg-blue-600 rounded-xl p-4 text-white mb-6 shadow-md shadow-blue-100">
          <h2 className="text-xs uppercase tracking-wider text-blue-200 font-bold mb-1">
            ค่าใช้จ่ายส่วนกลางรวม
          </h2>
          <div className="text-3xl font-black mb-3">
            {totalCentralCost.toLocaleString()}{" "}
            <span className="text-sm font-normal">บาท</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-100 border-t border-blue-500/50 pt-2">
            <div>
              🏟️ ค่าคอร์ท ({totalCourtHours} ชม.): {totalCourtCost}.-
            </div>
            <div>
              🏸 ค่าลูกแบด ({shuttleCount} ลูก): {totalShuttleCost}.-
            </div>
          </div>
        </div>

        {/* ส่วนรายชื่อสมาชิกสำหรับกรอกค่าน้ำ */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
            <span>🥤</span> ใส่ค่าน้ำดื่ม/ของกินส่วนบุคคล (ถ้ามี)
          </h3>

          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-sm"
              >
                <div>
                  <div className="font-semibold text-slate-700">
                    {player.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    ลงเวลาตีไว้: {player.hours} ชม.
                  </div>
                </div>

                {/* ช่องกรอกค่าน้ำของคนนี้ */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="0"
                    value={drinks[player.id] || ""}
                    onChange={(e) =>
                      handleDrinkChange(
                        player.id,
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="w-24 px-3 py-1.5 border rounded-lg text-right font-bold text-slate-700 focus:outline-blue-500 text-sm"
                    min="0"
                  />
                  <span className="text-xs font-medium text-slate-500">
                    บาท
                  </span>
                </div>
              </div>
            ))}

            {players.length === 0 && (
              <p className="text-sm text-center text-slate-400 py-4">
                ไม่พบข้อมูลผู้เล่น กรุณาย้อนกลับไปกรอกในหน้าแรก
              </p>
            )}
          </div>
        </div>

        {/* ปุ่มไปต่อหน้าสุดท้าย */}
        <button
          onClick={handleNext}
          disabled={players.length === 0}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold transition shadow-md shadow-blue-200"
        >
          สรุปบิลเก็บเงินเพื่อน 🧾
        </button>
      </div>
    </main>
  );
}

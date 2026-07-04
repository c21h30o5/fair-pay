'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Player, Court, BillRow } from '../types';
import { BadmintonHistory } from '../types';

/*interface Player {
  id: string;
  name: string;
  hours: number;
}

interface Court {
  id: string;
  hours: number;

// 🆕 ปรับปรุงโครงสร้างข้อมูล: แยกค่าคอร์ทและค่าลูกแบดออกจากกันชัดเจน
interface BillRow {
  id: string;
  name: string;
  playedHours: number;
  courtShare: number;   // 🏟️ สัดส่วนค่าคอร์ทที่ต้องจ่าย (X)
  shuttleShare: number; // 🏸 สัดส่วนค่าลูกแบดที่ต้องจ่าย (Y)
  personalDrink: number; // 🥤 ค่าน้ำส่วนตัว
  totalToPay: number;    // 💵 ยอดรวมสุทธิที่คนนี้ต้องจ่าย
}*/

export default function BadmintonBillPage() {
  const [billRows, setBillRows] = useState<BillRow[]>([]);
  const [totalCourt, setTotalCourt] = useState<number>(0);
  const [totalShuttle, setTotalShuttle] = useState<number>(0);
  const [totalCentral, setTotalCentral] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  useEffect(() => {
    const savedData = localStorage.getItem('fairpay_badminton_data');
    if (!savedData) return;

    try {
      const parsed = JSON.parse(savedData);
      const players: Player[] = parsed.players || [];
      const courtRate: number = parsed.courtRate || 0;
      const courts: Court[] = parsed.courts || [];
      const shuttleCount: number = parsed.shuttleCount || 0;
      const shuttlePrice: number = parsed.shuttlePrice || 0;
      const drinks: { [key: string]: number } = parsed.drinks || {};

      // 1. คำนวณยอดส่วนกลางรวมแบบแยกประเภท
      const totalCourtHours = courts.reduce((sum, court) => sum + court.hours, 0);
      const courtCostSum = totalCourtHours * courtRate;
      const shuttleCostSum = shuttleCount * shuttlePrice;
      const centralCostSum = courtCostSum + shuttleCostSum;

      setTotalCourt(courtCostSum);
      setTotalShuttle(shuttleCostSum);
      setTotalCentral(centralCostSum);

      // 2. หาผลรวมชั่วโมงบินทั้งหมดของทุกคนเพื่อนำไปใช้หารเฉลี่ยสัดส่วน
      const totalPlayersHours = players.reduce((sum, p) => sum + p.hours, 0);

      // 3. วนลูปคำนวณแยกค่าใช้จ่ายตามสัดส่วนจริงของแต่ละคน
      let calculatedGrandTotal = 0;
      const rows: BillRow[] = players.map((player) => {
        const personalDrink = drinks[player.id] || 0;

        // 🔥 แยกสูตรคำนวณ: (ชั่วโมงเล่นของตัวเอง / ชั่วโมงเล่นรวมทุกคน) * ยอดรวมของแต่ละประเภท
        const courtShare = totalPlayersHours > 0 
          ? (player.hours / totalPlayersHours) * courtCostSum 
          : 0;

        const shuttleShare = totalPlayersHours > 0 
          ? (player.hours / totalPlayersHours) * shuttleCostSum 
          : 0;

        const totalToPay = courtShare + shuttleShare + personalDrink;
        calculatedGrandTotal += totalToPay;

        return {
          id: player.id,
          name: player.name,
          playedHours: player.hours,
          courtShare: Math.round(courtShare * 100) / 100,     // ปัดเศษ 2 ตำแหน่ง (ค่า X)
          shuttleShare: Math.round(shuttleShare * 100) / 100, // ปัดเศษ 2 ตำแหน่ง (ค่า Y)
          personalDrink,
          totalToPay: Math.round(totalToPay * 100) / 100
        };
      });

      setBillRows(rows);
      setGrandTotal(Math.round(calculatedGrandTotal * 100) / 100);

    } catch (error) {
      console.error("Failed to calculate bills", error);
    }
  }, []);

  // 📝 🆕 ปรับฟังก์ชันสร้างข้อความบิลกลุ่มไลน์ให้แจกแจงละเอียดชัดเจน
  const copyToClipboard = () => {
    let textOutput = `🧾 บิลสรุปค่าตีแบดมินตัน 🏸\n`;
    textOutput += `=======================\n`;
    textOutput += `💰 ยอดรวมก๊วน: ${totalCentral.toLocaleString()} บาท\n`;
    textOutput += `   • 🏟️ ค่าคอร์ททั้งหมด: ${totalCourt.toLocaleString()} บาท\n`;
    textOutput += `   • 🏸 ค่าลูกแบดทั้งหมด: ${totalShuttle.toLocaleString()} บาท\n\n`;
    
    billRows.forEach((row, index) => {
      textOutput += `${index + 1}. 🎉 *${row.name}*\n`;
      textOutput += `   • เวลาที่เล่น: ${row.playedHours} ชม.\n`;
      textOutput += `   • 🏟️ ค่าคอร์ท (X): ${row.courtShare.toLocaleString()} บาท\n`;
      textOutput += `   • 🏸 ค่าลูกแบด (Y): ${row.shuttleShare.toLocaleString()} บาท\n`;
      if (row.personalDrink > 0) {
        textOutput += `   • 🥤 ค่าน้ำส่วนตัว: ${row.personalDrink.toLocaleString()} บาท\n`;
      }
      textOutput += `   💵 ยอดรวมที่ต้องโอน: *${row.totalToPay.toLocaleString()}* บาท\n`;
      textOutput += `-----------------------\n`;
    });
    
    textOutput += `ยอดเงินรวมสุทธิทั้งบิล: ${grandTotal.toLocaleString()} บาท\n`;
    textOutput += `คำนวณแฟร์ๆ แยกคอร์ทแยกลูกด้วย FairPay ✨`;

    navigator.clipboard.writeText(textOutput);

    // 🔁 อัปเดตลอจิกภายในฟังก์ชัน copyToClipboard ในหน้า bill/page.tsx

    // 🔥 เปลี่ยนคีย์บันทึกให้ระบุประเภทกีฬาชัดเจน
    try {
      const existingHistoryRaw = localStorage.getItem('fairpay_history_badminton'); // 👈 เปลี่ยนตรงนี้
      const currentHistory: BadmintonHistory[] = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];

      const newHistoryItem: BadmintonHistory = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        totalCentral,
        grandTotal,
        players: billRows.map(row => ({ name: row.name, totalToPay: row.totalToPay }))
      };

      // เซฟกลับด้วยคีย์เฉพาะของแบดมินตัน
      localStorage.setItem('fairpay_history_badminton', JSON.stringify([newHistoryItem, ...currentHistory])); // 👈 เปลี่ยนตรงนี้

    } catch (error) {
      console.error("Failed to save history", error);
    }

    alert('📋 คัดลอกบิลและบันทึกประวัติลงในเครื่องเรียบร้อยแล้ว! สามารถนำไปวางลงในแชทเพื่อนได้เลยครับ');
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        
        {/* ส่วนหัว */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/badminton/review" className="text-slate-400 hover:text-slate-600">⬅️ ย้อนกลับ</Link>
          <h1 className="text-2xl font-bold text-slate-800">🧾 ใบเสร็จฉบับสมบูรณ์</h1>
        </div>

        {/* ยอดรวมทั้งหมด */}
        <div className="bg-slate-900 rounded-xl p-5 text-white mb-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3 text-xs text-slate-400">
            <span>รายละเอียดภาพรวมก๊วน</span>
            <span>จำนวนเงิน (บาท)</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-300 mb-1">
            <span>🏟️ ยอดค่าคอร์ททั้งหมด:</span>
            <span className="font-semibold">{totalCourt.toLocaleString()}.-</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-300 mb-3">
            <span>🏸 ยอดค่าลูกแบดทั้งหมด:</span>
            <span className="font-semibold">{totalShuttle.toLocaleString()}.-</span>
          </div>
          <div className="flex justify-between items-center text-xl font-black text-emerald-400 pt-3 border-t border-dashed border-slate-700">
            <span>💵 ยอดรวมสุทธิทั้งก๊วน:</span>
            <span>{grandTotal.toLocaleString()}.-</span>
          </div>
        </div>

        {/* ตารางแจกแจงรายคนแบบละเอียด */}
        <div className="space-y-4">
          <h2 className="font-bold text-slate-700 text-sm">รายคนแบบเจาะลึก (แยกสัดส่วนค่าใช้จ่าย)</h2>
          
          <div className="space-y-3">
            {billRows.map((row) => (
              <div key={row.id} className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="font-bold text-slate-800 text-base">👤 {row.name}</span>
                  <span className="text-sm font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    ต้องโอน: {row.totalToPay.toLocaleString()}.-
                  </span>
                </div>
                {/* 🆕 ปรับหน้าจอ UI ตรงนี้ให้โชว์แยกค่าคอร์ท X และค่าลูก Y ชัดๆ */}
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-slate-500 pt-1">
                  <div>⏰ เวลาที่เล่น: <b>{row.playedHours}</b> ชม.</div>
                  <div className="text-right">🥤 ค่าน้ำดื่ม: <b>{row.personalDrink.toLocaleString()}</b>.-</div>
                  <div className="border-t border-slate-50 pt-1">🏟️ ค่าคอร์ท (X): <b>{row.courtShare.toLocaleString()}</b>.-</div>
                  <div className="text-right border-t border-slate-50 pt-1">🏸 ค่าลูกแบด (Y): <b>{row.shuttleShare.toLocaleString()}</b>.-</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ปุ่มลัดเพื่อคัดลอกลงกลุ่มไลน์ */}
        <div className="mt-8 space-y-3">
          <button
            onClick={copyToClipboard}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
          >
            📋 คัดลอกบิลไปวางในกลุ่ม Line เพื่อนๆ
          </button>
          
          <Link 
            href="/badminton"
            className="block text-center w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-semibold transition text-sm"
          >
            🔄 เริ่มคำนวณรอบใหม่
          </Link>
        </div>

      </div>
    </main>
  );
}